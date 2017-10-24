/**
 * PlacedDiv. A container to position an html div to match the coordinates of a
 * SVG element.
 */

var utils = require('./utils')

var PlacedDiv = utils.make_class()
// instance methods
PlacedDiv.prototype = {
  init: init,
  is_visible: is_visible,
  place: place,
  hide: hide,
}
module.exports = PlacedDiv

function init (div, map, displacement) {
  this.div = div
  this.map = map
  this.displacement = displacement === undefined ? { x: 0, y: 0 } : displacement

  // begin hidden
  this.visible = true
  this.hide()
}

function is_visible () {
  return this.visible
}

/**
 * Position the html div to match the given SVG coordinates.
 */
function place (coords) {
  // show the input
  this.div.style('display', null)

  // move the new input
  var window_translate = this.map.zoom_container.window_translate
  var window_scale = this.map.zoom_container.window_scale
  var map_size = this.map.get_size()
  var left = Math.max(20,
                      Math.min(map_size.width - 270,
                               (window_scale * coords.x + window_translate.x -
                                this.displacement.x)))
  var top = Math.max(20,
                     Math.min(map_size.height - 40,
                              (window_scale * coords.y + window_translate.y -
                               this.displacement.y)))
  this.div.style('position', 'absolute')
    .style('display', 'block')
    .style('left', left + 'px')
    .style('top', top + 'px')

  this.visible = true
}

/**
 * Hide the PlacedDiv.
 */
function hide () {
  if (this.visible) {
    this.div.style('display', 'none')
    this.visible = false
  }
}
