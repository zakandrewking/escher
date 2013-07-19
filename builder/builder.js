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
                console.log(m.cobra_model);
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
            else c = 'black';
            console.log(c);

            function draw_reactant(g, reactant, index, count) {
		var lia = [ [li[0][0] + (w*index - w*(count-1)/2), li[0][1]],
			    [li[1][0] + (w*index - w*(count-1)/2), li[1][1]] ];
                g.append('path')
                    .attr('class', 'reaction-arrow')
                    .attr('d', d3.svg.line()(lia))
                    .attr("marker-start", function (d) {
                        return "url(#start)";
                    })
                    .style('stroke', c);
                var mg = g.append('g')
                        .attr('transform','translate('+(w*index - w*(count-1)/2)+','+0+')');
                mg.append('circle')
                    .attr('r', r);
                mg.append('text').text(reactant.cobra_id)
                    .attr('class', 'metabolite-label')
                    .attr('transform', 'translate(0, -18)');
            }
            function draw_product(g, product, index, count) {
		var lia = [ [li[0][0] + (w*index - w*(count-1)/2), li[0][1]],
			    [li[1][0] + (w*index - w*(count-1)/2), li[1][1]] ];
                g.append('path')
                    .attr('class', 'reaction-arrow')
                    .attr('d', d3.svg.line()(lia))
                    .attr("marker-end", function (d) {
                        return "url(#end)";
                    })
                    .style('stroke', c);
                var mg = g.append('g')
                        .attr('transform','translate('+(ci[0]+(w*index - w*(count-1)/2))+','+ci[1]+')');
                mg.append('circle')
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

    m.load_builder = function(options) {
        if (typeof options === 'undefined') options = {};
        m.selection = options.selection || d3.select('body').append('div');
        m.margin    = options.margin    || 20;

        m.map_data = {};
        m.mode = 'builder';

        var width = $(window).width() - m.margin;
        var height = $(window).height() - m.margin;

        // setup selection box
        var start_coords = [width/2, 40];
        m.load_list(start_coords);

        var svg = setup_container(width, height);
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

        // generate arrowhead markers
        generate_arrowheads(svg);

    };

    function generate_arrowheads(svg) {
        var markerWidth = 10,
            markerHeight = 10,
            // cRadius = 0, // play with the cRadius value
            // refX = cRadius + (markerWidth * 2),
            // refY = -Math.sqrt(cRadius),
            // drSub = cRadius + refY;
            refX = markerHeight,
            refY = markerWidth/2;

        svg.append("svg:defs").selectAll("marker")
            .data([{"id":"start", "direction":-1},
                   {"id":"end", "direction":1}])
            .enter().append("svg:marker")
            .attr("id", function (d) { return d.id; })
            .attr("refX", function (d) {
                if (d.direction==1) {
                    return 0;
                } else if (d.direction==-1) {
                    return markerHeight;
                }
                return null;
            })
            .attr("refY", function(d) { return refY; })
            .attr("markerWidth", markerWidth)
            .attr("markerHeight", markerHeight)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", function (d) {
                if (d.direction==1) {
                    return 'M0,0 V'+markerWidth+' L'+markerHeight/2+','+markerWidth/2+' Z';
                } else if (d.direction==-1) {
                    return 'M'+markerHeight+',0 V'+markerWidth+' L'+(markerHeight/2)+','+markerWidth/2+' Z';
                }
                return null;
            });
    }

    // browser

    m.load = function() {
        m.mode = 'browser';

        // import json files
        d3.json("map.json", function(error, json) {
            // console.log(error)
            if (error) return console.warn(error);
            var map_data = json;

            d3.text("map.css", function(error, text) {
                if (error) return console.warn(error);
                var map_style = text;

                d3.json("flux1.json", function(error, json) {
                    var flux;
                    if (error) flux = false;
                    else flux = json;

                    d3.json("flux2.json", function(error, json) {
                        var flux2;
                        if (error) flux2 = false;
                        else flux2 = json;

                        d3.json("metabolites1.json", function(error, json) {
                            var metabolites;
                            if (error) metabolites = false;
                            else metabolites = json;

                            d3.json("metabolites2.json", function(error, json) {
                                var metabolites2;
                                if (error) metabolites2 = false;
                                else metabolites2 = json;

                                visualizeit(map_data, map_style, flux, flux2, metabolites, metabolites2);
                            });
                        });
                    });
                });
            });
        });

        // add export svg button
        console.log('adding button');
        x = d3.select('body')
            .append('div')
            .attr("style", "margin:0px;position:absolute;top:15px;left:15px;background-color:white;border-radius:15px;")
            .attr('id', 'button-container');
        x.append('button')
            .attr('type', 'button')
            .attr('onclick', 'exportSvg()')
            .text('generate svg file');
        x.append('div')
            .text('Google Chrome only')
            .attr('style','font-family:sans-serif;color:grey;font-size:8pt;text-align:center;width:100%');
    };

    function visualizeit(data, style, flux, flux2, metabolites, metabolites2) {
        m.defaults = {};
        m.defaults.path_color = "rgb(80, 80, 80)";

        m.style_variables = get_style_variables(style);

        var decimal_format = d3.format('.1f');
        var decimal_format_3 = d3.format('.3f');
        m.has_flux = false;
        m.has_flux_comparison = false;
        m.has_metabolites = false;
        m.has_metabolite_deviation = false;

        // parse the data objects and attach values to map objects
        if (flux) {
            m.has_flux = true;
            data = parse_flux_1(data, flux);
            if (flux2) {
                m.has_flux_comparison = true;
                data = parse_flux_2(data, flux2);
            }
        }
        if (metabolites) {
            m.has_metabolites = true;
            data = parse_metabolites_1(data, metabolites);
            if (metabolites2) {
                m.has_metabolite_deviation = true;
                data = parse_metabolites_2(data, metabolites2);
            }
        }

        var map_w = data.max_map_w, map_h = data.max_map_h;
        var width = $(window).width()-20;
        var height = $(window).height()-20;
        var factor = Math.min(width/map_w,height/map_h);
        console.log('map_w '+decimal_format(map_w));
        console.log('map_h '+decimal_format(map_h));
        console.log('scale factor '+decimal_format_3(factor));

        m.scale = {};
        m.scale.x = d3.scale.linear()
            .domain([0, map_w])
            .range([(width - map_w*factor)/2, map_w*factor + (width - map_w*factor)/2]);
        m.scale.y = d3.scale.linear()
            .domain([0, map_h])
            .range([(height - map_h*factor)/2, map_h*factor + (height - map_h*factor)/2]);
        m.scale.x_size = d3.scale.linear()
            .domain([0, map_w])
            .range([0, map_w*factor]);
        m.scale.y_size = d3.scale.linear()
            .domain([0, map_h])
            .range([0, map_h*factor]);
        m.scale.size = d3.scale.linear()
            .domain([0, 1])
            .range([0, factor]);
        m.scale.flux = d3.scale.linear()
            .domain([0, 40])
            .range([6, 6]);
        m.scale.flux_fill = d3.scale.linear()
            .domain([0, 40, 200])
            .range([1, 1, 1]);
        m.scale.flux_color = d3.scale.linear()
            .domain([0, 1, 20, 50])
            .range(["rgb(200,200,200)", "rgb(150,150,255)", "blue", "red"]);
        m.scale.metabolite_concentration = d3.scale.linear()
            .domain([0, 10])
            .range([15, 200]);
        m.scale.metabolite_color = d3.scale.linear()
            .domain([0, 1.2])
            .range(["#FEF0D9", "#B30000"]);

        svg = setup_container(width, height);
        m.svg = svg;

        svg.append("style")
            .text(style);

        var g = svg.append('g')
                .attr('id', 'markers');

        g.append("marker")
            .attr("id", "end-triangle-path-color")
            .attr("markerHeight", 2.1)
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", 2.1)
            .attr("orient", "auto")
            .attr("refX", 0)
            .attr("refY", 6)
            .attr("viewBox", "0 0 12 12")
            .append("path")
            .attr("d", "M 0 0 L 12 6 L 0 12 z")
            .attr("fill", m.defaults.path_color)
        // stroke inheritance not supported in SVG 1.*
            .attr("stroke", m.defaults.path_color);

        g.append("marker")
            .attr("id", "start-triangle-path-color")
            .attr("markerHeight", 2.0)
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", 2.0)
            .attr("orient", "auto")
            .attr("refX", 12)
            .attr("refY", 6)
            .attr("viewBox", "0 0 12 12")
            .append("path")
            .attr("d", "M 12 0 L 0 6 L 12 12 z")
            .attr("fill", m.defaults.path_color)
            .attr("stroke", m.defaults.path_color);

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .attr("style", "stroke:black;fill:none;");

        svg.append("g")
            .attr("id", "membranes")
            .selectAll("rect")
            .data(data.membrane_rectangles)
            .enter().append("rect")
            .attr("class", function(d){ return d.class })
            .attr("width", function(d){ return m.scale.x_size(d.width) })
            .attr("height", function(d){ return m.scale.y_size(d.height) })
            .attr("transform", function(d){return "translate("+m.scale.x(d.x)+","+m.scale.y(d.y)+")";})
            .style("stroke-width", function(d) { return m.scale.size(10) })
            .attr('rx', function(d){ return m.scale.x_size(20); })
            .attr('ry', function(d){ return m.scale.x_size(20); });

        if (data.hasOwnProperty("metabolite_circles")) {
            console.log('metabolite circles');
            svg.append("g")
                .attr("id", "metabolite-circles")
                .selectAll("circle")
                .data(data.metabolite_circles)
                .enter().append("circle")
                .attr("r", function (d) {
                    sc = m.scale.metabolite_concentration; // TODO: make a better scale
                    if (d.metabolite_concentration) {
                        var s;
                        if (d.should_size) s = m.scale.size(sc(d.metabolite_concentration));
                        else s = m.scale.size(0);
                        return s;
                    } else if (m.has_metabolites) {
                        return m.scale.size(10);
                    } else {
                        return m.scale.size(d.r);
                    }
                })
                .attr("style", function (d) {
                    sc = m.scale.metabolite_color;
                    if (d.metabolite_concentration) {
                        var a;
                        if (d.should_color) a = "fill:"+sc(d.metabolite_concentration) + ";" +
                            "stroke:black;stroke-width:0.5;";
                        else a = "fill:none;stroke:black;stroke-width:0.5;";
                        return a;
                    }
                    else if (m.has_metabolites) {
                        return "fill:grey;stroke:none;stroke-width:0.5;";
                    }
                    else { return ""; }
                })
                .attr("transform", function(d){return "translate("+m.scale.x(d.cx)+","+m.scale.y(d.cy)+")";});
            if (m.has_metabolite_deviation) {
                append_deviation_arcs(data.metabolite_circles);
            }
        }
        else if (data.hasOwnProperty("metabolite_paths")) {
            if (m.has_metabolites) { alert('metabolites do not render w simpheny m'); }
            console.log('metabolite paths');
            svg.append("g")
                .attr("id", "metabolite-paths")
                .selectAll("path")
                .data(data.metabolite_paths)
                .enter().append("path")
                .attr("d", function(d) { return scale_path(d.d); })
                .style("fill", "rgb(224, 134, 91)")
                .style("stroke", "rgb(162, 69, 16)")
                .style("stroke-width", String(m.scale.size(2))+"px");
        }

        append_reaction_paths(data.reaction_paths);

        svg.append("g")
            .attr("id", "reaction-labels")
            .selectAll("text")
            .data(data.reaction_labels)
            .enter().append("text")
            .text(function(d) {
                var t = d.text;
                if (m.has_flux_comparison)
                    t += " ("+decimal_format(d.flux1)+"/"+decimal_format(d.flux2)+": "+decimal_format(d.flux)+")";
                else if (d.flux) t += " ("+decimal_format(d.flux)+")";
                else if (m.has_flux) t += " (0)";
                return t;
            })
            .attr("text-anchor", "start")
            .attr("font-size", function(d) {
                var s;
                if (m.style_variables.hasOwnProperty('reaction_label_size')) {
                    s = m.style_variables['reaction_label_size'];
                }
                else { s = 15; }
                return m.scale.size(s);
            })
        // .attr("style", function(d){ if(!d.flux) return "visibility:hidden;"; else return ""; })
            .attr("transform", function(d){return "translate("+m.scale.x(d.x)+","+m.scale.y(d.y)+")";});

        svg.append("g")
            .attr("id", "misc-labels")
            .selectAll("text")
            .data(data.misc_labels)
            .enter().append("text")
            .text(function(d) { return d.text; })
            .attr("font-size", m.scale.size(60))
            .attr("transform", function(d){return "translate("+m.scale.x(d.x)+","+m.scale.y(d.y)+")";});

        svg.append("g")
            .attr("id", "metabolite-labels")
            .selectAll("text")
            .data(data.metabolite_labels)
            .enter().append("text")
            .text(function(d) {
                var t = d.text;
                if (isNaN(d.metabolite_concentration)) {}
                else if (has_metabolite_deviation) {
                    var a = (isNaN(d.metabolite_concentration) ? "-" : decimal_format(d.metabolite_concentration));
                    var b = (isNaN(d.metabolite_deviation) ? "-" : decimal_format(d.metabolite_deviation));
                    t += " ("+a+" \xB1 "+b+"%)";
                }
                else if (d.metabolite_concentration) {
                    var a = (isNaN(d.metabolite_concentration) ? "-" : decimal_format(d.metabolite_concentration));
                    t += " ("+a+")";
                }
                else if (has_metabolites) t += " (0)";
                return t;
            })
            .attr("font-size", function(d) {
                if (d.metabolite_concentration) return m.scale.size(30);
                else if (m.has_metabolites) return m.scale.size(20);
                else return m.scale.size(20);
            })
            .style("visibility","visible")
            .attr("transform", function(d){return "translate("+m.scale.x(d.x)+","+m.scale.y(d.y)+")";});
    }

    function setup_container(width, height) {
        d3.select("#svg-container").remove();

        var zoom = function() {
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

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
    }

    function get_style_variables(style) {
        return [];

        // var r = new RegExp("/\*(a-zA-Z)+\*/");
        // var r = /\/\*([a-zA-Z_]+)=([0-9.]+)\*\//g;
        var r = /\/\*\s([a-zA-Z_]+)\s=\s([0-9.]+)\s\*\//g;
        matches = r.exec(style);        // only returns the first one...need findAll
        params = {};
        params[matches[1]] = matches[2];
        return params
    }

    function parse_flux_1(data, flux) {
        data.reaction_paths = data.reaction_paths.map( function(o) {
            // console.log(d3.keys(flux));
            if (o.id in flux) {
                o.flux = parseFloat(flux[o.id]);
            }
            // else { console.log(o.id) }
            return o;
        });
        data.reaction_labels = data.reaction_labels.map( function(o) {
            if (o.text in flux) {
                // TODO: make sure text==id
                o.flux = parseFloat(flux[o.text]);
            }
            return o;
        });
        return data;
    }

    function parse_flux_2(data, flux2) {
        data.reaction_paths = data.reaction_paths.map( function(o) {
            if (o.id in flux2 && o.flux) {
                o.flux = (parseFloat(flux2[o.id]) - o.flux);
            }
            return o;
        });
        data.reaction_labels = data.reaction_labels.map( function(o) {
            if (o.flux) o.flux1 = o.flux;
            else o.flux1 = 0;
            if (o.text in flux2) o.flux2 = parseFloat(flux2[o.text]);
            else o.flux2 = 0;
            o.flux = (o.flux2 - o.flux1);
            return o;
        });
        return data;
    }

    function parse_metabolites_1(data, metabolites) {
        skip_these_metabolites = []; //
        do_not_size_these_metabolites = ['nad','nadp','nadh','nadph','atp','adp','coa','accoa'];
        data.metabolite_circles = data.metabolite_circles.map( function(o) {
            if (o.id in metabolites && skip_these_metabolites.indexOf(o.id)==-1) {
                o.metabolite_concentration = parseFloat(metabolites[o.id])
                if (do_not_size_these_metabolites.indexOf(o.id)>=0) {
                    o.should_size = false;
                    o.should_color = true;
                } else {
                    o.should_size = true;
                    o.should_color = false;
                }
            }
            return o;
        });
        data.metabolite_labels = data.metabolite_labels.map( function(o) {
            if (o.text in metabolites) {
                o.metabolite_concentration = parseFloat(metabolites[o.text])
            }
            return o;
        });
        return data;
    }

    function parse_metabolites_2(data, metabolites) {
        data.metabolite_circles = data.metabolite_circles.map( function(o) {
            if (o.id in metabolites) {
                o.metabolite_deviation = parseFloat(metabolites[o.id])
            }
            return o;
        });
        data.metabolite_labels = data.metabolite_labels.map( function(o) {
            if (o.text in metabolites) {
                o.metabolite_deviation = parseFloat(metabolites[o.text])
            }
            return o;
        });
        return data;
    }

    function append_deviation_arcs(metabolite_circle_data) {
        arc_data = metabolite_circle_data.filter( function(o) {
            return (o.hasOwnProperty('metabolite_deviation') &&
                    o.hasOwnProperty('metabolite_concentration'));
        });
        var arc = d3.svg.arc()
                .startAngle(function(d) { return -d.metabolite_deviation/100/2*2*Math.PI; })
                .endAngle(function(d) { return d.metabolite_deviation/100/2*2*Math.PI; })
                .innerRadius(function(d) { return 0; })
                .outerRadius(function(d) {
                    var s;
                    if (d.should_size) s = m.scale.size(m.scale.metabolite_concentration(d.metabolite_concentration));
                    else s = m.scale.size(0);
                    return s;
                });
        m.svg.append("g")
            .attr("id", "metabolite-deviation-arcs")
            .selectAll("path")
            .data(arc_data)
            .enter().append("path")
            .attr('d', arc)
            .attr('style', "fill:black;stroke:none;opacity:0.4;")
            .attr("transform", function(d) {
                return "translate("+m.scale.x(d.cx)+","+m.scale.y(d.cy)+")";
            });
    }

    function append_reaction_paths(reaction_path_data) {
        m.svg.append("g")
            .attr("id", "reaction-paths")
            .selectAll("path")
            .data(reaction_path_data)
            .enter().append("path")
            .attr("d", function(d) { return scale_path(d.d); })
            .attr("class", function(d) { return d.class })
            .attr("style", function(d) {
                var s = "", sc = m.scale.flux;
                // .fill-arrow is for simpheny maps where the path surrounds line and
                // arrowhead
                // .line-arrow is for bigg maps were the line is a path and the
                // arrowhead is a marker
                if (d.class=="fill-arrow") sc = m.scale.flux_fill;
                if (d.flux) {
                    s += "stroke-width:"+String(m.scale.size(sc(Math.abs(d.flux))))+";";
                    s += "stroke:"+m.scale.flux_color(Math.abs(d.flux))+";";
                    if (d.class=="fill-arrow") { s += "fill:"+m.scale.flux_color(Math.abs(d.flux))+";"; }
                    else if (d.class=="line-arrow") { make_arrowhead_for_fill(); }
                    else s += "fill:none";
                }
                else if (m.has_flux) {
                    s += "stroke-width:"+String(m.scale.size(sc(0)))+";";
                    s += "stroke:"+m.scale.flux_color(Math.abs(0))+";";
                    if (d.class=="fill-arrow") s += "fill:"+m.scale.flux_color(0)+";";
                    else s += "fill:none";
                }
                else {
                    s += "stroke-width:"+String(m.scale.size(1))+";";
                    s += "stroke:"+m.defaults.path_color+";";
                    if (d.class=="fill-arrow") s += "fill:"+m.defaults.path_color+";";
                    else s += "fill:none";
                }
                return s;
            })
            .style('marker-end', function (d) {
                if (!/end/.test(d.class)) return '';
                if (d.flux) return make_arrowhead_for_fill(m.scale.flux_color(d.flux));
                else if (m.has_flux) return make_arrowhead_for_fill(m.scale.flux_color(0));
                else return "url(#end-triangle-path-color)";
            })
            .style('marker-start', function (d) {
                if (!/start/.test(d.class)) return '';
                if (d.flux) return make_arrowhead_for_fill(m.scale.flux_color(d.flux));
                else if (m.has_flux) return make_arrowhead_for_fill(m.scale.flux_color(0));
                else return "url(#start-triangle-path-color)";
            });
    }

    function make_arrowhead_for_fill(fill) {
        d3.select('#markers').selectAll("marker"); //
        return ""
    }

    function scale_decimals(path, scale_fn, precision) {
        var str = d3.format("."+String(precision)+"f")
        path = path.replace(/([0-9.]+)/g, function (match, p1) {
            return str(scale_fn(parseFloat(p1)));
        });
        return path
    }

    function scale_path(path) {
        x_fn = m.scale.x; y_fn = m.scale.y;
        // TODO: scale arrow width
        var str = d3.format(".2f")
        path = path.replace(/(M|L)([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p0, p1, p2) {
            return p0 + [str(x_fn(parseFloat(p1))), str(y_fn(parseFloat(p2)))].join(', ');
        });
        path = path.replace(/C([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p1, p2, p3, p4, p5, p6) {
            return 'C'+str(x_fn(parseFloat(p1)))+','+str(y_fn(parseFloat(p2)))+' '+str(x_fn(parseFloat(p3)))+','+str(y_fn(parseFloat(p4)))+' '+ [str(x_fn(parseFloat(p5)))+','+str(y_fn(parseFloat(p6)))];
        });
        return path
    }

    return {
        version: m.version,
        load_builder: m.load_builder
    };
};
