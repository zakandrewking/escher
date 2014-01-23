define(["vis/scaffold", "metabolic-map/utils", "builder/draw", "builder/input", "lib/d3", 
	"lib/complete.ly", "builder/build"],
       function(scaffold, utils, draw, input, d3, completely, build) {
    // NOTE
    // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
    // only necessary for selectAll()
    // .datum(function() {
    //     return this.parentNode.__data__;
    // })
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            selection: d3.select("body").append("div"),
            selection_is_svg: false,
            fillScreen: false,
            update_hook: false,
            map_path: null,
            map: null,
            cobra_model_path: null,
            cobra_model: null,
            css_path: null,
            css: null,
            flux_path: null,
            flux: null,
            flux2_path: null,
            flux2: null,
	    show_beziers: false,
	    debug: false,
	    starting_reaction: 'ACALDtex',
	    reaction_arrow_displacement: 35 });

        if (o.selection_is_svg) {
            console.error("Builder does not support placement within svg elements");
            return null;
        }

        var files_to_load = [{ file: o.map_path, value: o.map, callback: set_map },
                             { file: o.cobra_model_path, value: o.cobra_model, callback: set_cobra_model },
                             { file: o.css_path, value: o.css, callback: set_css },
                             { file: o.flux_path, value: o.flux,
                               callback: function(e, f) { set_flux(e, f, 0); } },
                             { file: o.flux2_path, value: o.flux2,
                               callback: function(e, f) { set_flux(e, f, 1); } } ];
        scaffold.load_files(files_to_load, setup);
        return {};

        // Definitions
        function set_map(error, map) {
            if (error) console.warn(error);
            o.map = map;
        };
        function set_cobra_model(error, cobra_model) {
            if (error) console.warn(error);
            o.cobra_model = cobra_model;
        }
        function set_css(error, css) {
            if (error) console.warn(error);
            o.css = css;
        };
        function set_flux(error, flux, index) {
            if (error) console.warn(error);
            if (index==0) o.flux = flux;
            else if (index==1) o.flux2 = flux;
        };
        function setup() {
            /* Load the svg container and draw a loaded map if provided.
             */

            // Begin with some definitions
            // o.selected_node = {'node_id': '',
            //                    'is_selected': false};
            o.drawn_reactions = {};
            o.arrowheads_generated = [];
            o.default_reaction_color = '#505050';
            o.window_translate = {'x': 0, 'y': 0};
            o.window_scale = 1;
	    o.zoom_enabled = true;
	    o.shift_key_on = false;

	    // Check the cobra model
	    if (o.cobra_model) {
		// TODO better checks
		o.cobra_reactions = o.cobra_model.reactions;
	    }

	    // set up the svg
            var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                         o.margins, o.fill_screen);
            o.svg = out.svg;
            o.height = out.height;
            o.width = out.width;

            // setup menu and status bars
            o.menu = setup_menu(o.selection);
            o.status = setup_status(o.selection);

            // setup the reaction input with complete.ly
            o.reaction_input = setup_reaction_input(o.selection);


            // set up keyboard listeners
            setup_key_listeners();

	    // import map
	    var max_w = o.width, max_h = o.height;
	    if (o.map) {
		import_and_load_map(o.map, o.height, o.width);
	    } else {
		o.drawn_membranes = [];
		o.map_info = { max_map_w: o.width, max_map_h: o.height };

		// set up svg and svg definitions
		o.scale = utils.define_scales(o.map_info.max_map_w, o.map_info.max_map_h,
					      o.width, o.height);
	    }

            o.defs = utils.setup_defs(o.svg, o.css);
            var out = utils.setup_zoom_container(o.svg, o.width, o.height, [0.05, 15], 
						 function(ev) {
						     o.window_translate = {'x': ev.translate[0], 'y': ev.translate[1]};
						     o.window_scale = ev.scale;
						     if (input.is_visible(o.reaction_input))
							 input.place_at_selected(o.reaction_input, o.scale.x, o.scale.y, 
										 o.window_scale, o.window_translate, 
										 o.width, o.height);
						 }, 
						 function() { return o.zoom_enabled; });
	    // TODO fix like this http://jsfiddle.net/La8PR/5/
            o.sel = out.sel,
            o.zoom = out.zoom;

            var extent = {"x": o.width*3, "y": o.height*3},
		mouse_node = o.sel.append('rect')
                    .attr("width", extent.x)
                    .attr("height", extent.y)
		    .attr("transform",
			  "translate("+(-extent.x/3)+","+(-extent.y/3)+")")
                    .attr("style", "stroke:black;fill:none;")
                    .attr('pointer-events', 'all');

            o.sel.append('g')
                .attr('id', 'brush-container');
	    draw.setup_containers(o.sel);

            // setup selection box
            if (!o.map) {
		// TEST case
		var start_coords = {'x': o.width/2, 'y': 40};
                new_reaction_from_scratch(o.starting_reaction, start_coords);
            } else {
		draw_everything();
	    }

	    // turn off loading message
            d3.select('#loading').style("display", "none");

            // definitions
            function setup_menu(selection) {
                var sel = selection.append("div").attr("id", "menu");
                new_button(sel, cmd_hide_show_input, "New reaction (/)");
                // new_button(sel, cmd_cycle_primary_metabolite, "Cycle primary metabolite (p)");
                // new_button(sel, cmd_left, "Left (←)");
                // new_button(sel, cmd_right, "Right (→)");
                // new_button(sel, cmd_up, "Up (↑)");
                // new_button(sel, cmd_down, "Down (↓)");
                new_button(sel, cmd_save, "Save (^s)");
                o.load_input_click_fn = new_input(sel, load_map_for_file, "Load (^o)");
                o.load_flux_input_click_fn = new_input(sel, load_flux_for_file, "Load flux (^f)");
		if (o.show_beziers) new_button(sel, cmd_hide_beziers, "Hide control points");
		else new_button(sel, cmd_show_beziers, "Show control points");

		var z;
		if (o.zoom_enabled) z = new_button(sel, cmd_zoom_off, "Enable select (v)");
		else z = new_button(sel, cmd_zoom_on, "Enable pan+zoom (z)");
		z.attr('id', 'zoom-button');

                return sel;

		// definitions
		function load_map_for_file(error, data) {
                    if (error) console.warn(error);
                    import_and_load_map(data);
                    draw.reset();
                    draw_everything();
                }
		function load_flux_for_file(error, data) {
                    set_flux(error, data, 0);
		    apply_flux_to_map();
                    draw_everything();
                }
                function new_button(s, fn, name) {
                    return s.append("button").attr("class", "command-button")
                        .text(name).on("click", fn);
                }
                function new_input(s, fn, name) {
                    /* 
		     * Returns a function that can be called to programmatically
                     * load files.
                     */
                    var input = s.append("input").attr("class", "command-button")
                            .attr("type", "file")
                            .style("display", "none")
                            .on("change", function() { utils.load_json(this.files[0], fn); });
                    new_button(sel, function(e) {
                        input.node().click();
                    }, name);
                    return function() { input.node().click(); };
                }
            }
            function setup_reaction_input(selection) {
                // set up container
                var sel = selection.append("div").attr("id", "rxn-input");
                sel.style("display", "none");
                // set up complete.ly
                var complete = completely(sel.node(), { backgroundColor: "#eee" });
                d3.select(complete.input)
                // .attr('placeholder', 'Reaction ID -- Flux')
                    .on('input', function() {
                        this.value = this.value.replace("/","")
                            .replace(" ","")
                            .replace("\\","")
                            .replace("<","");
                    });
                return { selection: sel,
                         completely: complete };
            }
            function setup_status(selection) {
                return selection.append("div").attr("id", "status");
            }
        }

	// drawing
	function node_click_function(sel, data) {
	}
	function has_flux() {
	    return o.flux ? true : false;
	}
	function node_click(d) {
	    return select_metabolite(this, d, o.sel.select('#nodes').selectAll('.node'), o.shift_key_on);
	}
	function node_dragstart() {
	    // silence other listeners
            d3.event.sourceEvent.stopPropagation();
	}
	function node_drag() {
	    var grabbed_id = this.parentNode.__data__.node_id,		    
                selected_ids = [];
	    d3.select('#nodes').selectAll('.selected').each(function(d) { selected_ids.push(d.node_id); });
	    if (selected_ids.indexOf(grabbed_id)==-1) { 
		console.log('Dragging unselected node');
		return;
	    }

	    var reaction_ids = [];
	    // update node positions
	    d3.selectAll('.node').each(function(d) {
		if (selected_ids.indexOf(d.node_id)==-1) return;
		// update data
                var node = o.drawn_nodes[d.node_id],
		    dx = o.scale.x_size.invert(d3.event.dx),
		    dy = o.scale.y_size.invert(d3.event.dy);
                node.x = node.x + dx; 
		node.y = node.y + dy;
		// update node labels
                node.label_x = node.label_x + dx;
		node.label_y = node.label_y + dy;

		// update connected reactions
		d.connected_segments.map(function(segment_object) {
		    shift_beziers_for_segment(segment_object.reaction_id, segment_object.segment_id, 
					      d.node_id, dx, dy);
		    reaction_ids.push(segment_object.reaction_id);
		});
	    });

	    draw_specific_nodes(selected_ids);
	    draw_specific_reactions(reaction_ids);

	    // definitions
	    function shift_beziers_for_segment(reaction_id, segment_id, node_id, dx, dy) {
		var seg = o.drawn_reactions[reaction_id].segments[segment_id];
		if (seg.from_node_id==node_id && seg.b1) {
		    seg.b1.x = seg.b1.x + dx;
		    seg.b1.y = seg.b1.y + dy;
		}
		if (seg.to_node_id==node_id && seg.b2) {
		    seg.b2.x = seg.b2.x + dx;
		    seg.b2.y = seg.b2.y + dy;
		}
	    }
	}
	function draw_everything() {
	    draw.draw(o.drawn_membranes, o.drawn_reactions, o.drawn_nodes, o.drawn_text_labels, o.scale, 
		      o.show_beziers, o.reaction_arrow_displacement, o.defs, o.arrowheads_generated,
		      o.default_reaction_color, has_flux(), 
		      node_click, node_drag, node_dragstart);
	}
	function draw_specific_reactions(reaction_ids) {
	    draw.draw_specific_reactions(reaction_ids, o.drawn_reactions, o.drawn_nodes, o.scale, o.show_beziers,
					 o.reaction_arrow_displacement, o.defs, o.arrowheads_generated, 
					 o.default_reaction_color, has_flux());
	}
	function draw_specific_nodes(node_ids) {
	    draw.draw_specific_nodes(node_ids, o.drawn_nodes, o.drawn_reactions, o.scale, 
				     node_click, node_drag, node_dragstart);
	}    
	function apply_flux_to_map() {
	    for (var reaction_id in o.drawn_reactions) {
		var reaction = o.drawn_reactions[reaction_id];
		if (reaction.abbreviation in o.flux) {
		    var flux = parseFloat(o.flux[reaction.abbreviation]);
		    reaction.flux = flux;
		    for (var segment_id in reaction.segments) {
			var segment = reaction.segments[segment_id];
			segment.flux = flux;
		    }
		}
	    }
	}

	// brushing
	function enable_brush(on) {
	    var brush_sel = o.sel.select('#brush-container');
	    if (on) {
		o.selection_brush = setup_selection_brush(brush_sel, 
							  d3.select('#nodes').selectAll('.node'),
							  o.width, o.height);
	    } else {
		brush_sel.selectAll('.brush').remove();
	    }

	    // definitions
	    function setup_selection_brush(selection, node_selection, width, height) {
		var node_ids = [];
		node_selection.each(function(d) { node_ids.push(d.node_id); });
		var brush_fn = d3.svg.brush()
			.x(d3.scale.identity().domain([0, width]))
			.y(d3.scale.identity().domain([0, height]))
			.on("brush", function() {
			    var extent = d3.event.target.extent();
			    node_selection
				.classed("selected", function(d) { 
				    var sx = o.scale.x(d.x), sy = o.scale.y(d.y);
				    return extent[0][0] <= sx && sx < extent[1][0]
					    && extent[0][1] <= sy && sy < extent[1][1];
				});
			})        
			.on("brushend", function() {
			    d3.event.target.clear();
			    d3.select(this).call(d3.event.target);
			}),
		    brush = selection.append("g")
			.attr("class", "brush")
			.call(brush_fn);
		return brush;
	    }
	}

	function import_map(map) {
	    /*
	     * Load a json map and add necessary fields for rendering.
	     *
	     * The returned value will be o.drawn_reactions.
	     */
	    if (o.debug) {
		var required_node_props = ['node_type', 'x', 'y',
					   'connected_segments'],
		    required_reaction_props = ["segments", 'name', 'direction', 'abbreviation'],
		    required_segment_props = ['from_node_id', 'to_node_id'],
		    required_text_label_props = ['text', 'x', 'y'];
		for (var node_id in map.nodes) {
		    var node = map.nodes[node_id];
		    node.selected = false; node.previously_selected = false;
		    required_node_props.map(function(req) {
			if (!node.hasOwnProperty(req)) console.error("Missing property " + req);
		    });
		}
		for (var reaction_id in map.reactions) {
		    var reaction = map.reactions[reaction_id];
		    required_reaction_props.map(function(req) {
			if (!reaction.hasOwnProperty(req)) console.error("Missing property " + req);
		    });
		    for (var segment_id in reaction.segments) {
			var metabolite = reaction.segments[segment_id];
			required_segment_props.map(function(req) {
			    if (!metabolite.hasOwnProperty(req)) console.error("Missing property " + req);
			});
		    }
		}
		for (var text_label_id in map.text_labels) {
		    var text_label = map.text_labels[text_label_id];
		    required_text_label_props.map(function(req) {
			if (!text_label.hasOwnProperty(req)) console.error("Missing property " + req);
		    });
		}
	    }
	    return map;
	}
	function import_and_load_map(map) {
	    map = import_map(map);
	    o.drawn_reactions = map.reactions ? map.reactions : {};
	    o.drawn_nodes = map.nodes ? map.nodes : {};
	    o.drawn_membranes = map.membranes ? map.membranes : [];
	    o.drawn_text_labels = map.text_labels ? map.text_labels : {};
	    o.map_info = map.info ? map.info : {};

	    // get largest ids for adding new reactions, nodes, text labels, and segments
	    o.map_info.largest_ids = {};
	    o.map_info.largest_ids.reactions = get_largest_id(map.reactions);
	    o.map_info.largest_ids.nodes = get_largest_id(map.nodes);
	    o.map_info.largest_ids.text_labels = get_largest_id(map.text_labels);

	    var largest_segment_id = 0;
	    for (var id in map.reactions) {
		largest_segment_id = get_largest_id(map.reactions[id].segments, largest_segment_id);
	    }
	    o.map_info.largest_ids.segments = largest_segment_id;

	    // set up svg and svg definitions
	    o.scale = utils.define_scales(o.map_info.max_map_w, o.map_info.max_map_h,
					  o.width, o.height);
	    // reset zoom
	    if (o.zoom) {
		o.window_translate.x = 0; o.window_translate.y = 0; o.window_scale = 1.0;
                o.zoom.translate([o.window_translate.x, o.window_translate.y]);
                o.zoom.scale(o.window_scale);
                o.sel.attr('transform', 'translate('+o.window_translate.x+','+o.window_translate.y+')scale('+o.window_scale+')');
	    }
	    // flux onto existing map reactions
	    if (o.flux) apply_flux_to_map();

	    // definitions
	    function get_largest_id(obj, current_largest) {
		/** Return the largest integer key in obj, or current_largest, whichever is bigger. */
		if (current_largest===undefined) current_largest = 0;
		return Math.max.apply(null, Object.keys(obj).concat([current_largest]));
	    }
	}
	function map_for_export() {
	    // var exported_node_props = ['node_type', 'x', 'y', TODO make minimal map for export
	    // 			       'connected_segments'],
	    // 	exported_reaction_props = ["segments", 'name', 'direction', 'abbreviation'],
	    // 	exported_segment_props = ['from_node_id', 'to_node_id'],
	    // 	exported_text_label_props = ['text', 'x', 'y'];
	    var membranes = utils.clone(o.drawn_membranes),
		nodes = utils.clone(o.drawn_nodes),
		reactions = utils.clone(o.drawn_reactions),
		text_labels = utils.clone(o.drawn_text_labels),
		info = utils.clone(o.map_info);
	    return { membranes: membranes, nodes: nodes, reactions: reactions, text_labels: text_labels, info: info };
	}   

	function new_reaction_for_metabolite(reaction_abbreviation, selected_node_id) {
	    /** Build a new reaction starting with selected_met.

	     */

            // If reaction id is not new, then return:
	    for (var reaction_id in o.drawn_reactions) {
		if (o.drawn_reactions[reaction_id].abbreviation == reaction_abbreviation) {             
		    console.warn('reaction is already drawn');
                    return;
		}
            }

	    // get the metabolite node
	    var selected_node = o.drawn_nodes[selected_node_id];

            // set reaction coordinates and angle
            // be sure to copy the reaction recursively
            var cobra_reaction = utils.clone(o.cobra_reactions[reaction_abbreviation]);

	    // build the new reaction
	    var out = build.new_reaction(reaction_abbreviation, cobra_reaction,
					 selected_node_id, selected_node,
					 o.map_info.largest_ids);
	    utils.extend(o.drawn_reactions, out.new_reactions);
	    utils.extend(o.drawn_nodes, out.new_nodes);

	    // draw new reaction and (TODO) select new metabolite
	    draw_specific_nodes(Object.keys(out.new_nodes));
	    draw_specific_reactions(Object.keys(out.new_reactions));
            // var new_coords;
	    // d3.select('.selected').each(function(d) { new_coords = {x: d.x, y: d.y}; });
            // translate_off_screen(new_coords);
            if (input.is_visible(o.reaction_input)) cmd_show_input();
	}

        function set_status(status) {
            // TODO put this in js/metabolic-map/utils.js
            var t = d3.select('body').select('#status');
            if (t.empty()) t = d3.select('body')
                .append('text')
                .attr('id', 'status');
            t.text(status);
            return this;
        }

        function translate_off_screen(coords) {
            // shift window if new reaction will draw off the screen
            // TODO BUG not accounting for scale correctly
            var margin = 200,
                new_pos,
                current = {'x': {'min': -o.window_translate.x,
                                 'max': (o.width-o.window_translate.x)/o.window_scale},
                           'y': {'min': -o.window_translate.y,
                                 'max': (o.height-o.window_translate.y)/o.window_scale} },
                go = function() {
                    o.zoom.translate([o.window_translate.x, o.window_translate.y]);
                    o.zoom.scale(o.window_scale);
                    o.sel.transition()
                        .attr('transform', 'translate('+o.window_translate.x+','+o.window_translate.y+')scale('+o.window_scale+')');
                };
            if (coords.x < current.x.min + margin) {
                new_pos = -(coords.x - current.x.min - margin) * o.window_scale + o.window_translate.x;
                o.window_translate.x = new_pos;
                go();
            } else if (coords.x > current.x.max - margin) {
                new_pos = -(coords.x - current.x.max + margin) * o.window_scale + o.window_translate.x;
                o.window_translate.x = new_pos;
                go();
            }
            if (coords.y < current.y.min + margin) {
                new_pos = -(coords.y - current.y.min - margin) * o.window_scale + o.window_translate.y;
                o.window_translate.y = new_pos;
                go();
            } else if (coords.y > current.y.max - margin) {
                new_pos = -(coords.y - current.y.max + margin) * o.window_scale + o.window_translate.y;
                o.window_translate.y = new_pos;
                go();
            }
        }

        function get_coords_for_node(node_id) {
            var node = o.drawn_nodes[node_id],
                coords = {'x': node.x, 'y': node.y};
            return coords;
        }

        // function cycle_primary_key() {
        //     /* Cycle the primary metabolite among the products of the selected reaction.
	//      *
	//      */

        //     // if (!o.selected_node.is_selected) {
        //     //     console.log('no selected node');
        //     //     return;
        //     // }

        //     // get last index
        //     var last_index, count;
        //     var reaction = o.drawn_reactions[o.selected_node.reaction_id];
        //     for (var metabolite_id in reaction.segments) {
        //         var metabolite = reaction.segments[metabolite_id];
        //         if ((metabolite.coefficient > 0 && o.selected_node.direction=="product") ||
        //             (metabolite.coefficient < 0 && o.selected_node.direction=="reactant")) {
        //             if (metabolite.is_primary) {
        //                 last_index = metabolite.index;
        //                 count = metabolite.count;
        //             }
        //         }
        //     }
        //     // rotate to new index
        //     var index = last_index + 1 < count - 1 ? last_index + 1 : 0;
        //     rotate_primary_key(index);
        // }

        // function rotate_primary_key(index) {
        //     /* Switch the primary metabolite to the index of a particular product.
	//      */

        //     if (!o.selected_node.is_selected) {
        //         console.warn('no selected node');
        //         return;
        //     }

        //     // update primary in o.drawn_reactions
        //     var new_primary_metabolite_id;
        //     var reaction = o.drawn_reactions[o.selected_node.reaction_id];

        //     // if primary is selected, then maintain that selection
        //     var sel_is_primary = reaction.segments[o.selected_node.metabolite_id].is_primary,
        //         should_select_primary = sel_is_primary ? true : false;

        //     for (var metabolite_id in reaction.segments) {
        //         var metabolite = reaction.segments[metabolite_id];
        //         if ((metabolite.coefficient > 0 && o.selected_node.direction=="product") ||
        //             (metabolite.coefficient < 0 && o.selected_node.direction=="reactant")) {
        //             if (metabolite.index == index) {
        //                 metabolite.is_primary = true;
        //                 new_primary_metabolite_id = metabolite_id;
        //             } else {
        //                 metabolite.is_primary = false;
        //             }
        //             // calculate coordinates of metabolite components
        //             metabolite = utils.calculate_new_metabolite_coordinates(metabolite,
	// 								    index,
        //                                                                     reaction.main_axis,
	// 								    reaction.center,
	// 								    reaction.dis);
        //         }
        //     }

        //     var coords;
        //     if (should_select_primary) {
        //         o.selected_node.node_id = new_primary_node_id;
        //         coords = get_coords_for_node(o.selected_node.node_id);
        //     } else {
        //         coords = get_coords_for_node(o.selected_node.node_id);
        //     }

        //     draw_specific_reactions([o.selected_node.reaction_id]);
        // }

        function select_metabolite(sel, d, node_selection, shift_key_on) {
	    if (shift_key_on) d3.select(sel.parentNode).classed("selected", !d3.select(sel.parentNode).classed("selected"));
            else node_selection.classed("selected", function(p) { return d === p; });
	    var selected_nodes = d3.select('.selected'),
		count = 0;
	    selected_nodes.each(function() { count++; });
	    if (input.is_visible(o.reaction_input)) {
		if (count == 1) cmd_show_input();
		else cmd_hide_input();
	    }
	}

        // -----------------------------------------------------------------------------------
        // KEYBOARD

        function setup_key_listeners() {
            var held_keys = reset_held_keys(),
                modifier_keys = { command: 91,
                                  control: 17,
                                  option: 18,
                                  shift: 16},
                primary_cycle_key= { key: 80 }, // 'p'
                hide_show_input_key = { key: 191 }, // forward slash '/'
                rotate_keys = {'left':  { key: 37 },
                               'right': { key: 39 },
                               'up':    { key: 38 },
                               'down':  { key: 40 } },
                control_key = { key: 17 },
                save_key = { key: 83, modifiers: { control: true } },
                load_key = { key: 79, modifiers: { control: true } },
		load_flux_key = { key: 70, modifiers: { control: true } },
		pan_and_zoom_key = { key: 90 },
		brush_key = { key: 86 };

            d3.select(window).on("keydown", function() {
                var kc = d3.event.keyCode,
                    reaction_input_visible = input.is_visible(o.reaction_input);

                held_keys = toggle_modifiers(modifier_keys, held_keys, kc, true);
		o.shift_key_on = held_keys.shift;
		if (check_key(hide_show_input_key, kc, held_keys)) {
                    cmd_hide_show_input();
                    held_keys = reset_held_keys();
                // } else if (check_key(primary_cycle_key, kc, held_keys) && !reaction_input_visible) {
                //     cmd_cycle_primary_metabolite();
                //     held_keys = reset_held_keys();
                // } else if (check_key(rotate_keys.left, kc, held_keys) && !reaction_input_visible) {
                //     cmd_left();
                //     held_keys = reset_held_keys();
                // } else if (check_key(rotate_keys.right, kc, held_keys) && !reaction_input_visible) {
                //     cmd_right();
                //     held_keys = reset_held_keys();
                // } else if (check_key(rotate_keys.up, kc, held_keys) && !reaction_input_visible) {
                //     cmd_up();
                //     held_keys = reset_held_keys();
                // } else if (check_key(rotate_keys.down, kc, held_keys) && !reaction_input_visible) {
                //     cmd_down();
                //     held_keys = reset_held_keys();
                } else if (check_key(save_key, kc, held_keys) && !reaction_input_visible) {
                    held_keys = reset_held_keys();
                    cmd_save();
                } else if (check_key(load_key, kc, held_keys) && !reaction_input_visible) {
                    cmd_load();
                    held_keys = reset_held_keys();
                } else if (check_key(load_flux_key, kc, held_keys) && !reaction_input_visible) {
                    cmd_load_flux();
                    held_keys = reset_held_keys();
                } else if (check_key(pan_and_zoom_key, kc, held_keys) && !reaction_input_visible) {
                    cmd_zoom_on();
                    held_keys = reset_held_keys();
                } else if (check_key(brush_key, kc, held_keys) && !reaction_input_visible) {
                    cmd_zoom_off();
                    held_keys = reset_held_keys();
                }
            }).on("keyup", function() {
                held_keys = toggle_modifiers(modifier_keys, held_keys, d3.event.keyCode, false);
		o.shift_key_on = held_keys.shift;
            });

            function reset_held_keys() {
                return { command: false,
                         control: false,
                         option: false,
                         shift: false };
            }
            function toggle_modifiers(mod, held, kc, on_off) {
                for (var k in mod)
                    if (mod[k] == kc)
                        held[k] = on_off;
                return held;
            }
            function check_key(key, pressed, held) {
                if (key.key != pressed) return false;
                var mod = key.modifiers;
                if (mod === undefined)
                    mod = { control: false,
                            command: false,
                            option: false,
                            shift: false };
                for (var k in held) {
                    if (mod[k] === undefined) mod[k] = false;
                    if (mod[k] != held[k]) return false;
                }
                return true;
            }
        }
        // Commands
        function cmd_hide_show_input() {
            if (input.is_visible(o.reaction_input)) cmd_hide_input();
            else cmd_show_input();
        }
        function cmd_hide_input() {
            o.reaction_input.selection.style("display", "none");
            o.reaction_input.completely.input.blur();
            o.reaction_input.completely.hideDropDown();
        }
        function cmd_show_input() {
	    input.reload_at_selected(o.reaction_input, o.scale.x, o.scale.y, o.window_scale, 
				     o.window_translate, o.width, o.height, o.flux, 
				     o.drawn_reactions, o.cobra_reactions, new_reaction_for_metabolite);
        }
        function cmd_cycle_primary_metabolite() {
            // cmd_hide_input();
            // cycle_primary_key();
        }
        function cmd_left() {
            // cmd_hide_input();
            // rotate_reaction_id(o.selected_node.reaction_id, 'angle', 270*(Math.PI/180));
            // draw_specific_reactions_with_location(o.selected_node.reaction_id);
        }
        function cmd_right() {
            // cmd_hide_input();
            // rotate_reaction_id(o.selected_node.reaction_id, 'angle', 90*(Math.PI/180));
            // draw_specific_reactions_with_location(o.selected_node.reaction_id);
        }
        function cmd_up() {
            // cmd_hide_input();
            // rotate_reaction_id(o.selected_node.reaction_id, 'angle', 180*(Math.PI/180));
            // draw_specific_reactions_with_location(o.selected_node.reaction_id);
        }
        function cmd_down() {
            // cmd_hide_input();
            // rotate_reaction_id(o.selected_node.reaction_id, 'angle', 0);
            // draw_specific_reactions_with_location(o.selected_node.reaction_id);
        }
        function cmd_save() {
            console.log("Saving");
            utils.download_json(map_for_export(), "saved_map");
        }
        function cmd_load() {
            console.log("Loading");
            o.load_input_click_fn();
        }
	function cmd_load_flux() {
	    console.log("Loading flux");
	    o.load_flux_input_click_fn();
	}
	function cmd_show_beziers() {
	    o.show_beziers = true;
	    d3.select(this).text('Hide control points')
		.on('click', cmd_hide_beziers);
	    draw_everything();
	}
	function cmd_hide_beziers() {
	    o.show_beziers = false;
	    d3.select(this).text('Show control points')
		.on('click', cmd_show_beziers);
	    draw_everything();
	}
	function cmd_zoom_on() {
	    o.zoom_enabled = true;
	    enable_brush(false);
	    d3.select('#zoom-button').text('Enable select (v)')
		.on('click', cmd_zoom_off);
	}
	function cmd_zoom_off() {
	    o.zoom_enabled = false;
	    enable_brush(true);
	    d3.select('#zoom-button').text('Enable pan+zoom (z)')
		.on('click', cmd_zoom_on);
	}
    };
});
