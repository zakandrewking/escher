define(["vis/scaffold", "metabolic-map/utils", "builder/draw", "builder/input", "lib/d3", 
	"lib/complete.ly", "builder/build", "builder/DirectionArrow"],
       function(scaffold, utils, draw, input, d3, completely, build, DirectionArrow) {
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
	    starting_reaction: 'GLCtex',
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
            o.drawn_reactions = {};
            o.arrowheads_generated = [];
            o.default_reaction_color = '#505050';
            o.window_translate = {'x': 0, 'y': 0};
            o.window_scale = 1;
	    o.zoom_enabled = true;
	    o.metabolite_click_enabled = true;
	    o.shift_key_on = false;

	    // Check the cobra model
	    if (o.cobra_model) {
		// TODO better checks
		o.cobra_reactions = o.cobra_model.reactions;
		o.cofactors = o.cobra_model.cofactors;
	    }

	    // set up the svg
            var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                         o.margins, o.fill_screen);
            o.svg = out.svg;
            o.height = out.height;
            o.width = out.width;

            // set up menu and status bars
            o.menu = setup_menu(o.selection);
            o.status = setup_status(o.selection);

            // set up the reaction input with complete.ly
            o.reaction_input = setup_reaction_input(o.selection);

	    // set up the reaction direction arrow
	    o.direction_arrow = new DirectionArrow();

            // set up keyboard listeners
            setup_key_listeners();

	    // import map
	    var max_w = o.width, max_h = o.height;
	    if (o.map) {
		import_and_load_map(o.map, o.height, o.width);
	    } else {
		o.drawn_membranes = [];
		o.drawn_reactions = {};
		o.drawn_nodes = {};
		o.map_info = { max_map_w: o.width*10, max_map_h: o.height*10 };
		o.map_info.largest_ids = { reactions: -1,
					   nodes: -1,
					   segments: -1 };
		// set up svg and svg definitions
		o.scale = utils.define_scales(o.map_info.max_map_w, o.map_info.max_map_h,
					      o.width, o.height);
	    }

            o.defs = utils.setup_defs(o.svg, o.css);
	    var zoom_fn = function(ev) {
		o.window_translate = {'x': ev.translate[0], 'y': ev.translate[1]};
		o.window_scale = ev.scale;
		if (input.is_visible(o.reaction_input))
		    input.place_at_selected(o.reaction_input, o.scale.x, o.scale.y, 
					    o.window_scale, o.window_translate, 
					    o.width, o.height);
	    };
	    var out = utils.setup_zoom_container(o.svg, o.width, o.height, [0.05, 15],
						 zoom_fn,
						 function() {
						     return o.zoom_enabled;
						 });
	    // TODO fix like this http://jsfiddle.net/La8PR/5/
            o.sel = out.sel,
            o.zoom = out.zoom;

            var extent = {"x": o.width, "y": o.height},
		mouse_node = o.sel.append('rect')
		    .attr('id', 'mouse-node')
                    .attr("width", extent.x)
                    .attr("height", extent.y)
		    // .attr("transform",
		    // 	  "translate("+(-extent.x/2)+","+(-extent.y/2)+")")
                    .attr("style", "stroke:black;fill:none;")
                    .attr('pointer-events', 'all');

            o.sel.append('g')
                .attr('id', 'brush-container');
	    draw.setup_containers(o.sel);

            // setup selection box
            if (!o.map) {
		// Draw default reaction if no map is provided
		var start_coords = {'x': o.width*5, 'y': o.height*5};
                new_reaction_from_scratch(o.starting_reaction, start_coords);
		cmd_zoom_extent();
            } else {
		draw_everything();
	    }

	    // turn off loading message
            d3.select('#loading').style("display", "none");

            // definitions
            function setup_menu(selection) {
                var sel = selection.append("div").attr("id", "menu");
                new_button(sel, cmd_hide_show_input, "New reaction (/)");
                new_button(sel, cmd_save, "Save (^s)");
                o.load_input_click_fn = new_input(sel, load_map_for_file, "Load (^o)");
                o.load_flux_input_click_fn = new_input(sel, load_flux_for_file,
						       "Load flux (^f)");
		if (o.show_beziers)
		    new_button(sel, cmd_hide_beziers, "Hide control points");
		else
		    new_button(sel, cmd_show_beziers, "Show control points");
		if (o.zoom_enabled)
		    new_button(sel, cmd_zoom_off, "Enable select (v)", 'zoom-button');
		else
		    new_button(sel, cmd_zoom_on, "Enable pan+zoom (z)", 'zoom-button');
		
                new_button(sel, cmd_rotate_selected_nodes, "Rotate (r)");
                new_button(sel, cmd_delete_selected_nodes, "Delete (del)");
                new_button(sel, cmd_zoom_extent, "Zoom extent (^0)");
                new_button(sel, cmd_make_selected_node_primary, "Make primary metabolite (p)");
                new_button(sel, cmd_cycle_primary_node, "Cycle primary metabolite (c)");
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
                function new_button(s, fn, name, id) {
                    var b = s.append("button").attr("class", "command-button")
                            .text(name).on("click", fn);
		    if (id !== undefined) b.attr('id', id);
		    return b;
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
	    if (o.metabolite_click_enabled)
		return select_metabolite(this, d);
	}
	function node_dragstart() {
	    // silence other listeners
            d3.event.sourceEvent.stopPropagation();
	}
	function node_drag() {
	    var grabbed_id = this.parentNode.__data__.node_id,		    
                selected_ids = get_selected_node_ids(),
		nodes_to_drag = [];
	    if (selected_ids.indexOf(grabbed_id)==-1) { 
		nodes_to_drag.push(grabbed_id);
	    } else {
		nodes_to_drag = selected_ids;
	    }
	    var reaction_ids = [];
	    nodes_to_drag.forEach(function(node_id) {
		// update data
                var node = o.drawn_nodes[node_id],
		    displacement = { x: o.scale.x_size.invert(d3.event.dx),
				     y: o.scale.y_size.invert(d3.event.dy) },
		    updated = build.move_node_and_dependents(node, node_id, o.drawn_reactions, displacement);
		reaction_ids = utils.unique_concat([reaction_ids, updated.reaction_ids]);
	    });
	    draw_specific_nodes(nodes_to_drag);
	    draw_specific_reactions(reaction_ids);
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
	function brush_is_enabled() {
	    /** Returns a boolean for the on/off status of the brush

	     */
	    return d3.select('.brush').empty();
	}
	function enable_brush(on) {
	    /** Turn the brush on or off

	     */
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

        function new_reaction_from_scratch(starting_reaction, coords) {
	    /** Draw a reaction on a blank canvas.

	     starting_reaction: bigg_id for a reaction to draw.
	     coords: coordinates to start drawing

	     */
	    
            // If reaction id is not new, then return:
	    for (var reaction_id in o.drawn_reactions) {
		if (o.drawn_reactions[reaction_id].abbreviation == starting_reaction) {             
		    console.warn('reaction is already drawn');
                    return;
		}
            }

            // set reaction coordinates and angle
            // be sure to copy the reaction recursively
            var cobra_reaction = utils.clone(o.cobra_reactions[starting_reaction]);

	    // create the first node
	    for (var metabolite_id in cobra_reaction.metabolites) {
		var metabolite = cobra_reaction.metabolites[metabolite_id];
		if (metabolite.coefficient < 0) {
		    var selected_node_id = ++o.map_info.largest_ids.nodes,
			label_d = { x: 30, y: 10 },
			selected_node = { connected_segments: [],
				     x: coords.x,
				     y: coords.y,
				     node_is_primary: true,
				     compartment_name: metabolite.compartment,
				     label_x: coords.x + label_d.x,
				     label_y: coords.y + label_d.y,
				     metabolite_name: metabolite.name,
				     bigg_id: metabolite.bigg_id,
				     bigg_id_compartmentalized: metabolite.bigg_id_compartmentalized,
				     node_type: 'metabolite' },
			new_nodes = {};
		    new_nodes[selected_node_id] = selected_node;
		    utils.extend(o.drawn_nodes, new_nodes);
		    draw_specific_nodes([selected_node_id]);
		    break;
		}
	    }
	    
	    // draw the reaction
	    new_reaction_for_metabolite(starting_reaction, selected_node_id);
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
					 selected_node_id, utils.clone(selected_node),
					 o.map_info.largest_ids, o.cofactors);
	    utils.extend(o.drawn_reactions, out.new_reactions);
	    // remove the selected node so it can be updated
	    delete o.drawn_nodes[selected_node_id];
	    utils.extend(o.drawn_nodes, out.new_nodes);

	    // draw new reaction and (TODO) select new metabolite
	    draw_specific_nodes(Object.keys(out.new_nodes));
	    draw_specific_reactions(Object.keys(out.new_reactions));

	    // select new primary metabolite
	    for (var node_id in out.new_nodes) {
		var node = out.new_nodes[node_id];
		if (node.node_is_primary && node_id!=selected_node_id) {
		    select_metabolite_with_id(node_id);
		    var new_coords = { x: node.x, y: node.y };
		    translate_off_screen(new_coords);
		}
	    }
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
            var margin = 40, // pixels
		current = {'x': {'min': - o.window_translate.x / o.window_scale + margin / o.window_scale,
                                 'max': - o.window_translate.x / o.window_scale + (o.width-margin) / o.window_scale },
                           'y': {'min': - o.window_translate.y / o.window_scale + margin / o.window_scale,
                                 'max': - o.window_translate.y / o.window_scale + (o.height-margin) / o.window_scale } };
            if (o.scale.x(coords.x) < current.x.min) {
                o.window_translate.x = o.window_translate.x - (o.scale.x(coords.x) - current.x.min) * o.window_scale;
                go();
            } else if (o.scale.x(coords.x) > current.x.max) {
                o.window_translate.x = o.window_translate.x - (o.scale.x(coords.x) - current.x.max) * o.window_scale;
                go();
            }
            if (o.scale.y(coords.y) < current.y.min) {
                o.window_translate.y = o.window_translate.y - (o.scale.y(coords.y) - current.y.min) * o.window_scale;
                go();
            } else if (o.scale.y(coords.y) > current.y.max) {
                o.window_translate.y = o.window_translate.y - (o.scale.y(coords.y) - current.y.max) * o.window_scale;
                go();
            }

	    // definitions
            function go() {
                o.zoom.translate([o.window_translate.x, o.window_translate.y]);
                o.zoom.scale(o.window_scale);
                o.sel.transition()
                    .attr('transform', 'translate('+o.window_translate.x+','+o.window_translate.y+')scale('+o.window_scale+')');
            }
        }

	// -------------------------------------------------------------------------------
	// node interaction
	
        function get_coords_for_node(node_id) {
            var node = o.drawn_nodes[node_id],
                coords = {'x': node.x, 'y': node.y};
            return coords;
        }
	function get_selected_node_ids() {
	    var selected_node_ids = [];
	    d3.select('#nodes')
		.selectAll('.selected')
		.each(function(d) { selected_node_ids.push(d.node_id); });
	    return selected_node_ids;
	}
	function get_selected_nodes() {
	    var selected_nodes = {};
	    d3.select('#nodes')
		.selectAll('.selected')
		.each(function(d) { selected_nodes[parseInt(d.node_id)] = o.drawn_nodes[d.node_id]; });
	    return selected_nodes;
	}	
	function select_metabolite_with_id(node_id) {
	    var node_selection = o.sel.select('#nodes').selectAll('.node');
	    node_selection.classed("selected", function(d) {
		return parseInt(d.node_id) == parseInt(node_id);
	    });
	    if (input.is_visible(o.reaction_input)) cmd_show_input();
	}
        function select_metabolite(sel, d) {
	    var node_selection = o.sel.select('#nodes').selectAll('.node'), 
		shift_key_on = o.shift_key_on;
	    if (shift_key_on) d3.select(sel.parentNode)
		.classed("selected", !d3.select(sel.parentNode).classed("selected"));
            else node_selection.classed("selected", function(p) { return d === p; });
	    var selected_nodes = d3.select('.selected'),
		count = 0;
	    selected_nodes.each(function() { count++; });
	    if (input.is_visible(o.reaction_input)) {
		if (count == 1) cmd_show_input();
		else cmd_hide_input();
	    }
	}

        // ---------------------------------------------------------------------
        // KEYBOARD

        function setup_key_listeners() {
	    /** Assign keys for commands.

	     */
            var held_keys = reset_held_keys(),
                modifier_keys = { command: 91,
                                  control: 17,
                                  option: 18,
                                  shift: 16 },
		assigned_keys = {
                    hide_show_input_key: { key: 191, // forward slash '/'
					   fn: cmd_hide_show_input },
                    save_key: { key: 83, modifiers: { control: true }, // ctrl-s
				fn: cmd_save },
                    // save_key_cmd: { key: 83, modifiers: { command: true }, // command-s
		    // 		       fn: cmd_save },
                    load_key: { key: 79, modifiers: { control: true }, // ctrl-o
				fn: cmd_load },
		    load_flux_key: { key: 70, modifiers: { control: true }, // ctrl-f
				     fn: cmd_load_flux },
		    pan_and_zoom_key: { key: 90, // z 
					fn: cmd_zoom_on,
					ignore_with_input: true },
		    brush_key: { key: 86, // v
				 fn: cmd_zoom_off,
				 ignore_with_input: true },
		    rotate_key: { key: 82, // r
				  fn: cmd_rotate_selected_nodes,
				  ignore_with_input: true },
		    delete_key: { key: 8, // del
				  fn: cmd_delete_selected_nodes,
				  ignore_with_input: true },
		    extent_key: { key: 48, modifiers: { control: true }, // ctrl-0
				  fn: cmd_zoom_extent },
		    make_primary_key: { key: 80, // p
					 fn: cmd_make_selected_node_primary,
					 ignore_with_input: true },
		    cycle_primary_key: { key: 67, // c
					 fn: cmd_cycle_primary_node,
					 ignore_with_input: true }
		};

            d3.select(window).on("keydown", function() {
                var kc = d3.event.keyCode,
                    reaction_input_visible = input.is_visible(o.reaction_input);

                held_keys = toggle_modifiers(modifier_keys, held_keys, kc, true);
		o.shift_key_on = held_keys.shift;
		for (var key_id in assigned_keys) {
		    var assigned_key = assigned_keys[key_id];
		    if (check_key(assigned_key, kc, held_keys)) {
			if (!(assigned_key.ignore_with_input && reaction_input_visible)) {
			    assigned_key.fn();
			    // prevent browser action
			    d3.event.preventDefault();
			}
			held_keys = reset_held_keys();
		    }
		}
            }).on("keyup", function() {
                held_keys = toggle_modifiers(modifier_keys, held_keys,
					     d3.event.keyCode, false);
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
	
	function add_escape_listener(callback) {
	    /** Call the callback when the escape key is pressed, then
	     unregisters the listener.

	     */
	    var selection = d3.select(window);
	    selection.on('keydown.esc', function() {
		if (d3.event.keyCode==27) { // esc
		    callback();
		    selection.on('keydown.esc', null);
		}
	    });
	    return { clear: function() { selection.on('keydown.esc', null); } };
	}

	//----------------------------------------------------------------------
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
	function cmd_rotate_selected_nodes() {
	    /** Request a center, then listen for rotation, and rotate nodes.

	     */
	    var selected_nodes = get_selected_nodes();
	    if (selected_nodes.length < 1) return console.warn('No nodes selected');
	    
	    var zoom_on = o.zoom_enabled,
		click_on = o.metabolite_click_enabled,
		brush_on = brush_is_enabled(),
		turn_everything_on = function() {
		    // turn the zoom and click back on 
		    o.zoom_enabled = zoom_on;
		    o.metabolite_click_enabled = click_on;
		    enable_brush(brush_on);
		};
	    o.zoom_enabled = false;
	    o.metabolite_click_enabled = false;
	    enable_brush(false);

	    choose_center(function(center) {
		listen_for_rotation(center, function(angle) {
		    // console.log(angle, center);
		    // console.log(selected_nodes);
		    var updated = build.rotate_selected_nodes(selected_nodes, o.drawn_reactions,
							      angle, center);
		    draw_specific_nodes(updated.node_ids);
		    draw_specific_reactions(updated.reaction_ids);
		}, turn_everything_on, turn_everything_on);
	    }, turn_everything_on);

	    // definitions
	    function choose_center(callback, callback_canceled) {
		console.log('Choose center');
		set_status('Choose a node or point to rotate around.');
		var selection_node = d3.selectAll('.node-circle'),
		    selection_background = d3.selectAll('#mouse-node'),
		    escape_listener = add_escape_listener(function() {
			console.log('choose_center escape');
			selection_node.on('mousedown.center', null);
			selection_background.on('mousedown.center', null);
			set_status('');
			callback_canceled();
		    });
		// if the user clicks a metabolite node
		selection_node.on('mousedown.center', function(d) {		    
		    console.log('mousedown.center');
		    // turn off the click listeners to prepare for drag
		    selection_node.on('mousedown.center', null);
		    selection_background.on('mousedown.center', null);
		    set_status('');
		    escape_listener.clear();
		    // find the location of the clicked metabolite
		    var center = { x: d.x, y: d.y };
		    callback(center); 
		});
		// if the user clicks a point
		selection_background.on('mousedown.center', function() {
		    console.log('mousedown.center');
		    // turn off the click listeners to prepare for drag
		    selection_node.on('mousedown.center', null);
		    selection_background.on('mousedown.center', null);
		    set_status('');
		    escape_listener.clear();
		    // find the point on the background node where the user clicked
		    var center = { x: o.scale.x_size.invert(d3.mouse(this)[0]), 
				   y: o.scale.y_size.invert(d3.mouse(this)[1]) };
		    callback(center); 
		});
	    }
	    function listen_for_rotation(center, callback, callback_finished, 
					 callback_canceled) {
		console.log('listen_for_rotation');
		set_status('Drag to rotate.');
		o.zoom_enabled = false;
		var angle = Math.PI/2,
		    selection = d3.selectAll('#mouse-node'),
		    drag = d3.behavior.drag(),
		    escape_listener = add_escape_listener(function() {
			console.log('listen_for_rotation escape');
			drag.on('drag.rotate', null);
			drag.on('dragend.rotate', null);
			set_status('');
			callback_canceled();
		    });
		// drag.origin(function() { return point_of_grab; });
		drag.on("drag.rotate", function() { 
		    // console.log('drag.rotate');
		    callback(angle_for_event({ dx: o.scale.x_size.invert(d3.event.dx), 
					       dy: o.scale.y_size.invert(d3.event.dy) },
					     { x: o.scale.x_size.invert(d3.mouse(this)[0]),
					       y: o.scale.y_size.invert(d3.mouse(this)[1]) },
					     center));
		}).on("dragend.rotate", function() {
		    console.log('dragend.rotate');
		    drag.on('drag.rotate', null);
		    drag.on('dragend.rotate', null);
		    set_status('');
		    escape_listener.clear();
		    callback_finished();
		});
		selection.call(drag);

		// definitions
		function angle_for_event(displacement, point, center) {
		    var gamma =  Math.atan2((point.x - center.x), (center.y - point.y)),
			beta = Math.atan2((point.x - center.x + displacement.dx), 
					 (center.y - point.y - displacement.dy)),
			angle = beta - gamma;
		    return angle;
		}
	    }
	}
	function cmd_delete_selected_nodes() {
	    /** Delete the selected nodes and associated segments and reactions.

	     */
	    var selected_nodes = get_selected_nodes();
	    if (selected_nodes.length < 1) return console.warn('No nodes selected');

	    // for each node
	    var updated_reaction_ids = [], updated_node_ids = [];
	    for (var node_id in selected_nodes) {
		var node = selected_nodes[node_id];

		// delete associated segments and reactions	    
		node.connected_segments.forEach(function(segment_obj) {
		    var reaction = o.drawn_reactions[segment_obj.reaction_id];

		    // if the reaction has already been deleted (for the last node)
		    if (reaction===undefined) return;

		    // updated connected nodes, and delete the segments
		    var segment = reaction.segments[segment_obj.segment_id];
		    if (node_id==segment.to_node_id) {
			var connected_segments = o.drawn_nodes[segment.from_node_id].connected_segments;
			o.drawn_nodes[segment.from_node_id].connected_segments = connected_segments.filter(function(so) {
			    return so.segment_id != segment_obj.segment_id;				
			});
		    } else if (node_id==segment.from_node_id) {
			var connected_segments = o.drawn_nodes[segment.to_node_id].connected_segments;
			 o.drawn_nodes[segment.to_node_id].connected_segments = connected_segments.filter(function(so) {
			    return so.segment_id != segment_obj.segment_id;				
			});
		    }
		    delete reaction.segments[segment_obj.segment_id];
		    // delete a reaction with no segments
		    if (Object.keys(reaction.segments).length == 0)
			delete o.drawn_reactions[segment_obj.reaction_id];
		    if (updated_reaction_ids.indexOf(segment_obj.reaction_id) < 0)
			updated_reaction_ids.push(segment_obj.reaction_id);
		});
		// delete nodes
		delete o.drawn_nodes[node_id];
		updated_node_ids.push(node_id);
	    }
	    
	    // redraw
	    draw_everything();
	    // draw_specific_reactions(updated_reaction_ids);
	    // draw_specific_nodes(updated_node_ids);
	}

	function cmd_zoom_extent() {
	    // get the extent of the nodes
	    var min = { x: null, y: null }, // TODO make infinity?
		max = { x: null, y: null }; 
	    for (var node_id in o.drawn_nodes) {
		var node = o.drawn_nodes[node_id];
		if (min.x===null) min.x = o.scale.x(node.x);
		if (min.y===null) min.y = o.scale.y(node.y);
		if (max.x===null) max.x = o.scale.x(node.x);
		if (max.y===null) max.y = o.scale.y(node.y);

		min.x = Math.min(min.x, o.scale.x(node.x));
		min.y = Math.min(min.y, o.scale.y(node.y));
		max.x = Math.max(max.x, o.scale.x(node.x));
		max.y = Math.max(max.y, o.scale.y(node.y));
	    }
	    // set the zoom
            var margin = 100,
		new_zoom = Math.min((o.width - margin*2) / (max.x - min.x),
				    (o.height - margin*2) / (max.y - min.y)),
		new_pos = { x: - (min.x * new_zoom) + margin + ((o.width - margin*2 - (max.x - min.x)*new_zoom) / 2),
			    y: - (min.y * new_zoom) + margin + ((o.height - margin*2 - (max.y - min.y)*new_zoom) / 2) };
	    o.window_scale = new_zoom;
            o.window_translate = new_pos;
            go();

	    // definitions
            function go() {
                o.zoom.translate([o.window_translate.x, o.window_translate.y]);
                o.zoom.scale(o.window_scale);
                o.sel.transition()
                    .attr('transform', 'translate('+o.window_translate.x+','+o.window_translate.y+')scale('+o.window_scale+')');
            };
	}

	function cmd_make_selected_node_primary() {
	    var selected_nodes = get_selected_nodes();	    
	    // can only have one selected
	    if (Object.keys(selected_nodes).length != 1)
		return console.error('Only one node can be selected');
	    // get the first node
	    var node_id = Object.keys(selected_nodes)[0],
		node = selected_nodes[node_id];
	    // make it primary
	    o.drawn_nodes[node_id].node_is_primary = true;
	    var nodes_to_draw = [node_id];
	    // make the other reactants or products secondary
	    // 1. Get the connected anchor nodes for the node
	    var connected_anchor_ids = [];
	    o.drawn_nodes[node_id].connected_segments.forEach(function(segment_info) {
		var segment = o.drawn_reactions[segment_info.reaction_id].segments[segment_info.segment_id];
		connected_anchor_ids.push(segment.from_node_id==node_id ?
				       segment.to_node_id : segment.from_node_id);
	    });
	    // 2. find nodes connected to the anchor that are metabolites
	    connected_anchor_ids.forEach(function(anchor_id) {
		var segments = [];
		o.drawn_nodes[anchor_id].connected_segments.forEach(function(segment_info) {
		    var segment = o.drawn_reactions[segment_info.reaction_id].segments[segment_info.segment_id],
			conn_met_id = segment.from_node_id == anchor_id ? segment.to_node_id : segment.from_node_id,
			conn_node = o.drawn_nodes[conn_met_id];
		    if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
			conn_node.node_is_primary = false;
			nodes_to_draw.push(conn_met_id);
		    }
		});
	    });
	    // draw the nodes
	    draw_specific_nodes(nodes_to_draw);
	}

	function cmd_cycle_primary_node() {
	    var selected_nodes = get_selected_nodes();
	    // get the first node
	    var node_id = Object.keys(selected_nodes)[0],
		node = selected_nodes[node_id];
	    // make the other reactants or products secondary
	    // 1. Get the connected anchor nodes for the node
	    var connected_anchor_ids = [], reactions_to_draw;
	    o.drawn_nodes[node_id].connected_segments.forEach(function(segment_info) {
		reactions_to_draw = [segment_info.reaction_id];
		var segment = o.drawn_reactions[segment_info.reaction_id].segments[segment_info.segment_id];
		connected_anchor_ids.push(segment.from_node_id==node_id ?
				       segment.to_node_id : segment.from_node_id);
	    });
	    // can only be connected to one anchor
	    if (connected_anchor_ids.length != 1)
		return console.error('Only connected nodes with a single reaction can be selected');
	    var connected_anchor_id = connected_anchor_ids[0];
	    // 2. find nodes connected to the anchor that are metabolites
	    var related_node_ids = [node_id];
	    var segments = [];
	    o.drawn_nodes[connected_anchor_id].connected_segments.forEach(function(segment_info) { // deterministic order
		var segment = o.drawn_reactions[segment_info.reaction_id].segments[segment_info.segment_id],
		    conn_met_id = segment.from_node_id == connected_anchor_id ? segment.to_node_id : segment.from_node_id,
		    conn_node = o.drawn_nodes[conn_met_id];
		if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
		    related_node_ids.push(String(conn_met_id));
		}
	    });
	    // 3. make sure they only have 1 reaction connection, and check if
	    // they match the other selected nodes
	    for (var i=0; i<related_node_ids.length; i++) {
		if (o.drawn_nodes[related_node_ids[i]].connected_segments.length > 1)
		    return console.error('Only connected nodes with a single reaction can be selected');
	    }
	    for (var a_selected_node_id in selected_nodes) {
		if (a_selected_node_id!=node_id && related_node_ids.indexOf(a_selected_node_id) == -1)
		    return console.warn('Selected nodes are not on the same reaction');
	    }
	    // 4. change the primary node, and change coords, label coords, and beziers
	    var nodes_to_draw = [],
		last_i = related_node_ids.length - 1,
		last_node = o.drawn_nodes[related_node_ids[last_i]],
		last_is_primary = last_node.node_is_primary,
		last_coords = { x: last_node.x, y: last_node.y,
				label_x: last_node.label_x, label_y: last_node.label_y },
		last_segment_info = last_node.connected_segments[0], // guaranteed above to have only one
		last_segment = o.drawn_reactions[last_segment_info.reaction_id].segments[last_segment_info.segment_id],
		last_bezier = { b1: last_segment.b1, b2: last_segment.b2 };
	    related_node_ids.forEach(function(related_node_id) {
		var node = o.drawn_nodes[related_node_id],
		    this_is_primary = node.node_is_primary,
		    these_coords = { x: node.x, y: node.y,
				     label_x: node.label_x, label_y: node.label_y },
		    this_segment_info = node.connected_segments[0],
		    this_segment = o.drawn_reactions[this_segment_info.reaction_id].segments[this_segment_info.segment_id],
		    this_bezier = { b1: this_segment.b1, b2: this_segment.b2 };
		node.node_is_primary = last_is_primary;
		if (node.node_is_primary) select_metabolite_with_id(related_node_id);
		node.x = last_coords.x; node.y = last_coords.y;
		node.label_x = last_coords.label_x; node.label_y = last_coords.label_y;
		this_segment.b1 = last_bezier.b1; this_segment.b2 = last_bezier.b2;
		last_is_primary = this_is_primary;
		last_coords = these_coords;
		last_bezier = this_bezier;
		nodes_to_draw.push(related_node_id);
	    });
	    // 5. cycle the connected_segments array so the next time, it cycles differently
	    var old_connected_segments = o.drawn_nodes[connected_anchor_id].connected_segments,
		last_i = old_connected_segments.length - 1,
		new_connected_segments = [old_connected_segments[last_i]];
	    old_connected_segments.forEach(function(segment, i) {
		if (last_i==i) return;
		new_connected_segments.push(segment);
	    });
	    o.drawn_nodes[connected_anchor_id].connected_segments = new_connected_segments;	    
	    // 6. draw the nodes
	    draw_specific_nodes(nodes_to_draw);
	    draw_specific_reactions(reactions_to_draw);
	}
    };
});
