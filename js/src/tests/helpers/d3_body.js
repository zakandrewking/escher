/* global global */

var jsdom = require('jsdom');
var d3 = require('d3');

// body selection
var document = jsdom.jsdom(),
    d3_body = d3.select(document).select('body');

// globals
global.d3 = d3;
global.document = document;
global.window = document.defaultView;
global.navigator = { platform: 'node.js' };

module.exports = d3_body;
