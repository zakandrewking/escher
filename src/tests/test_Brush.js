const require_helper = require('./helpers/require_helper')
const d3_body = require('./helpers/d3_body')
const get_map = require('./helpers/get_map')
const Brush = require_helper('Brush')
const Map = require_helper('Map')
const Settings = require_helper('Settings')

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('chai').assert

function getMap () {
  const svg = d3_body.append('svg')
  const sel = svg.append('g')
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

  return Map.from_data(get_map(), svg, null, sel, null,
                       new Settings(set_option, get_option,
                                    required_conditional_options),
                       null, true)
}

// waiting on fix for d3 + jsdom issue
// describe('Brush', () => {
//   it('d3 + jsdom issue', () => {
//     // throws syntax error
//     d3_body.select(d3_body.append('div').node())
//   })

//   it('initializes', () => {
//     const svg = d3_body.append('svg')
//     const g = svg.append('g')
//     svg.append('g')
//     const map = getMap()
//     const brush = Brush(svg, true, map, g)
//     brush.toggle(true)
//   })
// })
