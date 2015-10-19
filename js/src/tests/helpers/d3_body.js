/* global global */

var jsdom = require('jsdom');
var d3 = require('d3');

// global d3 and body selection
global.d3 = d3;
var document = jsdom.jsdom(),
    d3_body = d3.select(document).select('body');

module.exports = d3_body;
