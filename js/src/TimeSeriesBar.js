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
var metabolite_data, reaction_data

var current
var counter, data_set_text
var container
var sliderReference, sliderTarget
var tab_container, reaction_tab_button, metabolite_tab_button, both_tab_button, checkBoxDifferenceMode
var dropDownMenuReference, dropDownMenuTarget
var typeOfData
var dataObject

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
  setReactionData: setReactionData,
  setMetaboliteData: setMetaboliteData,
  openTab: openTab
}
module.exports = TimeSeriesBar

function init (sel, map, b) {

  builder = b

  metabolite_data = builder.options.metabolite_data
  reaction_data = builder.options.reaction_data

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
    .text('Compare reaction data')

  metabolite_tab_button = container.append('button')
    .on('click', function () {
      openTab('metabolite_tab')
    })
    .style('background-color', 'lightgrey')
    .text('metabolite')

  both_tab_button = container.append('button')
    .on('click', function () {
      openTab('both_tab')
    })
    .style('background-color', 'lightgrey')
    .text('both')

  tab_container = container.append('div')
    .style('padding', '0.5em')
    .style('border', '1px solid lightgrey')
    .style('display', 'none')

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

  var groupButtons = tab_container.append('div').attr('class', 'btn-group btn-group-sm')

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
    .on('click', this.update.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-refresh')

  container.append('hr')

  checkBoxDifferenceMode = container.append('div')
    .append('label')
    .attr('for', 'checkBoxDifferenceMode')
    .text('Difference Mode')
    .append('input')
    .attr('type', 'checkbox')
    .attr('id', 'checkBoxDifferenceMode')
    .attr('value', 'Difference Mode')
    .text('Difference Mode')
    .on('change', function () {
      if (checkBoxDifferenceMode.property('checked')) {
        builder.set_difference_mode(true)
        containerDifferenceMode.style('display', 'block')
      } else {
        builder.set_difference_mode(false)
        containerDifferenceMode.style('display', 'none')
      }
    })

  var containerDifferenceMode = container.append('div')
    .style('display', 'none')

  initDifferenceMode(containerDifferenceMode)

  containerDifferenceMode.append('div').append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.showDifferenceData.bind(this))
    .append('span')//.attr('class', 'glyphicon glyphicon-play')
    .text('Compare')

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

function initDifferenceMode (container) {

  builder.set_reference(0)
  builder.set_target(0)

  container.append('div')
    .append('text')
    .attr('id', 'referenceText')
    .text('Reference Data Set: ')

  sliderReference = container.append('div').append('input')
    .attr('id', 'sliderReference')
    .attr('type', 'range')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', 0)
    .on('change', function () {
      builder.set_reference(this.value)
      d3.select('#dropDownMenuReference').property('selectedIndex', this.value)
      d3.select('#referenceText').text('Reference Data Set: ' + this.value)
    })

  container.append('div')
    .append('text')
    .attr('id', 'targetText')
    .text('Target Data Set: ')

  sliderTarget = container.append('div').append('input')
    .attr('type', 'range')
    .attr('id', 'sliderTarget')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', 0)
    .on('change', function () {

      builder.set_target(this.value)
      d3.select('#dropDownMenuTarget').property('selectedIndex', this.value)
      d3.select('#targetText').text('Target Data Set ' + this.value)

    })
  dropDownMenuReference = container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuReference')
    .on('change', function () {

      builder.set_reference(this.value)
      d3.select('#sliderReference').property('value', this.value)
      d3.select('#referenceText').text('Reference Data Set: ' + this.value)

    })

  dropDownMenuTarget = container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuTarget')
    .on('change', function () {

      builder.set_target(this.value)
      d3.select('#sliderTarget').property('value', this.value)
      d3.select('#targetText').text('Target Data Set ' + this.value)

    })

}

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

  var currentDataSet, data_set_loaded

  if (typeOfData === 'reaction' && builder.options.reaction_data !== null) {
    currentDataSet = builder.options.reaction_data
    data_set_loaded = true
  } else if (typeOfData === 'metabolite' && builder.options.metabolite_data !== null) {
    currentDataSet = builder.options.metabolite_data
    data_set_loaded = true
  } else { // TODO: 'both' or not loaded
    data_set_loaded = false
    // currentDataSet = []
  }

  if (data_set_loaded) {
    // update display
    current = 0
    counter.text((current + 1) + ' / ' + currentDataSet.length)

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

    if (metabolite_data !== undefined && metabolite_data !== null) {
      //choose next data and load it
      if (current < metabolite_data.length - 1) {

        current += 1

        dataObject = data_styles.import_and_check(metabolite_data[current], 'metabolite_data')
        this.map.apply_metabolite_data_to_map(dataObject)
        this.map.draw_all_nodes(false)

        counter.text((current + 1) + ' / ' + (metabolite_data.length))
      }
    }

  } else if (typeOfData === 'reaction') {
    if (reaction_data !== undefined && reaction_data !== null) {
      //choose next data and load it
      if (current < reaction_data.length - 1) {
        current += 1

        dataObject = data_styles.import_and_check(reaction_data[current], 'reaction_data')
        this.map.apply_reaction_data_to_map(dataObject)
        this.map.draw_all_reactions(false, false)

        counter.text((current + 1) + ' / ' + (reaction_data.length))
      }
    }
  }

}

function previous () {

  if (typeOfData === 'metabolite') {
    if (metabolite_data !== undefined && metabolite_data !== null) {
      //choose previous data and load it
      if (current > 0) {
        current -= 1

        dataObject = data_styles.import_and_check(metabolite_data[current], 'metabolite_data')
        this.map.apply_metabolite_data_to_map(dataObject)
        this.map.draw_all_nodes(false)

        counter.text((current + 1) + ' / ' + (metabolite_data.length))
      }
    }
  } else if (typeOfData === 'reaction') {
    if (reaction_data !== undefined && reaction_data !== null) {
      //choose previous data and load it
      if (current > 0) {
        current -= 1

        dataObject = data_styles.import_and_check(reaction_data[current], 'reaction_data')
        this.map.apply_reaction_data_to_map(dataObject)
        this.map.draw_all_reactions(false, false)

        counter.text((current + 1) + ' / ' + (reaction_data.length))
      }
    }
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
  builder._update_data(false, true, typeOfData, true)
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

function setMetaboliteData (data) {
  metabolite_data = data
}

function setReactionData (data) {
  reaction_data = data
}