// data.json:
// [
//     {name:, f1:, f2:},
//     ...
// ]

var Scatter = function() {
    var setup = function(options) {
	if (typeof variable === 'undefined') options = {};
        var selection = options.selection || d3.select('body'),
	margins = options.margins  || {top: 20, right: 20, bottom: 30, left: 50},
        default_filename = 'median-translation-wt-alanine.json',
        x_axis_label = '10x',
        y_axis_label = '100x';

        // setup dropdown menu
        d3.json('http://zak.ucsd.edu/visbio/getdatafiles', function(error, json) {
            if (error) return console.warn(error);

	    var txt = document.createTextNode(" This text was added to the DIV.");
	    var menu = selection.append('div').attr('id','menu');
	    menu.append('form')
		.append('select').attr('id','dropdown-menu');
	    menu.append('div').style('width','100%').text("Press 's' to freeze tooltip");

	    //when it changes
	    document.getElementById("dropdown-menu").addEventListener("change", function() {
		// onchange = function(event) {
                console.log('value: ' + this.val());
                load_datafile(this.val());
            }, false);

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
        });

        // functions
        function load_datafile(this_file) {
            d3.json(this_file, function(error, data) {
                if (error) {
                    return console.warn(error);
                    selection.append('error loading');
                } else {
                    // $('svg').remove();
                    setup_plot(data);
                }
            });
        }

        function update_dropdown(list) {
            var menu = d3.select('#dropdown-menu');
            menu.empty();
	    menu.selectAll(".menu-option")
		.data(list)
		.enter()
		.append('option')
		.attr('value', function (d) { return d; } )
		.text(function (d) { return d; } );
            menu.node().focus();
        }

        function setup_plot(f) {

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

            var width = parseFloat(selection.style('width')) - margins.left - margins.right,
            height = parseFloat(selection.style('height')) - margins.top - margins.bottom;

            var svg = selection.append("svg")
                .attr("width", width + margins.left + margins.right)
                .attr("height", height + margins.top + margins.bottom)
                .append("g")
                .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

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
            if (false) cursor_tooltip(svg, width+margins.left+margins.right,
                                     height+margins.top+margins.bottom, x, y,
                                     save_key);
        }

        return this;
    };

    return {
        setup: setup
    };
};
