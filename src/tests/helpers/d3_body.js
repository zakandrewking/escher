/* global global */

const jsdom = require('jsdom')
const d3_select = require('d3-selection').select

// body selection
const document = jsdom.jsdom()
const d3_body = d3_select(document).select('body')

// globals
global.document = document
global.window = document.defaultView
global.navigator = { platform: 'node.js' }

// Dummy SVGElement for d3-zoom.js:L87
const Dummy = () => {}
Dummy.prototype = {}
global.SVGElement = Dummy

module.exports = d3_body
