import {
  brush as d3Brush,
  brushSelection as d3BrushSelection
} from 'd3-brush'
import { selection as d3Selection } from 'd3-selection'

/**
 * Define a brush to select elements in a map.
 * @param {D3 Selection} selection - A d3 selection to place the brush in.
 * @param {Boolean} is_enabled - Whether to turn the brush on.
 * @param {escher.Map} map - The map where the brush will be active.
 * @param {String} insert_after - A d3 selector string to choose the svg element
 *                                that the brush will be inserted after. Often a
 *                                canvas element (e.g. '.canvas-group').
 */
export default class Brush {
  constructor (selection, isEnabled, map, insertAfter) {
    this.brushSel = selection.append('g').attr('id', 'brush-container')
    const node = this.brushSel.node()
    const insertBeforeNode = selection.select(insertAfter).node().nextSibling
    if (node !== insertBeforeNode) {
      node.parentNode.insertBefore(node, insertBeforeNode)
    }
    this.enabled = isEnabled
    this.map = map
  }

  /**
   * Returns a boolean for the on/off status of the brush
   * @return {Boolean}
   */
  brushIsEnabled () {
    return this.map.sel.select('.brush').empty()
  }

  /**
   * Turn the brush on or off
   * @param {Boolean} on_off
   */
  toggle (onOff) {
    if (onOff === undefined) {
      onOff = !this.enabled
    }
    if (onOff) {
      this.setupSelectionBrush()
    } else {
      this.brushSel.selectAll('*').remove()
    }
  }

  /**
   * Turn off the mouse crosshair
   */
  turnOffCrosshair (sel) {
    sel.selectAll('rect').attr('cursor', null)
  }

  setupSelectionBrush () {
    const map = this.map
    const selection = this.brushSel
    const selectableSelection = map.sel.selectAll('#nodes,#text-labels')
    const sizeAndLocation = map.canvas.sizeAndLocation()
    const width = sizeAndLocation.width
    const height = sizeAndLocation.height
    const x = sizeAndLocation.x
    const y = sizeAndLocation.y
    const turnOffCrosshair = this.turnOffCrosshair.bind(this)

    // Clear existing brush
    selection.selectAll('*').remove()

    // Set a flag so we know that the brush is being cleared at the end of a
    // successful brush
    let clearingFlag = false

    var brush = d3Brush()
        .extent([ [ x, y ], [ x + width, y + height ] ])
        .on('start', () => {
          this.turnOffCrosshair(selection)
          // unhide secondary metabolites if they are hidden
          if (map.settings.get('hide_secondary_metabolites')) {
            map.settings.set('hide_secondary_metabolites', false)
            map.draw_everything()
            map.set_status('Showing secondary metabolites. You can hide them ' +
                           'again in Settings.', 2000)
          }
        })
        .on('brush', function () {
          const shiftKeyOn = d3Selection.event.sourceEvent.shiftKey
          const rect = d3BrushSelection(this)
          // Check for no selection (e.g. after clearing brush)
          if (rect !== null) {
            // When shift is pressed, ignore the currently selected nodes.
            // Otherwise, brush all nodes.
            var selection = shiftKeyOn
                ? selectableSelection.selectAll('.node:not(.selected),.text-label:not(.selected)')
                : selectableSelection.selectAll('.node,.text-label')
            selection.classed('selected', d => {
              const sx = d.x
              const sy = d.y
              return (rect[0][0] <= sx && sx < rect[1][0] &&
                      rect[0][1] <= sy && sy < rect[1][1])
            })
          }
        })
        .on('end', function () {
          turnOffCrosshair(selection)
          // Clear brush
          var rect = d3BrushSelection(this)
          if (rect === null) {
            if (clearingFlag) {
              clearingFlag = false
            } else {
              // Empty selection, deselect all
              map.select_none()
            }
          } else {
            // Not empty, then clear the box
            clearingFlag = true
            selection.call(brush.move, null)
          }
        })

    selection
    // Initialize brush
      .call(brush)

    // Turn off the pan grab icons
    turnOffCrosshair(selection)
  }
}
