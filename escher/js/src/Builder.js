define(["utils", "Input", "ZoomContainer", "Map", "CobraModel", "Brush", "CallbackManager"], function(utils, Input, ZoomContainer, Map, CobraModel, Brush, CallbackManager) {
    // NOTE
    // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
    // only necessary for selectAll()
    // .datum(function() {
    //     return this.parentNode.__data__;
    // })

    var Builder = utils.make_class();
    Builder.prototype = { init: init,
			  reload_builder: reload_builder,
			  brush_mode: brush_mode,
			  zoom_mode: zoom_mode,
			  _setup_menu: _setup_menu,
			  _setup_status: _setup_status,
			  _setup_modes: _setup_modes,
			  _get_keys: _get_keys };

    return Builder;

    // definitions
    function init(options) {
	// set defaults
	var o = utils.set_options(options, {
	    margins: {top: 5, right: 5, bottom: 5, left: 5},
	    selection: d3.select("body").append("div"),
	    selection_is_svg: false,
	    fillScreen: false,
	    enable_editing: true,
	    on_load: null,
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
	    node_data: null,
	    node_data_path: null,
	    node_data_style: 'ColorSize', // empty value: null
	    show_beziers: false,
	    debug: false,
	    starting_reaction: 'GLCtex', // empty value: null
	    reaction_arrow_displacement: 35 });
	
	// TODO make each option is neither {}, undefined, nor null
	// for all cases, set to null to boolean(option) === false


	if (o.selection_is_svg) {
	    // TODO fix this
	    console.error("Builder does not support placement within svg elements");
	    return null;
	}

	this.o = o;
	var files_to_load = [{ file: o.map_path, value: o.map,
			       callback: set_map_data },
			     { file: o.cobra_model_path, value: o.cobra_model,
			       callback: set_cobra_model },
			     { file: o.css_path, value: o.css,
			       callback: set_css },
			     { file: o.flux_path, value: o.flux,
			       callback: function(e, f) { set_flux.call(this, e, f, 0); } },
			     { file: o.flux2_path, value: o.flux2,
			       callback: function(e, f) { set_flux.call(this, e, f, 1); } },
			     { file: o.node_data_path, value: o.node_data,
			       callback: set_node_data } ];
	utils.load_files(this, files_to_load, reload_builder);

	// definitions
	function set_map_data(error, map_data) {
	    if (error) console.warn(error);
	    this.o.map_data = map_data;
	}
	function set_cobra_model(error, cobra_model) {
	    if (error) console.warn(error);
	    this.o.cobra_model = cobra_model;
	}
	function set_css(error, css) {
	    if (error) console.warn(error);
	    this.o.css = css;
	}
	function set_flux(error, flux, index) {
	    if (error) console.warn(error);
	    if (index==0) this.o.flux = flux;
	    else if (index==1) this.o.flux2 = flux;
	}
	function set_node_data(error, data) {
	    if (error) console.warn(error);
	    this.o.node_data = data;
	}
    }

    // Definitions
    function reload_builder() {
	/** Load the svg container and draw a loaded map if provided.
	 
	 */

	// Begin with some definitions
	var metabolite_click_enabled = true,
	    shift_key_on = false;

	// set up this callback manager
	this.callback_manager = CallbackManager();

	// Check the cobra model
	var cobra_model = null;
	if (this.o.cobra_model!==null) {	    
	    // TODO better checks
	    cobra_model = CobraModel(this.o.cobra_model.reactions, this.o.cobra_model.cofactors);
	} else {
	    console.warn('No cobra model was loaded.');
	}

	// remove the old builder
	utils.remove_child_nodes(this.o.selection);

	// set up the svg
	var out = utils.setup_svg(this.o.selection, this.o.selection_is_svg,
				  this.o.margins, this.o.fill_screen),
	    svg = out.svg,
	    height = out.height,
	    width = out.width;

	// set up the defs
	var defs = utils.setup_defs(svg, this.o.css);

	// se up the zoom container
	this.zoom_container = new ZoomContainer(svg, width, height, [0.05, 15]);
	var zoomed_sel = this.zoom_container.zoomed_sel;

	var max_w = width, max_h = height, scale;
	if (this.o.map_data!==null) {
	    // import map
	    this.map = Map.from_data(this.o.map_data, zoomed_sel, defs, this.zoom_container,
				height, width, this.o.flux, this.o.node_data, this.o.node_data_style,
				cobra_model);
	    this.zoom_container.reset();
	} else {
	    // new map
	    this.map = new Map(zoomed_sel, defs, this.zoom_container,
			  height, width, this.o.flux, this.o.node_data, this.o.node_data_style,
			  cobra_model);
	}

	// set up the reaction input with complete.ly
	this.reaction_input = Input(this.o.selection, this.map, this.zoom_container);

	if (this.o.enable_editing) {
	    // setup the Brush
	    this.brush = new Brush(zoomed_sel, false, this.map, '.canvas-group');

	    // setup the modes
	    this._setup_modes(this.map, this.brush, this.zoom_container);
	
	    // make key manager
	    var keys = this._get_keys(this.map, this.reaction_input, this.brush);
	    this.map.key_manager.assigned_keys = keys;
	    // set up menu and status bars
	    var menu = this._setup_menu(this.o.selection, this.map, this.zoom_container, this.map.key_manager, keys),
		status = this._setup_status(this.o.selection, this.map);
	}
	// tell the key manager about the reaction input
	this.map.key_manager.reaction_input = this.reaction_input;
	// make sure the key manager remembers all those changes
	this.map.key_manager.update();
	
	// setup selection box
	if (this.o.map_data!==null) {
	    this.map.draw_everything();
	    this.map.zoom_extent_canvas();
	} else {
	    if (this.o.starting_reaction!==null) {
		// Draw default reaction if no map is provided
		var start_coords = { x: this.map.scale.x.invert(width/2),
				     y: this.map.scale.x.invert(height/4) };
		this.map.new_reaction_from_scratch(this.o.starting_reaction, start_coords);
		this.map.zoom_extent_nodes(300, 'nodes');
	    } else {
		this.map.zoom_extent_canvas();
	    }
	}

	if (this.o.enable_editing) {
	    // start in zoom mode
	    this.zoom_mode();
	} else {
	    // turn off the behaviors
	    this.map.behavior.turn_everything_off();
	    this.map.draw_everything();
	}

	// turn off loading message
	d3.select('#loading').style("display", "none");

	// run the load callback
	if (this.o.on_load!==null)
	    this.o.on_load();
    }
    function brush_mode() {
	this.brush.toggle(true);
	this.zoom_container.toggle_zoom(false);
	this.callback_manager.run('brush_mode');
    }
    function zoom_mode() {
	this.brush.toggle(false);
	this.zoom_container.toggle_zoom(true);
	this.callback_manager.run('zoom_mode');
    }
    function _setup_menu(selection, map, zoom_container, key_manager, keys) {
	var sel = selection.append("div").attr("id", "menu");
	new_button(sel, keys.toggle_input, "New reaction (/)");
	new_button(sel, keys.save, "Save (^s)");
	new_button(sel, keys.save_svg, "Export SVG (^Shift s)");
	key_manager.assigned_keys.load.fn = new_input(sel, load_map_for_file, this, "Load (^o)");
	key_manager.assigned_keys.load_model.fn = new_input(sel, load_model_for_file, this, "Load model (^m)");
	key_manager.assigned_keys.load_flux.fn = new_input(sel, load_flux_for_file, this, "Load reaction data (^f)");
	new_button(sel, keys.clear_reaction_data, "Clear reaction data");
	new_input(sel, load_node_data_for_file, this, "Load metabolite data");
	new_button(sel, keys.clear_metabolite_data, "Clear metabolite data");
	var b = new_button(sel, keys.toggle_beziers, "Hide control points (b)", 'bezier-button');
	map.callback_manager
	    .set('toggle_beziers.button', function(on_off) {
		b.text((on_off ? 'Hide' : 'Show') + ' control points (b)');
	    });

	var z = new_button(sel, keys.brush_mode, "Enable select (v)", 'zoom-button');
	this.callback_manager
	    .set('zoom_mode', function() {
		set_button(z, keys.brush_mode, "Enable select (v)");
	    }).set('brush_mode', function() {
		set_button(z, keys.zoom_mode, "Enable pan+zoom (z)");
	    });

	new_button(sel, keys.rotate, "Rotate (r)");
	new_button(sel, keys.delete, "Delete (^del)");
	new_button(sel, keys.extent_nodes, "Zoom to nodes (^0)");
	new_button(sel, keys.extent_canvas, "Zoom to canvas (^1)");
	new_button(sel, keys.make_primary, "Make primary metabolite (p)");
	new_button(sel, keys.cycle_primary, "Cycle primary metabolite (c)");
	new_button(sel, keys.direction_arrow_left, "←");
	new_button(sel, keys.direction_arrow_up, "↑");
	new_button(sel, keys.direction_arrow_down, "↓");
	new_button(sel, keys.direction_arrow_right, "→");
	new_button(sel, keys.undo, "Undo (^z)");
	new_button(sel, keys.redo, "Redo (^Shift z)");
	return sel;

	// definitions
	function load_map_for_file(error, map_data) {
	    if (error) console.warn(error);
	    this.o.map_data = map_data;
	    this.reload_builder();
	}
	function load_model_for_file(error, data) {
	    if (error) console.warn(error);
	    var cobra_model = CobraModel(data.reactions, data.cofactors);
	    this.map.set_model(cobra_model);
	    this.reaction_input.toggle(false);
	}
	function load_flux_for_file(error, data) {
	    if (error) console.warn(error);
	    this.map.set_flux(data);
	}
	function load_node_data_for_file(error, data) {
	    if (error) console.warn(error);
	    this.map.set_node_data(data);
	}
	function new_button(s, key, name, id) {
	    var button = s.append("button").attr("class", "button command-button");
	    if (id !== undefined) button.attr('id', id);
	    return set_button(button, key, name);
	}
	function set_button(button, key, name) {
	    button.text(name).on("click", function() {
		key.fn.call(key.target);
	    });
	    return button;
	}
	function new_input(s, fn, target, name) {
	    /* 
	     * Returns a function that can be called to programmatically
	     * load files.
	     */
	    var input = s.append("input")
		    .attr("type", "file")
		    .style("display", "none")
		    .on("change", function() { utils.load_json(this.files[0], fn, target); });
	    s.append("button")
		.attr("class", "button command-button")
		.text(name)
		.on('click', function(e) {
	    	    input.node().click();
		});
	    return function() { input.node().click(); };
	}
    }

    function _setup_status(selection, map) {
	var status_bar = selection.append("div").attr("id", "status");
	map.callback_manager.set('set_status', function(status) {
	    status_bar.text(status);
	});
	return status_bar;
    }

    function _setup_modes(map, brush, zoom_container) {
	// set up zoom+pan and brush modes
	var was_enabled = {};
	map.callback_manager.set('start_rotation', function() {
	    was_enabled.brush = brush.enabled;
	    brush.toggle(false);
	    was_enabled.zoom = zoom_container.zoom_on;
	    zoom_container.toggle_zoom(false);
	    was_enabled.node_click = map.behavior.node_click!=null;
	    map.behavior.toggle_node_click(false);
	});
	map.callback_manager.set('end_rotation', function() {
	    brush.toggle(was_enabled.brush);
	    zoom_container.toggle_zoom(was_enabled.zoom);
	    map.behavior.toggle_node_click(was_enabled.node_click);
	    was_enabled = {};
	});
    }

    function _get_keys(map, input, brush) {
	return {
            toggle_input: { key: 191, // forward slash '/'
			    target: input,
			    fn: input.toggle },
            save: { key: 83, modifiers: { control: true }, // ctrl-s
		    target: map,
		    fn: map.save },
            // save_cmd: { key: 83, modifiers: { command: true }, // command-s
	    // 		       fn: save },
            save_svg: { key: 83, modifiers: { control: true, shift: true }, // ctrl-Shift-s
			target: map,
			fn: map.save_svg },
            load: { key: 79, modifiers: { control: true }, // ctrl-o
		    fn: null }, // defined by button
            load_model: { key: 77, modifiers: { control: true }, // ctrl-m
			  fn: null }, // defined by button
	    load_flux: { key: 70, modifiers: { control: true }, // ctrl-f
			 fn: null }, // defined by button
	    clear_reaction_data: { target: map,
			  fn: function() { this.set_flux(null); }},
	    clear_metabolite_data: { target: map,
			  fn: function() { this.set_node_data(null); }},
	    toggle_beziers: { key: 66,
			      target: map,
			      fn: map.toggle_beziers,
			      ignore_with_input: true  }, // b
	    zoom_mode: { key: 90, // z 
			 target: this,
			 fn: this.zoom_mode,
			 ignore_with_input: true },
	    brush_mode: { key: 86, // v
			  target: this,
			  fn: this.brush_mode,
			  ignore_with_input: true },
	    rotate: { key: 82, // r
		      target: map,
		      fn: map.rotate_selected_nodes,
		      ignore_with_input: true },
	    delete: { key: 8, modifiers: { control: true }, // ctrl-backspace
		      target: map,
		      fn: map.delete_selected,
		      ignore_with_input: true },
	    delete_del: { key: 46, modifiers: { control: true }, // ctrl-del
			  target: map,
			  fn: map.delete_selected,
			  ignore_with_input: true },
	    extent_nodes: { key: 48, modifiers: { control: true }, // ctrl-0
			    target: map,
			    fn: map.zoom_extent_nodes },
	    extent_canvas: { key: 49, modifiers: { control: true }, // ctrl-1
			     target: map,
			     fn: map.zoom_extent_canvas },
	    make_primary: { key: 80, // p
			    target: map,
			    fn: map.make_selected_node_primary,
			    ignore_with_input: true },
	    cycle_primary: { key: 67, // c
			     target: map,
			     fn: map.cycle_primary_node,
			     ignore_with_input: true },
	    direction_arrow_right: { key: 39, // right
				     target: map.direction_arrow,
				     fn: map.direction_arrow.right,
				     ignore_with_input: true },
	    direction_arrow_down: { key: 40, // down
				    target: map.direction_arrow,
				    fn: map.direction_arrow.down,
				    ignore_with_input: true },
	    direction_arrow_left: { key: 37, // left
				    target: map.direction_arrow,
				    fn: map.direction_arrow.left,
				    ignore_with_input: true },
	    direction_arrow_up: { key: 38, // up
				  target: map.direction_arrow,
				  fn: map.direction_arrow.up,
				  ignore_with_input: true },
	    undo: { key: 90, modifiers: { control: true },
		    target: map.undo_stack,
		    fn: map.undo_stack.undo },
	    redo: { key: 90, modifiers: { control: true, shift: true },
		    target: map.undo_stack,
		    fn: map.undo_stack.redo }
	};
    }
});
