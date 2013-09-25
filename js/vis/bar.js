var Bar = function() {
    var s = {};

    s.height_width = function(fillScreen, sel, margins) {
        if (fillScreen==true) {
            sel.style('height', (window.innerHeight-margins.bottom)+'px');
            sel.style('width', (window.innerWidth-margins.right)+'px');
        }

        var width = parseFloat(s.selection.style('width')) - margins.left - margins.right,
            height = parseFloat(s.selection.style('height')) - margins.top - margins.bottom;

        return {'width': width, 'height': height};
    };

    // s.update_size = function () {
    //     // TODO inherit this function
    //     var o = s.height_width(s.fillScreen, s.selection, s.margins);
    //     var height = o.height, width = o.width;

    //     var ns = s.selection.select("svg")
    //             .attr("width", width + s.margins.left + s.margins.right)
    //             .attr("height", height + s.margins.top + s.margins.bottom);
    //     ns.select('g').attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")");

    //     s.x.range([0, width]);
    //     s.y.range([height, 0]);

    //     s.xAxis.scale(s.x);
    //     s.yAxis.scale(s.y);

    //     s.selection.select('.x.hist-axis')
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(s.xAxis)
    //         .select('text')
    //         .attr("x", width);
    //     s.selection.select('.y.hist-axis')
    //         .call(s.yAxis);

    //     var bar_w = s.x(1) - s.diff - 8;

    //     for (var i=0; i<s.json.length; i++) {
    //         s.selection.selectAll(".bar.bar"+String(i))
    //             .attr("transform", function(d) {
    //                 return "translate(" + (s.x(d.x) + s.x_shift*i) + "," + s.y(d.y) + ")";
    //             })
    //             .select('rect')
    //             .attr("width", bar_w)
    //             .attr("height", function(d) { return height - s.y(d.y); });
    //     }

    //     d3.select(".legend")	//TODO options for legend location
    //         .attr("transform", "translate(" + (width-300) + ", 80)");

    //     return this;
    // };

    s.update = function(json) {
	// check data
	var i=-1;
	while(++i < json.length) {
	    if (json[i]===undefined) {
		console.log('waiting for all indices');
		return;
	    }
	}

        var o = s.height_width(s.fillScreen, s.selection, s.margins);
        var height = o.height, width = o.width;

        s.selection.select('svg').remove();

        var svg0 = s.selection.append("svg")
                .attr("width", width + s.margins.left + s.margins.right)
                .attr("height", height + s.margins.top + s.margins.bottom)		
		.attr('xmlns', "http://www.w3.org/2000/svg");
        svg0.append("style")
	    .attr('type', "text/css")
            .text(s.css);
	var svg = svg0.append("g")
                .attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")");

        // find x domain
        var x_dom = [0, d3.max(json, function(a) { return a.data.length; })],
	    y_dom = [
		d3.min(json, function(a) {
                    return d3.min(a.data, function(d) { return d[1]; });
		}),
		d3.max(json, function(a) {
                    return d3.max(a.data, function(d) { return d[1]; });
		})
            ];
	
        s.dom = {'y': y_dom,
		 'x': x_dom};

        s.x = d3.scale.linear()
            .range([0, width])
            .domain(x_dom);
        s.y = d3.scale.linear()
            .range([height, 0])
            .domain(s.dom.y);

        s.xAxis = d3.svg.axis()
            .scale(s.x)
            .orient("bottom")
	    .ticks(0);
        s.yAxis = d3.svg.axis()
            .scale(s.y)
            .orient("left");

        var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (width-300) + ", 80)")
                .attr("width", "300px")
                .attr("height", "200px");

        var diff = 2,
            bar_w = s.x(2) - s.x(1) - diff;

        for (var j = 0; j < json.length; j++) {
            var cl = 'bar'+String(j);
            var bars = svg.selectAll("."+cl)
                    .data(json[j].data)
                    .enter().append("g")
                    .attr("class", "bar "+cl)
                    .attr("transform", function(d, i) { return "translate(" + (s.x(i) + s.x_shift*j) + "," + s.y(d[1]) + ")"; });
            bars.append("rect")
                .attr("x", 1)
                .attr("width", bar_w)
                .attr("height", function(d) { return height - s.y(d[1]); });
	    if (json[j].hasOwnProperty('options')) add_legend(legend, json[j].options.name, j, 'legend '+cl);
        }

        svg.append("g")
            .attr("class", "x bar-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(s.xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(s.x_axis_label);

        svg.append("g")
            .attr("class", "y bar-axis")
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
	s.x_shift = options.x_shift || 4;
	s.data_is_object = true;
	if (options.css_path) {
	    s.ready = false;
            d3.text(options.css_path, function(error, text) {
                if (error) {
		    console.warn(error);
		    s.css = "";
		} else {
                    s.css = text;
		}
		s.ready = true;
		return null;
	    });
	} else {
	    s.ready = true;
	    s.css = "";
	};
        s.json = [];
        return this;
    };

    s.collect_data = function(json, layer) {
	if (!s.ready) console.warn('Hasn\'t loaded css yet');
	if (s.data_is_object) {
	    var tuples = [];
	    for (var key in json) tuples.push([key, json[key]]);
	    s.json[layer] = {data: tuples.slice(0,50)};
	} else {
            s.json[layer] = {data: json};
	}
        s.update(s.json);
    };

    return {
        setup: s.setup,
        update: s.update,
        // update_size: s.update_size,
        collect_data: s.collect_data
    };
};
