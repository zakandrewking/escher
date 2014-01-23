define(["lib/d3", "metabolic-map/utils"], function(d3, utils) {
    return { reload_at_selected: reload_at_selected,
	     place_at_selected: place_at_selected,
	     is_visible: is_visible };

    // definitions
    function reload_at_selected(input, x_scale, y_scale, window_scale, window_translate, width, height,
				flux, drawn_reactions, cobra_reactions, 
				enter_callback) {
        /** Reload data for autocomplete box and redraw box at the first
	 * selected node.
	 *
	 * enter_callback(reaction_id, coords)
	 *
         */
	d3.select('.selected').each(function(d) {
	    // unselect all but one (chosen by d3.select)
	    d3.selectAll('.selected').classed('selected', function(e) {
		return d === e;
	    });
	    // reload the reaction input
	    reload(input, {x: d.x, y: d.y}, x_scale, y_scale, window_scale, window_translate, width, height,
		   flux, drawn_reactions, cobra_reactions, 
		   enter_callback);
	});
    }

    function place_at_selected(input, x_scale, y_scale, window_scale, window_translate, width, height) {
        /** Place autocomplete box at the first selected node.
         */
	d3.select('.selected').each(function(d) {
	    place(input, {x: d.x, y: d.y}, x_scale, y_scale, window_scale, window_translate, width, height);
	});
    }

    function place(input, coords, x_scale, y_scale, window_scale, window_translate, width, height) {
	var d = {'x': 200, 'y': 0};
        var left = Math.max(20, Math.min(width-270, (window_scale * x_scale(coords.x) + window_translate.x - d.x)));
        var top = Math.max(20, Math.min(height-40, (window_scale * y_scale(coords.y) + window_translate.y - d.y)));
        input.selection.style('position', 'absolute')
            .style('display', 'block')
            .style('left',left+'px')
            .style('top',top+'px');
    }

    function reload(input, coords, x_scale, y_scale, window_scale, window_translate, width, height,
		    flux, drawn_reactions, cobra_reactions, 
		    enter_callback) {
        /** Reload data for autocomplete box and redraw box at the new
         * coordinates.
	 *
	 * enter_callback(reaction_id, coords)
	 *
         */ 

	var decimal_format = d3.format('.3g');

	place(input, coords, x_scale, y_scale, window_scale, window_translate, width, height);
        // blur
        input.completely.input.blur();
        input.completely.repaint(); //put in place()?

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
	else if (count < 1) { console.error('No selected node'); return; }


	    // // make a list of reactions
	    // o.sorted_reaction_suggestions = [];
	    // for (var reaction_id in o.cobra_reactions) {
	    // 	o.sorted_reaction_suggestions.push({
	    // 	    label: reaction_id,
	    // 	    cobra_id: reaction_id,
	    // 	    flux: 0
            //     });
	    // } 
	    // if (o.flux) {
	    // 	// reactions with flux
	    // 	for (var flux_reaction_id in o.flux) {
            //         // fix reaction ids
            //         var fixed_id = flux_reaction_id.replace('(', '_').replace(')', ''),
	    // 		flux = parseFloat(o.flux[flux_reaction_id]);
            //         // update model with fluxes. if not found, add the empty reaction to the list
	    // 	    var found = false;
	    // 	    o.sorted_reaction_suggestions.map(function(x) {
	    // 		if (fixed_id == x.cobra_id) {
	    // 		    // update label
	    // 		    x.label = x.label+": "+o.decimal_format(flux);
	    // 		    x.flux = flux;
	    // 		    // set flux for reaction
            //                 o.cobra_reactions[fixed_id].flux = flux;
            //                 // also set flux for segments (for simpler drawing)
            //                 for (var metabolite_id in o.cobra_reactions[fixed_id].segments)
	    // 			o.cobra_reactions[fixed_id].segments[metabolite_id].flux = flux;
	    // 		    // this reaction has been found
	    // 		}
            //         });
	    // 	}
	    // 	// sort the reactions by flux
	    // 	o.sorted_reaction_suggestions.sort(function(a, b) { 
	    // 	    return Math.abs(b.flux) - Math.abs(a.flux); 
	    // 	});
	    // }


        // Find selected reaction
        var suggestions = [];
        for (var reaction_abbreviation in cobra_reactions) {
            var reaction = cobra_reactions[reaction_abbreviation];

            // ignore drawn reactions
            if (already_drawn(reaction_abbreviation, drawn_reactions)) continue;

	    // check segments for match to selected metabolite
	    for (var metabolite_id in reaction.metabolites) {
		var metabolite = reaction.metabolites[metabolite_id]; 
		//TODO sort out node __data__.compartment_id vs. _c and _p in model.reaction.metabolite_id
                if (selected_met.bigg_id_compartmentalized == metabolite_id) {
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
        }

        // Generate the array of reactions to suggest and sort it
	var strings_to_display = [],
	    suggestions_array = utils.make_array(suggestions, 'reaction_abbreviation');
	if (flux)
	    suggestions_array.sort(function(x, y) { return Math.abs(x.flux) > Math.abs(y.flux); });
	suggestions_array.map(function(x) {
	    strings_to_display.push(x.string);
	});

        // set up the box with data, searching for first num results
        var num = 20;
        var complete = input.completely;
        complete.options = strings_to_display;
        if (strings_to_display.length==1) complete.setText(strings_to_display[0]);
        else complete.setText("");
        complete.onEnter = function() {
	    var text = this.getText();
	    this.setText("");
	    suggestions_array.map(function(x) {
		if (x.string==text)
                    enter_callback(x.reaction_abbreviation, selected_node_id);
	    });
        };
        complete.repaint();
        input.completely.input.focus();

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

    function is_visible(input) {
        return input.selection.style("display") != "none";
    }
});
