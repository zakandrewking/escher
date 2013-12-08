define(["lib/d3"], function (d3) {
    return { setup_zoom_container: setup_zoom_container,
             setup_defs: setup_defs,
	     clone: clone,
	     c_plus_c: c_plus_c,
	     c_minus_c: c_minus_c,
	     download_json: download_json,
	     load_json: load_json,
	     define_scales: define_scales,
	     calculate_new_reaction_coordinates: calculate_new_reaction_coordinates,
	     calculate_new_metabolite_coordinates: calculate_new_metabolite_coordinates,
	     rotate_coords_recursive: rotate_coords_recursive,
	     rotate_coords: rotate_coords,
	     rotate_coords_relative: rotate_coords_relative,
	     rotate_coords_relative_recursive: rotate_coords_relative_recursive,
	     get_angle: get_angle,
	     to_degrees: to_degrees,
	     distance: distance };

    // definitions
    function setup_zoom_container(svg, w, h, scale_extent, callback) {
	if (callback===undefined) callback = function() {};
        // set up the container
        svg.select("#container").remove();
        var container = svg.append("g")
                .attr("id", "container"),
            sel = container.append("g"),
            zoom = function() {
                sel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		callback(d3.event);
            },
	    zoom_behavior = d3.behavior.zoom().scaleExtent(scale_extent).on("zoom", zoom);
        container.call(zoom_behavior);
        return {sel: sel,
		zoom: zoom_behavior,
		initial_zoom: 1.0 };
    }

    function setup_defs(svg, style) {
        // add stylesheet
        svg.select("defs").remove();
        var defs = svg.append("defs");
        defs.append("style")
            .attr("type", "text/css")
            .text(style);
        return defs;
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

    function c_plus_c(coords1, coords2) {
	return { "x": coords1.x + coords2.x,
		 "y": coords1.y + coords2.y };
    }
    function c_minus_c(coords1, coords2) {
	return { "x": coords1.x - coords2.x,
		 "y": coords1.y - coords2.y };
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

    function define_scales(map_w, map_h, w, h) {
        var factor = Math.min(w/map_w, h/map_h),
            scale = {};
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
        scale.flux_color = d3.scale.linear()
            .domain([0, 0.000001, 1, 8, 50])
            .range(["rgb(200,200,200)", "rgb(190,190,255)", "rgb(100,100,255)", "blue", "red"]),
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

    function calculate_new_reaction_coordinates(reaction, coords) {
	/* Assign coordinates to a new reaction.
	 *	 
	 * Sets dis, main_axis, center, and coords.	 
	 *
	 * The coords are absolute; center and main_axis are relative.
	 */
        var dis = 120;

	// rotate main axis around angle with distance
        var main_axis = [{'x': 0, 'y': 0}, {'x': dis, 'y': 0}],
	    center = { 'x': (main_axis[0].x + main_axis[1].x)/2,   // for convenience
                       'y': (main_axis[0].y + main_axis[1].y)/2 };
        reaction.dis = dis;
        reaction.main_axis = main_axis;
        reaction.center = center;
	reaction.coords = coords;
        return reaction;
    }

    function calculate_new_metabolite_coordinates(met, primary_index, main_axis, center, dis) {
	/* Calculate metabolite coordinates for a new reaction metabolite.
	 */

        // basic constants
        met.text_dis = {'x': 0, 'y': -18}; // displacement of metabolite label
        met.dis = {'x': 0, 'y': 0}; // metabolite drag displacement

        // Curve parameters
        var w = 60,  // distance between reactants and between products
            b1_strength = 0.5,
            b2_strength = 0.2,
            w2 = w*0.7,
            secondary_dis = 20,
            num_slots = Math.min(2, met.count - 1);

        // size and spacing for primary and secondary metabolites
        var ds, draw_at_index;
        if (met.is_primary) { // primary
            met.r = 10;
            ds = 20;
        } else { // secondary
            met.r = 5;
            ds = 10;
            // don't use center slot
            if (met.index > primary_index) draw_at_index = met.index - 1;
            else draw_at_index = met.index;
        }

        var de = dis - ds, // distance between ends of line axis
            reaction_axis = [{'x': ds, 'y': 0},
                             {'x': de, 'y': 0}];

        // Define line parameters and axis.
        // Begin with unrotated coordinate system. +y = Down, +x = Right.
        var start = center,
            end, circle, b1, b2;
        // reactants
        if (met.coefficient < 0 && met.is_primary) {
            end = {'x': reaction_axis[0].x + met.dis.x,
                   'y': reaction_axis[0].y + met.dis.y};
            b1 = {'x': start.x*(1-b1_strength) + reaction_axis[0].x*b1_strength,
                  'y': start.y*(1-b1_strength) + reaction_axis[0].y*b1_strength};
            b2 = {'x': start.x*b2_strength + (end.x)*(1-b2_strength),
                  'y': start.y*b2_strength + (end.y)*(1-b2_strength)},
            circle = {'x': main_axis[0].x + met.dis.x,
                      'y': main_axis[0].y + met.dis.y};
        } else if (met.coefficient < 0) {
	    end = {'x': reaction_axis[0].x + secondary_dis + met.dis.x,
                   'y': reaction_axis[0].y + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.y},
            b1 = {'x': start.x*(1-b1_strength) + reaction_axis[0].x*b1_strength,
                  'y': start.y*(1-b1_strength) + reaction_axis[0].y*b1_strength},
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[0].x + secondary_dis + met.dis.x,
                      'y': main_axis[0].y + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.y};
        } else if (met.coefficient > 0 && met.is_primary) {        // products
            end = {'x': reaction_axis[1].x + met.dis.x,
                   'y': reaction_axis[1].y + met.dis.y};
            b1 = {'x': start.x*(1-b1_strength) + reaction_axis[1].x*b1_strength,
                  'y': start.y*(1-b1_strength) + reaction_axis[1].y*b1_strength};
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x + met.dis.x,
                      'y': main_axis[1].y + met.dis.y};
        } else if (met.coefficient > 0) {
            end = {'x': reaction_axis[1].x - secondary_dis + met.dis.x,
                   'y': reaction_axis[1].y + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.y},
            b1 = {'x': start.x*(1-b1_strength) + reaction_axis[1].x*b1_strength,
                  'y': start.y*(1-b1_strength) + reaction_axis[1].y*b1_strength};
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x - secondary_dis + met.dis.x,
                      'y': main_axis[1].y + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.y};
        }
	met.end = end; met.b1 = b1; met.b2 = b2; met.circle = circle; met.start = start;
        return met;
    }

    function rotate_coords_recursive(coords_array, angle, center) {
	var rot = function(c) { return rotate_coords(c, angle, center); };
        return coords_array.map(rot);
    }

    function rotate_coords(c, angle, center) {
        var dx = Math.cos(-angle) * (c.x - center.x) +
                Math.sin(-angle) * (c.y - center.y) +
                center.x,
            dy = - Math.sin(-angle) * (c.x - center.x) +
                Math.cos(-angle) * (c.y - center.y) +
                center.y;
        return {'x': dx, 'y': dy};
    }

    function rotate_coords_relative(coord, angle, center, displacement) {
	// convert to absolute coords, rotate, then convert back
	var abs = c_plus_c(coord, displacement);
	return c_minus_c(rotate_coords(abs, angle, center), displacement);
    }
    function rotate_coords_relative_recursive(coords, angle, center, displacement) {
	// convert to absolute coords, rotate, then convert back
	var to_abs = function(c) { return c_plus_c(c, displacement); };
	var to_rel = function(c) { return c_minus_c(c, displacement); };
	return rotate_coords_recursive(coords.map(to_abs), angle, center).map(to_rel);
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
