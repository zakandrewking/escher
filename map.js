function load() {


    // import json
    d3.json("map.json", function(error, json) {
        // console.log(error)
        if (error) return console.warn(error);
        var map_data = json;

        d3.json("flux-wt-pFBA.json", function(error, json) {
            var flux;
            if (error) flux = false;
            else flux = json;
            visualizeit(map_data, flux);
        });
    });

}

function visualizeit(data, flux) {

    var path_color = "rgb(0, 0, 60)"

    var decimal_format = d3.format('.1f');
    var decimal_format_3 = d3.format('.3f');
    var has_flux = false;
    if (flux) {
	has_flux = true;
        data.reaction_paths = data.reaction_paths.map( function(o) {
            // console.log(d3.keys(flux));
            if (o.id in flux) {
                o.flux = parseFloat(flux[o.id]);
            }
			else { console.log(o.id) }
            return o;
        });
        data.reaction_labels = data.reaction_labels.map( function(o) {
            if (o.text in flux) {
                // TODO: make sure text==id
                o.flux = parseFloat(flux[o.text]);
            }
			else { console.log(o.text) }
            return o;
        });
    }

    var map_w = data.max_map_w, map_h = data.max_map_h;
    var width = $(window).width()-20;
    var height = $(window).height()-20;
    factor = Math.min(width/map_w,height/map_h);
	console.log('map_w '+decimal_format(map_w));
	console.log('map_h '+decimal_format(map_h));
	console.log('scale factor '+decimal_format_3(factor));

    var x_scale = d3.scale.linear()
        .domain([0, map_w])
        .range([(width - map_w*factor)/2, map_w*factor + (width - map_w*factor)/2]);
    var y_scale = d3.scale.linear()
        .domain([0, map_h])
        .range([(height - map_h*factor)/2, map_h*factor + (height - map_h*factor)/2]);
    var x_size_scale = d3.scale.linear()
        .domain([0, map_w])
        .range([0, map_w*factor]);
    var y_size_scale = d3.scale.linear()
        .domain([0, map_h])
        .range([0, map_h*factor]);
    var scale = d3.scale.linear()
        .domain([0, 1])
        .range([0, factor]);
    var flux_scale = d3.scale.linear()
        .domain([0, 100])
        .range([1, 2]);
    var flux_color = d3.scale.category10()
        .domain([0, 100]);
    
    d3.select("#svg-container").remove();

    var svg = d3.select("body").append("div").attr("id","svg-container")
        .attr("style", "width:"+width+"px;height:"+height+"px;margin:0px auto")// ;border:3px solid black;")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .call(d3.behavior.zoom().scaleExtent([1, 15]).on("zoom", zoom))
        .append("g");

    svg.append("style")
        .text("#reaction-labels{ font-family: sans-serif; font-style: italic; font-weight: bold; fill: rgb(32, 32, 120); text-rendering: optimizelegibility;} #metabolite-labels{ font-family: sans-serif; font-style: italic; font-weight: bold;} #misc-labels{ font-family: sans-serif; font-weight: bold; fill: rgb(32, 32, 120); text-rendering: optimizelegibility;} #membranes{ fill: none; stroke: orange;  stroke-linejoin: miter; stroke-miterlimit: 10;  stroke-width: 3;} .end{marker-end: url(#Triangle);} .start{marker-start: url(#triangle);");

    svg.append("marker")
        .attr("id", "Triangle")
        .attr("markerHeight", 2.1)
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", 2.1)
        .attr("orient", "auto")
        .attr("refX", 0)
        .attr("refY", 6)
        .attr("viewBox", "0 0 12 12")
        .append("path")
        .attr("d", "M 0 0 L 12 6 L 0 12 z");
    // .attr("fill", path_color) 
	// stroke inheritance not supported in SVG 1.*
    // .attr("stroke", path_color);

    svg.append("marker")
        .attr("id", "triangle")
        .attr("markerHeight", 2.0)
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", 2.0)
        .attr("orient", "auto")
        .attr("refX", 12)
        .attr("refY", 6)
        .attr("viewBox", "0 0 12 12")
        .append("path")
        .attr("d", "M 12 0 L 0 6 L 12 12 z")
        .attr("fill", path_color)
        .attr("stroke", path_color);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "stroke:black");

    svg.append("g")
        .attr("id", "membranes")
        .selectAll("rect")
        .data(data.membrane_rectangles)
        .enter().append("rect")
        .attr("width", function(d){ return x_size_scale(d.width) })
        .attr("height", function(d){ return y_size_scale(d.height) })
        .attr("transform", function(d){return "translate("+x_scale(d.x)+","+y_scale(d.y)+")";});

	if (data.hasOwnProperty("metabolite_circles")) {
		console.log('metabolite circles');
		svg.append("g")
			.attr("id", "metabolite-circles")
			.selectAll("circle")
			.data(data.metabolite_circles)
			.enter().append("circle")
			.attr("r", function (d) { return scale(d.r); })
			.attr("transform", function(d){return "translate("+x_scale(d.cx)+","+y_scale(d.cy)+")";});
	}
	else if (data.hasOwnProperty("metabolite_paths")) {
		console.log('metabolite paths');
		svg.append("g")
			.attr("id", "metabolite-paths")
			.selectAll("path")
			.data(data.metabolite_paths)
			.enter().append("path")
			.attr("d", function(d) { return scale_path(d.d, x_scale, y_scale); })
	}
	else { console.log('neither') }

    svg.append("g")
		.attr("id", "reaction-paths")
		.selectAll("path")
        .data(data.reaction_paths)
        .enter().append("path")
        .attr("d", function(d) { return scale_path(d.d, x_scale, y_scale); })
        .attr("class", function(d) {return d.class})
        .attr("style", function(d) {
            var s = "fill:none;";
            if (d.flux) {
                // simpheny adds super thick lines with paths. how to recreate this?
                // http://lists.w3.org/Archives/Public/public-svg-wg/2011JanMar/0197.html
                // need to generate a new marker for each color
                s += "stroke-width:"+String(flux_scale(d.flux))+";";
                s += "stroke:"+flux_color(d.flux)+";";
            }
	    else if (has_flux) {
                s += "stroke:rgb(190, 190, 190);"; 
	    }
            else {
                s += "stroke:"+path_color+";";
            }
            return s;
        });

    svg.append("g")
        .attr("id", "reaction-labels")
        .selectAll("text")
        .data(data.reaction_labels)
        .enter().append("text")
        .text(function(d) {
            t = d.text;
            if (d.flux) t += " ("+decimal_format(d.flux)+")";
	    else if (has_flux) t += " (0)";
            return t;
        })
        .attr("text-anchor", "start")
        .attr("font-size", scale(40))
        .attr("transform", function(d){return "translate("+x_scale(d.x)+","+y_scale(d.y)+")";});

    svg.append("g")
        .attr("id", "misc-labels")
        .selectAll("text")
        .data(data.misc_labels)
        .enter().append("text")
        .text(function(d) { return d.text; })
        .attr("font-size", scale(80))
        .attr("transform", function(d){return "translate("+x_scale(d.x)+","+y_scale(d.y)+")";});

    svg.append("g")
        .attr("id", "metabolite-labels")
        .selectAll("text")
        .data(data.metabolite_labels)
        .enter().append("text")
        .text(function(d) { return d.text; })
        .attr("font-size", scale(30))
        .attr("transform", function(d){return "translate("+x_scale(d.x)+","+y_scale(d.y)+")";});

    function scale_decimals(path, scale_fn, precision) {
        var str = d3.format("."+String(precision)+"f")
        path = path.replace(/([0-9.]+)/g, function (match, p1) {
            return str(scale_fn(parseFloat(p1)));
        });
        return path
    }
    function scale_path(path, x_fn, y_fn) {
		// TODO: scale arrow width
        var str = d3.format(".2f")
        path = path.replace(/(M|L)([0-9.]+),?\s*([0-9.]+)/g, function (match, p0, p1, p2) {
            return p0 + [str(x_fn(parseFloat(p1))), str(y_fn(parseFloat(p2)))].join(', ');
        });
        path = path.replace(/C([0-9.]+),?\s*([0-9.]+)\s*([0-9.]+),?\s*([0-9.]+)\s*([0-9.]+),?\s*([0-9.]+)/g, function (match, p1, p2, p3, p4, p5, p6) {
            return 'C'+str(x_fn(parseFloat(p1)))+','+str(y_fn(parseFloat(p2)))+' '+str(x_fn(parseFloat(p3)))+','+str(y_fn(parseFloat(p4)))+' '+ [str(x_fn(parseFloat(p5)))+','+str(y_fn(parseFloat(p6)))];
        });
        return path
    }

    function zoom() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
}
