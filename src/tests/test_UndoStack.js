import UndoStack from '../UndoStack'

import { describe, it } from 'mocha'
import { assert } from 'chai'

describe('UndoStack', () => {
  it('returns a do function', () => {
    const undoStack = new UndoStack()
    let didCall = false
    undoStack.push(() => {}, () => { didCall = true }).do()
    assert.isTrue(didCall)
  })

  it('tracks push and pop', () => {
    const undoStack = new UndoStack()
    let tracker = 0
    undoStack.push(() => { tracker++ })
    undoStack.undo()
    assert.strictEqual(tracker, 1)
    undoStack.undo()
    tracker = 0
    for (let i = 0; i < 43; i++) {
      undoStack.push(() => { tracker++ }, () => { tracker-- })
    }
    for (let i = 1; i <= 40; i++) {
      undoStack.undo()
      assert.strictEqual(tracker, i)
    }
    undoStack.undo()
    for (let i = 39; i >= 0; i--) {
      undoStack.redo()
      assert.strictEqual(tracker, i)
    }
    undoStack.redo()
  })
})
