define(["lib/d3"], function (d3) {
    return { setup_zoom_container: setup_zoom_container,
             setup_defs: setup_defs,
	     clone: clone,
	     download_json: download_json,
	     load_json: load_json,
	     calculate_reaction_coordinates: calculate_reaction_coordinates,
	     calculate_metabolite_coordinates: calculate_metabolite_coordinates,
	     rotate_coords_recursive: rotate_coords_recursive,
	     rotate_coords: rotate_coords };

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

    function calculate_reaction_coordinates(reaction) {
        var dis = 120;
        reaction.dis = dis;
        var main_axis = [{'x': 0, 'y': 0}, {'x': 0, 'y': dis}];
        reaction.main_axis = main_axis;
        reaction.center = {'x': (main_axis[0].x + main_axis[1].x)/2,   // for convenience
                           'y': (main_axis[0].y + main_axis[1].y)/2};
        return reaction;
    }

    function calculate_metabolite_coordinates(met, primary_index, angle, main_axis, center, dis) {
        // basic constants
        met.text_dis = {'x': 0, 'y': -18}; // displacement of metabolite label

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
            reaction_axis = [{'x': 0, 'y': ds},
                             {'x': 0, 'y': de}];

        // Define line parameters and axis.
        // Begin with unrotated coordinate system. +y = Down, +x = Right.
        var start = center,
            end, circle, b1, b2;
        // reactants
        if (met.coefficient < 0 && met.is_primary) {
            end = {'x': reaction_axis[0].x + met.dis.x,
                   'y': reaction_axis[0].y + met.dis.y};
            b1 = {'x': start.x*b1_strength + reaction_axis[0].x*(1-b1_strength),
                  'y': start.y*b1_strength + reaction_axis[0].y*(1-b1_strength)};
            b2 = {'x': start.x*b2_strength + (end.x)*(1-b2_strength),
                  'y': start.y*b2_strength + (end.y)*(1-b2_strength)},
            circle = {'x': main_axis[0].x + met.dis.x,
                      'y': main_axis[0].y + met.dis.y};
        } else if (met.coefficient < 0) {
            end = {'x': reaction_axis[0].x + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.x,
                   'y': reaction_axis[0].y + secondary_dis + met.dis.y},
            b1 = {'x': start.x*b1_strength + reaction_axis[0].x*(1-b1_strength),
                  'y': start.y*b1_strength + reaction_axis[0].y*(1-b1_strength)},
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[0].x + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.x,
                      'y': main_axis[0].y + secondary_dis + met.dis.y};
        } else if (met.coefficient > 0 && met.is_primary) {        // products
            end = {'x': reaction_axis[1].x + met.dis.x,
                   'y': reaction_axis[1].y + met.dis.y};
            b1 = {'x': start.x*b1_strength + reaction_axis[1].x*(1-b1_strength),
                  'y': start.y*b1_strength + reaction_axis[1].y*(1-b1_strength)};
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x + met.dis.x,
                      'y': main_axis[1].y + met.dis.y};
        } else if (met.coefficient > 0) {
            end = {'x': reaction_axis[1].x + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.x,
                   'y': reaction_axis[1].y - secondary_dis + met.dis.y},
            b1 = {'x': start.x*b1_strength + reaction_axis[1].x*(1-b1_strength),
                  'y': start.y*b1_strength + reaction_axis[1].y*(1-b1_strength)};
            b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                  'y': start.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.x,
                      'y': main_axis[1].y - secondary_dis + met.dis.y};
        }
        // rotate coordinates around start point
        met.start  = rotate_coords(start,  angle, main_axis[0]),
        met.end    = rotate_coords(end,    angle, main_axis[0]),
        met.b1     = rotate_coords(b1,     angle, main_axis[0]),
        met.b2     = rotate_coords(b2,     angle, main_axis[0]),
        met.circle = rotate_coords(circle, angle, main_axis[0]);

        return met;
    }

    function rotate_coords_recursive(coords_array, angle, center) {
        var i=-1,
            rotated = [];
        while (++i<coords_array.length) {
            rotated.push(rotate_coords(coords_array[i]));
        }
        return rotated;
    }

    function rotate_coords(c, angle, center) {
        var dx = Math.cos(angle) * (c.x - center.x) +
                Math.sin(angle) * (c.y - center.y) +
                center.x,
            dy = - Math.sin(angle) * (c.x - center.x) +
                Math.cos(angle) * (c.y - center.y) +
                center.y;
        return {'x': dx, 'y': dy};
    }
});
