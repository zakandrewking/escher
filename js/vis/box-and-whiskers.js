// data.json:
// fluxes: [
//      {name:, rank:, min:, Q1:, median:, Q3:, max:},
//     ...
//     ]

var filename = 'data/quartiles/data1.json';
var filename2 = 'data/quartiles/data2.json';

d3.json(filename, function(error, data) {
    if (error) return console.warn(error);
    d3.json(filename2, function(error, data2) {
	if (error) return console.warn(error);
	load(data, data2);
    });
});

function load(f, f2) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    // width = f.length;
    width = $(window).width() - 20 - margin.left - margin.right,
    height = $(window).height() - 20 - margin.top - margin.bottom,
    m_l = 1
    sep = height/4;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
        .range([0, width])
	// .domain([0, width]);
        .domain([0, d3.max(f, function (d) { return d.rank; })]);

    var y = d3.scale.log()
        .range([height-sep, 1])
        .domain([d3.min(f, function (d) { return d.min; }), 
		 d3.max(f, function (d) { return d.max; }) ])
	.nice();

    var y_2 = d3.scale.log()
        .range([height, sep+1])
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

    var g = svg.append("g")
	.attr("class", "legend")
	.attr("transform", "translate(200, 80)")
	.attr("width", "300px")
	.attr("height", "200px");

    add_legend(g, '10x', 'blue', 0);
    add_legend(g, '100x', 'red', 1); 
    function add_legend(a, t, color, i) {
	var g = a.append("g")
	    .attr("transform", "translate(0,"+i*40+")");
	g.append("text")
	    .text(t)
	    .attr("transform", "translate(30, 7)");
	g.append("circle")
	    .attr("r", 10)
	    .attr("style", "fill:"+color);
    }
    var g2 = g.append("g")
	.attr("transform", "translate(0,80)");
    g2.append("path")
	.attr("class", "min-max-2")
	.attr("d", function (d) {
	    return line([[0,0], [200, 0]]);
	})
	.style("stroke-width", "2px");
    g2.append("path")
	.attr("class", "Q1-Q3-2")
	.attr("d", function (d) {
	    return line([[60,0], [140, 0]]);
	})
	.style("stroke-width", "2px");
    g2.append("path")
	.attr("class", "median-2")
	.attr("d", function (d) {
	    return line([[90,0], [95, 0]]);
	})
	.style("stroke-width", "2px");
    g2.append("text")
	.text("min")
	.attr("transform", "translate(-10,20)");
    g2.append("text")
	.text("Q1")
	.attr("transform", "translate(50,20)");
    g2.append("text")
	.text("med")
	.attr("transform", "translate(83,20)");
    g2.append("text")
	.text("Q3")
	.attr("transform", "translate(130,20)");
    g2.append("text")
	.text("max")
	.attr("transform", "translate(190,20)");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("flux variables");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("flux")

    svg.append('g')
        .selectAll("path")
        .data(f)
        .enter()
        .append("path")
        .attr("class", "min-max")
        .attr("d", function(d) {
            return line([[x(d.rank), y(d.min)], [x(d.rank), y(d.max)]]);
        });

    // Q1 to Q3
    svg.append('g')
        .selectAll("path")
        .data(f)
        .enter()
        .append("path")
        .attr("class", "Q1-Q3")
        .attr("d", function (d) {
            return line([[x(d.rank), y(d.Q1)], [x(d.rank), y(d.Q3)]]);
        });

    svg.append('g')
        .selectAll("path")
        .data(f)
        .enter()
        .append("path")
        .attr("class", "median")
        .attr("d", function (d) {
            return line([[x(d.rank), y(d.median)-m_l], [x(d.rank), y(d.median)+m_l]]);
        });

    svg.append('g')
        .selectAll("path")
        .data(f2)
        .enter()
        .append("path")
        .attr("class", "min-max-2")
        .attr("d", function(d) {
            return line([[x(d.rank), y_2(d.min)], [x(d.rank), y_2(d.max)]]);
        });

    // Q1 to Q3
    svg.append('g')
        .selectAll("path")
        .data(f2)
        .enter()
        .append("path")
        .attr("class", "Q1-Q3-2")
        .attr("d", function (d) {
            return line([[x(d.rank), y_2(d.Q1)], [x(d.rank), y_2(d.Q3)]]);
        });

    svg.append('g')
        .selectAll("path")
        .data(f2)
        .enter()
        .append("path")
        .attr("class", "median-2")
        .attr("d", function (d) {
            return line([[x(d.rank), y_2(d.median)-m_l], [x(d.rank), y_2(d.median)+m_l]]);
        });
}
