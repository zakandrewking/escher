/**
 * TimeSeriesBar
 *
 */

var utils = require('./utils')
var CallbackManager = require('./CallbackManager')
var _ = require('underscore')
var data_styles = require('./data_styles.js')
var d3_interpolate = require("d3-interpolate")

var TimeSeriesBar = utils.make_class()


// TODO: get rid of global variables
var current
var counter
var container
var sliderReference, sliderTarget
var tab_container, reaction_tab_button, metabolite_tab_button, both_tab_button
var dropDownMenuReference, dropDownMenuTarget
var typeOfData
var number_of_data_sets

var playing = false
var interpolation = false

var reaction_tab, metabolite_tab, both_tab


// instance methods
TimeSeriesBar.prototype = {
  init: init,
  update: update,
  is_visible: is_visible,
  toggle: toggle,
  next: next,
  previous: previous,
  toggleDifferenceMode: toggleDifferenceMode,
  showBar: showBar,
  showDifferenceData: showDifferenceData,
  setTypeOfData: setTypeOfData,
  openTab: openTab
}
module.exports = TimeSeriesBar

function init (sel, map, builder) {

  this.builder = builder



  this.builder.set_difference_mode(false)
  this.builder.set_reference(0)
  this.builder.set_target(0)


  current = 0

  typeOfData = ''

  container = sel.attr('class', 'search-container')
  // TODO: remove this comment in final version
  .style('display', 'block');

  container.append('button')
    .attr('class', 'btn btn-sm btn-default close-button')
    .on('click', function () {
      this.toggle(false)
    }.bind(this))
    .append('span')
    .attr('class', 'glyphicon glyphicon-remove')

  var box = container.append('div')
    .attr('class', 'settings-box')

  // tabbed layout

  // three buttons
  reaction_tab_button = box.append('button')
    .on('click', function (builder) {
      openTab('reaction_tab', builder)
    })
    .style('background-color', 'lightgrey')
    .style('width', '33.3%')
    .text('reaction data')

  metabolite_tab_button = box.append('button')
    .on('click', function (builder) {
      openTab('metabolite_tab', builder)
    })
    .style('background-color', 'lightgrey')
    .style('width', '33.3%')

    .text('metabolite data')

  both_tab_button = box.append('button')
    .on('click', function (builder) {
      openTab('both_tab', builder)
    })
    .style('background-color', 'lightgrey')
    .style('width', '33.3%')
    .text('both data')

  var second_row_buttons = box.append('div')

  var time_series_button = second_row_buttons.append('button')
    .on('click', function () {
      time_series_button.style('background-color', 'white')
      difference_mode_button.style('background-color', 'lightgrey')
      toggleDifferenceMode (builder)
      groupButtons.style('display', 'block')

    })
    .style('background-color', 'white')
    .style('width', '50%')
    .text('Sliding Window')

  var difference_mode_button = second_row_buttons.append('button')
    .on('click', function (builder) {
      time_series_button.style('background-color', 'lightgrey')
      difference_mode_button.style('background-color', 'white')
      toggleDifferenceMode (builder)
      groupButtons.style('display', 'none')
    })
    .style('background-color', 'lightgrey')
    .style('width', '50%')
    .text('Difference Mode')

  tab_container = box.append('div')
    //.style('padding', '0.5em')
    //.style('border', '1px solid lightgrey')
    //.style('display', 'none')

  // three divs
  reaction_tab = tab_container.append('div')
    .attr('id', 'reaction_tab')
    .attr('class', 'tab')
    .text('compare reaction data')
    .style('display', 'none')

  metabolite_tab = tab_container.append('div')
    .attr('id', 'metabolite_tab')
    .attr('class', 'tab')
    .text('compare metabolite data')
    .style('display', 'none')

  both_tab = tab_container.append('div')
    .attr('id', 'both_tab')
    .attr('class', 'tab')
    .text('compare both')
    .style('display', 'none')


  tab_container.append('div')
    .append('text')
    .attr('id', 'referenceText')
    .text('Reference Data Set: ')

  sliderReference = tab_container.append('div').append('input')
    .attr('id', 'sliderReference')
    .attr('type', 'range')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', 0)
    .on('change', function (builder) {
      builder.set_reference(this.value)
      d3.select('#dropDownMenuReference').property('selectedIndex', this.value)
      d3.select('#referenceText').text('Reference Data Set: ' + this.value)
      if(builder.get_difference_mode()){
      showDifferenceData(builder)
      } else {
        builder.set_data_indices(typeOfData, builder.get_reference())
      }
    })

  dropDownMenuReference = tab_container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuReference')
    .on('change', function (builder) {

      b.set_reference(this.value)
      d3.select('#sliderReference').property('value', this.value)
      d3.select('#referenceText').text('Reference Data Set: ' + this.value)

      if(builder.get_difference_mode()){
        showDifferenceData(builder)
      } else {
        builder.set_data_indices(typeOfData, builder.get_reference())
      }

    })

  tab_container.append('div')
    .append('text')
    .attr('id', 'targetText')
    .text('Target Data Set: ')

  sliderTarget = tab_container.append('div').append('input')
    .attr('type', 'range')
    .attr('id', 'sliderTarget')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', 0)
    .on('change', function (builder) {

      builder.set_target(this.value)
      d3.select('#dropDownMenuTarget').property('selectedIndex', this.value)
      d3.select('#targetText').text('Target Data Set ' + this.value)

      if(builder.get_difference_mode()){
        showDifferenceData(builder)
      } else {
     //   builder.set_data_indices(typeOfData, builder.get_target())
      }
    })

  dropDownMenuTarget = tab_container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuTarget')
    .on('change', function () {

      builder.set_target(this.value)
      d3.select('#sliderTarget').property('value', this.value)
      d3.select('#targetText').text('Target Data Set ' + this.value)

      if(builder.get_difference_mode()){
        showDifferenceData(builder)
      } else {
       // builder.set_data_indices(typeOfData, builder.get_target())
      }

    })

  var groupButtons = tab_container.append('div')//.attr('class', 'btn-group btn-group-sm')

  counter = groupButtons.append('div')
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
      play_time_series(builder)
    })
    .append('span').attr('class', 'glyphicon glyphicon-play')


  groupButtons
    .append('input')
    .attr('type', 'checkbox')
    .attr('id', 'checkBoxInterpolation')
    .attr('value', 'Interpolate Data')
    .text('Difference Mode')
    .on('change', function () {
         if (d3.select('#checkBoxInterpolation').property('checked')) {
           interpolation = true
         } else {
            interpolation = false
         }})

  groupButtons.append('label')
    .attr('for', 'checkBoxInterpolation')
    .text('Interpolate Data')

  // groupButtons.append('button')
  //   .attr('class', 'btn btn-default')
  //   .on('click', this.update.bind(this))
  //   .append('span').attr('class', 'glyphicon glyphicon-refresh')

  //container.append('hr')
  //
  // checkBoxDifferenceMode = container.append('div')
  //   .append('label')
  //   .attr('for', 'checkBoxDifferenceMode')
  //   .text('Difference Mode')
  //   .append('input')
  //   .attr('type', 'checkbox')
  //   .attr('id', 'checkBoxDifferenceMode')
  //   .attr('value', 'Difference Mode')
  //   .text('Difference Mode')
  //   .on('change', function () {
  //     if (checkBoxDifferenceMode.property('checked')) {
  //       builder.set_difference_mode(true)
  //       containerDifferenceMode.style('display', 'block')
  //     } else {
  //       builder.set_difference_mode(false)
  //       containerDifferenceMode.style('display', 'none')
  //     }
  //   })


  // var containerDifferenceMode = container.append('div')
  //   .style('display', 'none')
  //
  //
  //
  // initDifferenceMode(containerDifferenceMode)

  // containerDifferenceMode.append('div').append('button')
  //   .attr('class', 'btn btn-default')
  //   .on('click', this.showDifferenceData.bind(this))
  //   .append('span')//.attr('class', 'glyphicon glyphicon-play')
  //   .text('Compare')

  this.callback_manager = new CallbackManager()

  this.selection = container
  this.map = map
}

function openTab (tab_id, builder) {

  tab_container.style('display', 'block')

  reaction_tab_button.style('background-color', 'lightgrey')
  metabolite_tab_button.style('background-color', 'lightgrey')
  both_tab_button.style('background-color', 'lightgrey')

  var tabs = document.getElementsByClassName('tab')

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none'
  }

  if (tab_id === 'reaction_tab') {
    setTypeOfData('reaction')
    reaction_tab_button.style('background-color', 'white')
    reaction_tab.style('display', 'block')
    update(builder)
  } else if (tab_id === 'gene_tab') {
    setTypeOfData('gene')
    reaction_tab_button.style('background-color', 'white')
    reaction_tab.style('display', 'block')
    update(builder)
  } else if (tab_id === 'metabolite_tab') {
    setTypeOfData('metabolite')
    metabolite_tab_button.style('background-color', 'white')
    metabolite_tab.style('display', 'block')
    update(builder)
  }
  else if (tab_id === 'both_tab') {
    both_tab.style('display', 'block')
    both_tab_button.style('background-color', 'white')
    update(builder)
  } else {
// ?
  }

}

// function initDifferenceMode (container) {
//
//
// }

/**
 *  Updates the GUI
 *
 * set to specific dataset
 * set slider to max of data
 * set counter to 0 of data length
 * set dropdown menu length
 *
 */

function update (builder) {

  var currentDataSet
  var data_set_loaded = false

  if (typeOfData === 'reaction' && builder.options.reaction_data !== null) {
    currentDataSet = builder.options.reaction_data
    data_set_loaded = true
  } else if (typeOfData === 'gene' && builder.options.gene_data !== null) {
    currentDataSet = builder.options.gene_data
    data_set_loaded = true
  } else if (typeOfData === 'metabolite' && builder.options.metabolite_data !== null) {
    currentDataSet = builder.options.metabolite_data
    data_set_loaded = true
  }
  // TODO: 'both' or not loaded?


  if (data_set_loaded) {
    // update display
    current = 0
    number_of_data_sets = currentDataSet.length
    counter.text('Display Dataset: '+ (current + 1) + ' / ' + number_of_data_sets)

    // update slider
    sliderReference
      .attr('max', (currentDataSet.length - 1))
      .attr('value', 0)

    sliderTarget
      .attr('max', (currentDataSet.length - 1))
      .attr('value', 0)

    d3.select('#referenceText').text('Reference Data Set: ' + current)
    d3.select('#targetText').text('Target Data Set: ' + current)

    // update dropdown menu

    // reset: plain old javascript, but this is the only way it works
    document.getElementById('dropDownMenuReference').options.length = 0
    document.getElementById('dropDownMenuTarget').options.length = 0

    var x
    for (x in currentDataSet) {
      var name_of_current_data_set

      if (typeOfData === 'reaction') {
        name_of_current_data_set = builder.get_reaction_data_names()[x]

      } else if (typeOfData === 'metabolite') {
        name_of_current_data_set = builder.get_metabolite_data_names()[x]

      } else { // typeOfData is 'both'
        name_of_current_data_set = x
      }

      dropDownMenuReference.append('option').attr('value', x).text('Reference Data Set: ' + name_of_current_data_set)
      dropDownMenuTarget.append('option').attr('value', x).text('Target Data Set: ' + name_of_current_data_set)

    }

  } else { // reset everything
    // update display
    current = 0
    counter.text('Display Dataset: 0 / 0')

    // update slider
    sliderReference
      .attr('max', 0)
      .attr('value', 0)

    sliderTarget
      .attr('max', 0)
      .attr('value', 0)

    d3.select('#referenceText').text('Reference Data Set: ')
    d3.select('#targetText').text('Target Data Set: ')

    // reset dropdown menu
    document.getElementById('dropDownMenuReference').options.length = 0
    document.getElementById('dropDownMenuTarget').options.length = 0
  }
}

function next (builder) {

  if (typeOfData === 'metabolite') {

    if (builder.options.metabolite_data !== undefined && builder.options.metabolite_data !== null) {
      if (current < builder.options.metabolite_data.length - 1) {
        current += 1
      } else {
        current = 0
      }
        builder.set_data_indices(typeOfData, current)
        counter.text('Display Dataset: ' + (current + 1) + ' / ' + (builder.options.metabolite_data.length))

    }

  } else if (typeOfData === 'reaction') {
    if (builder.options.reaction_data !== undefined && builder.options.reaction_data !== null) {
      if (current < builder.options.reaction_data.length - 1) {
        current += 1
      } else {
        current = 0
      }
        builder.set_data_indices(typeOfData, current)
        counter.text('Display Dataset: ' + (current + 1) + ' / ' + (builder.options.reaction_data.length))

    }
  } else if (typeOfData === 'gene') {
    if (builder.options.gene_data !== undefined && builder.options.gene_data !== null) {
      if (current < builder.options.gene_data.length - 1) {
        current += 1
      } else {
        current = 0
      }
        builder.set_data_indices(typeOfData, current)
        counter.text('Display Dataset: ' + (current + 1) + ' / ' + (builder.options.gene_data.length))

    }

  }
}

function previous (builder) {

  if (current > 0) {

    var current_data

    // this is only for displaying one number... maybe find a work around
    if (typeOfData === 'metabolite' &&
      builder.options.metabolite_data !== undefined &&
      builder.options.metabolite_data !== null) {
      current -= 1

      builder.set_data_indices('metabolite', current)
      counter.text('Display Dataset: ' + (current + 1) + ' / ' + (builder.options.metabolite_data.length))

    } else if (typeOfData === 'reaction' &&
      builder.options.reaction_data !== undefined &&
      builder.options.reaction_data !== null) {
      current -= 1

      builder.set_data_indices('reaction', current)

      counter.text('Display Dataset: ' + (current + 1) + ' / ' + (builder.options.reaction_data.length))

    } else if (typeOfData === 'gene' && builder.options.gene_data !== undefined && builder.options.gene_data !== null) {
      current -= 1

      builder.set_data_indices(typeOfData, current)
      counter.text('Display Dataset: ' + (current + 1) + ' / ' + (builder.options.gene_data.length))

    }

  }
}

function play_time_series (builder) {

  if(interpolation){

      var data_set_to_interpolate = []
      data_set_to_interpolate.length = 0

    if(!playing){

      playing = true

      this.sliding_window_start = builder.get_reference()
      this.sliding_window_end = builder.get_target()

    if(typeOfData === 'reaction'){

      this.data_set_save = builder.options.reaction_data
      for(var i = this.sliding_window_start; i <= this.sliding_window_end; i++){
      data_set_to_interpolate.push(builder.options.reaction_data[i])
      }

    } else if(typeOfData === 'gene'){

      this.data_set_save = builder.options.gene_data

      for(var i = this.sliding_window_start; i <= this.sliding_window_end; i++){
        data_set_to_interpolate.push(builder.options.gene_data[i])
      }
    } else if(typeOfData === 'metabolite'){
      this.data_set_save = builder.options.metabolite_data
      for(var i = this.sliding_window_start; i <= this.sliding_window_end; i++){
        data_set_to_interpolate.push(builder.options.metabolite_data[i])
      }
    } else {
     // this.data_set_save = null
     // data_set_to_interpolate = null
    }

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

          current_object[reaction_name] =  d3_interpolate.interpolate((current_object_data), (next_object_data)) // ?

          }
        set_of_interpolators.push(current_object)
      }

      console.log(set_of_interpolators)
      // fill new data set with all the data

      var interpolation_data_set = []
      // [{key: value, key: value, key: value},
      // {key: value, key: value, key: value}, ...
      // {key: value, key: value, key: value}]

        for (var set in set_of_interpolators) {

          for (var interpolator in set) {

          var steps = 0
          while (steps <= 10) {

            var keys = Object.keys(set_of_interpolators[set]) // array of all keys, pick out one
            var interpolators = Object.values(set_of_interpolators[set]) // array of all interpolators, pick out one

            var set_of_entries = {} // this contains data for all reactions at one time point = one 'step' of interpolator
                                    // {key: value, key: value, key: value}

            for (var key in keys) {
              // this creates one single entry name: value
              var identifier = keys[key]
              var current_interpolator_function = interpolators[key]

              set_of_entries[identifier] = current_interpolator_function((steps / 10))
              //console.log((steps / 10))

              interpolation_data_set.push(set_of_entries)
            }

            steps++
          }
        }

      }
        console.log(interpolation_data_set)

      if(typeOfData === 'reaction'){
        builder.options.reaction_data = interpolation_data_set
      } else if(typeOfData === 'gene'){
        builder.options.gene_data = interpolation_data_set
      } else if(typeOfData === 'metabolite'){
        builder.options.metabolite_data = interpolation_data_set
      }


      // animation

      // to play animation with all data sets
      this.sliding_window_start = 0
      this.sliding_window_end = interpolation_data_set.length - 1

      this.animation = setInterval(function () {

        counter.text('Interpolated Time Series of Data Sets: '
          + this.sliding_window_start +
          ' to ' + builder.get_target() +
          '. Current: ' + builder.get_reference())

        if (builder.get_reference() < this.sliding_window_end) {
          var next = builder.get_reference()
          next++
          builder.set_reference(next)
        } else {
          builder.set_reference(this.sliding_window_start)
        }
        builder.set_data_indices(typeOfData, builder.get_reference(), this.sliding_window_end) // otherwise will set to null
      }, 20);

    } else {

      // after animation reset to 'normal' data
      clearInterval(this.animation)

      playing = false

      if (typeOfData === 'reaction') {
        builder.options.reaction_data = this.data_set_save
      } else if (typeOfData === 'gene') {
        builder.options.gene_data = this.data_set_save
      } else if (typeOfData === 'metabolite') {
        builder.options.metabolite_data = this.data_set_save
      }
      builder.set_reference(this.sliding_window_start)
      builder.set_target(this.sliding_window_end)

    }


  } else {

    // TODO: makes crazy stuff with setting reference / target every time. maybe just grey out while animation?

    if (!playing) {
      playing = true
      this.sliding_window_start = builder.get_reference()
      this.sliding_window_end = builder.get_target()
      // save values for later, because reference gets overwritten in set indices
      this.animation = setInterval(function () {

        counter.text('Time Series of Data Sets: '
          + this.sliding_window_start +
          ' to ' + builder.get_target() +
          '. Current: ' + builder.get_reference())

        if (builder.get_reference() < this.sliding_window_end) {
          var next = builder.get_reference()
          next++
          builder.set_reference(next)
        } else {
          builder.set_reference(this.sliding_window_start)
        }

        builder.set_data_indices(typeOfData, builder.get_reference(), this.sliding_window_end) // otherwise will set to null
      }, 200);

    } else {
      clearInterval(this.animation)

      playing = false
      builder.set_reference(this.sliding_window_start)
      builder.set_target(this.sliding_window_end)
    }
  }
}



function toggleDifferenceMode (builder) {

  if (builder.get_difference_mode()) {
    builder.set_difference_mode(false)
    builder.set_reference(0)
    builder.set_target(0)
  } else {
    builder.set_difference_mode(true)
  }

}

function showBar (show) {

  if (show) {
    container.style('display', 'block')
  } else {
    container.style('display', 'none')
  }
}

function showDifferenceData (builder) {
  builder.set_difference_mode(true)
  builder.set_data_indices(typeOfData, builder.get_reference(), builder.get_target())
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

function setTypeOfData (data) {
  typeOfData = data
}
