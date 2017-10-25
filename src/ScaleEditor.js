/**
 * ScaleEditor. An interactive UI to edit color and size scales.
 * sel: A d3 selection.
 * type: A type, that should be unique on the page.
 * settings: The Settings object.
 */

var utils = require('./utils')
var bacon = require('baconjs')
var d3_scaleLinear = require('d3-scale').scaleLinear
var d3_format = require('d3-format').format
var d3_drag = require('d3-drag').drag
var d3_select = require('d3-selection').select
var d3_selection = require('d3-selection')

var ScaleEditor = utils.make_class()
// instance methods
ScaleEditor.prototype = {
  init: init,
  update: update,
  update_no_data: update_no_data,
  _data_not_loaded: _data_not_loaded
}
module.exports = ScaleEditor

function init (sel, type, settings, get_data_statistics) {
  var grad_id = 'grad' + type + this.unique_string
  this.w = 400
  this.h = 30
  this.x = 20
  this.input_width = 90
  this.input_height = 24
  var b = sel.append('div')
    .attr('class', 'scale-editor')
  // no data loaded
  this.data_not_loaded = b.append('div')
    .attr('class', 'data-not-loaded')
    .text((type === 'reaction' ? 'Reaction and gene' : 'Metabolite') + ' data not loaded')
  // label
  this.input_label_group = b.append('div')
    .attr('class', 'input-label-group')
  // no data
  var nd = b.append('div')
    .style('top', this.input_height * 3 + 56 + 10 + 'px')
    .attr('class', 'no-data')
  nd.append('span').text('Styles for ' + type + 's with no data')
    .attr('class', 'no-data-heading')
  this.no_data_container = nd.append('div')
  var c = b.append('div')
    .attr('class', 'centered')
  this.add_group = c.append('div')
  this.trash_group = c.append('div')
    .attr('class', 'trash-container')
  var svg = c.append('svg')
    .attr('class', 'scale-svg')
  this.input_group = c.append('div')
    .attr('class', 'input-container')
  this.gradient = svg.append('defs')
    .append('linearGradient')
    .attr('id', grad_id)
  svg.append('rect')
    .attr('class', 'rect')
    .attr('fill', 'url(#' + grad_id + ')')
    .attr('width', this.w + 'px')
    .attr('height', this.h + 'px')
    .attr('x', this.x + 'px'),
  this.pickers_group = svg.append('g')

  // Settings
  this.type = type
  this.settings = settings
  this.get_data_statistics = get_data_statistics

  var unique_map_id = this.settings.get_option('unique_map_id')
  this.unique_string = (unique_map_id === null ? '' : '.' + unique_map_id)

  // Collect data
  this.no_data = {}
  var ss = [ 'color', 'size' ]
  ss.forEach(function (s) {
    this.no_data[s] = null
    this.settings.streams[this.type + '_no_data_' + s].onValue(function (val) {
      this.no_data[s] = val
      this.update_no_data()
    }.bind(this))
  }.bind(this))

  this.settings.streams[type + '_scale'].onValue(function (scale) {
    this.scale = scale
    this.update()
  }.bind(this))
}

function update () {
  var scale = this.scale
  var stats = this.get_data_statistics()[this.type]
  var bar_w = 14
  var bar_h = 35
  var x_disp = this.x
  var data_not_loaded = this._data_not_loaded()

  // Must have max and min. Otherwise, assume that no data is loaded.
  if (data_not_loaded) {
    scale = [
      { type: 'min', 'color': null, 'size': null },
      { type: 'max', 'color': null, 'size': null }
    ]
    stats = { min: 0, max: 1 }
  }

  var sc = d3_scaleLinear()
    .domain([ 0, this.w ])
    .range([ stats.min, stats.max ])
  var sc_size = d3_scaleLinear()
    .domain([ 0, this.w ])
    .range([ 0, stats.max - stats.min ])

  // ---------------------------------------------------------------------
  // Convenience functions
  // ---------------------------------------------------------------------

  var bring_to_front = function (d, i) {
    // Bring an input set to the front
    this.input_group.selectAll('.input-set').each(function (d2) {
      d3_select(this).classed('selected-set', d === d2)
    })
  }.bind(this)

  var get_this_val = function (d) {
    return (d.type === 'value') ? d.value : stats[d.type]
  }

  var set_scale = function (scale) {
    this.settings.set_conditional(this.type + '_scale', scale)
    this.scale = scale
    this.update()
  }.bind(this)

  // ---------------------------------------------------------------------
  // Make the gradient
  // ---------------------------------------------------------------------

  var sorted_domain = scale.map(function (d) {
    var frac = stats.max === stats.min
        ? (d.type === 'min' ? 0 : -1)
        : (get_this_val(d) - stats.min) / (stats.max - stats.min)
    return {
      frac: frac,
      color: d.color,
    }
  }).filter(function (d) {
    return (d.frac >= 0 && d.frac <= 1.0)
  }).sort(function (a, b) {
    return a.frac - b.frac
  })

  var stops = this.gradient.selectAll('stop')
    .data(sorted_domain)
  stops.enter()
    .append('stop')
    .merge(stops)
    .attr('offset', function (d) {
      return d.frac * 100 + '%'
    }).style('stop-color', function (d) {
      return d.color === null ? '#F1ECFA' : d.color
    })
  stops.exit().remove()

  // ---------------------------------------------------------------------
  // No data sign
  // ---------------------------------------------------------------------

  this.data_not_loaded.style('visibility', (data_not_loaded ? null : 'hidden'))

  // ---------------------------------------------------------------------
  // Make sure the pickers will not overlap
  // ---------------------------------------------------------------------

  var width = this.w
  var last_loc = 0
  var scale_for_pickers = scale.sort(function (a, b) {
    return get_this_val(a) - get_this_val(b)
  }).map(function (d, i) {
    // var next = sorted_lookup[i + 1].index
    // make sure we distribute between these if necessary
    var val = get_this_val(d)
    var buf = bar_w + 2
    var adjusted_x
    if (d.type === 'value' && val <= stats.min) {
      adjusted_x = sc.invert(stats.min) - (bar_w / 2) + x_disp - buf
    } else if (d.type === 'value' && val >= stats.max) {
      adjusted_x = sc.invert(stats.max) - (bar_w / 2) + x_disp + buf
    } else {
      adjusted_x = sc.invert(val) - (bar_w / 2) + x_disp
    }
    // Move away from edges
    if (d.type !== 'min' && d.type !== 'max') {
      adjusted_x = Math.min(Math.max(adjusted_x, last_loc + buf), width - 2)
    }
    last_loc = adjusted_x
    return Object.assign({}, d, { adjusted_x: adjusted_x })
  }.bind(this))

  // ---------------------------------------------------------------------
  // Make the pickers
  // ---------------------------------------------------------------------

  var pickers = this.pickers_group
      .selectAll('.picker')
      .data(scale_for_pickers)
  // drag
  var drag = d3_drag()
      .on('start', bring_to_front)
      .on('drag', function (d, i) {
        // on drag, make it a value type
        if ([ 'value', 'min', 'max' ].indexOf(scale[i].type) === -1) {
          // get the current value and set it
          scale[i].value = get_this_val(d)
          scale[i].type = 'value'
        }
        // change the model on drag
        var new_d = scale[i].value + sc_size(d3_selection.event.dx)
        var buf = sc_size(bar_w + 2)
        if (new_d > stats.max - buf) {
          new_d = stats.max - buf
        }
        if (new_d < stats.min + buf) {
          new_d = stats.min + buf
        }
        // round to 2 decimals
        new_d = Math.floor(new_d * 100.0) / 100.0
        scale[i].value = new_d
        this.settings.set_conditional(this.type + '_scale', scale)
        this.scale = scale
        this.update()
      }.bind(this))

  // enter
  pickers.enter()
    .append('g')
    .attr('class', 'picker')
    .style('cursor', 'pointer')
    .append('rect')
  // update
    .merge(pickers)
    .select('rect')
    .attr('x', function (d, i) {
      return d.adjusted_x
    })
    .attr('width', bar_w + 'px')
    .attr('height', bar_h + 'px')
    .call(drag)
  // exit
  pickers.exit().remove()

  // ---------------------------------------------------------------------
  // make the delete buttons
  // ---------------------------------------------------------------------

  var trashes = this.trash_group.selectAll('span')
    .data(scale_for_pickers)
  // enter
  trashes.enter()
    .append('span')
  // update
    .merge(trashes)
    .attr('class', function (d, i) {
      if (d.type === 'min' || d.type === 'max') {
        return null
      }
      return 'trash glyphicon glyphicon-trash'
    })
    .style('left', function (d) {
      // return sc.invert(get_this_val(d)) - (bar_w / 2) + x_disp + 'px'
      return d.adjusted_x + 'px'
    })
    .on('click', function (d, i) {
      if (d.type === 'min' || d.type === 'max') {
        return
      }
      scale = scale.slice(0, i).concat(scale.slice(i + 1))
      this.settings.set_conditional(this.type + '_scale', scale)
      this.scale = scale
      this.update()
    }.bind(this))
  // exit
  trashes.exit().remove()

  // ---------------------------------------------------------------------
  // make the add button
  // ---------------------------------------------------------------------

  var add = this.add_group.selectAll('.add')
    .data([ 'add' ])
  // enter
  add.enter()
    .append('span')
    .attr('class', 'add glyphicon glyphicon-plus')
  // update
    .merge(add)
    .on('click', function (d) {
      if (data_not_loaded) {
        return
      }
      var new_d = (stats.max + stats.min) / 2
      var buf = sc_size(bar_w + 2)
      var last_ind = 0
      // try to make the new point not overlap
      for (var j = 0, l = scale.length; j < l; j++) {
        var th = get_this_val(scale[j])
        if (Math.abs(th - new_d) < buf) {
          new_d = new_d + buf
          if (new_d > stats.max - buf) new_d = stats.max - buf
          if (new_d < stats.min + buf) new_d = stats.min + buf
        }
        if (new_d > th) {
          last_ind = j
        }
      }
      // add
      scale.push({
        type: 'value',
        value: new_d,
        color: scale[last_ind].color,
        size: scale[last_ind].size
      })
      set_scale(scale)
    }.bind(this))
  // exit
  add.exit().remove()

  // ---------------------------------------------------------------------
  // input labels
  // ---------------------------------------------------------------------

  var labels = this.input_label_group.selectAll('.row-label')
    .data(['Value:', 'Color:', 'Size:'])
  // enter
  labels.enter().append('div')
    .attr('class', 'row-label')
    .style('height', this.input_height + 'px')
    .style('line-height', this.input_height + 'px')
  // update
    .merge(labels)
    .style('top', function (d, i) {
      return 56 + (i * this.input_height) + 'px'
    }.bind(this))
    .text(function (d) { return d })
  // exit
  labels.exit().remove()

  // ---------------------------------------------------------------------
  // inputs
  // ---------------------------------------------------------------------

  var inputs = this.input_group.selectAll('.input-set')
    .data(scale_for_pickers)

  // enter
  var inputs_enter = inputs.enter()
    .append('div')
      .attr('class', 'input-set')
  inputs_enter.append('input')
      .attr('class', 'domain-input')
    .style('width', this.input_width + 'px')
  // type picker
  inputs_enter.append('select')
    .attr('class', 'domain-type-picker'),
  // color input
  inputs_enter.append('input')
    .attr('class', 'color-input')
    .style('width', this.input_width + 'px')
  inputs_enter.append('input')
    .attr('type', 'color')
    .style('visibility', function() {
      // hide the input if the HTML5 color picker is not supported
      return (this.type == 'text') ? 'hidden' : null
    })
    .attr('class', 'color-picker')
  inputs_enter.append('input')
    .attr('class', 'size-input')
    .style('width', this.input_width + 'px')

  // update
  var inputs_update = inputs_enter.merge(inputs)
  inputs_update
    .style('height', this.input_height * 3 + 'px')
    .style('width', this.input_width + 'px')
    .style('left', function (d) {
      var l = d.adjusted_x
      // don't go over the right edge of the bar
      if (l + this.input_width > this.w + this.x) {
        l = l - this.input_width + (bar_w / 2)
      }
      return l + 'px'
    }.bind(this))
    .on('mousedown', bring_to_front)

  var format = d3_format('.4g')
  inputs_update
    .select('.domain-input')
    .style('height', this.input_height + 'px')
    .each(function (d, i) {
      if (d.type == 'value') {
        this.value = get_this_val(d)
        this.disabled = false
      } else {
        this.value = d.type + ' (' + format(get_this_val(d)) + ')'
        this.disabled = true
      }
    }).on('change', function(d, i) {
      var buf = sc_size(bar_w + 2),
      new_d = parseFloat(this.value)
      scale[i].value = new_d
      set_scale(scale)
    })
  // update type picker
  var select = inputs_update.select('.domain-type-picker')
  // get the function types, except min and max
  var stat_types = ([ 'value' ].concat(Object.keys(stats))
                    .filter(function(x) {
                      return x !== 'min' && x !== 'max'
                    }))
  var opts = select.selectAll('option').data(stat_types)

  opts.enter().append('option')
    .merge(opts)
    .attr('value', function (d) { return d })
    .text(function (d) { return d })
  opts.exit().remove()

  select
    .style('visibility', function(d) {
      return (d.type == 'min' || d.type == 'max') ? 'hidden' : null
    })
    .style('left', (this.input_width - 20) + 'px')
    .style('width', '20px')
    .each(function (d, i) {
      var sind = 0
      d3_select(this).selectAll('option').each(function(_, i) {
        if (this.value == d.type)
          sind = i
      })
      this.selectedIndex = sind
    }).on('change', function(d, i) {
      // set the value to the current location
      if (this.value == 'value')
        scale[i].value = stats[d.type]
      // switch to the new type
      scale[i].type = this.value
      // reload
      set_scale(scale)
    })
  // update color input
  inputs_update.select('.color-input')
    .style('height', this.input_height + 'px')
    .style('top', this.input_height + 'px')
    .each(function (d, i) {
      this.value = (d.color === null ? '' : d.color)
      this.disabled = (d.color === null)
    }).on('change', function(d, i) {
      scale[i].color = this.value
      set_scale(scale)
    })
  inputs_update.select('.color-picker')
    .style('left', (this.input_width - this.input_height) + 'px')
    .style('top', this.input_height + 'px')
    .style('width', this.input_height + 'px')
    .style('height', this.input_height + 'px')
    .each(function (d, i) {
      this.value = (d.color === null ? '#dddddd' : d.color)
      this.disabled = (d.color === null)
    })
    .on('change', function(d, i) {
      scale[i].color = this.value
      set_scale(scale)
    })
  inputs_update.select('.size-input')
    .style('height', this.input_height + 'px')
    .style('top', this.input_height * 2 + 'px')
    .each(function (d, i) {
      this.value = (d.size === null ? '' : d.size)
      this.disabled = (d.size === null)
    }).on('change', function(d, i) {
      scale[i].size = parseFloat(this.value)
      set_scale(scale)
    })

  // exit
  inputs.exit().remove()
}

function update_no_data () {
  var no_data = this.no_data
  var data_not_loaded = this._data_not_loaded()
  var label_w = 40

  var ins = this.no_data_container
    .selectAll('.input-group')
    .data([ [ 'color', 'Color:' ], [ 'size', 'Size:' ] ])
  // enter
  var ins_enter = ins.enter().append('div')
    .attr('class', 'input-group')
  ins_enter.append('span')
  ins_enter.append('input')
  ins_enter.append('input')
    .attr('type', 'color')
    .style('visibility', function (d) {
      // hide the input if the HTML5 color picker is not supported,
      // or if this is a size box
      return (this.type === 'text' || d[0] !== 'color') ? 'hidden' : null
    })
    .attr('class', 'color-picker')
  // update
  var ins_update = ins_enter.merge(ins)
  ins_update.select('span')
    .text(function(d) { return d[1] })
    .style('height', this.input_height + 'px')
    .style('line-height', this.input_height + 'px')
    .style('left', function(d, i) {
      return ((label_w + this.input_width + 10) * i) + 'px'
    }.bind(this))
  var get_o = function(kind) {
    return this.settings.get_option(this.type + '_no_data_' + kind)
  }.bind(this)
  ins_update.select('input')
    .style('left', function (d, i) {
      return (label_w + (label_w + this.input_width + 10) * i) + 'px'
    }.bind(this))
    .style('height', this.input_height + 'px')
    .style('width', this.input_width + 'px')
    .each(function (d) {
      // initial value
      this.value = data_not_loaded ? '' : no_data[d[0]]
      this.disabled = data_not_loaded
    })
    .on('change', function (d) {
      var val = d3_selection.event.target.value
      if (d[0] === 'size') {
        val = parseFloat(val)
      }
      this.no_data[d[0]] = val
      this.settings.set_conditional(this.type + '_no_data_' + d[0], val)
      this.update_no_data()
    }.bind(this))
  ins_update.select('.color-picker')
    .style('left', function (d, i) {
      return ((label_w + this.input_width) * (i + 1) - this.input_height) + 'px'
    }.bind(this))
    .style('width', this.input_height + 'px')
    .style('height', this.input_height + 'px')
    .each(function (d, i) {
      this.value = data_not_loaded ? '#dddddd' : no_data[d[0]]
      this.disabled = data_not_loaded
    })
    .on('change', function (d, i) {
      var val = d3_selection.event.target.value
      this.no_data[d[0]] = val
      this.settings.set_conditional(this.type + '_no_data_' + d[0], val)
      this.update_no_data()
    }.bind(this))
  // exit
  ins.exit().remove()
}

function _data_not_loaded() {
  var stats = this.get_data_statistics()[this.type]
  return (stats.max === null || stats.min === null)
}
