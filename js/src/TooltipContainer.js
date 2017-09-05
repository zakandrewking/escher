/** @jsx h */
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
  setup_map_callbacks: setup_map_callbacks,
  setup_zoom_callbacks: setup_zoom_callbacks,
  is_visible: is_visible,
  show: show,
  hide: hide,
  delay_hide: delay_hide,
  cancelHideTooltip: cancelHideTooltip
}
module.exports = TooltipContainer

// definitions
function init (selection, TooltipComponent, zoomContainer) {
  this.div = selection.append('div').attr('id', 'tooltip-container')
  this.TooltipComponent = TooltipComponent
  this.tooltipRef = null

  this.zoomContainer = zoomContainer
  this.setup_zoom_callbacks(zoomContainer)

  // Create callback manager
  this.callback_manager = CallbackManager()

  this.div.on('mouseover', this.cancelHideTooltip.bind(this))
  this.div.on('mouseleave', this.hide.bind(this))

  // Attach a function to get size of tooltip
  this.getTooltipSize = null
  this.callback_manager.set('attachGetSize', getSizeFn => {
    this.getTooltipSize = getSizeFn
  })

  this.map = null
  this.delay_hide_timeout = null
  this.currentTooltip = null

  // keep a reference to preact tooltip
  preact.render(
    <TooltipComponentContainer
      callbackManager={this.callback_manager}
      TooltipComponent={this.TooltipComponent}
      tooltipRef={instance => { this.tooltipRef = instance }}
      />,
     this.div.node()
  )
}

function setup_map_callbacks (map) {
  this.map = map
  this.placed_div = PlacedDiv(this.div, map, undefined, false)

  map.callback_manager.set('show_tooltip.tooltip_container', function (type, d) {
    if (map.settings.get_option('enable_tooltips')) {
      this.show(type, d)
    }
  }.bind(this))
  map.callback_manager.set('hide_tooltip.tooltip_container', this.hide.bind(this))
  map.sel.selectAll('#canvas').on('touchend', this.hide.bind(this))
  map.callback_manager.set('delay_hide_tooltip.tooltip_container', this.delay_hide.bind(this))
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

function setup_zoom_callbacks (zoomContainer) {
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
    // Use a default height if the ref hasn't been connected yet
    const tooltipSize = this.tooltipRef !== null && this.tooltipRef.getSize
      ? this.tooltipRef.getSize()
      : { width: 270, height: 100 }
    this.currentTooltip = { type, id: d[type.replace('_label', '_id')] }
    var windowTranslate = this.zoomContainer.window_translate
    var windowScale = this.zoomContainer.window_scale
    var mapSize = this.map !== null ? this.map.get_size() : { width: 1000, height: 1000 }
    if (this.getTooltipSize !== null) {
      //  console.log(this.getTooltipSize())
    }
    var offset = {x: 0, y: 0}
    if (mapSize.width < 500) {
      if (windowScale * d.label_x + windowTranslate.x + tooltipSize.width > mapSize.width) {
        offset.x = -(windowScale * d.label_x + windowTranslate.x + tooltipSize.width - mapSize.width) / windowScale
      }
      if (windowScale * d.label_y + windowTranslate.y + tooltipSize.height > mapSize.height - 74) {
        offset.y = -(windowScale * d.label_y + windowTranslate.y + tooltipSize.height - mapSize.height + 77) / windowScale
      }
    } else {
      if (windowScale * d.label_x + windowTranslate.x + 0.5 * tooltipSize.width > mapSize.width) {
        offset.x = -tooltipSize.width / windowScale
      } else if (windowScale * d.label_x + windowTranslate.x + tooltipSize.width > mapSize.width) {
        offset.x = -(windowScale * d.label_x + windowTranslate.x + tooltipSize.width - mapSize.width) / windowScale
      }
      if (windowScale * d.label_y + windowTranslate.y + 0.5 * tooltipSize.height > mapSize.height - 45) {
        offset.y = -(tooltipSize.height) / windowScale
      } else if (windowScale * d.label_y + windowTranslate.y + tooltipSize.height > mapSize.height - 45) {
        offset.y = -(windowScale * d.label_y + windowTranslate.y + tooltipSize.height - mapSize.height + 47) / windowScale
      }
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
