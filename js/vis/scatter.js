define(["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            selection_is_svg: false,
            fillScreen: false,
            x_axis_label: "",
            y_axis_label: "",
            x_data_label: '1',
            y_data_label: '2',
            x_shift: 4,
            data_is_object: true,
            color_scale: false,
            y_range: false,
            title: false,
            is_stacked: false,
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

        return {
            update: update,
            collect_data: collect_data
        };

        // definitions
        function update() {
            o.x.range([1, width]);
            o.y.range([height, 1]);

            o.xAxis.scale(o.x);
            o.yAxis.scale(o.y);

            o.selection.select('.x.axis')
                .attr("transform", "translate(0," + height + ")")
                .call(o.xAxis)
                .select('text')
                .attr("x", width);
            o.selection.select('.y.axis')
                .call(o.yAxis);

            o.selection.select(".points").selectAll('path')
                .attr("transform", function (d) {
                    return "translate(" + o.x(d.f1) + "," + o.y(d.f2) + ")";
                });

            o.selection.select(".trendline").select('path')
                .attr("d", o.line([[o.x(o.dom.x[0]), o.y(o.dom.y[0])], [o.x(o.dom.x[1]), o.y(o.dom.y[1])]]));

            // assuming only a single layer for now
            // TODO allow for multiple layers
            if (o.data.length==0) return null;
            var layer_0 = o.data[0];
            if (!(layer_0.hasOwnProperty('x') && layer_0.hasOwnProperty('y'))) return null;

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
            console.log('domain');
            console.log(o.dom);

            f = f.map(function (d) {
                if (d.f1 < o.dom.x[0]) { d.f1 = o.dom.x[0];  }
                if (d.f2 < o.dom.y[0]) { d.f2 = o.dom.y[0];  }
                return d;
            });

            var width = parseFloat(o.selection.style('width')) - o.margins.left - o.margins.right,
            height = parseFloat(o.selection.style('height')) - o.margins.top - o.margins.bottom;

            o.x = d3.scale.log()
                .range([1, width])
                .domain(o.dom.x);
            o.y = d3.scale.log()
                .range([height, 1])
                .domain(o.dom.y);

            o.xAxis = d3.svg.axis()
                .scale(o.x)
                .orient("bottom");

            o.yAxis = d3.svg.axis()
                .scale(o.y)
                .orient("left");

            o.line = d3.svg.line()
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; });

            var g = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(200, 80)")
                .attr("width", "300px")
                .attr("height", "200px");

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(o.xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(o.x_axis_label);

            svg.append("g")
                .attr("class", "y axis")
                .call(o.yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(o.y_axis_label);

            svg.append("g")
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

            svg.append("g")
                .attr("class", "trendline")
                .append("path")
                .attr("d", o.line([[o.x(o.dom.x[0]), o.y(o.dom.y[0])], [o.x(o.dom.x[1]), o.y(o.dom.y[1])]]));


            // setup up cursor tooltip
            var save_key = 83;
            if (true) cursor_tooltip(svg, width+o.margins.left+o.margins.right,
                                     height+o.margins.top+o.margins.bottom, o.x, o.y,
                                     save_key);
            return this;
        }

        function collect_data(json, axis, layer) {
            // TODO take json.options (e.g. json.options.name) into account

            if (axis!='x' && axis!='y') console.warn('bad axis: ' + axis);

            if (!o.data[layer]) o.data[layer] = [];
            o.data[layer][axis] = json.data;
            update();
        }
    };
});
