import * as utils from './utils'
import CallbackManager from './CallbackManager'

import { drag as d3Drag } from 'd3-drag'
import { selection as d3Selection, event } from 'd3-selection'
import _ from 'underscore'

/**
 * Canvas. Defines a canvas that accepts drag/zoom events and can be resized.
 * Canvas(selection, x, y, width, height)
 * Adapted from http://bl.ocks.org/mccannf/1629464.
 */
export default class Canvas {
  constructor (selection, sizeAndLocation) {
    this.selection = selection
    this.x = sizeAndLocation.x
    this.y = sizeAndLocation.y
    this.width = sizeAndLocation.width
    this.height = sizeAndLocation.height

    // enable by default
    this.resizeEnabled = true

    // set up the callbacks
    this.callbackManager = new CallbackManager()

    this.setup()
  }

  /**
   * Turn the resize on or off
   */
  toggleResize (onOff) {
    if (_.isUndefined(onOff)) onOff = !this.resizeEnabled

    if (onOff) {
      this.selection.selectAll('.drag-rect')
        .style('pointer-events', 'auto')
    } else {
      this.selection.selectAll('.drag-rect')
        .style('pointer-events', 'none')
    }
  }

  setup () {
    const dragbarWidth = 100
    const mouseNodeMult = 10
    const newSel = this.selection.append('g')
          .classed('canvas-group', true)
          .data([ { x: this.x, y: this.y } ])

    const stopPropagation = () => {
      event.sourceEvent.stopPropagation()
    }

    const transformString = (x, y, currentTransform) => {
      const tr = utils.d3TransformCatch(currentTransform)
      const translate = tr.translate
      if (x !== null) translate[0] = x
      if (y !== null) translate[1] = y
      return 'translate(' + translate + ')'
    }

    const mouseNode = newSel.append('rect')
        .attr('id', 'mouse-node')
        .attr('width', this.width * mouseNodeMult)
        .attr('height', this.height * mouseNodeMult)
        .attr('transform', 'translate(' + [ this.x - this.width * mouseNodeMult / 2, this.y - this.height * mouseNodeMult / 2 ] + ')')
        .attr('pointer-events', 'all')
    this.mouseNode = mouseNode

    const rect = newSel.append('rect')
        .attr('id', 'canvas')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', 'translate(' + [ this.x, this.y ] + ')')

    const dragLeft = d3Drag()
          .on('start', stopPropagation)
          .on('drag', d => {
            const oldX = d.x
            d.x = Math.min(d.x + this.width - (dragbarWidth / 2), event.x)
            this.x = d.x
            this.width = this.width + (oldX - d.x)
            left.attr('transform', d => {
              return transformString(d.x - (dragbarWidth / 2), null, left.attr('transform'))
            })
            mouseNode.attr('transform', d => {
              return transformString(d.x, null, mouseNode.attr('transform'))
            }).attr('width', this.width * mouseNodeMult)
            rect.attr('transform', d => {
              return transformString(d.x, null, rect.attr('transform'))
            }).attr('width', this.width)
            top.attr('transform', d => transformString(d.x + (dragbarWidth / 2), null, top.attr('transform')))
              .attr('width', this.width - dragbarWidth)
            bottom.attr('transform', d => transformString(d.x + (dragbarWidth / 2), null, bottom.attr('transform')))
              .attr('width', this.width - dragbarWidth)

            this.callbackManager.run('resize')
          })

    const left = newSel.append('rect')
          .classed('drag-rect', true)
          .attr('transform', d => 'translate(' + [ d.x - (dragbarWidth / 2), d.y + (dragbarWidth / 2) ] + ')')
          .attr('height', this.height - dragbarWidth)
          .attr('id', 'dragleft')
          .attr('width', dragbarWidth)
          .attr('cursor', 'ew-resize')
          .classed('resize-rect', true)
          .call(dragLeft)

    const dragRight = d3Drag()
          .on('start', stopPropagation)
          .on('drag', d => {
            event.sourceEvent.stopPropagation()
            const dragX = Math.max(d.x + (dragbarWidth / 2),
                                   d.x + this.width + event.dx)
            // recalculate width
            this.width = dragX - d.x
            // move the right drag handle
            right.attr('transform', d =>
              transformString(dragX - (dragbarWidth / 2), null, right.attr('transform'))
            )
            // resize the drag rectangle. as we are only resizing from the
            // right, the x coordinate does not need to change
            mouseNode.attr('width', this.width * mouseNodeMult)
            rect.attr('width', this.width)
            top.attr('width', this.width - dragbarWidth)
            bottom.attr('width', this.width - dragbarWidth)

            this.callbackManager.run('resize')
          })

    const right = newSel.append('rect')
        .classed('drag-rect', true)
        .attr('transform', d => {
          return 'translate(' +
            [ d.x + this.width - (dragbarWidth / 2), d.y + (dragbarWidth / 2) ] +
            ')'
        })
        .attr('id', 'dragright')
        .attr('height', this.height - dragbarWidth)
        .attr('width', dragbarWidth)
        .attr('cursor', 'ew-resize')
        .classed('resize-rect', true)
        .call(dragRight)

    const dragTop = d3Drag()
          .on('start', stopPropagation)
          .on('drag', d => {
            event.sourceEvent.stopPropagation()
            const oldY = d.y
            d.y = Math.min(d.y + this.height - (dragbarWidth / 2), event.y)
            this.y = d.y
            this.height = this.height + (oldY - d.y)
            top.attr('transform', d => {
              return transformString(null, d.y - (dragbarWidth / 2), top.attr('transform'))
            })
            mouseNode.attr('transform', d => {
              return transformString(null, d.y, mouseNode.attr('transform'))
            }).attr('width', this.height * mouseNodeMult)
            rect.attr('transform', d => {
              return transformString(null, d.y, rect.attr('transform'))
            }).attr('height', this.height)
            left.attr('transform', d => {
              return transformString(null, d.y + (dragbarWidth / 2), left.attr('transform'))
            }).attr('height', this.height - dragbarWidth)
            right.attr('transform', d => {
              return transformString(null, d.y + (dragbarWidth / 2), right.attr('transform'))
            }).attr('height', this.height - dragbarWidth)

            this.callbackManager.run('resize')
          })

    const top = newSel.append('rect')
        .classed('drag-rect', true)
        .attr('transform', d => {
          return 'translate(' +
            [ d.x + (dragbarWidth / 2), d.y - (dragbarWidth / 2) ] +
            ')'
        })
        .attr('height', dragbarWidth)
        .attr('width', this.width - dragbarWidth)
        .attr('cursor', 'ns-resize')
        .classed('resize-rect', true)
        .call(dragTop)

    const dragBottom = d3Drag()
          .on('start', stopPropagation)
          .on('drag', d => {
            event.sourceEvent.stopPropagation()
            const dragY = Math.max(d.y + (dragbarWidth / 2),
                                   d.y + this.height + event.dy)
            // recalculate width
            this.height = dragY - d.y
            // move the right drag handle
            bottom.attr('transform', d => transformString(null,
                                                          dragY - (dragbarWidth / 2),
                                                          bottom.attr('transform')))
            // resize the drag rectangle. as we are only resizing from the
            // right, the x coordinate does not need to change
            mouseNode.attr('height', this.height * mouseNodeMult)
            rect.attr('height', this.height)
            left.attr('height', this.height - dragbarWidth)
            right.attr('height', this.height - dragbarWidth)

            this.callbackManager.run('resize')
          })

    const bottom = newSel.append('rect')
          .classed('drag-rect', true)
          .attr('transform', d => 'translate(' + [ d.x + (dragbarWidth / 2), d.y + this.height - (dragbarWidth / 2) ] + ')')
          .attr('height', dragbarWidth)
          .attr('width', this.width - dragbarWidth)
          .attr('cursor', 'ns-resize')
          .classed('resize-rect', true)
          .call(dragBottom)
  }

  sizeAndLocation () {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }
}
