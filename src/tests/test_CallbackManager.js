import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import CallbackManager from '../CallbackManager'

describe('CallbackManager', () => {
  let cb

  beforeEach(() => {
    cb = new CallbackManager()
  })

  it('accepts and runs multiple functions with dot notation', () => {
    let called1 = false
    let called2 = false
    const f1 = () => { called1 = true }
    const f2 = () => { called2 = true }
    cb.set('my_cb.f1', f1)
    cb.set('my_cb.f2', f2)
    cb.run('my_cb')
    assert.isTrue(called1)
    assert.isTrue(called2)
  })

  it('passes args and this', done => {
    const thisObj = {}
    const fn = function (arg1, arg2) {
      assert.strictEqual(this, thisObj)
      assert.strictEqual(arg1, 1)
      assert.strictEqual(arg2, 2)
      done()
    }
    cb.set('my_cb', fn)
    cb.run('my_cb', thisObj, 1, 2)
  })

  it('can remove function', () => {
    let called = 0
    cb.set('my_cb.f1', () => { called++ })
    cb.run('my_cb')
    assert.strictEqual(called, 1)
    cb.remove('my_cb.f1')
    cb.run('my_cb')
    assert.strictEqual(called, 1)
  })
})
