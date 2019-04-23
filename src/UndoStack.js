function incr (a, l) {
  return a + 1 > l - 1 ? 0 : a + 1
}

function decr (a, l) {
  return a - 1 < 0 ? l - 1 : a - 1
}

/** UndoStack. A constructor that can be used to store undo info. */
export default class UndoStack {
  constructor () {
    const stackSize = 40
    this.stack = Array(stackSize)
    this.current = -1
    this.oldest = -1
    this.newest = -1
    this.endOfStack = true
    this.topOfStack = true
  }

  push (undo, redo) {
    this.current = incr(this.current, this.stack.length)
    // change the oldest
    if (this.endOfStack) {
      this.oldest = this.current
    } else if (this.oldest === this.current) {
      this.oldest = incr(this.oldest, this.stack.length)
    }
    this.stack[this.current] = { undo, redo }
    this.newest = this.current

    // top of the stack
    this.topOfStack = true
    this.endOfStack = false

    return { do: () => redo() }
  }

  undo () {
    // check that we haven't reached the end
    if (this.endOfStack) return console.warn('End of stack.')
    // run the lastest stack function
    this.stack[this.current].undo()
    if (this.current === this.oldest) {
      // if the next index is less than the oldest, then the stack is dead
      this.endOfStack = true
    } else {
      // reference the next fn
      this.current = decr(this.current, this.stack.length)
    }

    // not at the top of the stack
    this.topOfStack = false
  }

  redo () {
    // check that we haven't reached the end
    if (this.topOfStack) return console.warn('Top of stack.')

    if (!this.endOfStack) {
      this.current = incr(this.current, this.stack.length)
    }
    this.stack[this.current].redo()

    // if at top of stack
    if (this.current === this.newest) {
      this.topOfStack = true
    }

    // not at the end of the stack
    this.endOfStack = false
  }
}
