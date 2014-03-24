define(["metabolic-map/utils", "lib/d3"], function(utils, d3) {
    return { setup_containers: setup_containers,
	     draw: draw,
	     reset: reset,
	     draw_specific_reactions: draw_specific_reactions,
	     draw_specific_nodes: draw_specific_nodes
	   };

    // definitions
    function setup_containers(sel) {
        sel.append('g')
            .attr('id', 'membranes');
        sel.append('g')
            .attr('id', 'reactions');
        sel.append('g')
            .attr('id', 'nodes');
        sel.append('g')
            .attr('id', 'text-labels');
    }
    function draw(membranes, reactions, nodes, text_labels, scale,
		  show_beziers, arrow_displacement, defs, arrowheads,
		  default_reaction_color, has_flux, has_node_data, node_data_style,
		  node_click_fn, node_drag_behavior,
		  bezier_drag_behavior) {
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
								    has_flux,
								    bezier_drag_behavior); });

	utils.draw_an_object('#nodes', '.node', nodes, 'node_id', 
			     function(sel) { return create_node(sel, scale, nodes, reactions,
								node_click_fn, node_drag_behavior); },
			     function(sel) { return update_node(sel, scale, has_node_data, node_data_style); });

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
				     has_flux, bezier_drag_behavior) {
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
							has_flux,
							bezier_drag_behavior); });

        // exit
        sel.exit();
    }

    function draw_specific_nodes(node_ids, nodes, reactions, scale, node_data, node_data_style,
				 click_fn, drag_behavior) {
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
							    click_fn, drag_behavior); });

        // update: update when necessary
        sel.call(function(sel) { return update_node(sel, scale, node_data, node_data_style); });

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
			     default_reaction_color, has_flux, bezier_drag_behavior) {
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
				  default_reaction_color, has_flux, bezier_drag_behavior);

	});

        // old segments
        sel.exit().remove();
    }

    function create_reaction_label(sel) {
        /* Draw reaction label for selection.
	 */
        sel.append('text')
            .attr('class', 'reaction-label label')
            .attr('pointer-events', 'none');
    }

    function update_reaction_label(sel, scale, has_flux) {
	var decimal_format = d3.format('.4g');
	sel.text(function(d) { 
            var t = d.abbreviation;
            if (d.flux) t += " ("+decimal_format(d.flux)+")";
            else if (has_flux) t += " (0)";
            return t;
	}).attr('transform', function(d) {
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
    }
    
    function update_segment(update_selection, scale, drawn_nodes, show_beziers, 
			    arrow_displacement, defs, arrowheads, default_reaction_color,
			    has_flux, bezier_drag_behavior) {
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
		    start = displaced_coords(arrow_displacement, start, b1, 'start');
		}
		if (end['node_type']=='metabolite') {
		    end = displaced_coords(arrow_displacement, b2, end, 'end');
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
		    var beziers = [],
			reaction_id = this.parentNode.parentNode.parentNode.__data__.reaction_id,
			segment_id = this.parentNode.parentNode.__data__.segment_id;
		    //TODO fix; this is a bit of a hack
		    if (d.b1!=null && d.b1.x!=null && d.b1.y!=null)
			beziers.push({bezier: 1,
				      x: d.b1.x,
				      y: d.b1.y,
				      reaction_id: reaction_id,
				      segment_id: segment_id });
		    if (d.b2!=null && d.b2.x!=null && d.b2.y!=null)
			beziers.push({bezier: 2,
				      x: d.b2.x,
				      y: d.b2.y,
				      reaction_id: reaction_id,
				      segment_id: segment_id });
		    return beziers;
		}, function(d) { return d.bezier; });
	bez.enter().call(function(sel) {
	    return create_bezier(sel, bezier_drag_behavior);
	});
	// update bezier points
	bez.call(function(sel) { return update_bezier(sel, show_beziers); });
	// remove
	bez.exit().remove();

	function create_bezier(enter_selection, drag_behavior) {
	    enter_selection.append('circle')
	    	.attr('class', function(d) { return 'bezier bezier'+d.bezier; })
	    	.style('stroke-width', String(scale.size(1))+'px')	
    		.attr('r', String(scale.size(5))+'px')
		.on("mouseover", function(d) {
		    d3.select(this).style('stroke-width', String(scale.size(3))+'px');
		})
		.on("mouseout", function(d) {
		    d3.select(this).style('stroke-width', String(scale.size(1))+'px');
		})
		.call(drag_behavior);
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
			 click_fn, drag_behavior) {
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
            .call(drag_behavior)
            .on("click", click_fn);

        g.append('text')
            .attr('class', 'node-label label')
            .attr('pointer-events', 'none');
    }

    function update_node(update_selection, scale, has_node_data, node_data_style) {
        // update circle and label location
        var mg = update_selection
                .select('.node-circle')
                .attr('transform', function(d) {
                    return 'translate('+scale.x(d.x)+','+scale.y(d.y)+')';
                })
		.attr('r', function(d) {
		    if (d.node_type == 'metabolite') {
			if (has_node_data && node_data_style.indexOf('Size')!==1) {
			    return scale.size(scale.node_size(d.data));
			} else {
			    return scale.size(d.node_is_primary ? 15 : 10); 
			}
		    } else {
			return scale.size(5);
		    }
		})
		.style('fill', function(d) {
		    if (d.node_type=='metabolite') {
			if (has_node_data && node_data_style.indexOf('Color')!==1) {
			    return scale.node_color(d.data);
			} else {
			    return 'rgb(224, 134, 91)';
			}
		    }
		});

        update_selection
            .select('.node-label')
            .attr('transform', function(d) {
                return 'translate('+scale.x(d.label_x)+','+scale.y(d.label_y)+')';
            })
            .style("font-size", function(d) {
		return String(scale.size(20))+"px";
            })
            .text(function(d) {	
		var decimal_format = d3.format('.4g');
		var t = d.bigg_id_compartmentalized;
		if (d.data) t += " ("+decimal_format(d.data)+")";
		else if (has_node_data) t += " (0)";
		return t;
	    });
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
