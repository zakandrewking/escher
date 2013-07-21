var Builder = function() {
    var m = {};
    m.version = 0.1;
    m.node_selected = "";
    m.newest_coords = [];
    m.reactions_drawn = [];
    m.cobra_model = [];
    m.scale = {};
    m.scale.flux_color = d3.scale.linear()
        .domain([0, 1000])
        .range(["blue", "red"]);
    m.decimal_format = d3.format('.1f');
    m.arrowheads_generated = [];

    m.setup_container = function(width, height) {
        d3.select("#svg-container").remove();

        var zoom = function() {
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        };

        var svg = d3.select("body").append("div").attr("id","svg-container")
                .attr("style", "width:"+width+"px;height:"+height+"px;margin:0px auto")// ;border:3px solid black;")
                .append("svg")
        // TODO: add correct svg attributes (see '/Users/zaking/Dropbox/lab/optSwap/paper-2-GAPD/old figs/fig5-theoretical-production/')
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
                $("#rxn-input").autocomplete({ autoFocus: true,
                                               source: function(request, response) {
                                                   var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i"),
                                                       results = json_f.filter(function(x) {
                                                           // check against drawn reactions
                                                           // TODO speed up by keeping a running list of available reactions?
                                                           for (var i=0; i<m.reactions_drawn.length; i++) {
                                                               if (m.reactions_drawn.cobra_id==x.value) return false;
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

            var ds = r*3,
                de = dis + r*3,
                dc = dis + r*6,
                w = 80;
            li = [[Math.sin(angle) * ds, Math.cos(angle) * ds],
                  [Math.sin(angle) * de, Math.cos(angle) * de]];
            ci = [Math.sin(angle) * dc, Math.cos(angle) * dc];

            var c;
            if (reaction.flux) c = m.scale.flux_color(Math.abs(reaction.flux));
            else c = '#000000';

            function draw_reactant(g, reactant, index, count) {
                var lia = [ [li[0][0] + (w*index - w*(count-1)/2), li[0][1]],
                            [li[1][0] + (w*index - w*(count-1)/2), li[1][1]] ],
		    arrow_id = m.generate_arrowhead_for_color(c, false);
                g.append('path')
                    .attr('class', 'reaction-arrow')
                    .attr('d', d3.svg.line()(lia))
                    .attr("marker-start", function (d) {
                        return "url(#" + arrow_id + ")";
                    })
                    .style('stroke', c);
                var mg = g.append('g')
                        .attr('transform','translate('+(w*index - w*(count-1)/2)+','+0+')');
                mg.append('circle')
		    .attr('class', 'metabolite-circle')
                    .attr('r', r);
                mg.append('text').text(reactant.cobra_id)
                    .attr('class', 'metabolite-label')
                    .attr('transform', 'translate(0, -18)');
            }
            function draw_product(g, product, index, count) {
                var lia = [ [li[0][0] + (w*index - w*(count-1)/2), li[0][1]],
                            [li[1][0] + (w*index - w*(count-1)/2), li[1][1]] ],
		    arrow_id = m.generate_arrowhead_for_color(c, true);
                g.append('path')
                    .attr('class', 'reaction-arrow')
                    .attr('d', d3.svg.line()(lia))
                    .attr("marker-end", function (d) {
                         return "url(#" + arrow_id + ")";
                    })
                    .style('stroke', c);
                var mg = g.append('g')
                        .attr('transform','translate('+(ci[0]+(w*index - w*(count-1)/2))+','+ci[1]+')');
                mg.append('circle')
		    .attr('class', 'metabolite-circle')
                    .attr('r', r);
                mg.append('text').text(product.cobra_id)
                    .attr('class', 'metabolite-label')
                    .attr('transform', 'translate(0, -18)');
            }
            function draw_reaction_label(g, reaction) {
                g.append('text')
                    .attr('class', 'reaction-label')
                    .text(reaction.cobra_id + " (" + m.decimal_format(reaction.flux) + ")")
                    .attr('transform', 'translate('+(ci[0]+60)+','+(ci[1]/2)+')');
            }
            var i = -1;
            while (++i < reactants.length) draw_reactant(this, reactants[i], i, reactants.length);
            i = -1;
            while (++i < products.length) draw_product(this, products[i], i, products.length);
            draw_reaction_label(this, reaction);
            m.newest_coords = [d.coords[0] + ci[0], d.coords[1] + ci[1]];
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
