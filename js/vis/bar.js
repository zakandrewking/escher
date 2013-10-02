var Bar = function() {
    var s = {};

    s.height_width = function(fillScreen, sel, margins) {
        if (fillScreen==true) {
            sel.style('height', (window.innerHeight-margins.bottom)+'px');
            sel.style('width', (window.innerWidth-margins.right)+'px');
        }
        var width = parseFloat(sel.style('width')) - margins.left - margins.right,
            height = parseFloat(sel.style('height')) - margins.top - margins.bottom;
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
		return this;
	    } 
	}

	// clear the container and add again
        s.sub_selection.select("#bar-container").remove();
        var container = s.sub_selection.append("g").attr("id","bar-container");
	container.append("style")
	    .attr('type', "text/css")
	    .text(s.css);
	var svg = container.append("g")
                .attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")");

	// var o = s.height_width(s.fillScreen, s.sub_selection, s.margins),
	var height = s.height,
	    width = s.width;

        // find x domain
        var x_dom = [0, d3.max(json, function(a) { return a.data.length; })],
	    y_dom;
	if (s.y_range) { 
	    y_dom = s.y_range; 
	} else {
	    y_dom = [
		d3.min(json, function(a) {
                    return d3.min(a.data, function(d) { return d.value; });
		}),
		d3.max(json, function(a) {
                    return d3.max(a.data, function(d) { return d.value; });
		})
            ];
	}
	
        s.dom = {'y': y_dom,
		 'x': x_dom};

        s.x = d3.scale.linear()
            .range([0, width])
            .domain(x_dom).nice();
        s.y = d3.scale.linear()
            .range([height, 0])
            .domain(s.dom.y).nice();

        s.xAxis = d3.svg.axis()
            .scale(s.x)
            .orient("bottom")
	    .ticks(0);
        s.yAxis = d3.svg.axis()
            .scale(s.y)
            .orient("left")
	    .tickFormat(d3.format(".1f"))
	    .ticks(5);

        var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (width-300) + ", 80)")
                .attr("width", "300px")
                .attr("height", "200px");

        var diff = 0,
            bar_w = s.x(2) - s.x(1) - diff;

        for (var j = 0; j < json.length; j++) {
            var cl = 'bar'+String(j);
            var bars = svg.selectAll("."+cl)
                    .data(json[j].data)
                    .enter().append("g")
                    .attr("class", "bar "+cl)
                    .attr("transform", function(d, i) { return "translate(" + (s.x(i) + s.x_shift*j) + "," + s.y(d.value) + ")";  });
            bars.append("rect")
                .attr("x", 1)
                .attr("width", bar_w)
                .attr("height", function(d) { return height - s.y(d.value); })
		.style("fill", function(d) { if (s.color_scale) return s.color_scale(d.category);
					     else return null; });
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

	if (s.title) {
	    svg.append('text')
		.text(s.title)
		.attr("transform", "translate("+width/2+",0)")
		.attr("text-anchor", "middle");
	}

        return this;
    };

    s.setup = function (options) {
	// set defaults
	s.margins = {top: 10, right: 10, bottom: 10, left: 20};
        s.fillScreen = false;
        s.x_axis_label = "";
        s.y_axis_label = "";
        s.x_data_label = '1',
        s.y_data_label = '2';
	s.x_shift = 4;
	s.data_is_object = true;
	s.color_scale = false;
	s.y_range = false;
	s.title = false;

	// manage options
        if (typeof options !== undefined) {
	    if (options.margins !== undefined)        s.margins = options.margins;
	    if (options.fillScreen !== undefined)     s.fillScreen = options.fillScreen;
	    if (options.x_axis_label !== undefined)   s.x_axis_label = options.x_axis_label;
	    if (options.y_axis_label !== undefined)   s.y_axis_label = options.y_axis_label;
	    if (options.y_data_label !== undefined)   s.y_data_label = options.y_data_label;
	    if (options.x_shift !== undefined)        s.x_shift = options.x_shift;
	    if (options.data_is_object !== undefined) s.data_is_object = options.data_is_object;
	    if (options.color_scale !== undefined)    s.color_scale = options.color_scale;
	    if (options.y_range !== undefined)        s.y_range = options.y_range;
	    if (options.title !== undefined)          s.title = options.title;
	}

	// set selection
	// sub selection places the graph in an existing svg environment
	var add_svg = function(s, fillScreen, margins) {
	    var o = s.height_width(fillScreen, s, margins);
	    return s.append('svg')
                .attr("width", o.width + margins.left + margins.right)
                .attr("height", o.height + margins.top + margins.bottom)	
		.attr('xmlns', "http://www.w3.org/2000/svg");
	};
	if (options.sub_selection) {
	    s.sub_selection = options.sub_selection;
	    s.width = parseInt(s.sub_selection.attr("width"), 10) - s.margins.top - s.margins.bottom;
	    s.height = parseInt(s.sub_selection.attr("height"), 10) - s.margins.left - s.margins.right;
	} else if (options.selection) {
	    s.sub_selection = add_svg(options.selection, s.fillScreen, s.margins);
	} else {
	    s.sub_selection = add_svg(d3.select('body').append('div'), s.fillScreen,
				      s.margins);
	}

	// load the css
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
