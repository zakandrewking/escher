const Settings = require('../Settings')

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('chai').assert

describe('Settings', () => {
  it('initializes', () => {
    // new settings object
    const options = {
      selection: null,
      menu: 'all',
      scroll_behavior: 'pan',
      enable_editing: true,
      reaction_styles: [ 'color', 'size', 'text' ],
      reaction_scale: [
        { type: 'min', color: '#c8c8c8', size: 4 },
        { type: 'value', value: 0, color: '#9696ff', size: 8 },
        { type: 'max', color: '#4b009f', size: 12 }
      ]
    }
    const set_option = (key, val) => { options[key] = val }
    const get_option = (key) => { return options[key] }
    const settings = new Settings(set_option, get_option, Object.keys(options))
    const name = 'reaction_styles'
    const val = [ 'new_style' ]
    let fired = null
    // set up the callback
    settings.streams[name].onValue((val) => { fired = val })
    // push a new value
    settings.busses[name].push(val)
    // make sure the callback fired
    assert.deepEqual(fired, val)
    // make sure the new value was added to the styles array
    assert.deepEqual(options.reaction_styles, val)
  })
})
