import ZoomContainer from '../ZoomContainer'
import { d3_transform_catch } from '../utils'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { assert } from 'chai'
import d3Body from './helpers/d3Body'
import _ from 'underscore'
import { zoomTransform as d3ZoomTransform } from 'd3-zoom'

/**
 * Look at both the transform and the -webkit-transform styles, and run the
 * appropriate callback.
 */
// function checkWebkitTransform (sel, withFn, withoutFn) {
//   const noWebkit = sel.select('.escher-3d-transform-container')
//         .style('transform')
//   const webkit = sel.select('.escher-3d-transform-container')
//         .style('-webkit-transform')
//   if (webkit) {
//     withFn(webkit)
//   } else {
//     withoutFn(noWebkit)
//   }
// }

describe('ZoomContainer', () => {
  let sel
  beforeEach(() => { sel = d3Body.append('div') })
  afterEach(() => sel.remove())

  it('initializes', () => {
    // make a zoom container
    const zc = new ZoomContainer(sel, 'none', true)
    // check basic attributes
    assert.strictEqual(sel.select('.escher-zoom-container').node(),
                       zc.container.node())
    assert.strictEqual(sel.select('.escher-3d-transform-container').node(),
                       zc.css3TransformContainer.node())
    assert.strictEqual(sel.select('svg').node(),
                       zc.svg.node())
    assert.strictEqual(sel.select('.zoom-g').node(),
                       zc.zoomedSel.node())
  })

  it('go_to -- no d3 transform', (done) => {
    // no d3 transform
    const zc = new ZoomContainer(sel, 'none', false)
    zc.goTo(2.0, { x: 10.0, y: -20.5 })
    // check node zoomTransform (__zoom attribute)
    const zoomTransform = d3ZoomTransform(zc.container.node())
    assert.strictEqual(zoomTransform.k, 2.0)
    assert.strictEqual(zoomTransform.x, 10.0)
    assert.strictEqual(zoomTransform.y, -20.5)
    _.delay(() => {
      // check node transform attribute
      const transform = d3_transform_catch(zc.zoomedSel.attr('transform'))
      assert.strictEqual(transform.scale, 2.0)
      assert.strictEqual(transform.translate[0], 10.0)
      assert.strictEqual(transform.translate[1], -20.5)
      done()
    }, 100)
  })

  // TODO waiting on
  // https://github.com/chad3814/CSSStyleDeclaration/pull/49
  // https://github.com/tmpvar/jsdom/issues/1321
  // https://github.com/NV/CSSOM/issues/78
  // it('go_to -- with 3D transform', (done) => {
  //   // with 3D transform
  //   var zc = new ZoomContainer(sel, 'none', true)

  //   // zoom
  //   zc.goTo(0.5, { x: 10, y: -10 })

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
