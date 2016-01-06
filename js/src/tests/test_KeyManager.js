/* global global */

var require_helper = require('./helpers/require_helper');
var d3_body = require('./helpers/d3_body');
var trigger_key_event = require('./helpers/trigger_key_event');

var KeyManager = require_helper('KeyManager');

var describe = require('mocha').describe;
var it = require('mocha').it;
var beforeEach = require('mocha').beforeEach;
var afterEach = require('mocha').afterEach;
var assert = require('chai').assert;

var Mousetrap = require('mousetrap');


describe('KeyManager', function() {
    var key_manager;

    afterEach(function() {
        // clear the key manager
        if (key_manager)
            key_manager.toggle(false);
        key_manager = null;
    });

    it('initializes', function() {
        key_manager = KeyManager({});
        assert.deepEqual(key_manager.assigned_keys, {});
    });

    it('initializes with selection', function() {
        key_manager = KeyManager({}, null, d3_body.node());
        assert.strictEqual(key_manager.mousetrap.target, d3_body.node());
    });

    it('mousetrap', function() {
        var pressed = false,
            mousetrap = Mousetrap();
        mousetrap.bind('enter', function() {
            pressed = true;
        });
        trigger_key_event('enter');
        assert.isTrue(pressed);
        mousetrap.reset();
    });

    it('listens and toggles', function() {
        var pressed_q = false,
            pressed_p = false,
            target = null;
        key_manager = KeyManager({
            q: { key: 'ctrl+q',
                 fn: function() { pressed_q = true; target = this; },
                 target: { my: 'target' } },
            p: { key: 'p',
                 fn: function() { pressed_p = true; } }
        });
        // toggle off
        key_manager.toggle(false);
        trigger_key_event('q', ['ctrl']);
        assert.isFalse(pressed_q);
        assert.isFalse(pressed_p);
        // toggle on
        key_manager.toggle(true);
        // meta no ctrl
        trigger_key_event('q', ['ctrl', 'meta']);
        assert.isFalse(pressed_q);
        assert.isFalse(pressed_p);
        // ctrl
        trigger_key_event('q', ['ctrl']);
        assert.isTrue(pressed_q);
        assert.deepEqual(target, { my: 'target' });
        assert.isFalse(pressed_p);
        // p
        trigger_key_event('p');
        assert.isTrue(pressed_p);
    });

    it('missing key or function', function() {
        // ok to have key descriptions without 'key' attributes
        key_manager = KeyManager({ k: { fn: function() {} }});
        // will get a warning for a key with no function
        key_manager.assigned_keys['v'] = { key: 'v' };
        key_manager.update();
        trigger_key_event('v');
    });

    it('ctrl_equals_cmd', function() {
        var pressed = false;
        key_manager = KeyManager({ k: {
            key: 'ctrl+q',
            fn: function() { pressed = true; }
        }}, null, null, true);
        trigger_key_event('q', ['meta']);
        assert.isTrue(pressed);
    });

    it('respects capitalization with shift', function() {
        var pressed = false,
            key_manager = KeyManager({ k: {
                key: 'ctrl+shift+q', // 'ctrl-Q' would not wor
                fn: function() { pressed = true; }
            }});
        trigger_key_event('q', ['ctrl']);
        assert.isFalse(pressed);
        trigger_key_event('q', ['ctrl', 'shift']);
        assert.isTrue(pressed);
    });

    it('check inputs', function() {
        var pressed = 0,
            iv = false,
            my_input = { is_visible: function() { return iv; } };
        key_manager = KeyManager({ k: {
            key: 'q',
            fn: function() { pressed++; },
            ignore_with_input: true
        }}, [my_input]);
        trigger_key_event('q');
        assert.strictEqual(pressed, 1);
        iv = true;
        trigger_key_event('q');
        assert.strictEqual(pressed, 1);
        iv = false;
        trigger_key_event('q');
        assert.strictEqual(pressed, 2);
    });

    it('update', function() {
        var pressed = 0,
            iv = true,
            my_input = { is_visible: function() { return iv; } };
        key_manager = KeyManager();
        key_manager.assigned_keys = { k: {
            key: 'q',
            fn: function() { pressed++; },
            ignore_with_input: true
        }};
        // not updated
        trigger_key_event('q');
        assert.strictEqual(pressed, 0);
        // updated
        key_manager.update();
        trigger_key_event('q');
        assert.strictEqual(pressed, 1);

        // input
        key_manager.input_list = [my_input];
        trigger_key_event('q');
        assert.strictEqual(pressed, 2);
        key_manager.update();
        // will not listen after update because of the new input
        trigger_key_event('q');
        assert.strictEqual(pressed, 2);
    });

    it('key listener', function() {
        key_manager = KeyManager();
        var called = 0;
        key_manager.add_key_listener(function() { called++; }, 'x', true);
        trigger_key_event('x');
        assert.strictEqual(called, 1);
        // only works once
        trigger_key_event('x');
        assert.strictEqual(called, 1);
    });

    it('key listener unbind', function() {
        key_manager = KeyManager();
        var called_enter = false,
            called_escape = false,
            unbind_enter = key_manager.add_key_listener(function() {
                called_enter = true;
            }, 'enter'),
            unbind_escape = key_manager.add_key_listener(function() {
                called_escape = true;
            }, 'escape');
        unbind_enter();
        trigger_key_event('enter');
        trigger_key_event('escape');
        assert.strictEqual(called_enter, false);
        assert.strictEqual(called_escape, true);
    });

    it('escape listener', function() {
        key_manager = KeyManager();
        var called_escape = false;
        key_manager.add_escape_listener(function() { called_escape = true; });
        trigger_key_event('escape');
        assert.isTrue(called_escape);
    });

    it('enter listener', function() {
        key_manager = KeyManager();
        var called_enter = false;
        key_manager.add_enter_listener(function() { called_enter = true; });
        trigger_key_event('enter');
        assert.isTrue(called_enter);
    });
});
