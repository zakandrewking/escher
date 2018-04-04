const SearchIndex = require('../SearchIndex')

const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const assert = require('chai').assert

const d3Body = require('./helpers/d3Body')
const get_map = require('./helpers/get_map')


describe('SearchIndex', () => {
  let index

  beforeEach(() => {
    index = SearchIndex()
  })

  it('insert accepts new records', () => {
    index.insert('123', {'name': 'a', 'data': 3}, true)
    assert.ok(index)
  })

  it('insert throws error for malformed records', () => {
    assert.throws(() => { index.insert('123', {}, false, true); },
                  'malformed record')
  })

  it('insert throws error for repeated index', () => {
    index.insert('123', {'name': 'a', 'data': 1})
    assert.throws(() => { index.insert('123', {}, false, false); },
                  'id is already in the index')
  })

  it('find', () => {
    index.insert('123', {'name': 'abc', 'data': 3}, true)
    index.insert('124', {'name': 'asdfeabn', 'data': 5}, true)
    index.insert('125', {'name': 'a', 'data': 6}, true)

    const results = index.find('ab')
    assert.include(results, 3)
    assert.include(results, 5)
    assert.notInclude(results, 6)
  })

  it('remove', () => {
    index.insert('123', {'name': 'a', 'data': 3}, true)
    const out = index.remove('123'),
          out2 = index.remove('123')
    assert.isTrue(out)
    assert.isFalse(out2)
    assert.strictEqual(index.find('a').length, 0)
  })
})
