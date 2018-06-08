const Builder = require('../Builder').default
const TimeSeriesBar = require('../TimeSeriesBarPreact').default

const d3_body = require('./helpers/d3_body')
const get_map = require('./helpers/get_map')
const get_model = require('./helpers/get_model')

const describe = require('mocha').describe
const it = require('mocha').it
const mocha = require('mocha')
const assert = require('assert')

function make_parent_sel (s) {
  return s.append('div').style('width', '100px').style('height', '100px')
}

const sel = make_parent_sel(d3_body)
const b = Builder(get_map(), null, '', sel)

describe('TimeSeriesBar', function () {

  it('Set Duration', function () {
    const t = new TimeSeriesBar(false, b)

    t.setDuration(10)
    assert.equal(t.state.duration, 10)

    // TODO: make this throw an error
    t.setDuration(-500)
    assert.equal(t.state.duration, -500)

    t.setDuration(500)
    assert.equal(t.state.duration, 500)

  })


  it('Not playing animation on default', () => {
    const t = new TimeSeriesBar(false, b)
    assert.equal(t.state.playing, false)
  })

  // it('Playing animation', () => {
  //   const t = new TimeSeriesBar(false, b)
  //
  //   t.play_time_series(b, get_map(), 2000, false)
  //   assert.equal(t.state.playing, true)
  // })

  it('Setting data indices', () => {
    b.set_data_indices('reaction', 1, 10)
    assert.strictEqual(b.reference, 1)
    assert.strictEqual(b.target, 10)

    b.set_data_indices('reaction', "3", "12")
    assert.strictEqual(b.reference, 3)
    assert.strictEqual(b.target, 12)

  })


})