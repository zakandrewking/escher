var escher = require('../main')

var describe = require('mocha').describe
var it = require('mocha').it
var assert = require('chai').assert

describe('main', function () {
  it('version', function () {
    assert.property(escher, 'version')
    assert.property(escher, 'Builder')
  })
})
