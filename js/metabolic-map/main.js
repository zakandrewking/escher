define(["vis/scaffold", "metabolic-map/utils", "lib/d3"], function (scaffold, utils, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            selection_is_svg: false,
            fillScreen: false,
            update_hook: false,
            css_path: "css/metabolic-map.css",
            map_path: "data/maps/simpheny-maps/ijo-central.json",
            flux_path: false,
            flux2_path: false,
            css: '',
            metabolite_zoom_threshold: 5,
            reaction_zoom_threshold: 0,
            label_zoom_threshold: 15,
	    zoom_bounds: [0, 25] });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // listeners
        o.listeners = {};

        var files_to_load = [{file: o.css_path, callback: set_css },
                             {file: o.map_path, callback: set_map },
                             {file: o.flux_path,  callback: function(e, f) { set_flux(e, f, 0); } },
                             {file: o.flux2_path, callback: function(e, f) { set_flux(e, f, 1); } } ];
        scaffold.load_files(files_to_load, setup);

        return { set_flux_source: set_flux_source,
                 add_listener: add_listener,
                 remove_listener: remove_listener,
                 reload_flux: reload_flux,
                 set_status: set_status };

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
        function set_flux_source(fn) {
            o.flux_source = fn;
            reload_flux();
            return this;
        };
        function reload_flux() {
            o.flux_source(function (fluxes, is_viable, objective) {
                if (!is_viable) {
                    set_status('cell is dead :\'(');
                    fluxes = [];
                } else if (objective) {
                    set_status('objective: ' + d3.format('.3f')(objective) + "    (HINT: Click a reaction)");
                }
                o.map_data = flux_to_data(o.map_data, fluxes, null, null);
                o.has_metabolites = false; o.has_metabolite_deviation = false;
                update();

            });
            return this;
        }
        function remove_listener(target, type) {
            /**
             * Remove a listener.
             */

            // delete the saved listener
            delete o.listeners[target][type];
            // removed from selection by applying null
            apply_a_listener(target, type, null);
            return this;
        }
        function apply_a_listener(target, type, callback, context) {
            /**
             Apply a single listener. To register multiple listeners for the same
             event type, the type may be followed by an optional namespace, such
             as "click.foo" and "click.bar".

             */

            // If callback is null, pass the null through to remove the listener.
            var new_callback = callback;
            if (callback!=null) new_callback = function(d) { callback.call(context, d.id); };
            d3.selectAll(target).on(type, new_callback);
        }
        function apply_listeners() {
            /**
             Update all saved listeners.

             */

            for (var target in o.listeners)
                for (var type in o.listeners[target])
                    apply_a_listener(target, type,
                                     o.listeners[target][type].callback,
                                     o.listeners[target][type].context);
        }
        function add_listener(target, type, callback) {
            /**
             Save a new listener, and apply it.

             */
            console.log('adding listener');
            // save listener
            if (!o.listeners.hasOwnProperty(target))
                o.listeners[target] = {};
            o.listeners[target][type] = {'callback': callback, 'context': this};
            // apply the listener
            apply_a_listener(target, type, callback, this);
            return this;
        }
        function set_status(status) {
            var t = d3.select('body').select('#status');
            if (t.empty()) t = d3.select('body')
                .append('text')
                .attr('id', 'status');
            t.text(status);
            return this;
        }
        function setup() {
            o.decimal_format = d3.format('.1f');
            o.decimal_format_3 = d3.format('.3f');
            o.style_variables = get_style_variables(o.style);

            // set up svg and svg definitions
            o.scale = define_scales(o.map_data.max_map_w,
                                    o.map_data.max_map_h,
                                    o.width, o.height);
            var defs = utils.setup_defs(o.svg, o.css);
            generate_markers(defs);

            var out = utils.setup_zoom_container(o.svg, o.width, o.height, o.zoom_bounds, function(ev) {
		o.zoom = ev.scale;
		update_visibility();
            });
            o.sel = out.sel,
            o.zoom = out.initial_zoom;

            // parse the data objects
            o.has_flux = false; o.has_flux_comparison = false;
            o.has_metabolites = false; o.has_metabolite_deviation = false;
            if (o.flux) {
                o.has_flux = true;
                o.map_data = parse_flux_1(o.map_data, o.flux);
                if (o.flux2) {
                    o.has_flux_comparison = true;
                    o.map_data = parse_flux_2(o.map_data, o.flux2);
                }
            }
            if (o.metabolites) {
                o.has_metabolites = true;
                o.map_data = parse_metabolites_1(o.map_data, o.metabolites);
                if (o.metabolites2) {
                    o.has_metabolite_deviation = true;
                    o.map_data = parse_metabolites_2(o.map_data, o.metabolites2);
                }
            }

            update();

            // setup() definitions
            function get_style_variables(style) {
                return [];

                // var r = new RegExp("/\*(a-zA-Z)+\*/");
            }
            function define_scales(map_w, map_h, w, h) {
                var factor = Math.min(w/map_w, h/map_h),
                    scale = {};
                scale.x = d3.scale.linear()
                    .domain([0, map_w])
                    .range([(w - map_w*factor)/2, map_w*factor + (w - map_w*factor)/2]),
                scale.y = d3.scale.linear()
                    .domain([0, map_h])
                    .range([(h - map_h*factor)/2, map_h*factor + (h - map_h*factor)/2]),
                scale.x_size = d3.scale.linear()
                    .domain([0, map_w])
                    .range([0, map_w*factor]),
                scale.y_size = d3.scale.linear()
                    .domain([0, map_h])
                    .range([0, map_h*factor]),
                scale.size = d3.scale.linear()
                    .domain([0, 1])
                    .range([0, factor]),
                scale.flux = d3.scale.linear()
                    .domain([0, 40])
                    .range([6, 6]),
                scale.flux_fill = d3.scale.linear()
                    .domain([0, 40, 200])
                    .range([1, 1, 1]),
                scale.flux_color = d3.scale.linear()
                    .domain([0, 1, 20, 50])
                    .range(["rgb(200,200,200)", "rgb(150,150,255)", "blue", "red"]),
                scale.metabolite_concentration = d3.scale.linear()
                    .domain([0, 10])
                    .range([15, 200]),
                scale.metabolite_color = d3.scale.linear()
                    .domain([0, 1.2])
                    .range(["#FEF0D9", "#B30000"]);
                scale.scale_path = function(path) {
                    var x_fn = scale.x, y_fn = scale.y;
                    // TODO: scale arrow width
                    var str = d3.format(".2f"),
                        path = path.replace(/(M|L)([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p0, p1, p2) {
                            return p0 + [str(x_fn(parseFloat(p1))), str(y_fn(parseFloat(p2)))].join(', ');
                        }),
                        reg = /C([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)/g;
                    path = path.replace(reg, function (match, p1, p2, p3, p4, p5, p6) {
                        return 'C'+str(x_fn(parseFloat(p1)))+','+
                            str(y_fn(parseFloat(p2)))+' '+
                            str(x_fn(parseFloat(p3)))+','+
                            str(y_fn(parseFloat(p4)))+' '+
                            [str(x_fn(parseFloat(p5)))+','+str(y_fn(parseFloat(p6)))];
                    });
                    return path;
                };
                scale.scale_decimals = function(path, scale_fn, precision) {
                    var str = d3.format("."+String(precision)+"f");
                    path = path.replace(/([0-9.]+)/g, function (match, p1) {
                        return str(scale_fn(parseFloat(p1)));
                    });
                    return path;
                };
                return scale;
            }
            function generate_markers(defs) {
                var g = defs.append('g')
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
                    .attr("class", "marker");

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
                    .attr("class", "marker");
                return defs;
            }
        }
        function update(callback) {
            if (callback===undefined) callback = function() {};

            // remove everything from container
            o.sel.selectAll("*").remove();

            // add overlay
            o.sel.append("rect")
                .attr("class", "overlay")
                .attr("width", o.width)
                .attr("height", o.height)
                .attr("style", "stroke:black;fill:none;");

            // generate map

	    // always show these elements
            draw_membranes();
            draw_misc_labels();

	    // draw these based on zoom thresholds
            draw_metabolites();
            draw_reaction_labels();
	    draw_metabolite_labels();
	    draw_reaction_paths();
	    update_visibility();

            apply_listeners();
        };
        // update() definitions
        function draw_membranes() {
	    
            draw_these_membranes(o.sel, o.map_data.membrane_rectangles, o.scale);
        }
        function draw_these_membranes(selection, membrane_rectangles, scale) {
            selection.append("g")
                .attr("id", "membranes")
                .selectAll("rect")
                .data(membrane_rectangles)
                .enter().append("rect")
                .attr("class", function(d){ return d.class; })
                .attr("width", function(d){ return scale.x_size(d.width); })
                .attr("height", function(d){ return scale.y_size(d.height); })
                .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";})
                .style("stroke-width", function(d) { return scale.size(10); })
                .attr('rx', function(d){ return scale.x_size(20); })
                .attr('ry', function(d){ return scale.x_size(20); });
        }

        function draw_metabolites() {
            if (o.map_data.hasOwnProperty("metabolite_circles")) {
                draw_these_metabolite_circles(o.sel, o.map_data.metabolite_circles, o.scale,
                                              o.has_metabolites, o.has_metabolite_deviation);
            } else if (o.map_data.hasOwnProperty("metabolite_paths")) {
                if (o.has_metabolites) { alert('metabolites do not render w simpheny maps'); }
                draw_these_metabolite_paths(o.sel, o.map_data.metabolite_paths, o.scale);
            }
        }
        function draw_these_metabolite_circles(selection, metabolite_circles, scale,
                                               has_metabolites, has_metabolite_deviation) {
            selection.append("g")
                .attr("id", "metabolite-circles")
                .selectAll("circle")
                .data(data.metabolite_circles)
                .enter().append("circle")
                .attr("r", function (d) {
                    var sc = scale.metabolite_concentration;
                    if (d.metabolite_concentration) {
                        var s;
                        if (d.should_size) s = scale.size(sc(d.metabolite_concentration));
                        else s = scale.size(0);
                        return s;
                    } else if (has_metabolites) {
                        return scale.size(10);
                    } else {
                        return scale.size(d.r);
                    }
                })
                .attr("style", function (d) {
                    var sc = scale.metabolite_color;
                    if (d.metabolite_concentration) {
                        var a;
                        if (d.should_color) a = "fill:"+sc(d.metabolite_concentration) + ";" +
                            "stroke:black;stroke-width:0.5;";
                        else a = "fill:none;stroke:black;stroke-width:0.5;";
                        return a;
                    }
                    else if (has_metabolites) {
                        return "fill:grey;stroke:none;stroke-width:0.5;";
                    }
                    else { return ""; }
                })
                .attr("transform", function(d){
                    return "translate("+scale.x(d.cx)+","+scale.y(d.cy)+")";
                });
            if (has_metabolite_deviation) {
                append_deviation_arcs(selection, metabolite_circles);
            }

            // definitions
            function append_deviation_arcs(selection, metabolite_circles) {
                var arc_data = metabolite_circles.filter( function(o) {
                    return (o.hasOwnProperty('metabolite_deviation') &&
                            o.hasOwnProperty('metabolite_concentration'));
                });
                var arc = d3.svg.arc()
                        .startAngle(function(d) { return -d.metabolite_deviation/100/2*2*Math.PI; })
                        .endAngle(function(d) { return d.metabolite_deviation/100/2*2*Math.PI; })
                        .innerRadius(function(d) { return 0; })
                        .outerRadius(function(d) {
                            var s;
                            if (d.should_size) s = scale.size(scale.metabolite_concentration(d.metabolite_concentration));
                            else s = scale.size(0);
                            return s;
                        });
                selection.append("g")
                    .attr("id", "metabolite-deviation-arcs")
                    .selectAll("path")
                    .data(arc_data)
                    .enter().append("path")
                    .attr('d', arc)
                    .attr('style', "fill:black;stroke:none;opacity:0.4;")
                    .attr("transform", function(d) {
                        return "translate("+scale.x(d.cx)+","+scale.y(d.cy)+")";
                    });
            }
        }
        function draw_these_metabolite_paths(selection, metabolite_paths, scale) {
            selection.append("g")
                .attr("id", "metabolite-paths")
                .selectAll("path")
                .data(metabolite_paths)
                .enter().append("path")
                .attr("d", function(d) { return scale.scale_path(d.d); })
                .style("fill", "rgb(224, 134, 91)")
                .style("stroke", "rgb(162, 69, 16)")
                .style("stroke-width", String(scale.size(2))+"px");
        }

        function draw_reaction_labels() {
            draw_these_reaction_labels(o.sel, o.map_data.reaction_labels, o.scale, o.has_flux,
                                       o.has_flux_comparison, o.style_variables, o.decimal_format);
        }
        function draw_these_reaction_labels(selection, reaction_labels, scale, has_flux,
                                            has_flux_comparison, style_variables, decimal_format) {
            selection.append("g")
                .attr("id", "reaction-labels")
                .selectAll("text")
                .data(reaction_labels)
                .enter().append("text")
                .attr("class", "reaction-label")
                .text(function(d) {
                    var t = d.text;
                    if (has_flux_comparison)
                        t += " ("+decimal_format(d.flux1)+"/"+decimal_format(d.flux2)+": "+decimal_format(d.flux)+")";
                    else if (d.flux) t += " ("+decimal_format(d.flux)+")";
                    else if (has_flux) t += " (0)";
                    return t;
                })
                .attr("text-anchor", "start")
                .attr("font-size", function(d) {
                    var s;
                    if (style_variables.hasOwnProperty('reaction_label_size')) {
                        s = style_variables['reaction_label_size'];
                    }
                    else { s = 15; }
                    return scale.size(s);
                })
            // .attr("style", function(d){ if(!d.flux) return "visibility:hidden;"; else return ""; })
                .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
        }

        function draw_misc_labels() {
            draw_these_labels(o.sel, "misc-labels", o.map_data.misc_labels, o.scale);
        };
        function draw_these_labels(selection, id, labels, scale) {
            selection.append("g")
                .attr("id", id)
                .selectAll("text")
                .data(labels)
                .enter().append("text")
                .text(function(d) { return d.text; })
                .attr("font-size", scale.size(60))
                .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
        }

        function draw_metabolite_labels() {
            draw_these_metabolite_labels(o.sel, o.map_data.metabolite_labels, o.scale,
					o.has_metabolites, o.has_metabolite_deviation, o.decimal_format);
        };
        function draw_these_metabolite_labels(selection, metabolite_labels, scale,
                                              has_metabolites, has_metabolite_deviation,
                                              decimal_format) {
            selection.append("g")
                .attr("id", "metabolite-labels")
                .selectAll("text")
                .data(metabolite_labels)
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
                    if (d.metabolite_concentration) return scale.size(30);
                    else if (has_metabolites) return scale.size(20);
                    else return scale.size(20);
                })
                .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
        }
        function draw_reaction_paths() {
            draw_these_reaction_paths(o.sel, o.map_data.reaction_paths, o.scale, o.has_flux);
        }
        function draw_these_reaction_paths(selection, reaction_paths, scale, has_flux) {
            selection.append("g")
                .attr("id", "reaction-paths")
                .selectAll("path")
                .data(reaction_paths)
                .enter().append("path")
                .attr("d", function(d) { return scale.scale_path(d.d); })
                .attr("class", function(d) { return d["class"] + " reaction-path"; })
                .attr("style", function(d) {
                    var s = "", sc = scale.flux;
                    // .fill-arrow is for simpheny maps where the path surrounds line and
                    // arrowhead
                    // .line-arrow is for bigg maps were the line is a path and the
                    // arrowhead is a marker
                    if (d["class"]=="fill-arrow") sc = scale.flux_fill;
                    if (d.flux) {
                        s += "stroke-width:"+String(scale.size(sc(Math.abs(d.flux))))+";";
                        s += "stroke:"+scale.flux_color(Math.abs(d.flux))+";";
                        if (d["class"]=="fill-arrow") { s += "fill:"+scale.flux_color(Math.abs(d.flux))+";"; }
                        else if (d["class"]=="line-arrow") { make_arrowhead_for_fill(); }
                        else s += "fill:none";
                    }
                    else if (has_flux) {
                        s += "stroke-width:"+String(scale.size(sc(0)))+";";
                        s += "stroke:"+scale.flux_color(Math.abs(0))+";";
                        if (d["class"]=="fill-arrow") s += "fill:"+scale.flux_color(0)+";";
                        else s += "fill:none";
                    }
                    else {
                        s += "stroke-width:"+String(scale.size(1))+";";
                    }
                    return s;
                })
                .style('marker-end', function (d) {
                    if (!/end/.test(d.class)) return '';
                    if (d.flux) return make_arrowhead_for_fill(scale.flux_color(d.flux));
                    else if (has_flux) return make_arrowhead_for_fill(scale.flux_color(0));
                    else return "url(#end-triangle-path-color)";
                })
                .style('marker-start', function (d) {
                    if (!/start/.test(d.class)) return '';
                    if (d.flux) return make_arrowhead_for_fill(scale.flux_color(d.flux));
                    else if (has_flux) return make_arrowhead_for_fill(scale.flux_color(0));
                    else return "url(#start-triangle-path-color)";
                });
        }
	function update_visibility() {
	    /* Update the visibility of element based on zoom thresholds.
	     */
	    if (o.is_visible===undefined)
		o.is_visible = { metabolites: true, reactions: true, labels: true };
	    if (o.hidden_dom===undefined)
		o.hidden_dom = {};
            if (o.zoom < o.reaction_zoom_threshold) hide_reactions();
            else show_reactions();
            if (o.zoom < o.metabolite_zoom_threshold) hide_metabolites();
            else show_metabolites();
            if (o.zoom < o.label_zoom_threshold) hide_labels();
            else show_labels();
	    
	    // definitions
            function hide_metabolites() { 
		if (!o.is_visible.metabolites) return;
		var t = o.sel.select("#metabolite-circles");
		if (!t.empty()) {
		    o.hidden_dom.metabolite_circles = t.node();
		    t.remove();
		    o.is_visible.metabolites = false;
		    return;
		}
		t = o.sel.select("#metabolite-paths");
		if (!t.empty()) {
		    o.hidden_dom.metabolite_paths = t.node();
		    t.remove();
		    o.is_visible.metabolites = false;
		    return;
		}
            }
            function show_metabolites() { 
		if (o.is_visible.metabolites) return;
		if (!o.hidden_dom.metabolite_circles && !o.hidden_dom.metabolite_paths) {
		    console.warn("couldn't find hidden metabolites.");
		} else if (o.hidden_dom.metabolite_circles) {
		    o.sel.node().appendChild(o.hidden_dom.metabolite_circles);
		    o.is_visible.metabolites = true;
		} else {
		    o.sel.node().appendChild(o.hidden_dom.metabolite_paths);
		    o.is_visible.metabolites = true;
		}
            }
            function hide_reactions() { 
		if (!o.is_visible.reactions) return;
		var t = o.sel.select("#reaction-paths");
		if (!t.empty()) {
		    o.hidden_dom.reactions = t.node();
		    t.remove();
		    o.is_visible.reactions = false;
		}
            }
            function show_reactions() { 
		if (o.is_visible.reactions) return;
		if (!o.hidden_dom.reactions) {
		    console.warn("couldn't find hidden reactions.");
		} else {
		    o.sel.node().appendChild(o.hidden_dom.reactions);
		    o.is_visible.reactions = true;
		}
            }
            function hide_labels() { 
		if (!o.is_visible.labels) return;
		var t = o.sel.select("#metabolite-labels");
		if (!t.empty()) {
		    o.hidden_dom.metabolite_labels = t.node();
		    t.remove();
		}
		t = o.sel.select("#reaction-labels");
		if (!t.empty()) {
		    o.hidden_dom.reaction_labels = t.node();
		    t.remove();
		}
		o.is_visible.labels = false;
            }
            function show_labels() { 
		if (o.is_visible.labels) return;
		if (!o.hidden_dom.metabolite_labels || !o.hidden_dom.reaction_labels) {
		    console.warn("couldn't find hidden metabolite or reaction labels.");
		} else {
		    o.sel.node().appendChild(o.hidden_dom.metabolite_labels);
		    o.sel.node().appendChild(o.hidden_dom.reaction_labels);
		    o.is_visible.labels = true;
		}
            }
	}
        function make_arrowhead_for_fill(fill) {
            d3.select('#markers').selectAll("marker");
            return "";
        }
        function flux_to_data (data, fluxes, metabolites, metabolites2) {
            o.has_flux = false;
            o.has_flux_comparison = false;
            o.has_metabolites = false;
            o.has_metabolite_deviation = false;

            var remove_fluxes_from_data = function(d) {
                d.reaction_paths.map(function(o) {
                    delete o.flux;
                    return o;
                });
                d.reaction_labels.map(function(o) {
                    delete o.flux;
                    return o;
                });
                return d;
            };

            // parse the data objects and attach values to map objects
            if (fluxes.length > 0) {
                var flux = fluxes[0];
                o.has_flux = true;
                data = parse_flux_1(data, flux);
                if (fluxes.length > 1) {
                    var flux2 = fluxes[1];
                    o.has_flux_comparison = true;
                    data = parse_flux_2(data, flux2);
                }
            } else {
                remove_fluxes_from_data(data);
            }
            if (metabolites) {
                o.has_metabolites = true;
                data = parse_metabolites_1(data, metabolites);
                if (metabolites2) {
                    o.has_metabolite_deviation = true;
                    data = parse_metabolites_2(data, metabolites2);
                }
            }
            return data;
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
            var skip_these_metabolites = []; //
            var do_not_size_these_metabolites = ['nad','nadp','nadh','nadph','atp','adp','coa','accoa'];
            data.metabolite_circles = data.metabolite_circles.map( function(o) {
                if (o.id in metabolites && skip_these_metabolites.indexOf(o.id)==-1) {
                    o.metabolite_concentration = parseFloat(metabolites[o.id]);
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
                    o.metabolite_concentration = parseFloat(metabolites[o.text]);
                }
                return o;
            });
            return data;
        }

        function parse_metabolites_2(data, metabolites) {
            data.metabolite_circles = data.metabolite_circles.map( function(o) {
                if (o.id in metabolites) {
                    o.metabolite_deviation = parseFloat(metabolites[o.id]);
                }
                return o;
            });
            data.metabolite_labels = data.metabolite_labels.map( function(o) {
                if (o.text in metabolites) {
                    o.metabolite_deviation = parseFloat(metabolites[o.text]);
                }
                return o;
            });
            return data;
        }
    };
});
