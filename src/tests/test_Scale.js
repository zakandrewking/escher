import { describe, it } from 'mocha'
import Scale from '../Scale'

describe('Scale', () => {
  /** Scales values should be possible beyond the max and min of the dataset.
   */
  it('respects scale value entries beyond max and min of data', () => {
    const scale = Scale(
      [
        { type: 'median', color: 'red', size: 5 },
        { type: 'value', value: -10, color: 'green', size: 10 },
        { type: 'value', value: 10, color: 'green', size: 1 }
      ]
    )
    const metaboliteData = []
    console.log(scale, metaboliteData)
    // assert color of max < color of scales
    // assert color of min > color of scales
  })

  /** When max and min are not provided, the scale should extend from the
   * most-extreme existing point.
   */
  it('respects scale value entries beyond max and min of data', () => {
    const scale = Scale(
      [
        { type: 'median', color: 'red', size: 5 },
        { type: 'value', value: -10, color: 'green', size: 10 },
        { type: 'value', value: 10, color: 'green', size: 1 }
      ]
    )
    const metaboliteData = []
    console.log(scale, metaboliteData)
    // assert color of max < color of scales
    // assert color of min > color of scales
  })
})
