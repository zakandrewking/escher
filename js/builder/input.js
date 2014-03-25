define(["lib/d3", "vis/utils",  "lib/complete.ly", "builder/Map", "builder/ZoomContainer"], function(d3, utils, completely, Map, ZoomContainer) {
    /**
     */

    var Input = utils.make_class();
    // instance methods
    Input.prototype = { init: init,
			setup_map_callbacks: setup_map_callbacks,
			setup_zoom_callbacks: setup_zoom_callbacks,
			is_visible: is_visible,
			show: show,
			hide: hide,
			reload_at_selected: reload_at_selected,
			reload_at_point: reload_at_point,
			place_at_selected: place_at_selected,
			place: place };

    return Input;

    // definitions
    function init(selection, map, zoom_container) {
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
	this.sel = sel;
	this.complete = complete;

	if (map instanceof Map) {
	    this.map = map;
	    this.setup_map_callbacks();
	} else {
	    console.error('Cannot set the map. It is not an instance of builder/Map');
	}
	if (zoom_container instanceof ZoomContainer) {
	    this.zoom_container = zoom_container;
	    this.setup_zoom_callbacks();
	} else {
	    console.error('Cannot set the zoom_container. It is not an instance of ' +
			  'builder/ZoomContainer');
	}
    }
    function setup_map_callbacks() {
	var input = this;
	this.map.callback_manager.set('select_metabolite_with_id.input', function() {
	    if (input.is_visible) input.show();
	});
	this.map.callback_manager.set('select_metabolite.input', function(count) {
	    if (count == 1) {
		input.toggle();
	    } else {
		input.hide();
	    }
	});
    }
    function setup_zoom_callbacks() {
	var input = this;
	this.zoom_container.callback_manager.set('zoom.input', function() {
	    if (input.is_visible) {
		console.error('unfinished');
		// input.place({x: d.x, y: d.y}, window_scale, window_translate, width, height);
	    }
	});
    }
    function is_visible(input) {
        return this.sel.style("display") != "none";
    }
    function toggle() {
	console.error('not implemented');
    }
    function show() {
	this.sel.style("display", "block");
	cmd_zoom_on();
	toggle_start_reaction_listener(true);
	input.reload_at_selected(o.reaction_input, o.scale.x, o.scale.y, o.window_scale, 
				 o.window_translate, o.width, o.height, o.flux, 
				 o.drawn_reactions, o.cobra_reactions,
				 new_reaction_for_metabolite);
    }
    function hide() {
	toggle_start_reaction_listener(false);
        o.reaction_input.selection.style("display", "none");
        o.reaction_input.completely.input.blur();
        o.reaction_input.completely.hideDropDown();
	this.sel.style("display", "none");
    }
    function reload_at_selected(window_scale, window_translate, width, height,
				flux, drawn_reactions, cobra_reactions, 
				enter_callback) {
        /** Reload data for autocomplete box and redraw box at the first
	 * selected node.
	 *
	 * enter_callback(reaction_id, coords)
	 *
         */
	if (!this.x_scale | !this.y_scale) console.error('Scale is not set for the reaction input');

	d3.select('.selected').each(function(d) {
	    // unselect all but one (chosen by d3.select)
	    d3.selectAll('.selected').classed('selected', function(e) {
		return d === e;
	    });
	    // reload the reaction input
	    reload({x: d.x, y: d.y}, this.x_scale, this.y_scale, window_scale, window_translate, width, height,
		   flux, drawn_reactions, cobra_reactions, false,
		   enter_callback);
	});
    }

    function reload_at_point(coords, window_scale, window_translate, width, height,
			     flux, drawn_reactions, cobra_reactions,
			     enter_callback) {
	/** Reload data for autocomplete box and redraw box at the coords.
	 *
	 * enter_callback(reaction_id, coords)
	 *
	 */
	if (!this.x_scale | !this.y_scale) console.error('Scale is not set for the reaction input');

	reload(coords, this.x_scale, this.y_scale, window_scale, window_translate, width, height,
	       flux, drawn_reactions, cobra_reactions, true,
	       enter_callback);
    }

    function place_at_selected(window_scale, window_translate, width, height) {
        /** Place autocomplete box at the first selected node.
         */
	if (!this.map.scale.x | !this.map.scale.y) console.error('Scale is not set for the reaction input');

	d3.select('.selected').each(function(d) {
	    this.place({x: d.x, y: d.y}, window_scale, window_translate, width, height);
	});
    }

    function place(coords, x_scale, y_scale, window_scale, window_translate, width, height) {
	var d = {'x': 200, 'y': 0};
        var left = Math.max(20, Math.min(width-270, (window_scale * x_scale(coords.x) + window_translate.x - d.x)));
        var top = Math.max(20, Math.min(height-40, (window_scale * y_scale(coords.y) + window_translate.y - d.y)));
        this.selection.style('position', 'absolute')
            .style('display', 'block')
            .style('left',left+'px')
            .style('top',top+'px');
    }

    function reload(coords, x_scale, y_scale, window_scale, window_translate, width, height,
		    flux, drawn_reactions, cobra_reactions, starting_from_scratch,
		    enter_callback) {
        /** Reload data for autocomplete box and redraw box at the new
         * coordinates.
	 *
	 * enter_callback(reaction_id, coords)
	 *
         */ 

	var decimal_format = d3.format('.3g');

	this.place(coords, x_scale, y_scale, window_scale, window_translate, width, height);
        // blur
        this.completely.input.blur();
        this.completely.repaint(); //put in place()?

	if (!starting_from_scratch) {
	    // make sure only one node is selected
	    var selected_nodes = d3.selectAll('.selected'), 
		count = 0,
		selected_met, selected_node_id;
	    selected_nodes.each(function(d) { 
		count++; 
		selected_met = d;
		selected_node_id = parseInt(d.node_id);
	    });
	    if (count > 1) { console.error('Too many selected nodes'); return; }
	    if (count == 0) { console.error('No selected node'); return; }
	}
	
        // Find selected reaction
        var suggestions = [];
        for (var reaction_abbreviation in cobra_reactions) {
            var reaction = cobra_reactions[reaction_abbreviation];

            // ignore drawn reactions
            if (already_drawn(reaction_abbreviation, drawn_reactions)) continue;

	    // check segments for match to selected metabolite
	    for (var metabolite_id in reaction.metabolites) {
		var metabolite = reaction.metabolites[metabolite_id]; 
		// if starting with a selected metabolite, check for that id
		if (!starting_from_scratch && selected_met.bigg_id_compartmentalized!=metabolite_id) continue;
		// don't add suggestions twice
		if (reaction_abbreviation in suggestions) continue;
		// reverse for production
		var this_flux, this_string;
		if (flux) {
		    if (reaction_abbreviation in flux) 
			this_flux = flux[reaction_abbreviation] * (metabolite.coefficient < 1 ? 1 : -1);
		    else
			this_flux = 0;
		    this_string = string_for_flux(reaction_abbreviation, this_flux, decimal_format);
	    	    suggestions[reaction_abbreviation] = { flux: this_flux,
							   string: this_string };
		} else {
	    	    suggestions[reaction_abbreviation] = { string: reaction_abbreviation };
		}
		
	    }
        }

        // Generate the array of reactions to suggest and sort it
	var strings_to_display = [],
	    suggestions_array = utils.make_array(suggestions, 'reaction_abbreviation');
	if (flux)
	    suggestions_array.sort(function(x, y) { return Math.abs(y.flux) - Math.abs(x.flux); });
	suggestions_array.forEach(function(x) {
	    strings_to_display.push(x.string);
	});

        // set up the box with data, searching for first num results
        var num = 20;
        var complete = this.completely;
        complete.options = strings_to_display;
        if (strings_to_display.length==1) complete.setText(strings_to_display[0]);
        else complete.setText("");
        complete.onEnter = function() {
	    var text = this.getText();
	    this.setText("");
	    suggestions_array.map(function(x) {
		if (x.string==text) {
		    if (starting_from_scratch) enter_callback(x.reaction_abbreviation, coords);
		    else enter_callback(x.reaction_abbreviation, selected_node_id);
		}
	    });
        };
        complete.repaint();
        this.completely.input.focus();

	//definitions
	function already_drawn(cobra_id, drawn_reactions) {
            for (var drawn_id in drawn_reactions) {
		if (drawn_reactions[drawn_id].abbreviation==cobra_id) 
		    return true;
	    }
            return false;
	};
	function string_for_flux(reaction_abbreviation, flux, decimal_format) {
	    return reaction_abbreviation + ": " + decimal_format(flux);
	}
    }
});
