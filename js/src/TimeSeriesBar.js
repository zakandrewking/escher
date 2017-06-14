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
var metabolite_data
var reaction_data
var current
var counter
var container
var sliderReference, sliderTarget
var differenceModeActive
var reference, target
var dropDownMenuReference, dropDownMenuTarget
var typeOfData
var dataObject

// instance methods
TimeSeriesBar.prototype = {
  init: init,
  update: update,
  is_visible: is_visible,
  toggle: toggle,
  next: next,
  previous: previous,
  toggleDifferenceMode: toggleDifferenceMode,
  showDifferenceData: showDifferenceData,
  setTypeOfData: setTypeOfData,
  setReactionData: setReactionData,
  setMetaboliteData: setMetaboliteData,
  getDifferenceModeActive: getDifferenceModeActive,
  getReference: getReference,
  getTarget: getTarget
}
module.exports = TimeSeriesBar

function init (sel, map, b) {

  builder = b

  metabolite_data = builder.options.metabolite_data
  reaction_data = builder.options.reaction_data

  reference = 0
  target = 0

  builder.set_difference_mode(false)
  builder.set_reference(0)
  builder.set_target(0)

  // builder.get_reference().bind(reference)
  // builder.get_target().bind(target)

  current = 0

  typeOfData = ''

  differenceModeActive = false

  container = sel.attr('class', 'search-container')
  //.style('display', 'none');

  container.append('button')
    .attr('class', 'btn btn-sm btn-default close-button')
    .on('click', function () {
      this.toggle(false)
    }.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-remove')

  container.append('div')
    .append('text')
    .text('Compare Reaction Data: ')

    .append('input')
    .attr('type', 'radio')
    .attr('id', 'datasetR')
    .attr('name', 'Dataset')
    .attr('value', 'Dataset')
    .on('click', function () {
      typeOfData = 'reaction'
      update()
    })

  container.append('div').append('text')
    .text('Compare Metabolite Data: ')

    .append('input')
    .attr('type', 'radio')
    .attr('id', 'datasetM')
    .attr('name', 'Dataset')
    .attr('value', 'Dataset Metabolite')
    .on('click', function () {
      typeOfData = 'metabolite'
      update()
    })

  container.append('text')
    .text('Display Dataset: ')

  counter = container.append('div')
    .attr('id', 'counter')
    .attr('class', 'search-counter')
    .text('0 / 0')

  var groupButtons = container.append('div').attr('class', 'btn-group btn-group-sm')

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

  var checkBoxDifferenceMode = container.append('div')
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
        //differenceModeActive = true
        containerDifferenceMode.style('display', 'block')
      } else {
        builder.set_difference_mode(false)
        //differenceModeActive = false
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
    .text('Run')

  this.callback_manager = new CallbackManager()

  this.selection = container
  this.map = map

}

function initDifferenceMode (container) {

  builder.set_reference(0)
  builder.set_target(0)

  container.append('div')
    .append('text')
    .attr('id', 'referenceText')
    .text('Reference Data Set: ')

  sliderReference = container.append('div').append('input')
    .attr('type', 'range')
    .attr('value', this.reference)
    .attr('min', 0)
    .attr('max', 9)
    .on('change', function () {
      reference = this.value
      builder.set_reference(this.value)

      if (reference < target) {
        target = reference
        sliderTarget.value = reference
      }
      d3.select('#referenceText').text('Reference Data Set: ' + this.value)

    })
    .style('display', 'block')

  container.append('div')
    .append('text')
    .attr('id', 'targetText')
    .text('Target Data Set: ')

  sliderTarget = container.append('div').append('input')
    .attr('type', 'range')
    .attr('value', this.target)
    .attr('min', 0)
    .attr('max', 9)
    .on('change', function () {
      builder.set_target(this.value)
      d3.select('#targetText').text('Target Data Set ' + this.value)

    })
    .style('display', 'block')

  dropDownMenuReference = container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuReference')
    .on('change', function () {

      builder.set_reference(this.value)
      //reference = this.value
    })
  // .append('options')
  // .attr('value', 0).text('Reference Data Set: ')

  dropDownMenuTarget = container.append('select')
    .attr('name', 'target-list')
    .attr('id', 'dropDownMenuTarget')
    .on('change', function () {
      builder.set_target(this.value)
      //  target = this.value
    })
  //   .append('options')
  //  .attr('value', 0).text('Reference Data Set: ')

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

  var currentDataSet

  if (metabolite_data !== null && typeOfData === 'metabolite') {
    currentDataSet = metabolite_data
  } else if (reaction_data !== null && typeOfData === 'reaction') {
    currentDataSet = reaction_data
  } else {
    return
  }

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

  // reset, plain old javascript, but this is the only way it works
  document.getElementById('dropDownMenuReference').options.length = 0
  document.getElementById('dropDownMenuTarget').options.length = 0

  var x
  for (x in currentDataSet) {
    dropDownMenuReference.append('option').attr('value', x).text('Reference Data Set: ' + x)
    dropDownMenuTarget.append('option').attr('value', x).text('Target Data Set: ' + x)
  }

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
        //this.builder.set_metabolite_data(metabolite_data, current)

        counter.text((current + 1) + ' / ' + (metabolite_data.length))
      }
    }
  } else if (typeOfData === 'reaction') {
    if (reaction_data !== undefined && reaction_data !== null) {
      //choose previous data and load it
      if (current > 0) {
        current -= 1

        //this.builder.set_reaction_data(reaction_data, current)

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

function getDifferenceModeActive () {
  return differenceModeActive
}

function getReference () {
  return reference
}

function getTarget () {
  return target
}