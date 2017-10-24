(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3-selection"), require("underscore"), require("d3-drag"), require("d3-format"), require("d3-request"), require("d3-zoom"), require("d3-scale"), require("baconjs"), require("mocha"), require("d3-brush"), require("tinier"), require("vkbeautify"), require("d3-dsv"), (function webpackLoadOptionalExternalModule() { try { return require("file-saver"); } catch(e) {} }()), require("mousetrap"), require("jsdom"), require("jquery"), require("bootstrap"), require("assert"));
	else if(typeof define === 'function' && define.amd)
		define(["d3-selection", "underscore", "d3-drag", "d3-format", "d3-request", "d3-zoom", "d3-scale", "baconjs", "mocha", "d3-brush", "tinier", "vkbeautify", "d3-dsv", "file-saver", "mousetrap", "jsdom", "jquery", "bootstrap", "assert"], factory);
	else if(typeof exports === 'object')
		exports["escher"] = factory(require("d3-selection"), require("underscore"), require("d3-drag"), require("d3-format"), require("d3-request"), require("d3-zoom"), require("d3-scale"), require("baconjs"), require("mocha"), require("d3-brush"), require("tinier"), require("vkbeautify"), require("d3-dsv"), (function webpackLoadOptionalExternalModule() { try { return require("file-saver"); } catch(e) {} }()), require("mousetrap"), require("jsdom"), require("jquery"), require("bootstrap"), require("assert"));
	else
		root["escher"] = factory(root["d3-selection"], root["underscore"], root["d3-drag"], root["d3-format"], root["d3-request"], root["d3-zoom"], root["d3-scale"], root["baconjs"], root["mocha"], root["d3-brush"], root["tinier"], root["vkbeautify"], root["d3-dsv"], root["file-saver"], root["mousetrap"], root["jsdom"], root["jquery"], root["bootstrap"], root["assert"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_15__, __WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_25__, __WEBPACK_EXTERNAL_MODULE_26__, __WEBPACK_EXTERNAL_MODULE_27__, __WEBPACK_EXTERNAL_MODULE_38__, __WEBPACK_EXTERNAL_MODULE_52__, __WEBPACK_EXTERNAL_MODULE_53__, __WEBPACK_EXTERNAL_MODULE_54__, __WEBPACK_EXTERNAL_MODULE_57__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global Blob, XMLSerializer, Image, btoa */

var vkbeautify = __webpack_require__(25);
var _ = __webpack_require__(2);
var d3_json = __webpack_require__(7).json;
var d3_text = __webpack_require__(7).text;
var d3_csvParseRows = __webpack_require__(26).csvParseRows;
var d3_selection = __webpack_require__(1).selection;

try {
  var saveAs = __webpack_require__(27).saveAs;
} catch (e) {
  console.warn('Not a browser, so FileSaver.js not available.');
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
  to_radians_norm: to_radians_norm,
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

  /**
   * Check if Blob is available, and alert if it is not.
   */
};function _check_filesaver() {
  try {
    var isFileSaverSupported = !!new Blob();
  } catch (e) {
    alert('Blob not supported');
  }
}

function set_options(options, defaults, must_be_float) {
  if (options === undefined || options === null) {
    return defaults;
  }
  var i = -1;
  var out = {};
  for (var key in defaults) {
    var has_key = key in options && options[key] !== null && options[key] !== undefined;
    var val = has_key ? options[key] : defaults[key];
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
    d3_text(css_path, function (error, text) {
      if (error) {
        console.warn(error);
      }
      css = text;
      callback(css);
    });
  }
  return false;
}

function _ends_with(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Load a file.
 * @param {} t - this context for callback. Should be an object.
 * @param {} files_to_load - A filename to load. Must be JSON or CSS.
 * @param {} callback - Function to run after the file is loaded. Takes the
 * arguments error and data.
 * @param {} value - If the value is specified, just assign it and do not
 * execute the ajax query.
 */
function load_the_file(t, file, callback, value) {
  if (value) {
    if (file) console.warn('File ' + file + ' overridden by value.');
    callback.call(t, null, value);
    return;
  }
  if (!file) {
    callback.call(t, 'No filename', null);
    return;
  }
  if (_ends_with(file, 'json')) {
    d3_json(file, function (e, d) {
      callback.call(t, e, d);
    });
  } else if (_ends_with(file, 'css')) {
    d3_text(file, function (e, d) {
      callback.call(t, e, d);
    });
  } else {
    callback.call(t, 'Unrecognized file type', null);
  }
  return;
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
    load_the_file(t, files_to_load[i].file, function (e, d) {
      this.call(t, e, d);
      if (! --remaining) final_callback.call(t);
    }.bind(files_to_load[i].callback), files_to_load[i].value);
  }
}

/**
 * Create a constructor that returns a new object with our without the 'new'
 * keyword.
 *
 * Adapted from Hubert Kauker (MIT Licensed), John Resig (MIT Licensed).
 * http://stackoverflow.com/questions/7892884/simple-class-instantiation
 */
function make_class() {
  var is_internal;
  var constructor = function constructor(args) {
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
  defs.append("style").attr("type", "text/css").text(style);
  return defs;
}

/**
 * Run through the d3 data binding steps for an object. Also checks to make sure
 * none of the values in the *object* are undefined, and ignores those.
 *
 * The create_function, update_function, and exit_function CAN modify the input
 * data object.
 *
 * @param {} container_sel - A d3 selection containing all objects.
 *
 * @param {} parent_node_selector - A selector string for a subselection of
 * container_sel.
 *
 * @param {} children_selector - A selector string for each DOM element to bind.
 *
 * @param {} object - An object to bind to the selection.
 *
 * @param {} id_key - The key that will be used to store object IDs in the bound
 * data points.
 *
 * @param {} create_function - A function for enter selection. Create function
 * must return a selection of the new nodes.
 *
 * @param {} update_function - A function for update selection.
 *
 * @param {} exit_function - A function for exit selection.
 */
function draw_an_object(container_sel, parent_node_selector, children_selector, object, id_key, create_function, update_function, exit_function) {
  var draw_object = {};

  for (var id in object) {
    if (object[id] === undefined) {
      console.warn('Undefined value for id ' + id + ' in object. Ignoring.');
    } else {
      draw_object[id] = object[id];
    }
  }

  var sel = container_sel.select(parent_node_selector).selectAll(children_selector).data(make_array_ref(draw_object, id_key), function (d) {
    return d[id_key];
  });

  // enter: generate and place reaction
  var update_sel = create_function ? create_function(sel.enter()).merge(sel) : sel;

  // update: update when necessary
  if (update_function) {
    update_sel.call(update_function);
  }

  // exit
  if (exit_function) {
    sel.exit().call(exit_function);
  }
}

/**
 * Run through the d3 data binding steps for an object that is nested within
 * another element with D3 data.
 *
 * The create_function, update_function, and exit_function CAN modify the input
 * data object.
 *
 * @param {} container_sel - A d3 selection containing all objects.
 *
 * @param {} children_selector - A selector string for each DOM element to bind.
 *
 * @param {} object_data_key - A key for the parent object containing data for
 * the new selection.
 *
 * @param {} id_key - The key that will be used to store object IDs in the bound
 * data points.
 *
 * @param {} create_function - A function for enter selection. Create function
 * must return a selection of the new nodes.
 *
 * @param {} update_function - A function for update selection.
 *
 * @param {} exit_function - A function for exit selection.
 */
function draw_a_nested_object(container_sel, children_selector, object_data_key, id_key, create_function, update_function, exit_function) {
  var sel = container_sel.selectAll(children_selector).data(function (d) {
    return make_array_ref(d[object_data_key], id_key);
  }, function (d) {
    return d[id_key];
  });

  // enter: generate and place reaction
  var update_sel = create_function ? create_function(sel.enter()).merge(sel) : sel;

  // update: update when necessary
  if (update_function) {
    update_sel.call(update_function);
  }

  // exit
  if (exit_function) {
    sel.exit().call(exit_function);
  }
}

function make_array(obj, id_key) {
  // is this super slow?
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
  for (var i = 0, l = a1.length; i < l; i++) {
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
function clone(obj) {
  if (_.isArray(obj)) return _.map(obj, function (t) {
    return clone(t);
  });else if (_.isObject(obj)) return _.mapObject(obj, function (t, k) {
    return clone(t);
  });else return obj;
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

  if (overwrite === undefined) overwrite = false;

  for (var attrname in obj2) {
    if (!(attrname in obj1) || overwrite) // UNIT TEST This
      obj1[attrname] = obj2[attrname];else throw new Error('Attribute ' + attrname + ' already in object.');
  }
}

function unique_concat(arrays) {
  var new_array = [];
  arrays.forEach(function (a) {
    a.forEach(function (x) {
      if (new_array.indexOf(x) < 0) {
        new_array.push(x);
      }
    });
  });
  return new_array;
}

/**
 * Return unique values in array of strings.
 *
 * http://stackoverflow.com/questions/1960473/unique-values-in-an-array
 */
function unique_strings_array(arr) {
  var a = [];
  for (var i = 0, l = arr.length; i < l; i++) {
    if (a.indexOf(arr[i]) === -1) {
      a.push(arr[i]);
    }
  }
  return a;
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not be
 * triggered. The function will be called after it stops being called for N
 * milliseconds. If "immediate" is passed, trigger the function on the leading
 * edge, instead of the trailing.
 */
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Return a copy of the object with just the given ids.
 * @param {} obj - An object
 * @param {} ids - An array of id strings
 */
function object_slice_for_ids(obj, ids) {
  var subset = {};
  var i = -1;
  while (++i < ids.length) {
    subset[ids[i]] = clone(obj[ids[i]]);
  }
  if (ids.length !== Object.keys(subset).length) {
    console.warn('did not find correct reaction subset');
  }
  return subset;
}

/**
 * Return a reference of the object with just the given ids. Faster than
 * object_slice_for_ids.
 * @param {} obj - An object.
 * @param {} ids - An array of id strings.
 */
function object_slice_for_ids_ref(obj, ids) {
  var subset = {};
  var i = -1;
  while (++i < ids.length) {
    subset[ids[i]] = obj[ids[i]];
  }
  if (ids.length !== Object.keys(subset).length) {
    console.warn('did not find correct reaction subset');
  }
  return subset;
}

function c_plus_c(coords1, coords2) {
  if (coords1 === null || coords2 === null || coords1 === undefined || coords2 === undefined) {
    return null;
  }
  return {
    x: coords1.x + coords2.x,
    y: coords1.y + coords2.y
  };
}

function c_minus_c(coords1, coords2) {
  if (coords1 === null || coords2 === null || coords1 === undefined || coords2 === undefined) {
    return null;
  }
  return {
    x: coords1.x - coords2.x,
    y: coords1.y - coords2.y
  };
}

function c_times_scalar(coords, scalar) {
  return {
    x: coords.x * scalar,
    y: coords.y * scalar
  };
}

/**
 * Download JSON file in a blob.
 */
function download_json(json, name) {
  // Alert if blob isn't going to work
  _check_filesaver();

  var j = JSON.stringify(json);
  var blob = new Blob([j], { type: 'application/json' });
  saveAs(blob, name + '.json');
}

/**
 * Try to load the file as JSON.
 * @param {} f - The file path
 * @param {} callback - A callback function that accepts arguments: error, data.
 * @param {} pre_fn (optional) - A function to call before loading the data.
 * @param {} failure_fn (optional) - A function to call if the load fails or is
 * aborted.
*/
function load_json(f, callback, pre_fn, failure_fn) {
  // Check for the various File API support
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    callback('The File APIs are not fully supported in this browser.', null);
  }

  var reader = new window.FileReader();
  // Closure to capture the file information.
  reader.onload = function (event) {
    var result = event.target.result;
    var data;
    // Try JSON
    try {
      data = JSON.parse(result);
    } catch (e) {
      // If it failed, return the error
      callback(e, null);
      return;
    }
    // If successful, return the data
    callback(null, data);
  };
  if (pre_fn !== undefined && pre_fn !== null) {
    try {
      pre_fn();
    } catch (e) {
      console.warn(e);
    }
  }
  reader.onabort = function (event) {
    try {
      failure_fn();
    } catch (e) {
      console.warn(e);
    }
  };
  reader.onerror = function (event) {
    try {
      failure_fn();
    } catch (e) {
      console.warn(e);
    }
  };
  // Read in the image file as a data URL
  reader.readAsText(f);
}

/**
 * Try to load the file as JSON or CSV (JSON first).
 * @param {String} f - The file path
 * @param {Function}  csv_converter - A function to convert the CSV output to equivalent JSON.
 * @param {Function} callback - A callback function that accepts arguments: error, data.
 * @param {} pre_fn (optional) - A function to call before loading the data.
 * @param {} failure_fn (optional) - A function to call if the load fails or is
 * aborted.
 * @param {} debug_event (optional) - An event, with a string at
 * event.target.result, to load as though it was the contents of a loaded file.
 */
function load_json_or_csv(f, csv_converter, callback, pre_fn, failure_fn, debug_event) {
  // Capture the file information.
  var onload_function = function onload_function(event) {
    var result = event.target.result;
    var data;
    var errors;
    // try JSON
    try {
      data = JSON.parse(result);
    } catch (e) {
      errors = 'JSON error: ' + e;

      // try csv
      try {
        data = csv_converter(d3_csvParseRows(result));
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
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) callback("The File APIs are not fully supported in this browser.", null);
  var reader = new window.FileReader();

  if (pre_fn !== undefined && pre_fn !== null) {
    try {
      pre_fn();
    } catch (e) {
      console.warn(e);
    }
  }
  reader.onabort = function (event) {
    try {
      failure_fn();
    } catch (e) {
      console.warn(e);
    }
  };
  reader.onerror = function (event) {
    try {
      failure_fn();
    } catch (e) {
      console.warn(e);
    }
  };
  // Read in the image file as a data URL.
  reader.onload = onload_function;
  reader.readAsText(f);
}

/**
 * Download an svg file using FileSaver.js.
 * @param {String} name - The filename (without extension)
 * @param {D3 Selection} svg_sel - The d3 selection for the SVG element
 * @param {Boolean} do_beautify - If true, then beautify the SVG output
 */
function download_svg(name, svg_sel, do_beautify) {
  // Alert if blob isn't going to work
  _check_filesaver();

  // Make the xml string
  var xml = new XMLSerializer().serializeToString(svg_sel.node());
  if (do_beautify) xml = vkbeautify.xml(xml);
  xml = '<?xml version="1.0" encoding="utf-8"?>\n' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n' + ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + xml;

  // Save
  var blob = new Blob([xml], { type: 'image/svg+xml' });
  saveAs(blob, name + '.svg');
}

/**
 * Download a png file using FileSaver.js.
 * @param {String} name - The filename (without extension).
 * @param {D3 Selection} svg_sel - The d3 selection for the SVG element.
 * @param {Boolean} do_beautify - If true, then beautify the SVG output.
 */
function download_png(name, svg_sel, do_beautify) {
  // Alert if blob isn't going to work
  _check_filesaver();

  // Make the xml string
  var xml = new XMLSerializer().serializeToString(svg_sel.node());
  if (do_beautify) xml = vkbeautify.xml(xml);
  xml = '<?xml version="1.0" encoding="utf-8"?>\n' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n' + ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + xml;

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
      canvas.height = 10000 * (svg_height / svg_width);
    } else {
      canvas.width = 10000 * (svg_width / svg_height);
      canvas.height = 10000;
    }
  }

  // Image element appended with data
  var base_image = new Image();
  base_image.src = 'data:image/svg+xml;base64,' + btoa(xml);

  base_image.onload = function () {
    // Draw image to canvas with white background
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(base_image, 0, 0, canvas.width, canvas.height);

    // Save image
    canvas.toBlob(function (blob) {
      saveAs(blob, name + '.png');
    });
  };
}

function rotate_coords_recursive(coords_array, angle, center) {
  return coords_array.map(function (c) {
    return rotate_coords(c, angle, center);
  });
}

/**
 * Calculates displacement { x: dx, y: dy } based on rotating point c around
 * center with angle.
 */
function rotate_coords(c, angle, center) {
  var dx = Math.cos(-angle) * (c.x - center.x) + Math.sin(-angle) * (c.y - center.y) + center.x - c.x;
  var dy = -Math.sin(-angle) * (c.x - center.x) + Math.cos(-angle) * (c.y - center.y) + center.y - c.y;
  return { x: dx, y: dy };
}

/**
 * Get the angle between coordinates
 * @param {Object} coords - Array of 2 coordinate objects { x: 1, y: 1 }
 * @return {Number} angle between 0 and 2PI.
 */
function get_angle(coords) {
  var denominator = coords[1].x - coords[0].x;
  var numerator = coords[1].y - coords[0].y;
  if (denominator === 0 && numerator >= 0) {
    return Math.PI / 2;
  } else if (denominator === 0 && numerator < 0) {
    return 3 * Math.PI / 2;
  } else if (denominator >= 0 && numerator >= 0) {
    return Math.atan(numerator / denominator);
  } else if (denominator >= 0) {
    return Math.atan(numerator / denominator) + 2 * Math.PI;
  } else {
    return Math.atan(numerator / denominator) + Math.PI;
  }
}

function to_degrees(radians) {
  return radians * 180 / Math.PI;
}

/**
 * Force to domain - PI to PI
 */
function _angle_norm(radians) {
  if (radians < -Math.PI) {
    radians = radians + Math.ceil(radians / (-2 * Math.PI)) * 2 * Math.PI;
  } else if (radians > Math.PI) {
    radians = radians - Math.ceil(radians / (2 * Math.PI)) * 2 * Math.PI;
  }
  return radians;
}

/**
 * Convert to radians, and force to domain -PI to PI
 */
function to_radians_norm(degrees) {
  var radians = Math.PI / 180 * degrees;
  return _angle_norm(radians);
}

function angle_for_event(displacement, point, center) {
  var gamma = Math.atan2(point.x - center.x, center.y - point.y);
  var beta = Math.atan2(point.x - center.x + displacement.x, center.y - point.y - displacement.y);
  var angle = beta - gamma;
  return angle;
}

function distance(start, end) {
  return Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
}

/**
 * Report an error if any of the arguments are undefined. Call by passing in
 * "arguments" from any function and an array of argument names.
 */
function check_undefined(args, names) {
  names.map(function (name, i) {
    if (args[i] === undefined) {
      console.error('Argument is undefined: ' + String(names[i]));
    }
  });
}

function compartmentalize(bigg_id, compartment_id) {
  return bigg_id + '_' + compartment_id;
}

/**
 * Returns an array of [bigg_id, compartment id]. Matches compartment ids with
 * length 1 or 2. Return [ id, null ] if no match is found.
 */
function decompartmentalize(id) {
  var reg = /(.*)_([a-z0-9]{1,2})$/;
  var result = reg.exec(id);
  return result !== null ? result.slice(1, 3) : [id, null];
}

function mean(array) {
  var sum = array.reduce(function (a, b) {
    return a + b;
  });
  var avg = sum / array.length;
  return avg;
}

function median(array) {
  array.sort(function (a, b) {
    return a - b;
  });
  var half = Math.floor(array.length / 2);
  if (array.length % 2 == 1) {
    return array[half];
  } else {
    return (array[half - 1] + array[half]) / 2.0;
  }
}

function quartiles(array) {
  array.sort(function (a, b) {
    return a - b;
  });
  var half = Math.floor(array.length / 2);
  if (array.length === 1) {
    return [array[0], array[0], array[0]];
  } else if (array.length % 2 === 1) {
    return [median(array.slice(0, half)), array[half], median(array.slice(half + 1))];
  } else {
    return [median(array.slice(0, half)), (array[half - 1] + array[half]) / 2.0, median(array.slice(half))];
  }
}

/**
 * Generate random characters
 *
 * Thanks to @csharptest.net
 * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
 */
function random_characters(num) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < num; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function generate_map_id() {
  return random_characters(12);
}

/**
 * Check that the selection has the given parent tag.
 * @param {D3 Selection|DOM Node} el - A D3 Selection or DOM Node to check.
 * @param {String} tag - A tag name (case insensitive).
 */
function check_for_parent_tag(el, tag) {
  // make sure it is a node
  if (el instanceof d3_selection) {
    el = el.node();
  }
  while (el.parentNode !== null) {
    el = el.parentNode;
    if (el.tagName === undefined) {
      continue;
    }
    if (el.tagName.toLowerCase() === tag.toLowerCase()) {
      return true;
    }
  }
  return false;
}

/**
 * Convert model or map name to url.
 * @param {String} name - The short name, e.g. e_coli.iJO1366.central_metabolism.
 * @param {String} download_url (optional) - The url to prepend.
 */
function name_to_url(name, download_url) {
  if (download_url !== undefined && download_url !== null) {
    // strip download_url
    download_url = download_url.replace(/^\/|\/$/g, '');
    name = [download_url, name].join('/');
  }
  // strip final path
  return name.replace(/^\/|\/$/g, '') + '.json';
}

/**
 * Parse the URL and return options based on the URL arguments.
 *
 * Adapted from http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
 *
 * @param {} the_window - A reference to the global window.
 * @param {Object} options (optional) - an existing options object to which new
 * options will be added. Overwrites existing arguments in options.
 */
function parse_url_components(the_window, options) {
  if (_.isUndefined(options)) options = {};

  var query = the_window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0, l = vars.length; i < l; i++) {
    var pair = vars[i].split('=');
    var val = decodeURIComponent(pair[1]);
    // deal with array options
    if (pair[0].indexOf('[]') === pair[0].length - 2) {
      var o = pair[0].replace('[]', '');
      if (!(o in options)) {
        options[o] = [];
      }
      options[o].push(val);
    } else {
      options[pair[0]] = val;
    }
  }
  return options;
}

/**
 * Get the document for the node
 */
function get_document(node) {
  return node.ownerDocument;
}

/**
 * Get the window for the node
 */
function get_window(node) {
  return get_document(node).defaultView;
}

/**
 * Get translation and rotation values for a transform string. This used to be
 * in d3, but since v4, I just adapted a solution from SO:
 *
 * http://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4
 *
 * To get skew and scale out, go back to that example.
 *
 * TODO rename function without "catch"
 *
 * @param {String} transform_attr - A transform string.
 */
function d3_transform_catch(transform_attr) {
  if (transform_attr.indexOf('skew') !== -1 || transform_attr.indexOf('matrix') !== -1) {
    throw new Error('d3_transform_catch does not work with skew or matrix');
  }

  var translate_res = /translate\s*\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/.exec(transform_attr);
  var tn = _.isNull(translate_res);
  var tx = tn ? 0.0 : Number(translate_res[1]);
  var ty = tn ? 0.0 : Number(translate_res[2]);

  var rotate_res = /rotate\s*\(\s*([0-9.-]+)\s*\)/.exec(transform_attr);
  var rn = _.isNull(rotate_res);
  var r = rn ? 0.0 : Number(rotate_res[1]);

  var scale_res = /scale\s*\(\s*([0-9.-]+)\s*\)/.exec(transform_attr);
  var sn = _.isNull(scale_res);
  var s = sn ? 0.0 : Number(scale_res[1]);

  return { translate: [tx, ty], rotate: r, scale: s

    // // Create a dummy g for calculation purposes only. This will new be appended
    // // to the DOM and will be discarded once this function returns.
    // var g = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    // // Set the transform attribute to the provided string value.
    // g.setAttributeNS(null, 'transform', transform_attr)

    // // Consolidate the SVGTransformList containing all Try to a single
    // // SVGTransform of type SVG_TRANSFORM_MATRIX and get its SVGMatrix.

    // var matrix = g.transform.baseVal.consolidate().matrix

    // // Below calculations are taken and adapted from the private func
    // // transform/decompose.js of D3's module d3-interpolate.
    // var a = matrix.a
    // var b = matrix.b
    // var c = matrix.c
    // var d = matrix.d
    // var e = matrix.e
    // var f = matrix.f
    // var scaleX = Math.sqrt(a * a + b * b)

    // if (scaleX) {
    //   a /= scaleX
    //   b /= scaleX
    // }

    // if (a * d < b * c) {
    //   a = -a
    //   b = -b
    // }

    // return {
    //   translate: [ e, f ],
    //   rotate: Math.atan2(b, a) * Math.PI / 180,
    // }
  };
}

/**
 * Look for name in the user agent string.
 */
function check_browser(name) {
  var browser = function browser() {
    // Thanks to
    // http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
    var ua = navigator.userAgent;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    var tem;
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
      M.splice(1, 1, tem[1]);
    }
    return M.join(' ');
  };

  try {
    // navigator.userAgent is deprecated, so don't count on it
    return browser().toLowerCase().indexOf(name) > -1;
  } catch (e) {
    return false;
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("d3-selection");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("underscore");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** CallbackManager */

var utils = __webpack_require__(0);
var _ = __webpack_require__(2);

var CallbackManager = utils.make_class();
CallbackManager.prototype = {
    init: init,
    set: set,
    remove: remove,
    run: run
};
module.exports = CallbackManager;

function init() {}

function set(name, fn) {
    /** As in d3 callbacks, you can namespace your callbacks after a period:
      select_metabolite.direction_arrow
     select_metabolite.input
      Both are called by select_metabolite
       TODO add *arguments to set, as in _.defer()
      */
    if (this.callbacks === undefined) this.callbacks = {};
    if (this.callbacks[name] === undefined) this.callbacks[name] = [];
    this.callbacks[name].push(fn);

    return this;
}

function remove(name) {
    /** Remove a callback by name
      */
    if (this.callbacks === undefined || Object.keys(this.callbacks).length == 0) {
        console.warn('No callbacks to remove');
    }
    delete this.callbacks[name];
    return this;
}

function run(name, this_arg) {
    /** Run all callbacks that match the portion of name before the period ('.').
      Arguments
     ---------
      name: The callback name, which can include a tag after a '.' to
     specificy a particular callback.
      this_arg: (Optional, Default: null) The object assigned to `this` in
     the callback.
      */
    if (_.isUndefined(this.callbacks)) return this;
    if (_.isUndefined(this_arg)) this_arg = null;
    // pass all but the first (name) argument to the callback
    var pass_args = Array.prototype.slice.call(arguments, 2);
    // look for matching callback names
    for (var a_name in this.callbacks) {
        var split_name = a_name.split('.')[0];
        if (split_name == name) {
            this.callbacks[a_name].forEach(function (fn) {
                fn.apply(this_arg, pass_args);
            });
        }
    }
    return this;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * data_styles
 */

var utils = __webpack_require__(0);
var _ = __webpack_require__(2);
var d3_format = __webpack_require__(6).format;

module.exports = {
  import_and_check: import_and_check,
  text_for_data: text_for_data,
  float_for_data: float_for_data,
  reverse_flux_for_data: reverse_flux_for_data,
  gene_string_for_data: gene_string_for_data,
  csv_converter: csv_converter,
  genes_for_gene_reaction_rule: genes_for_gene_reaction_rule,
  evaluate_gene_reaction_rule: evaluate_gene_reaction_rule,
  replace_gene_in_rule: replace_gene_in_rule,
  apply_reaction_data_to_reactions: apply_reaction_data_to_reactions,
  apply_metabolite_data_to_nodes: apply_metabolite_data_to_nodes,
  apply_gene_data_to_reactions: apply_gene_data_to_reactions

  // globals
};var RETURN_ARG = function RETURN_ARG(x) {
  return x;
};
var ESCAPE_REG = /([.*+?^=!:${}()|\[\]\/\\])/g;
var EMPTY_LINES = /\n\s*\n/g;
var TRAILING_NEWLINE = /\n\s*(\)*)\s*$/;
var AND_OR = /([\(\) ])(?:and|or)([\)\( ])/ig;
var ALL_PARENS = /[\(\)]/g;
// capture an expression surrounded by whitespace and a set of parentheses
var EXCESS_PARENS = /\(\s*(\S+)\s*\)/g;
var OR = /\s+or\s+/i;
var AND = /\s+and\s+/i;
// find ORs
var OR_EXPRESSION = /(^|\()(\s*-?[0-9.]+\s+(?:or\s+-?[0-9.]+\s*)+)(\)|$)/ig;
// find ANDS, respecting order of operations (and before or)
var AND_EXPRESSION = /(^|\(|or\s)(\s*-?[0-9.]+\s+(?:and\s+-?[0-9.]+\s*)+)(\sor|\)|$)/ig;

function _align_gene_data_to_reactions(data, reactions) {
  var aligned = {};
  var null_val = [null];
  // make an array of nulls as the default
  for (var first_gene_id in data) {
    null_val = data[first_gene_id].map(function () {
      return null;
    });
    break;
  }
  for (var reaction_id in reactions) {
    var reaction = reactions[reaction_id];
    var bigg_id = reaction.bigg_id;
    var this_gene_data = {};

    reaction.genes.forEach(function (gene) {
      // check both gene id and gene name
      ;['bigg_id', 'name'].forEach(function (kind) {
        var d = data[gene[kind]] || utils.clone(null_val);
        // merger with existing data if present
        var existing_d = this_gene_data[gene.bigg_id];
        if (typeof existing_d === 'undefined') {
          this_gene_data[gene.bigg_id] = d;
        } else {
          for (var i = 0; i < d.length; i++) {
            var pnt = d[i];
            if (pnt !== null) {
              existing_d[i] = pnt;
            }
          }
        }
      });
    });
    aligned[bigg_id] = this_gene_data;
  }
  return aligned;
}

/**
 * Convert imported data to a style that can be applied to reactions and nodes.
 * data: The data object.
 * name: Either 'reaction_data', 'metabolite_data', or 'gene_data'
 * all_reactions: Required for name == 'gene_data'. Must include all GPRs for
 * the map and model.
 */
function import_and_check(data, name, all_reactions) {
  // check arguments
  if (data === null) {
    return null;
  }

  if (['reaction_data', 'metabolite_data', 'gene_data'].indexOf(name) === -1) {
    throw new Error('Invalid name argument: ' + name);
  }

  // make array
  if (!(data instanceof Array)) {
    data = [data];
  }
  // check data
  var check = function check() {
    if (data === null) {
      return null;
    }
    if (data.length === 1) {
      return null;
    }
    if (data.length === 2) {
      return null;
    }
    return console.warn('Bad data style: ' + name);
  };
  check();
  data = utils.array_to_object(data);

  if (name === 'gene_data') {
    if (all_reactions === undefined) {
      throw new Error('Must pass all_reactions argument for gene_data');
    }
    data = _align_gene_data_to_reactions(data, all_reactions);
  }

  return data;
}

function float_for_data(d, styles, compare_style) {
  // all null
  if (d === null) return null;

  // absolute value
  var take_abs = styles.indexOf('abs') != -1;

  if (d.length == 1) {
    // 1 set
    // 1 null
    var f = _parse_float_or_null(d[0]);
    if (f === null) return null;
    return abs(f, take_abs);
  } else if (d.length == 2) {
    // 2 sets
    // 2 null
    var fs = d.map(_parse_float_or_null);
    if (fs[0] === null || fs[1] === null) return null;

    if (compare_style == 'diff') {
      return diff(fs[0], fs[1], take_abs);
    } else if (compare_style == 'fold') {
      return check_finite(fold(fs[0], fs[1], take_abs));
    } else if (compare_style == 'log2_fold') {
      return check_finite(log2_fold(fs[0], fs[1], take_abs));
    }
  } else {
    throw new Error('Data array must be of length 1 or 2');
  }
  throw new Error('Bad data compare_style: ' + compare_style);

  // definitions
  function check_finite(x) {
    return isFinite(x) ? x : null;
  }
  function abs(x, take_abs) {
    return take_abs ? Math.abs(x) : x;
  }
  function diff(x, y, take_abs) {
    if (take_abs) return Math.abs(y - x);else return y - x;
  }
  function fold(x, y, take_abs) {
    if (x == 0 || y == 0) return null;
    var fold = y >= x ? y / x : -x / y;
    return take_abs ? Math.abs(fold) : fold;
  }
  function log2_fold(x, y, take_abs) {
    if (x == 0) return null;
    if (y / x < 0) return null;
    var log = Math.log(y / x) / Math.log(2);
    return take_abs ? Math.abs(log) : log;
  }
}

function reverse_flux_for_data(d) {
  if (d === null || d[0] === null) return false;
  return d[0] < 0;
}

/**
 * Add gene values to the gene_reaction_rule string.
 * @param {String} rule - The gene reaction rule.
 * @param {} gene_values - The values.
 * @param {} genes - An array of objects specifying the gene bigg_id and name.
 * @param {} styles - The reaction styles.
 * @param {String} identifiers_on_map - The type of identifiers ('bigg_id' or 'name').
 * @param {} compare_style - The comparison style.
 *
 * @return {Array} A list of objects with:
 *
 * {
 *    bigg_id: The bigg ID.
 *    name: The name.
 *    text: The new string with formatted data values.
 * }
 *
 * The text elements should each appear on a new line.
 */
function gene_string_for_data(rule, gene_values, genes, styles, identifiers_on_map, compare_style) {
  var out_text = rule;
  var no_data = gene_values === null;
  // keep track of bigg_ids to remove repeats
  var genes_found = {};

  genes.forEach(function (g_obj) {
    var bigg_id = g_obj.bigg_id;

    // ignore repeats that may have found their way into the genes object
    if (bigg_id in genes_found) return;
    genes_found[bigg_id] = true;

    // generate the string
    if (no_data) {
      out_text = replace_gene_in_rule(out_text, bigg_id, bigg_id + '\n');
    } else {
      if (!(bigg_id in gene_values)) return;
      var d = gene_values[bigg_id];
      var f = float_for_data(d, styles, compare_style);
      var format = f === null ? RETURN_ARG : d3_format('.3g');
      if (d.length === 1) {
        out_text = replace_gene_in_rule(out_text, bigg_id, bigg_id + ' (' + null_or_d(d[0], format) + ')\n');
      } else if (d.length === 2) {
        var new_str;
        // check if they are all text
        var any_num = _.any(d, function (x) {
          return _parse_float_or_null(x) !== null;
        });
        if (any_num) {
          new_str = bigg_id + ' (' + null_or_d(d[0], format) + ', ' + null_or_d(d[1], format) + ': ' + null_or_d(f, format) + ')\n';
        } else {
          new_str = bigg_id + ' (' + null_or_d(d[0], format) + ', ' + null_or_d(d[1], format) + ')\n';
        }
        out_text = replace_gene_in_rule(out_text, bigg_id, new_str);
      }
    }
  });
  out_text = out_text
  // remove empty lines
  .replace(EMPTY_LINES, '\n')
  // remove trailing newline (with or without parens)
  .replace(TRAILING_NEWLINE, '$1');

  // split by newlines, and switch to names if necessary
  var result = out_text.split('\n').map(function (text) {
    for (var i = 0, l = genes.length; i < l; i++) {
      var gene = genes[i];
      if (text.indexOf(gene.bigg_id) !== -1) {
        // replace with names
        if (identifiers_on_map === 'name') text = replace_gene_in_rule(text, gene.bigg_id, gene.name);
        return { bigg_id: gene.bigg_id, name: gene.name, text: text };
      }
    }
    // not found, then none
    return { bigg_id: null, name: null, text: text };
  });
  return result;

  // definitions
  function null_or_d(d, format) {
    return d === null ? 'nd' : format(d);
  }
}

function text_for_data(d, f) {
  if (d === null) {
    return null_or_d(null);
  }
  if (d.length === 1) {
    var format = f === null ? RETURN_ARG : d3_format('.3g');
    return null_or_d(d[0], format);
  }
  if (d.length === 2) {
    var format = f === null ? RETURN_ARG : d3_format('.3g'),
        t = null_or_d(d[0], format);
    t += ', ' + null_or_d(d[1], format);
    t += ': ' + null_or_d(f, format);
    return t;
  }
  return '';

  // definitions
  function null_or_d(d, format) {
    return d === null ? '(nd)' : format(d);
  }
}

function csv_converter(csv_rows) {
  /** Convert data from a csv file to json-style data.
       File must include a header row.
   */
  // count rows
  var c = csv_rows[0].length,
      converted = [];
  if (c < 2 || c > 3) throw new Error('CSV file must have 2 or 3 columns');
  // set up rows
  for (var i = 1; i < c; i++) {
    converted[i - 1] = {};
  }
  // fill
  csv_rows.slice(1).forEach(function (row) {
    for (var i = 1, l = row.length; i < l; i++) {
      converted[i - 1][row[0]] = row[i];
    }
  });
  return converted;
}

function genes_for_gene_reaction_rule(rule) {
  /** Find unique genes in gene_reaction_rule string.
       Arguments
      ---------
       rule: A boolean string containing gene names, parentheses, AND's and
      OR's.
       Returns
      -------
       An array of gene strings.
   */
  var genes = rule
  // remove ANDs and ORs, surrounded by space or parentheses
  .replace(AND_OR, '$1$2')
  // remove parentheses
  .replace(ALL_PARENS, '')
  // split on whitespace
  .split(' ').filter(function (x) {
    return x != '';
  });
  // unique strings
  return utils.unique_strings_array(genes);
}

function evaluate_gene_reaction_rule(rule, gene_values, and_method_in_gene_reaction_rule) {
  /** Return a value given the rule and gene_values object.
       Arguments
      ---------
       rule: A boolean string containing gene names, parentheses, AND's and
      OR's.
       gene_values: Object with gene_ids for keys and numbers for values.
       and_method_in_gene_reaction_rule: Either 'mean' or 'min'.
   */

  var null_val = [null],
      l = 1;
  // make an array of nulls as the default
  for (var gene_id in gene_values) {
    null_val = gene_values[gene_id].map(function () {
      return null;
    });
    l = null_val.length;
    break;
  }

  if (rule == '') return utils.clone(null_val);

  // for each element in the arrays
  var out = [];
  for (var i = 0; i < l; i++) {
    // get the rule
    var curr_val = rule;

    // put all the numbers into the expression
    var all_null = true;
    for (var gene_id in gene_values) {
      var f = _parse_float_or_null(gene_values[gene_id][i]);
      if (f === null) {
        f = 0;
      } else {
        all_null = false;
      }
      curr_val = replace_gene_in_rule(curr_val, gene_id, f);
    }
    if (all_null) {
      out.push(null);
      continue;
    }

    // recursively evaluate
    while (true) {
      // arithemtic expressions
      var new_curr_val = curr_val;

      // take out excessive parentheses
      new_curr_val = new_curr_val.replace(EXCESS_PARENS, ' $1 ');

      // or's
      new_curr_val = new_curr_val.replace(OR_EXPRESSION, function (match, p1, p2, p3) {
        // sum
        var nums = p2.split(OR).map(parseFloat),
            sum = nums.reduce(function (a, b) {
          return a + b;
        });
        return p1 + sum + p3;
      });
      // and's
      new_curr_val = new_curr_val.replace(AND_EXPRESSION, function (match, p1, p2, p3) {
        // find min
        var nums = p2.split(AND).map(parseFloat),
            val = and_method_in_gene_reaction_rule == 'min' ? Math.min.apply(null, nums) : nums.reduce(function (a, b) {
          return a + b;
        }) / nums.length;
        return p1 + val + p3;
      });
      // break if there is no change
      if (new_curr_val == curr_val) break;
      curr_val = new_curr_val;
    }
    // strict test for number
    var num = Number(curr_val);
    if (isNaN(num)) {
      console.warn('Could not evaluate ' + rule);
      out.push(null);
    } else {
      out.push(num);
    }
  }
  return out;
}

function replace_gene_in_rule(rule, gene_id, val) {
  // get the escaped string, with surrounding space or parentheses
  var space_or_par_start = '(^|[\\\s\\\(\\\)])';
  var space_or_par_finish = '([\\\s\\\(\\\)]|$)';
  var escaped = space_or_par_start + escape_reg_exp(gene_id) + space_or_par_finish;
  return rule.replace(new RegExp(escaped, 'g'), '$1' + val + '$2');

  // definitions
  function escape_reg_exp(string) {
    return string.replace(ESCAPE_REG, "\\$1");
  }
}

/**
 * Returns True if the scale has changed.
 * @param {Object} reactions -
 * @param {} data -
 * @param {} styles -
 * @param {String} compare_style -
 * @param {Array} keys - (Optional) The keys in reactions to apply data to.
 */
function apply_reaction_data_to_reactions(reactions, data, styles, compare_style, keys) {
  if (_.isUndefined(keys)) keys = Object.keys(reactions);

  var reaction_id;
  var reaction;
  var segment_id;
  var segment;

  if (data === null) {
    keys.map(function (reaction_id) {
      reaction = reactions[reaction_id];
      reaction.data = null;
      reaction.data_string = '';
      for (segment_id in reaction.segments) {
        segment = reaction.segments[segment_id];
        segment.data = null;
      }
      reaction.gene_string = null;
    });
    return false;
  }

  // apply the datasets to the reactions
  keys.map(function (reaction_id) {
    reaction = reactions[reaction_id];
    // check bigg_id and name
    var d = data[reaction.bigg_id] || data[reaction.name] || null;
    var f = float_for_data(d, styles, compare_style);
    var r = reverse_flux_for_data(d);
    var s = text_for_data(d, f);
    reaction.data = f;
    reaction.data_string = s;
    reaction.reverse_flux = r;
    reaction.gene_string = null;
    // apply to the segments
    for (segment_id in reaction.segments) {
      segment = reaction.segments[segment_id];
      segment.data = reaction.data;
      segment.reverse_flux = reaction.reverse_flux;
    }
  });
  return true;
}

/**
 * Returns True if the scale has changed.
 * @param {Object} nodes -
 * @param {} data -
 * @param {} styles -
 * @param {String} compare_style -
 * @param {Array} keys - (Optional) The keys in nodes to apply data to.
 */
function apply_metabolite_data_to_nodes(nodes, data, styles, compare_style, keys) {
  if (_.isUndefined(keys)) keys = Object.keys(nodes);

  var node_id;

  if (data === null) {
    keys.map(function (node_id) {
      nodes[node_id].data = null;
      nodes[node_id].data_string = '';
    });
    return false;
  }

  // grab the data
  keys.map(function (node_id) {
    var node = nodes[node_id];
    // check bigg_id and name
    var d = data[node.bigg_id] || data[node.name] || null,
        f = float_for_data(d, styles, compare_style),
        s = text_for_data(d, f);
    node.data = f;
    node.data_string = s;
  });
  return true;
}

/**
 * Returns true if data is present
 * reactions: The reactions to update.
 * gene_data_obj: The gene data object, with the following style:
 *   { reaction_id: { gene_id: value } }
 * styles:  Gene styles array.
 * identifiers_on_map:
 * compare_style:
 * and_method_in_gene_reaction_rule:
 * @param {Array} keys - (Optional) The keys in reactions to apply data to.
 */
function apply_gene_data_to_reactions(reactions, gene_data_obj, styles, identifiers_on_map, compare_style, and_method_in_gene_reaction_rule, keys) {
  if (_.isUndefined(keys)) keys = Object.keys(reactions);

  if (gene_data_obj === null) {
    keys.map(function (reaction_id) {
      var reaction = reactions[reaction_id];
      reaction.data = null;
      reaction.data_string = '';
      reaction.reverse_flux = false;
      for (var segment_id in reaction.segments) {
        var segment = reaction.segments[segment_id];
        segment.data = null;
      }
      reaction.gene_string = null;
    });
    return false;
  }

  // Get the null val
  var null_val = [null];
  // Make an array of nulls as the default
  for (var reaction_id in gene_data_obj) {
    for (var gene_id in gene_data_obj[reaction_id]) {
      null_val = gene_data_obj[reaction_id][gene_id].map(function () {
        return null;
      });
      break;
    }
    break;
  }

  // Apply the datasets to the reactions
  keys.map(function (reaction_id) {
    var reaction = reactions[reaction_id];
    var rule = reaction.gene_reaction_rule;
    // find the data
    var d, gene_values;
    var r_data = gene_data_obj[reaction.bigg_id];
    if (!_.isUndefined(r_data)) {
      gene_values = r_data;
      d = evaluate_gene_reaction_rule(rule, gene_values, and_method_in_gene_reaction_rule);
    } else {
      gene_values = {};
      d = utils.clone(null_val);
    }
    var f = float_for_data(d, styles, compare_style);
    var r = reverse_flux_for_data(d);
    var s = text_for_data(d, f);
    reaction.data = f;
    reaction.data_string = s;
    reaction.reverse_flux = r;
    // apply to the segments
    for (var segment_id in reaction.segments) {
      var segment = reaction.segments[segment_id];
      segment.data = reaction.data;
      segment.reverse_flux = reaction.reverse_flux;
    }
    // always update the gene string
    reaction.gene_string = gene_string_for_data(rule, gene_values, reaction.genes, styles, identifiers_on_map, compare_style);
  });
  return true;
}

function _parse_float_or_null(x) {
  // strict number casting
  var f = Number(x);
  // check for null and '', which haven't been caught yet
  return isNaN(f) || parseFloat(x) != f ? null : f;
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("d3-drag");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("d3-format");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("d3-request");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * PlacedDiv. A container to position an html div to match the coordinates of a
 * SVG element.
 */

var utils = __webpack_require__(0);

var PlacedDiv = utils.make_class();
// instance methods
PlacedDiv.prototype = {
  init: init,
  is_visible: is_visible,
  place: place,
  hide: hide
};
module.exports = PlacedDiv;

function init(div, map, displacement) {
  this.div = div;
  this.map = map;
  this.displacement = displacement === undefined ? { x: 0, y: 0 } : displacement;

  // begin hidden
  this.visible = true;
  this.hide();
}

function is_visible() {
  return this.visible;
}

/**
 * Position the html div to match the given SVG coordinates.
 */
function place(coords) {
  // show the input
  this.div.style('display', null);

  // move the new input
  var window_translate = this.map.zoom_container.window_translate;
  var window_scale = this.map.zoom_container.window_scale;
  var map_size = this.map.get_size();
  var left = Math.max(20, Math.min(map_size.width - 270, window_scale * coords.x + window_translate.x - this.displacement.x));
  var top = Math.max(20, Math.min(map_size.height - 40, window_scale * coords.y + window_translate.y - this.displacement.y));
  this.div.style('position', 'absolute').style('display', 'block').style('left', left + 'px').style('top', top + 'px');

  this.visible = true;
}

/**
 * Hide the PlacedDiv.
 */
function hide() {
  if (this.visible) {
    this.div.style('display', 'none');
    this.visible = false;
  }
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("d3-zoom");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * build
 *
 * Functions for building new reactions.
 */

var utils = __webpack_require__(0);
var _ = __webpack_require__(2);

module.exports = {
  get_met_label_loc: get_met_label_loc,
  new_reaction: new_reaction,
  rotate_nodes: rotate_nodes,
  move_node_and_dependents: move_node_and_dependents,
  new_text_label: new_text_label,
  bezier_id_for_segment_id: bezier_id_for_segment_id,
  bezier_ids_for_reaction_ids: bezier_ids_for_reaction_ids,
  new_beziers_for_segments: new_beziers_for_segments,
  new_beziers_for_reactions: new_beziers_for_reactions
};

function _get_label_loc(angle) {
  if (Math.abs(angle) > Math.PI) {
    throw new Error('Angle must be between -PI and PI');
  }
  if (Math.abs(angle) < Math.PI / 7 || Math.abs(angle - Math.PI) < Math.PI / 7) {
    // Close to 0 or PI
    return { x: -50, y: -40 };
  } else if (angle > 0) {
    // Bottom quadrants
    return {
      x: 15 * (1 - Math.abs(angle - Math.PI / 2) / (Math.PI / 2)),
      y: 10 + (angle - Math.PI / 2) * 50
    };
  } else {
    // Top quadrants
    return {
      x: 15 * (1 - Math.abs(angle + Math.PI / 2) / (Math.PI / 2)),
      y: 10 - (Math.abs(angle) - Math.PI / 2) * 50
    };
  }
}

function get_met_label_loc(angle, index, count, is_primary, bigg_id, primary_index) {
  var width = bigg_id.length * 18;
  var left_right = index - (index > primary_index) - count / 2 >= -1;
  if (Math.abs(angle) < Math.PI / 7) {
    // Close to 0
    if (is_primary || left_right) {
      // Primary or bottom
      return { x: -width * 0.3, y: 40 };
    } else {
      // Top
      return { x: -width * 0.3, y: -20 };
    }
  } else if (Math.abs(angle - Math.PI) < Math.PI / 7) {
    // Close to PI
    if (is_primary || !left_right) {
      // Primary or bottom
      return { x: -width * 0.3, y: 40 };
    } else {
      // Top
      return { x: -width * 0.3, y: -20 };
    }
  } else {
    if (is_primary) {
      // Primary
      return {
        x: 25 - 38 * Math.abs(Math.abs(angle) - Math.PI / 2),
        y: (Math.abs(angle) - Math.PI / 2) * ((angle > 0) * 2 - 1) * 50
      };
    } else if (angle < 0 && left_right || angle > 0 && !left_right) {
      // Right
      return { x: 15, y: 0 };
    } else {
      // Left
      return { x: -width * 0.5, y: 30 };
    }
  }
}

/**
 * New reaction.
 * @param {Number} angle - clockwise from 'right', in degrees
 */
function new_reaction(bigg_id, cobra_reaction, cobra_metabolites, selected_node_id, selected_node, largest_ids, cofactors, angle) {
  // Convert to radians, and force to domain - PI/2 to PI/2
  angle = utils.to_radians_norm(angle);

  // Generate a new integer id
  var new_reaction_id = String(++largest_ids.reactions);

  // Calculate coordinates of reaction
  var selected_node_coords = { x: selected_node.x,
    y: selected_node.y

    // Rotate main axis around angle with distance
  };var reaction_length = 350;
  var main_axis = [selected_node_coords, utils.c_plus_c(selected_node_coords, { x: reaction_length, y: 0 })];
  var center = {
    x: (main_axis[0].x + main_axis[1].x) / 2,
    y: (main_axis[0].y + main_axis[1].y) / 2

    // Relative label location
  };var label_d = _get_label_loc(angle);

  // Relative anchor node distance
  var anchor_distance = 20;

  // New reaction structure
  var new_reaction = {
    name: cobra_reaction.name,
    bigg_id: cobra_reaction.bigg_id,
    reversibility: cobra_reaction.reversibility,
    gene_reaction_rule: cobra_reaction.gene_reaction_rule,
    genes: utils.clone(cobra_reaction.genes),
    metabolites: utils.clone(cobra_reaction.metabolites)
  };
  utils.extend(new_reaction, {
    label_x: center.x + label_d.x,
    label_y: center.y + label_d.y,
    segments: {}
  });

  // Set primary metabolites and count reactants/products

  // Look for the selected metabolite, and record the indices
  var reactant_ranks = [];
  var product_ranks = [];
  var reactant_count = 0;
  var product_count = 0;
  var reaction_is_reversed = false;
  for (var met_bigg_id in new_reaction.metabolites) {
    // Make the metabolites into objects
    var metabolite = cobra_metabolites[met_bigg_id];
    var coefficient = new_reaction.metabolites[met_bigg_id];
    var formula = metabolite.formula;
    var new_metabolite = {
      coefficient: coefficient,
      bigg_id: met_bigg_id,
      name: metabolite.name
    };
    if (coefficient < 0) {
      new_metabolite.index = reactant_count;
      // score the metabolites. Infinity == selected, >= 1 == carbon containing
      var carbons = /C([0-9]+)/.exec(formula);
      if (selected_node.bigg_id === new_metabolite.bigg_id) {
        reactant_ranks.push([new_metabolite.index, Infinity]);
      } else if (carbons && cofactors.indexOf(utils.decompartmentalize(new_metabolite.bigg_id)[0]) === -1) {
        reactant_ranks.push([new_metabolite.index, parseInt(carbons[1])]);
      }
      reactant_count++;
    } else {
      new_metabolite.index = product_count;
      var carbons = /C([0-9]+)/.exec(formula);
      if (selected_node.bigg_id === new_metabolite.bigg_id) {
        product_ranks.push([new_metabolite.index, Infinity]);
        reaction_is_reversed = true;
      } else if (carbons && cofactors.indexOf(utils.decompartmentalize(new_metabolite.bigg_id)[0]) === -1) {
        product_ranks.push([new_metabolite.index, parseInt(carbons[1])]);
      }
      product_count++;
    }
    new_reaction.metabolites[met_bigg_id] = new_metabolite;
  }

  // get the rank with the highest score
  var max_rank = function max_rank(old, current) {
    return current[1] > old[1] ? current : old;
  };
  var primary_reactant_index = reactant_ranks.reduce(max_rank, [0, 0])[0];
  var primary_product_index = product_ranks.reduce(max_rank, [0, 0])[0];

  // set primary metabolites, and keep track of the total counts
  for (var met_bigg_id in new_reaction.metabolites) {
    var metabolite = new_reaction.metabolites[met_bigg_id];
    if (metabolite.coefficient < 0) {
      metabolite.is_primary = metabolite.index === primary_reactant_index;
      metabolite.count = reactant_count;
    } else {
      metabolite.is_primary = metabolite.index === primary_product_index;
      metabolite.count = product_count;
    }
  }

  // generate anchor nodes
  var new_anchors = {};
  var anchors = [{ node_type: 'anchor_reactants',
    dis: { x: anchor_distance * (reaction_is_reversed ? 1 : -1), y: 0 } }, { node_type: 'center',
    dis: { x: 0, y: 0 } }, { node_type: 'anchor_products',
    dis: { x: anchor_distance * (reaction_is_reversed ? -1 : 1), y: 0 } }],
      anchor_ids = {};
  anchors.map(function (n) {
    var new_id = String(++largest_ids.nodes);
    var general_node_type = n.node_type === 'center' ? 'midmarker' : 'multimarker';
    new_anchors[new_id] = {
      node_type: general_node_type,
      x: center.x + n.dis.x,
      y: center.y + n.dis.y,
      connected_segments: [],
      name: null,
      bigg_id: null,
      label_x: null,
      label_y: null,
      node_is_primary: null,
      data: null
    };
    anchor_ids[n.node_type] = new_id;
  });

  // add the segments, outside to inside
  var new_anchor_groups = [[anchor_ids['anchor_reactants'], anchor_ids['center'], 'reactants'], [anchor_ids['anchor_products'], anchor_ids['center'], 'products']];
  new_anchor_groups.map(function (l) {
    var from_id = l[0];
    var to_id = l[1];
    var new_segment_id = String(++largest_ids.segments);
    var unconnected_seg = reactant_count === 0 && l[2] === 'reactants' && new_reaction.reversibility || product_count === 0 && l[2] === 'products';
    new_reaction.segments[new_segment_id] = {
      b1: null,
      b2: null,
      from_node_id: from_id,
      to_node_id: to_id,
      from_node_coefficient: null,
      to_node_coefficient: null,
      reversibility: new_reaction.reversibility,
      data: new_reaction.data,
      reverse_flux: new_reaction.reverse_flux,
      unconnected_segment_with_arrow: unconnected_seg
    };
    new_anchors[from_id].connected_segments.push({ segment_id: new_segment_id,
      reaction_id: new_reaction_id });
    new_anchors[to_id].connected_segments.push({ segment_id: new_segment_id,
      reaction_id: new_reaction_id });
  });

  // Add the metabolites, keeping track of total reactants and products.
  var new_nodes = new_anchors;
  for (var met_bigg_id in new_reaction.metabolites) {
    var metabolite = new_reaction.metabolites[met_bigg_id];
    var primary_index;
    var from_node_id;
    if (metabolite.coefficient < 0) {
      primary_index = primary_reactant_index;
      from_node_id = anchor_ids['anchor_reactants'];
    } else {
      primary_index = primary_product_index;
      from_node_id = anchor_ids['anchor_products'];
    }

    // calculate coordinates of metabolite components
    var met_loc = calculate_new_metabolite_coordinates(metabolite, primary_index, main_axis, center, reaction_length, reaction_is_reversed);

    // if this is the existing metabolite
    if (selected_node.bigg_id === metabolite.bigg_id) {
      var new_segment_id = String(++largest_ids.segments);
      new_reaction.segments[new_segment_id] = {
        b1: met_loc.b1,
        b2: met_loc.b2,
        from_node_id: from_node_id,
        to_node_id: selected_node_id,
        from_node_coefficient: null,
        to_node_coefficient: metabolite.coefficient,
        reversibility: new_reaction.reversibility
        // Update the existing node
      };selected_node.connected_segments.push({
        segment_id: new_segment_id,
        reaction_id: new_reaction_id
      });
      new_nodes[from_node_id].connected_segments.push({
        segment_id: new_segment_id,
        reaction_id: new_reaction_id
      });
    } else {
      // save new metabolite
      var new_segment_id = String(++largest_ids.segments);
      var new_node_id = String(++largest_ids.nodes);
      new_reaction.segments[new_segment_id] = {
        b1: met_loc.b1,
        b2: met_loc.b2,
        from_node_id: from_node_id,
        to_node_id: new_node_id,
        from_node_coefficient: null,
        to_node_coefficient: metabolite.coefficient,
        reversibility: new_reaction.reversibility
        // save new node
      };var met_label_d = get_met_label_loc(angle, metabolite.index, metabolite.count, metabolite.is_primary, metabolite.bigg_id, primary_index);
      new_nodes[new_node_id] = {
        connected_segments: [{ segment_id: new_segment_id,
          reaction_id: new_reaction_id }],
        x: met_loc.circle.x,
        y: met_loc.circle.y,
        node_is_primary: metabolite.is_primary,
        label_x: met_loc.circle.x + met_label_d.x,
        label_y: met_loc.circle.y + met_label_d.y,
        name: metabolite.name,
        bigg_id: metabolite.bigg_id,
        node_type: 'metabolite'
      };
      new_nodes[from_node_id].connected_segments.push({
        segment_id: new_segment_id,
        reaction_id: new_reaction_id
      });
    }
  }

  // now take out the extra reaction details
  var metabolites_array = [];
  for (var bigg_id in new_reaction.metabolites) {
    metabolites_array.push({
      bigg_id: bigg_id,
      coefficient: new_reaction.metabolites[bigg_id].coefficient
    });
  }
  new_reaction.metabolites = metabolites_array;

  // new_reactions object
  var new_reactions = {};
  new_reactions[new_reaction_id] = new_reaction;

  // new_beziers object
  var new_beziers = new_beziers_for_reactions(new_reactions);

  // add the selected node for rotation, and return it as a new (updated) node
  new_nodes[selected_node_id] = selected_node;
  rotate_nodes(new_nodes, new_reactions, new_beziers, angle, selected_node_coords);

  return { new_reactions: new_reactions,
    new_beziers: new_beziers,
    new_nodes: new_nodes };
}

/**
 * Rotate the nodes around center.
 * selected_nodes: Nodes to rotate.
 * reactions: Only updates beziers for these reactions.
 * beziers: Also update the bezier points.
 * angle: Angle to rotate in radians.
 * center: Point to rotate around.
 */
function rotate_nodes(selected_nodes, reactions, beziers, angle, center) {
  var rotate_around = function rotate_around(coord) {
    if (coord === null) {
      return null;
    }
    return utils.rotate_coords(coord, angle, center);
  };

  // recalculate: node
  var updated_node_ids = [],
      updated_reaction_ids = [];
  for (var node_id in selected_nodes) {
    var node = selected_nodes[node_id],

    // rotation distance
    displacement = rotate_around({ x: node.x, y: node.y }),

    // move the node
    updated = move_node_and_labels(node, reactions, displacement);
    // move the bezier points
    node.connected_segments.map(function (segment_obj) {
      var reaction = reactions[segment_obj.reaction_id];
      // If the reaction was not passed in the reactions argument, then ignore
      if (reaction === undefined) return;

      // rotate the beziers
      var segment_id = segment_obj.segment_id;
      var segment = reaction.segments[segment_id];
      if (segment.to_node_id == node_id && segment.b2) {
        var displacement = rotate_around(segment.b2);
        var bez_id = bezier_id_for_segment_id(segment_id, 'b2');
        segment.b2 = utils.c_plus_c(segment.b2, displacement);
        beziers[bez_id].x = segment.b2.x;
        beziers[bez_id].y = segment.b2.y;
      } else if (segment.from_node_id == node_id && segment.b1) {
        var displacement = rotate_around(segment.b1);
        var bez_id = bezier_id_for_segment_id(segment_id, 'b1');
        segment.b1 = utils.c_plus_c(segment.b1, displacement);
        beziers[bez_id].x = segment.b1.x;
        beziers[bez_id].y = segment.b1.y;
      }
    });

    updated_reaction_ids = utils.unique_concat([updated_reaction_ids, updated.reaction_ids]);
    updated_node_ids.push(node_id);
  }

  return { node_ids: updated_node_ids,
    reaction_ids: updated_reaction_ids };
}

/**
 * Move the node and its labels and beziers.
 */
function move_node_and_dependents(node, node_id, reactions, beziers, displacement) {
  var updated = move_node_and_labels(node, reactions, displacement);

  // move beziers
  node.connected_segments.map(function (segment_obj) {
    var reaction = reactions[segment_obj.reaction_id];
    // If the reaction was not passed in the reactions argument, then ignore
    if (_.isUndefined(reaction)) return;

    // Update beziers
    var segment_id = segment_obj.segment_id;
    var segment = reaction.segments[segment_id];
    var cs = [['b1', 'from_node_id'], ['b2', 'to_node_id']];
    cs.forEach(function (c) {
      var bez = c[0];
      var node = c[1];
      if (segment[node] === node_id && segment[bez]) {
        segment[bez] = utils.c_plus_c(segment[bez], displacement);
        var tbez = beziers[bezier_id_for_segment_id(segment_id, bez)];
        tbez.x = segment[bez].x;
        tbez.y = segment[bez].y;
      }
    });

    // add to list of updated reaction ids if it isn't already there
    if (updated.reaction_ids.indexOf(segment_obj.reaction_id) < 0) {
      updated.reaction_ids.push(segment_obj.reaction_id);
    }
  });
  return updated;
}

function move_node_and_labels(node, reactions, displacement) {
  node.x = node.x + displacement.x;
  node.y = node.y + displacement.y;

  // recalculate: node label
  node.label_x = node.label_x + displacement.x;
  node.label_y = node.label_y + displacement.y;

  // recalculate: reaction label
  var updated_reaction_ids = [];
  node.connected_segments.map(function (segment_obj) {
    var reaction = reactions[segment_obj.reaction_id];
    // add to list of updated reaction ids if it isn't already there
    if (updated_reaction_ids.indexOf(segment_obj.reaction_id) < 0) {
      updated_reaction_ids.push(segment_obj.reaction_id);

      // update reaction label (but only once per reaction
      if (node.node_type == 'midmarker') {
        reaction.label_x = reaction.label_x + displacement.x;
        reaction.label_y = reaction.label_y + displacement.y;
      }
    }
  });
  return { reaction_ids: updated_reaction_ids };
}

/**
 * Calculate the distance of mets from main reaction axis.
 * @param {Number} w - Scaling factor
 * @param {Number} draw_at_index - Index of metabolite
 * @param {Number} num_slots - Number of metabolites
 */
function _met_index_disp(w, draw_at_index, num_slots) {
  var half = Math.floor(num_slots / 2);
  return w * (draw_at_index - half + (draw_at_index >= half));
}

function _met_secondary_disp(secondary_w, secondary_dis, draw_at_index, num_slots) {
  var half = Math.floor(num_slots / 2);
  return secondary_dis + Math.abs(draw_at_index - half + (draw_at_index >= half)) * secondary_w;
}

/**
 * Calculate metabolite coordinates for a new reaction metabolite.
 */
function calculate_new_metabolite_coordinates(met, primary_index, main_axis, center, dis, is_reversed) {
  // new local coordinate system
  var displacement = main_axis[0];
  main_axis = [utils.c_minus_c(main_axis[0], displacement), utils.c_minus_c(main_axis[1], displacement)];
  center = utils.c_minus_c(center, displacement);

  // Curve parameters
  var w = 80; // distance between reactants and between products
  var b1_strength = 0.4;
  var b2_strength = 0.25;
  var w2 = w * 0.3; // bezier target poin
  var secondary_dis = 50; // y distance of first secondary mets
  var secondary_w = 20; // y distance of each other secondary met

  // Secondary mets
  var num_slots = met.count - 1;

  // Size and spacing for primary and secondary metabolites
  var ds;
  var draw_at_index;
  var r;
  if (met.is_primary) {
    // primary
    ds = 20;
  } else {
    // secondary
    ds = 10;
    // don't use center slot
    if (met.index > primary_index) draw_at_index = met.index - 1;else draw_at_index = met.index;
  }

  var de = dis - ds; // distance between ends of line axis
  var reaction_axis = [{ x: ds, y: 0 }, { x: de, y: 0 }];

  // Define line parameters and axis.
  // Begin with unrotated coordinate system. +y = Down, +x = Right.
  var end;
  var circle;
  var b1;
  var b2;

  // Reactants
  if (met.coefficient < 0 !== is_reversed && met.is_primary) {
    // Ali == BADASS
    end = {
      x: reaction_axis[0].x,
      y: reaction_axis[0].y
    };
    b1 = {
      x: center.x * (1 - b1_strength) + reaction_axis[0].x * b1_strength,
      y: center.y * (1 - b1_strength) + reaction_axis[0].y * b1_strength
    };
    b2 = {
      x: center.x * b2_strength + end.x * (1 - b2_strength),
      y: center.y * b2_strength + end.y * (1 - b2_strength)
    };
    circle = {
      x: main_axis[0].x,
      y: main_axis[0].y
    };
  } else if (met.coefficient < 0 !== is_reversed) {
    end = {
      x: reaction_axis[0].x + _met_secondary_disp(secondary_w, secondary_dis, draw_at_index, num_slots),
      y: reaction_axis[0].y + _met_index_disp(w2, draw_at_index, num_slots)
    };
    b1 = {
      x: center.x * (1 - b1_strength) + reaction_axis[0].x * b1_strength,
      y: center.y * (1 - b1_strength) + reaction_axis[0].y * b1_strength
    };
    b2 = {
      x: center.x * b2_strength + end.x * (1 - b2_strength),
      y: center.y * b2_strength + end.y * (1 - b2_strength)
    };
    circle = {
      x: main_axis[0].x + _met_secondary_disp(secondary_w, secondary_dis, draw_at_index, num_slots),
      y: main_axis[0].y + _met_index_disp(w, draw_at_index, num_slots)
    };
  } else if (met.coefficient > 0 !== is_reversed && met.is_primary) {
    // products
    end = {
      x: reaction_axis[1].x,
      y: reaction_axis[1].y
    };
    b1 = {
      x: center.x * (1 - b1_strength) + reaction_axis[1].x * b1_strength,
      y: center.y * (1 - b1_strength) + reaction_axis[1].y * b1_strength
    };
    b2 = {
      x: center.x * b2_strength + end.x * (1 - b2_strength),
      y: center.y * b2_strength + end.y * (1 - b2_strength)
    };
    circle = {
      x: main_axis[1].x,
      y: main_axis[1].y
    };
  } else if (met.coefficient > 0 !== is_reversed) {
    end = {
      x: reaction_axis[1].x - _met_secondary_disp(secondary_w, secondary_dis, draw_at_index, num_slots),
      y: reaction_axis[1].y + _met_index_disp(w2, draw_at_index, num_slots)
    };
    b1 = {
      x: center.x * (1 - b1_strength) + reaction_axis[1].x * b1_strength,
      y: center.y * (1 - b1_strength) + reaction_axis[1].y * b1_strength
    };
    b2 = {
      x: center.x * b2_strength + end.x * (1 - b2_strength),
      y: center.y * b2_strength + end.y * (1 - b2_strength)
    };
    circle = {
      x: main_axis[1].x - _met_secondary_disp(secondary_w, secondary_dis, draw_at_index, num_slots),
      y: main_axis[1].y + _met_index_disp(w, draw_at_index, num_slots)
    };
  }

  return {
    b1: utils.c_plus_c(displacement, b1),
    b2: utils.c_plus_c(displacement, b2),
    circle: utils.c_plus_c(displacement, circle)
  };
}

function new_text_label(largest_ids, text, coords) {
  var new_id = String(++largest_ids.text_labels);
  var new_label = { text: text, x: coords.x, y: coords.y };
  return { id: new_id, label: new_label };
}

function bezier_id_for_segment_id(segment_id, bez) {
  return segment_id + '_' + bez;
}

/**
 * Return an array of beziers ids for the array of reaction ids.
 * @param {Object} reactions - A reactions object, e.g. a subset of
 * *escher.Map.reactions*.
 */
function bezier_ids_for_reaction_ids(reactions) {
  var bezier_ids = [];
  for (var reaction_id in reactions) {
    var reaction = reactions[reaction_id];

    for (var segment_id in reaction.segments) {
      var segment = reaction.segments[segment_id];

      var bezs = ['b1', 'b2'];
      bezs.forEach(function (bez) {
        var seg_bez = segment[bez];
        if (seg_bez !== null) {
          bezier_ids.push(bezier_id_for_segment_id(segment_id, bez));
        }
      });
    }
  }
  return bezier_ids;
}

/**
 * Return an object containing beziers for the segments object.
 * segments: A segments object, e.g. *escher.Map.segments*.
 * reaction_id: The reaction id for the segments.
 */
function new_beziers_for_segments(segments, reaction_id) {
  var beziers = {};
  for (var segment_id in segments) {
    var segment = segments[segment_id];['b1', 'b2'].forEach(function (bez) {
      var seg_bez = segment[bez];
      if (seg_bez !== null) {
        var bezier_id = bezier_id_for_segment_id(segment_id, bez);
        beziers[bezier_id] = {
          bezier: bez,
          x: seg_bez.x,
          y: seg_bez.y,
          reaction_id: reaction_id,
          segment_id: segment_id
        };
      }
    });
  }
  return beziers;
}

/**
 * Return an object containing beziers for the reactions object.
 * @param {Object} reactions - A reactions object, e.g. *escher.Map.reactions*.
 */
function new_beziers_for_reactions(reactions) {
  var beziers = {};
  for (var reaction_id in reactions) {
    var reaction = reactions[reaction_id];

    var these = new_beziers_for_segments(reaction.segments, reaction_id);
    utils.extend(beziers, these);
  }
  return beziers;
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("d3-scale");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("baconjs");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("mocha");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * CobraModel
 */

var utils = __webpack_require__(0);
var data_styles = __webpack_require__(4);

var CobraModel = utils.make_class();
// class methods
CobraModel.from_cobra_json = from_cobra_json;
CobraModel.build_reaction_string = build_reaction_string;
// instance methods
CobraModel.prototype = {
  init: init,
  apply_reaction_data: apply_reaction_data,
  apply_metabolite_data: apply_metabolite_data,
  apply_gene_data: apply_gene_data
};
module.exports = CobraModel;

// class methods

/**
 * Return a reaction string for the given stoichiometries. Adapted from
 * cobra.core.Reaction.build_reaction_string().
 * @param {Object} stoichiometries - An object with metabolites as keys and
 * stoichiometries as values.
 * @param {Boolean} is_reversible - Whether the reaction is reversible.
 */
function build_reaction_string(stoichiometries, is_reversible) {
  var format = function format(number) {
    if (number == 1) {
      return '';
    }
    return String(number) + ' ';
  };
  var reactant_dict = {};
  var product_dict = {};
  var reactant_bits = [];
  var product_bits = [];
  for (var the_metabolite in stoichiometries) {
    var coefficient = stoichiometries[the_metabolite];
    if (coefficient > 0) product_bits.push(format(coefficient) + the_metabolite);else reactant_bits.push(format(Math.abs(coefficient)) + the_metabolite);
  }
  var reaction_string = reactant_bits.join(' + ');
  if (is_reversible) {
    reaction_string += ' ↔ ';
  } else {
    reaction_string += ' → ';
  }
  reaction_string += product_bits.join(' + ');
  return reaction_string;
}

function from_cobra_json(model_data) {
  /** Use a JSON Cobra model exported by COBRApy to make a new CobraModel
      object.
       The COBRA "id" becomes a "bigg_id", and "upper_bound" and "lower_bound"
      bounds become "reversibility".
       Fills out a "genes" list.
   */
  // reactions and metabolites
  if (!(model_data.reactions && model_data.metabolites)) {
    throw new Error('Bad model data.');
  }

  // make a gene dictionary
  var genes = {};
  for (var i = 0, l = model_data.genes.length; i < l; i++) {
    var r = model_data.genes[i],
        the_id = r.id;
    genes[the_id] = r;
  }

  var model = new CobraModel();

  model.reactions = {};
  for (var i = 0, l = model_data.reactions.length; i < l; i++) {
    var r = model_data.reactions[i];
    var the_id = r.id;
    var reaction = utils.clone(r);
    delete reaction.id;
    reaction.bigg_id = the_id;
    reaction.data_string = '';
    // add the appropriate genes
    reaction.genes = [];

    // set reversibility
    reaction.reversibility = reaction.lower_bound < 0 && reaction.upper_bound > 0;
    if (reaction.upper_bound <= 0 && reaction.lower_bound < 0) {
      // reverse stoichiometries
      for (var met_id in reaction.metabolites) {
        reaction.metabolites[met_id] = -reaction.metabolites[met_id];
      }
    }
    delete reaction.lower_bound;
    delete reaction.upper_bound;

    if ('gene_reaction_rule' in reaction) {
      var gene_ids = data_styles.genes_for_gene_reaction_rule(reaction.gene_reaction_rule);
      gene_ids.forEach(function (gene_id) {
        if (gene_id in genes) {
          var gene = utils.clone(genes[gene_id]);
          // rename id to bigg_id
          gene.bigg_id = gene.id;
          delete gene.id;
          reaction.genes.push(gene);
        } else {
          console.warn('Could not find gene for gene_id ' + gene_id);
        }
      });
    }
    model.reactions[the_id] = reaction;
  }
  model.metabolites = {};
  for (var i = 0, l = model_data.metabolites.length; i < l; i++) {
    var r = model_data.metabolites[i];
    var the_id = r.id;
    var met = utils.clone(r);
    delete met.id;
    met.bigg_id = the_id;
    model.metabolites[the_id] = met;
  }
  return model;
}

// instance methods
function init() {
  this.reactions = {};
  this.metabolites = {};
}

/**
 * Apply data to model. This is only used to display options in
 * BuildInput. apply_reaction_data overrides apply_gene_data.
 */
function apply_reaction_data(reaction_data, styles, compare_style) {
  data_styles.apply_reaction_data_to_reactions(this.reactions, reaction_data, styles, compare_style);
}

/**
 * Apply data to model. This is only used to display options in BuildInput.
 */
function apply_metabolite_data(metabolite_data, styles, compare_style) {
  data_styles.apply_metabolite_data_to_nodes(this.metabolites, metabolite_data, styles, compare_style);
}

/**
 * Apply data to model. This is only used to display options in
 * BuildInput. Overrides apply_reaction_data.
 */
function apply_gene_data(gene_data_obj, styles, identifiers_on_map, compare_style, and_method_in_gene_reaction_rule) {
  data_styles.apply_gene_data_to_reactions(this.reactions, gene_data_obj, styles, identifiers_on_map, compare_style, and_method_in_gene_reaction_rule);
}

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("d3-brush");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("tinier");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Builder = __webpack_require__(18);

var d3_body = __webpack_require__(51);

// Should test for the broken function that use utils.draw_array/object

var get_map = __webpack_require__(55);
var get_model = __webpack_require__(56);

var describe = __webpack_require__(13).describe;
var it = __webpack_require__(13).it;
var mocha = __webpack_require__(13);
var assert = __webpack_require__(57);

function make_parent_sel(s) {
  return s.append('div').style('width', '100px').style('height', '100px');
}

describe('Builder', function () {
  it('Small map, no model. Multiple instances.', function () {
    var sels = [];
    for (var i = 0, l = 3; i < l; i++) {
      var sel = make_parent_sel(d3_body);
      var b = Builder(get_map(), null, '', sel, { never_ask_before_quit: true });

      assert.strictEqual(sel.select('svg').node(), b.map.svg.node());
      assert.strictEqual(sel.selectAll('#nodes').size(), 1);
      assert.strictEqual(sel.selectAll('.node').size(), 79);
      assert.strictEqual(sel.selectAll('#reactions').size(), 1);
      assert.strictEqual(sel.selectAll('.reaction').size(), 18);
      assert.strictEqual(sel.selectAll('#text-labels').size(), 1);
      sels.push(sel);
    }
    sels.map(function (sel) {
      return sel.remove();
    });
  }).timeout(10000);

  it('check for model+highlight_missing bug', function () {
    var b = Builder(get_map(), get_model(), '', make_parent_sel(d3_body), { never_ask_before_quit: true, highlight_missing: true });
  });

  it('SVG selection error', function () {
    var sel = make_parent_sel(d3_body).append('svg').append('g');
    assert.throws(function () {
      Builder(null, null, '', sel, { never_ask_before_quit: true });
    }, /Builder cannot be placed within an svg node/);
  });

  it('fix scales', function () {
    var sel = make_parent_sel(d3_body);
    var b = Builder(null, null, '', sel, { reaction_scale: [{ type: 'median', color: '#9696ff', size: 8 }],
      never_ask_before_quit: true });
    assert.deepEqual(b.options.reaction_scale, [{ type: 'median', color: '#9696ff', size: 8 }, { type: 'min', color: '#ffffff', size: 10 }, { type: 'max', color: '#ffffff', size: 10 }]);
  });

  it('fix scales after callback', function () {
    var sel = make_parent_sel(d3_body);
    var b2 = Builder(null, null, '', sel, { metabolite_scale: [{ type: 'median', color: 'red', size: 0 }, { type: 'min', color: 'red', size: 0 }, { type: 'max', color: 'red', size: 0 }],
      never_ask_before_quit: true });
    b2.settings.set_conditional('metabolite_scale', [{ type: 'median', color: '#9696ff', size: 8 }]);
    assert.deepEqual(b2.options.metabolite_scale, [{ type: 'median', color: '#9696ff', size: 8 }, { type: 'min', color: '#ffffff', size: 10 }, { type: 'max', color: '#ffffff', size: 10 }]);
  });
});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(19);

var _builderEmbed = __webpack_require__(24);

var _builderEmbed2 = _interopRequireDefault(_builderEmbed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * For documentation of this class, see docs/javascript_api.rst
 */

/* global $ */

var utils = __webpack_require__(0);
var BuildInput = __webpack_require__(28);
var ZoomContainer = __webpack_require__(31);
var Map = __webpack_require__(32);
var CobraModel = __webpack_require__(14);
var Brush = __webpack_require__(41);
var CallbackManager = __webpack_require__(3);
var ui = __webpack_require__(42);
var SearchBar = __webpack_require__(43);
var Settings = __webpack_require__(44);
var SettingsMenu = __webpack_require__(45);
var TextEditInput = __webpack_require__(47);
var QuickJump = __webpack_require__(48);
var data_styles = __webpack_require__(4);
var TooltipContainer = __webpack_require__(49);
var DefaultTooltip = __webpack_require__(50).DefaultTooltip;
var _ = __webpack_require__(2);
var d3_select = __webpack_require__(1).select;
var d3_selection = __webpack_require__(1).selection;
var d3_json = __webpack_require__(7).json;

// Include GUI CSS normally with webpack


// Import CSS as a string to embed. This also works from lib because css/src get
// uploaded to NPM.


var Builder = utils.make_class();
Builder.prototype = {
  init: init,
  load_map: load_map,
  load_model: load_model,
  _set_mode: _set_mode,
  view_mode: view_mode,
  build_mode: build_mode,
  brush_mode: brush_mode,
  zoom_mode: zoom_mode,
  rotate_mode: rotate_mode,
  text_mode: text_mode,
  _reaction_check_add_abs: _reaction_check_add_abs,
  set_reaction_data: set_reaction_data,
  set_metabolite_data: set_metabolite_data,
  set_gene_data: set_gene_data,
  _update_data: _update_data,
  _toggle_direction_buttons: _toggle_direction_buttons,
  _set_up_menu: _set_up_menu,
  _set_up_button_panel: _set_up_button_panel,
  _create_status: _create_status,
  _setup_status: _setup_status,
  _setup_quick_jump: _setup_quick_jump,
  _setup_modes: _setup_modes,
  _get_keys: _get_keys,
  _setup_confirm_before_exit: _setup_confirm_before_exit
};
module.exports = Builder;

function init(map_data, model_data, embedded_css, selection, options) {
  // Defaults
  if (!selection) {
    selection = d3_select('body').append('div');
  } else if (selection instanceof d3_selection) {
    // D3 V4 selection
  } else if ('node' in selection) {
    // If user passes in a selection from an different d3 version/instance,
    // then reselect.
    selection = d3_select(selection.node());
  } else {
    // HTML Element
    selection = d3_select(selection);
  }
  if (!options) {
    options = {};
  }
  if (!embedded_css) {
    embedded_css = _builderEmbed2.default;
  }

  this.map_data = map_data;
  this.model_data = model_data;
  this.embedded_css = embedded_css;
  this.selection = selection;

  // apply this object as data for the selection
  this.selection.datum(this);
  this.selection.__builder__ = this;

  // Remember if the user provided a custom value for reaction_styles
  this.has_custom_reaction_styles = Boolean(options.reaction_styles);

  // set defaults
  this.options = utils.set_options(options, {
    // view options
    menu: 'all',
    scroll_behavior: 'pan',
    use_3d_transform: !utils.check_browser('safari'),
    enable_editing: true,
    enable_keys: true,
    enable_search: true,
    fill_screen: false,
    zoom_to_element: null,
    full_screen_button: false,
    ignore_bootstrap: false,
    // map, model, and styles
    starting_reaction: null,
    never_ask_before_quit: false,
    unique_map_id: null,
    primary_metabolite_radius: 20,
    secondary_metabolite_radius: 10,
    marker_radius: 5,
    gene_font_size: 18,
    hide_secondary_metabolites: false,
    show_gene_reaction_rules: false,
    hide_all_labels: false,
    canvas_size_and_loc: null,
    // applied data
    // reaction
    reaction_data: null,
    reaction_styles: ['color', 'size', 'text'],
    reaction_compare_style: 'log2_fold',
    reaction_scale: [{ type: 'min', color: '#c8c8c8', size: 12 }, { type: 'median', color: '#9696ff', size: 20 }, { type: 'max', color: '#ff0000', size: 25 }],
    reaction_no_data_color: '#dcdcdc',
    reaction_no_data_size: 8,
    // gene
    gene_data: null,
    and_method_in_gene_reaction_rule: 'mean',
    // metabolite
    metabolite_data: null,
    metabolite_styles: ['color', 'size', 'text'],
    metabolite_compare_style: 'log2_fold',
    metabolite_scale: [{ type: 'min', color: '#fffaf0', size: 20 }, { type: 'median', color: '#f1c470', size: 30 }, { type: 'max', color: '#800000', size: 40 }],
    metabolite_no_data_color: '#ffffff',
    metabolite_no_data_size: 10,
    // View and build options
    identifiers_on_map: 'bigg_id',
    highlight_missing: false,
    allow_building_duplicate_reactions: false,
    cofactors: ['atp', 'adp', 'nad', 'nadh', 'nadp', 'nadph', 'gtp', 'gdp', 'h', 'coa', 'ump', 'h20', 'ppi'],
    // Extensions
    tooltip_component: DefaultTooltip,
    enable_tooltips: true,
    // Callbacks
    first_load_callback: null
  }, {
    primary_metabolite_radius: true,
    secondary_metabolite_radius: true,
    marker_radius: true,
    gene_font_size: true,
    reaction_no_data_size: true,
    metabolite_no_data_size: true
  });

  // Check the location
  if (utils.check_for_parent_tag(this.selection, 'svg')) {
    throw new Error('Builder cannot be placed within an svg node ' + 'becuase UI elements are html-based.');
  }

  // Initialize the settings
  var set_option = function (option, new_value) {
    this.options[option] = new_value;
  }.bind(this);
  var get_option = function (option) {
    return this.options[option];
  }.bind(this);
  // the options that are erased when the settings menu is canceled
  var conditional = ['hide_secondary_metabolites', 'show_gene_reaction_rules', 'hide_all_labels', 'scroll_behavior', 'reaction_styles', 'reaction_compare_style', 'reaction_scale', 'reaction_no_data_color', 'reaction_no_data_size', 'and_method_in_gene_reaction_rule', 'metabolite_styles', 'metabolite_compare_style', 'metabolite_scale', 'metabolite_no_data_color', 'metabolite_no_data_size', 'identifiers_on_map', 'highlight_missing', 'allow_building_duplicate_reactions', 'enable_tooltips'];
  this.settings = new Settings(set_option, get_option, conditional);

  // Check the scales have max and min
  var scales = ['reaction_scale', 'metabolite_scale'];
  scales.forEach(function (name) {
    this.settings.streams[name].onValue(function (val) {
      var types = ['min', 'max'];
      types.forEach(function (type) {
        var has = val.reduce(function (has_found, scale_el) {
          return has_found || scale_el.type === type;
        }, false);
        if (!has) {
          val.push({ type: type, color: '#ffffff', size: 10 });
          this.settings.set_conditional(name, val);
        }
      }.bind(this));
    }.bind(this));
  }.bind(this));
  // TODO warn about repeated types in the scale

  // Set up this callback manager
  this.callback_manager = CallbackManager();
  if (this.options.first_load_callback !== null) {
    this.callback_manager.set('first_load', this.options.first_load_callback);
  }

  // Set up the zoom container
  this.zoom_container = new ZoomContainer(this.selection, this.options.scroll_behavior, this.options.use_3d_transform, this.options.fill_screen);
  // Zoom container status changes
  this.zoom_container.callback_manager.set('svg_start', function () {
    if (this.map) this.map.set_status('Drawing ...');
  }.bind(this));
  this.zoom_container.callback_manager.set('svg_finish', function () {
    if (this.map) this.map.set_status('');
  }.bind(this));

  // Set up the tooltip container
  this.tooltip_container = new TooltipContainer(this.selection, this.options.tooltip_component, this.zoom_container);

  // Status in both modes
  this._create_status(this.selection);

  // Load the model, map, and update data in both
  this.load_model(this.model_data, false);
  this.load_map(this.map_data, false);
  var message_fn = this._reaction_check_add_abs();
  this._update_data(true, true);

  // Setting callbacks. TODO enable atomic updates. Right now, every time the
  // menu closes, everything is drawn.
  this.settings.status_bus.onValue(function (x) {
    if (x === 'accepted') {
      this._update_data(true, true, ['reaction', 'metabolite'], false);
      if (this.zoom_container !== null) {
        var new_behavior = this.settings.get_option('scroll_behavior');
        this.zoom_container.set_scroll_behavior(new_behavior);
      }
      if (this.map !== null) {
        this.map.draw_all_nodes(false);
        this.map.draw_all_reactions(true, false);
        this.map.select_none();
      }
    }
  }.bind(this));

  // Set up quick jump
  this._setup_quick_jump(this.selection);

  this.callback_manager.run('first_load', this);

  if (message_fn !== null) setTimeout(message_fn, 500);
}

/**
 * For documentation of this function, see docs/javascript_api.rst.
 */
function load_model(model_data, should_update_data) {
  if (_.isUndefined(should_update_data)) {
    should_update_data = true;
  }

  // Check the cobra model
  if (_.isNull(model_data)) {
    this.cobra_model = null;
  } else {
    this.cobra_model = CobraModel.from_cobra_json(model_data);
  }

  if (this.map) {
    this.map.cobra_model = this.cobra_model;
    if (should_update_data) {
      this._update_data(true, false);
    }
    if (this.settings.get_option('highlight_missing')) {
      this.map.draw_all_reactions(false, false);
    }
  }

  this.callback_manager.run('load_model', null, model_data, should_update_data);
}

/**
 * For documentation of this function, see docs/javascript_api.rst
 */
function load_map(map_data, should_update_data) {
  if (_.isUndefined(should_update_data)) should_update_data = true;

  // Begin with some definitions
  var selectable_mousedown_enabled = true;
  var shift_key_on = false;

  // remove the old builder
  utils.remove_child_nodes(this.zoom_container.zoomed_sel);

  var zoomed_sel = this.zoom_container.zoomed_sel;
  var svg = this.zoom_container.svg;

  // remove the old map side effects
  if (this.map) this.map.key_manager.toggle(false);

  if (map_data !== null) {
    // import map
    this.map = Map.from_data(map_data, svg, this.embedded_css, zoomed_sel, this.zoom_container, this.settings, this.cobra_model, this.options.enable_search);
  } else {
    // new map
    this.map = new Map(svg, this.embedded_css, zoomed_sel, this.zoom_container, this.settings, this.cobra_model, this.options.canvas_size_and_loc, this.options.enable_search);
  }

  // Connect status bar
  this._setup_status(this.map);

  // Set the data for the map
  if (should_update_data) this._update_data(false, true);

  // Set up the reaction input with complete.ly
  this.build_input = new BuildInput(this.selection, this.map, this.zoom_container, this.settings);

  // Set up the text edit input
  this.text_edit_input = new TextEditInput(this.selection, this.map, this.zoom_container);

  // Connect the tooltip
  this.tooltip_container.setup_map_callbacks(this.map);

  // Set up the Brush
  this.brush = new Brush(zoomed_sel, false, this.map, '.canvas-group');
  this.map.canvas.callback_manager.set('resize', function () {
    this.brush.toggle(true);
  }.bind(this));

  // Set up the modes
  this._setup_modes(this.map, this.brush, this.zoom_container);

  var s = this.selection.append('div').attr('class', 'search-menu-container').append('div').attr('class', 'search-menu-container-inline');
  var menu_div = s.append('div');
  var search_bar_div = s.append('div');
  var button_div = this.selection.append('div');

  // Set up the search bar
  this.search_bar = new SearchBar(search_bar_div, this.map.search_index, this.map);
  // Set up the hide callbacks
  this.search_bar.callback_manager.set('show', function () {
    this.settings_bar.toggle(false);
  }.bind(this));

  // Set up the settings
  var settings_div = this.selection.append('div');
  var settings_cb = function (type, on_off) {
    // Temporarily set the abs type, for previewing it in the Settings menu
    var o = this.options[type + '_styles'];
    if (on_off && o.indexOf('abs') === -1) {
      o.push('abs');
    } else if (!on_off) {
      var i = o.indexOf('abs');
      if (i !== -1) {
        this.options[type + '_styles'] = o.slice(0, i).concat(o.slice(i + 1));
      }
    }
    this._update_data(false, true, type);
  }.bind(this);
  this.settings_bar = new SettingsMenu(settings_div, this.settings, this.map, settings_cb);

  this.settings_bar.callback_manager.set('show', function () {
    this.search_bar.toggle(false);
  }.bind(this));

  // Set up key manager
  var keys = this._get_keys(this.map, this.zoom_container, this.search_bar, this.settings_bar, this.options.enable_editing, this.options.full_screen_button);
  this.map.key_manager.assigned_keys = keys;
  // Tell the key manager about the reaction input and search bar
  this.map.key_manager.input_list = [this.build_input, this.search_bar, this.settings_bar, this.text_edit_input];
  // Make sure the key manager remembers all those changes
  this.map.key_manager.update();
  // Turn it on/off
  this.map.key_manager.toggle(this.options.enable_keys);

  // Set up menu and status bars
  if (this.options.menu === 'all') {
    if (this.options.ignore_bootstrap) {
      console.error('Cannot create the dropdown menus if ignore_bootstrap = true');
    } else {
      this._set_up_menu(menu_div, this.map, this.map.key_manager, keys, this.options.enable_editing, this.options.enable_keys, this.options.full_screen_button);
    }
  }

  this._set_up_button_panel(button_div, keys, this.options.enable_editing, this.options.enable_keys, this.options.full_screen_button, this.options.menu, this.options.ignore_bootstrap);

  // Setup selection box
  if (this.options.zoom_to_element) {
    var type = this.options.zoom_to_element.type,
        element_id = this.options.zoom_to_element.id;
    if (_.isUndefined(type) || ['reaction', 'node'].indexOf(type) === -1) {
      throw new Error('zoom_to_element type must be "reaction" or "node"');
    }
    if (_.isUndefined(element_id)) {
      throw new Error('zoom_to_element must include id');
    }
    if (type === 'reaction') {
      this.map.zoom_to_reaction(element_id);
    } else if (type === 'node') {
      this.map.zoom_to_node(element_id);
    }
  } else if (map_data !== null) {
    this.map.zoom_extent_canvas();
  } else {
    if (this.options.starting_reaction !== null && this.cobra_model !== null) {
      // Draw default reaction if no map is provided
      var size = this.zoom_container.get_size();
      var start_coords = { x: size.width / 2, y: size.height / 4 };
      this.map.new_reaction_from_scratch(this.options.starting_reaction, start_coords, 90);
      this.map.zoom_extent_nodes();
    } else {
      this.map.zoom_extent_canvas();
    }
  }

  // Start in zoom mode for builder, view mode for viewer
  if (this.options.enable_editing) {
    this.zoom_mode();
  } else {
    this.view_mode();
  }

  // confirm before leaving the page
  if (this.options.enable_editing) {
    this._setup_confirm_before_exit();
  }

  // draw
  this.map.draw_everything();
}

function _set_mode(mode) {
  this.search_bar.toggle(false);
  // input
  this.build_input.toggle(mode == 'build');
  this.build_input.direction_arrow.toggle(mode == 'build');
  if (this.options.menu == 'all' && this.options.enable_editing) {
    this._toggle_direction_buttons(mode == 'build');
  }
  // brush
  this.brush.toggle(mode == 'brush');
  // zoom
  this.zoom_container.toggle_pan_drag(mode == 'zoom' || mode == 'view');
  // resize canvas
  this.map.canvas.toggle_resize(mode == 'zoom' || mode == 'brush');
  // Behavior. Be careful of the order becuase rotation and
  // toggle_selectable_drag both use Behavior.selectable_drag.
  if (mode == 'rotate') {
    this.map.behavior.toggle_selectable_drag(false); // before toggle_rotation_mode
    this.map.behavior.toggle_rotation_mode(true);
  } else {
    this.map.behavior.toggle_rotation_mode(mode == 'rotate'); // before toggle_selectable_drag
    this.map.behavior.toggle_selectable_drag(mode == 'brush');
  }
  this.map.behavior.toggle_selectable_click(mode == 'build' || mode == 'brush');
  this.map.behavior.toggle_label_drag(mode == 'brush');
  this.map.behavior.toggle_label_mouseover(true);
  this.map.behavior.toggle_text_label_edit(mode == 'text');
  this.map.behavior.toggle_bezier_drag(mode == 'brush');
  // edit selections
  if (mode == 'view' || mode == 'text') this.map.select_none();
  if (mode == 'rotate') this.map.deselect_text_labels();
  this.map.draw_everything();
}

function view_mode() {
  /** For documentation of this function, see docs/javascript_api.rst.
    */
  this.callback_manager.run('view_mode');
  this._set_mode('view');
}

function build_mode() {
  /** For documentation of this function, see docs/javascript_api.rst.
    */
  this.callback_manager.run('build_mode');
  this._set_mode('build');
}

function brush_mode() {
  /** For documentation of this function, see docs/javascript_api.rst.
    */
  this.callback_manager.run('brush_mode');
  this._set_mode('brush');
}

function zoom_mode() {
  /** For documentation of this function, see docs/javascript_api.rst.
    */
  this.callback_manager.run('zoom_mode');
  this._set_mode('zoom');
}

function rotate_mode() {
  /** For documentation of this function, see docs/javascript_api.rst.
    */
  this.callback_manager.run('rotate_mode');
  this._set_mode('rotate');
}

function text_mode() {
  /** For documentation of this function, see docs/javascript_api.rst.
    */
  this.callback_manager.run('text_mode');
  this._set_mode('text');
}

function _reaction_check_add_abs() {
  var curr_style = this.options.reaction_styles;
  var did_abs = false;
  if (this.options.reaction_data !== null && !this.has_custom_reaction_styles && !_.contains(curr_style, 'abs')) {
    this.settings.set_conditional('reaction_styles', curr_style.concat('abs'));
    return function () {
      this.map.set_status('Visualizing absolute value of reaction data. ' + 'Change this option in Settings.', 5000);
    }.bind(this);
  }
  return null;
}

/**
 * For documentation of this function, see docs/javascript_api.rst.
 */
function set_reaction_data(data) {
  this.options.reaction_data = data;
  var message_fn = this._reaction_check_add_abs();
  this._update_data(true, true, 'reaction');
  if (message_fn) {
    message_fn();
  } else {
    this.map.set_status('');
  }
}

/**
 * For documentation of this function, see docs/javascript_api.rst.
 */
function set_gene_data(data, clear_gene_reaction_rules) {
  if (clear_gene_reaction_rules) {
    // default undefined
    this.settings.set_conditional('show_gene_reaction_rules', false);
  }
  this.options.gene_data = data;
  this._update_data(true, true, 'reaction');
  this.map.set_status('');
}

function set_metabolite_data(data) {
  /** For documentation of this function, see docs/javascript_api.rst.
    */
  this.options.metabolite_data = data;
  this._update_data(true, true, 'metabolite');
  this.map.set_status('');
}

/**
 * Set data and settings for the model.
 * update_model: (Boolean) Update data for the model.
 * update_map: (Boolean) Update data for the map.
 * kind: (Optional, Default: all) An array defining which data is being updated
 * that can include any of: ['reaction', 'metabolite'].
 * should_draw: (Optional, Default: true) Whether to redraw the update sections
 * of the map.
 */
function _update_data(update_model, update_map, kind, should_draw) {
  // defaults
  if (kind === undefined) {
    kind = ['reaction', 'metabolite'];
  }
  if (should_draw === undefined) {
    should_draw = true;
  }

  var update_metabolite_data = kind.indexOf('metabolite') !== -1;
  var update_reaction_data = kind.indexOf('reaction') !== -1;
  var met_data_object;
  var reaction_data_object;
  var gene_data_object;

  // -------------------
  // First map, and draw
  // -------------------

  // metabolite data
  if (update_metabolite_data && update_map && this.map !== null) {
    met_data_object = data_styles.import_and_check(this.options.metabolite_data, 'metabolite_data');
    this.map.apply_metabolite_data_to_map(met_data_object);
    if (should_draw) {
      this.map.draw_all_nodes(false);
    }
  }

  // reaction data
  if (update_reaction_data) {
    if (this.options.reaction_data !== null && update_map && this.map !== null) {
      reaction_data_object = data_styles.import_and_check(this.options.reaction_data, 'reaction_data');
      this.map.apply_reaction_data_to_map(reaction_data_object);
      if (should_draw) this.map.draw_all_reactions(false, false);
    } else if (this.options.gene_data !== null && update_map && this.map !== null) {
      gene_data_object = make_gene_data_object(this.options.gene_data, this.cobra_model, this.map);
      this.map.apply_gene_data_to_map(gene_data_object);
      if (should_draw) this.map.draw_all_reactions(false, false);
    } else if (update_map && this.map !== null) {
      // clear the data
      this.map.apply_reaction_data_to_map(null);
      if (should_draw) this.map.draw_all_reactions(false, false);
    }
  }

  // ----------------------------------------------------------------
  // Then the model, after drawing. Delay by 5ms so the the map draws
  // first.
  // ----------------------------------------------------------------

  // If this function runs again, cancel the previous model update
  if (this.update_model_timer) {
    clearTimeout(this.update_model_timer);
  }

  var delay = 5;
  this.update_model_timer = setTimeout(function () {

    // metabolite_data
    if (update_metabolite_data && update_model && this.cobra_model !== null) {
      // if we haven't already made this
      if (!met_data_object) {
        met_data_object = data_styles.import_and_check(this.options.metabolite_data, 'metabolite_data');
      }
      this.cobra_model.apply_metabolite_data(met_data_object, this.options.metabolite_styles, this.options.metabolite_compare_style);
    }

    // reaction data
    if (update_reaction_data) {
      if (this.options.reaction_data !== null && update_model && this.cobra_model !== null) {
        // if we haven't already made this
        if (!reaction_data_object) {
          reaction_data_object = data_styles.import_and_check(this.options.reaction_data, 'reaction_data');
        }
        this.cobra_model.apply_reaction_data(reaction_data_object, this.options.reaction_styles, this.options.reaction_compare_style);
      } else if (this.options.gene_data !== null && update_model && this.cobra_model !== null) {
        if (!gene_data_object) {
          gene_data_object = make_gene_data_object(this.options.gene_data, this.cobra_model, this.map);
        }
        this.cobra_model.apply_gene_data(gene_data_object, this.options.reaction_styles, this.options.identifiers_on_map, this.options.reaction_compare_style, this.options.and_method_in_gene_reaction_rule);
      } else if (update_model && this.cobra_model !== null) {
        // clear the data
        this.cobra_model.apply_reaction_data(null, this.options.reaction_styles, this.options.reaction_compare_style);
      }
    }

    // callback
    this.callback_manager.run('update_data', null, update_model, update_map, kind, should_draw);
  }.bind(this), delay);

  // definitions
  function make_gene_data_object(gene_data, cobra_model, map) {
    var all_reactions = {};
    if (cobra_model !== null) utils.extend(all_reactions, cobra_model.reactions);
    // extend, overwrite
    if (map !== null) utils.extend(all_reactions, map.reactions, true);

    // this object has reaction keys and values containing associated genes
    return data_styles.import_and_check(gene_data, 'gene_data', all_reactions);
  }
}

function _set_up_menu(menu_selection, map, key_manager, keys, enable_editing, enable_keys, full_screen_button, ignore_bootstrap) {
  var menu = menu_selection.attr('id', 'menu').append('ul').attr('class', 'nav nav-pills');
  // map dropdown
  ui.dropdown_menu(menu, 'Map').button({ key: keys.save,
    text: 'Save map JSON',
    key_text: enable_keys ? ' (Ctrl+S)' : null }).button({ text: 'Load map JSON',
    key_text: enable_keys ? ' (Ctrl+O)' : null,
    input: { assign: key_manager.assigned_keys.load,
      key: 'fn',
      fn: load_map_for_file.bind(this),
      pre_fn: function pre_fn() {
        map.set_status('Loading map ...');
      },
      failure_fn: function failure_fn() {
        map.set_status('');
      } }
  }).button({ key: keys.save_svg,
    text: 'Export as SVG',
    key_text: enable_keys ? ' (Ctrl+Shift+S)' : null }).button({ key: keys.save_png,
    text: 'Export as PNG',
    key_text: enable_keys ? ' (Ctrl+Shift+P)' : null }).button({ key: keys.clear_map,
    text: 'Clear map' });
  // model dropdown
  var model_menu = ui.dropdown_menu(menu, 'Model').button({ text: 'Load COBRA model JSON',
    key_text: enable_keys ? ' (Ctrl+M)' : null,
    input: { assign: key_manager.assigned_keys.load_model,
      key: 'fn',
      fn: load_model_for_file.bind(this),
      pre_fn: function pre_fn() {
        map.set_status('Loading model ...');
      },
      failure_fn: function failure_fn() {
        map.set_status('');
      } }
  }).button({ id: 'convert_map',
    key: keys.convert_map,
    text: 'Update names and gene reaction rules using model' }).button({ id: 'clear_model',
    key: keys.clear_model,
    text: 'Clear model' });
  // disable the clear and convert buttons
  var disable_model_clear_convert = function () {
    model_menu.dropdown.selectAll('li').classed('escher-disabled', function (d) {
      if ((d.id == 'clear_model' || d.id == 'convert_map') && this.cobra_model === null) return true;
      return null;
    }.bind(this));
  }.bind(this);
  disable_model_clear_convert();
  this.callback_manager.set('load_model', disable_model_clear_convert);

  // data dropdown
  var data_menu = ui.dropdown_menu(menu, 'Data').button({ input: { assign: key_manager.assigned_keys.load_reaction_data,
      key: 'fn',
      fn: load_reaction_data_for_file.bind(this),
      accept_csv: true,
      pre_fn: function pre_fn() {
        map.set_status('Loading reaction data ...');
      },
      failure_fn: function failure_fn() {
        map.set_status('');
      } },
    text: 'Load reaction data' }).button({ key: keys.clear_reaction_data,
    text: 'Clear reaction data' }).divider().button({ input: { fn: load_gene_data_for_file.bind(this),
      accept_csv: true,
      pre_fn: function pre_fn() {
        map.set_status('Loading gene data ...');
      },
      failure_fn: function failure_fn() {
        map.set_status('');
      } },
    text: 'Load gene data' }).button({ key: keys.clear_gene_data,
    text: 'Clear gene data' }).divider().button({ input: { fn: load_metabolite_data_for_file.bind(this),
      accept_csv: true,
      pre_fn: function pre_fn() {
        map.set_status('Loading metabolite data ...');
      },
      failure_fn: function failure_fn() {
        map.set_status('');
      } },
    text: 'Load metabolite data' }).button({ key: keys.clear_metabolite_data,
    text: 'Clear metabolite data' });

  // update the buttons
  var disable_clears = function () {
    data_menu.dropdown.selectAll('li').classed('escher-disabled', function (d) {
      if (!d) return null;
      if (d.text == 'Clear reaction data' && this.options.reaction_data === null) return true;
      if (d.text == 'Clear gene data' && this.options.gene_data === null) return true;
      if (d.text == 'Clear metabolite data' && this.options.metabolite_data === null) return true;
      return null;
    }.bind(this));
  }.bind(this);
  disable_clears();
  this.callback_manager.set('update_data', disable_clears);

  // edit dropdown
  var edit_menu = ui.dropdown_menu(menu, 'Edit', true);
  if (enable_editing) {
    edit_menu.button({ key: keys.zoom_mode,
      id: 'zoom-mode-menu-button',
      text: 'Pan mode',
      key_text: enable_keys ? ' (Z)' : null }).button({ key: keys.brush_mode,
      id: 'brush-mode-menu-button',
      text: 'Select mode',
      key_text: enable_keys ? ' (V)' : null }).button({ key: keys.build_mode,
      id: 'build-mode-menu-button',
      text: 'Add reaction mode',
      key_text: enable_keys ? ' (N)' : null }).button({ key: keys.rotate_mode,
      id: 'rotate-mode-menu-button',
      text: 'Rotate mode',
      key_text: enable_keys ? ' (R)' : null }).button({ key: keys.text_mode,
      id: 'text-mode-menu-button',
      text: 'Text mode',
      key_text: enable_keys ? ' (T)' : null }).divider().button({ key: keys.delete,
      text: 'Delete',
      key_text: enable_keys ? ' (Del)' : null }).button({ key: keys.undo,
      text: 'Undo',
      key_text: enable_keys ? ' (Ctrl+Z)' : null }).button({ key: keys.redo,
      text: 'Redo',
      key_text: enable_keys ? ' (Ctrl+Shift+Z)' : null }).button({ key: keys.toggle_primary,
      text: 'Toggle primary/secondary',
      key_text: enable_keys ? ' (P)' : null }).button({ key: keys.cycle_primary,
      text: 'Rotate reactant locations',
      key_text: enable_keys ? ' (C)' : null }).button({ key: keys.select_all,
      text: 'Select all',
      key_text: enable_keys ? ' (Ctrl+A)' : null }).button({ key: keys.select_none,
      text: 'Select none',
      key_text: enable_keys ? ' (Ctrl+Shift+A)' : null }).button({ key: keys.invert_selection,
      text: 'Invert selection' });
  } else {
    edit_menu.button({ key: keys.view_mode,
      id: 'view-mode-menu-button',
      text: 'View mode' });
  }

  // view dropdown
  var view_menu = ui.dropdown_menu(menu, 'View', true).button({ key: keys.zoom_in,
    text: 'Zoom in',
    key_text: enable_keys ? ' (+)' : null }).button({ key: keys.zoom_out,
    text: 'Zoom out',
    key_text: enable_keys ? ' (-)' : null }).button({ key: keys.extent_nodes,
    text: 'Zoom to nodes',
    key_text: enable_keys ? ' (0)' : null }).button({ key: keys.extent_canvas,
    text: 'Zoom to canvas',
    key_text: enable_keys ? ' (1)' : null }).button({ key: keys.search,
    text: 'Find',
    key_text: enable_keys ? ' (F)' : null });
  if (full_screen_button) {
    view_menu.button({ key: keys.full_screen,
      text: 'Full screen',
      key_text: enable_keys ? ' (2)' : null });
  }
  if (enable_editing) {
    view_menu.button({ key: keys.toggle_beziers,
      id: 'bezier-button',
      text: 'Show control points',
      key_text: enable_keys ? ' (B)' : null });
    map.callback_manager.set('toggle_beziers.button', function (on_off) {
      menu.select('#bezier-button').select('.dropdown-button-text').text((on_off ? 'Hide' : 'Show') + ' control points' + (enable_keys ? ' (B)' : ''));
    });
  }
  view_menu.divider().button({ key: keys.show_settings,
    text: 'Settings',
    key_text: enable_keys ? ' (,)' : null });

  // help
  menu.append('a').attr('class', 'help-button').attr('target', '#').attr('href', 'https://escher.readthedocs.org').text('?');

  // set up mode callbacks
  var select_button = function select_button(id) {
    // toggle the button
    $(this.selection.node()).find('#' + id).button('toggle');

    // menu buttons
    var ids = ['zoom-mode-menu-button', 'brush-mode-menu-button', 'build-mode-menu-button', 'rotate-mode-menu-button', 'view-mode-menu-button', 'text-mode-menu-button'];
    ids.forEach(function (this_id) {
      var b_id = this_id.replace('-menu', '');
      this.selection.select('#' + this_id).select('span').classed('glyphicon', b_id == id).classed('glyphicon-ok', b_id == id);
    }.bind(this));
  };
  this.callback_manager.set('zoom_mode', select_button.bind(this, 'zoom-mode-button'));
  this.callback_manager.set('brush_mode', select_button.bind(this, 'brush-mode-button'));
  this.callback_manager.set('build_mode', select_button.bind(this, 'build-mode-button'));
  this.callback_manager.set('rotate_mode', select_button.bind(this, 'rotate-mode-button'));
  this.callback_manager.set('view_mode', select_button.bind(this, 'view-mode-button'));
  this.callback_manager.set('text_mode', select_button.bind(this, 'text-mode-button'));

  // definitions
  function load_map_for_file(error, map_data) {
    /** Load a map. This reloads the whole builder. */
    if (error) {
      console.warn(error);
      this.map.set_status('Error loading map: ' + error, 2000);
      return;
    }

    try {
      check_map(map_data);
      this.load_map(map_data);
      this.map.set_status('Loaded map ' + map_data[0].map_name, 3000);
    } catch (e) {
      console.warn(e);
      this.map.set_status('Error loading map: ' + e, 2000);
    }

    // definitions
    function check_map(data) {
      /** Perform a quick check to make sure the map is mostly valid.
        */

      if (!('map_id' in data[0] && 'reactions' in data[1] && 'nodes' in data[1] && 'canvas' in data[1])) throw new Error('Bad map data.');
    }
  }
  function load_model_for_file(error, data) {
    /** Load a cobra model. Redraws the whole map if the
        highlight_missing option is true.
     */
    if (error) {
      console.warn(error);
      this.map.set_status('Error loading model: ' + error, 2000);
      return;
    }

    try {
      this.load_model(data, true);
      this.build_input.toggle(false);
      if ('id' in data) this.map.set_status('Loaded model ' + data.id, 3000);else this.map.set_status('Loaded model (no model id)', 3000);
    } catch (e) {
      console.warn(e);
      this.map.set_status('Error loading model: ' + e, 2000);
    }
  }
  function load_reaction_data_for_file(error, data) {
    if (error) {
      console.warn(error);
      this.map.set_status('Could not parse file as JSON or CSV', 2000);
      return;
    }
    // turn off gene data
    if (data !== null) this.set_gene_data(null);

    this.set_reaction_data(data);
  }
  function load_metabolite_data_for_file(error, data) {
    if (error) {
      console.warn(error);
      this.map.set_status('Could not parse file as JSON or CSV', 2000);
      return;
    }
    this.set_metabolite_data(data);
  }
  function load_gene_data_for_file(error, data) {
    if (error) {
      console.warn(error);
      this.map.set_status('Could not parse file as JSON or CSV', 2000);
      return;
    }
    // turn off reaction data
    if (data !== null) this.set_reaction_data(null);

    // turn on gene_reaction_rules
    this.settings.set_conditional('show_gene_reaction_rules', true);

    this.set_gene_data(data);
  }
}

function _set_up_button_panel(button_selection, keys, enable_editing, enable_keys, full_screen_button, menu_option, ignore_bootstrap) {
  var button_panel = button_selection.append('ul').attr('class', 'nav nav-pills nav-stacked').attr('id', 'button-panel');

  // buttons
  ui.individual_button(button_panel.append('li'), { key: keys.zoom_in,
    text: '+',
    icon: 'glyphicon glyphicon-plus-sign',
    tooltip: 'Zoom in',
    key_text: enable_keys ? ' (+)' : null,
    ignore_bootstrap: ignore_bootstrap });
  ui.individual_button(button_panel.append('li'), { key: keys.zoom_out,
    text: '–',
    icon: 'glyphicon glyphicon-minus-sign',
    tooltip: 'Zoom out',
    key_text: enable_keys ? ' (-)' : null,
    ignore_bootstrap: ignore_bootstrap });
  ui.individual_button(button_panel.append('li'), { key: keys.extent_canvas,
    text: '↔',
    icon: 'glyphicon glyphicon-resize-full',
    tooltip: 'Zoom to canvas',
    key_text: enable_keys ? ' (1)' : null,
    ignore_bootstrap: ignore_bootstrap });
  if (full_screen_button) {
    ui.individual_button(button_panel.append('li'), { key: keys.full_screen,
      text: '▣',
      icon: 'glyphicon glyphicon-fullscreen',
      tooltip: 'Full screen',
      key_text: enable_keys ? ' (2)' : null,
      ignore_bootstrap: ignore_bootstrap
    });
  }

  // mode buttons
  if (enable_editing && menu_option === 'all') {
    ui.radio_button_group(button_panel.append('li')).button({ key: keys.zoom_mode,
      id: 'zoom-mode-button',
      text: 'Z',
      icon: 'glyphicon glyphicon-move',
      tooltip: 'Pan mode',
      key_text: enable_keys ? ' (Z)' : null,
      ignore_bootstrap: ignore_bootstrap }).button({ key: keys.brush_mode,
      text: 'V',
      id: 'brush-mode-button',
      icon: 'glyphicon glyphicon-hand-up',
      tooltip: 'Select mode',
      key_text: enable_keys ? ' (V)' : null,
      ignore_bootstrap: ignore_bootstrap }).button({ key: keys.build_mode,
      text: 'N',
      id: 'build-mode-button',
      icon: 'glyphicon glyphicon-plus',
      tooltip: 'Add reaction mode',
      key_text: enable_keys ? ' (N)' : null,
      ignore_bootstrap: ignore_bootstrap }).button({ key: keys.rotate_mode,
      text: 'R',
      id: 'rotate-mode-button',
      icon: 'glyphicon glyphicon-repeat',
      tooltip: 'Rotate mode',
      key_text: enable_keys ? ' (R)' : null,
      ignore_bootstrap: ignore_bootstrap }).button({ key: keys.text_mode,
      text: 'T',
      id: 'text-mode-button',
      icon: 'glyphicon glyphicon-font',
      tooltip: 'Text mode',
      key_text: enable_keys ? ' (T)' : null,
      ignore_bootstrap: ignore_bootstrap });

    // arrow buttons
    this.direction_buttons = button_panel.append('li');
    var o = ui.button_group(this.direction_buttons).button({ key: keys.direction_arrow_left,
      text: '←',
      icon: 'glyphicon glyphicon-arrow-left',
      tooltip: 'Direction arrow (←)',
      ignore_bootstrap: ignore_bootstrap }).button({ key: keys.direction_arrow_right,
      text: '→',
      icon: 'glyphicon glyphicon-arrow-right',
      tooltip: 'Direction arrow (→)',
      ignore_bootstrap: ignore_bootstrap }).button({ key: keys.direction_arrow_up,
      text: '↑',
      icon: 'glyphicon glyphicon-arrow-up',
      tooltip: 'Direction arrow (↑)',
      ignore_bootstrap: ignore_bootstrap }).button({ key: keys.direction_arrow_down,
      text: '↓',
      icon: 'glyphicon glyphicon-arrow-down',
      tooltip: 'Direction arrow (↓)',
      ignore_bootstrap: ignore_bootstrap });
  }
}

function _toggle_direction_buttons(on_off) {
  if (_.isUndefined(on_off)) on_off = !this.direction_buttons.style('display') === 'block';
  this.direction_buttons.style('display', on_off ? 'block' : 'none');
}

function _create_status(selection) {
  this.status_bar = selection.append('div').attr('id', 'status');
}

function _setup_status(map) {
  var _this = this;

  map.callback_manager.set('set_status', function (status) {
    return _this.status_bar.html(status);
  });
}

function _setup_quick_jump(selection) {
  // function to load a map
  var load_fn = function (new_map_name, quick_jump_path, callback) {
    if (this.options.enable_editing && !this.options.never_ask_before_quit) {
      if (!confirm('You will lose any unsaved changes.\n\n' + 'Are you sure you want to switch maps?')) {
        if (callback) callback(false);
        return;
      }
    }
    this.map.set_status('Loading map ' + new_map_name + ' ...');
    var url = utils.name_to_url(new_map_name, quick_jump_path);
    d3_json(url, function (error, data) {
      if (error) {
        console.warn('Could not load data: ' + error);
        this.map.set_status('Could not load map', 2000);
        if (callback) callback(false);
        return;
      }
      // run callback before load_map so the new map has the correct
      // quick_jump menu
      if (callback) callback(true);
      // now reload
      this.load_map(data);
      this.map.set_status('');
    }.bind(this));
  }.bind(this);

  // make the quick jump object
  this.quick_jump = QuickJump(selection, load_fn);
}

function _setup_modes(map, brush, zoom_container) {
  // set up zoom+pan and brush modes
  var was_enabled = {};
  map.callback_manager.set('start_rotation', function () {
    was_enabled.brush = brush.enabled;
    brush.toggle(false);
    was_enabled.zoom = zoom_container.zoom_on;
    zoom_container.toggle_pan_drag(false);
    was_enabled.selectable_mousedown = map.behavior.selectable_mousedown !== null;
    map.behavior.toggle_selectable_click(false);
    was_enabled.label_mouseover = map.behavior.label_mouseover !== null;
    map.behavior.toggle_label_mouseover(false);
  });
  map.callback_manager.set('end_rotation', function () {
    brush.toggle(was_enabled.brush);
    zoom_container.toggle_pan_drag(was_enabled.zoom);
    map.behavior.toggle_selectable_click(was_enabled.selectable_mousedown);
    map.behavior.toggle_label_mouseover(was_enabled.label_mouseover);
    was_enabled = {};
  });
}

/**
 * Define keyboard shortcuts
 */
function _get_keys(map, zoom_container, search_bar, settings_bar, enable_editing, full_screen_button) {

  var keys = {
    save: {
      key: 'ctrl+s',
      target: map,
      fn: map.save
    },
    save_svg: {
      key: 'ctrl+shift+s',
      target: map,
      fn: map.save_svg
    },
    save_png: {
      key: 'ctrl+shift+p',
      target: map,
      fn: map.save_png
    },
    load: {
      key: 'ctrl+o',
      fn: null // defined by button
    },
    convert_map: {
      target: map,
      fn: map.convert_map
    },
    clear_map: {
      target: map,
      fn: map.clear_map
    },
    load_model: {
      key: 'ctrl+m',
      fn: null // defined by button
    },
    clear_model: {
      fn: this.load_model.bind(this, null, true)
    },
    load_reaction_data: { fn: null }, // defined by button
    clear_reaction_data: {
      target: this,
      fn: function fn() {
        this.set_reaction_data(null);
      }
    },
    load_metabolite_data: { fn: null }, // defined by button
    clear_metabolite_data: {
      target: this,
      fn: function fn() {
        this.set_metabolite_data(null);
      }
    },
    load_gene_data: { fn: null }, // defined by button
    clear_gene_data: {
      target: this,
      fn: function fn() {
        this.set_gene_data(null, true);
      }
    },
    zoom_in_ctrl: {
      key: 'ctrl+=',
      target: zoom_container,
      fn: zoom_container.zoom_in
    },
    zoom_in: {
      key: '=',
      target: zoom_container,
      fn: zoom_container.zoom_in,
      ignore_with_input: true
    },
    zoom_out_ctrl: {
      key: 'ctrl+-',
      target: zoom_container,
      fn: zoom_container.zoom_out
    },
    zoom_out: {
      key: '-',
      target: zoom_container,
      fn: zoom_container.zoom_out,
      ignore_with_input: true
    },
    extent_nodes_ctrl: {
      key: 'ctrl+0',
      target: map,
      fn: map.zoom_extent_nodes
    },
    extent_nodes: {
      key: '0',
      target: map,
      fn: map.zoom_extent_nodes,
      ignore_with_input: true
    },
    extent_canvas_ctrl: {
      key: 'ctrl+1',
      target: map,
      fn: map.zoom_extent_canvas
    },
    extent_canvas: {
      key: '1',
      target: map,
      fn: map.zoom_extent_canvas,
      ignore_with_input: true
    },
    search_ctrl: {
      key: 'ctrl+f',
      fn: search_bar.toggle.bind(search_bar, true)
    },
    search: {
      key: 'f',
      fn: search_bar.toggle.bind(search_bar, true),
      ignore_with_input: true
    },
    view_mode: {
      target: this,
      fn: this.view_mode,
      ignore_with_input: true
    },
    show_settings_ctrl: {
      key: 'ctrl+,',
      target: settings_bar,
      fn: settings_bar.toggle
    },
    show_settings: {
      key: ',',
      target: settings_bar,
      fn: settings_bar.toggle,
      ignore_with_input: true
    }
  };
  if (full_screen_button) {
    utils.extend(keys, {
      full_screen_ctrl: {
        key: 'ctrl+2',
        target: map,
        fn: map.full_screen
      },
      full_screen: {
        key: '2',
        target: map,
        fn: map.full_screen,
        ignore_with_input: true
      }
    });
  }
  if (enable_editing) {
    utils.extend(keys, {
      build_mode: {
        key: 'n',
        target: this,
        fn: this.build_mode,
        ignore_with_input: true
      },
      zoom_mode: {
        key: 'z',
        target: this,
        fn: this.zoom_mode,
        ignore_with_input: true
      },
      brush_mode: {
        key: 'v',
        target: this,
        fn: this.brush_mode,
        ignore_with_input: true
      },
      rotate_mode: {
        key: 'r',
        target: this,
        fn: this.rotate_mode,
        ignore_with_input: true
      },
      text_mode: {
        key: 't',
        target: this,
        fn: this.text_mode,
        ignore_with_input: true
      },
      toggle_beziers: {
        key: 'b',
        target: map,
        fn: map.toggle_beziers,
        ignore_with_input: true
      },
      delete_ctrl: {
        key: 'ctrl+backspace',
        target: map,
        fn: map.delete_selected,
        ignore_with_input: true
      },
      delete: {
        key: 'backspace',
        target: map,
        fn: map.delete_selected,
        ignore_with_input: true
      },
      delete_del: {
        key: 'del',
        target: map,
        fn: map.delete_selected,
        ignore_with_input: true
      },
      toggle_primary: {
        key: 'p',
        target: map,
        fn: map.toggle_selected_node_primary,
        ignore_with_input: true
      },
      cycle_primary: {
        key: 'c',
        target: map,
        fn: map.cycle_primary_node,
        ignore_with_input: true
      },
      direction_arrow_right: {
        key: 'right',
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.right,
        ignore_with_input: true
      },
      direction_arrow_down: {
        key: 'down',
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.down,
        ignore_with_input: true
      },
      direction_arrow_left: {
        key: 'left',
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.left,
        ignore_with_input: true
      },
      direction_arrow_up: {
        key: 'up',
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.up,
        ignore_with_input: true
      },
      undo: {
        key: 'ctrl+z',
        target: map.undo_stack,
        fn: map.undo_stack.undo
      },
      redo: {
        key: 'ctrl+shift+z',
        target: map.undo_stack,
        fn: map.undo_stack.redo
      },
      select_all: {
        key: 'ctrl+a',
        target: map,
        fn: map.select_all
      },
      select_none: {
        key: 'ctrl+shift+a',
        target: map,
        fn: map.select_none
      },
      invert_selection: {
        target: map,
        fn: map.invert_selection
      }
    });
  }
  return keys;
}

/**
 * Ask if the user wants to exit the page (to avoid unplanned refresh).
 */
function _setup_confirm_before_exit() {
  window.onbeforeunload = function (e) {
    // If we haven't been passed the event get the window.event
    e = e || window.event;
    return this.options.never_ask_before_quit ? null : 'You will lose any unsaved changes.';
  }.bind(this);
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(22)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!./builder.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!./builder.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(21)(true);
// imports


// module
exports.push([module.i, "/**\n* @license\n*\n* Escher\n* Author: Zachary King\n*\n* The MIT License (MIT)\n*\n* This software is Copyright © 2015 The Regents of the University of\n* California. All Rights Reserved.\n*\n* Permission is hereby granted, free of charge, to any person obtaining a copy\n* of this software and associated documentation files (the \"Software\"), to deal\n* in the Software without restriction, including without limitation the rights\n* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n* copies of the Software, and to permit persons to whom the Software is\n* furnished to do so, subject to the following conditions:\n*\n* The above copyright notice and this permission notice shall be included in\n* all copies or substantial portions of the Software.\n*\n* THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n* THE SOFTWARE.\n*/\n\n/* Containers */\n\n/* The top level container for an Escher Builder */\n.escher-container {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif !important;\n  background-color: #F3F3F3;\n  text-align: center;\n  position: relative;\n}\n\n.escher-container *:not(.btn,.glyphicon,.caret,a) {\n  font-size: 14px;\n  color: #333333;\n}\n\n/* Applied to the body when Escher fills the screen. This stops browser from\nshowing scroll-end animations. */\nhtml.fill-screen {\n  height: 100%;\n  width: 100%;\n}\nbody.fill-screen {\n  overflow: hidden;\n  height: 100%;\n  width: 100%;\n}\n\n/* Applied to top level container (generally .escher-container) when Escher\nfills the screen. These make sure Escher completely fills the screen, even after\nresizes. */\n.fill-screen-div {\n  margin: 0;\n  padding: 0;\n  position: fixed;\n  top: 0px;\n  bottom: 0px;\n  left: 0px;\n  right: 0px;\n}\n\n/* Temporarily applied when entering full screen. */\n.full-screen-on {\n  height: 100% !important;\n  width: 100% !important;\n  overflow: hidden;\n}\n\n/* The zoom container classes. */\n.escher-zoom-container, .escher-3d-transform-container, svg.escher-svg {\n  width: 100% !important;\n  height: 100% !important;\n  overflow: hidden;\n}\n\n/* Status */\n.escher-container #status {\n  position:absolute;\n  bottom:10px;\n  left: 20px;\n  color: red;\n  background-color: white;\n  font-size: 16px\n}\n/* Menus */\n.escher-container #menu {\n  display: block;\n  margin: 5px auto 0 auto;\n  border: 1px solid #ddd;\n  background-color: rgba(255, 255, 255, 0.95);\n  border-radius: 0px;\n}\n.escher-container .help-button {\n  float: right;\n  padding: 0 5px;\n  font-size: 12px;\n  background-color: rgb(245, 245, 245);\n}\n.escher-container .dropdown-menu {\n  border: 1px solid #ddd;\n  background-color: rgba(255, 255, 255, 0.95);\n  border-radius: 0px;\n  margin: 0;\n  text-align: left;\n}\n.escher-container .dropdown-menu>li>a {\n  font-size: 15px;\n}\n.escher-container .dropdown-menu>.escher-disabled>a {\n  color: #E0E0E0;\n  pointer-events: none;\n}\n.escher-container .dropdown {\n  background-color: rgba(255, 255, 255, 0.95);\n}\n@media (max-width: 550px) {\n  .escher-container .dropdown-button {\n    padding: 5px 9px;\n  }\n}\n@media (min-width: 550px) {\n  .escher-container .dropdown-button {\n    font-size: 18px;\n  }\n  .escher-container .help-button {\n    font-size: 16px;\n  }\n}\n/* Search */\n.escher-container .search-menu-container {\n  position: absolute;\n  width: 100%;\n  top: 0px;\n  left: 0px;\n  margin: 0;\n  text-align: center;\n  pointer-events: none;\n}\n.escher-container .search-menu-container-inline {\n  width: 320px;\n  display: inline-block;\n  text-align: left;\n  pointer-events: auto;\n}\n@media (min-width: 550px) {\n  .escher-container .search-menu-container-inline {\n    width: 410px;\n  }\n}\n.escher-container .search-container {\n  display: block;\n  background: rgba(255, 255, 255, 0.95);\n  padding: 3px;\n  border: 1px solid #DDD;\n  margin: 2px 0 0 0;\n}\n.escher-container .search-bar {\n  display: inline-block;\n  border: 1px solid #DDD;\n  margin-right: 4px;\n  width: 114px;\n  height: 29px;\n  border-radius: 3px;\n}\n.escher-container .search-counter {\n  display: inline-block;\n  padding: 0 8px;\n}\n/* Settings */\n.escher-container .settings-box-background {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 9;\n  background: rgba(0, 0, 0, 0.4);\n  padding: 5% 0 5% 0;\n  text-align: center;\n}\n.escher-container .settings-box-container {\n  display: inline-block;\n  position: relative;\n  width: 90%;\n  max-width: 520px;\n  height: 100%;\n  z-index: 10;\n}\n.escher-container .settings-button {\n  position: absolute;\n  top: 5px;\n  right: 20px;\n  z-index: 10;\n}\n.escher-container .settings-button-close {\n  right: 60px;\n}\n.escher-container .settings-box {\n  display: inline-block;\n  max-height: 100%;\n  width: 100%;\n  /* max-width: 520px; */\n  overflow-y: scroll;\n  overflow-x: hidden;\n  background: rgba(255, 255, 255, 0.95);\n  padding: 8px;\n  margin: 0;\n  border: 1px solid #DDD;\n  text-align: left;\n}\n.escher-container .settings-section-heading-large {\n  font-size: 17px;\n  font-weight: bold;\n  margin-top: 15px;\n}\n.escher-container .settings-section-heading {\n  font-weight: bold;\n  margin-top: 15px;\n}\n.escher-container .settings-table {\n  width: 100%;\n}\n.escher-container .settings-table td {\n  padding: 3px 5px;\n}\n.escher-container td.options-label {\n  width: 88px;\n}\n.escher-container td.options-label-wide {\n  width: 192px;\n}\n.escher-container .settings-number {\n  text-align: center;\n  color: #AAA;\n  font-style: italic;\n}\n.escher-container .input-cell {\n  width: 23%;\n  /* padding: 3px 5px; */\n  font-size: 13px;\n}\n.escher-container .scale-bar-input {\n  width: 100%;\n  text-align: left;\n}\n.escher-container .no-data-input {\n  width: 23%;\n  margin: 0 4px 0 4px;\n}\n.escher-container label.option-group {\n  margin: 0 10px 0 0;\n}\n.escher-container label.option-group span {\n  margin: 0 0 0 4px;\n}\n.escher-container label.full-line {\n  width: 100%;\n}\n.escher-container label {\n  font-weight: inherit;\n}\n.escher-container .settings-tip {\n  font-style: italic;\n}\n/* Live scale */\n.escher-container .scale-editor {\n  position: relative;\n  width: 100%;\n  height: 190px;\n  font-size: 12px;\n}\n.escher-container .scale-editor .centered {\n  position: absolute;\n  width: 440px;\n  left: 35px;\n  top: 0px;\n}\n.escher-container .scale-editor .data-not-loaded {\n  position: absolute;\n  z-index: 5;\n  left: 60px;\n  top: 25px;\n  text-align: center;\n  width: 400px;\n  font-size: 15px;\n  color: #B19EC0;\n}\n.escher-container .scale-editor .add {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  width: 20px;\n  cursor: pointer;\n}\n.escher-container .scale-editor .trash-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 420px;\n  height: 20px;\n}\n.escher-container .scale-editor .trash {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  cursor: pointer;\n}\n.escher-container .scale-editor .scale-svg {\n  position: absolute;\n  width: 440px;\n  height: 80px;\n  top: 20px;\n  left: 0px;\n}\n.escher-container .scale-editor .input-container {\n  position: absolute;\n  top: 56px;\n  left: 0px;\n  width: 420px;\n}\n.escher-container .scale-editor .input-container input {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n}\n.escher-container .scale-editor input[disabled] {\n  background-color: #F1ECFA;\n}\n.escher-container .scale-editor .row-label {\n  position: absolute;\n  left: 0px;\n}\n.escher-container .scale-editor .input-set {\n  position: absolute;\n  top: 0px;\n  box-shadow: 0px 2px 14px rgb(197, 197, 197);\n}\n.escher-container .scale-editor .input-set.selected-set {\n  z-index: 5;\n}\n.escher-container .scale-editor .domain-type-picker {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  height: 14px;\n  background-color: rgb(232, 232, 232);\n}\n.escher-container .scale-editor .picker rect {\n  color: black;\n  opacity: 0.4;\n}\n.escher-container .scale-editor .no-data {\n  position: absolute;\n  left: 0px;\n  width: 100%;\n}\n.escher-container .scale-editor .no-data-heading {\n  font-weight: bold;\n}\n.escher-container .scale-editor .no-data .input-group {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n}\n.escher-container .scale-editor .no-data .input-group span,\n.escher-container .scale-editor .no-data .input-group input {\n  position: absolute;\n  top: 17px;\n}\n/* For Search */\n.escher-container .close-button {\n  margin-left: 4px;\n  float: right;\n}\n/* Button panel */\n.escher-container ul#button-panel {\n  position: absolute;\n  left: 4px;\n  top: 20%;\n  margin-top: -30px;\n  /* top: 81px; //max */\n  /* top: 20px; //min */\n  pointer-events: none;\n  padding-left: 0;\n}\n.escher-container ul#button-panel li {\n  pointer-events: auto;\n  list-style: none;\n}\n.escher-container .input-close-button {\n  position: absolute;\n  right: 0px;\n  width: 18px;\n  bottom: 0px;\n  padding: 0px;\n  border-width: 0px;\n  margin: 0px;\n  background: none;\n  font-size: 16px;\n  font-weight: normal;\n}\n\n.escher-container .simple-button {\n  width: 40px;\n  height: 40px;\n  border: 1px solid #2E2F2F;\n  background-image: linear-gradient(#4F5151, #474949 6%, #3F4141);\n  background-color: #474949;\n  border-color: #474949;\n  padding: 6px 0 9px 0;\n  line-height: 1.42857143;\n  border-radius: 4px;\n  text-align: center;\n  vertical-align: middle;\n  cursor: pointer;\n  margin: 3px 0 0 0;\n}\n\n.escher-container .simple-button, .escher-container .simple-button * {\n  color: #FFF;\n  font-size: 17px;\n}\n\n.escher-container .simple-button.active {\n  background-image: linear-gradient(#8F4F3F, #834c3c 6%, #8d3a2d);\n}\n\n/* Reaction input */\n.escher-container #rxn-input {\n  z-index: 10;\n}\n.escher-container .input-close-button:hover {\n  color: #ff3333;\n  font-weight: bold;\n}\n.escher-container .light {\n  color: #8b8b8be;\n  font-weight: normal;\n}\n/* text edit input */\n.escher-container #text-edit-input input {\n  width: 500px;\n  border: 1px solid #cccccc;\n  font-size: 22px;\n}\n/* quick jump menu */\n.escher-container #quick-jump-menu {\n  position: absolute;\n  right: 10px;\n  bottom: 10px;\n  width: 300px;\n}\n@media (max-width: 550px) {\n  .escher-container #quick-jump-menu {\n\t  display: none;\n  }\n}\n", "", {"version":3,"sources":["/Users/zaking/repos/escher/src/builder.css"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;;;;;;;;;;;;;;;EA4BE;;AAEF,gBAAgB;;AAEhB,mDAAmD;AACnD;EACE,uEAAuE;EACvE,0BAA0B;EAC1B,mBAAmB;EACnB,mBAAmB;CACpB;;AAED;EACE,gBAAgB;EAChB,eAAe;CAChB;;AAED;iCACiC;AACjC;EACE,aAAa;EACb,YAAY;CACb;AACD;EACE,iBAAiB;EACjB,aAAa;EACb,YAAY;CACb;;AAED;;WAEW;AACX;EACE,UAAU;EACV,WAAW;EACX,gBAAgB;EAChB,SAAS;EACT,YAAY;EACZ,UAAU;EACV,WAAW;CACZ;;AAED,oDAAoD;AACpD;EACE,wBAAwB;EACxB,uBAAuB;EACvB,iBAAiB;CAClB;;AAED,iCAAiC;AACjC;EACE,uBAAuB;EACvB,wBAAwB;EACxB,iBAAiB;CAClB;;AAED,YAAY;AACZ;EACE,kBAAkB;EAClB,YAAY;EACZ,WAAW;EACX,WAAW;EACX,wBAAwB;EACxB,eAAe;CAChB;AACD,WAAW;AACX;EACE,eAAe;EACf,wBAAwB;EACxB,uBAAuB;EACvB,4CAA4C;EAC5C,mBAAmB;CACpB;AACD;EACE,aAAa;EACb,eAAe;EACf,gBAAgB;EAChB,qCAAqC;CACtC;AACD;EACE,uBAAuB;EACvB,4CAA4C;EAC5C,mBAAmB;EACnB,UAAU;EACV,iBAAiB;CAClB;AACD;EACE,gBAAgB;CACjB;AACD;EACE,eAAe;EACf,qBAAqB;CACtB;AACD;EACE,4CAA4C;CAC7C;AACD;EACE;IACE,iBAAiB;GAClB;CACF;AACD;EACE;IACE,gBAAgB;GACjB;EACD;IACE,gBAAgB;GACjB;CACF;AACD,YAAY;AACZ;EACE,mBAAmB;EACnB,YAAY;EACZ,SAAS;EACT,UAAU;EACV,UAAU;EACV,mBAAmB;EACnB,qBAAqB;CACtB;AACD;EACE,aAAa;EACb,sBAAsB;EACtB,iBAAiB;EACjB,qBAAqB;CACtB;AACD;EACE;IACE,aAAa;GACd;CACF;AACD;EACE,eAAe;EACf,sCAAsC;EACtC,aAAa;EACb,uBAAuB;EACvB,kBAAkB;CACnB;AACD;EACE,sBAAsB;EACtB,uBAAuB;EACvB,kBAAkB;EAClB,aAAa;EACb,aAAa;EACb,mBAAmB;CACpB;AACD;EACE,sBAAsB;EACtB,eAAe;CAChB;AACD,cAAc;AACd;EACE,eAAe;EACf,mBAAmB;EACnB,OAAO;EACP,QAAQ;EACR,YAAY;EACZ,aAAa;EACb,WAAW;EACX,+BAA+B;EAC/B,mBAAmB;EACnB,mBAAmB;CACpB;AACD;EACE,sBAAsB;EACtB,mBAAmB;EACnB,WAAW;EACX,iBAAiB;EACjB,aAAa;EACb,YAAY;CACb;AACD;EACE,mBAAmB;EACnB,SAAS;EACT,YAAY;EACZ,YAAY;CACb;AACD;EACE,YAAY;CACb;AACD;EACE,sBAAsB;EACtB,iBAAiB;EACjB,YAAY;EACZ,uBAAuB;EACvB,mBAAmB;EACnB,mBAAmB;EACnB,sCAAsC;EACtC,aAAa;EACb,UAAU;EACV,uBAAuB;EACvB,iBAAiB;CAClB;AACD;EACE,gBAAgB;EAChB,kBAAkB;EAClB,iBAAiB;CAClB;AACD;EACE,kBAAkB;EAClB,iBAAiB;CAClB;AACD;EACE,YAAY;CACb;AACD;EACE,iBAAiB;CAClB;AACD;EACE,YAAY;CACb;AACD;EACE,aAAa;CACd;AACD;EACE,mBAAmB;EACnB,YAAY;EACZ,mBAAmB;CACpB;AACD;EACE,WAAW;EACX,uBAAuB;EACvB,gBAAgB;CACjB;AACD;EACE,YAAY;EACZ,iBAAiB;CAClB;AACD;EACE,WAAW;EACX,oBAAoB;CACrB;AACD;EACE,mBAAmB;CACpB;AACD;EACE,kBAAkB;CACnB;AACD;EACE,YAAY;CACb;AACD;EACE,qBAAqB;CACtB;AACD;EACE,mBAAmB;CACpB;AACD,gBAAgB;AAChB;EACE,mBAAmB;EACnB,YAAY;EACZ,cAAc;EACd,gBAAgB;CACjB;AACD;EACE,mBAAmB;EACnB,aAAa;EACb,WAAW;EACX,SAAS;CACV;AACD;EACE,mBAAmB;EACnB,WAAW;EACX,WAAW;EACX,UAAU;EACV,mBAAmB;EACnB,aAAa;EACb,gBAAgB;EAChB,eAAe;CAChB;AACD;EACE,mBAAmB;EACnB,SAAS;EACT,WAAW;EACX,YAAY;EACZ,gBAAgB;CACjB;AACD;EACE,mBAAmB;EACnB,SAAS;EACT,UAAU;EACV,aAAa;EACb,aAAa;CACd;AACD;EACE,mBAAmB;EACnB,SAAS;EACT,UAAU;EACV,gBAAgB;CACjB;AACD;EACE,mBAAmB;EACnB,aAAa;EACb,aAAa;EACb,UAAU;EACV,UAAU;CACX;AACD;EACE,mBAAmB;EACnB,UAAU;EACV,UAAU;EACV,aAAa;CACd;AACD;EACE,mBAAmB;EACnB,UAAU;EACV,SAAS;CACV;AACD;EACE,0BAA0B;CAC3B;AACD;EACE,mBAAmB;EACnB,UAAU;CACX;AACD;EACE,mBAAmB;EACnB,SAAS;EACT,4CAA4C;CAC7C;AACD;EACE,WAAW;CACZ;AACD;EACE,mBAAmB;EACnB,SAAS;EACT,WAAW;EACX,aAAa;EACb,qCAAqC;CACtC;AACD;EACE,aAAa;EACb,aAAa;CACd;AACD;EACE,mBAAmB;EACnB,UAAU;EACV,YAAY;CACb;AACD;EACE,kBAAkB;CACnB;AACD;EACE,mBAAmB;EACnB,SAAS;EACT,UAAU;CACX;AACD;;EAEE,mBAAmB;EACnB,UAAU;CACX;AACD,gBAAgB;AAChB;EACE,iBAAiB;EACjB,aAAa;CACd;AACD,kBAAkB;AAClB;EACE,mBAAmB;EACnB,UAAU;EACV,SAAS;EACT,kBAAkB;EAClB,sBAAsB;EACtB,sBAAsB;EACtB,qBAAqB;EACrB,gBAAgB;CACjB;AACD;EACE,qBAAqB;EACrB,iBAAiB;CAClB;AACD;EACE,mBAAmB;EACnB,WAAW;EACX,YAAY;EACZ,YAAY;EACZ,aAAa;EACb,kBAAkB;EAClB,YAAY;EACZ,iBAAiB;EACjB,gBAAgB;EAChB,oBAAoB;CACrB;;AAED;EACE,YAAY;EACZ,aAAa;EACb,0BAA0B;EAC1B,gEAAgE;EAChE,0BAA0B;EAC1B,sBAAsB;EACtB,qBAAqB;EACrB,wBAAwB;EACxB,mBAAmB;EACnB,mBAAmB;EACnB,uBAAuB;EACvB,gBAAgB;EAChB,kBAAkB;CACnB;;AAED;EACE,YAAY;EACZ,gBAAgB;CACjB;;AAED;EACE,gEAAgE;CACjE;;AAED,oBAAoB;AACpB;EACE,YAAY;CACb;AACD;EACE,eAAe;EACf,kBAAkB;CACnB;AACD;EACE,gBAAgB;EAChB,oBAAoB;CACrB;AACD,qBAAqB;AACrB;EACE,aAAa;EACb,0BAA0B;EAC1B,gBAAgB;CACjB;AACD,qBAAqB;AACrB;EACE,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,aAAa;CACd;AACD;EACE;GACC,cAAc;GACd;CACF","file":"builder.css","sourcesContent":["/**\n* @license\n*\n* Escher\n* Author: Zachary King\n*\n* The MIT License (MIT)\n*\n* This software is Copyright © 2015 The Regents of the University of\n* California. All Rights Reserved.\n*\n* Permission is hereby granted, free of charge, to any person obtaining a copy\n* of this software and associated documentation files (the \"Software\"), to deal\n* in the Software without restriction, including without limitation the rights\n* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n* copies of the Software, and to permit persons to whom the Software is\n* furnished to do so, subject to the following conditions:\n*\n* The above copyright notice and this permission notice shall be included in\n* all copies or substantial portions of the Software.\n*\n* THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n* THE SOFTWARE.\n*/\n\n/* Containers */\n\n/* The top level container for an Escher Builder */\n.escher-container {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif !important;\n  background-color: #F3F3F3;\n  text-align: center;\n  position: relative;\n}\n\n.escher-container *:not(.btn,.glyphicon,.caret,a) {\n  font-size: 14px;\n  color: #333333;\n}\n\n/* Applied to the body when Escher fills the screen. This stops browser from\nshowing scroll-end animations. */\nhtml.fill-screen {\n  height: 100%;\n  width: 100%;\n}\nbody.fill-screen {\n  overflow: hidden;\n  height: 100%;\n  width: 100%;\n}\n\n/* Applied to top level container (generally .escher-container) when Escher\nfills the screen. These make sure Escher completely fills the screen, even after\nresizes. */\n.fill-screen-div {\n  margin: 0;\n  padding: 0;\n  position: fixed;\n  top: 0px;\n  bottom: 0px;\n  left: 0px;\n  right: 0px;\n}\n\n/* Temporarily applied when entering full screen. */\n.full-screen-on {\n  height: 100% !important;\n  width: 100% !important;\n  overflow: hidden;\n}\n\n/* The zoom container classes. */\n.escher-zoom-container, .escher-3d-transform-container, svg.escher-svg {\n  width: 100% !important;\n  height: 100% !important;\n  overflow: hidden;\n}\n\n/* Status */\n.escher-container #status {\n  position:absolute;\n  bottom:10px;\n  left: 20px;\n  color: red;\n  background-color: white;\n  font-size: 16px\n}\n/* Menus */\n.escher-container #menu {\n  display: block;\n  margin: 5px auto 0 auto;\n  border: 1px solid #ddd;\n  background-color: rgba(255, 255, 255, 0.95);\n  border-radius: 0px;\n}\n.escher-container .help-button {\n  float: right;\n  padding: 0 5px;\n  font-size: 12px;\n  background-color: rgb(245, 245, 245);\n}\n.escher-container .dropdown-menu {\n  border: 1px solid #ddd;\n  background-color: rgba(255, 255, 255, 0.95);\n  border-radius: 0px;\n  margin: 0;\n  text-align: left;\n}\n.escher-container .dropdown-menu>li>a {\n  font-size: 15px;\n}\n.escher-container .dropdown-menu>.escher-disabled>a {\n  color: #E0E0E0;\n  pointer-events: none;\n}\n.escher-container .dropdown {\n  background-color: rgba(255, 255, 255, 0.95);\n}\n@media (max-width: 550px) {\n  .escher-container .dropdown-button {\n    padding: 5px 9px;\n  }\n}\n@media (min-width: 550px) {\n  .escher-container .dropdown-button {\n    font-size: 18px;\n  }\n  .escher-container .help-button {\n    font-size: 16px;\n  }\n}\n/* Search */\n.escher-container .search-menu-container {\n  position: absolute;\n  width: 100%;\n  top: 0px;\n  left: 0px;\n  margin: 0;\n  text-align: center;\n  pointer-events: none;\n}\n.escher-container .search-menu-container-inline {\n  width: 320px;\n  display: inline-block;\n  text-align: left;\n  pointer-events: auto;\n}\n@media (min-width: 550px) {\n  .escher-container .search-menu-container-inline {\n    width: 410px;\n  }\n}\n.escher-container .search-container {\n  display: block;\n  background: rgba(255, 255, 255, 0.95);\n  padding: 3px;\n  border: 1px solid #DDD;\n  margin: 2px 0 0 0;\n}\n.escher-container .search-bar {\n  display: inline-block;\n  border: 1px solid #DDD;\n  margin-right: 4px;\n  width: 114px;\n  height: 29px;\n  border-radius: 3px;\n}\n.escher-container .search-counter {\n  display: inline-block;\n  padding: 0 8px;\n}\n/* Settings */\n.escher-container .settings-box-background {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 9;\n  background: rgba(0, 0, 0, 0.4);\n  padding: 5% 0 5% 0;\n  text-align: center;\n}\n.escher-container .settings-box-container {\n  display: inline-block;\n  position: relative;\n  width: 90%;\n  max-width: 520px;\n  height: 100%;\n  z-index: 10;\n}\n.escher-container .settings-button {\n  position: absolute;\n  top: 5px;\n  right: 20px;\n  z-index: 10;\n}\n.escher-container .settings-button-close {\n  right: 60px;\n}\n.escher-container .settings-box {\n  display: inline-block;\n  max-height: 100%;\n  width: 100%;\n  /* max-width: 520px; */\n  overflow-y: scroll;\n  overflow-x: hidden;\n  background: rgba(255, 255, 255, 0.95);\n  padding: 8px;\n  margin: 0;\n  border: 1px solid #DDD;\n  text-align: left;\n}\n.escher-container .settings-section-heading-large {\n  font-size: 17px;\n  font-weight: bold;\n  margin-top: 15px;\n}\n.escher-container .settings-section-heading {\n  font-weight: bold;\n  margin-top: 15px;\n}\n.escher-container .settings-table {\n  width: 100%;\n}\n.escher-container .settings-table td {\n  padding: 3px 5px;\n}\n.escher-container td.options-label {\n  width: 88px;\n}\n.escher-container td.options-label-wide {\n  width: 192px;\n}\n.escher-container .settings-number {\n  text-align: center;\n  color: #AAA;\n  font-style: italic;\n}\n.escher-container .input-cell {\n  width: 23%;\n  /* padding: 3px 5px; */\n  font-size: 13px;\n}\n.escher-container .scale-bar-input {\n  width: 100%;\n  text-align: left;\n}\n.escher-container .no-data-input {\n  width: 23%;\n  margin: 0 4px 0 4px;\n}\n.escher-container label.option-group {\n  margin: 0 10px 0 0;\n}\n.escher-container label.option-group span {\n  margin: 0 0 0 4px;\n}\n.escher-container label.full-line {\n  width: 100%;\n}\n.escher-container label {\n  font-weight: inherit;\n}\n.escher-container .settings-tip {\n  font-style: italic;\n}\n/* Live scale */\n.escher-container .scale-editor {\n  position: relative;\n  width: 100%;\n  height: 190px;\n  font-size: 12px;\n}\n.escher-container .scale-editor .centered {\n  position: absolute;\n  width: 440px;\n  left: 35px;\n  top: 0px;\n}\n.escher-container .scale-editor .data-not-loaded {\n  position: absolute;\n  z-index: 5;\n  left: 60px;\n  top: 25px;\n  text-align: center;\n  width: 400px;\n  font-size: 15px;\n  color: #B19EC0;\n}\n.escher-container .scale-editor .add {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  width: 20px;\n  cursor: pointer;\n}\n.escher-container .scale-editor .trash-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  width: 420px;\n  height: 20px;\n}\n.escher-container .scale-editor .trash {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  cursor: pointer;\n}\n.escher-container .scale-editor .scale-svg {\n  position: absolute;\n  width: 440px;\n  height: 80px;\n  top: 20px;\n  left: 0px;\n}\n.escher-container .scale-editor .input-container {\n  position: absolute;\n  top: 56px;\n  left: 0px;\n  width: 420px;\n}\n.escher-container .scale-editor .input-container input {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n}\n.escher-container .scale-editor input[disabled] {\n  background-color: #F1ECFA;\n}\n.escher-container .scale-editor .row-label {\n  position: absolute;\n  left: 0px;\n}\n.escher-container .scale-editor .input-set {\n  position: absolute;\n  top: 0px;\n  box-shadow: 0px 2px 14px rgb(197, 197, 197);\n}\n.escher-container .scale-editor .input-set.selected-set {\n  z-index: 5;\n}\n.escher-container .scale-editor .domain-type-picker {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  height: 14px;\n  background-color: rgb(232, 232, 232);\n}\n.escher-container .scale-editor .picker rect {\n  color: black;\n  opacity: 0.4;\n}\n.escher-container .scale-editor .no-data {\n  position: absolute;\n  left: 0px;\n  width: 100%;\n}\n.escher-container .scale-editor .no-data-heading {\n  font-weight: bold;\n}\n.escher-container .scale-editor .no-data .input-group {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n}\n.escher-container .scale-editor .no-data .input-group span,\n.escher-container .scale-editor .no-data .input-group input {\n  position: absolute;\n  top: 17px;\n}\n/* For Search */\n.escher-container .close-button {\n  margin-left: 4px;\n  float: right;\n}\n/* Button panel */\n.escher-container ul#button-panel {\n  position: absolute;\n  left: 4px;\n  top: 20%;\n  margin-top: -30px;\n  /* top: 81px; //max */\n  /* top: 20px; //min */\n  pointer-events: none;\n  padding-left: 0;\n}\n.escher-container ul#button-panel li {\n  pointer-events: auto;\n  list-style: none;\n}\n.escher-container .input-close-button {\n  position: absolute;\n  right: 0px;\n  width: 18px;\n  bottom: 0px;\n  padding: 0px;\n  border-width: 0px;\n  margin: 0px;\n  background: none;\n  font-size: 16px;\n  font-weight: normal;\n}\n\n.escher-container .simple-button {\n  width: 40px;\n  height: 40px;\n  border: 1px solid #2E2F2F;\n  background-image: linear-gradient(#4F5151, #474949 6%, #3F4141);\n  background-color: #474949;\n  border-color: #474949;\n  padding: 6px 0 9px 0;\n  line-height: 1.42857143;\n  border-radius: 4px;\n  text-align: center;\n  vertical-align: middle;\n  cursor: pointer;\n  margin: 3px 0 0 0;\n}\n\n.escher-container .simple-button, .escher-container .simple-button * {\n  color: #FFF;\n  font-size: 17px;\n}\n\n.escher-container .simple-button.active {\n  background-image: linear-gradient(#8F4F3F, #834c3c 6%, #8d3a2d);\n}\n\n/* Reaction input */\n.escher-container #rxn-input {\n  z-index: 10;\n}\n.escher-container .input-close-button:hover {\n  color: #ff3333;\n  font-weight: bold;\n}\n.escher-container .light {\n  color: #8b8b8be;\n  font-weight: normal;\n}\n/* text edit input */\n.escher-container #text-edit-input input {\n  width: 500px;\n  border: 1px solid #cccccc;\n  font-size: 22px;\n}\n/* quick jump menu */\n.escher-container #quick-jump-menu {\n  position: absolute;\n  right: 10px;\n  bottom: 10px;\n  width: 300px;\n}\n@media (max-width: 550px) {\n  .escher-container #quick-jump-menu {\n\t  display: none;\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(23);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 23 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "svg.escher-svg #mouse-node {\n  fill: none;\n}\nsvg.escher-svg #canvas {\n  stroke: #ccc;\n  stroke-width: 7px;\n  fill: white;\n}\nsvg.escher-svg .resize-rect {\n  fill: black;\n  opacity: 0;\n  stroke: none;\n}\nsvg.escher-svg .label {\n  font-family: sans-serif;\n  font-style: italic;\n  font-weight: bold;\n  font-size: 8px;\n  fill: black;\n  stroke: none;\n  text-rendering: optimizelegibility;\n  cursor: default;\n}\nsvg.escher-svg .reaction-label {\n  font-size: 30px;\n  fill: rgb(32, 32, 120);\n  text-rendering: optimizelegibility;\n}\nsvg.escher-svg .node-label {\n  font-size: 20px;\n}\nsvg.escher-svg .gene-label {\n  font-size: 18px;\n  fill: rgb(32, 32, 120);\n  text-rendering: optimizelegibility;\n  cursor: default;\n}\nsvg.escher-svg .text-label .label {\n  font-size: 50px;\n}\nsvg.escher-svg .text-label-input {\n  font-size: 50px;\n}\nsvg.escher-svg .node-circle {\n  stroke-width: 2px;\n}\nsvg.escher-svg .midmarker-circle, svg.escher-svg .multimarker-circle {\n  fill: white;\n  fill-opacity: 0.2;\n  stroke: rgb(50, 50, 50);\n}\nsvg.escher-svg g.selected .node-circle{\n  stroke-width: 6px;\n  stroke: rgb(20, 113, 199);\n}\nsvg.escher-svg g.selected .label {\n  fill: rgb(20, 113, 199);\n}\nsvg.escher-svg .metabolite-circle {\n  stroke: rgb(162, 69, 16);\n  fill: rgb(224, 134, 91);\n}\nsvg.escher-svg g.selected .metabolite-circle {\n  stroke: rgb(5, 2, 0);\n}\nsvg.escher-svg .segment {\n  stroke: #334E75;\n  stroke-width: 10px;\n  fill: none;\n}\nsvg.escher-svg .arrowhead {\n  fill: #334E75;\n}\nsvg.escher-svg .stoichiometry-label-rect {\n  fill: white;\n  opacity: 0.5;\n}\nsvg.escher-svg .stoichiometry-label {\n  fill: #334E75;\n  font-size: 17px;\n}\nsvg.escher-svg .membrane {\n  fill: none;\n  stroke: rgb(255, 187, 0);\n}\nsvg.escher-svg .brush .extent {\n  fill-opacity: 0.1;\n  fill: black;\n  stroke: #fff;\n  shape-rendering: crispEdges;\n}\nsvg.escher-svg #brush-container .background {\n  fill: none;\n}\nsvg.escher-svg .bezier-circle {\n  fill: rgb(255,255,255);\n}\nsvg.escher-svg .bezier-circle.b1 {\n  stroke: red;\n}\nsvg.escher-svg .bezier-circle.b2 {\n  stroke: blue;\n}\nsvg.escher-svg .connect-line{\n  stroke: rgb(200,200,200);\n}\nsvg.escher-svg .direction-arrow {\n  stroke: black;\n  stroke-width: 1px;\n  fill: white;\n  opacity: 0.3;\n}\nsvg.escher-svg .start-reaction-cursor {\n  cursor: pointer;\n}\nsvg.escher-svg .start-reaction-target {\n  stroke: rgb(100,100,100);\n  fill: none;\n  opacity: 0.5;\n}\nsvg.escher-svg .rotation-center-line {\n  stroke: red;\n  stroke-width: 5px;\n}\nsvg.escher-svg .highlight {\n  fill: #D97000;\n  text-decoration: underline;\n}\nsvg.escher-svg .cursor-grab {\n  cursor: grab;\n  cursor: -webkit-grab;\n}\nsvg.escher-svg .cursor-grabbing {\n  cursor: grabbing;\n  cursor: -webkit-grabbing;\n}\nsvg.escher-svg .edit-text-cursor {\n  cursor: text;\n}\n"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("vkbeautify");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("d3-dsv");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("file-saver");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** BuildInput

    Arguments
    ---------

    selection: A d3 selection for the BuildInput.

    map: A Map instance.

    zoom_container: A ZoomContainer instance.

    settings: A Settings instance.

*/

var utils = __webpack_require__(0);
var PlacedDiv = __webpack_require__(8);
var completely = __webpack_require__(29);
var DirectionArrow = __webpack_require__(30);
var CobraModel = __webpack_require__(14);
var _ = __webpack_require__(2);
var d3_select = __webpack_require__(1).select;
var d3_mouse = __webpack_require__(1).mouse;

var BuildInput = utils.make_class();
BuildInput.prototype = {
  init: init,
  setup_map_callbacks: setup_map_callbacks,
  setup_zoom_callbacks: setup_zoom_callbacks,
  is_visible: is_visible,
  toggle: toggle,
  show_dropdown: show_dropdown,
  hide_dropdown: hide_dropdown,
  place_at_selected: place_at_selected,
  place: place,
  reload_at_selected: reload_at_selected,
  reload: reload,
  toggle_start_reaction_listener: toggle_start_reaction_listener,
  hide_target: hide_target,
  show_target: show_target
};
module.exports = BuildInput;

function init(selection, map, zoom_container, settings) {
  // set up container
  var new_sel = selection.append('div').attr('id', 'rxn-input');
  this.placed_div = PlacedDiv(new_sel, map, { x: 240, y: 0 });
  this.placed_div.hide();

  // set up complete.ly
  var c = completely(new_sel.node(), { backgroundColor: '#eee' });

  d3_select(c.input);
  this.completely = c;
  // close button
  new_sel.append('button').attr('class', 'button input-close-button').text("×").on('mousedown', function () {
    this.hide_dropdown();
  }.bind(this));

  // map
  this.map = map;
  // set up the reaction direction arrow
  var default_angle = 90; // degrees
  this.direction_arrow = new DirectionArrow(map.sel);
  this.direction_arrow.set_rotation(default_angle);
  this.setup_map_callbacks(map);

  // zoom container
  this.zoom_container = zoom_container;
  this.setup_zoom_callbacks(zoom_container);

  // settings
  this.settings = settings;

  // toggle off
  this.toggle(false);
  this.target_coords = null;
}

function setup_map_callbacks(map) {
  // input
  map.callback_manager.set('select_metabolite_with_id.input', function (selected_node, coords) {
    if (this.is_active) {
      this.reload(selected_node, coords, false);
      this.show_dropdown(coords);
    }
    this.hide_target();
  }.bind(this));
  map.callback_manager.set('select_selectable.input', function (count, selected_node, coords) {
    this.hide_target();
    if (count == 1 && this.is_active && coords) {
      this.reload(selected_node, coords, false);
      this.show_dropdown(coords);
    } else {
      this.toggle(false);
    }
  }.bind(this));
  map.callback_manager.set('deselect_nodes', function () {
    this.direction_arrow.hide();
    this.hide_dropdown();
  }.bind(this));

  // svg export
  map.callback_manager.set('before_svg_export', function () {
    this.direction_arrow.hide();
    this.hide_target();
  }.bind(this));
}

function setup_zoom_callbacks(zoom_container) {
  zoom_container.callback_manager.set('zoom.input', function () {
    if (this.is_active) {
      this.place_at_selected();
    }
  }.bind(this));
}

function is_visible() {
  return this.placed_div.is_visible();
}

function toggle(on_off) {
  if (on_off === undefined) this.is_active = !this.is_active;else this.is_active = on_off;
  if (this.is_active) {
    this.toggle_start_reaction_listener(true);
    if (_.isNull(this.target_coords)) this.reload_at_selected();else this.placed_div.place(this.target_coords);
    this.show_dropdown();
    this.map.set_status('Click on the canvas or an existing metabolite');
    this.direction_arrow.show();
  } else {
    this.toggle_start_reaction_listener(false);
    this.hide_dropdown();
    this.map.set_status(null);
    this.direction_arrow.hide();
  }
}

function show_dropdown(coords) {
  // escape key
  this.clear_escape = this.map.key_manager.add_escape_listener(function () {
    this.hide_dropdown();
  }.bind(this), true);
  // dropdown
  this.completely.input.blur();
  this.completely.repaint();
  this.completely.setText('');
  this.completely.input.focus();
}

function hide_dropdown() {
  // escape key
  if (this.clear_escape) this.clear_escape();
  this.clear_escape = null;
  // dropdown
  this.placed_div.hide();
  this.completely.input.blur();
  this.completely.hideDropDown();
}

function place_at_selected() {
  /** Place autocomplete box at the first selected node. */
  // get the selected node
  this.map.deselect_text_labels();
  var selected_node = this.map.select_single_node();
  if (selected_node == null) return;
  var coords = { x: selected_node.x, y: selected_node.y };
  this.place(coords);
}

function place(coords) {
  this.placed_div.place(coords);
  this.direction_arrow.set_location(coords);
  this.direction_arrow.show();
}

function reload_at_selected() {
  /** Reload data for autocomplete box and redraw box at the first selected
      node. */
  // get the selected node
  this.map.deselect_text_labels();
  var selected_node = this.map.select_single_node();
  if (selected_node == null) return false;
  var coords = { x: selected_node.x, y: selected_node.y
    // reload the reaction input
  };this.reload(selected_node, coords, false);
  return true;
}

/**
 * Reload data for autocomplete box and redraw box at the new coordinates.
 */
function reload(selected_node, coords, starting_from_scratch) {
  // Try finding the selected node
  if (!starting_from_scratch && !selected_node) {
    console.error('No selected node, and not starting from scratch');
    return;
  }

  this.place(coords);

  if (this.map.cobra_model === null) {
    this.completely.setText('Cannot add: No model.');
    return;
  }

  // settings
  var show_names = this.settings.get_option('identifiers_on_map') === 'name';
  var allow_duplicates = this.settings.get_option('allow_building_duplicate_reactions');

  // Find selected
  var options = [],
      cobra_reactions = this.map.cobra_model.reactions,
      cobra_metabolites = this.map.cobra_model.metabolites,
      reactions = this.map.reactions,
      has_data_on_reactions = this.map.has_data_on_reactions,
      reaction_data = this.map.reaction_data,
      reaction_data_styles = this.map.reaction_data_styles,
      selected_m_name = selected_node ? show_names ? selected_node.name : selected_node.bigg_id : '',
      bold_mets_in_str = function bold_mets_in_str(str, mets) {
    return str.replace(new RegExp('(^| )(' + mets.join('|') + ')($| )', 'g'), '$1<b>$2</b>$3');
  };

  // for reactions
  var reaction_suggestions = {};
  for (var bigg_id in cobra_reactions) {
    var reaction = cobra_reactions[bigg_id];
    var reaction_name = reaction.name;
    var show_r_name = show_names ? reaction_name : bigg_id;

    // ignore drawn reactions
    if (!allow_duplicates && already_drawn(bigg_id, reactions)) {
      continue;
    }

    // check segments for match to selected metabolite
    for (var met_bigg_id in reaction.metabolites) {

      // if starting with a selected metabolite, check for that id
      if (starting_from_scratch || met_bigg_id == selected_node.bigg_id) {

        // don't add suggestions twice
        if (bigg_id in reaction_suggestions) continue;

        var met_name = cobra_metabolites[met_bigg_id].name;

        if (has_data_on_reactions) {
          options.push({ reaction_data: reaction.data,
            html: '<b>' + show_r_name + '</b>' + ': ' + reaction.data_string,
            matches: [show_r_name],
            id: bigg_id });
          reaction_suggestions[bigg_id] = true;
        } else {
          // get the metabolite names or IDs
          var mets = {};
          var show_met_names = [];
          var met_id;
          if (show_names) {
            for (met_id in reaction.metabolites) {
              var name = cobra_metabolites[met_id].name;
              mets[name] = reaction.metabolites[met_id];
              show_met_names.push(name);
            }
          } else {
            mets = utils.clone(reaction.metabolites);
            for (met_id in reaction.metabolites) {
              show_met_names.push(met_id);
            }
          }
          var show_gene_names = _.flatten(reaction.genes.map(function (g_obj) {
            return [g_obj.name, g_obj.bigg_id];
          }));
          // get the reaction string
          var reaction_string = CobraModel.build_reaction_string(mets, reaction.reversibility, reaction.lower_bound, reaction.upper_bound);
          options.push({
            html: '<b>' + show_r_name + '</b>' + '\t' + bold_mets_in_str(reaction_string, [selected_m_name]),
            matches: [show_r_name].concat(show_met_names).concat(show_gene_names),
            id: bigg_id
          });
          reaction_suggestions[bigg_id] = true;
        }
      }
    }
  }

  // Generate the array of reactions to suggest and sort it
  var sort_fn;
  if (has_data_on_reactions) {
    sort_fn = function sort_fn(x, y) {
      return Math.abs(y.reaction_data) - Math.abs(x.reaction_data);
    };
  } else {
    sort_fn = function sort_fn(x, y) {
      return x.html.toLowerCase() < y.html.toLowerCase() ? -1 : 1;
    };
  }
  options = options.sort(sort_fn);
  // set up the box with data
  var complete = this.completely;
  complete.options = options;

  // TODO test this behavior
  // if (strings_to_display.length==1) complete.setText(strings_to_display[0])
  // else complete.setText("")
  complete.setText('');

  var direction_arrow = this.direction_arrow,
      check_and_build = function (id) {
    if (id !== null) {
      // make sure the selected node exists, in case changes were made in the meantime
      if (starting_from_scratch) {
        this.map.new_reaction_from_scratch(id, coords, direction_arrow.get_rotation());
      } else {
        if (!(selected_node.node_id in this.map.nodes)) {
          console.error('Selected node no longer exists');
          this.hide_dropdown();
          return;
        }
        this.map.new_reaction_for_metabolite(id, selected_node.node_id, direction_arrow.get_rotation());
      }
    }
  }.bind(this);
  complete.onEnter = function (id) {
    this.setText('');
    this.onChange('');
    check_and_build(id);
  };

  //definitions
  function already_drawn(bigg_id, reactions) {
    for (var drawn_id in reactions) {
      if (reactions[drawn_id].bigg_id === bigg_id) return true;
    }
    return false;
  }
}

/**
 * Toggle listening for a click to place a new reaction on the canvas.
 */
function toggle_start_reaction_listener(on_off) {
  if (on_off === undefined) {
    this.start_reaction_listener = !this.start_reaction_listener;
  } else if (this.start_reaction_listener === on_off) {
    return;
  } else {
    this.start_reaction_listener = on_off;
  }

  if (this.start_reaction_listener) {
    this.map.sel.on('click.start_reaction', function (node) {
      // TODO fix this hack
      if (this.direction_arrow.dragging) return;
      // reload the reaction input
      var coords = { x: d3_mouse(node)[0],
        y: d3_mouse(node)[1]
        // unselect metabolites
      };this.map.deselect_nodes();
      this.map.deselect_text_labels();
      // reload the reaction input
      this.reload(null, coords, true);
      // generate the target symbol
      this.show_target(this.map, coords);
      // show the dropdown
      this.show_dropdown(coords);
    }.bind(this, this.map.sel.node()));
    this.map.sel.classed('start-reaction-cursor', true);
  } else {
    this.map.sel.on('click.start_reaction', null);
    this.map.sel.classed('start-reaction-cursor', false);
    this.hide_target();
  }
}

function hide_target() {
  if (this.target_coords) {
    this.map.sel.selectAll('.start-reaction-target').remove();
  }
  this.target_coords = null;
}

function show_target(map, coords) {
  var s = map.sel.selectAll('.start-reaction-target').data([12, 5]);
  s.enter().append('circle').classed('start-reaction-target', true).attr('r', function (d) {
    return d;
  }).style('stroke-width', 4).merge(s).style('visibility', 'visible').attr('transform', 'translate(' + coords.x + ',' + coords.y + ')');
  this.target_coords = coords;
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @license
 *
 * complete.ly 1.0.0
 * MIT Licensing
 * Copyright (c) 2013 Lorenzo Puccetti
 *
 * This Software shall be used for doing good things, not bad things.
 *
 *
 * Modified by Zachary King (c) 2014.
 *
 **/

var utils = __webpack_require__(0);

module.exports = function (container, config) {
    var thisDocument = utils.get_document(container);
    var thisWindow = utils.get_window(container);

    config = config || {};
    config.fontSize = config.fontSize || '13px';
    config.fontFamily = config.fontFamily || 'sans-serif';
    config.promptInnerHTML = config.promptInnerHTML || '';
    config.color = config.color || '#333';
    config.hintColor = config.hintColor || '#aaa';
    config.backgroundColor = config.backgroundColor || '#fff';
    config.dropDownBorderColor = config.dropDownBorderColor || '#aaa';
    config.dropDownZIndex = config.dropDownZIndex || '100'; // to ensure we are in front of everybody
    config.dropDownOnHoverBackgroundColor = config.dropDownOnHoverBackgroundColor || '#ddd';

    var txtInput = thisDocument.createElement('input');
    txtInput.type = 'text';
    txtInput.spellcheck = false;
    txtInput.style.fontSize = config.fontSize;
    txtInput.style.fontFamily = config.fontFamily;
    txtInput.style.color = config.color;
    txtInput.style.backgroundColor = config.backgroundColor;
    txtInput.style.width = '100%';
    txtInput.style.outline = '0';
    txtInput.style.border = '0';
    txtInput.style.margin = '0';
    txtInput.style.padding = '0';

    var txtHint = txtInput.cloneNode();
    txtHint.disabled = '';
    txtHint.style.position = 'absolute';
    txtHint.style.top = '0';
    txtHint.style.left = '0';
    txtHint.style.borderColor = 'transparent';
    txtHint.style.boxShadow = 'none';
    txtHint.style.color = config.hintColor;

    txtInput.style.backgroundColor = 'transparent';
    txtInput.style.verticalAlign = 'top';
    txtInput.style.position = 'relative';

    var wrapper = thisDocument.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.outline = '0';
    wrapper.style.border = '0';
    wrapper.style.margin = '0';
    wrapper.style.padding = '0';

    var prompt = thisDocument.createElement('div');
    prompt.style.position = 'absolute';
    prompt.style.outline = '0';
    prompt.style.margin = '0';
    prompt.style.padding = '0';
    prompt.style.border = '0';
    prompt.style.fontSize = config.fontSize;
    prompt.style.fontFamily = config.fontFamily;
    prompt.style.color = config.color;
    prompt.style.backgroundColor = config.backgroundColor;
    prompt.style.top = '0';
    prompt.style.left = '0';
    prompt.style.overflow = 'hidden';
    prompt.innerHTML = config.promptInnerHTML;
    prompt.style.background = 'transparent';
    if (thisDocument.body === undefined) {
        throw 'thisDocument.body is undefined. The library was wired up incorrectly.';
    }
    thisDocument.body.appendChild(prompt);
    var w = prompt.getBoundingClientRect().right; // works out the width of the prompt.
    wrapper.appendChild(prompt);
    prompt.style.visibility = 'visible';
    prompt.style.left = '-' + w + 'px';
    wrapper.style.marginLeft = w + 'px';

    wrapper.appendChild(txtHint);
    wrapper.appendChild(txtInput);

    var dropDown = thisDocument.createElement('div');
    dropDown.style.position = 'absolute';
    dropDown.style.visibility = 'hidden';
    dropDown.style.outline = '0';
    dropDown.style.margin = '0';
    dropDown.style.padding = '0';
    dropDown.style.textAlign = 'left';
    dropDown.style.fontSize = config.fontSize;
    dropDown.style.fontFamily = config.fontFamily;
    dropDown.style.backgroundColor = config.backgroundColor;
    dropDown.style.zIndex = config.dropDownZIndex;
    dropDown.style.cursor = 'default';
    dropDown.style.borderStyle = 'solid';
    dropDown.style.borderWidth = '1px';
    dropDown.style.borderColor = config.dropDownBorderColor;
    dropDown.style.overflowX = 'hidden';
    dropDown.style.whiteSpace = 'pre';
    dropDown.style.overflowY = 'scroll';

    var createDropDownController = function createDropDownController(elem) {
        var rows = [];
        var ix = 0;
        var oldIndex = -1;
        var current_row = null;

        var onMouseOver = function onMouseOver() {
            this.style.outline = '1px solid #ddd';
        };
        var onMouseOut = function onMouseOut() {
            this.style.outline = '0';
        };
        var onDblClick = function onDblClick(e) {
            e.preventDefault();
            p.onmouseselection(this.id);
        };

        var p = {
            hide: function hide() {
                elem.style.visibility = 'hidden';
            },
            refresh: function refresh(token, options) {
                elem.style.visibility = 'hidden';
                ix = 0;
                elem.innerHTML = '';
                var vph = thisWindow.innerHeight || thisDocument.documentElement.clientHeight;
                var rect = elem.parentNode.getBoundingClientRect();
                var distanceToTop = rect.top - 6; // heuristic give 6px
                var distanceToBottom = vph - rect.bottom - 6; // distance from the browser border.

                rows = [];
                for (var i = 0; i < options.length; i++) {
                    // ignore case
                    var found = options[i].matches.filter(function (match) {
                        return match.toLowerCase().indexOf(token.toLowerCase()) == 0;
                    });
                    if (found.length == 0) continue;
                    var divRow = thisDocument.createElement('div');
                    divRow.style.color = config.color;
                    divRow.onmouseover = onMouseOver;
                    divRow.onmouseout = onMouseOut;
                    // prevent selection for double click
                    divRow.onmousedown = function (e) {
                        e.preventDefault();
                    };
                    divRow.ondblclick = onDblClick;
                    divRow.__hint = found[0];
                    divRow.id = options[i].id;
                    divRow.innerHTML = options[i].html;
                    rows.push(divRow);
                    elem.appendChild(divRow);
                    // limit results and add a note at the buttom
                    if (rows.length >= rs.display_limit) {
                        var divRow2 = thisDocument.createElement('div');
                        divRow2.innerHTML = ' ' + (options.length - rows.length) + ' more';
                        rows.push(divRow2);
                        elem.appendChild(divRow2);
                        break;
                    }
                }
                if (rows.length === 0) {
                    return; // nothing to show.
                }
                p.highlight(0);

                // Heuristic (only when the distance to the to top is 4
                // times more than distance to the bottom
                if (distanceToTop > distanceToBottom * 3) {
                    // we display the dropDown on the top of the input text
                    elem.style.maxHeight = distanceToTop + 'px';
                    elem.style.top = '';
                    elem.style.bottom = '100%';
                } else {
                    elem.style.top = '100%';
                    elem.style.bottom = '';
                    elem.style.maxHeight = distanceToBottom + 'px';
                }
                elem.style.visibility = 'visible';
            },
            highlight: function highlight(index) {
                if (oldIndex != -1 && rows[oldIndex]) {
                    rows[oldIndex].style.backgroundColor = config.backgroundColor;
                }
                rows[index].style.backgroundColor = config.dropDownOnHoverBackgroundColor; // <-- should be config
                oldIndex = index;
                current_row = rows[index];
            },
            // moves the selection either up or down (unless it's not
            // possible) step is either +1 or -1.
            move: function move(step) {
                // nothing to move if there is no dropDown. (this happens if
                // the user hits escape and then down or up)
                if (elem.style.visibility === 'hidden') return '';
                // No circular scrolling
                if (ix + step === -1 || ix + step === rows.length) return rows[ix].__hint;
                ix += step;
                p.highlight(ix);
                return rows[ix].__hint;
            },
            onmouseselection: function onmouseselection() {},
            get_current_row: function get_current_row() {
                return current_row;
            }
        };
        return p;
    };

    var dropDownController = createDropDownController(dropDown);

    dropDownController.onmouseselection = function (id) {
        rs.onEnter(id);
        rs.input.focus();
    };

    wrapper.appendChild(dropDown);
    container.appendChild(wrapper);

    var spacer,
    // This will contain the leftSide part of the textfield (the bit that
    // was already autocompleted)
    leftSide;

    function calculateWidthForText(text) {
        if (spacer === undefined) {
            // on first call only.
            spacer = thisDocument.createElement('span');
            spacer.style.visibility = 'hidden';
            spacer.style.position = 'fixed';
            spacer.style.outline = '0';
            spacer.style.margin = '0';
            spacer.style.padding = '0';
            spacer.style.border = '0';
            spacer.style.left = '0';
            spacer.style.whiteSpace = 'pre';
            spacer.style.fontSize = config.fontSize;
            spacer.style.fontFamily = config.fontFamily;
            spacer.style.fontWeight = 'normal';
            thisDocument.body.appendChild(spacer);
        }

        // Used to encode an HTML string into a plain text.
        // taken from http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
        spacer.innerHTML = String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return spacer.getBoundingClientRect().right;
    }

    var rs = {
        get_hint: function get_hint(x) {
            return x;
        },
        display_limit: 1000,
        onArrowDown: function onArrowDown() {}, // defaults to no action.
        onArrowUp: function onArrowUp() {}, // defaults to no action.
        onEnter: function onEnter() {}, // defaults to no action.
        onTab: function onTab() {}, // defaults to no action.
        onChange: function onChange() {
            rs.repaint();
        }, // defaults to repainting.
        startFrom: 0,
        options: [],

        // Only to allow easy access to the HTML elements to the final user
        // (possibly for minor customizations)
        wrapper: wrapper,
        input: txtInput,
        hint: txtHint,
        dropDown: dropDown,

        prompt: prompt,
        setText: function setText(text) {
            txtHint.value = text;
            txtInput.value = text;
        },
        getText: function getText() {
            return txtInput.value;
        },
        hideDropDown: function hideDropDown() {
            dropDownController.hide();
        },
        repaint: function repaint() {
            var text = txtInput.value;
            var startFrom = rs.startFrom;
            var options = rs.options;
            var optionsLength = options.length;

            // breaking text in leftSide and token.
            var token = text.substring(startFrom);
            leftSide = text.substring(0, startFrom);

            // updating the hint.
            txtHint.value = '';
            for (var i = 0; i < optionsLength; i++) {
                var found = options[i].matches.filter(function (match) {
                    return match.toLowerCase().indexOf(token.toLowerCase()) == 0;
                });
                if (found.length == 0) continue;
                txtHint.value = rs.get_hint(found[0]);
                break;
            }

            // moving the dropDown and refreshing it.
            dropDown.style.left = calculateWidthForText(leftSide) + 'px';
            dropDownController.refresh(token, rs.options);
        }
    };

    var registerOnTextChangeOldValue;

    // Register a callback function to detect changes to the content of the
    // input-type-text.  Those changes are typically followed by user's
    // action: a key-stroke event but sometimes it might be a mouse click.
    var registerOnTextChange = function registerOnTextChange(txt, callback) {
        registerOnTextChangeOldValue = txt.value;
        var handler = function handler() {
            var value = txt.value;
            if (registerOnTextChangeOldValue !== value) {
                registerOnTextChangeOldValue = value;
                callback(value);
            }
        };

        // For user's actions, we listen to both input events and key up events
        // It appears that input events are not enough so we defensively listen to key up events too.
        // source: http://help.dottoro.com/ljhxklln.php
        //
        // The cost of listening to three sources should be negligible as the handler will invoke callback function
        // only if the text.value was effectively changed.
        txt.addEventListener("input", handler, false);
        txt.addEventListener('keyup', handler, false);
        txt.addEventListener('change', handler, false);
    };

    registerOnTextChange(txtInput, function (text) {
        // note the function needs to be wrapped as API-users will define their onChange
        rs.onChange(text);
        rs.repaint();
    });

    var keyDownHandler = function keyDownHandler(e) {
        e = e || thisWindow.event;
        var keyCode = e.keyCode;

        if (keyCode == 33) {
            return;
        } // page up (do nothing)
        if (keyCode == 34) {
            return;
        } // page down (do nothing);

        // right,  end, tab  (autocomplete triggered)
        if (keyCode == 39 || keyCode == 35 || keyCode == 9) {
            // for tabs we need to ensure that we override the default
            // behaviour: move to the next focusable HTML-element
            if (keyCode == 9) {
                e.preventDefault();
                e.stopPropagation();
                if (txtHint.value.length == 0) {
                    // tab was called with no action.
                    rs.onTab();
                }
            }
            // if there is a hint
            if (txtHint.value.length > 0) {
                txtInput.value = txtHint.value;
                var hasTextChanged = registerOnTextChangeOldValue != txtInput.value;
                // avoid dropDown to appear again
                registerOnTextChangeOldValue = txtInput.value;
                // for example imagine the array contains the following
                // words: bee, beef, beetroot. User has hit enter to get
                // 'bee' it would be prompted with the dropDown again (as
                // beef and beetroot also match)
                if (hasTextChanged) {
                    // force it.
                    rs.onChange(txtInput.value);
                }
            }
            return;
        }

        if (keyCode == 13) {
            // enter
            // get current
            var id = dropDownController.get_current_row().id;
            rs.onEnter(id);
            return;
        }

        if (keyCode == 40) {
            // down
            var m = dropDownController.move(+1);
            if (m == '') {
                rs.onArrowDown();
            }
            txtHint.value = rs.get_hint(m);
            return;
        }

        if (keyCode == 38) {
            // up
            var m = dropDownController.move(-1);
            if (m == '') {
                rs.onArrowUp();
            }
            txtHint.value = rs.get_hint(m);
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // it's important to reset the txtHint on key down. Think: user
        // presses a letter (e.g. 'x') and never releases. You get
        // (xxxxxxxxxxxxxxxxx) and you would see still the hint. Reset the
        // txtHint. (it might be updated onKeyUp).
        txtHint.value = '';
    };

    txtInput.addEventListener("keydown", keyDownHandler, false);
    return rs;
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** DirectionArrow. A constructor for an arrow that can be rotated and dragged,
 and supplies its direction. */

var utils = __webpack_require__(0);
var d3_drag = __webpack_require__(5).drag;
var d3_mouse = __webpack_require__(1).mouse;
var d3_selection = __webpack_require__(1);

var DirectionArrow = utils.make_class();
DirectionArrow.prototype = {
    init: init,
    set_location: set_location,
    set_rotation: set_rotation,
    displace_rotation: displace_rotation,
    get_rotation: get_rotation,
    toggle: toggle,
    show: show,
    hide: hide,
    right: right,
    left: left,
    up: up,
    down: down,
    _setup_drag: _setup_drag
};
module.exports = DirectionArrow;

// definitions
function init(sel) {
    this.arrow_container = sel.append('g').attr('id', 'direction-arrow-container').attr('transform', 'translate(0,0)rotate(0)');
    this.arrow = this.arrow_container.append('path').classed('direction-arrow', true).attr('d', path_for_arrow()).style('visibility', 'hidden').attr('transform', 'translate(30,0)scale(2.5)');

    this.sel = sel;
    this.center = { x: 0, y: 0 };

    this._setup_drag();
    this.dragging = false;

    this.is_visible = false;
    this.show();

    // definitions
    function path_for_arrow() {
        return "M0 -5 L0 5 L20 5 L20 10 L30 0 L20 -10 L20 -5 Z";
    }
}
function set_location(coords) {
    /** Move the arrow to coords.
     */
    this.center = coords;
    var transform = utils.d3_transform_catch(this.arrow_container.attr('transform'));
    this.arrow_container.attr('transform', 'translate(' + coords.x + ',' + coords.y + ')rotate(' + transform.rotate + ')');
}
function set_rotation(rotation) {
    /** Rotate the arrow to rotation.
     */
    var transform = utils.d3_transform_catch(this.arrow_container.attr('transform'));
    this.arrow_container.attr('transform', 'translate(' + transform.translate + ')rotate(' + rotation + ')');
}
function displace_rotation(d_rotation) {
    /** Displace the arrow rotation by a set amount.
     */
    var transform = utils.d3_transform_catch(this.arrow_container.attr('transform'));
    this.arrow_container.attr('transform', 'translate(' + transform.translate + ')' + 'rotate(' + (transform.rotate + d_rotation) + ')');
}
function get_rotation() {
    /** Returns the arrow rotation.
     */
    return utils.d3_transform_catch(this.arrow_container.attr('transform')).rotate;
}
function toggle(on_off) {
    if (on_off === undefined) this.is_visible = !this.is_visible;else this.is_visible = on_off;
    this.arrow.style('visibility', this.is_visible ? 'visible' : 'hidden');
}
function show() {
    this.toggle(true);
}
function hide() {
    this.toggle(false);
}
function right() {
    this.set_rotation(0);
}
function down() {
    this.set_rotation(90);
}
function left() {
    this.set_rotation(180);
}
function up() {
    this.set_rotation(270);
}

function _setup_drag() {
    var b = d3_drag().on("start", function (d) {
        // silence other listeners
        d3_selection.event.sourceEvent.stopPropagation();
        this.dragging = true;
    }.bind(this)).on("drag.direction_arrow", function (d) {
        var displacement = { x: d3_selection.event.dx,
            y: d3_selection.event.dy },
            location = { x: d3_mouse(this.sel.node())[0],
            y: d3_mouse(this.sel.node())[1] },
            d_angle = utils.angle_for_event(displacement, location, this.center);
        this.displace_rotation(utils.to_degrees(d_angle));
    }.bind(this)).on("end", function (d) {
        setTimeout(function () {
            this.dragging = false;
        }.bind(this), 200);
    }.bind(this));
    this.arrow_container.call(b);
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * ZoomContainer
 */

var utils = __webpack_require__(0);
var CallbackManager = __webpack_require__(3);
var _ = __webpack_require__(2);
var d3_zoom = __webpack_require__(9).zoom;
var d3_zoomTransform = __webpack_require__(9).zoomTransform;
var d3_zoomIdentity = __webpack_require__(9).zoomIdentity;
var d3_select = __webpack_require__(1).select;
var d3_selection = __webpack_require__(1);

var ZoomContainer = utils.make_class();
ZoomContainer.prototype = {
  init: init,
  set_scroll_behavior: set_scroll_behavior,
  set_use_3d_transform: set_use_3d_transform,
  _update_scroll: _update_scroll,
  toggle_pan_drag: toggle_pan_drag,
  go_to: go_to,
  _go_to_callback: _go_to_callback,
  _go_to_3d: _go_to_3d,
  _clear_3d: _clear_3d,
  _go_to_svg: _go_to_svg,
  zoom_by: zoom_by,
  zoom_in: zoom_in,
  zoom_out: zoom_out,
  get_size: get_size,
  translate_off_screen: translate_off_screen
};
module.exports = ZoomContainer;

/**
 * Make a container that will manage panning and zooming. Creates a new SVG
 * element, with a parent div for CSS3 3D transforms.
 *
 * @param {D3 Selection} selection - A d3 selection of a HTML node to put the
 * zoom container in. Should have a defined width and height.
 *
 * @param {String} scroll_behavior - Either 'zoom' or 'pan'.
 *
 * @param {Boolean} use_3d_transform - If true, then use CSS3 3D transform to
 * speed up pan and zoom.
 *
 * @param {Boolean} fill_screen - If true, then apply styles to body and
 * selection that fill the screen. The styled classes are 'fill-screen-body' and
 * 'fill-screen-div'.
 */
function init(selection, scroll_behavior, use_3d_transform, fill_screen) {
  // set the selection class
  selection.classed('escher-container', true);

  // Stop scrolling on mobile
  selection.on('touchstart touchmove', function () {
    d3_selection.event.stopPropagation();
  });

  // fill screen classes
  if (fill_screen) {
    d3_select('html').classed('fill-screen', true);
    d3_select('body').classed('fill-screen', true);
    selection.classed('fill-screen-div', true);
  }

  // make the svg
  var zoom_container = selection.append('div').attr('class', 'escher-zoom-container');

  var css3_transform_container = zoom_container.append('div').attr('class', 'escher-3d-transform-container');

  var svg = css3_transform_container.append('svg').attr('class', 'escher-svg').attr('xmlns', 'http://www.w3.org/2000/svg');

  // set up the zoom container
  svg.select('.zoom-g').remove();
  var zoomed_sel = svg.append('g').attr('class', 'zoom-g');

  // attributes
  this.selection = selection;
  this.zoom_container = zoom_container;
  this.css3_transform_container = css3_transform_container;
  this.svg = svg;
  this.zoomed_sel = zoomed_sel;
  this.window_translate = { x: 0, y: 0 };
  this.window_scale = 1.0;

  this._scroll_behavior = scroll_behavior;
  this._use_3d_transform = use_3d_transform;
  this._pan_drag_on = true;
  this._zoom_behavior = null;
  this._zoom_timeout = null;
  this._svg_scale = this.window_scale;
  this._svg_translate = this.window_translate;
  // this._last_svg_ms = null

  // set up the callbacks
  this.callback_manager = new CallbackManager();

  // update the scroll behavior
  this._update_scroll();
}

/**
 * Set up pan or zoom on scroll.
 * @param {String} scroll_behavior - 'none', 'pan' or 'zoom'.
 */
function set_scroll_behavior(scroll_behavior) {
  this._scroll_behavior = scroll_behavior;
  this._update_scroll();
}

/**
 * Set the option use_3d_transform
 */
function set_use_3d_transform(use_3d_transform) {
  this._use_3d_transform = use_3d_transform;
}

/**
 * Toggle the zoom drag and the cursor UI for it.
 */
function toggle_pan_drag(on_off) {
  if (_.isUndefined(on_off)) {
    this._pan_drag_on = !this._pan_drag_on;
  } else {
    this._pan_drag_on = on_off;
  }

  if (this._pan_drag_on) {
    // turn on the hand
    this.zoomed_sel.classed('cursor-grab', true).classed('cursor-grabbing', false);
  } else {
    // turn off the hand
    this.zoomed_sel.style('cursor', null).classed('cursor-grab', false).classed('cursor-grabbing', false);
  }

  // update the behaviors
  this._update_scroll();
}

/**
 * Update the pan and zoom behaviors. The behaviors are applied to the
 * css3_transform_container node.
 */
function _update_scroll() {
  if (!_.contains(['zoom', 'pan', 'none'], this._scroll_behavior)) {
    throw Error('Bad value for scroll_behavior: ' + this._scroll_behavior);
  }

  // clear all behaviors
  this.zoom_container.on('mousewheel.zoom', null) // zoom scroll behaviors
  .on('DOMMouseScroll.zoom', null) // disables older versions of Firefox
  .on('wheel.zoom', null) // disables newer versions of Firefox
  .on('dblclick.zoom', null).on('mousewheel.escher', null) // pan scroll behaviors
  .on('DOMMouseScroll.escher', null).on('wheel.escher', null).on('mousedown.zoom', null) // drag behaviors
  .on('touchstart.zoom', null).on('touchmove.zoom', null).on('touchend.zoom', null);

  // This handles dragging to pan, and touch events (in any scroll mode). It
  // also handles scrolling to zoom (only 'zoom' mode). It also raises an
  // exception in node, so catch that during testing. This may be a bug with
  // d3 related to d3 using the global this.document. TODO look into this.
  this._zoom_behavior = d3_zoom().on('start', function () {
    if (d3_selection.event.sourceEvent && d3_selection.event.sourceEvent.type === 'mousedown') {
      this.zoomed_sel.classed('cursor-grab', false).classed('cursor-grabbing', true);
    }
    // Prevent default zoom behavior, specifically for mobile pinch zoom
    if (d3_selection.event.sourceEvent !== null) {
      d3_selection.event.sourceEvent.stopPropagation();
      d3_selection.event.sourceEvent.preventDefault();
    }
  }.bind(this)).on('zoom', function () {
    this._go_to_callback(d3_selection.event.transform.k, {
      x: d3_selection.event.transform.x,
      y: d3_selection.event.transform.y
    });
  }.bind(this)).on('end', function () {
    if (d3_selection.event.sourceEvent && d3_selection.event.sourceEvent.type === 'mouseup') {
      this.zoomed_sel.classed('cursor-grab', true).classed('cursor-grabbing', false);
    }
  }.bind(this));

  // Set it up
  this.zoom_container.call(this._zoom_behavior);

  // Always turn off double-clicking to zoom
  this.zoom_container.on('dblclick.zoom', null);

  // If panning is off, then turn off these listeners
  if (!this._pan_drag_on) {
    this.zoom_container.on('mousedown.zoom', null).on('touchstart.zoom', null).on('touchmove.zoom', null).on('touchend.zoom', null);
  }

  // If scroll to zoom is off, then turn off these listeners
  if (this._scroll_behavior !== 'zoom') {
    this.zoom_container.on('mousewheel.zoom', null) // zoom scroll behaviors
    .on('DOMMouseScroll.zoom', null) // disables older versions of Firefox
    .on('wheel.zoom', null); // disables newer versions of Firefox
  }

  // add listeners for scrolling to pan
  if (this._scroll_behavior === 'pan') {
    // Add the wheel listener
    var wheel_fn = function () {
      var ev = d3_selection.event;
      var sensitivity = 0.5;
      // stop scroll in parent elements
      ev.stopPropagation();
      ev.preventDefault();
      ev.returnValue = false;
      // change the location
      var get_directional_disp = function get_directional_disp(wheel_delta, delta) {
        var the_delt = _.isUndefined(wheel_delta) ? delta : -wheel_delta / 1.5;
        return the_delt * sensitivity;
      };
      var new_translate = {
        x: this.window_translate.x - get_directional_disp(ev.wheelDeltaX, ev.deltaX),
        y: this.window_translate.y - get_directional_disp(ev.wheelDeltaY, ev.deltaY)
      };
      this.go_to(this.window_scale, new_translate);
    }.bind(this);

    // apply it
    this.zoom_container.on('mousewheel.escher', wheel_fn);
    this.zoom_container.on('DOMMouseScroll.escher', wheel_fn);
    this.zoom_container.on('wheel.escher', wheel_fn);
  }

  // Set current location
  this.go_to(this.window_scale, this.window_translate);
}

// ------------------------------------------------------------
// Functions to scale and translate
// ------------------------------------------------------------

/**
 * Zoom the container to a specified location.
 * @param {Number} scale - The scale, between 0 and 1.
 * @param {Object} translate - The location, of the form {x: 2.0, y: 3.0}.
 */
function go_to(scale, translate) {
  utils.check_undefined(arguments, ['scale', 'translate']);

  // Check inputs
  if (!scale) {
    throw new Error('Bad scale value');
  }
  if (!translate || !('x' in translate) || !('y' in translate) || _.isNaN(translate.x) || _.isNaN(translate.y)) {
    throw new Error('Bad translate value');
  }

  // Save to zoom behavior, which will call _go_to_callback
  var new_zoom = d3_zoomIdentity.translate(translate.x, translate.y).scale(scale);
  this.zoom_container.call(this._zoom_behavior.transform, new_zoom);
}

/**
 * Execute the zoom called by the d3 zoom behavior.
 * @param {Number} scale - The scale, between 0 and 1
 * @param {Object} translate - The location, of the form { x: 2.0, y: 3.0 }
 */
function _go_to_callback(scale, translate) {
  this.window_scale = scale;
  this.window_translate = translate;

  var use_3d_transform = this._use_3d_transform;

  if (use_3d_transform) {
    // 3d tranform
    // cancel all timeouts
    if (!_.isNull(this._zoom_timeout)) {
      clearTimeout(this._zoom_timeout);
    }

    // set the 3d transform
    this._go_to_3d(scale, translate, this._svg_scale, this._svg_translate);

    // if another go_to does not happen within the delay time, then
    // redraw the svg
    this._zoom_timeout = _.delay(function () {
      // redraw the svg
      this._go_to_svg(scale, translate);
    }.bind(this), 100); // between 100 and 600 seems to be usable
  } else {
    // no 3d transform
    this._go_to_svg(scale, translate);
  }

  this.callback_manager.run('go_to');
}

/**
 * Zoom & pan the CSS 3D transform container
 */
function _go_to_3d(scale, translate, svg_scale, svg_translate) {
  var n_scale = scale / svg_scale;
  var n_translate = utils.c_minus_c(translate, utils.c_times_scalar(svg_translate, n_scale));
  var transform = 'translate(' + n_translate.x + 'px,' + n_translate.y + 'px) ' + 'scale(' + n_scale + ')';
  this.css3_transform_container.style('transform', transform);
  this.css3_transform_container.style('-webkit-transform', transform);
  this.css3_transform_container.style('transform-origin', '0 0');
  this.css3_transform_container.style('-webkit-transform-origin', '0 0');
}

function _clear_3d() {
  this.css3_transform_container.style('transform', null);
  this.css3_transform_container.style('-webkit-transform', null);
  this.css3_transform_container.style('transform-origin', null);
  this.css3_transform_container.style('-webkit-transform-origin', null);
}

/**
 * Zoom & pan the svg element. Also runs the svg_start and svg_finish callbacks.
 * @param {Number} scale - The scale, between 0 and 1.
 * @param {Object} translate - The location, of the form {x: 2.0, y: 3.0}.
 * @param {Function} callback - (optional) A callback to run after scaling.
 */
function _go_to_svg(scale, translate, callback) {
  this.callback_manager.run('svg_start');

  // defer to update callbacks
  _.defer(function () {

    // start time
    // var start = new Date().getTime()

    // reset the 3d transform
    this._clear_3d();

    // redraw the svg
    this.zoomed_sel.attr('transform', 'translate(' + translate.x + ',' + translate.y + ') ' + 'scale(' + scale + ')');
    // save svg location
    this._svg_scale = scale;
    this._svg_translate = translate;

    _.defer(function () {
      // defer for callback after draw
      this.callback_manager.run('svg_finish');

      if (!_.isUndefined(callback)) callback();

      // wait a few ms to get a reliable end time
      // _.delay(function () {
      //     // end time
      //     var t = new Date().getTime() - start
      //     this._last_svg_ms = t
      // }.bind(this), 20)
    }.bind(this));
  }.bind(this));
}

/**
 * Zoom by a specified multiplier.
 * @param {Number} amount - A multiplier for the zoom. Greater than 1 zooms in
 * and less than 1 zooms out.
 */
function zoom_by(amount) {
  var size = this.get_size();
  var shift = {
    x: size.width / 2 - ((size.width / 2 - this.window_translate.x) * amount + this.window_translate.x),
    y: size.height / 2 - ((size.height / 2 - this.window_translate.y) * amount + this.window_translate.y)
  };
  this.go_to(this.window_scale * amount, utils.c_plus_c(this.window_translate, shift));
}

/**
 * Zoom in by the default amount with the default options.
 */
function zoom_in() {
  this.zoom_by(1.5);
}

/**
 * Zoom out by the default amount with the default options.
 */
function zoom_out() {
  this.zoom_by(0.667);
}

/**
 * Return the size of the zoom container as coordinates. Throws an error if
 * width or height is not defined.
 * @returns {Object} The size coordinates, e.g. { x: 2, y: 3 }.
 */
function get_size() {
  var width = parseInt(this.selection.style('width'), 10);
  var height = parseInt(this.selection.style('height'), 10);
  if (_.isNaN(width) || _.isNaN(height)) {
    throw new Error('Size not defined for ZoomContainer element.');
  }
  return { width: width, height: height };
}

/**
 * Shift window if new reaction will draw off the screen.
 */
function translate_off_screen(coords) {
  // TODO BUG not accounting for scale correctly

  var margin = 120; // pixels
  var size = this.get_size();
  var current = {
    x: {
      min: -this.window_translate.x / this.window_scale + margin / this.window_scale,
      max: -this.window_translate.x / this.window_scale + (size.width - margin) / this.window_scale
    },
    y: {
      min: -this.window_translate.y / this.window_scale + margin / this.window_scale,
      max: -this.window_translate.y / this.window_scale + (size.height - margin) / this.window_scale
    }
  };

  if (coords.x < current.x.min) {
    this.window_translate.x = this.window_translate.x - (coords.x - current.x.min) * this.window_scale;
    this.go_to(this.window_scale, this.window_translate);
  } else if (coords.x > current.x.max) {
    this.window_translate.x = this.window_translate.x - (coords.x - current.x.max) * this.window_scale;
    this.go_to(this.window_scale, this.window_translate);
  }
  if (coords.y < current.y.min) {
    this.window_translate.y = this.window_translate.y - (coords.y - current.y.min) * this.window_scale;
    this.go_to(this.window_scale, this.window_translate);
  } else if (coords.y > current.y.max) {
    this.window_translate.y = this.window_translate.y - (coords.y - current.y.max) * this.window_scale;
    this.go_to(this.window_scale, this.window_translate);
  }
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Map

    Defines the metabolic map data, and manages drawing and building.

    Arguments
    ---------

    svg: The parent SVG container for the map.

    css:

    selection: A d3 selection for a node to place the map inside.

    selection:

    zoom_container:

    settings:

    cobra_model:

    canvas_size_and_loc:

    enable_search:

    map_name: (Optional, Default: 'new map')

    map_id: (Optional, Default: A string of random characters.)

    map_description: (Optional, Default: '')

    Callbacks
    ---------

    map.callback_manager.run('set_status', null, status)
    map.callback_manager.run('toggle_beziers', null, beziers_enabled)
    map.callback_manager.run('select_metabolite_with_id', null, selected_node, coords)
    map.callback_manager.run('select_selectable', null, node_count, selected_node, coords)
    map.callback_manager.run('deselect_nodes')
    map.callback_manager.run('select_text_label')
    map.callback_manager.run('before_svg_export')
    map.callback_manager.run('after_svg_export')
    map.callback_manager.run('before_png_export')
    map.callback_manager.run('after_png_export')
    map.callback_manager.run('before_convert_map')
    map.callback_manager.run('after_convert_map')
    this.callback_manager.run('calc_data_stats__reaction', null, changed)
    this.callback_manager.run('calc_data_stats__metabolite', null, changed)

*/

var utils = __webpack_require__(0);
var Draw = __webpack_require__(33);
var Behavior = __webpack_require__(34);
var Scale = __webpack_require__(35);
var build = __webpack_require__(10);
var UndoStack = __webpack_require__(36);
var CallbackManager = __webpack_require__(3);
var KeyManager = __webpack_require__(37);
var Canvas = __webpack_require__(39);
var data_styles = __webpack_require__(4);
var SearchIndex = __webpack_require__(40);

var bacon = __webpack_require__(12);
var _ = __webpack_require__(2);
var d3_select = __webpack_require__(1).select;

var Map = utils.make_class();
// class methods
Map.from_data = from_data;
// instance methods
Map.prototype = {
  // setup
  init: init,
  // more setup
  setup_containers: setup_containers,
  reset_containers: reset_containers,
  // appearance
  set_status: set_status,
  clear_map: clear_map,
  // selection
  select_all: select_all,
  select_none: select_none,
  invert_selection: invert_selection,
  select_selectable: select_selectable,
  select_metabolite_with_id: select_metabolite_with_id,
  select_single_node: select_single_node,
  deselect_nodes: deselect_nodes,
  select_text_label: select_text_label,
  deselect_text_labels: deselect_text_labels,
  // build
  new_reaction_from_scratch: new_reaction_from_scratch,
  extend_nodes: extend_nodes,
  extend_reactions: extend_reactions,
  new_reaction_for_metabolite: new_reaction_for_metabolite,
  cycle_primary_node: cycle_primary_node,
  toggle_selected_node_primary: toggle_selected_node_primary,
  add_label_to_search_index: add_label_to_search_index,
  new_text_label: new_text_label,
  edit_text_label: edit_text_label,
  // delete
  delete_selected: delete_selected,
  delete_selectable: delete_selectable,
  delete_node_data: delete_node_data,
  delete_segment_data: delete_segment_data,
  delete_reaction_data: delete_reaction_data,
  delete_text_label_data: delete_text_label_data,
  // find
  get_selected_node_ids: get_selected_node_ids,
  get_selected_nodes: get_selected_nodes,
  get_selected_text_label_ids: get_selected_text_label_ids,
  get_selected_text_labels: get_selected_text_labels,
  segments_and_reactions_for_nodes: segments_and_reactions_for_nodes,
  // draw
  draw_everything: draw_everything,
  // draw reactions
  draw_all_reactions: draw_all_reactions,
  draw_these_reactions: draw_these_reactions,
  clear_deleted_reactions: clear_deleted_reactions,
  // draw nodes
  draw_all_nodes: draw_all_nodes,
  draw_these_nodes: draw_these_nodes,
  clear_deleted_nodes: clear_deleted_nodes,
  // draw text_labels
  draw_all_text_labels: draw_all_text_labels,
  draw_these_text_labels: draw_these_text_labels,
  clear_deleted_text_labels: clear_deleted_text_labels,
  // draw beziers
  draw_all_beziers: draw_all_beziers,
  draw_these_beziers: draw_these_beziers,
  clear_deleted_beziers: clear_deleted_beziers,
  toggle_beziers: toggle_beziers,
  hide_beziers: hide_beziers,
  show_beziers: show_beziers,
  // data
  has_cobra_model: has_cobra_model,
  apply_reaction_data_to_map: apply_reaction_data_to_map,
  apply_metabolite_data_to_map: apply_metabolite_data_to_map,
  apply_gene_data_to_map: apply_gene_data_to_map,
  // data statistics
  get_data_statistics: get_data_statistics,
  calc_data_stats: calc_data_stats,
  // zoom
  zoom_extent_nodes: zoom_extent_nodes,
  zoom_extent_canvas: zoom_extent_canvas,
  _zoom_extent: _zoom_extent,
  get_size: get_size,
  zoom_to_reaction: zoom_to_reaction,
  zoom_to_node: zoom_to_node,
  zoom_to_text_label: zoom_to_text_label,
  highlight_reaction: highlight_reaction,
  highlight_node: highlight_node,
  highlight_text_label: highlight_text_label,
  highlight: highlight,
  // full screen
  listen_for_full_screen: listen_for_full_screen,
  unlisten_for_full_screen: unlisten_for_full_screen,
  full_screen: full_screen,
  // io
  save: save,
  map_for_export: map_for_export,
  save_svg: save_svg,
  save_png: save_png,
  convert_map: convert_map
};
module.exports = Map;

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

function init(svg, css, selection, zoom_container, settings, cobra_model, canvas_size_and_loc, enable_search, map_name, map_id, map_description) {
  if (canvas_size_and_loc === null) {
    var size = zoom_container.get_size();
    canvas_size_and_loc = {
      x: -size.width,
      y: -size.height,
      width: size.width * 3,
      height: size.height * 3
    };
  }

  if (_.isUndefined(map_name) || map_name === null || map_name === '') {
    map_name = 'new_map';
  } else {
    map_name = String(map_name);
  }

  if (_.isUndefined(map_id) || map_id === null || map_id === '') {
    map_id = utils.generate_map_id();
  } else {
    map_id = String(map_id);
  }

  if (_.isUndefined(map_description) || map_description === null) {
    map_description = '';
  } else {
    map_description = String(map_description);
  }

  // set up the callbacks
  this.callback_manager = new CallbackManager();

  // set up the defs
  this.svg = svg;
  this.defs = utils.setup_defs(svg, css);

  // make the canvas
  this.canvas = new Canvas(selection, canvas_size_and_loc);

  this.setup_containers(selection);
  this.sel = selection;
  this.zoom_container = zoom_container;

  this.settings = settings;

  // set the model AFTER loading the datasets
  this.cobra_model = cobra_model;

  this.largest_ids = {
    reactions: -1,
    nodes: -1,
    segments: -1,
    text_labels: -1

    // make the scales
  };this.scale = new Scale();
  // initialize stats
  this.calc_data_stats('reaction');
  this.calc_data_stats('metabolite');
  this.scale.connect_to_settings(this.settings, this, get_data_statistics.bind(this));

  // make the undo/redo stack
  this.undo_stack = new UndoStack();

  // make a behavior object
  this.behavior = new Behavior(this, this.undo_stack);

  // draw manager
  this.draw = new Draw(this.behavior, this.settings);

  // make a key manager
  this.key_manager = new KeyManager();
  this.key_manager.ctrl_equals_cmd = true;

  // make the search index
  this.enable_search = enable_search;
  this.search_index = new SearchIndex();

  // map properties
  this.map_name = map_name;
  this.map_id = map_id;
  this.map_description = map_description;

  // deal with the window
  var window_translate = { x: 0, y: 0 };
  var window_scale = 1;

  // hide beziers
  this.beziers_enabled = false;

  // data
  this.has_data_on_reactions = false;
  this.has_data_on_nodes = false;
  this.imported_reaction_data = null;
  this.imported_metabolite_data = null;
  this.imported_gene_data = null;

  this.nodes = {};
  this.reactions = {};
  this.beziers = {};
  this.text_labels = {};

  // update data with null to populate data-specific attributes
  this.apply_reaction_data_to_map(null);
  this.apply_metabolite_data_to_map(null);
  this.apply_gene_data_to_map(null);

  // rotation mode off
  this.rotation_on = false;

  // set up full screen listener
  this.listen_for_full_screen(function () {
    setTimeout(function () {
      this.zoom_extent_canvas();
    }.bind(this), 50);
  }.bind(this));
}

// -------------------------------------------------------------------------
// Import
// -------------------------------------------------------------------------

/**
 * Load a json map and add necessary fields for rendering.
 */
function from_data(map_data, svg, css, selection, zoom_container, settings, cobra_model, enable_search) {
  var canvas = map_data[1].canvas;
  var map_name = map_data[0].map_name;
  var map_id = map_data[0].map_id;
  var map_description = map_data[0].map_description.replace(/(\nLast Modified.*)+$/g, '') + '\nLast Modified ' + Date(Date.now()).toString();
  var map = new Map(svg, css, selection, zoom_container, settings, cobra_model, canvas, enable_search, map_name, map_id, map_description);

  map.reactions = map_data[1].reactions;
  map.nodes = map_data[1].nodes;
  map.text_labels = map_data[1].text_labels;

  for (var n_id in map.nodes) {
    var node = map.nodes[n_id];

    // clear all the connected segments
    node.connected_segments = [];

    //  populate the nodes search index.
    if (enable_search) {
      if (node.node_type !== 'metabolite') continue;
      map.search_index.insert('n' + n_id, { name: node.bigg_id,
        data: { type: 'metabolite',
          node_id: n_id } });
      map.search_index.insert('n_name' + n_id, { name: node.name,
        data: { type: 'metabolite',
          node_id: n_id } });
    }
  }

  // Propagate coefficients and reversibility, build the connected
  // segments, add bezier points, and populate the reaction search index.
  for (var r_id in map.reactions) {
    var reaction = map.reactions[r_id];

    // reaction search index
    if (enable_search) {
      map.search_index.insert('r' + r_id, { 'name': reaction.bigg_id,
        'data': { type: 'reaction',
          reaction_id: r_id } });
      map.search_index.insert('r_name' + r_id, { 'name': reaction.name,
        'data': { type: 'reaction',
          reaction_id: r_id } });
      for (var g_id in reaction.genes) {
        var gene = reaction.genes[g_id];
        map.search_index.insert('r' + r_id + '_g' + g_id, { 'name': gene.bigg_id,
          'data': { type: 'reaction',
            reaction_id: r_id } });
        map.search_index.insert('r' + r_id + '_g_name' + g_id, { 'name': gene.name,
          'data': { type: 'reaction',
            reaction_id: r_id } });
      }
    }

    // keep track of any bad segments
    var segments_to_delete = [];
    for (var s_id in reaction.segments) {
      var segment = reaction.segments[s_id];

      // propagate reversibility
      segment.reversibility = reaction.reversibility;

      // if there is an error with to_ or from_ nodes, remove this segment
      if (!(segment.from_node_id in map.nodes) || !(segment.to_node_id in map.nodes)) {
        console.warn('Bad node references in segment ' + s_id + '. Deleting segment.');
        segments_to_delete.push(s_id);
        continue;
      }

      var from_node = map.nodes[segment.from_node_id],
          to_node = map.nodes[segment.to_node_id];

      // propagate coefficients
      reaction.metabolites.forEach(function (met) {
        if (met.bigg_id == from_node.bigg_id) {
          segment.from_node_coefficient = met.coefficient;
        } else if (met.bigg_id == to_node.bigg_id) {
          segment.to_node_coefficient = met.coefficient;
        }
      })

      // build connected segments
      ;[from_node, to_node].forEach(function (node) {
        node.connected_segments.push({ segment_id: s_id,
          reaction_id: r_id });
      });

      // If the metabolite has no bezier points, then add them.
      var start = map.nodes[segment.from_node_id],
          end = map.nodes[segment.to_node_id];
      if (start['node_type'] == 'metabolite' || end['node_type'] == 'metabolite') {
        var midpoint = utils.c_plus_c(start, utils.c_times_scalar(utils.c_minus_c(end, start), 0.5));
        if (segment.b1 === null) segment.b1 = midpoint;
        if (segment.b2 === null) segment.b2 = midpoint;
      }
    }
    // delete the bad segments
    segments_to_delete.forEach(function (s_id) {
      delete reaction.segments[s_id];
    });
  }

  // add text_labels to the search index
  if (enable_search) {
    for (var label_id in map.text_labels) {
      var label = map.text_labels[label_id];
      map.search_index.insert('l' + label_id, { 'name': label.text,
        'data': { type: 'text_label',
          text_label_id: label_id } });
    }
  }

  // populate the beziers
  map.beziers = build.new_beziers_for_reactions(map.reactions);

  // get largest ids for adding new reactions, nodes, text labels, and
  // segments
  map.largest_ids.reactions = get_largest_id(map.reactions);
  map.largest_ids.nodes = get_largest_id(map.nodes);
  map.largest_ids.text_labels = get_largest_id(map.text_labels);

  var largest_segment_id = 0;
  for (var id in map.reactions) {
    largest_segment_id = get_largest_id(map.reactions[id].segments, largest_segment_id);
  }
  map.largest_ids.segments = largest_segment_id;

  // update data with null to populate data-specific attributes
  map.apply_reaction_data_to_map(null);
  map.apply_metabolite_data_to_map(null);
  map.apply_gene_data_to_map(null);

  return map;

  /**
   * Return the largest integer key in obj, or current_largest, whichever is
   * bigger.
   */
  function get_largest_id(obj, current_largest) {
    if (_.isUndefined(current_largest)) current_largest = 0;
    if (_.isUndefined(obj)) return current_largest;
    return Math.max.apply(null, Object.keys(obj).map(function (x) {
      return parseInt(x);
    }).concat([current_largest]));
  }
}

// ---------------------------------------------------------------------
// more setup

function setup_containers(sel) {
  sel.append('g').attr('id', 'reactions');
  sel.append('g').attr('id', 'nodes');
  sel.append('g').attr('id', 'beziers');
  sel.append('g').attr('id', 'text-labels');
}
function reset_containers() {
  this.sel.select('#reactions').selectAll('.reaction').remove();
  this.sel.select('#nodes').selectAll('.node').remove();
  this.sel.select('#beziers').selectAll('.bezier').remove();
  this.sel.select('#text-labels').selectAll('.text-label').remove();
}

// -------------------------------------------------------------------------
// Appearance
// -------------------------------------------------------------------------

function set_status(status, time) {
  /** Set the status of the map, with an optional expiration
      time. Rendering the status is taken care of by the Builder.
       Arguments
      ---------
       status: The status string.
       time: An optional time, in ms, after which the status is set to ''.
   */

  this.callback_manager.run('set_status', null, status);
  // clear any other timers on the status bar
  clearTimeout(this._status_timer);
  this._status_timer = null;

  if (time !== undefined) {
    this._status_timer = setTimeout(function () {
      this.callback_manager.run('set_status', null, '');
    }.bind(this), time);
  }
}
function clear_map() {
  this.reactions = {};
  this.beziers = {};
  this.nodes = {};
  this.text_labels = {};
  this.map_name = 'new_map';
  this.map_id = utils.generate_map_id();
  this.map_description = '';
  // reaction_data onto existing map reactions
  this.apply_reaction_data_to_map(null);
  this.apply_metabolite_data_to_map(null);
  this.apply_gene_data_to_map(null);
  this.draw_everything();
}
function has_cobra_model() {
  return this.cobra_model !== null;
}
function draw_everything() {
  /** Draw the all reactions, nodes, & text labels.
    */
  this.draw_all_reactions(true, true); // also draw beziers
  this.draw_all_nodes(true);
  this.draw_all_text_labels();
}

function draw_all_reactions(draw_beziers, clear_deleted) {
  /** Draw all reactions, and clear deleted reactions.
       Arguments
      ---------
       draw_beziers: (Boolean, default True) Whether to also draw the bezier
      control points.
       clear_deleted: (Optional, Default: true) Boolean, if true, then also
      clear deleted nodes.
   */
  if (_.isUndefined(draw_beziers)) draw_beziers = true;
  if (_.isUndefined(clear_deleted)) clear_deleted = true;

  // Draw all reactions.
  var reaction_ids = [];
  for (var reaction_id in this.reactions) {
    reaction_ids.push(reaction_id);
  }
  // If draw_beziers is true, just draw them all, rather than deciding
  // which ones to draw.
  this.draw_these_reactions(reaction_ids, false);
  if (draw_beziers && this.beziers_enabled) this.draw_all_beziers();

  // Clear all deleted reactions.
  if (clear_deleted) this.clear_deleted_reactions(draw_beziers);
}

/**
 * Draw specific reactions. Does nothing with exit selection. Use
 * clear_deleted_reactions to remove reactions from the DOM.
 * reactions_ids: An array of reaction_ids to update.
 * draw_beziers: (Boolean, default True) Whether to also draw the bezier control
 * points.
 */
function draw_these_reactions(reaction_ids, draw_beziers) {
  if (_.isUndefined(draw_beziers)) draw_beziers = true;

  // find reactions for reaction_ids
  var reaction_subset = utils.object_slice_for_ids_ref(this.reactions, reaction_ids);

  // function to update reactions
  var update_fn = function (sel) {
    return this.draw.update_reaction(sel, this.scale, this.cobra_model, this.nodes, this.defs, this.has_data_on_reactions);
  }.bind(this);

  // draw the reactions
  utils.draw_an_object(this.sel, '#reactions', '.reaction', reaction_subset, 'reaction_id', this.draw.create_reaction.bind(this.draw), update_fn);

  if (draw_beziers) {
    // particular beziers to draw
    var bezier_ids = build.bezier_ids_for_reaction_ids(reaction_subset);
    this.draw_these_beziers(bezier_ids);
  }
}

/**
 * Remove any reactions that are not in *this.reactions*.
 * draw_beziers: (Boolean, default True) Whether to also clear deleted bezier
 * control points.
 */
function clear_deleted_reactions(draw_beziers) {
  if (_.isUndefined(draw_beziers)) draw_beziers = true;

  // Remove deleted reactions and segments
  utils.draw_an_object(this.sel, '#reactions', '.reaction', this.reactions, 'reaction_id', null, function (update_selection) {
    // Draw segments
    utils.draw_a_nested_object(update_selection, '.segment-group', 'segments', 'segment_id', null, null, function (sel) {
      sel.remove();
    });
  }, function (sel) {
    sel.remove();
  });

  if (draw_beziers === true) {
    this.clear_deleted_beziers();
  }
}

function draw_all_nodes(clear_deleted) {
  /** Draw all nodes, and clear deleted nodes.
       Arguments
      ---------
       clear_deleted: (Optional, Default: true) Boolean, if true, then also
      clear deleted nodes.
   */
  if (clear_deleted === undefined) clear_deleted = true;

  var node_ids = [];
  for (var node_id in this.nodes) {
    node_ids.push(node_id);
  }
  this.draw_these_nodes(node_ids);

  // clear the deleted nodes
  if (clear_deleted) this.clear_deleted_nodes();
}

function draw_these_nodes(node_ids) {
  /** Draw specific nodes.
       Does nothing with exit selection. Use clear_deleted_nodes to remove
      nodes from the DOM.
       Arguments
      ---------
       nodes_ids: An array of node_ids to update.
   */
  // find reactions for reaction_ids
  var node_subset = utils.object_slice_for_ids_ref(this.nodes, node_ids);

  // functions to create and update nodes
  var create_fn = function (sel) {
    return this.draw.create_node(sel, this.nodes, this.reactions);
  }.bind(this);
  var update_fn = function (sel) {
    return this.draw.update_node(sel, this.scale, this.has_data_on_nodes, this.behavior.selectable_mousedown, this.behavior.selectable_click, this.behavior.node_mouseover, this.behavior.node_mouseout, this.behavior.selectable_drag, this.behavior.node_label_drag);
  }.bind(this);

  // draw the nodes
  utils.draw_an_object(this.sel, '#nodes', '.node', node_subset, 'node_id', create_fn, update_fn);
}

/**
 * Remove any nodes that are not in *this.nodes*.
 */
function clear_deleted_nodes() {
  // Run remove for exit selection
  utils.draw_an_object(this.sel, '#nodes', '.node', this.nodes, 'node_id', null, null, function (sel) {
    sel.remove();
  });
}

/**
 * Draw all text_labels.
 */
function draw_all_text_labels() {
  this.draw_these_text_labels(Object.keys(this.text_labels));

  // Clear all deleted text_labels
  this.clear_deleted_text_labels();
}

/**
 * Draw specific text_labels. Does nothing with exit selection. Use
 * clear_deleted_text_labels to remove text_labels from the DOM.
 * @param {Array} text_labels_ids - An array of text_label_ids to update.
 */
function draw_these_text_labels(text_label_ids) {
  // Find reactions for reaction_ids
  var text_label_subset = utils.object_slice_for_ids_ref(this.text_labels, text_label_ids);

  // Draw the text_labels
  utils.draw_an_object(this.sel, '#text-labels', '.text-label', text_label_subset, 'text_label_id', this.draw.create_text_label.bind(this.draw), this.draw.update_text_label.bind(this.draw));
}

/**
 * Remove any text_labels that are not in *this.text_labels*.
 */
function clear_deleted_text_labels() {
  utils.draw_an_object(this.sel, '#text-labels', '.text-label', this.text_labels, 'text_label_id', null, null, function (sel) {
    sel.remove();
  });
}

/**
 * Draw all beziers, and clear deleted reactions.
 */
function draw_all_beziers() {
  var bezier_ids = [];
  for (var bezier_id in this.beziers) {
    bezier_ids.push(bezier_id);
  }
  this.draw_these_beziers(bezier_ids);

  // clear delete beziers
  this.clear_deleted_beziers();
}

function draw_these_beziers(bezier_ids) {
  /** Draw specific beziers.
       Does nothing with exit selection. Use clear_deleted_beziers to remove
      beziers from the DOM.
       Arguments
      ---------
       beziers_ids: An array of bezier_ids to update.
   */
  // find reactions for reaction_ids
  var bezier_subset = utils.object_slice_for_ids_ref(this.beziers, bezier_ids);

  // function to update beziers
  var update_fn = function (sel) {
    return this.draw.update_bezier(sel, this.beziers_enabled, this.behavior.bezier_drag, this.behavior.bezier_mouseover, this.behavior.bezier_mouseout, this.nodes, this.reactions);
  }.bind(this);

  // draw the beziers
  utils.draw_an_object(this.sel, '#beziers', '.bezier', bezier_subset, 'bezier_id', this.draw.create_bezier.bind(this.draw), update_fn);
}

function clear_deleted_beziers() {
  /** Remove any beziers that are not in *this.beziers*.
    */
  // remove deleted
  utils.draw_an_object(this.sel, '#beziers', '.bezier', this.beziers, 'bezier_id', null, null, function (sel) {
    sel.remove();
  });
}

function show_beziers() {
  this.toggle_beziers(true);
}

function hide_beziers() {
  this.toggle_beziers(false);
}

function toggle_beziers(on_off) {
  if (_.isUndefined(on_off)) this.beziers_enabled = !this.beziers_enabled;else this.beziers_enabled = on_off;
  this.draw_all_beziers();
  this.callback_manager.run('toggle_beziers', null, this.beziers_enabled);
}

/**
 * Returns True if the scale has changed.
 * @param {Array} keys - (Optional) The keys in reactions to apply data to.
 */
function apply_reaction_data_to_map(data, keys) {
  var styles = this.settings.get_option('reaction_styles'),
      compare_style = this.settings.get_option('reaction_compare_style');
  var has_data = data_styles.apply_reaction_data_to_reactions(this.reactions, data, styles, compare_style, keys);
  this.has_data_on_reactions = has_data;
  this.imported_reaction_data = has_data ? data : null;

  return this.calc_data_stats('reaction');
}

/**
 * Returns True if the scale has changed.
 * @param {Array} keys - (Optional) The keys in nodes to apply data to.
 */
function apply_metabolite_data_to_map(data, keys) {
  var styles = this.settings.get_option('metabolite_styles');
  var compare_style = this.settings.get_option('metabolite_compare_style');

  var has_data = data_styles.apply_metabolite_data_to_nodes(this.nodes, data, styles, compare_style, keys);
  this.has_data_on_nodes = has_data;
  this.imported_metabolite_data = has_data ? data : null;

  return this.calc_data_stats('metabolite');
}

/**
 * Returns True if the scale has changed.
 * gene_data_obj: The gene data object, with the following style:
 * { reaction_id: { rule: 'rule_string', genes: { gene_id: value } } }
 * @param {Array} keys - (Optional) The keys in reactions to apply data to.
 */
function apply_gene_data_to_map(gene_data_obj, keys) {
  var styles = this.settings.get_option('reaction_styles'),
      compare_style = this.settings.get_option('reaction_compare_style'),
      identifiers_on_map = this.settings.get_option('identifiers_on_map'),
      and_method_in_gene_reaction_rule = this.settings.get_option('and_method_in_gene_reaction_rule');

  var has_data = data_styles.apply_gene_data_to_reactions(this.reactions, gene_data_obj, styles, identifiers_on_map, compare_style, and_method_in_gene_reaction_rule, keys);
  this.has_data_on_reactions = has_data;
  this.imported_gene_data = has_data ? gene_data_obj : null;

  return this.calc_data_stats('reaction');
}

// ------------------------------------------------
// Data domains
// ------------------------------------------------

function get_data_statistics() {
  return this.data_statistics;
}

function _on_array(fn) {
  return function (array) {
    return fn.apply(null, array);
  };
}

/**
 * Returns True if the stats have changed.
 * @param {String} type - Either 'metabolite' or 'reaction'
 */
function calc_data_stats(type) {
  if (['reaction', 'metabolite'].indexOf(type) === -1) {
    throw new Error('Bad type ' + type);
  }

  // make the data structure
  if (!('data_statistics' in this)) {
    this.data_statistics = {};
    this.data_statistics[type] = {};
  } else if (!(type in this.data_statistics)) {
    this.data_statistics[type] = {};
  }

  var same = true;
  // default min and max
  var vals = [];
  if (type === 'metabolite') {
    for (var node_id in this.nodes) {
      var node = this.nodes[node_id];
      // check number
      if (_.isUndefined(node.data)) {
        console.error('metabolite missing ');
      } else if (node.data !== null) {
        vals.push(node.data);
      }
    }
  } else if (type == 'reaction') {
    for (var reaction_id in this.reactions) {
      var reaction = this.reactions[reaction_id];
      // check number
      if (_.isUndefined(reaction.data)) {
        console.error('reaction data missing ');
      } else if (reaction.data !== null) {
        vals.push(reaction.data);
      }
    }
  }

  // calculate these statistics
  var quartiles = utils.quartiles(vals);
  var funcs = [['min', _on_array(Math.min)], ['max', _on_array(Math.max)], ['mean', utils.mean], ['Q1', function () {
    return quartiles[0];
  }], ['median', function () {
    return quartiles[1];
  }], ['Q3', function () {
    return quartiles[2];
  }]];
  funcs.forEach(function (ar) {
    var new_val;
    var name = ar[0];
    if (vals.length === 0) {
      new_val = null;
    } else {
      var fn = ar[1];
      new_val = fn(vals);
    }
    if (new_val != this.data_statistics[type][name]) {
      same = false;
    }
    this.data_statistics[type][name] = new_val;
  }.bind(this));

  // Deal with max === min
  if (this.data_statistics[type]['min'] === this.data_statistics[type]['max'] && this.data_statistics[type]['min'] !== null) {
    var min = this.data_statistics[type]['min'];
    var max = this.data_statistics[type]['max'];
    this.data_statistics[type]['min'] = min - 1 - Math.abs(min) * 0.1;
    this.data_statistics[type]['max'] = max + 1 + Math.abs(max) * 0.1;
  }

  if (type === 'reaction') {
    this.callback_manager.run('calc_data_stats__reaction', null, !same);
  } else {
    this.callback_manager.run('calc_data_stats__metabolite', null, !same);
  }
  return !same;
}

// ---------------------------------------------------------------------
// Node interaction
// ---------------------------------------------------------------------

function get_coords_for_node(node_id) {
  var node = this.nodes[node_id],
      coords = { x: node.x, y: node.y };
  return coords;
}

function get_selected_node_ids() {
  var selected_node_ids = [];
  this.sel.select('#nodes').selectAll('.selected').each(function (d) {
    selected_node_ids.push(d.node_id);
  });
  return selected_node_ids;
}

function get_selected_nodes() {
  var selected_nodes = {};
  this.sel.select('#nodes').selectAll('.selected').each(function (d) {
    selected_nodes[d.node_id] = this.nodes[d.node_id];
  }.bind(this));
  return selected_nodes;
}

function get_selected_text_label_ids() {
  var selected_text_label_ids = [];
  this.sel.select('#text-labels').selectAll('.selected').each(function (d) {
    selected_text_label_ids.push(d.text_label_id);
  });
  return selected_text_label_ids;
}

function get_selected_text_labels() {
  var selected_text_labels = {};
  this.sel.select('#text-labels').selectAll('.selected').each(function (d) {
    selected_text_labels[d.text_label_id] = this.text_labels[d.text_label_id];
  }.bind(this));
  return selected_text_labels;
}

function select_all() {
  /** Select all nodes and text labels.
    */
  this.sel.selectAll('#nodes,#text-labels').selectAll('.node,.text-label').classed('selected', true);
}

function select_none() {
  /** Deselect all nodes and text labels.
    */
  this.sel.selectAll('.selected').classed('selected', false);
}

function invert_selection() {
  /** Invert selection of nodes and text labels.
    */
  var selection = this.sel.selectAll('#nodes,#text-labels').selectAll('.node,.text-label');
  selection.classed('selected', function () {
    return !d3_select(this).classed('selected');
  });
}

function select_metabolite_with_id(node_id) {
  /** Select a metabolite with the given id, and turn off the reaction
      target.
   */
  // deselect all text labels
  this.deselect_text_labels();

  var node_selection = this.sel.select('#nodes').selectAll('.node'),
      coords,
      selected_node;
  node_selection.classed('selected', function (d) {
    var selected = String(d.node_id) == String(node_id);
    if (selected) {
      selected_node = d;
      coords = { x: d.x, y: d.y };
    }
    return selected;
  });
  this.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
  this.callback_manager.run('select_metabolite_with_id', null, selected_node, coords);
}

function select_selectable(node, d, shift_key_on) {
  /** Select a metabolite or text label, and manage the shift key. */
  shift_key_on = _.isUndefined(shift_key_on) ? false : shift_key_on;
  var classable_selection = this.sel.selectAll('#nodes,#text-labels').selectAll('.node,.text-label'),
      classable_node;
  if (d3_select(node).attr('class').indexOf('text-label') == -1) {
    // node
    classable_node = node.parentNode;
  } else {
    // text-label
    classable_node = node;
  }
  // toggle selection
  if (shift_key_on) {
    // toggle this node
    d3_select(classable_node).classed('selected', !d3_select(classable_node).classed('selected'));
  } else {
    // unselect all other nodes, and select this one
    classable_selection.classed('selected', false);
    d3_select(classable_node).classed('selected', true);
  }
  // run the select_metabolite callback
  var selected_nodes = this.sel.select('#nodes').selectAll('.selected'),
      node_count = 0,
      coords,
      selected_node;
  selected_nodes.each(function (d) {
    selected_node = d;
    coords = { x: d.x, y: d.y };
    node_count++;
  });
  this.callback_manager.run('select_selectable', null, node_count, selected_node, coords);
}

/**
 * Unselect all but one selected node, and return the node. If no nodes are
 * selected, return null.
 */
function select_single_node() {
  var out = null;
  var node_selection = this.sel.select('#nodes').selectAll('.selected');
  node_selection.classed('selected', function (d, i) {
    if (i === 0) {
      out = d;
      return true;
    } else {
      return false;
    }
  });
  return out;
}

function deselect_nodes() {
  var node_selection = this.sel.select('#nodes').selectAll('.node');
  node_selection.classed('selected', false);
  this.callback_manager.run('deselect_nodes');
}

function select_text_label(sel, d) {
  // deselect all nodes
  this.deselect_nodes();
  // Find the new selection. Ignore shift key and only allow single selection
  // for now.
  var text_label_selection = this.sel.select('#text-labels').selectAll('.text-label');
  text_label_selection.classed('selected', function (p) {
    return d === p;
  });
  var selected_text_labels = this.sel.select('#text-labels').selectAll('.selected'),
      coords;
  selected_text_labels.each(function (d) {
    coords = { x: d.x, y: d.y };
  });
  this.callback_manager.run('select_text_label');
}

function deselect_text_labels() {
  var text_label_selection = this.sel.select('#text-labels').selectAll('.text-label');
  text_label_selection.classed('selected', false);
}

// ---------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------

/**
 * Delete the selected nodes and associated segments and reactions, and selected
 * labels. Undoable.
 */
function delete_selected() {
  var selected_nodes = this.get_selected_nodes(),
      selected_text_labels = this.get_selected_text_labels();
  if (Object.keys(selected_nodes).length >= 1 || Object.keys(selected_text_labels).length >= 1) this.delete_selectable(selected_nodes, selected_text_labels, true);
}

/**
 * Delete the nodes and associated segments and reactions. Undoable.
 * selected_nodes: An object that is a subset of map.nodes.
 * selected_text_labels: An object that is a subset of map.text_labels.
 * should_draw: A boolean argument to determine whether to draw the changes to
 * the map.
 */
function delete_selectable(selected_nodes, selected_text_labels, should_draw) {
  var out = this.segments_and_reactions_for_nodes(selected_nodes);
  var segment_objs_w_segments = out.segment_objs_w_segments; // TODO repeated values here
  var reactions = out.reactions;

  // copy nodes to undelete
  var saved_nodes = utils.clone(selected_nodes);
  var saved_segment_objs_w_segments = utils.clone(segment_objs_w_segments);
  var saved_reactions = utils.clone(reactions);
  var saved_text_labels = utils.clone(selected_text_labels);
  var delete_and_draw = function (nodes, reactions, segment_objs, selected_text_labels) {
    // delete nodes, segments, and reactions with no segments
    this.delete_node_data(Object.keys(selected_nodes));
    this.delete_segment_data(segment_objs); // also deletes beziers
    this.delete_reaction_data(Object.keys(reactions));
    this.delete_text_label_data(Object.keys(selected_text_labels));

    // apply the reaction and node data
    var changed_r_scale = false;
    var changed_m_scale = false;
    if (this.has_data_on_reactions) {
      changed_r_scale = this.calc_data_stats('reaction');
    }
    if (this.has_data_on_nodes) {
      changed_m_scale = this.calc_data_stats('metabolite');
    }

    // redraw
    if (should_draw) {
      if (changed_r_scale) this.draw_all_reactions(true, true);else this.clear_deleted_reactions(); // also clears segments and beziers
      if (changed_m_scale) this.draw_all_nodes(true);else this.clear_deleted_nodes();
      this.clear_deleted_text_labels();
    }
  }.bind(this);

  // delete
  delete_and_draw(selected_nodes, reactions, segment_objs_w_segments, selected_text_labels);

  // add to undo/redo stack
  this.undo_stack.push(function () {
    // undo
    // redraw the saved nodes, reactions, and segments

    this.extend_nodes(saved_nodes);
    this.extend_reactions(saved_reactions);
    var reaction_ids_to_draw = Object.keys(saved_reactions);
    for (var segment_id in saved_segment_objs_w_segments) {
      var segment_obj = saved_segment_objs_w_segments[segment_id];

      var segment = segment_obj.segment;
      this.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id] = segment;

      // updated connected nodes
      var to_from = [segment.from_node_id, segment.to_node_id];
      to_from.forEach(function (node_id) {
        // not necessary for the deleted nodes
        if (node_id in saved_nodes) return;
        var node = this.nodes[node_id];
        node.connected_segments.push({ reaction_id: segment_obj.reaction_id,
          segment_id: segment_obj.segment_id });
      }.bind(this));

      // extend the beziers
      var seg_id = segment_obj.segment_id,
          r_id = segment_obj.reaction_id,
          seg_o = {};
      seg_o[seg_id] = segment_obj.segment;
      utils.extend(this.beziers, build.new_beziers_for_segments(seg_o, r_id));

      if (reaction_ids_to_draw.indexOf(segment_obj.reaction_id) === -1) {
        reaction_ids_to_draw.push(segment_obj.reaction_id);
      }
    }

    // Apply the reaction and node data. If the scale changes, redraw
    // everything.
    if (this.has_data_on_reactions) {
      var scale_changed = this.calc_data_stats('reaction');
      if (scale_changed) this.draw_all_reactions(true, false);else this.draw_these_reactions(reaction_ids_to_draw);
    } else {
      if (should_draw) this.draw_these_reactions(reaction_ids_to_draw);
    }
    if (this.has_data_on_nodes) {
      var scale_changed = this.calc_data_stats('metabolite');
      if (should_draw) {
        if (scale_changed) this.draw_all_nodes(false);else this.draw_these_nodes(Object.keys(saved_nodes));
      }
    } else {
      if (should_draw) this.draw_these_nodes(Object.keys(saved_nodes));
    }

    // redraw the saved text_labels
    utils.extend(this.text_labels, saved_text_labels);
    if (should_draw) this.draw_these_text_labels(Object.keys(saved_text_labels));
    // copy text_labels to re-delete
    selected_text_labels = utils.clone(saved_text_labels);

    // copy nodes to re-delete
    selected_nodes = utils.clone(saved_nodes);
    segment_objs_w_segments = utils.clone(saved_segment_objs_w_segments);
    reactions = utils.clone(saved_reactions);
  }.bind(this), function () {
    // redo
    // clone the nodes and reactions, to redo this action later
    delete_and_draw(selected_nodes, reactions, segment_objs_w_segments, selected_text_labels);
  }.bind(this));
}

/**
 * Delete nodes, and remove from search index.
 */
function delete_node_data(node_ids) {
  node_ids.forEach(function (node_id) {
    if (this.enable_search && this.nodes[node_id].node_type == 'metabolite') {
      var found = this.search_index.remove('n' + node_id) && this.search_index.remove('n_name' + node_id);
      if (!found) console.warn('Could not find deleted metabolite in search index');
    }
    delete this.nodes[node_id];
  }.bind(this));
}

/**
 * Delete segments, update connected_segments in nodes, and delete bezier
 * points.
 * @param {Object} segment_objs - Object with values like
 *                                { reaction_id: '123', segment_id: '456' }
 */
function delete_segment_data(segment_objs) {
  for (var segment_id in segment_objs) {
    var segment_obj = segment_objs[segment_id];
    var reaction = this.reactions[segment_obj.reaction_id];

    // segment already deleted
    if (!(segment_obj.segment_id in reaction.segments)) return;

    var segment = reaction.segments[segment_obj.segment_id]
    // updated connected nodes
    ;[segment.from_node_id, segment.to_node_id].forEach(function (node_id) {
      if (!(node_id in this.nodes)) return;
      var node = this.nodes[node_id];
      node.connected_segments = node.connected_segments.filter(function (so) {
        return so.segment_id != segment_obj.segment_id;
      });
    }.bind(this))

    // remove beziers
    ;['b1', 'b2'].forEach(function (bez) {
      var bez_id = build.bezier_id_for_segment_id(segment_obj.segment_id, bez);
      delete this.beziers[bez_id];
    }.bind(this));

    delete reaction.segments[segment_obj.segment_id];
  }
}

/**
 * Delete reactions, segments, and beziers, and remove reaction from search
 * index.
 */
function delete_reaction_data(reaction_ids) {
  reaction_ids.forEach(function (reaction_id) {
    // remove beziers
    var reaction = this.reactions[reaction_id];
    for (var segment_id in reaction.segments) {
      ;['b1', 'b2'].forEach(function (bez) {
        var bez_id = build.bezier_id_for_segment_id(segment_id, bez);
        delete this.beziers[bez_id];
      }.bind(this));
    }
    // delete reaction
    delete this.reactions[reaction_id];
    // remove from search index
    var found = this.search_index.remove('r' + reaction_id) && this.search_index.remove('r_name' + reaction_id);
    if (!found) console.warn('Could not find deleted reaction ' + reaction_id + ' in search index');
    for (var g_id in reaction.genes) {
      var found = this.search_index.remove('r' + reaction_id + '_g' + g_id) && this.search_index.remove('r' + reaction_id + '_g_name' + g_id);
      if (!found) console.warn('Could not find deleted gene ' + g_id + ' in search index');
    }
  }.bind(this));
}

/**
 * Delete text labels for an array of IDs
 */
function delete_text_label_data(text_label_ids) {
  text_label_ids.forEach(function (text_label_id) {
    // delete label
    delete this.text_labels[text_label_id];
    // remove from search index
    var found = this.search_index.remove('l' + text_label_id);
    if (!found) {
      console.warn('Could not find deleted text label in search index');
    }
  }.bind(this));
}

// ---------------------------------------------------------------------
// Building
// ---------------------------------------------------------------------

function _extend_and_draw_metabolite(new_nodes, selected_node_id) {
  this.extend_nodes(new_nodes);
  var keys = [selected_node_id];
  if (this.has_data_on_nodes) {
    if (this.imported_metabolite_data === null) {
      throw new Error('imported_metabolite_data should not be null');
    }
    var scale_changed = this.apply_metabolite_data_to_map(this.imported_metabolite_data, keys);
    if (scale_changed) {
      this.draw_all_nodes(false);
    } else {
      this.draw_these_nodes(keys);
    }
  } else {
    this.draw_these_nodes(keys);
  }
}

/**
 * Draw a reaction on a blank canvas.
 * @param {String} starting_reaction - bigg_id for a reaction to draw.
 * @param {Coords} coords - coordinates to start drawing
 */
function new_reaction_from_scratch(starting_reaction, coords, direction) {
  // If there is no cobra model, error
  if (!this.cobra_model) {
    console.error('No CobraModel. Cannot build new reaction');
    return;
  }

  // Set reaction coordinates and angle. Be sure to clone the reaction.
  var cobra_reaction = utils.clone(this.cobra_model.reactions[starting_reaction]);

  // check for empty reactions
  if (_.size(cobra_reaction.metabolites) === 0) {
    throw Error('No metabolites in reaction ' + cobra_reaction.bigg_id);
  }

  // create the first node
  var reactant_ids = _.map(cobra_reaction.metabolites, function (coeff, met_id) {
    return [coeff, met_id];
  }).filter(function (x) {
    return x[0] < 0;
  }) // coeff < 0
  .map(function (x) {
    return x[1];
  }); // metabolite id
  // get the first reactant or else the first product
  var metabolite_id = reactant_ids.length > 0 ? reactant_ids[0] : Object.keys(cobra_reaction.metabolites)[0];
  var metabolite = this.cobra_model.metabolites[metabolite_id];
  var selected_node_id = String(++this.largest_ids.nodes);
  var label_d = build.get_met_label_loc(Math.PI / 180 * direction, 0, 1, true, metabolite_id);
  var selected_node = {
    connected_segments: [],
    x: coords.x,
    y: coords.y,
    node_is_primary: true,
    label_x: coords.x + label_d.x,
    label_y: coords.y + label_d.y,
    name: metabolite.name,
    bigg_id: metabolite_id,
    node_type: 'metabolite'
  };
  var new_nodes = {};
  new_nodes[selected_node_id] = selected_node;

  // draw
  _extend_and_draw_metabolite.apply(this, [new_nodes, selected_node_id]);

  // clone the nodes and reactions, to redo this action later
  var saved_nodes = utils.clone(new_nodes);

  // draw the reaction
  var out = this.new_reaction_for_metabolite(starting_reaction, selected_node_id, direction, false);
  var reaction_redo = out.redo;
  var reaction_undo = out.undo;

  // add to undo/redo stack
  this.undo_stack.push(function () {
    // Undo. First undo the reaction.
    reaction_undo();
    // Get the nodes to delete
    this.delete_node_data(Object.keys(new_nodes));
    // Save the nodes and reactions again, for redo
    new_nodes = utils.clone(saved_nodes);
    // Draw
    this.clear_deleted_nodes();
    // Deselect
    this.deselect_nodes();
  }.bind(this), function () {
    // Redo. Clone the nodes and reactions, to redo this action later.
    _extend_and_draw_metabolite.apply(this, [new_nodes, selected_node_id]);
    // Now redo the reaction
    reaction_redo();
  }.bind(this));

  return;
}

/**
 * Add new nodes to data and search index.
 */
function extend_nodes(new_nodes) {
  if (this.enable_search) {
    for (var node_id in new_nodes) {
      var node = new_nodes[node_id];
      if (node.node_type != 'metabolite') continue;
      this.search_index.insert('n' + node_id, { 'name': node.bigg_id,
        'data': { type: 'metabolite',
          node_id: node_id } });
      this.search_index.insert('n_name' + node_id, { 'name': node.name,
        'data': { type: 'metabolite',
          node_id: node_id } });
    }
  }
  utils.extend(this.nodes, new_nodes);
}

/**
 * Add new reactions to data and search index.
 */
function extend_reactions(new_reactions) {
  if (this.enable_search) {
    for (var r_id in new_reactions) {
      var reaction = new_reactions[r_id];
      this.search_index.insert('r' + r_id, { 'name': reaction.bigg_id,
        'data': { type: 'reaction',
          reaction_id: r_id } });
      this.search_index.insert('r_name' + r_id, { 'name': reaction.name,
        'data': { type: 'reaction',
          reaction_id: r_id } });
      for (var g_id in reaction.genes) {
        var gene = reaction.genes[g_id];
        this.search_index.insert('r' + r_id + '_g' + g_id, { 'name': gene.bigg_id,
          'data': { type: 'reaction',
            reaction_id: r_id } });
        this.search_index.insert('r' + r_id + '_g_name' + g_id, { 'name': gene.name,
          'data': { type: 'reaction',
            reaction_id: r_id } });
      }
    }
  }
  utils.extend(this.reactions, new_reactions);
}

function _extend_and_draw_reaction(new_nodes, new_reactions, new_beziers, selected_node_id) {
  this.extend_reactions(new_reactions);
  utils.extend(this.beziers, new_beziers);
  // Remove the selected node so it can be updated
  this.delete_node_data([selected_node_id]); // TODO this is a hack. fix
  this.extend_nodes(new_nodes);

  // Apply the reaction and node data to the scales. If the scale changes,
  // redraw everything.
  var keys = Object.keys(new_reactions);
  if (this.has_data_on_reactions) {
    var scale_changed = false;
    if (this.imported_reaction_data) {
      scale_changed = this.apply_reaction_data_to_map(this.imported_reaction_data, keys);
    } else if (this.imported_gene_data) {
      scale_changed = this.apply_gene_data_to_map(this.imported_gene_data, keys);
    } else {
      throw new Error('imported_gene_data or imported_reaction_data should ' + 'not be null');
    }
    if (scale_changed) {
      this.draw_all_reactions(true, false);
    } else {
      this.draw_these_reactions(keys);
    }
  } else {
    this.draw_these_reactions(keys);
  }

  var node_keys = Object.keys(new_nodes);
  if (this.has_data_on_nodes) {
    if (this.imported_metabolite_data === null) {
      throw new Error('imported_metabolite_data should not be null');
    }
    var scale_changed = this.apply_metabolite_data_to_map(this.imported_metabolite_data, node_keys);
    if (scale_changed) {
      this.draw_all_nodes(false);
    } else {
      this.draw_these_nodes(node_keys);
    }
  } else {
    this.draw_these_nodes(node_keys);
  }

  // select new primary metabolite
  for (var node_id in new_nodes) {
    var node = new_nodes[node_id];
    if (node.node_is_primary && node_id != selected_node_id) {
      this.select_metabolite_with_id(node_id);
      var new_coords = { x: node.x, y: node.y };
      if (this.zoom_container) {
        this.zoom_container.translate_off_screen(new_coords);
      }
    }
  }
}

/**
 * Build a new reaction starting with selected_met. Undoable.
 * @param {String} reaction_bigg_id - The BiGG ID of the reaction to draw.
 * @param {String} selected_node_id - The ID of the node to begin drawing with.
 * @param {Number} direction - The direction to draw in.
 * @param {Boolean} [apply_undo_redo=true] - If true, then add to the undo
 * stack. Otherwise, just return the undo and redo functions.
 * @return An object of undo and redo functions:
 *   { undo: undo_function, redo: redo_function }
 */
function new_reaction_for_metabolite(reaction_bigg_id, selected_node_id, direction, apply_undo_redo) {
  // default args
  if (apply_undo_redo === undefined) apply_undo_redo = true;

  // get the metabolite node
  var selected_node = this.nodes[selected_node_id];

  // Set reaction coordinates and angle. Be sure to copy the reaction
  // recursively.
  var cobra_reaction = this.cobra_model.reactions[reaction_bigg_id];

  // build the new reaction
  var out = build.new_reaction(reaction_bigg_id, cobra_reaction, this.cobra_model.metabolites, selected_node_id, utils.clone(selected_node), this.largest_ids, this.settings.get_option('cofactors'), direction);
  var new_nodes = out.new_nodes;
  var new_reactions = out.new_reactions;
  var new_beziers = out.new_beziers;

  // Draw
  _extend_and_draw_reaction.apply(this, [new_nodes, new_reactions, new_beziers, selected_node_id]);

  // Clone the nodes and reactions, to redo this action later
  var saved_nodes = utils.clone(new_nodes);
  var saved_reactions = utils.clone(new_reactions);
  var saved_beziers = utils.clone(new_beziers);

  // Add to undo/redo stack
  var undo_fn = function () {
    // Undo. Get the nodes to delete.
    delete new_nodes[selected_node_id];
    this.delete_node_data(Object.keys(new_nodes));
    this.delete_reaction_data(Object.keys(new_reactions)); // also deletes beziers
    select_metabolite_with_id.apply(this, [selected_node_id]);
    // Save the nodes and reactions again, for redo
    new_nodes = utils.clone(saved_nodes);
    new_reactions = utils.clone(saved_reactions);
    new_beziers = utils.clone(saved_beziers);
    // Draw
    if (this.has_data_on_reactions) {
      var scale_changed = this.calc_data_stats('reaction');
      if (scale_changed) {
        this.draw_all_reactions(true, true);
      } else {
        // Also clears segments and beziers
        this.clear_deleted_reactions(true);
      }
    } else {
      // Also clears segments and beziers
      this.clear_deleted_reactions(true);
    }
    if (this.has_data_on_nodes) {
      var scale_changed = this.calc_data_stats('metabolite');
      if (scale_changed) {
        this.draw_all_nodes(true);
      } else {
        this.clear_deleted_nodes();
      }
    } else {
      this.clear_deleted_nodes();
    }
  }.bind(this);
  var redo_fn = function () {
    // redo
    // clone the nodes and reactions, to redo this action later
    _extend_and_draw_reaction.apply(this, [new_nodes, new_reactions, new_beziers, selected_node_id]);
  }.bind(this);

  if (apply_undo_redo) {
    this.undo_stack.push(undo_fn, redo_fn);
  }

  return { undo: undo_fn, redo: redo_fn };
}

function cycle_primary_node() {
  var selected_nodes = this.get_selected_nodes();
  // Get the first node
  var node_id = Object.keys(selected_nodes)[0];
  var node = selected_nodes[node_id];
  var reactions = this.reactions;
  var nodes = this.nodes;
  // make the other reactants or products secondary
  // 1. Get the connected anchor nodes for the node
  var connected_anchor_ids = [],
      reactions_to_draw;
  nodes[node_id].connected_segments.forEach(function (segment_info) {
    reactions_to_draw = [segment_info.reaction_id];
    var segment;
    try {
      segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id];
      if (segment === undefined) throw new Error('undefined segment');
    } catch (e) {
      console.warn('Could not find connected segment ' + segment_info.segment_id);
      return;
    }
    connected_anchor_ids.push(segment.from_node_id == node_id ? segment.to_node_id : segment.from_node_id);
  });
  // can only be connected to one anchor
  if (connected_anchor_ids.length != 1) {
    console.error('Only connected nodes with a single reaction can be selected');
    return;
  }
  var connected_anchor_id = connected_anchor_ids[0];
  // 2. find nodes connected to the anchor that are metabolites
  var related_node_ids = [node_id];
  var segments = [];
  nodes[connected_anchor_id].connected_segments.forEach(function (segment_info) {
    // deterministic order
    var segment;
    try {
      segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id];
      if (segment === undefined) throw new Error('undefined segment');
    } catch (e) {
      console.warn('Could not find connected segment ' + segment_info.segment_id);
      return;
    }
    var conn_met_id = segment.from_node_id == connected_anchor_id ? segment.to_node_id : segment.from_node_id,
        conn_node = nodes[conn_met_id];
    if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
      related_node_ids.push(String(conn_met_id));
    }
  });
  // 3. make sure they only have 1 reaction connection, and check if
  // they match the other selected nodes
  for (var i = 0; i < related_node_ids.length; i++) {
    if (nodes[related_node_ids[i]].connected_segments.length > 1) {
      console.error('Only connected nodes with a single reaction can be selected');
      return;
    }
  }
  for (var a_selected_node_id in selected_nodes) {
    if (a_selected_node_id != node_id && related_node_ids.indexOf(a_selected_node_id) == -1) {
      console.warn('Selected nodes are not on the same reaction');
      return;
    }
  }
  // 4. change the primary node, and change coords, label coords, and beziers
  var nodes_to_draw = [],
      last_i = related_node_ids.length - 1,
      last_node = nodes[related_node_ids[last_i]],
      last_is_primary = last_node.node_is_primary,
      last_coords = { x: last_node.x, y: last_node.y,
    label_x: last_node.label_x, label_y: last_node.label_y };
  if (last_node.connected_segments.length > 1) console.warn('Too many connected segments for node ' + last_node.node_id);
  var last_segment_info = last_node.connected_segments[0],
      // guaranteed above to have only one
  last_segment;
  try {
    last_segment = reactions[last_segment_info.reaction_id].segments[last_segment_info.segment_id];
    if (last_segment === undefined) throw new Error('undefined segment');
  } catch (e) {
    console.error('Could not find connected segment ' + last_segment_info.segment_id);
    return;
  }
  var last_bezier = { b1: last_segment.b1, b2: last_segment.b2 },
      primary_node_id;
  related_node_ids.forEach(function (related_node_id) {
    var node = nodes[related_node_id],
        this_is_primary = node.node_is_primary,
        these_coords = { x: node.x, y: node.y,
      label_x: node.label_x, label_y: node.label_y },
        this_segment_info = node.connected_segments[0],
        this_segment = reactions[this_segment_info.reaction_id].segments[this_segment_info.segment_id],
        this_bezier = { b1: this_segment.b1, b2: this_segment.b2 };
    node.node_is_primary = last_is_primary;
    node.x = last_coords.x;node.y = last_coords.y;
    node.label_x = last_coords.label_x;node.label_y = last_coords.label_y;
    this_segment.b1 = last_bezier.b1;this_segment.b2 = last_bezier.b2;
    last_is_primary = this_is_primary;
    last_coords = these_coords;
    last_bezier = this_bezier;
    if (node.node_is_primary) primary_node_id = related_node_id;
    nodes_to_draw.push(related_node_id);
  });
  // 5. cycle the connected_segments array so the next time, it cycles differently
  var old_connected_segments = nodes[connected_anchor_id].connected_segments,
      last_i = old_connected_segments.length - 1,
      new_connected_segments = [old_connected_segments[last_i]];
  old_connected_segments.forEach(function (segment, i) {
    if (last_i == i) return;
    new_connected_segments.push(segment);
  });
  nodes[connected_anchor_id].connected_segments = new_connected_segments;
  // 6. draw the nodes
  this.draw_these_nodes(nodes_to_draw);
  this.draw_these_reactions(reactions_to_draw);
  // 7. select the primary node
  this.select_metabolite_with_id(primary_node_id);
  return;
}

function toggle_selected_node_primary() {
  /** Toggle the primary/secondary status of each selected node.
       Undoable.
   */
  var selected_node_ids = this.get_selected_node_ids(),
      go = function (ids) {
    var nodes_to_draw = {},
        hide_secondary_metabolites = this.settings.get_option('hide_secondary_metabolites');
    ids.forEach(function (id) {
      if (!(id in this.nodes)) {
        console.warn('Could not find node: ' + id);
        return;
      }
      var node = this.nodes[id];
      if (node.node_type == 'metabolite') {
        node.node_is_primary = !node.node_is_primary;
        nodes_to_draw[id] = node;
      }
    }.bind(this));
    // draw the nodes
    this.draw_these_nodes(Object.keys(nodes_to_draw));
    // draw associated reactions
    if (hide_secondary_metabolites) {
      var out = this.segments_and_reactions_for_nodes(nodes_to_draw),
          reaction_ids_to_draw_o = {};
      for (var id in out.segment_objs_w_segments) {
        var r_id = out.segment_objs_w_segments[id].reaction_id;
        reaction_ids_to_draw_o[r_id] = true;
      }
      this.draw_these_reactions(Object.keys(reaction_ids_to_draw_o));
    }
  }.bind(this);

  // go
  go(selected_node_ids);

  // add to the undo stack
  this.undo_stack.push(function () {
    go(selected_node_ids);
  }, function () {
    go(selected_node_ids);
  });
}

function segments_and_reactions_for_nodes(nodes) {
  /** Get segments and reactions that should be deleted with node deletions
    */
  var segment_objs_w_segments = {},
      these_reactions = {},
      segment_ids_for_reactions = {},
      reactions = this.reactions;
  // for each node
  for (var node_id in nodes) {
    var node = nodes[node_id];
    // find associated segments and reactions
    node.connected_segments.forEach(function (segment_obj) {
      var segment;
      try {
        segment = reactions[segment_obj.reaction_id].segments[segment_obj.segment_id];
        if (segment === undefined) throw new Error('undefined segment');
      } catch (e) {
        console.warn('Could not find connected segments for node');
        return;
      }
      var segment_obj_w_segment = utils.clone(segment_obj);
      segment_obj_w_segment['segment'] = utils.clone(segment);
      segment_objs_w_segments[segment_obj.segment_id] = segment_obj_w_segment;
      if (!(segment_obj.reaction_id in segment_ids_for_reactions)) segment_ids_for_reactions[segment_obj.reaction_id] = [];
      segment_ids_for_reactions[segment_obj.reaction_id].push(segment_obj.segment_id);
    });
  }
  // find the reactions that should be deleted because they have no segments left
  for (var reaction_id in segment_ids_for_reactions) {
    var reaction = reactions[reaction_id],
        these_ids = segment_ids_for_reactions[reaction_id],
        has = true;
    for (var segment_id in reaction.segments) {
      if (these_ids.indexOf(segment_id) == -1) has = false;
    }
    if (has) these_reactions[reaction_id] = reaction;
  }
  return { segment_objs_w_segments: segment_objs_w_segments, reactions: these_reactions };
}

function add_label_to_search_index(id, text) {
  this.search_index.insert('l' + id, {
    name: text,
    data: { type: 'text_label', text_label_id: id }
  });
}

function new_text_label(coords, text) {
  // Make an label
  var out = build.new_text_label(this.largest_ids, text, coords);
  this.text_labels[out.id] = out.label;
  this.draw_these_text_labels([out.id]);
  // Add to the search index
  if (text !== '') {
    this.add_label_to_search_index(out.id, text);
  }
  return out.id;
}

/**
 * Edit a text label. Undoable.
 * @param {} text_label_id -
 * @param {String} new_value -
 * @param {Boolean} should_draw -
 * @param {Boolean} [is_new=false] - If true, then the text label is all new, so
 * delete it on undo and create it again on redo.
 */
function edit_text_label(text_label_id, new_value, should_draw, is_new) {
  if (_.isUndefined(is_new)) is_new = false;

  if (new_value === '') {
    throw new Error('Should not be called for empty string');
  }

  var edit_and_draw = function (new_val, should_draw) {
    // set the new value
    var label = this.text_labels[text_label_id];
    label.text = new_val;
    if (should_draw) {
      this.draw_these_text_labels([text_label_id]);
    }
    // Update in the search index
    var record_id = 'l' + text_label_id;
    var found = this.search_index.remove(record_id);
    if (!is_new && !found) {
      console.warn('Could not find modified text label in search index');
    }
    this.search_index.insert(record_id, {
      name: new_val,
      data: { type: 'text_label', text_label_id: text_label_id }
    });
  }.bind(this);

  // Save old value
  var saved_label = utils.clone(this.text_labels[text_label_id]);

  // Edit the label
  edit_and_draw(new_value, should_draw);

  // Add to undo stack
  this.undo_stack.push(function () {
    if (is_new) {
      this.delete_text_label_data([text_label_id]);
      this.clear_deleted_text_labels();
    } else {
      edit_and_draw(saved_label.text, true);
    }
  }.bind(this), function () {
    if (is_new) {
      this.text_labels[text_label_id] = utils.clone(saved_label);
      this.text_labels[text_label_id].text = new_value;
      this.draw_these_text_labels([text_label_id]);
      this.add_label_to_search_index(text_label_id, new_value);
    } else {
      edit_and_draw(new_value, true);
    }
  }.bind(this));
}

// -------------------------------------------------------------------------
// Zoom
// -------------------------------------------------------------------------

/**
 * Zoom to fit all the nodes. Returns error if one is raised.
 * @param {} margin - optional argument to set the margins as a fraction of
 * height.
 */
function zoom_extent_nodes(margin) {
  this._zoom_extent(margin, 'nodes');
}

/**
 * Zoom to fit the canvas. Returns error if one is raised.
 * @param {} margin - optional argument to set the margins as a fraction of
 * height.
 */
function zoom_extent_canvas(margin) {
  this._zoom_extent(margin, 'canvas');
}

/**
 * Zoom to fit the canvas or all the nodes. Returns error if one is raised.
 * @param {} margin - optional argument to set the margins.
 * @param {} mode - Values are 'nodes', 'canvas'.
 */
function _zoom_extent(margin, mode) {
  // Optional args
  if (_.isUndefined(margin)) margin = mode === 'nodes' ? 0.2 : 0;
  if (_.isUndefined(mode)) mode = 'canvas';

  var new_zoom;
  var new_pos;
  var size = this.get_size();
  // scale margin to window size
  margin = margin * size.height;

  if (mode === 'nodes') {
    // get the extent of the nodes
    var min = { x: null, y: null // TODO make infinity?
    };var max = { x: null, y: null };
    for (var node_id in this.nodes) {
      var node = this.nodes[node_id];
      if (min.x === null) min.x = node.x;
      if (min.y === null) min.y = node.y;
      if (max.x === null) max.x = node.x;
      if (max.y === null) max.y = node.y;

      min.x = Math.min(min.x, node.x);
      min.y = Math.min(min.y, node.y);
      max.x = Math.max(max.x, node.x);
      max.y = Math.max(max.y, node.y);
    }
    // set the zoom
    new_zoom = Math.min((size.width - margin * 2) / (max.x - min.x), (size.height - margin * 2) / (max.y - min.y));
    new_pos = { x: -(min.x * new_zoom) + margin + (size.width - margin * 2 - (max.x - min.x) * new_zoom) / 2,
      y: -(min.y * new_zoom) + margin + (size.height - margin * 2 - (max.y - min.y) * new_zoom) / 2 };
  } else if (mode == 'canvas') {
    // center the canvas
    new_zoom = Math.min((size.width - margin * 2) / this.canvas.width, (size.height - margin * 2) / this.canvas.height);
    new_pos = { x: -(this.canvas.x * new_zoom) + margin + (size.width - margin * 2 - this.canvas.width * new_zoom) / 2,
      y: -(this.canvas.y * new_zoom) + margin + (size.height - margin * 2 - this.canvas.height * new_zoom) / 2 };
  } else {
    return console.error('Did not recognize mode');
  }
  this.zoom_container.go_to(new_zoom, new_pos);
  return null;
}

function get_size() {
  return this.zoom_container.get_size();
}

function zoom_to_reaction(reaction_id) {
  var reaction = this.reactions[reaction_id],
      new_zoom = 0.5,
      size = this.get_size(),
      new_pos = { x: -reaction.label_x * new_zoom + size.width / 2,
    y: -reaction.label_y * new_zoom + size.height / 2 };
  this.zoom_container.go_to(new_zoom, new_pos);
}

function zoom_to_node(node_id) {
  var node = this.nodes[node_id];
  var new_zoom = 0.5;
  var size = this.get_size();
  var new_pos = {
    x: -node.label_x * new_zoom + size.width / 2,
    y: -node.label_y * new_zoom + size.height / 2
  };
  this.zoom_container.go_to(new_zoom, new_pos);
}

function zoom_to_text_label(text_label_id) {
  var text_label = this.text_labels[text_label_id];
  var new_zoom = 0.5;
  var size = this.get_size();
  var new_pos = {
    x: -text_label.x * new_zoom + size.width / 2,
    y: -text_label.y * new_zoom + size.height / 2
  };
  this.zoom_container.go_to(new_zoom, new_pos);
}

function highlight_reaction(reaction_id) {
  this.highlight(this.sel.selectAll('#r' + reaction_id).selectAll('text'));
}

function highlight_node(node_id) {
  this.highlight(this.sel.selectAll('#n' + node_id).selectAll('text'));
}

function highlight_text_label(text_label_id) {
  this.highlight(this.sel.selectAll('#l' + text_label_id).selectAll('text'));
}

function highlight(sel) {
  this.sel.selectAll('.highlight').classed('highlight', false);
  if (sel !== null) {
    sel.classed('highlight', true);
  }
}

// -------------------------------------------------------------------------
// Full screen
// -------------------------------------------------------------------------

function full_screen_event() {
  if (document.fullscreenEnabled) return 'fullscreenchange';else if (document.mozFullScreenEnabled) return 'mozfullscreenchange';else if (document.webkitFullscreenEnabled) return 'webkitfullscreenchange';else if (document.msFullscreenEnabled) return 'MSFullscreenChange';else return null;
}

/**
 * Call the function when full screen is enabled.
 *
 * To unregister the event listener for the full screen event,
 * unlisten_for_full_screen.
 */
function listen_for_full_screen(fn) {
  document.addEventListener(full_screen_event(), fn);
  this.full_screen_listener = fn;
}

/**
 * Remove the listener created by listen_for_full_screen.
 */
function unlisten_for_full_screen() {
  document.removeEventListener(full_screen_event(), this.full_screen_listener);
}

/**
 * Enter full screen if supported by the browser.
 */
function full_screen() {
  var sel = this.zoom_container.selection;
  var e = sel.node();
  var d = document;
  var full_screen_on = d.fullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement || d.msFullscreenElement;
  if (full_screen_on) {
    // apply full heigh/width 100%
    sel.classed('full-screen-on', false);
    // exit
    if (d.exitFullscreen) d.exitFullscreen();else if (d.mozCancelFullScreen) d.mozCancelFullScreen();else if (d.webkitExitFullscreen) d.webkitExitFullscreen();else if (d.msExitFullscreen) d.msExitFullscreen();else throw Error('Cannot exit full screen');
  } else {
    sel.classed('full-screen-on', true);
    // enter
    if (e.requestFullscreen) e.requestFullscreen();else if (e.mozRequestFullScreen) e.mozRequestFullScreen();else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);else if (e.msRequestFullscreen) e.msRequestFullscreen();else throw Error('Full screen does not seem to be supported on this system.');
  }
}

// -------------------------------------------------------------------------
// IO

function save() {
  utils.download_json(this.map_for_export(), this.map_name);
}

function map_for_export() {
  var out = [{ map_name: this.map_name,
    map_id: this.map_id,
    map_description: this.map_description,
    homepage: "https://escher.github.io",
    schema: "https://escher.github.io/escher/jsonschema/1-0-0#"
  }, { reactions: utils.clone(this.reactions),
    nodes: utils.clone(this.nodes),
    text_labels: utils.clone(this.text_labels),
    canvas: this.canvas.size_and_location() }];

  // remove extra data
  for (var r_id in out[1].reactions) {
    var reaction = out[1].reactions[r_id];
    var new_reaction = {};
    var attrs = ['name', 'bigg_id', 'reversibility', 'label_x', 'label_y', 'gene_reaction_rule', 'genes', 'metabolites'];
    attrs.forEach(function (attr) {
      new_reaction[attr] = reaction[attr];
    });
    new_reaction['segments'] = {};
    for (var s_id in reaction.segments) {
      var segment = reaction.segments[s_id];
      var new_segment = {};
      var attrs = ['from_node_id', 'to_node_id', 'b1', 'b2'];
      attrs.forEach(function (attr) {
        new_segment[attr] = segment[attr];
      });
      new_reaction['segments'][s_id] = new_segment;
    }
    out[1].reactions[r_id] = new_reaction;
  }
  for (var n_id in out[1].nodes) {
    var node = out[1].nodes[n_id];
    var new_node = {};
    var attrs;
    if (node.node_type === 'metabolite') {
      attrs = ['node_type', 'x', 'y', 'bigg_id', 'name', 'label_x', 'label_y', 'node_is_primary'];
    } else {
      attrs = ['node_type', 'x', 'y'];
    }
    attrs.forEach(function (attr) {
      new_node[attr] = node[attr];
    });
    out[1].nodes[n_id] = new_node;
  }
  for (var t_id in out[1].text_labels) {
    var text_label = out[1].text_labels[t_id];
    var new_text_label = {};
    var attrs = ['x', 'y', 'text'];
    attrs.forEach(function (attr) {
      new_text_label[attr] = text_label[attr];
    });
    out[1].text_labels[t_id] = new_text_label;
  }
  // canvas
  var canvas_el = out[1].canvas;
  var new_canvas_el = {};
  var attrs = ['x', 'y', 'width', 'height'];
  attrs.forEach(function (attr) {
    new_canvas_el[attr] = canvas_el[attr];
  });
  out[1].canvas = new_canvas_el;

  return out;
}

/**
 * Rescale the canvas and save as svg/png.
 */
function save_map(obj, callback_before, callback_after, map_type) {
  // Run the before callback
  obj.callback_manager.run(callback_before);

  // Turn ofo zoom and translate so that illustrator likes the map
  var window_scale = obj.zoom_container.window_scale;
  var window_translate = obj.zoom_container.window_translate;
  var canvas_size_and_loc = obj.canvas.size_and_location();
  var mouse_node_size_and_trans = {
    w: obj.canvas.mouse_node.attr('width'),
    h: obj.canvas.mouse_node.attr('height'),
    transform: obj.canvas.mouse_node.attr('transform')
  };

  obj.zoom_container._go_to_svg(1.0, { x: -canvas_size_and_loc.x, y: -canvas_size_and_loc.y }, function () {
    obj.svg.attr('width', canvas_size_and_loc.width);
    obj.svg.attr('height', canvas_size_and_loc.height);
    obj.canvas.mouse_node.attr('width', '0px');
    obj.canvas.mouse_node.attr('height', '0px');
    obj.canvas.mouse_node.attr('transform', null);

    // hide the segment control points
    var hidden_sel = obj.sel.selectAll('.multimarker-circle,.midmarker-circle,#canvas').style('visibility', 'hidden');

    // do the export
    if (map_type == 'svg') {
      utils.download_svg('saved_map', obj.svg, true);
    } else if (map_type == 'png') {
      utils.download_png('saved_map', obj.svg, true);
    }

    // revert everything
    obj.zoom_container._go_to_svg(window_scale, window_translate, function () {
      obj.svg.attr('width', null);
      obj.svg.attr('height', null);
      obj.canvas.mouse_node.attr('width', mouse_node_size_and_trans.w);
      obj.canvas.mouse_node.attr('height', mouse_node_size_and_trans.h);
      obj.canvas.mouse_node.attr('transform', mouse_node_size_and_trans.transform);
      // unhide the segment control points
      hidden_sel.style('visibility', null);

      // run the after callback
      obj.callback_manager.run(callback_after);
    }.bind(obj));
  }.bind(obj));
}

function save_svg() {
  save_map(this, 'before_svg_export', 'after_svg_export', 'svg');
}

function save_png() {
  save_map(this, 'before_png_export', 'after_png_export', 'png');
}

/**
 * Assign the descriptive names and gene_reaction_rules from the model to the
 * map. If no map is loaded, then throw an Error. If some reactions are not in
 * the model, then warn in the status.
 */
function convert_map() {
  // Run the before callback
  this.callback_manager.run('before_convert_map');

  // Check the model
  if (!this.has_cobra_model()) {
    throw Error('No COBRA model loaded.');
  }
  var model = this.cobra_model;

  // IDs for reactions and metabolites not found in the model
  var reactions_not_found = {};
  var reaction_attrs = ['name', 'gene_reaction_rule', 'genes'];
  var met_nodes_not_found = {};
  var metabolite_attrs = ['name'];
  var found;
  // convert reactions
  for (var reaction_id in this.reactions) {
    var reaction = this.reactions[reaction_id];
    found = false;
    // find in cobra model
    for (var model_reaction_id in model.reactions) {
      var model_reaction = model.reactions[model_reaction_id];
      if (model_reaction.bigg_id == reaction.bigg_id) {
        reaction_attrs.forEach(function (attr) {
          reaction[attr] = model_reaction[attr];
        });
        found = true;
      }
    }
    if (!found) reactions_not_found[reaction_id] = true;
  }
  // convert metabolites
  for (var node_id in this.nodes) {
    var node = this.nodes[node_id];
    // only look at metabolites
    if (node.node_type != 'metabolite') continue;
    found = false;
    // find in cobra model
    for (var model_metabolite_id in model.metabolites) {
      var model_metabolite = model.metabolites[model_metabolite_id];
      if (model_metabolite.bigg_id == node.bigg_id) {
        metabolite_attrs.forEach(function (attr) {
          node[attr] = model_metabolite[attr];
        });
        found = true;
      }
    }
    if (!found) met_nodes_not_found[node_id] = true;
  }

  // status
  var n_reactions_not_found = Object.keys(reactions_not_found).length;
  var n_met_nodes_not_found = Object.keys(met_nodes_not_found).length;
  var status_delay = 3000;
  if (n_reactions_not_found === 0 && n_met_nodes_not_found === 0) {
    this.set_status('Successfully converted attributes.', status_delay);
  } else if (n_met_nodes_not_found === 0) {
    this.set_status('Converted attributes, but count not find ' + n_reactions_not_found + ' reactions in the model.', status_delay);
    this.settings.set_conditional('highlight_missing', true);
  } else if (n_reactions_not_found === 0) {
    this.set_status('Converted attributes, but count not find ' + n_met_nodes_not_found + ' metabolites in the model.', status_delay);
    this.settings.set_conditional('highlight_missing', true);
  } else {
    this.set_status('Converted attributes, but count not find ' + n_reactions_not_found + ' reactions and ' + n_met_nodes_not_found + ' metabolites in the model.', status_delay);
    this.settings.set_conditional('highlight_missing', true);
  }

  // redraw
  this.draw_everything();

  // run the after callback
  this.callback_manager.run('after_convert_map');
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Draw. Manages creating, updating, and removing objects during d3 data
 * binding.
 *
 * Arguments
 * ---------
 *
 * behavior: An escher.Behavior object.
 * settings: An escher.Settings object.
 *
 * Callbacks
 * ---------
 *
 * draw.callback_manager.run('create_membrane', draw, enter_selection)
 * draw.callback_manager.run('update_membrane', draw, update_selection)
 * draw.callback_manager.run('create_reaction', draw, enter_selection)
 * draw.callback_manager.run('update_reaction', draw, update_selection)
 * draw.callback_manager.run('create_reaction_label', draw, enter_selection)
 * draw.callback_manager.run('update_reaction_label', draw, update_selection)
 * draw.callback_manager.run('create_segment', draw, enter_selection)
 * draw.callback_manager.run('update_segment', draw, update_selection)
 * draw.callback_manager.run('create_bezier', draw, enter_selection)
 * draw.callback_manager.run('update_bezier', draw, update_selection)
 * draw.callback_manager.run('create_node', draw, enter_selection)
 * draw.callback_manager.run('update_node', draw, update_selection)
 * draw.callback_manager.run('create_text_label', draw, enter_selection)
 * draw.callback_manager.run('update_text_label', draw, update_selection)
 *
 */

var utils = __webpack_require__(0);
var data_styles = __webpack_require__(4);
var CallbackManager = __webpack_require__(3);
var d3_format = __webpack_require__(6).format;
var d3_select = __webpack_require__(1).select;

var Draw = utils.make_class();
// instance methods
Draw.prototype = {
  init: init,
  create_reaction: create_reaction,
  update_reaction: update_reaction,
  create_bezier: create_bezier,
  update_bezier: update_bezier,
  create_node: create_node,
  update_node: update_node,
  create_text_label: create_text_label,
  update_text_label: update_text_label,
  create_membrane: create_membrane,
  update_membrane: update_membrane,
  create_reaction_label: create_reaction_label,
  update_reaction_label: update_reaction_label,
  create_segment: create_segment,
  update_segment: update_segment
};
module.exports = Draw;

function init(behavior, settings) {
  this.behavior = behavior;
  this.settings = settings;
  this.callback_manager = new CallbackManager();
}

/**
 * Create membranes in the enter_selection.
 * @param {} enter_selection - The D3 enter selection.
 * @returns {} The selection of the new nodes.
 */
function create_membrane(enter_selection) {
  var rect = enter_selection.append('rect').attr('class', 'membrane');

  this.callback_manager.run('create_membrane', this, enter_selection);

  return rect;
}

/**
 * Update the membrane
 */
function update_membrane(update_selection) {
  update_selection.attr('width', function (d) {
    return d.width;
  }).attr('height', function (d) {
    return d.height;
  }).attr('transform', function (d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  }).style('stroke-width', function (d) {
    return 10;
  }).attr('rx', function (d) {
    return 20;
  }).attr('ry', function (d) {
    return 20;
  });

  this.callback_manager.run('update_membrane', this, update_selection);
}

/**
 * Create reactions in the enter_selection.
 * @param {} enter_selection - The D3 enter selection.
 * @returns {} The selection of the new nodes.
 */
function create_reaction(enter_selection) {
  // attributes for new reaction group
  var group = enter_selection.append('g').attr('id', function (d) {
    return 'r' + d.reaction_id;
  }).attr('class', 'reaction');
  this.create_reaction_label(group);

  this.callback_manager.run('create_reaction', this, enter_selection);

  return group;
}

/**
 * Run on the update selection for reactions.
 * update_selection: The D3.js update selection.
 * scale: A Scale object.
 * cobra_model: A CobraModel object.
 * drawn_nodes: The nodes object (e.g. Map.nodes).
 * defs: The defs object generated by utils.setup_defs() (e.g. Map.defs).
 * has_data_on_reactions: Boolean to determine whether data needs to be drawn.
 */
function update_reaction(update_selection, scale, cobra_model, drawn_nodes, defs, has_data_on_reactions) {
  // Update reaction label
  update_selection.select('.reaction-label-group').call(function (sel) {
    return this.update_reaction_label(sel, has_data_on_reactions);
  }.bind(this));

  // draw segments
  utils.draw_a_nested_object(update_selection, '.segment-group', 'segments', 'segment_id', this.create_segment.bind(this), function (sel) {
    return this.update_segment(sel, scale, cobra_model, drawn_nodes, defs, has_data_on_reactions);
  }.bind(this), function (sel) {
    sel.remove();
  });

  // run the callback
  this.callback_manager.run('update_reaction', this, update_selection);
}

/**
 * Draw reaction labels in the enter selection.
 * @param {} enter_selection - The D3 enter selection.
 * @returns {} The selection of the new nodes.
 */
function create_reaction_label(enter_selection, tool) {
  var group = enter_selection.append('g').attr('class', 'reaction-label-group');
  group.append('text').attr('class', 'reaction-label label');
  group.append('g').attr('class', 'all-genes-label-group');

  this.callback_manager.run('create_reaction_label', this, enter_selection);

  return group;
}

/**
 * Run on the update selection for reaction labels.
 * @param {D3 Selection} update_selection - The D3.js update selection.
 * @param {Boolean} has_data_on_reactions - Whether data needs to be drawn.
 */
function update_reaction_label(update_selection, has_data_on_reactions) {
  var decimal_format = d3_format('.4g');
  var identifiers_on_map = this.settings.get_option('identifiers_on_map');
  var reaction_data_styles = this.settings.get_option('reaction_styles');
  var show_gene_reaction_rules = this.settings.get_option('show_gene_reaction_rules');
  var hide_all_labels = this.settings.get_option('hide_all_labels');
  var gene_font_size = this.settings.get_option('gene_font_size');
  var label_mousedown_fn = this.behavior.label_mousedown;
  var label_mouseover_fn = this.behavior.label_mouseover;
  var label_mouseout_fn = this.behavior.label_mouseout;

  // label location
  update_selection.attr('transform', function (d) {
    return 'translate(' + d.label_x + ',' + d.label_y + ')';
  }).call(this.behavior.turn_off_drag).call(this.behavior.reaction_label_drag);

  // update label visibility
  var label = update_selection.select('.reaction-label').attr('visibility', hide_all_labels ? 'hidden' : 'visible');

  if (!hide_all_labels) {
    label.text(function (d) {
      var t = d[identifiers_on_map];
      if (has_data_on_reactions && reaction_data_styles.indexOf('text') !== -1) {
        t += ' ' + d.data_string;
      }
      return t;
    }).on('mousedown', label_mousedown_fn).on('mouseover', function (d) {
      label_mouseover_fn('reaction_label', d);
    }).on('mouseout', label_mouseout_fn);
  }

  var add_gene_height = function add_gene_height(y, i) {
    return y + gene_font_size * 1.5 * (i + 1);
  };

  // gene label
  var all_genes_g = update_selection.select('.all-genes-label-group').selectAll('.gene-label-group').data(function (d) {
    var show_gene_string = 'gene_string' in d && d.gene_string !== null && show_gene_reaction_rules && !hide_all_labels && reaction_data_styles.indexOf('text') !== -1;
    var show_gene_reaction_rule = 'gene_reaction_rule' in d && d.gene_reaction_rule !== null && show_gene_reaction_rules && !hide_all_labels;
    if (show_gene_string) {
      // TODO do we ever use gene_string?
      console.warn('Showing gene_string. See TODO in source.');
      return d.gene_string;
    } else if (show_gene_reaction_rule) {
      // make the gene string with no data
      var sd = data_styles.gene_string_for_data(d.gene_reaction_rule, null, d.genes, null, identifiers_on_map, null);
      // add coords for tooltip
      sd.forEach(function (td, i) {
        td.label_x = d.label_x;
        td.label_y = add_gene_height(d.label_y, i);
      });
      return sd;
    } else {
      return [];
    }
  });

  // enter
  var gene_g = all_genes_g.enter().append('g').attr('class', 'gene-label-group');
  gene_g.append('text').attr('class', 'gene-label').style('font-size', gene_font_size + 'px').on('mousedown', label_mousedown_fn).on('mouseover', function (d) {
    label_mouseover_fn('gene_label', d);
  }).on('mouseout', label_mouseout_fn);

  // update
  var gene_update = gene_g.merge(all_genes_g);
  gene_update.attr('transform', function (d, i) {
    return 'translate(0, ' + add_gene_height(0, i) + ')';
  });
  // update text
  gene_update.select('text').text(function (d) {
    return d['text'];
  });

  // exit
  all_genes_g.exit().remove();

  this.callback_manager.run('update_reaction_label', this, update_selection);
}

/**
 * Create segments in the enter_selection.
 * @param {} enter_selection - The D3 enter selection.
 * @returns {} The selection of the new nodes.
 */
function create_segment(enter_selection) {
  // create segments
  var g = enter_selection.append('g').attr('class', 'segment-group').attr('id', function (d) {
    return 's' + d.segment_id;
  });

  // create reaction arrow
  g.append('path').attr('class', 'segment');

  g.append('g').attr('class', 'arrowheads');

  g.append('g').attr('class', 'stoichiometry-labels');

  this.callback_manager.run('create_segment', this, enter_selection);

  return g;
}

/**
 * Update segments in update selection.
 * @param {} -
 * @param {} -
 * @param {} -
 * @param {} -
 * @param {} -
 * @param {} -
 * @return {}
 */
function update_segment(update_selection, scale, cobra_model, drawn_nodes, defs, has_data_on_reactions) {
  var reaction_data_styles = this.settings.get_option('reaction_styles');
  var should_size = has_data_on_reactions && reaction_data_styles.indexOf('size') !== -1;
  var should_color = has_data_on_reactions && reaction_data_styles.indexOf('color') !== -1;
  var no_data_size = this.settings.get_option('reaction_no_data_size');
  var no_data_color = this.settings.get_option('reaction_no_data_color');

  // update segment attributes
  var highlight_missing = this.settings.get_option('highlight_missing');
  var hide_secondary_metabolites = this.settings.get_option('hide_secondary_metabolites');
  var primary_r = this.settings.get_option('primary_metabolite_radius');
  var secondary_r = this.settings.get_option('secondary_metabolite_radius');
  var get_arrow_size = function get_arrow_size(data, should_size) {
    var width = 20;
    var height = 13;
    if (should_size) {
      height = data === null ? no_data_size : scale.reaction_size(data);
      // check for nan
      if (isNaN(height)) {
        height = no_data_size;
      }
      width = height * 2;
    }
    return { width: width, height: height };
  },
      get_disp = function get_disp(arrow_size, reversibility, coefficient, node_is_primary) {
    var arrow_height = reversibility || coefficient > 0 ? arrow_size.height : 0;
    var r = node_is_primary ? primary_r : secondary_r;
    return r + arrow_height + 10;
  };

  // update arrows
  update_selection.selectAll('.segment').datum(function () {
    return this.parentNode.__data__;
  }).style('visibility', function (d) {
    var start = drawn_nodes[d.from_node_id];
    var end = drawn_nodes[d.to_node_id];
    if (hide_secondary_metabolites && (end['node_type'] === 'metabolite' && !end.node_is_primary || start['node_type'] === 'metabolite' && !start.node_is_primary)) {
      return 'hidden';
    }
    return null;
  }).attr('d', function (d) {
    if (d.from_node_id === null || d.to_node_id === null) {
      return null;
    }
    var start = drawn_nodes[d.from_node_id];
    var end = drawn_nodes[d.to_node_id];
    var b1 = d.b1;
    var b2 = d.b2;
    // if metabolite, then displace the arrow
    if (start['node_type'] === 'metabolite') {
      var arrow_size = get_arrow_size(d.data, should_size);
      var disp = get_disp(arrow_size, d.reversibility, d.from_node_coefficient, start.node_is_primary);
      var direction = b1 === null ? end : b1;
      start = displaced_coords(disp, start, direction, 'start');
    }
    if (end['node_type'] == 'metabolite') {
      var arrow_size = get_arrow_size(d.data, should_size);
      var disp = get_disp(arrow_size, d.reversibility, d.to_node_coefficient, end.node_is_primary);
      var direction = b2 === null ? start : b2;
      end = displaced_coords(disp, direction, end, 'end');
    }
    var curve = 'M' + start.x + ',' + start.y + ' ';
    if (b1 !== null && b2 !== null) {
      curve += 'C' + b1.x + ',' + b1.y + ' ' + b2.x + ',' + b2.y + ' ';
    }
    curve += end.x + ',' + end.y;
    return curve;
  }).style('stroke', function (d) {
    var reaction_id = this.parentNode.parentNode.__data__.bigg_id;
    var show_missing = highlight_missing && cobra_model !== null && !(reaction_id in cobra_model.reactions);
    if (show_missing) {
      return 'red';
    }
    if (should_color) {
      var f = d.data;
      return f === null ? no_data_color : scale.reaction_color(f);
    }
    return null;
  }).style('stroke-width', function (d) {
    if (should_size) {
      var f = d.data;
      return f === null ? no_data_size : scale.reaction_size(f);
    } else {
      return null;
    }
  });

  // new arrowheads
  var arrowheads = update_selection.select('.arrowheads').selectAll('.arrowhead').data(function (d) {
    var arrowheads = [];
    var start = drawn_nodes[d.from_node_id];
    var b1 = d.b1;
    var end = drawn_nodes[d.to_node_id];
    var b2 = d.b2;
    // hide_secondary_metabolites option
    if (hide_secondary_metabolites && (end['node_type'] === 'metabolite' && !end.node_is_primary || start['node_type'] === 'metabolite' && !start.node_is_primary)) {
      return arrowheads;
    }

    if (start.node_type === 'metabolite' && (d.reversibility || d.from_node_coefficient > 0)) {
      var arrow_size = get_arrow_size(d.data, should_size);
      var disp = get_disp(arrow_size, d.reversibility, d.from_node_coefficient, start.node_is_primary);
      var direction = b1 === null ? end : b1;
      var rotation = utils.to_degrees(utils.get_angle([start, direction])) + 90;
      var loc = displaced_coords(disp, start, direction, 'start');
      arrowheads.push({
        data: d.data,
        x: loc.x,
        y: loc.y,
        size: arrow_size,
        rotation: rotation,
        show_arrowhead_flux: d.from_node_coefficient < 0 === d.reverse_flux || d.data === 0
      });
    }

    if (end.node_type === 'metabolite' && (d.reversibility || d.to_node_coefficient > 0)) {
      var arrow_size = get_arrow_size(d.data, should_size);
      var disp = get_disp(arrow_size, d.reversibility, d.to_node_coefficient, end.node_is_primary);
      var direction = b2 === null ? start : b2;
      var rotation = utils.to_degrees(utils.get_angle([end, direction])) + 90;
      var loc = displaced_coords(disp, direction, end, 'end');
      arrowheads.push({
        data: d.data,
        x: loc.x,
        y: loc.y,
        size: arrow_size,
        rotation: rotation,
        show_arrowhead_flux: d.to_node_coefficient < 0 === d.reverse_flux || d.data === 0
      });
    }

    if (d.unconnected_segment_with_arrow) {
      var arrow_size = get_arrow_size(d.data, should_size);
      var direction = end;
      var rotation = utils.to_degrees(utils.get_angle([start, direction])) + 90;
      arrowheads.push({
        data: d.data,
        x: start.x,
        y: start.y,
        size: arrow_size,
        rotation: rotation,
        show_arrowhead_flux: d.to_node_coefficient < 0 === d.reverse_flux || d.data === 0
      });
    }

    return arrowheads;
  });
  arrowheads.enter().append('path').classed('arrowhead', true)
  // update arrowheads
  .merge(arrowheads).attr('d', function (d) {
    return 'M' + [-d.size.width / 2, 0] + ' L' + [0, d.size.height] + ' L' + [d.size.width / 2, 0] + ' Z';
  }).attr('transform', function (d) {
    return 'translate(' + d.x + ',' + d.y + ')rotate(' + d.rotation + ')';
  }).style('fill', function (d) {
    if (should_color) {
      if (d.show_arrowhead_flux) {
        // show the flux
        var f = d.data;
        return f === null ? no_data_color : scale.reaction_color(f);
      } else {
        // if the arrowhead is not filled because it is reversed
        return '#FFFFFF';
      }
    }
    // default fill color
    return null;
  }).style('stroke', function (d) {
    if (should_color) {
      // show the flux color in the stroke whether or not the fill is present
      var f = d.data;
      return f === null ? no_data_color : scale.reaction_color(f);
    }
    // default stroke color
    return null;
  });
  // remove
  arrowheads.exit().remove();

  // new stoichiometry labels
  var stoichiometry_labels = update_selection.select('.stoichiometry-labels').selectAll('.stoichiometry-label').data(function (d) {
    var labels = [];
    var start = drawn_nodes[d.from_node_id];
    var b1 = d.b1;
    var end = drawn_nodes[d.to_node_id];
    var b2 = d.b2;
    var disp_factor = 1.5;

    // hide_secondary_metabolites option
    if (hide_secondary_metabolites && (end['node_type'] == 'metabolite' && !end.node_is_primary || start['node_type'] == 'metabolite' && !start.node_is_primary)) {
      return labels;
    }

    if (start.node_type === 'metabolite' && Math.abs(d.from_node_coefficient) != 1) {
      var arrow_size = get_arrow_size(d.data, should_size);
      var disp = disp_factor * get_disp(arrow_size, false, 0, end.node_is_primary);
      var direction = b1 === null ? end : b1;
      direction = utils.c_plus_c(direction, utils.rotate_coords(direction, 0.5, start));
      var loc = displaced_coords(disp, start, direction, 'start');
      loc = utils.c_plus_c(loc, { x: 0, y: 7 });
      labels.push({
        coefficient: Math.abs(d.from_node_coefficient),
        x: loc.x,
        y: loc.y,
        data: d.data
      });
    }

    if (end.node_type === 'metabolite' && Math.abs(d.to_node_coefficient) !== 1) {
      var arrow_size = get_arrow_size(d.data, should_size);
      var disp = disp_factor * get_disp(arrow_size, false, 0, end.node_is_primary);
      var direction = b2 === null ? start : b2;
      direction = utils.c_plus_c(direction, utils.rotate_coords(direction, 0.5, end));
      var loc = displaced_coords(disp, direction, end, 'end');
      loc = utils.c_plus_c(loc, { x: 0, y: 7 });
      labels.push({
        coefficient: Math.abs(d.to_node_coefficient),
        x: loc.x,
        y: loc.y,
        data: d.data
      });
    }
    return labels;
  });

  // add labels
  stoichiometry_labels.enter().append('text').attr('class', 'stoichiometry-label').attr('text-anchor', 'middle')
  // update stoichiometry_labels
  .merge(stoichiometry_labels).attr('transform', function (d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  }).text(function (d) {
    return d.coefficient;
  }).style('fill', function (d) {
    if (should_color) {
      // show the flux color
      var f = d.data;
      return f === null ? no_data_color : scale.reaction_color(f);
    }
    // default segment color
    return null;
  });

  // remove
  stoichiometry_labels.exit().remove();

  this.callback_manager.run('update_segment', this, update_selection);
}

/**
 * Create beziers in the enter_selection.
 * @param {} enter_selection - The D3 enter selection.
 * @returns {} The selection of the new nodes.
 */
function create_bezier(enter_selection) {
  var g = enter_selection.append('g').attr('id', function (d) {
    return d.bezier_id;
  }).attr('class', function (d) {
    return 'bezier';
  });
  g.append('path').attr('class', 'connect-line');
  g.append('circle').attr('class', function (d) {
    return 'bezier-circle ' + d.bezier;
  }).style('stroke-width', String(1) + 'px').attr('r', String(7) + 'px');

  this.callback_manager.run('create_bezier', this, enter_selection);

  return g;
}

/**
 * Update beziers in update_selection.
 */
function update_bezier(update_selection, show_beziers, drag_behavior, mouseover, mouseout, drawn_nodes, drawn_reactions) {
  var hide_secondary_metabolites = this.settings.get_option('hide_secondary_metabolites');

  if (!show_beziers) {
    update_selection.attr('visibility', 'hidden');
    return;
  } else {
    update_selection.attr('visibility', 'visible');
  }

  // hide secondary
  update_selection.style('visibility', function (d) {
    var seg_data = drawn_reactions[d.reaction_id].segments[d.segment_id],
        start = drawn_nodes[seg_data.from_node_id],
        end = drawn_nodes[seg_data.to_node_id];
    if (hide_secondary_metabolites && (end['node_type'] == 'metabolite' && !end.node_is_primary || start['node_type'] == 'metabolite' && !start.node_is_primary)) return 'hidden';
    return null;
  });

  // draw bezier points
  update_selection.select('.bezier-circle').call(this.behavior.turn_off_drag).call(drag_behavior).on('mouseover', mouseover).on('mouseout', mouseout).attr('transform', function (d) {
    if (d.x == null || d.y == null) return '';
    return 'translate(' + d.x + ',' + d.y + ')';
  });

  // update bezier line
  update_selection.select('.connect-line').attr('d', function (d) {
    var node,
        segment_d = drawn_reactions[d.reaction_id].segments[d.segment_id];
    node = d.bezier == 'b1' ? drawn_nodes[segment_d.from_node_id] : drawn_nodes[segment_d.to_node_id];
    if (d.x == null || d.y == null || node.x == null || node.y == null) return '';
    return 'M' + d.x + ', ' + d.y + ' ' + node.x + ',' + node.y;
  });

  this.callback_manager.run('update_bezier', this, update_selection);
}

/**
 * Create nodes in the enter_selection.
 * @param {} enter_selection - The D3 enter selection.
 * @param {} drawn_nodes - The nodes object (e.g. Map.nodes).
 * @param {} drawn_reactions - The reactions object (e.g. Map.reactions).
 * @returns {} The selection of the new nodes.
 */
function create_node(enter_selection, drawn_nodes, drawn_reactions) {
  // create nodes
  var g = enter_selection.append('g').attr('class', 'node').attr('id', function (d) {
    return 'n' + d.node_id;
  });

  // create metabolite circle and label
  g.append('circle').attr('class', function (d) {
    var c = 'node-circle';
    if (d.node_type !== null) c += ' ' + d.node_type + '-circle';
    return c;
  });

  // labels
  var metabolite_groups = g.filter(function (d) {
    return d.node_type === 'metabolite';
  });

  metabolite_groups.append('text').attr('class', 'node-label label');

  this.callback_manager.run('create_node', this, enter_selection);

  return g;
}

/**
 * Run on the update selection for nodes.
 * @param {D3 Selection} update_selection - The D3.js update selection.
 * @param {Scale} scale - A Scale object.
 * @param {Boolean} has_data_on_nodes - Boolean to determine whether data needs to be drawn.
 * @param {Function} mousedown_fn - A function to call on mousedown for a node.
 * @param {Function} click_fn - A function to call on click for a node.
 * @param {Function} mouseover_fn - A function to call on mouseover for a node.
 * @param {Function} mouseout_fn - A function to call on mouseout for a node.
 * @param {D3 Behavior} drag_behavior - The D3.js drag behavior object for the nodes.
 * @param {D3 Behavior} label_drag_behavior - The D3.js drag behavior object for the node labels.
 */
function update_node(update_selection, scale, has_data_on_nodes, mousedown_fn, click_fn, mouseover_fn, mouseout_fn, drag_behavior, label_drag_behavior) {
  // update circle and label location
  var hide_secondary_metabolites = this.settings.get_option('hide_secondary_metabolites');
  var primary_r = this.settings.get_option('primary_metabolite_radius');
  var secondary_r = this.settings.get_option('secondary_metabolite_radius');
  var marker_r = this.settings.get_option('marker_radius');
  var hide_all_labels = this.settings.get_option('hide_all_labels');
  var identifiers_on_map = this.settings.get_option('identifiers_on_map');
  var metabolite_data_styles = this.settings.get_option('metabolite_styles');
  var no_data_style = { color: this.settings.get_option('metabolite_no_data_color'),
    size: this.settings.get_option('metabolite_no_data_size') };
  var label_mousedown_fn = this.behavior.label_mousedown;
  var label_mouseover_fn = this.behavior.label_mouseover;
  var label_mouseout_fn = this.behavior.label_mouseout;

  var mg = update_selection.select('.node-circle').attr('transform', function (d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  }).style('visibility', function (d) {
    return hideNode(d, hide_secondary_metabolites) ? 'hidden' : null;
  }).attr('r', function (d) {
    if (d.node_type === 'metabolite') {
      var should_scale = has_data_on_nodes && metabolite_data_styles.indexOf('size') !== -1;
      if (should_scale) {
        var f = d.data;
        return f === null ? no_data_style['size'] : scale.metabolite_size(f);
      } else {
        return d.node_is_primary ? primary_r : secondary_r;
      }
    }
    // midmarkers and multimarkers
    return marker_r;
  }).style('fill', function (d) {
    if (d.node_type === 'metabolite') {
      var should_color_data = has_data_on_nodes && metabolite_data_styles.indexOf('color') !== -1;
      if (should_color_data) {
        var f = d.data;
        return f === null ? no_data_style['color'] : scale.metabolite_color(f);
      } else {
        return null;
      }
    }
    // midmarkers and multimarkers
    return null;
  }).call(this.behavior.turn_off_drag).call(drag_behavior).on('mousedown', mousedown_fn).on('click', click_fn).on('mouseover', mouseover_fn).on('mouseout', mouseout_fn);

  // update node label visibility
  var node_label = update_selection.select('.node-label').attr('visibility', hide_all_labels ? 'hidden' : 'visible');
  if (!hide_all_labels) {
    node_label.style('visibility', function (d) {
      return hideNode(d, hide_secondary_metabolites) ? 'hidden' : null;
    }).attr('transform', function (d) {
      return 'translate(' + d.label_x + ',' + d.label_y + ')';
    }).text(function (d) {
      var t = d[identifiers_on_map];
      if (has_data_on_nodes && metabolite_data_styles.indexOf('text') !== -1) t += ' ' + d.data_string;
      return t;
    }).call(this.behavior.turn_off_drag).call(label_drag_behavior).on('mousedown', label_mousedown_fn).on('mouseover', function (d) {
      label_mouseover_fn('node_label', d);
    }).on('mouseout', label_mouseout_fn);
  }

  this.callback_manager.run('update_node', this, update_selection);

  function hideNode(d, hide_secondary_metabolites) {
    return d.node_type === 'metabolite' && hide_secondary_metabolites && !d.node_is_primary;
  }
}

/**
 * Create text labels in the enter_selection.
 * @param {} enter_selection - The D3 enter selection.
 * @returns {} The selection of the new nodes.
 */
function create_text_label(enter_selection) {
  var g = enter_selection.append('g').attr('id', function (d) {
    return 'l' + d.text_label_id;
  }).attr('class', 'text-label');
  g.append('text').attr('class', 'label');

  this.callback_manager.run('create_text_label', this, enter_selection);

  return g;
}

function update_text_label(update_selection) {
  var mousedown_fn = this.behavior.text_label_mousedown;
  var click_fn = this.behavior.text_label_click;
  var drag_behavior = this.behavior.selectable_drag;
  var turn_off_drag = this.behavior.turn_off_drag;

  update_selection.select('.label').text(function (d) {
    return d.text;
  }).attr('transform', function (d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  }).on('mousedown', mousedown_fn).on('click', click_fn).call(turn_off_drag).call(drag_behavior);

  this.callback_manager.run('update_text_label', this, update_selection);
}

function displaced_coords(reaction_arrow_displacement, start, end, displace) {
  utils.check_undefined(arguments, ['reaction_arrow_displacement', 'start', 'end', 'displace']);

  var length = reaction_arrow_displacement;
  var hyp = utils.distance(start, end);
  var new_x;
  var new_y;
  if (!length || !hyp) {
    console.error('Bad value');
  }
  if (displace === 'start') {
    new_x = start.x + length * (end.x - start.x) / hyp;
    new_y = start.y + length * (end.y - start.y) / hyp;
  } else if (displace === 'end') {
    new_x = end.x - length * (end.x - start.x) / hyp;
    new_y = end.y - length * (end.y - start.y) / hyp;
  } else {
    console.error('bad displace value: ' + displace);
  }
  return { x: new_x, y: new_y };
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Behavior. Defines the set of click and drag behaviors for the map, and keeps
 * track of which behaviors are activated.
 *
 * A Behavior instance has the following attributes:
 *
 * my_behavior.rotation_drag, my_behavior.text_label_mousedown,
 * my_behavior.text_label_click, my_behavior.selectable_mousedown,
 * my_behavior.selectable_click, my_behavior.selectable_drag,
 * my_behavior.node_mouseover, my_behavior.node_mouseout,
 * my_behavior.label_mousedown, my_behavior.label_mouseover,
 * my_behavior.label_mouseout, my_behavior.bezier_drag,
 * my_behavior.bezier_mouseover, my_behavior.bezier_mouseout,
 * my_behavior.reaction_label_drag, my_behavior.node_label_drag,
 *
 */

var utils = __webpack_require__(0);
var build = __webpack_require__(10);
var d3_drag = __webpack_require__(5).drag;
var d3_select = __webpack_require__(1).select;
var d3_mouse = __webpack_require__(1).mouse;
var d3_selection = __webpack_require__(1);

var Behavior = utils.make_class();
// methods
Behavior.prototype = {
  init: init,
  toggle_rotation_mode: toggle_rotation_mode,
  turn_everything_on: turn_everything_on,
  turn_everything_off: turn_everything_off,
  // toggle
  toggle_selectable_click: toggle_selectable_click,
  toggle_text_label_edit: toggle_text_label_edit,
  toggle_selectable_drag: toggle_selectable_drag,
  toggle_label_drag: toggle_label_drag,
  toggle_label_mouseover: toggle_label_mouseover,
  toggle_bezier_drag: toggle_bezier_drag,
  // util
  turn_off_drag: turn_off_drag,
  // get drag behaviors
  _get_selectable_drag: _get_selectable_drag,
  _get_bezier_drag: _get_bezier_drag,
  _get_reaction_label_drag: _get_reaction_label_drag,
  _get_node_label_drag: _get_node_label_drag,
  _get_generic_drag: _get_generic_drag,
  _get_generic_angular_drag: _get_generic_angular_drag
};
module.exports = Behavior;

// definitions
function init(map, undo_stack) {
  this.map = map;
  this.undo_stack = undo_stack;

  // make an empty function that can be called as a behavior and does nothing
  this.empty_behavior = function () {};

  // rotation mode operates separately from the rest
  this.rotation_mode_enabled = false;
  this.rotation_drag = d3_drag();

  // behaviors to be applied
  this.selectable_mousedown = null;
  this.text_label_mousedown = null;
  this.text_label_click = null;
  this.selectable_drag = this.empty_behavior;
  this.node_mouseover = null;
  this.node_mouseout = null;
  this.label_mousedown = null;
  this.label_mouseover = null;
  this.label_mouseout = null;
  this.bezier_drag = this.empty_behavior;
  this.bezier_mouseover = null;
  this.bezier_mouseout = null;
  this.reaction_label_drag = this.empty_behavior;
  this.node_label_drag = this.empty_behavior;
  this.dragging = false;
  this.turn_everything_on();
}

/**
 * Toggle everything except rotation mode and text mode.
 */
function turn_everything_on() {
  this.toggle_selectable_click(true);
  this.toggle_selectable_drag(true);
  this.toggle_label_drag(true);
  this.toggle_label_mouseover(true);
}

/**
 * Toggle everything except rotation mode and text mode.
 */
function turn_everything_off() {
  this.toggle_selectable_click(false);
  this.toggle_selectable_drag(false);
  this.toggle_label_drag(false);
  this.toggle_label_mouseover(false);
}

/**
 * Listen for rotation, and rotate selected nodes.
 */
function toggle_rotation_mode(on_off) {
  if (on_off === undefined) {
    this.rotation_mode_enabled = !this.rotation_mode_enabled;
  } else {
    this.rotation_mode_enabled = on_off;
  }

  var selection_node = this.map.sel.selectAll('.node-circle');
  var selection_background = this.map.sel.selectAll('#canvas');

  if (this.rotation_mode_enabled) {
    this.map.callback_manager.run('start_rotation');

    var selected_nodes = this.map.get_selected_nodes();
    if (Object.keys(selected_nodes).length === 0) {
      console.warn('No selected nodes');
      return;
    }

    // show center
    this.center = average_location(selected_nodes);
    show_center.call(this);

    // this.set_status('Drag to rotate.')
    var map = this.map;
    var selected_node_ids = Object.keys(selected_nodes);
    var reactions = this.map.reactions;
    var nodes = this.map.nodes;
    var beziers = this.map.beziers;

    var start_fn = function start_fn(d) {
      // silence other listeners
      d3_selection.event.sourceEvent.stopPropagation();
    };
    var drag_fn = function drag_fn(d, angle, total_angle, center) {
      var updated = build.rotate_nodes(selected_nodes, reactions, beziers, angle, center);
      map.draw_these_nodes(updated.node_ids);
      map.draw_these_reactions(updated.reaction_ids);
    };
    var end_fn = function end_fn(d) {};
    var undo_fn = function undo_fn(d, total_angle, center) {
      // undo
      var these_nodes = {};
      selected_node_ids.forEach(function (id) {
        these_nodes[id] = nodes[id];
      });
      var updated = build.rotate_nodes(these_nodes, reactions, beziers, -total_angle, center);
      map.draw_these_nodes(updated.node_ids);
      map.draw_these_reactions(updated.reaction_ids);
    };
    var redo_fn = function redo_fn(d, total_angle, center) {
      // redo
      var these_nodes = {};
      selected_node_ids.forEach(function (id) {
        these_nodes[id] = nodes[id];
      });
      var updated = build.rotate_nodes(these_nodes, reactions, beziers, total_angle, center);
      map.draw_these_nodes(updated.node_ids);
      map.draw_these_reactions(updated.reaction_ids);
    };
    var center_fn = function () {
      return this.center;
    }.bind(this);
    this.rotation_drag = this._get_generic_angular_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn, center_fn, this.map.sel);
    selection_background.call(this.rotation_drag);
    this.selectable_drag = this.rotation_drag;
  } else {
    // turn off all listeners
    hide_center.call(this);
    selection_node.on('mousedown.center', null);
    selection_background.on('mousedown.center', null);
    selection_background.on('mousedown.drag', null);
    selection_background.on('touchstart.drag', null);
    this.rotation_drag = null;
    this.selectable_drag = null;
  }

  // definitions
  function show_center() {
    var sel = this.map.sel.selectAll('#rotation-center').data([0]);
    var enter_sel = sel.enter().append('g').attr('id', 'rotation-center');

    enter_sel.append('path').attr('d', 'M-32 0 L32 0').attr('class', 'rotation-center-line');
    enter_sel.append('path').attr('d', 'M0 -32 L0 32').attr('class', 'rotation-center-line');

    var update_sel = enter_sel.merge(sel);

    update_sel.attr('transform', 'translate(' + this.center.x + ',' + this.center.y + ')').attr('visibility', 'visible').on('mouseover', function () {
      var current = parseFloat(update_sel.selectAll('path').style('stroke-width'));
      update_sel.selectAll('path').style('stroke-width', current * 2 + 'px');
    }).on('mouseout', function () {
      update_sel.selectAll('path').style('stroke-width', null);
    }).call(d3_drag().on('drag', function () {
      var cur = utils.d3_transform_catch(update_sel.attr('transform'));
      var new_loc = [d3_selection.event.dx + cur.translate[0], d3_selection.event.dy + cur.translate[1]];
      update_sel.attr('transform', 'translate(' + new_loc + ')');
      this.center = { x: new_loc[0], y: new_loc[1] };
    }.bind(this)));
  }
  function hide_center(sel) {
    this.map.sel.select('#rotation-center').attr('visibility', 'hidden');
  }
  function average_location(nodes) {
    var xs = [];
    var ys = [];
    for (var node_id in nodes) {
      var node = nodes[node_id];
      if (node.x !== undefined) xs.push(node.x);
      if (node.y !== undefined) ys.push(node.y);
    }
    return { x: utils.mean(xs),
      y: utils.mean(ys) };
  }
}

/**
 * With no argument, toggle the node click on or off. Pass in a boolean argument
 * to set the on/off state.
 */
function toggle_selectable_click(on_off) {
  if (on_off === undefined) {
    on_off = this.selectable_mousedown === null;
  }
  if (on_off) {
    var map = this.map;
    this.selectable_mousedown = function (d) {
      // stop propogation for the buildinput to work right
      d3_selection.event.stopPropagation();
      // this.parentNode.__data__.was_selected = d3_select(this.parentNode).classed('selected')
      // d3_select(this.parentNode).classed('selected', true)
    };
    this.selectable_click = function (d) {
      // stop propogation for the buildinput to work right
      d3_selection.event.stopPropagation();
      // click suppressed. This DOES have en effect.
      if (d3_selection.event.defaultPrevented) return;
      // turn off the temporary selection so select_selectable
      // works. This is a bit of a hack.
      // if (!this.parentNode.__data__.was_selected)
      //     d3_select(this.parentNode).classed('selected', false)
      map.select_selectable(this, d, d3_selection.event.shiftKey);
      // this.parentNode.__data__.was_selected = false
    };
    this.node_mouseover = function (d) {
      d3_select(this).style('stroke-width', null);
      var current = parseFloat(d3_select(this).style('stroke-width'));
      if (!d3_select(this.parentNode).classed('selected')) d3_select(this).style('stroke-width', current * 3 + 'px');
    };
    this.node_mouseout = function (d) {
      d3_select(this).style('stroke-width', null);
    };
  } else {
    this.selectable_mousedown = null;
    this.selectable_click = null;
    this.node_mouseover = null;
    this.node_mouseout = null;
    this.map.sel.select('#nodes').selectAll('.node-circle').style('stroke-width', null);
  }
}

/**
 * With no argument, toggle the text edit on mousedown on/off. Pass in a boolean
 * argument to set the on/off state. The backup state is equal to
 * selectable_mousedown.
 */
function toggle_text_label_edit(on_off) {
  if (on_off === undefined) {
    on_off = this.text_edit_mousedown == null;
  }
  if (on_off) {
    var map = this.map;
    var selection = this.selection;
    this.text_label_mousedown = function () {
      if (d3_selection.event.defaultPrevented) {
        return; // mousedown suppressed
      }
      // run the callback
      var coords_a = utils.d3_transform_catch(d3_select(this).attr('transform')).translate;
      var coords = { x: coords_a[0], y: coords_a[1] };
      map.callback_manager.run('edit_text_label', null, d3_select(this), coords);
      d3_selection.event.stopPropagation();
    };
    this.text_label_click = null;
    this.map.sel.select('#text-labels').selectAll('.label').classed('edit-text-cursor', true);
    // add the new-label listener
    this.map.sel.on('mousedown.new_text_label', function (node) {
      // silence other listeners
      d3_selection.event.preventDefault();
      var coords = {
        x: d3_mouse(node)[0],
        y: d3_mouse(node)[1]
      };
      this.map.callback_manager.run('new_text_label', null, coords);
    }.bind(this, this.map.sel.node()));
  } else {
    this.text_label_mousedown = this.selectable_mousedown;
    this.text_label_click = this.selectable_click;
    this.map.sel.select('#text-labels').selectAll('.label').classed('edit-text-cursor', false);
    // remove the new-label listener
    this.map.sel.on('mousedown.new_text_label', null);
    this.map.callback_manager.run('hide_text_label_editor');
  }
}

/**
 * With no argument, toggle the node drag & bezier drag on or off. Pass in a
 * boolean argument to set the on/off state.
 */
function toggle_selectable_drag(on_off) {
  if (on_off === undefined) {
    on_off = this.selectable_drag === this.empty_behavior;
  }
  if (on_off) {
    this.selectable_drag = this._get_selectable_drag(this.map, this.undo_stack);
    this.bezier_drag = this._get_bezier_drag(this.map, this.undo_stack);
  } else {
    this.selectable_drag = this.empty_behavior;
    this.bezier_drag = this.empty_behavior;
  }
}

/**
 * With no argument, toggle the label drag on or off. Pass in a boolean argument
 * to set the on/off state.
 * @param {Boolean} on_off - The new on/off state.
 */
function toggle_label_drag(on_off) {
  if (on_off === undefined) {
    on_off = this.label_drag === this.empty_behavior;
  }
  if (on_off) {
    this.reaction_label_drag = this._get_reaction_label_drag(this.map);
    this.node_label_drag = this._get_node_label_drag(this.map);
  } else {
    this.reaction_label_drag = this.empty_behavior;
    this.node_label_drag = this.empty_behavior;
  }
}

/**
 * With no argument, toggle the tooltips on mouseover labels.
 * @param {Boolean} on_off - The new on/off state.
 */
function toggle_label_mouseover(on_off) {
  if (on_off === undefined) {
    on_off = this.label_mouseover === null;
  }

  if (on_off) {

    // Show/hide tooltip.
    // @param {String} type - 'reaction_label' or 'node_label'
    // @param {Object} d - D3 data for DOM element
    this.label_mouseover = function (type, d) {
      if (!this.dragging) {
        this.map.callback_manager.run('show_tooltip', null, type, d);
      }
    }.bind(this);

    this.label_mouseout = function () {
      this.map.callback_manager.run('delay_hide_tooltip');
    }.bind(this);
  } else {
    this.label_mouseover = null;
  }
}

/**
 * With no argument, toggle the bezier drag on or off. Pass in a boolean
 * argument to set the on/off state.
 */
function toggle_bezier_drag(on_off) {
  if (on_off === undefined) {
    on_off = this.bezier_drag === this.empty_behavior;
  }
  if (on_off) {
    this.bezier_drag = this._get_bezier_drag(this.map);
    this.bezier_mouseover = function (d) {
      d3_select(this).style('stroke-width', String(3) + 'px');
    };
    this.bezier_mouseout = function (d) {
      d3_select(this).style('stroke-width', String(1) + 'px');
    };
  } else {
    this.bezier_drag = this.empty_behavior;
    this.bezier_mouseover = null;
    this.bezier_mouseout = null;
  }
}

function turn_off_drag(sel) {
  sel.on('mousedown.drag', null);
  sel.on('touchstart.drag', null);
}

/**
 * Drag the selected nodes and text labels.
 * @param {} map -
 * @param {} undo_stack -
 */
function _get_selectable_drag(map, undo_stack) {
  // define some variables
  var behavior = d3_drag();
  var the_timeout = null;
  var total_displacement = null;
  // for nodes
  var node_ids_to_drag = null;
  var reaction_ids = null;
  // for text labels
  var text_label_ids_to_drag = null;
  var move_label = function move_label(text_label_id, displacement) {
    var text_label = map.text_labels[text_label_id];
    text_label.x = text_label.x + displacement.x;
    text_label.y = text_label.y + displacement.y;
  };
  var set_dragging = function (on_off) {
    this.dragging = on_off;
  }.bind(this);

  behavior.on('start', function (d) {
    set_dragging(true);

    // silence other listeners (e.g. nodes BELOW this one)
    d3_selection.event.sourceEvent.stopPropagation();
    // remember the total displacement for later
    total_displacement = { x: 0, y: 0

      // If a text label is selected, the rest is not necessary
    };if (d3_select(this).attr('class').indexOf('label') === -1) {
      // Note that drag start is called even for a click event
      var data = this.parentNode.__data__,
          bigg_id = data.bigg_id,
          node_group = this.parentNode;
      // Move element to back (for the next step to work). Wait 200ms
      // before making the move, becuase otherwise the element will be
      // deleted before the click event gets called, and selection
      // will stop working.
      the_timeout = setTimeout(function () {
        node_group.parentNode.insertBefore(node_group, node_group.parentNode.firstChild);
      }, 200);
      // prepare to combine metabolites
      map.sel.selectAll('.metabolite-circle').on('mouseover.combine', function (d) {
        if (d.bigg_id === bigg_id && d.node_id !== data.node_id) {
          d3_select(this).style('stroke-width', String(12) + 'px').classed('node-to-combine', true);
        }
      }).on('mouseout.combine', function (d) {
        if (d.bigg_id === bigg_id) {
          map.sel.selectAll('.node-to-combine').style('stroke-width', String(2) + 'px').classed('node-to-combine', false);
        }
      });
    }
  });

  behavior.on('drag', function (d) {
    // if this node is not already selected, then select this one and
    // deselect all other nodes. Otherwise, leave the selection alone.
    if (!d3_select(this.parentNode).classed('selected')) {
      map.select_selectable(this, d);
    }

    // get the grabbed id
    var grabbed = {};
    if (d3_select(this).attr('class').indexOf('label') === -1) {
      // if it is a node
      grabbed['type'] = 'node';
      grabbed['id'] = this.parentNode.__data__.node_id;
    } else {
      // if it is a text label
      grabbed['type'] = 'label';
      grabbed['id'] = this.__data__.text_label_id;
    }

    var selected_node_ids = map.get_selected_node_ids();
    var selected_text_label_ids = map.get_selected_text_label_ids();
    node_ids_to_drag = [];text_label_ids_to_drag = [];
    // choose the nodes and text labels to drag
    if (grabbed['type'] == 'node' && selected_node_ids.indexOf(grabbed['id']) === -1) {
      node_ids_to_drag.push(grabbed['id']);
    } else if (grabbed['type'] === 'label' && selected_text_label_ids.indexOf(grabbed['id']) === -1) {
      text_label_ids_to_drag.push(grabbed['id']);
    } else {
      node_ids_to_drag = selected_node_ids;
      text_label_ids_to_drag = selected_text_label_ids;
    }
    reaction_ids = [];
    var displacement = {
      x: d3_selection.event.dx,
      y: d3_selection.event.dy
    };
    total_displacement = utils.c_plus_c(total_displacement, displacement);
    node_ids_to_drag.forEach(function (node_id) {
      // update data
      var node = map.nodes[node_id],
          updated = build.move_node_and_dependents(node, node_id, map.reactions, map.beziers, displacement);
      reaction_ids = utils.unique_concat([reaction_ids, updated.reaction_ids]);
      // remember the displacements
      // if (!(node_id in total_displacement))  total_displacement[node_id] = { x: 0, y: 0 }
      // total_displacement[node_id] = utils.c_plus_c(total_displacement[node_id], displacement)
    });
    text_label_ids_to_drag.forEach(function (text_label_id) {
      move_label(text_label_id, displacement);
      // remember the displacements
      // if (!(node_id in total_displacement))  total_displacement[node_id] = { x: 0, y: 0 }
      // total_displacement[node_id] = utils.c_plus_c(total_displacement[node_id], displacement)
    });
    // draw
    map.draw_these_nodes(node_ids_to_drag);
    map.draw_these_reactions(reaction_ids);
    map.draw_these_text_labels(text_label_ids_to_drag);
  });

  behavior.on('end', function () {
    set_dragging(false);

    if (node_ids_to_drag === null) {
      // Drag end can be called when drag has not been called. In this, case, do
      // nothing.
      total_displacement = null;
      node_ids_to_drag = null;
      text_label_ids_to_drag = null;
      reaction_ids = null;
      the_timeout = null;
      return;
    }
    // look for mets to combine
    var node_to_combine_array = [];
    map.sel.selectAll('.node-to-combine').each(function (d) {
      node_to_combine_array.push(d.node_id);
    });
    if (node_to_combine_array.length === 1) {
      // If a node is ready for it, combine nodes
      var fixed_node_id = node_to_combine_array[0],
          dragged_node_id = this.parentNode.__data__.node_id,
          saved_dragged_node = utils.clone(map.nodes[dragged_node_id]),
          segment_objs_moved_to_combine = combine_nodes_and_draw(fixed_node_id, dragged_node_id);
      undo_stack.push(function () {
        // undo
        // put the old node back
        map.nodes[dragged_node_id] = saved_dragged_node;
        var fixed_node = map.nodes[fixed_node_id],
            updated_reactions = [];
        segment_objs_moved_to_combine.forEach(function (segment_obj) {
          var segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id];
          if (segment.from_node_id == fixed_node_id) {
            segment.from_node_id = dragged_node_id;
          } else if (segment.to_node_id == fixed_node_id) {
            segment.to_node_id = dragged_node_id;
          } else {
            console.error('Segment does not connect to fixed node');
          }
          // removed this segment_obj from the fixed node
          fixed_node.connected_segments = fixed_node.connected_segments.filter(function (x) {
            return !(x.reaction_id == segment_obj.reaction_id && x.segment_id == segment_obj.segment_id);
          });
          if (updated_reactions.indexOf(segment_obj.reaction_id) == -1) updated_reactions.push(segment_obj.reaction_id);
        });
        map.draw_these_nodes([dragged_node_id]);
        map.draw_these_reactions(updated_reactions);
      }, function () {
        // redo
        combine_nodes_and_draw(fixed_node_id, dragged_node_id);
      });
    } else {
      // otherwise, drag node

      // add to undo/redo stack
      // remember the displacement, dragged nodes, and reactions
      var saved_displacement = utils.clone(total_displacement),

      // BUG TODO this variable disappears!
      // Happens sometimes when you drag a node, then delete it, then undo twice
      saved_node_ids = utils.clone(node_ids_to_drag),
          saved_text_label_ids = utils.clone(text_label_ids_to_drag),
          saved_reaction_ids = utils.clone(reaction_ids);
      undo_stack.push(function () {
        // undo
        saved_node_ids.forEach(function (node_id) {
          var node = map.nodes[node_id];
          build.move_node_and_dependents(node, node_id, map.reactions, map.beziers, utils.c_times_scalar(saved_displacement, -1));
        });
        saved_text_label_ids.forEach(function (text_label_id) {
          move_label(text_label_id, utils.c_times_scalar(saved_displacement, -1));
        });
        map.draw_these_nodes(saved_node_ids);
        map.draw_these_reactions(saved_reaction_ids);
        map.draw_these_text_labels(saved_text_label_ids);
      }, function () {
        // redo
        saved_node_ids.forEach(function (node_id) {
          var node = map.nodes[node_id];
          build.move_node_and_dependents(node, node_id, map.reactions, map.beziers, saved_displacement);
        });
        saved_text_label_ids.forEach(function (text_label_id) {
          move_label(text_label_id, saved_displacement);
        });
        map.draw_these_nodes(saved_node_ids);
        map.draw_these_reactions(saved_reaction_ids);
        map.draw_these_text_labels(saved_text_label_ids);
      });
    }

    // stop combining metabolites
    map.sel.selectAll('.metabolite-circle').on('mouseover.combine', null).on('mouseout.combine', null);

    // clear the timeout
    clearTimeout(the_timeout);

    // clear the shared variables
    total_displacement = null;
    node_ids_to_drag = null;
    text_label_ids_to_drag = null;
    reaction_ids = null;
    the_timeout = null;
  });

  return behavior;

  // definitions
  function combine_nodes_and_draw(fixed_node_id, dragged_node_id) {
    var dragged_node = map.nodes[dragged_node_id];
    var fixed_node = map.nodes[fixed_node_id];
    var updated_segment_objs = [];
    dragged_node.connected_segments.forEach(function (segment_obj) {
      // change the segments to reflect
      var segment;
      try {
        segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id];
        if (segment === undefined) throw new Error('undefined segment');
      } catch (e) {
        console.warn('Could not find connected segment ' + segment_obj.segment_id);
        return;
      }
      if (segment.from_node_id == dragged_node_id) segment.from_node_id = fixed_node_id;else if (segment.to_node_id == dragged_node_id) segment.to_node_id = fixed_node_id;else {
        console.error('Segment does not connect to dragged node');
        return;
      }
      // moved segment_obj to fixed_node
      fixed_node.connected_segments.push(segment_obj);
      updated_segment_objs.push(utils.clone(segment_obj));
      return;
    });
    // delete the old node
    map.delete_node_data([dragged_node_id]);
    // turn off the class
    map.sel.selectAll('.node-to-combine').classed('node-to-combine', false);
    // draw
    map.draw_everything();
    // return for undo
    return updated_segment_objs;
  }
}

function _get_bezier_drag(map) {
  var move_bezier = function move_bezier(reaction_id, segment_id, bez, bezier_id, displacement) {
    var segment = map.reactions[reaction_id].segments[segment_id];
    segment[bez] = utils.c_plus_c(segment[bez], displacement);
    map.beziers[bezier_id].x = segment[bez].x;
    map.beziers[bezier_id].y = segment[bez].y;
  };
  var start_fn = function start_fn(d) {
    d.dragging = true;
  };
  var drag_fn = function drag_fn(d, displacement, total_displacement) {
    // draw
    move_bezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id, displacement);
    map.draw_these_reactions([d.reaction_id], false);
    map.draw_these_beziers([d.bezier_id]);
  };
  var end_fn = function end_fn(d) {
    d.dragging = false;
  };
  var undo_fn = function undo_fn(d, displacement) {
    move_bezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id, utils.c_times_scalar(displacement, -1));
    map.draw_these_reactions([d.reaction_id], false);
    map.draw_these_beziers([d.bezier_id]);
  };
  var redo_fn = function redo_fn(d, displacement) {
    move_bezier(d.reaction_id, d.segment_id, d.bezier, d.bezier_id, displacement);
    map.draw_these_reactions([d.reaction_id], false);
    map.draw_these_beziers([d.bezier_id]);
  };
  return this._get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn, this.map.sel);
}

function _get_reaction_label_drag(map) {
  var move_label = function move_label(reaction_id, displacement) {
    var reaction = map.reactions[reaction_id];
    reaction.label_x = reaction.label_x + displacement.x;
    reaction.label_y = reaction.label_y + displacement.y;
  };
  var start_fn = function start_fn(d) {
    // hide tooltips when drag starts
    map.callback_manager.run('hide_tooltip');
  };
  var drag_fn = function drag_fn(d, displacement, total_displacement) {
    // draw
    move_label(d.reaction_id, displacement);
    map.draw_these_reactions([d.reaction_id]);
  };
  var end_fn = function end_fn(d) {};
  var undo_fn = function undo_fn(d, displacement) {
    move_label(d.reaction_id, utils.c_times_scalar(displacement, -1));
    map.draw_these_reactions([d.reaction_id]);
  };
  var redo_fn = function redo_fn(d, displacement) {
    move_label(d.reaction_id, displacement);
    map.draw_these_reactions([d.reaction_id]);
  };
  return this._get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn, this.map.sel);
}

function _get_node_label_drag(map) {
  var move_label = function move_label(node_id, displacement) {
    var node = map.nodes[node_id];
    node.label_x = node.label_x + displacement.x;
    node.label_y = node.label_y + displacement.y;
  };
  var start_fn = function start_fn(d) {
    // hide tooltips when drag starts
    map.callback_manager.run('hide_tooltip');
  };
  var drag_fn = function drag_fn(d, displacement, total_displacement) {
    // draw
    move_label(d.node_id, displacement);
    map.draw_these_nodes([d.node_id]);
  };
  var end_fn = function end_fn(d) {};
  var undo_fn = function undo_fn(d, displacement) {
    move_label(d.node_id, utils.c_times_scalar(displacement, -1));
    map.draw_these_nodes([d.node_id]);
  };
  var redo_fn = function redo_fn(d, displacement) {
    move_label(d.node_id, displacement);
    map.draw_these_nodes([d.node_id]);
  };
  return this._get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn, this.map.sel);
}

/**
 * Make a generic drag behavior, with undo/redo.
 *
 * start_fn: function (d) Called at drag start.
 *
 * drag_fn: function (d, displacement, total_displacement) Called during drag.
 *
 * end_fn
 *
 * undo_fn
 *
 * redo_fn
 *
 * relative_to_selection: a d3 selection that the locations are calculated
 * against.
 *
 */
function _get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn, relative_to_selection) {
  // define some variables
  var behavior = d3_drag();
  var total_displacement;
  var undo_stack = this.undo_stack;
  var rel = relative_to_selection.node();

  behavior.on('start', function (d) {
    this.dragging = true;

    // silence other listeners
    d3_selection.event.sourceEvent.stopPropagation();
    total_displacement = { x: 0, y: 0 };
    start_fn(d);
  }.bind(this));

  behavior.on('drag', function (d) {
    // update data
    var displacement = {
      x: d3_selection.event.dx,
      y: d3_selection.event.dy
    };
    var location = {
      x: d3_mouse(rel)[0],
      y: d3_mouse(rel)[1]

      // remember the displacement
    };total_displacement = utils.c_plus_c(total_displacement, displacement);
    drag_fn(d, displacement, total_displacement, location);
  }.bind(this));

  behavior.on('end', function (d) {
    this.dragging = false;

    // add to undo/redo stack
    // remember the displacement, dragged nodes, and reactions
    var saved_d = utils.clone(d);
    var saved_displacement = utils.clone(total_displacement); // BUG TODO this variable disappears!
    var saved_location = {
      x: d3_mouse(rel)[0],
      y: d3_mouse(rel)[1]
    };

    undo_stack.push(function () {
      // undo
      undo_fn(saved_d, saved_displacement, saved_location);
    }, function () {
      // redo
      redo_fn(saved_d, saved_displacement, saved_location);
    });
    end_fn(d);
  }.bind(this));

  return behavior;
}

/** Make a generic drag behavior, with undo/redo. Supplies angles in place of
 * displacements.
 *
 * start_fn: function (d) Called at drag start.
 *
 * drag_fn: function (d, displacement, total_displacement) Called during drag.
 *
 * end_fn:
 *
 * undo_fn:
 *
 * redo_fn:
 *
 * get_center:
 *
 * relative_to_selection: a d3 selection that the locations are calculated
 * against.
 *
 */
function _get_generic_angular_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn, get_center, relative_to_selection) {

  // define some variables
  var behavior = d3_drag();
  var total_angle;
  var undo_stack = this.undo_stack;
  var rel = relative_to_selection.node();

  behavior.on('start', function (d) {
    this.dragging = true;

    // silence other listeners
    d3_selection.event.sourceEvent.stopPropagation();
    total_angle = 0;
    start_fn(d);
  }.bind(this));

  behavior.on('drag', function (d) {
    // update data
    var displacement = {
      x: d3_selection.event.dx,
      y: d3_selection.event.dy
    };
    var location = {
      x: d3_mouse(rel)[0],
      y: d3_mouse(rel)[1]
    };
    var center = get_center();
    var angle = utils.angle_for_event(displacement, location, center);
    // remember the displacement
    total_angle = total_angle + angle;
    drag_fn(d, angle, total_angle, center);
  }.bind(this));

  behavior.on('end', function (d) {
    this.dragging = false;

    // add to undo/redo stack
    // remember the displacement, dragged nodes, and reactions
    var saved_d = utils.clone(d);
    var saved_angle = total_angle;
    var saved_center = utils.clone(get_center());

    undo_stack.push(function () {
      // undo
      undo_fn(saved_d, saved_angle, saved_center);
    }, function () {
      // redo
      redo_fn(saved_d, saved_angle, saved_center);
    });
    end_fn(d);
  }.bind(this));

  return behavior;
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Scale */

var utils = __webpack_require__(0);
var d3_scaleLinear = __webpack_require__(11).scaleLinear;
var d3_format = __webpack_require__(6).format;

var Scale = utils.make_class();
Scale.prototype = {
  init: init,
  connect_to_settings: connect_to_settings
};
module.exports = Scale;

function init() {
  this.x = d3_scaleLinear();
  this.y = d3_scaleLinear();
  this.x_size = d3_scaleLinear();
  this.y_size = d3_scaleLinear();
  this.size = d3_scaleLinear();
  this.reaction_color = d3_scaleLinear().clamp(true);
  this.reaction_size = d3_scaleLinear().clamp(true);
  this.metabolite_color = d3_scaleLinear().clamp(true);
  this.metabolite_size = d3_scaleLinear().clamp(true);
  this.scale_path = function (path) {
    var x_fn = this.x,
        y_fn = this.y;
    // TODO: scale arrow width
    var str = d3_format(".2f"),
        path = path.replace(/(M|L)([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p0, p1, p2) {
      return p0 + [str(x_fn(parseFloat(p1))), str(y_fn(parseFloat(p2)))].join(', ');
    }),
        reg = /C([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)/g;
    path = path.replace(reg, function (match, p1, p2, p3, p4, p5, p6) {
      return 'C' + str(x_fn(parseFloat(p1))) + ',' + str(y_fn(parseFloat(p2))) + ' ' + str(x_fn(parseFloat(p3))) + ',' + str(y_fn(parseFloat(p4))) + ' ' + [str(x_fn(parseFloat(p5))) + ',' + str(y_fn(parseFloat(p6)))];
    });
    return path;
  }.bind(this);
  this.scale_decimals = function (path, scale_fn, precision) {
    var str = d3_format("." + String(precision) + "f");
    path = path.replace(/([0-9.]+)/g, function (match, p1) {
      return str(scale_fn(parseFloat(p1)));
    });
    return path;
  };
}

function connect_to_settings(settings, map, get_data_statistics) {
  // domains
  var update_reaction = function (s) {
    var out = sort_scale(s, get_data_statistics()['reaction']);
    this.reaction_color.domain(out.domain);
    this.reaction_size.domain(out.domain);
    this.reaction_color.range(out.color_range);
    this.reaction_size.range(out.size_range);
  }.bind(this);
  var update_metabolite = function (s) {
    var out = sort_scale(s, get_data_statistics()['metabolite']);
    this.metabolite_color.domain(out.domain);
    this.metabolite_size.domain(out.domain);
    this.metabolite_color.range(out.color_range);
    this.metabolite_size.range(out.size_range);
  }.bind(this);

  // scale changes
  settings.streams['reaction_scale'].onValue(update_reaction);
  settings.streams['metabolite_scale'].onValue(update_metabolite);
  // stats changes
  map.callback_manager.set('calc_data_stats__reaction', function (changed) {
    if (changed) update_reaction(settings.get_option('reaction_scale'));
  });
  map.callback_manager.set('calc_data_stats__metabolite', function (changed) {
    if (changed) update_metabolite(settings.get_option('metabolite_scale'));
  });

  // definitions
  function sort_scale(scale, stats) {
    var sorted = scale.map(function (x) {
      var v;
      if (x.type in stats) v = stats[x.type];else if (x.type == 'value') v = x.value;else throw new Error('Bad domain type ' + x.type);
      return { v: v,
        color: x.color,
        size: x.size };
    }).sort(function (a, b) {
      return a.v - b.v;
    });
    return { domain: sorted.map(function (x) {
        return x.v;
      }),
      color_range: sorted.map(function (x) {
        return x.color;
      }),
      size_range: sorted.map(function (x) {
        return x.size;
      }) };
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** UndoStack. A constructor that can be used to store undo info. */

var utils = __webpack_require__(0);

var UndoStack = utils.make_class();
UndoStack.prototype = {
    init: init,
    push: push,
    undo: undo,
    redo: redo
};
module.exports = UndoStack;

// definitions
function init() {
    var stack_size = 40;
    this.stack = Array(stack_size);
    this.current = -1;
    this.oldest = -1;
    this.newest = -1;
    this.end_of_stack = true;
    this.top_of_stack = true;
}

function _incr(a, l) {
    return a + 1 > l - 1 ? 0 : a + 1;
}

function _decr(a, l) {
    return a - 1 < 0 ? l - 1 : a - 1;
}

function push(undo_fn, redo_fn) {
    this.current = _incr(this.current, this.stack.length);
    // change the oldest
    if (this.end_of_stack) this.oldest = this.current;else if (this.oldest == this.current) this.oldest = _incr(this.oldest, this.stack.length);
    this.stack[this.current] = { undo: undo_fn, redo: redo_fn };
    this.newest = this.current;

    // top of the stack
    this.top_of_stack = true;
    this.end_of_stack = false;
}

function undo() {
    // check that we haven't reached the end
    if (this.end_of_stack) return console.warn('End of stack.');
    // run the lastest stack function
    this.stack[this.current].undo();
    if (this.current == this.oldest) {
        // if the next index is less than the oldest, then the stack is dead
        this.end_of_stack = true;
    } else {
        // reference the next fn
        this.current = _decr(this.current, this.stack.length);
    }

    // not at the top of the stack
    this.top_of_stack = false;
}

function redo() {
    // check that we haven't reached the end
    if (this.top_of_stack) return console.warn('Top of stack.');

    if (!this.end_of_stack) this.current = _incr(this.current, this.stack.length);
    this.stack[this.current].redo();

    // if at top of stack
    if (this.current == this.newest) this.top_of_stack = true;

    // not at the end of the stack
    this.end_of_stack = false;
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** KeyManager

 Manage key listeners and events.

 Arguments
 ---------

 assigned_keys (default: {}): An object defining keys to bind.

 input_list (default: []): A list of inputs that will override keyboard
 shortcuts when in focus.

 selection (default: global): A node to bind the events to.

 ctrl_equals_cmd (default: false): If true, then control and command have the
 same effect.

 */

var utils = __webpack_require__(0);
var Mousetrap = __webpack_require__(38);
var _ = __webpack_require__(2);

var KeyManager = utils.make_class();
// instance methods
KeyManager.prototype = {
    init: init,
    update: update,
    toggle: toggle,
    add_escape_listener: add_escape_listener,
    add_enter_listener: add_enter_listener,
    add_key_listener: add_key_listener
};
module.exports = KeyManager;

// instance methods
function init(assigned_keys, input_list, selection, ctrl_equals_cmd) {
    // default Arguments
    this.assigned_keys = assigned_keys || {};
    this.input_list = input_list || [];
    this.mousetrap = selection ? new Mousetrap(selection) : new Mousetrap();
    this.ctrl_equals_cmd = !_.isBoolean(ctrl_equals_cmd) ? false : ctrl_equals_cmd;

    // Fix mousetrap behavior; by default, it ignore shortcuts when inputs are
    // in focus.
    // TODO NOT WORKING https://craig.is/killing/mice
    // consider swithching to https://github.com/PolicyStat/combokeys
    this.mousetrap.stopCallback = function () {
        return false;
    };

    this.enabled = true;
    this.update();
}

function _add_cmd(key, ctrl_equals_cmd) {
    /** If ctrl_equals_cmd is true and key has ctrl+ in it, return an array with
     ctrl+ and meta+ variations.
      */
    if (!ctrl_equals_cmd) return key;
    var key_ar = _.isArray(key) ? key : [key];
    var new_ar = key_ar.reduce(function (c, k) {
        var n = k.replace('ctrl+', 'meta+');
        if (n !== k) c.push(n);
        return c;
    }, key_ar.slice());
    return new_ar.length === key_ar.length ? key : new_ar;
}

/**
 * Updated key bindings if attributes have changed.
 */
function update() {
    this.mousetrap.reset();
    if (!this.enabled) return;

    // loop through keys
    for (var key_id in this.assigned_keys) {
        var assigned_key = this.assigned_keys[key_id];

        // OK if this is missing
        if (!assigned_key.key) continue;

        var key_to_bind = _add_cmd(assigned_key.key, this.ctrl_equals_cmd);
        // remember the input_list
        assigned_key.input_list = this.input_list;
        this.mousetrap.bind(key_to_bind, function (e) {
            // check inputs
            var input_blocking = false;
            if (this.ignore_with_input) {
                for (var i = 0, l = this.input_list.length; i < l; i++) {
                    if (this.input_list[i].is_visible()) {
                        input_blocking = true;
                        break;
                    }
                }
            }

            if (!input_blocking) {
                if (this.fn) this.fn.call(this.target);else console.warn('No function for key: ' + this.key);
                e.preventDefault();
            }
        }.bind(assigned_key), 'keydown');
    }
}

function toggle(on_off) {
    /** Turn the key manager on or off.
      */
    if (_.isUndefined(on_off)) on_off = !this.enabled;
    this.enabled = on_off;
    this.update();
}

function add_enter_listener(callback, one_time) {
    /** Call the callback when the enter key is pressed, then
     unregisters the listener.
      */
    return this.add_key_listener('enter', callback, one_time);
}

function add_escape_listener(callback, one_time) {
    /** Call the callback when the escape key is pressed, then
     unregisters the listener.
      */
    return this.add_key_listener('escape', callback, one_time);
}

function add_key_listener(key_name, callback, one_time) {
    /** Call the callback when the key is pressed, then unregisters the
     listener. Returns a function that will unbind the event.
      callback: The callback function with no arguments.
      key_name: A key name, or list of key names, as defined by the mousetrap
     library: https://craig.is/killing/mice
      one_time: If True, then cancel the listener after the first execution.
      */

    if (_.isUndefined(one_time)) one_time = false;

    // unbind function ready to go
    var unbind = this.mousetrap.unbind.bind(this.mousetrap, key_name);

    this.mousetrap.bind(_add_cmd(key_name, this.ctrl_equals_cmd), function (e) {
        e.preventDefault();
        callback();
        if (one_time) unbind();
    });

    return unbind;
}

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("mousetrap");

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Canvas. Defines a canvas that accepts drag/zoom events and can be resized.
 * Canvas(selection, x, y, width, height)
 * Adapted from http://bl.ocks.org/mccannf/1629464.
 */

var utils = __webpack_require__(0);
var CallbackManager = __webpack_require__(3);
var d3_drag = __webpack_require__(5).drag;
var d3_selection = __webpack_require__(1);
var _ = __webpack_require__(2);

var Canvas = utils.make_class();
Canvas.prototype = {
  init: init,
  toggle_resize: toggle_resize,
  setup: setup,
  size_and_location: size_and_location
};
module.exports = Canvas;

function init(selection, size_and_location) {
  this.selection = selection;
  this.x = size_and_location.x;
  this.y = size_and_location.y;
  this.width = size_and_location.width;
  this.height = size_and_location.height;

  // enable by default
  this.resize_enabled = true;

  // set up the callbacks
  this.callback_manager = new CallbackManager();

  this.setup();
}

/**
 * Turn the resize on or off
 */
function toggle_resize(on_off) {
  if (_.isUndefined(on_off)) on_off = !this.resize_enabled;

  if (on_off) {
    this.selection.selectAll('.drag-rect').style('pointer-events', 'auto');
  } else {
    this.selection.selectAll('.drag-rect').style('pointer-events', 'none');
  }
}

function setup() {
  var self = this;
  var extent = { x: this.width, y: this.height };
  var dragbar_width = 100;
  var mouse_node_mult = 10;
  var new_sel = this.selection.append('g').classed('canvas-group', true).data([{ x: this.x, y: this.y }]);

  var mouse_node = new_sel.append('rect').attr('id', 'mouse-node').attr('width', this.width * mouse_node_mult).attr('height', this.height * mouse_node_mult).attr('transform', 'translate(' + [self.x - this.width * mouse_node_mult / 2, self.y - this.height * mouse_node_mult / 2] + ')').attr('pointer-events', 'all');
  this.mouse_node = mouse_node;

  var rect = new_sel.append('rect').attr('id', 'canvas').attr('width', this.width).attr('height', this.height).attr('transform', 'translate(' + [self.x, self.y] + ')');

  var drag_right = d3_drag()
  // TODO do we need these? in d3 v4, origin is now subject
  // .origin(Object)
  .on('start', stop_propagation).on('drag', rdragresize),
      drag_left = d3_drag()
  // .origin(Object)
  .on('start', stop_propagation).on('drag', ldragresize),
      drag_top = d3_drag()
  // .origin(Object)
  .on('start', stop_propagation).on('drag', tdragresize),
      drag_bottom = d3_drag()
  // .origin(Object)
  .on('start', stop_propagation).on('drag', bdragresize);

  var left = new_sel.append('rect').classed('drag-rect', true).attr('transform', function (d) {
    return 'translate(' + [d.x - dragbar_width / 2, d.y + dragbar_width / 2] + ')';
  }).attr('height', this.height - dragbar_width).attr('id', 'dragleft').attr('width', dragbar_width).attr('cursor', 'ew-resize').classed('resize-rect', true).call(drag_left);

  var right = new_sel.append('rect').classed('drag-rect', true).attr('transform', function (d) {
    return 'translate(' + [d.x + self.width - dragbar_width / 2, d.y + dragbar_width / 2] + ')';
  }).attr('id', 'dragright').attr('height', this.height - dragbar_width).attr('width', dragbar_width).attr('cursor', 'ew-resize').classed('resize-rect', true).call(drag_right);

  var top = new_sel.append('rect').classed('drag-rect', true).attr('transform', function (d) {
    return 'translate(' + [d.x + dragbar_width / 2, d.y - dragbar_width / 2] + ')';
  }).attr('height', dragbar_width).attr('id', 'dragtop').attr('width', this.width - dragbar_width).attr('cursor', 'ns-resize').classed('resize-rect', true).call(drag_top);

  var bottom = new_sel.append('rect').classed('drag-rect', true).attr('transform', function (d) {
    return 'translate(' + [d.x + dragbar_width / 2, d.y + self.height - dragbar_width / 2] + ')';
  }).attr('id', 'dragbottom').attr('height', dragbar_width).attr('width', this.width - dragbar_width).attr('cursor', 'ns-resize').classed('resize-rect', true).call(drag_bottom);

  // definitions
  function stop_propagation() {
    d3_selection.event.sourceEvent.stopPropagation();
  }

  function transform_string(x, y, current_transform) {
    var tr = utils.d3_transform_catch(current_transform),
        translate = tr.translate;
    if (x !== null) translate[0] = x;
    if (y !== null) translate[1] = y;
    return 'translate(' + translate + ')';
  }

  function ldragresize(d) {
    var oldx = d.x;
    d.x = Math.min(d.x + self.width - dragbar_width / 2, d3_selection.event.x);
    self.x = d.x;
    self.width = self.width + (oldx - d.x);
    left.attr('transform', function (d) {
      return transform_string(d.x - dragbar_width / 2, null, left.attr('transform'));
    });
    mouse_node.attr('transform', function (d) {
      return transform_string(d.x, null, mouse_node.attr('transform'));
    }).attr('width', self.width * mouse_node_mult);
    rect.attr('transform', function (d) {
      return transform_string(d.x, null, rect.attr('transform'));
    }).attr('width', self.width);
    top.attr('transform', function (d) {
      return transform_string(d.x + dragbar_width / 2, null, top.attr('transform'));
    }).attr('width', self.width - dragbar_width);
    bottom.attr('transform', function (d) {
      return transform_string(d.x + dragbar_width / 2, null, bottom.attr('transform'));
    }).attr('width', self.width - dragbar_width);

    self.callback_manager.run('resize');
  }

  function rdragresize(d) {
    d3_selection.event.sourceEvent.stopPropagation();
    var dragx = Math.max(d.x + dragbar_width / 2, d.x + self.width + d3_selection.event.dx);
    //recalculate width
    self.width = dragx - d.x;
    //move the right drag handle
    right.attr('transform', function (d) {
      return transform_string(dragx - dragbar_width / 2, null, right.attr('transform'));
    });
    //resize the drag rectangle
    //as we are only resizing from the right, the x coordinate does not need to change
    mouse_node.attr('width', self.width * mouse_node_mult);
    rect.attr('width', self.width);
    top.attr('width', self.width - dragbar_width);
    bottom.attr('width', self.width - dragbar_width);

    self.callback_manager.run('resize');
  }

  function tdragresize(d) {
    d3_selection.event.sourceEvent.stopPropagation();
    var oldy = d.y;
    d.y = Math.min(d.y + self.height - dragbar_width / 2, d3_selection.event.y);
    self.y = d.y;
    self.height = self.height + (oldy - d.y);
    top.attr('transform', function (d) {
      return transform_string(null, d.y - dragbar_width / 2, top.attr('transform'));
    });
    mouse_node.attr('transform', function (d) {
      return transform_string(null, d.y, mouse_node.attr('transform'));
    }).attr('width', self.height * mouse_node_mult);
    rect.attr('transform', function (d) {
      return transform_string(null, d.y, rect.attr('transform'));
    }).attr('height', self.height);
    left.attr('transform', function (d) {
      return transform_string(null, d.y + dragbar_width / 2, left.attr('transform'));
    }).attr('height', self.height - dragbar_width);
    right.attr('transform', function (d) {
      return transform_string(null, d.y + dragbar_width / 2, right.attr('transform'));
    }).attr('height', self.height - dragbar_width);

    self.callback_manager.run('resize');
  }

  function bdragresize(d) {
    d3_selection.event.sourceEvent.stopPropagation();
    var dragy = Math.max(d.y + dragbar_width / 2, d.y + self.height + d3_selection.event.dy);
    //recalculate width
    self.height = dragy - d.y;
    //move the right drag handle
    bottom.attr('transform', function (d) {
      return transform_string(null, dragy - dragbar_width / 2, bottom.attr('transform'));
    });
    //resize the drag rectangle
    //as we are only resizing from the right, the x coordinate does not need to change
    mouse_node.attr('height', self.height * mouse_node_mult);
    rect.attr('height', self.height);
    left.attr('height', self.height - dragbar_width);
    right.attr('height', self.height - dragbar_width);

    self.callback_manager.run('resize');
  }
}

function size_and_location() {
  return {
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height
  };
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** SearchIndex. Define an index for searching for reaction and metabolites in
 the map.

 The index is stored in SearchIndex.index, an object of id/record pairs.

 */

var utils = __webpack_require__(0);

var SearchIndex = utils.make_class();
SearchIndex.prototype = {
    init: init,
    insert: insert,
    remove: remove,
    find: find
};
module.exports = SearchIndex;

function init() {
    this.index = {};
}

function insert(id, record, overwrite, check_record) {
    /** Insert a record into the index.
      id: A unique string id.
      record: Records have the form:
      { 'name': '',
     'data': {} }
      Search is performed on substrings of the name.
      overwrite: (Default false) For faster performance, make overwrite true,
     and records will be inserted without checking for an existing record.
      check_record: (Default false) For faster performance, make check_record
     false. If true, records will be checked to make sure they have name and
     data attributes.
      Returns undefined.
      */
    if (!overwrite && id in this.index) throw new Error("id is already in the index");
    if (check_record && !('name' in record && 'data' in record)) throw new Error("malformed record");
    this.index[id] = record;
}

function remove(record_id) {
    /** Remove the matching record.
      Returns true is a record is found, or false if no match is found.
      */
    if (record_id in this.index) {
        delete this.index[record_id];
        return true;
    } else {
        return false;
    }
}

function find(substring) {
    /** Find a record that matches the substring.
      Returns an array of data from matching records.
      */

    var re = RegExp(substring, "i"),
        // ignore case
    matches = [];
    for (var id in this.index) {
        var record = this.index[id];
        if (re.exec(record.name)) matches.push(record.data);
    }
    return matches;
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Define a brush to select elements in a map.
 * @param {D3 Selection} selection - A d3 selection to place the brush in.
 * @param {Boolean} is_enabled - Whether to turn the brush on.
 * @param {escher.Map} map - The map where the brush will be active.
 * @param {String} insert_after - A d3 selector string to choose the svg element
 *                                that the brush will be inserted after. Often a
 *                                canvas element (e.g. '.canvas-group').
 */

var utils = __webpack_require__(0);
var d3_brush = __webpack_require__(15).brush;
var d3_brushSelection = __webpack_require__(15).brushSelection;
var d3_scaleIdentity = __webpack_require__(11).scaleIdentity;
var d3_selection = __webpack_require__(1);
var d3_select = __webpack_require__(1).select;

var Brush = utils.make_class();
Brush.prototype = {
  init: init,
  toggle: toggle,
  setup_selection_brush: setup_selection_brush
};
module.exports = Brush;

/**
 * Initialize the brush.
 * @param {D3 Selection} selection - The selection for the brush.
 * @param {Boolean} is_enabled - Whether to enable right away.
 * @param {escher.Map} map - The Escher Map object.
 * @param {Node} insert_after - A node within selection to insert after.
 */
function init(selection, is_enabled, map, insert_after) {
  this.brush_sel = selection.append('g').attr('id', 'brush-container');
  var node = this.brush_sel.node();
  var insert_before_node = selection.select(insert_after).node().nextSibling;
  if (node !== insert_before_node) {
    node.parentNode.insertBefore(node, insert_before_node);
  }
  this.enabled = is_enabled;
  this.map = map;
}

/**
 * Returns a boolean for the on/off status of the brush
 * @return {Boolean}
 */
function brush_is_enabled() {
  return this.map.sel.select('.brush').empty();
}

/**
 * Turn the brush on or off
 * @param {Boolean} on_off
 */
function toggle(on_off) {
  if (on_off === undefined) {
    on_off = !this.enabled;
  }
  if (on_off) {
    this.setup_selection_brush();
  } else {
    this.brush_sel.selectAll('*').remove();
  }
}

/**
 * Turn off the mouse crosshair
 */
function turn_off_crosshair(sel) {
  sel.selectAll('rect').attr('cursor', null);
}

function setup_selection_brush() {
  var map = this.map;
  var selection = this.brush_sel;
  var selectable_selection = map.sel.selectAll('#nodes,#text-labels');
  var size_and_location = map.canvas.size_and_location();
  var width = size_and_location.width;
  var height = size_and_location.height;
  var x = size_and_location.x;
  var y = size_and_location.y;

  // Clear existing brush
  selection.selectAll('*').remove();

  // Set a flag so we know that the brush is being cleared at the end of a
  // successful brush
  var clearing_flag = false;

  var brush = d3_brush().extent([[x, y], [x + width, y + height]]).on('start', function () {
    turn_off_crosshair(selection);
    // unhide secondary metabolites if they are hidden
    if (map.settings.get_option('hide_secondary_metabolites')) {
      map.settings.set_conditional('hide_secondary_metabolites', false);
      map.draw_everything();
      map.set_status('Showing secondary metabolites. You can hide them ' + 'again in Settings.', 2000);
    }
  }).on('brush', function () {
    var shift_key_on = d3_selection.event.sourceEvent.shiftKey;
    var rect = d3_brushSelection(this);
    // Check for no selection (e.g. after clearing brush)
    if (rect !== null) {
      // When shift is pressed, ignore the currently selected nodes.
      // Otherwise, brush all nodes.
      var selection = shift_key_on ? selectable_selection.selectAll('.node:not(.selected),.text-label:not(.selected)') : selectable_selection.selectAll('.node,.text-label');
      selection.classed('selected', function (d) {
        var sx = d.x;
        var sy = d.y;
        return rect[0][0] <= sx && sx < rect[1][0] && rect[0][1] <= sy && sy < rect[1][1];
      });
    }
  }).on('end', function () {
    turn_off_crosshair(selection);
    // Clear brush
    var rect = d3_brushSelection(this);
    if (rect === null) {
      if (clearing_flag) {
        clearing_flag = false;
      } else {
        // Empty selection, deselect all
        map.select_none();
      }
    } else {
      // Not empty, then clear the box
      clearing_flag = true;
      selection.call(brush.move, null);
    }
  });

  selection
  // Initialize brush
  .call(brush);

  // Turn off the pan grab icons
  turn_off_crosshair(selection);
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** ui */

var utils = __webpack_require__(0);
var data_styles = __webpack_require__(4);

module.exports = {
    individual_button: individual_button,
    radio_button_group: radio_button_group,
    button_group: button_group,
    dropdown_menu: dropdown_menu,
    set_json_input_button: set_json_input_button,
    set_json_or_csv_input_button: set_json_or_csv_input_button
};

function _button_with_sel(b, button) {
    var ignore_bootstrap = button.ignore_bootstrap || false;
    b.attr('class', 'btn btn-default simple-button');
    // icon
    var c = b.append('span');
    // text / bootstrap fallback
    var t = c.append('span');
    if ('id' in button) b.attr('id', button.id);
    if ('text' in button) t.text(button.text);
    if ('icon' in button && !ignore_bootstrap) c.classed(button.icon, true);
    if (!ignore_bootstrap) t.attr('class', 'hidden');
    if ('key' in button) set_button(b, button.key);

    // tooltip
    if ('key_text' in button && 'tooltip' in button && button.key_text !== null) b.attr('title', button.tooltip + button.key_text);else if ('tooltip' in button) b.attr('title', button.tooltip);
}

function individual_button(s, button) {
    var b = s.append('button');
    _button_with_sel(b, button);
}

function radio_button_group(s) {
    var s2 = s.append('li').attr('class', 'btn-group-vertical').attr('data-toggle', 'buttons');
    return { button: function button(_button) {
            var ignore_bootstrap = _button.ignore_bootstrap || false;
            var b = s2.append('label');
            b.append('input').attr('type', 'radio');
            _button_with_sel(b, _button);
            return this;
        } };
}

function button_group(s) {
    var s2 = s.attr('class', 'btn-group-vertical');
    return { button: function button(_button2) {
            var b = s2.append("button");
            _button_with_sel(b, _button2);
            return this;
        } };
}

function dropdown_menu(s, name, pull_right) {
    if (pull_right === undefined) pull_right = false;
    var s2 = s.append('li').attr('class', 'dropdown');
    s2.append('button').text(name + " ").attr('class', 'btn btn-link btn-sm dropdown-button').attr('data-toggle', 'dropdown').append('b').attr('class', 'caret');
    var ul = s2.append('ul').attr('class', 'dropdown-menu').classed('pull-right', pull_right).attr('role', 'menu').attr('aria-labelledby', 'dLabel');
    return {
        dropdown: s2,
        button: function button(_button3) {
            var li = ul.append("li").attr('role', 'presentation').datum(_button3),
                link = li.append("a").attr('href', '#'),
                icon = link.append('span').attr('class', 'dropdown-button-icon'),
                text = link.append('span').attr('class', 'dropdown-button-text');
            if ('id' in _button3) li.attr('id', _button3.id);

            // text
            if ('key_text' in _button3 && 'text' in _button3 && _button3.key_text !== null) text.text(" " + _button3.text + _button3.key_text);else if ('text' in _button3) text.text(" " + _button3.text);

            if ('icon' in _button3) icon.classed(_button3.icon, true);

            if ('key' in _button3) {
                set_button(link, _button3.key);
            } else if ('input' in _button3) {
                var input = _button3.input,
                    out = input.accept_csv ? set_json_or_csv_input_button(link, li, input.pre_fn, input.fn, input.failure_fn) : set_json_input_button(link, li, input.pre_fn, input.fn, input.failure_fn);
                // assign a function to the key
                if ('assign' in input && 'key' in input) input.assign[input.key] = out;
            }
            return this;
        },
        divider: function divider() {
            ul.append("li").attr('role', 'presentation').attr('class', 'divider');
            return this;
        }
    };
}

function set_button(b, key) {
    b.on("click", function () {
        key.fn.call(key.target);
    });
}

function set_json_input_button(b, s, pre_fn, post_fn, failure_fn) {
    var input = s.append("input").attr("type", "file").style("display", "none").on("change", function () {
        utils.load_json(this.files[0], function (e, d) {
            post_fn(e, d);
            this.value = "";
        }.bind(this), pre_fn, failure_fn);
    });
    b.on('click', function (e) {
        input.node().click();
    });
    return function () {
        input.node().click();
    };
}

function set_json_or_csv_input_button(b, s, pre_fn, post_fn, failure_fn) {
    var input = s.append("input").attr("type", "file").style("display", "none").on("change", function () {
        utils.load_json_or_csv(this.files[0], data_styles.csv_converter, function (e, d) {
            post_fn(e, d);
            this.value = "";
        }.bind(this), pre_fn, failure_fn);
    });
    b.on('click', function (e) {
        input.node().click();
    });
    return function () {
        input.node().click();
    };
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** SearchBar */

var utils = __webpack_require__(0);
var CallbackManager = __webpack_require__(3);
var _ = __webpack_require__(2);

var SearchBar = utils.make_class();
// instance methods
SearchBar.prototype = {
    init: init,
    is_visible: is_visible,
    toggle: toggle,
    update: update,
    next: next,
    previous: previous
};
module.exports = SearchBar;

function init(sel, search_index, map) {
    var container = sel.attr('class', 'search-container').style('display', 'none');
    this.input = container.append('input').attr('class', 'search-bar');
    var group = container.append('div').attr('class', 'btn-group btn-group-sm');
    group.append('button').attr('class', 'btn btn-default').on('click', this.previous.bind(this)).append('span').attr('class', 'glyphicon glyphicon-chevron-left');
    group.append('button').attr('class', 'btn btn-default').on('click', this.next.bind(this)).append('span').attr('class', 'glyphicon glyphicon-chevron-right');
    this.counter = container.append('div').attr('class', 'search-counter');
    container.append('button').attr('class', 'btn btn-sm btn-default close-button').on('click', function () {
        this.toggle(false);
    }.bind(this)).append('span').attr('class', 'glyphicon glyphicon-remove');

    this.callback_manager = new CallbackManager();

    this.selection = container;
    this.map = map;
    this.search_index = search_index;

    this.current = 1;
    this.results = null;

    var on_input_fn = function (input) {
        this.current = 1;
        this.results = _drop_duplicates(this.search_index.find(input.value));
        this.update();
    }.bind(this, this.input.node());
    this.input.on('input', utils.debounce(on_input_fn, 200));
}

var comp_keys = {
    metabolite: ['m', 'node_id'],
    reaction: ['r', 'reaction_id'],
    text_label: ['t', 'text_label_id']
};
function _drop_duplicates(results) {
    return _.uniq(results, function (item) {
        // make a string for fast comparison
        var t = comp_keys[item.type];
        return t[0] + item[t[1]];
    });
}

function is_visible() {
    return this.selection.style('display') !== 'none';
}

function toggle(on_off) {
    if (on_off === undefined) this.is_active = !this.is_active;else this.is_active = on_off;

    if (this.is_active) {
        this.selection.style('display', null);
        this.counter.text('');
        this.input.node().value = '';
        this.input.node().focus();
        // escape key
        this.clear_escape = this.map.key_manager.add_escape_listener(function () {
            this.toggle(false);
        }.bind(this), true);
        // next keys
        this.clear_next = this.map.key_manager.add_key_listener(['enter', 'ctrl+g'], function () {
            this.next();
        }.bind(this), false);
        // previous keys
        this.clear_previous = this.map.key_manager.add_key_listener(['shift+enter', 'shift+ctrl+g'], function () {
            this.previous();
        }.bind(this), false);
        // run the show callback
        this.callback_manager.run('show');
    } else {
        this.map.highlight(null);
        this.selection.style('display', 'none');
        this.results = null;
        if (this.clear_escape) this.clear_escape();
        this.clear_escape = null;
        if (this.clear_next) this.clear_next();
        this.clear_next = null;
        if (this.clear_previous) this.clear_previous();
        this.clear_previous = null;
        // run the hide callback
        this.callback_manager.run('hide');
    }
}

function update() {
    if (this.results === null) {
        this.counter.text('');
        this.map.highlight(null);
    } else if (this.results.length === 0) {
        this.counter.text('0 / 0');
        this.map.highlight(null);
    } else {
        this.counter.text(this.current + ' / ' + this.results.length);
        var r = this.results[this.current - 1];
        if (r.type == 'reaction') {
            this.map.zoom_to_reaction(r.reaction_id);
            this.map.highlight_reaction(r.reaction_id);
        } else if (r.type == 'metabolite') {
            this.map.zoom_to_node(r.node_id);
            this.map.highlight_node(r.node_id);
        } else if (r.type == 'text_label') {
            this.map.zoom_to_text_label(r.text_label_id);
            this.map.highlight_text_label(r.text_label_id);
        } else {
            throw new Error('Bad search index data type: ' + r.type);
        }
    }
}

function next() {
    if (this.results === null) return;
    if (this.current === this.results.length) this.current = 1;else this.current += 1;
    this.update();
}

function previous() {
    if (this.results === null) return;
    if (this.current === 1) this.current = this.results.length;else this.current -= 1;
    this.update();
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Settings. A class to manage settings for a Map.

 Arguments
 ---------

 set_option: A function, fn(key), that returns the option value for the
 key.

 get_option: A function, fn(key, value), that sets the option for the key
 and value.

 conditional_options: The options to that are conditionally accepted when
 changed. Changes can be abandoned by calling abandon_changes(), or accepted
 by calling accept_changes().

 */

var utils = __webpack_require__(0);

var bacon = __webpack_require__(12);

var Settings = utils.make_class();
// instance methods
Settings.prototype = {
    init: init,
    set_conditional: set_conditional,
    hold_changes: hold_changes,
    abandon_changes: abandon_changes,
    accept_changes: accept_changes
};
module.exports = Settings;

// instance methods
function init(set_option, get_option, conditional_options) {
    this.set_option = set_option;
    this.get_option = get_option;

    // manage accepting/abandoning changes
    this.status_bus = new bacon.Bus();

    // force an update of ui components
    this.force_update_bus = new bacon.Bus();

    // modify bacon.observable
    bacon.Observable.prototype.convert_to_conditional_stream = _convert_to_conditional_stream;
    bacon.Observable.prototype.force_update_with_bus = _force_update_with_bus;

    // create the options
    this.busses = {};
    this.streams = {};
    for (var i = 0, l = conditional_options.length; i < l; i++) {
        var name = conditional_options[i];
        var out = _create_conditional_setting(name, get_option(name), set_option, this.status_bus, this.force_update_bus);
        this.busses[name] = out.bus;
        this.streams[name] = out.stream;
    }
}

/**
 * Hold on to event when hold_property is true, and only keep them if
 * accept_property is true (when hold_property becomes false).
 */
function _convert_to_conditional_stream(status_stream) {

    // true if hold is pressed
    var is_not_hold_event = status_stream.map(function (x) {
        return x == 'hold';
    }).not().toProperty(true),
        is_not_first_clear = status_stream.scan(false, function (c, x) {
        // first clear only
        return c == false && (x == 'accepted' || x == 'rejected');
    }).not(),
        is_not_first_hold = status_stream.scan(false, function (c, x) {
        // first clear only
        return c == false && x == 'hold';
    }).not(),
        combined = bacon.combineAsArray(this, status_stream),
        held = combined.scan([], function (c, x) {
        if (x[1] == 'hold') {
            c.push(x[0]);
            return c;
        } else if (x[1] == 'accept') {
            return c;
        } else if (x[1] == 'reject') {
            return [];
        } else if (x[1] == 'rejected' || x[1] == 'accepted') {
            return [x[0]];
        } else {
            throw Error('bad status ' + x[1]);
        }
    })
    // don't pass in events until the end of a hold
    .filter(is_not_hold_event)
    // ignore the event when clear is passed
    .filter(is_not_first_clear)
    // ignore the event when hold is passed
    .filter(is_not_first_hold).flatMap(function (ar) {
        return bacon.fromArray(ar);
    }),
        unheld = this.filter(is_not_hold_event);
    return unheld.merge(held);
}

function _force_update_with_bus(bus) {
    return bacon.combineAsArray(this, bus.toProperty(false)).map(function (t) {
        return t[0];
    });
}

function _create_conditional_setting(name, initial_value, set_option, status_bus, force_update_bus) {
    // set up the bus
    var bus = new bacon.Bus();
    // make the event stream
    var stream = bus
    // conditionally accept changes
    .convert_to_conditional_stream(status_bus)
    // force updates
    .force_update_with_bus(force_update_bus);

    // get the latest
    stream.onValue(function (v) {
        set_option(name, v);
    });

    // push the initial value
    bus.push(initial_value);

    return { bus: bus, stream: stream };
}

function set_conditional(name, value) {
    /** Set the value of a conditional setting, one that will only be
     accepted if this.accept_changes() is called.
      Arguments
     ---------
      name: The option name
      value: The new value
      */

    if (!(name in this.busses)) throw new Error('Invalid setting name');
    this.busses[name].push(value);
}

function hold_changes() {
    this.status_bus.push('hold');
}

function abandon_changes() {
    this.status_bus.push('reject');
    this.status_bus.push('rejected');
    this.force_update_bus.push(true);
}

function accept_changes() {
    this.status_bus.push('accept');
    this.status_bus.push('accepted');
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * SettingsMenu
 */

var utils = __webpack_require__(0);
var CallbackManager = __webpack_require__(3);
var ScaleEditor = __webpack_require__(46);

var SettingsMenu = utils.make_class();
SettingsMenu.prototype = {
  init: init,
  is_visible: is_visible,
  toggle: toggle,
  hold_changes: hold_changes,
  abandon_changes: abandon_changes,
  accept_changes: accept_changes,
  style_gui: style_gui,
  view_gui: view_gui
};
module.exports = SettingsMenu;

function init(sel, settings, map, toggle_abs_and_apply_data) {
  this.sel = sel;
  this.settings = settings;
  this.draw = false;

  var unique_map_id = this.settings.get_option('unique_map_id');
  this.unique_string = unique_map_id === null ? '' : '.' + unique_map_id;

  var background = sel.append('div').attr('class', 'settings-box-background').style('display', 'none');
  var container = background.append('div').attr('class', 'settings-box-container').style('display', 'none');

  // done button
  container.append('button').attr("class", "btn btn-sm btn-default settings-button").on('click', function () {
    this.accept_changes();
  }.bind(this)).append("span").attr("class", "glyphicon glyphicon-ok");
  // quit button
  container.append('button').attr("class", "btn btn-sm btn-default settings-button settings-button-close").on('click', function () {
    this.abandon_changes();
  }.bind(this)).append("span").attr("class", "glyphicon glyphicon-remove");

  var box = container.append('div').attr('class', 'settings-box');

  // Tip
  box.append('div').text('Tip: Hover over an option to see more details about it.').classed('settings-tip', true);
  box.append('hr');

  // view and build
  box.append('div').text('View and build options').attr('class', 'settings-section-heading-large');
  this.view_gui(box.append('div'));

  // reactions
  box.append('hr');
  box.append('div').text('Reactions').attr('class', 'settings-section-heading-large');
  var rse = new ScaleEditor(box.append('div'), 'reaction', this.settings, map.get_data_statistics.bind(map));
  map.callback_manager.set('calc_data_stats__reaction', function (changed) {
    if (changed) {
      rse.update();
      rse.update_no_data();
    }
  });
  box.append('div').text('Reaction or Gene data').attr('class', 'settings-section-heading');
  this.style_gui(box.append('div'), 'reaction', function (on_off) {
    if (toggle_abs_and_apply_data) {
      toggle_abs_and_apply_data('reaction', on_off);
      rse.update();
      rse.update_no_data();
    }
  });

  // metabolite data
  box.append('hr');
  box.append('div').text('Metabolites').attr('class', 'settings-section-heading-large');
  var mse = new ScaleEditor(box.append('div'), 'metabolite', this.settings, map.get_data_statistics.bind(map));
  map.callback_manager.set('calc_data_stats__metabolite', function (changed) {
    if (changed) {
      mse.update();
      mse.update_no_data();
    }
  });
  box.append('div').text('Metabolite data').attr('class', 'settings-section-heading');
  this.style_gui(box.append('div'), 'metabolite', function (on_off) {
    if (toggle_abs_and_apply_data) {
      toggle_abs_and_apply_data('metabolite', on_off);
      mse.update();
      mse.update_no_data();
    }
  });

  this.callback_manager = new CallbackManager();

  this.map = map;
  this.selection = container;
  this.background = background;
}
function is_visible() {
  return this.selection.style('display') != 'none';
}
function toggle(on_off) {
  if (on_off === undefined) on_off = !this.is_visible();

  if (on_off) {
    // hold changes until accepting/abandoning
    this.hold_changes();
    // show the menu
    this.selection.style("display", "inline-block");
    this.background.style("display", "block");
    this.selection.select('input').node().focus();
    // escape key
    this.clear_escape = this.map.key_manager.add_escape_listener(function () {
      this.abandon_changes();
    }.bind(this), true);
    // enter key
    this.clear_enter = this.map.key_manager.add_enter_listener(function () {
      this.accept_changes();
    }.bind(this), true);
    // run the show callback
    this.callback_manager.run('show');
  } else {
    // draw on finish
    if (this.draw) this.map.draw_everything();
    // hide the menu
    this.selection.style("display", "none");
    this.background.style("display", "none");
    if (this.clear_escape) this.clear_escape();
    this.clear_escape = null;
    if (this.clear_enter) this.clear_enter();
    this.clear_enter = null;
    // run the hide callback
    this.callback_manager.run('hide');
  }
}
function hold_changes() {
  this.settings.hold_changes();
}
function abandon_changes() {
  this.draw = false;
  this.settings.abandon_changes();
  this.toggle(false);
}
function accept_changes() {
  this.sel.selectAll('input').each(function (s) {
    this.blur();
  });
  this.draw = true;
  this.settings.accept_changes();
  this.toggle(false);
}

/**
 * A UI to edit style.
 */
function style_gui(sel, type, abs_callback) {
  var t = sel.append('table').attr('class', 'settings-table');
  var settings = this.settings;

  // styles
  t.append('tr').call(function (r) {
    r.append('td').text('Options:').attr('class', 'options-label').attr('title', 'Options for ' + type + ' data.');
    var cell = r.append('td');

    var styles = [['Absolute value', 'abs', 'If checked, use the absolute value when ' + 'calculating colors and sizes of ' + type + 's on the map'], ['Size', 'size', 'If checked, then size the ' + (type == 'metabolite' ? 'radius of metabolite circles ' : 'thickness of reaction lines ') + 'according to the value of the ' + type + ' data'], ['Color', 'color', 'If checked, then color the ' + (type == 'metabolite' ? 'metabolite circles ' : 'reaction lines ') + 'according to the value of the ' + type + ' data'], ['Text (Show data in label)', 'text', 'If checked, then show data values in the ' + type + ' ' + 'labels']];
    var style_cells = cell.selectAll('.option-group').data(styles);
    var style_enter = style_cells.enter().append('label').attr('class', 'option-group');

    // make the checkbox
    var streams = [];
    var get_styles = function get_styles() {
      var styles = [];
      cell.selectAll('input').each(function (d) {
        if (this.checked) styles.push(d[1]);
      });
      return styles;
    };
    style_enter.append('input').attr('type', 'checkbox').on('change', function (d) {
      settings.set_conditional(type + '_styles', get_styles());
      if (d[1] == 'abs') abs_callback(this.checked);
    }).each(function (d) {
      // subscribe to changes in the model
      settings.streams[type + '_styles'].onValue(function (ar) {
        // check the box if the style is present
        this.checked = ar.indexOf(d[1]) != -1;
      }.bind(this));
    });
    style_enter.append('span').text(function (d) {
      return d[0];
    }).attr('title', function (d) {
      return d[2];
    });
  });

  // compare_style
  t.append('tr').call(function (r) {
    r.append('td').text('Comparison:').attr('class', 'options-label').attr('title', 'The function that will be used to compare ' + 'datasets, when paired data is loaded');
    var cell = r.append('td').attr('title', 'The function that will be used to compare ' + 'datasets, when paired data is loaded');

    var styles = [['Fold Change', 'fold'], ['Log2(Fold Change)', 'log2_fold'], ['Difference', 'diff']];
    var style_cells = cell.selectAll('.option-group').data(styles);
    var style_enter = style_cells.enter().append('label').attr('class', 'option-group');

    // make the radio
    style_enter.append('input').attr('type', 'radio').attr('name', type + '_compare_style' + this.unique_string).attr('value', function (d) {
      return d[1];
    }).on('change', function () {
      if (this.checked) settings.set_conditional(type + '_compare_style', this.value);
    }).each(function () {
      // subscribe to changes in the model
      settings.streams[type + '_compare_style'].onValue(function (value) {
        // check the box for the new value
        this.checked = this.value == value;
      }.bind(this));
    });
    style_enter.append('span').text(function (d) {
      return d[0];
    });
  }.bind(this));

  // gene-specific settings
  if (type === 'reaction') {
    sel.append('table').attr('class', 'settings-table').attr('title', 'The function that will be used to evaluate ' + 'AND connections in gene reaction rules (AND ' + 'connections generally connect components of ' + 'an enzyme complex)')
    // and_method_in_gene_reaction_rule
    .append('tr').call(function (r) {
      r.append('td').text('Method for evaluating AND:').attr('class', 'options-label-wide');
      var cell = r.append('td');

      var styles = [['Mean', 'mean'], ['Min', 'min']];
      var style_cells = cell.selectAll('.option-group').data(styles);
      var style_enter = style_cells.enter().append('label').attr('class', 'option-group');

      // make the radio
      var name = 'and_method_in_gene_reaction_rule';
      style_enter.append('input').attr('type', 'radio').attr('name', name + this.unique_string).attr('value', function (d) {
        return d[1];
      }).on('change', function () {
        if (this.checked) settings.set_conditional(name, this.value);
      }).each(function () {
        // subscribe to changes in the model
        settings.streams[name].onValue(function (value) {
          // check the box for the new value
          this.checked = this.value == value;
        }.bind(this));
      });
      style_enter.append('span').text(function (d) {
        return d[0];
      });
    }.bind(this));
  }
}

function view_gui(s, option_name, string, options) {
  // columns
  var settings = this.settings;

  var t = s.append('table').attr('class', 'settings-table');
  t.append('tr').call(function (r) {
    // identifiers
    r.attr('title', 'The identifiers that are show in the reaction, ' + 'gene, and metabolite labels on the map.');
    r.append('td').text('Identifiers:').attr('class', 'options-label');
    var cell = r.append('td');

    var options = [['ID\'s', 'bigg_id'], ['Descriptive names', 'name']];
    var style_cells = cell.selectAll('.option-group').data(options);
    var style_enter = style_cells.enter().append('label').attr('class', 'option-group');

    // make the checkbox
    var name = 'identifiers_on_map';
    style_enter.append('input').attr('type', 'radio').attr('name', name + this.unique_string).attr('value', function (d) {
      return d[1];
    }).on('change', function () {
      if (this.checked) {
        settings.set_conditional(name, this.value);
      }
    }).each(function () {
      // subscribe to changes in the model
      settings.streams[name].onValue(function (value) {
        // check the box for the new value
        this.checked = this.value == value;
      }.bind(this));
    });
    style_enter.append('span').text(function (d) {
      return d[0];
    });
  }.bind(this));

  var boolean_options = [['scroll_behavior', 'Scroll to zoom (instead of scroll to pan)', 'If checked, then the scroll wheel and trackpad will control zoom ' + 'rather than pan.', { 'zoom': true, 'pan': false }], ['hide_secondary_metabolites', 'Hide secondary metabolites', 'If checked, then only the primary metabolites ' + 'will be displayed.'], ['show_gene_reaction_rules', 'Show gene reaction rules', 'If checked, then gene reaction rules will be displayed ' + 'below each reaction label. (Gene reaction rules are always ' + 'shown when gene data is loaded.)'], ['hide_all_labels', 'Hide reaction, gene, and metabolite labels', 'If checked, hide all reaction, gene, and metabolite labels'], ['allow_building_duplicate_reactions', 'Allow duplicate reactions', 'If checked, then allow duplicate reactions during model building.'], ['highlight_missing', 'Highlight reactions not in model', 'If checked, then highlight in red all the ' + 'reactions on the map that are not present in ' + 'the loaded model.'], ['enable_tooltips', 'Show tooltips', 'Show tooltips when hovering over reactions, metabolites, and genes']];

  var opts = s.append('div').attr('class', 'settings-container').selectAll('.option-group').data(boolean_options);
  // enter
  var e = opts.enter().append('label').attr('class', 'option-group full-line');
  e.append('input').attr('type', 'checkbox');
  e.append('span');
  // update
  var opts_update = e.merge(opts);
  opts_update.attr('title', function (d) {
    return d[2];
  });
  opts_update.select('input').on('change', function (d) {
    if (d.length >= 4) {
      // not a boolean setting
      for (var key in d[3]) {
        if (d[3][key] == this.checked) {
          settings.set_conditional(d[0], key);
          break;
        }
      }
    } else {
      // boolean setting
      settings.set_conditional(d[0], this.checked);
    }
  }).each(function (d) {
    settings.streams[d[0]].onValue(function (value) {
      if (d.length >= 4) {
        // not a boolean setting
        this.checked = d[3][value];
      } else {
        // boolean setting
        this.checked = value;
      }
    }.bind(this));
  });
  opts_update.select('span').text(function (d) {
    return d[1];
  });
  // exit
  opts.exit().remove();

  // message about text performance
  s.append('div').style('margin-top', '16px').classed('settings-tip', true).text('Tip: To increase map performance, turn off text boxes (i.e. ' + 'labels and gene reaction rules).');
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * ScaleEditor. An interactive UI to edit color and size scales.
 * sel: A d3 selection.
 * type: A type, that should be unique on the page.
 * settings: The Settings object.
 */

var utils = __webpack_require__(0);
var bacon = __webpack_require__(12);
var d3_scaleLinear = __webpack_require__(11).scaleLinear;
var d3_format = __webpack_require__(6).format;
var d3_drag = __webpack_require__(5).drag;
var d3_select = __webpack_require__(1).select;
var d3_selection = __webpack_require__(1);

var ScaleEditor = utils.make_class();
// instance methods
ScaleEditor.prototype = {
  init: init,
  update: update,
  update_no_data: update_no_data,
  _data_not_loaded: _data_not_loaded
};
module.exports = ScaleEditor;

function init(sel, type, settings, get_data_statistics) {
  var grad_id = 'grad' + type + this.unique_string;
  this.w = 400;
  this.h = 30;
  this.x = 20;
  this.input_width = 90;
  this.input_height = 24;
  var b = sel.append('div').attr('class', 'scale-editor');
  // no data loaded
  this.data_not_loaded = b.append('div').attr('class', 'data-not-loaded').text((type === 'reaction' ? 'Reaction and gene' : 'Metabolite') + ' data not loaded');
  // label
  this.input_label_group = b.append('div').attr('class', 'input-label-group');
  // no data
  var nd = b.append('div').style('top', this.input_height * 3 + 56 + 10 + 'px').attr('class', 'no-data');
  nd.append('span').text('Styles for ' + type + 's with no data').attr('class', 'no-data-heading');
  this.no_data_container = nd.append('div');
  var c = b.append('div').attr('class', 'centered');
  this.add_group = c.append('div');
  this.trash_group = c.append('div').attr('class', 'trash-container');
  var svg = c.append('svg').attr('class', 'scale-svg');
  this.input_group = c.append('div').attr('class', 'input-container');
  this.gradient = svg.append('defs').append('linearGradient').attr('id', grad_id);
  svg.append('rect').attr('class', 'rect').attr('fill', 'url(#' + grad_id + ')').attr('width', this.w + 'px').attr('height', this.h + 'px').attr('x', this.x + 'px'), this.pickers_group = svg.append('g');

  // Settings
  this.type = type;
  this.settings = settings;
  this.get_data_statistics = get_data_statistics;

  var unique_map_id = this.settings.get_option('unique_map_id');
  this.unique_string = unique_map_id === null ? '' : '.' + unique_map_id;

  // Collect data
  this.no_data = {};
  var ss = ['color', 'size'];
  ss.forEach(function (s) {
    this.no_data[s] = null;
    this.settings.streams[this.type + '_no_data_' + s].onValue(function (val) {
      this.no_data[s] = val;
      this.update_no_data();
    }.bind(this));
  }.bind(this));

  this.settings.streams[type + '_scale'].onValue(function (scale) {
    this.scale = scale;
    this.update();
  }.bind(this));
}

function update() {
  var scale = this.scale;
  var stats = this.get_data_statistics()[this.type];
  var bar_w = 14;
  var bar_h = 35;
  var x_disp = this.x;
  var data_not_loaded = this._data_not_loaded();

  // Must have max and min. Otherwise, assume that no data is loaded.
  if (data_not_loaded) {
    scale = [{ type: 'min', 'color': null, 'size': null }, { type: 'max', 'color': null, 'size': null }];
    stats = { min: 0, max: 1 };
  }

  var sc = d3_scaleLinear().domain([0, this.w]).range([stats.min, stats.max]);
  var sc_size = d3_scaleLinear().domain([0, this.w]).range([0, stats.max - stats.min]);

  // ---------------------------------------------------------------------
  // Convenience functions
  // ---------------------------------------------------------------------

  var bring_to_front = function (d, i) {
    // Bring an input set to the front
    this.input_group.selectAll('.input-set').each(function (d2) {
      d3_select(this).classed('selected-set', d === d2);
    });
  }.bind(this);

  var get_this_val = function get_this_val(d) {
    return d.type === 'value' ? d.value : stats[d.type];
  };

  var set_scale = function (scale) {
    this.settings.set_conditional(this.type + '_scale', scale);
    this.scale = scale;
    this.update();
  }.bind(this);

  // ---------------------------------------------------------------------
  // Make the gradient
  // ---------------------------------------------------------------------

  var sorted_domain = scale.map(function (d) {
    var frac = stats.max === stats.min ? d.type === 'min' ? 0 : -1 : (get_this_val(d) - stats.min) / (stats.max - stats.min);
    return {
      frac: frac,
      color: d.color
    };
  }).filter(function (d) {
    return d.frac >= 0 && d.frac <= 1.0;
  }).sort(function (a, b) {
    return a.frac - b.frac;
  });

  var stops = this.gradient.selectAll('stop').data(sorted_domain);
  stops.enter().append('stop').merge(stops).attr('offset', function (d) {
    return d.frac * 100 + '%';
  }).style('stop-color', function (d) {
    return d.color === null ? '#F1ECFA' : d.color;
  });
  stops.exit().remove();

  // ---------------------------------------------------------------------
  // No data sign
  // ---------------------------------------------------------------------

  this.data_not_loaded.style('visibility', data_not_loaded ? null : 'hidden');

  // ---------------------------------------------------------------------
  // Make sure the pickers will not overlap
  // ---------------------------------------------------------------------

  var width = this.w;
  var last_loc = 0;
  var scale_for_pickers = scale.sort(function (a, b) {
    return get_this_val(a) - get_this_val(b);
  }).map(function (d, i) {
    // var next = sorted_lookup[i + 1].index
    // make sure we distribute between these if necessary
    var val = get_this_val(d);
    var buf = bar_w + 2;
    var adjusted_x;
    if (d.type === 'value' && val <= stats.min) {
      adjusted_x = sc.invert(stats.min) - bar_w / 2 + x_disp - buf;
    } else if (d.type === 'value' && val >= stats.max) {
      adjusted_x = sc.invert(stats.max) - bar_w / 2 + x_disp + buf;
    } else {
      adjusted_x = sc.invert(val) - bar_w / 2 + x_disp;
    }
    // Move away from edges
    if (d.type !== 'min' && d.type !== 'max') {
      adjusted_x = Math.min(Math.max(adjusted_x, last_loc + buf), width - 2);
    }
    last_loc = adjusted_x;
    return Object.assign({}, d, { adjusted_x: adjusted_x });
  }.bind(this));

  // ---------------------------------------------------------------------
  // Make the pickers
  // ---------------------------------------------------------------------

  var pickers = this.pickers_group.selectAll('.picker').data(scale_for_pickers);
  // drag
  var drag = d3_drag().on('start', bring_to_front).on('drag', function (d, i) {
    // on drag, make it a value type
    if (['value', 'min', 'max'].indexOf(scale[i].type) === -1) {
      // get the current value and set it
      scale[i].value = get_this_val(d);
      scale[i].type = 'value';
    }
    // change the model on drag
    var new_d = scale[i].value + sc_size(d3_selection.event.dx);
    var buf = sc_size(bar_w + 2);
    if (new_d > stats.max - buf) {
      new_d = stats.max - buf;
    }
    if (new_d < stats.min + buf) {
      new_d = stats.min + buf;
    }
    // round to 2 decimals
    new_d = Math.floor(new_d * 100.0) / 100.0;
    scale[i].value = new_d;
    this.settings.set_conditional(this.type + '_scale', scale);
    this.scale = scale;
    this.update();
  }.bind(this));

  // enter
  pickers.enter().append('g').attr('class', 'picker').style('cursor', 'pointer').append('rect')
  // update
  .merge(pickers).select('rect').attr('x', function (d, i) {
    return d.adjusted_x;
  }).attr('width', bar_w + 'px').attr('height', bar_h + 'px').call(drag);
  // exit
  pickers.exit().remove();

  // ---------------------------------------------------------------------
  // make the delete buttons
  // ---------------------------------------------------------------------

  var trashes = this.trash_group.selectAll('span').data(scale_for_pickers);
  // enter
  trashes.enter().append('span')
  // update
  .merge(trashes).attr('class', function (d, i) {
    if (d.type === 'min' || d.type === 'max') {
      return null;
    }
    return 'trash glyphicon glyphicon-trash';
  }).style('left', function (d) {
    // return sc.invert(get_this_val(d)) - (bar_w / 2) + x_disp + 'px'
    return d.adjusted_x + 'px';
  }).on('click', function (d, i) {
    if (d.type === 'min' || d.type === 'max') {
      return;
    }
    scale = scale.slice(0, i).concat(scale.slice(i + 1));
    this.settings.set_conditional(this.type + '_scale', scale);
    this.scale = scale;
    this.update();
  }.bind(this));
  // exit
  trashes.exit().remove();

  // ---------------------------------------------------------------------
  // make the add button
  // ---------------------------------------------------------------------

  var add = this.add_group.selectAll('.add').data(['add']);
  // enter
  add.enter().append('span').attr('class', 'add glyphicon glyphicon-plus')
  // update
  .merge(add).on('click', function (d) {
    if (data_not_loaded) {
      return;
    }
    var new_d = (stats.max + stats.min) / 2;
    var buf = sc_size(bar_w + 2);
    var last_ind = 0;
    // try to make the new point not overlap
    for (var j = 0, l = scale.length; j < l; j++) {
      var th = get_this_val(scale[j]);
      if (Math.abs(th - new_d) < buf) {
        new_d = new_d + buf;
        if (new_d > stats.max - buf) new_d = stats.max - buf;
        if (new_d < stats.min + buf) new_d = stats.min + buf;
      }
      if (new_d > th) {
        last_ind = j;
      }
    }
    // add
    scale.push({
      type: 'value',
      value: new_d,
      color: scale[last_ind].color,
      size: scale[last_ind].size
    });
    set_scale(scale);
  }.bind(this));
  // exit
  add.exit().remove();

  // ---------------------------------------------------------------------
  // input labels
  // ---------------------------------------------------------------------

  var labels = this.input_label_group.selectAll('.row-label').data(['Value:', 'Color:', 'Size:']);
  // enter
  labels.enter().append('div').attr('class', 'row-label').style('height', this.input_height + 'px').style('line-height', this.input_height + 'px')
  // update
  .merge(labels).style('top', function (d, i) {
    return 56 + i * this.input_height + 'px';
  }.bind(this)).text(function (d) {
    return d;
  });
  // exit
  labels.exit().remove();

  // ---------------------------------------------------------------------
  // inputs
  // ---------------------------------------------------------------------

  var inputs = this.input_group.selectAll('.input-set').data(scale_for_pickers);

  // enter
  var inputs_enter = inputs.enter().append('div').attr('class', 'input-set');
  inputs_enter.append('input').attr('class', 'domain-input').style('width', this.input_width + 'px');
  // type picker
  inputs_enter.append('select').attr('class', 'domain-type-picker'),
  // color input
  inputs_enter.append('input').attr('class', 'color-input').style('width', this.input_width + 'px');
  inputs_enter.append('input').attr('type', 'color').style('visibility', function () {
    // hide the input if the HTML5 color picker is not supported
    return this.type == 'text' ? 'hidden' : null;
  }).attr('class', 'color-picker');
  inputs_enter.append('input').attr('class', 'size-input').style('width', this.input_width + 'px');

  // update
  var inputs_update = inputs_enter.merge(inputs);
  inputs_update.style('height', this.input_height * 3 + 'px').style('width', this.input_width + 'px').style('left', function (d) {
    var l = d.adjusted_x;
    // don't go over the right edge of the bar
    if (l + this.input_width > this.w + this.x) {
      l = l - this.input_width + bar_w / 2;
    }
    return l + 'px';
  }.bind(this)).on('mousedown', bring_to_front);

  var format = d3_format('.4g');
  inputs_update.select('.domain-input').style('height', this.input_height + 'px').each(function (d, i) {
    if (d.type == 'value') {
      this.value = get_this_val(d);
      this.disabled = false;
    } else {
      this.value = d.type + ' (' + format(get_this_val(d)) + ')';
      this.disabled = true;
    }
  }).on('change', function (d, i) {
    var buf = sc_size(bar_w + 2),
        new_d = parseFloat(this.value);
    scale[i].value = new_d;
    set_scale(scale);
  });
  // update type picker
  var select = inputs_update.select('.domain-type-picker');
  // get the function types, except min and max
  var stat_types = ['value'].concat(Object.keys(stats)).filter(function (x) {
    return x !== 'min' && x !== 'max';
  });
  var opts = select.selectAll('option').data(stat_types);

  opts.enter().append('option').merge(opts).attr('value', function (d) {
    return d;
  }).text(function (d) {
    return d;
  });
  opts.exit().remove();

  select.style('visibility', function (d) {
    return d.type == 'min' || d.type == 'max' ? 'hidden' : null;
  }).style('left', this.input_width - 20 + 'px').style('width', '20px').each(function (d, i) {
    var sind = 0;
    d3_select(this).selectAll('option').each(function (_, i) {
      if (this.value == d.type) sind = i;
    });
    this.selectedIndex = sind;
  }).on('change', function (d, i) {
    // set the value to the current location
    if (this.value == 'value') scale[i].value = stats[d.type];
    // switch to the new type
    scale[i].type = this.value;
    // reload
    set_scale(scale);
  });
  // update color input
  inputs_update.select('.color-input').style('height', this.input_height + 'px').style('top', this.input_height + 'px').each(function (d, i) {
    this.value = d.color === null ? '' : d.color;
    this.disabled = d.color === null;
  }).on('change', function (d, i) {
    scale[i].color = this.value;
    set_scale(scale);
  });
  inputs_update.select('.color-picker').style('left', this.input_width - this.input_height + 'px').style('top', this.input_height + 'px').style('width', this.input_height + 'px').style('height', this.input_height + 'px').each(function (d, i) {
    this.value = d.color === null ? '#dddddd' : d.color;
    this.disabled = d.color === null;
  }).on('change', function (d, i) {
    scale[i].color = this.value;
    set_scale(scale);
  });
  inputs_update.select('.size-input').style('height', this.input_height + 'px').style('top', this.input_height * 2 + 'px').each(function (d, i) {
    this.value = d.size === null ? '' : d.size;
    this.disabled = d.size === null;
  }).on('change', function (d, i) {
    scale[i].size = parseFloat(this.value);
    set_scale(scale);
  });

  // exit
  inputs.exit().remove();
}

function update_no_data() {
  var no_data = this.no_data;
  var data_not_loaded = this._data_not_loaded();
  var label_w = 40;

  var ins = this.no_data_container.selectAll('.input-group').data([['color', 'Color:'], ['size', 'Size:']]);
  // enter
  var ins_enter = ins.enter().append('div').attr('class', 'input-group');
  ins_enter.append('span');
  ins_enter.append('input');
  ins_enter.append('input').attr('type', 'color').style('visibility', function (d) {
    // hide the input if the HTML5 color picker is not supported,
    // or if this is a size box
    return this.type === 'text' || d[0] !== 'color' ? 'hidden' : null;
  }).attr('class', 'color-picker');
  // update
  var ins_update = ins_enter.merge(ins);
  ins_update.select('span').text(function (d) {
    return d[1];
  }).style('height', this.input_height + 'px').style('line-height', this.input_height + 'px').style('left', function (d, i) {
    return (label_w + this.input_width + 10) * i + 'px';
  }.bind(this));
  var get_o = function (kind) {
    return this.settings.get_option(this.type + '_no_data_' + kind);
  }.bind(this);
  ins_update.select('input').style('left', function (d, i) {
    return label_w + (label_w + this.input_width + 10) * i + 'px';
  }.bind(this)).style('height', this.input_height + 'px').style('width', this.input_width + 'px').each(function (d) {
    // initial value
    this.value = data_not_loaded ? '' : no_data[d[0]];
    this.disabled = data_not_loaded;
  }).on('change', function (d) {
    var val = d3_selection.event.target.value;
    if (d[0] === 'size') {
      val = parseFloat(val);
    }
    this.no_data[d[0]] = val;
    this.settings.set_conditional(this.type + '_no_data_' + d[0], val);
    this.update_no_data();
  }.bind(this));
  ins_update.select('.color-picker').style('left', function (d, i) {
    return (label_w + this.input_width) * (i + 1) - this.input_height + 'px';
  }.bind(this)).style('width', this.input_height + 'px').style('height', this.input_height + 'px').each(function (d, i) {
    this.value = data_not_loaded ? '#dddddd' : no_data[d[0]];
    this.disabled = data_not_loaded;
  }).on('change', function (d, i) {
    var val = d3_selection.event.target.value;
    this.no_data[d[0]] = val;
    this.settings.set_conditional(this.type + '_no_data_' + d[0], val);
    this.update_no_data();
  }.bind(this));
  // exit
  ins.exit().remove();
}

function _data_not_loaded() {
  var stats = this.get_data_statistics()[this.type];
  return stats.max === null || stats.min === null;
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * TextEditInput
 */

var utils = __webpack_require__(0);
var PlacedDiv = __webpack_require__(8);
var build = __webpack_require__(10);

var TextEditInput = utils.make_class();
TextEditInput.prototype = {
  init: init,
  setup_map_callbacks: setup_map_callbacks,
  setup_zoom_callbacks: setup_zoom_callbacks,
  is_visible: is_visible,
  show: show,
  hide: hide,
  _accept_changes: _accept_changes,
  _add_and_edit: _add_and_edit
};
module.exports = TextEditInput;

function init(selection, map, zoom_container) {
  var div = selection.append('div').attr('id', 'text-edit-input');
  this.placed_div = PlacedDiv(div, map);
  this.placed_div.hide();
  this.input = div.append('input');

  this.map = map;
  this.setup_map_callbacks(map);
  this.zoom_container = zoom_container;
  this.setup_zoom_callbacks(zoom_container);

  this.is_new = false;
}

function setup_map_callbacks(map) {
  // Input
  map.callback_manager.set('edit_text_label.text_edit_input', function (target, coords) {
    this.show(target, coords);
  }.bind(this));

  // new text_label
  map.callback_manager.set('new_text_label.text_edit_input', function (coords) {
    if (this.active_target !== null) {
      this._accept_changes(this.active_target.target);
    }
    this.hide();
    this._add_and_edit(coords);
  }.bind(this));

  map.callback_manager.set('hide_text_label_editor.text_edit_input', function () {
    this.hide();
  }.bind(this));
}

function setup_zoom_callbacks(zoom_container) {
  zoom_container.callback_manager.set('zoom.text_edit_input', function () {
    if (this.active_target) {
      this._accept_changes(this.active_target.target);
    }
    this.hide();
  }.bind(this));
  zoom_container.callback_manager.set('go_to.text_edit_input', function () {
    if (this.active_target) {
      this._accept_changes(this.active_target.target);
    }
    this.hide();
  }.bind(this));
}

function is_visible() {
  return this.placed_div.is_visible();
}

function show(target, coords) {
  // save any existing edit
  if (this.active_target) {
    this._accept_changes(this.active_target.target);
  }

  // set the current target
  this.active_target = { target: target, coords: coords

    // set the new value
  };target.each(function (d) {
    this.input.node().value = d.text;
  }.bind(this));

  // place the input
  this.placed_div.place(coords);
  this.input.node().focus();

  // escape key
  this.clear_escape = this.map.key_manager.add_escape_listener(function () {
    this._accept_changes(target);
    this.hide();
  }.bind(this), true);
  // enter key
  this.clear_enter = this.map.key_manager.add_enter_listener(function (target) {
    this._accept_changes(target);
    this.hide();
  }.bind(this, target), true);
}

function hide() {
  this.is_new = false;

  // hide the input
  this.placed_div.hide();

  // clear the value
  this.input.attr('value', '');
  this.active_target = null;

  // clear escape
  if (this.clear_escape) this.clear_escape();
  this.clear_escape = null;
  // clear enter
  if (this.clear_enter) this.clear_enter();
  this.clear_enter = null;
  // turn off click listener
  // this.map.sel.on('click.', null)
}

function _accept_changes(target) {
  if (this.input.node().value === '') {
    // Delete the label
    target.each(function (d) {
      var selected = {};
      selected[d.text_label_id] = this.map.text_labels[d.text_label_id];
      this.map.delete_selectable({}, selected, true);
    }.bind(this));
  } else {
    // Set the text
    var text_label_ids = [];
    target.each(function (d) {
      this.map.edit_text_label(d.text_label_id, this.input.node().value, true, this.is_new);
      text_label_ids.push(d.text_label_id);
    }.bind(this));
  }
}

function _add_and_edit(coords) {
  this.is_new = true;

  // Make an empty label
  var text_label_id = this.map.new_text_label(coords, '');
  // Apply the cursor to the new label
  var sel = this.map.sel.select('#text-labels').selectAll('.text-label').filter(function (d) {
    return d.text_label_id === text_label_id;
  });
  sel.select('text').classed('edit-text-cursor', true);
  this.show(sel, coords);
}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A QuickJump menu to move between maps.
 * sel: The d3 selection of an html node to place the menu inside.
 * options: An array of map names to jump to.
 * load_callback: A callback function that accepts two arguments: map_name, and
 * another callback which returns true or false for success or failure (callback
 * purgatory).
*/

var utils = __webpack_require__(0);

var QuickJump = utils.make_class();
// instance methods
QuickJump.prototype = {
  init: init,
  reset_selection: reset_selection,
  replace_state_for_map_name: replace_state_for_map_name
};
module.exports = QuickJump;

function init(sel, load_callback) {
  // set up the menu
  var select_sel = sel.append('select').attr('id', 'quick-jump-menu').attr('class', 'form-control');
  this.selector = select_sel;

  // get the options to show
  var url_comp = utils.parse_url_components(window);
  var current = 'map_name' in url_comp ? url_comp.map_name : null;
  var quick_jump_path = 'quick_jump_path' in url_comp ? url_comp.quick_jump_path : null;
  var options = 'quick_jump' in url_comp ? url_comp.quick_jump : [];
  var default_value = '— Jump to map —';
  var view_options = [default_value].concat(options);
  if (current !== null) {
    view_options = view_options.filter(function (o) {
      return o != current;
    });
  }

  // on selection
  var change_map = function (map_name) {
    load_callback(map_name, quick_jump_path, function (success) {
      if (success) {
        this.replace_state_for_map_name(map_name);
      } else {
        this.reset_selection();
      }
    }.bind(this));
  }.bind(this);

  // only show if there are options
  if (view_options.length > 1) {
    var s = select_sel.selectAll('option').data(view_options);
    s.enter().append('option').merge(s).text(function (d) {
      // works whether or not a '.' is present
      return d.split('.').slice(-1)[0];
    });
    select_sel.on('change', function () {
      // get the new map
      var map_name = this.options[this.selectedIndex].__data__;
      change_map(map_name);
    });
  } else {
    select_sel.style('display', 'none');
  }
}

function reset_selection() {
  this.selector.node().selectedIndex = 0;
}

/**
 * Just changes the url to match the new map name. Does not actually manage the
 * HTML5 history.
 */
function replace_state_for_map_name(map_name) {
  // update the url with the new map
  var url = window.location.href.replace(/(map_name=)([^&]+)(&|$)/, '$1' + map_name + '$3');
  window.history.replaceState('Not implemented', '', url);
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var PlacedDiv = __webpack_require__(8);
var tinier = __webpack_require__(16);
var _ = __webpack_require__(2);

/**
 * Manage the tooltip that lives in a PlacedDiv.
 * @param selection
 * @param map
 * @param tooltip_component
 * @param zoom_container
 */
var TooltipContainer = utils.make_class();
// instance methods
TooltipContainer.prototype = {
  init: init,
  setup_map_callbacks: setup_map_callbacks,
  setup_zoom_callbacks: setup_zoom_callbacks,
  is_visible: is_visible,
  show: show,
  hide: hide,
  delay_hide: delay_hide,
  cancel_hide_tooltip: cancel_hide_tooltip
};
module.exports = TooltipContainer;

// definitions
function init(selection, tooltip_component, zoom_container) {
  this.div = selection.append('div').attr('id', 'tooltip-container');
  this.div.on('mouseover', this.cancel_hide_tooltip.bind(this));
  this.div.on('mouseleave', this.hide.bind(this));

  this.setup_zoom_callbacks(zoom_container);

  // keep a reference to tinier tooltip
  this.tooltip_component = tooltip_component;
  // if they pass in a function, then use that
  this.tooltip_function = _.isFunction(tooltip_component) ? function (state) {
    tooltip_component({ state: state, el: this.div.node() });
  } : null;
  // if they pass in a tinier component, use that
  this.tinier_tooltip = tinier.checkType(tinier.COMPONENT, tooltip_component) ? tinier.run(tooltip_component, this.div.node()) : null;

  this.delay_hide_timeout = null;
}

function setup_map_callbacks(map) {
  this.placed_div = PlacedDiv(this.div, map);

  map.callback_manager.set('show_tooltip.tooltip_container', function (type, d) {
    if (map.settings.get_option('enable_tooltips')) {
      this.show(type, d);
    }
  }.bind(this));
  map.callback_manager.set('hide_tooltip.tooltip_container', this.hide.bind(this));
  map.callback_manager.set('delay_hide_tooltip.tooltip_container', this.delay_hide.bind(this));
}

function setup_zoom_callbacks(zoom_container) {
  zoom_container.callback_manager.set('zoom.tooltip_container', function () {
    if (this.is_visible()) {
      this.hide();
    }
  }.bind(this));
  zoom_container.callback_manager.set('go_to.tooltip_container', function () {
    if (this.is_visible()) {
      this.hide();
    }
  }.bind(this));
}

/**
 * Return visibility of tooltip container.
 * @return {Boolean} Whether tooltip is visible.
 */
function is_visible() {
  return this.placed_div.is_visible();
}

/**
 * Show and place the input.
 * @param {String} type - 'reaction_label', 'node_label', or 'gene_label'
 * @param {Object} d - D3 data for DOM element
 * @param {Object} coords - Object with x and y coords. Cannot use coords from
 *                          'd' because gene labels do not have them.
 */
function show(type, d) {
  // get rid of a lingering delayed hide
  this.cancel_hide_tooltip();

  if (_.contains(['reaction_label', 'node_label', 'gene_label'], type)) {
    var coords = { x: d.label_x, y: d.label_y + 10 };
    this.placed_div.place(coords);
    var data = {
      biggId: d.bigg_id,
      name: d.name,
      loc: coords,
      data: d.data_string,
      type: type.replace('_label', '').replace('node', 'metabolite')
    };
    if (this.tooltip_function !== null) {
      this.tooltip_function(data);
    } else if (this.tinier_tooltip) {
      this.tinier_tooltip.reducers.setContainerData(data);
    }
  } else {
    throw new Error('Tooltip not supported for object type ' + type);
  }
}

/**
 * Hide the input.
 */
function hide() {
  this.placed_div.hide();
}

/**
 * Hide the input after a short delay, so that mousing onto the tooltip does not
 * cause it to hide.
 */
function delay_hide() {
  this.delay_hide_timeout = setTimeout(function () {
    this.hide();
  }.bind(this), 100);
}

function cancel_hide_tooltip() {
  if (this.delay_hide_timeout !== null) {
    clearTimeout(this.delay_hide_timeout);
  }
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global window, XMLHttpRequest */

/**
 * Define a Tooltip component and interface with Tinier.
 */

var utils = __webpack_require__(0);
var tinier = __webpack_require__(16);
var createComponent = tinier.createComponent;
var createInterface = tinier.createInterface;
var typ = tinier.interfaceTypes;
var h = tinier.createElement;
var _render = tinier.render;
var _ = __webpack_require__(2);

// Define styles
var containerStyle = {
  'min-width': '270px',
  'min-height': '100px',
  'border-radius': '2px',
  'border': '1px solid #b58787',
  'padding': '7px',
  'background-color': '#fff',
  'text-align': 'left',
  'font-size': '16px',
  'font-family': 'sans-serif',
  'color': '#111',
  'box-shadow': '4px 6px 20px 0px rgba(0, 0, 0, 0.4)'
};

var idStyle = {
  'font-size': '18px',
  'font-weight': 'bold'
};

var buttonStyle = {
  'border-radius': '3px',
  'background-color': '#eee',
  'border': '1px solid #ddd',
  'margin-top': '4px'
};

var typeLabelStyle = {
  'position': 'absolute',
  'top': '4px',
  'right': '4px',
  'color': '#d27066',
  'background-color': '#ffeded',
  'border-radius': '2px',
  'font-size': '14px',
  'text-align': 'right',
  'padding': '0px 5px'
};

function decompartmentalizeCheck(id, type) {
  // ID without compartment, if metabolite.
  return type === 'metabolite' ? utils.decompartmentalize(id)[0] : id;
}

function capitalizeFirstLetter(s) {
  return s === null ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

// Create the component
var DefaultTooltip = createComponent({
  displayName: 'DefaultTooltip',

  init: function init() {
    return {
      biggId: '',
      name: '',
      loc: { x: 0, y: 0 },
      data: null,
      type: null
    };
  },

  reducers: {
    setContainerData: function setContainerData(args) {
      return Object.assign({}, args.state, {
        biggId: args.biggId,
        name: args.name,
        loc: args.loc,
        data: args.data,
        type: args.type
      });
    }
  },

  methods: {
    openBigg: function openBigg(args) {
      var type = args.state.type;
      var biggId = args.state.biggId;
      var pref = 'http://bigg.ucsd.edu/';
      var url = type === 'gene' ? pref + 'search?query=' + biggId : pref + 'universal/' + type + 's/' + decompartmentalizeCheck(biggId, type);
      window.open(url);
    }
  },

  render: function render(args) {
    var decomp = decompartmentalizeCheck(args.state.biggId, args.state.type);
    var biggButtonText = 'Open ' + decomp + ' in BiGG Models.';

    return _render(
    // parent node
    args.el,
    // the new tooltip element
    h('div',
    // tooltip style
    { style: containerStyle },
    // id
    h('span', { style: idStyle }, args.state.biggId), h('br'),
    // descriptive name
    'name: ' + args.state.name, h('br'),
    // data
    'data: ' + (args.state.data && args.state.data !== '(nd)' ? args.state.data : 'no data'), h('br'),
    // BiGG Models button
    h('button', { style: buttonStyle, onClick: args.methods.openBigg }, biggButtonText),
    // type label
    h('div', { style: typeLabelStyle }, capitalizeFirstLetter(args.state.type))));
  }
});

module.exports = {
  DefaultTooltip: DefaultTooltip
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global global */

var jsdom = __webpack_require__(52);
var d3_select = __webpack_require__(1).select;

// body selection
var document = jsdom.jsdom();
var d3_body = d3_select(document).select('body');

// globals
global.document = document;
global.window = document.defaultView;
global.navigator = { platform: 'node.js'

  // Need to import jquery after jsdom initializes.
};var jquery = __webpack_require__(53);
global.jQuery = jquery;
global.$ = jquery;
__webpack_require__(54);

// Dummy SVGElement for d3-zoom.js:L87
var Dummy = function Dummy() {};
Dummy.prototype = {};
global.SVGElement = Dummy;

module.exports = d3_body;

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("jsdom");

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("jquery");

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("bootstrap");

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Returns a test map */

module.exports = function get_map() {
    return [{ "map_name": "E coli core.Core metabolism", "map_id": "2938hoq32a1", "map_description": "E. coli core metabolic network\nLast Modified Thu Dec 11 2014 15:07:04 GMT-0800 (Pacific Standard Time)", "homepage": "https://escher.github.io", "schema": "https://escher.github.io/escher/jsonschema/1-0-0#" }, { "reactions": { "1576693": { "name": "phosphoglycerate kinase", "bigg_id": "PGK", "reversibility": true, "label_x": 1065, "label_y": 2715, "gene_reaction_rule": "b2926", "genes": [{ "bigg_id": "b2926", "name": "b2926" }], "metabolites": [{ "coefficient": -1, "bigg_id": "3pg_c" }, { "coefficient": 1, "bigg_id": "adp_c" }, { "coefficient": 1, "bigg_id": "13dpg_c" }, { "coefficient": -1, "bigg_id": "atp_c" }], "segments": { "291": { "from_node_id": "1576835", "to_node_id": "1576836", "b1": null, "b2": null }, "292": { "from_node_id": "1576836", "to_node_id": "1576834", "b1": null, "b2": null }, "293": { "from_node_id": "1576485", "to_node_id": "1576835", "b1": { "y": 2822.4341649025255, "x": 1055 }, "b2": { "y": 2789.230249470758, "x": 1055 } }, "294": { "from_node_id": "1576486", "to_node_id": "1576835", "b1": { "y": 2825, "x": 1055 }, "b2": { "y": 2790, "x": 1055 } }, "295": { "from_node_id": "1576834", "to_node_id": "1576487", "b1": { "y": 2650, "x": 1055 }, "b2": { "y": 2615, "x": 1055 } }, "296": { "from_node_id": "1576834", "to_node_id": "1576488", "b1": { "y": 2650.769750529242, "x": 1055 }, "b2": { "y": 2617.5658350974745, "x": 1055 } } } }, "1576694": { "name": "phosphogluconate dehydrogenase", "bigg_id": "GND", "reversibility": false, "label_x": 1930.5045166015625, "label_y": 1313.710205078125, "gene_reaction_rule": "b2029", "genes": [{ "bigg_id": "b2029", "name": "b2029" }], "metabolites": [{ "coefficient": -1, "bigg_id": "nadp_c" }, { "coefficient": 1, "bigg_id": "ru5p__D_c" }, { "coefficient": 1, "bigg_id": "nadph_c" }, { "coefficient": 1, "bigg_id": "co2_c" }, { "coefficient": -1, "bigg_id": "6pgc_c" }], "segments": { "297": { "from_node_id": "1576838", "to_node_id": "1576837", "b1": null, "b2": null }, "298": { "from_node_id": "1576837", "to_node_id": "1576839", "b1": null, "b2": null }, "299": { "from_node_id": "1576489", "to_node_id": "1576838", "b1": { "y": 1265, "x": 1884.7984674554473 }, "b2": { "y": 1265, "x": 1921.339540236634 } }, "300": { "from_node_id": "1576490", "to_node_id": "1576838", "b1": { "y": 1265, "x": 1882 }, "b2": { "y": 1265, "x": 1920.5 } }, "301": { "from_node_id": "1576839", "to_node_id": "1576491", "b1": { "y": 1265, "x": 1992.660459763366 }, "b2": { "y": 1265, "x": 2029.2015325445527 } }, "302": { "from_node_id": "1576839", "to_node_id": "1576492", "b1": { "y": 1265, "x": 1996.2093727122985 }, "b2": { "y": 1265, "x": 2041.0312423743285 } }, "303": { "from_node_id": "1576839", "to_node_id": "1576493", "b1": { "y": 1265, "x": 2003.7 }, "b2": { "y": 1265, "x": 2066 } } } }, "1576702": { "name": "glucose-6-phosphate isomerase", "bigg_id": "PGI", "reversibility": true, "label_x": 1065, "label_y": 1385, "gene_reaction_rule": "b4025", "genes": [{ "bigg_id": "b4025", "name": "b4025" }], "metabolites": [{ "coefficient": -1, "bigg_id": "g6p_c" }, { "coefficient": 1, "bigg_id": "f6p_c" }], "segments": { "345": { "from_node_id": "1576524", "to_node_id": "1576857", "b1": { "y": 1284.5, "x": 1055 }, "b2": { "y": 1330, "x": 1055 } }, "346": { "from_node_id": "1576857", "to_node_id": "1576525", "b1": { "y": 1417.5, "x": 1055 }, "b2": { "y": 1470, "x": 1055 } } } }, "1576704": { "name": "fructose-bisphosphatase", "bigg_id": "FBP", "reversibility": false, "label_x": 751.3809814453125, "label_y": 1733.561767578125, "gene_reaction_rule": "(b3925 or b4232)", "genes": [{ "bigg_id": "b3925", "name": "b3925" }, { "bigg_id": "b4232", "name": "b4232" }], "metabolites": [{ "coefficient": -1, "bigg_id": "fdp_c" }, { "coefficient": 1, "bigg_id": "pi_c" }, { "coefficient": 1, "bigg_id": "f6p_c" }, { "coefficient": -1, "bigg_id": "h2o_c" }], "segments": { "349": { "from_node_id": "1576861", "to_node_id": "1576859", "b1": null, "b2": null }, "350": { "from_node_id": "1576859", "to_node_id": "1576860", "b1": null, "b2": null }, "351": { "from_node_id": "1576528", "to_node_id": "1576861", "b1": { "y": 1822.0087712549569, "x": 835 }, "b2": { "y": 1782.1026313764871, "x": 835 } }, "352": { "from_node_id": "1576529", "to_node_id": "1576861", "b1": { "y": 1901.0147050873545, "x": 835 }, "b2": { "y": 1805.8044115262064, "x": 835 } }, "353": { "from_node_id": "1576860", "to_node_id": "1576525", "b1": { "y": 1627.410107741575, "x": 835 }, "b2": { "y": 1539.7003591385833, "x": 835 } }, "354": { "from_node_id": "1576860", "to_node_id": "1576530", "b1": { "y": 1645.7906272877015, "x": 835 }, "b2": { "y": 1600.9687576256715, "x": 835 } } } }, "1576711": { "name": "transaldolase", "bigg_id": "TALA", "reversibility": true, "label_x": 2197.5205078125, "label_y": 2008.8013916015625, "gene_reaction_rule": "(b2464 or b0008)", "genes": [{ "bigg_id": "b2464", "name": "b2464" }, { "bigg_id": "b0008", "name": "b0008" }], "metabolites": [{ "coefficient": 1, "bigg_id": "e4p_c" }, { "coefficient": -1, "bigg_id": "g3p_c" }, { "coefficient": -1, "bigg_id": "s7p_c" }, { "coefficient": 1, "bigg_id": "f6p_c" }], "segments": { "369": { "from_node_id": "1576873", "to_node_id": "1576872", "b1": null, "b2": null }, "370": { "from_node_id": "1576872", "to_node_id": "1576874", "b1": null, "b2": null }, "371": { "from_node_id": "1576545", "to_node_id": "1576873", "b1": { "x": 2283.184776999114, "y": 1892.1518443631908 }, "b2": { "x": 2173.815906732547, "y": 1856.1727017464573 } }, "372": { "from_node_id": "1576546", "to_node_id": "1576873", "b1": { "x": 2064.2112662569266, "y": 1890.5651744413158 }, "b2": { "x": 2175.402576654422, "y": 1856.1728238167698 } }, "373": { "from_node_id": "1576874", "to_node_id": "1576547", "b1": { "y": 2076.976957965055, "x": 2178 }, "b2": { "x": 2178, "y": 2171.7496092324754 } }, "374": { "from_node_id": "1576874", "to_node_id": "1576548", "b1": { "y": 2077.4778177405574, "x": 2178 }, "b2": { "x": 2178.000244140625, "y": 2170.2455578331073 } } } }, "1576716": { "name": "ribulose 5-phosphate 3-epimerase", "bigg_id": "RPE", "reversibility": true, "label_x": 1937.57958984375, "label_y": 1422.4544677734375, "gene_reaction_rule": "(b3386 or b4301)", "genes": [{ "bigg_id": "b3386", "name": "b3386" }, { "bigg_id": "b4301", "name": "b4301" }], "metabolites": [{ "coefficient": -1, "bigg_id": "ru5p__D_c" }, { "coefficient": 1, "bigg_id": "xu5p__D_c" }], "segments": { "392": { "from_node_id": "1576493", "to_node_id": "1576885", "b1": { "y": 1287.5, "x": 2138.5 }, "b2": { "y": 1340, "x": 2100 } }, "393": { "from_node_id": "1576885", "to_node_id": "1576558", "b1": { "y": 1436, "x": 2030 }, "b2": { "y": 1485, "x": 1995 } } } }, "1576721": { "name": "phosphofructokinase", "bigg_id": "PFK", "reversibility": false, "label_x": 1065, "label_y": 1725, "gene_reaction_rule": "( b3916  or  b1723 )", "genes": [{ "bigg_id": "b3916", "name": "b3916" }, { "bigg_id": "b1723", "name": "b1723" }], "metabolites": [{ "coefficient": -1, "bigg_id": "f6p_c" }, { "coefficient": -1, "bigg_id": "atp_c" }, { "coefficient": 1, "bigg_id": "h_c" }, { "coefficient": 1, "bigg_id": "fdp_c" }, { "coefficient": 1, "bigg_id": "adp_c" }], "segments": { "404": { "from_node_id": "1576893", "to_node_id": "1576891", "b1": null, "b2": null }, "405": { "from_node_id": "1576891", "to_node_id": "1576892", "b1": null, "b2": null }, "406": { "from_node_id": "1576525", "to_node_id": "1576893", "b1": { "y": 1617.5, "x": 1055 }, "b2": { "y": 1668.25, "x": 1055 } }, "407": { "from_node_id": "1576572", "to_node_id": "1576893", "b1": { "y": 1639.6884705062548, "x": 1055 }, "b2": { "y": 1674.9065411518764, "x": 1055 } }, "408": { "from_node_id": "1576892", "to_node_id": "1576573", "b1": { "y": 1789.2302494707578, "x": 1055 }, "b2": { "y": 1822.4341649025257, "x": 1055 } }, "409": { "from_node_id": "1576892", "to_node_id": "1576529", "b1": { "y": 1797.5, "x": 1055 }, "b2": { "y": 1850, "x": 1055 } }, "410": { "from_node_id": "1576892", "to_node_id": "1576574", "b1": { "y": 1793.0623918681883, "x": 1055 }, "b2": { "y": 1835.2079728939614, "x": 1055 } } } }, "1576723": { "name": "transketolase", "bigg_id": "TKT2", "reversibility": true, "label_x": 1520.71923828125, "label_y": 1702.785400390625, "gene_reaction_rule": "( b2935  or  b2465 )", "genes": [{ "bigg_id": "b2935", "name": "b2935" }, { "bigg_id": "b2465", "name": "b2465" }], "metabolites": [{ "coefficient": -1, "bigg_id": "e4p_c" }, { "coefficient": 1, "bigg_id": "g3p_c" }, { "coefficient": -1, "bigg_id": "xu5p__D_c" }, { "coefficient": 1, "bigg_id": "f6p_c" }], "segments": { "413": { "from_node_id": "1576897", "to_node_id": "1576896", "b1": null, "b2": null }, "414": { "from_node_id": "1576896", "to_node_id": "1576898", "b1": null, "b2": null }, "415": { "from_node_id": "1576547", "to_node_id": "1576897", "b1": { "y": 1735, "x": 1954.5789860524153 }, "b2": { "y": 1735, "x": 1772.8736958157247 } }, "416": { "from_node_id": "1576558", "to_node_id": "1576897", "b1": { "y": 1735, "x": 1849.0292180074937 }, "b2": { "y": 1735, "x": 1741.208765402248 } }, "417": { "from_node_id": "1576898", "to_node_id": "1576525", "b1": { "x": 1235.776382408843, "y": 1741.3470458984375 }, "b2": { "x": 1280.4546812716637, "y": 1587.43115234375 } }, "418": { "from_node_id": "1576898", "to_node_id": "1576575", "b1": { "y": 1735, "x": 1318.2979239002893 }, "b2": { "x": 1312.7516245895065, "y": 1735 } } } }, "1576733": { "name": "fructose-bisphosphate aldolase", "bigg_id": "FBA", "reversibility": true, "label_x": 969.7942504882812, "label_y": 2031.01611328125, "gene_reaction_rule": "(b2097 or b1773 or b2925)", "genes": [{ "bigg_id": "b2097", "name": "b2097" }, { "bigg_id": "b1773", "name": "b1773" }, { "bigg_id": "b2925", "name": "b2925" }], "metabolites": [{ "coefficient": 1, "bigg_id": "dhap_c" }, { "coefficient": -1, "bigg_id": "fdp_c" }, { "coefficient": 1, "bigg_id": "g3p_c" }], "segments": { "53": { "from_node_id": "1576926", "to_node_id": "1576925", "b1": null, "b2": null }, "54": { "from_node_id": "1576925", "to_node_id": "1576575", "b1": { "y": 2067.5, "x": 1055 }, "b2": { "y": 2120, "x": 1055 } }, "55": { "from_node_id": "1576925", "to_node_id": "1576601", "b1": { "y": 2082.5, "x": 1055 }, "b2": { "x": 929.645751953125, "y": 2081.141357421875 } }, "475": { "from_node_id": "1576529", "to_node_id": "1576926", "b1": { "x": 1055, "y": 1970.4088134765625 }, "b2": { "x": 1055, "y": 1974.28076171875 } } } }, "1576734": { "name": "triose-phosphate isomerase", "bigg_id": "TPI", "reversibility": true, "label_x": 936.438232421875, "label_y": 2245.297119140625, "gene_reaction_rule": "b3919", "genes": [{ "bigg_id": "b3919", "name": "b3919" }], "metabolites": [{ "coefficient": -1, "bigg_id": "dhap_c" }, { "coefficient": 1, "bigg_id": "g3p_c" }], "segments": { "56": { "from_node_id": "1576601", "to_node_id": "1576927", "b1": { "x": 911.255859375, "y": 2195 }, "b2": { "x": 911.3470458984375, "y": 2195 } }, "57": { "from_node_id": "1576927", "to_node_id": "1576575", "b1": { "y": 2195, "x": 970 }, "b2": { "y": 2195, "x": 1005 } } } }, "1576736": { "name": "ribose-5-phosphate isomerase", "bigg_id": "RPI", "reversibility": true, "label_x": 2315, "label_y": 1415, "gene_reaction_rule": "( b2914  or  b4090 )", "genes": [{ "bigg_id": "b2914", "name": "b2914" }, { "bigg_id": "b4090", "name": "b4090" }], "metabolites": [{ "coefficient": 1, "bigg_id": "ru5p__D_c" }, { "coefficient": -1, "bigg_id": "r5p_c" }], "segments": { "66": { "from_node_id": "1576605", "to_node_id": "1576931", "b1": { "y": 1535.5, "x": 2401.9 }, "b2": { "y": 1490, "x": 2362 } }, "67": { "from_node_id": "1576931", "to_node_id": "1576493", "b1": { "y": 1401, "x": 2282.5 }, "b2": { "y": 1345, "x": 2230 } } } }, "1576743": { "name": "glucose 6-phosphate dehydrogenase", "bigg_id": "G6PDH2r", "reversibility": true, "label_x": 1261.46337890625, "label_y": 1320.0572509765625, "gene_reaction_rule": "b1852", "genes": [{ "bigg_id": "b1852", "name": "b1852" }], "metabolites": [{ "coefficient": -1, "bigg_id": "nadp_c" }, { "coefficient": 1, "bigg_id": "nadph_c" }, { "coefficient": 1, "bigg_id": "h_c" }, { "coefficient": 1, "bigg_id": "6pgl_c" }, { "coefficient": -1, "bigg_id": "g6p_c" }], "segments": { "98": { "from_node_id": "1576946", "to_node_id": "1576945", "b1": null, "b2": null }, "99": { "from_node_id": "1576945", "to_node_id": "1576944", "b1": null, "b2": null }, "100": { "from_node_id": "1576623", "to_node_id": "1576946", "b1": { "y": 1265, "x": 1232.3991758303962 }, "b2": { "y": 1265, "x": 1270.6197527491188 } }, "101": { "from_node_id": "1576524", "to_node_id": "1576946", "b1": { "y": 1265, "x": 1171 }, "b2": { "y": 1265, "x": 1252.2 } }, "102": { "from_node_id": "1576944", "to_node_id": "1576624", "b1": { "y": 1265, "x": 1346.800568173666 }, "b2": { "y": 1265, "x": 1393.0018939122203 } }, "103": { "from_node_id": "1576944", "to_node_id": "1576625", "b1": { "y": 1265, "x": 1343.3802472508812 }, "b2": { "y": 1265, "x": 1381.6008241696038 } }, "104": { "from_node_id": "1576944", "to_node_id": "1576626", "b1": { "y": 1265, "x": 1354 }, "b2": { "y": 1265, "x": 1417 } } } }, "1576751": { "name": "transketolase", "bigg_id": "TKT1", "reversibility": true, "label_x": 2185, "label_y": 1685, "gene_reaction_rule": "( b2935  or  b2465 )", "genes": [{ "bigg_id": "b2935", "name": "b2935" }, { "bigg_id": "b2465", "name": "b2465" }], "metabolites": [{ "coefficient": -1, "bigg_id": "xu5p__D_c" }, { "coefficient": -1, "bigg_id": "r5p_c" }, { "coefficient": 1, "bigg_id": "g3p_c" }, { "coefficient": 1, "bigg_id": "s7p_c" }], "segments": { "138": { "from_node_id": "1576964", "to_node_id": "1576965", "b1": null, "b2": null }, "139": { "from_node_id": "1576965", "to_node_id": "1576966", "b1": null, "b2": null }, "140": { "from_node_id": "1576605", "to_node_id": "1576964", "b1": { "x": 2171.826416015625, "y": 1557.80791851959 }, "b2": { "y": 1605.9896167668144, "x": 2175 } }, "141": { "from_node_id": "1576558", "to_node_id": "1576964", "b1": { "x": 2171.82666015625, "y": 1558.0047151164654 }, "b2": { "y": 1607.9527328943145, "x": 2175 } }, "142": { "from_node_id": "1576966", "to_node_id": "1576546", "b1": { "x": 2173.413330078125, "y": 1823.819109636181 }, "b2": { "x": 2070.2734375, "y": 1816.322080948729 } }, "143": { "from_node_id": "1576966", "to_node_id": "1576545", "b1": { "x": 2175, "y": 1822.232439714306 }, "b2": { "x": 2297.1806640625, "y": 1821.0824569252916 } } } }, "1576755": { "name": "D-Glucose exchange", "bigg_id": "EX_glc_e", "reversibility": false, "label_x": 1082.5206298828125, "label_y": 598.4705200195312, "gene_reaction_rule": "", "genes": [], "metabolites": [{ "coefficient": -1, "bigg_id": "glc__D_e" }], "segments": { "157": { "from_node_id": "1576647", "to_node_id": "1576974", "b1": { "x": 1055.066162109375, "y": 625.4632568359375 }, "b2": { "x": 1056.6529541015625, "y": 623.4132690429688 } } } }, "1576757": { "name": "phosphoglycerate mutase", "bigg_id": "PGM", "reversibility": true, "label_x": 1065, "label_y": 2985, "gene_reaction_rule": "(b3612 or b4395 or b0755)", "genes": [{ "bigg_id": "b3612", "name": "b3612" }, { "bigg_id": "b4395", "name": "b4395" }, { "bigg_id": "b0755", "name": "b0755" }], "metabolites": [{ "coefficient": 1, "bigg_id": "3pg_c" }, { "coefficient": -1, "bigg_id": "2pg_c" }], "segments": { "166": { "from_node_id": "1576978", "to_node_id": "1576486", "b1": { "y": 2977, "x": 1055 }, "b2": { "y": 2935, "x": 1055 } } } }, "1576765": { "name": "D-glucose transport via PEP:Pyr PTS", "bigg_id": "GLCpts", "reversibility": false, "label_x": 1074.520263671875, "label_y": 929.0499877929688, "gene_reaction_rule": "((b2417 and b1101 and b2415 and b2416) or (b1817 and b1818 and b1819 and b2415 and b2416) or (b2417 and b1621 and b2415 and b2416))", "genes": [{ "bigg_id": "b2417", "name": "b2417" }, { "bigg_id": "b1101", "name": "b1101" }, { "bigg_id": "b2415", "name": "b2415" }, { "bigg_id": "b2416", "name": "b2416" }, { "bigg_id": "b1817", "name": "b1817" }, { "bigg_id": "b1818", "name": "b1818" }, { "bigg_id": "b1819", "name": "b1819" }, { "bigg_id": "b2415", "name": "b2415" }, { "bigg_id": "b2416", "name": "b2416" }, { "bigg_id": "b2417", "name": "b2417" }, { "bigg_id": "b1621", "name": "b1621" }, { "bigg_id": "b2415", "name": "b2415" }, { "bigg_id": "b2416", "name": "b2416" }], "metabolites": [{ "coefficient": 1, "bigg_id": "g6p_c" }, { "coefficient": 1, "bigg_id": "pyr_c" }, { "coefficient": -1, "bigg_id": "pep_c" }, { "coefficient": -1, "bigg_id": "glc__D_e" }], "segments": { "199": { "from_node_id": "1576998", "to_node_id": "1576997", "b1": null, "b2": null }, "200": { "from_node_id": "1576997", "to_node_id": "1576999", "b1": null, "b2": null }, "201": { "from_node_id": "1576662", "to_node_id": "1576998", "b1": { "x": 962.100078544998, "y": 817.6128620109578 }, "b2": { "x": 1056.2982974892807, "y": 830.8607140720374 } }, "202": { "from_node_id": "1576647", "to_node_id": "1576998", "b1": { "x": 1054.4691636917553, "y": 841.218336226978 }, "b2": { "x": 1054.6540059434642, "y": 852.0646158583277 } }, "203": { "from_node_id": "1576999", "to_node_id": "1576663", "b1": { "x": 1056.5867919921875, "y": 1155.6497636747395 }, "b2": { "x": 1162.89990234375, "y": 1091.99109457335 } }, "204": { "from_node_id": "1576999", "to_node_id": "1576524", "b1": { "x": 1056.5867919921875, "y": 1156.4998046875 }, "b2": { "x": 1055, "y": 1159.3526000976562 } } } }, "1576768": { "name": "6-phosphogluconolactonase", "bigg_id": "PGL", "reversibility": false, "label_x": 1599.3970947265625, "label_y": 1312.1234130859375, "gene_reaction_rule": "b0767", "genes": [{ "bigg_id": "b0767", "name": "b0767" }], "metabolites": [{ "coefficient": -1, "bigg_id": "h2o_c" }, { "coefficient": -1, "bigg_id": "6pgl_c" }, { "coefficient": 1, "bigg_id": "h_c" }, { "coefficient": 1, "bigg_id": "6pgc_c" }], "segments": { "211": { "from_node_id": "1577005", "to_node_id": "1577003", "b1": null, "b2": null }, "212": { "from_node_id": "1577003", "to_node_id": "1577004", "b1": null, "b2": null }, "213": { "from_node_id": "1576626", "to_node_id": "1577005", "b1": { "y": 1265, "x": 1562 }, "b2": { "y": 1265, "x": 1600.5 } }, "214": { "from_node_id": "1576667", "to_node_id": "1577005", "b1": { "y": 1265, "x": 1562.3991758303962 }, "b2": { "y": 1265, "x": 1600.6197527491188 } }, "215": { "from_node_id": "1577004", "to_node_id": "1576668", "b1": { "y": 1265, "x": 1673.3802472508812 }, "b2": { "y": 1265, "x": 1711.6008241696038 } }, "216": { "from_node_id": "1577004", "to_node_id": "1576490", "b1": { "y": 1265, "x": 1682.5 }, "b2": { "y": 1265, "x": 1742 } } } }, "1576769": { "name": "glyceraldehyde-3-phosphate dehydrogenase", "bigg_id": "GAPD", "reversibility": true, "label_x": 1065, "label_y": 2385, "gene_reaction_rule": "b1779", "genes": [{ "bigg_id": "b1779", "name": "gapA" }], "metabolites": [{ "coefficient": 1, "bigg_id": "nadh_c" }, { "coefficient": 1, "bigg_id": "13dpg_c" }, { "coefficient": -1, "bigg_id": "pi_c" }, { "coefficient": 1, "bigg_id": "h_c" }, { "coefficient": -1, "bigg_id": "nad_c" }, { "coefficient": -1, "bigg_id": "g3p_c" }], "segments": { "217": { "from_node_id": "1577006", "to_node_id": "1577008", "b1": null, "b2": null }, "218": { "from_node_id": "1577008", "to_node_id": "1577007", "b1": null, "b2": null }, "219": { "from_node_id": "1576575", "to_node_id": "1577006", "b1": { "y": 2270, "x": 1055 }, "b2": { "y": 2322.5, "x": 1055 } }, "220": { "from_node_id": "1576669", "to_node_id": "1577006", "b1": { "y": 2284.7920271060384, "x": 1055 }, "b2": { "y": 2326.9376081318114, "x": 1055 } }, "221": { "from_node_id": "1576670", "to_node_id": "1577006", "b1": { "y": 2297.5658350974745, "x": 1055 }, "b2": { "y": 2330.769750529242, "x": 1055 } }, "222": { "from_node_id": "1577007", "to_node_id": "1576487", "b1": { "y": 2454.5, "x": 1055 }, "b2": { "y": 2500, "x": 1055 } }, "223": { "from_node_id": "1577007", "to_node_id": "1576671", "b1": { "y": 2453.0623918681886, "x": 1055 }, "b2": { "y": 2495.2079728939616, "x": 1055 } }, "224": { "from_node_id": "1577007", "to_node_id": "1576672", "b1": { "y": 2449.230249470758, "x": 1055 }, "b2": { "y": 2482.4341649025255, "x": 1055 } } } } }, "nodes": { "1576485": { "node_type": "metabolite", "x": 1145, "y": 2805, "bigg_id": "atp_c", "name": "ATP", "label_x": 1165, "label_y": 2805, "node_is_primary": false }, "1576486": { "node_type": "metabolite", "x": 1055, "y": 2875, "bigg_id": "3pg_c", "name": "3-Phospho-D-glycerate", "label_x": 1085, "label_y": 2875, "node_is_primary": true }, "1576487": { "node_type": "metabolite", "x": 1055, "y": 2565, "bigg_id": "13dpg_c", "name": "3-Phospho-D-glyceroyl-phosphate", "label_x": 1085, "label_y": 2565, "node_is_primary": true }, "1576488": { "node_type": "metabolite", "x": 1145, "y": 2635, "bigg_id": "adp_c", "name": "ADP", "label_x": 1165, "label_y": 2635, "node_is_primary": false }, "1576489": { "node_type": "metabolite", "x": 1907, "y": 1165, "bigg_id": "nadp_c", "name": "Nicotinamide-adenine-dinucleotide-phosphate", "label_x": 1907, "label_y": 1145, "node_is_primary": false }, "1576490": { "node_type": "metabolite", "x": 1827, "y": 1265, "bigg_id": "6pgc_c", "name": "6-Phospho-D-gluconate", "label_x": 1800.0250244140625, "label_y": 1235, "node_is_primary": true }, "1576491": { "node_type": "metabolite", "x": 2007, "y": 1165, "bigg_id": "co2_c", "name": "CO2", "label_x": 2007, "label_y": 1145, "node_is_primary": false }, "1576492": { "node_type": "metabolite", "x": 2057, "y": 1165, "bigg_id": "nadph_c", "name": "Nicotinamide-adenine-dinucleotide-phosphate-reduced", "label_x": 2080, "label_y": 1140, "node_is_primary": false }, "1576493": { "node_type": "metabolite", "x": 2155, "y": 1265, "bigg_id": "ru5p__D_c", "name": "D-Ribulose-5-phosphate", "label_x": 2155, "label_y": 1235, "node_is_primary": true }, "1576524": { "node_type": "metabolite", "x": 1055, "y": 1265, "bigg_id": "g6p_c", "name": "D-Glucose-6-phosphate", "label_x": 1075, "label_y": 1245, "node_is_primary": true }, "1576525": { "node_type": "metabolite", "x": 1055, "y": 1545, "bigg_id": "f6p_c", "name": "D-Fructose-6-phosphate", "label_x": 1075, "label_y": 1525, "node_is_primary": true }, "1576528": { "node_type": "metabolite", "x": 765, "y": 1855, "bigg_id": "h2o_c", "name": "H2O", "label_x": 672.9427490234375, "label_y": 1861.3470458984375, "node_is_primary": false }, "1576529": { "node_type": "metabolite", "x": 1055, "y": 1925, "bigg_id": "fdp_c", "name": "D-Fructose-1-6-bisphosphate", "label_x": 1096.404296875, "label_y": 1928.173583984375, "node_is_primary": true }, "1576530": { "node_type": "metabolite", "x": 755, "y": 1565, "bigg_id": "pi_c", "name": "Phosphate", "label_x": 686.744140625, "label_y": 1563.4132080078125, "node_is_primary": false }, "1576545": { "node_type": "metabolite", "x": 2358.984130859375, "y": 1865, "bigg_id": "g3p_c", "name": "Glyceraldehyde-3-phosphate", "label_x": 2375.091552734375, "label_y": 1898.4132080078125, "node_is_primary": true }, "1576546": { "node_type": "metabolite", "x": 1983.082275390625, "y": 1865, "bigg_id": "s7p_c", "name": "Sedoheptulose-7-phosphate", "label_x": 1955.8675537109375, "label_y": 1814.314697265625, "node_is_primary": true }, "1576547": { "node_type": "metabolite", "x": 1945, "y": 2190, "bigg_id": "e4p_c", "name": "D-Erythrose-4-phosphate", "label_x": 1922.7852783203125, "label_y": 2242.214599609375, "node_is_primary": true }, "1576548": { "node_type": "metabolite", "x": 2362.636962890625, "y": 2186.826416015625, "bigg_id": "f6p_c", "name": "D-Fructose-6-phosphate", "label_x": 2367.636962890625, "label_y": 2216.826416015625, "node_is_primary": true }, "1576558": { "node_type": "metabolite", "x": 1945, "y": 1555, "bigg_id": "xu5p__D_c", "name": "D-Xylulose-5-phosphate", "label_x": 1944.76025390625, "label_y": 1599.5205078125, "node_is_primary": true }, "1576572": { "node_type": "metabolite", "x": 1145, "y": 1645, "bigg_id": "atp_c", "name": "ATP", "label_x": 1165, "label_y": 1645, "node_is_primary": false }, "1576573": { "node_type": "metabolite", "x": 1145, "y": 1805, "bigg_id": "adp_c", "name": "ADP", "label_x": 1165, "label_y": 1805, "node_is_primary": false }, "1576574": { "node_type": "metabolite", "x": 1145, "y": 1855, "bigg_id": "h_c", "name": "H", "label_x": 1165, "label_y": 1855, "node_is_primary": false }, "1576575": { "node_type": "metabolite", "x": 1055, "y": 2195, "bigg_id": "g3p_c", "name": "Glyceraldehyde-3-phosphate", "label_x": 1085, "label_y": 2195, "node_is_primary": true }, "1576601": { "node_type": "metabolite", "x": 855, "y": 2195, "bigg_id": "dhap_c", "name": "Dihydroxyacetone-phosphate", "label_x": 739.3148193359375, "label_y": 2179.132568359375, "node_is_primary": true }, "1576605": { "node_type": "metabolite", "x": 2419, "y": 1555, "bigg_id": "r5p_c", "name": "alpha-D-Ribose-5-phosphate", "label_x": 2418.413330078125, "label_y": 1601.1072998046875, "node_is_primary": true }, "1576623": { "node_type": "metabolite", "x": 1257, "y": 1160, "bigg_id": "nadp_c", "name": "Nicotinamide-adenine-dinucleotide-phosphate", "label_x": 1257, "label_y": 1140, "node_is_primary": false }, "1576624": { "node_type": "metabolite", "x": 1407, "y": 1160, "bigg_id": "nadph_c", "name": "Nicotinamide-adenine-dinucleotide-phosphate-reduced", "label_x": 1430, "label_y": 1140, "node_is_primary": false }, "1576625": { "node_type": "metabolite", "x": 1357, "y": 1160, "bigg_id": "h_c", "name": "H", "label_x": 1357, "label_y": 1140, "node_is_primary": false }, "1576626": { "node_type": "metabolite", "x": 1507, "y": 1265, "bigg_id": "6pgl_c", "name": "6-phospho-D-glucono-1-5-lactone", "label_x": 1507, "label_y": 1235, "node_is_primary": true }, "1576647": { "node_type": "metabolite", "x": 1055.066162109375, "y": 705, "bigg_id": "glc__D_e", "name": "D-Glucose", "label_x": 1085.066162109375, "label_y": 705, "node_is_primary": true }, "1576662": { "node_type": "metabolite", "x": 957.694091796875, "y": 974.4060668945312, "bigg_id": "pep_c", "name": "Phosphoenolpyruvate", "label_x": 877.8765258789062, "label_y": 976.9517211914062, "node_is_primary": false }, "1576663": { "node_type": "metabolite", "x": 1161.3470458984375, "y": 972.8192138671875, "bigg_id": "pyr_c", "name": "Pyruvate", "label_x": 1193.082275390625, "label_y": 986.47216796875, "node_is_primary": false }, "1576667": { "node_type": "metabolite", "x": 1587, "y": 1160, "bigg_id": "h2o_c", "name": "H2O", "label_x": 1587, "label_y": 1140, "node_is_primary": false }, "1576668": { "node_type": "metabolite", "x": 1687, "y": 1160, "bigg_id": "h_c", "name": "H", "label_x": 1687, "label_y": 1140, "node_is_primary": false }, "1576669": { "node_type": "metabolite", "x": 1145, "y": 2265, "bigg_id": "nad_c", "name": "Nicotinamide-adenine-dinucleotide", "label_x": 1165, "label_y": 2265, "node_is_primary": false }, "1576670": { "node_type": "metabolite", "x": 1145, "y": 2315, "bigg_id": "pi_c", "name": "Phosphate", "label_x": 1165, "label_y": 2315, "node_is_primary": false }, "1576671": { "node_type": "metabolite", "x": 1145, "y": 2515, "bigg_id": "nadh_c", "name": "Nicotinamide-adenine-dinucleotide-reduced", "label_x": 1165, "label_y": 2515, "node_is_primary": false }, "1576672": { "node_type": "metabolite", "x": 1145, "y": 2465, "bigg_id": "h_c", "name": "H", "label_x": 1169, "label_y": 2465, "node_is_primary": false }, "1576834": { "node_type": "multimarker", "x": 1055, "y": 2665 }, "1576835": { "node_type": "multimarker", "x": 1055, "y": 2775 }, "1576836": { "node_type": "midmarker", "x": 1055, "y": 2725 }, "1576837": { "node_type": "midmarker", "x": 1957, "y": 1265 }, "1576838": { "node_type": "multimarker", "x": 1937, "y": 1265 }, "1576839": { "node_type": "multimarker", "x": 1977, "y": 1265 }, "1576857": { "node_type": "midmarker", "x": 1055, "y": 1395 }, "1576859": { "node_type": "midmarker", "x": 835, "y": 1715 }, "1576860": { "node_type": "multimarker", "x": 835, "y": 1665 }, "1576861": { "node_type": "multimarker", "x": 835, "y": 1765 }, "1576872": { "node_type": "midmarker", "x": 2178, "y": 1995 }, "1576873": { "node_type": "multimarker", "x": 2175, "y": 1955 }, "1576874": { "node_type": "multimarker", "x": 2178, "y": 2035 }, "1576885": { "node_type": "midmarker", "x": 2045, "y": 1415 }, "1576891": { "node_type": "midmarker", "x": 1055, "y": 1735 }, "1576892": { "node_type": "multimarker", "x": 1055, "y": 1775 }, "1576893": { "node_type": "multimarker", "x": 1055, "y": 1690 }, "1576896": { "node_type": "midmarker", "x": 1525, "y": 1735 }, "1576897": { "node_type": "multimarker", "x": 1695, "y": 1735 }, "1576898": { "node_type": "multimarker", "x": 1405, "y": 1735 }, "1576925": { "node_type": "multimarker", "x": 1055, "y": 2045 }, "1576926": { "node_type": "midmarker", "x": 1055, "y": 1995 }, "1576927": { "node_type": "midmarker", "x": 955, "y": 2195 }, "1576931": { "node_type": "midmarker", "x": 2305, "y": 1425 }, "1576944": { "node_type": "multimarker", "x": 1327, "y": 1265 }, "1576945": { "node_type": "midmarker", "x": 1307, "y": 1265 }, "1576946": { "node_type": "multimarker", "x": 1287, "y": 1265 }, "1576964": { "node_type": "multimarker", "x": 2175, "y": 1645 }, "1576965": { "node_type": "midmarker", "x": 2175, "y": 1695 }, "1576966": { "node_type": "multimarker", "x": 2175, "y": 1735 }, "1576974": { "node_type": "midmarker", "x": 1056.6529541015625, "y": 543.4132690429688 }, "1576978": { "node_type": "midmarker", "x": 1055, "y": 2995 }, "1576997": { "node_type": "midmarker", "x": 1056.5865478515625, "y": 1008.8675537109375 }, "1576998": { "node_type": "multimarker", "x": 1057, "y": 976.1735229492188 }, "1576999": { "node_type": "multimarker", "x": 1056.5867919921875, "y": 1041.710205078125 }, "1577003": { "node_type": "midmarker", "x": 1637, "y": 1265 }, "1577004": { "node_type": "multimarker", "x": 1657, "y": 1265 }, "1577005": { "node_type": "multimarker", "x": 1617, "y": 1265 }, "1577006": { "node_type": "multimarker", "x": 1055, "y": 2345 }, "1577007": { "node_type": "multimarker", "x": 1055, "y": 2435 }, "1577008": { "node_type": "midmarker", "x": 1055, "y": 2395 } }, "text_labels": { "1": { "text": "TEST", "x": 1431.12646484375, "y": 2509.4140625, "text_label_id": "1" } }, "canvas": { "x": 522.1247779846192, "y": 314.36893920898433, "width": 2269.555348968506, "height": 2815.9292053222653 } }];
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Returns a test model */

module.exports = function () {
    return { "reactions": [{ "subsystem": "Pyruvate Metabolism", "name": "acetaldehyde dehydrogenase (acetylating)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "accoa_c": 1.0, "acald_c": -1.0, "coa_c": -1.0, "h_c": 1.0, "nad_c": -1.0, "nadh_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ACALD", "gene_reaction_rule": "(b0351 or b1241)" }, { "subsystem": "Transport, Extracellular", "name": "acetaldehyde reversible transport", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "acald_c": 1.0, "acald_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ACALDt", "gene_reaction_rule": "s0001" }, { "subsystem": "Pyruvate Metabolism", "name": "acetate kinase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "ac_c": -1.0, "actp_c": 1.0, "adp_c": 1.0, "atp_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ACKr", "gene_reaction_rule": "(b3115 or b2296 or b1849)" }, { "subsystem": "Citric Acid Cycle", "name": "aconitase (half-reaction A, Citrate hydro-lyase)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "h2o_c": 1.0, "acon_C_c": 1.0, "cit_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ACONTa", "gene_reaction_rule": "(b0118 or b1276)" }, { "subsystem": "Citric Acid Cycle", "name": "aconitase (half-reaction B, Isocitrate hydro-lyase)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "icit_c": 1.0, "acon_C_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ACONTb", "gene_reaction_rule": "(b0118 or b1276)" }, { "subsystem": "Transport, Extracellular", "name": "acetate reversible transport via proton symport", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "ac_c": 1.0, "h_e": -1.0, "ac_e": -1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ACt2r", "gene_reaction_rule": "" }, { "subsystem": "Oxidative Phosphorylation", "name": "adenylate kinase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "amp_c": -1.0, "atp_c": -1.0, "adp_c": 2.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ADK1", "gene_reaction_rule": "b0474" }, { "subsystem": "Citric Acid Cycle", "name": "2-Oxoglutarate dehydrogenase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "akg_c": -1.0, "nadh_c": 1.0, "succoa_c": 1.0, "coa_c": -1.0, "nad_c": -1.0, "co2_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "AKGDH", "gene_reaction_rule": "( b0116  and  b0726  and  b0727 )" }, { "subsystem": "Transport, Extracellular", "name": "2-oxoglutarate reversible transport via symport", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "akg_c": 1.0, "h_e": -1.0, "h_c": 1.0, "akg_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "AKGt2r", "gene_reaction_rule": "b2587" }, { "subsystem": "Pyruvate Metabolism", "name": "alcohol dehydrogenase (ethanol)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "acald_c": 1.0, "nadh_c": 1.0, "nad_c": -1.0, "etoh_c": -1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ALCD2x", "gene_reaction_rule": "(b0356 or b1478 or b1241)" }, { "subsystem": "Oxidative Phosphorylation", "name": "ATP maintenance requirement", "upper_bound": 1000.0, "lower_bound": 8.39, "notes": {}, "metabolites": { "h2o_c": -1.0, "pi_c": 1.0, "atp_c": -1.0, "adp_c": 1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ATPM", "gene_reaction_rule": "" }, { "subsystem": "Oxidative Phosphorylation", "name": "ATP synthase (four protons for one ATP)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "h2o_c": 1.0, "atp_c": 1.0, "h_e": -4.0, "h_c": 3.0, "adp_c": -1.0, "pi_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ATPS4r", "gene_reaction_rule": "(((b3736 and b3737 and b3738) and (b3731 and b3732 and b3733 and b3734 and b3735)) or ((b3736 and b3737 and b3738) and (b3731 and b3732 and b3733 and b3734 and b3735) and b3739))" }, { "subsystem": "", "name": "Biomass Objective Function with GAM", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h2o_c": -59.81, "adp_c": 59.81, "glu__L_c": -4.9414, "g3p_c": -0.129, "e4p_c": -0.361, "h_c": 59.81, "r5p_c": -0.8977, "atp_c": -59.81, "f6p_c": -0.0709, "pyr_c": -2.8328, "nad_c": -3.547, "coa_c": 3.7478, "oaa_c": -1.7867, "g6p_c": -0.205, "nadh_c": 3.547, "akg_c": 4.1182, "accoa_c": -3.7478, "3pg_c": -1.496, "pep_c": -0.5191, "gln__L_c": -0.2557, "nadp_c": 13.0279, "nadph_c": -13.0279, "pi_c": 59.81 }, "objective_coefficient": 1.0, "variable_kind": "continuous", "id": "Biomass_Ecoli_core_w_GAM", "gene_reaction_rule": "" }, { "subsystem": "Transport, Extracellular", "name": "CO2 transporter via diffusion", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "co2_c": 1.0, "co2_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "CO2t", "gene_reaction_rule": "s0001" }, { "subsystem": "Citric Acid Cycle", "name": "citrate synthase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "accoa_c": -1.0, "cit_c": 1.0, "coa_c": 1.0, "h_c": 1.0, "oaa_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "CS", "gene_reaction_rule": "b0720" }, { "subsystem": "Oxidative Phosphorylation", "name": "cytochrome oxidase bd (ubiquinol-8: 2 protons)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "o2_c": -0.5, "h2o_c": 1.0, "q8h2_c": -1.0, "h_e": 2.0, "h_c": -2.0, "q8_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "CYTBD", "gene_reaction_rule": "((b0978 and b0979) or (b0733 and b0734))" }, { "subsystem": "Transport, Extracellular", "name": "D-lactate transport via proton symport", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "lac__D_e": -1.0, "h_e": -1.0, "lac__D_c": 1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "D_LACt2", "gene_reaction_rule": "( b2975  or  b3603 )" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "enolase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "pep_c": 1.0, "h2o_c": 1.0, "2pg_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ENO", "gene_reaction_rule": "b2779" }, { "subsystem": "Transport, Extracellular", "name": "ethanol reversible transport via proton symport", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "etoh_e": -1.0, "h_e": -1.0, "h_c": 1.0, "etoh_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ETOHt2r", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Acetate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "ac_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_ac_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Acetaldehyde exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "acald_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_acald_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "2-Oxoglutarate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "akg_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_akg_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "CO2 exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "co2_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_co2_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Ethanol exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "etoh_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_etoh_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Formate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "for_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_for_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "D-Fructose exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "fru_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_fru_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Fumarate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "fum_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_fum_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "D-Glucose exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "glc__D_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_glc_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "L-Glutamine exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "gln__L_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_gln__L_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "L-Glutamate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "glu__L_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_glu__L_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "H+ exchange", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "h_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_h_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "H2O exchange", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "h2o_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_h2o_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "D-Lactate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "lac__D_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_lac__D_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "L-Malate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "mal__L_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_mal__L_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Ammonium exchange", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "nh4_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_nh4_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "O2 exchange", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "o2_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_o2_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Phosphate exchange", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "pi_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_pi_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Pyruvate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "pyr_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_pyr_e", "gene_reaction_rule": "" }, { "subsystem": "Exchange", "name": "Succinate exchange", "upper_bound": 1000.0, "lower_bound": 0, "notes": {}, "metabolites": { "succ_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "EX_succ_e", "gene_reaction_rule": "" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "fructose-bisphosphate aldolase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "dhap_c": 1.0, "fdp_c": -1.0, "g3p_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "FBA", "gene_reaction_rule": "(b2097 or b1773 or b2925)" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "fructose-bisphosphatase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "pi_c": 1.0, "fdp_c": -1.0, "f6p_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "FBP", "gene_reaction_rule": "(b3925 or b4232)" }, { "subsystem": "Transport, Extracellular", "name": "formate transport via proton symport (uptake only)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "for_e": -1.0, "h_e": -1.0, "h_c": 1.0, "for_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "FORt2", "gene_reaction_rule": "(b0904 or b2492)" }, { "subsystem": "Transport, Extracellular", "name": "formate transport via diffusion", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "for_e": 1.0, "for_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "FORti", "gene_reaction_rule": "(b0904 or b2492)" }, { "subsystem": "Oxidative Phosphorylation", "name": "fumarate reductase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "q8h2_c": -1.0, "succ_c": 1.0, "fum_c": -1.0, "q8_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "FRD7", "gene_reaction_rule": "(b4151 and b4152 and b4153 and b4154)" }, { "subsystem": "Transport, Extracellular", "name": "Fructose transport via PEP:Pyr PTS (f6p generating)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "pep_c": -1.0, "fru_e": -1.0, "pyr_c": 1.0, "f6p_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "FRUpts2", "gene_reaction_rule": "(b1817 and b1818 and b1819 and b2415 and b2416)" }, { "subsystem": "Citric Acid Cycle", "name": "fumarase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "fum_c": -1.0, "mal__L_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "FUM", "gene_reaction_rule": "( b1612  or  b4122  or  b1611 )" }, { "subsystem": "Transport, Extracellular", "name": "Fumarate transport via proton symport (2 H)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "fum_c": 1.0, "h_e": -2.0, "fum_e": -1.0, "h_c": 2.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "FUMt2_2", "gene_reaction_rule": "b3528" }, { "subsystem": "Pentose Phosphate Pathway", "name": "glucose 6-phosphate dehydrogenase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "6pgl_c": 1.0, "g6p_c": -1.0, "nadp_c": -1.0, "nadph_c": 1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "G6PDH2r", "gene_reaction_rule": "b1852" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "glyceraldehyde-3-phosphate dehydrogenase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "nadh_c": 1.0, "nad_c": -1.0, "g3p_c": -1.0, "h_c": 1.0, "13dpg_c": 1.0, "pi_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GAPD", "gene_reaction_rule": "b1779" }, { "subsystem": "Transport, Extracellular", "name": "D-glucose transport via PEP:Pyr PTS", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "pep_c": -1.0, "pyr_c": 1.0, "g6p_c": 1.0, "glc__D_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GLCpts", "gene_reaction_rule": "((b2417 and b1101 and b2415 and b2416) or (b1817 and b1818 and b1819 and b2415 and b2416) or (b2417 and b1621 and b2415 and b2416))" }, { "subsystem": "Glutamate Metabolism", "name": "glutamine synthetase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "atp_c": -1.0, "glu__L_c": -1.0, "h_c": 1.0, "adp_c": 1.0, "pi_c": 1.0, "nh4_c": -1.0, "gln__L_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GLNS", "gene_reaction_rule": "(b3870 or b1297)" }, { "subsystem": "Transport, Extracellular", "name": "L-glutamine transport via ABC system", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "atp_c": -1.0, "h_c": 1.0, "adp_c": 1.0, "gln__L_e": -1.0, "pi_c": 1.0, "gln__L_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GLNabc", "gene_reaction_rule": "(b0811 and b0810 and b0809)" }, { "subsystem": "Glutamate Metabolism", "name": "glutamate dehydrogenase (NADP)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "akg_c": 1.0, "h2o_c": -1.0, "nadp_c": -1.0, "nadph_c": 1.0, "glu__L_c": -1.0, "h_c": 1.0, "nh4_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GLUDy", "gene_reaction_rule": "b1761" }, { "subsystem": "Glutamate Metabolism", "name": "glutaminase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "glu__L_c": 1.0, "nh4_c": 1.0, "gln__L_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GLUN", "gene_reaction_rule": "(b1812 or b0485 or b1524)" }, { "subsystem": "Glutamate Metabolism", "name": "glutamate synthase (NADPH)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "akg_c": -1.0, "nadp_c": 1.0, "nadph_c": -1.0, "glu__L_c": 2.0, "h_c": -1.0, "gln__L_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GLUSy", "gene_reaction_rule": "(b3212 and b3213)" }, { "subsystem": "Transport, Extracellular", "name": "L-glutamate transport via proton symport, reversible (periplasm)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "glu__L_c": 1.0, "h_e": -1.0, "glu__L_e": -1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GLUt2r", "gene_reaction_rule": "b4077" }, { "subsystem": "Pentose Phosphate Pathway", "name": "phosphogluconate dehydrogenase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "6pgc_c": -1.0, "co2_c": 1.0, "nadph_c": 1.0, "nadp_c": -1.0, "ru5p__D_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "GND", "gene_reaction_rule": "b2029" }, { "subsystem": "Transport, Extracellular", "name": "H2O transport via diffusion", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "h2o_c": 1.0, "h2o_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "H2Ot", "gene_reaction_rule": "(b0875 or s0001)" }, { "subsystem": "Citric Acid Cycle", "name": "isocitrate dehydrogenase (NADP)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "akg_c": 1.0, "icit_c": -1.0, "co2_c": 1.0, "nadp_c": -1.0, "nadph_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ICDHyr", "gene_reaction_rule": "b1136" }, { "subsystem": "Anaplerotic reactions", "name": "Isocitrate lyase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "succ_c": 1.0, "icit_c": -1.0, "glx_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ICL", "gene_reaction_rule": "b4015" }, { "subsystem": "Pyruvate Metabolism", "name": "D lactate dehydrogenase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "pyr_c": 1.0, "nadh_c": 1.0, "lac__D_c": -1.0, "h_c": 1.0, "nad_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "LDH_D", "gene_reaction_rule": "(b2133 or b1380)" }, { "subsystem": "Anaplerotic reactions", "name": "malate synthase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "mal__L_c": 1.0, "glx_c": -1.0, "h_c": 1.0, "accoa_c": -1.0, "coa_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "MALS", "gene_reaction_rule": "( b4014  or  b2976 )" }, { "subsystem": "Transport, Extracellular", "name": "Malate transport via proton symport (2 H)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "mal__L_c": 1.0, "h_e": -2.0, "mal__L_e": -1.0, "h_c": 2.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "MALt2_2", "gene_reaction_rule": "b3528" }, { "subsystem": "Citric Acid Cycle", "name": "malate dehydrogenase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "mal__L_c": -1.0, "nadh_c": 1.0, "nad_c": -1.0, "oaa_c": 1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "MDH", "gene_reaction_rule": "b3236" }, { "subsystem": "Anaplerotic reactions", "name": "malic enzyme (NAD)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "nad_c": -1.0, "mal__L_c": -1.0, "co2_c": 1.0, "pyr_c": 1.0, "nadh_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ME1", "gene_reaction_rule": "b1479" }, { "subsystem": "Anaplerotic reactions", "name": "malic enzyme (NADP)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "pyr_c": 1.0, "mal__L_c": -1.0, "co2_c": 1.0, "nadph_c": 1.0, "nadp_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "ME2", "gene_reaction_rule": "b2463" }, { "subsystem": "Oxidative Phosphorylation", "name": "NADH dehydrogenase (ubiquinone-8 & 3 protons)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "q8h2_c": 1.0, "h_e": 3.0, "h_c": -4.0, "nad_c": 1.0, "nadh_c": -1.0, "q8_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "NADH16", "gene_reaction_rule": "(b2276 and b2277 and b2278 and b2279 and b2280 and b2281 and b2282 and b2283 and b2284 and b2285 and b2286 and b2287 and b2288)" }, { "subsystem": "Oxidative Phosphorylation", "name": "NAD transhydrogenase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "nadh_c": 1.0, "nadph_c": -1.0, "nadp_c": 1.0, "nad_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "NADTRHD", "gene_reaction_rule": "(b3962 or (b1602 and b1603))" }, { "subsystem": "Inorganic Ion Transport and Metabolism", "name": "ammonia reversible transport", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "nh4_e": -1.0, "nh4_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "NH4t", "gene_reaction_rule": "(s0001 or b0451)" }, { "subsystem": "Transport, Extracellular", "name": "o2 transport via diffusion", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "o2_c": 1.0, "o2_e": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "O2t", "gene_reaction_rule": "s0001" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "pyruvate dehydrogenase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "nadh_c": 1.0, "accoa_c": 1.0, "pyr_c": -1.0, "coa_c": -1.0, "nad_c": -1.0, "co2_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PDH", "gene_reaction_rule": "( b0114  and  b0115  and  b0116 )" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "phosphofructokinase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h_c": 1.0, "atp_c": -1.0, "fdp_c": 1.0, "adp_c": 1.0, "f6p_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PFK", "gene_reaction_rule": "( b3916  or  b1723 )" }, { "subsystem": "Pyruvate Metabolism", "name": "pyruvate formate lyase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "pyr_c": -1.0, "coa_c": -1.0, "accoa_c": 1.0, "for_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PFL", "gene_reaction_rule": "(((b0902 and b0903) and b2579) or (b0902 and b0903) or (b0902 and b3114) or (b3951 and b3952))" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "glucose-6-phosphate isomerase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "g6p_c": -1.0, "f6p_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PGI", "gene_reaction_rule": "b4025" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "phosphoglycerate kinase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "atp_c": -1.0, "13dpg_c": 1.0, "adp_c": 1.0, "3pg_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PGK", "gene_reaction_rule": "b2926" }, { "subsystem": "Pentose Phosphate Pathway", "name": "6-phosphogluconolactonase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "6pgc_c": 1.0, "h2o_c": -1.0, "6pgl_c": -1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PGL", "gene_reaction_rule": "b0767" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "phosphoglycerate mutase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "2pg_c": -1.0, "3pg_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PGM", "gene_reaction_rule": "(b3612 or b4395 or b0755)" }, { "subsystem": "Inorganic Ion Transport and Metabolism", "name": "phosphate reversible transport via proton symport", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "pi_e": -1.0, "h_e": -1.0, "pi_c": 1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PIt2r", "gene_reaction_rule": "(b2987 or b3493)" }, { "subsystem": "Anaplerotic reactions", "name": "phosphoenolpyruvate carboxylase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "co2_c": -1.0, "pep_c": -1.0, "h_c": 1.0, "oaa_c": 1.0, "pi_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PPC", "gene_reaction_rule": "b3956" }, { "subsystem": "Anaplerotic reactions", "name": "phosphoenolpyruvate carboxykinase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "pep_c": 1.0, "co2_c": 1.0, "adp_c": 1.0, "oaa_c": -1.0, "atp_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PPCK", "gene_reaction_rule": "b3403" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "phosphoenolpyruvate synthase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "h2o_c": -1.0, "atp_c": -1.0, "pyr_c": -1.0, "pep_c": 1.0, "amp_c": 1.0, "pi_c": 1.0, "h_c": 2.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PPS", "gene_reaction_rule": "b1702" }, { "subsystem": "Pyruvate Metabolism", "name": "phosphotransacetylase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "actp_c": 1.0, "pi_c": -1.0, "coa_c": 1.0, "accoa_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PTAr", "gene_reaction_rule": "(b2297 or b2458)" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "pyruvate kinase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "pep_c": -1.0, "pyr_c": 1.0, "h_c": -1.0, "adp_c": -1.0, "atp_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PYK", "gene_reaction_rule": "(b1854 or b1676)" }, { "subsystem": "Transport, Extracellular", "name": "pyruvate reversible transport via proton symport", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "pyr_c": 1.0, "h_e": -1.0, "pyr_e": -1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "PYRt2r", "gene_reaction_rule": "" }, { "subsystem": "Pentose Phosphate Pathway", "name": "ribulose 5-phosphate 3-epimerase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "xu5p__D_c": 1.0, "ru5p__D_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "RPE", "gene_reaction_rule": "(b3386 or b4301)" }, { "subsystem": "Pentose Phosphate Pathway", "name": "ribose-5-phosphate isomerase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "r5p_c": -1.0, "ru5p__D_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "RPI", "gene_reaction_rule": "( b2914  or  b4090 )" }, { "subsystem": "Transport, Extracellular", "name": "succinate transport via proton symport (2 H)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "succ_c": 1.0, "h_e": -2.0, "succ_e": -1.0, "h_c": 2.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "SUCCt2_2", "gene_reaction_rule": "b3528" }, { "subsystem": "Transport, Extracellular", "name": "succinate transport out via proton antiport", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "succ_c": -1.0, "h_e": -1.0, "succ_e": 1.0, "h_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "SUCCt3", "gene_reaction_rule": "" }, { "subsystem": "Oxidative Phosphorylation", "name": "succinate dehydrogenase (irreversible)", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "q8h2_c": 1.0, "succ_c": -1.0, "fum_c": 1.0, "q8_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "SUCDi", "gene_reaction_rule": "(b0721 and b0722 and b0723 and b0724)" }, { "subsystem": "Citric Acid Cycle", "name": "succinyl-CoA synthetase (ADP-forming)", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "atp_c": -1.0, "succoa_c": 1.0, "succ_c": -1.0, "coa_c": -1.0, "adp_c": 1.0, "pi_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "SUCOAS", "gene_reaction_rule": "( b0728  and  b0729 )" }, { "subsystem": "Pentose Phosphate Pathway", "name": "transaldolase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "e4p_c": 1.0, "g3p_c": -1.0, "s7p_c": -1.0, "f6p_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "TALA", "gene_reaction_rule": "(b2464 or b0008)" }, { "subsystem": "Oxidative Phosphorylation", "name": "NAD(P) transhydrogenase", "upper_bound": 1000.0, "lower_bound": 0.0, "notes": {}, "metabolites": { "nadp_c": -1.0, "nadph_c": 1.0, "h_e": -2.0, "h_c": 2.0, "nad_c": 1.0, "nadh_c": -1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "THD2", "gene_reaction_rule": "( b1602  and  b1603 )" }, { "subsystem": "Pentose Phosphate Pathway", "name": "transketolase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "r5p_c": -1.0, "xu5p__D_c": -1.0, "g3p_c": 1.0, "s7p_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "TKT1", "gene_reaction_rule": "( b2935  or  b2465 )" }, { "subsystem": "Pentose Phosphate Pathway", "name": "transketolase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "e4p_c": -1.0, "xu5p__D_c": -1.0, "g3p_c": 1.0, "f6p_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "TKT2", "gene_reaction_rule": "( b2935  or  b2465 )" }, { "subsystem": "Glycolysis/Gluconeogenesis", "name": "triose-phosphate isomerase", "upper_bound": 1000.0, "lower_bound": -1000.0, "notes": {}, "metabolites": { "dhap_c": -1.0, "g3p_c": 1.0 }, "objective_coefficient": 0.0, "variable_kind": "continuous", "id": "TPI", "gene_reaction_rule": "b3919" }], "description": "Ecoli_core_model", "notes": {}, "genes": [{ "name": "b1241", "id": "b1241" }, { "name": "b0351", "id": "b0351" }, { "name": "s0001", "id": "s0001" }, { "name": "b3115", "id": "b3115" }, { "name": "b2296", "id": "b2296" }, { "name": "b1849", "id": "b1849" }, { "name": "b1276", "id": "b1276" }, { "name": "b0118", "id": "b0118" }, { "name": "b0474", "id": "b0474" }, { "name": "b0726", "id": "b0726" }, { "name": "b0116", "id": "b0116" }, { "name": "b0727", "id": "b0727" }, { "name": "b2587", "id": "b2587" }, { "name": "b0356", "id": "b0356" }, { "name": "b1478", "id": "b1478" }, { "name": "b3739", "id": "b3739" }, { "name": "b3731", "id": "b3731" }, { "name": "b3736", "id": "b3736" }, { "name": "b3737", "id": "b3737" }, { "name": "b3738", "id": "b3738" }, { "name": "b3735", "id": "b3735" }, { "name": "b3732", "id": "b3732" }, { "name": "b3733", "id": "b3733" }, { "name": "b3734", "id": "b3734" }, { "name": "b0720", "id": "b0720" }, { "name": "b0733", "id": "b0733" }, { "name": "b0978", "id": "b0978" }, { "name": "b0734", "id": "b0734" }, { "name": "b0979", "id": "b0979" }, { "name": "b2975", "id": "b2975" }, { "name": "b3603", "id": "b3603" }, { "name": "b2779", "id": "b2779" }, { "name": "b2925", "id": "b2925" }, { "name": "b2097", "id": "b2097" }, { "name": "b1773", "id": "b1773" }, { "name": "b4232", "id": "b4232" }, { "name": "b3925", "id": "b3925" }, { "name": "b2492", "id": "b2492" }, { "name": "b0904", "id": "b0904" }, { "name": "b4151", "id": "b4151" }, { "name": "b4152", "id": "b4152" }, { "name": "b4154", "id": "b4154" }, { "name": "b4153", "id": "b4153" }, { "name": "b2416", "id": "b2416" }, { "name": "b1819", "id": "b1819" }, { "name": "b1817", "id": "b1817" }, { "name": "b1818", "id": "b1818" }, { "name": "b2415", "id": "b2415" }, { "name": "b4122", "id": "b4122" }, { "name": "b1611", "id": "b1611" }, { "name": "b1612", "id": "b1612" }, { "name": "b3528", "id": "b3528" }, { "name": "b1852", "id": "b1852" }, { "name": "b1779", "id": "b1779" }, { "name": "b1621", "id": "b1621" }, { "name": "b1101", "id": "b1101" }, { "name": "b2417", "id": "b2417" }, { "name": "b1297", "id": "b1297" }, { "name": "b3870", "id": "b3870" }, { "name": "b0811", "id": "b0811" }, { "name": "b0810", "id": "b0810" }, { "name": "b0809", "id": "b0809" }, { "name": "b1761", "id": "b1761" }, { "name": "b0485", "id": "b0485" }, { "name": "b1812", "id": "b1812" }, { "name": "b1524", "id": "b1524" }, { "name": "b3213", "id": "b3213" }, { "name": "b3212", "id": "b3212" }, { "name": "b4077", "id": "b4077" }, { "name": "b2029", "id": "b2029" }, { "name": "b0875", "id": "b0875" }, { "name": "b1136", "id": "b1136" }, { "name": "b4015", "id": "b4015" }, { "name": "b2133", "id": "b2133" }, { "name": "b1380", "id": "b1380" }, { "name": "b4014", "id": "b4014" }, { "name": "b2976", "id": "b2976" }, { "name": "b3236", "id": "b3236" }, { "name": "b1479", "id": "b1479" }, { "name": "b2463", "id": "b2463" }, { "name": "b2280", "id": "b2280" }, { "name": "b2288", "id": "b2288" }, { "name": "b2282", "id": "b2282" }, { "name": "b2276", "id": "b2276" }, { "name": "b2278", "id": "b2278" }, { "name": "b2286", "id": "b2286" }, { "name": "b2277", "id": "b2277" }, { "name": "b2279", "id": "b2279" }, { "name": "b2285", "id": "b2285" }, { "name": "b2281", "id": "b2281" }, { "name": "b2284", "id": "b2284" }, { "name": "b2283", "id": "b2283" }, { "name": "b2287", "id": "b2287" }, { "name": "b3962", "id": "b3962" }, { "name": "b1603", "id": "b1603" }, { "name": "b1602", "id": "b1602" }, { "name": "b0451", "id": "b0451" }, { "name": "b0114", "id": "b0114" }, { "name": "b0115", "id": "b0115" }, { "name": "b3916", "id": "b3916" }, { "name": "b1723", "id": "b1723" }, { "name": "b3951", "id": "b3951" }, { "name": "b2579", "id": "b2579" }, { "name": "b3952", "id": "b3952" }, { "name": "b0903", "id": "b0903" }, { "name": "b0902", "id": "b0902" }, { "name": "b3114", "id": "b3114" }, { "name": "b4025", "id": "b4025" }, { "name": "b2926", "id": "b2926" }, { "name": "b0767", "id": "b0767" }, { "name": "b4395", "id": "b4395" }, { "name": "b3612", "id": "b3612" }, { "name": "b0755", "id": "b0755" }, { "name": "b3493", "id": "b3493" }, { "name": "b2987", "id": "b2987" }, { "name": "b3956", "id": "b3956" }, { "name": "b3403", "id": "b3403" }, { "name": "b1702", "id": "b1702" }, { "name": "b2458", "id": "b2458" }, { "name": "b2297", "id": "b2297" }, { "name": "b1676", "id": "b1676" }, { "name": "b1854", "id": "b1854" }, { "name": "b4301", "id": "b4301" }, { "name": "b3386", "id": "b3386" }, { "name": "b2914", "id": "b2914" }, { "name": "b4090", "id": "b4090" }, { "name": "b0722", "id": "b0722" }, { "name": "b0721", "id": "b0721" }, { "name": "b0724", "id": "b0724" }, { "name": "b0723", "id": "b0723" }, { "name": "b0728", "id": "b0728" }, { "name": "b0729", "id": "b0729" }, { "name": "b2464", "id": "b2464" }, { "name": "b0008", "id": "b0008" }, { "name": "b2935", "id": "b2935" }, { "name": "b2465", "id": "b2465" }, { "name": "b3919", "id": "b3919" }], "metabolites": [{ "name": "H", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "H", "compartment": "c", "id": "h_c" }, { "name": "Nicotinamide-adenine-dinucleotide", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C21H26N7O14P2", "compartment": "c", "id": "nad_c" }, { "name": "Coenzyme-A", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C21H32N7O16P3S", "compartment": "c", "id": "coa_c" }, { "name": "Acetaldehyde", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C2H4O", "compartment": "c", "id": "acald_c" }, { "name": "Nicotinamide-adenine-dinucleotide-reduced", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C21H27N7O14P2", "compartment": "c", "id": "nadh_c" }, { "name": "Acetyl-CoA", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C23H34N7O17P3S", "compartment": "c", "id": "accoa_c" }, { "name": "Acetaldehyde", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C2H4O", "compartment": "e", "id": "acald_e" }, { "name": "Acetyl-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C2H3O5P", "compartment": "c", "id": "actp_c" }, { "name": "ADP", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C10H12N5O10P2", "compartment": "c", "id": "adp_c" }, { "name": "Acetate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C2H3O2", "compartment": "c", "id": "ac_c" }, { "name": "ATP", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C10H12N5O13P3", "compartment": "c", "id": "atp_c" }, { "name": "Citrate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H5O7", "compartment": "c", "id": "cit_c" }, { "name": "cis-Aconitate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H3O6", "compartment": "c", "id": "acon_C_c" }, { "name": "H2O", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "H2O", "compartment": "c", "id": "h2o_c" }, { "name": "Isocitrate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H5O7", "compartment": "c", "id": "icit_c" }, { "name": "H", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "H", "compartment": "e", "id": "h_e" }, { "name": "Acetate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C2H3O2", "compartment": "e", "id": "ac_e" }, { "name": "AMP", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C10H12N5O7P", "compartment": "c", "id": "amp_c" }, { "name": "2-Oxoglutarate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H4O5", "compartment": "c", "id": "akg_c" }, { "name": "CO2", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "CO2", "compartment": "c", "id": "co2_c" }, { "name": "Succinyl-CoA", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C25H35N7O19P3S", "compartment": "c", "id": "succoa_c" }, { "name": "2-Oxoglutarate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H4O5", "compartment": "e", "id": "akg_e" }, { "name": "Ethanol", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C2H6O", "compartment": "c", "id": "etoh_c" }, { "name": "Phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "HO4P", "compartment": "c", "id": "pi_c" }, { "name": "D-Fructose-6-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H11O9P", "compartment": "c", "id": "f6p_c" }, { "name": "Nicotinamide-adenine-dinucleotide-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C21H25N7O17P3", "compartment": "c", "id": "nadp_c" }, { "name": "3-Phospho-D-glycerate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H4O7P", "compartment": "c", "id": "3pg_c" }, { "name": "Glyceraldehyde-3-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H5O6P", "compartment": "c", "id": "g3p_c" }, { "name": "D-Glucose-6-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H11O9P", "compartment": "c", "id": "g6p_c" }, { "name": "Phosphoenolpyruvate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H2O6P", "compartment": "c", "id": "pep_c" }, { "name": "L-Glutamine", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H10N2O3", "compartment": "c", "id": "gln__L_c" }, { "name": "L-Glutamate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H8NO4", "compartment": "c", "id": "glu__L_c" }, { "name": "alpha-D-Ribose-5-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H9O8P", "compartment": "c", "id": "r5p_c" }, { "name": "D-Erythrose-4-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C4H7O7P", "compartment": "c", "id": "e4p_c" }, { "name": "Nicotinamide-adenine-dinucleotide-phosphate-reduced", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C21H26N7O17P3", "compartment": "c", "id": "nadph_c" }, { "name": "Oxaloacetate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C4H2O5", "compartment": "c", "id": "oaa_c" }, { "name": "Pyruvate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H3O3", "compartment": "c", "id": "pyr_c" }, { "name": "CO2", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "CO2", "compartment": "e", "id": "co2_e" }, { "name": "Ubiquinone-8", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C49H74O4", "compartment": "c", "id": "q8_c" }, { "name": "Ubiquinol-8", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C49H76O4", "compartment": "c", "id": "q8h2_c" }, { "name": "O2", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "O2", "compartment": "c", "id": "o2_c" }, { "name": "D-Lactate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H5O3", "compartment": "c", "id": "lac__D_c" }, { "name": "D-Lactate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H5O3", "compartment": "e", "id": "lac__D_e" }, { "name": "D-Glycerate-2-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H4O7P", "compartment": "c", "id": "2pg_c" }, { "name": "Ethanol", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C2H6O", "compartment": "e", "id": "etoh_e" }, { "name": "Formate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "CH1O2", "compartment": "e", "id": "for_e" }, { "name": "D-Fructose", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H12O6", "compartment": "e", "id": "fru_e" }, { "name": "Fumarate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C4H2O4", "compartment": "e", "id": "fum_e" }, { "name": "D-Glucose", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H12O6", "compartment": "e", "id": "glc__D_e" }, { "name": "L-Glutamine", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H10N2O3", "compartment": "e", "id": "gln__L_e" }, { "name": "L-Glutamate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H8NO4", "compartment": "e", "id": "glu__L_e" }, { "name": "H2O", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "H2O", "compartment": "e", "id": "h2o_e" }, { "name": "L-Malate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C4H4O5", "compartment": "e", "id": "mal__L_e" }, { "name": "Ammonium", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "H4N", "compartment": "e", "id": "nh4_e" }, { "name": "O2", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "O2", "compartment": "e", "id": "o2_e" }, { "name": "Phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "HO4P", "compartment": "e", "id": "pi_e" }, { "name": "Pyruvate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H3O3", "compartment": "e", "id": "pyr_e" }, { "name": "Succinate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C4H4O4", "compartment": "e", "id": "succ_e" }, { "name": "Dihydroxyacetone-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H5O6P", "compartment": "c", "id": "dhap_c" }, { "name": "D-Fructose-1-6-bisphosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H10O12P2", "compartment": "c", "id": "fdp_c" }, { "name": "Formate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "CH1O2", "compartment": "c", "id": "for_c" }, { "name": "Fumarate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C4H2O4", "compartment": "c", "id": "fum_c" }, { "name": "Succinate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C4H4O4", "compartment": "c", "id": "succ_c" }, { "name": "L-Malate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C4H4O5", "compartment": "c", "id": "mal__L_c" }, { "name": "6-phospho-D-glucono-1-5-lactone", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H9O9P", "compartment": "c", "id": "6pgl_c" }, { "name": "3-Phospho-D-glyceroyl-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C3H4O10P2", "compartment": "c", "id": "13dpg_c" }, { "name": "Ammonium", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "H4N", "compartment": "c", "id": "nh4_c" }, { "name": "6-Phospho-D-gluconate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C6H10O10P", "compartment": "c", "id": "6pgc_c" }, { "name": "D-Ribulose-5-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H9O8P", "compartment": "c", "id": "ru5p__D_c" }, { "name": "Glyoxylate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C2H1O3", "compartment": "c", "id": "glx_c" }, { "name": "D-Xylulose-5-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C5H9O8P", "compartment": "c", "id": "xu5p__D_c" }, { "name": "Sedoheptulose-7-phosphate", "notes": "{}", "annotation": "{}", "_constraint_sense": "E", "charge": "0", "_bound": "0.0", "formula": "C7H13O10P", "compartment": "c", "id": "s7p_c" }], "id": "Ecoli_core_model" };
};

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ })
/******/ ]);
});