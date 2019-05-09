/* NOT_ES6 */
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

function init (div, map, displacement = { x: 0, y: 0 }, shouldReposition = true) {
  this.div = div
  this.map = map
  this.displacement = displacement
  this.shouldReposition = shouldReposition
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
  var window_translate = this.map.zoomContainer.windowTranslate
  var window_scale = this.map.zoomContainer.windowScale
  var map_size = this.map.get_size()

  /**
   * If shouldReposition is true, the div is placed so that it does not render
   * outside of the viewable area of the window. Math.max is used so that it
   * does not overflow to the left and top, Math.min is used so that it does not
   * overflow to the right or bottom. If the screen is tool small to show the
   * entire div, the div will overflow to the right and bottom.
   */
  if (this.shouldReposition) {
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
      .style('left', `${left}px`)
      .style('top', `${top}px`)
  } else {
    this.div.style('position', 'absolute')
    .style('display', 'block')
    .style('left', `${window_scale * coords.x + window_translate.x - this.displacement.x}px`)
    .style('top', `${window_scale * coords.y + window_translate.y - this.displacement.y}px`)
  }
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
