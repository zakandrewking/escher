const ZoomContainer = require('../ZoomContainer')
const d3_transform_catch = require('../utils').d3_transform_catch

const describe = require('mocha').describe
const beforeEach = require('mocha').beforeEach
const afterEach = require('mocha').afterEach
const it = require('mocha').it
const assert = require('chai').assert
const d3_body = require('./helpers/d3_body')
const d3_zoomTransform = require('d3-zoom').zoomTransform
const _ = require('underscore')

/**
 * Look at both the transform and the -webkit-transform styles, and run the
 * appropriate callback.
 */
function check_webkit_transform (sel, with_fn, without_fn) {
  var no_webkit = sel.select('.escher-3d-transform-container')
      .style('transform')
  var webkit = sel.select('.escher-3d-transform-container')
      .style('-webkit-transform')
  if (webkit) {
    with_fn(webkit)
  } else {
    without_fn(no_webkit)
  }
}

describe('ZoomContainer', () => {
  let sel
  beforeEach(() => sel = d3_body.append('div'))
  afterEach(() => sel.remove())

  it('initializes', () => {
    // make a zoom container
    const zc = ZoomContainer(sel, 'none', true, true)
    // check basic attributes
    assert.strictEqual(sel.select('.escher-zoom-container').node(),
                       zc.zoom_container.node())
    assert.isTrue(sel.classed('fill-screen-div'))
    assert.strictEqual(sel.select('.escher-3d-transform-container').node(),
                       zc.css3_transform_container.node())
    assert.strictEqual(sel.select('svg').node(),
                       zc.svg.node())
    assert.strictEqual(sel.select('.zoom-g').node(),
                       zc.zoomed_sel.node())
  })

  it('go_to -- no d3 transform', (done) => {
    // no d3 transform
    const zc = ZoomContainer(sel, 'none', false, true)
    zc.go_to(2.0, { x: 10.0, y: -20.5 })
    // check node zoomTransform (__zoom attribute)
    const zoom_transform = d3_zoomTransform(zc.zoom_container.node())
    assert.strictEqual(zoom_transform.k, 2.0)
    assert.strictEqual(zoom_transform.x, 10.0)
    assert.strictEqual(zoom_transform.y, -20.5)
    _.defer(() => {
      // check node transform attribute
      const transform = d3_transform_catch(zc.zoomed_sel.attr('transform'))
      assert.strictEqual(transform.scale, 2.0)
      assert.strictEqual(transform.translate[0], 10.0)
      assert.strictEqual(transform.translate[1], -20.5)
      done()
    })
  })

  // TODO waiting on
  // https://github.com/chad3814/CSSStyleDeclaration/pull/49
  // https://github.com/tmpvar/jsdom/issues/1321
  // https://github.com/NV/CSSOM/issues/78
  // it('go_to -- with 3D transform', (done) => {
  //   // with 3D transform
  //   var zc = ZoomContainer(sel, 'none', true, true)

  //   // zoom
  //   zc.go_to(0.5, { x: 10, y: -10 })

  //   // I'm not sure why browsers do this transformation, but other people
  //   // have noted it https://github.com/mbostock/d3/issues/1323
  //   check_webkit_transform(
  //     sel,
  //     (webkit) => {
  //       assert.strictEqual(webkit, 'matrix(0.5, 0, 0, 0.5, 10, -10)')
  //     },
  //     (no_webkit) => {
  //       assert.strictEqual(no_webkit, 'matrix(0.5, 0, 0, 0.5, 10, -10)')
  //     }
  //   )
  //   assert.isNull(sel.select('.zoom-g').attr('transform'))

  //   setTimeout(() => {
  //     check_webkit_transform(
  //       sel,
  //       (webkit) => {
  //         assert.strictEqual(webkit, 'matrix(0.5, 0, 0, 0.5, 10, -10)')
  //       },
  //       (no_webkit) => {
  //         assert.strictEqual(no_webkit, 'matrix(0.5, 0, 0, 0.5, 10, -10)')
  //       })
  //     assert.isNull(sel.select('.zoom-g').attr('transform'))
  //   }, 10)

  //   setTimeout(() => {
  //     check_webkit_transform(
  //       sel,
  //       (webkit) => {
  //         assert.strictEqual(webkit, 'none')
  //       },
  //       (no_webkit) => {
  //         assert.strictEqual(no_webkit, 'none')
  //       })
  //     assert.strictEqual(sel.select('.zoom-g').attr('transform'),
  //                        'translate(10,-10) scale(0.5)')
  //     done() // finish async test
  //   }, 150)
  // })
})
