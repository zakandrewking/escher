/**
 * Behavior. Defines the set of click and drag behaviors for the map, and keeps
 * track of which behaviors are activated.
 *
 * A Behavior instance has the following attributes:
 *
 * my_behavior.rotation_drag, my_behavior.text_label_mousedown,
 * my_behavior.text_label_click, my_behavior.selectable_mousedown,
 * my_behavior.selectable_click, my_behavior.selectable_drag,
 * my_behavior.node_mouseover, my_behavior.node_mouseout,
 * my_behavior.label_mousedown, my_behavior.label_mouseover,
 * my_behavior.label_mouseout, my_behavior.bezier_drag,
 * my_behavior.bezier_mouseover, my_behavior.bezier_mouseout,
 * my_behavior.reaction_label_drag, my_behavior.node_label_drag,
 *
 */

var utils = require('./utils')
var build = require('./build')
var d3_drag = require('d3-drag').drag
var d3_select = require('d3-selection').select
var d3_mouse = require('d3-selection').mouse
var d3_event = require('d3-selection').event

var Behavior = utils.make_class()
// methods
Behavior.prototype = {
  init: init,
  toggle_rotation_mode: toggle_rotation_mode,
  turn_everything_on: turn_everything_on,
  turn_everything_off: turn_everything_off,
  // toggle
  toggle_selectable_click: toggle_selectable_click,
  toggle_text_label_edit: toggle_text_label_edit,
  toggle_selectable_drag: toggle_selectable_drag,
  toggle_label_drag: toggle_label_drag,
  toggle_label_mouseover: toggle_label_mouseover,
  toggle_bezier_drag: toggle_bezier_drag,
  // util
  turn_off_drag: turn_off_drag,
  // get drag behaviors
  _get_selectable_drag: _get_selectable_drag,
  _get_bezier_drag: _get_bezier_drag,
  _get_reaction_label_drag: _get_reaction_label_drag,
  _get_node_label_drag: _get_node_label_drag,
  _get_generic_drag: _get_generic_drag,
  _get_generic_angular_drag: _get_generic_angular_drag
}
module.exports = Behavior


// definitions
function init (map, undo_stack) {
  this.map = map
  this.undo_stack = undo_stack

  // make an empty function that can be called as a behavior and does nothing
  this.empty_behavior = function () {}

  // rotation mode operates separately from the rest
  this.rotation_mode_enabled = false
  this.rotation_drag = d3_drag()

  // behaviors to be applied
  this.selectable_mousedown = null
  this.text_label_mousedown = null
  this.text_label_click = null
  this.selectable_drag = this.empty_behavior
  this.node_mouseover = null
  this.node_mouseout = null
  this.label_mousedown = null
  this.label_mouseover = null
  this.label_mouseout = null
  this.bezier_drag = this.empty_behavior
  this.bezier_mouseover = null
  this.bezier_mouseout = null
  this.reaction_label_drag = this.empty_behavior
  this.node_label_drag = this.empty_behavior
  this.dragging = false
  this.turn_everything_on()
}

/**
 * Toggle everything except rotation mode and text mode.
 */
function turn_everything_on () {
  this.toggle_selectable_click(true)
  this.toggle_selectable_drag(true)
  this.toggle_label_drag(true)
  this.toggle_label_mouseover(true)
}

/**
 * Toggle everything except rotation mode and text mode.
 */
function turn_everything_off () {
  this.toggle_selectable_click(false)
  this.toggle_selectable_drag(false)
  this.toggle_label_drag(false)
  this.toggle_label_mouseover(false)
}

function toggle_rotation_mode (on_off) {
  /** Listen for rotation, and rotate selected nodes.

   */
  if (on_off === undefined) {
    this.rotation_mode_enabled = !this.rotation_mode_enabled
  } else {
    this.rotation_mode_enabled = on_off
  }

  var selection_node = this.map.sel.selectAll('.node-circle')
  var selection_background = this.map.sel.selectAll('#canvas')

  if (this.rotation_mode_enabled) {
    this.map.callback_manager.run('start_rotation')

    var selected_nodes = this.map.get_selected_nodes()
    if (Object.keys(selected_nodes).length === 0) {
      console.warn('No selected nodes')
      return
    }

    // show center
    this.center = average_location(selected_nodes)
    show_center.call(this)

    // this.set_status('Drag to rotate.')
    var map = this.map
    var selected_node_ids = Object.keys(selected_nodes)
    var reactions = this.map.reactions
    var nodes = this.map.nodes
    var beziers = this.map.beziers

    var start_fn = function (d) {
      // silence other listeners
      d3_event.sourceEvent.stopPropagation()
    }
    var drag_fn = function (d, angle, total_angle, center) {
      var updated = build.rotate_nodes(selected_nodes, reactions,
                                       beziers, angle, center)
      map.draw_these_nodes(updated.node_ids)
      map.draw_these_reactions(updated.reaction_ids)
    }
    var end_fn = function (d) {}
    var undo_fn = function (d, total_angle, center) {
      // undo
      var these_nodes = {}
      selected_node_ids.forEach(function (id) {
        these_nodes[id] = nodes[id]
      })
      var updated = build.rotate_nodes(these_nodes, reactions,
                                       beziers, -total_angle,
                                       center)
      map.draw_these_nodes(updated.node_ids)
      map.draw_these_reactions(updated.reaction_ids)
    }
    var redo_fn = function (d, total_angle, center) {
      // redo
      var these_nodes = {}
      selected_node_ids.forEach(function (id) {
        these_nodes[id] = nodes[id]
      })
      var updated = build.rotate_nodes(these_nodes, reactions,
                                       beziers, total_angle,
                                       center)
      map.draw_these_nodes(updated.node_ids)
      map.draw_these_reactions(updated.reaction_ids) }
    var center_fn = function () {
      return this.center
    }.bind(this)
    this.rotation_drag = this._get_generic_angular_drag(start_fn, drag_fn,
                                                        end_fn, undo_fn,
                                                        redo_fn, center_fn,
                                                        this.map.sel)
    selection_background.call(this.rotation_drag)
    this.selectable_drag = this.rotation_drag
  } else {
    // turn off all listeners
    hide_center.call(this)
    selection_node.on('mousedown.center', null)
    selection_background.on('mousedown.center', null)
    selection_background.on('mousedown.drag', null)
    selection_background.on('touchstart.drag', null)
    this.rotation_drag = null
    this.selectable_drag = null
  }

  // definitions
  function show_center () {
    var s = this.map.sel.selectAll('#rotation-center').data([0])
    var enter = s.enter().append('g').attr('id', 'rotation-center')

    enter.append('path').attr('d', 'M-32 0 L32 0')
      .attr('class', 'rotation-center-line')
    enter.append('path').attr('d', 'M0 -32 L0 32')
      .attr('class', 'rotation-center-line')

    enter.merge(s)
      .attr('transform',
            'translate(' + this.center.x + ',' + this.center.y + ')')
      .attr('visibility', 'visible')

    s.call(d3_drag()
           .on('drag', function (sel) {
             var cur = utils.d3_transform_catch(sel.attr('transform')),
             new_loc = [d3_event.dx + cur.translate[0],
                        d3_event.dy + cur.translate[1]]
             sel.attr('transform', 'translate('+new_loc+')')
             this.center = { x: new_loc[0], y: new_loc[1] }
           }.bind(this, s)))
    s.on('mouseover', function () {
      var current = parseFloat(this.selectAll('path').style('stroke-width'))
      this.selectAll('path').style('stroke-width', current * 2 + 'px')
    }.bind(s))
    s.on('mouseout', function () {
      this.selectAll('path').style('stroke-width', null)
    }.bind(s))
  }
  function hide_center(sel) {
    this.map.sel.select('#rotation-center')
      .attr('visibility', 'hidden')
  }
  function average_location(nodes) {
    var xs = []
    var ys = []
    for (var node_id in nodes) {
      var node = nodes[node_id]
      if (node.x !== undefined)
        xs.push(node.x)
      if (node.y !== undefined)
        ys.push(node.y)
    }
    return { x: utils.mean(xs),
             y: utils.mean(ys) }
  }
}

/**
 * With no argument, toggle the node click on or off. Pass in a boolean argument
 * to set the on/off state.
 */
function toggle_selectable_click (on_off) {
  if (on_off === undefined) {
    on_off = this.selectable_mousedown === null
  }
  if (on_off) {
    var map = this.map
    this.selectable_mousedown = function (d) {
      // stop propogation for the buildinput to work right
      d3_event.stopPropagation()
      // this.parentNode.__data__.was_selected = d3_select(this.parentNode).classed('selected')
      // d3_select(this.parentNode).classed('selected', true)
    }
    this.selectable_click = function (d) {
      // stop propogation for the buildinput to work right
      d3_event.stopPropagation()
      // click suppressed. This DOES have en effect.
      if (d3_event.defaultPrevented) return
      // turn off the temporary selection so select_selectable
      // works. This is a bit of a hack.
      // if (!this.parentNode.__data__.was_selected)
      //     d3_select(this.parentNode).classed('selected', false)
      map.select_selectable(this, d, d3_event.shiftKey)
      // this.parentNode.__data__.was_selected = false
    }
    this.node_mouseover = function (d) {
      d3_select(this).style('stroke-width', null)
      var current = parseFloat(d3_select(this).style('stroke-width'))
      if (!d3_select(this.parentNode).classed('selected'))
        d3_select(this).style('stroke-width', current * 3 + 'px')
    }
    this.node_mouseout = function (d) {
      d3_select(this).style('stroke-width', null)
    }
  } else {
    this.selectable_mousedown = null
    this.selectable_click = null
    this.node_mouseover = null
    this.node_mouseout = null
    this.map.sel.select('#nodes')
      .selectAll('.node-circle').style('stroke-width', null)
  }
}

/**
 * With no argument, toggle the text edit on mousedown on/off. Pass in a boolean
 * argument to set the on/off state. The backup state is equal to
 * selectable_mousedown.
 */
function toggle_text_label_edit (on_off) {
  if (on_off === undefined) {
    on_off = this.text_edit_mousedown == null
  }
  if (on_off) {
    var map = this.map
    var selection = this.selection
    this.text_label_mousedown = function () {
      if (d3_event.defaultPrevented) {
        return // mousedown suppressed
      }
      // run the callback
      var coords_a = utils.d3_transform_catch(d3_select(this).attr('transform'))
          .translate
      var coords = { x: coords_a[0], y: coords_a[1] }
      map.callback_manager.run('edit_text_label', null, d3_select(this), coords)
      d3_event.stopPropagation()
    }
    this.text_label_click = null
    this.map.sel.select('#text-labels')
      .selectAll('.label')
      .classed('edit-text-cursor', true)
    // add the new-label listener
    this.map.sel.on('mousedown.new_text_label', function (node) {
      // silence other listeners
      d3_event.preventDefault()
      var coords = {
        x: d3_mouse(node)[0],
        y: d3_mouse(node)[1],
      }
      this.map.callback_manager.run('new_text_label', null, coords)
    }.bind(this, this.map.sel.node()))
  } else {
    this.text_label_mousedown = this.selectable_mousedown
    this.text_label_click = this.selectable_click
    this.map.sel.select('#text-labels')
      .selectAll('.label')
      .classed('edit-text-cursor', false)
    // remove the new-label listener
    this.map.sel.on('mousedown.new_text_label', null)
    this.map.callback_manager.run('hide_text_label_editor')
  }
}

/**
 * With no argument, toggle the node drag & bezier drag on or off. Pass in a
 * boolean argument to set the on/off state.
 */
function toggle_selectable_drag (on_off) {
  if (on_off === undefined) {
    on_off = this.selectable_drag === this.empty_behavior
  }
  if (on_off) {
    this.selectable_drag = this._get_selectable_drag(this.map, this.undo_stack)
    this.bezier_drag = this._get_bezier_drag(this.map, this.undo_stack)
  } else {
    this.selectable_drag = this.empty_behavior
    this.bezier_drag = this.empty_behavior
  }
}

/**
 * With no argument, toggle the label drag on or off. Pass in a boolean argument
 * to set the on/off state.
 * @param {Boolean} on_off - The new on/off state.
 */
function toggle_label_drag (on_off) {
  if (on_off === undefined) {
    on_off = this.label_drag === this.empty_behavior
  }
  if (on_off) {
    this.reaction_label_drag = this._get_reaction_label_drag(this.map)
    this.node_label_drag = this._get_node_label_drag(this.map)
  } else {
    this.reaction_label_drag = this.empty_behavior
    this.node_label_drag = this.empty_behavior
  }
}

/**
 * With no argument, toggle the tooltips on mouseover labels.
 * @param {Boolean} on_off - The new on/off state.
 */
function toggle_label_mouseover (on_off) {
  if (on_off === undefined) {
    on_off = this.label_mouseover === null
  }

  if (on_off) {

    // Show/hide tooltip.
    // @param {String} type - 'reaction_label' or 'node_label'
    // @param {Object} d - D3 data for DOM element
    this.label_mouseover = function (type, d) {
      if (!this.dragging) {
        this.map.callback_manager.run('show_tooltip', null, type, d)
      }
    }.bind(this)

    this.label_mouseout = function () {
      this.map.callback_manager.run('delay_hide_tooltip')
    }.bind(this)

  } else {
    this.label_mouseover = null
  }
}

/**
 * With no argument, toggle the bezier drag on or off. Pass in a boolean
 * argument to set the on/off state.
 */
function toggle_bezier_drag (on_off) {
  if (on_off === undefined) {
    on_off = this.bezier_drag === this.empty_behavior
  }
  if (on_off) {
    this.bezier_drag = this._get_bezier_drag(this.map)
    this.bezier_mouseover = function (d) {
      d3_select(this).style('stroke-width', String(3)+'px')
    }
    this.bezier_mouseout = function (d) {
      d3_select(this).style('stroke-width', String(1)+'px')
    }
  } else {
    this.bezier_drag = this.empty_behavior
    this.bezier_mouseover = null
    this.bezier_mouseout = null
  }
}

function turn_off_drag (sel) {
  sel.on('mousedown.drag', null)
  sel.on('touchstart.drag', null)
}

/**
 * Drag the selected nodes and text labels.
 * @param {} map -
 * @param {} undo_stack -
 */
function _get_selectable_drag (map, undo_stack) {
  // define some variables
  var behavior = d3_drag()
  var the_timeout = null
  var total_displacement = null
  // for nodes
  var node_ids_to_drag = null
  var reaction_ids = null
  // for text labels
  var text_label_ids_to_drag = null
  var move_label = function (text_label_id, displacement) {
    var text_label = map.text_labels[text_label_id]
    text_label.x = text_label.x + displacement.x
    text_label.y = text_label.y + displacement.y
  }
  var set_dragging = function (on_off) {
    this.dragging = on_off
  }.bind(this)

  behavior.on('start', function (d) {
    set_dragging(true)

    // silence other listeners (e.g. nodes BELOW this one)
    d3_event.sourceEvent.stopPropagation()
    // remember the total displacement for later
    total_displacement = { x: 0, y: 0 }

    // If a text label is selected, the rest is not necessary
    if (d3_select(this).attr('class').indexOf('label') === -1) {
      // Note that drag start is called even for a click event
      var data = this.parentNode.__data__,
      bigg_id = data.bigg_id,
      node_group = this.parentNode
      // Move element to back (for the next step to work). Wait 200ms
      // before making the move, becuase otherwise the element will be
      // deleted before the click event gets called, and selection
      // will stop working.
      the_timeout = setTimeout(function () {
        node_group.parentNode.insertBefore(node_group,
                                           node_group.parentNode.firstChild)
      }, 200)
      // prepare to combine metabolites
      map.sel.selectAll('.metabolite-circle')
        .on('mouseover.combine', function (d) {
          if (d.bigg_id === bigg_id && d.node_id !== data.node_id) {
            d3_select(this).style('stroke-width', String(12) + 'px')
              .classed('node-to-combine', true)
          }
        })
        .on('mouseout.combine', function (d) {
          if (d.bigg_id === bigg_id) {
            map.sel.selectAll('.node-to-combine')
              .style('stroke-width', String(2) + 'px')
              .classed('node-to-combine', false)
          }
        })
    }
  })

  behavior.on('drag', function (d) {
    // if this node is not already selected, then select this one and
    // deselect all other nodes. Otherwise, leave the selection alone.
    if (!d3_select(this.parentNode).classed('selected')) {
      map.select_selectable(this, d)
    }

    // get the grabbed id
    var grabbed = {}
    if (d3_select(this).attr('class').indexOf('label') === -1) {
      // if it is a node
      grabbed['type'] = 'node'
      grabbed['id'] = this.parentNode.__data__.node_id
    } else {
      // if it is a text label
      grabbed['type'] = 'label'
      grabbed['id'] = this.__data__.text_label_id
    }

    var selected_node_ids = map.get_selected_node_ids()
    var selected_text_label_ids = map.get_selected_text_label_ids()
    node_ids_to_drag = []; text_label_ids_to_drag = []
    // choose the nodes and text labels to drag
    if (grabbed['type']=='node' &&
        selected_node_ids.indexOf(grabbed['id']) === -1) {
      node_ids_to_drag.push(grabbed['id'])
    } else if (grabbed['type'] === 'label' &&
               selected_text_label_ids.indexOf(grabbed['id']) === -1) {
      text_label_ids_to_drag.push(grabbed['id'])
    } else {
      node_ids_to_drag = selected_node_ids
      text_label_ids_to_drag = selected_text_label_ids
    }
    reaction_ids = []
    var displacement = {
      x: d3_event.dx,
      y: d3_event.dy,
    }
    total_displacement = utils.c_plus_c(total_displacement, displacement)
    node_ids_to_drag.forEach(function (node_id) {
      // update data
      var node = map.nodes[node_id],
      updated = build.move_node_and_dependents(node, node_id,
                                               map.reactions,
                                               map.beziers,
                                               displacement)
      reaction_ids = utils.unique_concat([ reaction_ids, updated.reaction_ids ])
      // remember the displacements
      // if (!(node_id in total_displacement))  total_displacement[node_id] = { x: 0, y: 0 }
      // total_displacement[node_id] = utils.c_plus_c(total_displacement[node_id], displacement)
    })
    text_label_ids_to_drag.forEach(function (text_label_id) {
      move_label(text_label_id, displacement)
      // remember the displacements
      // if (!(node_id in total_displacement))  total_displacement[node_id] = { x: 0, y: 0 }
      // total_displacement[node_id] = utils.c_plus_c(total_displacement[node_id], displacement)
    })
    // draw
    map.draw_these_nodes(node_ids_to_drag)
    map.draw_these_reactions(reaction_ids)
    map.draw_these_text_labels(text_label_ids_to_drag)
  })

  behavior.on('end', function () {
    set_dragging(false)

    if (node_ids_to_drag === null) {
      // Drag end can be called when drag has not been called. In this, case, do
      // nothing.
      total_displacement = null
      node_ids_to_drag = null
      text_label_ids_to_drag = null
      reaction_ids = null
      the_timeout = null
      return
    }
    // look for mets to combine
    var node_to_combine_array = []
    map.sel.selectAll('.node-to-combine').each(function (d) {
      node_to_combine_array.push(d.node_id)
    })
    if (node_to_combine_array.length === 1) {
      // If a node is ready for it, combine nodes
      var fixed_node_id = node_to_combine_array[0],
      dragged_node_id = this.parentNode.__data__.node_id,
      saved_dragged_node = utils.clone(map.nodes[dragged_node_id]),
      segment_objs_moved_to_combine = combine_nodes_and_draw(fixed_node_id,
                                                             dragged_node_id)
      undo_stack.push(function () {
        // undo
        // put the old node back
        map.nodes[dragged_node_id] = saved_dragged_node
        var fixed_node = map.nodes[fixed_node_id],
            updated_reactions = []
        segment_objs_moved_to_combine.forEach(function (segment_obj) {
          var segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id]
          if (segment.from_node_id==fixed_node_id) {
            segment.from_node_id = dragged_node_id
          } else if (segment.to_node_id==fixed_node_id) {
            segment.to_node_id = dragged_node_id
          } else {
            console.error('Segment does not connect to fixed node')
          }
          // removed this segment_obj from the fixed node
          fixed_node.connected_segments = fixed_node.connected_segments.filter(function (x) {
            return !(x.reaction_id==segment_obj.reaction_id && x.segment_id==segment_obj.segment_id)
          })
          if (updated_reactions.indexOf(segment_obj.reaction_id)==-1)
            updated_reactions.push(segment_obj.reaction_id)
        })
        map.draw_these_nodes([dragged_node_id])
        map.draw_these_reactions(updated_reactions)
      }, function () {
        // redo
        combine_nodes_and_draw(fixed_node_id, dragged_node_id)
      })

    } else {
      // otherwise, drag node

      // add to undo/redo stack
      // remember the displacement, dragged nodes, and reactions
      var saved_displacement = utils.clone(total_displacement),
      // BUG TODO this variable disappears!
      // Happens sometimes when you drag a node, then delete it, then undo twice
      saved_node_ids = utils.clone(node_ids_to_drag),
      saved_text_label_ids = utils.clone(text_label_ids_to_drag),
      saved_reaction_ids = utils.clone(reaction_ids)
      undo_stack.push(function () {
        // undo
        saved_node_ids.forEach(function (node_id) {
          var node = map.nodes[node_id]
          build.move_node_and_dependents(node, node_id, map.reactions,
                                         map.beziers,
                                         utils.c_times_scalar(saved_displacement, -1))
        })
        saved_text_label_ids.forEach(function (text_label_id) {
          move_label(text_label_id,
                     utils.c_times_scalar(saved_displacement, -1))
        })
        map.draw_these_nodes(saved_node_ids)
        map.draw_these_reactions(saved_reaction_ids)
        map.draw_these_text_labels(saved_text_label_ids)
      }, function () {
        // redo
        saved_node_ids.forEach(function (node_id) {
          var node = map.nodes[node_id]
          build.move_node_and_dependents(node, node_id, map.reactions,
                                         map.beziers,
                                         saved_displacement)
        })
        saved_text_label_ids.forEach(function (text_label_id) {
          move_label(text_label_id, saved_displacement)
        })
        map.draw_these_nodes(saved_node_ids)
        map.draw_these_reactions(saved_reaction_ids)
        map.draw_these_text_labels(saved_text_label_ids)
      })
    }

    // stop combining metabolites
    map.sel.selectAll('.metabolite-circle')
      .on('mouseover.combine', null)
      .on('mouseout.combine', null)

    // clear the timeout
    clearTimeout(the_timeout)

    // clear the shared variables
    total_displacement = null
    node_ids_to_drag = null
    text_label_ids_to_drag = null
    reaction_ids = null
    the_timeout = null
  })

  return behavior

  // definitions
  function combine_nodes_and_draw (fixed_node_id, dragged_node_id) {
    var dragged_node = map.nodes[dragged_node_id]
    var fixed_node = map.nodes[fixed_node_id]
    var updated_segment_objs = []
    dragged_node.connected_segments.forEach(function (segment_obj) {
      // change the segments to reflect
      var segment
      try {
        segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id]
        if (segment === undefined) throw new Error('undefined segment')
      } catch (e) {
        console.warn('Could not find connected segment ' + segment_obj.segment_id)
        return
      }
      if (segment.from_node_id==dragged_node_id) segment.from_node_id = fixed_node_id
      else if (segment.to_node_id==dragged_node_id) segment.to_node_id = fixed_node_id
      else {
        console.error('Segment does not connect to dragged node')
        return
      }
      // moved segment_obj to fixed_node
      fixed_node.connected_segments.push(segment_obj)
      updated_segment_objs.push(utils.clone(segment_obj))
      return
    })
    // delete the old node
    map.delete_node_data([dragged_node_id])
    // turn off the class
    map.sel.selectAll('.node-to-combine').classed('node-to-combine', false)
    // draw
    map.draw_everything()
    // return for undo
    return updated_segment_objs
  }
}

function _get_bezier_drag (map) {
  var move_bezier = function (reaction_id, segment_id, bez, bezier_id,
                              displacement) {
    var segment = map.reactions[reaction_id].segments[segment_id]
    segment[bez] = utils.c_plus_c(segment[bez], displacement)
    map.beziers[bezier_id].x = segment[bez].x
    map.beziers[bezier_id].y = segment[bez].y
  }
  var start_fn = function (d) {
    d.dragging = true
  }
  var drag_fn = function (d, displacement, total_displacement) {
    // draw
    move_bezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id,
                displacement)
    map.draw_these_reactions([d.reaction_id], false)
    map.draw_these_beziers([d.bezier_id])
  }
  var end_fn = function (d) {
    d.dragging = false
  }
  var undo_fn = function (d, displacement) {
    move_bezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id,
                utils.c_times_scalar(displacement, -1))
    map.draw_these_reactions([d.reaction_id], false)
    map.draw_these_beziers([d.bezier_id])
  }
  var redo_fn = function (d, displacement) {
    move_bezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id,
                displacement)
    map.draw_these_reactions([d.reaction_id], false)
    map.draw_these_beziers([d.bezier_id])
  }
  return this._get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn,
                                this.map.sel)
}

function _get_reaction_label_drag (map) {
  var move_label = function (reaction_id, displacement) {
    var reaction = map.reactions[reaction_id]
    reaction.label_x = reaction.label_x + displacement.x
    reaction.label_y = reaction.label_y + displacement.y
  }
  var start_fn = function (d) {
    // hide tooltips when drag starts
    map.callback_manager.run('hide_tooltip')
  }
  var drag_fn = function (d, displacement, total_displacement) {
    // draw
    move_label(d.reaction_id, displacement)
    map.draw_these_reactions([ d.reaction_id ])
  }
  var end_fn = function (d) {
  }
  var undo_fn = function (d, displacement) {
    move_label(d.reaction_id, utils.c_times_scalar(displacement, -1))
    map.draw_these_reactions([ d.reaction_id ])
  }
  var redo_fn = function (d, displacement) {
    move_label(d.reaction_id, displacement)
    map.draw_these_reactions([ d.reaction_id ])
  }
  return this._get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn,
                                this.map.sel)
}

function _get_node_label_drag (map) {
  var move_label = function (node_id, displacement) {
    var node = map.nodes[node_id]
    node.label_x = node.label_x + displacement.x
    node.label_y = node.label_y + displacement.y
  }
  var start_fn = function (d) {
    // hide tooltips when drag starts
    map.callback_manager.run('hide_tooltip')
  }
  var drag_fn = function (d, displacement, total_displacement) {
    // draw
    move_label(d.node_id, displacement)
    map.draw_these_nodes([ d.node_id ])
  }
  var end_fn = function (d) {
  }
  var undo_fn = function (d, displacement) {
    move_label(d.node_id, utils.c_times_scalar(displacement, -1))
    map.draw_these_nodes ([ d.node_id ])
  }
  var redo_fn = function (d, displacement) {
    move_label(d.node_id, displacement)
    map.draw_these_nodes([ d.node_id ])
  }
  return this._get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn,
                                this.map.sel)
}

/**
 * Make a generic drag behavior, with undo/redo.
 *
 * start_fn: function (d) Called at drag start.
 *
 * drag_fn: function (d, displacement, total_displacement) Called during drag.
 *
 * end_fn
 *
 * undo_fn
 *
 * redo_fn
 *
 * relative_to_selection: a d3 selection that the locations are calculated
 * against.
 *
 */
function _get_generic_drag (start_fn, drag_fn, end_fn, undo_fn, redo_fn,
                            relative_to_selection) {
  // define some variables
  var behavior = d3_drag()
  var total_displacement
  var undo_stack = this.undo_stack
  var rel = relative_to_selection.node()

  behavior.on('start', function (d) {
    this.dragging = true

    // silence other listeners
    d3_event.sourceEvent.stopPropagation()
    total_displacement = { x: 0, y: 0 }
    start_fn(d)
  }.bind(this))

  behavior.on('drag', function (d) {
    // update data
    var displacement = {
      x: d3_event.dx,
      y: d3_event.dy,
    }
    var location = {
      x: d3_mouse(rel)[0],
      y: d3_mouse(rel)[1],
    }

    // remember the displacement
    total_displacement = utils.c_plus_c(total_displacement, displacement)
    drag_fn(d, displacement, total_displacement, location)
  }.bind(this))

  behavior.on('end', function (d) {
    this.dragging = false

    // add to undo/redo stack
    // remember the displacement, dragged nodes, and reactions
    var saved_d = utils.clone(d)
    var saved_displacement = utils.clone(total_displacement) // BUG TODO this variable disappears!
    var saved_location = {
      x: d3_mouse(rel)[0],
      y: d3_mouse(rel)[1],
    }

    undo_stack.push(function () {
      // undo
      undo_fn(saved_d, saved_displacement, saved_location)
    }, function () {
      // redo
      redo_fn(saved_d, saved_displacement, saved_location)
    })
    end_fn(d)
  }.bind(this))

  return behavior
}

/** Make a generic drag behavior, with undo/redo. Supplies angles in place of
 * displacements.
 *
 * start_fn: function (d) Called at drag start.
 *
 * drag_fn: function (d, displacement, total_displacement) Called during drag.
 *
 * end_fn:
 *
 * undo_fn:
 *
 * redo_fn:
 *
 * get_center:
 *
 * relative_to_selection: a d3 selection that the locations are calculated
 * against.
 *
 */
function _get_generic_angular_drag (start_fn, drag_fn, end_fn, undo_fn, redo_fn,
                                   get_center, relative_to_selection) {

  // define some variables
  var behavior = d3_drag()
  var total_angle
  var undo_stack = this.undo_stack
  var rel = relative_to_selection.node()

  behavior.on('start', function (d) {
    this.dragging = true

    // silence other listeners
    d3_event.sourceEvent.stopPropagation()
    total_angle = 0
    start_fn(d)
  }.bind(this))

  behavior.on('drag', function (d) {
    // update data
    var displacement = {
      x: d3_event.dx,
      y: d3_event.dy,
    }
    var location = {
      x: d3_mouse(rel)[0],
      y: d3_mouse(rel)[1],
    }
    var center = get_center()
    var angle = utils.angle_for_event(displacement, location, center)
    // remember the displacement
    total_angle = total_angle + angle
    drag_fn(d, angle, total_angle, center)
  }.bind(this))

  behavior.on('end', function (d) {
    this.dragging = false

    // add to undo/redo stack
    // remember the displacement, dragged nodes, and reactions
    var saved_d = utils.clone(d)
    var saved_angle = total_angle
    var saved_center = utils.clone(get_center())

    undo_stack.push(function () {
      // undo
      undo_fn(saved_d, saved_angle, saved_center)
    }, function () {
      // redo
      redo_fn(saved_d, saved_angle, saved_center)
    })
    end_fn(d)
  }.bind(this))

  return behavior
}
