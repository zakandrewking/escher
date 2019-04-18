const d3Body = require('./helpers/d3Body')
const trigger_key_event = require('./helpers/trigger_key_event')

const KeyManager = require('../KeyManager')

const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const afterEach = require('mocha').afterEach
const assert = require('chai').assert

const Mousetrap = require('mousetrap')

describe('KeyManager', () => {
  let key_manager

  afterEach(() => {
    // clear the key manager
    if (key_manager)
      key_manager.toggle(false)
    key_manager = null
  })

  it('initializes', () => {
    key_manager = KeyManager({})
    assert.deepEqual(key_manager.assignedKeys, {})
  })

  it('initializes with selection', () => {
    key_manager = KeyManager({}, null, d3Body.node())
    assert.strictEqual(key_manager.mousetrap.target, d3Body.node())
  })

  it('mousetrap', () => {
    let pressed = false
    const mousetrap = Mousetrap()
    mousetrap.bind('enter', () => {
      pressed = true
    })
    trigger_key_event('enter')
    assert.isTrue(pressed)
    mousetrap.reset()
  })

  it('listens and toggles', () => {
    let pressed_q = false
    let pressed_p = false
    let target = null
    key_manager = KeyManager({
      q: { key: 'ctrl+q',
           fn: function() { pressed_q = true; target = this },
           target: { my: 'target' } },
      p: { key: 'p',
           fn: () => pressed_p = true }
    })
    // toggle off
    key_manager.toggle(false)
    trigger_key_event('q', ['ctrl'])
    assert.isFalse(pressed_q)
    assert.isFalse(pressed_p)
    // toggle on
    key_manager.toggle(true)
    // meta no ctrl
    trigger_key_event('q', ['ctrl', 'meta'])
    assert.isFalse(pressed_q)
    assert.isFalse(pressed_p)
    // ctrl
    trigger_key_event('q', ['ctrl'])
    assert.isTrue(pressed_q)
    assert.deepEqual(target, { my: 'target' })
    assert.isFalse(pressed_p)
    // p
    trigger_key_event('p')
    assert.isTrue(pressed_p)
  })

  it('missing key or function', () => {
    // ok to have key descriptions without 'key' attributes
    key_manager = KeyManager({ k: { fn: () => ({}) }})
    // will get a warning for a key with no function
    key_manager.assignedKeys['v'] = { key: 'v' }
    key_manager.update()
    trigger_key_event('v')
  })

  it('ctrl_equals_cmd', () => {
    let pressed = false
    key_manager = KeyManager({ k: {
      key: 'ctrl+q',
      fn: () => pressed = true
    }}, null, null, true)
    trigger_key_event('q', ['meta'])
    assert.isTrue(pressed)
  })

  it('respects capitalization with shift', () => {
    let pressed = false
    const key_manager = KeyManager({ k: {
      key: 'ctrl+shift+q', // 'ctrl-Q' would not wor
      fn: () => pressed = true
    }})
    trigger_key_event('q', ['ctrl'])
    assert.isFalse(pressed)
    trigger_key_event('q', ['ctrl', 'shift'])
    assert.isTrue(pressed)
  })

  it('check inputs', () => {
    let pressed = 0
    let iv = false
    const my_input = { is_visible: () => iv }
    key_manager = KeyManager({ k: {
      key: 'q',
      fn: () => pressed++,
      ignore_with_input: true
    }}, [my_input])
    trigger_key_event('q')
    assert.strictEqual(pressed, 1)
    iv = true
    trigger_key_event('q')
    assert.strictEqual(pressed, 1)
    iv = false
    trigger_key_event('q')
    assert.strictEqual(pressed, 2)
  })

  it('update', () => {
    let pressed = 0
    let iv = true
    const my_input = { is_visible: () => iv }
    key_manager = KeyManager()
    key_manager.assignedKeys = { k: {
      key: 'q',
      fn: () => pressed++,
      ignore_with_input: true
    }}
    // not updated
    trigger_key_event('q')
    assert.strictEqual(pressed, 0)
    // updated
    key_manager.update()
    trigger_key_event('q')
    assert.strictEqual(pressed, 1)

    // input
    key_manager.input_list = [my_input]
    trigger_key_event('q')
    assert.strictEqual(pressed, 2)
    key_manager.update()
    // will not listen after update because of the new input
    trigger_key_event('q')
    assert.strictEqual(pressed, 2)
  })

  it('key listener once', () => {
    key_manager = KeyManager()
    let called = 0
    key_manager.add_key_listener('x', () => called++, true)
    trigger_key_event('x')
    assert.strictEqual(called, 1)
    // only works once
    trigger_key_event('x')
    assert.strictEqual(called, 1)
  })

  it('key listener multiple keys', () => {
    key_manager = KeyManager()
    key_manager.ctrl_equals_cmd = true
    let called = 0
    key_manager.add_key_listener(['x', 'ctrl+y'], () => called++)
    trigger_key_event('x')
    assert.strictEqual(called, 1)
    trigger_key_event('y', ['meta'])
    assert.strictEqual(called, 2)
  })

  it('key listener unbind', () => {
    key_manager = KeyManager()
    let called_enter = false
    let called_escape = false
    const unbind_enter = key_manager.add_key_listener('enter', () => {
      called_enter = true
    })
    const unbind_escape = key_manager.add_key_listener('escape', () => {
      called_escape = true
    })
    unbind_enter()
    trigger_key_event('enter')
    trigger_key_event('escape')
    assert.strictEqual(called_enter, false)
    assert.strictEqual(called_escape, true)
  })

  it('escape listener', () => {
    key_manager = KeyManager()
    let called_escape = false
    key_manager.add_escape_listener(() => called_escape = true)
    trigger_key_event('escape')
    assert.isTrue(called_escape)
  })

  it('enter listener', () => {
    key_manager = KeyManager()
    let called_enter = false
    key_manager.add_enter_listener(() => called_enter = true)
    trigger_key_event('enter')
    assert.isTrue(called_enter)
  })
})
