define(["utils"], function(utils) {
    /** UndoStack returns a constructor that can be used to store undo info.
     */
    var UndoStack = utils.make_class();
    UndoStack.prototype = { init: init,
                            push: push,
                            undo: undo,
                            redo: redo };
    return UndoStack;

    // definitions
    function init() {
        var stack_size = 40;
        this.stack = Array(stack_size);
        this.current = -1;
        this.oldest = -1;
        this.newest = -1;
        this.end_of_stack = true;
        this.top_of_stack = true;
    }
    function push(undo_fn, redo_fn) {
        this.current = incr(this.current, this.stack.length);
        // var p2 = incr(p1, this.stack.length);
        // change the oldest
        if (this.end_of_stack)
            this.oldest = this.current;
        else if (this.oldest == this.current)
            this.oldest = incr(this.oldest, this.stack.length);
        this.stack[this.current] = { undo: undo_fn, redo: redo_fn };
        this.newest = this.current;

        // top of the stack
        this.top_of_stack = true;
        this.end_of_stack = false;
    }
    function undo() {
        // check that we haven't reached the end
        if (this.end_of_stack) return console.warn('End of stack.');
        // run the lastest stack function
        this.stack[this.current].undo();
        if (this.current == this.oldest) {
            // if the next index is less than the oldest, then the stack is dead
            this.end_of_stack = true;
        } else {
            // reference the next fn
            this.current = decr(this.current, this.stack.length);
        }

        // not at the top of the stack
        this.top_of_stack = false;
    }
    function redo() {
        // check that we haven't reached the end
        if (this.top_of_stack) return console.warn('Top of stack.');

        if (!this.end_of_stack)
            this.current = incr(this.current, this.stack.length);
        this.stack[this.current].redo();

        // if at top of stack
        if (this.current == this.newest)
            this.top_of_stack = true;

        // not at the end of the stack
        this.end_of_stack = false;
    }
    function incr(a, l) {
        return a + 1 > l - 1 ? 0 : a + 1;
    }
    function decr(a, l) {
        return a - 1 < 0 ? l - 1 : a -  1;
    }
});
