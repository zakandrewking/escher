// data.json:
// [
//     {name:, f1:, f2:},
//     ...
// ]

var default_filename = 'median-translation-wt-alanine.json';
var x_axis_label = '10x',
y_axis_label = '100x';

// setup dropdown menu
$.ajax({
    dataType: "json",
    url: 'http://zak.ucsd.edu/git/visbio/vis/scatter/getdatafiles',
    success:function(json){
        $('#dropdown-menu').change( function() {
            console.log('value: ' + $(this).val());
            load_datafile($(this).val());
        });
        update_dropdown(json.data);
	var file;
	if (json.data.indexOf(default_filename) > -1) {
	    file = default_filename;
	} else {
	    file = json.data[0];
	}
        d3.json(file, function(error, data) {
            if (error) return console.warn(error);
            setup_plot(data);
	    // TODO focus menu on correct entry
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

    d3.selectAll('svg').remove();

    // set zero values to min
    var f1nz = f.map(function (d) { // f1 not zero
	if (d.f1>0) { return d.f1; }
	else { return null; }
    });
    var f2nz = f.map(function (d) { // f2 not zero
	if (d.f2>0) { return d.f2; }
	else { return null; }
    });
    var dom = [d3.min([d3.min(f1nz), d3.min(f2nz)]) / 2,
	       d3.max([d3.max(f1nz), d3.max(f2nz)])];
    console.log(dom)
    f = f.map(function (d) { 
	if (d.f1 < dom[0]) { d.f1 = dom[0];  }
	if (d.f2 < dom[0]) { d.f2 = dom[0];  }
	return d;
    });

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = $(window).width() - 30 - margin.left - margin.right,
    height = $(window).height() - 30 - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom) 
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
    var x = d3.scale.log()
        .range([1, width])
        .domain(dom);
    var y = d3.scale.log()
        .range([height, 1])
        .domain(dom);

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
	.attr('class', 'point-circle')
	.style("fill", function(d) {
	    if (/.*/g.exec(d.name)) {
		return 'red';
	    } else {
		return 'none';
	    }
	})
        .attr("transform", function (d) {
            return "translate(" + x(d.f1) + "," + y(d.f2) + ")";
        })
	.append("title")
	.text(function(d) { return d.name; });

    svg.append("g")
	.attr("class", "trendline")
	.append("path")
	.attr("d", line([[x(dom[0]), y(dom[0])], [x(dom[1]), y(dom[1])]]));

    var save_key = 83;
    if (true) cursor_tooltip(svg, width+margin.left+margin.right,
			     height+margin.top+margin.bottom, x, y,
			     save_key);
}
