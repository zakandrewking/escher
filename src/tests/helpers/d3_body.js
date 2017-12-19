/* global global */

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const d3Select = require('d3-selection').select

// body selection
const dom = new JSDOM()
const document = dom.window.document
const d3Body = d3Select(document).select('body')

// globals
global.document = document
global.window = dom.window
global.navigator = { platform: 'node.js' }

// Dummy SVGElement for d3-zoom.js:L87
const Dummy = () => {}
Dummy.prototype = {}
global.SVGElement = Dummy

module.exports = d3Body
