/* global d3, Blob, XMLSerializer */

var vkbeautify = require('vkbeautify');
var _ = require('underscore');
try {
    var saveAs = require('filesaverjs').saveAs;
} catch (e) {
    console.warn('filesaverjs not available');
}


module.exports = {
    set_options: set_options,
    remove_child_nodes: remove_child_nodes,
    load_css: load_css,
    load_files: load_files,
    load_the_file: load_the_file,
    make_class: make_class,
    setup_defs: setup_defs,
    draw_an_object: draw_an_object,
    draw_a_nested_object: draw_a_nested_object,
    make_array: make_array,
    make_array_ref: make_array_ref,
    compare_arrays: compare_arrays,
    array_to_object: array_to_object,
    clone: clone,
    extend: extend,
    unique_concat: unique_concat,
    unique_strings_array: unique_strings_array,
    debounce: debounce,
    object_slice_for_ids: object_slice_for_ids,
    object_slice_for_ids_ref: object_slice_for_ids_ref,
    object_slice_for_bigg: object_slice_for_bigg,
    get_central_nodes: get_central_nodes,
    c_plus_c: c_plus_c,
    c_minus_c: c_minus_c,
    c_times_scalar: c_times_scalar,
    download_json: download_json,
    load_json: load_json,
    load_json_or_csv: load_json_or_csv,
    download_svg: download_svg,
    download_png: download_png,
    rotate_coords_recursive: rotate_coords_recursive,
    rotate_coords: rotate_coords,
    get_angle: get_angle,
    to_degrees: to_degrees,
    angle_for_event: angle_for_event,
    distance: distance,
    check_undefined: check_undefined,
    compartmentalize: compartmentalize,
    decompartmentalize: decompartmentalize,
    mean: mean,
    median: median,
    quartiles: quartiles,
    random_characters: random_characters,
    generate_map_id: generate_map_id,
    check_for_parent_tag: check_for_parent_tag,
    name_to_url: name_to_url,
    parse_url_components: parse_url_components,
    get_document: get_document,
    get_window: get_window,
    d3_transform_catch: d3_transform_catch,
    check_browser: check_browser
};


// definitions
function _check_filesaver() {
    /** Check if Blob is available, and alert if it is not. */
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("Blob not supported");
    }
}

function set_options(options, defaults, must_be_float) {
    if (options === undefined || options === null)
        return defaults;
    var i = -1,
        out = {};
    for (var key in defaults) {
        var has_key = ((key in options) &&
                       (options[key] !== null) &&
                       (options[key] !== undefined));
        var val = (has_key ? options[key] : defaults[key]);
        if (must_be_float && key in must_be_float) {
            val = parseFloat(val);
            if (isNaN(val)) {
                if (has_key) {
                    console.warn('Bad float for option ' + key);
                    val = parseFloat(defaults[key]);
                    if (isNaN(val)) {
                        console.warn('Bad float for default ' + key);
                        val = null;
                    }
                } else {
                    console.warn('Bad float for default ' + key);
                    val = null;
                }
            }
        }
        out[key] = val;
    }
    return out;
}


function remove_child_nodes(selection) {
    /** Removes all child nodes from a d3 selection

     */
    var node = selection.node();
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


function load_the_file(t, file, callback, value) {
    /** Load a file.

     t: this context for callback. Should be an object.

     files_to_load: A filename to load. Must be JSON or CSS.

     callback: Function to run after the file is loaded. Takes the arguments
     error and data.

     value: If the value is specified, just assign it and do not execute the
     ajax query.

     */
    if (value) {
        if (file) console.warn('File ' + file + ' overridden by value.');
        callback.call(t, null, value);
        return;
    }
    if (!file) {
        callback.call(t, 'No filename', null);
        return;
    }
    if (ends_with(file, 'json'))
        d3.json(file, function(e, d) { callback.call(t, e, d); });
    else if (ends_with(file, 'css'))
        d3.text(file, function(e, d) { callback.call(t, e, d); });
    else
        callback.call(t, 'Unrecognized file type', null);
    return;

    // definitions
    function ends_with(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
}


function load_files(t, files_to_load, final_callback) {
    /** Load multiple files asynchronously by calling utils.load_the_file.

     t: this context for callback. Should be an object.

     files_to_load: A list of objects with the attributes:

        { file: a_filename.json, callback: a_callback_fn }

        File must be JSON or CSS.

     final_callback: Function that runs after all files have loaded.

     */
    if (files_to_load.length === 0) final_callback.call(t);
    var i = -1,
        remaining = files_to_load.length;
    while (++i < files_to_load.length) {
        load_the_file(
            t,
            files_to_load[i].file,
            function(e, d) {
                this.call(t, e, d);
                if (!--remaining) final_callback.call(t);
            }.bind(files_to_load[i].callback),
            files_to_load[i].value
        );
    }
}


function make_class(){
    /** Create a constructor that returns a new object with our without the
     'new' keyword.

     Adapted from Hubert Kauker (MIT Licensed), John Resig (MIT Licensed).
     http://stackoverflow.com/questions/7892884/simple-class-instantiation

     */
    var is_internal,
        constructor = function(args) {
            if (this instanceof constructor) {
                if (typeof this.init === 'function') {
                    this.init.apply(this, is_internal ? args : arguments);
                }
            } else {
                is_internal = true;
                var instance = new constructor(arguments);
                is_internal = false;
                return instance;
            }
        };
    return constructor;
}


function setup_defs(svg, style) {
    // add stylesheet
    svg.select("defs").remove();
    var defs = svg.append("defs");
    // make sure the defs is the first node
    var node = defs.node();
    node.parentNode.insertBefore(node, node.parentNode.firstChild);
    defs.append("style")
        .attr("type", "text/css")
        .text(style);
    return defs;
}

function draw_an_object(container_sel, parent_node_selector, children_selector,
                        object, id_key, create_function, update_function,
                        exit_function) {
    /** Run through the d3 data binding steps for an object. Also checks to
     make sure none of the values in the *object* are undefined, and
     ignores those.

     The create_function, update_function, and exit_function CAN modify the
     input data object.

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
    var draw_object = {};
    for (var id in object) {
        if (object[id] === undefined) {
            console.warn('Undefined value for id ' + id + ' in object. Ignoring.');
        } else {
            draw_object[id] = object[id];
        }
    }

    var sel = container_sel.select(parent_node_selector)
            .selectAll(children_selector)
            .data(make_array_ref(draw_object, id_key),
                  function(d) { return d[id_key]; });
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

     The create_function, update_function, and exit_function CAN modify the
     input data object.

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
                return make_array_ref(d[object_data_key], id_key);
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

function make_array_ref(obj, id_key) {
    /** Turn the object into an array, but only by reference. Faster than
     make_array.

     */
    var array = [];
    for (var key in obj) {
        // copy object
        var it = obj[key];
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
    /** Convert an array of objects to an object with all keys and values
     that are arrays of the same length as arr. Fills in spaces with null.

     For example, [ { a: 1 }, { b: 2 }] becomes { a: [1, null], b: [null, 2] }.

     */
    // new object
    var obj = {};
    // for each element of the array
    for (var i = 0, l = arr.length; i < l; i++) {
        var column = arr[i],
            keys = Object.keys(column);
        for (var k = 0, nk = keys.length; k < nk; k++) {
            var id = keys[k];
            if (!(id in obj)) {
                var n = [];
                // fill spaces with null
                for (var j = 0; j < l; j++) {
                    n[j] = null;
                }
                n[i] = column[id];
                obj[id] = n;
            } else {
                obj[id][i] = column[id];
            }
        }
    }
    return obj;
}

/**
 * Deep copy for array and object types. All other types are returned by
 * reference.
 * @param {T<Object|Array|*>} obj - The object to copy.
 * @return {T} The copied object.
 */
function clone (obj) {
    if (_.isArray(obj))
        return _.map(obj, function(t) { return clone(t) })
    else if (_.isObject(obj))
        return _.mapObject(obj, function (t, k) { return clone(t) })
    else
        return obj
}

function extend(obj1, obj2, overwrite) {
    /** Extends obj1 with keys/values from obj2. Performs the extension
     cautiously, and does not override attributes, unless the overwrite
     argument is true.

     Arguments
     ---------

     obj1: Object to extend

     obj2: Object with which to extend.

     overwrite: (Optional, Default false) Overwrite attributes in obj1.

     */

    if (overwrite === undefined)
        overwrite = false;

    for (var attrname in obj2) {
        if (!(attrname in obj1) || overwrite) // UNIT TEST This
            obj1[attrname] = obj2[attrname];
        else
            throw new Error('Attribute ' + attrname + ' already in object.');
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

function unique_strings_array(arr) {
    /** Return unique values in array of strings.

     http://stackoverflow.com/questions/1960473/unique-values-in-an-array

     */
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++)
        if (a.indexOf(arr[i]) === -1)
            a.push(arr[i]);
    return a;
}

function debounce(func, wait, immediate) {
    /** Returns a function, that, as long as it continues to be invoked, will
     not be triggered.

     The function will be called after it stops being called for N
     milliseconds. If `immediate` is passed, trigger the function on the leading
     edge, instead of the trailing.

     */
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
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

function object_slice_for_ids_ref(obj, ids) {
    /** Return a reference of the object with just the given ids. Faster
     than object_slice_for_ids.

     Arguments
     ---------

     obj: An object.

     ids: An array of id strings.

     */
    var subset = {}, i = -1;
    while (++i<ids.length) {
        subset[ids[i]] = obj[ids[i]];
    }
    if (ids.length != Object.keys(subset).length) {
        console.warn('did not find correct reaction subset');
    }
    return subset;
}

function object_slice_for_bigg(obj, bigg_ids) {
    /** Return a copy of the object with just the given bigg ids.

     Arguments
     ---------

     obj: An object.

     ids: An array of bigg id strings.

     */
    var subset = {};

    _.each(_.keys(obj), function(key) {
        if (_.contains(bigg_ids, obj[key].bigg_id)) subset[key] = obj[key];
    });

    return subset;
}

function get_central_nodes(reactions) {

    var central_nodes = {};

    _.each(_.keys(reactions), function(key) {

        no_segments = _.keys(reactions[key].segments).length;

        if (no_segments < 5) {
            var nodes = _.map(reactions[key].segments, function(seg) {
                return [seg.from_node_id, seg.to_node_id];
            });
        } else {
            var nodes = _.map(_.filter(reactions[key].segments, function(segment) {
                return (segment.b1 === null && segment.b2 === null);
            }), function(seg) {
                return [seg.from_node_id, seg.to_node_id];
            });
        }

        central_nodes[key] = _.intersection(nodes[0], nodes[1]);
    });

    return central_nodes;
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
    /** Download json file in a blob.

     */

    // alert if blob isn't going to work
    _check_filesaver();

    var j = JSON.stringify(json),
        blob = new Blob([j], {type: "application/json"});
    saveAs(blob, name + '.json');
}

function load_json(f, callback, pre_fn, failure_fn) {
    /** Try to load the file as JSON.

     Arguments
     ---------

     f: The file path

     callback: A callback function that accepts arguments: error, data.

     pre_fn: (optional) A function to call before loading the data.

     failure_fn: (optional) A function to call if the load fails or is aborted.

     */
    // Check for the various File API support.
    if (!(window.File && window.FileReader && window.FileList && window.Blob))
        callback("The File APIs are not fully supported in this browser.", null);

    var reader = new window.FileReader();
    // Closure to capture the file information.
    reader.onload = function(event) {
        var result = event.target.result,
            data;
        // try JSON
        try {
            data = JSON.parse(result);
        } catch (e) {
            // if it failed, return the error
            callback(e, null);
            return;
        }
        // if successful, return the data
        callback(null, data);
    };
    if (pre_fn !== undefined && pre_fn !== null) {
        try { pre_fn(); }
        catch (e) { console.warn(e); }
    }
    reader.onabort = function(event) {
        try { failure_fn(); }
        catch (e) { console.warn(e); }
    };
    reader.onerror = function(event) {
        try { failure_fn(); }
        catch (e) { console.warn(e); }
    };
    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function load_json_or_csv(f, csv_converter, callback, pre_fn, failure_fn,
                          debug_event) {
    /** Try to load the file as JSON or CSV (JSON first).

     Arguments
     ---------

     f: The file path

     csv_converter: A function to convert the CSV output to equivalent JSON.

     callback: A callback function that accepts arguments: error, data.

     pre_fn: (optional) A function to call before loading the data.

     failure_fn: (optional) A function to call if the load fails or is aborted.

     debug_event: (optional) An event, with a string at event.target.result, to
     load as though it was the contents of a loaded file.

     */

    // Capture the file information.
    var onload_function = function(event) {
        var result = event.target.result,
            data, errors;
        // try JSON
        try {
            data = JSON.parse(result);
        } catch (e) {
            errors = 'JSON error: ' + e;

            // try csv
            try {
                data = csv_converter(d3.csv.parseRows(result));
            } catch (e) {
                // if both failed, return the errors
                callback(errors + '\nCSV error: ' + e, null);
                return;
            }
        }
        // if successful, return the data
        callback(null, data);
    };
    if (debug_event !== undefined && debug_event !== null) {
        console.warn('Debugging load_json_or_csv');
        return onload_function(debug_event);
    }

    // Check for the various File API support.
    if (!(window.File && window.FileReader && window.FileList && window.Blob))
        callback("The File APIs are not fully supported in this browser.", null);
    var reader = new window.FileReader();

    if (pre_fn !== undefined && pre_fn !== null) {
        try { pre_fn(); }
        catch (e) { console.warn(e); }
    }
    reader.onabort = function(event) {
        try { failure_fn(); }
        catch (e) { console.warn(e); }
    };
    reader.onerror = function(event) {
        try { failure_fn(); }
        catch (e) { console.warn(e); }
    };
    // Read in the image file as a data URL.
    reader.onload = onload_function;
    reader.readAsText(f);
}

function download_svg(name, svg_sel, do_beautify) {
    /** Download an svg file using FileSaver.js.
     *
     * Arguments
     * ---------
     *
     * name: The filename (without extension).
     *
     * svg_sel: The d3 selection for the SVG element.
     *
     * do_beautify: (Boolean) If true, then beautify the SVG output.
     *
     */

    // alert if blob isn't going to work
    _check_filesaver();

    // make the xml string
    var xml = (new XMLSerializer()).serializeToString(svg_sel.node());
    if (do_beautify) xml = vkbeautify.xml(xml);
    xml = ('<?xml version="1.0" encoding="utf-8"?>\n' +
           '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n' +
           ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
           xml);

    // save
    var blob = new Blob([xml], { type: 'image/svg+xml' });
    saveAs(blob, name + '.svg');
};

function download_png(name, svg_sel, do_beautify) {
    /** Download a png file using FileSaver.js.
     *
     * Arguments
     * ---------
     *
     * name: The filename (without extension).
     *
     * svg_sel: The d3 selection for the SVG element.
     *
     * do_beautify: (Boolean) If true, then beautify the SVG output.
     *
     */

    // Alert if blob isn't going to work
    _check_filesaver();

    // Make the xml string
    var xml = (new XMLSerializer()).serializeToString(svg_sel.node());
    if (do_beautify) xml = vkbeautify.xml(xml);
    xml = ('<?xml version="1.0" encoding="utf-8"?>\n' +
           '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n' +
           ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
           xml);

    // Canvas to hold the image
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    // Get SVG size
    var svg_size = svg_sel.node().getBBox();
    var svg_width = svg_size.width + svg_size.x;
    var svg_height = svg_size.height + svg_size.y;

    // Canvas size = SVG size. Constrained to 10000px for very large SVGs
    if (svg_width < 10000 && svg_height < 10000) {
        canvas.width = svg_width;
        canvas.height = svg_height;
    } else {
        if (canvas.width > canvas.height) {
            canvas.width = 10000;
            canvas.height = 10000*(svg_height/svg_width);
        } else {
            canvas.width = 10000*(svg_width/svg_height);
            canvas.height = 10000;
        }
    }

    // Image element appended with data
    var base_image = new Image();
    base_image.src = 'data:image/svg+xml;base64,' + btoa(xml);

    base_image.onload = function() {
        // Draw image to canvas with white background
        context.fillStyle="#FFF";
        context.fillRect( 0, 0, canvas.width, canvas.height);
        context.drawImage(base_image, 0, 0, canvas.width, canvas.height);

        // Save image
        canvas.toBlob(function(blob) {
            saveAs(blob, name + ".png");
        });
    };
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

function mean(array) {
    var sum = array.reduce(function(a, b) { return a + b; });
    var avg = sum / array.length;
    return avg;
}

function median(array) {
    array.sort(function(a, b) { return a - b; });
    var half = Math.floor(array.length / 2);
    if(array.length % 2 == 1)
        return array[half];
    else
        return (array[half-1] + array[half]) / 2.0;
}

function quartiles(array) {
    array.sort(function(a, b) { return a - b; });
    var half = Math.floor(array.length / 2);
    if (array.length == 1)
        return [ array[0], array[0], array[0] ];
    else if (array.length % 2 == 1)
        return [ median(array.slice(0, half)),
                 array[half],
                 median(array.slice(half + 1)) ];
    else
        return [ median(array.slice(0, half)),
                 (array[half-1] + array[half]) / 2.0,
                 median(array.slice(half)) ];
}

function random_characters(num) {
    // Thanks to @csharptest.net
    // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
    var text = '',
        possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < num; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function generate_map_id() {
    return random_characters(12);
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

function name_to_url(name, download_url) {
    /** Convert model or map name to url.

     Arguments
     ---------

     name: The short name, e.g. e_coli.iJO1366.central_metabolism.

     download_url: The url to prepend (optional).

     */

    if (download_url !== undefined && download_url !== null) {
        // strip download_url
        download_url = download_url.replace(/^\/|\/$/g, '');
        name = [download_url, name].join('/');
    }
    // strip final path
    return name.replace(/^\/|\/$/g, '') + '.json';
}

function parse_url_components(the_window, options) {
    /** Parse the URL and return options based on the URL arguments.

     Arguments
     ---------

     the_window: A reference to the global window.

     options: (optional) an existing options object to which new options
     will be added. Overwrites existing arguments in options.

     Adapted from http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter

     */
    if (_.isUndefined(options)) options = {}

    var query = the_window.location.search.substring(1),
        vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('='),
            val = decodeURIComponent(pair[1])
        // deal with array options
        if (pair[0].indexOf('[]') == pair[0].length - 2) {
            var o = pair[0].replace('[]', '')
            if (!(o in options))
                options[o] = []
            options[o].push(val)
        } else {
            options[pair[0]] = val
        }
    }
    return options
}


function get_document(node) {
    /** Get the document for the node */
    return node.ownerDocument;
}

function get_window(node) {
    /** Get the window for the node */
    return get_document(node).defaultView;
}

function d3_transform_catch(transform_attr) {
    /** Return the result of d3.transform, but catch errors if we are in
     node/jsdom. See also https://github.com/mbostock/d3/issues/1545

     */
    try {
        return d3.transform(transform_attr);
    } catch (err) {
        console.error('Cannot run d3.transform, probably becuase this is a node/jsdom test. ' +
                      'Returning a tranform object for testing.');
        return { translate: [0, 0], rotate: 0 };
    }
}

function check_browser(name) {
    /** Look for name in the user agent string */
    var browser = function() {
        /** Thanks to http://stackoverflow.com/questions/2400935/browser-detection-in-javascript */
        var ua = navigator.userAgent,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [],
            tem;
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+ (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [ M[1], M[2] ]: [ navigator.appName, navigator.appVersion, '-?' ];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    };

    try {
        // navigator.userAgent is deprecated, so don't count on it
        return browser().toLowerCase().indexOf(name) > -1;
    } catch (e) {
        return false;
    }
}
