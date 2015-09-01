describe('UndoStack', function() {
    it("Check class", function () {
        var stack = new escher.UndoStack();
        expect(stack).toEqual(jasmine.any(escher.UndoStack));
        var stack2 = escher.UndoStack();
        expect(stack2).toEqual(jasmine.any(escher.UndoStack));
    });
    it("track push and pop", function() {
        var tracker = 0;
        var stack = new escher.UndoStack();
        stack.push(function() { tracker++; });
        stack.undo();
        expect(tracker).toBe(1);
        stack.undo();
        tracker = 0;
        for (var i=0; i<43; i++) {
            stack.push(function() { tracker++; },
                       function() { tracker--; });
        }
        for (var i=1; i<=40; i++) {
            stack.undo();
            expect(tracker).toBe(i);
            console.assert(tracker == i);
        }
        stack.undo();
        for (var i=39; i>=0; i--) {
            stack.redo();
            expect(tracker).toBe(i);
        }
        stack.redo();
    });
});
