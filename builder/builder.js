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
                              results = json_f.filter(function(x) {
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
                if (true) {
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
            m.reactions_drawn = m.reactions_drawn.concat({ cobra_id: cobra_id,
                                                           coords: m.align_to_grid(coords),
                                                           direction: 'down'});
            var new_coords = m.update_circles();
            m.node_selected = cobra_id;
            m.load_list(new_coords);
        }
    };

    m.update_circles = function(cobra_id) {
        var create_reaction = function(t) {
            var d = t.datum(),
                dis = 80,
                r = 10,
                angle,
                li, ci;
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
            console.log('found ' + reactants.length + ' reactants');
            console.log('found ' + products.length + ' products');

            // Define line parameters and axis.
	    // Begin with unrotated coordinate system. +y = Down, +x = Right.
            var ds = r*3,
                de = dis + r*3, // distance between ends of line axis
                dc = dis + r*6, // distance between ends of circle axis
                w = 80,  // distance between reactants and between products
		text_dis = [0,-18]; // displacement of metabolite label
            var reaction_axis = [[Math.sin(angle) * ds, Math.cos(angle) * ds],
                                 [Math.sin(angle) * de, Math.cos(angle) * de]],
                center = [(reaction_axis[0][0] + reaction_axis[1][0])/2,   // for convenience
                          (reaction_axis[0][1] + reaction_axis[1][1])/2],
		circle_axis = [[0,0], [Math.sin(angle) * dc, Math.cos(angle) * dc]];

            var c;
            if (reaction.flux) c = m.scale.flux_color(Math.abs(reaction.flux));
            else c = '#eeeeee'; // default color

            function draw_curve(g, reactant, index, count, direction) {
                var start, end, circle, b1, b2,
		    b1_strength = 0.5,
		    b2_strength = 0.2,
		    w2 = w*0.7;
                if (direction=='reactant') {
                    start = center,
                    end = [reaction_axis[0][0] + (w2*index - w2*(count-1)/2), reaction_axis[0][1]],
		    b1 = [start[0]*b1_strength + reaction_axis[0][0]*(1-b1_strength),
			  start[1]*b1_strength + reaction_axis[0][1]*(1-b1_strength)];
		    b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
			  start[1]*b2_strength + end[1]*(1-b2_strength)],
		    circle = [circle_axis[0][0] + (w*index - w*(count-1)/2), circle_axis[0][1]];
                } else if (direction=='product') {
                    start = center,
                    end = [reaction_axis[1][0] + (w2*index - w2*(count-1)/2), reaction_axis[1][1]],
		    b1 = [start[0]*b1_strength + reaction_axis[1][0]*(1-b1_strength),
			  start[1]*b1_strength + reaction_axis[1][1]*(1-b1_strength)];
		    b2 = [start[0]*b2_strength + end[0]*(1-b2_strength),
			  start[1]*b2_strength + end[1]*(1-b2_strength)],
		    circle = [circle_axis[1][0] + (w*index - w*(count-1)/2), circle_axis[1][1]];
                } else {
		    console.warn('draw_curve: bad direction');
		    return;
		}
		// rotate coordinates around start point
		start  = m.rotate_coords(start,  angle, circle_axis[0]),
		end    = m.rotate_coords(end,    angle, circle_axis[0]),
		b1     = m.rotate_coords(b1,     angle, circle_axis[0]),
		b2     = m.rotate_coords(b2,     angle, circle_axis[0]),
		circle = m.rotate_coords(circle, angle, circle_axis[0]);

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
		    loc = m.rotate_coords([center[0] + dis[0], center[1] + dis[1]], angle, circle_axis[0]);
                g.append('text')
                    .attr('class', 'reaction-label')
                    .text(reaction.cobra_id + " (" + m.decimal_format(reaction.flux) + ")")
                    .attr('transform', 'translate('+loc[0]+','+loc[1]+')');
            }
            var i = -1;
            while (++i < reactants.length) draw_curve(this, reactants[i], i, reactants.length, 'reactant');
            i = -1;
            while (++i < products.length) draw_curve(this, products[i], i, products.length, 'product');
            draw_reaction_label(this, reaction);
            m.newest_coords = m.rotate_coords([d.coords[0] + circle_axis[1][0], d.coords[1] + circle_axis[1][1]],
					      angle, circle_axis[0]);
	    // TODO consider switching to style: [circle_axis.start.x, circle_axis.start.y]
	    // (speed consideration?)
        };
        d3.select('#reactions')
            .selectAll('.reaction')
            .data(m.reactions_drawn)     // how does d3 know if this data is new? how can i update the relevant item?
            .enter()
            .append('g')
            .attr('id', function(d) { return d.cobra_id; })
            .attr('class', 'reaction')
            .attr('transform', function(d) {
                return 'translate(' + d.coords[0] + ',' + d.coords[1] + ')';
            })
            .call(create_reaction);
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

            m.update_circles();
        }
    };

    m.generate_arrowhead_for_color = function(color, is_end) {
        var pref;
        if (is_end) pref = 'start-';
        else        pref = 'end-';

        var id = String(color).replace('#', pref);
        if (m.arrowheads_generated.indexOf(id) < 0) {
            m.arrowheads_generated = m.arrowheads_generated.concat(id);

            var markerWidth = 10,
                markerHeight = 10,
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
    };

    return {
        version: m.version,
        load_builder: m.load_builder
    };
};
