/**
 * ZoomContainer
 */

var utils = require('./utils')
var CallbackManager = require('./CallbackManager')
var _ = require('underscore')
var d3_zoom = require('d3-zoom').zoom
var d3_zoomTransform = require('d3-zoom').zoomTransform
var d3_zoomIdentity = require('d3-zoom').zoomIdentity
var d3_select = require('d3-selection').select
var d3_selection = require('d3-selection')

var ZoomContainer = utils.make_class()
ZoomContainer.prototype = {
  init: init,
  set_scroll_behavior: set_scroll_behavior,
  set_use_3d_transform: set_use_3d_transform,
  _update_scroll: _update_scroll,
  toggle_pan_drag: toggle_pan_drag,
  go_to: go_to,
  _go_to_callback: _go_to_callback,
  _go_to_3d: _go_to_3d,
  _clear_3d: _clear_3d,
  _go_to_svg: _go_to_svg,
  zoom_by: zoom_by,
  zoom_in: zoom_in,
  zoom_out: zoom_out,
  get_size: get_size,
  translate_off_screen: translate_off_screen,
}
module.exports = ZoomContainer

/**
 * Make a container that will manage panning and zooming. Creates a new SVG
 * element, with a parent div for CSS3 3D transforms.
 *
 * @param {D3 Selection} selection - A d3 selection of a HTML node to put the
 * zoom container in. Should have a defined width and height.
 *
 * @param {String} scroll_behavior - Either 'zoom' or 'pan'.
 *
 * @param {Boolean} use_3d_transform - If true, then use CSS3 3D transform to
 * speed up pan and zoom.
 *
 * @param {Boolean} fill_screen - If true, then apply styles to body and
 * selection that fill the screen. The styled classes are 'fill-screen-body' and
 * 'fill-screen-div'.
 */
function init (selection, scroll_behavior, use_3d_transform, fill_screen) {
  // set the selection class
  selection.classed('escher-container', true)

  // Stop scrolling on mobile
  // Only necessary for Safari because touch-action CSS is supported by all other browsers
  // TODO Zak needs to figure out why this doesn't work on Safari
  if (navigator && navigator.userAgent && navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Mozilla') === -1) {
    selection.on('touchstart touchmove', function () {
      d3_selection.event.stopPropagation()
    })
  }

  // fill screen classes
  if (fill_screen) {
    d3_select('html').classed('fill-screen', true)
    d3_select('body').classed('fill-screen', true)
    selection.classed('fill-screen-div', true)
  }

  // make the svg
  var zoom_container = selection.append('div')
      .attr('class', 'escher-zoom-container')

  var css3_transform_container = zoom_container.append('div')
      .attr('class', 'escher-3d-transform-container')

  var svg = css3_transform_container.append('svg')
      .attr('class', 'escher-svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')

  // set up the zoom container
  svg.select('.zoom-g').remove()
  var zoomed_sel = svg.append('g').attr('class', 'zoom-g')

  // attributes
  this.selection = selection
  this.zoom_container = zoom_container
  this.css3_transform_container = css3_transform_container
  this.svg = svg
  this.zoomed_sel = zoomed_sel
  this.window_translate = { x: 0, y: 0 }
  this.window_scale = 1.0

  this._scroll_behavior = scroll_behavior
  this._use_3d_transform = use_3d_transform
  this._pan_drag_on = true
  this._zoom_behavior = null
  this._zoom_timeout = null
  this._svg_scale = this.window_scale
  this._svg_translate = this.window_translate
  // this._last_svg_ms = null

  // set up the callbacks
  this.callback_manager = new CallbackManager()

  // update the scroll behavior
  this._update_scroll()
}

/**
 * Set up pan or zoom on scroll.
 * @param {String} scroll_behavior - 'none', 'pan' or 'zoom'.
 */
function set_scroll_behavior (scroll_behavior) {
  this._scroll_behavior = scroll_behavior
  this._update_scroll()
}

/**
 * Set the option use_3d_transform
 */
function set_use_3d_transform (use_3d_transform) {
  this._use_3d_transform = use_3d_transform
}

/**
 * Toggle the zoom drag and the cursor UI for it.
 */
function toggle_pan_drag (on_off) {
  if (_.isUndefined(on_off)) {
    this._pan_drag_on = !this._pan_drag_on
  } else {
    this._pan_drag_on = on_off
  }

  if (this._pan_drag_on) {
    // turn on the hand
    this.zoomed_sel.style('cursor', 'grab')
  } else {
    // turn off the hand
    if (_.contains(['grab', 'grabbing'], this.zoomed_sel.style('cursor'))) {
      this.zoomed_sel.style('cursor', null)
    }
  }

  // update the behaviors
  this._update_scroll()
}

/**
 * Update the pan and zoom behaviors. The behaviors are applied to the
 * css3_transform_container node.
 */
function _update_scroll () {
  if (!_.contains([ 'zoom', 'pan', 'none' ], this._scroll_behavior)) {
    throw Error('Bad value for scroll_behavior: ' + this._scroll_behavior)
  }

  // clear all behaviors
  this.zoom_container.on('mousewheel.zoom', null) // zoom scroll behaviors
    .on('DOMMouseScroll.zoom', null) // disables older versions of Firefox
    .on('wheel.zoom', null) // disables newer versions of Firefox
    .on('dblclick.zoom', null)
    .on('mousewheel.escher', null) // pan scroll behaviors
    .on('DOMMouseScroll.escher', null)
    .on('wheel.escher', null)
    .on('mousedown.zoom', null) // drag behaviors
    .on('touchstart.zoom', null)
    .on('touchmove.zoom', null)
    .on('touchend.zoom', null)

  // This handles dragging to pan, and touch events (in any scroll mode). It
  // also handles scrolling to zoom (only 'zoom' mode). It also raises an
  // exception in node, so catch that during testing. This may be a bug with
  // d3 related to d3 using the global this.document. TODO look into this.
  this._zoom_behavior = d3_zoom()
    .on('start', () => {
      // Be sure to use an inline style instead of a class to avoid layout
      if (d3_selection.event.sourceEvent &&
          d3_selection.event.sourceEvent.type === 'mousedown') {
        this.zoomed_sel.style('cursor', 'grabbing')
      }

      // Prevent default zoom behavior, specifically for mobile pinch zoom
      if (d3_selection.event.sourceEvent !== null) {
        d3_selection.event.sourceEvent.stopPropagation()
        d3_selection.event.sourceEvent.preventDefault()
      }
    })
    .on('zoom', () => {
      this._go_to_callback(d3_selection.event.transform.k, {
        x: d3_selection.event.transform.x,
        y: d3_selection.event.transform.y
      })
    })
    .on('end', () => {
      if (d3_selection.event.sourceEvent &&
          d3_selection.event.sourceEvent.type === 'mouseup') {
        this.zoomed_sel.style('cursor', 'grab')
      }
    })

  // Set it up
  this.zoom_container.call(this._zoom_behavior)

  // Always turn off double-clicking to zoom
  this.zoom_container.on('dblclick.zoom', null)

  // If panning is off, then turn off these listeners
  if (!this._pan_drag_on) {
    this.zoom_container.on('mousedown.zoom', null)
      .on('touchstart.zoom', null)
      .on('touchmove.zoom', null)
      .on('touchend.zoom', null)
  }

  // If scroll to zoom is off, then turn off these listeners
  if (this._scroll_behavior !== 'zoom') {
    this.zoom_container
      .on('mousewheel.zoom', null) // zoom scroll behaviors
      .on('DOMMouseScroll.zoom', null) // disables older versions of Firefox
      .on('wheel.zoom', null) // disables newer versions of Firefox
  }

  // add listeners for scrolling to pan
  if (this._scroll_behavior === 'pan') {
    // Add the wheel listener
    const wheel_fn = () => {
      var ev = d3_selection.event
      var sensitivity = 0.5
      // stop scroll in parent elements
      ev.stopPropagation()
      ev.preventDefault()
      ev.returnValue = false
      // change the location
      var get_directional_disp = function (wheel_delta, delta) {
        var the_delt = _.isUndefined(wheel_delta) ? delta : -wheel_delta / 1.5
        return the_delt * sensitivity
      }
      var new_translate = {
        x: this.window_translate.x - get_directional_disp(ev.wheelDeltaX, ev.deltaX),
        y: this.window_translate.y - get_directional_disp(ev.wheelDeltaY, ev.deltaY),
      }
      this.go_to(this.window_scale, new_translate)
    }

    // apply it
    this.zoom_container.on('mousewheel.escher', wheel_fn)
    this.zoom_container.on('DOMMouseScroll.escher', wheel_fn)
    this.zoom_container.on('wheel.escher', wheel_fn)
  }

  // Set current location
  this.go_to(this.window_scale, this.window_translate)
}

// ------------------------------------------------------------
// Functions to scale and translate
// ------------------------------------------------------------

/**
 * Zoom the container to a specified location.
 * @param {Number} scale - The scale, between 0 and 1.
 * @param {Object} translate - The location, of the form {x: 2.0, y: 3.0}.
 */
function go_to (scale, translate) {
  utils.check_undefined(arguments, [ 'scale', 'translate' ])

  // Check inputs
  if (!scale) {
    throw new Error('Bad scale value')
  }
  if (!translate || !('x' in translate) || !('y' in translate) ||
      _.isNaN(translate.x) || _.isNaN(translate.y)) {
    throw new Error('Bad translate value')
  }

  // Save to zoom behavior, which will call _go_to_callback
  var new_zoom = d3_zoomIdentity
      .translate(translate.x, translate.y)
      .scale(scale)
  this.zoom_container.call(this._zoom_behavior.transform, new_zoom)
}

/**
 * Execute the zoom called by the d3 zoom behavior.
 * @param {Number} scale - The scale, between 0 and 1
 * @param {Object} translate - The location, of the form { x: 2.0, y: 3.0 }
 */
function _go_to_callback (scale, translate) {
  // if the scale changes, run the zoom_change callback
  if (this.window_scale !== scale) {
    this.window_scale = scale
    this.callback_manager.run('zoom_change')
  }
  this.window_translate = translate

  var use_3d_transform = this._use_3d_transform

  if (use_3d_transform) { // 3d tranform
    // cancel all timeouts
    if (!_.isNull(this._zoom_timeout)) {
      clearTimeout(this._zoom_timeout)
    }

    // set the 3d transform
    this._go_to_3d(scale, translate, this._svg_scale, this._svg_translate)

    // if another go_to does not happen within the delay time, then
    // redraw the svg
    this._zoom_timeout = _.delay(function () {
      // redraw the svg
      this._go_to_svg(scale, translate)
    }.bind(this), 100); // between 100 and 600 seems to be usable

  } else { // no 3d transform
    this._go_to_svg(scale, translate)
  }

  this.callback_manager.run('go_to')
}

/**
 * Zoom & pan the CSS 3D transform container
 */
function _go_to_3d (scale, translate, svg_scale, svg_translate) {
  var n_scale = scale / svg_scale
  var n_translate = utils.c_minus_c(translate,
                                    utils.c_times_scalar(svg_translate, n_scale))
  var transform = ('translate(' + n_translate.x + 'px,' + n_translate.y + 'px) '
                   + 'scale(' + n_scale + ')')
  this.css3_transform_container.style('transform', transform)
  this.css3_transform_container.style('-webkit-transform', transform)
  this.css3_transform_container.style('transform-origin', '0 0')
  this.css3_transform_container.style('-webkit-transform-origin', '0 0')
}

function _clear_3d () {
  this.css3_transform_container.style('transform', null)
  this.css3_transform_container.style('-webkit-transform', null)
  this.css3_transform_container.style('transform-origin', null)
  this.css3_transform_container.style('-webkit-transform-origin', null)
}

/**
 * Zoom & pan the svg element. Also runs the svg_start and svg_finish callbacks.
 * @param {Number} scale - The scale, between 0 and 1.
 * @param {Object} translate - The location, of the form {x: 2.0, y: 3.0}.
 * @param {Function} callback - (optional) A callback to run after scaling.
 */
function _go_to_svg (scale, translate, callback) {
  this.callback_manager.run('svg_start')

  // defer to update callbacks
  _.defer(function () {

    // start time
    // var start = new Date().getTime()

    // reset the 3d transform
    this._clear_3d()

    // redraw the svg
    this.zoomed_sel
      .attr('transform',
            'translate(' + translate.x + ',' + translate.y + ') ' +
            'scale(' + scale + ')')
    // save svg location
    this._svg_scale = scale
    this._svg_translate = translate

    _.defer(function () {
      // defer for callback after draw
      this.callback_manager.run('svg_finish')

      if (!_.isUndefined(callback)) callback()

      // wait a few ms to get a reliable end time
      // _.delay(function () {
      //     // end time
      //     var t = new Date().getTime() - start
      //     this._last_svg_ms = t
      // }.bind(this), 20)
    }.bind(this))
  }.bind(this))
}

/**
 * Zoom by a specified multiplier.
 * @param {Number} amount - A multiplier for the zoom. Greater than 1 zooms in
 * and less than 1 zooms out.
 */
function zoom_by (amount) {
  var size = this.get_size()
  var shift = {
    x: size.width/2 - ((size.width/2 - this.window_translate.x) * amount +
                       this.window_translate.x),
    y: size.height/2 - ((size.height/2 - this.window_translate.y) * amount +
                        this.window_translate.y),
  }
  this.go_to(this.window_scale * amount,
             utils.c_plus_c(this.window_translate, shift))
}

/**
 * Zoom in by the default amount with the default options.
 */
function zoom_in () {
  this.zoom_by(1.5)
}

/**
 * Zoom out by the default amount with the default options.
 */
function zoom_out () {
  this.zoom_by(0.667)
}

/**
 * Return the size of the zoom container as coordinates. Throws an error if
 * width or height is not defined.
 * @returns {Object} The size coordinates, e.g. { x: 2, y: 3 }.
 */
function get_size () {
  const {width, height} = this.selection.node().getBoundingClientRect()
  return { width, height }
}

/**
 * Shift window if new reaction will draw off the screen.
 */
function translate_off_screen (coords) {
  // TODO BUG not accounting for scale correctly

  var margin = 120 // pixels
  var size = this.get_size()
  var current = {
    x: {
      min: - this.window_translate.x / this.window_scale +
        margin / this.window_scale,
      max: - this.window_translate.x / this.window_scale +
        (size.width-margin) / this.window_scale,
    },
    y: {
      min: - this.window_translate.y / this.window_scale +
        margin / this.window_scale,
      max: - this.window_translate.y / this.window_scale +
        (size.height-margin) / this.window_scale,
    },
  }

  if (coords.x < current.x.min) {
    this.window_translate.x = this.window_translate.x -
      (coords.x - current.x.min) * this.window_scale
    this.go_to(this.window_scale, this.window_translate)
  } else if (coords.x > current.x.max) {
    this.window_translate.x = this.window_translate.x -
      (coords.x - current.x.max) * this.window_scale
    this.go_to(this.window_scale, this.window_translate)
  }
  if (coords.y < current.y.min) {
    this.window_translate.y = this.window_translate.y -
      (coords.y - current.y.min) * this.window_scale
    this.go_to(this.window_scale, this.window_translate)
  } else if (coords.y > current.y.max) {
    this.window_translate.y = this.window_translate.y -
      (coords.y - current.y.max) * this.window_scale
    this.go_to(this.window_scale, this.window_translate)
  }
}
