/**
 * TimeSeriesBar
 *
 */

var utils = require('./utils')
var CallbackManager = require('./CallbackManager')
var _ = require('underscore')

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

function init (sel, map, builder) {

  this.builder = builder

  metabolite_data = builder.options.metabolite_data
  reaction_data = builder.options.reaction_data

  current = 0

  typeOfData = ''

  differenceModeActive = false

  container = sel.attr('class', 'search-container')
    .style('display', 'none');

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
        differenceModeActive = true
        containerDifferenceMode.style('display', 'block')
      } else {
        differenceModeActive = false
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
    .text('Display Difference')

  this.callback_manager = new CallbackManager()

  this.selection = container
  this.map = map

}

function initDifferenceMode (container) {

  reference = 0
  target = 0

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

      if (reference < target) {
        target = reference
        sliderTarget.value = reference
      }
      d3.select('#referenceText').text('Reference Data Set: ' + reference)

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

      target = this.value
      d3.select('#targetText').text('Target Data Set ' + target)

    })
    .style('display', 'block')

  dropDownMenuReference = container.append('select')
    .attr('name', 'target-list')
    .on('change', function () {reference = this.value })

  dropDownMenuTarget = container.append('select')
    .attr('name', 'target-list')
    .on('change', function () { target = this.value })

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
  // TODO: items just get added every time

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
        this.builder.set_metabolite_data(metabolite_data, current)

        counter.text((current + 1) + ' / ' + (metabolite_data.length))
      }
    }

  } else if (typeOfData === 'reaction') {
    if (reaction_data !== undefined && reaction_data !== null) {
      //choose next data and load it
      if (current < reaction_data.length - 1) {
        current += 1

        this.builder.set_reaction_data(reaction_data, current)

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

        this.builder.set_metabolite_data(metabolite_data, current)

        counter.text((current + 1) + ' / ' + (metabolite_data.length))
      }
    }
  } else if (typeOfData === 'reaction') {
    if (reaction_data !== undefined && reaction_data !== null) {
      //choose previous data and load it
      if (current > 0) {
        current -= 1

        this.builder.set_reaction_data(reaction_data, current)

        counter.text((current + 1) + ' / ' + (reaction_data.length))
      }
    }
  }

}

function toggleDifferenceMode () {

  if (differenceModeActive) {
    container.style('display', 'block')
    differenceModeActive = false

  } else {
    container.style('display', 'none')
    differenceModeActive = true
  }

}

// TODO: how to show the data?
// only display diff data on map and don't change dataset?

function showDifferenceData () {

  // directly display on map, save nothing
  // this.map.apply_metabolite_data_to_map( something like this)


  // create new dataset out of the reference and data
  // is this the right way?
 // var differenceDataSet = [metabolite_data[reference], metabolite_data[target]]
 // this.builder.set_metabolite_data(differenceDataSet, 0)

  this.builder._update_data(true, true, 'reaction')

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

function getDifferenceModeActive(){
  console.log(differenceModeActive)
  return differenceModeActive
}

function getReference(){
  console.log(reference)
  return reference
}

function getTarget(){
  console.log(target)
  return target
}