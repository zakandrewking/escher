/**
 * Define a brush to select elements in a map.
 * @param {D3 Selection} selection - A d3 selection to place the brush in.
 * @param {Boolean} is_enabled - Whether to turn the brush on.
 * @param {escher.Map} map - The map where the brush will be active.
 * @param {String} insert_after - A d3 selector string to choose the svg element
 *                                that the brush will be inserted after. Often a
 *                                canvas element (e.g. '.canvas-group').
 */

var utils = require('./utils')
var d3_brush = require('d3-brush').brush
var d3_brushSelection = require('d3-brush').brushSelection
var d3_scaleIdentity = require('d3-scale').scaleIdentity
var d3_selection = require('d3-selection')
var d3_select = require('d3-selection').select

var Brush = utils.make_class()
Brush.prototype = {
  init: init,
  toggle: toggle,
  setup_selection_brush: setup_selection_brush,
}
module.exports = Brush

/**
 * Initialize the brush.
 * @param {D3 Selection} selection - The selection for the brush.
 * @param {Boolean} is_enabled - Whether to enable right away.
 * @param {escher.Map} map - The Escher Map object.
 * @param {Node} insert_after - A node within selection to insert after.
 */
function init (selection, is_enabled, map, insert_after) {
  this.brush_sel = selection.append('g').attr('id', 'brush-container')
  var node = this.brush_sel.node()
  var insert_before_node = selection.select(insert_after).node().nextSibling
  if (node !== insert_before_node) {
    node.parentNode.insertBefore(node, insert_before_node)
  }
  this.enabled = is_enabled
  this.map = map
}

/**
 * Returns a boolean for the on/off status of the brush
 * @return {Boolean}
 */
function brush_is_enabled () {
  return this.map.sel.select('.brush').empty()
}

/**
 * Turn the brush on or off
 * @param {Boolean} on_off
 */
function toggle (on_off) {
  if (on_off === undefined) {
    on_off = !this.enabled
  }
  if (on_off) {
    this.setup_selection_brush()
  } else {
    this.brush_sel.selectAll('*').remove()
  }
}

/**
 * Turn off the mouse crosshair
 */
function turn_off_crosshair (sel) {
  sel.selectAll('rect').attr('cursor', null)
}

function setup_selection_brush () {
  var map = this.map
  var selection = this.brush_sel
  var selectable_selection = map.sel.selectAll('#nodes,#text-labels')
  var size_and_location = map.canvas.size_and_location()
  var width = size_and_location.width
  var height = size_and_location.height
  var x = size_and_location.x
  var y = size_and_location.y

  // Clear existing brush
  selection.selectAll('*').remove()

  // Set a flag so we know that the brush is being cleared at the end of a
  // successful brush
  var clearing_flag = false

  var brush = d3_brush()
      .extent([ [ x, y ], [ x + width, y + height ] ])
      .on('start', function () {
        turn_off_crosshair(selection)
        // unhide secondary metabolites if they are hidden
        if (map.settings.get_option('hide_secondary_metabolites')) {
          map.settings.set_conditional('hide_secondary_metabolites', false)
          map.draw_everything()
          map.set_status('Showing secondary metabolites. You can hide them ' +
                         'again in Settings.', 2000)
        }
      })
      .on('brush', function () {
        var shift_key_on = d3_selection.event.sourceEvent.shiftKey
        var rect = d3_brushSelection(this)
        // Check for no selection (e.g. after clearing brush)
        if (rect !== null) {
          // When shift is pressed, ignore the currently selected nodes.
          // Otherwise, brush all nodes.
          var selection = (
            shift_key_on ?
              selectable_selection.selectAll('.node:not(.selected),.text-label:not(.selected)') :
              selectable_selection.selectAll('.node,.text-label')
          )
          selection.classed('selected', (d) => {
            var sx = d.x
            var sy = d.y
            return (rect[0][0] <= sx && sx < rect[1][0] &&
                    rect[0][1] <= sy && sy < rect[1][1])
          })
        }
      })
      .on('end', function () {
        turn_off_crosshair(selection)
        // Clear brush
        var rect = d3_brushSelection(this)
        if (rect === null) {
          if (clearing_flag) {
            clearing_flag = false
          } else {
            // Empty selection, deselect all
            map.select_none()
          }
        } else {
          // Not empty, then clear the box
          clearing_flag = true
          selection.call(brush.move, null)
        }
      })

  selection
    // Initialize brush
    .call(brush)

  // Turn off the pan grab icons
  turn_off_crosshair(selection)
}
