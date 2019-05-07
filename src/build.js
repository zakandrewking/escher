/**
 * Functions for building new reactions.
 */

import * as utils from './utils'
import _ from 'underscore'

function getLabelLoc (angle) {
  if (Math.abs(angle) > Math.PI) {
    throw new Error('Angle must be between -PI and PI')
  }
  if (Math.abs(angle) < Math.PI / 7 || Math.abs(angle - Math.PI) < Math.PI / 7) {
    // Close to 0 or PI
    return { x: -50, y: -40 }
  } else if (angle > 0) {
    // Bottom quadrants
    return {
      x: 15 * (1 - (Math.abs(angle - Math.PI / 2)) / (Math.PI / 2)),
      y: 10 + (angle - Math.PI / 2) * 50
    }
  } else {
    // Top quadrants
    return {
      x: 15 * (1 - (Math.abs(angle + Math.PI / 2)) / (Math.PI / 2)),
      y: 10 - (Math.abs(angle) - Math.PI / 2) * 50
    }
  }
}

/**
 * Get the location for a new metabolite label.
 * @param angleRaw - angle in radians
 * @param index
 * @param count
 * @param isPrimary
 * @param biggId
 * @param primaryIndex
 */
export function getMetLabelLoc (angleRaw, index, count, isPrimary, biggId,
                                primaryIndex) {
  const angle = utils.angleNorm(angleRaw)
  const width = biggId.length * 18
  const leftRight = (index - (index > primaryIndex) - (count / 2)) >= -1
  if (Math.abs(angle) < Math.PI / 7) {
    // Close to 0
    if (isPrimary || leftRight) {
      // Primary or bottom
      return { x: -width * 0.3, y: 40 }
    } else {
      // Top
      return { x: -width * 0.3, y: -20 }
    }
  } else if (Math.abs(angle - Math.PI) < Math.PI / 7) {
    // Close to PI
    if (isPrimary || !leftRight) {
      // Primary or bottom
      return { x: -width * 0.3, y: 40 }
    } else {
      // Top
      return { x: -width * 0.3, y: -20 }
    }
  } else {
    if (isPrimary) {
      // Primary
      return {
        x: 25 - 38 * Math.abs(Math.abs(angle) - Math.PI / 2),
        y: (Math.abs(angle) - Math.PI / 2) * ((angle > 0) * 2 - 1) * 50
      }
    } else if ((angle < 0 && leftRight) || (angle > 0 && !leftRight)) {
      // Right
      return { x: 15, y: 0 }
    } else {
      // Left
      return { x: -width * 0.5, y: 30 }
    }
  }
}

/**
 * New reaction.
 * @param {Number} direction - clockwise from 'right', in degrees.
 */
export function newReaction (biggId, cobraReaction, cobraMetabolites,
                             selectedNodeId, selectedNode, largestIds,
                             cofactors, direction) {
  // Convert to radians, and force to domain - PI/2 to PI/2
  const angle = utils.to_radians_norm(direction)

  // Generate a new integer id
  const newReactionId = String(++largestIds.reactions)

  // Calculate coordinates of reaction
  const selectedNodeCoords = { x: selectedNode.x, y: selectedNode.y }

  // Rotate main axis around angle with distance
  const reactionLength = 350
  const mainAxis = [
    selectedNodeCoords,
    utils.c_plus_c(selectedNodeCoords, { x: reactionLength, y: 0 })
  ]
  const center = {
    x: (mainAxis[0].x + mainAxis[1].x) / 2,
    y: (mainAxis[0].y + mainAxis[1].y) / 2
  }

  // Relative label location
  const labelD = getLabelLoc(angle)

  // Relative anchor node distance
  const anchorDistance = 20

  // New reaction structure
  const newReaction = {
    name: cobraReaction.name,
    bigg_id: cobraReaction.bigg_id,
    reversibility: cobraReaction.reversibility,
    gene_reaction_rule: cobraReaction.gene_reaction_rule,
    genes: utils.clone(cobraReaction.genes),
    metabolites: utils.clone(cobraReaction.metabolites)
  }
  utils.extend(newReaction, {
    label_x: center.x + labelD.x,
    label_y: center.y + labelD.y,
    segments: {}
  })

  // Set primary metabolites and count reactants/products

  // Look for the selected metabolite, and record the indices
  const reactantRanks = []
  const productRanks = []
  let reactantCount = 0
  let productCount = 0
  let reactionIsReversed = false
  for (let metBiggId in newReaction.metabolites) {
    // Make the metabolites into objects
    const metabolite = cobraMetabolites[metBiggId]
    const coefficient = newReaction.metabolites[metBiggId]
    const formula = metabolite.formula
    const newMetabolite = {
      coefficient: coefficient,
      bigg_id: metBiggId,
      name: metabolite.name
    }
    if (coefficient < 0) {
      newMetabolite.index = reactantCount
      // score the metabolites. Infinity == selected, >= 1 == carbon containing
      const carbons = /C([0-9]+)/.exec(formula)
      if (selectedNode.bigg_id === newMetabolite.bigg_id) {
        reactantRanks.push([ newMetabolite.index, Infinity ])
      } else if (carbons && cofactors.indexOf(utils.decompartmentalize(newMetabolite.bigg_id)[0]) === -1) {
        reactantRanks.push([ newMetabolite.index, parseInt(carbons[1]) ])
      }
      reactantCount++
    } else {
      newMetabolite.index = productCount
      const carbons = /C([0-9]+)/.exec(formula)
      if (selectedNode.bigg_id === newMetabolite.bigg_id) {
        productRanks.push([ newMetabolite.index, Infinity ])
        reactionIsReversed = true
      } else if (carbons && cofactors.indexOf(utils.decompartmentalize(newMetabolite.bigg_id)[0]) === -1) {
        productRanks.push([ newMetabolite.index, parseInt(carbons[1]) ])
      }
      productCount++
    }
    newReaction.metabolites[metBiggId] = newMetabolite
  }

  // get the rank with the highest score
  const maxRank = (old, current) => current[1] > old[1] ? current : old
  const primaryReactantIndex = reactantRanks.reduce(maxRank, [ 0, 0 ])[0]
  const primaryProductIndex = productRanks.reduce(maxRank, [ 0, 0 ])[0]

  // set primary metabolites, and keep track of the total counts
  for (let metBiggId in newReaction.metabolites) {
    const metabolite = newReaction.metabolites[metBiggId]
    if (metabolite.coefficient < 0) {
      metabolite.is_primary = metabolite.index === primaryReactantIndex
      metabolite.count = reactantCount
    } else {
      metabolite.is_primary = metabolite.index === primaryProductIndex
      metabolite.count = productCount
    }
  }

  // generate anchor nodes
  const newAnchors = {}
  const anchors = [
    {
      node_type: 'anchor_reactants',
      dis: { x: anchorDistance * (reactionIsReversed ? 1 : -1), y: 0 }
    },
    { node_type: 'center', dis: { x: 0, y: 0 } },
    {
      node_type: 'anchor_products',
      dis: { x: anchorDistance * (reactionIsReversed ? -1 : 1), y: 0 }
    }
  ]
  const anchorIds = {}
  anchors.map(n => {
    const newId = String(++largestIds.nodes)
    const generalNodeType = n.node_type === 'center' ? 'midmarker' : 'multimarker'
    newAnchors[newId] = {
      node_type: generalNodeType,
      x: center.x + n.dis.x,
      y: center.y + n.dis.y,
      connected_segments: [],
      name: null,
      bigg_id: null,
      label_x: null,
      label_y: null,
      node_is_primary: null,
      data: null
    }
    anchorIds[n.node_type] = newId
  })

  // add the segments, outside to inside
  const newAnchorGroups = [
    [ anchorIds['anchor_reactants'], anchorIds['center'], 'reactants' ],
    [ anchorIds['anchor_products'], anchorIds['center'], 'products' ]
  ]
  newAnchorGroups.map(l => {
    const fromId = l[0]
    const toId = l[1]
    const newSegmentId = String(++largestIds.segments)
    const unconnectedSeg = (
      (reactantCount === 0 && l[2] === 'reactants' && newReaction.reversibility) ||
      (productCount === 0 && l[2] === 'products')
    )
    newReaction.segments[newSegmentId] = {
      b1: null,
      b2: null,
      from_node_id: fromId,
      to_node_id: toId,
      from_node_coefficient: null,
      to_node_coefficient: null,
      reversibility: newReaction.reversibility,
      data: newReaction.data,
      reverse_flux: newReaction.reverse_flux,
      unconnected_segment_with_arrow: unconnectedSeg
    }
    newAnchors[fromId].connected_segments.push({
      segment_id: newSegmentId,
      reaction_id: newReactionId
    })
    newAnchors[toId].connected_segments.push({
      segment_id: newSegmentId,
      reaction_id: newReactionId
    })
  })

  // Add the metabolites, keeping track of total reactants and products.
  const newNodes = newAnchors
  for (let metBiggId in newReaction.metabolites) {
    const metabolite = newReaction.metabolites[metBiggId]
    let primaryIndex
    let fromNodeId
    if (metabolite.coefficient < 0) {
      primaryIndex = primaryReactantIndex
      fromNodeId = anchorIds['anchor_reactants']
    } else {
      primaryIndex = primaryProductIndex
      fromNodeId = anchorIds['anchor_products']
    }

    // calculate coordinates of metabolite components
    const metLoc = calculateNewMetaboliteCoordinates(
      metabolite,
      primaryIndex,
      mainAxis,
      center,
      reactionLength,
      reactionIsReversed
    )

    // if this is the existing metabolite
    if (selectedNode.bigg_id === metabolite.bigg_id) {
      const newSegmentId = String(++largestIds.segments)
      newReaction.segments[newSegmentId] = {
        b1: metLoc.b1,
        b2: metLoc.b2,
        from_node_id: fromNodeId,
        to_node_id: selectedNodeId,
        from_node_coefficient: null,
        to_node_coefficient: metabolite.coefficient,
        reversibility: newReaction.reversibility
      }
      // Update the existing node
      selectedNode.connected_segments.push({
        segment_id: newSegmentId,
        reaction_id: newReactionId
      })
      newNodes[fromNodeId].connected_segments.push({
        segment_id: newSegmentId,
        reaction_id: newReactionId
      })
    } else {
      // save new metabolite
      const newSegmentId = String(++largestIds.segments)
      const newNodeId = String(++largestIds.nodes)
      newReaction.segments[newSegmentId] = {
        b1: metLoc.b1,
        b2: metLoc.b2,
        from_node_id: fromNodeId,
        to_node_id: newNodeId,
        from_node_coefficient: null,
        to_node_coefficient: metabolite.coefficient,
        reversibility: newReaction.reversibility
      }
      // save new node
      const metLabelD = getMetLabelLoc(
        angle,
        metabolite.index,
        metabolite.count,
        metabolite.is_primary,
        metabolite.bigg_id,
        primaryIndex
      )
      newNodes[newNodeId] = {
        connected_segments: [ {
          segment_id: newSegmentId,
          reaction_id: newReactionId
        } ],
        x: metLoc.circle.x,
        y: metLoc.circle.y,
        node_is_primary: metabolite.is_primary,
        label_x: metLoc.circle.x + metLabelD.x,
        label_y: metLoc.circle.y + metLabelD.y,
        name: metabolite.name,
        bigg_id: metabolite.bigg_id,
        node_type: 'metabolite'
      }
      newNodes[fromNodeId].connected_segments.push({
        segment_id: newSegmentId,
        reaction_id: newReactionId
      })
    }
  }

  // now take out the extra reaction details
  const metabolitesArray = []
  for (let biggId in newReaction.metabolites) {
    metabolitesArray.push({
      bigg_id: biggId,
      coefficient: newReaction.metabolites[biggId].coefficient
    })
  }
  newReaction.metabolites = metabolitesArray

  // newReactions object
  const newReactions = {}
  newReactions[newReactionId] = newReaction

  // new_beziers object
  const newBeziers = newBeziersForReactions(newReactions)

  // add the selected node for rotation, and return it as a new (updated) node
  newNodes[selectedNodeId] = selectedNode
  rotateNodes(newNodes, newReactions, newBeziers, angle, selectedNodeCoords)

  return {
    new_reactions: newReactions,
    new_beziers: newBeziers,
    new_nodes: newNodes
  }
}

/**
 * Rotate the nodes around center.
 * @param selected_nodes - Nodes to rotate.
 * @param reactions - Only updates beziers for these reactions.
 * @param beziers - Also update the bezier points.
 * @param angle - Angle to rotate in radians.
 * @param center - Point to rotate around.
 */
export function rotateNodes (selectedNodes, reactions, beziers, angle, center) {
  const rotateAround = coord => {
    if (coord === null) {
      return null
    }
    return utils.rotate_coords(coord, angle, center)
  }

  // recalculate: node
  const updatedNodeIds = []
  let updatedReactionIds = []
  for (let nodeId in selectedNodes) {
    const node = selectedNodes[nodeId]
    // rotation distance
    const displacement = rotateAround({ x: node.x, y: node.y })
    // move the node
    const updated = moveNodeAndLabels(node, reactions, displacement)
    // move the bezier points
    node.connected_segments.map(segmentObj => {
      const reaction = reactions[segmentObj.reaction_id]
      // If the reaction was not passed in the reactions argument, then ignore
      if (reaction === undefined) return

      // rotate the beziers
      const segmentId = segmentObj.segment_id
      const segment = reaction.segments[segmentId]
      if (segment.to_node_id === nodeId && segment.b2) {
        const displacement = rotateAround(segment.b2)
        const bezId = bezierIdForSegmentId(segmentId, 'b2')
        segment.b2 = utils.c_plus_c(segment.b2, displacement)
        beziers[bezId].x = segment.b2.x
        beziers[bezId].y = segment.b2.y
      } else if (segment.from_node_id === nodeId && segment.b1) {
        const displacement = rotateAround(segment.b1)
        const bezId = bezierIdForSegmentId(segmentId, 'b1')
        segment.b1 = utils.c_plus_c(segment.b1, displacement)
        beziers[bezId].x = segment.b1.x
        beziers[bezId].y = segment.b1.y
      }
    })

    updatedReactionIds = utils.uniqueConcat([updatedReactionIds, updated.reaction_ids])
    updatedNodeIds.push(nodeId)
  }

  return {
    node_ids: updatedNodeIds,
    reaction_ids: updatedReactionIds
  }
}

/**
 * Move the node and its labels and beziers.
 */
export function moveNodeAndDependents (node, nodeId, reactions, beziers,
                                       displacement) {
  const updated = moveNodeAndLabels(node, reactions, displacement)

  // move beziers
  node.connected_segments.map(segmentObj => {
    const reaction = reactions[segmentObj.reaction_id]
    // If the reaction was not passed in the reactions argument, then ignore
    if (_.isUndefined(reaction)) return

    // Update beziers
    const segmentId = segmentObj.segment_id
    const segment = reaction.segments[segmentId]
    const cs = [ [ 'b1', 'from_node_id' ], [ 'b2', 'to_node_id' ] ]
    cs.forEach(c => {
      const bez = c[0]
      const node = c[1]
      if (segment[node] === nodeId && segment[bez]) {
        segment[bez] = utils.c_plus_c(segment[bez], displacement)
        const tbez = beziers[bezierIdForSegmentId(segmentId, bez)]
        tbez.x = segment[bez].x
        tbez.y = segment[bez].y
      }
    })

    // add to list of updated reaction ids if it isn't already there
    if (updated.reaction_ids.indexOf(segmentObj.reaction_id) < 0) {
      updated.reaction_ids.push(segmentObj.reaction_id)
    }
  })
  return updated
}

function moveNodeAndLabels (node, reactions, displacement) {
  node.x = node.x + displacement.x
  node.y = node.y + displacement.y

  // recalculate: node label
  node.label_x = node.label_x + displacement.x
  node.label_y = node.label_y + displacement.y

  // recalculate: reaction label
  const updatedReactionIds = []
  node.connected_segments.map(segmentObj => {
    const reaction = reactions[segmentObj.reaction_id]
    // add to list of updated reaction ids if it isn't already there
    if (updatedReactionIds.indexOf(segmentObj.reaction_id) < 0) {
      updatedReactionIds.push(segmentObj.reaction_id)

      // update reaction label (but only once per reaction
      if (node.node_type === 'midmarker') {
        reaction.label_x = reaction.label_x + displacement.x
        reaction.label_y = reaction.label_y + displacement.y
      }
    }
  })
  return { reaction_ids: updatedReactionIds }
}

/**
 * Calculate the distance of mets from main reaction axis.
 * @param {Number} w - Scaling factor
 * @param {Number} draw_at_index - Index of metabolite
 * @param {Number} num_slots - Number of metabolites
 */
function metIndexDisp (w, drawAtIndex, numSlots) {
  const half = Math.floor(numSlots / 2)
  return w * (drawAtIndex - half + (drawAtIndex >= half))
}

function metSecondaryDisp (secondaryW, secondaryDis, drawAtIndex, numSlots) {
  const half = Math.floor(numSlots / 2)
  return secondaryDis + Math.abs(drawAtIndex - half + (drawAtIndex >= half)) * secondaryW
}

/**
 * Calculate metabolite coordinates for a new reaction metabolite.
 */
function calculateNewMetaboliteCoordinates (met, primaryIndex, mainAxis, center,
                                            dis, isReversed) {
  // new local coordinate system
  const displacement = mainAxis[0]
  mainAxis = [
    utils.c_minus_c(mainAxis[0], displacement),
    utils.c_minus_c(mainAxis[1], displacement)
  ]
  center = utils.c_minus_c(center, displacement)

  // Curve parameters
  const w = 80 // distance between reactants and between products
  const b1Strength = 0.4
  const b2Strength = 0.25
  const w2 = w * 0.3 // bezier target poin
  const secondaryDis = 50 // y distance of first secondary mets
  const secondaryW = 20 // y distance of each other secondary met

  // Secondary mets
  const numSlots = met.count - 1

  // Size and spacing for primary and secondary metabolites
  let ds
  let drawAtIndex
  if (met.is_primary) { // primary
    ds = 20
  } else { // secondary
    ds = 10
    // don't use center slot
    if (met.index > primaryIndex) drawAtIndex = met.index - 1
    else drawAtIndex = met.index
  }

  const de = dis - ds // distance between ends of line axis
  const reactionAxis = [ { x: ds, y: 0 }, { x: de, y: 0 } ]

  // Define line parameters and axis.
  // Begin with unrotated coordinate system. +y = Down, +x = Right.
  let end
  let circle
  let b1
  let b2

  // Reactants
  if (((met.coefficient < 0) !== isReversed) && met.is_primary) { // Ali == BADASS
    end = {
      x: reactionAxis[0].x,
      y: reactionAxis[0].y
    }
    b1 = {
      x: center.x * (1 - b1Strength) + reactionAxis[0].x * b1Strength,
      y: center.y * (1 - b1Strength) + reactionAxis[0].y * b1Strength
    }
    b2 = {
      x: center.x * b2Strength + end.x * (1 - b2Strength),
      y: center.y * b2Strength + end.y * (1 - b2Strength)
    }
    circle = {
      x: mainAxis[0].x,
      y: mainAxis[0].y
    }
  } else if ((met.coefficient < 0) !== isReversed) {
    end = {
      x: reactionAxis[0].x + metSecondaryDisp(secondaryW, secondaryDis,
                                                  drawAtIndex, numSlots),
      y: reactionAxis[0].y + metIndexDisp(w2, drawAtIndex, numSlots)
    }
    b1 = {
      x: center.x * (1 - b1Strength) + reactionAxis[0].x * b1Strength,
      y: center.y * (1 - b1Strength) + reactionAxis[0].y * b1Strength
    }
    b2 = {
      x: center.x * b2Strength + end.x * (1 - b2Strength),
      y: center.y * b2Strength + end.y * (1 - b2Strength)
    }
    circle = {
      x: mainAxis[0].x + metSecondaryDisp(secondaryW, secondaryDis, drawAtIndex, numSlots),
      y: mainAxis[0].y + metIndexDisp(w, drawAtIndex, numSlots)
    }
  } else if (((met.coefficient > 0) !== isReversed) && met.is_primary) {        // products
    end = {
      x: reactionAxis[1].x,
      y: reactionAxis[1].y
    }
    b1 = {
      x: center.x * (1 - b1Strength) + reactionAxis[1].x * b1Strength,
      y: center.y * (1 - b1Strength) + reactionAxis[1].y * b1Strength
    }
    b2 = {
      x: center.x * b2Strength + end.x * (1 - b2Strength),
      y: center.y * b2Strength + end.y * (1 - b2Strength)
    }
    circle = {
      x: mainAxis[1].x,
      y: mainAxis[1].y
    }
  } else if ((met.coefficient > 0) !== isReversed) {
    end = {
      x: reactionAxis[1].x - metSecondaryDisp(secondaryW, secondaryDis, drawAtIndex, numSlots),
      y: reactionAxis[1].y + metIndexDisp(w2, drawAtIndex, numSlots)
    }
    b1 = {
      x: center.x * (1 - b1Strength) + reactionAxis[1].x * b1Strength,
      y: center.y * (1 - b1Strength) + reactionAxis[1].y * b1Strength
    }
    b2 = {
      x: center.x * b2Strength + end.x * (1 - b2Strength),
      y: center.y * b2Strength + end.y * (1 - b2Strength)
    }
    circle = {
      x: mainAxis[1].x - metSecondaryDisp(secondaryW, secondaryDis, drawAtIndex, numSlots),
      y: mainAxis[1].y + metIndexDisp(w, drawAtIndex, numSlots)
    }
  }

  return {
    b1: utils.c_plus_c(displacement, b1),
    b2: utils.c_plus_c(displacement, b2),
    circle: utils.c_plus_c(displacement, circle)
  }
}

export function newTextLabel (largestIds, text, coords) {
  const newId = String(++largestIds.text_labels)
  const newLabel = { text: text, x: coords.x, y: coords.y }
  return { id: newId, label: newLabel }
}

export function bezierIdForSegmentId (segmentId, bez) {
  return segmentId + '_' + bez
}

/**
 * Return an array of beziers ids for the array of reaction ids.
 * @param {Object} reactions - A reactions object, e.g. a subset of
 * *escher.Map.reactions*.
 */
export function bezierIdsForReactionIds (reactions) {
  const bezierIds = []
  for (let reactionId in reactions) {
    const reaction = reactions[reactionId]

    for (let segmentId in reaction.segments) {
      const segment = reaction.segments[segmentId]

      const bezs = [ 'b1', 'b2' ]
      bezs.forEach(function (bez) {
        const segBez = segment[bez]
        if (segBez !== null) {
          bezierIds.push(bezierIdForSegmentId(segmentId, bez))
        }
      })
    }
  }
  return bezierIds
}

/**
 * Return an object containing beziers for the segments object.
 * segments: A segments object, e.g. *escher.Map.segments*.
 * reaction_id: The reaction id for the segments.
 */
export function newBeziersForSegments (segments, reactionId) {
  const beziers = {}
  for (let segmentId in segments) {
    const segment = segments[segmentId]

    ;[ 'b1', 'b2' ].forEach(function (bez) {
      const segBez = segment[bez]
      if (segBez !== null) {
        const bezierId = bezierIdForSegmentId(segmentId, bez)
        beziers[bezierId] = {
          bezier: bez,
          x: segBez.x,
          y: segBez.y,
          reaction_id: reactionId,
          segment_id: segmentId
        }
      }
    })
  }
  return beziers
}

/**
 * Return an object containing beziers for the reactions object.
 * @param {Object} reactions - A reactions object, e.g. *escher.Map.reactions*.
 */
export function newBeziersForReactions (reactions) {
  const beziers = {}
  for (let reactionId in reactions) {
    const reaction = reactions[reactionId]
    const these = newBeziersForSegments(reaction.segments, reactionId)
    utils.extend(beziers, these)
  }
  return beziers
}
