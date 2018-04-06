/** @jsx h */

import { h, Component } from 'preact'
import Picker from './Picker'
import update from 'immutability-helper'
import _ from 'underscore'

import './ScaleSlider.css'

class ScaleSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      keys: null
    }
  }

  /**
   * Sorts the color scale for makeGradient
   */
  sortScale () {
    const newScale = _.sortBy(this.props.scale, element => {
      if (element.type === 'value') {
        return element.value
      } else {
        return this.props.stats[element.type]
      }
    })
    return newScale
  }

  /**
   * Places the pickers as a percentage of the max
   */
  placePickers () {
    const max = this.props.stats.max
    let positions = []
    for (let i = 0; i < this.props.scale.length; i++) {
      const value = this.props.scale[i].value
        ? this.props.scale[i].value
        : this.props.stats[this.props.scale[i].type]
      const position = (value - this.props.stats.min) / (max - this.props.stats.min)
      positions[i] = position < 0.04
        ? 4
        : position > 0.8 && position < 0.95
        ? position * 100 - 18
        : position >= 0.95
        ? 77
        : position * 100
    }
    return positions
  }

  /**
   * Function enabling modification of any color scale attribute
   * @param {number} index - index of the scale object to be modified
   * @param {string} parameter - the parameter to be replaced
   * @param {(number|string)} value - the new value of the parameter
   */
  scaleChange (index, parameter, value) {
    if (parameter === 'value' &&
      (parseFloat(value) > this.props.stats.max ||
      value < this.props.stats.min)) {
      console.warn('Invalid color scale')
    } else {
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
      } else if (!isNaN(parseFloat(value)) || value[0] === '#' && parameter === 'color') {
        newScale = update(this.props.scale, {
          [index]: {
            [parameter]: {$set: value}
          }
        })
        this.props.onChange(newScale)
      }
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
  makeGradient () {
    const min = this.props.stats.min
    const scale = this.sortScale()
    let gradientArray = []
    for (let i = 0; i < scale.length; i++) {
      if (scale[i].type === 'value') {
        gradientArray.push(
          ` ${scale[i].color} ${(scale[i].value - min) / (this.props.stats.max - min) * 100}%`
        )
      } else {
        let value = this.props.stats[scale[i].type]
        gradientArray.push(
          ` ${scale[i].color} ${(value - min) / (this.props.stats.max - min) * 100}%`
        )
      }
    }
    return gradientArray.toString()
  }

  removeColorStop (index) {
    const newScale = update(this.props.scale, {$splice: [[[index], 1]]})
    this.props.onChange(newScale)
  }

  render () {
    const pickerLocations = this.placePickers()

    // -------
    // No data
    // -------

    // Check for data
    if (!this.props.stats) {
      return (
        <div className='scaleEditor'>
          <div>
            <div className='scaleTrack disabled'>
              {this.props.type} data not loaded
              <Picker id='min' focus={() => null} value={0.00} color='' disabled />
              <Picker id='max' focus={() => null} value={1.00} color='' disabled />
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

    // Create the pickers
    const pickers = this.props.scale.map((listItem, i) => {
      if (listItem.type !== 'value') {
        return (
          <Picker
            id={listItem.type}
            left={pickerLocations[i]}
            onChange={
              (parameter, value) => this.scaleChange(i, parameter, value)
            }
            focus={() => this.setState({focusedPicker: i})}
            remove={() => this.removeColorStop(i)}
            min={this.props.stats.min}
            max={this.props.stats.max}
            interval={this.props.stats.max - this.props.stats.min}
            value={
              this.props.stats[listItem.type]
            }
            color={listItem.color}
            size={listItem.size}
            zIndex={this.state.focusedPicker === i ? '2' : '0'}
          />
        )
      } else if (listItem.value != null) {  // Check for valid value type
        return (
          <Picker
            left={pickerLocations[i]}
            onChange={
              (parameter, value) => this.scaleChange(i, parameter, value)
            }
            focus={() => this.setState({focusedPicker: i})}
            remove={() => this.removeColorStop(i)}
            min={this.props.stats.min}
            max={this.props.stats.max}
            interval={this.props.stats.max - this.props.stats.min}
            value={listItem.value}
            color={listItem.color}
            size={listItem.size}
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
          <div className='scaleTrack'>
            <div
              className='gradient'
              onClick={(event) => this.addColorStop(event)}
              style={{
                background: `linear-gradient(to right,${this.makeGradient()})`
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
            onChange={event => this.props.onNoDataColorChange(event.target.value)}
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
