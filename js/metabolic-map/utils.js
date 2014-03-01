define(["lib/d3", "vis/scaffold"], function (d3, scaffold) {
    return { setup_defs: setup_defs,
	     draw_an_array: draw_an_array,
	     draw_an_object: draw_an_object,
	     make_array: make_array,
	     clone: clone,
	     extend: extend,
	     unique_concat: unique_concat,
	     c_plus_c: c_plus_c,
	     c_minus_c: c_minus_c,
	     c_times_scalar: c_times_scalar,
	     download_json: download_json,
	     load_json: load_json,
	     define_scales: define_scales,
	     rotate_coords_recursive: rotate_coords_recursive,
	     rotate_coords: rotate_coords,
	     get_angle: get_angle,
	     to_degrees: to_degrees,
	     distance: distance };

    // definitions
    function setup_defs(svg, style) {
        // add stylesheet
        svg.select("defs").remove();
        var defs = svg.append("defs");
        defs.append("style")
            .attr("type", "text/css")
            .text(style);
        return defs;
    }

    function draw_an_array(sel_parent_node, sel_children, array, 
			   create_function, update_function) {
	/** Run through the d3 data binding steps for an array.
	 */
	var sel = d3.select(sel_parent_node)
            .selectAll(sel_children)
            .data(array);
	// enter: generate and place reaction
	sel.enter().call(create_function);
	// update: update when necessary
	sel.call(update_function);
	// exit
	sel.exit().remove();
    }

    function draw_an_object(sel_parent_node, sel_children, object, 
			    id_key, create_function, update_function) {
	/** Run through the d3 data binding steps for an object.
	 */
	var sel = d3.select(sel_parent_node)
            .selectAll(sel_children)
            .data(make_array(object, id_key), function(d) { return d[id_key]; });
	// enter: generate and place reaction
	sel.enter().call(create_function);
	// update: update when necessary
	sel.call(update_function);
	// exit
	sel.exit().remove();
    }

    function make_array(obj, id_key) { // is this super slow?
        var array = [];
        for (var key in obj) {
            // copy object
            var it = clone(obj[key]);
            // add key as 'id'
            it[id_key] = key;
            // add object to array
            array.push(it);
        }
        return array;
    }

    function clone(obj) {
	// Handles the array and object types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;
	// Handle Array
	if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
		copy[i] = clone(obj[i]);
            }
            return copy;
	}
	// Handle Object
	if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function extend(obj1, obj2) {
	/** Extends obj1 with keys/values from obj2.

	 Performs the extension cautiously, and does not override attributes.

	 */
	for (var attrname in obj2) { 
	    if (!(attrname in obj1))
		obj1[attrname] = obj2[attrname];
	    else
		console.error('Attribute ' + attrname + ' already in object.');
	}
    }

    function unique_concat(arrays) {
	var new_array = [];
	arrays.forEach(function (a) {
	    a.forEach(function(x) {
		if (new_array.indexOf(x) < 0)
		    new_array.push(x);
	    });
	});
	return new_array;
    }

    function c_plus_c(coords1, coords2) {
	if (coords1 === null || coords2 === null || 
	    coords1 === undefined || coords2 === undefined)
	    return null;
	return { "x": coords1.x + coords2.x,
		 "y": coords1.y + coords2.y };
    }
    function c_minus_c(coords1, coords2) {
	if (coords1 === null || coords2 === null || 
	    coords1 === undefined || coords2 === undefined)
	    return null;
	return { "x": coords1.x - coords2.x,
		 "y": coords1.y - coords2.y };
    }

    function c_times_scalar(coords, scalar) {
	return { "x": coords.x * scalar,
		 "y": coords.y * scalar };
    }

    function download_json(json, name) {
        var a = document.createElement('a');
        a.download = name+'.json'; // file name
        // xml = (new XMLSerializer()).serializeToString(d3.select(selection).node()); // convert node to xml string;
	var j = JSON.stringify(json);
        a.setAttribute("href-lang", "text/json");
        a.href = 'data:image/svg+xml;base64,' + utf8_to_b64(j); // create data uri
        // <a> constructed, simulate mouse click on it
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(ev);

        function utf8_to_b64(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        }
    }

    function load_json(f, callback) {
	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob))
	    callback("The File APIs are not fully supported in this browser.", null);
	if (!f.type.match("application/json"))
	    callback("Not a json file.", null);

	var reader = new window.FileReader();
	// Closure to capture the file information.
	reader.onload = function(event) {
	    var json = JSON.parse(event.target.result);
	    callback(null, json);
        };
	// Read in the image file as a data URL.
	reader.readAsText(f);
    }

    function define_scales(map_w, map_h, w, h, options) {
	var scale = scaffold.set_options(options, 
					 { flux_color: d3.scale.linear()
					   .domain([0, 0.000001, 1, 8, 50])
					   .range(["rgb(200,200,200)", "rgb(190,190,255)", 
						   "rgb(100,100,255)", "blue", "red"])});

        var factor = Math.min(w/map_w, h/map_h);
        scale.x = d3.scale.linear()
            .domain([0, map_w])
            .range([(w - map_w*factor)/2, map_w*factor + (w - map_w*factor)/2]),
        scale.y = d3.scale.linear()
            .domain([0, map_h])
            .range([(h - map_h*factor)/2, map_h*factor + (h - map_h*factor)/2]),
        scale.x_size = d3.scale.linear()
            .domain([0, map_w])
            .range([0, map_w*factor]),
        scale.y_size = d3.scale.linear()
            .domain([0, map_h])
            .range([0, map_h*factor]),
        scale.size = d3.scale.linear()
            .domain([0, 1])
            .range([0, factor]),
        scale.flux = d3.scale.linear()
            .domain([0, 40])
            .range([6, 6]),
        scale.flux_fill = d3.scale.linear()
            .domain([0, 40, 200])
            .range([1, 1, 1]),
        scale.metabolite_concentration = d3.scale.linear()
            .domain([0, 10])
            .range([15, 200]),
        scale.metabolite_color = d3.scale.linear()
            .domain([0, 1.2])
            .range(["#FEF0D9", "#B30000"]);
        scale.scale_path = function(path) {
            var x_fn = scale.x, y_fn = scale.y;
            // TODO: scale arrow width
            var str = d3.format(".2f"),
                path = path.replace(/(M|L)([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p0, p1, p2) {
                    return p0 + [str(x_fn(parseFloat(p1))), str(y_fn(parseFloat(p2)))].join(', ');
                }),
                reg = /C([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)/g;
            path = path.replace(reg, function (match, p1, p2, p3, p4, p5, p6) {
                return 'C'+str(x_fn(parseFloat(p1)))+','+
                    str(y_fn(parseFloat(p2)))+' '+
                    str(x_fn(parseFloat(p3)))+','+
                    str(y_fn(parseFloat(p4)))+' '+
                    [str(x_fn(parseFloat(p5)))+','+str(y_fn(parseFloat(p6)))];
            });
            return path;
        };
        scale.scale_decimals = function(path, scale_fn, precision) {
            var str = d3.format("."+String(precision)+"f");
            path = path.replace(/([0-9.]+)/g, function (match, p1) {
                return str(scale_fn(parseFloat(p1)));
            });
            return path;
        };
        return scale;
    }

    function rotate_coords_recursive(coords_array, angle, center) {
	var rot = function(c) { return rotate_coords(c, angle, center); };
        return coords_array.map(rot);
    }

    function rotate_coords(c, angle, center) {
	/** Calculates displacement { x: dx, y: dy } based on rotating point c around 
	 center with angle.

	 */
        var dx = Math.cos(-angle) * (c.x - center.x) +
                Math.sin(-angle) * (c.y - center.y)
		+ center.x - c.x,
            dy = - Math.sin(-angle) * (c.x - center.x) +
                Math.cos(-angle) * (c.y - center.y)
		+ center.y - c.y;
        return { x: dx, y: dy };
    }

    function get_angle(coords) {
	/* Takes an array of 2 coordinate objects {"x": 1, "y": 1}
	 *
	 * Returns angle between 0 and 2PI.
	 */
	var denominator = coords[1].x - coords[0].x,
	    numerator = coords[1].y - coords[0].y;
	if (denominator==0 && numerator >= 0) return Math.PI/2;
	else if (denominator==0 && numerator < 0) return 3*Math.PI/2;
	else if (denominator >= 0 && numerator >= 0) return Math.atan(numerator/denominator);
	else if (denominator >= 0) return (Math.atan(numerator/denominator) + 2*Math.PI);
	else return (Math.atan(numerator/denominator) + Math.PI);
    }

    function to_degrees(radians) { return radians*180/Math.PI; }

    function distance(start, end) { return Math.sqrt(Math.pow(end.y-start.y, 2) + Math.pow(end.x-start.x, 2)); }

});
