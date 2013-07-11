// data.json:
// [
//     {name:, f1:, f2:},
//     ...
// ]

var Scatter = function() {
    var s = {};

    s.data = [];
    s.selection = [];
    s.update_size = function() {
        if (s.fillScreen==true) {
            s.selection.style('height', (window.innerHeight-s.margin)+'px');
            s.selection.style('width', (window.innerWidth-s.margin)+'px');
        }

        var width = parseFloat(s.selection.style('width')) - s.margins.left - s.margins.right,
            height = parseFloat(s.selection.style('height')) - s.margins.top - s.margins.bottom;
        var ns = s.selection.select("svg")
                .attr("width", width + s.margins.left + s.margins.right)
                .attr("height", height + s.margins.top + s.margins.bottom);
        ns.select('g').attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")");

        s.x.range([1, width]);
        s.y.range([height, 1]);

        s.xAxis.scale(s.x);
        s.yAxis.scale(s.y);

        s.selection.select('.x.axis')
            .attr("transform", "translate(0," + height + ")")
            .call(s.xAxis)
            .select('text')
            .attr("x", width);
        s.selection.select('.y.axis')
            .call(s.yAxis);

        s.selection.select(".points").selectAll('path')
            .attr("transform", function (d) {
                return "translate(" + s.x(d.f1) + "," + s.y(d.f2) + ")";
            });

        s.selection.select(".trendline").select('path')
            .attr("d", s.line([[s.x(s.dom.x[0]), s.y(s.dom.y[0])], [s.x(s.dom.x[1]), s.y(s.dom.y[1])]]));
    };
    s.update = function() {
        console.log(s.margin);
        if (s.fillScreen==true) {
            s.selection.style('height', (window.innerHeight-s.margins.bottom)+'px');
            s.selection.style('width', (window.innerWidth-s.margins.right)+'px');
        }

        var f = s.data;

        var width = parseFloat(s.selection.style('width')) - s.margins.left - s.margins.right,
            height = parseFloat(s.selection.style('height')) - s.margins.top - s.margins.bottom;

        s.selection.empty();

        var svg = s.selection.append("svg")
                .attr("width", width + s.margins.left + s.margins.right)
                .attr("height", height + s.margins.top + s.margins.bottom)
                .append("g")
                .attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")");

        // set zero values to min
        var f1nz = f.map(function (d) { // f1 not zero
            if (d.f1>0) { return d.f1; }
            else { return null; }
        }),
            f2nz = f.map(function (d) { // f2 not zero
                if (d.f2>0) { return d.f2; }
                else { return null; }
            });

        var equal_axes = false;
        if (equal_axes) {
            var a_dom = [d3.min([d3.min(f1nz), d3.min(f2nz)]) / 2,
                         d3.max([d3.max(f1nz), d3.max(f2nz)])];
            s.dom = {'x': a_dom, 'y': a_dom};
        }
        else {
            s.dom = {'x': [d3.min(f1nz) / 2,
                           d3.max(f1nz)],
                     'y': [d3.min(f2nz) / 2,
                           d3.max(f2nz)]};
        }
	console.log('domain');
	console.log(s.dom);

        s.x = d3.scale.log()
            .range([1, width])
            .domain(s.dom.x);
        s.y = d3.scale.log()
            .range([height, 1])
            .domain(s.dom.y);

        f = f.map(function (d) {
            if (d.f1 < s.dom.x[0]) { d.f1 = s.dom.x[0];  }
            if (d.f2 < s.dom.y[0]) { d.f2 = s.dom.y[0];  }
            return d;
        });

        s.xAxis = d3.svg.axis()
            .scale(s.x)
            .orient("bottom");

        s.yAxis = d3.svg.axis()
            .scale(s.y)
            .orient("left");

        s.line = d3.svg.line()
            .x(function(d) { return d[0]; })
            .y(function(d) { return d[1] });

        var g = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(200, 80)")
                .attr("width", "300px")
                .attr("height", "200px");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(s.xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(s.x_axis_label);

        svg.append("g")
            .attr("class", "y axis")
            .call(s.yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(s.y_axis_label);

        svg.append("g")
            .attr("class", "points")
            .selectAll("path")
            .data(f)
            .enter()
            .append("path")
            .attr("d", d3.svg.symbol().type('circle').size(8))
            .attr('class', 'point-circle')
            .style("fill", function(d) {
                if (/.*/g.exec(d.name)) {
                    return 'red';
                } else {
                    return 'none';
                }
            })
            .attr("transform", function (d) {
                return "translate(" + s.x(d.f1) + "," + s.y(d.f2) + ")";
            })
            .append("title")
            .text(function(d) { return d.name; });

        svg.append("g")
            .attr("class", "trendline")
            .append("path")
            .attr("d", s.line([[s.x(s.dom.x[0]), s.y(s.dom.y[0])], [s.x(s.dom.x[1]), s.y(s.dom.y[1])]]));


        // setup up cursor tooltip
        var save_key = 83;
        if (true) cursor_tooltip(svg, width+s.margins.left+s.margins.right,
                                 height+s.margins.top+s.margins.bottom, s.x, s.y,
                                 save_key);
        return this;
    };

    s.setup = function(options) {
        if (typeof options === 'undefined') options = {};
        s.selection = options.selection || d3.select('body');
        s.margins = options.margins  || {top: 20, right: 20, bottom: 30, left: 50};
        s.fillScreen = options.fillScreen || false;
        var default_filename_index = 0;
        s.x_axis_label = options.x_axis_label || "";
        s.y_axis_label = options.y_axis_label || "";
        s.data = options.data;

        // var menu = s.selection.append('div').attr('id','menu');
        // menu.append('div').style('width','100%').text("Press 's' to freeze tooltip");

        s.update();
        return this;
    };

    return {
        setup: s.setup,
        update: s.update,
        update_size: s.update_size
    };
};

d3.select("#plot").style('height', "400px");
var selection = d3.select("#plot");
var s = Scatter().setup({ 'selection': selection, 'data': json });
