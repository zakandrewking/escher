define(["vis/utils", "lib/d3", "builder/Input", "builder/ZoomContainer", "builder/Map", "builder/CobraModel", "builder/Brush"], function(utils, d3, Input, ZoomContainer, Map, CobraModel, Brush) {
    // NOTE
    // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
    // only necessary for selectAll()
    // .datum(function() {
    //     return this.parentNode.__data__;
    // })


    var Builder = utils.make_class();
    // static methods
    Builder.get_keys = get_keys;
    // instance methods
    Builder.prototype = { init: init,
			  reload_builder: reload_builder,
			  reload_for_flux: reload_for_flux,
			  reload_for_node_data: reload_for_node_data,
			  _setup_menu: _setup_menu,
			  _setup_status: _setup_status };

    return Builder;

    // definitions
    function init(options) {
	// set defaults
	var o = utils.set_options(options, {
	    margins: {top: 0, right: 0, bottom: 0, left: 0},
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
	    node_data: null,
	    node_data_path: null,
	    node_data_style: 'ColorSize',
	    node_data_range: [0, 100],
	    show_beziers: false,
	    debug: false,
	    starting_reaction: 'GLCtex',
	    reaction_arrow_displacement: 35 });

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

	// Check the cobra model
	var cobra_model = null;
	if (this.o.cobra_model) {
	    // TODO better checks
	    cobra_model = CobraModel(this.o.cobra_model.reactions, this.o.cobra_model.cofactors);
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
	var zoom_container = new ZoomContainer(svg, width, height, [0.05, 15]),
	    zoomed_sel = zoom_container.zoomed_sel;

	var max_w = width, max_h = height, scale, map;
	if (this.o.map_data) {
	    // import map
	    map = Map.from_data(this.o.map_data, zoomed_sel, defs, zoom_container,
				height, width, this.o.flux, this.o.node_data, this.o.node_data_style,
				cobra_model);
	    zoom_container.reset();
	} else {
	    // new map
	    map = new Map(zoomed_sel, defs, zoom_container,
			  height, width, this.o.flux, this.o.node_data, this.o.node_data_style,
			  cobra_model);
	}

	// set up the reaction input with complete.ly
	var reaction_input = Input(this.o.selection, map, zoom_container);

	// setup the Brush
	var brush = new Brush(zoomed_sel, false, map);

	// make key manager
	var keys = Builder.get_keys(map, reaction_input, brush);
	map.key_manager.set_keys(keys);
	// set up menu and status bars
	var menu = this._setup_menu(this.o.selection, map, zoom_container, map.key_manager, keys),
	    status = this._setup_status(this.o.selection);

	// setup selection box
	if (!this.o.map_data) {
	    // Draw default reaction if no map is provided
	    var start_coords = {'x': this.o.width*5, 'y': this.o.height*5};
	    map.new_reaction_from_scratch(this.o.starting_reaction, start_coords);
	    map.zoom_extent(200);
	} else {
	    map.draw_everything();
	    map.zoom_extent(200);
	}

	// turn off loading message
	d3.select('#loading').style("display", "none");
    }

    function reload_map() {
	console.error('not implemented');
    }

    function reload_for_flux() {
	console.error('not implemented');
    }

    function reload_for_node_data() {
	console.error('not implemented');
    }

    // definitions
    function _setup_menu(selection, map, zoom_container, key_manager, keys) {
	var sel = selection.append("div").attr("id", "menu");
	new_button(sel, keys.toggle_input, "New reaction (/)");
	new_button(sel, keys.save, "Save (^s)");
	new_button(sel, keys.save_svg, "Export SVG (^Shift s)");
	key_manager.load_input_click_fn = new_input(sel, load_map_for_file, "Load (^o)");
	key_manager.load_flux_input_click_fn = new_input(sel, load_flux_for_file,
							 "Load flux (^f)");
	new_input(sel, load_node_data_for_file, "Load node data");
	var b = new_button(sel, keys.toggle_beziers, "Hide control points (b)", 'bezier-button');
	map.callback_manager.set('toggle_beziers.button', function(on_off) {
	    b.text((on_off ? 'Hide' : 'Show') + ' control points (b)');
	});
	var z = new_button(sel, keys.toggle_zoom, "Enable select (v)", 'zoom-button');
	zoom_container.callback_manager.set('toggle_zoom.button', function(on_off) {
	    b.text(on_off ? 'Enable select (v)': 'Enable pan+zoom (z)');
	});
	new_button(sel, keys.rotate, "Rotate (r)");
	new_button(sel, keys.delete, "Delete (^del)");
	new_button(sel, keys.extent, "Zoom extent (^0)");
	new_button(sel, keys.make_primary, "Make primary metabolite (p)");
	new_button(sel, keys.cycle_primary, "Cycle primary metabolite (c)");
	new_button(sel, keys.direction_arrow_left, "<");
	new_button(sel, keys.direction_arrow_up, "^");
	new_button(sel, keys.direction_arrow_down, "v");
	new_button(sel, keys.direction_arrow_right, ">");
	new_button(sel, keys.undo, "Undo (^z)");
	new_button(sel, keys.redo, "Redo (^Shift z)");
	return sel;

	// definitions
	function load_map_for_file(error, map_data) {
	    if (error) console.warn(error);
	    this.o.map_data = map_data;
	    this.reload_builder();
	}
	function load_flux_for_file(error, data) {
	    this.o.flux = data;
	    map.set_flux(data);
	}
	function load_node_data_for_file(error, data) {
	    this.o.node_data = data;
	    map.set_node_data(data);
	}
	function new_button(s, key, name, id) {
	    var b = s.append("button").attr("class", "command-button")
		    .text(name).on("click", function() { key.fn.call(key.target); });
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

    function _setup_status(selection) {
	return selection.append("div").attr("id", "status");
    }

    function get_keys(map, input, brush) {
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
		    fn: null },
	    load_flux: { key: 70, modifiers: { control: true }, // ctrl-f
			 fn: null },
	    toggle_beziers: { key: 66,
			      target: map,
			      fn: map.toggle_beziers,
			      ignore_with_input: true  }, // b
	    toggle_zoom: { key: 90, // z 
			   target: this,
			   fn: this.toggle_zoom,
			   ignore_with_input: true },
	    brush: { key: 86, // v
		     target: this,
		     fn: this.toggle_zoom,
		     ignore_with_input: true },
	    rotate: { key: 82, // r
		      target: map,
		      fn: map.rotate_selected_nodes,
		      ignore_with_input: true },
	    delete: { key: 8, modifiers: { control: true }, // ctrl-del
		      target: map,
		      fn: map.delete_selected,
		      ignore_with_input: true },
	    extent: { key: 48, modifiers: { control: true }, // ctrl-0
		      target: map,
		      fn: map.zoom_extent },
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
