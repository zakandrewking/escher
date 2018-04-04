var DataMenu = require('../DataMenu')
var d3Body = require('./helpers/d3Body')

var describe = require('mocha').describe
var it = require('mocha').it
var assert = require('chai').assert

describe('DataMenu', () => {
  it('initializes',() => {
    const sel = d3Body.append('div')
    const data_menu = new DataMenu({ selection: sel })
    assert.ok(data_menu)
    assert.strictEqual(sel.selectAll('select').size(), 1)
  })
})
