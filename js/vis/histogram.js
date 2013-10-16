define(["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            plot_padding: {left: 30, bottom: 30, top: 10, right: 10},
            selection_is_svg: false,
            fillScreen: false,
            // data_is_object: true,
            title: false,
            update_hook: false,
            css_path: '' });

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
        function update_size() {
            // // TODO inherit this function
            // var o = s.height_width(s.fillScreen, s.selection, s.margins);
            // var height = o.height, width = o.width;

            // var ns = s.selection.select("svg")
            //         .attr("width", width + s.margins.left + s.margins.right)
            //         .attr("height", height + s.margins.top + s.margins.bottom);
            // ns.select('g').attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")");

            // s.x.range([0, width]);
            // s.y.range([height, 0]);

            // s.x_size_scale.range([0, width]);

            // s.xAxis.scale(s.x);
            // s.yAxis.scale(s.y);

            // s.selection.select('.x.hist-axis')
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(s.xAxis)
            //     .select('text')
            //     .attr("x", width);
            // s.selection.select('.y.hist-axis')
            //     .call(s.yAxis);

            // var bar_w = s.x_size_scale(s.hist_dx) - s.diff - 8;

            // for (var i=0; i<s.json.length; i++) {
            //     s.selection.selectAll(".hist-bar.hist-bar"+String(i))
            //         .attr("transform", function(d) {
            //             return "translate(" + (s.x(d.x) + s.x_shift*i) + "," + s.y(d.y) + ")";
            //         })
            //         .select('rect')
            //         .attr("width", bar_w)
            //         .attr("height", function(d) { return height - s.y(d.y); });
            // }

            // d3.select(".legend")     //TODO options for legend location
            //     .attr("transform", "translate(" + (width-300) + ", 80)");

            // return this;
        };

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

            var json = o.json,
                height = o.height, width = o.width;

            // check data
            var i=-1;
            while(++i < json.length) {
                if (json[i]===undefined) {
                    console.log('waiting for all indices');
                    return;
                }
            }

            // find x domain
            var x_dom = [
                d3.min(json, function(a) {
                    return d3.min(a.data, function(d) { return d.x; });
                }),
                d3.max(json, function(a) {
                    return d3.max(a.data, function(d) { return d.x; });
                })
            ];
            s.dom = {'x': x_dom};

            // Generate a histogram using twenty uniformly-spaced bins.
            var layout = [],
                hist = d3.layout.histogram()
                    .value(function (d) { return d.x; })
                    .bins(x_ticks);
            layout = json.map(function(j) { return hist(j.data); });

            var y_dom = [
                0,
                d3.max(layout, function (a) {
                    return d3.max(a, function(d) { return d.y; });
                })
            ];
            s.dom.y = y_dom;

            // add scale and axes
            var out = scaffold.scale_and_axes(o.dom.x, o.dom.y, width, height,
                                              { padding: padding,
                                                x_is_log: true,
                                                y_is_log: true,
                                                x_ticks: 15});
            o.x = out.x, o.y = out.y;
            scaffold.add_generic_axis('x', o.x_axis_label, o.sel, out.x_axis, width, height, padding);
            scaffold.add_generic_axis('y', o.y_axis_label, o.sel, out.y_axis, width, height, padding);

            s.x_size_scale = d3.scale.linear()
                .range([0, width])
                .domain([0, s.dom.x[1] - s.dom.x[0]]);

            s.xAxis = d3.svg.axis()
                .scale(s.x)
                .orient("bottom")
                .ticks(15);         //TODO make sure this matches x_ticks

            s.yAxis = d3.svg.axis()
                .scale(s.y)
                .orient("left")
                .ticks(20);


            var legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (width-300) + ", 80)")
                    .attr("width", "300px")
                    .attr("height", "200px");

            s.diff = 10;
            s.hist_dx = layout[0][0].dx;
            var bar_w = s.x_size_scale(s.hist_dx) - s.diff - 8;

            for (var j=0; j<layout.length; j++) {
                var cl = 'hist-bar'+String(j);
                var bars = svg.selectAll("."+cl)
                        .data(layout[j])
                        .enter().append("g")
                        .attr("class", "hist-bar "+cl)
                        .attr("transform", function(d) { return "translate(" + (s.x(d.x)+s.x_shift*j) + "," + s.y(d.y) + ")"; });
                bars.append("rect")
                    .attr("x", 1)
                    .attr("width", bar_w)
                    .attr("height", function(d) { return height - s.y(d.y); });
                add_legend(legend, json[j].options.name, j, 'legend '+cl);
            }

            svg.append("g")
                .attr("class", "x hist-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(s.xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(s.x_axis_label);

            svg.append("g")
                .attr("class", "y hist-axis")
                .call(s.yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(s.y_axis_label);

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
            return this;
        };

        s.setup = function (options) {
            if (typeof options === 'undefined') options = {};
            s.selection = options.selection || d3.select('body').append('div');
            s.margins = options.margins  || {top: 20, right: 20, bottom: 30, left: 50};
            s.fillScreen = options.fillScreen || false;
            s.x_axis_label = options.x_axis_label || "";
            s.y_axis_label = options.y_axis_label || "";
            s.x_data_label = options.x_data_label || '1',
            s.y_data_label = options.y_data_label || '2';
            s.x_shift      = options.x_shift      || 4;
            s.json = [];
            return this;
        };

        s.collect_data = function(json, layer) {
            s.json[layer] = json;
            s.update(s.json);
        };

        return {
            setup: s.setup,
            update: s.update,
            update_size: s.update_size,
            collect_data: s.collect_data
        };
    };
});
