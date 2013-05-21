// data.json:
// [
//     {name:, f1:, f2:},
//     ...
// ]

var filename = '10x-100x-median.json';
var x_axis_label = '10x',
y_axis_label = '100x';

d3.json(filename, function(error, data) {
    if (error) return console.warn(error);
    load(data);
});

function load(f) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $(window).width() - margin.left - margin.right,
    height = $(window).height() - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dom = [d3.min([d3.min(f, function (d) { return d.f1; }), d3.min(f, function (d) { return d.f2; })]),
	       d3.max([d3.max(f, function (d) { return d.f1; }), d3.max(f, function (d) { return d.f2; })]) ];
    var x = d3.scale.log()
        .range([1, width])
        .domain(dom);
    var y = d3.scale.log()
        .range([height, 1])
        .domain(dom)
        .nice();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(20);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(20);

    var line = d3.svg.line()
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
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(x_axis_label);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(y_axis_label)

    svg.append("g")
        .attr("class", "points")
        .selectAll("path")
        .data(f)
        .enter()
        .append("path")
        .attr("d", d3.svg.symbol().type('circle').size(8))
	.style("fill", function(d) {
	    if (/.*/g.exec(d.name)) {
		return 'red';
	    } else {
		return 'none';
	    }
	})
        .attr("transform", function (d) {
	    if (!d.hasOwnProperty('f1')) {
		d.f1 = 0;
	    }
	    if (!d.hasOwnProperty('f2')) {
		d.f2 = 0;
	    }
            return "translate(" + x(d.f1) + "," + y(d.f2) + ")";
        })
	.append("title")
	.text(function(d) { return d.name; });

    svg.append("g")
	.attr("class", "trendline")
	.append("path")
	.attr("d", line([[x(dom[0]), y(dom[0])], [x(dom[1]), y(dom[1])]]));
}
