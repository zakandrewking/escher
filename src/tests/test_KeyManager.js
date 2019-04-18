import d3Body from './helpers/d3Body'
import triggerKeyEvent from './helpers/triggerKeyEvent'
import KeyManager from '../KeyManager'

import { describe, it, afterEach } from 'mocha'
import { assert } from 'chai'
import Mousetrap from 'mousetrap'

describe('KeyManager', () => {
  let keyManager

  afterEach(() => {
    // clear the key manager
    if (keyManager) keyManager.toggle(false)
    keyManager = null
  })

  it('initializes', () => {
    keyManager = new KeyManager()
    assert.deepEqual(keyManager.assignedKeys, {})
  })

  it('initializes with selection', () => {
    keyManager = new KeyManager({}, null, d3Body.node())
    assert.strictEqual(keyManager.mousetrap.target, d3Body.node())
  })

  it('mousetrap', () => {
    let pressed = false
    const mousetrap = Mousetrap()
    mousetrap.bind('enter', () => { pressed = true })
    triggerKeyEvent('enter')
    assert.isTrue(pressed)
    mousetrap.reset()
  })

  it('listens and toggles', () => {
    let pressedQ = false
    let pressedP = false
    let target = null
    keyManager = new KeyManager({
      q: {
        key: 'ctrl+q',
        fn: function () { pressedQ = true; target = this },
        target: { my: 'target' }
      },
      p: {
        key: 'p',
        fn: () => { pressedP = true }
      }
    })
    // toggle off
    keyManager.toggle(false)
    triggerKeyEvent('q', ['ctrl'])
    assert.isFalse(pressedQ)
    assert.isFalse(pressedP)
    // toggle on
    keyManager.toggle(true)
    // meta no ctrl
    triggerKeyEvent('q', ['ctrl', 'meta'])
    assert.isFalse(pressedQ)
    assert.isFalse(pressedP)
    // ctrl
    triggerKeyEvent('q', ['ctrl'])
    assert.isTrue(pressedQ)
    assert.deepEqual(target, { my: 'target' })
    assert.isFalse(pressedP)
    // p
    triggerKeyEvent('p')
    assert.isTrue(pressedP)
  })

  it('missing key or function', () => {
    // ok to have key descriptions without 'key' attributes
    keyManager = new KeyManager({ k: { fn: () => ({}) } })
    // will get a warning for a key with no function
    keyManager.assignedKeys['v'] = { key: 'v' }
    keyManager.update()
    triggerKeyEvent('v')
  })

  it('ctrlEqualsCmd', () => {
    let pressed = false
    keyManager = new KeyManager({ k: {
      key: 'ctrl+q',
      fn: () => { pressed = true }
    }}, null, null, true)
    triggerKeyEvent('q', ['meta'])
    assert.isTrue(pressed)
  })

  it('respects capitalization with shift', () => {
    let pressed = false
    keyManager = new KeyManager({ k: {
      key: 'ctrl+shift+q', // 'ctrl-Q' would not wor
      fn: () => { pressed = true }
    }})
    triggerKeyEvent('q', ['ctrl'])
    assert.isFalse(pressed)
    triggerKeyEvent('q', ['ctrl', 'shift'])
    assert.isTrue(pressed)
  })

  it('check inputs', () => {
    let pressed = 0
    let iv = false
    const myInput = { is_visible: () => iv }
    keyManager = new KeyManager({ k: {
      key: 'q',
      fn: () => pressed++,
      ignoreWithInput: true
    }}, [myInput])
    triggerKeyEvent('q')
    assert.strictEqual(pressed, 1)
    iv = true
    triggerKeyEvent('q')
    assert.strictEqual(pressed, 1)
    iv = false
    triggerKeyEvent('q')
    assert.strictEqual(pressed, 2)
  })

  it('update', () => {
    let pressed = 0
    let iv = true
    const myInput = { is_visible: () => iv }
    keyManager = new KeyManager()
    keyManager.assignedKeys = { k: {
      key: 'q',
      fn: () => pressed++,
      ignoreWithInput: true
    }}
    // not updated
    triggerKeyEvent('q')
    assert.strictEqual(pressed, 0)
    // updated
    keyManager.update()
    triggerKeyEvent('q')
    assert.strictEqual(pressed, 1)

    // input
    keyManager.inputList = [myInput]
    triggerKeyEvent('q')
    assert.strictEqual(pressed, 2)
    keyManager.update()
    // will not listen after update because of the new input
    triggerKeyEvent('q')
    assert.strictEqual(pressed, 2)
  })

  it('key listener once', () => {
    keyManager = new KeyManager()
    let called = 0
    keyManager.addKeyListener('x', () => called++, true)
    triggerKeyEvent('x')
    assert.strictEqual(called, 1)
    // only works once
    triggerKeyEvent('x')
    assert.strictEqual(called, 1)
  })

  it('key listener multiple keys', () => {
    keyManager = new KeyManager()
    keyManager.ctrlEqualsCmd = true
    let called = 0
    keyManager.addKeyListener(['x', 'ctrl+y'], () => called++)
    triggerKeyEvent('x')
    assert.strictEqual(called, 1)
    triggerKeyEvent('y', ['meta'])
    assert.strictEqual(called, 2)
  })

  it('key listener unbind', () => {
    keyManager = new KeyManager()
    let calledEnter = false
    let calledEscape = false
    const unbindEnter = keyManager.addKeyListener('enter', () => {
      calledEnter = true
    })
    keyManager.addKeyListener('escape', () => {
      calledEscape = true
    })
    unbindEnter()
    triggerKeyEvent('enter')
    triggerKeyEvent('escape')
    assert.strictEqual(calledEnter, false)
    assert.strictEqual(calledEscape, true)
  })

  it('escape listener', () => {
    keyManager = new KeyManager()
    let calledEscape = false
    keyManager.addEscapeListener(() => { calledEscape = true })
    triggerKeyEvent('escape')
    assert.isTrue(calledEscape)
  })

  it('escape listener manages list', () => {
    keyManager = new KeyManager()
    let calledEscape1 = false
    let calledEscape2 = false
    keyManager.addEscapeListener(() => { calledEscape1 = true })
    keyManager.addEscapeListener(() => { calledEscape2 = true })
    triggerKeyEvent('escape')
    assert.isFalse(calledEscape1)
    assert.isTrue(calledEscape2)
    triggerKeyEvent('escape')
    assert.isTrue(calledEscape1)
    assert.isTrue(calledEscape2)
    triggerKeyEvent('escape')
  })

  it('escape listener manages list with removal', () => {
    keyManager = new KeyManager()
    let calledEscape1 = false
    let calledEscape2 = false
    let calledEscape3 = false
    let calledEscape4 = false
    let calledEscape5 = false
    keyManager.addEscapeListener(() => { calledEscape1 = true })
    const remove2 = keyManager.addEscapeListener(() => { calledEscape2 = true })
    keyManager.addEscapeListener(() => { calledEscape3 = true })
    const remove4 = keyManager.addEscapeListener(() => { calledEscape4 = true })
    remove2()
    remove4()
    keyManager.addEscapeListener(() => { calledEscape5 = true })
    triggerKeyEvent('escape')
    triggerKeyEvent('escape')
    triggerKeyEvent('escape')
    triggerKeyEvent('escape')
    triggerKeyEvent('escape')
    assert.isTrue(calledEscape1)
    assert.isFalse(calledEscape2)
    assert.isTrue(calledEscape3)
    assert.isFalse(calledEscape4)
    assert.isTrue(calledEscape5)
  })

  it('enter listener', () => {
    keyManager = new KeyManager()
    let calledEnter = false
    keyManager.addEnterListener(() => { calledEnter = true })
    triggerKeyEvent('enter')
    assert.isTrue(calledEnter)
  })
})
