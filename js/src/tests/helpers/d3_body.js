/* global global */

var jsdom = require('jsdom');
var d3_select = require('d3-selection').select

// body selection
var document = jsdom.jsdom(),
    d3_body = d3_select(document).select('body');

// globals
// global.d3 = d3;
global.document = document;
global.window = document.defaultView;
global.navigator = { platform: 'node.js' };

module.exports = d3_body;
