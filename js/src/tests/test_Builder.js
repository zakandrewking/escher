// These tests require d3 features that are currently not available in
// node/jsdom (e.g. d3.tranform). Hopefully these will eventually be available
// for running and testing all of Escher from the command line.


// Should test for the broken function that use utils.draw_array/object

/* global global */


// break on exception
// if (global.v8debug)
//     global.v8debug.Debug.setBreakOnException();


// var Builder = require('../Builder');
// var get_map = require('./helpers/get_map');
// var get_model = require('./helpers/get_model');

// var describe = require('mocha').describe;
// var before = require('mocha').before;
// var it = require('mocha').it;
// var mocha = require('mocha');
// var assert = require('assert');
// var jsdom = require('jsdom');
// var d3 = require('d3');

// // global d3 and body selection
// global.d3 = d3;
// var document = jsdom.jsdom();
// d3.set_document(document);


// describe('Builder', function () {

//     it("Small map, no model. Multiple instances.", function (t) {
//         var sels = [];
//         for (var i=0, l=3; i < l; i++) {
//             var sel = d3.select('body').append('div'),
//                 b = Builder(get_map(), null, '', sel,
//                             { never_ask_before_quit: true });

//             t.equal(sel.select('svg').node(), b.map.svg.node());
//             t.equal(sel.selectAll('#nodes')[0].length, 1);
//             t.equal(sel.selectAll('.node')[0].length, 79);
//             t.equal(sel.selectAll('#reactions')[0].length, 1);
//             t.equal(sel.selectAll('.reaction')[0].length, 18);
//             t.equal(sel.selectAll('#text-labels')[0].length, 1);
//             sels.push(sel);
//         }
//         sels.forEach(function(sel) {
//             sel.remove();
//         });
//     });

//     it('check for model+highlight_missing bug', function() {
//         var b = Builder(get_map(), get_model(), '', d3.select('body').append('div'),
//                         { never_ask_before_quit: true, highlight_missing: true });
//     });

//     it("SVG selection error", function () {
//         var sel = d3.select('body').append('svg').append('g');
//         assert.throws(function () {
//             Builder(null, null, '', sel, { never_ask_before_quit: true  });
//         }, /Builder cannot be placed within an svg node/);
//     });

//     it('fix scales', function () {
//         var sel = d3.select('body').append('div'),
//             b = Builder(null, null, '', sel, { reaction_scale: [{ type: 'median', color: '#9696ff', size: 8 }],
//                                                never_ask_before_quit: true });
//         assert(b.options.reaction_scale).equal([{ type: 'median', color: '#9696ff', size: 8 },
//                                                 { type: 'min', color: '#ffffff', size: 10 },
//                                                 { type: 'max', color: '#ffffff', size: 10 }]);

//         // after callback
//         b = Builder(null, null, '', sel, { metabolite_scale: [{ type: 'median', color: 'red', size: 0 },
//                                                               { type: 'min', color: 'red', size: 0 },
//                                                               { type: 'max', color: 'red', size: 0 } ],
//                                            never_ask_before_quit: true });
//         b.settings.set_conditional('metabolite_scale', [{ type: 'median', color: '#9696ff', size: 8 }]);
//         assert(b.options.metabolite_scale).equal([{ type: 'median', color: '#9696ff', size: 8 },
//                                                   { type: 'min', color: '#ffffff', size: 10 },
//                                                   { type: 'max', color: '#ffffff', size: 10 }]);
//     });
// });
