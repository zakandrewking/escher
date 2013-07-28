var Builder = function() {
    var m = {};
    m.version = 0.1;
    m.node_selected = "";
    m.newest_coords = [];
    m.reactions_drawn = [];
    m.arrowheads_generated = [];
    m.cobra_model = [];
    m.list_strings = [];
    m.scale = {};
    m.scale.flux_color = d3.scale.linear()
        .domain([0, 1000])
        .range(["blue", "red"]);
    m.default_reaction_color = '#eeeeee';
    m.decimal_format = d3.format('.1f');
    m.window_translate = [0, 0];
    m.window_scale = 1;

    // -----------------------------------------------------------------------------------
    // SETUP

    m.setup_container = function(selection, width, height) {
        d3.select("#svg-container").remove();

        var zoom = function() {
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	    m.window_translate = d3.event.translate;
	    m.window_scale = d3.event.scale;
	    m.reload_reaction_input(m.newest_coords);
        };

        var svg = selection.append("div").attr("id","svg-container")
                .attr("style", "width:"+width+"px;height:"+height+"px;margin:0px auto")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .call(d3.behavior.zoom().scaleExtent([1, 15]).on("zoom", zoom))
                .append("g");
        return svg;
    };

    m.load_model_and_list = function(coords, callback_function) {
        // load cobra model data. looks like:
        //  model = {
        //      reactions: [
        //          { cobra_id: ,
        //            metabolites: [ { cobra_id: , coefficient: }, ... ]
        //          }, ... ]
        //  }

        d3.json("data/cobra_model.json", function(error, model) {
            if (error) console.warn(error);
            m.cobra_model = model;

            // load list data
            d3.json("data/flux_example.json", function(error, json) {
                if (error) console.warn(error);
                var flux;
                for (var i=0; i<json.length; i++) {
                    // update model with fluxes
                    m.cobra_model = m.cobra_model.map(function(x) {
                        flux = parseFloat(json[i][1]);
                        // set flux for reaction
                        if (x.cobra_id == json[i][0]) {
                            x.flux = flux;
                            // also set flux for metabolites (for simpler drawing)
                            var j=-1;
                            while (++j < x.metabolites.length) {
                                x.metabolites[j].flux = flux;
                            }
                        }
                        return x;
                    });
                    // update strings for reaction list
                    m.list_strings = m.list_strings.concat({ label: json[i][0]+" -- "+parseFloat(json[i][1]),
                                                             value: json[i][0] });
                }
                m.reload_reaction_input(coords);
                callback_function();
            });
        });
    };

    m.reload_reaction_input = function(coords) {
        // Reload data for autocomplete box and redraw box at the new
        // coordinates.
        if (coords==[]) {
            console.log('no coords');
            return;
        }
        var l_w = 200, d_y = 20;
        d3.select('#rxn-input').style('position', 'absolute')
            .style('display', 'block')
            .style('left', (m.window_scale * coords[0] +
			    m.window_translate[0] - l_w - 30)+'px')
            .style('top', (m.window_scale * coords[1] +
			   m.window_translate[1] - d_y)+'px')
            .style('width', l_w+'px');

        // set up the box with data, searching for first num results
        var num = 20;
        $("#rxn-input").autocomplete(
            { autoFocus: true,
              source: function(request, response) {
                  var escaped = $.ui.autocomplete.escapeRegex(request.term),
                      matcher = new RegExp("^" + escaped, "i"),
                      results = m.list_strings.filter(function(x) {           // TODO BUG draw reaction showing up in list (loading list too soon?)
                          // check against drawn reactions
                          // TODO speed up by keeping a running list of
                          // available reactions?
                          for (var i=0; i<m.reactions_drawn.length; i++) {
                              if (m.reactions_drawn.cobra_id==x.value) {
                                  return false;
                              }
                          }
                          // match against entered string
                          return matcher.test(x.value);
                      });
                  response(results.slice(0,num));
              },
              change: function(event, ui) {
                  if (ui.item) m.new_reaction(ui.item.value, coords);
              }
            });
    };

    // -----------------------------------------------------------------------------------
    // DRAW

    m.align_to_grid = function(loc) {
        var r = function (a) { return Math.round(a/20.)*20.; };
        var n = [r(loc[0]), r(loc[1])];
        return n;
    };

    m.rotate_coords = function(coords, center, angle) {
        // TODO look this up
        var rot = function(c) {
            var d = c;
            return d;
        };

        var rotated = [];
        // if coords is nested array
        if (coords[0].length==2) {
            var i=-1;
            while (++i<coords.length) {
                rotated.concat(rot([coords[i]]));
            }
        } else {
            rotated = rot(coords);
        }
        return rotated;
    };

    m.calculate_reaction_coordinates = function(reaction) {
        var dis = 120;
        reaction.dis = dis;
        var main_axis = [[0,0], [Math.sin(reaction.angle) * dis, Math.cos(reaction.angle) * dis]];
        reaction.main_axis = main_axis;
        reaction.center = [(main_axis[0][0] + main_axis[1][0])/2,   // for convenience
                           (main_axis[0][1] + main_axis[1][1])/2];
        return reaction;
    };

    m.calculate_metabolite_coordinates = function(met, angle, main_axis, center, dis) {
        // basic constants
        met.text_dis = [0,-18]; // displacement of metabolite label

        // Curve parameters
        var w = 60,  // distance between reactants and between products
            b1_strength = 0.5,
            b2_strength = 0.2,
            w2 = w*0.7,
            secondary_dis = 20,
            num_slots = Math.max(3, met.count);

        // size and spacing for primary and secondary metabolites
        var ds;
        if (met.is_primary) {
            met.r = 10;
            ds = 20;
        } else { // secondary
            met.r = 5;
            ds = 10;
            // don't use center slot
            if ((num_slots % 2)!=0 && met.index>=(Math.ceil(num_slots/2)-1)) {
                ++met.index;
            }
        }

        var de = dis - ds, // distance between ends of line axis
            reaction_axis = [[Math.sin(angle) * ds, Math.cos(angle) * ds],
                             [Math.sin(angle) * de, Math.cos(angle) * de]];

        // Define line parameters and axis.
        // Begin with unrotated coordinate system. +y = Down, +x = Right.
        var start = center,
            end, circle, b1, b2;
        // reactants
        if (met.coefficient < 0 && met.is_primary) {
            end = reaction_axis[0],
            b1 = [start[0]*b1_strength + reaction_axis[0][0]*(1-b1_strength),
                  start[1]*b1_strength + reaction_axis[0][1]*(1-b1_strength)];
            b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
                  start[1]*b2_strength + end[1]*(1-b2_strength)],
            circle = main_axis[0];
        } else if (met.coefficient < 0) {
            end = [reaction_axis[0][0] + (w2*met.index - w2*(num_slots-1)/2),
                   reaction_axis[0][1] + secondary_dis],
            b1 = [start[0]*b1_strength + reaction_axis[0][0]*(1-b1_strength),
                  start[1]*b1_strength + reaction_axis[0][1]*(1-b1_strength)];
            b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
                  start[1]*b2_strength + end[1]*(1-b2_strength)],
            circle = [main_axis[0][0] + (w*met.index - w*(num_slots-1)/2),
                      main_axis[0][1] + secondary_dis];
        } else if (met.coefficient > 0 && met.is_primary) {        // products
            end = reaction_axis[1],
            b1 = [start[0]*b1_strength + reaction_axis[1][0]*(1-b1_strength),
                  start[1]*b1_strength + reaction_axis[1][1]*(1-b1_strength)];
            b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
                  start[1]*b2_strength + end[1]*(1-b2_strength)],
            circle = main_axis[1];
        } else if (met.coefficient > 0) {
            end = [reaction_axis[1][0] + (w2*met.index - w2*(num_slots-1)/2),
                   reaction_axis[1][1] - secondary_dis],
            b1 = [start[0]*b1_strength + reaction_axis[1][0]*(1-b1_strength),
                  start[1]*b1_strength + reaction_axis[1][1]*(1-b1_strength)];
            b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
                  start[1]*b2_strength + end[1]*(1-b2_strength)],
            circle = [main_axis[1][0] + (w*met.index - w*(num_slots-1)/2),
                      main_axis[1][1] - secondary_dis];
        }
        // rotate coordinates around start point
        met.start  = m.rotate_coords(start,  angle, main_axis[0]),
        met.end    = m.rotate_coords(end,    angle, main_axis[0]),
        met.b1     = m.rotate_coords(b1,     angle, main_axis[0]),
        met.b2     = m.rotate_coords(b2,     angle, main_axis[0]),
        met.circle = m.rotate_coords(circle, angle, main_axis[0]);

        return met;
    };

    m.new_reaction = function(cobra_id, coords) {
        // New object at x, y coordinates.
        console.log(cobra_id);

        // If reaction id is not new, then return:
        if (m.reactions_drawn.filter(function(x) { return x.cobra_id==cobra_id; }).length!=0) {
            console.warn('reaction is already drawn');
            return;
        }

        // get the reaction
        var reactions = m.cobra_model.filter(function (x) { return x.cobra_id==cobra_id; });
        if (reactions.length!=1) {
            console.warn('wrong # reactions (expected 1): '+ reactions.length);
            return;
        }

        // set reaction coordinates and angle
        var reaction = reactions[0];
        reaction.coords = m.align_to_grid(coords);
        reaction.angle = 0;

        // calculate coordinates of reaction
        reaction = m.calculate_reaction_coordinates(reaction);

        // set primary metabolites and determine reactants/products
        var primary_reactant_index = 0,
            primary_product_index = 0,
            reactant_count = 0, product_count = 0,
            i = -1;
        while (++i < reaction.metabolites.length) {
            if (reaction.metabolites[i].coefficient < 0) {
                reaction.metabolites[i].index = reactant_count;
                if (reactant_count==primary_reactant_index)
                    reaction.metabolites[i].is_primary = true;
                reactant_count++;
            } else {
                reaction.metabolites[i].index = product_count;
                if (product_count==primary_product_index)
                    reaction.metabolites[i].is_primary = true;
                product_count++;
            }
        }
        i = -1;
        while (++i < reaction.metabolites.length) {
            // keep track of total reactants and products
            if (reaction.metabolites[i].coefficient < 0)
                reaction.metabolites[i].count = reactant_count + 1;
            else
                reaction.metabolites[i].count = product_count + 1;

            // calculate coordinates of metabolite components
            reaction.metabolites[i] = m.calculate_metabolite_coordinates(reaction.metabolites[i],
                                                                         reaction.angle,
                                                                         reaction.main_axis,
                                                                         reaction.center,
                                                                         reaction.dis);
        }

        // append the new reaction
        m.reactions_drawn = m.reactions_drawn.concat(reaction);

        // draw, and set the new coords
        var new_coords = m.draw_reactions();
        m.node_selected = cobra_id;
        m.reload_reaction_input(new_coords);
    };

    m.rotate_primary_key = function(index) {
        var new_index,
            selected_index = 0,
            metabolites = [];
        if ((typeof index === 'undefined') || (index < 0)) { // rotate
            if (index < metabolites.length - 1) new_index = selected_index + 1;
            else new_index = 0;
        } else { // specific index
            if (index >= metabolites.length) {
                console.warn('rotate_primary_key: index too large');
                return;
            }
            new_index = index;
        }
        m.selected_metabolite = metabolites[new_index];
        // update primary in m.data
        m.draw_reactions();
    };

    m.create_metabolite = function(enter_selection) {
        // create metabolites
        var g = enter_selection
                .append('g')
                .attr('class', 'metabolite-group');

        // create reaction arrow
        g.append('path')
            .attr('class', 'reaction-arrow');

        // create metabolite circle and label
        var mg = g.append('g')
                .attr('class', 'circle-and-label');

        mg.append('circle')
            .attr('class', 'metabolite-circle');
        mg.append('text')
            .attr('class', 'metabolite-label')
            .text(function(d) { return d.cobra_id; });
    };

    m.update_metabolite = function(update_selection) {
        // update metabolite attributes

        // update arrows
        update_selection
            .selectAll('.reaction-arrow')
            .attr('d', function(d) {
                return 'M'+d.start[0]+','+d.start[1]+
                    'C'+d.b1[0]+','+d.b1[1]+' '+
                    d.b2[0]+','+d.b2[1]+' '+
                    d.end[0]+','+d.end[1];
            }) // TODO replace with d3.curve or equivalent
            .attr("marker-end", function (d) {
                var c = d.flux ? m.scale.flux_color(Math.abs(d.flux)) :
                        m.default_reaction_color;
                // generate arrowhead for specific color
                var arrow_id = m.generate_arrowhead_for_color(c, true);
                return "url(#" + arrow_id + ")";
            })
            .style('stroke', function(d) {
                var c = d.flux ? m.scale.flux_color(Math.abs(d.flux)) :
                        m.default_reaction_color;
                return c;
            });

        // update circle and label location
        var mg = update_selection
                .selectAll('.circle-and-label')
                .attr('transform', function(d) {
                    return 'translate('+d.circle[0]+','+d.circle[1]+')';
                });
        mg.select('.metabolite-circle')
            .attr('r', function(d) { return d.r; });
        mg.select('.metabolite-label')
            .attr('transform', function(d) {
                return 'translate('+d.text_dis[0]+','+d.text_dis[1]+')';
            });
    };

    m.create_reaction_label = function(sel) {
        // draw reaction label for selection
        sel.append('text')
            .attr('class', 'reaction-label');
    };
    m.update_reaction_label = function(sel) {
        sel.text(function(d) {
            return d.cobra_id + " (" + m.decimal_format(d.flux) + ")";
        })
            .attr('transform', function(d) {
                var dis = [60,0], // displacement of reaction label
                    loc = m.rotate_coords([d.center[0] + dis[0], d.center[1] + dis[1]], d.angle, d.main_axis[0]);
                return 'translate('+loc[0]+','+loc[1]+')';
            });
    };

    m.create_reaction = function(enter_selection) {
        // attributes for new reaction group
        var t = enter_selection.append('g')
                .attr('id', function(d) { return d.cobra_id; })
                .attr('class', 'reaction')
                .attr('transform', function(d) {
                    m.newest_coords = m.rotate_coords([d.coords[0] + d.main_axis[1][0], d.coords[1] + d.main_axis[1][1]],
                                                      d.angle, d.main_axis[0]);
                    return 'translate(' + d.coords[0] + ',' + d.coords[1] + ')';
                })
                .call(m.create_reaction_label);

        return;

        // TODO consider switching to style: [main_axis.start.x, main_axis.start.y]
        // (speed consideration?)
    };
    m.update_reaction = function(update_selection) {

        // update reaction label
        update_selection.select('.reaction-label')
            .call(m.update_reaction_label);

        // select metabolites
        var sel = update_selection
                .selectAll('.metabolite-group')
                .data(function(d) { return d.metabolites; });

        // new metabolites
        sel.enter().call(m.create_metabolite);

        // update metabolites
        sel.call(m.update_metabolite);

        // old metabolites
        sel.exit().remove();

        return;
    };

    m.draw_reactions = function(cobra_ids) {
        var sel;
        if (typeof cobra_ids === 'undefined' || cobra_ids==[]) {
            console.log('updating all data');

            // Draw the reactions

            // generate reactions for m.reactions_drawn
            // assure constancy with cobra_id
            sel = d3.select('#reactions')
                .selectAll('.reaction')
                .data(m.reactions_drawn, function(d) { return d.cobra_id; });

            // enter: generate and place reaction
            sel.enter().call(m.create_reaction);

            // update: update when necessary
            sel.call(m.update_reaction);

            // consider the nested data model: https://github.com/mbostock/d3/wiki/Selections#data

            // exit
            sel.exit().remove();
        }
        else {
            console.log('updating these ids:');
            console.log(cobra_ids);

            // find reactions for cobra_ids
            var reaction_subset = m.reactions_drawn.filter(function(x) {
                return cobra_ids.indexOf(x.cobra_id) >= 0;
            });
            if (cobra_ids.length != reaction_subset.length) {
                console.warn('did not find correct reaction subset');
            }

            // generate reactions for m.reactions_drawn
            // assure constancy with cobra_id
            sel = d3.select('#reactions')
                .selectAll('.reaction')
                .data(reaction_subset, function(d) { return d.cobra_id; });

            // enter: generate and place reaction
            sel.enter().call(m.create_reaction);

            // update: update when necessary
            sel.call(m.update_reaction);

            // exit
            // sel.exit();
        }

        // return newest coordinates to place next reaction
        return m.newest_coords;
    };

    m.modify_reaction = function(cobra_id, key, value) {
        // modify reaction with cobra_id to have new (key, value) pair

        if (key=="direction") {
            // TODO more efficient updating

            // OPTION 1 (probably faster)
            for (var i=0; i<m.reactions_drawn.length; i++) {
                if (m.reactions_drawn[i].cobra_id==cobra_id) {
                    m.reactions_drawn[i][key] = value;
                }
            }

            // OPTION 2
            // var td = m.reactions_drawn.filter(function(x) {
            //  return x.cobra_id == cobra_id;
            // })[0];
            // td[key] = value;
            // m.reactions_drawn = m.reactions_drawn.filter(function(x) {
            //  return x.cobra_id != cobra_id;
            // });
            // m.reactions_drawn = m.reactions_drawn.concat(td);

            m.draw_reactions([cobra_id]);
        }
    };

    m.generate_arrowhead_for_color = function(color, is_end) {
        var pref;
        if (is_end) pref = 'start-';
        else        pref = 'end-';

        var id = String(color).replace('#', pref);
        if (m.arrowheads_generated.indexOf(id) < 0) {
            m.arrowheads_generated = m.arrowheads_generated.concat(id);

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
            var defs = m.svg.select("defs");
            if (defs.empty()) defs = m.svg.append("svg:defs");

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
    };

    // -----------------------------------------------------------------------------------
    // KEYBOARD

    m.key_listeners = function() {
        var primary_cycle_key = 80, // 'p'
            hide_show_input_key = 32, // SPACE
            rotate_keys = {'left':  37,
                           'right': 39,
                           'up':    38,
                           'down':  40};
        d3.select(window).on("keydown", function() {
            var kc = d3.event.keyCode;
            if (kc==primary_cycle_key) {
                m.rotate_primary_key();
            } else if (kc==hide_show_input_key) {

            }
        });
    };

    // -----------------------------------------------------------------------------------
    // LOAD

    m.load_builder = function(options) {
        if (typeof options === 'undefined') options = {};
        m.selection = options.selection || d3.select('body').append('div');
        m.margin    = options.margin    || 20;

        m.map_data = {};
        m.mode = 'builder';

        var width = $(window).width() - m.margin;
        var height = $(window).height() - m.margin;

        var svg = m.setup_container(m.selection, width, height);
        m.svg = svg;

        svg.append('g')
            .attr('id', 'reactions');

        $('#up').on('click', function() {
            m.modify_reaction(m.node_selected, 'direction', 'up');
        });
        $('#down').on('click', function() {
            m.modify_reaction(m.node_selected, 'direction', 'down');
        });
        $('#right').on('click', function() {
            m.modify_reaction(m.node_selected, 'direction', 'right');
        });
        $('#left').on('click', function() {
            m.modify_reaction(m.node_selected, 'direction', 'left');
        });

        // set up reaction for zooming and dragging
        var mouse_node = svg.append('rect')
                .attr("width", width)
                .attr("height", height)
                .attr('style', 'visibility: hidden')
                .attr('pointer-events', 'all');
        // .on('click', function () {
        // show_input_here(d3.mouse(this));
        // });

        // setup selection box
        var start_coords = [width/2, 40];
        m.load_model_and_list(start_coords, function() {
            // TEST case
            if (true) {
                console.log(m.cobra_model[800]);
                m.new_reaction(m.cobra_model[800].cobra_id, start_coords);
                // m.new_reaction(m.cobra_model[801].cobra_id, m.newest_coords);
            }
            d3.select('#loading').style('display', 'none');
        });

        // set up keyboard listeners
        m.key_listeners();

    };

    return {
        version: m.version,
        load_builder: m.load_builder
    };
};
