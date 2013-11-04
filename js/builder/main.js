define(["vis/scaffold", "metabolic-map/utils", "lib/d3", "lib/complete.ly"], function(scaffold, utils, d3, completely) {
    // TODO
    // connected node object
    // only display each node once
    // why aren't some nodes appearing as selected?
    // BRANCHING!
    // make object oriented ?
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            selection: d3.select("body").append("div"),
            selection_is_svg: false,
            fillScreen: false,
            update_hook: false,
            css_path: null,
            map_path: null,
            map_json: null,
            flux_path: null,
            flux: null,
            flux2_path: null,
            flux2: null,
            css: '' });

        if (o.selection_is_svg)
            console.error("Builder does not support placement within svg elements");

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
        key_listeners();

        var files_to_load = [{ file: o.css_path, callback: set_css },
                             { file: o.map_path, callback: set_map },
                             { file: o.flux_path,
                               callback: function(e, f) { set_flux(e, f, 0); },
                               value: o.flux},
                             { file: o.flux2_path,
                               callback: function(e, f) { set_flux(e, f, 1); },
                               value: o.flux2 } ];
        scaffold.load_files(files_to_load, load);

        return { load: load };

        // Definitions
        function set_css(error, css) {
            if (error) console.warn(error);
            o.css = css;
        };
        function set_map(error, map_data) {
            if (error) console.warn(error);
            o.map_data = map_data;
        };
        function set_flux(error, flux, index) {
            if (error) console.warn(error);
            if (index==0) o.flux = flux;
            else if (index==1) o.flux2 = flux;
        };
        function setup_menu(selection) {
            var sel = selection.append("div").attr("id", "menu");
            new_button(sel, cmd_hide_show_input, "New reaction (/)");
            new_button(sel, cmd_cycle_primary_metabolite, "Cycle primary metabolite (p)");
            new_button(sel, cmd_left, "Left (←)");
            new_button(sel, cmd_right, "Right (→)");
            new_button(sel, cmd_up, "Up (↑)");
            new_button(sel, cmd_down, "Down (↓)");
            new_button(sel, cmd_save, "Save (^s)");
            o.load_input_click_fn = new_input(sel, cmd_load, "Load (^o)");
            return sel;

            function new_button(s, fn, name) {
                s.append("button").attr("class", "command-button")
                    .text(name).on("click", fn);
            }
            function new_input(s, fn, name) {
		/* Returns a function that can be called to programmatically
		 * load files.
		 */
                var input = s.append("input").attr("class", "command-button")
                        .attr("type", "file")
                        .style("display", "none")
                        .on("change", function() {
			    utils.load_json(this.files[0], function(error, data) {
				if (error) return console.warn(error);
				o.drawn_reactions = data;
				reset();
				draw();
				return null;
			    });
			});
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
        };

        function setup_status(selection) {
            return selection.append("div").attr("id", "status");
        };
        function set_status(status) {
            // TODO put this in js/metabolic-map/utils.js
            var t = d3.select('body').select('#status');
            if (t.empty()) t = d3.select('body')
                .append('text')
                .attr('id', 'status');
            t.text(status);
            return this;
        }

        function load() {
            o.version = 0.2;
            o.selected_node = {'reaction_id': '',
                               'metabolite_id': '',
                               'direction': '',
                               'is_selected': false};
            o.drawn_reactions = {};
            o.arrowheads_generated = [];
            o.cobra_reactions = {};
            o.sorted_reaction_suggestions = [];
            o.scale = {};
            o.scale.flux_color = d3.scale.linear()
                .domain([0, 20])
                .range(["blue", "red"]);
            o.default_reaction_color = '#eeeeee';
            o.decimal_format = d3.format('.3g');
            o.window_translate = {'x': 0, 'y': 0};
            o.window_scale = 1;
            o.mode = 'builder';

            var svg = o.svg,
                style = o.css,
                width = o.width,
                height = o.height;

            // set up svg and svg definitions
            var defs = utils.setup_defs(svg, style),
                out = utils.setup_zoom_container(svg, width, height, [0.05, 15], function(ev) {
                    o.window_translate = {'x': ev.translate[0], 'y': ev.translate[1]};
                    o.window_scale = ev.scale;
                    // if (reaction_input_is_visible())
                    //  place_reaction_input(coords_for_selected_metabolite());
                }),
                sel = out.sel,
                zoom = out.zoom;
            o.zoom = zoom;
            o.sel = sel;

            var mouse_node = o.sel.append('rect')
                    .attr("width", o.width)
                    .attr("height", o.height)
                    .attr("style", "stroke:black;fill:none;")
                    .attr('pointer-events', 'all');

            o.sel.append('g')
                .attr('id', 'reactions');

            // setup selection box
            var start_coords = {'x': o.width/2, 'y': 40};
            load_model_and_list(start_coords, function() {
                // TEST case
                if (true) {
                    new_reaction('GLCtex', start_coords);
                }
                d3.select('#loading').style("display", "none");
                // Focus on menu. TODO use a better callback rather than the
                // setTimeout.
                // window.setTimeout(function() { o.reaction_input.completely.input.focus(); }, 50);
            });

            return this;
        }

        function load_model_and_list(coords, callback_function) {
            //  model = {
            //      reactions: {
            //          cobra_id_1: {
            //            metabolites: { cobra_id_2: { coefficient: }, ... }
            //          }, ...
            //      }
            //  }

            // Object.keys(myArray).length for length of the object (no good in IE8)
            // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation

            d3.json("data/maps/cobra_model_0.2.json", function(error, model) {
                if (error) console.warn(error);
                o.cobra_reactions = model.reactions;

                // load list data
                d3.json("data/flux/flux-wt-pFBA.json", function(error, json) {
                    if (error) console.warn(error);

                    // sort by flux value
                    var sorted = [];
                    for (var flux_reaction_id in json) {
                        // fix reaction ids
                        sorted.push([flux_reaction_id.replace('(', '_').replace(')', ''),
                                     parseFloat(json[flux_reaction_id])]);
                    }
                    sorted.sort(function(a,b) { return Math.abs(b[1]) - Math.abs(a[1]); });
                    var i=-1;
                    while (++i < sorted.length) {
                        // update strings for reaction list
                        o.sorted_reaction_suggestions.push({
                            label: sorted[i][0]+": "+o.decimal_format(sorted[i][1]),
                            value: sorted[i][0]
                        });

                        // update model with fluxes
                        for (var reaction_id in o.cobra_reactions) {
                            // set flux for reaction
                            if (reaction_id == sorted[i][0]) {
                                o.cobra_reactions[reaction_id].flux = sorted[i][1];
                                // also set flux for metabolites (for simpler drawing)
                                for (var metabolite_id in o.cobra_reactions[reaction_id].metabolites)
                                    o.cobra_reactions[reaction_id].metabolites[metabolite_id].flux = sorted[i][1];
                            }
                        }
                    }
                    callback_function();
                });
            });

        }

        function place_reaction_input(coords) {
            var d = {'x': 280, 'y': 0},
                input = o.reaction_input;
            var left = Math.max(20, Math.min(o.width-270, (o.window_scale * coords.x + o.window_translate.x - d.x)));
            var top = Math.max(20, Math.min(o.height-40, (o.window_scale * coords.y + o.window_translate.y - d.y)));
            // blur
            input.completely.input.blur();
            input.selection.style('position', 'absolute')
                .style('display', 'block')
                .style('left',left+'px')
                .style('top',top+'px');
            input.completely.repaint();
        }

        function reload_reaction_input(coords) {
            /* Reload data for autocomplete box and redraw box at the new
             * coordinates.
             */
            place_reaction_input(coords);

            // Find selected reaction
            var reaction_ids_to_display = [],
                already_drawn = function(reaction_id) {
                    for (var drawn_id in o.drawn_reactions)
                        if (reaction_id==drawn_id) return true;
                    return false;
                };
            for (var reaction_id in o.cobra_reactions) {
                var reaction = o.cobra_reactions[reaction_id];
                // ignore drawn reactions
                if (already_drawn(reaction_id)) continue;
                if (o.selected_node.is_selected) {
                    // check metabolites for match to selected metabolite
                    for (var metabolite_id in reaction.metabolites) {
                        if (metabolite_id==o.selected_node.metabolite_id &&
                            reaction.metabolites[metabolite_id].coefficient < 0) {
                            reaction_ids_to_display.push(reaction_id);
                        }
                    }
                } else {
                    reaction_ids_to_display.push(reaction_id);
                }
            }

            // Generate the list of reactions to suggest
            var filtered_suggestions = o.sorted_reaction_suggestions.filter(function(x) {
                return reaction_ids_to_display.indexOf(x.value) > -1;
            });
            // Make an array of strings to suggest, and an object to retrieve
            // the reaction ids
            var i = -1, reaction_obj = {}, strings_to_display = [];
            while (++i < filtered_suggestions.length) {
                reaction_obj[filtered_suggestions[i].label] = filtered_suggestions[i].value;
                strings_to_display.push(filtered_suggestions[i].label);
            };

            // set up the box with data, searching for first num results
            var num = 20;
            var complete = o.reaction_input.completely;
            complete.options = strings_to_display;
            if (reaction_ids_to_display.length==1) complete.setText(reaction_ids_to_display[0]);
            else complete.setText("");
            complete.onEnter = function() {
                if (reaction_obj.hasOwnProperty(this.getText()))
                    new_reaction(reaction_obj[this.getText()], coords);
                this.setText("");
            };
            complete.repaint();
            o.reaction_input.completely.input.focus();
        }

        // -----------------------------------------------------------------------------------
        // DRAW

        function align_to_grid(loc) {
            return loc;
            // TODO debug with drag and drop
            // var r = function (a) { return Math.round(a/1.)*1.; };
            // return {'x': r(loc.x), 'y': r(loc.y)};
        }

        function rotate_coords_recursive(coords_array, angle, center) {
            var i=-1,
                rotated = [];
            while (++i<coords_array.length) {
                rotated.push(rotate_coords(coords_array[i]));
            }
            return rotated;
        }

        function rotate_coords(c, angle, center) {
            var dx = Math.cos(angle) * (c.x - center.x) +
                    Math.sin(angle) * (c.y - center.y) +
                    center.x,
                dy = - Math.sin(angle) * (c.x - center.x) +
                    Math.cos(angle) * (c.y - center.y) +
                    center.y;
            return {'x': dx, 'y': dy};
        }

        function calculate_reaction_coordinates(reaction) {
            var dis = 120;
            reaction.dis = dis;
            var main_axis = [{'x': 0, 'y': 0}, {'x': 0, 'y': dis}];
            reaction.main_axis = main_axis;
            reaction.center = {'x': (main_axis[0].x + main_axis[1].x)/2,   // for convenience
                               'y': (main_axis[0].y + main_axis[1].y)/2};
            return reaction;
        }

        function calculate_metabolite_coordinates(met, primary_index, angle, main_axis, center, dis) {
            // basic constants
            met.text_dis = {'x': 0, 'y': -18}; // displacement of metabolite label

            // Curve parameters
            var w = 60,  // distance between reactants and between products
                b1_strength = 0.5,
                b2_strength = 0.2,
                w2 = w*0.7,
                secondary_dis = 20,
                num_slots = Math.min(2, met.count - 1);

            // size and spacing for primary and secondary metabolites
            var ds, draw_at_index;
            if (met.is_primary) { // primary
                met.r = 10;
                ds = 20;
            } else { // secondary
                met.r = 5;
                ds = 10;
                // don't use center slot
                if (met.index > primary_index) draw_at_index = met.index - 1;
                else draw_at_index = met.index;
            }

            var de = dis - ds, // distance between ends of line axis
                reaction_axis = [{'x': 0, 'y': ds},
                                 {'x': 0, 'y': de}];

            // Define line parameters and axis.
            // Begin with unrotated coordinate system. +y = Down, +x = Right.
            var start = center,
                end, circle, b1, b2;
            // reactants
            if (met.coefficient < 0 && met.is_primary) {
                end = {'x': reaction_axis[0].x + met.dis.x,
                       'y': reaction_axis[0].y + met.dis.y};
                b1 = {'x': start.x*b1_strength + reaction_axis[0].x*(1-b1_strength),
                      'y': start.y*b1_strength + reaction_axis[0].y*(1-b1_strength)};
                b2 = {'x': start.x*b2_strength + (end.x)*(1-b2_strength),
                      'y': start.y*b2_strength + (end.y)*(1-b2_strength)},
                circle = {'x': main_axis[0].x + met.dis.x,
                          'y': main_axis[0].y + met.dis.y};
            } else if (met.coefficient < 0) {
                end = {'x': reaction_axis[0].x + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.x,
                       'y': reaction_axis[0].y + secondary_dis + met.dis.y},
                b1 = {'x': start.x*b1_strength + reaction_axis[0].x*(1-b1_strength),
                      'y': start.y*b1_strength + reaction_axis[0].y*(1-b1_strength)},
                b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                      'y': start.y*b2_strength + end.y*(1-b2_strength)},
                circle = {'x': main_axis[0].x + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.x,
                          'y': main_axis[0].y + secondary_dis + met.dis.y};
            } else if (met.coefficient > 0 && met.is_primary) {        // products
                end = {'x': reaction_axis[1].x + met.dis.x,
                       'y': reaction_axis[1].y + met.dis.y};
                b1 = {'x': start.x*b1_strength + reaction_axis[1].x*(1-b1_strength),
                      'y': start.y*b1_strength + reaction_axis[1].y*(1-b1_strength)};
                b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                      'y': start.y*b2_strength + end.y*(1-b2_strength)},
                circle = {'x': main_axis[1].x + met.dis.x,
                          'y': main_axis[1].y + met.dis.y};
            } else if (met.coefficient > 0) {
                end = {'x': reaction_axis[1].x + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.x,
                       'y': reaction_axis[1].y - secondary_dis + met.dis.y},
                b1 = {'x': start.x*b1_strength + reaction_axis[1].x*(1-b1_strength),
                      'y': start.y*b1_strength + reaction_axis[1].y*(1-b1_strength)};
                b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                      'y': start.y*b2_strength + end.y*(1-b2_strength)},
                circle = {'x': main_axis[1].x + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.x,
                          'y': main_axis[1].y - secondary_dis + met.dis.y};
            }
            // rotate coordinates around start point
            met.start  = rotate_coords(start,  angle, main_axis[0]),
            met.end    = rotate_coords(end,    angle, main_axis[0]),
            met.b1     = rotate_coords(b1,     angle, main_axis[0]),
            met.b2     = rotate_coords(b2,     angle, main_axis[0]),
            met.circle = rotate_coords(circle, angle, main_axis[0]);

            return met;
        }

        function new_reaction(reaction_id, coords) {
            // New object at x, y coordinates.

            // If reaction id is not new, then return:
            if (o.drawn_reactions.hasOwnProperty(reaction_id)) {
                console.warn('reaction is already drawn');
                return;
            }

            // set reaction coordinates and angle
            // be sure to copy the reaction recursively
            var reaction = utils.clone(o.cobra_reactions[reaction_id]);
            reaction.coords = align_to_grid(coords);
            reaction.angle = 0 * (Math.PI / 180); // default angle

            // calculate coordinates of reaction
            reaction = calculate_reaction_coordinates(reaction);

            // set primary metabolites and count reactants/products
            var primary_reactant_index = 0,
                primary_product_index = 0,
                reactant_count = 0, product_count = 0,
                newest_primary_product_id = "";

            for (var metabolite_id in reaction.metabolites) {
                var metabolite = reaction.metabolites[metabolite_id];
                if (metabolite.coefficient < 0) {
                    metabolite.index = reactant_count;
                    if (reactant_count==primary_reactant_index) metabolite.is_primary = true;
                    reactant_count++;
                } else {
                    metabolite.index = product_count;
                    if (product_count==primary_product_index) {
                        metabolite.is_primary = true;
                        newest_primary_product_id = metabolite_id;
                    };
                    product_count++;
                }
            }

            // keep track of total reactants and products
            for (metabolite_id in reaction.metabolites) {
                metabolite = reaction.metabolites[metabolite_id];
                var primary_index;
                if (metabolite.coefficient < 0) {
                    metabolite.count = reactant_count + 1;
                    primary_index = primary_reactant_index;
                } else {
                    metabolite.count = product_count + 1;
                    primary_index = primary_product_index;
                }

                // record reaction_id with each metabolite
                metabolite.reaction_id = reaction_id;
                metabolite.dis = {'x': 0, 'y': 0};

                // calculate coordinates of metabolite components
                metabolite = calculate_metabolite_coordinates(metabolite,
                                                              primary_index,
                                                              reaction.angle,
                                                              reaction.main_axis,
                                                              reaction.center,
                                                              reaction.dis);
            }

            // append the new reaction
            o.drawn_reactions[reaction_id] = reaction;

            // draw, and set the new coords
            o.selected_node = {'reaction_id': reaction_id,
                               'direction': "product",
                               'metabolite_id': newest_primary_product_id,
                               'is_selected': true};

            draw();
            var new_coords = coords_for_selected_metabolite();
            translate_off_screen(new_coords);
            if (reaction_input_is_visible())
                reload_reaction_input(new_coords);
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

        function coords_for_selected_metabolite() {
            if (o.selected_node.is_selected)
                return get_coords_for_metabolite(o.selected_node.metabolite_id, o.selected_node.reaction_id);
            else
                console.log('no node selected');
            return {'x':0, 'y':0};
        }

        function get_coords_for_metabolite(metabolite_id, reaction_id) {
            var reaction = o.drawn_reactions[reaction_id],
                metabolite = reaction.metabolites[metabolite_id],
                coords = reaction.coords;
            return {'x': coords.x + metabolite.circle.x,
                    'y': coords.y + metabolite.circle.y};
        }

        function cycle_primary_key() {
            // cycle the primary metabolite among the products of the selected reaction

            if (!o.selected_node.is_selected) {
                console.log('no selected node');
                return;
            }

            // get last index
            var last_index, count;
            var reaction = o.drawn_reactions[o.selected_node.reaction_id];
            for (var metabolite_id in reaction.metabolites) {
                var metabolite = reaction.metabolites[metabolite_id];
                if ((metabolite.coefficient > 0 && o.selected_node.direction=="product") ||
                    (metabolite.coefficient < 0 && o.selected_node.direction=="reactant")) {
                    if (metabolite.is_primary) {
                        last_index = metabolite.index;
                        count = metabolite.count;
                    }
                }
            }
            // rotate to new index
            var index = last_index + 1 < count - 1 ? last_index + 1 : 0;
            rotate_primary_key(index);
        }

        function rotate_primary_key(index) {
            // switch the primary metabolite to the index of a particular product

            if (!o.selected_node.is_selected) {
                console.log('no selected node');
                return;
            }

            // update primary in o.drawn_reactions
            var new_primary_metabolite_id;
            var reaction = o.drawn_reactions[o.selected_node.reaction_id];

            // if primary is selected, then maintain that selection
            var sel_is_primary = reaction.metabolites[o.selected_node.metabolite_id].is_primary,
                should_select_primary = sel_is_primary ? true : false;

            for (var metabolite_id in reaction.metabolites) {
                var metabolite = reaction.metabolites[metabolite_id];
                if ((metabolite.coefficient > 0 && o.selected_node.direction=="product") ||
                    (metabolite.coefficient < 0 && o.selected_node.direction=="reactant")) {
                    if (metabolite.index == index) {
                        metabolite.is_primary = true;
                        new_primary_metabolite_id = metabolite_id;
                    } else {
                        metabolite.is_primary = false;
                    }
                    // calculate coordinates of metabolite components
                    metabolite = calculate_metabolite_coordinates(metabolite,
                                                                  index,
                                                                  reaction.angle,
                                                                  reaction.main_axis,
                                                                  reaction.center,
                                                                  reaction.dis);
                }
            }

            var coords;
            if (should_select_primary) {
                o.selected_node.metabolite_id = new_primary_metabolite_id;
                coords = get_coords_for_metabolite(o.selected_node.metabolite_id,
                                                   o.selected_node.reaction_id);
            } else {
                coords = get_coords_for_metabolite(o.selected_node.metabolite_id,
                                                   o.selected_node.reaction_id);
            }

            draw_specific_reactions([o.selected_node.reaction_id]);
        }

        function select_metabolite(d) {
            o.selected_node.metabolite_id = d.metabolite_id;
            o.selected_node.direction = d.coefficient > 0 ? 'product' : 'reactant';
            o.selected_node.is_selected = true;
            o.selected_node.reaction_id = d.reaction_id;
            if (reaction_input_is_visible())
                reload_reaction_input(coords_for_selected_metabolite());
            draw();
        }

        function create_metabolite(enter_selection) {
            // create metabolites
            var g = enter_selection
                    .append('g')
                    .attr('class', 'metabolite-group')
                    .attr('id', function(d) { return d.metabolite_id; });

            // create reaction arrow
            g.append('path')
                .attr('class', 'reaction-arrow');

            // create metabolite circle and label
            // TODO hide if the node is shared
            var mg = g.append('g')
                    .attr('class', 'circle-and-label');

            mg.append('circle')
                .attr('class', 'metabolite-circle')
                .on("click", select_metabolite)
                .call(d3.behavior.drag()
                      .on("dragstart", drag_silence)
                      .on("drag", drag_move)
                      .on("dragend", drag_update));
            mg.append('text')
                .attr('class', 'metabolite-label')
                .text(function(d) { return d.metabolite_id; })
                .attr('pointer-events', 'none');

            function drag_move() {
                var sel = d3.select(this),
                    met = o.drawn_reactions[sel.datum().reaction_id]
                        .metabolites[sel.datum().metabolite_id],
                    d = align_to_grid({'x': d3.event.dx, 'y': d3.event.dy});
                met.dis = align_to_grid({'x': met.dis.x + d3.event.dx,
                                         'y': met.dis.y + d3.event.dy});

                var transform = d3.transform(sel.attr('transform'));
                sel.attr('transform', 'translate(' +
                         (transform.translate[0]+d3.event.dx) + ',' +
                         (transform.translate[1]+d3.event.dy) + ')' +
                         'scale(' + transform.scale + ')');
            }
            function drag_silence() {
                d3.event.sourceEvent.stopPropagation(); // silence other listeners
            }
            function drag_update() {
                var sel = d3.select(this),
                    transform = d3.transform(sel.attr('transform'));
                sel.attr('transform', null);
                draw_specific_reactions_with_location([sel.datum().reaction_id]);
            }
        }

        function update_metabolite(update_selection) {
            // update metabolite attributes

            // update arrows
            update_selection
                .selectAll('.reaction-arrow')
            // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
            // only necessary for selectAll()
                .datum(function() {
                    return this.parentNode.__data__;
                })
                .attr('d', function(d) {
                    return 'M'+d.start.x+','+d.start.y+
                        'C'+d.b1.x+','+d.b1.y+' '+
                        d.b2.x+','+d.b2.y+' '+
                        d.end.x+','+d.end.y;
                }) // TODO replace with d3.curve or equivalent
                .attr("marker-end", function (d) {
                    var c = d.flux ? o.scale.flux_color(Math.abs(d.flux)) :
                            o.default_reaction_color;
                    // generate arrowhead for specific color
                    var arrow_id = generate_arrowhead_for_color(c, true);
                    return "url(#" + arrow_id + ")";
                })
                .style('stroke', function(d) {
                    var c = d.flux ? o.scale.flux_color(Math.abs(d.flux)) :
                            o.default_reaction_color;
                    return c;
                });

            // update circle and label location
            var mg = update_selection
                    .selectAll('.circle-and-label')
            // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
            // only necessary for selectAll()
                    .datum(function() {
                        return this.parentNode.__data__;
                    })
                    .attr('transform', function(d) {
                        return 'translate('+d.circle.x+','+d.circle.y+')';
                    });

            var is_sel = function(d) {
                if (d.reaction_id==o.selected_node.reaction_id &&
                    d.metabolite_id==o.selected_node.metabolite_id &&
                    o.selected_node.is_selected)
                    return true;
                return false;
            };

            mg.select('.metabolite-circle')
                .attr('r', function(d) { return d.r; })
                .style('stroke', function(d) {
                    if (is_sel(d)) return '#222';
                    return null;
                })
                .style('stroke-width', function(d) {
                    if (is_sel(d)) return '3px';
                    return null;
                });
            mg.select('.metabolite-label')
                .attr('transform', function(d) {
                    return 'translate('+d.text_dis.x+','+d.text_dis.y+')';
                });
        }

        function create_reaction_label(sel) {
            // draw reaction label for selection
            sel.append('text')
                .attr('class', 'reaction-label')
                .attr('pointer-events', 'none');
        }
        function update_reaction_label(sel) {
            var near_angle_degrees = function(angle, near) {
                return (angle > (near-45)*Math.PI/180 && angle<(near+45)*Math.PI/180);
            };

            sel.text(function(d) {
                return d.reaction_id + " (" + o.decimal_format(d.flux) + ")";
            })
                .attr('transform', function(d) {
                    // displacement of reaction label
                    var dis;
                    if (near_angle_degrees(d.angle, 90))
                        dis = {'x': 30, 'y': -35};
                    else if (near_angle_degrees(d.angle, 180))
                        dis = {'x': -20, 'y': 0};
                    else if (near_angle_degrees(d.angle, 270))
                        dis = {'x': -30, 'y': 35};
                    else if (near_angle_degrees(d.angle, 0))
                        dis = {'x': 20, 'y': 0};
                    var loc = rotate_coords({'x': d.center.x + dis.x,
                                             'y': d.center.y + dis.y},
                                            d.angle, d.main_axis[0]);
                    return 'translate('+loc.x+','+loc.y+')';
                });
        }

        function create_reaction(enter_selection) {
            // attributes for new reaction group
            var t = enter_selection.append('g')
                    .attr('id', function(d) { return d.reaction_id; })
                    .attr('class', 'reaction')
                    .attr('transform', function(d) {
                        return 'translate(' + d.coords.x + ',' + d.coords.y + ')';
                    })
                    .call(create_reaction_label);

            return;
        }
        function update_reaction(update_selection) {
            // update reaction label
            update_selection.select('.reaction-label')
                .call(update_reaction_label);

            // select metabolites
            var sel = update_selection
                    .selectAll('.metabolite-group')
                    .data(function(d) {
                        return make_array(d.metabolites, 'metabolite_id');
                    }, function(d) { return d.metabolite_id; });

            // new metabolites
            sel.enter().call(create_metabolite);

            // update metabolites
            sel.call(update_metabolite);

            // old metabolites
            sel.exit().remove();

            return;
        }

        function make_array(obj, id_key) { // is this super slow?
            var array = [];
            for (var key in obj) {
                // copy object
                var it = utils.clone(obj[key]);
                // add key as 'id'
                it[id_key] = key;
                // add object to array
                array.push(it);
            }
            return array;
        }

	function reset() {
            var sel = d3.select('#reactions')
                    .selectAll('.reaction')
		    .remove();
	}	    

        function draw() {
            /* Draw the reactions
	     */

            // generate reactions for o.drawn_reactions
            // assure constancy with cobra_id
            var sel = d3.select('#reactions')
                    .selectAll('.reaction')
                    .data(make_array(o.drawn_reactions, 'reaction_id'),
                          function(d) { return d.reaction_id; }); // LEFTOFF generate array from o.drawn_reactions object

            // enter: generate and place reaction
            sel.enter().call(create_reaction);

            // update: update when necessary
            sel.call(update_reaction);

            // exit
            sel.exit().remove();
        }

        function draw_specific_reactions(reaction_ids) {
            // console.log('updating these ids:');
            // console.log(reaction_ids);

            // find reactions for reaction_ids
            var reaction_subset = {},
                i = -1;
            while (++i<reaction_ids.length) {
                reaction_subset[reaction_ids[i]] = utils.clone(o.drawn_reactions[reaction_ids[i]]);
            }
            if (reaction_ids.length != Object.keys(reaction_subset).length) {
                console.warn('did not find correct reaction subset');
            }

            // generate reactions for o.drawn_reactions
            // assure constancy with cobra_id
            var sel = d3.select('#reactions')
                    .selectAll('.reaction')
                    .data(make_array(reaction_subset, 'reaction_id'),
                          function(d) { return d.reaction_id; });

            // enter: generate and place reaction
            sel.enter().call(create_reaction);

            // update: update when necessary
            sel.call(update_reaction);

            // exit
            // sel.exit();
        }

        function draw_specific_reactions_with_location(reaction_id) {
            var reaction = o.drawn_reactions[reaction_id],
                primary_reactant_index, primary_product_index;
            reaction = calculate_reaction_coordinates(reaction);
            for (var metabolite_id in reaction.metabolites) {
                var metabolite = reaction.metabolites[metabolite_id];
                if (metabolite.coefficient < 0)
                    if (metabolite.is_primary) primary_reactant_index = metabolite.index;
                else
                    if (metabolite.is_primary) primary_product_index = metabolite.index;
            }
            for (metabolite_id in reaction.metabolites) {
                metabolite = reaction.metabolites[metabolite_id];
                var primary_index;
                if (metabolite.coefficient < 0) {
                    primary_index = primary_reactant_index;
                } else {
                    primary_index = primary_product_index;
                }
                metabolite = calculate_metabolite_coordinates(metabolite,
                                                              primary_index, //should this be saved as metabolite.primary_index?
                                                              reaction.angle,
                                                              reaction.main_axis,
                                                              reaction.center,
                                                              reaction.dis);
            }
            draw_specific_reactions([reaction_id]);
        }

        function modify_reaction(cobra_id, key, value) {
            // modify reaction with cobra_id to have new (key, value) pair
            o.drawn_reactions[cobra_id][key] = value;
        }

        function generate_arrowhead_for_color(color, is_end) {
            var pref;
            if (is_end) pref = 'start-';
            else        pref = 'end-';

            var id = String(color).replace('#', pref);
            if (o.arrowheads_generated.indexOf(id) < 0) {
                o.arrowheads_generated.push(id);

                var markerWidth = 5,
                    markerHeight = 5,
                    // cRadius = 0, // play with the cRadius value
                    // refX = cRadius + (markerWidth * 2),
                    // refY = -Math.sqrt(cRadius),
                    // drSub = cRadius + refY;
                    refX,
                    refY = markerWidth/2,
                    d;

                if (is_end) refX = 0;
                else        refX = markerHeight;
                if (is_end) d = 'M0,0 V'+markerWidth+' L'+markerHeight/2+','+markerWidth/2+' Z';
                else        d = 'M'+markerHeight+',0 V'+markerWidth+' L'+(markerHeight/2)+','+markerWidth/2+' Z';

                // generate defs if it doesn't exist
                var defs = o.svg.select("defs");
                if (defs.empty()) defs = o.svg.append("svg:defs");

                // make the marker
                defs.append("svg:marker")
                    .attr("id", id)
                    .attr("class", "arrowhead")
                    .attr("refX", refX)
                    .attr("refY", refY)
                    .attr("markerWidth", markerWidth)
                    .attr("markerHeight", markerHeight)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", d)
                    .style("fill", color);
            }
            return id;
        }

        function reaction_input_is_visible() {
            return (o.reaction_input.selection.style("display")!="none");
        }

        // -----------------------------------------------------------------------------------
        // KEYBOARD

        function key_listeners() {
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
                load_key = { key: 79, modifiers: { control: true } };

            d3.select(window).on("keydown", function() {
                var kc = d3.event.keyCode,
                    reaction_input_visible = reaction_input_is_visible();
                held_keys = toggle_modifiers(modifier_keys, held_keys, kc, true);
                if (check_key(primary_cycle_key, kc, held_keys) && !reaction_input_visible) {
                    cmd_cycle_primary_metabolite();
		    held_keys = reset_held_keys();
                } else if (check_key(hide_show_input_key, kc, held_keys)) {
                    cmd_hide_show_input();
		    held_keys = reset_held_keys();
                } else if (check_key(rotate_keys.left, kc, held_keys) && !reaction_input_visible) {
                    cmd_left();
		    held_keys = reset_held_keys();
                } else if (check_key(rotate_keys.right, kc, held_keys) && !reaction_input_visible) {
                    cmd_right();
		    held_keys = reset_held_keys();
                } else if (check_key(rotate_keys.up, kc, held_keys) && !reaction_input_visible) {
                    cmd_up();
		    held_keys = reset_held_keys();
                } else if (check_key(rotate_keys.down, kc, held_keys) && !reaction_input_visible) {
                    cmd_down();
		    held_keys = reset_held_keys();
                } else if (check_key(save_key, kc, held_keys) && !reaction_input_visible) {
		    held_keys = reset_held_keys();
                    cmd_save();
                } else if (check_key(load_key, kc, held_keys) && !reaction_input_visible) {
                    cmd_load();
		    held_keys = reset_held_keys();
		}
            }).on("keyup", function() {
                held_keys = toggle_modifiers(modifier_keys, held_keys, d3.event.keyCode, false);
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
            if (reaction_input_is_visible()) cmd_hide_input();
            else cmd_show_input();
        }
        function cmd_hide_input() {
            o.reaction_input.selection.style("display", "none");
            o.reaction_input.completely.input.blur();
            o.reaction_input.completely.hideDropDown();
        }
        function cmd_show_input() {
            reload_reaction_input(coords_for_selected_metabolite());
        }
        function cmd_cycle_primary_metabolite() {
            cmd_hide_input();
            cycle_primary_key();
        }
        function cmd_left() {
            cmd_hide_input();
            modify_reaction(o.selected_node.reaction_id, 'angle', 270*(Math.PI/180));
            draw_specific_reactions_with_location(o.selected_node.reaction_id);
        }
        function cmd_right() {
            cmd_hide_input();
            modify_reaction(o.selected_node.reaction_id, 'angle', 90*(Math.PI/180));
            draw_specific_reactions_with_location(o.selected_node.reaction_id);
        }
        function cmd_up() {
            cmd_hide_input();
            modify_reaction(o.selected_node.reaction_id, 'angle', 180*(Math.PI/180));
            draw_specific_reactions_with_location(o.selected_node.reaction_id);
        }
        function cmd_down() {
            cmd_hide_input();
            modify_reaction(o.selected_node.reaction_id, 'angle', 0);
            draw_specific_reactions_with_location(o.selected_node.reaction_id);
        }
        function cmd_save() {
            console.log("Saving");
            utils.download_json(o.drawn_reactions, "map");
        }
        function cmd_load() {
	    console.log("Loading");
	    o.load_input_click_fn();
        }
    };
});
