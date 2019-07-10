import utils from './utils'
import CallbackManager from './CallbackManager'

import _ from 'underscore'
import { selection as d3Selection, event } from 'd3-selection'
import {
  zoom as d3Zoom,
  zoomIdentity as d3ZoomIdentity
} from 'd3-zoom'

/**
 * ZoomContainer
 */
export default class ZoomContainer {
  /**
   * Make a container that will manage panning and zooming. Creates a new SVG
   * element, with a parent div for CSS3 3D transforms.
   * @param {D3 Selection} selection - A d3 selection of a HTML node to put the
   * zoom container in. Should have a defined width and height.
   * @param {String} scroll_behavior - Either 'zoom' or 'pan'.
   * @param {Boolean} use3dTransform - If true, then use CSS3 3D transform to
   * speed up pan and zoom.
   */
  constructor (selection, scrollBehavior, use3dTransform) {
    // set the selection class
    selection.classed('escher-container', true)

    // Stop scrolling on mobile
    // Only necessary for Safari because touch-action CSS is supported by all other browsers
    // TODO Zak needs to figure out why this doesn't work on Safari
    if (navigator && navigator.userAgent && navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Mozilla') === -1) {
      selection.on('touchstart touchmove', function () {
        event.stopPropagation()
      })
    }

    // make the svg
    const container = selection.append('div')
          .attr('class', 'escher-zoom-container')
    const css3TransformContainer = container.append('div')
          .attr('class', 'escher-3d-transform-container')

    const svg = css3TransformContainer.append('svg')
          .attr('class', 'escher-svg')
          .attr('xmlns', 'http://www.w3.org/2000/svg')

    // set up the zoom container
    svg.select('.zoom-g').remove()
    const zoomedSel = svg.append('g').attr('class', 'zoom-g')

    // attributes
    this.selection = selection
    this.container = container
    this.css3TransformContainer = css3TransformContainer
    this.svg = svg
    this.zoomedSel = zoomedSel
    this.windowTranslate = { x: 0, y: 0 }
    this.windowScale = 1.0

    this._scrollBehavior = scrollBehavior
    this._use3dTransform = use3dTransform
    this._panDragOn = true
    this._zoomBehavior = null
    this._zoomTimeout = null
    this._svgScale = this.windowScale
    this._svgTranslate = this.windowTranslate
    // this._lastSvgMs = null

    // set up the callbacks
    this.callbackManager = new CallbackManager()

    // update the scroll behavior
    this._updateScroll()
  }

  /**
   * Set up pan or zoom on scroll.
   * @param {String} scroll_behavior - 'none', 'pan' or 'zoom'.
   */
  setScrollBehavior (scrollBehavior) {
    this._scrollBehavior = scrollBehavior
    this._updateScroll()
  }

  /**
   * Set the option use3dTransform
   */
  setUse3dTransform (use3dTransform) {
    this._use3dTransform = use3dTransform
  }

  /**
   * Toggle the zoom drag and the cursor UI for it.
   */
  togglePanDrag (onOff) {
    if (_.isUndefined(onOff)) {
      this._panDragOn = !this._panDragOn
    } else {
      this._panDragOn = onOff
    }

    if (this._panDragOn) {
      // turn on the hand
      this.zoomedSel.style('cursor', 'grab')
    } else {
      // turn off the hand
      if (_.contains(['grab', 'grabbing'], this.zoomedSel.style('cursor'))) {
        this.zoomedSel.style('cursor', null)
      }
    }

    // update the behaviors
    this._updateScroll()
  }

  /**
   * Update the pan and zoom behaviors. The behaviors are applied to the
   * css3TransformContainer node.
   */
  _updateScroll () {
    if (!_.contains([ 'zoom', 'pan', 'none' ], this._scrollBehavior)) {
      throw Error('Bad value for scroll_behavior: ' + this._scrollBehavior)
    }

    // clear all behaviors
    this.container.on('mousewheel.zoom', null) // zoom scroll behaviors
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
    this._zoomBehavior = d3Zoom()
      .on('start', () => {
        // Be sure to use an inline style instead of a class to avoid layout
        if (event.sourceEvent &&
            event.sourceEvent.type === 'mousedown') {
          this.zoomedSel.style('cursor', 'grabbing')
        }

        // Prevent default zoom behavior, specifically for mobile pinch zoom
        if (event.sourceEvent !== null) {
          event.sourceEvent.stopPropagation()
          event.sourceEvent.preventDefault()
        }
      })
      .on('zoom', () => {
        this._goToCallback(event.transform.k, {
          x: event.transform.x,
          y: event.transform.y
        })
      })
      .on('end', () => {
        if (event.sourceEvent &&
            event.sourceEvent.type === 'mouseup') {
          this.zoomedSel.style('cursor', 'grab')
        }
      })

    // Set it up
    this.container.call(this._zoomBehavior)

    // Always turn off double-clicking to zoom
    this.container.on('dblclick.zoom', null)

    // If panning is off, then turn off these listeners
    if (!this._panDragOn) {
      this.container.on('mousedown.zoom', null)
        .on('touchstart.zoom', null)
        .on('touchmove.zoom', null)
        .on('touchend.zoom', null)
    }

    // If scroll to zoom is off, then turn off these listeners
    if (this._scrollBehavior !== 'zoom') {
      this.container
        .on('mousewheel.zoom', null) // zoom scroll behaviors
        .on('DOMMouseScroll.zoom', null) // disables older versions of Firefox
        .on('wheel.zoom', null) // disables newer versions of Firefox
    }

    // add listeners for scrolling to pan
    if (this._scrollBehavior === 'pan') {
      // Add the wheel listener
      const wheelFn = () => {
        const ev = event
        const sensitivity = 0.5
        // stop scroll in parent elements
        ev.stopPropagation()
        ev.preventDefault()
        ev.returnValue = false
        // change the location
        const getDirectionalDisp = (wheelDelta, delta) => {
          const theDelt = _.isUndefined(wheelDelta) ? delta : -wheelDelta / 1.5
          return theDelt * sensitivity
        }
        const newTranslate = {
          x: this.windowTranslate.x - getDirectionalDisp(ev.wheelDeltaX, ev.deltaX),
          y: this.windowTranslate.y - getDirectionalDisp(ev.wheelDeltaY, ev.deltaY)
        }
        this.goTo(this.windowScale, newTranslate)
      }

      // apply it
      this.container.on('mousewheel.escher', wheelFn)
      this.container.on('DOMMouseScroll.escher', wheelFn)
      this.container.on('wheel.escher', wheelFn)
    }

    // Set current location
    this.goTo(this.windowScale, this.windowTranslate)
  }

  // ------------------------------------------------------------
  // Functions to scale and translate
  // ------------------------------------------------------------

  /**
   * Zoom the container to a specified location.
   * @param {Number} scale - The scale, between 0 and 1.
   * @param {Object} translate - The location, of the form {x: 2.0, y: 3.0}.
   */
  goTo (scale, translate) {
    // Check inputs
    if (!scale) {
      console.error('Bad scale value')
      return
    }
    if (!translate || !('x' in translate) || !('y' in translate) ||
        _.isNaN(translate.x) || _.isNaN(translate.y)) {
      console.error('Bad translate value')
      return
    }

    // Save to zoom behavior, which will call _goTo_callback
    const newZoom = d3ZoomIdentity
          .translate(translate.x, translate.y)
          .scale(scale)
    this.container.call(this._zoomBehavior.transform, newZoom)
  }

  /**
   * Execute the zoom called by the d3 zoom behavior.
   * @param {Number} scale - The scale, between 0 and 1
   * @param {Object} translate - The location, of the form { x: 2.0, y: 3.0 }
   */
  _goToCallback (scale, translate) {
    // if the scale changes, run the zoom_change callback
    if (this.windowScale !== scale) {
      this.windowScale = scale
      this.callbackManager.run('zoom_change')
    }
    this.windowTranslate = translate

    if (this._use3dTransform) { // 3d transform
      // cancel all timeouts
      if (!_.isNull(this._zoomTimeout)) {
        clearTimeout(this._zoomTimeout)
      }

      // set the 3d transform
      this._goTo3d(scale, translate, this._svgScale, this._svgTranslate)

      // if another goTo does not happen within the delay time, then
      // redraw the svg
      this._zoomTimeout = _.delay(() => {
        // redraw the svg
        this._goToSvg(scale, translate)
      }, 100) // between 100 and 600 seems to be usable
    } else { // no 3d transform
      this._goToSvg(scale, translate)
    }

    this.callbackManager.run('go_to')
  }

  /**
   * Zoom & pan the CSS 3D transform container
   */
  _goTo3d (scale, translate, svgScale, svgTranslate) {
    const nScale = scale / svgScale
    const nTranslate = utils.c_minus_c(translate,
                                        utils.c_times_scalar(svgTranslate, nScale))
    const transform = ('translate(' + nTranslate.x + 'px,' + nTranslate.y + 'px) ' +
                       'scale(' + nScale + ')')
    this.css3TransformContainer.style('transform', transform)
    this.css3TransformContainer.style('-webkit-transform', transform)
    this.css3TransformContainer.style('transform-origin', '0 0')
    this.css3TransformContainer.style('-webkit-transform-origin', '0 0')
  }

  _clear3d () {
    this.css3TransformContainer.style('transform', null)
    this.css3TransformContainer.style('-webkit-transform', null)
    this.css3TransformContainer.style('transform-origin', null)
    this.css3TransformContainer.style('-webkit-transform-origin', null)
  }

  /**
   * Zoom & pan the svg element. Also runs the svg_start and svg_finish callbacks.
   * @param {Number} scale - The scale, between 0 and 1.
   * @param {Object} translate - The location, of the form {x: 2.0, y: 3.0}.
   * @param {Function} callback - (optional) A callback to run after scaling.
   */
  _goToSvg (scale, translate, callback) {
    this.callbackManager.run('svg_start')

    // defer to update callbacks
    _.defer(() => {
      // start time
      // var start = new Date().getTime()

      // reset the 3d transform
      this._clear3d()

      // redraw the svg
      this.zoomedSel
        .attr('transform',
              'translate(' + translate.x + ',' + translate.y + ') ' +
              'scale(' + scale + ')')
      // save svg location
      this._svgScale = scale
      this._svgTranslate = translate

      _.defer(() => {
        // defer for callback after draw
        this.callbackManager.run('svg_finish')

        if (!_.isUndefined(callback)) callback()

        // wait a few ms to get a reliable end time
        // _.delay(function () {
        //     // end time
        //     var t = new Date().getTime() - start
        //     this._lastSvgMs = t
        // }.bind(this), 20)
      })
    })
  }

  /**
   * Zoom by a specified multiplier.
   * @param {Number} amount - A multiplier for the zoom. Greater than 1 zooms in
   * and less than 1 zooms out.
   */
  zoomBy (amount) {
    var size = this.get_size()
    var shift = {
      x: size.width / 2 - ((size.width / 2 - this.windowTranslate.x) * amount +
                           this.windowTranslate.x),
      y: size.height / 2 - ((size.height / 2 - this.windowTranslate.y) * amount +
                            this.windowTranslate.y)
    }
    this.goTo(this.windowScale * amount,
               utils.c_plus_c(this.windowTranslate, shift))
  }

  /**
   * Zoom in by the default amount with the default options.
   */
  zoom_in () {
    this.zoomBy(1.5)
  }

  /**
   * Zoom out by the default amount with the default options.
   */
  zoom_out () {
    this.zoomBy(0.667)
  }

  /**
   * Return the size of the zoom container as coordinates. Throws an error if
   * width or height is not defined.
   * @returns {Object} The size coordinates, e.g. { x: 2, y: 3 }.
   */
  get_size () {
    const {width, height} = this.selection.node().getBoundingClientRect()
    return { width, height }
  }

  /**
   * Shift window if new reaction will draw off the screen.
   */
  translateOffScreen (coords) {
    // TODO BUG not accounting for scale correctly

    var margin = 120 // pixels
    var size = this.get_size()
    var current = {
      x: {
        min: -this.windowTranslate.x / this.windowScale +
          margin / this.windowScale,
        max: -this.windowTranslate.x / this.windowScale +
          (size.width - margin) / this.windowScale
      },
      y: {
        min: -this.windowTranslate.y / this.windowScale +
          margin / this.windowScale,
        max: -this.windowTranslate.y / this.windowScale +
          (size.height - margin) / this.windowScale
      }
    }

    if (coords.x < current.x.min) {
      this.windowTranslate.x = this.windowTranslate.x -
        (coords.x - current.x.min) * this.windowScale
      this.goTo(this.windowScale, this.windowTranslate)
    } else if (coords.x > current.x.max) {
      this.windowTranslate.x = this.windowTranslate.x -
        (coords.x - current.x.max) * this.windowScale
      this.goTo(this.windowScale, this.windowTranslate)
    }
    if (coords.y < current.y.min) {
      this.windowTranslate.y = this.windowTranslate.y -
        (coords.y - current.y.min) * this.windowScale
      this.goTo(this.windowScale, this.windowTranslate)
    } else if (coords.y > current.y.max) {
      this.windowTranslate.y = this.windowTranslate.y -
        (coords.y - current.y.max) * this.windowScale
      this.goTo(this.windowScale, this.windowTranslate)
    }
  }
}
