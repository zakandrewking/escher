define(["utils",  "lib/complete.ly", "Map", "ZoomContainer", "CallbackManager"], function(utils, completely, Map, ZoomContainer, CallbackManager) {
    /**
     */

    var Input = utils.make_class();
    // instance methods
    Input.prototype = { init: init,
			setup_map_callbacks: setup_map_callbacks,
			setup_zoom_callbacks: setup_zoom_callbacks,
			show: show,
			hide: hide,
			toggle: toggle,
			place_at_selected: place_at_selected,
			place: place,
			reload_at_selected: reload_at_selected,
			reload: reload,
			toggle_start_reaction_listener: toggle_start_reaction_listener };

    return Input;

    // definitions
    function init(selection, map, zoom_container) {
	// set up container
	var new_sel = selection.append("div").attr("id", "rxn-input");
	// set up complete.ly
	var c = completely(new_sel.node(), { backgroundColor: "#eee" });
	d3.select(c.input)
	// .attr('placeholder', 'Reaction ID -- Flux')
	    .on('input', function() {
		this.value = this.value.replace("/","")
		    .replace(" ","")
		    .replace("\\","")
		    .replace("<","");
	    });
	this.selection = new_sel;
	this.completely = c;

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

	// set up reaction input callbacks
	this.callback_manager = new CallbackManager();

	// toggle off
	this.hide();
    }
    function setup_map_callbacks() {
	var self = this;
	this.map.callback_manager.set('select_metabolite_with_id.input', function(selected_node, scaled_coords) {
	    if (self.is_visible) self.reload(selected_node, scaled_coords, false);
	    self.map.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	});
	this.map.callback_manager.set('select_metabolite.input', function(count, selected_node, scaled_coords) {
	    self.map.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	    if (count == 1 && self.is_visible && scaled_coords) {
		self.reload(selected_node, scaled_coords, false);
	    } else {
		self.hide();
	    }
	});
    }
    function setup_zoom_callbacks() {
	var self = this;
	this.zoom_container.callback_manager.set('zoom.input', function() {
	    if (self.is_visible) {
		self.place_at_selected();
	    }
	});
    }
    function show() {
	this.toggle(true);
    }
    function hide() {
	this.toggle(false);
    }
    function toggle(on_off) {
	if (on_off===undefined) this.is_visible = !this.is_visible;
	else this.is_visible = on_off;
	if (this.is_visible) {
	    this.toggle_start_reaction_listener(true);
	    this.reload_at_selected();
	    this.map.set_status('Click on the canvas or an existing metabolite');
	    this.callback_manager.run('show_reaction_input');
	} else {
	    this.toggle_start_reaction_listener(false);
	    this.selection.style("display", "none");
            this.completely.input.blur();
            this.completely.hideDropDown();
	    this.map.set_status(null);
	    this.callback_manager.run('hide_reaction_input');
	}
    }

    function place_at_selected() {
        /** Place autocomplete box at the first selected node.
	 
         */

	// get the selected node
	this.map.deselect_text_labels();
	var selected_node = this.map.select_single_node(),
	    scale = this.map.scale;
	if (selected_node==null) return;
	var coords = { x: scale.x(selected_node.x), y: scale.y(selected_node.y) };
	this.place(coords);
    }
    function place(coords) {
	var d = {x: 200, y: 0},
	    scale = this.map.scale,
	    window_translate = this.map.zoom_container.window_translate,
	    window_scale = this.map.zoom_container.window_scale;
        var left = Math.max(20,
			    Math.min(this.map.width - 270,
				     (window_scale * coords.x + window_translate.x - d.x)));
        var top = Math.max(20,
			   Math.min(this.map.height - 40,
				    (window_scale * coords.y + window_translate.y - d.y)));
        this.selection.style('position', 'absolute')
            .style('display', 'block')
            .style('left',left+'px')
            .style('top',top+'px');
    }

    function reload_at_selected() {
        /** Reload data for autocomplete box and redraw box at the first
	 selected node.
	 
         */
	// get the selected node
	this.map.deselect_text_labels();
	var selected_node = this.map.select_single_node(),
	    scale = this.map.scale;
	if (selected_node==null) return;
	var scaled_coords = { x: scale.x(selected_node.x), y: scale.y(selected_node.y) };
	// reload the reaction input
	this.reload(selected_node, scaled_coords, false);
    }
    function reload(selected_node, scaled_coords, starting_from_scratch) {
        /** Reload data for autocomplete box and redraw box at the new
         coordinates.
	 
         */

	if (selected_node===undefined && !starting_from_scratch)
	    console.error('No selected node, and not starting from scratch');

	var decimal_format = d3.format('.3g');

	this.place(scaled_coords);
        // blur
        this.completely.input.blur();
        this.completely.repaint(); //put in place()?

        // Find selected reaction
        var suggestions = [],
	    cobra_reactions = this.map.cobra_model.reactions,
	    reactions = this.map.reactions,
	    has_flux = this.map.has_flux(),
	    flux = this.map.flux;
        for (var reaction_abbreviation in cobra_reactions) {
            var reaction = cobra_reactions[reaction_abbreviation];

            // ignore drawn reactions
            if (already_drawn(reaction_abbreviation, reactions)) continue;

	    // check segments for match to selected metabolite
	    for (var metabolite_id in reaction.metabolites) {
		var metabolite = reaction.metabolites[metabolite_id]; 
		// if starting with a selected metabolite, check for that id
		if (!starting_from_scratch && selected_node.bigg_id_compartmentalized!=metabolite_id) continue;
		// don't add suggestions twice
		if (reaction_abbreviation in suggestions) continue;
		// reverse for production
		var this_flux, this_string;
		if (has_flux) {
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
	if (has_flux)
	    suggestions_array.sort(function(x, y) { return Math.abs(y.flux) - Math.abs(x.flux); });
	suggestions_array.forEach(function(x) {
	    strings_to_display.push(x.string);
	});

        // set up the box with data, searching for first num results
        var num = 20,
            complete = this.completely,
	    self = this,
	    scale = this.map.scale;
        complete.options = strings_to_display;
        if (strings_to_display.length==1) complete.setText(strings_to_display[0]);
        else complete.setText("");
        complete.onEnter = function() {
	    var text = this.getText();
	    this.setText("");
	    suggestions_array.map(function(x) {
		if (x.string==text) {
		    if (starting_from_scratch) {
			var coords = { x: scale.x.invert(scaled_coords.x),
				       y: scale.y.invert(scaled_coords.y) };
			self.map.new_reaction_from_scratch(x.reaction_abbreviation, coords);
		    } else {
			self.map.new_reaction_for_metabolite(x.reaction_abbreviation, selected_node.node_id);
		    }
		}
	    });
        };
        complete.repaint();
        this.completely.input.focus();

	//definitions
	function already_drawn(cobra_id, reactions) {
            for (var drawn_id in reactions) {
		if (reactions[drawn_id].abbreviation==cobra_id) 
		    return true;
	    }
            return false;
	};
	function string_for_flux(reaction_abbreviation, flux, decimal_format) {
	    return reaction_abbreviation + ": " + decimal_format(flux);
	}
    }
    function toggle_start_reaction_listener(on_off) {
	/** Toggle listening for a click to place a new reaction on the canvas.

	 */
        if (on_off===undefined)
            this.start_reaction_listener = !this.start_reaction_listener;
        else if (this.start_reaction_listener==on_off)
            return;
        else
            this.start_reaction_listener = on_off;
        
        if (this.start_reaction_listener) {
	    var self = this,
		map = this.map,
		scale = map.scale;
            map.sel.on('click.start_reaction', function() {
                console.log('clicked for new reaction');
                // reload the reaction input
                var scaled_coords = { x: scale.x(scale.x_size.invert(d3.mouse(this)[0])),
				      y: scale.y(scale.y_size.invert(d3.mouse(this)[1])) };
                // unselect metabolites
		map.deselect_nodes();
		map.deselect_text_labels();
		// reload the reactin input
                self.reload(null, scaled_coords, true);
		// generate the target symbol
                var s = map.sel.selectAll('.start-reaction-target').data([12, 5]);
                s.enter().append('circle')
                    .classed('start-reaction-target', true)
                    .attr('r', function(d) { return scale.size(d); })
                    .style('stroke-width', scale.size(4));
                s.style('visibility', 'visible')
                    .attr('transform', 'translate('+scaled_coords.x+','+scaled_coords.y+')');
            });
            map.sel.classed('start-reaction-cursor', true);
        } else {
            this.map.sel.on('click.start_reaction', null);
            this.map.sel.classed('start-reaction-cursor', false);
            this.map.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
        }
    }

});