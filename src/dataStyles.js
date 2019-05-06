import * as utils from './utils'
import _ from 'underscore'
import { format as d3Format } from 'd3-format'

// globals
const RETURN_ARG = x => x
const ESCAPE_REG = /([.*+?^=!:${}()|[\]/\\])/g
const EMPTY_LINES = /\n\s*\n/g
const TRAILING_NEWLINE = /\n\s*(\)*)\s*$/
const AND_OR = /([() ])(?:and|or)([)( ])/ig
const ALL_PARENS = /[()]/g
// capture an expression surrounded by whitespace and a set of parentheses
const EXCESS_PARENS = /\(\s*(\S+)\s*\)/g
const OR = /\s+or\s+/i
const AND = /\s+and\s+/i
// find ORs
const OR_EXPRESSION = /(^|\()(\s*-?[0-9.]+\s+(?:or\s+-?[0-9.]+\s*)+)(\)|$)/ig
// find ANDS, respecting order of operations (and before or)
const AND_EXPRESSION = /(^|\(|or\s)(\s*-?[0-9.]+\s+(?:and\s+-?[0-9.]+\s*)+)(\sor|\)|$)/ig

function parseFloatOrNull (x) {
  // strict number casting
  const f = Number(x)
  // check for null and '', which haven't been caught yet
  return (isNaN(f) || parseFloat(x) !== f) ? null : f
}

function alignGeneDataToReactions (data, reactions) {
  const aligned = {}
  let nullVal = [ null ]
  // make an array of nulls as the default
  for (let firstGeneId in data) {
    nullVal = data[firstGeneId].map(() => null)
    break
  }
  for (let reactionId in reactions) {
    const reaction = reactions[reactionId]
    const biggId = reaction.bigg_id
    const thisGeneData = {}

    reaction.genes.forEach(gene => {
      // check both gene id and gene name
      ;[ 'bigg_id', 'name' ].forEach(function (kind) {
        const d = data[gene[kind]] || utils.clone(nullVal)
        // merger with existing data if present
        const existingD = thisGeneData[gene.bigg_id]
        if (existingD === undefined) {
          thisGeneData[gene.bigg_id] = d
        } else {
          for (let i = 0; i < d.length; i++) {
            const pnt = d[i]
            if (pnt !== null) {
              existingD[i] = pnt
            }
          }
        }
      })
    })
    aligned[biggId] = thisGeneData
  }
  return aligned
}

function checkFinite (x) {
  return isFinite(x) ? x : null
}

function abs (x, takeAbs) {
  return takeAbs ? Math.abs(x) : x
}

function diff (x, y, takeAbs) {
  if (takeAbs) return Math.abs(y - x)
  else return y - x
}

function fold (x, y, takeAbs) {
  if (x === 0 || y === 0) return null
  var fold = (y >= x ? y / x : -x / y)
  return takeAbs ? Math.abs(fold) : fold
}

function log2Fold (x, y, takeAbs) {
  if (x === 0) return null
  if (y / x < 0) return null
  var log = Math.log(y / x) / Math.log(2)
  return takeAbs ? Math.abs(log) : log
}

/**
 * Convert imported data to a style that can be applied to reactions and nodes.
 * @param data - The data object.
 * @param name - Either 'reaction_data', 'metabolite_data', or 'gene_data'
 * @param allReactions - Required for name == 'gene_data'. Must include all GPRs
 *                       for the map and model.
 */
export function importAndCheck (data, name, allReactions) {
  // check arguments
  if (!data) return null

  if ([ 'reaction_data', 'metabolite_data', 'gene_data' ].indexOf(name) === -1) {
    throw new Error('Invalid name argument: ' + name)
  }

  // make array
  if (!(data instanceof Array)) {
    data = [ data ]
  }
  // check data
  var check = function () {
    if (data === null) {
      return null
    }
    if (data.length === 1) {
      return null
    }
    if (data.length === 2) {
      return null
    }
    return console.warn('Bad data style: ' + name)
  }
  check()
  data = utils.arrayToObject(data)

  if (name === 'gene_data') {
    if (allReactions === undefined) {
      throw new Error('Must pass all_reactions argument for gene_data')
    }
    data = alignGeneDataToReactions(data, allReactions)
  }

  return data
}

export function floatForData (d, styles, compareStyle) {
  // all null
  if (d === null) return null

  // absolute value
  const takeAbs = styles.indexOf('abs') !== -1

  if (d.length === 1) { // 1 set
    // 1 null
    var f = parseFloatOrNull(d[0])
    if (f === null) return null
    return abs(f, takeAbs)
  } else if (d.length === 2) { // 2 sets
    // 2 null
    var fs = d.map(parseFloatOrNull)
    if (fs[0] === null || fs[1] === null) return null

    if (compareStyle === 'diff') {
      return diff(fs[0], fs[1], takeAbs)
    } else if (compareStyle === 'fold') {
      return checkFinite(fold(fs[0], fs[1], takeAbs))
    } else if (compareStyle === 'log2_fold') {
      return checkFinite(log2Fold(fs[0], fs[1], takeAbs))
    }
  } else {
    throw new Error('Data array must be of length 1 or 2')
  }
  throw new Error('Bad data compare_style: ' + compareStyle)
}

export function reverse_flux_for_data (d) {
  if (d === null || d[0] === null) {
    return false
  }
  return (d[0] < 0)
}

/**
 * Add gene values to the gene_reaction_rule string.
 * @param {String} rule - The gene reaction rule.
 * @param {} gene_values - The values.
 * @param {} genes - An array of objects specifying the gene bigg_id and name.
 * @param {} styles - The reaction styles.
 * @param {String} identifiers_on_map - The type of identifiers ('bigg_id' or 'name').
 * @param {} compare_style - The comparison style.
 *
 * @return {Array} A list of objects with:
 *
 * {
 *    bigg_id: The bigg ID.
 *    name: The name.
 *    text: The new string with formatted data values.
 * }
 *
 * The text elements should each appear on a new line.
 */
export function gene_string_for_data (rule, gene_values, genes, styles,
                               identifiers_on_map, compare_style) {
  var out_text = rule
  var no_data = (gene_values === null)
  // keep track of bigg_ids to remove repeats
  var genes_found = {}

  genes.forEach(function(g_obj) {
    var bigg_id = g_obj.bigg_id

    // ignore repeats that may have found their way into the genes object
    if (bigg_id in genes_found) return
    genes_found[bigg_id] = true

    // generate the string
    if (no_data) {
      out_text = replace_gene_in_rule(out_text, bigg_id, bigg_id + '\n')
    } else {
      if (!(bigg_id in gene_values))
        return
      var d = gene_values[bigg_id]
      var f = floatForData(d, styles, compare_style)
      var format = (f === null ? RETURN_ARG : d3Format('.3g'))
      if (d.length === 1) {
        out_text = replace_gene_in_rule(out_text, bigg_id,
                                        bigg_id + ' (' + null_or_d(d[0], format) + ')\n')
      } else if (d.length === 2) {
        var new_str
        // check if they are all text
        var any_num = _.any(d, function (x) {
          return parseFloatOrNull(x) !== null
        })
        if (any_num) {
          new_str = (bigg_id + ' (' +
                     null_or_d(d[0], format) + ', ' +
                     null_or_d(d[1], format) + ': ' +
                     null_or_d(f, format) +
                     ')\n')
        } else {
          new_str = (bigg_id + ' (' +
                     null_or_d(d[0], format) + ', ' +
                     null_or_d(d[1], format) + ')\n')
        }
        out_text = replace_gene_in_rule(out_text, bigg_id, new_str)
      }
    }
  })
  out_text = (out_text
              // remove empty lines
              .replace(EMPTY_LINES, '\n')
              // remove trailing newline (with or without parens)
              .replace(TRAILING_NEWLINE, '$1'))

  // split by newlines, and switch to names if necessary
  var result = out_text.split('\n').map(function (text) {
    for (var i = 0, l = genes.length; i < l; i++) {
      var gene = genes[i]
      if (text.indexOf(gene.bigg_id) !== -1) {
        // replace with names
        if (identifiers_on_map === 'name')
          text = replace_gene_in_rule(text, gene.bigg_id, gene.name)
        return { bigg_id: gene.bigg_id, name: gene.name, text: text }
      }
    }
    // not found, then none
    return { bigg_id: null, name: null, text: text }
  })
  return result

  // definitions
  function null_or_d (d, format) {
    return d === null ? 'nd' : format(d)
  }
}

export function text_for_data (d, f) {
  if (d === null) {
    return null_or_d(null)
  }
  if (d.length === 1) {
    var format = (f === null ? RETURN_ARG : d3Format('.3g'))
    return null_or_d(d[0], format)
  }
  if (d.length === 2) {
    var format = (f === null ? RETURN_ARG : d3Format('.3g')),
    t = null_or_d(d[0], format)
    t += ', ' + null_or_d(d[1], format)
    t += ': ' + null_or_d(f, format)
    return t
  }
  return ''

  // definitions
  function null_or_d (d, format) {
    return d === null ? '(nd)' : format(d)
  }
}

export function csv_converter(csv_rows) {
  /** Convert data from a csv file to json-style data.

      File must include a header row.

  */
  // count rows
  var c = csv_rows[0].length,
  converted = []
  if (c < 2 || c > 3)
    throw new Error('CSV file must have 2 or 3 columns')
  // set up rows
  for (var i = 1; i < c; i++) {
    converted[i - 1] = {}
  }
  // fill
  csv_rows.slice(1).forEach(function(row) {
    for (var i = 1, l = row.length; i < l; i++) {
      converted[i - 1][row[0]] = row[i]
    }
  })
  return converted
}

export function genes_for_gene_reaction_rule(rule) {
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
    .filter(function(x) { return x != ''; })
  // unique strings
  return utils.unique_strings_array(genes)
}

export function evaluate_gene_reaction_rule(rule, gene_values, and_method_in_gene_reaction_rule) {
  /** Return a value given the rule and gene_values object.

      Arguments
      ---------

      rule: A boolean string containing gene names, parentheses, AND's and
      OR's.

      gene_values: Object with gene_ids for keys and numbers for values.

      and_method_in_gene_reaction_rule: Either 'mean' or 'min'.

  */

  var null_val = [null],
  l = 1
  // make an array of nulls as the default
  for (var gene_id in gene_values) {
    null_val = gene_values[gene_id].map(function() { return null; })
    l = null_val.length
    break
  }

  if (rule == '') return utils.clone(null_val)

  // for each element in the arrays
  var out = []
  for (var i = 0; i < l; i++) {
    // get the rule
    var curr_val = rule

    // put all the numbers into the expression
    var all_null = true
    for (var gene_id in gene_values) {
      var f = parseFloatOrNull(gene_values[gene_id][i])
      if (f === null) {
        f = 0
      } else {
        all_null = false
      }
      curr_val = replace_gene_in_rule(curr_val, gene_id, f)
    }
    if (all_null) {
      out.push(null)
      continue
    }

    // recursively evaluate
    while (true) {
      // arithemtic expressions
      var new_curr_val = curr_val

      // take out excessive parentheses
      new_curr_val = new_curr_val.replace(EXCESS_PARENS, ' $1 ')

      // or's
      new_curr_val = new_curr_val.replace(OR_EXPRESSION, function(match, p1, p2, p3) {
        // sum
        var nums = p2.split(OR).map(parseFloat),
        sum = nums.reduce(function(a, b) { return a + b;})
        return p1 + sum + p3
      })
      // and's
      new_curr_val = new_curr_val.replace(AND_EXPRESSION, function(match, p1, p2, p3) {
        // find min
        var nums = p2.split(AND).map(parseFloat),
            val = (and_method_in_gene_reaction_rule == 'min' ?
                   Math.min.apply(null, nums) :
                   nums.reduce(function(a, b) { return a + b; }) / nums.length)
        return p1 + val + p3
      })
      // break if there is no change
      if (new_curr_val == curr_val)
        break
      curr_val = new_curr_val
    }
    // strict test for number
    var num = Number(curr_val)
    if (isNaN(num)) {
      console.warn('Could not evaluate ' + rule)
      out.push(null)
    } else {
      out.push(num)
    }
  }
  return out
}

export function replace_gene_in_rule (rule, gene_id, val) {
  // get the escaped string, with surrounding space or parentheses
  var space_or_par_start = '(^|[\\\s\\\(\\\)])'
  var space_or_par_finish = '([\\\s\\\(\\\)]|$)'
  var escaped = space_or_par_start + escape_reg_exp(gene_id) + space_or_par_finish
  return rule.replace(new RegExp(escaped, 'g'),  '$1' + val + '$2')

  // definitions
  function escape_reg_exp(string) {
    return string.replace(ESCAPE_REG, "\\$1")
  }
}

/**
 * Returns True if the scale has changed.
 * @param {Object} reactions -
 * @param {} data -
 * @param {} styles -
 * @param {String} compare_style -
 * @param {Array} keys - (Optional) The keys in reactions to apply data to.
 */
export function apply_reaction_data_to_reactions (reactions, data, styles,
                                           compare_style, keys) {
  if (_.isUndefined(keys)) keys = Object.keys(reactions)

  var reaction_id
  var reaction
  var segment_id
  var segment

  if (data === null) {
    keys.map(function (reaction_id) {
      reaction = reactions[reaction_id]
      reaction.data = null
      reaction.data_string = ''
      for (segment_id in reaction.segments) {
        segment = reaction.segments[segment_id]
        segment.data = null
      }
      reaction.gene_string = null
    })
    return false
  }

  // apply the datasets to the reactions
  keys.map(function (reaction_id) {
    reaction = reactions[reaction_id]
    // check bigg_id and name
    var d = data[reaction.bigg_id] || data[reaction.name] || null
    var f = floatForData(d, styles, compare_style)
    var r = reverse_flux_for_data(d)
    var s = text_for_data(d, f)
    reaction.data = f
    reaction.data_string = s
    reaction.reverse_flux = r
    reaction.gene_string = null
    // apply to the segments
    for (segment_id in reaction.segments) {
      segment = reaction.segments[segment_id]
      segment.data = reaction.data
      segment.reverse_flux = reaction.reverse_flux
    }
  })
  return true
}

/**
 * Returns True if the scale has changed.
 * @param {Object} nodes -
 * @param {} data -
 * @param {} styles -
 * @param {String} compare_style -
 * @param {Array} keys - (Optional) The keys in nodes to apply data to.
 */
export function apply_metabolite_data_to_nodes (nodes, data, styles, compareStyle, keys) {
  if (_.isUndefined(keys)) keys = Object.keys(nodes)

  if (data === null) {
    keys.map(nodeId => {
      nodes[nodeId].data = null
      nodes[nodeId].data_string = ''
    })
    return false
  }

  // grab the data
  keys.map(nodeId => {
    var node = nodes[nodeId]
    // check bigg_id and name
    const d = data[node.bigg_id] || data[node.name] || null
    const f = floatForData(d, styles, compareStyle)
    const s = text_for_data(d, f)
    node.data = f
    node.data_string = s
  })
  return true
}

/**
 * Returns true if data is present
 * reactions: The reactions to update.
 * gene_data_obj: The gene data object, with the following style:
 *   { reaction_id: { gene_id: value } }
 * styles:  Gene styles array.
 * identifiers_on_map:
 * compare_style:
 * and_method_in_gene_reaction_rule:
 * @param {Array} keys - (Optional) The keys in reactions to apply data to.
 */
export function apply_gene_data_to_reactions (
  reactions,
  gene_data_obj,
  styles,
  identifiers_on_map,
  compare_style,
  and_method_in_gene_reaction_rule,
  keys
) {
  if (_.isUndefined(keys)) keys = Object.keys(reactions)

  if (gene_data_obj === null) {
    keys.map(function (reaction_id) {
      var reaction = reactions[reaction_id]
      reaction.data = null
      reaction.data_string = ''
      reaction.reverse_flux = false
      for (var segment_id in reaction.segments) {
        var segment = reaction.segments[segment_id]
        segment.data = null
      }
      reaction.gene_string = null
    })
    return false
  }

  // Get the null val
  var null_val = [ null ]
  // Make an array of nulls as the default
  for (var reaction_id in gene_data_obj) {
    for (var gene_id in gene_data_obj[reaction_id]) {
      null_val = gene_data_obj[reaction_id][gene_id]
        .map(function () { return null })
      break
    }
    break
  }

  // Apply the datasets to the reactions
  keys.map(function (reaction_id) {
    var reaction = reactions[reaction_id]
    var rule = reaction.gene_reaction_rule
    // find the data
    var d, gene_values
    var r_data = gene_data_obj[reaction.bigg_id]
    if (!_.isUndefined(r_data)) {
      gene_values = r_data
      d = evaluate_gene_reaction_rule(rule, gene_values,
                                      and_method_in_gene_reaction_rule)
    } else {
      gene_values = {}
      d = utils.clone(null_val)
    }
    var f = floatForData(d, styles, compare_style)
    var r = reverse_flux_for_data(d)
    var s = text_for_data(d, f)
    reaction.data = f
    reaction.data_string = s
    reaction.reverse_flux = r
    // apply to the segments
    for (var segment_id in reaction.segments) {
      var segment = reaction.segments[segment_id]
      segment.data = reaction.data
      segment.reverse_flux = reaction.reverse_flux
    }
    // always update the gene string
    reaction.gene_string = gene_string_for_data(rule,
                                                gene_values,
                                                reaction.genes,
                                                styles,
                                                identifiers_on_map,
                                                compare_style)
  })
  return true
}
