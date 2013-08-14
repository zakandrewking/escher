var Builder = function() {

    // TODO
    // connected node object
    // only display each node once
    // why aren't some nodes appearing as selected?
    // BRANCHING!
    // make object oriented
    //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
    
    var m = {};
    m.version = 0.2;
    m.g = [];
    m.selected_node = {'reaction_id': '',
                       'metabolite_id': '',
                       'direction': '',
                       'is_selected': false};
    m.drawn_reactions = {};
    m.arrowheads_generated = [];
    m.cobra_reactions = {};
    m.list_strings = [];
    m.scale = {};
    m.scale.flux_color = d3.scale.linear()
        .domain([0, 20])
        .range(["blue", "red"]);
    m.default_reaction_color = '#eeeeee';
    m.decimal_format = d3.format('.1f');
    m.window_translate = {'x': 0, 'y': 0};
    m.window_scale = 1;

    // -----------------------------------------------------------------------------------
    // SETUP

    m.setup_container = function(selection, width, height) {
        d3.select("#svg-container").remove();

        var zoom = function(a, b) {
            m.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            m.window_translate = {'x': d3.event.translate[0], 'y': d3.event.translate[1]};
            m.window_scale = d3.event.scale;
            m.place_reaction_input(m.coords_for_selected_metabolite());
        };

        m.svg = selection.append("div").attr("id","svg-container")
                .attr("style", "width:"+width+"px;height:"+height+"px;margin:0px auto")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

        // set up reaction for zooming and dragging
        var mouse_node = m.svg.append('rect')
                .attr("width", width)
                .attr("height", height)
                .attr('style', 'visibility: hidden')
                .attr('pointer-events', 'all');
        // .on('click', function () {
        // show_input_here(d3.mouse(this));
        // });

        // apply zoom behavior
	m.zoom = d3.behavior.zoom().scaleExtent([0.05, 15]).on("zoom", zoom);
        var return_g = m.svg
		.call(m.zoom)
                .append('g');
        m.g = return_g;

        return return_g;
    };

    m.load_model_and_list = function(coords, callback_function) {
        //  model = {
        //      reactions: {
        //          cobra_id_1: {
        //            metabolites: { cobra_id_2: { coefficient: }, ... }
        //          }, ...
        //      }
        //  }

        // Object.keys(myArray).length for length of the object (no good in IE8)
        // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation

        d3.json("data/maps/cobra_model_0.2.json", function(error, model) {
            if (error) console.warn(error);
            m.cobra_reactions = model.reactions;

            // load list data
            d3.json("data/flux/flux-wt-pFBA.json", function(error, json) {
                if (error) console.warn(error);

		// sort by flux value
		var sorted = [];
		for (var flux_reaction_id in json) {
		    // fix reaction ids
		    sorted.push([flux_reaction_id.replace('(', '_').replace(')', ''),
				 parseFloat(json[flux_reaction_id])]);
		}
		sorted.sort(function(a,b) { return Math.abs(b[1]) - Math.abs(a[1]); });
		var i=-1;
		while (++i < sorted.length) {
                    // update strings for reaction list
                    m.list_strings.push({ label: sorted[i][0]+" -- "+sorted[i][1],
                                          value: sorted[i][0] });

		    // update model with fluxes
                    for (var reaction_id in m.cobra_reactions) {
                        // set flux for reaction
                        if (reaction_id == sorted[i][0]) {
                            m.cobra_reactions[reaction_id].flux = sorted[i][1];
                            // also set flux for metabolites (for simpler drawing)
                            for (var metabolite_id in m.cobra_reactions[reaction_id].metabolites)
                                m.cobra_reactions[reaction_id].metabolites[metabolite_id].flux = sorted[i][1];
                        }
                    }
                }
                m.reload_reaction_input(coords);
                callback_function();
            });
        });

    };

    m.place_reaction_input = function(coords) {
        var d = {'x': 280, 'y': 0},
        input = d3.select('#rxn-input');
	var left = Math.max(20, Math.min(m.svg.attr('width')-270, (m.window_scale * coords.x + m.window_translate.x - d.x)));
	var top = Math.max(20, Math.min(m.svg.attr('height')-40, (m.window_scale * coords.y + m.window_translate.y - d.y)));
	// blur
	input.node().blur();
	input.style('position', 'absolute')
            .attr('placeholder', 'Reaction ID -- Flux')
            .style('display', 'block')
            .style('left',left+'px')
            .style('top',top+'px')
        // ignore spaces
            .on('input', function() { this.value = this.value.replace(" ", ""); });
	// // focus
	// if (should_focus) input.node().focus();
    };

    m.reload_reaction_input = function(coords) {
        // Reload data for autocomplete box and redraw box at the new
        // coordinates.
        m.place_reaction_input(coords);

        // Find selected reaction
        var reaction_ids_to_display = [],
            already_drawn = function(reaction_id) {
                for (var drawn_id in m.drawn_reactions)
                    if (reaction_id==drawn_id) return true;
                return false;
            };
        for (var reaction_id in m.cobra_reactions) {
            var reaction = m.cobra_reactions[reaction_id];
            // ignore drawn reactions
            if (already_drawn(reaction_id)) continue;
            if (m.selected_node.is_selected) {
                // check metabolites for match to selected metabolite
                for (var metabolite_id in reaction.metabolites) {
                    if (metabolite_id==m.selected_node.metabolite_id &&
                        reaction.metabolites[metabolite_id].coefficient < 0) {
                        reaction_ids_to_display.push(reaction_id);
                    }
                }
            } else {
                reaction_ids_to_display.push(reaction_id);
            }
        }

        // set up the box with data, searching for first num results
        var num = 20;
        $("#rxn-input").autocomplete(
            { autoFocus: true,
              minLength: 0,
              source: function(request, response) {
                  var escaped = $.ui.autocomplete.escapeRegex(request.term),
                      matcher = new RegExp("^" + escaped, "i"),
                      results = m.list_strings.filter(function(x) {
                          // check against drawn reactions
                          if (reaction_ids_to_display.indexOf(x.value) >= 0)
                              return matcher.test(x.value);
                          return false;
                      });
                  response(results.slice(0,num));
              },
              change: function(event, ui) {
                  if (ui.item) {
                      m.new_reaction(ui.item.value, coords);
                      this.value = "";
                  }
              }
            });
    };

    // -----------------------------------------------------------------------------------
    // DRAW

    m.align_to_grid = function(loc) {
	return loc;
	// TODO debug with drag and drop
        // var r = function (a) { return Math.round(a/1.)*1.; };
        // return {'x': r(loc.x), 'y': r(loc.y)};
    };

    m.rotate_coords_recursive = function(coords_array, angle, center) {
        var i=-1,
            rotated = [];
        while (++i<coords_array.length) {
            rotated.push(m.rotate_coords(coords_array[i]));
        }
        return rotated;
    };

    m.rotate_coords = function(c, angle, center) {
        var dx = Math.cos(angle) * (c.x - center.x) +
                Math.sin(angle) * (c.y - center.y) +
                center.x,
            dy = - Math.sin(angle) * (c.x - center.x) +
                Math.cos(angle) * (c.y - center.y) +
                center.y;
        return {'x': dx, 'y': dy};
    };

    m.calculate_reaction_coordinates = function(reaction) {
        var dis = 120;
        reaction.dis = dis;
        var main_axis = [{'x': 0, 'y': 0}, {'x': 0, 'y': dis}];
        reaction.main_axis = main_axis;
        reaction.center = {'x': (main_axis[0].x + main_axis[1].x)/2,   // for convenience
                           'y': (main_axis[0].y + main_axis[1].y)/2};
        return reaction;
    };

    m.calculate_metabolite_coordinates = function(met, primary_index, angle, main_axis, center, dis) {
        // basic constants
        met.text_dis = {'x': 0, 'y': -18}; // displacement of metabolite label

        // Curve parameters
        var w = 60,  // distance between reactants and between products
            b1_strength = 0.5,
            b2_strength = 0.2,
            w2 = w*0.7,
            secondary_dis = 20,
            num_slots = Math.min(2, met.count - 1);

        // size and spacing for primary and secondary metabolites
        var ds, draw_at_index;
        if (met.is_primary) { // primary
            met.r = 10;
            ds = 20;
        } else { // secondary
            met.r = 5;
            ds = 10;
            // don't use center slot
            if (met.index > primary_index) draw_at_index = met.index - 1;
            else draw_at_index = met.index;
        }

        var de = dis - ds, // distance between ends of line axis
            reaction_axis = [{'x': 0, 'y': ds},
                             {'x': 0, 'y': de}];

        // Define line parameters and axis.
        // Begin with unrotated coordinate system. +y = Down, +x = Right.
        var start = center,
            end, circle, b1, b2;
        // reactants
        if (met.coefficient < 0 && met.is_primary) {
            end = {'x': reaction_axis[0].x + met.dis.x,
		   'y': reaction_axis[0].y + met.dis.y};
            b1 = {'x': start.x*b1_strength + reaction_axis[0].x*(1-b1_strength),
                  'y': start.y*b1_strength + reaction_axis[0].y*(1-b1_strength)};
            b2 = {'x': start.x*b2_strength + (end.x)*(1-b2_strength),
                  'y': start.y*b2_strength + (end.y)*(1-b2_strength)},
            circle = {'x': main_axis[0].x + met.dis.x,
		      'y': main_axis[0].y + met.dis.y};
        } else if (met.coefficient < 0) {
            end = {'x': reaction_axis[0].x + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.x,
                   'y': reaction_axis[0].y + secondary_dis + met.dis.y},
            b1 = {'x': start.x*b1_strength + reaction_axis[0].x*(1-b1_strength),
                  'y': start.y*b1_strength + reaction_axis[0].y*(1-b1_strength)},
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[0].x + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.x,
                      'y': main_axis[0].y + secondary_dis + met.dis.y};
        } else if (met.coefficient > 0 && met.is_primary) {        // products
            end = {'x': reaction_axis[1].x + met.dis.x,
		   'y': reaction_axis[1].y + met.dis.y};
            b1 = {'x': start.x*b1_strength + reaction_axis[1].x*(1-b1_strength),
                  'y': start.y*b1_strength + reaction_axis[1].y*(1-b1_strength)};
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x + met.dis.x,
		      'y': main_axis[1].y + met.dis.y};
        } else if (met.coefficient > 0) {
            end = {'x': reaction_axis[1].x + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.x,
                   'y': reaction_axis[1].y - secondary_dis + met.dis.y},
            b1 = {'x': start.x*b1_strength + reaction_axis[1].x*(1-b1_strength),
                  'y': start.y*b1_strength + reaction_axis[1].y*(1-b1_strength)};
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.x,
                      'y': main_axis[1].y - secondary_dis + met.dis.y};
        }
        // rotate coordinates around start point
        met.start  = m.rotate_coords(start,  angle, main_axis[0]),
        met.end    = m.rotate_coords(end,    angle, main_axis[0]),
        met.b1     = m.rotate_coords(b1,     angle, main_axis[0]),
        met.b2     = m.rotate_coords(b2,     angle, main_axis[0]),
        met.circle = m.rotate_coords(circle, angle, main_axis[0]);

        return met;
    };

    m.new_reaction = function(reaction_id, coords) {
        // New object at x, y coordinates.

        // If reaction id is not new, then return:
        if (m.drawn_reactions.hasOwnProperty(reaction_id)) {
            console.warn('reaction is already drawn');
            return;
        }

        // set reaction coordinates and angle
        // be sure to copy the reaction using jquery extend, recursively
        var reaction = $.extend(true, {}, m.cobra_reactions[reaction_id]);
        reaction.coords = m.align_to_grid(coords);
        reaction.angle = 0 * (Math.PI / 180); // default angle

        // calculate coordinates of reaction
        reaction = m.calculate_reaction_coordinates(reaction);

        // set primary metabolites and count reactants/products
        var primary_reactant_index = 0,
            primary_product_index = 0,
            reactant_count = 0, product_count = 0,
            newest_primary_product_id = "";

        for (var metabolite_id in reaction.metabolites) {
            var metabolite = reaction.metabolites[metabolite_id];
            if (metabolite.coefficient < 0) {
                metabolite.index = reactant_count;
                if (reactant_count==primary_reactant_index) metabolite.is_primary = true;
                reactant_count++;
            } else {
                metabolite.index = product_count;
                if (product_count==primary_product_index) {
                    metabolite.is_primary = true;
                    newest_primary_product_id = metabolite_id;
                };
                product_count++;
            }
        }

        // keep track of total reactants and products
        for (metabolite_id in reaction.metabolites) {
            metabolite = reaction.metabolites[metabolite_id];
            var primary_index;
            if (metabolite.coefficient < 0) {
                metabolite.count = reactant_count + 1;
                primary_index = primary_reactant_index;
            } else {
                metabolite.count = product_count + 1;
                primary_index = primary_product_index;
            }

            // record reaction_id with each metabolite
            metabolite.reaction_id = reaction_id;
	    metabolite.dis = {'x': 0, 'y': 0};

            // calculate coordinates of metabolite components
            metabolite = m.calculate_metabolite_coordinates(metabolite,
                                                            primary_index,
                                                            reaction.angle,
                                                            reaction.main_axis,
                                                            reaction.center,
                                                            reaction.dis);
        }

        // append the new reaction
        m.drawn_reactions[reaction_id] = reaction;

        // draw, and set the new coords
        m.selected_node = {'reaction_id': reaction_id,
                           'direction': "product",
                           'metabolite_id': newest_primary_product_id,
                           'is_selected': true};

        m.draw();
	var new_coords = m.coords_for_selected_metabolite();
	m.translate_off_screen(new_coords);
        m.reload_reaction_input(new_coords);
        setTimeout(function() { $('#rxn-input').focus(); }, 50);
    };

    m.translate_off_screen = function(coords) {
	// shift window if new reaction will draw off the screen
	// TODO BUG not accounting for scale correctly
	var margin = 200,
	    new_pos,
	    current = {'x': {'min': -m.window_translate.x,
			     'max': (m.svg.attr('width')-m.window_translate.x)/m.window_scale},
		       'y': {'min': -m.window_translate.y,
			     'max': (m.svg.attr('height')-m.window_translate.y)/m.window_scale} },
	    go = function() {
		m.zoom.translate([m.window_translate.x, m.window_translate.y]);
		m.zoom.scale(m.window_scale);
		m.g.transition()
		    .attr('transform', 'translate('+m.window_translate.x+','+m.window_translate.y+')scale('+m.window_scale+')');
	    };
	if (coords.x < current.x.min + margin) {
	    new_pos = -(coords.x - current.x.min - margin) * m.window_scale + m.window_translate.x;
	    m.window_translate.x = new_pos;
	    go();
	} else if (coords.x > current.x.max - margin) {
	    new_pos = -(coords.x - current.x.max + margin) * m.window_scale + m.window_translate.x;
	    m.window_translate.x = new_pos;
	    go();
	}
	if (coords.y < current.y.min + margin) {
	    new_pos = -(coords.y - current.y.min - margin) * m.window_scale + m.window_translate.y;
	    m.window_translate.y = new_pos;
	    go();
	} else if (coords.y > current.y.max - margin) {
	    new_pos = -(coords.y - current.y.max + margin) * m.window_scale + m.window_translate.y;
	    m.window_translate.y = new_pos;
	    go();
	}
    };

    m.coords_for_selected_metabolite = function() {
	if (m.selected_node.is_selected)
	    return m.get_coords_for_metabolite(m.selected_node.metabolite_id, m.selected_node.reaction_id);
	else
	    console.log('no node selected');
	    return {'x':0, 'y':0};
    };   

    m.get_coords_for_metabolite = function(metabolite_id, reaction_id) {
        var reaction = m.drawn_reactions[reaction_id],
            metabolite = reaction.metabolites[metabolite_id],
            coords = reaction.coords;
        return {'x': coords.x + metabolite.circle.x,
                'y': coords.y + metabolite.circle.y};
    };

    m.cycle_primary_key = function() {
        // cycle the primary metabolite among the products of the selected reaction

        if (!m.selected_node.is_selected) {
            console.log('no selected node');
            return;
        }

        // get last index
        var last_index, count;
        var reaction = m.drawn_reactions[m.selected_node.reaction_id];
        for (var metabolite_id in reaction.metabolites) {
            var metabolite = reaction.metabolites[metabolite_id];
            if ((metabolite.coefficient > 0 && m.selected_node.direction=="product") ||
                (metabolite.coefficient < 0 && m.selected_node.direction=="reactant")) {
                if (metabolite.is_primary) {
                    last_index = metabolite.index;
                    count = metabolite.count;
                }
            }
        }
        // rotate to new index
        var index = last_index + 1 < count - 1 ? last_index + 1 : 0;
        m.rotate_primary_key(index);
    };

    m.rotate_primary_key = function(index) {
        // switch the primary metabolite to the index of a particular product

        if (!m.selected_node.is_selected) {
            console.log('no selected node');
            return;
        }

        // update primary in m.drawn_reactions
        var new_primary_metabolite_id;
        var reaction = m.drawn_reactions[m.selected_node.reaction_id];

        // if primary is selected, then maintain that selection
        var sel_is_primary = reaction.metabolites[m.selected_node.metabolite_id].is_primary,
            should_select_primary = sel_is_primary ? true : false;

        for (var metabolite_id in reaction.metabolites) {
            var metabolite = reaction.metabolites[metabolite_id];
            if ((metabolite.coefficient > 0 && m.selected_node.direction=="product") ||
                (metabolite.coefficient < 0 && m.selected_node.direction=="reactant")) {
                if (metabolite.index == index) {
                    metabolite.is_primary = true;
                    new_primary_metabolite_id = metabolite_id;
                } else {
                    metabolite.is_primary = false;
                }
                // calculate coordinates of metabolite components
                metabolite = m.calculate_metabolite_coordinates(metabolite,
                                                                index,
                                                                reaction.angle,
                                                                reaction.main_axis,
                                                                reaction.center,
                                                                reaction.dis);
            }
        }

        var coords;
        if (should_select_primary) {
            m.selected_node.metabolite_id = new_primary_metabolite_id;
            coords = m.get_coords_for_metabolite(m.selected_node.metabolite_id,
                                                 m.selected_node.reaction_id);
            m.reload_reaction_input(coords);
        } else {
            coords = m.get_coords_for_metabolite(m.selected_node.metabolite_id,
                                                 m.selected_node.reaction_id);
            m.place_reaction_input(coords);
        }

        m.draw_specific_reactions([m.selected_node.reaction_id]);
    };

    m.select_metabolite = function(d) {
        m.selected_node.metabolite_id = d.metabolite_id;
        m.selected_node.direction = d.coefficient > 0 ? 'product' : 'reactant';
        m.selected_node.is_selected = true;
        m.selected_node.reaction_id = d.reaction_id;
        m.reload_reaction_input(m.coords_for_selected_metabolite());
        m.draw();
    };

    m.create_metabolite = function(enter_selection) {
        // create metabolites
        var g = enter_selection
                .append('g')
                .attr('class', 'metabolite-group')
		.attr('id', function(d) { return d.metabolite_id; }),
	    move = function() {
		// console.log(d3.event); 

		var sel = d3.select(this),
		    met = m.drawn_reactions[sel.datum().reaction_id]
			.metabolites[sel.datum().metabolite_id],
		    d = m.align_to_grid({'x': d3.event.dx, 'y': d3.event.dy});
		met.dis = m.align_to_grid({'x': met.dis.x + d3.event.dx,
					   'y': met.dis.y + d3.event.dy});

		var transform = d3.transform(sel.attr('transform'));
		sel.attr('transform', 'translate(' +
			 (transform.translate[0]+d3.event.dx) + ',' +
			 (transform.translate[1]+d3.event.dy) + ')' +
			 'scale(' + transform.scale + ')');
	    },
	    silence = function() {
		d3.event.sourceEvent.stopPropagation(); // silence other listeners
	    },
	    update = function() {
		var sel = d3.select(this),
		    transform = d3.transform(sel.attr('transform'));
		sel.attr('transform', null);
		m.draw_specific_reactions_with_location([sel.datum().reaction_id]);
	    };
	

        // create reaction arrow
        g.append('path')
            .attr('class', 'reaction-arrow');

        // create metabolite circle and label
        // TODO hide if the node is shared
        var mg = g.append('g')
                .attr('class', 'circle-and-label');

        mg.append('circle')
            .attr('class', 'metabolite-circle')
            .on("click", m.select_metabolite)
	    .call(d3.behavior.drag().on("dragstart", silence).on("drag", move).on("dragend", update));
        mg.append('text')
            .attr('class', 'metabolite-label')
            .text(function(d) { return d.metabolite_id; })
            .attr('pointer-events', 'none');
    };

    m.update_metabolite = function(update_selection) {
        // update metabolite attributes

        // update arrows
        update_selection
            .selectAll('.reaction-arrow')
        // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
        // only necessary for selectAll()
            .datum(function() {
                return this.parentNode.__data__;
            })
            .attr('d', function(d) {
                return 'M'+d.start.x+','+d.start.y+
                    'C'+d.b1.x+','+d.b1.y+' '+
                    d.b2.x+','+d.b2.y+' '+
                    d.end.x+','+d.end.y;
            }) // TODO replace with d3.curve or equivalent
            .attr("marker-end", function (d) {
                var c = d.flux ? m.scale.flux_color(Math.abs(d.flux)) :
                        m.default_reaction_color;
                // generate arrowhead for specific color
                var arrow_id = m.generate_arrowhead_for_color(c, true);
                return "url(#" + arrow_id + ")";
            })
            .style('stroke', function(d) {
                var c = d.flux ? m.scale.flux_color(Math.abs(d.flux)) :
                        m.default_reaction_color;
                return c;
            });

        // update circle and label location
        var mg = update_selection
                .selectAll('.circle-and-label')
        // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
        // only necessary for selectAll()
                .datum(function() {
                    return this.parentNode.__data__;
                })
                .attr('transform', function(d) {
                    return 'translate('+d.circle.x+','+d.circle.y+')';
                });

        var is_sel = function(d) {
            if (d.reaction_id==m.selected_node.reaction_id &&
                d.metabolite_id==m.selected_node.metabolite_id &&
                m.selected_node.is_selected)
                return true;
            return false;
        };

        mg.select('.metabolite-circle')
            .attr('r', function(d) { return d.r; })
            .style('stroke', function(d) {
                if (is_sel(d)) return '#222';
                return null;
            })
            .style('stroke-width', function(d) {
                if (is_sel(d)) return '3px';
                return null;
            });
        mg.select('.metabolite-label')
            .attr('transform', function(d) {
                return 'translate('+d.text_dis.x+','+d.text_dis.y+')';
            });
    };

    m.create_reaction_label = function(sel) {
        // draw reaction label for selection
        sel.append('text')
            .attr('class', 'reaction-label')
            .attr('pointer-events', 'none');
    };
    m.update_reaction_label = function(sel) {
	var near_angle_degrees = function(angle, near) {
	    return (angle > (near-45)*Math.PI/180 && angle<(near+45)*Math.PI/180);
	};
		
        sel.text(function(d) {
            return d.reaction_id + " (" + m.decimal_format(d.flux) + ")";
        })
            .attr('transform', function(d) {
		// displacement of reaction label
                var dis;
		if (near_angle_degrees(d.angle, 90))
		    dis = {'x': 30, 'y': -35};
		else if (near_angle_degrees(d.angle, 180))
		    dis = {'x': -20, 'y': 0};
		else if (near_angle_degrees(d.angle, 270))
		    dis = {'x': -30, 'y': 35};
		else if (near_angle_degrees(d.angle, 0))
		    dis = {'x': 20, 'y': 0};
                var loc = m.rotate_coords({'x': d.center.x + dis.x,
					   'y': d.center.y + dis.y},
					  d.angle, d.main_axis[0]);
                return 'translate('+loc.x+','+loc.y+')';
            });
    };

    m.create_reaction = function(enter_selection) {
        // attributes for new reaction group
        var t = enter_selection.append('g')
                .attr('id', function(d) { return d.reaction_id; })
                .attr('class', 'reaction')
                .attr('transform', function(d) {
                    return 'translate(' + d.coords.x + ',' + d.coords.y + ')';
                })
                .call(m.create_reaction_label);

        return;
    };
    m.update_reaction = function(update_selection) {
        // update reaction label
        update_selection.select('.reaction-label')
            .call(m.update_reaction_label);

        // select metabolites
        var sel = update_selection
                .selectAll('.metabolite-group')
                .data(function(d) {
                    return m.make_array(d.metabolites, 'metabolite_id');
                }, function(d) { return d.metabolite_id; });

        // new metabolites
        sel.enter().call(m.create_metabolite);

        // update metabolites
        sel.call(m.update_metabolite);

        // old metabolites
        sel.exit().remove();

        return;
    };

    m.make_array = function(obj, id_key) { // is this super slow?
        var array = [];
        for (var key in obj) {
            // copy object
            var o = $.extend(true, {}, obj[key]);
            // add key as 'id'
            o[id_key] = key;
            // add object to array
            array.push(o);
        }
        return array;
    };

    m.draw = function() {
        // Draw the reactions

        // generate reactions for m.drawn_reactions
        // assure constancy with cobra_id
        var sel = d3.select('#reactions')
                .selectAll('.reaction')
                .data(m.make_array(m.drawn_reactions, 'reaction_id'),
                      function(d) { return d.reaction_id; }); // LEFTOFF generate array from m.drawn_reactions object

        // enter: generate and place reaction
        sel.enter().call(m.create_reaction);

        // update: update when necessary
        sel.call(m.update_reaction);

        // exit
        sel.exit().remove();
    };

    m.draw_specific_reactions = function(reaction_ids) {
        // console.log('updating these ids:');
        // console.log(reaction_ids);

        // find reactions for reaction_ids
        var reaction_subset = {},
            i = -1;
        while (++i<reaction_ids.length) {
            reaction_subset[reaction_ids[i]] = $.extend(true, {}, m.drawn_reactions[reaction_ids[i]]);
        }
        if (reaction_ids.length != Object.keys(reaction_subset).length) {
            console.warn('did not find correct reaction subset');
        }

        // generate reactions for m.drawn_reactions
        // assure constancy with cobra_id
        var sel = d3.select('#reactions')
                .selectAll('.reaction')
                .data(m.make_array(reaction_subset, 'reaction_id'),
                      function(d) { return d.reaction_id; });

        // enter: generate and place reaction
        sel.enter().call(m.create_reaction);

        // update: update when necessary
        sel.call(m.update_reaction);

        // exit
        // sel.exit();
    };

    m.draw_specific_reactions_with_location = function(reaction_id) {
	var reaction = m.drawn_reactions[reaction_id],
	    primary_reactant_index, primary_product_index;
	reaction = m.calculate_reaction_coordinates(reaction);
	for (var metabolite_id in reaction.metabolites) {
	    var metabolite = reaction.metabolites[metabolite_id];
	    if (metabolite.coefficient < 0)
		if (metabolite.is_primary) primary_reactant_index = metabolite.index;
	    else 
		if (metabolite.is_primary) primary_product_index = metabolite.index;
	}
	for (metabolite_id in reaction.metabolites) {
	    metabolite = reaction.metabolites[metabolite_id];
	    var primary_index;
	    if (metabolite.coefficient < 0) {
		primary_index = primary_reactant_index;
	    } else {
		primary_index = primary_product_index;
	    }
	    metabolite = m.calculate_metabolite_coordinates(metabolite,
                                                            primary_index, //should this be saved as metabolite.primary_index?
                                                            reaction.angle,
                                                            reaction.main_axis,
                                                            reaction.center,
                                                            reaction.dis);
	}
	m.draw_specific_reactions([reaction_id]);
	m.place_reaction_input(m.coords_for_selected_metabolite());
    };

    m.modify_reaction = function(cobra_id, key, value) {
        // modify reaction with cobra_id to have new (key, value) pair
        m.drawn_reactions[cobra_id][key] = value;
    };

    m.generate_arrowhead_for_color = function(color, is_end) {
        var pref;
        if (is_end) pref = 'start-';
        else        pref = 'end-';

        var id = String(color).replace('#', pref);
        if (m.arrowheads_generated.indexOf(id) < 0) {
            m.arrowheads_generated.push(id);

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

            // generate defs if it doesn't exist
            var defs = m.g.select("defs");
            if (defs.empty()) defs = m.g.append("svg:defs");

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
    };

    // -----------------------------------------------------------------------------------
    // KEYBOARD

    m.key_listeners = function() {
        var primary_cycle_key = 80, // 'p'
            hide_show_input_key = 32, // SPACE
            rotate_keys = {'left':  37,
                           'right': 39,
                           'up':    38,
                           'down':  40};

        d3.select(window).on("keydown", function() {
            var kc = d3.event.keyCode,
		reaction_input_focus =  $('#rxn-input').is(":focus");
            if (kc==primary_cycle_key && !reaction_input_focus) {
                m.cycle_primary_key();
            } else if (kc==hide_show_input_key) {
                if (reaction_input_focus) $('#rxn-input').blur();
                else $('#rxn-input').focus();
            } else if (kc==rotate_keys.left && !reaction_input_focus) {
		m.modify_reaction(m.selected_node.reaction_id, 'angle', 270*(Math.PI/180));
		m.draw_specific_reactions_with_location(m.selected_node.reaction_id);
	    } else if (kc==rotate_keys.right && !reaction_input_focus) {
		m.modify_reaction(m.selected_node.reaction_id, 'angle', 90*(Math.PI/180));
		m.draw_specific_reactions_with_location(m.selected_node.reaction_id);
	    } else if (kc==rotate_keys.up && !reaction_input_focus) {
		m.modify_reaction(m.selected_node.reaction_id, 'angle', 180*(Math.PI/180));
		m.draw_specific_reactions_with_location(m.selected_node.reaction_id);
	    } else if (kc==rotate_keys.down && !reaction_input_focus) {
		m.modify_reaction(m.selected_node.reaction_id, 'angle', 0);
		m.draw_specific_reactions_with_location(m.selected_node.reaction_id);
	    }
        });
    };

    // -----------------------------------------------------------------------------------
    // LOAD

    m.load_builder = function(options) {
        if (typeof options === 'undefined') options = {};
        m.selection = options.selection || d3.select('body').append('div');
        m.margin    = options.margin    || 20;

        m.map_data = {};
        m.mode = 'builder';

        var width = $(window).width() - m.margin;
        var height = $(window).height() - m.margin;

        var svg = m.setup_container(m.selection, width, height);

        svg.append('g')
            .attr('id', 'reactions');

        // setup selection box
        var start_coords = {'x': width/2, 'y': 40};
        m.load_model_and_list(start_coords, function() {
            // TEST case
            if (true) {
                m.new_reaction('GLCtex', start_coords);
            }
            d3.select('#loading').style('display', 'none');
            // Focus on menu. TODO use a better callback rather than the
            // setTimeout.
            setTimeout(function() { $('#rxn-input').focus(); }, 50);
        });

        // set up keyboard listeners
        m.key_listeners();
    };

    return {
        version: m.version,
        load_builder: m.load_builder
    };
};
