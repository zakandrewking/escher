/**
 * TextEditInput
 */

var utils = require('./utils')
var PlacedDiv = require('./PlacedDiv')
var build = require('./build')

var TextEditInput = utils.make_class()
TextEditInput.prototype = {
  init: init,
  setup_map_callbacks: setup_map_callbacks,
  setup_zoom_callbacks: setup_zoom_callbacks,
  is_visible: is_visible,
  show: show,
  hide: hide,
  _accept_changes: _accept_changes,
  _add_and_edit: _add_and_edit
}
module.exports = TextEditInput

function init (selection, map, zoom_container) {
  var div = selection.append('div')
    .attr('id', 'text-edit-input')
  this.placed_div = PlacedDiv(div, map)
  this.placed_div.hide()
  this.input = div.append('input')

  this.map = map
  this.setup_map_callbacks(map)
  this.zoom_container = zoom_container
  this.setup_zoom_callbacks(zoom_container)

  this.is_new = false
}

function setup_map_callbacks (map) {
  // Input
  map.callback_manager.set('edit_text_label.text_edit_input', function (target, coords) {
    this.show(target, coords)
  }.bind(this))

  // new text_label
  map.callback_manager.set('new_text_label.text_edit_input', function (coords) {
    if (this.active_target !== null) {
      this._accept_changes(this.active_target.target)
    }
    this.hide()
    this._add_and_edit(coords)
  }.bind(this))

  map.callback_manager.set('hide_text_label_editor.text_edit_input', function () {
    this.hide()
  }.bind(this))
}

function setup_zoom_callbacks (zoom_container) {
  zoom_container.callback_manager.set('zoom.text_edit_input', function () {
    if (this.active_target) {
      this._accept_changes(this.active_target.target)
    }
    if (this.is_visible()) {
      this.hide()
    }
  }.bind(this))
  zoom_container.callback_manager.set('go_to.text_edit_input', function () {
    if (this.active_target) {
      this._accept_changes(this.active_target.target)
    }
    if (this.is_visible()) {
      this.hide()
    }
  }.bind(this))
}

function is_visible () {
  return this.placed_div.is_visible()
}

function show (target, coords) {
  // save any existing edit
  if (this.active_target) {
    this._accept_changes(this.active_target.target)
  }

  // set the current target
  this.active_target = { target: target, coords: coords }

  // set the new value
  target.each(function (d) {
    this.input.node().value = d.text
  }.bind(this))

  // place the input
  this.placed_div.place(coords)
  this.input.node().focus()

  // escape key
  this.clear_escape = this.map.key_manager
    .addEscapeListener(function () {
      this._accept_changes(target)
      this.hide()
    }.bind(this), true)
  // enter key
  this.clear_enter = this.map.key_manager
    .addEnterListener(function (target) {
      this._accept_changes(target)
      this.hide()
    }.bind(this, target), true)
}

function hide () {
  this.is_new = false

  // hide the input
  this.placed_div.hide()

  // clear the value
  this.input.attr('value', '')
  this.active_target = null

  // clear escape
  if (this.clear_escape) this.clear_escape()
  this.clear_escape = null
  // clear enter
  if (this.clear_enter) this.clear_enter()
  this.clear_enter = null
  // turn off click listener
  // this.map.sel.on('click.', null)
}

function _accept_changes (target) {
  if (this.input.node().value === '') {
    // Delete the label
    target.each(function (d) {
      var selected = {}
      selected[d.text_label_id] = this.map.text_labels[d.text_label_id]
      this.map.delete_selectable({}, selected, true)
    }.bind(this))
  } else {
    // Set the text
    var text_label_ids = []
    target.each(function (d) {
      this.map.edit_text_label(d.text_label_id, this.input.node().value, true,
                               this.is_new)
      text_label_ids.push(d.text_label_id)
    }.bind(this))
  }
}

function _add_and_edit (coords) {
  this.is_new = true

  // Make an empty label
  var text_label_id = this.map.new_text_label(coords, '')
  // Apply the cursor to the new label
  var sel = this.map.sel.select('#text-labels').selectAll('.text-label')
      .filter(function (d) { return d.text_label_id === text_label_id })
  sel.select('text').classed('edit-text-cursor', true)
  this.show(sel, coords)
}
