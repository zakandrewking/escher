define(["./scaffold", "lib/d3"], function (scaffold, d3) {
    /** histogram.js

     (c) Zachary King 2013

     TODO add update_size function.
     
     */
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            padding: {left: 30, bottom: 30, top: 10, right: 10},
            selection: d3.select('body').append('div'),
            selection_is_svg: false,
            fill_screen: false,
            title: false,
            update_hook: false,
            css_path: '',
            x_axis_label: "",
            y_axis_label: "",
            x_data_label: '1',
            y_data_label: '2',
            x_shift: 10 });

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
            collect_data: collect_data
        };

        // definitions
        function update() {
            // reset defs
            o.svg.select("defs").remove();
            o.svg.append("defs").append("style")
                .attr('type', "text/css")
                .text(o.css);

            // clear the container and add again
            o.svg.select("#scatter-container").remove();
            var container = o.svg.append("g").attr("id","scatter-container");
            o.sel = container.attr("transform", "translate(" + o.margins.left + "," + 
				   o.margins.top + ")");

            var layers = o.layers,
                height = o.height, width = o.width;

            // check data
            var i=-1;
            while(++i < layers.length) {
                if (layers[i]===undefined) {
                    console.log('waiting for all indices');
                    return this;
                }
            }

            // find x domain
            var x_dom = [
                d3.min(layers, function(a) {
                    return d3.min(a, function(d) { return d.x; });
                }),
                d3.max(layers, function(a) {
                    return d3.max(a, function(d) { return d.x; });
                })
            ];
            o.dom = {'x': x_dom};

            // generate x scale
	    var x_is_log = false, y_is_log = false,
		out = scaffold.scale_and_axes(o.dom.x, null, width, height,
                                              { padding: o.padding,
                                                x_is_log: x_is_log,
                                                x_ticks: 15});
            o.x = out.x;

            // Generate a histogram using twenty uniformly-spaced bins.
            var layout = [],
                hist = d3.layout.histogram()
                    .value(function (d) { return d.x; })
                    .bins(o.x.ticks(15));
            layout = layers.map(function(j) { return hist(j); });

            var y_dom = [
                0,
                d3.max(layout, function (a) {
                    return d3.max(a, function(d) { return d.y; });
                })
            ];
            o.dom.y = y_dom;

            // add scale and axes
            out = scaffold.scale_and_axes(o.dom.x, o.dom.y, width, height,
                                          { padding: o.padding,
                                            x_is_log: x_is_log,
                                            y_is_log: y_is_log,
                                            x_ticks: 15});
            o.x = out.x, o.y = out.y;
            scaffold.add_generic_axis('x', o.x_axis_label, o.sel, out.x_axis, width, height, o.padding);
            scaffold.add_generic_axis('y', o.y_axis_label, o.sel, out.y_axis, width, height, o.padding);

	    console.log(o.dom.x, o.dom.y);

            o.x_size_scale = d3.scale.linear()
                .range([0, width])
                .domain([0, o.dom.x[1] - o.dom.x[0]]);

            o.xAxis = d3.svg.axis()
                .scale(o.x)
                .orient("bottom")
                .ticks(15);         //TODO make sure this matches x_ticks

            o.yAxis = d3.svg.axis()
                .scale(o.y)
                .orient("left")
                .ticks(20);


            var legend = o.sel.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (width-300) + ", 80)")
                    .attr("width", "300px")
                    .attr("height", "200px");

            o.diff = 8;
            o.hist_dx = layout[0][0].dx;
            var bar_w = o.x_size_scale(o.hist_dx) - o.diff - o.x_shift;
	    console.log(o.y);

            for (var j=0; j<layout.length; j++) {
                var cl = 'hist-bar'+String(j);
                var bars = o.sel.selectAll("."+cl)
                        .data(layout[j])
                        .enter().append("g")
                        .attr("class", "hist-bar "+cl)
                        .attr("transform", function(d) { return "translate(" + (o.x(d.x)+o.x_shift*j-bar_w/2) + "," + o.y(d.y) + ")"; });
                bars.append("rect")
                    .attr("x", 1)
                    .attr("width", bar_w)
                    .attr("height", function(d) { return o.y(o.dom.y[0]) - o.y(d.y); });
                // add_legend(legend, layers[j].options.name, j, 'legend '+cl);
            }

            return this;

	    // definitions
            function add_legend(a, t, i, cl) {
                var g = a.append("g")
                        .attr("transform", "translate(0,"+i*40+")");
                g.append("text")
                    .text(t)
                    .attr("transform", "translate(30, 14)");
                g.append("rect")
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("class", cl);
            }
        }
        function update_size() {
            // // TODO inherit this function
            // var o = o.height_width(o.fillScreen, o.selection, o.margins);
            // var height = o.height, width = o.width;

            // var ns = o.selection.select("svg")
            //         .attr("width", width + o.margins.left + o.margins.right)
            //         .attr("height", height + o.margins.top + o.margins.bottom);
            // ns.select('g').attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");

            // o.x.range([0, width]);
            // o.y.range([height, 0]);

            // o.x_size_scale.range([0, width]);

            // o.xAxis.scale(o.x);
            // o.yAxis.scale(o.y);

            // o.selection.select('.x.hist-axis')
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(o.xAxis)
            //     .select('text')
            //     .attr("x", width);
            // o.selection.select('.y.hist-axis')
            //     .call(o.yAxis);

            // var bar_w = o.x_size_scale(o.hist_dx) - o.diff - 8;

            // for (var i=0; i<s.json.length; i++) {
            //     o.selection.selectAll(".hist-bar.hist-bar"+String(i))
            //         .attr("transform", function(d) {
            //             return "translate(" + (o.x(d.x) + o.x_shift*i) + "," + o.y(d.y) + ")";
            //         })
            //         .select('rect')
            //         .attr("width", bar_w)
            //         .attr("height", function(d) { return height - o.y(d.y); });
            // }

            // d3.select(".legend")     //TODO options for legend location
            //     .attr("transform", "translate(" + (width-300) + ", 80)");

            // return this;
        };
        function collect_data(json, layer) {
            o.layers[layer] = json.data;
            update();
	    return this;
        };
    };
});
