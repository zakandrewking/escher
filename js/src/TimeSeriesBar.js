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

  this.builder = builder

  this.metabolite_data = builder.options.metabolite_data
  this.reaction_data = builder.options.reaction_data

  this.current = 0
  this.reference = 0
  this.target = 0

  differenceModeActive = false


  container = sel.attr('class', 'search-container')
    .style('display', 'none');

  container.append('text')
    .text('Select Metabolite Dataset: ')

  this.counter = container.append('div')
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
    .on('click', this.update.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-refresh')

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

    initDifferenceMode(container)


  this.callback_manager = new CallbackManager()

  this.selection = container
  this.map = map

}


function initDifferenceMode (container) {

  container.append('div')
    .append('text')
    .attr('id', 'referenceText')
    .text('Reference: ')

  sliderReference = container.append('div').append('input')
    .attr('type', 'range')
    .attr('value', reference)
    .attr('min', 0)
    .attr('max', 10)
    .on('change', function() {
      reference = this.value

      d3.select('#referenceText').text('Reference Dataset: ' + reference)
      //sliderTarget.attr('min', reference)

      if(reference < target){
        target = reference
        sliderTarget.value = reference
      }

      //sliderTarget.attr('value', reference)
      //d3.select('#targetText').text('Target Dataset ' + target )
    })
    .style('display', 'block')


  container.append('div')
    .append('text')
    .attr('id', 'targetText')
    .text('Target: ')

  sliderTarget = container.append('div').append('input')
    .attr('type', 'range')
    .attr('value', target)
    .attr('min', 0)
    .attr('max', 10)
    .on('change', function() {

      target = this.value
      d3.select('#targetText').text('Target Dataset ' + target)

    })
    .style('display', 'block')

  dropDownMenuTarget = container.append('select')
    .attr("name", "target-list")



}

/**
 * load data from builder
 * set slider to max of data
 * set dropdown menu length
 *
 * @param new_metabolite_data
 * @param new_reaction_data
 */

function update (new_metabolite_data, new_reaction_data) {

  if(new_metabolite_data !== undefined && new_metabolite_data !== null){
  metabolite_data = new_metabolite_data

 // sliderReference.attr('max', metabolite_data.length)
 // sliderTarget.attr('max', metabolite_data.length)

  var data = []

  for (var i = 0; i < metabolite_data.length; i++){
    data.push({'DataSet': i})
  }

  var options = dropDownMenuTarget.selectAll("option")
    .data(data)
    .enter()
    .append("option");

  options.text(function (d) {
    return d.value; })
    .attr("value", function (d) { return d.value; });

  dropDownMenuTarget.on("change", function (d) { console.log(d.value); });

  }

  if(new_reaction_data !== undefined && new_reaction_data !== null){
    reaction_data = new_reaction_data

  }


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

function next () {

  if(this.metabolite_data !== undefined && this.metabolite_data !== null) {
    //choose next data and load it
    if (this.current < this.metabolite_data.length - 1) {
      this.current += 1

      this.builder.set_metabolite_data(this.metabolite_data, this.current)
      //this.builder.set_reaction_data(this.reaction_data, this.current)

      this.counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
    }
  }
}

function previous () {

  if(this.metabolite_data !== undefined && this.metabolite_data !== null) {
    //choose previous data and load it
    if (this.current > 0) {
      this.current -= 1

      this.builder.set_metabolite_data(this.metabolite_data, this.current)
      //this.builder.set_reaction_data(this.reaction_data, this.current)

      this.counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
    }
  }
}

function updateSliderReference(){
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