import utils from './utils'
import build from './build'
import { drag as d3Drag } from 'd3-drag'
import * as d3Selection from 'd3-selection'

const d3Select = d3Selection.select
const d3Mouse = d3Selection.mouse

/**
 * Behavior. Defines the set of click and drag behaviors for the map, and keeps
 * track of which behaviors are activated.
 * @param map {Map} -
 * @param undoStack {UndoStack} -
 */
export default class Behavior {
  constructor (map, undoStack) {
    this.map = map
    this.undoStack = undoStack

    // make an empty function that can be called as a behavior and does nothing
    this.emptyBehavior = () => {}

    // rotation mode operates separately from the rest
    this.rotationModeEnabled = false
    this.rotationDrag = d3Drag()

    // behaviors to be applied
    this.selectableMousedown = null
    this.textLabelMousedown = null
    this.textLabelClick = null
    this.selectableDrag = this.emptyBehavior
    this.nodeMouseover = null
    this.nodeMouseout = null
    this.labelMousedown = null
    this.labelMouseover = this.emptyBehavior
    this.labelMouseout = null
    this.labelTouch = null
    this.objectMouseover = this.emptyBehavior
    this.objectTouch = null
    this.objectMouseout = null
    this.bezierDrag = this.emptyBehavior
    this.bezierMouseover = null
    this.bezierMouseout = null
    this.reactionLabelDrag = this.emptyBehavior
    this.nodeLabelDrag = this.emptyBehavior
    this.dragging = false
    this.turnEverythingOn()
  }

  /**
   * Toggle everything except rotation mode and text mode.
   */
  turnEverythingOn () {
    this.toggleSelectableClick(true)
    this.toggleSelectableDrag(true)
    this.toggleLabelDrag(true)
    this.toggleLabelMouseover(true)
    this.toggleLabelTouch(true)
    this.toggleObjectMouseover(true)
    this.toggleObjectTouch(true)
  }

  /**
   * Toggle everything except rotation mode and text mode.
   */
  turnEverythingOff () {
    this.toggleSelectableClick(false)
    this.toggleSelectableDrag(false)
    this.toggleLabelDrag(false)
    this.toggleLabelMouseover(false)
    this.toggleLabelTouch(false)
    this.toggleObjectMouseover(false)
    this.toggleObjectTouch(false)
  }

  averageLocation (nodes) {
    const xs = []
    const ys = []
    for (const nodeId in nodes) {
      const node = nodes[nodeId]
      if (node.x !== undefined) xs.push(node.x)
      if (node.y !== undefined) ys.push(node.y)
    }
    return {
      x: utils.mean(xs),
      y: utils.mean(ys)
    }
  }

  showCenter () {
    const sel = this.map.sel.selectAll('#rotation-center').data([ 0 ])
    const enterSel = sel.enter().append('g').attr('id', 'rotation-center')

    enterSel.append('path').attr('d', 'M-32 0 L32 0')
      .attr('class', 'rotation-center-line')
    enterSel.append('path').attr('d', 'M0 -32 L0 32')
      .attr('class', 'rotation-center-line')

    const updateSel = enterSel.merge(sel)

    updateSel.attr('transform',
                   'translate(' + this.center.x + ',' + this.center.y + ')')
      .attr('visibility', 'visible')
      .on('mouseover', function () {
        const current = parseFloat(updateSel.selectAll('path').style('stroke-width'))
        updateSel.selectAll('path').style('stroke-width', current * 2 + 'px')
      })
      .on('mouseout', function () {
        updateSel.selectAll('path').style('stroke-width', null)
      })
      .call(d3Drag().on('drag', () => {
        const cur = utils.d3_transform_catch(updateSel.attr('transform'))
        const newLoc = [
          d3Selection.event.dx + cur.translate[0],
          d3Selection.event.dy + cur.translate[1]
        ]
        updateSel.attr('transform', 'translate(' + newLoc + ')')
        this.center = { x: newLoc[0], y: newLoc[1] }
      }))
  }

  hideCenter () {
    this.map.sel.select('#rotation-center')
      .attr('visibility', 'hidden')
  }

  /**
   * Listen for rotation, and rotate selected nodes.
   */
  toggleRotationMode (onOff) {
    if (onOff === undefined) {
      this.rotationModeEnabled = !this.rotationModeEnabled
    } else {
      this.rotationModeEnabled = onOff
    }

    const selectionNode = this.map.sel.selectAll('.node-circle')
    const selectionBackground = this.map.sel.selectAll('#canvas')

    if (this.rotationModeEnabled) {
      const selectedNodes = this.map.getSelectedNodes()
      if (Object.keys(selectedNodes).length === 0) {
        console.warn('No selected nodes')
        return
      }

      // show center
      this.center = this.averageLocation(selectedNodes)
      this.showCenter()

      // this.setStatus('Drag to rotate.')
      const map = this.map
      const selectedNodeIds = Object.keys(selectedNodes)
      const reactions = this.map.reactions
      const nodes = this.map.nodes
      const beziers = this.map.beziers

      const startFn = d => {
        // silence other listeners
        d3Selection.event.sourceEvent.stopPropagation()
      }
      const dragFn = (d, angle, totalAngle, center) => {
        const updated = build.rotate_nodes(selectedNodes, reactions,
                                          beziers, angle, center)
        map.draw_these_nodes(updated.node_ids)
        map.draw_these_reactions(updated.reaction_ids)
      }
      const endFn = d => {}
      const undoFn = (d, totalAngle, center) => {
        // undo
        const theseNodes = {}
        selectedNodeIds.forEach(function (id) {
          theseNodes[id] = nodes[id]
        })
        const updated = build.rotate_nodes(theseNodes, reactions,
                                        beziers, -totalAngle,
                                        center)
        map.draw_these_nodes(updated.node_ids)
        map.draw_these_reactions(updated.reaction_ids)
      }
      const redoFn = (d, totalAngle, center) => {
        // redo
        const theseNodes = {}
        selectedNodeIds.forEach(id => {
          theseNodes[id] = nodes[id]
        })
        const updated = build.rotate_nodes(theseNodes, reactions,
                                          beziers, totalAngle,
                                          center)
        map.draw_these_nodes(updated.node_ids)
        map.draw_these_reactions(updated.reaction_ids)
      }
      const centerFn = () => this.center
      this.rotationDrag = this.getGenericAngularDrag(startFn, dragFn,
                                                     endFn, undoFn,
                                                     redoFn, centerFn,
                                                     this.map.sel)
      selectionBackground.call(this.rotationDrag)
      this.selectableDrag = this.rotationDrag
    } else {
      // turn off all listeners
      this.hideCenter()
      selectionNode.on('mousedown.center', null)
      selectionBackground.on('mousedown.center', null)
      selectionBackground.on('mousedown.drag', null)
      selectionBackground.on('touchstart.drag', null)
      this.rotationDrag = null
      this.selectableDrag = null
    }
  }

  /**
   * With no argument, toggle the node click on or off. Pass in a boolean argument
   * to set the on/off state.
   */
  toggleSelectableClick (onOff) {
    if (onOff === undefined) {
      onOff = this.selectableMousedown === null
    }
    if (onOff) {
      const map = this.map
      this.selectableMousedown = d => {
        // stop propogation for the buildinput to work right
        d3Selection.event.stopPropagation()
        // this.parentNode.__data__.wasSelected = d3Select(this.parentNode).classed('selected')
        // d3Select(this.parentNode).classed('selected', true)
      }
      this.selectableClick = function (d) {
        // stop propogation for the buildinput to work right
        d3Selection.event.stopPropagation()
        // click suppressed. This DOES have en effect.
        if (d3Selection.event.defaultPrevented) return
        // turn off the temporary selection so select_selectable
        // works. This is a bit of a hack.
        // if (!this.parentNode.__data__.wasSelected)
        //     d3Select(this.parentNode).classed('selected', false)
        map.select_selectable(this, d, d3Selection.event.shiftKey)
        // this.parentNode.__data__.wasSelected = false
      }
      this.nodeMouseover = function (d) {
        d3Select(this).style('stroke-width', null)
        const current = parseFloat(d3Select(this).style('stroke-width'))
        if (!d3Select(this.parentNode).classed('selected')) {
          d3Select(this).style('stroke-width', current * 3 + 'px')
        }
      }
      this.nodeMouseout = function (d) {
        d3Select(this).style('stroke-width', null)
      }
    } else {
      this.selectableMousedown = null
      this.selectableClick = null
      this.nodeMouseover = null
      this.nodeMouseout = null
      this.map.sel.select('#nodes')
        .selectAll('.node-circle').style('stroke-width', null)
    }
  }

  /**
   * With no argument, toggle the text edit on mousedown on/off. Pass in a boolean
   * argument to set the on/off state. The backup state is equal to
   * selectableMousedown.
   */
  toggleTextLabelEdit (onOff) {
    if (onOff === undefined) {
      onOff = this.textEditMousedown == null
    }
    if (onOff) {
      const map = this.map
      this.textLabelMousedown = function () {
        if (d3Selection.event.defaultPrevented) {
          return // mousedown suppressed
        }
        // run the callback
        const coordsA = utils.d3_transform_catch(d3Select(this).attr('transform')).translate
        const coords = { x: coordsA[0], y: coordsA[1] }
        map.callback_manager.run('edit_text_label', null, d3Select(this), coords)
        d3Selection.event.stopPropagation()
      }
      this.textLabelClick = null
      this.map.sel.select('#text-labels')
        .selectAll('.label')
        .style('cursor', 'text')
      // add the new-label listener
      this.map.sel.on('mousedown.new_text_label', function (node) {
        // silence other listeners
        d3Selection.event.preventDefault()
        const coords = {
          x: d3Mouse(node)[0],
          y: d3Mouse(node)[1]
        }
        this.map.callback_manager.run('new_text_label', null, coords)
      }.bind(this, this.map.sel.node()))
    } else {
      this.textLabelMousedown = this.selectableMousedown
      this.textLabelClick = this.selectableClick
      this.map.sel.select('#text-labels')
        .selectAll('.label')
        .style('cursor', null)
      // remove the new-label listener
      this.map.sel.on('mousedown.new_text_label', null)
      this.map.callback_manager.run('hide_text_label_editor')
    }
  }

  /**
   * With no argument, toggle the node drag & bezier drag on or off. Pass in a
   * boolean argument to set the on/off state.
   */
  toggleSelectableDrag (onOff) {
    if (onOff === undefined) {
      onOff = this.selectableDrag === this.emptyBehavior
    }
    if (onOff) {
      this.selectableDrag = this.getSelectableDrag(this.map, this.undoStack)
      this.bezierDrag = this.getBezierDrag(this.map, this.undoStack)
    } else {
      this.selectableDrag = this.emptyBehavior
      this.bezierDrag = this.emptyBehavior
    }
  }

  /**
   * With no argument, toggle the label drag on or off. Pass in a boolean argument
   * to set the on/off state.
   * @param {Boolean} onOff - The new on/off state.
   */
  toggleLabelDrag (onOff) {
    if (onOff === undefined) {
      onOff = this.labelDrag === this.emptyBehavior
    }
    if (onOff) {
      this.reactionLabelDrag = this.getReactionLabelDrag(this.map)
      this.nodeLabelDrag = this.getNodeLabelDrag(this.map)
    } else {
      this.reactionLabelDrag = this.emptyBehavior
      this.nodeLabelDrag = this.emptyBehavior
    }
  }

  /**
   * With no argument, toggle the tooltips on mouseover labels.
   * @param {Boolean} onOff - The new on/off state.
   */
  toggleLabelMouseover (onOff) {
    if (onOff === undefined) {
      onOff = this.labelMouseover === this.emptyBehavior
    }

    if (onOff) {
      // Show/hide tooltip.
      // @param {String} type - 'reactionLabel' or 'nodeLabel'
      // @param {Object} d - D3 data for DOM element
      this.labelMouseover = (type, d) => {
        if (!this.dragging) {
          this.map.callback_manager.run('show_tooltip', null, type, d)
        }
      }

      this.labelMouseout = () => {
        this.map.callback_manager.run('delay_hide_tooltip')
      }
    } else {
      this.labelMouseover = this.emptyBehavior
    }
  }

  /**
   * With no argument, toggle the tooltips upon touching of labels.
   * @param {Boolean} onOff - The new on/off state. If this argument is not
   *                          provided, then toggle the state.
   */
  toggleLabelTouch (onOff) {
    if (onOff === undefined) {
      onOff = this.labelTouch === null
    }

    if (onOff) {
      // Show/hide tooltip.
      // @param {String} type - 'reactionLabel' or 'nodeLabel'
      // @param {Object} d - D3 data for DOM element
      this.labelTouch = (type, d) => {
        if (!this.dragging) {
          this.map.callback_manager.run('show_tooltip', null, type, d)
        }
      }
    } else {
      this.labelTouch = null
    }
  }

  /**
   * With no argument, toggle the tooltips on mouseover of nodes or arrows.
   * @param {Boolean} onOff - The new on/off state.
   */
  toggleObjectMouseover (onOff) {
    if (onOff === undefined) {
      onOff = this.objectMouseover === this.emptyBehavior
    }

    if (onOff) {
      // Show/hide tooltip.
      // @param {String} type - 'reaction_object' or 'node_object'
      // @param {Object} d - D3 data for DOM element
      this.objectMouseover = (type, d) => {
        if (!this.dragging) {
          this.map.callback_manager.run('show_tooltip', null, type, d)
        }
      }

      this.objectMouseout = () => {
        this.map.callback_manager.run('delay_hide_tooltip')
      }
    } else {
      this.objectMouseover = this.emptyBehavior
    }
  }

  /**
   * With no argument, toggle the tooltips upon touching of nodes or arrows.
   * @param {Boolean} onOff - The new on/off state. If this argument is not provided, then toggle the state.
   */
  toggleObjectTouch (onOff) {
    if (onOff === undefined) {
      onOff = this.labelTouch === null
    }

    if (onOff) {
      this.objectTouch = (type, d) => {
        if (!this.dragging) {
          this.map.callback_manager.run('show_tooltip', null, type, d)
        }
      }
    } else {
      this.objectTouch = null
    }
  }

  /**
   * With no argument, toggle the bezier drag on or off. Pass in a boolean
   * argument to set the on/off state.
   */
  toggleBezierDrag (onOff) {
    if (onOff === undefined) {
      onOff = this.bezierDrag === this.emptyBehavior
    }
    if (onOff) {
      this.bezierDrag = this.getBezierDrag(this.map)
      this.bezierMouseover = function (d) {
        d3Select(this).style('stroke-width', '3px')
      }
      this.bezierMouseout = function (d) {
        d3Select(this).style('stroke-width', '1px')
      }
    } else {
      this.bezierDrag = this.emptyBehavior
      this.bezierMouseover = null
      this.bezierMouseout = null
    }
  }

  turnOffDrag (sel) {
    sel.on('mousedown.drag', null)
    sel.on('touchstart.drag', null)
  }

  combineNodesAndDraw (fixedNodeId, draggedNodeId) {
    const map = this.map
    const draggedNode = map.nodes[draggedNodeId]
    const fixedNode = map.nodes[fixedNodeId]
    const updatedSegmentObjs = []
    draggedNode.connected_segments.forEach(segmentObj => {
      // change the segments to reflect
      let segment = null
      try {
        segment = map.reactions[segmentObj.reaction_id].segments[segmentObj.segment_id]
        if (segment === undefined) throw new Error('undefined segment')
      } catch (e) {
        console.warn('Could not find connected segment ' + segmentObj.segment_id)
        return
      }
      if (segment.from_node_id === draggedNodeId) segment.from_node_id = fixedNodeId
      else if (segment.to_node_id === draggedNodeId) segment.to_node_id = fixedNodeId
      else {
        console.error('Segment does not connect to dragged node')
        return
      }
      // moved segmentObj to fixedNode
      fixedNode.connected_segments.push(segmentObj)
      updatedSegmentObjs.push(utils.clone(segmentObj))
    })
    // delete the old node
    map.delete_node_data([draggedNodeId])
    // turn off the class
    map.sel.selectAll('.node-to-combine').classed('node-to-combine', false)
    // draw
    map.draw_everything()
    // return for undo
    return updatedSegmentObjs
  }

  /**
   * Drag the selected nodes and text labels.
   * @param {} map -
   * @param {} undo_stack -
   */
  getSelectableDrag (map, undoStack) {
    // define some variables
    const behavior = d3Drag()
    let theTimeout = null
    let totalDisplacement = null
    // for nodes
    let nodeIdsToDrag = null
    let reactionIds = null
    // for text labels
    let textLabelIdsToDrag = null
    const moveLabel = (textLabelId, displacement) => {
      const textLabel = map.text_labels[textLabelId]
      textLabel.x = textLabel.x + displacement.x
      textLabel.y = textLabel.y + displacement.y
    }
    const setDragging = onOff => {
      this.dragging = onOff
    }

    behavior.on('start', function (d) {
      setDragging(true)

      // silence other listeners (e.g. nodes BELOW this one)
      d3Selection.event.sourceEvent.stopPropagation()
      // remember the total displacement for later
      totalDisplacement = { x: 0, y: 0 }

      // If a text label is selected, the rest is not necessary
      if (d3Select(this).attr('class').indexOf('label') === -1) {
        // Note that drag start is called even for a click event
        const data = this.parentNode.__data__
        const biggId = data.bigg_id
        const nodeGroup = this.parentNode
        // Move element to back (for the next step to work). Wait 200ms
        // before making the move, becuase otherwise the element will be
        // deleted before the click event gets called, and selection
        // will stop working.
        theTimeout = setTimeout(() => {
          nodeGroup.parentNode.insertBefore(nodeGroup, nodeGroup.parentNode.firstChild)
        }, 200)
        // prepare to combine metabolites
        map.sel.selectAll('.metabolite-circle')
          .on('mouseover.combine', function (d) {
            if (d.bigg_id === biggId && d.node_id !== data.node_id) {
              d3Select(this).classed('node-to-combine', true)
            }
          })
          .on('mouseout.combine', d => {
            if (d.bigg_id === biggId) {
              map.sel.selectAll('.node-to-combine').classed('node-to-combine', false)
            }
          })
      }
    })

    behavior.on('drag', function (d) {
      // if this node is not already selected, then select this one and
      // deselect all other nodes. Otherwise, leave the selection alone.
      if (!d3Select(this.parentNode).classed('selected')) {
        map.select_selectable(this, d)
      }

      // get the grabbed id
      const grabbed = {}
      if (d3Select(this).attr('class').indexOf('label') === -1) {
        // if it is a node
        grabbed['type'] = 'node'
        grabbed['id'] = this.parentNode.__data__.node_id
      } else {
        // if it is a text label
        grabbed['type'] = 'label'
        grabbed['id'] = this.__data__.text_label_id
      }

      const selectedNodeIds = map.get_selected_node_ids()
      const selectedTextLabelIds = map.get_selected_text_label_ids()
      nodeIdsToDrag = []
      textLabelIdsToDrag = []
      // choose the nodes and text labels to drag
      if (grabbed['type'] === 'node' &&
          selectedNodeIds.indexOf(grabbed['id']) === -1) {
        nodeIdsToDrag.push(grabbed['id'])
      } else if (grabbed['type'] === 'label' &&
                 selectedTextLabelIds.indexOf(grabbed['id']) === -1) {
        textLabelIdsToDrag.push(grabbed['id'])
      } else {
        nodeIdsToDrag = selectedNodeIds
        textLabelIdsToDrag = selectedTextLabelIds
      }
      reactionIds = []
      const displacement = {
        x: d3Selection.event.dx,
        y: d3Selection.event.dy
      }
      totalDisplacement = utils.c_plus_c(totalDisplacement, displacement)
      nodeIdsToDrag.forEach(nodeId => {
        // update data
        const node = map.nodes[nodeId]
        const updated = build.move_node_and_dependents(node, nodeId,
                                                       map.reactions,
                                                       map.beziers,
                                                       displacement)
        reactionIds = utils.uniqueConcat([ reactionIds, updated.reaction_ids ])
        // remember the displacements
        // if (!(nodeId in totalDisplacement))  totalDisplacement[nodeId] = { x: 0, y: 0 }
        // totalDisplacement[nodeId] = utils.c_plus_c(totalDisplacement[nodeId], displacement)
      })
      textLabelIdsToDrag.forEach(textLabelId => {
        moveLabel(textLabelId, displacement)
        // remember the displacements
        // if (!(nodeId in totalDisplacement))  totalDisplacement[nodeId] = { x: 0, y: 0 }
        // totalDisplacement[nodeId] = utils.c_plus_c(totalDisplacement[nodeId], displacement)
      })
      // draw
      map.draw_these_nodes(nodeIdsToDrag)
      map.draw_these_reactions(reactionIds)
      map.draw_these_text_labels(textLabelIdsToDrag)
    })

    const combineNodesAndDraw = this.combineNodesAndDraw.bind(this)
    behavior.on('end', function () {
      setDragging(false)

      if (nodeIdsToDrag === null) {
        // Drag end can be called when drag has not been called. In this, case, do
        // nothing.
        totalDisplacement = null
        nodeIdsToDrag = null
        textLabelIdsToDrag = null
        reactionIds = null
        theTimeout = null
        return
      }

      // look for mets to combine
      const nodeToCombineArray = []
      map.sel.selectAll('.node-to-combine').each(d => {
        nodeToCombineArray.push(d.node_id)
      })

      if (nodeToCombineArray.length === 1) {
        // If a node is ready for it, combine nodes
        const fixedNodeId = nodeToCombineArray[0]
        const draggedNodeId = this.parentNode.__data__.node_id
        const savedDraggedNode = utils.clone(map.nodes[draggedNodeId])
        const segmentObjsMovedToCombine = combineNodesAndDraw(fixedNodeId,
                                                              draggedNodeId)
        const savedDisplacement = utils.clone(totalDisplacement)
        undoStack.push(() => {
          // undo
          // put the old node back
          map.nodes[draggedNodeId] = savedDraggedNode
          const fixedNode = map.nodes[fixedNodeId]
          const updatedReactions = []
          segmentObjsMovedToCombine.forEach(segmentObj => {
            const segment = map.reactions[segmentObj.reaction_id].segments[segmentObj.segment_id]
            if (segment.from_node_id === fixedNodeId) {
              segment.from_node_id = draggedNodeId
            } else if (segment.to_node_id === fixedNodeId) {
              segment.to_node_id = draggedNodeId
            } else {
              console.error('Segment does not connect to fixed node')
            }
            // removed this segmentObj from the fixed node
            fixedNode.connected_segments = fixedNode.connected_segments.filter(x => {
              return !(x.reaction_id === segmentObj.reaction_id && x.segment_id === segmentObj.segment_id)
            })
            if (updatedReactions.indexOf(segmentObj.reaction_id) === -1) {
              updatedReactions.push(segmentObj.reaction_id)
            }
          })
          // move the node back
          build.move_node_and_dependents(
            savedDraggedNode,
            draggedNodeId,
            map.reactions,
            map.beziers,
            utils.c_times_scalar(savedDisplacement, -1)
          )
          map.draw_these_nodes([draggedNodeId])
          map.draw_these_reactions(updatedReactions)
        }, () => {
          // redo
          // move node before combining for reliable undo/redo looping
          build.move_node_and_dependents(
            savedDraggedNode,
            draggedNodeId,
            map.reactions,
            map.beziers,
            utils.c_times_scalar(savedDisplacement, 1)
          )
          combineNodesAndDraw(fixedNodeId, draggedNodeId)
        })
      } else {
        // otherwise, drag node

        // add to undo/redo stack
        // remember the displacement, dragged nodes, and reactions
        const savedDisplacement = utils.clone(totalDisplacement)
            // BUG TODO this variable disappears!
            // Happens sometimes when you drag a node, then delete it, then undo twice
        const savedNodeIds = utils.clone(nodeIdsToDrag)
        const savedTextLabelIds = utils.clone(textLabelIdsToDrag)
        const savedReactionIds = utils.clone(reactionIds)
        undoStack.push(() => {
          // undo
          savedNodeIds.forEach(nodeId => {
            const node = map.nodes[nodeId]
            build.move_node_and_dependents(node, nodeId, map.reactions,
                                           map.beziers,
                                           utils.c_times_scalar(savedDisplacement, -1))
          })
          savedTextLabelIds.forEach(textLabelId => {
            moveLabel(textLabelId,
                       utils.c_times_scalar(savedDisplacement, -1))
          })
          map.draw_these_nodes(savedNodeIds)
          map.draw_these_reactions(savedReactionIds)
          map.draw_these_text_labels(savedTextLabelIds)
        }, () => {
          // redo
          savedNodeIds.forEach(nodeId => {
            const node = map.nodes[nodeId]
            build.move_node_and_dependents(node, nodeId, map.reactions,
                                           map.beziers,
                                           savedDisplacement)
          })
          savedTextLabelIds.forEach(textLabelId => {
            moveLabel(textLabelId, savedDisplacement)
          })
          map.draw_these_nodes(savedNodeIds)
          map.draw_these_reactions(savedReactionIds)
          map.draw_these_text_labels(savedTextLabelIds)
        })
      }

      // stop combining metabolites
      map.sel.selectAll('.metabolite-circle')
        .on('mouseover.combine', null)
        .on('mouseout.combine', null)

      // clear the timeout
      clearTimeout(theTimeout)

      // clear the shared variables
      totalDisplacement = null
      nodeIdsToDrag = null
      textLabelIdsToDrag = null
      reactionIds = null
      theTimeout = null
    })

    return behavior
  }

  getBezierDrag (map) {
    const moveBezier = (reactionId, segmentId, bez, bezierId, displacement) => {
      const segment = map.reactions[reactionId].segments[segmentId]
      segment[bez] = utils.c_plus_c(segment[bez], displacement)
      map.beziers[bezierId].x = segment[bez].x
      map.beziers[bezierId].y = segment[bez].y
    }
    const startFn = d => {
      d.dragging = true
    }
    const dragFn = (d, displacement, totalDisplacement) => {
      // draw
      moveBezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id,
                  displacement)
      map.draw_these_reactions([d.reaction_id], false)
      map.draw_these_beziers([d.bezier_id])
    }
    const endFn = d => {
      d.dragging = false
    }
    const undoFn = (d, displacement) => {
      moveBezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id,
                 utils.c_times_scalar(displacement, -1))
      map.draw_these_reactions([d.reaction_id], false)
      map.draw_these_beziers([d.bezier_id])
    }
    const redoFn = (d, displacement) => {
      moveBezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id,
                  displacement)
      map.draw_these_reactions([d.reaction_id], false)
      map.draw_these_beziers([d.bezier_id])
    }
    return this.getGenericDrag(startFn, dragFn, endFn, undoFn, redoFn,
                               this.map.sel)
  }

  getReactionLabelDrag (map) {
    const moveLabel = (reactionId, displacement) => {
      const reaction = map.reactions[reactionId]
      reaction.label_x = reaction.label_x + displacement.x
      reaction.label_y = reaction.label_y + displacement.y
    }
    const startFn = d => {
      // hide tooltips when drag starts
      map.callback_manager.run('hide_tooltip')
    }
    const dragFn = (d, displacement, totalDisplacement) => {
      // draw
      moveLabel(d.reaction_id, displacement)
      map.draw_these_reactions([ d.reaction_id ])
    }
    const endFn = () => {}
    const undoFn = (d, displacement) => {
      moveLabel(d.reaction_id, utils.c_times_scalar(displacement, -1))
      map.draw_these_reactions([ d.reaction_id ])
    }
    const redoFn = (d, displacement) => {
      moveLabel(d.reaction_id, displacement)
      map.draw_these_reactions([ d.reaction_id ])
    }
    return this.getGenericDrag(startFn, dragFn, endFn, undoFn, redoFn,
                               this.map.sel)
  }

  getNodeLabelDrag (map) {
    const moveLabel = (nodeId, displacement) => {
      const node = map.nodes[nodeId]
      node.label_x = node.label_x + displacement.x
      node.label_y = node.label_y + displacement.y
    }
    const startFn = d => {
      // hide tooltips when drag starts
      map.callback_manager.run('hide_tooltip')
    }
    const dragFn = (d, displacement, totalDisplacement) => {
      // draw
      moveLabel(d.node_id, displacement)
      map.draw_these_nodes([ d.node_id ])
    }
    const endFn = () => {}
    const undoFn = (d, displacement) => {
      moveLabel(d.node_id, utils.c_times_scalar(displacement, -1))
      map.draw_these_nodes([ d.node_id ])
    }
    const redoFn = (d, displacement) => {
      moveLabel(d.node_id, displacement)
      map.draw_these_nodes([ d.node_id ])
    }
    return this.getGenericDrag(startFn, dragFn, endFn, undoFn, redoFn,
                               this.map.sel)
  }

  /**
   * Make a generic drag behavior, with undo/redo.
   *
   * startFn: function (d) Called at drag start.
   *
   * dragFn: function (d, displacement, totalDisplacement) Called during drag.
   *
   * endFn
   *
   * undoFn
   *
   * redoFn
   *
   * relativeToSelection: a d3 selection that the locations are calculated
   * against.
   *
   */
  getGenericDrag (startFn, dragFn, endFn, undoFn, redoFn,
                              relativeToSelection) {
    // define some variables
    const behavior = d3Drag()
    const undoStack = this.undoStack
    const rel = relativeToSelection.node()
    let totalDisplacement

    behavior.on('start', d => {
      this.dragging = true

      // silence other listeners
      d3Selection.event.sourceEvent.stopPropagation()
      totalDisplacement = { x: 0, y: 0 }
      startFn(d)
    })

    behavior.on('drag', d => {
      // update data
      const displacement = {
        x: d3Selection.event.dx,
        y: d3Selection.event.dy
      }
      const location = {
        x: d3Mouse(rel)[0],
        y: d3Mouse(rel)[1]
      }

      // remember the displacement
      totalDisplacement = utils.c_plus_c(totalDisplacement, displacement)
      dragFn(d, displacement, totalDisplacement, location)
    })

    behavior.on('end', d => {
      this.dragging = false

      // add to undo/redo stack
      // remember the displacement, dragged nodes, and reactions
      const savedD = utils.clone(d)
      const savedDisplacement = utils.clone(totalDisplacement) // BUG TODO this variable disappears!
      const savedLocation = {
        x: d3Mouse(rel)[0],
        y: d3Mouse(rel)[1],
      }

      undoStack.push(function () {
        // undo
        undoFn(savedD, savedDisplacement, savedLocation)
      }, function () {
        // redo
        redoFn(savedD, savedDisplacement, savedLocation)
      })
      endFn(d)
    })

    return behavior
  }

  /** Make a generic drag behavior, with undo/redo. Supplies angles in place of
   * displacements.
   *
   * startFn: function (d) Called at drag start.
   *
   * dragFn: function (d, displacement, totalDisplacement) Called during drag.
   *
   * endFn:
   *
   * undoFn:
   *
   * redoFn:
   *
   * getCenter:
   *
   * relativeToSelection: a d3 selection that the locations are calculated
   * against.
   *
   */
  getGenericAngularDrag (startFn, dragFn, endFn, undoFn, redoFn,
                         getCenter, relativeToSelection) {
    // define some variables
    const behavior = d3Drag()
    const undoStack = this.undoStack
    const rel = relativeToSelection.node()
    let totalAngle

    behavior.on('start', d => {
      this.dragging = true

      // silence other listeners
      d3Selection.event.sourceEvent.stopPropagation()
      totalAngle = 0
      startFn(d)
    })

    behavior.on('drag', d => {
      // update data
      const displacement = {
        x: d3Selection.event.dx,
        y: d3Selection.event.dy
      }
      const location = {
        x: d3Mouse(rel)[0],
        y: d3Mouse(rel)[1]
      }
      const center = getCenter()
      const angle = utils.angle_for_event(displacement, location, center)
      // remember the displacement
      totalAngle = totalAngle + angle
      dragFn(d, angle, totalAngle, center)
    })

    behavior.on('end', d => {
      this.dragging = false

      // add to undo/redo stack
      // remember the displacement, dragged nodes, and reactions
      const savedD = utils.clone(d)
      const savedAngle = totalAngle
      const savedCenter = utils.clone(getCenter())

      undoStack.push(
        () => undoFn(savedD, savedAngle, savedCenter),
        () => redoFn(savedD, savedAngle, savedCenter)
      )

      endFn(d)
    })

    return behavior
  }
}
