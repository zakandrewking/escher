import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import Scale from '../Scale'

describe('Scale', () => {
  let scale

  beforeEach(() => {
    scale = new Scale()
  })

  /**
   * Scales values should be possible beyond the max and min of the dataset.
   */
  it('respects scale value entries beyond max and min of data', () => {
    const reactionScale = [
      { type: 'median', color: '#FF0000', size: 5 },
      { type: 'value', value: -20, color: '#0000FF', size: 1 },
      { type: 'value', value: 20, color: '#00FF00', size: 10 }
    ]
    const dataStatistics = {
      reaction: {
        max: 10,
        min: -10,
        Q1: 0,
        median: 0,
        Q3: 0
      },
      metabolite: {
        max: 10,
        min: -10,
        Q1: 0,
        median: 0,
        Q3: 0
      }
    }
    const getDataStatistics = () => dataStatistics

    scale.setReactionScale(reactionScale, getDataStatistics)

    assert.strictEqual(scale.reaction_color(-20), 'rgb(0, 0, 255)')
    assert.strictEqual(scale.reaction_color(-10), 'rgb(128, 0, 128)')
    assert.strictEqual(scale.reaction_color(0), 'rgb(255, 0, 0)')
    assert.strictEqual(scale.reaction_color(10), 'rgb(128, 128, 0)')
    assert.strictEqual(scale.reaction_color(20), 'rgb(0, 255, 0)')

    assert.strictEqual(scale.reaction_size(-20), 1)
    assert.strictEqual(scale.reaction_size(-10), 3)
    assert.strictEqual(scale.reaction_size(0), 5)
    assert.strictEqual(scale.reaction_size(10), 7.5)
    assert.strictEqual(scale.reaction_size(20), 10)
  })
})
