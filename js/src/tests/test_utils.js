/* global global */

const require_helper = require('./helpers/require_helper')
const utils = require_helper('utils')
const data_styles = require_helper('data_styles')
const d3_body = require('./helpers/d3_body')

const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before
const after = require('mocha').after
const assert = require('chai').assert

describe('utils.set_options', () => {
  it('defaults to null', () => {
    const options = utils.set_options({ a: undefined,
                                      b: null }, {})
    for (let x in options) {
      assert.strictEqual(options[x], null)
    }
  })

  it('can require floats and does not overwrite', () => {
    const options = utils.set_options({ a: '5px', b: 'asdfwe' },
                                    { a: 6, b: 7 },
                                    { a: true, b: true })

    assert.strictEqual(options.a, 5)
    assert.strictEqual(options.b, 7)
  })
})

// TODO waiting on result of
// http://stackoverflow.com/questions/41812098/using-d3-request-from-node
// describe('utils.load_the_file', () => {
//   before(() => {
//     test_server.listen(8000)
//   })

//   after(() => {
//     test_server.close()
//   })

//   it('loads json', done => {
//     utils.load_the_file(
//       { my: 'this' },
//       'http://localhost:8000/test_file.json',
//       function (e, d) {
//         assert.deepEqual(this, { my: 'this' })
//         assert.isNull(e)
//         assert.deepEqual(d, { test: 'data' })
//         done()
//       }
//     )
//   })

//   it('loads css', done => {
//     utils.load_the_file({my: 'this'}, 'js/src/tests/data/test_file.css', function(e, d) {
//       assert.deepEqual(this, {my: 'this'})
//       assert.isNull(e)
//       assert.strictEqual(d, 'test\ndata\n')
//       done()
//     })
//   })

//   it('takes value', done => {
//     utils.load_the_file({my: 'this'}, null, function(e, d) {
//       assert.deepEqual(this, {my: 'this'})
//       assert.isNull(e)
//       assert.strictEqual(d, 'value')
//       done()
//     }, 'value')
//   })

//   it('no filename', done => {
//     utils.load_the_file({my: 'this'}, null, function(e, d) {
//       assert.deepEqual(this, {my: 'this'})
//       assert.strictEqual(e, 'No filename')
//       assert.isNull(d)
//       done()
//     })
//   })

//   it('unrecognized file type', done => {
//     utils.load_the_file({my: 'this'}, 'js/src/tests/data/bad_path', function(e, d, f) {
//       assert.deepEqual(this, {my: 'this'})
//       assert.strictEqual(e, 'Unrecognized file type')
//       assert.isNull(d)
//       done()
//     })
//   })
// })

// describe('utils.load_files', () => {
//   it('loads multiple files', done => {
//     let first = false
//     let second = false
//     const files = [
//       {
//         file: 'js/src/tests/data/test_file.json',
//         callback: function(e, d, f) { first = d; }
//       },
//       {
//         file: 'js/src/tests/data/test_file.css',
//         callback: function(e, d, f) { second = d; }
//       },
//     ]
//     utils.load_files({my: 'this'}, files, function() {
//       assert.deepEqual(this, {my: 'this'})
//       assert.deepEqual(first, {'test': 'data'})
//       assert.strictEqual(second, 'test\ndata\n')
//       done()
//     })
//   })

//   it('callback if empty', done => {
//     utils.load_files(null, [], () => {
//       done()
//     })
//   })

//   it('loads same file twice', done => {
//     let first = false
//     let second = false
//     const files = [
//       {
//         file: 'test_file.json',
//         callback: () => { first = true; }
//       },
//       {
//         file: 'test_file.json',
//         callback: () => { second = true; }
//       },
//     ]
//     utils.load_files(null, files, () => {
//       assert.isTrue(first)
//       assert.isTrue(second)
//       done()
//     })
//   })
// })

describe('utils.make_class', () => {
  it('works with our without "new"', () => {
    const MyClass = utils.make_class()
    const obj1 = new MyClass()
    const obj2 = MyClass()

    assert.isTrue(obj1 instanceof MyClass)
    assert.isTrue(obj2 instanceof MyClass)
    assert.isTrue(obj1.constructor == MyClass)
    assert.isTrue(obj2.constructor == MyClass)
  })
})

it('utils.compare_arrays', () => {
  assert.strictEqual(utils.compare_arrays([1,2], [1,2]), true)
  assert.strictEqual(utils.compare_arrays([1,2], [3,2]), false)
})

describe('utils.array_to_object', () => {
  it('converts array of objects to object of arrays', () => {
    // single
    const a = [{a: 1, b: 2}]
    const out = utils.array_to_object(a)
    assert.deepEqual(out, { a: [1], b: [2] })
  })
  it('adds null for missing values', () => {
    // multiple
    const a = [{a:1, b:2}, {b:3, c:4}]
    const out = utils.array_to_object(a)
    assert.deepEqual(out, { a: [1, null],
                            b: [2, 3],
                            c: [null, 4] })
  })
})

describe('utils.clone', () => {
  it('deep copies objects', () => {
    const first = { a: 140, b: [ 'c', 'd' ] }
    const second = utils.clone(first)
    first.a += 1
    assert.strictEqual(second.a, 140)
    assert.notStrictEqual(first.b, second.b)
  })
})

describe('utils.extend', () => {
  it('adds attributes of second object to first', () => {
    // extend
    const one = {a: 1, b: 2}
    const two = {c: 3}
    utils.extend(one, two)
    assert.deepEqual(one, {a: 1, b: 2, c: 3})
  })
  it('does not overwrite by default', () => {
    const one = {'a': 1, 'b': 2}
    const two = {'b': 3}
    assert.throws(utils.extend.bind(null, one, two))
  })
  it('overwrites with optional argument', () => {
    const one = {'a': 1, 'b': 2}
    const two = {'b': 3}
    utils.extend(one, two, true)
    assert.deepEqual(one, {'a': 1, 'b': 3})
  })
})

describe('utils.load_json_or_csv', () => {
  it('loads JSON', () => {
    utils.load_json_or_csv(null,
                           data_styles.csv_converter,
                           function(error, value) {
                             if (error) console.warn(error)
                             assert.deepEqual(value, {'GAPD': 100})
                           },
                           null,
                           null,
                           {target: {result: '{"GAPD":100}'}})
  })
  it('loads CSV', () => {
    utils.load_json_or_csv(null,
                           data_styles.csv_converter,
                           function(error, value) {
                             if (error) console.warn(error)
                             assert.deepEqual(value, [{'GAPD': '100'}])
                           },
                           null,
                           null,
                           {target: {result: 'reaction,value\nGAPD,100\n'}})
  })
})

describe('utils.to_degrees', () => {
  it('returns degrees', () => {
    assert.strictEqual(utils.to_degrees(Math.PI/2), 90)
    assert.strictEqual(utils.to_degrees(Math.PI), 180)
    assert.strictEqual(utils.to_degrees(-Math.PI), -180)
  })
})

describe('utils.to_radians_norm', () => {
  it('returns radians between -PI and PI', () => {
    assert.strictEqual(utils.to_radians_norm(90), Math.PI/2)
    assert.strictEqual(utils.to_radians_norm(-90), -Math.PI/2)
    assert.strictEqual(utils.to_radians_norm(-270), Math.PI/2)
    assert.strictEqual(utils.to_radians_norm(270), -Math.PI/2)
  })
})

describe('utils.compartmentalize', () => {
  it('adds compartment', () => {
    assert.deepEqual(utils.compartmentalize('atp', 'c1'), 'atp_c1')
  })
})

describe('utils.decompartmentalize', () => {
  it('gets compartment', () => {
    assert.deepEqual(utils.decompartmentalize('atp_c1'), [ 'atp', 'c1' ])
  })

  it('returns null compartment if not found', () => {
    assert.deepEqual(utils.decompartmentalize('atp'), [ 'atp', null ])
  })
})

it('utils.mean', () => {
  assert.strictEqual(utils.mean([1, 2, 3]), 2)
})

it('utils.median', () => {
  assert.strictEqual(utils.median([1, 8, 3, 1, 10]), 3)
  assert.strictEqual(utils.median([1, 8, 3, 1, 10, 11]), 5.5)
  assert.strictEqual(utils.median([ 6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]), 40)
})

it('utils.quartiles', () => {
  assert.deepEqual(utils.quartiles([10]), [10, 10, 10])
  assert.deepEqual(utils.quartiles([5, 10]), [5, 7.5, 10])
  assert.deepEqual(utils.quartiles([1, 8, 3, 1, 10]), [1, 3, 9])
  assert.deepEqual(utils.quartiles([ 6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]),
                   [15, 40, 43])
})

it('utils.random_characters', () => {
  for (let i = 5; i < 10; i++) {
    assert.strictEqual(utils.random_characters(i).length, i)
  }
})

it('utils.check_for_parent_tag', () => {
  const sel = d3_body.append('div')
  assert.strictEqual(utils.check_for_parent_tag(sel, 'body'), true)
  assert.strictEqual(utils.check_for_parent_tag(sel.node(), 'body'), true)
  assert.strictEqual(utils.check_for_parent_tag(sel, 'BODY'), true)
  assert.strictEqual(utils.check_for_parent_tag(sel, 'svg'), false)
})

describe('utils.test_name_to_url', () => {
  it('adds extension', () => {
    const url = utils.name_to_url('iJO1366.central_metabolism')
    assert.strictEqual(url, 'iJO1366.central_metabolism.json')
  })
  it('takes optional prefix', () => {
    const url = utils.name_to_url('iJO1366', 'https://github.io/1-0-0/models/Escherichia%20coli')
    assert.strictEqual(url, 'https://github.io/1-0-0/models/Escherichia%20coli/iJO1366.json')
  })
})

describe('utils.parse_url_components', () => {
  const url = '?map_name=iJO1366.Central%20metabolism&model_name=iJO1366%40%23%25'
  const the_window = { location: { search: url } }

  it('extracts attributes from url', () => {
    // standard name
    const options = utils.parse_url_components(the_window, {})
    assert.deepEqual(options, { map_name: 'iJO1366.Central metabolism',
                                model_name: 'iJO1366@#%' })
  })

  it('adds to existing options', () => {
    // no host, and options
    const options = utils.parse_url_components(the_window,
                                         { a: 'b', model_name: 'old_model_name' })
    assert.deepEqual(options, { map_name: 'iJO1366.Central metabolism',
                                model_name: 'iJO1366@#%',
                                a: 'b' })
  })

  it('recognizes array attributes', () => {
    the_window.location.search = '?quick_jump[]=iJO1366.Central%20metabolism&quick_jump[]=iJO1366.Fatty%20acid%20metabolism'
    const options = utils.parse_url_components(the_window, { a: 'b' })
    assert.deepEqual(options, { a: 'b',
                                quick_jump: ['iJO1366.Central metabolism',
                                             'iJO1366.Fatty acid metabolism'] })
  })
})

describe('utils.d3_transform_catch', () => {
  it('gets translate', () => {
    assert.deepEqual(utils.d3_transform_catch('translate  ( 20, 30  )'),
                     { translate: [ 20, 30 ], rotate: 0, scale: 0 })
  })

  it('gets translate, rotate, scale', () => {
    assert.deepEqual(
      utils.d3_transform_catch('translate  ( 0, -30.2  )rotate(5.1 ) scale(-3)'),
      { translate: [ 0, -30.2 ], rotate: 5.1, scale: -3.0 }
    )
  })
})

describe('utils.check_browser', () => {
  it('looks for browser name', () => {
    global.navigator = { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) ' +
                         'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
                         appName: 'Netscape',
                         appVersion: '5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 ' +
                         '(KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36' }
    assert.isTrue(utils.check_browser('chrome'))
    assert.isFalse(utils.check_browser('safari'))
  })

  it('returns false if no navigator.userAgent', () => {
    global.navigator = null
    assert.isFalse(utils.check_browser('safari'))
  })
})
