/** @jsx h */

import { h, Component } from 'preact'
import Picker from './Picker'
import update from 'immutability-helper'
import _ from 'underscore'

import './ScaleSlider.css'

const TRACK_WIDTH = 400

class ScaleSlider extends Component {
  /**
   * Sorts the color scale for makeGradient
   */
  sortScale () {
    const newScale = _.sortBy(this.props.scale, stop => {
      if (stop.type === 'value') {
        return stop.value
      } else {
        return this.props.stats[stop.type]
      }
    })
    return newScale
  }

  /**
   * Places the pickers as a percentage of the max
   */
  placePickers () {
    const stats = this.props.stats

    // Get min and max from scale stops too
    const [ absoluteMin, absoluteMax ] = this.props.scale.reduce(
      ([ curMin, curMax ], stop) => {
        if (stop.type === 'value') {
          return [ Math.min(stop.value, curMin), Math.max(stop.value, curMax) ]
        } else {
          return [ curMin, curMax ]
        }
      },
      [ stats.min, stats.max ]
    )

    // Calculate positions
    const pickerLocations = this.props.scale.map(stop => {
      const value = stop.type === 'value' ? stop.value : stats[stop.type]
      // normalize within min/max
      return (value - absoluteMin) / (absoluteMax - absoluteMin)
    })

    return { pickerLocations, absoluteMax, absoluteMin }
  }

  /**
   * Function enabling modification of any color scale attribute
   * @param {number} index - index of the scale object to be modified
   * @param {string} parameter - the parameter to be replaced
   * @param {(number|string)} value - the new value of the parameter
   */
  scaleChange (index, parameter, value) {
    let newScale = null
    if (parameter === 'type' && value !== 'value') {
      newScale = update(this.props.scale, {
        [index]: {
          [parameter]: {$set: value},
          $unset: ['value']
        }
      })
      this.props.onChange(newScale)
    } else if (parameter === 'value' && this.props.scale[index].type !== 'value') {
      newScale = update(this.props.scale, {
        [index]: {
          [parameter]: {$set: value},
          'type': {$set: 'value'}
        }
      })
      this.props.onChange(newScale)
    } else if (value === 'value') {
      newScale = update(this.props.scale, {
        [index]: {
          [parameter]: {$set: value},
          $merge: {'value': this.props.stats[this.props.scale[index].type]}
        }
      })
      this.props.onChange(newScale)
    } else if (!isNaN(parseFloat(value)) || (value[0] === '#' && parameter === 'color')) {
      newScale = update(this.props.scale, {
        [index]: {
          [parameter]: {$set: value}
        }
      })
      this.props.onChange(newScale)
    }
  }

  addColorStop (event) {
    const newScale = update(this.props.scale, {
      $push: [{
        type: 'value',
        value: event.layerX / event.target.clientWidth * this.props.stats.max +
            (1 - event.layerX / event.target.clientWidth) * this.props.stats.min,
        color: '#9696ff',
        size: 20
      }]
    })
    this.props.onChange(newScale)
  }

  /**
   * Sorts and then returns a string that can be fed into the HTML linear-gradient style
   */
  makeGradient (min, max) {
    const sortedScale = this.sortScale()
    // Fix for when there is one or zero stops
    const sortedScaleFix = (
      sortedScale.length === 1
      ? [sortedScale[0], sortedScale[0]]
      : (
        sortedScale.length === 0
        ? [{ type: 'min', color: '#f1ecfa' }, { type: 'max', color: '#f1ecfa' }]
        : sortedScale
      )
    )
    return sortedScaleFix.map(stop => {
      const value = stop.type === 'value' ? stop.value : this.props.stats[stop.type]
      return ` ${stop.color} ${(value - min) / (max - min) * 100}%`
    }).toString()
  }

  removeColorStop (index) {
    const newScale = update(this.props.scale, {$splice: [[[index], 1]]})
    this.props.onChange(newScale)
  }

  render () {
    // -------
    // No data
    // -------

    // Check for data
    if (!this.props.stats) {
      return (
        <div className='scaleEditor'>
          <div>
            <div
              className='scaleTrack disabled'
              style={{ width: TRACK_WIDTH }}
            >
              {this.props.type} data not loaded
              <Picker location={0} trackWidth={TRACK_WIDTH} disabled />
              <Picker location={1} trackWidth={TRACK_WIDTH} disabled />
            </div>
          </div>
          <div className='scaleLabels'>
            <label>Value:</label><label>Color:</label><label>Size:</label>
          </div>
          <div className='noDataStyle'>
            <label className='styleHeader'>Styles for reactions with no data</label>
            <br />
            <label>Color:</label>
            <input type='text' className='colorInput' disabled />
            <input type='color' className='colorWheel' disabled />
            <label>Size:</label>
            <input type='text' className='sizeInput' disabled />
          </div>
        </div>
      )
    }

    // --------
    // Has data
    // --------

    const {
      pickerLocations,
      absoluteMax,
      absoluteMin
    } = this.placePickers()

    // Create the pickers
    const pickers = this.props.scale.map((stop, i) => {
      if (stop.type !== 'value') {
        return (
          <Picker
            trackWidth={TRACK_WIDTH}
            type={stop.type}
            location={pickerLocations[i]}
            onChange={
              (parameter, value) => this.scaleChange(i, parameter, value)
            }
            focus={() => this.setState({ focusedPicker: i })}
            remove={() => this.removeColorStop(i)}
            min={absoluteMin}
            max={absoluteMax}
            value={
              this.props.stats[stop.type]
            }
            color={stop.color}
            size={stop.size}
            zIndex={this.state.focusedPicker === i ? '2' : '0'}
          />
        )
      } else if (stop.value != null) {  // Check for valid value type
        return (
          <Picker
            trackWidth={TRACK_WIDTH}
            type={stop.type}
            location={pickerLocations[i]}
            onChange={
              (parameter, value) => this.scaleChange(i, parameter, value)
            }
            focus={() => this.setState({focusedPicker: i})}
            remove={() => this.removeColorStop(i)}
            min={absoluteMin}
            max={absoluteMax}
            value={stop.value}
            color={stop.color}
            size={stop.size}
            zIndex={this.state.focusedPicker === i ? '2' : '0'}
          />
        )
      }
    })

    // Render everything
    return (
      <div className='scaleEditor'>
        <div>
          <i className='settingsTip'>To add a color stop to the scale, click the gradient</i>
          <div
            className='scaleTrack'
            style={{width: TRACK_WIDTH}}
          >
            <div
              className='gradient'
              onClick={(event) => this.addColorStop(event)}
              style={{
                background: `linear-gradient(to right,${this.makeGradient(absoluteMin, absoluteMax)})`
              }}
            />
            {pickers}
          </div>
        </div>
        <div className='scaleLabels'>
          <label>Value:</label><label>Color:</label><label>Size:</label>
        </div>
        <div className='noDataStyle'>
          <label className='styleHeader'>Styles for reactions with no data</label>
          <br />
          <label>
            Color:
          </label>
          <input
            type='text'
            className='colorInput'
            value={this.props.noDataColor}
            onInput={event => this.props.onNoDataColorChange(event.target.value)}
          />
          <input
            type='color'
            className='colorWheel'
            value={this.props.noDataColor}
            onInput={event => this.props.onNoDataColorChange(event.target.value)}
          />
          <label>
            Size:
          </label>
          <input
            type='text'
            className='sizeInput'
            value={this.props.noDataSize}
            onInput={event => this.props.onNoDataSizeChange(parseFloat(event.target.value))}
          />
        </div>
      </div>
    )
  }
}

export default ScaleSlider
