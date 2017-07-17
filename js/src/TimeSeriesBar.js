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
var d3_interpolate = require("d3-interpolate")
var d3 = require('d3')
var TimeSeriesBar = utils.make_class()


// TODO: get rid of global variables
var current

TimeSeriesBar.prototype = {
  init: init,
  update: update,
  is_visible: is_visible,
  toggle: toggle,
  next: next,
  previous: previous,
  //toggleDifferenceMode: toggleDifferenceMode,
  showDifferenceData: showDifferenceData,
  openTab: openTab
}
module.exports = TimeSeriesBar

function init (sel, map, builder, type_of_data) {

  this.builder = builder

  var duration = 2000
  var interpolation = false
  this.playing = false

  this.builder.difference_mode = false
  this.builder.reference = 0
  this.builder.target = 0

  this.map = map

  current = 0

  this.type_of_data = type_of_data

  var both_data_play_back = false

  var container = sel.attr('class', 'search-container')
  // TODO: remove this comment in final version
  .style('display', 'block')

  container.attr('id', 'container')

  container.append('button')
    .attr('class', 'btn btn-sm btn-default close-button')
    .on('click', function () {
      this.toggle(false)
    }.bind(this))
    .append('span')
    .attr('class', 'glyphicon glyphicon-remove')

  var max_width = container.node().getBoundingClientRect().width


  var box = container.append('div')
    .attr('class', 'settings-box')

  // tabbed layout

  // three buttons
  box.append('button')
    .attr('id', 'reaction_tab_button')
    .on('click', function (builder) {
      both_data_play_back = false
      openTab('reaction', builder)
    })
    .style('background-color', 'lightgrey')
    .style('width', '33.3%')
    .text('reaction data')

  box.append('button')
    .attr('id', 'metabolite_tab_button')
    .on('click', function (builder) {
      both_data_play_back = false
      openTab('metabolite', builder)
    })
    .style('background-color', 'lightgrey')
    .style('width', '33.3%')
    .text('metabolite data')

  box.append('button')
    .attr('id', 'both_tab_button')
    .on('click', function (builder) {

      if(builder.options.reaction_data !== null && builder.options.metabolite_data !== null){
        if(builder.options.reaction_data.length === builder.options.metabolite_data.length){
          both_data_play_back = true // TODO: make use
          openTab('both', builder)
        }
      } else {
        both_data_play_back = false
        map.set_status('Please load in data sets of same length')
      }


    })
    .style('background-color', 'lightgrey')
    .style('width', '33.3%')
    .text('both data')

  var second_row_buttons = box.append('div')

  var time_series_button = second_row_buttons.append('button')
    .on('click', function (builder) {
      time_series_button.style('background-color', 'white')
      difference_mode_button.style('background-color', 'lightgrey')
      builder.difference_mode = false
      //toggleDifferenceMode (builder, false)
      groupButtons.style('display', 'block')

    })
    .style('background-color', 'white')
    .style('width', '50%')
    .text('Sliding Window')

  var difference_mode_button = second_row_buttons.append('button')
    .on('click', function (builder) {
      time_series_button.style('background-color', 'lightgrey')
      difference_mode_button.style('background-color', 'white')
      builder.difference_mode = true
      showDifferenceData(builder)
      //toggleDifferenceMode (builder)
      groupButtons.style('display', 'none')
    })
    .style('background-color', 'lightgrey')
    .style('width', '50%')
    .text('Difference Mode')

  tab_container = box.append('div').attr('id', 'tab_container')
    //.style('padding', '0.5em')
    //.style('border', '1px solid lightgrey')
    //.style('display', 'none')

  // three divs
  // reaction_tab = tab_container.append('div')
  //   .attr('id', 'reaction_tab')
  //   .attr('class', 'tab')
  //   .text('compare reaction data')
  //   .style('display', 'none')
  //
  // metabolite_tab = tab_container.append('div')
  //   .attr('id', 'metabolite_tab')
  //   .attr('class', 'tab')
  //   .text('compare metabolite data')
  //   .style('display', 'none')
  //
  // both_tab = tab_container.append('div')
  //   .attr('id', 'both_tab')
  //   .attr('class', 'tab')
  //   .text('compare both')
  //   .style('display', 'none')


  // tab_container.append('div')
  //   .append('text')
  //   .attr('id', 'referenceText')
  //   .text('Reference Data Set: ')

  tab_container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuReference')
    .on('change', function (builder) {

      builder.reference = this.value
      d3_select('#sliderReference').property('value', this.value)
      d3_select('#referenceText').text('Reference Data Set: ' + this.value)

      if(builder.difference_mode){
        showDifferenceData(builder)
      } else {
        builder.set_data_indices(builder.type_of_data, builder.reference)
      }

      if (d3_select('#checkBoxChart').property('checked')) {
        toggle_chart(false)
        create_chart(builder,map)
      }

    })

  tab_container.append('div').append('input')
    .attr('id', 'sliderReference')
    .attr('type', 'range')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', 0)
    .on('change', function (builder) {
      builder.reference = this.value
      d3_select('#dropDownMenuReference').property('selectedIndex', this.value)
      d3_select('#referenceText').text('Reference Data Set: ' + this.value)

      if(builder.difference_mode){
      showDifferenceData(builder)
      } else {
        if (d3_select('#checkBoxChart').property('checked')) {
          toggle_chart(false)
          create_chart(builder,map)
        }
        builder.set_data_indices(builder.type_of_data, builder.reference)
      }
    })

  tab_container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuTarget')
    .on('change', function (builder) {

      builder.target = this.value
      d3_select('#sliderTarget').property('value', this.value)
      d3_select('#targetText').text('Target Data Set ' + this.value)

      if(builder.difference_mode){
        showDifferenceData(builder)
      }

      if (d3_select('#checkBoxChart').property('checked')) {
        toggle_chart(false)
        create_chart(builder,map)
      }
    })

  tab_container.append('div').append('input')
    .attr('type', 'range')
    .attr('id', 'sliderTarget')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', 0)
    .on('change', function (builder) {

      builder.target = this.value
      d3_select('#dropDownMenuTarget').property('selectedIndex', this.value)
      d3_select('#targetText').text('Target Data Set ' + this.value)

      if(builder.difference_mode){
        showDifferenceData(builder)
      }

      if (d3_select('#checkBoxChart').property('checked')) {
        toggle_chart(false)
        create_chart(builder,map)
      }
    })



  var groupButtons = tab_container.append('div').attr('id', 'group_buttons')//.attr('class', 'btn-group btn-group-sm')

  groupButtons.append('div')
    .attr('id', 'counter')
    .attr('class', 'select-counter')
    .text('Display Dataset: 0 / 0')

  groupButtons.append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.previous.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-step-backward')

  groupButtons.append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.next.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-step-forward')

  groupButtons.append('button')
    .attr('class', 'btn btn-default')
    .attr('id', 'play_button')
    .on('click', function(){
      play_time_series(builder, map, duration, interpolation , 10, both_data_play_back) // TODO: make ui for setting steps ?
    })
    .append('span').attr('class', 'glyphicon glyphicon-play')


  groupButtons.append('label')
    .attr('for', 'inputDuration')
    .text('Duration in ms')

  groupButtons
    .append('input')
    .attr('id', 'inputDuration')
    .attr('type', 'number')
    .attr('min', 10)
    .attr('value', 2000)

    .on('input', function () {
        duration = this.value
      })


  groupButtons.append('div')

  d3_select('#group_buttons').append('div').append('svg')
    .attr('id', 'progress_bar')
    .attr('width', max_width)
    .attr('height', 25)
    .append('line')
    .attr('id', 'progress_line')
    .style('stroke-width', '5')
    .style('stroke', 'steelblue')
    .attr({
      x1: 1,
      y1: 15,
      x2: 100,
      y2: 15
    })
  // .transition()
  // .attr({
  //   x2: 0,
  //   y2: 15
  // })

  groupButtons
    .append('input')
    .attr('type', 'checkbox')
    .attr('id', 'checkBoxInterpolation')
    .attr('value', 'Interpolate Data')
    .text('Difference Mode')
    .on('change', function () {
         if (d3_select('#checkBoxInterpolation').property('checked')) {
           interpolation = true
         } else {
            interpolation = false
         }})


  groupButtons.append('label')
    .attr('for', 'checkBoxInterpolation')
    .text('Interpolate Data')

  groupButtons.append('div')


  groupButtons
    .append('input')
    .attr('type', 'checkbox')
    .attr('id', 'checkBoxChart')
    .attr('value', 'Show Chart')
    .text('Show Chart')
    .on('change', function () {
      if (d3_select('#checkBoxChart').property('checked')) {
        //toggle_chart(true)
        create_chart(builder, map)
      } else {
        toggle_chart(false)
      }})

  groupButtons.append('label')
    .attr('for', 'checkBoxChart')
    .text('Show Chart')

  var chart_container = container.append('div')

  chart_container
    .attr('id', 'div_data_chart')
    .style('display','none')
    .append('svg')
    .attr('id', 'svg_data_chart')
    .attr('width', max_width)
    .attr('height', 300)
    .style('display','none')


  chart_container.append('label')
    .attr('id', 'div_data_chart_labels')
    .text('Lines:')
    .style('display','none')

  this.callback_manager = new CallbackManager()

  this.selection = container
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
  } else if (builder.type_of_data ===  'metabolite') {
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

function update (builder, should_create_chart) {

  var currentDataSet = get_current_data_set(builder)
  // TODO: 'both' or not loaded?

  if (currentDataSet !== null) {
    // update display
    current = 0
    d3_select('#counter').text('Display Dataset: '+ (current + 1) + ' / ' + currentDataSet.length)

    // update slider
    d3_select('#sliderReference')
      .attr('max', (currentDataSet.length - 1))
      .attr('value', 0)

    d3_select('#sliderTarget')
      .attr('max', (currentDataSet.length - 1))
      .attr('value', 0)

    d3_select('#referenceText').text('Reference Data Set: ' + current)
    d3_select('#targetText').text('Target Data Set: ' + current)

    // reset dropdown menu

    document.getElementById('dropDownMenuReference').options.length = 0
    document.getElementById('dropDownMenuTarget').options.length = 0

    for (var x in currentDataSet) {

      var name_of_current_data_set = x

      if (builder.type_of_data === 'reaction') {
        name_of_current_data_set = builder.reaction_data_names[x]

      } else if (builder.type_of_data === 'metabolite') {
        name_of_current_data_set = builder.metabolite_data_names[x]

      } else if(builder.type_of_data === 'gene'){
        name_of_current_data_set = builder.gene_data_names[x]
      }

      d3_select('#dropDownMenuReference').append('option')
        .attr('value', x).text('Reference Data Set: ' + name_of_current_data_set)
      d3_select('#dropDownMenuTarget').append('option')
        .attr('value', x).text('Target Data Set: ' + name_of_current_data_set)

    }

  } else { // reset everything
    // update display
    current = 0
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

    // reset dropdown menu
    document.getElementById('dropDownMenuReference').options.length = 0
    document.getElementById('dropDownMenuTarget').options.length = 0

    toggle_chart(false)
  }
}

function next (builder) {

  d3_select('#counter').text('Display Dataset: ' + get_current_data_set_names(builder)[current])

  if (current < get_current_data_set(builder).length - 1) {
    current++
  }
  builder.set_data_indices(builder.type_of_data, current)
}

function previous (builder) {

  d3_select('#counter').text('Display Dataset: ' + get_current_data_set_names(builder)[current])

  if (current > 0) {
    current--
  }

  builder.set_data_indices(builder.type_of_data, current)
}

function play_time_series (builder, map, duration, interpolation, max_steps, both_data_play_back) {

  if (!this.playing) {
    this.playing = true

    this.sliding_window_start = builder.reference
    this.sliding_window_end = builder.target

    this.data_set_for_animation = []

    // array of time points for non-linear time scale
    var array_of_time_points = get_array_of_time_points(builder, map)

    var tick = array_of_time_points[this.sliding_window_start]
    var time_point = this.sliding_window_start
    var linear_time_scale = get_linear_time_scale(builder,map)

    for (var i = this.sliding_window_start; i <= this.sliding_window_end; i++) {
      this.data_set_for_animation.push(get_current_data_set(builder)[i])
    }

    var start = builder.reference
    var end = builder.target

    var duration = duration / (end - start)

    if (interpolation) {

      this.data_set_save = get_current_data_set(builder)
      var interpolation_data_set = create_interpolation_data_set(this.data_set_for_animation, max_steps)

      if (builder.type_of_data === 'reaction') {
        builder.options.reaction_data = interpolation_data_set
      } else if (builder.type_of_data === 'gene') {
        builder.options.gene_data = interpolation_data_set
      } else if (builder.type_of_data === 'metabolite') {
        builder.options.metabolite_data = interpolation_data_set
      }

      // to play animation with all data sets
      start = 0
      end = interpolation_data_set.length - 1


      if(linear_time_scale){
        duration /= max_steps
      }

    }


    // animation
    animate_time_line(0)

    this.animation = setInterval(function () {

      if (interpolation) {

        d3_select('#counter').text('Interpolated Time Series of Data Sets')


        if(linear_time_scale){
          if (builder.reference < end) {
            var next = builder.reference
            next++
            builder.reference = next
          } else {
            builder.reference = 0
          }

          if (both_data_play_back) {
            builder.set_data_indices('reaction', builder.reference, end)
            builder.set_data_indices('metabolite', builder.reference, end)
          } else {
            builder.set_data_indices(builder.type_of_data, builder.reference, end)
          }

        } else { // TODO: handle interpolated data with non-linear time scale

   //       if (tick === array_of_time_points[time_point]){

            // distribute all max_steps data sets in time frame

            // play all max_steps data sets in row

            // then tick++, time_point++

            if (builder.reference < interpolation_data_set.length) {

              var next = builder.reference

              next += Math.ceil(interpolation_data_set.length / max_steps) + 1

              builder.reference = next

            } else { // play as loop
              builder.reference = this.sliding_window_start

              time_point = this.sliding_window_start
              tick = this.sliding_window_start
            }

            if (both_data_play_back) {
              builder.set_data_indices('reaction', builder.reference, this.sliding_window_end)
              builder.set_data_indices('metabolite', builder.reference, this.sliding_window_end)
            } else {
              builder.set_data_indices(builder.type_of_data, builder.reference, this.sliding_window_end)
            }

            time_point++
            tick++

          // } else {
          //
          //   if(tick === (array_of_time_points[array_of_time_points.length-1] + max_steps)){
          //     tick = array_of_time_points[0] - 1
          //   }
          //   tick++
          // }

        }


        animate_time_line(Math.floor(tick))

        if(tick >= array_of_time_points[this.sliding_window_end]){ //array_of_time_points.length-1
          tick = array_of_time_points[this.sliding_window_start]//array_of_time_points[0] - 1
          //time_point = array_of_time_points[this.sliding_window_start]
        } else {
          tick += (max_steps / interpolation_data_set.length)
        }



      } else { // not interpolated data


        d3_select('#counter').text('Time Series of Data Sets: '
          + this.sliding_window_start +
          ' to ' + builder.target +
          '. Current: ' + builder.reference)

          if (tick === array_of_time_points[time_point]) {

            if (parseInt(builder.reference) < parseInt(this.sliding_window_end)) {
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

            if (both_data_play_back) {
              builder.set_data_indices('reaction', builder.reference, this.sliding_window_end)
              builder.set_data_indices('metabolite', builder.reference, this.sliding_window_end)
            } else {
              builder.set_data_indices(builder.type_of_data, builder.reference, this.sliding_window_end)
            }

          } else {

            if(tick >= array_of_time_points[this.sliding_window_end]){ //array_of_time_points.length-1
              tick = array_of_time_points[this.sliding_window_start]//array_of_time_points[0] - 1
              //time_point = array_of_time_points[this.sliding_window_start]
            } else {

            tick++
            }
          }

        animate_time_line(tick)
      }


    }, duration)



  } else { // clear animation and reset data
    if (interpolation) {
      clearInterval(this.animation)

      this.playing = false

      this.data_set_for_animation = []

      // after animation reset to 'normal' data
      if (builder.type_of_data === 'reaction') {
        builder.options.reaction_data.length = 0
        builder.options.reaction_data = this.data_set_save
      } else if (builder.type_of_data === 'gene') {
        builder.options.gene_data.length = 0
        builder.options.gene_data = this.data_set_save
      } else if (builder.type_of_data === 'metabolite') {
        builder.options.metabolite_data.length = 0
        builder.options.metabolite_data = this.data_set_save
      }

      builder.reference = this.sliding_window_start
      builder.target = this.sliding_window_end

    } else {

      clearInterval(this.animation)

      this.playing = false
      builder.reference = this.sliding_window_start
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
      .add_escape_listener(function() {
        this.toggle(false);
      }.bind(this), true);

    // TODO: run the show callback. why?
    //this.callback_manager.run('show')

  } else {

    // TODO: reset all data here?
    this.map.highlight(null)

    // TODO: set this to 'none'
    this.selection.style('display', 'block')

   // container.style('display', 'none')

    // TODO: run the show callback. why?
    // this.callback_manager.run('hide')
  }

}


function create_chart(builder, map){

  var current_data_set = []
  var data_set_loaded = false

  for(var i = parseInt(builder.reference); i <= parseInt(builder.target); i++){
    current_data_set.push(get_current_data_set(builder)[i])
  }

  if(current_data_set[0] !== undefined){
    data_set_loaded = true
  }

  if(data_set_loaded){
    toggle_chart(true)

    var margins = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }

    var data_chart = d3_select("#svg_data_chart")

    var width = d3_select("#div_data_chart").node().getBoundingClientRect().width - margins.left - margins.right
    var height = d3_select("#div_data_chart").node().getBoundingClientRect().height - margins.bottom - margins.top

    var color = d3_scale.schemeCategory20

    var data_for_lines = []
    var labels_for_lines = Object.keys(current_data_set[0])
    var array_of_time_points = get_array_of_time_points(builder, map)

    var domain_y_scale_min = d3.min(d3.values(current_data_set[0]))
    var domain_y_scale_max = d3.max(d3.values(current_data_set[0]))

    var domain_x_scale_min = array_of_time_points[builder.reference]
    var domain_x_scale_max = array_of_time_points[builder.target]


    // for all data keys create chart data

    for(var k in Object.keys(current_data_set[0])){ // for each key

      var data_for_line = []

      // save identifier for label
      //labels_for_lines.push(key)

      var time_point_index = builder.reference

      for(var index in current_data_set){ // go though all data sets to collect values
        var data_point = {}
        var key = Object.keys(current_data_set[index])[k]

        var y_value = current_data_set[index][key]

        data_point['x'] = array_of_time_points[time_point_index]
        data_point['y'] = y_value

        if(y_value < domain_y_scale_min){
          domain_y_scale_min = y_value
        }

        if(y_value > domain_y_scale_max){
          domain_y_scale_max = y_value
        }

        time_point_index++
        data_for_line.push(data_point)

      }
      data_for_lines.push(data_for_line)
    }

    var x_scale = d3.scaleLinear()
      .domain([domain_x_scale_min,domain_x_scale_max])
      .range([margins.left, width - margins.right])

    var y_scale = d3.scaleLinear()
      .domain([domain_y_scale_min,domain_y_scale_max])
      .range([height - margins.top, margins.bottom])

    var x_axis = d3.axisBottom(x_scale)
    var y_axis = d3.axisLeft(y_scale)


    data_chart.append('g')
      .attr("transform", "translate(0," + (height - margins.bottom) + ")")
      .style('shape-rendering', 'crispEdges')
      .style('stroke', 'black')
      .style('fill', 'none')
      .call(x_axis)

    data_chart.append('g')
      .attr("transform", "translate(" + (margins.left) + ",0)")
      .style('shape-rendering', 'crispEdges')
      .style('stroke', 'black')
      .style('fill', 'none')
      .call(y_axis)

    //var time_steps = d3.values(data_for_lines[data_for_lines.length - 1])

    for(var j = domain_x_scale_min; j <= domain_x_scale_max; j++){
      data_chart.append("line")
        .attr('class', 'time_lines')
        .attr('id', 'time_line' + j)
        .attr("x1", x_scale(j))
        .attr("x2", x_scale(j))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke-width", 2)
        .attr("stroke", "red")
        .attr("stroke-dasharray", "2,2")
        .attr("transform", "translate(0," + (margins.bottom) + ")")
        .attr('display', 'none')

    }


    for(var i in data_for_lines){

      var data = data_for_lines[i]

      var line = d3.line()
        .x(function(data) {
          return x_scale(data.x)
        })
        .y(function(data) {
          return y_scale(data.y)
        })
        .curve(d3.curveCardinal)

      var path = data_chart.append('svg:path')
        .attr('d', line(data))
        .attr('stroke', color[i])
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr("id", "chart_paths")




      // data_chart.selectAll('dot')
      //   .data(data)
      //   .enter()
      //  .append('circle')
      //   .attr("r", 2)
      //   .attr("cx", (function(data) {
      //   return x_scale(data.x)}))
      //   .attr("cy", (function(data) {
      //     return y_scale(data.y)
      //   }))

      // var animated_path = data_chart.append('svg:path')
      //   .attr('d', line(data))
      //   .attr('stroke', color[i])
      //   .attr('stroke-width', 2)
      //   .attr('fill', 'none')
      //
      // var totalLength = path.node().getTotalLength();
      //
      // animated_path
      //   //.datum(totalLength)
      //   .datum(line(data))
      //   //.attr("stroke-dasharray", totalLength + " " + totalLength)
      //   //.attr("stroke-dashoffset", totalLength)
      //   .attr('id', 'animated_paths')
        // .transition()
        // .duration(2000)
        // .ease(d3.easeLinear)
        // .attr("stroke-dashoffset", 0)


      // Add a label with same color as line
      d3_select('#div_data_chart_labels')
        .append('div').append('label')
        .style('color', color[i])
        .text(labels_for_lines[i])

    }

  } else {
    toggle_chart(false)

    map.set_status('Please load in data set')
  }

}

function toggle_chart(show){
  if(show){
    d3_select('#div_data_chart').style('display', 'block')
    d3_select('#svg_data_chart').style('display', 'block')
    d3_select('#div_data_chart_labels').style('display', 'block')

  } else {

    //d3_select('#checkBoxChart').property('checked', false)

    d3_select('#svg_data_chart').remove()
    d3_select('#div_data_chart_labels').remove()

    d3_select('#div_data_chart').append('svg')
      .attr('id', 'svg_data_chart')
      .attr('width', 400)
      .attr('height', 300)
      .style('display','none')


    d3_select('#div_data_chart').append('label')
      .attr('id', 'div_data_chart_labels')
      .text('Lines:')
      .style('display','none')


  }

}


function get_current_data_set(builder){
  if(builder.type_of_data === 'reaction'){
    return builder.options.reaction_data
  } else if(builder.type_of_data === 'gene'){
    return builder.options.gene_data
  } else if(builder.type_of_data === 'metabolite'){
    return builder.options.metabolite_data
  } else {
    return []
  }
}

function get_current_data_set_names(builder){
  if(builder.type_of_data === 'reaction'){
    return builder.reaction_data_names
  } else if(builder.type_of_data === 'gene'){
    return builder.gene_data_names
  } else if(builder.type_of_data === 'metabolite'){
    return builder.metabolite_data_names
  } else {
    return []
  }

}


function create_interpolation_data_set (data_set_to_interpolate, max_steps) {

  // create new data_set with every data points in between
  // set it to data object in builder
  // set it back after the animation stops

  var set_of_interpolators = []

  for(var index_of_data_set = 0; index_of_data_set < data_set_to_interpolate.length - 1; index_of_data_set++){

    var current_object = {}

    for(var index_of_reaction = 0; index_of_reaction < Object.keys(data_set_to_interpolate[index_of_data_set]).length; index_of_reaction++){

      var reaction_name = Object.keys(data_set_to_interpolate[index_of_data_set])[index_of_reaction]
      var current_object_data = Object.values(data_set_to_interpolate[index_of_data_set])[index_of_reaction]

      // choose the same reaction, but in next data set
      var next_object_data = Object.values(data_set_to_interpolate[index_of_data_set + 1])[index_of_reaction]

      current_object[reaction_name] =  d3_interpolate.interpolate((current_object_data), (next_object_data))

    }
    set_of_interpolators.push(current_object)
  }


  // fill new data set with all the data
  var interpolation_data_set = []
  interpolation_data_set.length = 0

  // [{key: value, key: value, key: value},
  // {key: value, key: value, key: value}, ...
  // {key: value, key: value, key: value}]

  for (var set in set_of_interpolators) {

    for (var interpolator in set) {

      var steps = 0
      while (steps <= max_steps) {

        var keys = Object.keys(set_of_interpolators[set]) // array of all keys, pick out one
        var interpolators = Object.values(set_of_interpolators[set]) // array of all interpolators, pick out one

        var set_of_entries = {} // this contains data for all reactions at one time point = one 'step' of interpolator
                                // {key: value, key: value, key: value}

        for (var key in keys) {
          // this creates one single entry name: value
          var identifier = keys[key]
          var current_interpolator_function = interpolators[key]

          set_of_entries[identifier] = current_interpolator_function((steps / 10))

          interpolation_data_set.push(set_of_entries)
        }

        steps++
      }
    }

  }

  return interpolation_data_set

}

function get_array_of_time_points(builder, map){

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

  if(time_scale_is_linear){
    map.set_status('Displaying Linear Time Scale')
  } else {
    map.set_status('Displaying Non Linear Time Scale')
  }

  return array_of_time_points
}

function get_linear_time_scale(builder, map){

  var time_scale_is_linear

  for (var i in get_current_data_set_names(builder)) {
    var name = get_current_data_set_names(builder)[i]
    time_scale_is_linear = !(name.startsWith('t') && typeof parseInt(name.slice(1)) === 'number');
  }

  return time_scale_is_linear
}

function animate_time_line(tick) {

  d3.selectAll('line.time_lines').attr('display', 'none')
  d3.select('#time_line' + tick).attr('display', 'block')
}
// d3.selectAll('#animated_paths')
//     .each(function(){
//
//
//       // array of data from
//       // give only data from [0] to [tick] to the path
//       var path = d3.select(this)
//       var all_data = path.data()
//       path.attr('d', all_data.slice(0, tick))
//
//       // var total_length = d3.select(this).datum()
//       // var part = total_length / (total_time_steps - 1)
//       // var offest = 0
//       //
//       // console.log('---' + tick)
//       //
//       // console.log(total_length)
//       // console.log(total_length - (tick * part))
//       //
//       // path.transition()
//       //   .duration(duration / total_time_steps)
//       //   .ease(d3.easeLinear)
//       //   //.attr('stroke-dashoffset', ((total_time_steps - tick) * part) + offest)
//       //   .attr('stroke-dashoffset', ( total_length - (tick * part)))
//         //.transition()
//         //.duration(duration)
//         //.attr("stroke-dashoffset", tick)
//     })
//}
