(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mocha"), require("underscore"), require("d3-request"), require("d3-selection"), require("vkbeautify"), require("d3-dsv"), (function webpackLoadOptionalExternalModule() { try { return require("file-saver"); } catch(e) {} }()), require("d3-format"), require("jsdom"), require("chai"));
	else if(typeof define === 'function' && define.amd)
		define(["mocha", "underscore", "d3-request", "d3-selection", "vkbeautify", "d3-dsv", "file-saver", "d3-format", "jsdom", "chai"], factory);
	else if(typeof exports === 'object')
		exports["escher"] = factory(require("mocha"), require("underscore"), require("d3-request"), require("d3-selection"), require("vkbeautify"), require("d3-dsv"), (function webpackLoadOptionalExternalModule() { try { return require("file-saver"); } catch(e) {} }()), require("d3-format"), require("jsdom"), require("chai"));
	else
		root["escher"] = factory(root["mocha"], root["underscore"], root["d3-request"], root["d3-selection"], root["vkbeautify"], root["d3-dsv"], root["file-saver"], root["d3-format"], root["jsdom"], root["chai"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("mocha");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global Blob, XMLSerializer, Image, btoa */

var vkbeautify = __webpack_require__(6);
var _ = __webpack_require__(2);
var d3_json = __webpack_require__(3).json;
var d3_text = __webpack_require__(3).text;
var d3_csvParseRows = __webpack_require__(7).csvParseRows;
var d3_selection = __webpack_require__(4).selection;

try {
  var saveAs = __webpack_require__(8).saveAs;
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
/* 2 */
/***/ (function(module, exports) {

module.exports = require("underscore");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("d3-request");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("d3-selection");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global global */

var utils = __webpack_require__(1);
var data_styles = __webpack_require__(9);
var d3_body = __webpack_require__(11);

var describe = __webpack_require__(0).describe;
var it = __webpack_require__(0).it;
var before = __webpack_require__(0).before;
var after = __webpack_require__(0).after;
var assert = __webpack_require__(13).assert;

describe('utils.set_options', function () {
  it('defaults to null', function () {
    var options = utils.set_options({ a: undefined,
      b: null }, {});
    for (var x in options) {
      assert.strictEqual(options[x], null);
    }
  });

  it('can require floats and does not overwrite', function () {
    var options = utils.set_options({ a: '5px', b: 'asdfwe' }, { a: 6, b: 7 }, { a: true, b: true });

    assert.strictEqual(options.a, 5);
    assert.strictEqual(options.b, 7);
  });
});

// TODO waiting on result of
// http://stackoverflow.com/questions/41812098/using-d3-request-from-node
// describe('utils.load_the_file', () => {
//   before(() => {
//     test_server.listen(8000)
//   })

//   after(() => {
//     test_server.close()
//   })

//   it('loads json', done => {
//     utils.load_the_file(
//       { my: 'this' },
//       'http://localhost:8000/test_file.json',
//       function (e, d) {
//         assert.deepEqual(this, { my: 'this' })
//         assert.isNull(e)
//         assert.deepEqual(d, { test: 'data' })
//         done()
//       }
//     )
//   })

//   it('loads css', done => {
//     utils.load_the_file({my: 'this'}, 'js/src/tests/data/test_file.css', function(e, d) {
//       assert.deepEqual(this, {my: 'this'})
//       assert.isNull(e)
//       assert.strictEqual(d, 'test\ndata\n')
//       done()
//     })
//   })

//   it('takes value', done => {
//     utils.load_the_file({my: 'this'}, null, function(e, d) {
//       assert.deepEqual(this, {my: 'this'})
//       assert.isNull(e)
//       assert.strictEqual(d, 'value')
//       done()
//     }, 'value')
//   })

//   it('no filename', done => {
//     utils.load_the_file({my: 'this'}, null, function(e, d) {
//       assert.deepEqual(this, {my: 'this'})
//       assert.strictEqual(e, 'No filename')
//       assert.isNull(d)
//       done()
//     })
//   })

//   it('unrecognized file type', done => {
//     utils.load_the_file({my: 'this'}, 'js/src/tests/data/bad_path', function(e, d, f) {
//       assert.deepEqual(this, {my: 'this'})
//       assert.strictEqual(e, 'Unrecognized file type')
//       assert.isNull(d)
//       done()
//     })
//   })
// })

// describe('utils.load_files', () => {
//   it('loads multiple files', done => {
//     let first = false
//     let second = false
//     const files = [
//       {
//         file: 'js/src/tests/data/test_file.json',
//         callback: function(e, d, f) { first = d; }
//       },
//       {
//         file: 'js/src/tests/data/test_file.css',
//         callback: function(e, d, f) { second = d; }
//       },
//     ]
//     utils.load_files({my: 'this'}, files, function() {
//       assert.deepEqual(this, {my: 'this'})
//       assert.deepEqual(first, {'test': 'data'})
//       assert.strictEqual(second, 'test\ndata\n')
//       done()
//     })
//   })

//   it('callback if empty', done => {
//     utils.load_files(null, [], () => {
//       done()
//     })
//   })

//   it('loads same file twice', done => {
//     let first = false
//     let second = false
//     const files = [
//       {
//         file: 'test_file.json',
//         callback: () => { first = true; }
//       },
//       {
//         file: 'test_file.json',
//         callback: () => { second = true; }
//       },
//     ]
//     utils.load_files(null, files, () => {
//       assert.isTrue(first)
//       assert.isTrue(second)
//       done()
//     })
//   })
// })

describe('utils.make_class', function () {
  it('works with our without "new"', function () {
    var MyClass = utils.make_class();
    var obj1 = new MyClass();
    var obj2 = MyClass();

    assert.isTrue(obj1 instanceof MyClass);
    assert.isTrue(obj2 instanceof MyClass);
    assert.isTrue(obj1.constructor == MyClass);
    assert.isTrue(obj2.constructor == MyClass);
  });
});

it('utils.compare_arrays', function () {
  assert.strictEqual(utils.compare_arrays([1, 2], [1, 2]), true);
  assert.strictEqual(utils.compare_arrays([1, 2], [3, 2]), false);
});

describe('utils.array_to_object', function () {
  it('converts array of objects to object of arrays', function () {
    // single
    var a = [{ a: 1, b: 2 }];
    var out = utils.array_to_object(a);
    assert.deepEqual(out, { a: [1], b: [2] });
  });
  it('adds null for missing values', function () {
    // multiple
    var a = [{ a: 1, b: 2 }, { b: 3, c: 4 }];
    var out = utils.array_to_object(a);
    assert.deepEqual(out, { a: [1, null],
      b: [2, 3],
      c: [null, 4] });
  });
});

describe('utils.clone', function () {
  it('deep copies objects', function () {
    var first = { a: 140, b: ['c', 'd'] };
    var second = utils.clone(first);
    first.a += 1;
    assert.strictEqual(second.a, 140);
    assert.notStrictEqual(first.b, second.b);
  });
});

describe('utils.extend', function () {
  it('adds attributes of second object to first', function () {
    // extend
    var one = { a: 1, b: 2 };
    var two = { c: 3 };
    utils.extend(one, two);
    assert.deepEqual(one, { a: 1, b: 2, c: 3 });
  });
  it('does not overwrite by default', function () {
    var one = { 'a': 1, 'b': 2 };
    var two = { 'b': 3 };
    assert.throws(utils.extend.bind(null, one, two));
  });
  it('overwrites with optional argument', function () {
    var one = { 'a': 1, 'b': 2 };
    var two = { 'b': 3 };
    utils.extend(one, two, true);
    assert.deepEqual(one, { 'a': 1, 'b': 3 });
  });
});

describe('utils.load_json_or_csv', function () {
  it('loads JSON', function () {
    utils.load_json_or_csv(null, data_styles.csv_converter, function (error, value) {
      if (error) console.warn(error);
      assert.deepEqual(value, { 'GAPD': 100 });
    }, null, null, { target: { result: '{"GAPD":100}' } });
  });
  it('loads CSV', function () {
    utils.load_json_or_csv(null, data_styles.csv_converter, function (error, value) {
      if (error) console.warn(error);
      assert.deepEqual(value, [{ 'GAPD': '100' }]);
    }, null, null, { target: { result: 'reaction,value\nGAPD,100\n' } });
  });
});

describe('utils.to_degrees', function () {
  it('returns degrees', function () {
    assert.strictEqual(utils.to_degrees(Math.PI / 2), 90);
    assert.strictEqual(utils.to_degrees(Math.PI), 180);
    assert.strictEqual(utils.to_degrees(-Math.PI), -180);
  });
});

describe('utils.to_radians_norm', function () {
  it('returns radians between -PI and PI', function () {
    assert.strictEqual(utils.to_radians_norm(90), Math.PI / 2);
    assert.strictEqual(utils.to_radians_norm(-90), -Math.PI / 2);
    assert.strictEqual(utils.to_radians_norm(-270), Math.PI / 2);
    assert.strictEqual(utils.to_radians_norm(270), -Math.PI / 2);
  });
});

describe('utils.compartmentalize', function () {
  it('adds compartment', function () {
    assert.deepEqual(utils.compartmentalize('atp', 'c1'), 'atp_c1');
  });
});

describe('utils.decompartmentalize', function () {
  it('gets compartment', function () {
    assert.deepEqual(utils.decompartmentalize('atp_c1'), ['atp', 'c1']);
  });

  it('returns null compartment if not found', function () {
    assert.deepEqual(utils.decompartmentalize('atp'), ['atp', null]);
  });
});

it('utils.mean', function () {
  assert.strictEqual(utils.mean([1, 2, 3]), 2);
});

it('utils.median', function () {
  assert.strictEqual(utils.median([1, 8, 3, 1, 10]), 3);
  assert.strictEqual(utils.median([1, 8, 3, 1, 10, 11]), 5.5);
  assert.strictEqual(utils.median([6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]), 40);
});

it('utils.quartiles', function () {
  assert.deepEqual(utils.quartiles([10]), [10, 10, 10]);
  assert.deepEqual(utils.quartiles([5, 10]), [5, 7.5, 10]);
  assert.deepEqual(utils.quartiles([1, 8, 3, 1, 10]), [1, 3, 9]);
  assert.deepEqual(utils.quartiles([6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]), [15, 40, 43]);
});

it('utils.random_characters', function () {
  for (var i = 5; i < 10; i++) {
    assert.strictEqual(utils.random_characters(i).length, i);
  }
});

it('utils.check_for_parent_tag', function () {
  var sel = d3_body.append('div');
  assert.strictEqual(utils.check_for_parent_tag(sel, 'body'), true);
  assert.strictEqual(utils.check_for_parent_tag(sel.node(), 'body'), true);
  assert.strictEqual(utils.check_for_parent_tag(sel, 'BODY'), true);
  assert.strictEqual(utils.check_for_parent_tag(sel, 'svg'), false);
});

describe('utils.test_name_to_url', function () {
  it('adds extension', function () {
    var url = utils.name_to_url('iJO1366.central_metabolism');
    assert.strictEqual(url, 'iJO1366.central_metabolism.json');
  });
  it('takes optional prefix', function () {
    var url = utils.name_to_url('iJO1366', 'https://github.io/1-0-0/models/Escherichia%20coli');
    assert.strictEqual(url, 'https://github.io/1-0-0/models/Escherichia%20coli/iJO1366.json');
  });
});

describe('utils.parse_url_components', function () {
  var url = '?map_name=iJO1366.Central%20metabolism&model_name=iJO1366%40%23%25';
  var the_window = { location: { search: url } };

  it('extracts attributes from url', function () {
    // standard name
    var options = utils.parse_url_components(the_window, {});
    assert.deepEqual(options, { map_name: 'iJO1366.Central metabolism',
      model_name: 'iJO1366@#%' });
  });

  it('adds to existing options', function () {
    // no host, and options
    var options = utils.parse_url_components(the_window, { a: 'b', model_name: 'old_model_name' });
    assert.deepEqual(options, { map_name: 'iJO1366.Central metabolism',
      model_name: 'iJO1366@#%',
      a: 'b' });
  });

  it('recognizes array attributes', function () {
    the_window.location.search = '?quick_jump[]=iJO1366.Central%20metabolism&quick_jump[]=iJO1366.Fatty%20acid%20metabolism';
    var options = utils.parse_url_components(the_window, { a: 'b' });
    assert.deepEqual(options, { a: 'b',
      quick_jump: ['iJO1366.Central metabolism', 'iJO1366.Fatty acid metabolism'] });
  });
});

describe('utils.d3_transform_catch', function () {
  it('gets translate', function () {
    assert.deepEqual(utils.d3_transform_catch('translate  ( 20, 30  )'), { translate: [20, 30], rotate: 0, scale: 0 });
  });

  it('gets translate, rotate, scale', function () {
    assert.deepEqual(utils.d3_transform_catch('translate  ( 0, -30.2  )rotate(5.1 ) scale(-3)'), { translate: [0, -30.2], rotate: 5.1, scale: -3.0 });
  });
});

describe('utils.check_browser', function () {
  it('looks for browser name', function () {
    global.navigator = { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) ' + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
      appName: 'Netscape',
      appVersion: '5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 ' + '(KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36' };
    assert.isTrue(utils.check_browser('chrome'));
    assert.isFalse(utils.check_browser('safari'));
  });

  it('returns false if no navigator.userAgent', function () {
    global.navigator = null;
    assert.isFalse(utils.check_browser('safari'));
  });
});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("vkbeautify");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("d3-dsv");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("file-saver");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * data_styles
 */

var utils = __webpack_require__(1);
var _ = __webpack_require__(2);
var d3_format = __webpack_require__(10).format;

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
/* 10 */
/***/ (function(module, exports) {

module.exports = require("d3-format");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global global */

var jsdom = __webpack_require__(12);
var d3_select = __webpack_require__(4).select;

// body selection
var document = jsdom.jsdom();
var d3_body = d3_select(document).select('body');

// globals
global.document = document;
global.window = document.defaultView;
global.navigator = { platform: 'node.js'

  // Need to import jquery after jsdom initializes.
  // const jquery = require('jquery')
  // global.jQuery = jquery
  // global.$ = jquery
  // require('bootstrap')

  // Dummy SVGElement for d3-zoom.js:L87
};var Dummy = function Dummy() {};
Dummy.prototype = {};
global.SVGElement = Dummy;

module.exports = d3_body;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("jsdom");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ })
/******/ ]);
});