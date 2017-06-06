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
var dropDownMenuTarget
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
  setTypeOfData: setTypeOfData
}
module.exports = TimeSeriesBar

function init (sel, map, builder) {

  this.builder = builder

  this.metabolite_data = builder.options.metabolite_data
  this.reaction_data = builder.options.reaction_data

  this.current = 0


  this.typeOfData = ''

  differenceModeActive = false

  container = sel.attr('class', 'search-container')
  //  .style('display', 'none');

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

  this.counter = container.append('div')
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

  initDifferenceMode(container)

  container.append('div').append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.showDifferenceData.bind(this))
    .append('span')//.attr('class', 'glyphicon glyphicon-play')
    .text('Display Difference')

  this.callback_manager = new CallbackManager()

  this.selection = container
  this.map = map

}

function initDifferenceMode (container) {

  this.reference = 0
  this.target = 0

  container.append('div')
    .append('text')
    .attr('id', 'referenceText')
    .text('Reference Data Set: ')

  sliderReference = container.append('div').append('input')
    .attr('type', 'range')
    .attr('value', this.reference)
    .attr('min', 0)
    .attr('max', 10)
    .on('change', function () {
      reference = this.value

      //sliderTarget.attr('min', reference)

      if (reference < target) {
        target = reference
        this.sliderTarget.value = reference
      }
      d3.select('#referenceText').text('Reference Data Set: ' + reference)

      //sliderTarget.attr('value', reference)
      //d3.select('#targetText').text('Target Dataset ' + target )
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
    .attr('max', 10)
    .on('change', function () {

      this.target = this.value
      d3.select('#targetText').text('Target Data Set ' + this.target)

    })
    .style('display', 'block')

  dropDownMenuTarget = container.append('select')
    .attr('name', 'target-list')
    .on('change', function (d) { console.log(d.value) })

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

  if (typeOfData === 'metabolite') {
    currentDataSet = this.metabolite_data
  } else if (typeOfData === 'reaction') {
    currentDataSet = this.reaction_data
  }

  sliderReference
    .attr('max', currentDataSet.length)
    .attr('value', 0)

  sliderTarget
    .attr('max', currentDataSet.length)
    .attr('value', 0)

  current = 0
  counter.text((this.current + 1) + ' / ' + (currentDataSet.length))

  d3.select('#referenceText').text('Reference Data Set: ')
  d3.select('#targetText').text('Target Data Set: ')


  var data = []

  for (var i = 0; i < currentDataSet.length; i++) {
    data.push({'DataSet': i})
  }

  var options = dropDownMenuTarget.selectAll('option')
    .data(data)
    .enter()
    .append('option')

  options.text(function (d) {
    return d.value
  })
    .attr('value', function (d) { return d.value })

}

function next () {

  if (typeOfData === 'metabolite') {

    if (this.metabolite_data !== undefined && this.metabolite_data !== null) {
      //choose next data and load it
      if (this.current < this.metabolite_data.length - 1) {
        this.current += 1

        this.builder.set_metabolite_data(this.metabolite_data, this.current)

        this.counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
      }
    }

  } else if (typeOfData === 'reaction') {
    if (this.reaction_data !== undefined && this.reaction_data !== null) {
      //choose next data and load it
      if (this.current < this.reaction_data.length - 1) {
        this.current += 1

        this.builder.set_reaction_data(this.reaction_data, this.current)

        this.counter.text((this.current + 1) + ' / ' + (this.reaction_data.length))
      }
    }
  }

}

function previous () {

  if (typeOfData === 'metabolite') {
    if (this.metabolite_data !== undefined && this.metabolite_data !== null) {
      //choose previous data and load it
      if (this.current > 0) {
        this.current -= 1

        this.builder.set_metabolite_data(this.metabolite_data, this.current)

        this.counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
      }
    }
  } else if (typeOfData === 'reaction') {
    if (this.reaction_data !== undefined && this.reaction_data !== null) {
      //choose previous data and load it
      if (this.current > 0) {
        this.current -= 1

        this.builder.set_reaction_data(this.reaction_data, this.current)

        this.counter.text((this.current + 1) + ' / ' + (this.reaction_data.length))
      }
    }
  }

}

function updateSliderReference () {
  this.current = sliderReference.get('value')
  this.counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
}

function toggleDifferenceMode () {

  if (differenceModeActive) {
    container.style('display', 'block')
    //sliderReference.style('display', 'block')
    //sliderTarget.style('display', 'block')

    differenceModeActive = false
  } else {
    container.style('display', 'none')

    //sliderReference.style('display', 'none')
    //sliderTarget.style('display', 'none')

    differenceModeActive = true
  }

}

// TODO: how to show the data?
// only display diff data on map and don't change dataset?

function showDifferenceData () {

  // this.map.apply_metabolite_data_to_map(null)

  var differenceDataSet = [this.metabolite_data[this.reference], this.metabolite_data[this.target]]
  this.builder.set_metabolite_data(differenceDataSet, 0)

  this.builder._update_data(true, true, 'metabolite')

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
  this.typeOfData = data

}
