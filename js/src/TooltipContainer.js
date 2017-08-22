import preact, { h } from 'preact'
import CallbackManager from './CallbackManager'
import TooltipComponentContainer from './TooltipComponentContainer'
const utils = require('./utils')
const PlacedDiv = require('./PlacedDiv')
const _ = require('underscore')

/**
 * Manage the tooltip that lives in a PlacedDiv.
 * @param selection
 * @param map
 * @param tooltipComponent
 * @param zoomContainer
 */
var TooltipContainer = utils.make_class()
// instance methods
TooltipContainer.prototype = {
  init: init,
  setupMapCallbacks: setupMapCallbacks,
  setupZoomCallbacks: setupZoomCallbacks,
  is_visible: is_visible,
  show: show,
  hide: hide,
  delay_hide: delay_hide,
  cancelHideTooltip: cancelHideTooltip
}
module.exports = TooltipContainer

// definitions
function init (selection, map, TooltipComponent, zoomContainer) {
  var div = selection.append('div').attr('id', 'tooltip-container')
  this.TooltipComponent = TooltipComponent
  this.placed_div = PlacedDiv(div, map, undefined, false)

  // Create callback manager
  this.callback_manager = CallbackManager()

  div.on('mouseover', this.cancelHideTooltip.bind(this))
  div.on('mouseleave', this.hide.bind(this))

  this.map = map
  this.setupMapCallbacks(map)
  this.zoomContainer = zoomContainer
  this.setupZoomCallbacks(zoomContainer)

  // Attach a function to get size of tooltip
  this.getTooltipSize = null
  this.callback_manager.set('attachGetSize', getSizeFn => {
    this.getTooltipSize = getSizeFn
  })

  // keep a reference to preact tooltip
  preact.render(
    <TooltipComponentContainer
      callbackManager={this.callback_manager}
      TooltipComponent={this.TooltipComponent}
      />,
     div.node()
  )

  this.delay_hide_timeout = null
  this.currentTooltip = null
}

function setupMapCallbacks (map) {
  map.callback_manager.set('show_tooltip.tooltip_container', function (type, d) {
    if (map.settings.get_option('enable_tooltips')) {
      this.show(type, d)
    }
  }.bind(this))
  map.callback_manager.set('hide_tooltip.tooltip_container',
                           this.hide.bind(this))
  map.callback_manager.set('delay_hide_tooltip.tooltip_container',
                           this.delay_hide.bind(this))
  map.callback_manager.set('update_tooltip.tooltip_container', function (type, sel) {
    if (this.currentTooltip !== null) {
      let d = null
      sel.each(data => {
        if (data[type.replace('_label', '_id')] === this.currentTooltip.id) {
          d = data
        }
      })
      if (d === null) {
        throw Error(`Could not find tooltip data for ${this.currentTooltip}`)
      }
      this.show(type, d)
    }
  }.bind(this))
}

function setupZoomCallbacks (zoomContainer) {
  zoomContainer.callback_manager.set('zoom.tooltip_container', function () {
    if (this.is_visible()) {
      this.hide()
    }
  }.bind(this))
  zoomContainer.callback_manager.set('go_to.tooltip_container', function () {
    if (this.is_visible()) {
      this.hide()
    }
  }.bind(this))
}

/**
 * Return visibility of tooltip container.
 * @return {Boolean} Whether tooltip is visible.
 */
function is_visible () {
  return this.placed_div.is_visible()
}

/**
 * Show and place the input.
 * @param {string} type - 'reaction_label', 'node_label', or 'gene_label'
 * @param {Object} d - D3 data for DOM element
 * @param {Object} coords - Object with x and y coords. Cannot use coords from
 *                          'd' because gene labels do not have them.
 */
function show (type, d) {
  // get rid of a lingering delayed hide
  this.cancelHideTooltip()

  if (_.contains([ 'reaction_label', 'node_label', 'gene_label' ], type)) {
    this.currentTooltip = { type, id: d[type.replace('_label', '_id')] }
    var windowTranslate = this.zoomContainer.window_translate
    var windowScale = this.zoomContainer.window_scale
    var mapSize = this.map.get_size()
    if (this.getTooltipSize !== null) {
      //  console.log(this.getTooltipSize())
    }
    var offset = {x: 0, y: 0}
    if (windowScale * d.label_x + windowTranslate.x + 500 > mapSize.width) {
      offset.x = -500 / windowScale
    }
    if (windowScale * d.label_y + windowTranslate.y + 185 > mapSize.height) {
      offset.y = -185 / windowScale
    }
    var coords = { x: d.label_x + offset.x, y: d.label_y + 10 + offset.y }
    this.placed_div.place(coords)
    const data = {
      biggId: d.bigg_id,
      name: d.name,
      loc: coords,
      data: d.data_string,
      type: type.replace('_label', '').replace('node', 'metabolite')
    }
    this.callback_manager.run('setState', null, data)
  } else {
    throw new Error('Tooltip not supported for object type ' + type)
  }
}

/**
 * Hide the input.
 */
function hide () {
  this.placed_div.hide()
  this.currentTooltip = null
}

/**
 * Hide the input after a short delay, so that mousing onto the tooltip does not
 * cause it to hide.
 */
function delay_hide () {
  this.delay_hide_timeout = setTimeout(function () {
    this.hide()
  }.bind(this), 100)
}

function cancelHideTooltip () {
  if (this.delay_hide_timeout !== null) {
    clearTimeout(this.delay_hide_timeout)
  }
}
