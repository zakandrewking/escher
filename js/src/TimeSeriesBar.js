/** TimeSeriesBar
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
var sliderReference, sliderTarget
var differenceModeActive
var reference, target

// instance methods
TimeSeriesBar.prototype = {
  init: init,
  update: update,
  is_visible: is_visible,
  toggle: toggle,
  next: next,
  previous: previous,
  toggleDifferenceMode: toggleDifferenceMode,
  showDifferenceData: showDifferenceData
}
module.exports = TimeSeriesBar

function init (sel, map, builder) {

  // builder object to get and set data
  this.builder = builder

  metabolite_data = builder.options.metabolite_data
  reaction_data = builder.options.reaction_data

  this.current = 0

  differenceModeActive = true

  var container = sel.attr('class', 'search-container')
  // .style('display', 'none'); is always displayed for now

  container.append('text')
    .text('Select Metabolite Dataset: ')

  counter = container.append('div')
    .attr('id', 'counter')
    .attr('class', 'search-counter')
    .text('0 / 0')

  var group = container.append('div').attr('class', 'btn-group btn-group-sm')

  group.append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.previous.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-step-backward')

  group.append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.next.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-step-forward')

  group.append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.toggleDifferenceMode.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-minus')

  group.append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.showDifferenceData.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-indent-left')

  container.append('button')
    .attr('class', 'btn btn-sm btn-default close-button')
    .on('click', function () {
      this.toggle(false)
    }.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-remove')

  container.append('div')
    .append('text')
    .attr('id', 'referenceText')
    .text('Reference: ')

  sliderReference = container.append('div')
    .append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', 10)
    .on('change', function() {
      reference = this.value
      d3.select('#referenceText').text('Reference Dataset: ' + reference)
      sliderTarget.attr('min', reference)
      sliderTarget.attr('value', 0)
      d3.select('#targetText').text('Target Dataset ' + reference )
    })
    .style('display', 'none')


  container.append('div')
    .append('text')
    .attr('id', 'targetText')
    .text('Target: ')

  sliderTarget = container.append('div').append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', 10)
    .on('change', function() {
      target = this.value
      d3.select('#targetText').text('Target Dataset ' + target)
    })
    .style('display', 'none')


  this.callback_manager = new CallbackManager()

  this.selection = container
  this.map = map

}
//TODO: every time data changes the bar should be updated -> call from Builder
function update () {

 // metabolite_data = builder.options.metabolite_data
  //reaction_data = builder.options.reaction_data

//  sliderReference.attr('max', metabolite_data.length)
//  sliderTarget.attr('max', metabolite_data.length)



}

function is_visible () {
  return this.selection.style('display') !== 'none'
}

// I don't know how this callback / keymanager stuff works yet- so this is the same as in SearchBar
function toggle (on_off) {
  if (on_off === undefined) this.is_active = !this.is_active
  else this.is_active = on_off

  if (this.is_active) {
    this.selection.style('display', null)
    this.counter.text('')
    this.input.node().value = ''
    this.input.node().focus()
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

function next () {

  //choose next data and load it
  if (this.current < this.metabolite_data.length - 1) {
    this.current += 1

    this.builder.set_metabolite_data(this.metabolite_data, this.current)
    //this.builder.set_reaction_data(this.reaction_data, this.current)

    counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
  }
}

function previous () {

  //choose previous data and load it
  if (this.current > 0) {
    this.current -= 1

    this.builder.set_metabolite_data(this.metabolite_data, this.current)
    //this.builder.set_reaction_data(this.reaction_data, this.current)

    counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
  }
}

// difference mode

function updateSliderReference(){
  this.current = sliderReference.get('value')
  this.counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
}

function toggleDifferenceMode () {

  if (differenceModeActive) {
    sliderReference.style('display', 'block')
    sliderTarget.style('display', 'block')

    differenceModeActive = false
  } else {
    sliderReference.style('display', 'none')
    sliderTarget.style('display', 'none')

    differenceModeActive = true
  }

}

function showDifferenceData () {

  var differenceDataSet = [this.metabolite_data[reference], this.metabolite_data[target]]

  // // test
  // data = this.metabolite_data
  // reference = 0
  // target = 1
  //
  // for (var i = 0; i < data.length; i++) {
  //   differenceDataSet.push(Math.abs((data[reference].get(i) - data[target].get(i))))
  // }

  this.builder.set_metabolite_data(differenceDataSet, null)

}