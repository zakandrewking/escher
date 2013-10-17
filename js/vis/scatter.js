define(["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
	    padding: {left: 30, bottom: 30, top: 10, right: 10},
            selection_is_svg: false,
	    selection: d3.select('body'),
            fillScreen: false,
            // data_is_object: true,
            title: false,
            update_hook: false,
            css_path: '',
	    tooltip: false,
	    x_is_log: true,
	    y_is_log: true });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // load the css
        o.ready = scaffold.load_css(o.css_path, function(css) {
            o.css = css;
            o.ready = true;
        });
        o.layers = [];

        return {
            update: update,
	    update_size: update_size,
            collect_data: collect_data
        };

        // definitions
        function update_size() {
	    // update size
            var out = scaffold.resize_svg(o.selection, o.selection_is_svg,
					  o.margins, o.fill_screen);
            o.height = out.height;
            o.width = out.width;

	    // update scales and axes
	    out = scaffold.scale_and_axes(o.dom.x, o.dom.y, o.width, o.height,
					      { padding: o.padding,
						x_is_log: o.x_is_log,
						y_is_log: o.y_is_log });
	    o.x = out.x, o.y = out.y, o.x_axis = out.x_axis, o.y_axis = out.y_axis;

	    // redraw axes
            o.sel.select('.x.axis').remove();
            o.sel.select('.y.axis').remove();
	    scaffold.add_generic_axis('x', o.x_axis_label, o.sel, o.x_axis, o.width,
				      o.height, o.padding);
	    scaffold.add_generic_axis('y', o.y_axis_label, o.sel, o.y_axis, o.width,
				      o.height, o.padding);

	    // update points
            o.sel.select(".points").selectAll('path')
                .attr("transform", function (d) {
                    return "translate(" + o.x(d.f1) + "," + o.y(d.f2) + ")";
                });

	    // update trendline
            o.sel.select(".trendline").select('path')
                .attr("d", o.line([[o.x(o.dom.x[0]), o.y(o.dom.y[0])],
	    			   [o.x(o.dom.x[1]), o.y(o.dom.y[1])]]));
	    return this;
        }
        function update() {
	    // reset defs
	    o.svg.select("defs").remove();
            o.svg.append("defs").append("style")
                .attr('type', "text/css")
                .text(o.css);

            // clear the container and add again
            o.svg.select("#scatter-container").remove();
            var container = o.svg.append("g").attr("id","scatter-container");
            o.sel = container.attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");

	    var height = o.height, width = o.width,
	    padding = o.padding;

            // assuming only a single layer for now
            // TODO allow for multiple layers
            if (o.layers.length==0) return null;
            var layer_0 = o.layers[0];
            if (layer_0.x===undefined || layer_0.y===undefined) {
		console.log("data hasn't finished loading");
		return null;
	    }

            var name_x, name_y, f = [], pushed = [];
            for (var i=0; i<layer_0.x.length; i++) {
                name_x = layer_0.x[i].name;
                for (var j=0; j<layer_0.y.length; j++) {
                    name_y = layer_0.y[j].name;
                    if (name_x == name_y && pushed.indexOf(name_x)==-1) {
                        f.push({'name': name_x, 'f1': layer_0.x[i].x, 'f2': layer_0.y[j].x});
                        pushed.push(name_x);
                    }
                }
            }

            // set zero values to min
            var f1nz = f.map(function (d) { // f1 not zero
                if (d.f1>0) { return d.f1; }
                else { return null; }
            });
            var f2nz = f.map(function (d) { // f2 not zero
                if (d.f2>0) { return d.f2; }
                else { return null; }
            });

            var equal_axes = false;
            if (equal_axes) {
                var a_dom = [d3.min([d3.min(f1nz), d3.min(f2nz)]) / 2,
                             d3.max([d3.max(f1nz), d3.max(f2nz)])];
                o.dom = {'x': a_dom, 'y': a_dom};
            }
            else {
                o.dom = {'x': [d3.min(f1nz) / 2,
                               d3.max(f1nz)],
                         'y': [d3.min(f2nz) / 2,
                               d3.max(f2nz)]};
            }

            f = f.map(function (d) {
                if (d.f1 < o.dom.x[0]) { d.f1 = o.dom.x[0];  }
                if (d.f2 < o.dom.y[0]) { d.f2 = o.dom.y[0];  }
                return d;
            });

	    // add scale and axes
	    var out = scaffold.scale_and_axes(o.dom.x, o.dom.y, width, height,
					      { padding: padding,
						x_is_log: o.x_is_log,
						y_is_log: o.y_is_log });
	    o.x = out.x, o.y = out.y, o.x_axis = out.x_axis, o.y_axis = out.y_axis;
	    scaffold.add_generic_axis('x', o.x_axis_label, o.sel, out.x_axis, width, height, padding);
	    scaffold.add_generic_axis('y', o.y_axis_label, o.sel, out.y_axis, width, height, padding);
	   
            o.line = d3.svg.line()
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; });

            var g = o.sel.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(200, 80)")
                .attr("width", "300px")
                .attr("height", "200px");

            o.sel.append("g")
                .attr("class", "points")
                .selectAll("path")
                .data(f)
                .enter()
                .append("path")
                .attr("d", d3.svg.symbol().type('circle').size(28))
                .attr('class', 'point-circle')
                .style("fill", function(d) {
                    if (/.*/g.exec(d.name)) {
                        return 'red';
                    } else {
                        return 'none';
                    }
                })
                .attr("transform", function (d) {
                    return "translate(" + o.x(d.f1) + "," + o.y(d.f2) + ")";
                })
                .append("title")
                .text(function(d) { return d.name; });

            o.sel.append("g")
                .attr("class", "trendline")
                .append("path")
                .attr("d", o.line([[o.x(o.dom.x[0]), o.y(o.dom.y[0])], [o.x(o.dom.x[1]), o.y(o.dom.y[1])]]));


            // setup up cursor tooltip
            var save_key = 83;
            if (o.tooltip) o.tooltip.cursor_tooltip(o.sel, width+o.margins.left+o.margins.right,
						    height+o.margins.top+o.margins.bottom, o.x, o.y,
						    save_key);
            return this;
        }

        function collect_data(data, axis, layer) {
            if (axis!='x' && axis!='y') console.warn('bad axis: ' + axis);
            if (!o.layers[layer]) o.layers[layer] = {};
            o.layers[layer][axis] = data;
            update();
	    return this;
        }
    };
});
