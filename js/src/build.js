/**
 * build
 *
 * Functions for building new reactions.
 */

var utils = require('./utils')
var _ = require('underscore')

module.exports = {
  get_met_label_loc: get_met_label_loc,
  new_reaction: new_reaction,
  rotate_nodes: rotate_nodes,
  move_node_and_dependents: move_node_and_dependents,
  new_text_label: new_text_label,
  bezier_id_for_segment_id: bezier_id_for_segment_id,
  bezier_ids_for_reaction_ids: bezier_ids_for_reaction_ids,
  new_beziers_for_segments: new_beziers_for_segments,
  new_beziers_for_reactions: new_beziers_for_reactions
}

function _get_label_loc (angle) {
  if (Math.abs(angle) > Math.PI) {
    throw new Error('Angle must be between -PI and PI')
  }
  if (Math.abs(angle) < Math.PI/7 || Math.abs(angle - Math.PI) < Math.PI/7) {
    // Close to 0 or PI
    return { x: -50, y: -40 }
  } else if (angle > 0) {
    // Bottom quadrants
    return {
      x: 15 * (1 - (Math.abs(angle - Math.PI/2)) / (Math.PI/2)),
      y: 10 + (angle - Math.PI/2) * 50
    }
  } else {
    // Top quadrants
    return {
      x: 15 * (1 - (Math.abs(angle + Math.PI/2)) / (Math.PI/2)),
      y: 10 - (Math.abs(angle) - Math.PI/2) * 50
    }
  }
}

function get_met_label_loc (angle, index, count, is_primary, bigg_id,
                            primary_index) {
  var width = bigg_id.length * 18
  var left_right = (index - (index > primary_index) - (count / 2)) > -1
  console.log(bigg_id, index, primary_index, count, left_right)
  if (Math.abs(angle) < Math.PI/7) {
    // Close to 0
    if (is_primary || left_right) {
      // Primary or bottom
      return { x: -width * 0.7, y: 40 }
    } else {
      // Top
      return { x: -width * 0.7, y: -30 }
    }
  } else if (Math.abs(angle - Math.PI) < Math.PI/7) {
    // Close to PI
    if (is_primary || !left_right) {
      // Primary or bottom
      return { x: -width * 0.7, y: 40 }
    } else {
      // Top
      return { x: -width * 0.7, y: -30 }
    }
  } else {
    if (is_primary || (angle < 0 && left_right) || (angle > 0 && !left_right)) {
      // Primary or right
      return { x: 15, y: 0 }
    } else {
      // Left
      return { x: -width, y: 0 }
    }
  }
}

/**
 * New reaction.
 * @param {Number} angle - clockwise from 'right', in degrees
 */
function new_reaction (bigg_id, cobra_reaction, cobra_metabolites,
                       selected_node_id, selected_node,
                       largest_ids, cofactors, angle) {
  // Convert to radians
  angle = Math.PI / 180 * angle

  // Generate a new integer id
  var new_reaction_id = String(++largest_ids.reactions)

  // Calculate coordinates of reaction
  var selected_node_coords = { x: selected_node.x,
                               y: selected_node.y }

  // Rotate main axis around angle with distance
  var reaction_length = 350
  var main_axis = [
    selected_node_coords,
    utils.c_plus_c(selected_node_coords, { x: reaction_length, y: 0 })
  ]
  var center = {
    x: (main_axis[0].x + main_axis[1].x) / 2,
    y: (main_axis[0].y + main_axis[1].y) / 2
  }

  // Relative label location
  var label_d = _get_label_loc(angle)

  // Relative anchor node distance
  var anchor_distance = 20

  // New reaction structure
  var new_reaction = {
    name: cobra_reaction.name,
    bigg_id: cobra_reaction.bigg_id,
    reversibility: cobra_reaction.reversibility,
    gene_reaction_rule: cobra_reaction.gene_reaction_rule,
    genes: utils.clone(cobra_reaction.genes),
    metabolites: utils.clone(cobra_reaction.metabolites)
  }
  utils.extend(new_reaction, {
    label_x: center.x + label_d.x,
    label_y: center.y + label_d.y,
    segments: {}
  })

  // Set primary metabolites and count reactants/products

  // Look for the selected metabolite, and record the indices
  var reactant_ranks = []
  var product_ranks = []
  var reactant_count = 0
  var product_count = 0
  var reaction_is_reversed = false
  for (var met_bigg_id in new_reaction.metabolites) {
    // Make the metabolites into objects
    var metabolite = cobra_metabolites[met_bigg_id]
    var coefficient = new_reaction.metabolites[met_bigg_id]
    var formula = metabolite.formula
    var new_metabolite = {
      coefficient: coefficient,
      bigg_id: met_bigg_id,
      name: metabolite.name
    }
    if (coefficient < 0) {
      new_metabolite.index = reactant_count
      // score the metabolites. Infinity == selected, >= 1 == carbon containing
      var carbons = /C([0-9]+)/.exec(formula)
      if (selected_node.bigg_id === new_metabolite.bigg_id) {
        reactant_ranks.push([ new_metabolite.index, Infinity ])
      } else if (carbons && cofactors.indexOf(utils.decompartmentalize(new_metabolite.bigg_id)[0]) === -1) {
        reactant_ranks.push([ new_metabolite.index, parseInt(carbons[1]) ])
      }
      reactant_count++
    } else {
      new_metabolite.index = product_count
      var carbons = /C([0-9]+)/.exec(formula)
      if (selected_node.bigg_id === new_metabolite.bigg_id) {
        product_ranks.push([ new_metabolite.index, Infinity ])
        reaction_is_reversed = true
      } else if (carbons && cofactors.indexOf(utils.decompartmentalize(new_metabolite.bigg_id)[0]) === -1) {
        product_ranks.push([ new_metabolite.index, parseInt(carbons[1]) ])
      }
      product_count++
    }
    new_reaction.metabolites[met_bigg_id] = new_metabolite
  }

  // get the rank with the highest score
  var max_rank = function (old, current) { return current[1] > old[1] ? current : old }
  var primary_reactant_index = reactant_ranks.reduce(max_rank, [ 0, 0 ])[0]
  var primary_product_index = product_ranks.reduce(max_rank, [ 0, 0 ])[0]

  // set primary metabolites, and keep track of the total counts
  for (var met_bigg_id in new_reaction.metabolites) {
    var metabolite = new_reaction.metabolites[met_bigg_id]
    if (metabolite.coefficient < 0) {
      metabolite.is_primary = metabolite.index === primary_reactant_index
      metabolite.count = reactant_count
    } else {
      metabolite.is_primary = metabolite.index === primary_product_index
      metabolite.count = product_count
    }
  }

  // generate anchor nodes
  var new_anchors = {}
  var anchors = [ { node_type: 'anchor_reactants',
                    dis: { x: anchor_distance * (reaction_is_reversed ? 1 : -1), y: 0 } },
                  { node_type: 'center',
                    dis: { x: 0, y: 0 } },
                  { node_type: 'anchor_products',
                    dis: { x: anchor_distance * (reaction_is_reversed ? -1 : 1), y: 0 } } ],
  anchor_ids = {}
  anchors.map(function (n) {
    var new_id = String(++largest_ids.nodes)
    var general_node_type = (n.node_type === 'center' ? 'midmarker' :
                             'multimarker')
    new_anchors[new_id] = {
      node_type: general_node_type,
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
    anchor_ids[n.node_type] = new_id
  })

  // add the segments, outside to inside
  var new_anchor_groups = [
    [ anchor_ids['anchor_reactants'], anchor_ids['center'] ],
    [ anchor_ids['anchor_products'],  anchor_ids['center'] ]
  ]
  new_anchor_groups.map(function (l) {
    var from_id = l[0]
    var to_id = l[1]
    var new_segment_id = String(++largest_ids.segments)
    new_reaction.segments[new_segment_id] =  {
      b1: null,
      b2: null,
      from_node_id: from_id,
      to_node_id: to_id,
      from_node_coefficient: null,
      to_node_coefficient: null,
      reversibility: new_reaction.reversibility,
      data: new_reaction.data,
      reverse_flux: new_reaction.reverse_flux
    }
    new_anchors[from_id].connected_segments.push({ segment_id: new_segment_id,
                                                   reaction_id: new_reaction_id })
    new_anchors[to_id].connected_segments.push({ segment_id: new_segment_id,
                                                 reaction_id: new_reaction_id })
  })

  // Add the metabolites, keeping track of total reactants and products.
  var new_nodes = new_anchors
  for (var met_bigg_id in new_reaction.metabolites) {
    var metabolite = new_reaction.metabolites[met_bigg_id]
    var primary_index
    var from_node_id
    if (metabolite.coefficient < 0) {
      primary_index = primary_reactant_index
      from_node_id = anchor_ids['anchor_reactants']
    } else {
      primary_index = primary_product_index
      from_node_id = anchor_ids['anchor_products']
    }

    // calculate coordinates of metabolite components
    var met_loc = calculate_new_metabolite_coordinates(metabolite,
                                                       primary_index,
                                                       main_axis,
                                                       center,
                                                       reaction_length,
                                                       reaction_is_reversed)

    // if this is the existing metabolite
    if (selected_node.bigg_id === metabolite.bigg_id) {
      var new_segment_id = String(++largest_ids.segments)
      new_reaction.segments[new_segment_id] = {
        b1: met_loc.b1,
        b2: met_loc.b2,
        from_node_id: from_node_id,
        to_node_id: selected_node_id,
        from_node_coefficient: null,
        to_node_coefficient: metabolite.coefficient,
        reversibility: new_reaction.reversibility,
      }
      // Update the existing node
      selected_node.connected_segments.push({
        segment_id: new_segment_id,
        reaction_id: new_reaction_id
      })
      new_nodes[from_node_id].connected_segments.push({
        segment_id: new_segment_id,
        reaction_id: new_reaction_id
      })
    } else {
      // save new metabolite
      var new_segment_id = String(++largest_ids.segments)
      var new_node_id = String(++largest_ids.nodes)
      new_reaction.segments[new_segment_id] = {
        b1: met_loc.b1,
        b2: met_loc.b2,
        from_node_id: from_node_id,
        to_node_id: new_node_id,
        from_node_coefficient: null,
        to_node_coefficient: metabolite.coefficient,
        reversibility: new_reaction.reversibility,
      }
      // save new node
      var met_label_d = get_met_label_loc(angle, metabolite.index,
                                          metabolite.count,
                                          metabolite.is_primary,
                                          metabolite.bigg_id,
                                          primary_index)
      new_nodes[new_node_id] = {
        connected_segments: [ { segment_id: new_segment_id,
                                reaction_id: new_reaction_id } ],
        x: met_loc.circle.x,
        y: met_loc.circle.y,
        node_is_primary: metabolite.is_primary,
        label_x: met_loc.circle.x + met_label_d.x,
        label_y: met_loc.circle.y + met_label_d.y,
        name: metabolite.name,
        bigg_id: metabolite.bigg_id,
        node_type: 'metabolite'
      }
      new_nodes[from_node_id].connected_segments.push({
        segment_id: new_segment_id,
        reaction_id: new_reaction_id
      })
    }
  }

  // now take out the extra reaction details
  var metabolites_array = []
  for (var bigg_id in new_reaction.metabolites) {
    metabolites_array.push({
      bigg_id: bigg_id,
      coefficient: new_reaction.metabolites[bigg_id].coefficient
    })
  }
  new_reaction.metabolites = metabolites_array

  // new_reactions object
  var new_reactions = {}
  new_reactions[new_reaction_id] = new_reaction

  // new_beziers object
  var new_beziers = new_beziers_for_reactions(new_reactions)

  // add the selected node for rotation, and return it as a new (updated) node
  new_nodes[selected_node_id] = selected_node
  rotate_nodes(new_nodes, new_reactions, new_beziers,
               angle, selected_node_coords)

  return { new_reactions: new_reactions,
           new_beziers: new_beziers,
           new_nodes: new_nodes }
}

/**
 * Rotate the nodes around center.
 * selected_nodes: Nodes to rotate.
 * reactions: Only updates beziers for these reactions.
 * beziers: Also update the bezier points.
 * angle: Angle to rotate in radians.
 * center: Point to rotate around.
 */
function rotate_nodes (selected_nodes, reactions, beziers, angle, center) {
  var rotate_around = function (coord) {
    if (coord === null) {
      return null
    }
    return utils.rotate_coords(coord, angle, center)
  }

  // recalculate: node
  var updated_node_ids = [], updated_reaction_ids = []
  for (var node_id in selected_nodes) {
    var node = selected_nodes[node_id],
    // rotation distance
    displacement = rotate_around({ x: node.x, y: node.y }),
    // move the node
    updated = move_node_and_labels(node, reactions,
                                   displacement)
    // move the bezier points
    node.connected_segments.map(function (segment_obj) {
      var reaction = reactions[segment_obj.reaction_id]
      // If the reaction was not passed in the reactions argument, then ignore
      if (reaction === undefined) return

      // rotate the beziers
      var segment_id = segment_obj.segment_id
      var segment = reaction.segments[segment_id]
      if (segment.to_node_id==node_id && segment.b2) {
        var displacement = rotate_around(segment.b2)
        var bez_id = bezier_id_for_segment_id(segment_id, 'b2')
        segment.b2 = utils.c_plus_c(segment.b2, displacement)
        beziers[bez_id].x = segment.b2.x
        beziers[bez_id].y = segment.b2.y
      } else if (segment.from_node_id==node_id && segment.b1) {
        var displacement = rotate_around(segment.b1)
        var bez_id = bezier_id_for_segment_id(segment_id, 'b1')
        segment.b1 = utils.c_plus_c(segment.b1, displacement)
        beziers[bez_id].x = segment.b1.x
        beziers[bez_id].y = segment.b1.y
      }
    })

    updated_reaction_ids = utils.unique_concat([updated_reaction_ids,
                                                updated.reaction_ids])
    updated_node_ids.push(node_id)
  }

  return { node_ids: updated_node_ids,
           reaction_ids: updated_reaction_ids }
}

/**
 * Move the node and its labels and beziers.
 */
function move_node_and_dependents (node, node_id, reactions, beziers, displacement) {
  var updated = move_node_and_labels(node, reactions, displacement)

  // move beziers
  node.connected_segments.map(function(segment_obj) {
    var reaction = reactions[segment_obj.reaction_id]
    // If the reaction was not passed in the reactions argument, then ignore
    if (_.isUndefined(reaction)) return

    // Update beziers
    var segment_id = segment_obj.segment_id
    var segment = reaction.segments[segment_id]
    var cs = [ [ 'b1', 'from_node_id' ], [ 'b2', 'to_node_id' ] ]
    cs.forEach(function (c) {
      var bez = c[0]
      var node = c[1]
      if (segment[node] === node_id && segment[bez]) {
        segment[bez] = utils.c_plus_c(segment[bez], displacement)
        var tbez = beziers[bezier_id_for_segment_id(segment_id, bez)]
        tbez.x = segment[bez].x
        tbez.y = segment[bez].y
      }
    })

    // add to list of updated reaction ids if it isn't already there
    if (updated.reaction_ids.indexOf(segment_obj.reaction_id) < 0) {
      updated.reaction_ids.push(segment_obj.reaction_id)
    }
  })
  return updated
}

function move_node_and_labels (node, reactions, displacement) {
  node.x = node.x + displacement.x
  node.y = node.y + displacement.y

  // recalculate: node label
  node.label_x = node.label_x + displacement.x
  node.label_y = node.label_y + displacement.y

  // recalculate: reaction label
  var updated_reaction_ids = []
  node.connected_segments.map(function(segment_obj) {
    var reaction = reactions[segment_obj.reaction_id]
    // add to list of updated reaction ids if it isn't already there
    if (updated_reaction_ids.indexOf(segment_obj.reaction_id) < 0) {
      updated_reaction_ids.push(segment_obj.reaction_id)

      // update reaction label (but only once per reaction
      if (node.node_type == 'midmarker') {
        reaction.label_x = reaction.label_x + displacement.x
        reaction.label_y = reaction.label_y + displacement.y
      }
    }
  })
  return { reaction_ids: updated_reaction_ids }
}

/**
 * Calculate the distance of mets from main reaction axis.
 * @param {Number} w - Scaling factor
 * @param {Number} draw_at_index - Index of metabolite
 * @param {Number} num_slots - Number of metabolites
 */
function _met_index_disp (w, draw_at_index, num_slots) {
  var half = Math.floor(num_slots / 2)
  return w * (draw_at_index - half + (draw_at_index >= half))
}

function _met_secondary_disp (secondary_w, secondary_dis, draw_at_index,
                              num_slots) {
  var half = Math.floor(num_slots / 2)
  return secondary_dis + Math.abs(draw_at_index - half + (draw_at_index >= half)) * secondary_w
}

/**
 * Calculate metabolite coordinates for a new reaction metabolite.
 */
function calculate_new_metabolite_coordinates (met, primary_index, main_axis,
                                               center, dis, is_reversed) {
  // new local coordinate system
  var displacement = main_axis[0]
  main_axis = [ utils.c_minus_c(main_axis[0], displacement),
                utils.c_minus_c(main_axis[1], displacement) ]
  center = utils.c_minus_c(center, displacement)

  // Curve parameters
  var w = 80 // distance between reactants and between products
  var b1_strength = 0.4
  var b2_strength = 0.25
  var w2 = w * 0.3 // bezier target poin
  var secondary_dis = 50 // y distance of first secondary mets
  var secondary_w = 20 // y distance of each other secondary met

  // Secondary mets
  var num_slots = met.count - 1

  // Size and spacing for primary and secondary metabolites
  var ds
  var draw_at_index
  var r
  if (met.is_primary) { // primary
    ds = 20
  } else { // secondary
    ds = 10
    // don't use center slot
    if (met.index > primary_index) draw_at_index = met.index - 1
    else draw_at_index = met.index
  }

  var de = dis - ds // distance between ends of line axis
  var reaction_axis = [ { x: ds, y: 0 },
                        { x: de, y: 0 } ]

  // Define line parameters and axis.
  // Begin with unrotated coordinate system. +y = Down, +x = Right.
  var end
  var circle
  var b1
  var b2

  // Reactants
  if (((met.coefficient < 0) !== is_reversed) && met.is_primary) { // Ali == BADASS
    end = {
      x: reaction_axis[0].x,
      y: reaction_axis[0].y
    }
    b1 = {
      x: center.x * (1 - b1_strength) + reaction_axis[0].x * b1_strength,
      y: center.y * (1 - b1_strength) + reaction_axis[0].y * b1_strength
    }
    b2 = {
      x: center.x * b2_strength + end.x * (1 - b2_strength),
      y: center.y * b2_strength + end.y * (1 - b2_strength)
    }
    circle = {
      x: main_axis[0].x,
      y: main_axis[0].y
    }
  } else if ((met.coefficient < 0) !== is_reversed) {
    end = {
      x: reaction_axis[0].x + _met_secondary_disp(secondary_w, secondary_dis,
                                                  draw_at_index, num_slots),
      y: reaction_axis[0].y + _met_index_disp(w2, draw_at_index, num_slots)
    }
    b1 = {
      x: center.x * (1 - b1_strength) + reaction_axis[0].x * b1_strength,
      y: center.y * (1 - b1_strength) + reaction_axis[0].y * b1_strength
    }
    b2 = {
      x: center.x * b2_strength + end.x * (1 - b2_strength),
      y: center.y * b2_strength + end.y * (1 - b2_strength)
    }
    circle = {
      x: main_axis[0].x + _met_secondary_disp (secondary_w, secondary_dis,
                                               draw_at_index, num_slots),
      y: main_axis[0].y + _met_index_disp(w, draw_at_index, num_slots)
    }
  } else if (((met.coefficient > 0) !== is_reversed) && met.is_primary) {        // products
    end = {
      x: reaction_axis[1].x,
      y: reaction_axis[1].y
    }
    b1 = {
      x: center.x * (1 - b1_strength) + reaction_axis[1].x * b1_strength,
      y: center.y * (1 - b1_strength) + reaction_axis[1].y * b1_strength
    }
    b2 = {
      x: center.x*b2_strength + end.x*(1-b2_strength),
      y: center.y*b2_strength + end.y*(1-b2_strength)
    }
    circle = {
      x: main_axis[1].x,
      y: main_axis[1].y
    }
  } else if ((met.coefficient > 0) !== is_reversed) {
    end = {
      x: reaction_axis[1].x - _met_secondary_disp (secondary_w, secondary_dis,
                                                   draw_at_index, num_slots),
      y: reaction_axis[1].y + _met_index_disp(w2, draw_at_index, num_slots)
    }
    b1 = {
      x: center.x * (1 - b1_strength) + reaction_axis[1].x * b1_strength,
      y: center.y * (1 - b1_strength) + reaction_axis[1].y * b1_strength
    }
    b2 = {
      x: center.x*b2_strength + end.x*(1-b2_strength),
      y: center.y*b2_strength + end.y*(1-b2_strength)
    }
    circle = {
      x: main_axis[1].x - _met_secondary_disp (secondary_w, secondary_dis,
                                               draw_at_index, num_slots),
      y: main_axis[1].y + _met_index_disp(w, draw_at_index, num_slots)
    }
  }

  return {
    b1: utils.c_plus_c(displacement, b1),
    b2: utils.c_plus_c(displacement, b2),
    circle: utils.c_plus_c(displacement, circle)
  }
}

function new_text_label (largest_ids, text, coords) {
  var new_id = String(++largest_ids.text_labels)
  var new_label = { text: text, x: coords.x, y: coords.y }
  return { id: new_id, label: new_label }
}

function bezier_id_for_segment_id (segment_id, bez) {
  return segment_id + '_' + bez
}

/**
 * Return an array of beziers ids for the array of reaction ids.
 * @param {Object} reactions - A reactions object, e.g. a subset of
 * *escher.Map.reactions*.
 */
function bezier_ids_for_reaction_ids (reactions) {
  var bezier_ids = []
  for (var reaction_id in reactions) {
    var reaction = reactions[reaction_id]

    for (var segment_id in reaction.segments) {
      var segment = reaction.segments[segment_id]

      var bezs = [ 'b1', 'b2' ]
      bezs.forEach(function (bez) {
        var seg_bez = segment[bez]
        if (seg_bez !== null) {
          bezier_ids.push(bezier_id_for_segment_id(segment_id, bez))
        }
      })
    }
  }
  return bezier_ids
}

/**
 * Return an object containing beziers for the segments object.
 * segments: A segments object, e.g. *escher.Map.segments*.
 * reaction_id: The reaction id for the segments.
 */
function new_beziers_for_segments (segments, reaction_id) {
  var beziers = {}
  for (var segment_id in segments) {
    var segment = segments[segment_id]

    ;[ 'b1', 'b2' ].forEach(function (bez) {
      var seg_bez = segment[bez]
      if (seg_bez !== null) {
        var bezier_id = bezier_id_for_segment_id(segment_id, bez)
        beziers[bezier_id] = {
          bezier: bez,
          x: seg_bez.x,
          y: seg_bez.y,
          reaction_id: reaction_id,
          segment_id: segment_id
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
function new_beziers_for_reactions (reactions) {
  var beziers = {}
  for (var reaction_id in reactions) {
    var reaction = reactions[reaction_id]

    var these = new_beziers_for_segments(reaction.segments, reaction_id)
    utils.extend(beziers, these)
  }
  return beziers
}
