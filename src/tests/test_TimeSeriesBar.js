const Builder = require('../Builder').default
const Map = require('../Map')

const TimeSeriesBar = require('../TimeSeriesBarPreact').default
const Settings = require('../Settings')

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

// set up map
let map
let svg = d3_body.append('svg')
const sel_map = svg.append('g')
// streams are required for these options
const required_options = { reaction_scale: [],
   metabolite_scale: [],
   reaction_styles: [],
   reaction_compare_style: 'diff',
   metabolite_styles: [],
   metabolite_compare_style: 'diff',
   cofactors: [], }
const required_conditional_options = [ 'reaction_scale',
   'metabolite_scale', ]
 const set_option = (key, val) => { required_options[key] = val }
 const get_option = (key) => required_options[key]

map = Map.from_data(get_map(), svg, null, sel_map, null,
   new Settings(set_option, get_option,
     required_conditional_options),
   null, true)

// set up builder
var b = Builder(map, null, '', sel)

describe('TimeSeriesBar', function () {

  it('Set Duration', function () {
    const t = new TimeSeriesBar(false, b)

    t.setDuration(10)
    assert.equal(t.state.duration, 10)

    // TODO: make this impossible
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

  it('Setting data indices in DOM', () => {

    var reference_slider = document.querySelector('sliderReference')

    reference_slider.attr('value', 1)
    reference_slider.onChange(b)
    //reference_slider.value = 1

    //b.set_data_indices('reaction', 1, 10)
    assert.strictEqual(b.reference, 1)
    //assert.strictEqual(b.target, 10)

    //b.set_data_indices('reaction', "3", "12")
    //assert.strictEqual(b.reference, 3)
    //assert.strictEqual(b.target, 12)

  })

  it('Simulating animation', ( ) => {
    let t = new TimeSeriesBar(false, b)
    t.state.map = get_map()
    t.state.duration = 1
    t.state.sliding_window = false

    let data = [
      {"PPA2": 0, "ENO": 0, "PPS": 0.2},
      {"PPA2": 0.5, "ENO": 0.7, "PPS": 2.2},
      {"PPA2": 1, "ENO": 1.4, "PPS": 0.2}
    ]

    b.options.reaction_data = data

    assert.strictEqual(t.state.playing, false)

    t.play_time_series(b, get_map(), 1, false)
    assert.strictEqual(t.state.playing, true)

    t.play_time_series(b, get_map(), 1, false)
    assert.strictEqual(t.state.playing, false)


    //t.getElementsByClassName('timeSeriesButton play').onClick()


  })

  // it('Simulating animation with linear time scale and reaction names', ( ) => {
  //   const t = new TimeSeriesBar(false, b)
  //
  //   b.options.reaction_data = [
  //     ["reaction_data_set_1", "reaction_data_set_2", "reaction_data_set_3"],
  //     [{"PPA2":0, "ENO": 0, "PPS": 0.2},
  //       {"PPA2":0.5, "ENO":0.7, "PPS": 1.2 },
  //       {"PPA2":1, "ENO": 1.2, "PPS": 0.2}]
  //   ]
  //
  //
  // })
  //
  //
  // it('Simulating animation with linear time scale and reaction names', ( ) => {
  //   const t = new TimeSeriesBar(false, b)
  //
  //   b.options.reaction_data = [
  //     ["t1","t3","t5","t10","t11","t12","t14","t15","t20","t22","t25"
  //     ],
  //     [{"PPA2":0, "ENO": 10, "PPS": 1},
  //       {"PPA2":0.1, "ENO":9, "PPS": 2 },
  //       {"PPA2":0.2, "ENO": 8, "PPS": 3},
  //       {"PPA2":0.3, "ENO": 7, "PPS": 4},
  //       {"PPA2":0.4, "ENO":6, "PPS": 5 },
  //       {"PPA2":0.5, "ENO": 5, "PPS": 5},
  //       {"PPA2":0.6, "ENO":4, "PPS": 5},
  //       {"PPA2":0.7, "ENO":3, "PPS": 4 },
  //       {"PPA2":0.8, "ENO": 2, "PPS": 3},
  //       {"PPA2":0.9, "ENO": 1, "PPS": 2},
  //       {"PPA2":1.0, "ENO":0, "PPS": 1 }]
  //
  //   ]
  //
  //
  // })


})