define(['utils', 'PlacedDiv', 'lib/complete.ly', 'DirectionArrow', 'CobraModel'], function(utils, PlacedDiv, completely, DirectionArrow, CobraModel) {
    /**
     */

    var BuildInput = utils.make_class();
    // instance methods
    BuildInput.prototype = { init: init,
                             setup_map_callbacks: setup_map_callbacks,
                             setup_zoom_callbacks: setup_zoom_callbacks,
                             is_visible: is_visible,
                             toggle: toggle,
                             show_dropdown: show_dropdown,
                             hide_dropdown: hide_dropdown,
                             place_at_selected: place_at_selected,
                             place: place,
                             reload_at_selected: reload_at_selected,
                             reload: reload,
                             toggle_start_reaction_listener: toggle_start_reaction_listener,
                             hide_target: hide_target,
                             show_target: show_target };

    return BuildInput;

    // definitions
    function init(selection, map, zoom_container, settings) {
        // set up container
        var new_sel = selection.append('div').attr('id', 'rxn-input');
        this.placed_div = PlacedDiv(new_sel, map, {x: 240, y: 0});
        this.placed_div.hide();
        
        // set up complete.ly
        var c = completely(new_sel.node(), { backgroundColor: '#eee' });
        
        d3.select(c.input);
        this.completely = c;
        // close button
        new_sel.append('button').attr('class', "button input-close-button")
            .text("×")
            .on('mousedown', function() { this.hide_dropdown(); }.bind(this));

        // map
        this.map = map;
        // set up the reaction direction arrow
        var default_angle = 90; // degrees
        this.direction_arrow = new DirectionArrow(map.sel);
        this.direction_arrow.set_rotation(default_angle);
        this.setup_map_callbacks(map);
        
        // zoom container
        this.zoom_container = zoom_container;
        this.setup_zoom_callbacks(zoom_container);

        // settings
        this.settings = settings;

        // toggle off
        this.toggle(false);
        this.target_coords = null;
    }

    function setup_map_callbacks(map) {
        // input
        map.callback_manager.set('select_metabolite_with_id.input', function(selected_node, coords) {
            if (this.is_active) this.reload(selected_node, coords, false);
            this.hide_target();
        }.bind(this));
        map.callback_manager.set('select_selectable.input', function(count, selected_node, coords) {
            this.hide_target();
            if (count == 1 && this.is_active && coords) {
                this.reload(selected_node, coords, false);
            } else {
                this.toggle(false);
            }
        }.bind(this)); 
        map.callback_manager.set('deselect_nodes', function() {
            this.direction_arrow.hide();
            this.hide_dropdown();
        }.bind(this));

        // svg export
        map.callback_manager.set('before_svg_export', function() {
            this.direction_arrow.hide();
            this.hide_target();
        }.bind(this));
    }

    function setup_zoom_callbacks(zoom_container) {
        zoom_container.callback_manager.set('zoom.input', function() {
            if (this.is_active) {
                this.place_at_selected();
            }
        }.bind(this));
    }

    function is_visible() {
        return this.placed_div.is_visible();
    }

    function toggle(on_off) {
        if (on_off===undefined) this.is_active = !this.is_active;
        else this.is_active = on_off;
        if (this.is_active) {
            this.toggle_start_reaction_listener(true);
            if (this.target_coords !== null)
                this.show_dropdown(this.target_coords);
            else this.reload_at_selected();
            this.map.set_status('Click on the canvas or an existing metabolite');
            this.direction_arrow.show();
            // escape key
            this.escape = this.map.key_manager
                .add_escape_listener(function() {
                    this.hide_dropdown();
                }.bind(this), 'build_input');
        } else {
            this.toggle_start_reaction_listener(false);
            this.placed_div.hide();
            this.completely.input.blur();
            this.completely.hideDropDown();
            this.map.set_status(null);
            this.direction_arrow.hide();
            if (this.escape) this.escape.clear();
            this.escape = null;
        }
    }
    function show_dropdown(coords) {
        this.placed_div.place(coords);
        this.completely.input.blur();
        this.completely.repaint();
        this.completely.setText("");
        this.completely.input.focus();
    }
    function hide_dropdown() {
        this.placed_div.hide();
        this.completely.hideDropDown();
    }
    function place_at_selected() {
        /** Place autocomplete box at the first selected node.
         
         */

        // get the selected node
        this.map.deselect_text_labels();
        var selected_node = this.map.select_single_node();
        if (selected_node==null) return;
        var coords = { x: selected_node.x, y: selected_node.y };
        this.place(coords);
    }
    function place(coords) {
        this.placed_div.place(coords);
        this.direction_arrow.set_location(coords);
        this.direction_arrow.show();
    }

    function reload_at_selected() {
        /** Reload data for autocomplete box and redraw box at the first
         selected node.
         
         */
        // get the selected node
        this.map.deselect_text_labels();
        var selected_node = this.map.select_single_node();
        if (selected_node==null) return false;
        var coords = { x: selected_node.x, y: selected_node.y };
        // reload the reaction input
        this.reload(selected_node, coords, false);
        return true;
    }
    function reload(selected_node, coords, starting_from_scratch) {
        /** Reload data for autocomplete box and redraw box at the new
         coordinates.
         
         */

        // try finding the selected node
        if (!starting_from_scratch && !selected_node) {
            console.error('No selected node, and not starting from scratch');
            return;
        }

        this.place(coords);

        // blur
        this.completely.input.blur();
        this.completely.repaint(); // put in place()?

        if (this.map.cobra_model===null) {
            this.completely.setText('Cannot add: No model.');
            return;
        }

        // settings
        var show_names = this.settings.get_option('identifiers_on_map') == 'name',
            allow_duplicates = this.settings.get_option('allow_building_duplicate_reactions');

        // Find selected
        var options = [],
            cobra_reactions = this.map.cobra_model.reactions,
            cobra_metabolites = this.map.cobra_model.metabolites,
            reactions = this.map.reactions,
            has_data_on_reactions = this.map.has_data_on_reactions,
            reaction_data = this.map.reaction_data,
            reaction_data_styles = this.map.reaction_data_styles,
            selected_m_name = (selected_node ? (show_names ? selected_node.name : selected_node.bigg_id) : ''),
            bold_mets_in_str = function(str, mets) {
                return str.replace(new RegExp('(^| )(' + mets.join('|') + ')($| )', 'g'),
                                   '$1<b>$2</b>$3');
            };

        // for reactions
        var reaction_suggestions = {};        
        for (var bigg_id in cobra_reactions) {
            var reaction = cobra_reactions[bigg_id],
                reaction_name = reaction.name,
                show_r_name = (show_names ? reaction_name : bigg_id);

            // ignore drawn reactions
            if ((!allow_duplicates) && already_drawn(bigg_id, reactions))
                continue;

            // check segments for match to selected metabolite
            for (var met_bigg_id in reaction.metabolites) {

                // if starting with a selected metabolite, check for that id
                if (starting_from_scratch || met_bigg_id == selected_node.bigg_id) {

                    // don't add suggestions twice
                    if (bigg_id in reaction_suggestions) continue;

                    var met_name = cobra_metabolites[met_bigg_id].name;
                    
                    if (has_data_on_reactions) {
                        options.push({ reaction_data: reaction.data,
                                       html: ('<b>' + show_r_name + '</b>' +
                                              ': ' +
                                              reaction.data_string),
                                       matches: [show_r_name],
                                       id: bigg_id });
                        reaction_suggestions[bigg_id] = true;
                    } else {
                        // get the metabolite names or IDs
                        var mets = {},
                            show_met_names = [];
                        if (show_names) {
                            for (var met_id in reaction.metabolites) {
                                var name = cobra_metabolites[met_id].name;
                                mets[name] = reaction.metabolites[met_id];
                                show_met_names.push(name);
                            }
                        } else {
                            mets = utils.clone(reaction.metabolites);
                            for (var met_id in reaction.metabolites) {
                                show_met_names.push(met_id);
                            }
                        }
                        var key = show_names ? 'name' : 'bigg_id',
                            show_gene_names = reaction.genes.map(function(g_obj) {
                                return g_obj[key];
                            });
                        // get the reaction string
                        var reaction_string = CobraModel.build_reaction_string(mets,
                                                                               reaction.reversibility,
                                                                               reaction.lower_bound,
                                                                               reaction.upper_bound);
                        options.push({ html: ('<b>' + show_r_name + '</b>' +
                                              '\t' +
                                              bold_mets_in_str(reaction_string, [selected_m_name])),
                                       matches: [show_r_name].concat(show_met_names).concat(show_gene_names),
                                       id: bigg_id });
                        reaction_suggestions[bigg_id] = true;
                    }
                }
            }
        }
        
        // Generate the array of reactions to suggest and sort it
        var sort_fn;
        if (has_data_on_reactions) {
            sort_fn = function(x, y) {
                return Math.abs(y.reaction_data) - Math.abs(x.reaction_data);
            };
        } else {
            sort_fn = function(x, y) {
                return (x.html.toLowerCase() < y.html.toLowerCase() ? -1 : 1);
            };
        }
        options = options.sort(sort_fn);
        // set up the box with data, searching for first num results
        var num = 20,
            complete = this.completely;
        complete.options = options;

        // TODO test this behavior
        // if (strings_to_display.length==1) complete.setText(strings_to_display[0]);
        // else complete.setText("");
        complete.setText("");
        
        var direction_arrow = this.direction_arrow,
            check_and_build = function(id) {
                if (id !== null) {
                    // make sure the selected node exists, in case changes were made in the meantime
                    if (starting_from_scratch) {
                        this.map.new_reaction_from_scratch(id,
                                                           coords,
                                                           direction_arrow.get_rotation());
                    } else {
                        if (!(selected_node.node_id in this.map.nodes)) {
                            console.error('Selected node no longer exists');
                            this.hide_dropdown();
                            return;
                        }
                        this.map.new_reaction_for_metabolite(id,
                                                             selected_node.node_id,
                                                             direction_arrow.get_rotation());
                    }
                }
            }.bind(this);
        complete.onEnter = function(id) {
            this.setText("");
            this.onChange("");
            check_and_build(id);
        };
        complete.repaint();
        this.completely.input.focus();

        //definitions
        function already_drawn(bigg_id, reactions) {
            for (var drawn_id in reactions) {
                if (reactions[drawn_id].bigg_id==bigg_id) 
                    return true;
            }
            return false;
        };
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
            this.map.sel.on('click.start_reaction', function(node) {
                // TODO fix this hack
                if (this.direction_arrow.dragging) return;
                // reload the reaction input
                var coords = { x: d3.mouse(node)[0],
                               y: d3.mouse(node)[1] };
                // unselect metabolites
                this.map.deselect_nodes();
                this.map.deselect_text_labels();
                // reload the reaction input
                this.reload(null, coords, true);
                // generate the target symbol
                this.show_target(this.map, coords);
            }.bind(this, this.map.sel.node()));
            this.map.sel.classed('start-reaction-cursor', true);
        } else {
            this.map.sel.on('click.start_reaction', null);
            this.map.sel.classed('start-reaction-cursor', false);
            this.hide_target();
        }
    }

    function hide_target() {
        if (this.target_coords)
            this.map.sel.selectAll('.start-reaction-target').remove();
        this.target_coords = null;
    }
    function show_target(map, coords) {
        var s = map.sel.selectAll('.start-reaction-target').data([12, 5]);
        s.enter().append('circle')
            .classed('start-reaction-target', true)
            .attr('r', function(d) { return d; })
            .style('stroke-width', 4);
        s.style('visibility', 'visible')
            .attr('transform', 'translate('+coords.x+','+coords.y+')');
        this.target_coords = coords;
    }
});
