define(["lib/vkbeautify"], function(vkbeautify) {
    return { set_options: set_options,
             setup_svg: setup_svg,
	     remove_child_nodes: remove_child_nodes,
             load_css: load_css,
             load_files: load_files,
             load_the_file: load_the_file,
	     make_class: make_class,
	     setup_defs: setup_defs,
	     draw_an_object: draw_an_object,
	     draw_a_nested_object: draw_a_nested_object,
	     make_array: make_array,
	     compare_arrays: compare_arrays,
	     array_to_object: array_to_object,
	     clone: clone,
	     extend: extend,
	     unique_concat: unique_concat,
	     object_slice_for_ids: object_slice_for_ids,
	     c_plus_c: c_plus_c,
	     c_minus_c: c_minus_c,
	     c_times_scalar: c_times_scalar,
	     download_json: download_json,
	     load_json: load_json,
	     export_svg: export_svg,
	     rotate_coords_recursive: rotate_coords_recursive,
	     rotate_coords: rotate_coords,
	     get_angle: get_angle,
	     to_degrees: to_degrees,
	     angle_for_event: angle_for_event,
	     distance: distance,
	     check_undefined: check_undefined,
	     compartmentalize: compartmentalize,
	     decompartmentalize: decompartmentalize,
	     check_r: check_r,
	     mean: mean,
	     check_for_parent_tag: check_for_parent_tag };

    // definitions
    function set_options(options, defaults) {
        if (options===undefined) return defaults;
        var i = -1,
            out = defaults;
	for (var key in options) {
	    var val = options[key];
	    if (val===undefined) {
		val = null;
	    }
	    out[key] = val;
	}
        return out;
    }

    function setup_svg(selection, selection_is_svg, fill_screen) {
        // sub selection places the graph in an existing svg environment
        var add_svg = function(f, s) {
            if (f) {
                d3.select("body").classed('fill-screen-body', true);
		s.classed('fill-screen-div', true);
            }
            var svg = s.append('svg')
		    .attr("class", "escher-svg")
                    .attr('xmlns', "http://www.w3.org/2000/svg");
	    return svg;
        };

        // run
        var out;
	// set the selection class
	selection.classed('escher-container', true);
	// make the svg
        if (selection_is_svg) {
            return selection;
        } else if (selection) {
            return add_svg(fill_screen, selection);
        } else {
            throw new Error('No selection');
        }
    }

    function remove_child_nodes(selection) {
	/** Removes all child nodes from a d3 selection

	 */
	var node =  selection.node();
	while (node.hasChildNodes()) {
	    node.removeChild(node.lastChild);
	}
    }

    function load_css(css_path, callback) {
        var css = "";
        if (css_path) {
            d3.text(css_path, function(error, text) {
                if (error) {
                    console.warn(error);
                }
                css = text;
                callback(css);
            });
        }
        return false;
    };
    function update() {
        return 'omg yes';
    };
    function load_the_file(t, file, callback, value) {
        // if the value is specified, don't even need to do the ajax query
        if (value) {
            if (file) console.warn('File ' + file + ' overridden by value.');
            callback.call(t, null, value, file);
            return;
        }
        if (!file) {
            callback.call(t, "No filename", null, file);
            return;
        }
        if (ends_with(file, 'json'))
	    d3.json(file, function(e, d) { callback(e, d, file); });
        else if (ends_with(file, 'css'))
	    d3.text(file, function(e, d) { callback(e, d, file); });
        else
	    callback.call(t, "Unrecognized file type", null, file);
        return;

        // definitions
        function ends_with(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
    }
    function load_files(t, files_to_load, final_callback) {
        // load multiple files asynchronously
        // Takes a list of objects: { file: a_filename.json, callback: a_callback_fn }
        var i = -1, remaining = files_to_load.length, callbacks = {};
        while (++i < files_to_load.length) {
            var this_file = files_to_load[i].file;
            callbacks[this_file] = files_to_load[i].callback;
            load_the_file(t,
			  this_file,
                          function(e, d, file) {
                              callbacks[file].call(t, e, d);
                              if (!--remaining) final_callback.call(t);
                          },
                          files_to_load[i].value);
        }
    }
    // makeClass - By Hubert Kauker (MIT Licensed)
    // original by John Resig (MIT Licensed).
    // http://stackoverflow.com/questions/7892884/simple-class-instantiation
    function make_class(){
	var isInternal;
	var constructor = function(args){
            if ( this instanceof constructor ) {
		if ( typeof this.init == "function" ) {
                    this.init.apply( this, isInternal ? args : arguments );
		}
            } else {
		isInternal = true;
		var instance = new constructor( arguments );
		isInternal = false;
		return instance;
            }
	};
	return constructor;
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

    function draw_an_object(container_sel, parent_node_selector, children_selector,
			    object, id_key, create_function, update_function,
			    exit_function) {
	/** Run through the d3 data binding steps for an object.

	 Arguments
	 ---------

	 container_sel: A d3 selection containing all objects.

	 parent_node_selector: A selector string for a subselection of
	 container_sel.

	 children_selector: A selector string for each DOM element to bind.

	 object: An object to bind to the selection.

	 id_key: The key that will be used to store object IDs in the bound data
	 points.

	 create_function: A function for enter selection.

	 update_function: A function for update selection.

	 exit_function: A function for exit selection.
	 
	 */
	var sel = container_sel.select(parent_node_selector)
		.selectAll(children_selector)
		.data(make_array(object, id_key), function(d) { return d[id_key]; });
	// enter: generate and place reaction
	if (create_function)
	    sel.enter().call(create_function);
	// update: update when necessary
	if (update_function)
	    sel.call(update_function);
	// exit
	if (exit_function) 
	    sel.exit().call(exit_function);
    }

    function draw_a_nested_object(container_sel, children_selector, object_data_key,
				  id_key, create_function, update_function,
				  exit_function) {
	/** Run through the d3 data binding steps for an object that is nested
	 within another element with d3 data.

	 Arguments
	 ---------

	 container_sel: A d3 selection containing all objects.

	 children_selector: A selector string for each DOM element to bind.

	 object_data_key: A key for the parent object containing data for the
	 new selection.

	 id_key: The key that will be used to store object IDs in the bound data
	 points.

	 create_function: A function for enter selection.

	 update_function: A function for update selection.

	 exit_function: A function for exit selection.
	 
	 */
	var sel = container_sel.selectAll(children_selector)
	    .data(function(d) {
		return make_array(d[object_data_key], id_key);
	    }, function(d) { return d[id_key]; });
	// enter: generate and place reaction
	if (create_function)
	    sel.enter().call(create_function);
	// update: update when necessary
	if (update_function)
	    sel.call(update_function);
	// exit
	if (exit_function) 
	    sel.exit().call(exit_function);
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

    function compare_arrays(a1, a2) {
	/** Compares two simple (not-nested) arrays.

	 */
	if (!a1 || !a2) return false;
	if (a1.length != a2.length) return false;
	for (var i = 0, l=a1.length; i < l; i++) {
            if (a1[i] != a2[i]) {
		// Warning - two different object instances will never be equal: {x:20} != {x:20}
		return false;
            }
	}
	return true;
    }

    function array_to_object(arr) {
	var obj = {};
	for (var i=0, l=arr.length; i<l; i++) { // 0
	    var a = arr[i];
	    for (var id in a) {
		if (id in obj) {
		    obj[id][i] = a[id];
		} else {
		    var n = [];
		    // fill leading spaces with null
		    for (var j=0; j<i; j++) {
			n[j] = null;
		    }
		    n[i] = a[id];
		    obj[id] = n;
		}
	    }
	    // fill trailing spaces with null
	    for (var id in obj) {
		for (var j=obj[id].length; j<=i; j++) {
		    obj[id][j] = null;
		}
	    }
	}
	return obj;
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

    function object_slice_for_ids(obj, ids) {
	/** Return a copy of the object with just the given ids. 
	 
	 Arguments
	 ---------

	 obj: An object.

	 ids: An array of id strings.

	 */
        var subset = {}, i = -1;
        while (++i<ids.length) {
	    subset[ids[i]] = clone(obj[ids[i]]);
        }
        if (ids.length != Object.keys(subset).length) {
	    console.warn('did not find correct reaction subset');
        }
	return subset;
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
        a.download = name + '.json'; // file name
	var j = JSON.stringify(json);
        a.setAttribute("href-lang", "application/json");
        a.href = 'data:application/json,' + j;
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

	// The following is not a safe assumption.
	// if (!f.type.match("application/json"))
	//     callback.call(target, "Not a json file.", null);

	var reader = new window.FileReader();
	// Closure to capture the file information.
	reader.onload = function(event) {
	    var json = JSON.parse(event.target.result);
	    callback(null, json);
        };
	// Read in the image file as a data URL.
	reader.readAsText(f);
    }

    function export_svg(name, svg_sel, do_beautify) {
        var a = document.createElement('a'), xml, ev;
        a.download = name + '.svg'; // file name
	// convert node to xml string
        xml = (new XMLSerializer()).serializeToString(svg_sel.node()); 
        if (do_beautify) xml = vkbeautify.xml(xml);
        xml = '<?xml version="1.0" encoding="utf-8"?>\n \
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n \
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + xml;
        a.setAttribute("href-lang", "image/svg+xml");
        a.href = 'data:image/svg+xml;base64,' + utf8_to_b64(xml); // create data uri
        // <a> constructed, simulate mouse click on it
        ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(ev);
        
	// definitions
        function utf8_to_b64(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        }
    };

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

    function angle_for_event(displacement, point, center) {
	var gamma =  Math.atan2((point.x - center.x), (center.y - point.y)),
	    beta = Math.atan2((point.x - center.x + displacement.x), 
			      (center.y - point.y - displacement.y)),
	    angle = beta - gamma;
	return angle;
    }

    function distance(start, end) { return Math.sqrt(Math.pow(end.y-start.y, 2) + Math.pow(end.x-start.x, 2)); }

    function check_undefined(args, names) {
	/** Report an error if any of the arguments are undefined.

	 Call by passing in *arguments* from any function and an array of
	 argument names.

	 */
	names.map(function(name, i) {
	    if (args[i]===undefined) {
		console.error('Argument is undefined: '+String(names[i]));
	    }
	});
    }

    function compartmentalize(bigg_id, compartment_id) {
	return bigg_id + '_' + compartment_id;
    }


    // definitions
    function decompartmentalize(id) {
	/** Convert ids to bigg_id and compartment_id.
	 
	 */
	var out = no_compartment(id);
	if (out===null) out = [id, null];
	return out;

	// definitions
	function no_compartment(id) {
	    /** Returns an array of [bigg_id, compartment id].

	     Matches compartment ids with length 1 or 2.

	     Return null if no match is found.

	     */
	    var reg = /(.*)_([a-z0-9]{1,2})$/,
		result = reg.exec(id);
	    if (result===null) return null;
	    return result.slice(1,3);
	}
    }

    function check_r(o, spec, can_be_none) {
	if (typeof spec == "string") {
	    var the_type;
	    if (spec=='String') {
		the_type = function(x) { return typeof x == "string"; };
	    } else if (spec=="Float") {
		the_type = function(x) { return typeof x == "number"; };
	    } else if (spec=="Integer") {
		the_type = function(x) { return (typeof x == "number") &&
					 (parseFloat(x,10) == parseInt(x,10)); };
	    } else if (spec=="Boolean") {
		the_type = function(x) { return typeof x == "boolean"; };
	    } else if (spec!="*") {
		throw new Error("Bad spec string: " + spec);
	    }
	    if (!the_type(o)) {
		throw new Error('Bad type: '+String(o)+' should be '+spec);
	    }
	} else if (spec instanceof Array) {
	    o.forEach(function(x) {
		check_r(x, spec[0], can_be_none);
	    });
	} else { // dictionary/object
	    var key = Object.keys(spec)[0];
	    if (key == "*") {
		for (var k in o) {
		    if (o[k]===null && can_be_none.indexOf(k)!=-1) 
			continue;
		    check_r(o[k], spec[key], can_be_none);
		}
	    } else {
		for (var k in spec) {
		    if (!(k in o)) {
			throw new Error('Missing key: %s' % k);
		    };
		    if (o[k]===null && can_be_none.indexOf(k)!=-1) 
			continue;
		    check_r(o[k], spec[k], can_be_none);
		}
	    }
	}
    }

    function mean(array) {
	var sum = array.reduce(function(a, b) { return a + b; });
	var avg = sum / array.length;
	return avg;
    }

    function check_for_parent_tag(el, tag) {
	/** Check that the selection has the given parent tag.

	 el: A d3 selection or node.

	 tag: A tag name (case insensitive)

	 */
	// make sure it is a node
	if (el instanceof Array)
	    el = el.node();
	while (el.parentNode !== null) {
	    el = el.parentNode;
	    if (el.tagName === undefined) continue;
	    if (el.tagName.toLowerCase() === tag.toLowerCase())
		return true;
	}
	return false;
    }
});
