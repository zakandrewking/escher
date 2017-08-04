/**
 * TimeSeriesBar
 *
 */

var utils = require('./utils')
var CallbackManager = require('./CallbackManager')
var _ = require('underscore')
var data_styles = require('./data_styles.js')
var d3_select = require('d3-selection').select
var d3_scale = require('d3-scale')
var d3_interpolate = require('d3-interpolate')
var d3 = require('d3')
var d3_ease = require('d3-ease')
var TimeSeriesBar = utils.make_class()

TimeSeriesBar.prototype = {
  init: init,
  update: update,
  is_visible: is_visible,
  toggle: toggle,
  showDifferenceData: showDifferenceData,
  openTab: openTab
}
module.exports = TimeSeriesBar

function init (sel, map, builder, type_of_data) {

  this.builder = builder

  var duration = 2000
  this.playing = false

  builder.difference_mode = false
  builder.reference = 0
  builder.target = 0

  this.map = map
  this.current = 0

  this.type_of_data = type_of_data

  var both_data_play_back = false
  var sliding_window = false

  var container = sel.append('div').append('div')
    .attr('class', 'settings-box')
    .attr('id', 'container')
    .style('display', 'block') // TODO: remove this comment in final version

  var max_width = container.node().getBoundingClientRect().width

  var box = container.append('div')

  // tabbed layout

  box.append('button')
    .attr('class', 'btn btn-sm btn-default close-button')
    .on('click', function () {
      this.toggle(false)
    }.bind(this))
    .append('span')
    .attr('class', 'glyphicon glyphicon-remove')

  // three buttons
  box.append('button')
    .attr('id', 'reaction_tab_button')
    .on('click', function (builder) {
      both_data_play_back = false
      openTab('reaction', builder)
    })
    .style('background-color', 'lightgrey')
    .style('width', '45%')
    .text('Reaction / Gene Data')

  box.append('button')
    .attr('id', 'metabolite_tab_button')
    .on('click', function (builder) {
      both_data_play_back = false
      openTab('metabolite', builder)
    })
    .style('background-color', 'lightgrey')
    .style('width', '45%')
    .text('Metabolite Data')

  var second_row_buttons = box.append('div')

  var time_series_button = second_row_buttons.append('button')
    .on('click', function (builder) {
      time_series_button.style('background-color', 'white')
      difference_mode_button.style('background-color', 'lightgrey')
      builder.difference_mode = false

      groupButtons.style('display', 'block')
      d3_select('#dropDownMenuTarget').style('display', 'none')
      d3_select('#sliderTarget').style('display', 'none')

      d3_select('#checkBoxChartLabel').text('Overview Chart')
      d3_select('#checkBoxChart').property('checked', false)

    })
    .style('background-color', 'white')
    .style('width', '45%')
    .text('Time Series')

  var difference_mode_button = second_row_buttons.append('button')
    .on('click', function (builder) {
      time_series_button.style('background-color', 'lightgrey')
      difference_mode_button.style('background-color', 'white')
      builder.difference_mode = true
      showDifferenceData(builder)

      groupButtons.style('display', 'block')
      d3_select('#dropDownMenuTarget').style('display', 'block')
      d3_select('#sliderTarget').style('display', 'block')

      d3_select('#checkBoxChartLabel').text('Sliding Window')
      d3_select('#checkBoxChart').property('checked', false)
    })
    .style('background-color', 'lightgrey')
    .style('width', '45%')
    .text('Difference Mode')

  var tab_container = box.append('div').attr('id', 'tab_container')

  tab_container.append('select')
  //.attr('name', 'target-list')
    .attr('id', 'dropDownMenuReference')
    .style('margin', '2px')
    .on('change', function (builder) {

      builder.reference = this.value
      d3_select('#sliderReference').property('value', this.value)
      d3_select('#referenceText').text('Reference Data Set: ' + this.value)
      this.current = this.value

      if (builder.difference_mode) {
        showDifferenceData(builder)
      } else {
        builder.set_data_indices(builder.type_of_data, builder.reference)
      }

      if (d3_select('#checkBoxChart').property('checked')) {
        toggle_chart(false)
        toggle_chart(true)
        create_chart(builder, map)
      }

    })

  tab_container.append('input')
    .attr('id', 'sliderReference')
    .style('margin', '2px')
    .attr('type', 'range')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', 0)
    .attr('step', 1)
    .on('change', function (builder) {
      builder.reference = this.value
      d3_select('#dropDownMenuReference').property('selectedIndex', this.value)
      d3_select('#referenceText').text('Reference Data Set: ' + this.value)
      this.current = this.value

      if (builder.difference_mode) {
        showDifferenceData(builder)
      } else {
        if (d3_select('#checkBoxChart').property('checked')) {
          toggle_chart(false)
          toggle_chart(true)
          create_chart(builder, map)
        }
        builder.set_data_indices(builder.type_of_data, builder.reference)
      }
    })

  tab_container.append('select')
  //.attr('name', 'target-list')
    .attr('id', 'dropDownMenuTarget')
    .style('margin', '2px')
    .on('change', function (builder) {

      builder.target = this.value
      d3_select('#sliderTarget').property('value', this.value)
      d3_select('#targetText').text('Target Data Set ' + this.value)

      if (builder.difference_mode) {
        showDifferenceData(builder)
        d3_select('#checkBoxChart').property('checked', false)
      }

      if (d3_select('#checkBoxChart').property('checked')) {
        toggle_chart(false)
        toggle_chart(true)
        create_chart(builder, map)
      }
    })
    .style('display', 'none')

  tab_container.append('input')
    .attr('type', 'range')
    .attr('id', 'sliderTarget')
    .style('margin', '2px')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', 0)
    .on('change', function (builder) {

      builder.target = this.value
      d3_select('#dropDownMenuTarget').property('selectedIndex', this.value)
      d3_select('#targetText').text('Target Data Set ' + this.value)

      if (builder.difference_mode) {
        showDifferenceData(builder)
        d3_select('#checkBoxChart').property('checked', false)
      }

      if (d3_select('#checkBoxChart').property('checked')) {
        toggle_chart(false)
        toggle_chart(true)
        create_chart(builder, map)
      }
    })
    .style('display', 'none')

  var groupButtons = tab_container.append('div').attr('id', 'group_buttons')//.attr('class', 'btn-group btn-group-sm')

  groupButtons.append('button')
    .attr('class', 'btn btn-default')
    .attr('id', 'play_button')
    .style('margin', '2px')
    .on('click', function () {
      play_time_series(builder, map, duration, map.interpolation, 10, both_data_play_back, sliding_window)
    })
    .append('span').attr('class', 'glyphicon glyphicon-play')

  groupButtons.append('label')
    .attr('for', 'inputDuration')
    .style('margin', '2px')
    .text('Duration (ms)')

  groupButtons
    .append('input')
    .attr('id', 'inputDuration')
    .style('margin', '2px')
    .attr('type', 'number')
    .attr('min', 10)
    .attr('value', 2000)
    .style('width', '60px')
    .on('input', function () {
      duration = this.value
    })

  groupButtons
    .append('input')
    .attr('type', 'checkbox')
    .attr('id', 'checkBoxInterpolation')
    .attr('value', 'Interpolate Data')
    .style('margin', '2px')
    .on('change', function () {
      if (d3_select('#checkBoxInterpolation').property('checked')) {
        map.interpolation = true
      } else {
        map.interpolation = false
      }
    })

  groupButtons.append('label')
    .attr('for', 'checkBoxInterpolation')
    .text('Interpolation')

  groupButtons
    .append('input')
    .style('margin', '2px')
    .attr('type', 'checkbox')
    .attr('id', 'checkBoxChart')
    .attr('value', 'Show Chart')
    .text('Show Chart')
    .on('change', function () {
      if (d3_select('#checkBoxChart').property('checked')) {

        if (builder.difference_mode) {
          sliding_window = true
          toggle_chart(false)

        } else {
          sliding_window = false
          toggle_chart(true)
          create_chart(builder, map)
        }
      } else {
        if (builder.difference_mode) {
          sliding_window = false
          toggle_chart(false)
        } else {
          toggle_chart(false)

        }
      }
    })

  groupButtons.append('label')
    .attr('for', 'checkBoxChart')
    .attr('id', 'checkBoxChartLabel')
    .text('Overview Chart')

  this.chart_width = d3_select('#container').node().getBoundingClientRect().width
  this.chart_height = 300 //chart_container.node().getBoundingClientRect().height

  var chart_container = d3_select('#container').append('div').attr('id', 'div_data_chart')
    .attr('width', this.chart_width)
    .attr('height', this.chart_height)
  //.style('width', '79%')
  //.style('display','none')

  chart_container
    .append('svg')
    .attr('id', 'svg_data_chart')
    .attr('width', this.chart_width)
    .attr('height', this.chart_height)
    .style('display', 'block')

  this.callback_manager = new CallbackManager()

  this.selection = container

  toggle_chart(false)
}

// TODO: I need only one tab
function openTab (type_of_data, builder) {

  d3_select('#tab_container').style('display', 'block')

  d3_select('#reaction_tab_button').style('background-color', 'lightgrey')
  d3_select('#metabolite_tab_button').style('background-color', 'lightgrey')
  d3_select('#both_tab_button').style('background-color', 'lightgrey')

  var tabs = document.getElementsByClassName('tab')

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none'
  }

  builder.type_of_data = type_of_data

  if (builder.type_of_data === 'reaction') {
    d3_select('#reaction_tab_button').style('background-color', 'white')
    //reaction_tab.style('display', 'block')
    update(builder)
  } else if (builder.type_of_data === 'gene') {
    d3_select('#reaction_tab_button').style('background-color', 'white')
    //reaction_tab.style('display', 'block')
    update(builder)
  } else if (builder.type_of_data === 'metabolite') {
    d3_select('#metabolite_tab_button').style('background-color', 'white')
    //metabolite_tab.style('display', 'block')
    update(builder)
  }
  else if (builder.type_of_data === 'both') {
    //both_tab.style('display', 'block')
    d3_select('#both_tab_button').style('background-color', 'white')
    update(builder)
  } else {
// ?
  }

}

/**
 *  Update the GUI
 *
 * set to specific data set
 * set slider to max of data
 * set counter to 0 of data length
 * set dropdown menu length
 *
 */

function update (builder) {

  var currentDataSet = get_current_data_set(builder)

  if (currentDataSet !== null) {
    // update display
    this.current = 0
    d3_select('#counter').text('Display Dataset: ' + (this.current + 1) + ' / ' + currentDataSet.length)

    // update slider
    d3_select('#sliderReference')
      .attr('max', (currentDataSet.length - 1))
      .attr('value', 0)

    d3_select('#sliderTarget')
      .attr('max', (currentDataSet.length - 1))
      .attr('value', 0)

    d3_select('#referenceText').text('Reference Data Set: ' + this.current)
    d3_select('#targetText').text('Target Data Set: ' + this.current)

    document.getElementById('dropDownMenuReference').options.length = 0
    document.getElementById('dropDownMenuTarget').options.length = 0

    for (var x in currentDataSet) {

      var name_of_current_data_set = x

      if (builder.type_of_data === 'reaction') {
        name_of_current_data_set = builder.reaction_data_names[x]

      } else if (builder.type_of_data === 'metabolite') {
        name_of_current_data_set = builder.metabolite_data_names[x]

      } else if (builder.type_of_data === 'gene') {
        name_of_current_data_set = builder.gene_data_names[x]
      }

      d3_select('#dropDownMenuReference').append('option')
        .attr('value', x).text('Reference Data Set: ' + name_of_current_data_set)
      d3_select('#dropDownMenuTarget').append('option')
        .attr('value', x).text('Target Data Set: ' + name_of_current_data_set)

    }

  } else { // reset everything
    // update display
    this.current = 0
    d3_select('#counter').text('Display Dataset: 0 / 0')

    // update slider
    d3_select('#sliderReference')
      .attr('max', 0)
      .attr('value', 0)

    d3_select('#sliderTarget')
      .attr('max', 0)
      .attr('value', 0)

    d3_select('#referenceText').text('Reference Data Set: ')
    d3_select('#targetText').text('Target Data Set: ')

    d3_select('#checkBoxChart').property('checked', false)
    d3_select('#checkBoxInterpolation').property('checked', false)

    // reset dropdown menu
    document.getElementById('dropDownMenuReference').options.length = 0
    document.getElementById('dropDownMenuTarget').options.length = 0

    toggle_chart(false)
  }
}

// function next (builder) {
//
//   if (this.current < get_current_data_set(builder).length - 1) {
//     this.current++
//   }
//   d3_select('#counter').text('Display Dataset: ' + get_current_data_set_names(builder)[this.current])
//   d3_select('#sliderReference').property('value', this.current)
//   d3_select('#referenceText').text('Reference Data Set: ' + this.current)
//   d3_select('#dropDownMenuReference').property('selectedIndex', this.current)
//   builder.set_data_indices(builder.type_of_data, this.current)
// }
//
// function previous (builder) {
//
//   if (this.current > 0) {
//     this.current--
//   }
//   d3_select('#counter').text('Display Dataset: ' + get_current_data_set_names(builder)[this.current])
//   d3_select('#sliderReference').property('value', this.current)
//   d3_select('#referenceText').text('Reference Data Set: ' + this.current)
//   d3_select('#dropDownMenuReference').property('selectedIndex', this.current)
//
//   builder.set_data_indices(builder.type_of_data, this.current)
// }

/*
 *
 */
function play_time_series (builder, map, duration, interpolation, max_steps, both_data_play_back, sliding_window) {

  if (!this.playing) {
    this.playing = true

    this.sliding_window_start = parseInt(builder.reference)
    this.sliding_window_end = parseInt(builder.target)

    // array of time points for non-linear time scale
    var array_of_time_points = get_array_of_time_points(builder, map)

    var tick = array_of_time_points[this.sliding_window_start]
    var time_point = this.sliding_window_start

    // difference mode
    var start = parseInt(builder.reference)
    var end = parseInt(get_current_data_set(builder).length - 1)

    if (builder.difference_mode && !sliding_window) {
      builder.target = parseInt(builder.reference)
    }

    // sliding window mode
    var sliding_window_reference = builder.reference
    var sliding_window_target = builder.target
    var sliding_window_size = (parseInt(builder.target) - parseInt(builder.reference))

    var duration = duration / (end - start)

    map.transition_duration = duration

    /*

     */
    function play (builder, sliding_window) {

      if (sliding_window) {

        if (tick === array_of_time_points[time_point]) {

          if (parseInt(builder.target) < parseInt(end)) {

            builder.reference = parseInt(builder.reference) + 1
            builder.target = parseInt(builder.reference) + sliding_window_size

            d3_select('#sliderReference').property('value', builder.reference)
            d3_select('#dropDownMenuReference').property('selectedIndex', builder.reference)
            d3_select('#sliderTarget').property('value', builder.target)
            d3_select('#dropDownMenuTarget').property('selectedIndex', builder.target)

            time_point++
            tick++

          } else { // play as loop
            builder.reference = this.sliding_window_start
            builder.target = this.sliding_window_start + sliding_window_size

            time_point = start
            tick = array_of_time_points[start]

            d3_select('#sliderReference').property('value', builder.reference)
            d3_select('#dropDownMenuReference').property('selectedIndex', builder.reference)
            d3_select('#sliderTarget').property('value', builder.target)
            d3_select('#dropDownMenuTarget').property('selectedIndex', builder.target)
          }

          builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)

        } else {

          if (tick >= array_of_time_points[end]) {
            tick = array_of_time_points[start]

            d3_select('#sliderReference').property('value', start)
            d3_select('#dropDownMenuReference').property('selectedIndex', start)
            d3_select('#sliderTarget').property('value', start + sliding_window_size)
            d3_select('#dropDownMenuTarget').property('selectedIndex', start + sliding_window_size)

            builder.reference = this.sliding_window_start
            builder.target = this.sliding_window_start + sliding_window_size

          } else {
            tick++

            d3_select('#sliderReference').property('value', start)
            d3_select('#dropDownMenuReference').property('selectedIndex', start)
            d3_select('#sliderTarget').property('value', start + sliding_window_size)
            d3_select('#dropDownMenuTarget').property('selectedIndex', start + sliding_window_size)

          }
        }

      } else if (builder.difference_mode) {

        if (tick === array_of_time_points[time_point]) {

          // reference is static, next goes from reference + 1 to end
          builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)

          var next = builder.target

          d3_select('#sliderTarget').property('value', next)
          d3_select('#dropDownMenuTarget').property('selectedIndex', next)

          if (parseInt(builder.target) < end) {
            next++
            builder.target = next

            time_point++
            tick++

          } else { // play as loop
            //builder.reference = start
            builder.target = start

            time_point = start
            tick = array_of_time_points[start]
          }

        } else {

          if (tick >= array_of_time_points[end]) {
            tick = array_of_time_points[start]
            d3_select('#sliderTarget').property('value', start)
            d3_select('#dropDownMenuTarget').property('selectedIndex', start)

          } else {
            tick++
            d3_select('#sliderTarget').property('value', builder.target)
            d3_select('#dropDownMenuTarget').property('selectedIndex', builder.target)

          }

        }

      } else {
        // TODO: handle interpolated data with non-linear time scale: set duration to next tick
        if (tick === array_of_time_points[time_point]) {

          if (both_data_play_back) {
            builder.set_data_indices('reaction', builder.reference, this.sliding_window_end)
            builder.set_data_indices('metabolite', builder.reference, this.sliding_window_end)
          } else {
            builder.set_data_indices(builder.type_of_data, builder.reference, this.sliding_window_end)
          }

          if (parseInt(builder.reference) < end) {
            var next = builder.reference
            next++
            builder.reference = next

            time_point++
            tick++

          } else { // play as loop
            builder.reference = this.sliding_window_start

            time_point = this.sliding_window_start
            //tick = this.sliding_window_start - 1
            tick = array_of_time_points[this.sliding_window_start]
          }
          animate_time_line(tick, duration)
          animate_slider()

          builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)

        } else {

          if (tick >= array_of_time_points[end]) {
            tick = array_of_time_points[this.sliding_window_start]
            animate_time_line(tick, 0)
            animate_slider(0)

          } else {
            tick++
            animate_time_line(tick, duration)

          }
        }

      }
    }

    // animation
    animate_time_line(this.sliding_window_start, 0)
    //animate_slider(0)
    this.animation = setInterval(function () { play(builder, sliding_window) }, duration)

  } else { // clear animation and reset data

    clearInterval(this.animation)

    this.playing = false

    builder.reference = this.sliding_window_start
    if (builder.difference_mode) {
      builder.target = parseInt(builder.reference) + 1
    } else {
      builder.target = this.sliding_window_end

    }
  }
}

function toggleDifferenceMode (builder) {

  if (builder.difference_mode) {
    builder.difference_mode = false
    builder.reference = 0
    builder.target = 0
  } else {
    builder.difference_mode = true
  }

}

function showDifferenceData (builder) {
  toggle_chart(false)
  builder.difference_mode = true
  builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)
}

function is_visible () {
  return this.selection.style('display') !== 'none'
}

function toggle (on_off) {
  if (on_off === undefined) this.is_active = !this.is_active
  else this.is_active = on_off

  if (this.is_active) {
    this.selection.style('display', null)
    //container.style('display', 'block')

    this.clear_escape = this.map.key_manager
      .add_escape_listener(function () {
        this.toggle(false)
      }.bind(this), true)

    // TODO: run the show callback. why?
    //this.callback_manager.run('show')

  } else {

    // TODO: reset all data here or keep for animation in background?
    this.map.highlight(null)

    // TODO: set this to 'none'
    this.selection.style('display', 'block')

    // container.style('display', 'none')

    // TODO: run the show callback. why?
    // this.callback_manager.run('hide')
  }

}

function create_chart (builder, map) {

  var current_data_set = []
  var data_set_loaded = false

  builder.reference = 0
  builder.target = get_current_data_set(builder).length - 1

  for (var i = parseInt(builder.reference); i <= parseInt(builder.target); i++) {
    current_data_set.push(get_current_data_set(builder)[i])
  }

  if (current_data_set[0] !== undefined) {
    data_set_loaded = true
  }

  if (data_set_loaded) {

    toggle_chart(true)

    this.margins = {
      top: 6,
      right: 10,
      bottom: 6,
      left: 20
    }

    var data_chart = d3_select('#svg_data_chart')

    var svg_width = d3_select('#svg_data_chart').node().getBoundingClientRect().width
    var width = svg_width - margins.left - margins.right
    var height = d3_select('#svg_data_chart').node().getBoundingClientRect().height - margins.bottom - margins.top

    var color = d3_scale.schemeCategory20

    var data_for_lines = []
    var labels_for_lines = Object.keys(current_data_set[0])
    var array_of_time_points = get_array_of_time_points(builder, map)

    var domain_y_scale_min = d3.min(d3.values(current_data_set[0]))
    var domain_y_scale_max = d3.max(d3.values(current_data_set[0]))

    var domain_x_scale_min = array_of_time_points[builder.reference]
    var domain_x_scale_max = array_of_time_points[builder.target]

    // for all data keys create chart data

    for (var k in Object.keys(current_data_set[0])) { // for each key

      var data_for_line = []

      // save identifier for label
      //labels_for_lines.push(key)

      var time_point_index = builder.reference

      for (var index in current_data_set) { // go though all data sets to collect values
        var data_point = {}
        var key = Object.keys(current_data_set[index])[k]

        var y_value = current_data_set[index][key]

        data_point['x'] = array_of_time_points[time_point_index]
        data_point['y'] = y_value

        if (y_value < domain_y_scale_min) {
          domain_y_scale_min = y_value
        }

        if (y_value > domain_y_scale_max) {
          domain_y_scale_max = y_value
        }

        time_point_index++
        data_for_line.push(data_point)

      }
      data_for_lines.push(data_for_line)
    }

    this.x_scale = d3.scaleLinear()
      .domain([domain_x_scale_min, domain_x_scale_max])
      .range([this.margins.left, width - this.margins.right - 80])

    this.y_scale = d3.scaleLinear()
      .domain([domain_y_scale_min, domain_y_scale_max])
      .range([height - this.margins.top, this.margins.bottom])

    var x_axis = d3.axisBottom(this.x_scale)
    var y_axis = d3.axisLeft(this.y_scale)

    data_chart.append('g')
      .attr('transform', 'translate(0,' + (height - this.margins.bottom) + ')')
      .style('shape-rendering', 'crispEdges')
      .style('stroke', 'black')
      .style('font-size', '8px')
      .style('fill', 'none')
      .call(x_axis)

    data_chart.append('g')
      .attr('transform', 'translate(' + (this.margins.left) + ',0)')
      .style('shape-rendering', 'crispEdges')
      .style('stroke', 'black')
      .style('font-size', '8px')
      .style('fill', 'none')
      .call(y_axis)

    for (var i in data_for_lines) {

      var data = data_for_lines[i]

      var line = d3.line()
        .x(function (data) {
          return this.x_scale(data.x)
        })
        .y(function (data) {
          return this.y_scale(data.y)
        })
        .curve(d3.curveMonotoneX)

      var path = data_chart.append('svg:path')
        .attr('d', line(data))
        .attr('stroke', color[i])
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('id', 'chart_paths')

      d3_select('#svg_data_chart')
        .append('text')
        .attr('x', svg_width - this.margins.right - this.margins.left - 80)
        .attr('y', this.margins.top + 20 + (i * 20))
        .style('fill', color[i])
        .style('font-size', '8px;')
        .style('text-anchor', 'left')
        .text(labels_for_lines[i])
    }

    data_chart.append('rect')
      .attr('id', 'time_line')
      .attr('x', this.x_scale(0))
      // .attr("x2", this.x_scale(0))
      .attr('y', this.margins.bottom)
      //.attr("y2", height)
      .attr('width', 1)
      .attr('height', (height - this.margins.bottom - this.margins.top))
      //.attr("stroke-width", 2)
      .attr('fill', 'red')
    //.attr("stroke-dasharray", "2,2")
    //.attr("transform", "translate(0," + (this.margins.bottom) + ")")

  } else {
    toggle_chart(false)

    map.set_status('Please load in data set')
  }

}

function toggle_chart (show) {

  if (show) {
    d3_select('#div_data_chart').style('display', 'block')
    d3_select('#svg_data_chart').style('display', 'block')
    d3_select('#div_data_chart_labels').style('display', 'block')

  } else {

    //d3_select('#checkBoxChart').property('checked', false)

    d3_select('#svg_data_chart').remove()
    //d3_select('#div_data_chart_labels').remove()

    d3_select('#container').append('div').attr('id', 'div_data_chart')

    d3_select('#div_data_chart')
      .append('svg')
      .attr('id', 'svg_data_chart')
      .attr('width', d3_select('#container').node().getBoundingClientRect().width)
      .attr('height', 200)
      .style('display', 'none')
  }

}

function get_current_data_set (builder) {
  if (builder.type_of_data === 'reaction') {
    return builder.options.reaction_data
  } else if (builder.type_of_data === 'gene') {
    return builder.options.gene_data
  } else if (builder.type_of_data === 'metabolite') {
    return builder.options.metabolite_data
  } else {
    return []
  }
}

function get_current_data_set_names (builder) {
  if (builder.type_of_data === 'reaction') {
    return builder.reaction_data_names
  } else if (builder.type_of_data === 'gene') {
    return builder.gene_data_names
  } else if (builder.type_of_data === 'metabolite') {
    return builder.metabolite_data_names
  } else {
    return []
  }

}

function get_array_of_time_points (builder, map) {

  var array_of_time_points = []
  var time_scale_is_linear

  for (var i in get_current_data_set_names(builder)) {
    var name = get_current_data_set_names(builder)[i]

    if (name.startsWith('t') && typeof parseInt(name.slice(1)) === 'number') { // check if rest of string is a number
      array_of_time_points.push(parseInt(name.slice(1)))
      time_scale_is_linear = false
    } else {
      array_of_time_points.push(parseInt(i))
      time_scale_is_linear = true
    }
  }

  if (time_scale_is_linear) {
    map.set_status('Displaying Linear Time Scale')
  } else {
    map.set_status('Displaying Non Linear Time Scale')
  }

  return array_of_time_points
}

function get_linear_time_scale (builder, map) {

  var time_scale_is_linear

  for (var i in get_current_data_set_names(builder)) {
    var name = get_current_data_set_names(builder)[i]
    time_scale_is_linear = !(name.startsWith('t') && typeof parseInt(name.slice(1)) === 'number')
  }

  return time_scale_is_linear
}

function animate_time_line (tick, transition_duration) {

  if (this.x_scale !== undefined) {
    var time_line = d3.select('#time_line')

    if (tick == 0) {
      transition_duration = 0
    }

    time_line.transition()
      .duration(transition_duration)
      .ease(d3.easeLinear)
      .attr('x', this.x_scale(tick))

  }
}

function animate_slider (set_to) {

  var slider_value = parseInt(d3_select('#sliderReference').property('value'))
  var slider_max = parseInt(d3_select('#sliderReference').property('max'))
  var slider_min = parseInt(d3_select('#sliderReference').property('min'))

  if (set_to !== undefined) {
    slider_value = set_to
  } else if (slider_value < slider_max) {
    slider_value++
  } else {
    slider_value = slider_min
  }

  d3_select('#sliderReference').property('value', slider_value)
  d3_select('#dropDownMenuReference').property('selectedIndex', slider_value)

}