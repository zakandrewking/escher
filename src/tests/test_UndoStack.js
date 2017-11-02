var UndoStack = require('../UndoStack');

var describe = require('mocha').describe;
var it = require('mocha').it;
var beforeEach = require('mocha').beforeEach;
var assert = require('chai').assert;


describe('UndoStack', function() {
    it('tracks push and pop', function() {
        var undo_stack = new UndoStack(),
            tracker = 0,
            i;
        undo_stack.push(function() { tracker++; });
        undo_stack.undo();
        assert.strictEqual(tracker, 1);
        undo_stack.undo();
        tracker = 0;
        for (i = 0; i < 43; i++) {
            undo_stack.push(function() { tracker++; },
                       function() { tracker--; });
        }
        for (i = 1; i <= 40; i++) {
            undo_stack.undo();
            assert.strictEqual(tracker, i);
            console.assert(tracker == i);
        }
        undo_stack.undo();
        for (i = 39; i >= 0; i--) {
            undo_stack.redo();
            assert.strictEqual(tracker, i);
        }
        undo_stack.redo();
    });
});
