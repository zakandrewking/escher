define(['utils'], function(utils) {
    // globals
    var RETURN_ARG = function(x) { return x; },
        ESCAPE_REG = /([.*+?^=!:${}()|\[\]\/\\])/g,
        EMPTY_LINES = /\n\s*\n/g,
        TRAILING_NEWLINE = /\n\s*(\)*)\s*$/,
        AND_OR = /([\(\) ])(?:and|or)([\)\( ])/ig,
        ALL_PARENS = /[\(\)]/g,
        // capture an expression surrounded by whitespace and a set of parentheses
        EXCESS_PARENS = /\(\s*(\S+)\s*\)/g,
        OR = /\s+or\s+/i,
        AND = /\s+and\s+/i,
        // find ORs
        OR_EXPRESSION = /(^|\()(\s*-?[0-9.]+\s+(?:or\s+-?[0-9.]+\s*)+)(\)|$)/ig,
        // find ANDS, respecting order of operations (and before or)
        AND_EXPRESSION = /(^|\(|or\s)(\s*-?[0-9.]+\s+(?:and\s+-?[0-9.]+\s*)+)(\sor|\)|$)/ig; 
    
    return { import_and_check: import_and_check,
             text_for_data: text_for_data,
             float_for_data: float_for_data,
             reverse_flux_for_data: reverse_flux_for_data,
             gene_string_for_data: gene_string_for_data,
             csv_converter: csv_converter,
             genes_for_gene_reaction_rule: genes_for_gene_reaction_rule,
             evaluate_gene_reaction_rule: evaluate_gene_reaction_rule,
             replace_gene_in_rule: replace_gene_in_rule,
             apply_reaction_data_to_reactions: apply_reaction_data_to_reactions,
             apply_metabolite_data_to_nodes: apply_metabolite_data_to_nodes,
             apply_gene_data_to_reactions: apply_gene_data_to_reactions
           };

    function import_and_check(data, name, all_reactions) {
        /** Convert imported data to a style that can be applied to reactions
         and nodes.

         Arguments
         ---------

         data: The data object.

         name: Either 'reaction_data', 'metabolite_data', or 'gene_data'

         all_reactions: Required for name == 'gene_data'. Must include all
         GPRs for the map and model.

         */
        
        // check arguments
        if (data===null)
            return null;
        if (['reaction_data', 'metabolite_data', 'gene_data'].indexOf(name) == -1)
            throw new Error('Invalid name argument: ' + name);  

        // make array
        if (!(data instanceof Array)) {
            data = [data];
        }
        // check data
        var check = function() {
            if (data===null)
                return null;
            if (data.length==1)
                return null;
            if (data.length==2)
                return null;
            return console.warn('Bad data style: ' + name);
        };
        check();
        data = utils.array_to_object(data);

        if (name == 'gene_data') {
            if (all_reactions === undefined)
                throw new Error('Must pass all_reactions argument for gene_data');
            data = align_gene_data_to_reactions(data, all_reactions);
        }
        
        return data;

        // definitions
        function align_gene_data_to_reactions(data, reactions) {
            var aligned = {},
                null_val = [null];
            // make an array of nulls as the default
            for (var gene_id in data) {
                null_val = data[gene_id].map(function() { return null; });
                break;
            }
            for (var reaction_id in reactions) {
                var reaction = reactions[reaction_id],
                    bigg_id = reaction.bigg_id,
                    this_gene_data = {}; 
                // save to aligned
                
                // get the genes if they aren't already there
                var g = reaction.genes,
                    genes;
                if (typeof g === 'undefined')
                    genes = genes_for_gene_reaction_rule(reaction.gene_reaction_rule);
                else
                    genes = g.map(function(x) { return x.bigg_id; });

                genes.forEach(function(gene_id) {
                    var d = data[gene_id];
                    if (typeof d === 'undefined')
                        d = null_val;
                    this_gene_data[gene_id] = d;
                });
                aligned[bigg_id] = this_gene_data;
            }
            return aligned;
        }
    }

    function float_for_data(d, styles, compare_style) {
        // all null
        if (d === null)
            return null;

        // absolute value
        var take_abs = (styles.indexOf('abs') != -1);
        
        if (d.length==1) { // 1 set
            // 1 null
            var f = _parse_float_or_null(d[0]);
            if (f === null)
                return null;
            return abs(f, take_abs);
        } else if (d.length==2) { // 2 sets            
            // 2 null
            var fs = d.map(_parse_float_or_null);
            if (fs[0] === null || fs[1] === null)
                return null;
            
            if (compare_style == 'diff') {
                return diff(fs[0], fs[1], take_abs);
            } else if (compare_style == 'fold') {
                return check_finite(fold(fs[0], fs[1], take_abs));
            }
            else if (compare_style == 'log2_fold') {
                return check_finite(log2_fold(fs[0], fs[1], take_abs));
            }
        } else {
            throw new Error('Data array must be of length 1 or 2');
        }
        throw new Error('Bad data compare_style: ' + compare_style);

        // definitions
        function check_finite(x) {
            return isFinite(x) ? x : null;
        }
        function abs(x, take_abs) {
            return take_abs ? Math.abs(x) : x;
        }
        function diff(x, y, take_abs) {
            if (take_abs) return Math.abs(y - x);
            else return y - x;
        }
        function fold(x, y, take_abs) {
            if (x == 0 || y == 0) return null;
            var fold = (y >= x ? y / x : - x / y);
            return take_abs ? Math.abs(fold) : fold;
        }
        function log2_fold(x, y, take_abs) {
            if (x == 0) return null;
            if (y / x < 0) return null;
            var log = Math.log(y / x) / Math.log(2);
            return take_abs ? Math.abs(log) : log;
        }
    }

    function reverse_flux_for_data(d) {
        if (d === null || d[0] === null)
            return false;
        return (d[0] < 0);
    }

    function gene_string_for_data(rule, gene_values, genes, styles,
                                  identifiers_on_map, compare_style) {
        /** Add gene values to the gene_reaction_rule string.
         
         Arguments
         ---------

         rule: (string) The gene reaction rule.

         gene_values: The values.

         genes: An array of objects specifying the gene bigg_id and name.

         styles: The reaction styles.

         identifiers_on_map: The type of identifiers ('bigg_id' or 'name').

         compare_style: The comparison style.

         Returns
         -------

         The new string with formatted data values.

         */

        var out = rule,
            no_data = (gene_values === null),
            // keep track of bigg_id's or names to remove repeats
            genes_found = {};

        
        genes.forEach(function(g_obj) {
            // get id or name
            var name = g_obj[identifiers_on_map];
            if (typeof name === 'undefined')
                throw new Error('Bad value for identifiers_on_map: ' + identifiers_on_map);
            // remove repeats that may have found their way into genes object
            if (typeof genes_found[name] !== 'undefined')
                return;
            genes_found[name] = true;   
            // generate the string
            if (no_data) {
                out = replace_gene_in_rule(out, g_obj.bigg_id, (name + '\n'));
            } else {
                var d = gene_values[g_obj.bigg_id];
                if (typeof d === 'undefined') d = null;
                var f = float_for_data(d, styles, compare_style),
                    format = (f === null ? RETURN_ARG : d3.format('.3g')); 
                if (d.length==1) {
                    out = replace_gene_in_rule(out, g_obj.bigg_id, (name + ' (' + null_or_d(d[0], format) + ')\n'));
                }
                else if (d.length==2) {
                    // check if they are all text
                    var new_str,
                        any_num = d.reduce(function(c, x) {
                            return c || _parse_float_or_null(x) !== null;
                        }, false);
                    if (any_num) {
                        new_str = (name + ' (' +
                                   null_or_d(d[0], format) + ', ' +
                                   null_or_d(d[1], format) + ': ' +
                                   null_or_d(f, format) +
                                   ')\n');
                    } else {
                        new_str = (name + ' (' +
                                   null_or_d(d[0], format) + ', ' +
                                   null_or_d(d[1], format) + ')\n');
                    } 
                    out = replace_gene_in_rule(out, g_obj.bigg_id, new_str);
                }
            }
        });
        // remove emtpy lines
        out = out.replace(EMPTY_LINES, '\n')
        // remove trailing newline (with or without parens)
            .replace(TRAILING_NEWLINE, '$1');
        return out;
        
        // definitions
        function null_or_d(d, format) {
            return d === null ? 'nd' : format(d);
        }
    }

    function text_for_data(d, f) {
        if (d === null)
            return null_or_d(null);
        if (d.length == 1) {
            var format = (f === null ? RETURN_ARG : d3.format('.3g'));
            return null_or_d(d[0], format);
        }
        if (d.length == 2) {
            var format = (f === null ? RETURN_ARG : d3.format('.3g')),
                t = null_or_d(d[0], format);
            t += ', ' + null_or_d(d[1], format);
            t += ': ' + null_or_d(f, format);
            return t;
        }
        return '';

        // definitions
        function null_or_d(d, format) {
            return d === null ? '(nd)' : format(d);
        }
    }

    function csv_converter(csv_rows) {
        /** Convert data from a csv file to json-style data.

         File must include a header row.

         */
        // count rows
        var c = csv_rows[0].length,
            converted = [];
        if (c < 2 || c > 3)
            throw new Error('CSV file must have 2 or 3 columns');
        // set up rows
        for (var i = 1; i < c; i++) {
            converted[i - 1] = {};
        }
        // fill
        csv_rows.slice(1).forEach(function(row) {
            for (var i = 1, l = row.length; i < l; i++) {
                converted[i - 1][row[0]] = row[i];
            }
        });
        return converted;
    }
    
    function genes_for_gene_reaction_rule(rule) {
        /** Find unique genes in gene_reaction_rule string.

         Arguments
         ---------

         rule: A boolean string containing gene names, parentheses, AND's and
         OR's.
         
         Returns
         -------

         An array of gene strings.

         */
        var genes = rule
        // remove ANDs and ORs, surrounded by space or parentheses
                .replace(AND_OR, '$1$2')
        // remove parentheses
                .replace(ALL_PARENS, '')
        // split on whitespace
                .split(' ')
                .filter(function(x) { return x != ''; });
        // unique strings
        return utils.unique_strings_array(genes);
    }
    
    function evaluate_gene_reaction_rule(rule, gene_values, and_method_in_gene_reaction_rule) {
        /** Return a value given the rule and gene_values object.

         Arguments
         ---------

         rule: A boolean string containing gene names, parentheses, AND's and
         OR's.

         gene_values: Object with gene_ids for keys and numbers for values.

         and_method_in_gene_reaction_rule: Either 'mean' or 'min'.

         */

        var null_val = [null],
            l = 1;
        // make an array of nulls as the default
        for (var gene_id in gene_values) {
            null_val = gene_values[gene_id].map(function() { return null; });
            l = null_val.length;
            break;
        }
        
        if (rule == '') return null_val;

        // for each element in the arrays
        var out = [];
        for (var i = 0; i < l; i++) {
            // get the rule
            var curr_val = rule;

            // put all the numbers into the expression
            var all_null = true;
            for (var gene_id in gene_values) {
                var f = _parse_float_or_null(gene_values[gene_id][i]);
                if (f === null) {
                    f = 0;
                } else {
                    all_null = false;
                }
                curr_val = replace_gene_in_rule(curr_val, gene_id, f);
            }
            if (all_null) {
                out.push(null);
                continue;
            }

            // recursively evaluate
            while (true) {
                // arithemtic expressions
                var new_curr_val = curr_val;
                
                // take out excessive parentheses
                new_curr_val = new_curr_val.replace(EXCESS_PARENS, ' $1 ');
                
                // or's
                new_curr_val = new_curr_val.replace(OR_EXPRESSION, function(match, p1, p2, p3) {
                    // sum
                    var nums = p2.split(OR).map(parseFloat),
                        sum = nums.reduce(function(a, b) { return a + b;});
                    return p1 + sum + p3;
                });
                // and's
                new_curr_val = new_curr_val.replace(AND_EXPRESSION, function(match, p1, p2, p3) {
                    // find min
                    var nums = p2.split(AND).map(parseFloat),
                        val = (and_method_in_gene_reaction_rule == 'min' ?
                               Math.min.apply(null, nums) :
                               nums.reduce(function(a, b) { return a + b; }) / nums.length);
                    return p1 + val + p3;
                });
                // break if there is no change
                if (new_curr_val == curr_val)
                    break;
                curr_val = new_curr_val;
            } 
            // strict test for number
            var num = Number(curr_val);
            if (isNaN(num)) {
                console.warn('Could not evaluate ' + rule);
                out.push(null);
            } else {
                out.push(num);
            }
        }
        return out;
    }
    
    function replace_gene_in_rule(rule, gene_id, val) {
        // get the escaped string, with surrounding space or parentheses
        var space_or_par_start = '(^|[\\\s\\\(\\\)])',
            space_or_par_finish = '([\\\s\\\(\\\)]|$)',
            escaped = space_or_par_start + escape_reg_exp(gene_id) + space_or_par_finish;
        return rule.replace(new RegExp(escaped, 'g'),  '$1' + val + '$2');
        
        // definitions
        function escape_reg_exp(string) {
            return string.replace(ESCAPE_REG, "\\$1");
        }
    }
    
    function apply_reaction_data_to_reactions(reactions, data, styles, compare_style) {
        /**  Returns True if the scale has changed.

         */

        if (data === null) {
            for (var reaction_id in reactions) {
                var reaction = reactions[reaction_id];
                reaction.data = null;
                reaction.data_string = '';
                for (var segment_id in reaction.segments) {
                    var segment = reaction.segments[segment_id];
                    segment.data = null;
                }
                reaction.gene_string = null;
            }
            return false;
        }

        // apply the datasets to the reactions
        for (var reaction_id in reactions) {
            var reaction = reactions[reaction_id],
                d = (reaction.bigg_id in data ? data[reaction.bigg_id] : null),
                f = float_for_data(d, styles, compare_style),
                r = reverse_flux_for_data(d),
                s = text_for_data(d, f);
            reaction.data = f;
            reaction.data_string = s;
            reaction.reverse_flux = r;
            reaction.gene_string = null;
            // apply to the segments
            for (var segment_id in reaction.segments) {
                var segment = reaction.segments[segment_id];
                segment.data = reaction.data;
                segment.reverse_flux = reaction.reverse_flux;
            }
        }
        return true;
    }
    
    function apply_metabolite_data_to_nodes(nodes, data, styles, compare_style) {
        /**  Returns True if the scale has changed.

         */
        if (data === null) {
            for (var node_id in nodes) {
                nodes[node_id].data = null;
                nodes[node_id].data_string = '';
            }
            return false;
        }

        // grab the data
        for (var node_id in nodes) {
            var node = nodes[node_id],
                d = (node.bigg_id in data ? data[node.bigg_id] : null),
                f = float_for_data(d, styles, compare_style),
                s = text_for_data(d, f);
            node.data = f;
            node.data_string = s;
        }
        return true;
    }
    
    function apply_gene_data_to_reactions(reactions, gene_data_obj, styles, identifiers_on_map,
                                          compare_style, and_method_in_gene_reaction_rule) {
        /** Returns true if data is present

         Arguments
         ---------

         reactions: The reactions to update.

         gene_data_obj: The gene data object, with the following style:

         { reaction_id: { gene_id: value } }

         styles:  Gene styles array.

         identifiers_on_map:

         compare_style:

         and_method_in_gene_reaction_rule:

         */

        if (gene_data_obj === null) {
            for (var reaction_id in reactions) {
                var reaction = reactions[reaction_id];
                reaction.data = null;
                reaction.data_string = '';
                reaction.reverse_flux = false;
                for (var segment_id in reaction.segments) {
                    var segment = reaction.segments[segment_id];
                    segment.data = null;
                }
                reaction.gene_string = null;
            }
            return false;
        }

        // get the null val
        var null_val = [null];
        // make an array of nulls as the default
        for (var reaction_id in gene_data_obj) {
            for (var gene_id in gene_data_obj[reaction_id]) {
                null_val = gene_data_obj[reaction_id][gene_id]
                    .map(function() { return null; });
                break;
            }
            break;
        }

        // apply the datasets to the reactions
        for (var reaction_id in reactions) {
            var reaction = reactions[reaction_id],
                rule = reaction.gene_reaction_rule;
            // find the data
            var d, gene_values,
                r_data = gene_data_obj[reaction.bigg_id];
            if (typeof r_data !== 'undefined') {
                gene_values = r_data;
                d = evaluate_gene_reaction_rule(rule, gene_values,
                                                and_method_in_gene_reaction_rule);
            } else {
                gene_values = {};
                d = null_val;
            }
            var f = float_for_data(d, styles, compare_style),
                r = reverse_flux_for_data(d),
                s = text_for_data(d, f);
            reaction.data = f;
            reaction.data_string = s;
            reaction.reverse_flux = r;
            // apply to the segments
            for (var segment_id in reaction.segments) {
                var segment = reaction.segments[segment_id];
                segment.data = reaction.data;
                segment.reverse_flux = reaction.reverse_flux;
            }
            // always update the gene string
            reaction.gene_string = gene_string_for_data(rule,
                                                        gene_values,
                                                        reaction.genes,
                                                        styles,
                                                        identifiers_on_map,
                                                        compare_style);
        }
        return true;
    }
    
    function _parse_float_or_null(x) {
        // strict number casting
        var f = Number(x);
        // check for null and '', which haven't been caught yet
        return (isNaN(f) || parseFloat(x) != f) ? null : f;
    }
});
