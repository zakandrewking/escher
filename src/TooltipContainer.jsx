/** @jsx h */
import CallbackManager from './CallbackManager'
import PlacedDiv from './PlacedDiv'
import renderWrapper from './renderWrapper'
import _ from 'underscore'

/**
 * Manage the tooltip that lives in a PlacedDiv.
 * @param selection
 * @param tooltipComponent
 * @param zoomContainer
 * @param map
 */
export default class TooltipContainer {
  constructor (selection, TooltipComponent, zoomContainer, map) {
    this.div = selection.append('div').attr('id', 'tooltip-container')
    this.tooltipRef = null

    this.zoomContainer = zoomContainer
    this.setUpZoomCallbacks(zoomContainer)

    // Create callback manager
    this.callback_manager = new CallbackManager()

    this.div.on('mouseover', this.cancelHideTooltip.bind(this))
    this.div.on('mouseleave', this.hide.bind(this))

    this.map = map
    this.setUpMapCallbacks(map)

    this.delay_hide_timeout = null
    this.currentTooltip = null

    renderWrapper(
      TooltipComponent,
      null,
      passProps => this.callback_manager.set('passProps', passProps),
      this.div.node(),
      instance => { this.tooltipRef = instance }
    )
    this.passProps({
      display: false
    })
  }

  /**
    * Function to pass props for the tooltips. Run without an argument to
    * rerender the component
    * @param {Object} props - Props that the tooltip will use
    */
  passProps (props = {}) {
    this.callback_manager.run('passProps', null, props)
  }

  /**
   * Sets up the appropriate callbacks to show the input
   * @param {object} map - map object
   */
  setUpMapCallbacks (map) {
    this.placedDiv = PlacedDiv(this.div, map, undefined, false)

    // connect callbacks to show tooltip
    map.callback_manager.set('show_tooltip.tooltip_container', (type, d) => {
      // Check if the current element is in the list of tooltips to display
      if (map.settings.get('enable_tooltips').indexOf(type
        .replace('reaction_', '')
        .replace('node_', '')
        .replace('gene_', '')) > -1) {
        this.show(type, d)
      }
    })

    // callback to hide / delay hide tooltip
    map.callback_manager.set('hide_tooltip.tooltip_container', () => this.hide())
    map.callback_manager.set('delay_hide_tooltip.tooltip_container', () => this.delayHide())

    // Hides the tooltip when the canvas is touched
    map.sel.selectAll('.canvas-group').on('touchend', () => this.hide())
  }

  setUpZoomCallbacks (zoomContainer) {
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
  is_visible () { // eslint-disable-line camelcase
    return this.placedDiv.is_visible()
  }

  /**
   * Show and place the input.
   * @param {string} type - 'reaction_label', 'node_label', or 'gene_label'
   * @param {Object} d - D3 data for DOM element
   */
  show (type, d) {
    // get rid of a lingering delayed hide
    this.cancelHideTooltip()

    if (_.contains([ 'reaction_label', 'node_label', 'gene_label', 'reaction_object', 'node_object' ], type)) {
      // Use a default height if the ref hasn't been connected yet
      const tooltipSize = (this.tooltipRef !== null && this.tooltipRef.getSize)
                        ? this.tooltipRef.getSize()
                        : { width: 270, height: 100 }
      this.currentTooltip = { type, id: d[type.replace('_label', '_id').replace('_object', '_id')] }
      const windowTranslate = this.zoomContainer.window_translate
      const windowScale = this.zoomContainer.window_scale
      const mapSize = this.map !== null ? this.map.get_size() : { width: 1000, height: 1000 }
      const offset = {x: 0, y: 0}
      const startPosX = (type.replace('reaction_', '').replace('node_', '').replace('gene_', '') === 'object')
                      ? d.xPos
                      : d.label_x
      const startPosY = (type.replace('reaction_', '').replace('node_', '').replace('gene_', '') === 'object')
                      ? d.yPos
                      : d.label_y
      const rightEdge = windowScale * startPosX + windowTranslate.x + tooltipSize.width
      const bottomEdge = windowScale * startPosY + windowTranslate.y + tooltipSize.height
      if (mapSize.width < 500) {
        if (rightEdge > mapSize.width) {
          offset.x = -(rightEdge - mapSize.width) / windowScale
        }
        if (bottomEdge > mapSize.height - 74) {
          offset.y = -(bottomEdge - mapSize.height + 77) / windowScale
        }
      } else {
        if (windowScale * startPosX + windowTranslate.x + 0.5 * tooltipSize.width > mapSize.width) {
          offset.x = -tooltipSize.width / windowScale
        } else if (rightEdge > mapSize.width) {
          offset.x = -(rightEdge - mapSize.width) / windowScale
        }
        if (windowScale * startPosY + windowTranslate.y + 0.5 * tooltipSize.height > mapSize.height - 45) {
          offset.y = -(tooltipSize.height) / windowScale
        } else if (bottomEdge > mapSize.height - 45) {
          offset.y = -(bottomEdge - mapSize.height + 47) / windowScale
        }
      }
      const coords = { x: startPosX + offset.x, y: startPosY + 10 + offset.y }
      this.placedDiv.place(coords)
      this.passProps({
        display: true,
        biggId: d.bigg_id,
        name: d.name,
        loc: coords,
        data: d.data_string,
        type: type.replace('_label', '').replace('node', 'metabolite').replace('_object', '')
      })
    } else {
      throw new Error('Tooltip not supported for object type ' + type)
    }
  }

  /**
   * Hide the input.
   */
  hide () {
    this.placedDiv.hide()
    this.currentTooltip = null
  }

  /**
   * Hide the input after a short delay, so that mousing onto the tooltip does not
   * cause it to hide.
   */
  delayHide () {
    this.delayHideTimeout = setTimeout(() => this.hide(), 100)
  }

  cancelHideTooltip () {
    if (this.delayHideTimeout !== null) {
      clearTimeout(this.delayHideTimeout)
    }
  }
}
