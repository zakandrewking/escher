const require_helper = require('./helpers/require_helper')
const ZoomContainer = require_helper('ZoomContainer')

const describe = require('mocha').describe
const before = require('mocha').before
const after = require('mocha').after
const it = require('mocha').it
const assert = require('chai').assert
const d3_body = require('./helpers/d3_body')

describe('ZoomContainer', function () {
  it('initializes', function () {
    // make a div
    var sel = d3_body.append('div')
    // make a zoom container
    var zc = ZoomContainer(sel, 'none', true, true)
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
    // clean the dom
    sel.remove()
  })
})

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

describe('ZoomContainer with 3D transform', function () {
  // make a div
  var sel
  before(function (done) {
    sel = d3_body.append('div')
    done()
  })

  it('uses a timeout', function (done) {
    // make a zoom container
    var zc = ZoomContainer(sel, 'none', true, true)
    // zoom
    zc.go_to(0.5, { x: 10, y: -10 })
    // I'm not sure why browsers do this transformation, but other people
    // have noted it https://github.com/mbostock/d3/issues/1323
    check_webkit_transform(sel, function(webkit) {
      assert.strictEqual(webkit, 'matrix(0.5, 0, 0, 0.5, 10, -10)')
    }, function(no_webkit) {
      assert.strictEqual(no_webkit, 'matrix(0.5, 0, 0, 0.5, 10, -10)')
    })
    assert.isNull(sel.select('.zoom-g').attr('transform'))

    window.setTimeout(() => {
      check_webkit_transform(sel, (webkit) => {
        assert.strictEqual(webkit, 'matrix(0.5, 0, 0, 0.5, 10, -10)')
      }, function(no_webkit) {
        assert.strictEqual(no_webkit, 'matrix(0.5, 0, 0, 0.5, 10, -10)')
      })
      assert.isNull(sel.select('.zoom-g').attr('transform'))
    }, 10)

    window.setTimeout(() => {
      check_webkit_transform(sel, (webkit) => {
        assert.strictEqual(webkit, 'none')
      }, function(no_webkit) {
        assert.strictEqual(no_webkit, 'none')
      })
      assert.strictEqual(sel.select('.zoom-g').attr('transform'),
                         'translate(10,-10) scale(0.5)')
      done() // finish async test
    }, 150)
  })

  after(() => { sel.remove() })
})
