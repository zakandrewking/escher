// data.json:
// [
//     {name:, f1_min:, f1_max:, f2_min:, f2_max},
//     ...
// ]

var default_filename = '10x-100x-min-max.json';
var x_axis_label = '10x',
y_axis_label = '100x';

// setup dropdown menu
$.ajax({
    dataType: "json",
    url: 'http://zak.ucsd.edu/git/scatter-trajectory/getdatafiles',
    success:function(json){
	$('#dropdown-menu').change( function() {
	    console.log('value: ' + $(this).val());
	    load_datafile($(this).val());
	});
	update_dropdown(json.data)
	d3.json(default_filename, function(error, data) {
	    if (error) return console.warn(error);
	    setup_plot(data);
	});
    },
    error:function(error) { console.log(error); }
});

// functions
function load_datafile(this_file) {
    d3.json(this_file, function(error, data) {
	if (error) {
	    return console.warn(error);
	    $('body').append('error loading');
	} else {
	    $('svg').remove();
	    setup_plot(data);
	}
    });
}

function update_dropdown(list) {
    var menu = $('#dropdown-menu');
    menu.empty();
    for (var i=0; i<list.length; i++) {
	menu.append("<option value="+list[i]+">"+list[i]+"</option>");
    }
    menu.focus();
}

function setup_plot(f) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    s = Math.min($(window).width(), $(window).height());
    width = s - margin.left - margin.right,
    height = s - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dom = [d3.min([d3.min(f, function (d) { return d.f1_min; }), d3.min(f, function (d) { return d.f2_min; })]),
               d3.max([d3.max(f, function (d) { return d.f1_max; }), d3.max(f, function (d) { return d.f2_max; })]) ];
    console.log(dom);
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
        .attr("d", function (d) {
            if (!d.hasOwnProperty('f1_min')) {
                d.f1_min = dom[0];
            }
            if (!d.hasOwnProperty('f2_min')) {
                d.f2_min = dom[0];
            }
            if (!d.hasOwnProperty('f1_max')) {
                d.f1_max = dom[1];
            }
            if (!d.hasOwnProperty('f2_max')) {
                d.f2_max = dom[1];
            }
            return line([[x(d.f1_min), y(d.f2_min)], [x(d.f1_max), y(d.f2_max)]]);
        })
        .style("stroke", function(d) {
            if (/transcription/g.exec(d.name)) {
                return 'rgba(0,0,0,0.4)';
            } else {
                return 'none';
            }
        })
        .append("title")
        .text(function(d) { return d.name; });

    svg.append("g")
        .attr("class", "trendline")
        .append("path")
        .attr("d", line([[x(dom[0]), y(dom[0])], [x(dom[1]), y(dom[1])]]));
}
