var DataMenu = require('../DataMenu')
var d3_body = require('./helpers/d3_body')

var describe = require('mocha').describe
var it = require('mocha').it
var assert = require('chai').assert

describe('DataMenu', () => {
  it('initializes',() => {
    const sel = d3_body.append('div')
    const data_menu = new DataMenu({ selection: sel })
    assert.ok(data_menu)
    assert.strictEqual(sel.selectAll('select').size(), 1)
  })
})
