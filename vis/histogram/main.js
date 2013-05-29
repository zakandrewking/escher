// data.json:
// 
// {data: [
//      [{name:, x:}, {name:, x:} ...]
//      [{name:, x:}, {name:, x:} ...]
//  ], 
//  options: {
//      x_axis_label: ,
//      y_axis_label: ,
//      x_data_label: ,
//      y_data_label: ,
//  }
// }

var default_filename = 0,
def_x_axis_label = 'x',
def_y_axis_label = 'count',
def_x_data_label = '1',
def_y_data_label = '2';

// setup dropdown menu
$.ajax({
    dataType: "json",
    url: 'getdatafiles',
    success:function(json){
        $('#dropdown-menu').change( function() {
            console.log('value: ' + $(this).val());
            load_datafile($(this).val());
        });
        update_dropdown(json.data)
        d3.json(json.data[default_filename], function(error, data) {
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

function setup_plot(json) {
    f1 = json.data[0];
    f2 = json.data[1];
    o = json.options;
    x_axis_label = o.hasOwnProperty('x_axis_label') ? o.x_axis_label : def_x_axis_label;
    y_axis_label = o.hasOwnProperty('y_axis_label') ? o.y_axis_label : def_y_axis_label;
    x_data_label = o.hasOwnProperty('x_data_label') ? o.x_data_label : def_x_data_label;
    y_data_label = o.hasOwnProperty('y_data_label') ? o.y_data_label : def_y_data_label;

    var margin = {top: 30, right: 20, bottom: 30, left: 40},
    width = $(window).width() - 20 - margin.left - margin.right,
    height = $(window).height() - 20 - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var
    var x_dom = [d3.min([d3.min(f1, function (d) { return d.x; }), d3.min(f2, function (d) { return d.x; })]),
             d3.max([d3.max(f1, function (d) { return d.x; }), d3.max(f2, function (d) { return d.x; })]) ];

    // var
    var x = d3.scale.linear()
        .range([0, width])
        .domain(x_dom);

    var x_size_scale = d3.scale.linear()
        .range([0, width])
	.domain([0, x_dom[1] - x_dom[0]]);

    // Generate a histogram using twenty uniformly-spaced bins.

    // var
    data1 = d3.layout.histogram()
        .value(function (d) { return d.x; })
        .bins(x.ticks(20))
    (f1);
    var data2 = d3.layout.histogram()
        .value(function (d) { return d.x; })
        .bins(x.ticks(20))
    (f2); 

    // var
    y = d3.scale.linear()
        .domain([0, d3.max([data1, data2],
                           function (a) {
                               return d3.max(a, function(d) { return d.y; });
                           })
                ])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
	.ticks(20);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(20);

    var diff = 10;
    var bar_w = x_size_scale(data1[0].dx) - diff - 8;

    var bar1 = svg.selectAll(".bar1")
        .data(data1)
        .enter().append("g")
        .attr("class", "bar1")
        .attr("transform", function(d) { return "translate(" + (x(d.x)+4) + "," + y(d.y) + ")"; });

    bar1.append("rect")
        .attr("x", 1)
        .attr("width", bar_w)
        .attr("height", function(d) { return height - y(d.y); });

    var bar2 = svg.selectAll(".bar2")
        .data(data2)
        .enter().append("g")
        .attr("class", "bar2")
        .attr("transform", function(d) { return "translate(" + (x(d.x)+diff+4) + "," + y(d.y) + ")"; });

    bar2.append("rect")
        .attr("x", 1)
        .attr("width", bar_w)
        .attr("height", function(d) { return height - y(d.y); });

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

    var g = svg.append("g")
	.attr("class", "legend")
	.attr("transform", "translate(" + width/10 + ", 80)")
	.attr("width", "300px")
	.attr("height", "200px");

    add_legend(g, x_data_label, 0, 'bar1');
    add_legend(g, y_data_label, 1, 'bar2'); 
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
