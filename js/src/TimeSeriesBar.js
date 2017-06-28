/**
 * TimeSeriesBar
 *
 */

var utils = require('./utils')
var CallbackManager = require('./CallbackManager')
var _ = require('underscore')
var data_styles = require('./data_styles.js')

var TimeSeriesBar = utils.make_class()
var builder

var current, from, to
var counter, data_set_text
var container
var sliderReference, sliderTarget
var tab_container, reaction_tab_button, metabolite_tab_button, both_tab_button, checkBoxDifferenceMode
var dropDownMenuReference, dropDownMenuTarget
var typeOfData
var number_of_data_sets

var reaction_tab, metabolite_tab, both_tab

var playing = false


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
 // setReactionData: setReactionData,
 // setMetaboliteData: setMetaboliteData,
  openTab: openTab
}
module.exports = TimeSeriesBar

function init (sel, map, b) {

  builder = b

  builder.set_difference_mode(false)
  builder.set_reference(0)
  builder.set_target(0)

  current = 0

  typeOfData = ''

  container = sel.attr('class', 'search-container')
  // TODO: remove this comment in final version
  //.style('display', 'none');

  container.append('button')
    .attr('class', 'btn btn-sm btn-default close-button')
    .on('click', function () {
      this.toggle(false)
    }.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-remove')

  // tabbed layout

  // three buttons
  reaction_tab_button = container.append('button')
    .on('click', function () {
      openTab('reaction_tab')
    })
    .style('background-color', 'lightgrey')
    .text('reaction data')

  metabolite_tab_button = container.append('button')
    .on('click', function () {
      openTab('metabolite_tab')
    })
    .style('background-color', 'lightgrey')
    .text('metabolite data')

  both_tab_button = container.append('button')
    .on('click', function () {
      openTab('both_tab')
    })
    .style('background-color', 'lightgrey')
    .text('both data')

  var secound_row_buttons = container.append('div')

  var time_series_button = secound_row_buttons.append('button')
    .on('click', function () {
      time_series_button.style('background-color', 'white')
      difference_mode_button.style('background-color', 'lightgrey')
      toggleDifferenceMode ()
      groupButtons.style('display', 'block')
    })
    .style('background-color', 'white')
    .style('width', '45%')
    .text('Sling Window')

  var difference_mode_button = secound_row_buttons.append('button')
    .on('click', function () {
      time_series_button.style('background-color', 'lightgrey')
      difference_mode_button.style('background-color', 'white')
      toggleDifferenceMode ()
      groupButtons.style('display', 'none')
    })
    .style('background-color', 'lightgrey')
    .style('width', '45%')
    .text('Difference Mode')

  tab_container = container.append('div')
    //.style('padding', '0.5em')
    //.style('border', '1px solid lightgrey')
    //.style('display', 'none')

  // TODO: shared ui
  // contains:
  // - checkbox diff_mode
  // - reference data set slider and dropdown
  // in single mode:
  // - show: next / previous buttons
  // - hide: target data set slider and dropdown
  // in diff mode:
  // - hide next / previous buttons
  // - show: target data set slider and dropdown
  //
  // change data everytime user makes a change, get rid of compare button

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

  data_set_text = tab_container.append('text')
    .text('Display Dataset: ')

  counter = tab_container.append('div')
    .attr('id', 'counter')
    .attr('class', 'select-counter')
    .text('0 / 0')



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
    .on('change', function () {
      builder.set_reference(this.value)
      d3.select('#dropDownMenuReference').property('selectedIndex', this.value)
      d3.select('#referenceText').text('Reference Data Set: ' + this.value)
      if(builder.get_difference_mode()){
      showDifferenceData()
      } else {
        builder.set_data_indices(typeOfData, builder.get_reference())
      }
    })

  dropDownMenuReference = tab_container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuReference')
    .on('change', function () {

      builder.set_reference(this.value)
      d3.select('#sliderReference').property('value', this.value)
      d3.select('#referenceText').text('Reference Data Set: ' + this.value)

      if(builder.get_difference_mode()){
        showDifferenceData()
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
    .on('change', function () {

      builder.set_target(this.value)
      d3.select('#dropDownMenuTarget').property('selectedIndex', this.value)
      d3.select('#targetText').text('Target Data Set ' + this.value)

      if(builder.get_difference_mode()){
        showDifferenceData()
      } else {
        builder.set_data_indices(typeOfData, builder.get_target())
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
        showDifferenceData()
      } else {
        builder.set_data_indices(typeOfData, builder.get_target())
      }

    })

  var groupButtons = tab_container.append('div')//.attr('class', 'btn-group btn-group-sm')

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
      play_time_series()
    })
    .append('span').attr('class', 'glyphicon glyphicon-play')

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

  builder.set_reference(0)
  builder.set_target(0)

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

function openTab (tab_id) {

  tab_container.style('display', 'block')
  counter.style('display', 'block')
  data_set_text.style('display', 'block')

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
    update()
  } else if (tab_id === 'gene_tab') {
    setTypeOfData('gene')
    reaction_tab_button.style('background-color', 'white')
    reaction_tab.style('display', 'block')
    update()
  } else if (tab_id === 'metabolite_tab') {
    setTypeOfData('metabolite')
    metabolite_tab_button.style('background-color', 'white')
    metabolite_tab.style('display', 'block')
    update()
  }
  else if (tab_id === 'both_tab') {
    both_tab.style('display', 'block')
    both_tab_button.style('background-color', 'white')
    update()
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

function update () {

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
    counter.text((current + 1) + ' / ' + number_of_data_sets)

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
    counter.text('0 / 0')

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

  console.log('bar updated')
}

function next () {

  if (typeOfData === 'metabolite') {

    if (builder.options.metabolite_data !== undefined && builder.options.metabolite_data !== null) {
      if (current < builder.options.metabolite_data.length - 1) {
        current += 1
      } else {
        current = 0
      }
        builder.set_data_indices(typeOfData, current)
        counter.text((current + 1) + ' / ' + (builder.options.metabolite_data.length))

    }

  } else if (typeOfData === 'reaction') {
    if (builder.options.reaction_data !== undefined && builder.options.reaction_data !== null) {
      if (current < builder.options.reaction_data.length - 1) {
        current += 1
      } else {
        current = 0
      }
        builder.set_data_indices(typeOfData, current)
        counter.text((current + 1) + ' / ' + (builder.options.reaction_data.length))

    }
  } else if (typeOfData === 'gene') {
    if (builder.options.gene_data !== undefined && builder.options.gene_data !== null) {
      if (current < builder.options.gene_data.length - 1) {
        current += 1
      } else {
        current = 0
      }
        builder.set_data_indices(typeOfData, current)
        counter.text((current + 1) + ' / ' + (builder.options.gene_data.length))

    }

  }
}

function previous () {

  if (current > 0) {

    var current_data

    // this is only for displaying one number... maybe find a work around
    if (typeOfData === 'metabolite' &&
      builder.options.metabolite_data !== undefined &&
      builder.options.metabolite_data !== null) {
      current -= 1

      builder.set_data_indices('metabolite', current)
      counter.text((current + 1) + ' / ' + (builder.options.metabolite_data.length))

    } else if (typeOfData === 'reaction' &&
      builder.options.reaction_data !== undefined &&
      builder.options.reaction_data !== null) {
      current -= 1

      builder.set_data_indices('reaction', current)

      counter.text((current + 1) + ' / ' + (builder.options.reaction_data.length))

    } else if (typeOfData === 'gene' && builder.options.gene_data !== undefined && builder.options.gene_data !== null) {
      current -= 1

      builder.set_data_indices(typeOfData, current)
      counter.text((current + 1) + ' / ' + (builder.options.gene_data.length))

    }

  }
}

function play_time_series () {


  if (!playing) {

    playing = true
    this.animation = setInterval(function () {
      next()
    }, 100)

  } else {
    clearInterval(this.animation)
    playing = false
  }

}

function toggleDifferenceMode () {

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

function showDifferenceData () {
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
    container.style('display', 'block')

    // escape key
    this.clear_escape = this.map.key_manager
      .add_escape_listener(function () {
        this.toggle(false)
      }.bind(this), true)

    // next keys
    this.clear_next = this.map.key_manager
      .add_key_listener(['enter', 'ctrl+g'], function () {
        this.next()
      }.bind(this), false)

    // previous keys
    this.clear_previous = this.map.key_manager
      .add_key_listener(['shift+enter', 'shift+ctrl+g'], function () {
        this.previous()
      }.bind(this), false)

    // run the show callback
    this.callback_manager.run('show')

  } else {

    this.map.highlight(null)
    this.selection.style('display', 'none')

    container.style('display', 'none')

    if (this.clear_escape) this.clear_escape()
    this.clear_escape = null
    if (this.clear_next) this.clear_next()
    this.clear_next = null
    if (this.clear_previous) this.clear_previous()
    this.clear_previous = null

    // run the hide callback
    this.callback_manager.run('hide')
  }

}

function setTypeOfData (data) {
  typeOfData = data
}

// function setMetaboliteData (data) {
//   metabolite_data = data
// }
//
// function setReactionData (data) {
//   reaction_data = data
// }