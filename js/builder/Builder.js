define(["vis/utils","builder/Input", "lib/d3", "lib/complete.ly", "builder/build", "builder/DirectionArrow", "builder/UndoStack", "builder/ZoomContainer", "builder/Behavior", "builder/Scale", "builder/Map", "builder/KeyManager"], function(utils, Input, d3, completely, build, DirectionArrow, UndoStack, ZoomContainer, Behavior, Scale, Map, KeyManager) {
    // NOTE
    // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
    // only necessary for selectAll()
    // .datum(function() {
    //     return this.parentNode.__data__;
    // })


    var Builder = utils.make_class();
    // instance methods
    Builder.prototype = { init: init };

    return Builder;

    // definitions
    function init(options) {
	// set defaults
	var o = utils.set_options(options, {
	    margins: {top: 10, right: 10, bottom: 10, left: 20},
	    selection: d3.select("body").append("div"),
	    selection_is_svg: false,
	    fillScreen: false,
	    update_hook: false,
	    map_path: null,
	    map_data: null,
	    cobra_model_path: null,
	    cobra_model: null,
	    css_path: null,
	    css: null,
	    flux_path: null,
	    flux: null,
	    flux2_path: null,
	    flux2: null,
	    node_data: null,
	    node_data_path: null,
	    node_data_style: 'ColorSize',
	    node_data_range: [0, 100],
	    show_beziers: false,
	    debug: false,
	    starting_reaction: 'GLCtex',
	    reaction_arrow_displacement: 35 });

	if (o.selection_is_svg) {
	    console.error("Builder does not support placement within svg elements");
	    return null;
	}

	var files_to_load = [{ file: o.map_path, value: o.map_data, callback: set_map_data },
			     { file: o.cobra_model_path, value: o.cobra_model, callback: set_cobra_model },
			     { file: o.css_path, value: o.css, callback: set_css },
			     { file: o.flux_path, value: o.flux,
			       callback: function(e, f) { set_flux(e, f, 0); } },
			     { file: o.flux2_path, value: o.flux2,
			       callback: function(e, f) { set_flux(e, f, 1); } },
			     { file: o.node_data_path, value: o.node_data, callback: set_node_data } ];
	utils.load_files(files_to_load, setup);
	return {};

	// Definitions

	// ---------------------------------------------------------------------
	// Setup

	function set_map_data(error, map_data) {
	    if (error) console.warn(error);
	    o.map_data = map_data;
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
	function set_node_data(error, data) {
	    if (error) console.warn(error);
	    o.node_data = data;
	};
	function setup() {
	    /** Load the svg container and draw a loaded map if provided.
	     
	     */

	    // Begin with some definitions
	    o.drawn_reactions = {};
	    o.arrowheads_generated = [];
	    o.default_reaction_color = '#505050';
	    o.window_translate = {'x': 0, 'y': 0};
	    o.window_scale = 1;
	    o.metabolite_click_enabled = true;
	    o.shift_key_on = false;
	    o.default_angle = 90; // degrees

	    // Check the cobra model
	    if (o.cobra_model) {
		// TODO better checks
		o.cobra_reactions = o.cobra_model.reactions;
		o.cofactors = o.cobra_model.cofactors;
	    }

	    // set up the svg
	    var out = utils.setup_svg(o.selection, o.selection_is_svg,
					 o.margins, o.fill_screen),
		svg = out.svg,
		height = out.height,
		width = out.width;

	    // set up the defs
	    utils.setup_defs(svg, o.css);

	    // se up the zoom container
	    var zoom_fn = function(ev) {
		o.window_translate = {'x': ev.translate[0], 'y': ev.translate[1]};
		o.window_scale = ev.scale;
		if (input.is_visible) input.place_at_selected(o.reaction_input, o.scale.x, o.scale.y, 
							      o.window_scale, o.window_translate, 
							      o.width, o.height);
	    };
	    var zoom_container = new ZoomContainer(svg, width, height, [0.05, 15], zoom_fn),
		zoomed_sel = zoom_container.zoomed_sel;

	    var max_w = width, max_h = height, scale, map;
	    if (o.map_data) {
		// import map
		out = Map.from_data(o.map_data, height, width, o.flux, o.node_data);
		// reset zoom
		if (o.zoom) {
		    window_translate.x = 0; window_translate.y = 0; window_scale = 1.0;
		    zoom_container.translate([window_translate.x, window_translate.y]);
		    zoom_container.scale(o.window_scale);
		    sel.attr('transform', 'translate('+o.window_translate.x+','+o.window_translate.y+')scale('+o.window_scale+')');
		}
		map = out.map;
		scale = out.scale;
	    } else {
		// new map
		map = new Map(zoomed_sel);
		map.map_info = { max_map_w: width * 10, max_map_h: height * 10 };
		map.map_info.largest_ids = { reactions: -1,
					     nodes: -1,
					     segments: -1 };
		scale = Scale(map.map_info.max_map_w, map.map_info.max_map_h,
			      width, height);
	    }

	    // set up the reaction input with complete.ly
	    var reaction_input = setup_reaction_input(o.selection);

	    var extent = {"x": o.width, "y": o.height},
		mouse_node = zoomed_sel.append('rect')
		    .attr('id', 'mouse-node')
		    .attr("width", extent.x)
		    .attr("height", extent.y)
	    // .attr("transform",
	    // 	  "translate("+(-extent.x/2)+","+(-extent.y/2)+")")
		    .attr("style", "stroke:black;fill:none;")
		    .attr('pointer-events', 'all');

	    zoomed_sel.append('g')
		.attr('id', 'brush-container');

	    // make the undo/redo stack
	    var undo_stack = new UndoStack();

	    // set up the reaction direction arrow
	    var direction_arrow = new DirectionArrow(zoomed_sel);
	    direction_arrow.set_rotation(o.default_angle);

	    // make a behavior object
	    var behavior = new Behavior(map, scale, undo_stack);

	    // make key manager
	    var key_manager = new KeyManager();

	    // setup selection box
	    if (!o.map_data) {
		// Draw default reaction if no map is provided
		var start_coords = {'x': o.width*5, 'y': o.height*5};
		map.new_reaction_from_scratch(o.starting_reaction, start_coords);
		zoom_container.zoom_extent(200);
	    } else {
		map.draw_everything();
		map.zoom_extent(200);
	    }

	    // set up menu and status bars
	    var menu = setup_menu(o.selection, map, key_manager),
		status = setup_status(o.selection);

	    // turn off loading message
	    d3.select('#loading').style("display", "none");

	    // definitions
	    function setup_menu(selection, zoom_container, key_manager) {
		var sel = selection.append("div").attr("id", "menu");
		new_button(sel, cmd_hide_show_input, "New reaction (/)");
		new_button(sel, cmd_save, "Save (^s)");
		new_button(sel, cmd_save_svg, "Export SVG (^Shift s)");
		key_manager.load_input_click_fn = new_input(sel, load_map_for_file, "Load (^o)");
		key_manager.load_flux_input_click_fn = new_input(sel, load_flux_for_file,
								 "Load flux (^f)");
		new_input(sel, load_node_data_for_file, "Load node data");
		if (o.show_beziers)
		    new_button(sel, cmd_hide_beziers, "Hide control points (b)", 'bezier-button');
		else
		    new_button(sel, cmd_show_beziers, "Show control points (b)", 'bezier-button');
		if (zoom_container.zoom_enabled())
		    new_button(sel, cmd_zoom_off, "Enable select (v)", 'zoom-button');
		else
		    new_button(sel, cmd_zoom_on, "Enable pan+zoom (z)", 'zoom-button');
		
		new_button(sel, cmd_rotate_selected_nodes, "Rotate (r)");
		new_button(sel, cmd_delete_selected_nodes, "Delete (del)");
		new_button(sel, cmd_zoom_extent, "Zoom extent (^0)");
		new_button(sel, cmd_make_selected_node_primary, "Make primary metabolite (p)");
		new_button(sel, cmd_cycle_primary_node, "Cycle primary metabolite (c)");
		new_button(sel, cmd_direction_arrow_left, "<");
		new_button(sel, cmd_direction_arrow_up, "^");
		new_button(sel, cmd_direction_arrow_down, "v");
		new_button(sel, cmd_direction_arrow_right, ">");
		new_button(sel, cmd_undo, "Undo (^z)");
		new_button(sel, cmd_redo, "Redo (^Shift z)");
		return sel;

		// definitions
		function load_map_for_file(error, map_data) {
		    if (error) console.warn(error);
		    out = import_and_load_map(map_data);
		    var map = out.map, scale = out.scale;
		    map.reset();
		    map.draw_everything();
		}
		function load_flux_for_file(error, data) {
		    set_flux(error, data, 0);
		    map.apply_flux_to_map();
		    map.draw_everything();
		}
		function load_node_data_for_file(error, data) {
		    set_node_data(error, data);
		    map.apply_node_data_to_map();
		    map.draw_everything();
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
    };
});
