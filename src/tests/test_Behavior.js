import Behavior from '../Behavior'
import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import d3Body from './helpers/d3Body'

function assertSelectableClickAttrsOn (behavior) {
  assert.isFunction(behavior.selectableMousedown)
  assert.isFunction(behavior.selectableClick)
  assert.isFunction(behavior.nodeMouseover)
  assert.isFunction(behavior.nodeMouseout)
}

function assertSelectableClickAttrsOff (behavior) {
  assert.strictEqual(behavior.selectableMousedown, null)
  assert.strictEqual(behavior.selectableClick, null)
  assert.strictEqual(behavior.nodeMouseover, null)
  assert.strictEqual(behavior.nodeMouseout, null)
}

function assertSelectableDragAttrsOn (behavior) {
  assert.notStrictEqual(behavior.selectableDrag, behavior.emptyBehavior)
  assert.notStrictEqual(behavior.bezierDrag, behavior.emptyBehavior)
}

function assertSelectableDragAttrsOff (behavior) {
  assert.strictEqual(behavior.selectableDrag, behavior.emptyBehavior)
  assert.strictEqual(behavior.bezierDrag, behavior.emptyBehavior)
}

function assertLabelDragAttrsOn (behavior) {
  assert.notStrictEqual(behavior.reactionLabelDrag, behavior.emptyBehavior)
  assert.notStrictEqual(behavior.nodeLabelDrag, behavior.emptyBehavior)
}

function assertLabelDragAttrsOff (behavior) {
  assert.strictEqual(behavior.reactionLabelDrag, behavior.emptyBehavior)
  assert.strictEqual(behavior.nodeLabelDrag, behavior.emptyBehavior)
}

function assertLabelMouseoverAttrsOn (behavior) {
  assert.isNotNull(behavior.nodeLabelMouseover)
  assert.isNotNull(behavior.nodeLabelTouch)
  assert.isNotNull(behavior.nodeLabelMouseout)
  assert.isNotNull(behavior.reactionLabelMouseover)
  assert.isNotNull(behavior.reactionLabelTouch)
  assert.isNotNull(behavior.reactionLabelMouseout)
  assert.isNotNull(behavior.geneLabelMouseover)
  assert.isNotNull(behavior.geneLabelTouch)
  assert.isNotNull(behavior.geneLabelMouseout)
}

function assertLabelMouseoverAttrsOff (behavior) {
  assert.isNull(behavior.nodeLabelMouseover)
  assert.isNull(behavior.nodeLabelTouch)
  assert.isNull(behavior.nodeLabelMouseout)
  assert.isNull(behavior.reactionLabelMouseover)
  assert.isNull(behavior.reactionLabelTouch)
  assert.isNull(behavior.reactionLabelMouseout)
  assert.isNull(behavior.geneLabelMouseover)
  assert.isNull(behavior.geneLabelTouch)
  assert.isNull(behavior.geneLabelMouseout)
}

function assertObjectMouseoverAttrsOn (behavior) {
  assert.isNotNull(behavior.nodeObjectMouseover)
  assert.isNotNull(behavior.nodeObjectMouseout)
  assert.isNotNull(behavior.reactionObjectMouseover)
  assert.isNotNull(behavior.reactionObjectMouseout)
}

function assertObjectMouseoverAttrsOff (behavior) {
  assert.isNull(behavior.nodeObjectMouseover)
  assert.isNull(behavior.nodeObjectMouseout)
  assert.isNull(behavior.reactionObjectMouseover)
  assert.isNull(behavior.reactionObjectMouseout)
}

describe('Behavior', () => {
  const map = { sel: d3Body }
  let behavior

  beforeEach(() => { behavior = new Behavior(map, null) })

  it('loads the map', () => {
    assert.strictEqual(behavior.map, map)
  })

  it('toggleSelectableClick', () => {
    behavior.toggleSelectableClick(true)
    assertSelectableClickAttrsOn(behavior)
    behavior.toggleSelectableClick(false)
    assertSelectableClickAttrsOff(behavior)
  })

  it('toggleSelectableDrag', () => {
    behavior.toggleSelectableDrag(true)
    assertSelectableDragAttrsOn(behavior)
    behavior.toggleSelectableDrag(false)
    assertSelectableDragAttrsOff(behavior)
  })

  it('toggleLabelDrag', () => {
    behavior.toggleLabelDrag(true)
    assertLabelDragAttrsOn(behavior)
    behavior.toggleLabelDrag(false)
    assertLabelDragAttrsOff(behavior)
  })

  it('toggleLabelMouseover', () => {
    behavior.toggleLabelMouseover(true)
    assertLabelMouseoverAttrsOn(behavior)
    behavior.toggleLabelMouseover(false)
    assertLabelMouseoverAttrsOff(behavior)
  })

  it('toggleObjectMouseover', () => {
    behavior.toggleObjectMouseover(true)
    assertObjectMouseoverAttrsOn(behavior)
    behavior.toggleObjectMouseover(false)
    assertObjectMouseoverAttrsOff(behavior)
  })
})
