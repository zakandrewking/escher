/* global Blob, XMLSerializer, Image, btoa, alert */

import vkbeautify from 'vkbeautify'
import _ from 'underscore'
import { json as d3Json, text as d3Text } from 'd3-request'
import { csvParseRows as d3CsvParseRows } from 'd3-dsv'
import { selection as d3Selection } from 'd3-selection'
import { saveAs } from 'file-saver'

/**
 * Check if Blob is available, and alert if it is not.
 */
function checkFilesaver () {
  let check = false
  try {
    check = !!new Blob()
  } catch (e) {
    alert('Blob not supported')
  }
  return check
}

export function setOptions (options, defaults, mustBeFloat) {
  if (options === undefined || options === null) {
    return defaults
  }
  const out = {}
  for (let key in defaults) {
    const hasKey = ((key in options) &&
                    (options[key] !== null) &&
                    (options[key] !== undefined))
    let val = (hasKey ? options[key] : defaults[key])
    if (mustBeFloat && key in mustBeFloat) {
      val = parseFloat(val)
      if (isNaN(val)) {
        if (hasKey) {
          console.warn('Bad float for option ' + key)
          val = parseFloat(defaults[key])
          if (isNaN(val)) {
            console.warn('Bad float for default ' + key)
            val = null
          }
        } else {
          console.warn('Bad float for default ' + key)
          val = null
        }
      }
    }
    out[key] = val
  }
  return out
}

/**
 * Removes all child nodes from a d3 selection
 */
export function removeChildNodes (selection) {
  const node = selection.node()
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild)
  }
}

function endsWith (str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1
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
export function loadTheFile (t, file, callback, value) {
  if (value) {
    if (file) console.warn('File ' + file + ' overridden by value.')
    callback.call(t, null, value)
    return
  }
  if (!file) {
    callback.call(t, 'No filename', null)
    return
  }
  if (endsWith(file, 'json')) {
    d3Json(file, function (e, d) { callback.call(t, e, d) })
  } else if (endsWith(file, 'css')) {
    d3Text(file, function (e, d) { callback.call(t, e, d) })
  } else {
    callback.call(t, 'Unrecognized file type', null)
  }
}

/**
 * Load multiple files asynchronously by calling utils.loadTheFile.
 * @param t - this context for callback. Should be an object.
 * @param files_to_load - A list of objects with the attributes:
          { file - a_filename.json, callback: a_callback_fn }
          File must be JSON or CSS.
 * @param final_callback - Function that runs after all files have loaded.
*/
export function loadFiles (t, filesToLoad, finalCallback) {
  if (filesToLoad.length === 0) finalCallback.call(t)
  let i = -1
  let remaining = filesToLoad.length
  while (++i < filesToLoad.length) {
    loadTheFile(
      t,
      filesToLoad[i].file,
      function (e, d) {
        this.call(t, e, d)
        if (!--remaining) finalCallback.call(t)
      }.bind(filesToLoad[i].callback),
      filesToLoad[i].value
    )
  }
}

/**
 * Create a constructor that returns a new object with our without the 'new'
 * keyword.
 *
 * Adapted from Hubert Kauker (MIT Licensed), John Resig (MIT Licensed).
 * http://stackoverflow.com/questions/7892884/simple-class-instantiation
 */
export function makeClass () {
  let isInternal
  const constructor = function (args) {
    if (this instanceof constructor) {
      if (typeof this.init === 'function') {
        this.init.apply(this, isInternal ? args : arguments)
      }
    } else {
      isInternal = true
      const instance = new constructor(arguments)
      isInternal = false
      return instance
    }
  }
  return constructor
}

/**
 * Return a class that can be instantiated without the new keyword.
 * @param {Class} AClass - Any ES6 class.
 */
export function classWithOptionalNew (AClass) {
  return new Proxy(AClass, {
    apply (Target, thisArg, args) {
      return new Target(...args)
    }
  })
}

export function setupDefs (svg, style) {
  // add stylesheet
  svg.select('defs').remove()
  const defs = svg.append('defs')
  // make sure the defs is the first node
  const node = defs.node()
  node.parentNode.insertBefore(node, node.parentNode.firstChild)
  defs.append('style')
    .attr('type', 'text/css')
      .text(style)
  return defs
}

/**
 * Run through the d3 data binding steps for an object. Also checks to make sure
 * none of the values in the *object* are undefined, and ignores those.
 *
 * The create_function, update_function, and exit_function CAN modify the input
 * data object.
 *
 * @param {} containerSel - A d3 selection containing all objects.
 * @param {} parentNodeSelector - A selector string for a subselection of
 * container_sel.
 * @param {} childrenSelector - A selector string for each DOM element to bind.
 * @param {} object - An object to bind to the selection.
 * @param {} idKey - The key that will be used to store object IDs in the bound
 * data points.
 * @param {} createFunction - A function for enter selection. Create function
 * must return a selection of the new nodes.
 * @param {} updateFunction - A function for update selection.
 * @param {} exitFunction - A function for exit selection.
 */
export function drawAnObject (containerSel, parentNodeSelector,
                              childrenSelector, object, idKey, createFunction,
                              updateFunction, exitFunction) {
  const drawObject = {}

  for (let id in object) {
    if (object[id] === undefined) {
      console.warn('Undefined value for id ' + id + ' in object. Ignoring.')
    } else {
      drawObject[id] = object[id]
    }
  }

  const sel = containerSel.select(parentNodeSelector)
      .selectAll(childrenSelector)
      .data(makeArrayRef(drawObject, idKey),
            function (d) { return d[idKey] })

  // enter: generate and place reaction
  const updateSel = createFunction
      ? createFunction(sel.enter()).merge(sel)
      : sel

  // update: update when necessary
  if (updateFunction) {
    updateSel.call(updateFunction)
  }

  // exit
  if (exitFunction) {
    sel.exit().call(exitFunction)
  }
}

/**
 * Run through the d3 data binding steps for an object that is nested within
 * another element with D3 data.
 *
 * The create_function, update_function, and exit_function CAN modify the input
 * data object.
 *
 * @param {} containerSel - A d3 selection containing all objects.
 * @param {} childrenSelector - A selector string for each DOM element to bind.
 * @param {} objectDataKey - A key for the parent object containing data for
 * the new selection.
 * @param {} idKey - The key that will be used to store object IDs in the bound
 * data points.
 * @param {} createFunction - A function for enter selection. Create function *
 * must return a selection of the new nodes.
 * @param {} updateFunction - A function for update selection.
 * @param {} exitFunction - A function for exit selection.
 */
export function drawANestedObject (containerSel, childrenSelector, objectDataKey,
                                   idKey, createFunction, updateFunction,
                                   exitFunction) {
  const sel = containerSel.selectAll(childrenSelector)
        .data(function (d) { return makeArrayRef(d[objectDataKey], idKey) },
              function (d) { return d[idKey] })

  // enter: generate and place reaction
  const updateSel = (createFunction
                     ? createFunction(sel.enter()).merge(sel)
                     : sel)

  // update: update when necessary
  if (updateFunction) {
    updateSel.call(updateFunction)
  }

  // exit
  if (exitFunction) {
    sel.exit().call(exitFunction)
  }
}

/**
 * Turn the object into an array, but only by reference.
 */
function makeArrayRef (obj, idKey) {
  const array = []
  for (let key in obj) {
    // copy object
    const it = obj[key]
    // add key as 'id'
    it[idKey] = key
    // add object to array
    array.push(it)
  }
  return array
}

/**
 * Compares two simple (not-nested) arrays.
 */
export function compareArrays (a1, a2) {
  if (!a1 || !a2) return false
  if (a1.length !== a2.length) return false
  for (let i = 0, l = a1.length; i < l; i++) {
    if (a1[i] !== a2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false
    }
  }
  return true
}

/**
 * Convert an array of objects to an object with all keys and values
 * that are arrays of the same length as arr. Fills in spaces with null.
 *
 *  For example, [ { a: 1 }, { b: 2 }] becomes { a: [1, null], b: [null, 2] }.
 */
export function arrayToObject (arr) {
  // new object
  const obj = {}
  // for each element of the array
  for (let i = 0, l = arr.length; i < l; i++) {
    const column = arr[i]
    const keys = Object.keys(column)
    for (let k = 0, nk = keys.length; k < nk; k++) {
      const id = keys[k]
      if (!(id in obj)) {
        const n = []
        // fill spaces with null
        for (let j = 0; j < l; j++) {
          n[j] = null
        }
        n[i] = column[id]
        obj[id] = n
      } else {
        obj[id][i] = column[id]
      }
    }
  }
  return obj
}

/**
 * Deep copy for array and object types. All other types are returned by
 * reference.
 * @param {T<Object|Array|*>} obj - The object to copy.
 * @return {T} The copied object.
 */
export function clone (obj) {
  if (_.isArray(obj)) {
    return _.map(obj, t => clone(t))
  } else if (_.isObject(obj)) {
    return _.mapObject(obj, (t, k) => clone(t))
  } else {
    return obj
  }
}

/**
 * Extends obj1 with keys/values from obj2. Performs the extension cautiously,
 * and does not override attributes, unless the overwrite argument is true.
 * @param obj1 - Object to extend
 * @param obj2 - Object with which to extend.
 * @param overwrite - (Optional, Default false) Overwrite attributes in obj1.
 */
export function extend (obj1, obj2, overwrite = false) {
  for (let attrname in obj2) {
    if (!(attrname in obj1) || overwrite) { // UNIT TEST This
      obj1[attrname] = obj2[attrname]
    } else {
      throw new Error('Attribute ' + attrname + ' already in object.')
    }
  }
}

export function uniqueConcat (arrays) {
  const newArray = []
  arrays.forEach(a => {
    a.forEach(x => {
      if (newArray.indexOf(x) < 0) {
        newArray.push(x)
      }
    })
  })
  return newArray
}

/**
 * Return unique values in array of strings.
 *
 * http://stackoverflow.com/questions/1960473/unique-values-in-an-array
 */
export function uniqueStringsArray (arr) {
  const a = []
  for (let i = 0, l = arr.length; i < l; i++) {
    if (a.indexOf(arr[i]) === -1) {
      a.push(arr[i])
    }
  }
  return a
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not be
 * triggered. The function will be called after it stops being called for N
 * milliseconds. If "immediate" is passed, trigger the function on the leading
 * edge, instead of the trailing.
 */
export function debounce (func, wait, immediate) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

/**
 * Return a reference of the object with just the given ids.
 * @param {} obj - An object.
 * @param {} ids - An array of id strings.
 */
export function objectSliceForIdsRef (obj, ids) {
  const subset = {}
  let i = -1
  while (++i < ids.length) {
    subset[ids[i]] = obj[ids[i]]
  }
  if (ids.length !== Object.keys(subset).length) {
    console.warn('did not find correct reaction subset')
  }
  return subset
}

export function cPlusC (coords1, coords2) {
  if (coords1 === null || coords2 === null ||
      coords1 === undefined || coords2 === undefined) {
    return null
  }
  return {
    x: coords1.x + coords2.x,
    y: coords1.y + coords2.y
  }
}

export function cMinusC (coords1, coords2) {
  if (coords1 === null || coords2 === null ||
      coords1 === undefined || coords2 === undefined) {
    return null
  }
  return {
    x: coords1.x - coords2.x,
    y: coords1.y - coords2.y
  }
}

export function cTimesScalar (coords, scalar) {
  return {
    x: coords.x * scalar,
    y: coords.y * scalar
  }
}

/**
 * Download JSON file in a blob.
 */
export function downloadJson (json, name) {
  // Alert if blob isn't going to work
  checkFilesaver()

  const j = JSON.stringify(json)
  const blob = new Blob([j], { type: 'application/json' })
  saveAs(blob, name + '.json')
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
export function loadJsonOrCsv (f, csvConverter, callbackFn, preFn, failureFn,
                               debugEvent) {
  // Capture the file information.
  const onloadFn = function (event) {
    const result = event.target.result
    let data
    let errors
    // try JSON
    try {
      data = JSON.parse(result)
    } catch (e) {
      errors = 'JSON error: ' + e

      // try csv
      try {
        data = csvConverter(d3CsvParseRows(result))
      } catch (e) {
        // if both failed, return the errors
        callbackFn(errors + '\nCSV error: ' + e, null)
        return
      }
    }
    // if successful, return the data
    callbackFn(null, data)
  }
  if (debugEvent !== undefined && debugEvent !== null) {
    console.warn('Debugging loadJsonOrCsv')
    return onloadFn(debugEvent)
  }

  // Check for the various File API support.
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    callbackFn('The File APIs are not fully supported in this browser.', null)
  }
  const reader = new window.FileReader()

  if (preFn !== undefined && preFn !== null) {
    try { preFn() } catch (e) { console.warn(e) }
  }
  reader.onabort = function (event) {
    try { failureFn() } catch (e) { console.warn(e) }
  }
  reader.onerror = function (event) {
    try { failureFn() } catch (e) { console.warn(e) }
  }
  // Read in the image file as a data URL.
  reader.onload = onloadFn
  reader.readAsText(f)
}

/**
 * Download an svg file using FileSaver.js.
 * @param {String} name - The filename (without extension)
 * @param {D3 Selection} svg_sel - The d3 selection for the SVG element
 * @param {Boolean} do_beautify - If true, then beautify the SVG output
 */
export function downloadSvg (name, svgSel, doBeautify) {
  // Alert if blob isn't going to work
  checkFilesaver()

  // Make the xml string
  let xml = (new XMLSerializer()).serializeToString(svgSel.node())
  if (doBeautify) xml = vkbeautify.xml(xml)
  xml = ('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n' +
         ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
         xml)

  // Save
  const blob = new Blob([ xml ], { type: 'image/svg+xml' })
  saveAs(blob, name + '.svg')
}

/**
 * Download a png file using FileSaver.js.
 * @param {String} name - The filename (without extension).
 * @param {D3 Selection} svg_sel - The d3 selection for the SVG element.
 */
export function downloadPng (name, svgSel) {
  // Alert if blob isn't going to work
  checkFilesaver()

  // Make the xml string
  let xml = new XMLSerializer().serializeToString(svgSel.node())
  xml = ('<?xml version="1.0" encoding="utf-8"?>\n' +
         '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n' +
         ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
         xml)

  // Canvas to hold the image
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  // Get SVG size
  const svgSize = svgSel.node().getBBox()
  const svgWidth = svgSize.width + svgSize.x
  const svgHeight = svgSize.height + svgSize.y

  // Canvas size = SVG size. Constrained to 10000px for very large SVGs
  if (svgWidth < 10000 && svgHeight < 10000) {
    canvas.width = svgWidth
    canvas.height = svgHeight
  } else {
    if (canvas.width > canvas.height) {
      canvas.width = 10000
      canvas.height = 10000 * (svgHeight / svgWidth)
    } else {
      canvas.width = 10000 * (svgWidth / svgHeight)
      canvas.height = 10000
    }
  }

  // Image element appended with data
  const baseImage = new Image()
  baseImage.src = 'data:image/svg+xml;base64,' + btoa(xml)

  baseImage.onload = function () {
    // Draw image to canvas with white background
    context.fillStyle = '#FFF'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(baseImage, 0, 0, canvas.width, canvas.height)

    // Save image
    canvas.toBlob(function (blob) {
      saveAs(blob, name + '.png')
    })
  }
}

/**
 * Calculates displacement { x: dx, y: dy } based on rotating point c around
 * center with angle.
 */
export function rotateCoords (c, angle, center) {
  const dx = Math.cos(-angle) * (c.x - center.x) +
      Math.sin(-angle) * (c.y - center.y) +
    center.x - c.x
  const dy = -Math.sin(-angle) * (c.x - center.x) +
    Math.cos(-angle) * (c.y - center.y) +
    center.y - c.y
  return { x: dx, y: dy }
}

/**
 * Get the angle between coordinates
 * @param {Object} coords - Array of 2 coordinate objects { x: 1, y: 1 }
 * @return {Number} angle between 0 and 2PI.
 */
export function getAngle (coords) {
  const denominator = coords[1].x - coords[0].x
  const numerator = coords[1].y - coords[0].y
  if (denominator === 0 && numerator >= 0) {
    return Math.PI / 2
  } else if (denominator === 0 && numerator < 0) {
    return 3 * Math.PI / 2
  } else if (denominator >= 0 && numerator >= 0) {
    return Math.atan(numerator / denominator)
  } else if (denominator >= 0) {
    return (Math.atan(numerator / denominator) + 2 * Math.PI)
  } else {
    return (Math.atan(numerator / denominator) + Math.PI)
  }
}

export function toDegrees (radians) {
  return radians * 180 / Math.PI
}

/**
 * Force to domain -PI to PI
 */
export function angleNorm (radians) {
  if (radians < -Math.PI) {
    return radians + Math.floor((radians - Math.PI) / (-2 * Math.PI)) * 2 * Math.PI
  } else if (radians > Math.PI) {
    return radians - Math.floor((radians + Math.PI) / (2 * Math.PI)) * 2 * Math.PI
  } else {
    return radians
  }
}

export function toRadians (degrees) {
  return Math.PI / 180 * degrees
}

/**
 * Convert to radians, and force to domain -PI to PI
 */
export function toRadiansNorm (degrees) {
  const radians = toRadians(degrees)
  return angleNorm(radians)
}

export function angleForEvent (displacement, point, center) {
  const gamma = Math.atan2((point.x - center.x), (center.y - point.y))
  const beta = Math.atan2((point.x - center.x + displacement.x),
                        (center.y - point.y - displacement.y))
  const angle = beta - gamma
  return angle
}

export function distance (start, end) {
  return Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2))
}

export function compartmentalize (biggId, compartmentId) {
  return `${biggId}_${compartmentId}`
}

/**
 * Returns an array of [bigg_id, compartment id]. Matches compartment ids with
 * length 1 or 2. Return [ id, null ] if no match is found.
 */
export function decompartmentalize (id) {
  const reg = /(.*)_([a-z0-9]{1,2})$/
  const result = reg.exec(id)
  return result !== null ? result.slice(1, 3) : [ id, null ]
}

export function mean (array) {
  const sum = array.reduce(function (a, b) { return a + b })
  const avg = sum / array.length
  return avg
}

export function median (array) {
  array.sort(function (a, b) { return a - b })
  const half = Math.floor(array.length / 2)
  if (array.length % 2 === 1) {
    return array[half]
  } else {
    return (array[half - 1] + array[half]) / 2.0
  }
}

export function quartiles (array) {
  array.sort(function (a, b) { return a - b })
  const half = Math.floor(array.length / 2)
  if (array.length === 1) {
    return [
      array[0],
      array[0],
      array[0]
    ]
  } else if (array.length % 2 === 1) {
    return [
      median(array.slice(0, half)),
      array[half],
      median(array.slice(half + 1))
    ]
  } else {
    return [
      median(array.slice(0, half)),
      (array[half - 1] + array[half]) / 2.0,
      median(array.slice(half))
    ]
  }
}

/**
 * Generate random characters
 *
 * Thanks to @csharptest.net
 * http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
 */
export function randomCharacters (num) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < num; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export function generateMapId () {
  return randomCharacters(12)
}

/**
 * Check that the selection has the given parent tag.
 * @param {D3 Selection|DOM Node} el - A D3 Selection or DOM Node to check.
 * @param {String} tag - A tag name (case insensitive).
 */
export function checkForParentTag (el, tag) {
  // make sure it is a node
  if (el instanceof d3Selection) {
    el = el.node()
  }
  while (el.parentNode !== null) {
    el = el.parentNode
    if (el.tagName === undefined) {
      continue
    }
    if (el.tagName.toLowerCase() === tag.toLowerCase()) {
      return true
    }
  }
  return false
}

/**
 * Get the document for the node
 */
export function getDocument (node) {
  return node.ownerDocument
}

/**
 * Get the window for the node
 */
export function getWindow (node) {
  return getDocument(node).defaultView
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
export function d3TransformCatch (transformAttr) {
  if (transformAttr.indexOf('skew') !== -1 ||
      transformAttr.indexOf('matrix') !== -1) {
    throw new Error('d3TransformCatch does not work with skew or matrix')
  }

  const translateRes = (/translate\s*\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/
                       .exec(transformAttr))
  const tn = _.isNull(translateRes)
  const tx = tn ? 0.0 : Number(translateRes[1])
  const ty = tn ? 0.0 : Number(translateRes[2])

  const rotateRes = (/rotate\s*\(\s*([0-9.-]+)\s*\)/
                    .exec(transformAttr))
  const rn = _.isNull(rotateRes)
  const r = rn ? 0.0 : Number(rotateRes[1])

  const scaleRes = (/scale\s*\(\s*([0-9.-]+)\s*\)/
                   .exec(transformAttr))
  const sn = _.isNull(scaleRes)
  const s = sn ? 0.0 : Number(scaleRes[1])

  return { translate: [ tx, ty ], rotate: r, scale: s }

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
}

/**
 * Look for name in the user agent string.
 */
// function check_browser (name) {
//   var browser = function() {
//     // Thanks to
//     // http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
//     var ua = navigator.userAgent
//     var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
//     var tem
//     if (/trident/i.test(M[1])) {
//       tem = /\brv[ :]+(\d+)/g.exec(ua) || []
//       return 'IE '+ (tem[1] || '')
//     }
//     if (M[1] === 'Chrome') {
//       tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
//       if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera')
//     }
//     M = M[2] ? [ M[1], M[2] ]: [ navigator.appName, navigator.appVersion, '-?' ]
//     if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
//       M.splice(1, 1, tem[1])
//     }
//     return M.join(' ')
//   }

//   try {
//     // navigator.userAgent is deprecated, so don't count on it
//     return browser().toLowerCase().indexOf(name) > -1
//   } catch (e) {
//     return false
//   }
// }
