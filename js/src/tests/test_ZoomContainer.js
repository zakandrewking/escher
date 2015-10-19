// These tests require d3 features that are currently not available in
// node/jsdom (e.g. d3.tranform). Hopefully these will eventually be available
// for running and testing all of Escher from the command line.



/* global describe, it, expect, beforeEach, afterEach, escher, d3 */

// describe('ZoomContainer', function() {
//     it("initializes", function () {
//         // make a div
//         var sel = d3.select('body').append('div');
//         // make a zoom container
//         var zc = escher.ZoomContainer(sel, 'none', true, true);
//         // check basic attributes
//         expect(sel.select('.escher-zoom-container').node())
//             .toBe(zc.zoom_container.node());
//         expect(sel.classed('fill-screen-div')).toBe(true);
//         expect(sel.select('.escher-3d-transform-container').node())
//             .toBe(zc.css3_transform_container.node());
//         expect(sel.select('svg').node())
//             .toBe(zc.svg.node());
//         expect(sel.select('.zoom-g').node())
//             .toBe(zc.zoomed_sel.node());
//         // clean the dom
//         sel.remove();
//     });
// });

// function check_webkit_transform(sel, with_fn, without_fn) {
//     /** look at both the transform and the -webkit-transform styles, and run the
//      * appropriate callback.
//      */
//     var no_webkit = sel.select('.escher-3d-transform-container').style('transform');
//     var webkit = sel.select('.escher-3d-transform-container').style('-webkit-transform');
//     if (webkit) {
//         with_fn(webkit);
//     } else {
//         without_fn(no_webkit);
//     }
// }

// describe('ZoomContainer with 3D transform', function() {
//     // make a div
//     var sel;
//     beforeEach(function(done) {
//         sel = d3.select('body').append('div');
//         done();
//     });

//     it("uses a timeout", function (done) {
//         // make a zoom container
//         var zc = escher.ZoomContainer(sel, 'none', true, true);
//         // zoom
//         zc.go_to(0.5, {x: 10, y: -10});
//         // I'm not sure why browsers do this transformation, but other people
//         // have noted it https://github.com/mbostock/d3/issues/1323
//         check_webkit_transform(sel, function(webkit) {
//             expect(webkit).toBe('matrix(0.5, 0, 0, 0.5, 10, -10)');
//         }, function(no_webkit) {
//             expect(no_webkit).toBe('matrix(0.5, 0, 0, 0.5, 10, -10)');
//         });
//         expect(sel.select('.zoom-g').attr('transform'))
//             .toBe(null);
//         window.setTimeout(function() {
//             check_webkit_transform(sel, function(webkit) {
//                 expect(webkit).toBe('matrix(0.5, 0, 0, 0.5, 10, -10)');
//             }, function(no_webkit) {
//                 expect(no_webkit).toBe('matrix(0.5, 0, 0, 0.5, 10, -10)');
//             });
//             expect(sel.select('.zoom-g').attr('transform'))
//                 .toBe(null);
//         }, 10);
//         window.setTimeout(function() {
//             check_webkit_transform(sel, function(webkit) {
//                 expect(webkit).toBe('none');
//             }, function(no_webkit) {
//                 expect(no_webkit).toBe('none');
//             });
//             expect(sel.select('.zoom-g').attr('transform'))
//                 .toBe('translate(10,-10) scale(0.5)');
//             done(); // finish async test
//         }, 150);
//     });

//     afterEach(function() {
//         sel.remove();
//     });
// });
