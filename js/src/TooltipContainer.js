var utils = require('./utils')
var PlacedDiv = require('./PlacedDiv')
var tinier = require('tinier')
var _ = require('underscore')

/**
 * Manage the tooltip that lives in a PlacedDiv.
 * @param selection
 * @param map
 * @param tooltip_component
 * @param zoom_container
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
  cancel_hide_tooltip: cancel_hide_tooltip,
}
module.exports = TooltipContainer

// definitions
function init (selection, map, tooltip_component, zoom_container) {
  var div = selection.append('div').attr('id', 'tooltip-container')
  this.placed_div = PlacedDiv(div, map)

  div.on('mouseover', this.cancel_hide_tooltip.bind(this))
  div.on('mouseleave', this.hide.bind(this))

  this.map = map
  this.setup_map_callbacks(map)
  this.zoom_container = zoom_container
  this.setup_zoom_callbacks(zoom_container)

  // keep a reference to tinier tooltip
  this.tooltip_component = tooltip_component
  // if they pass in a function, then use that
  this.tooltip_function = (_.isFunction(tooltip_component) ?
                           function (state) { tooltip_component({ state: state, el: div.node() })} :
                           null)
  // if they pass in a tinier component, use that
  this.tinier_tooltip = (tinier.checkType(tinier.COMPONENT, tooltip_component) ?
                         tinier.run(tooltip_component, div.node()) :
                         null)

  this.delay_hide_timeout = null
}

function setup_map_callbacks (map) {
  map.callback_manager.set('show_tooltip.tooltip_container', function (type, d) {
    if (map.settings.get_option('enable_tooltips')) {
      this.show(type, d)
    }
  }.bind(this))
  map.callback_manager.set('hide_tooltip.tooltip_container',
                           this.hide.bind(this))
  map.callback_manager.set('delay_hide_tooltip.tooltip_container',
                           this.delay_hide.bind(this))
}

function setup_zoom_callbacks (zoom_container) {
  zoom_container.callback_manager.set('zoom.tooltip_container', function () {
    if (this.is_visible()) {
      this.hide()
    }
  }.bind(this))
  zoom_container.callback_manager.set('go_to.tooltip_container', function () {
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
 * @param {String} type - 'reaction_label', 'node_label', or 'gene_label'
 * @param {Object} d - D3 data for DOM element
 * @param {Object} coords - Object with x and y coords. Cannot use coords from
 *                          'd' because gene labels do not have them.
 */
function show (type, d) {
  // get rid of a lingering delayed hide
  this.cancel_hide_tooltip()

  if (_.contains([ 'reaction_label', 'node_label', 'gene_label' ], type)) {
    var coords = { x: d.label_x, y: d.label_y + 10 }
    this.placed_div.place(coords)
    const data = {
      biggId: d.bigg_id,
      name: d.name,
      loc: coords,
      data: d.data_string,
      type: type.replace('_label', '').replace('node', 'metabolite'),
    }
    if (this.tooltip_function !== null) {
      this.tooltip_function(data)
    } else if (this.tinier_tooltip) {
      this.tinier_tooltip.reducers.setContainerData(data)
    }
  } else {
    throw new Error('Tooltip not supported for object type ' + type)
  }
}

/**
 * Hide the input.
 */
function hide () {
  this.placed_div.hide()
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

function cancel_hide_tooltip () {
  if (this.delay_hide_timeout !== null) {
    clearTimeout(this.delay_hide_timeout)
  }
}
