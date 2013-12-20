define(["metabolic-map/utils", "lib/d3"], function(utils, d3) {
    return { draw: draw,
	     reset: reset,
	     draw_specific_reactions: draw_specific_reactions,
	     draw_specific_nodes: draw_specific_nodes
	   };

    // definitions
    function draw(membranes, reactions, nodes, text_labels, scale,
		  show_beziers, arrow_displacement, defs, arrowheads,
		  default_reaction_color, has_flux, 
		  node_click_fn, node_drag_fn, node_dragstart_fn) {
        /** Draw the reactions and membranes
         */

	utils.draw_an_array('#membranes' ,'.membrane', membranes, create_membrane, 
			     function(sel) { return update_membrane(sel, scale); });

	utils.draw_an_object('#reactions', '.reaction', reactions,
			     'reaction_id', create_reaction, 
			     function(sel) { return update_reaction(sel, scale, 
								    nodes,
								    show_beziers, 
								    arrow_displacement,
								    defs, arrowheads,
								    default_reaction_color,
								    has_flux); });

	utils.draw_an_object('#nodes', '.node', nodes, 'node_id', 
			     function(sel) { return create_node(sel, scale, nodes, reactions,
								node_click_fn, node_drag_fn, node_dragstart_fn); },
			     function(sel) { return update_node(sel, scale); });

	utils.draw_an_object('#text-labels', '.text-label', text_labels,
			     'text_label_id', create_text_label, 
			     function(sel) { return update_text_label(sel, scale); });
    }
    function reset() {
	d3.select('#membranes')
            .selectAll('.membrane')
            .remove();
	d3.select('#reactions')
            .selectAll('.reaction')
            .remove();
	d3.select('#nodes')
            .selectAll('.node')
            .remove();
	d3.select('#text-labels')
            .selectAll('.text-label')
            .remove();
    }

    function draw_specific_reactions(reaction_ids, reactions, nodes, scale, show_beziers,
				     arrow_displacement, defs, arrowheads, default_reaction_color, 
				     has_flux) {
        // find reactions for reaction_ids
        var reaction_subset = {},
            i = -1;
        while (++i<reaction_ids.length) {
            reaction_subset[reaction_ids[i]] = utils.clone(reactions[reaction_ids[i]]);
        }
        if (reaction_ids.length != Object.keys(reaction_subset).length) {
            console.warn('did not find correct reaction subset');
        }

        // generate reactions for o.drawn_reactions
        // assure constancy with cobra_id
        var sel = d3.select('#reactions')
                .selectAll('.reaction')
                .data(utils.make_array(reaction_subset, 'reaction_id'),
                      function(d) { return d.reaction_id; });

        // enter: generate and place reaction
        sel.enter().call(create_reaction);

        // update: update when necessary
        sel.call(function(sel) { return update_reaction(sel, scale, 
							nodes,
							show_beziers, 
							arrow_displacement,
							defs, arrowheads,
							default_reaction_color,
							has_flux); });

        // exit
        sel.exit();
    }

    function draw_specific_nodes(node_ids, nodes, reactions, scale, click_fn, drag_fn, dragstart_fn) {
        // find nodes for node_ids
        var node_subset = {},
            i = -1;
        while (++i<node_ids.length) {
            node_subset[node_ids[i]] = utils.clone(nodes[node_ids[i]]);
        }
        if (node_ids.length != Object.keys(node_subset).length) {
            console.warn('did not find correct node subset');
        }

        // generate nodes for o.drawn_nodes
        // assure constancy with cobra_id
        var sel = d3.select('#nodes')
                .selectAll('.node')
                .data(utils.make_array(node_subset, 'node_id'),
                      function(d) { return d.node_id; });

        // enter: generate and place node
        sel.enter().call(function(sel) { return create_node(sel, scale, nodes, reactions, 
							    click_fn, drag_fn, dragstart_fn); });

        // update: update when necessary
        sel.call(function(sel) { return update_node(sel, scale); });

        // exit
        sel.exit();
    }

    function create_membrane(enter_selection) {
	enter_selection.append('rect')
	    .attr('class', 'membrane');
    }

    function update_membrane(update_selection, scale) {
        update_selection
            .attr("width", function(d){ return scale.x_size(d.width); })
            .attr("height", function(d){ return scale.y_size(d.height); })
            .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";})
            .style("stroke-width", function(d) { return scale.size(10); })
            .attr('rx', function(d){ return scale.x_size(20); })
            .attr('ry', function(d){ return scale.x_size(20); });
    }

    function create_reaction(enter_selection) {
        // attributes for new reaction group

        var t = enter_selection.append('g')
                .attr('id', function(d) { return d.reaction_id; })
                .attr('class', 'reaction')
                .call(create_reaction_label);
        return;
    }

    function update_reaction(update_selection, scale, drawn_nodes, show_beziers, arrow_displacement, defs, arrowheads,
			     default_reaction_color, has_flux) {
        // update reaction label
        update_selection.select('.reaction-label')
            .call(function(sel) { return update_reaction_label(sel, scale); });

        // select segments
        var sel = update_selection
                .selectAll('.segment-group')
                .data(function(d) {
                    return utils.make_array(d.segments, 'segment_id');
                }, function(d) { return d.segment_id; });

        // new segments
        sel.enter().call(create_segment);

        // update segments
        sel.call(function(sel) { 
	    return update_segment(sel, scale, drawn_nodes, show_beziers, arrow_displacement, defs, arrowheads, 
				  default_reaction_color, has_flux);

	});

        // old segments
        sel.exit().remove();
    }

    function create_reaction_label(sel) {
        /* Draw reaction label for selection.
	 */
        sel.append('text')
	    .text(function(d) { return d.abbreviation; })
            .attr('class', 'reaction-label label')
            .attr('pointer-events', 'none');
    }

    function update_reaction_label(sel, scale) {
	sel.attr('transform', function(d) {
            return 'translate('+scale.x(d.label_x)+','+scale.y(d.label_y)+')';
	}).style("font-size", function(d) {
	    return String(scale.size(30))+"px";
        });
    }

    function create_segment(enter_selection) {
        // create segments
        var g = enter_selection
                .append('g')
                .attr('class', 'segment-group')
                .attr('id', function(d) { return d.segment_id; });

        // create reaction arrow
        g.append('path')
            .attr('class', 'segment');

	g.append('g')
	    .attr('class', 'beziers');

	// THE FOLLOWING IS ALL TERRIBLE


	// g.append('circle')
	// 	.attr('class', 'bezier bezier1')
	// 	.style('stroke-width', String(o.scale.size(1))+'px') 
	// 	.call(d3.behavior.drag()
	// 	      .on("dragstart", drag_silence)
	// 	      .on("drag", drag_move_1))		
	// 	.on("mouseover", function(d) {
	// 	    d3.select(this).style('stroke-width', String(o.scale.size(2))+'px');
	// 	})
	// 	.on("mouseout", function(d) {
	// 	    d3.select(this).style('stroke-width', String(o.scale.size(1))+'px');
	// 	});

	// // TODO fix this hack
	// g.append('circle')
	// 	.attr('class', 'bezier bezier2')
	// 	.style('stroke-width', String(o.scale.size(1))+'px') 
	// 	.call(d3.behavior.drag()
	// 	      .on("dragstart", drag_silence)
	// 	      .on("drag", drag_move_2))
	// 	.on("mouseover", function(d) {
	// 	    d3.select(this).style('stroke-width', String(o.scale.size(2))+'px');
	// 	})
	// 	.on("mouseout", function(d) {
	// 	    d3.select(this).style('stroke-width', String(o.scale.size(1))+'px');
	// 	});

	// // definitions
	// function drag_silence() {
	// 	// silence other listeners
        //     d3.event.sourceEvent.stopPropagation();
	// }
	// function drag_move_1() { 
	// 	// TODO fix this hack too
	// 	var segment_id = d3.select(this.parentNode.parentNode).datum().segment_id,
	// 	    reaction_id = d3.select(this.parentNode.parentNode.parentNode).datum().reaction_id;
	// 	var seg = o.drawn_reactions[reaction_id].segments[segment_id],
	// 	    dx = o.scale.x_size.invert(d3.event.dx),
	// 	    dy = o.scale.y_size.invert(d3.event.dy);
	// 	seg.b1.x = seg.b1.x + dx;
	// 	seg.b1.y = seg.b1.y + dy;
	// 	draw_specific_reactions([reaction_id]);
	// }
	// function drag_move_2() { 
	// 	// TODO fix this hack too
	// 	var segment_id = d3.select(this.parentNode.parentNode).datum().segment_id,
	// 	    reaction_id = d3.select(this.parentNode.parentNode.parentNode).datum().reaction_id;
	// 	var seg = o.drawn_reactions[reaction_id].segments[segment_id],
	// 	    dx = o.scale.x_size.invert(d3.event.dx),
	// 	    dy = o.scale.y_size.invert(d3.event.dy);
	// 	seg.b2.x = seg.b2.x + dx;
	// 	seg.b2.y = seg.b2.y + dy;
	// 	draw_specific_reactions([reaction_id]);
	// }
    }
    
    function update_segment(update_selection, scale, drawn_nodes, show_beziers, 
			    arrow_displacement, defs, arrowheads, default_reaction_color,
			    has_flux) {
        // update segment attributes
        // update arrows
        update_selection
            .selectAll('.segment')
            .datum(function() {
                return this.parentNode.__data__;
            })
            .attr('d', function(d) {
		if (d.from_node_id==null || d.to_node_id==null)
		    return null;
		var start = drawn_nodes[d.from_node_id],
		    end = drawn_nodes[d.to_node_id],
		    b1 = d.b1,
		    b2 = d.b2;
		// if metabolite, then displace the arrow
		if (start['node_type']=='metabolite') {
		    start = displaced_coords(arrow_displacement, start, end, 'start');
		    b1 = displaced_coords(arrow_displacement, b1, end, 'start');
		}
		if (end['node_type']=='metabolite') {
		    end = displaced_coords(arrow_displacement, start, end, 'end');
		    b2 = displaced_coords(arrow_displacement, start, b2, 'end');
		}
		if (d.b1==null || d.b2==null) {
		    return 'M'+scale.x(start.x)+','+scale.y(start.y)+' '+
			scale.x(end.x)+','+scale.y(end.y);
		} else {
		    return 'M'+scale.x(start.x)+','+scale.y(start.y)+
                        'C'+scale.x(b1.x)+','+scale.y(b1.y)+' '+
                        scale.x(b2.x)+','+scale.y(b2.y)+' '+
                        scale.x(end.x)+','+scale.y(end.y);
		}
            }) // TODO replace with d3.curve or equivalent
            .attr("marker-start", function (d) {
		var start = drawn_nodes[d.from_node_id];
		if (start['node_type']=='metabolite') {
		    var c = d.flux ? scale.flux_color(Math.abs(d.flux)) :
			    default_reaction_color;
		    // generate arrowhead for specific color
		    var arrow_id = generate_arrowhead_for_color(defs, arrowheads, c, false);
		    return "url(#" + arrow_id + ")";
		} else { return null; };
            })     
	    .attr("marker-end", function (d) {
		var end = drawn_nodes[d.to_node_id];
		if (end['node_type']=='metabolite') {
		    var c = d.flux ? scale.flux_color(Math.abs(d.flux)) :
			    default_reaction_color;
		    // generate arrowhead for specific color
		    var arrow_id = generate_arrowhead_for_color(defs, arrowheads, c, true);
		    return "url(#" + arrow_id + ")";
		} else { return null; };
            })
            .style('stroke', function(d) {
		if (has_flux) 
		    return d.flux ? scale.flux_color(Math.abs(d.flux)) : scale.flux_color(0);
		else
		    return default_reaction_color;
	    })
	    .style('stroke-width', function(d) {
		return d.flux ? scale.size(scale.flux(Math.abs(d.flux))) :
		    scale.size(scale.flux(1));
            });

	// new bezier points
	var bez = update_selection.select('.beziers')
		.selectAll('.bezier')
		.data(function(d) {
		    var beziers = [];
		    if (d.b1!=null && d.b1.x!=null && d.b1.y!=null)
			beziers.push({'bezier': 1, x:d.b1.x, y:d.b1.y});
		    if (d.b2!=null && d.b2.x!=null && d.b2.y!=null)
			beziers.push({'bezier': 2, x:d.b2.x, y:d.b2.y});
		    return beziers;
		}, function(d) { return d.bezier; });
	bez.enter().call(create_bezier);
	// update bezier points
	bez.call(function(sel) { return update_bezier(sel, show_beziers); });
	// remove
	bez.exit().remove();

	function create_bezier(enter_selection) {
	    enter_selection.append('circle')
	    	.attr('class', function(d) { return 'bezier bezier'+d.bezier; })
	    	.style('stroke-width', String(scale.size(1))+'px')	
    		.attr('r', String(scale.size(5))+'px');
	}
	function update_bezier(update_selection, show_beziers) {
	    if (show_beziers) {
	    	// draw bezier points
		update_selection
		    .attr('visibility', 'visible')
		    .attr('transform', function(d) {
	    		if (d.x==null || d.y==null) return ""; 
			return 'translate('+scale.x(d.x)+','+scale.y(d.y)+')';
		    });
	    } else {
	    	update_selection.attr('visibility', 'hidden');
	    }
	}
    }

    function create_node(enter_selection, scale, drawn_nodes, drawn_reactions, 
			 click_fn, drag_fn, dragstart_fn) {
        // create nodes
        var g = enter_selection
                .append('g')
                .attr('class', 'node')
                .attr('id', function(d) { return d.node_id; });

        // create metabolite circle and label
        g.append('circle')
	    .attr('class', function(d) {
		if (d.node_type=='metabolite') return 'node-circle metabolite-circle';
		else return 'node-circle';
	    })		
            .style('stroke-width', String(scale.size(2))+'px')
	    .on("mouseover", function(d) {
		d3.select(this).style('stroke-width', String(scale.size(3))+'px');
	    })
	    .on("mouseout", function(d) {
		d3.select(this).style('stroke-width', String(scale.size(2))+'px');
	    })
            .call(d3.behavior.drag()
                  .on("dragstart", dragstart_fn)
                  .on("drag", drag_fn))
            .on("click", click_fn);

        g.append('text')
            .attr('class', 'node-label label')
            .text(function(d) { return d.metabolite_simpheny_id; })
            .attr('pointer-events', 'none');
    }

    function update_node(update_selection, scale) {
        // update circle and label location
        var mg = update_selection
                .select('.node-circle')
                .attr('transform', function(d) {
                    return 'translate('+scale.x(d.x)+','+scale.y(d.y)+')';
                })
		.attr('r', function(d) { 
		    if (d.node_type!='metabolite') return scale.size(5);
		    else return scale.size(d.node_is_primary ? 15 : 10); 
		});
                // .classed('selected', function(d) {
		//     if (is_sel(d)) return true;
		//     return false;
                // });

        update_selection
            .select('.node-label')
            .attr('transform', function(d) {
                return 'translate('+scale.x(d.label_x)+','+scale.y(d.label_y)+')';
            })
            .style("font-size", function(d) {
		return String(scale.size(20))+"px";
            });

	// definitions
        // function is_sel(d) {	//FIX
        //     if (d.node_id==o.selected_node.node_id &&
        //         o.selected_node.is_selected)
        //         return true;
        //     return false;
        // };
    }

    function create_text_label(enter_selection) {
	enter_selection.append('text')
	    .attr('class', 'text-label label')
	    .text(function(d) { return d.text; });
    }

    function update_text_label(update_selection, scale) {
        update_selection
            .attr("transform", function(d) { return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
    }

    function displaced_coords(reaction_arrow_displacement, start, end, displace) {
	var length = reaction_arrow_displacement,
	    hyp = utils.distance(start, end),
	    new_x, new_y;
	if (displace=='start') {
	    new_x = start.x + length * (end.x - start.x) / hyp,
	    new_y = start.y + length * (end.y - start.y) / hyp;
	} else if (displace=='end') {
	    new_x = end.x - length * (end.x - start.x) / hyp,
	    new_y = end.y - length * (end.y - start.y) / hyp;
	} else { console.error('bad displace value: ' + displace); }
	return {x: new_x, y: new_y};
    }

    function generate_arrowhead_for_color(defs, arrowheads_generated, color, is_end) {

	var pref = is_end ? 'start-' : 'end-';

        var id = String(color).replace('#', pref);
        if (arrowheads_generated.indexOf(id) < 0) {
            arrowheads_generated.push(id);

            var markerWidth = 5,
                markerHeight = 5,
                // cRadius = 0, // play with the cRadius value
                // refX = cRadius + (markerWidth * 2),
                // refY = -Math.sqrt(cRadius),
                // drSub = cRadius + refY;
                refX,
                refY = markerWidth/2,
                d;

            if (is_end) refX = 0;
            else        refX = markerHeight;
            if (is_end) d = 'M0,0 V'+markerWidth+' L'+markerHeight/2+','+markerWidth/2+' Z';
            else        d = 'M'+markerHeight+',0 V'+markerWidth+' L'+(markerHeight/2)+','+markerWidth/2+' Z';

            // make the marker
            defs.append("svg:marker")
                .attr("id", id)
                .attr("class", "arrowhead")
                .attr("refX", refX)
                .attr("refY", refY)
                .attr("markerWidth", markerWidth)
                .attr("markerHeight", markerHeight)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", d)
                .style("fill", color);
        }
        return id;
    }

});
