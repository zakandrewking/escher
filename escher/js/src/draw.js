"use strict";

define(["utils"], function(utils) {
    return { create_reaction: create_reaction,
	     update_reaction: update_reaction,
	     create_node: create_node,
	     update_node: update_node,
	     create_text_label: create_text_label,
	     update_text_label: update_text_label,
	     create_membrane: create_membrane,
	     update_membrane: update_membrane
	   };

    // definitions
    function turn_off_drag(sel) {
	sel.on('mousedown.drag', null);
	sel.on('touchstart.drag', null);
    }
    
    function create_membrane(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);
	enter_selection.append('rect')
	    .attr('class', 'membrane');
    }

    function update_membrane(update_selection, scale) {
	utils.check_undefined(arguments, ['enter_selection', 'scale']);
        update_selection
            .attr("width", function(d){ return scale.x_size(d.width); })
            .attr("height", function(d){ return scale.y_size(d.height); })
            .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";})
            .style("stroke-width", function(d) { return scale.size(10); })
            .attr('rx', function(d){ return scale.x_size(20); })
            .attr('ry', function(d){ return scale.x_size(20); });
    }

    function create_reaction(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);
        // attributes for new reaction group

        var t = enter_selection.append('g')
                .attr('id', function(d) { return d.reaction_id; })
                .attr('class', 'reaction')
                .call(create_reaction_label);
        return;
    }

    function update_reaction(update_selection, scale, drawn_nodes, show_beziers,
			     defs, arrowheads,
			     default_reaction_color, has_reaction_data,
			     reaction_data_styles,
			     bezier_drag_behavior, label_drag_behavior) {
	utils.check_undefined(arguments,
			      ['update_selection', 'scale', 'drawn_nodes', 'show_beziers',
			       'defs', 'arrowheads',
			       'default_reaction_color', 'has_reaction_data',
			       'reaction_data_styles',
			       'bezier_drag_behavior', 'label_drag_behavior']);

        // update reaction label
        update_selection.select('.reaction-label')
            .call(function(sel) { return update_reaction_label(sel, scale, has_reaction_data, 
							       reaction_data_styles,
							       label_drag_behavior); });

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
	    return update_segment(sel, scale, drawn_nodes, show_beziers, defs,
				  arrowheads, default_reaction_color,
				  has_reaction_data, reaction_data_styles,
				  bezier_drag_behavior);
	});

        // old segments
        sel.exit().remove();
    }

    function create_reaction_label(sel) {
	utils.check_undefined(arguments, ['sel']);
        /* Draw reaction label for selection.
	 */
        sel.append('text')
            .attr('class', 'reaction-label label')
	    .style('cursor', 'default');
    }

    function update_reaction_label(sel, scale, has_reaction_data, 
				   reaction_data_styles,
				   label_drag_behavior) {
	utils.check_undefined(arguments, ['sel', 'scale',
					  'has_reaction_data',
					  'reaction_data_styles',
					  'label_drag_behavior']);
	
	var decimal_format = d3.format('.4g');
	sel.text(function(d) { 
            var t = d.bigg_id;
            if (d.data!==null) t += " ("+decimal_format(d.data)+")";
            else if (has_reaction_data) t += " (0)";
            return t;
	}).attr('transform', function(d) {
            return 'translate('+scale.x(d.label_x)+','+scale.y(d.label_y)+')';
	}).style("font-size", function(d) {
	    return String(scale.size(30))+"px";
        })
	    .call(turn_off_drag)
	    .call(label_drag_behavior);
    }

    function create_segment(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);

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
			    defs, arrowheads, default_reaction_color,
			    has_reaction_data, reaction_data_styles,
			    bezier_drag_behavior) {
	utils.check_undefined(arguments, ['update_selection', 'scale', 'drawn_nodes',
					  'show_beziers', 'defs',
					  'arrowheads', 'default_reaction_color',
					  'has_reaction_data',
					  'reaction_data_styles',
					  'bezier_drag_behavior']);

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
		var get_disp = function(reversibility, coefficient) {
		    return (reversibility || coefficient > 0) ? 32 : 20;
		};
		if (start['node_type']=='metabolite') {
		    var disp = get_disp(d.reversibility, d.from_node_coefficient);
		    start = displaced_coords(disp, start, b1, 'start');
		}
		if (end['node_type']=='metabolite') {
		    var disp = get_disp(d.reversibility, d.to_node_coefficient);
		    end = displaced_coords(disp, b2, end, 'end');
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
            })
            .attr("marker-start", function (d) {
		var start = drawn_nodes[d.from_node_id];
		if (start.node_type=='metabolite' && (d.reversibility || d.from_node_coefficient > 0)) {
		    var c = d.data ? scale.reaction_color(Math.abs(d.data)) :
			    default_reaction_color;
		    // generate arrowhead for specific color
		    var arrow_id = generate_arrowhead_for_color(defs, arrowheads, c, false);
		    return "url(#" + arrow_id + ")";
		} else { return null; };
            })     
	    .attr("marker-end", function (d) {
		var end = drawn_nodes[d.to_node_id];
		if (end.node_type=='metabolite' && (d.reversibility || d.to_node_coefficient > 0)) {
		    var c = d.data ? scale.reaction_color(Math.abs(d.data)) :
			    default_reaction_color;
		    // generate arrowhead for specific color
		    var arrow_id = generate_arrowhead_for_color(defs, arrowheads, c, true);
		    return "url(#" + arrow_id + ")";
		} else { return null; };
            })
            .style('stroke', function(d) {
		if (has_reaction_data) 
		    return d.data!==null ? scale.reaction_color(Math.abs(d.data)) : scale.reaction_color(0);
		else
		    return default_reaction_color;
	    })
	    .style('stroke-width', function(d) {
	    	return d.data!==null ? scale.size(scale.reaction_size(Math.abs(d.data))) :
	    	    scale.size(scale.reaction_size(1));
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
	    return create_bezier(sel);
	});
	// update bezier points
	bez.call(function(sel) { return update_bezier(sel, show_beziers, bezier_drag_behavior); });
	// remove
	bez.exit().remove();

	function create_bezier(enter_selection) {
	    utils.check_undefined(arguments, ['enter_selection']);

	    enter_selection.append('circle')
	    	.attr('class', function(d) { return 'bezier bezier'+d.bezier; })
	    	.style('stroke-width', String(scale.size(1))+'px')	
    		.attr('r', String(scale.size(5))+'px')
		.on("mouseover", function(d) {
		    d3.select(this).style('stroke-width', String(scale.size(3))+'px');
		})
		.on("mouseout", function(d) {
		    d3.select(this).style('stroke-width', String(scale.size(1))+'px');
		});
	}
	function update_bezier(update_selection, show_beziers, drag_behavior) {
	    utils.check_undefined(arguments, ['update_selection', 'show_beziers', 'drag_behavior']);
	    
	    update_selection
		.call(turn_off_drag)
		.call(drag_behavior);
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

    function create_node(enter_selection, scale, drawn_nodes, drawn_reactions) {
	utils.check_undefined(arguments,
			      ['enter_selection', 'scale', 'drawn_nodes',
			       'drawn_reactions']);

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
	    });

        g.filter(function(d) { return d.node_type=='metabolite'; })
	    .append('text')
	    .attr('class', 'node-label label')
	    .style('cursor', 'default');
    }

    function update_node(update_selection, scale, has_metabolite_data, metabolite_data_style,
			 click_fn, drag_behavior, label_drag_behavior) {
	utils.check_undefined(arguments,
			      ['update_selection', 'scale', 'has_metabolite_data',
			       'metabolite_data_style', 'click_fn',
			       'drag_behavior', 'label_drag_behavior']);

        // update circle and label location
        var mg = update_selection
                .select('.node-circle')
                .attr('transform', function(d) {
                    return 'translate('+scale.x(d.x)+','+scale.y(d.y)+')';
                })
		.attr('r', function(d) {
		    if (d.node_type == 'metabolite') {
			if (has_metabolite_data && metabolite_data_style.indexOf('Size')!==-1) {
			    return scale.size(scale.metabolite_size(d.data!==null ? d.data : 0));
			} else {
			    return scale.size(d.node_is_primary ? 15 : 10); 
			}
		    } else {
			return scale.size(5);
		    }
		})
		.style('fill', function(d) {
		    if (d.node_type=='metabolite') {
			if (has_metabolite_data && metabolite_data_style.indexOf('Color')!==-1) {
			    return scale.metabolite_color(d.data!==null ? d.data : 0);
			} else {
			    return 'rgb(224, 134, 91)';
			}
		    }
		})
		.call(turn_off_drag)
		.call(drag_behavior)
		.on("click", click_fn);

        update_selection
            .select('.node-label')
            .attr('transform', function(d) {
                return 'translate('+scale.x(d.label_x)+','+scale.y(d.label_y)+')';
            })
            .style("font-size", function(d) {
		return String(scale.size(20))+"px";
            })
            .text(function(d) {	
		var decimal_format = d3.format('.4g'),
		    t;
		if (d.compartment_id===null) t = d.bigg_id;
		else t = utils.compartmentalize(d.bigg_id, d.compartment_id);
		if (has_metabolite_data) {
		    if (d.data!==null) t += " ("+decimal_format(d.data)+")";
		    else if (has_metabolite_data) t += " (0)";
		}
		return t;
	    })
	    .call(turn_off_drag)
	    .call(label_drag_behavior);
    }

    function create_text_label(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);

	enter_selection.append('text')
	    .attr('class', 'text-label label')
	    .style('cursor', 'default')
	    .text(function(d) { return d.text; });
    }

    function update_text_label(update_selection, scale, label_click, label_drag_behavior) {
	utils.check_undefined(arguments, ['update_selection', 'scale', 'label_click', 'label_drag_behavior']);

        update_selection
            .attr("transform", function(d) { return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";})
	    .on('click', label_click)
	    .call(turn_off_drag)
	    .call(label_drag_behavior);
    }

    function displaced_coords(reaction_arrow_displacement, start, end, displace) {
	utils.check_undefined(arguments, ['reaction_arrow_displacement', 'start', 'end', 'displace']);

	var length = reaction_arrow_displacement,
	    hyp = utils.distance(start, end),
	    new_x, new_y;
	if (!length || !hyp) console.error('Bad value');
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
	utils.check_undefined(arguments, ['defs', 'arrowheads_generated', 'color', 'is_end']);

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

            if (is_end) refX = 0.5;
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
