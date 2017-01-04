var require_helper = require('./helpers/require_helper');

var Behavior = require_helper('Behavior');

var describe = require('mocha').describe;
var it = require('mocha').it;
var beforeEach = require('mocha').beforeEach;
var assert = require('chai').assert;

var d3_body = require('./helpers/d3_body');

function assert_selectable_click_attrs_on(behavior) {
    assert.isFunction(behavior.selectable_mousedown);
    assert.isFunction(behavior.selectable_click);
    assert.isFunction(behavior.node_mouseover);
    assert.isFunction(behavior.node_mouseout);
}

function assert_selectable_click_attrs_off(behavior) {
    assert.strictEqual(behavior.selectable_mousedown, null);
    assert.strictEqual(behavior.selectable_click, null);
    assert.strictEqual(behavior.node_mouseover, null);
    assert.strictEqual(behavior.node_mouseout, null);
}

function assert_selectable_drag_attrs_on(behavior) {
    assert.notStrictEqual(behavior.selectable_drag, behavior.empty_behavior);
    assert.notStrictEqual(behavior.bezier_drag, behavior.empty_behavior);
}

function assert_selectable_drag_attrs_off(behavior) {
    assert.strictEqual(behavior.selectable_drag, behavior.empty_behavior);
    assert.strictEqual(behavior.bezier_drag, behavior.empty_behavior);
}


function assert_label_drag_attrs_on(behavior) {
    assert.notStrictEqual(behavior.reaction_label_drag, behavior.empty_behavior);
    assert.notStrictEqual(behavior.node_label_drag, behavior.empty_behavior);
}

function assert_label_drag_attrs_off(behavior) {
    assert.strictEqual(behavior.reaction_label_drag, behavior.empty_behavior);
    assert.strictEqual(behavior.node_label_drag, behavior.empty_behavior);
}

function assert_label_mouseover_attrs_on (behavior) {
  assert.isFunction(behavior.label_mouseover)
}

function assert_label_mouseover_attrs_off (behavior) {
  assert.isNull(behavior.label_mouseover)
}


describe('Behavior', function() {
    var map = { sel: d3_body },
        behavior;
    beforeEach(function() {
        behavior = Behavior(map, null);
    });

    it('loads the map', function() {
        assert.strictEqual(behavior.map, map);
    });
    it('turn_everything_on', function() {
        behavior.turn_everything_off();
        behavior.turn_everything_on();
        assert_selectable_click_attrs_on(behavior);
        assert_selectable_drag_attrs_on(behavior);
        assert_label_drag_attrs_on(behavior);
        assert_label_mouseover_attrs_on(behavior)
    });
    it('turn_everything_off', function() {
        behavior.turn_everything_on();
        behavior.turn_everything_off();
        assert_selectable_click_attrs_off(behavior);
        assert_selectable_drag_attrs_off(behavior);
        assert_label_drag_attrs_off(behavior);
        assert_label_mouseover_attrs_off(behavior)
    });
    it('toggle_selectable_click', function() {
        behavior.toggle_selectable_click(true);
        assert_selectable_click_attrs_on(behavior);
        behavior.toggle_selectable_click(false);
        assert_selectable_click_attrs_off(behavior);
    });
    it('toggle_selectable_drag', function() {
        behavior.toggle_selectable_drag(true);
        assert_selectable_drag_attrs_on(behavior);
        behavior.toggle_selectable_drag(false);
        assert_selectable_drag_attrs_off(behavior);
    });
    it('toggle_label_drag', function() {
        behavior.toggle_label_drag(true);
        assert_label_drag_attrs_on(behavior);
        behavior.toggle_label_drag(false);
        assert_label_drag_attrs_off(behavior);
    });
  it('toggle_label_mouseover', function () {
    behavior.toggle_label_mouseover(true)
    assert_label_mouseover_attrs_on(behavior)
    behavior.toggle_label_mouseover(false)
    assert_label_mouseover_attrs_off(behavior)
  })
})
