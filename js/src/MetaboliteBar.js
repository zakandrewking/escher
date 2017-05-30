/** MetaboliteBar
 * is still pretty basic and has a lot of bugs.
 * Think of it as a proof of concept
 */

var utils = require('./utils')
var CallbackManager = require('./CallbackManager')
var _ = require('underscore')

var MetaboliteBar = utils.make_class()
var builderObject
var metabolite_data
var current
var counter

// instance methods
MetaboliteBar.prototype = {
  init: init,
  is_visible: is_visible,
  toggle: toggle,
  next: next,
  previous: previous
}
module.exports = MetaboliteBar

function init (sel, map, builder, data) {

  // builder object to set data
  this.builderObject = builder
  this.metabolite_data = data
  this.current = 0

  var container = sel.attr('class', 'search-container')
  // .style('display', 'none'); is always displayed for now

  container.append('text')
    .text('Select Metabolite Dataset: ')

  this.counter = container.append('div')
    .attr('class', 'search-counter')
    .text('0 / 0')

  var group = container.append('div').attr('class', 'btn-group btn-group-sm')

  group.append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.previous.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-chevron-left')
  group.append('button')
    .attr('class', 'btn btn-default')
    .on('click', this.next.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-chevron-right')

  container.append('button')
    .attr('class', 'btn btn-sm btn-default close-button')
    .on('click', function () {
      this.toggle(false)
    }.bind(this))
    .append('span').attr('class', 'glyphicon glyphicon-remove')

  this.callback_manager = new CallbackManager()

  this.selection = container
  this.map = map

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
    this.builderObject.set_metabolite_data(this.metabolite_data, this.current)

    this.counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
  }
}

function previous () {

  //choose previous data and load it
  if (this.current > 0) {
    this.current -= 1
    this.builderObject.set_metabolite_data(this.metabolite_data, this.current)

    this.counter.text((this.current + 1) + ' / ' + (this.metabolite_data.length))
  }
}
