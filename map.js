function load() {


    // import json
    d3.json("map.json", function(error, json) {
        // console.log(error)
        if (error) return console.warn(error);
        var map_data = json;

        d3.json("flux-succ-optSwap-pFBA.json", function(error, json) {
            var flux;
            if (error) flux = false;
            else flux = json;

            d3.json("none", function(error, json) {
		var flux2;
		if (error) flux2 = false;
		else flux2 = json;
		visualizeit(map_data, flux, flux2);
            });
	});
    }); 
}

function visualizeit(data, flux, flux2) {

    var path_color = "rgb(0, 0, 60)"

    var decimal_format = d3.format('.1f');
    var decimal_format_3 = d3.format('.3f');
    var has_flux = false;
    var has_flux_comparison = false;
    if (flux) {
	has_flux = true;
        data.reaction_paths = data.reaction_paths.map( function(o) {
            // console.log(d3.keys(flux));
            if (o.id in flux) {
                o.flux = parseFloat(flux[o.id]);
            }
			// else { console.log(o.id) }
            return o;
        });
        data.reaction_labels = data.reaction_labels.map( function(o) {
            if (o.text in flux) {
                // TODO: make sure text==id
                o.flux = parseFloat(flux[o.text]);
            }
            return o;
        });
	if (flux2) {
	    has_flux_comparison = true;
            data.reaction_paths = data.reaction_paths.map( function(o) {
		if (o.id in flux2 && o.flux) {
                    o.flux = (parseFloat(flux2[o.id]) - o.flux);
		}
		return o;
            });
            data.reaction_labels = data.reaction_labels.map( function(o) {
		if (o.flux) o.flux1 = o.flux;
		else o.flux1 = 0;
		if (o.text in flux2) o.flux2 = parseFloat(flux2[o.text]);
		else o.flux2 = 0; 
                o.flux = (o.flux2 - o.flux1);
		return o;
            });
	}
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
        .domain([0, 40])
        .range([6, 12]);
    var flux_scale_fill = d3.scale.linear()
        .domain([0, 40])
        .range([1, 8]);
    var flux_color = d3.scale.linear()
        .domain([0, 70])
	.range(["#ccc", "red"]);
    
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
        .text("#reaction-labels{ font-family: sans-serif; font-style: italic; font-weight: bold; fill: rgb(32, 32, 120); text-rendering: optimizelegibility;} #metabolite-labels{ font-family: sans-serif; font-style: italic; font-weight: bold;} #misc-labels{ font-family: sans-serif; font-weight: bold; fill: rgb(32, 32, 120); text-rendering: optimizelegibility;} #metabolite-circles {fill: gray} #membranes{ fill: none; stroke: orange;  stroke-linejoin: miter; stroke-miterlimit: 10;} .end{marker-end: url(#Triangle);} .start{marker-start: url(#triangle);");

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
        .attr("transform", function(d){return "translate("+x_scale(d.x)+","+y_scale(d.y)+")";})
		.attr("style", function(d) { return "stroke-width: "+scale(8)+";" });

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
            var s = "", sc = flux_scale;
	    if (d.class=="fill-arrow") sc = flux_scale_fill;
            if (d.flux) {
                s += "stroke-width:"+String(scale(sc(Math.abs(d.flux))))+";";
                s += "stroke:"+flux_color(Math.abs(d.flux))+";";
		if (d.class=="fill-arrow") s += "fill:"+flux_color(Math.abs(d.flux))+";";
		else s += "fill:none";
            }
	    else if (has_flux) {
		s += "stroke-width:"+String(scale(sc(0)))+";";
                s += "stroke:"+flux_color(Math.abs(0))+";";
                if (d.class=="fill-arrow") s += "fill:"+flux_color(Math.abs(0))+";";
		else s += "fill:none";
	    }
            else {
		s += "stroke-width:"+String(scale(sc(0)))+";";
                s += "stroke:"+path_color+";";
                if (d.class=="fill-arrow") s += "fill:"+path_color+";";
		else s += "fill:none";
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
	    if (has_flux_comparison)
		t += " ("+decimal_format(d.flux1)+"/"+decimal_format(d.flux2)+": "+decimal_format(d.flux)+")"; 
            else if (d.flux) t += " ("+decimal_format(d.flux)+")";
	    else if (has_flux) t += " (0)";
            return t;
        })
        .attr("text-anchor", "start")
        .attr("font-size", scale(20))
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
        .attr("font-size", scale(15))
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
        path = path.replace(/(M|L)([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p0, p1, p2) {
            return p0 + [str(x_fn(parseFloat(p1))), str(y_fn(parseFloat(p2)))].join(', ');
        });
        path = path.replace(/C([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p1, p2, p3, p4, p5, p6) {
            return 'C'+str(x_fn(parseFloat(p1)))+','+str(y_fn(parseFloat(p2)))+' '+str(x_fn(parseFloat(p3)))+','+str(y_fn(parseFloat(p4)))+' '+ [str(x_fn(parseFloat(p5)))+','+str(y_fn(parseFloat(p6)))];
        });
        return path
    }

    function zoom() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
}
