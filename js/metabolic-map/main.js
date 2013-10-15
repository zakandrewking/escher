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
            css: '' });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        var files_to_load = [{file: o.css_path, callback: set_css },
                             {file: o.map_path, callback: set_map },
                             {file: o.flux_path,  callback: function(e, f) { set_flux(e, f, 0); } },
                             {file: o.flux2_path, callback: function(e, f) { set_flux(e, f, 1); } } ];
        scaffold.load_files(files_to_load, update);

        return { update: update };

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
        function update() {
            var data = o.map_data,
                style = o.css,
                flux = o.flux,
                flux2 = o.flux2,
                metabolites = o.metabolites,
                metabolites2 = o.metabolites2,
                svg = o.svg,
                width = o.width,
                height = o.height;

            var decimal_format = d3.format('.1f'),
                decimal_format_3 = d3.format('.3f'),
                has_flux = false,
                has_flux_comparison = false,
                has_metabolites = false,
                has_metabolite_deviation = false,
                style_variables = get_style_variables(style);

            // parse the data objects
            if (flux) {
                has_flux = true;
                data = parse_flux_1(data, flux);
                if (flux2) {
                    has_flux_comparison = true;
                    data = parse_flux_2(data, flux2);
                }
            }
            if (metabolites) {
                has_metabolites = true;
                data = parse_metabolites_1(data, metabolites);
                if (metabolites2) {
                    has_metabolite_deviation = true;
                    data = parse_metabolites_2(data, metabolites2);
                }
            }

            // set up svg and svg definitions
            var scale = define_scales(data.max_map_w, data.max_map_h, width, height);
            var defs = utils.setup_defs(svg, style);
            generate_markers(defs);
            var out = utils.setup_zoom_container(svg, width, height, [1, 15]),
		sel = out.sel;

            // generate map
            draw_membranes(sel, data.membrane_rectangles, scale);
            if (data.hasOwnProperty("metabolite_circles")) {
                draw_metabolite_circles(sel, data.metabolite_circles, scale,
                                        has_metabolites, has_metabolite_deviation);
            } else if (data.hasOwnProperty("metabolite_paths")) {
                if (has_metabolites) { alert('metabolites do not render w simpheny maps'); }
                draw_metabolite_paths(sel, data.metabolite_paths, scale);
            }
            draw_reaction_labels(sel, data.reaction_labels, scale, has_flux, 
				 has_flux_comparison, style_variables);
	    draw_labels(sel, "misc-labels", data.misc_labels, scale);
	    draw_metabolite_labels(sel, data.metabolite_labels, scale,
				   has_metabolites, has_metabolite_deviation,
				   decimal_format);
            draw_reaction_paths(sel, data.reaction_paths, scale, has_flux);

            // definitions
            function get_style_variables(style) {
                return [];

                // var r = new RegExp("/\*(a-zA-Z)+\*/");
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

            function draw_membranes(selection, membrane_rectangles, scale) {
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

            function draw_metabolite_circles(selection, metabolite_circles, scale,
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

            function draw_metabolite_paths(selection, metabolite_paths, scale) {
                console.log('metabolite paths');
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

            function draw_reaction_labels(selection, reaction_labels, scale, has_flux,
					  has_flux_comparison, style_variables) {
                selection.append("g")
                    .attr("id", "reaction-labels")
                    .selectAll("text")
                    .data(reaction_labels)
                    .enter().append("text")
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

	    function draw_labels(selection, id, labels, scale) {
		selection.append("g")
                    .attr("id", id)
                    .selectAll("text")
                    .data(labels)
                    .enter().append("text")
                    .text(function(d) { return d.text; })
                    .attr("font-size", scale.size(60))
                    .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
	    }

	    function draw_metabolite_labels(selection, metabolite_labels, scale, 
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
                    .style("visibility","visible")
                    .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
	    }

            function draw_reaction_paths(selection, reaction_paths, scale, has_flux) {
                selection.append("g")
                    .attr("id", "reaction-paths")
                    .selectAll("path")
                    .data(reaction_paths)
                    .enter().append("path")
                    .attr("d", function(d) { return scale.scale_path(d.d); })
                    .attr("class", function(d) { return d["class"]; })
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

            function make_arrowhead_for_fill(fill) {
                d3.select('#markers').selectAll("marker"); //
                return ""
            }
        }
    };
});
