define(["lib/d3", "lib/vkbeautify"], function(d3, vkbeautify) {
    return { set_options: set_options,
             setup_svg: setup_svg,
	     resize_svg: resize_svg,
             load_css: load_css,
             load_files: load_files,
             load_the_file: load_the_file,
	     scale_and_axes: scale_and_axes,
	     add_generic_axis: add_generic_axis,
	     make_class: make_class,
	     setup_defs: setup_defs,
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
	     export_svg: export_svg,
	     rotate_coords_recursive: rotate_coords_recursive,
	     rotate_coords: rotate_coords,
	     get_angle: get_angle,
	     to_degrees: to_degrees,
	     distance: distance };

    // definitions
    function height_width_style(selection, margins) {
        var width = parseFloat(selection.style('width')) - margins.left - margins.right,
            height = parseFloat(selection.style('height')) - margins.top - margins.bottom;
        return {'width': width, 'height': height};
    };
    function height_width_attr(selection, margins) {
        var width = parseFloat(selection.attr('width')) - margins.left - margins.right,
            height = parseFloat(selection.attr('height')) - margins.top - margins.bottom;
        return {'width': width, 'height': height};
    };
    function set_options(options, defaults) {
        if (options===undefined) return defaults;
        var i = -1,
            out = defaults,
            keys = window.Object.keys(options);
        while (++i < keys.length) out[keys[i]] = options[keys[i]];
        return out;
    };
    function setup_svg(selection, selection_is_svg, margins, fill_screen) {
        // sub selection places the graph in an existing svg environment
        var add_svg = function(f, s, m) {
            if (f) {
                d3.select("body")
                    .style("margin", "0")
                    .style("padding", "0");
                s.style('height', (window.innerHeight-m.top)+'px');
                s.style('width', (window.innerWidth-m.left)+'px');
                s.style("margin-left", m.left+"px");
                s.style("margin-top", m.top+"px");
            }
            var out = height_width_style(s, m);
            out.svg = s.append('svg')
                .attr("width", out.width)
                .attr("height", out.height)
                .attr('xmlns', "http://www.w3.org/2000/svg");
            return out;
        };

        // run
        var out;
        if (selection_is_svg) {
            out = height_width_attr(selection, margins);
            out.svg = selection;
        } else if (selection) {
            out = add_svg(fill_screen, selection, margins);
        } else {
            out = add_svg(fill_screen, d3.select('body').append('div'), margins);
        }
        if (out.height <= 0 || out.width <= 0) {
            console.warn("Container has invalid height or \
			 width. Try setting styles for height \
			 and width, or use the 'fill_screen' option.");
        }
        return out;
    };

    function resize_svg(selection, selection_is_svg, margins, fill_screen) {
        /** resize_svg(selection, selection_is_svg, margins, fill_screen)

	 Returns object with new 'height' and 'width' keys.

	 */
        var out;
        if (selection_is_svg) {
            out = height_width_attr(selection, margins);
        } else if (selection) {
            out = resize(fill_screen, selection, margins);
	} else console.warn('No selection');
        return out;

	// definitions
        function resize(f, s, m) {
            if (f) {
                s.style('height', (window.innerHeight-m.top)+'px');
                s.style('width', (window.innerWidth-m.left)+'px');
                s.style("margin-left", m.left+"px");
                s.style("margin-top", m.top+"px");
            }
            var out = height_width_style(s, margins);
	    s.select("svg")
		.attr("height", out.height)
		.attr("width", out.width);
            return out;
        };
    };

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
    function load_the_file(file, callback, value) {
        // if the value is specified, don't even need to do the ajax query
        if (value) {
            if (file) console.warn('File ' + file + ' overridden by value.');
            callback(null, value, file);
            return;
        }
        if (!file) {
            callback("No filename", null, file);
            return;
        }
        if (ends_with(file, 'json'))
	    d3.json(file, function(e, d) { callback(e, d, file); });
        else if (ends_with(file, 'css'))
	    d3.text(file, function(e, d) { callback(e, d, file); });
        else
	    callback("Unrecognized file type", null, file);
        return;

        // definitions
        function ends_with(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
    };
    function load_files(files_to_load, final_callback) {
        // load multiple files asynchronously
        // Takes a list of objects: { file: a_filename.json, callback: a_callback_fn }
        var i = -1, remaining = files_to_load.length, callbacks = {};
        while (++i < files_to_load.length) {
            var this_file = files_to_load[i].file;
            callbacks[this_file] = files_to_load[i].callback;
            load_the_file(this_file,
                          function(e, d, file) {
                              callbacks[file](e, d);
                              if (!--remaining) final_callback();
                          },
                          files_to_load[i].value);
        }
    };
    function scale_and_axes(x_domain, y_domain, width, height, options) {
	/* Generate generic x and y scales and axes for plots.

	 Returns object with keys x, y, x_axis, and y_axis.
	 */
	var o = set_options(options, {
	    padding: { left:0, right:0, top:0, bottom:0 },
	    x_is_log: false,
	    y_is_log: false,
	    y_ticks: null,
	    x_ticks: null,
	    x_nice: false,
	    y_nice: false,
	    x_tick_format: null,
	    y_tick_format: null }),
	    out = {};
	
	// x scale
	if (o.x_is_log) out.x = d3.scale.log();
	else out.x = d3.scale.linear();
	out.x.range([o.padding.left, (width - o.padding.right)])
	    .domain(x_domain);

	if (y_domain) {
	    // y scale
	    if (o.y_is_log) out.y = d3.scale.log();
	    else out.y = d3.scale.linear();
	    out.y.range([(height - o.padding.bottom), 1+o.padding.top])
		.domain(y_domain);
	} else out.y = null;

	if (x_domain) {
	    // x axis
            out.x_axis = d3.svg.axis()
		.scale(out.x)
		.orient("bottom");
	    if (o.x_nice) out.x_axis.nice();
	    if (o.x_ticks) out.x_axis.ticks(o.x_ticks);
	    if (o.x_tick_format) out.x_axis.tickFormat(o.x_tick_format);
	} else out.x = null;

	// y axis
        out.y_axis = d3.svg.axis()
            .scale(out.y)
            .orient("left");
	if (o.y_nice) out.y_axis.nice();
	if (o.y_ticks) out.y_axis.ticks(o.y_ticks);
	if (o.y_tick_format) out.y_axis.tickFormat(o.y_tick_format);

	return out;
    }
    function add_generic_axis(type, text, sel, axis, width, height, padding) {
	/* Append a generic axis to /sel/, a d3 selection of an svg element

	 */
	var cls, translate, label_x, label_y, dx, dy, label_rotate;
	if (type=='x') {
	    cls = "x axis";
	    translate = [0, height - padding.bottom];
	    label_x = width;
	    label_y = -6;
	    label_rotate = 0,
	    dx = 0,
	    dy = 0;
	} else if (type=='y') {
	    cls = "y axis";
	    translate = [padding.left, 0],
	    label_x = 0;
	    label_y = 6;
	    label_rotate = -90;
	    dx = 0;
	    dy = ".71em";
	} else console.warn('Bad axis type');
	
        return sel.append("g")
	    .attr("class", cls)
	    .attr("transform", "translate("+translate+")")
	    .call(axis)
	    .append("text")
	    .attr("class", "label")
	    .attr("transform", "rotate("+label_rotate+")")
	    .attr("x", label_x)
	    .attr("y", label_y)
	    .attr("dx", dx)
	    .attr("dy", dy)
	    .style("text-anchor", "end")
	    .text(text);
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

	// The following is not a safe assumption.
	// if (!f.type.match("application/json"))
	//     callback("Not a json file.", null);

	var reader = new window.FileReader();
	// Closure to capture the file information.
	reader.onload = function(event) {
	    var json = JSON.parse(event.target.result);
	    callback(null, json);
        };
	// Read in the image file as a data URL.
	reader.readAsText(f);
    }

    function export_svg(name, selection, do_beautify) {
        var a = document.createElement('a'), xml, ev;
        a.download = name+'.svg'; // file name
        xml = (new XMLSerializer()).serializeToString(d3.select(selection).node()); // convert node to xml string
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

    function distance(start, end) { return Math.sqrt(Math.pow(end.y-start.y, 2) + Math.pow(end.x-start.x, 2)); }

});
