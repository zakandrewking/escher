/**
 * TimeSeriesBar
 *
 */

var utils = require('./utils')
var CallbackManager = require('./CallbackManager')
var _ = require('underscore')
var d3_select = require('d3-selection').select
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

      //d3_select('#checkBoxChartLabel').text('Overview Chart')
      //d3_select('#checkBoxChart').property('checked', false)

      d3_select('#checkBoxChart').style('opacity', 0)
      d3_select('#checkBoxChartLabel').style('opacity', 0)

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


      d3_select('#checkBoxChart').style('opacity', 1)
      d3_select('#checkBoxChart').property('checked', false)

      d3_select('#checkBoxChartLabel').style('opacity', 1)
      d3_select('#checkBoxChartLabel').text('Sliding Window')


    })
    .style('background-color', 'lightgrey')
    .style('width', '45%')
    .text('Difference Mode')

  var tab_container = box.append('div').attr('id', 'tab_container')

  tab_container.append('select')
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

    })
    .style('display', 'none')

  var groupButtons = tab_container.append('div').attr('id', 'group_buttons')//.attr('class', 'btn-group btn-group-sm')

  groupButtons.append('button')
    .attr('class', 'btn btn-default')
    .attr('id', 'play_button')
    .style('margin', '2px')
    .on('click', function () {
      play_time_series(builder, map, duration, both_data_play_back, sliding_window)
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
    .attr('value', duration)
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

        } else {
          sliding_window = false
        }
      } else {
        if (builder.difference_mode) {
          sliding_window = false
        } else {

        }
      }
    })
    .style('opacity', 0)

  groupButtons.append('label')
    .attr('for', 'checkBoxChart')
    .attr('id', 'checkBoxChartLabel')
    .text('Overview Chart')
    .style('opacity', 0)

  this.callback_manager = new CallbackManager()

  this.selection = container

}

// TODO: I need only one tab
function openTab (builder, map) {

  d3_select('#tab_container').style('display', 'block')

  d3_select('#reaction_tab_button').style('background-color', 'lightgrey')
  d3_select('#metabolite_tab_button').style('background-color', 'lightgrey')
  d3_select('#both_tab_button').style('background-color', 'lightgrey')

  var tabs = document.getElementsByClassName('tab')

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none'
  }

  if (builder.type_of_data === 'reaction') {
    d3_select('#reaction_tab_button').style('background-color', 'white')
    update(builder, builder.map)
  } else if (builder.type_of_data === 'gene') {
    d3_select('#reaction_tab_button').style('background-color', 'white')
    update(builder, builder.map)
  } else if (builder.type_of_data === 'metabolite') {
    d3_select('#metabolite_tab_button').style('background-color', 'white')
    update(builder, builder.map)
  }

}

/**
 *  Updates the GUI
 *  if a data set is loaded
 *   set to specific data set
 *   set slider to max of data set length
 *   set counter to 0 of data
 *   set dropdown menu length
 *  else
 *   reset everything
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

    // reset stats
    builder.map.interpolation = false
    duration = 2000

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
  }
}

/*
 *
 */
function play_time_series (builder, map, duration, both_data_play_back, sliding_window) {

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

    var sliding_window_size = 1

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
            tick = array_of_time_points[this.sliding_window_start]
          }
          animate_slider()

          builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)

        } else {

          if (tick >= array_of_time_points[end]) {
            tick = array_of_time_points[this.sliding_window_start]
            animate_slider(0)

          } else {
            tick++

          }
        }

      }
    }

    // animation
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

function showDifferenceData (builder) {
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
    this.clear_escape = this.map.key_manager
      .add_escape_listener(function () {
        this.toggle(false)
      }.bind(this), true)

  } else {

    this.map.highlight(null)
    this.selection.style('display', 'none')

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