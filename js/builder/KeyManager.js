define(["vis/utils", "lib/d3"], function(utils, d3) {
    /** 
     */

    var KeyManager = utils.make_class();
    // static methods
    KeyManager.reset_held_keys = reset_held_keys;
    // instance methods
    KeyManager.prototype = { init: init,
			     set_keys: set_keys,
			     add_escape_listener: add_escape_listener };

    return KeyManager;

    // static methods
    function reset_held_keys(h) {
        h.command = false;
	h.control = false;
	h.option = false;
	h.shift = false;
    }
    // instance methods
    function init(assigned_keys, reaction_input) {
	/** Assign keys for commands.

	 */

	if (assigned_keys===undefined) assigned_keys = {};
	if (reaction_input===undefined) reaction_input = null;

	this.assigned_keys = assigned_keys;
	this.held_keys = {};
	reset_held_keys(this.held_keys);

	this.set_keys(assigned_keys);
    }
    function set_keys(keys) {
	this.assigned_keys = keys;

        var modifier_keys = { command: 91,
                              control: 17,
                              option: 18,
                              shift: 16 };

        d3.select(window).on("keydown.key_manager", null);
        d3.select(window).on("keyup.key_manager", null);

	var held_keys = this.held_keys;
        d3.select(window).on("keydown.key_manager", function() {
            var kc = d3.event.keyCode,
                reaction_input_visible = this.reaction_input ?
		    this.reaction_input.is_visible : false,
		meaningless = true;
            toggle_modifiers(modifier_keys, held_keys, kc, true);
	    for (var key_id in keys) {
		var assigned_key = keys[key_id];
		if (check_key(assigned_key, kc, held_keys)) {
		    meaningless = false;
		    if (!(assigned_key.ignore_with_input && reaction_input_visible)) {
			if (assigned_key.fn) {
			    assigned_key.fn.call(assigned_key.target);
			} else {
			    console.warn('No function for key');
			}
			// prevent browser action
			d3.event.preventDefault();
		    }
		}
	    }
	    // Sometimes modifiers get 'stuck', so reset them once in a while.
	    // Only do this when a meaningless key is pressed
	    for (var k in modifier_keys)
		if (modifier_keys[k] == kc) meaningless = false;
	    if (meaningless) 
		reset_held_keys(held_keys);
        }).on("keyup.key_manager", function() {
            toggle_modifiers(modifier_keys, held_keys,
			     d3.event.keyCode, false);
        });
        function toggle_modifiers(mod, held, kc, on_off) {
            for (var k in mod)
                if (mod[k] == kc)
                    held[k] = on_off;
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
    function toggle_start_reaction_listener(on_off) {
	if (on_off===undefined) {
	    o.start_reaction_listener = !o.start_reaction_listener;
	} else if (o.start_reaction_listener==on_off) {
	    return;
	} else {
	    o.start_reaction_listener = on_off;
	}
	if (o.start_reaction_listener) {
	    o.sel.on('click.start_reaction', function() {
		console.log('clicked for new reaction');
		// reload the reaction input
		var coords = { x: o.scale.x_size.invert(d3.mouse(this)[0]), 
			       y: o.scale.y_size.invert(d3.mouse(this)[1]) };
		// unselect metabolites
		d3.selectAll('.selected').classed('selected', false);
		input.reload_at_point(o.reaction_input, coords, o.scale.x, o.scale.y, o.window_scale, 
				      o.window_translate, o.width, o.height, o.flux, 
				      o.drawn_reactions, o.cobra_reactions,
				      new_reaction_from_scratch);
		var s = o.sel.selectAll('.start-reaction-target').data([12, 5]);
		s.enter().append('circle')
		    .classed('start-reaction-target', true)
		    .attr('r', function(d) { return o.scale.x_size(d); })
		    .style('stroke-width', o.scale.x_size(4));
		s.style('visibility', 'visible')
		    .attr('transform', 'translate('+o.scale.x(coords.x)+','+o.scale.y(coords.y)+')');
	    });
	    o.sel.classed('start-reaction-cursor', true);
	} else {
	    o.sel.on('click.start_reaction', null);
	    o.sel.classed('start-reaction-cursor', false);
	    o.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	}
    }

    // ---------------------------------------------------------------------
    // Commands
    
    // function cmd_hide_show_input() {
    //     if (input.is_visible(o.reaction_input)) cmd_hide_input();
    //     else cmd_show_input();
    // }
    // function cmd_hide_input() {
    // 	toggle_start_reaction_listener(false);
    //     o.reaction_input.selection.style("display", "none");
    //     o.reaction_input.completely.input.blur();
    //     o.reaction_input.completely.hideDropDown();
    // }
    // function cmd_show_input() {
    // 	cmd_zoom_on();
    // 	toggle_start_reaction_listener(true);
    // 	input.reload_at_selected(o.reaction_input, o.scale.x, o.scale.y, o.window_scale, 
    // 				 o.window_translate, o.width, o.height, o.flux, 
    // 				 o.drawn_reactions, o.cobra_reactions,
    // 				 new_reaction_for_metabolite);
    // }
    // function cmd_save() {
    //     console.log("Saving");
    //     utils.download_json(map_for_export(), "saved_map");
    // }
    // function cmd_save_svg() {
    //     console.log("Exporting SVG");
    // 	o.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');	    
    // 	o.direction_arrow.hide();
    //     utils.export_svg("saved_map", "svg");
    // }
    function cmd_load() {
        console.log("Loading");
        o.load_input_click_fn();
    }
    function cmd_load_flux() {
	console.log("Loading flux");
	o.load_flux_input_click_fn();
    }
    function cmd_toggle_beziers() {
	if (o.show_beziers) cmd_hide_beziers();
	else cmd_show_beziers();
    }
    function cmd_show_beziers() {
	o.show_beziers = true;
	d3.select('#bezier-button').text('Hide control points (b)')
	    .on('click', cmd_hide_beziers);
	draw_everything();
    }
    function cmd_hide_beziers() {
	o.show_beziers = false;
	d3.select('#bezier-button').text('Show control points (b)')
	    .on('click', cmd_show_beziers);
	draw_everything();
    }
    function cmd_zoom_on() {
	o.zoom_container.toggle_zoom(true);
	enable_brush(false);
	d3.select('#zoom-button').text('Enable select (v)')
	    .on('click', cmd_zoom_off);
    }
    function cmd_zoom_off() {
	o.zoom_container.toggle_zoom(false);
	enable_brush(true);
	d3.select('#zoom-button').text('Enable pan+zoom (z)')
	    .on('click', cmd_zoom_on);
    }
});
