var Builder = function() {
    var m = {};
    m.version = 0.1;
    // m.node_selected = "";
    m.newest_coords = [];
    m.reactions_drawn = [];
    m.arrowheads_generated = [];
    m.cobra_model = [];
    m.scale = {};
    m.scale.flux_color = d3.scale.linear()
        .domain([0, 1000])
        .range(["blue", "red"]);
    m.decimal_format = d3.format('.1f');

    m.setup_container = function(width, height) {
        d3.select("#svg-container").remove();

        var zoom = function() {
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        };

        var svg = d3.select("body").append("div").attr("id","svg-container")
                .attr("style", "width:"+width+"px;height:"+height+"px;margin:0px auto")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .call(d3.behavior.zoom().scaleExtent([1, 15]).on("zoom", zoom))
                .append("g");
        return svg;
    };

    m.load_list = function(coords) {
        // reloads data for autocomplete box and
        // redraws box at the new /coords/
        if (coords==[]) {
            console.log('no coords');
            return;
        }
        var l_w = 200, d_y = 20;
        d3.select('#rxn-input').style('position', 'absolute')
        // .style('display', 'block')
            .style('left', (coords[0] - l_w - 30)+'px')
            .style('top', (coords[1] - d_y)+'px')
            .style('width', l_w+'px');

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
                var json_f = [], num=20;
                for (var i=0; i<json.length; i++) {
                    m.cobra_model = m.cobra_model.map(function(x) {
                        if (x.cobra_id == json[i][0]) x.flux = parseFloat(json[i][1]);
                        return x;
                    });
                    json_f = json_f.concat({ label: json[i][0]+" -- "+parseFloat(json[i][1]),
                                             value: json[i][0] });
                }
                // set up the box with data, searching for first /num/ results
                $("#rxn-input").autocomplete(
                    { autoFocus: true,
                      source: function(request, response) {
                          var escaped = $.ui.autocomplete.escapeRegex(request.term),
                              matcher = new RegExp("^" + escaped, "i"),
                              results = json_f.filter(function(x) {           // TODO BUG draw reaction showing up in list (loading list too soon?)
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
                          // d3.select(this).style('display', 'none');
                          // $('#rxn-input').focus();
                      }
                    });

                // TEST case
                if (false) {
                    m.new_reaction(json_f[0].value, coords);
                    m.new_reaction(json_f[1].value, m.newest_coords);
                }
            });
        });
    };

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

    m.new_reaction = function(cobra_id, coords) {
        // new object at x, y /coords/
        // if reaction id is new
        if (m.reactions_drawn.filter(function(x) { return x.cobra_id==cobra_id; }).length==0) {
            var metabolites = [], // TODO finish
                flux = [];
            m.reactions_drawn = m.reactions_drawn.concat({ cobra_id: cobra_id,
                                                           coords: m.align_to_grid(coords),
                                                           direction: 'down', // TODO make angle in degrees
                                                           metabolites: metabolites,
                                                           flux: flux});
            var new_coords = m.draw_reactions();
            m.node_selected = cobra_id;
            m.load_list(new_coords);
        }
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

    m.create_reaction = function(enter_selection) {
        // attributes for new reaction group
        var t = enter_selection.append('g')
                .attr('id', function(d) { return d.cobra_id; })
                .attr('class', 'reaction')
                .attr('transform', function(d) {
                    return 'translate(' + d.coords[0] + ',' + d.coords[1] + ')';
                });

        var d = t.datum(),
            dis = 120,
            angle, li, ci;
        switch (d.direction) {
        case 'up':
            angle = Math.PI;
            break;
        case 'down':
            angle = 0;
            break;
        case 'right':
            angle = Math.PI/2;
            break;
        case 'left':
            angle = Math.PI * 3/2;
            break;
        default: return;
        }

        // Find the reactants and products
        var reactions = m.cobra_model.filter(function (x) { return x.cobra_id==d.cobra_id; });
        if (reactions.length!=1) {
            console.warn('wrong # reactions: '+ reactions.length);
            return;
        }
        var reaction = reactions[0],
            reactants = reactions[0].metabolites.filter(function (x) {
                return x.coefficient < 0;
            }),
            products = reactions[0].metabolites.filter(function (x) {
                return x.coefficient > 0;
            });

        // Define primary metabolites
        // TODO choose the primary metabolite by clicking or cycle by pressing 'p'
        var primary_reactant_index = 0,
            primary_product_index = 0;

        var c;
        if (reaction.flux) c = m.scale.flux_color(Math.abs(reaction.flux));
        else c = '#eeeeee'; // default color

        // define primary axis
        var main_axis = [[0,0], [Math.sin(angle) * dis, Math.cos(angle) * dis]],
            center = [(main_axis[0][0] + main_axis[1][0])/2,   // for convenience
                      (main_axis[0][1] + main_axis[1][1])/2];

        function draw_curve(g, reactant, index, count, direction, is_primary) {
            // Draw a curve for a metabolite
            var w = 60,  // distance between reactants and between products
                text_dis = [0,-18], // displacement of metabolite label
                b1_strength = 0.5,
                b2_strength = 0.2,
                w2 = w*0.7,
                secondary_dis = 20,
                num_slots = Math.max(3, count);

            // size and spacing for primary and secondary metabolites
            var ds, r;
            if (is_primary) {
                r = 10;
                ds = 20;
            } else { // secondary
                r = 5;
                ds = 10;
                // don't use center slot
                if ((num_slots % 2)!=0 && index>=(Math.ceil(num_slots/2)-1)) {
                    ++index;
                }
            }
            var de = dis - ds; // distance between ends of line axis

            // Define line parameters and axis.
            // Begin with unrotated coordinate system. +y = Down, +x = Right.
            var reaction_axis = [[Math.sin(angle) * ds, Math.cos(angle) * ds],
                                 [Math.sin(angle) * de, Math.cos(angle) * de]],
                start = center,
                end, circle, b1, b2;
            if (direction=='reactant' && is_primary) {
                end = reaction_axis[0],
                b1 = [start[0]*b1_strength + reaction_axis[0][0]*(1-b1_strength),
                      start[1]*b1_strength + reaction_axis[0][1]*(1-b1_strength)];
                b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
                      start[1]*b2_strength + end[1]*(1-b2_strength)],
                circle = main_axis[0];
            } else if (direction=='reactant') {
                end = [reaction_axis[0][0] + (w2*index - w2*(num_slots-1)/2),
                       reaction_axis[0][1] + secondary_dis],
                b1 = [start[0]*b1_strength + reaction_axis[0][0]*(1-b1_strength),
                      start[1]*b1_strength + reaction_axis[0][1]*(1-b1_strength)];
                b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
                      start[1]*b2_strength + end[1]*(1-b2_strength)],
                circle = [main_axis[0][0] + (w*index - w*(num_slots-1)/2),
                          main_axis[0][1] + secondary_dis];
            } else if (direction=='product' && is_primary) {
                end = reaction_axis[1],
                b1 = [start[0]*b1_strength + reaction_axis[1][0]*(1-b1_strength),
                      start[1]*b1_strength + reaction_axis[1][1]*(1-b1_strength)];
                b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
                      start[1]*b2_strength + end[1]*(1-b2_strength)],
                circle = main_axis[1];
            } else if (direction=='product') {
                end = [reaction_axis[1][0] + (w2*index - w2*(num_slots-1)/2),
                       reaction_axis[1][1] - secondary_dis],
                b1 = [start[0]*b1_strength + reaction_axis[1][0]*(1-b1_strength),
                      start[1]*b1_strength + reaction_axis[1][1]*(1-b1_strength)];
                b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
                      start[1]*b2_strength + end[1]*(1-b2_strength)],
                circle = [main_axis[1][0] + (w*index - w*(num_slots-1)/2),
                          main_axis[1][1] - secondary_dis];
            } else {
                console.warn('draw_curve: bad direction');
                return;
            }
            // rotate coordinates around start point
            start  = m.rotate_coords(start,  angle, main_axis[0]),
            end    = m.rotate_coords(end,    angle, main_axis[0]),
            b1     = m.rotate_coords(b1,     angle, main_axis[0]),
            b2     = m.rotate_coords(b2,     angle, main_axis[0]),
            circle = m.rotate_coords(circle, angle, main_axis[0]);

            // generate arrowhead for specific color
            var arrow_id = m.generate_arrowhead_for_color(c, true);
            g.append('path')
                .attr('class', 'reaction-arrow')
                .attr('d',
                      'M'+start[0]+','+start[1]+
                      'C'+b1[0]+','+b1[1]+' '+
                      b2[0]+','+b2[1]+' '+
                      end[0]+','+end[1]) // TODO replace with d3.curve or equivalent
                .attr("marker-end", function (d) {
                    return "url(#" + arrow_id + ")";
                })
                .style('stroke', c);
            var mg = g.append('g')
                    .attr('transform','translate('+circle[0]+','+circle[1]+')');
            mg.append('circle')
                .attr('class', 'metabolite-circle')
                .attr('r', r);
            mg.append('text').text(reactant.cobra_id)
                .attr('class', 'metabolite-label')
                .attr('transform', 'translate('+text_dis[0]+','+text_dis[1]+')');
        }
        function draw_reaction_label(g, reaction) {
            var dis = [60,0], // displacement of reaction label
                loc = m.rotate_coords([center[0] + dis[0], center[1] + dis[1]], angle, main_axis[0]);
            g.append('text')
                .attr('class', 'reaction-label')
                .text(reaction.cobra_id + " (" + m.decimal_format(reaction.flux) + ")")
                .attr('transform', 'translate('+loc[0]+','+loc[1]+')');
        }

        // TODO finish
        // var sel = t.selectAll('g').data(function(d) { return d.metabolites; });
        // sel.enter().append('g')
        //      .attr('class', 'metabolite-group');
        // sel.exit().remove();
        //

        // draw primary
        draw_curve(t, reactants[primary_reactant_index], primary_reactant_index,
                   reactants.length, 'reactant', true);
        draw_curve(t, products[primary_product_index], primary_product_index,
                   products.length, 'product', true);
        var i = -1, count = 0;
        while (++i < reactants.length) {
            if (i==primary_reactant_index) continue;
            draw_curve(t, reactants[i], count, reactants.length-1,
                       'reactant', false);
            ++count;
        }
        i = -1, count = 0;
        while (++i < products.length) {
            if (i==primary_product_index) continue;
            draw_curve(t, products[i], count, products.length-1,
                       'product', false);
            ++count;
        }
        draw_reaction_label(t, reaction);
        m.newest_coords = m.rotate_coords([d.coords[0] + main_axis[1][0], d.coords[1] + main_axis[1][1]],
                                          angle, main_axis[0]);
        // TODO consider switching to style: [main_axis.start.x, main_axis.start.y]
        // (speed consideration?)
    };
    m.update_reaction = function(t) {

        // lay out primary vs. secondary nodes here

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

            m.draw_reactions();
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

    m.load_builder = function(options) {
        if (typeof options === 'undefined') options = {};
        m.selection = options.selection || d3.select('body').append('div');
        m.margin    = options.margin    || 20;

        m.map_data = {};
        m.mode = 'builder';

        var width = $(window).width() - m.margin;
        var height = $(window).height() - m.margin;

        var svg = m.setup_container(width, height);
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

        // var mouse_node = svg.append('rect')
        //         .attr("width", width)
        //         .attr("height", height)
        //         .attr('style', 'visibility: hidden')
        //         .attr('pointer-events', 'all')
        //         .on('click', function () {
        //             m.new_reaction("", d3.mouse(this));
        //         });

        // setup selection box
        var start_coords = [width/2, 40];
        m.load_list(start_coords);
        m.key_listeners();
    };

    return {
        version: m.version,
        load_builder: m.load_builder
    };
};
