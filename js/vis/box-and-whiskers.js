define(["./scaffold", "lib/d3"], function (scaffold, d3) {
    // Data should have elements {min: 0.0, max: 5.0, Q1: 2.0, Q2: 3.0, Q3: 4.0}

    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            selection_is_svg: false,
            fillScreen: false,
            x_axis_label: "",
            y_axis_label: "",
            data_is_object: false,  // defines the data format, according to pandas.DataFrame.to_json()
            y_range: false,
            title: false,
            update_hook: false,
            css: '' });

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

        var update_size = function () {
            return this;
        };

        var update = function() {
            // add the styles
            o.svg.append("style")
                .attr('type', "text/css")
                .text(o.css);

            var f = o.data;

            var x = d3.scale.linear()
                    .range([0, o.width])
                    .domain([0, f.length]);

            var y = d3.scale.linear()
                    .range([o.height, 1])
                    .domain([d3.min(f, function (d) { return d.min; }),
                             d3.max(f, function (d) { return d.max; }) ])
                    .nice();

            var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

            var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(20);

            var line = d3.svg.line()
                    .x(function(d) { return d[0]; })
                    .y(function(d) { return d[1] });

            var g = o.svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(200, 80)")
                    .attr("width", "300px")
                    .attr("height", "200px");

            // add_legend(g, '10x', 'blue', 0);
            // add_legend(g, '100x', 'red', 1);
            // function add_legend(a, t, color, i) {
            //     var g = a.append("g")
            //             .attr("transform", "translate(0,"+i*40+")");
            //     g.append("text")
            //         .text(t)
            //         .attr("transform", "translate(30, 7)");
            //     g.append("circle")
            //         .attr("r", 10)
            //         .attr("style", "fill:"+color);
            // }

            // var g2 = g.append("g")
            //         .attr("transform", "translate(0,80)");
            // g2.append("path")
            //     .attr("class", "min-max-2")
            //     .attr("d", function (d) {
            //         return line([[0,0], [200, 0]]);
            //     })
            //     .style("stroke-width", "2px");
            // g2.append("path")
            //     .attr("class", "Q1-Q3-2")
            //     .attr("d", function (d) {
            //         return line([[60,0], [140, 0]]);
            //     })
            //     .style("stroke-width", "2px");
            // g2.append("path")
            //     .attr("class", "median-2")
            //     .attr("d", function (d) {
            //         return line([[90,0], [95, 0]]);
            //     })
            //     .style("stroke-width", "2px");
            // g2.append("text")
            //     .text("min")
            //     .attr("transform", "translate(-10,20)");
            // g2.append("text")
            //     .text("Q1")
            //     .attr("transform", "translate(50,20)");
            // g2.append("text")
            //     .text("med")
            //     .attr("transform", "translate(83,20)");
            // g2.append("text")
            //     .text("Q3")
            //     .attr("transform", "translate(130,20)");
            // g2.append("text")
            //     .text("max")
            //     .attr("transform", "translate(190,20)");

            o.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + o.height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", o.width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("flux variables");

            o.svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("flux");

            o.svg.append('g')
                .selectAll("path")
                .data(f)
                .enter()
                .append("path")
                .attr("class", "min-max")
                .attr("d", function(d) {
                    return line([[x(d.rank), y(d.min)], [x(d.rank), y(d.max)]]);
                });

            // Q1 to Q3
            o.svg.append('g')
                .selectAll("path")
                .data(f)
                .enter()
                .append("path")
                .attr("class", "Q1-Q3")
                .attr("d", function (d) {
                    return line([[x(d.rank), y(d.Q1)], [x(d.rank), y(d.Q3)]]);
                });

            var m_l = 0;
            o.svg.append('g')
                .selectAll("path")
                .data(f)
                .enter()
                .append("path")
                .attr("class", "median")
                .attr("d", function (d) {
                    return line([[x(d.rank), y(d.median)-m_l], [x(d.rank), y(d.median)+m_l]]);
                });

            if (o.title) {
                o.svg.append('text')
                    .attr('class', 'title')
                    .text(o.title)
                    .attr("transform", "translate("+o.width/2+",10)")
                    .attr("text-anchor", "middle");
            }

            if (o.update_hook) o.update_hook(o.svg);
            return this;
        };

        var collect_data = function(json) {
            if (!o.ready) console.warn('Hasn\'t loaded css yet');
            // add ranks
            if (o.data_is_object) {
                var objects = [], i = -1, keys = Object.keys(json);
                while (++i < keys.length) {
                    var th = json[keys[i]];
                    th['rank'] = i;
                    objects.push(th);
                }
                o.data = objects;
            } else {
                var i = -1, objects = [];
                while (++i < json.length) {
                    var th = json[i];
                    th['rank'] = i;
                    objects.push(th);
                }
                o.data = objects;
            }
            this.update();
            return this;
        };

        var set_update_hook = function(fn) {
            o.update_hook = fn;
            return this;
        };

        return {
            update: update,
            collect_data: collect_data,
            update_hook: set_update_hook
        };
    };
});
