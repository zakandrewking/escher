define(["utils", "lib/bacon"], function(utils, bacon) {
    /** A class to manage settings for a Map.

        Arguments
        ---------

        set_option: A function, fn(key), that returns the option value for the
        key.

        get_option: A function, fn(key, value), that sets the option for the key
        and value.

     */

    var SearchBar = utils.make_class();
    // class methods
    SearchBar.check_type = check_type;
    // instance methods
    SearchBar.prototype = { init: init,
                            change_data_style: change_data_style,
                            set_compare_style: set_compare_style,
                            set_auto_domain: set_auto_domain,
                            set_domain_value: set_domain_value,
                            set_domain: set_domain,
                            set_range_value: set_range_value,
                            set_range: set_range,
                            set_no_data_value: set_no_data_value,
                            set_and_method_in_gene_reaction_rule: set_and_method_in_gene_reaction_rule,
                            // View and build options
                            set_identifiers_on_map: set_identifiers_on_map,
                            set_highlight_missing: set_highlight_missing,
                            set_allow_building_duplicate_reactions: set_allow_building_duplicate_reactions,
                            // changes
                            hold_changes: hold_changes,
                            abandon_changes: abandon_changes,
                            accept_changes: accept_changes };

    return SearchBar;

    // class methods
    function check_type(type) {
        if (['reaction', 'metabolite'].indexOf(type)==-1)
            throw new Error('Bad type');
    }

    // instance methods
    function init(set_option, get_option) {
        this.set_option = set_option;
        this.get_option = get_option;
        
        // organize
        var def_styles = { reaction: get_option('reaction_styles'),
                           metabolite: get_option('metabolite_styles') },
            def_compare_style = { reaction: get_option('reaction_compare_style'),
                                  metabolite: get_option('metabolite_compare_style') },
            def_auto_domain = { reaction: get_option('auto_reaction_domain'),
                                metabolite: get_option('auto_metabolite_domain') },
            def_domain = { reaction: get_option('reaction_domain'),
                           metabolite: get_option('metabolite_domain') },
            def_range = { reaction: { color: get_option('reaction_color_range'),
                                      size: get_option('reaction_size_range') },
                          metabolite: { color: get_option('metabolite_color_range'),
                                        size: get_option('metabolite_size_range') } },
            def_no_data = { reaction: { color: get_option('reaction_no_data_color'),
                                        size: get_option('reaction_no_data_size') },
                            metabolite: { color: get_option('metabolite_no_data_color'),
                                          size: get_option('metabolite_no_data_size') } },
            def_and_method_in_gene_reaction_rule = get_option('and_method_in_gene_reaction_rule'),
            def_identifiers_on_map = get_option('identifiers_on_map'),
            def_highlight_missing = get_option('highlight_missing'),
            def_allow_building_duplicate_reactions = get_option('allow_building_duplicate_reactions');

        // event streams
        this.data_styles_bus = {};
        this.data_styles_stream = {};
        this.compare_style_bus = {};
        this.compare_style_stream = {};
        this.auto_domain_bus = {};
        this.auto_domain_stream = {};
        this.domain_bus = {};
        this.domain_stream = {};
        this.range_bus = {};
        this.range_stream = {};
        this.no_data_bus = {};
        this.no_data_stream = {};
        // this.and_method_in_gene_reaction_rule_bus;
        // this.and_method_in_gene_reaction_rule_stream;
        // this.identifiers_on_map_bus;
        // this.identifiers_on_map_stream;
        // this.highlight_missing_bus;
        // this.highlight_missing_stream;
        // this.allow_building_duplicate_reactions_bus;
        // this.allow_building_duplicate_reactions_stream;

        // manage accepting/abandoning changes
        this.status_bus = new bacon.Bus();

        // force an update of ui components
        this.force_update_bus = new bacon.Bus();

        // modify bacon.observable
        bacon.Observable.prototype.convert_to_conditional_stream = convert_to_conditional_stream;
        bacon.Observable.prototype.force_update_with_bus = force_update_with_bus;

        // ---------------------------------------------------------------------
        // style
        // ---------------------------------------------------------------------
        
        ['metabolite', 'reaction'].forEach(function(type) {
            // set up the styles settings
            this.data_styles_bus[type] = new bacon.Bus();
            // make the event stream
            this.data_styles_stream[type] = this.data_styles_bus[type]
            // conditionally accept changes
                .convert_to_conditional_stream(this.status_bus)
            // combine into state array
                .scan([], function(current, event) {
                    if (event===null)
                        return current;
                    // add or remove the property from the stream
                    if (event.on_off && current.indexOf(event.style) == -1) {
                        // if it is checked, add the style
                        return current.concat([event.style]);
                    } else if (!event.on_off && current.indexOf(event.style) != -1) {
                        // if not, remove the style
                        return current.filter(function(v) {
                            return v != event.style;
                        });
                    }
                    // otherwise, return unchanged
                    return current;
                })
            // force updates
                .force_update_with_bus(this.force_update_bus);

            // get the latest
            this.data_styles_stream[type].onValue(function(v) {
                if (type=='reaction')
                    this.set_option('reaction_styles', v);
                else if (type=='metabolite')
                    this.set_option('metabolite_styles', v);
            }.bind(this));

            // push the defaults
            var def = def_styles[type];
            def.forEach(function(x) {
                this.data_styles_bus[type].push({ style: x, on_off: true });
            }.bind(this));
        }.bind(this));

        // ---------------------------------------------------------------------
        // compare_style
        // ---------------------------------------------------------------------
        
        ['reaction', 'metabolite'].forEach(function(type) {
            // set up the styles settings
            this.compare_style_bus[type] = new bacon.Bus();
            // make the event stream
            this.compare_style_stream[type] = this.compare_style_bus[type]
            // conditionally accept changes
                .convert_to_conditional_stream(this.status_bus)
            // combine into state array
                .scan([], function(current, value) {
                    return value;
                })
            // force updates
                .force_update_with_bus(this.force_update_bus);

            // get the latest
            this.compare_style_stream[type].onValue(function(v) {
                if (type=='reaction') {
                    this.set_option('reaction_compare_style', v);
                } else if (type=='metabolite') {
                    this.set_option('metabolite_compare_style', v);
                } 
            }.bind(this));

            // push the defaults
            var def = def_compare_style[type];
            this.compare_style_bus[type].push(def);
        }.bind(this));

        // ---------------------------------------------------------------------
        // auto domain
        // ---------------------------------------------------------------------
        
        ['metabolite', 'reaction'].forEach(function(type) {
            // set up the auto_domain settings
            this.auto_domain_bus[type] = new bacon.Bus();
            this.auto_domain_stream[type] = this.auto_domain_bus[type]
            // conditionally accept changes
                .convert_to_conditional_stream(this.status_bus)
            // force updates
                .force_update_with_bus(this.force_update_bus);

            // get the latest
            this.auto_domain_stream[type].onValue(function(v) {
                if (type=='reaction')
                    this.set_option('auto_reaction_domain', v);
                else if (type=='metabolite')
                    this.set_option('auto_metabolite_domain', v);
            }.bind(this));

            // set the default
            var def = def_auto_domain[type];
            this.auto_domain_bus[type].push(def);

            // set up the domain
            // make the bus
            this.domain_bus[type] = new bacon.Bus();
            // make a new constant for the input default
            this.domain_stream[type] = this.domain_bus[type]
            // conditionally accept changes
                .convert_to_conditional_stream(this.status_bus)
            // combine into state array
                .scan([], function(current, event) {
                    current[event.index] = event.value;
                    return current;
                })
            // force updates
                .force_update_with_bus(this.force_update_bus);

            // get the latest
            this.domain_stream[type].onValue(function(v) {
                if (type=='reaction')
                    this.set_option('reaction_domain', v);
                else if (type=='metabolite')
                    this.set_option('metabolite_domain', v);
            }.bind(this));

            // push the defaults
            var def = def_domain[type];
            def.forEach(function(x, i) { 
                this.domain_bus[type].push({ index: i, value: x });
            }.bind(this));

            // set up the ranges
            this.range_bus[type] = {};
            this.range_stream[type] = {};
            ['color', 'size'].forEach(function(range_type) {
                // make the bus
                this.range_bus[type][range_type] = new bacon.Bus();
                // make a new constant for the input default
                this.range_stream[type][range_type] = this.range_bus[type][range_type]
                // conditionally accept changes
                    .convert_to_conditional_stream(this.status_bus)
                // combine into state array
                    .scan([], function(current, event) {
                        current[event.index] = event.value;
                        return current;
                    })
                // force updates
                    .force_update_with_bus(this.force_update_bus);

                // get the latest
                this.range_stream[type][range_type].onValue(function(v) {
                    if (type=='reaction' && range_type=='color')
                        this.set_option('reaction_color_range', v);
                    else if (type=='reaction' && range_type=='size')
                        this.set_option('reaction_size_range', v);
                    else if (type=='metabolite' && range_type=='color')
                        this.set_option('metabolite_color_range', v);
                    else if (type=='metabolite' && range_type=='size')
                        this.set_option('metabolite_size_range', v);
                }.bind(this));

                // push the default
                var def = def_range[type][range_type];
                def.forEach(function(x, i) { 
                    this.range_bus[type][range_type].push({ index: i, value: x });
                }.bind(this));

            }.bind(this));

            // set up the no data settings
            this.no_data_bus[type] = {};
            this.no_data_stream[type] = {};
            ['color', 'size'].forEach(function(no_data_type) {
                // make the bus
                this.no_data_bus[type][no_data_type] = new bacon.Bus();
                // make a new constant for the input default
                this.no_data_stream[type][no_data_type] = this.no_data_bus[type][no_data_type]
                // conditionally accept changes
                    .convert_to_conditional_stream(this.status_bus)
                // combine into state array
                    .scan([], function(current, value) {
                        return value;
                    })
                // force updates
                    .force_update_with_bus(this.force_update_bus);

                // get the latest
                this.no_data_stream[type][no_data_type].onValue(function(v) {
                    if (type=='reaction' && no_data_type=='color')
                        this.set_option('reaction_no_data_color', v);
                    else if (type=='reaction' && no_data_type=='size')
                        this.set_option('reaction_no_data_size', v);
                    else if (type=='metabolite' && no_data_type=='color')
                        this.set_option('metabolite_no_data_color', v);
                    else if (type=='metabolite' && no_data_type=='size')
                        this.set_option('metabolite_no_data_size', v);
                }.bind(this));

                // push the default
                var def = def_no_data[type][no_data_type];
                this.no_data_bus[type][no_data_type].push(def);

            }.bind(this));
        }.bind(this));

        // ---------------------------------------------------------------------
        // and_method_in_gene_reaction_rule
        // ---------------------------------------------------------------------
        
        // make the bus
        this.and_method_in_gene_reaction_rule_bus = new bacon.Bus();
        // make a new constant for the input default
        this.and_method_in_gene_reaction_rule_stream = this.and_method_in_gene_reaction_rule_bus
        // conditionally accept changes
            .convert_to_conditional_stream(this.status_bus)
        // combine into state array
            .scan([], function(current, value) {
                return value;
            })
        // force updates
            .force_update_with_bus(this.force_update_bus);

        // get the latest
        this.and_method_in_gene_reaction_rule_stream.onValue(function(v) {
            this.set_option('and_method_in_gene_reaction_rule', v);
        }.bind(this));

        // push the default
        this.and_method_in_gene_reaction_rule_bus.push(def_and_method_in_gene_reaction_rule);
        
        // ---------------------------------------------------------------------
        // identifiers_on_map
        // ---------------------------------------------------------------------
        
        // make the bus
        this.identifiers_on_map_bus = new bacon.Bus();
        // make a new constant for the input default
        this.identifiers_on_map_stream = this.identifiers_on_map_bus
        // conditionally accept changes
            .convert_to_conditional_stream(this.status_bus)
        // combine into state array
            .scan([], function(current, value) {
                return value;
            })
        // force updates
            .force_update_with_bus(this.force_update_bus);

        // get the latest
        this.identifiers_on_map_stream.onValue(function(v) {
            this.set_option('identifiers_on_map', v);
        }.bind(this));

        // push the default
        this.identifiers_on_map_bus.push(def_identifiers_on_map);

        // ---------------------------------------------------------------------
        // highlight missing
        // ---------------------------------------------------------------------
        
        // make the bus
        this.highlight_missing_bus = new bacon.Bus();
        // make a new constant for the input default
        this.highlight_missing_stream = this.highlight_missing_bus
        // conditionally accept changes
            .convert_to_conditional_stream(this.status_bus)
        // combine into state array
            .scan([], function(current, value) {
                return value;
            })
        // force updates
            .force_update_with_bus(this.force_update_bus);

        // get the latest
        this.highlight_missing_stream.onValue(function(v) {
            this.set_option('highlight_missing', v);
        }.bind(this));

        // push the default
        var def = def_highlight_missing;
        this.highlight_missing_bus.push(def);

        // ---------------------------------------------------------------------
        // allow_building_duplicate_reactions
        // ---------------------------------------------------------------------
        
        // make the bus
        this.allow_building_duplicate_reactions_bus = new bacon.Bus();
        // make a new constant for the input default
        this.allow_building_duplicate_reactions_stream = this.allow_building_duplicate_reactions_bus
        // conditionally accept changes
            .convert_to_conditional_stream(this.status_bus)
        // combine into state array
            .scan([], function(current, value) {
                return value;
            })
        // force updates
            .force_update_with_bus(this.force_update_bus);

        // get the latest
        this.allow_building_duplicate_reactions_stream.onValue(function(v) {
            this.set_option('allow_building_duplicate_reactions', v);
        }.bind(this));

        // push the default
        this.allow_building_duplicate_reactions_bus.push(def_allow_building_duplicate_reactions);

        
        // definitions
        function convert_to_conditional_stream(status_stream) {
            /** Hold on to event when hold_property is true, and only keep them
              if accept_property is true (when hold_property becomes false).

             */

            // true if hold is pressed
            var is_not_hold_event = status_stream
                    .map(function(x) { return x=='hold'; })
                    .not()
                    .toProperty(true),
                is_not_first_clear = status_stream
                    .scan(false, function(c, x) {
                        // first clear only
                        return (c==false && (x=='accepted' || x=='rejected'));
                    }).not(),
                is_not_first_hold = status_stream
                    .scan(false, function(c, x) {
                        // first clear only
                        return (c==false && x=='hold');
                    }).not(),
                combined = bacon.combineAsArray(this, status_stream),
                held = combined
                    .scan([], function(c, x) {
                        if (x[1]=='hold') {
                            c.push(x[0]);
                            return c;
                        } else if (x[1]=='accept') {
                            return c;
                        } else if (x[1]=='reject') {
                            return [];
                        } else if (x[1]=='rejected' || x[1]=='accepted') {
                            return [x[0]];
                        } else {
                            throw Error('bad status ' + x[1]);
                        }
                    })
            // don't pass in events until the end of a hold
                    .filter(is_not_hold_event)
            // ignore the event when clear is passed
                    .filter(is_not_first_clear)
            // ignore the event when hold is passed
                    .filter(is_not_first_hold)
                    .flatMap(function(ar) {
                        return bacon.fromArray(ar);
                    }),
                unheld = this.filter(is_not_hold_event);
            return unheld.merge(held);
        }

        function force_update_with_bus(bus) {        
            return bacon
                .combineAsArray(this, bus.toProperty(false))
                .map(function(t) {
                    return t[0];
                });
        }
    }

    function set_auto_domain(type, on_off) {    
        /** Turn auto domain setting on or off.

            Arguments
            ---------

            type: 'reaction' or 'metabolite'

            on_off: (Boolean) If True, then automatically set the domain. If False,
            then manually set the domain.

        */
        check_type(type);

        this.auto_domain_bus[type].push(on_off);
    }

    function change_data_style(type, style, on_off) {
        /** Change the data style.

            Arguments
            ---------

            type: 'reaction' or 'metabolite'

            style: A data style.

            on_off: (Boolean) If True, then add the style. If False, then remove
            it.

        */
        check_type(type);

        this.data_styles_bus[type].push({ style: style,
                                          on_off: on_off });
    }

    function set_compare_style(type, value) {
        /** Change the data style.

            Arguments
            ---------

            type: 'reaction' or 'metabolite'.

            value: A compare_style.

        */
        check_type(type);

        if (['fold', 'log2_fold', 'diff'].indexOf(value) == -1)
            throw new Error('Invalid compare_style: ' + value);

        this.compare_style_bus[type].push(value);
    }
    
    function set_domain_value(type, index, value) {
        /** Change a domain value.

         type: 'reaction' or 'metabolite'

         index: The domain index to set.

         value: The new value

         */
        check_type(type);

        this.domain_bus[type].push({ index: index,
                                     value: value });
    }

    function set_domain(type, domain) {
        /** Change a domain.

         type: 'reaction' or 'metabolite'

         domain: The new domain.

         */
        check_type(type);

        domain.forEach(function(d, i) {
            this.domain_bus[type].push({ index: i, value: d });
        }.bind(this));
    }

    function set_range_value(type, range_type, index, value) {
        /** Change a range value.

         type: 'reaction' or 'metabolite'

         range_type: 'color' or 'size'

         index: The range index to set.

         value: The new value

         */
        check_type(type);

        this.range_bus[type][range_type].push({ index: index,
                                                value: value });
    }

    function set_range(type, range_type, range) {
        /** Change a range.

         type: 'reaction' or 'metabolite'

         range_type: 'color' or 'size'

         value: The new range

         */
        check_type(type);

        range.forEach(function(d, i) {
            this.range_bus[type][range_type].push({ index: i, value: d });
        }.bind(this));
    }

    function set_no_data_value(type, no_data_type, value) {
        /** Change a no_data value.

         type: 'reaction' or 'metabolite'

         no_data_type: 'color' or 'size'

         value: The new value

         */
        check_type(type);

        this.no_data_bus[type][no_data_type].push(value);
    }

    function set_and_method_in_gene_reaction_rule(value) {
        /**  When evaluating a gene reaction rule, use this function to evaluate
             AND rules. 

             Arguments
             ---------

             value: Can be 'mean' or 'min'.

         */
        if (['mean', 'min'].indexOf(value) == -1)
            throw new Error('Bad value for and_method_in_gene_reaction_rule: ' + value);
        this.and_method_in_gene_reaction_rule_bus.push(value);
    }

    function set_identifiers_on_map(value) {
        /** Set which id should be visible.

            Arguments
            ---------

            value: Either 'bigg_id' or 'name';

         */
        if (['bigg_id', 'name'].indexOf(value) == -1)
            throw new Error('Bad value for identifiers_on_map: ' + value);
        this.identifiers_on_map_bus.push(value);
    }

    function set_highlight_missing(value) {
        /** Set the option.

            Arguments
            ---------

            value: The new boolean value.

        */
        this.highlight_missing_bus.push(value);
    }
    
    function set_allow_building_duplicate_reactions(value) {
        /** Set the option.

            Arguments
            ---------

            value: The new boolean value.

        */
        this.allow_building_duplicate_reactions_bus.push(value);
    }
    
    function hold_changes() {
        this.status_bus.push('hold');
    }
    
    function abandon_changes() {
        this.status_bus.push('reject');
        this.status_bus.push('rejected');
        this.force_update_bus.push(true);
    }
    
    function accept_changes() {
        this.status_bus.push('accept');
        this.status_bus.push('accepted');
    }
});
