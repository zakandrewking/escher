/** @jsx h */

import {h, Component} from 'preact'
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
    const max = this.props.abs
      ? this.props.stats.max
      : this.props.stats.max + Math.abs(this.props.stats.min)
    let positions = {}
    for (let i = 0; i < this.props.scale.length; i++) {
      const scaleValue = this.props.scale[i].value
        ? this.props.scale[i].value
        : this.props.stats[this.props.scale[i].type]
      const value = this.props.abs
        ? scaleValue
        : scaleValue + Math.abs(this.props.stats.min)
      positions[i] = value / max < 0.04
        ? 4
        : value / max > 0.8 && value / max < 0.95
        ? value / max * 100 - 18
        : value / max >= 0.95
        ? 77
        : value / max * 100
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
      } else if (value === 'value') {
        newScale = update(this.props.scale, {
          [index]: {
            [parameter]: {$set: value},
            $merge: {'value': this.props.stats[this.props.scale[index].type]}
          }
        })
        this.props.onChange(newScale)
      } else if (!isNaN(parseFloat(value))) {
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
        value: event.layerX / event.target.clientWidth * this.props.stats.max,
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
    const min = this.props.abs ? 0 : Math.abs(this.props.stats.min)
    const scale = this.sortScale()
    let gradientArray = []
    for (let i = 0; i < scale.length; i++) {
      if (scale[i].type === 'value') {
        gradientArray.push(
          ` ${scale[i].color} ${(scale[i].value + min) / (this.props.stats.max + min) * 100}%`
        )
      } else {
        let value = this.props.stats[scale[i].type]
        gradientArray.push(
          ` ${scale[i].color} ${(value + min) / (this.props.stats.max + min) * 100}%`
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
    return (
      <div className='scaleEditor'>
        {(this.props.stats !== null && this.props.stats !== undefined) &&
         (this.props.stats.min !== null && this.props.stats.min !== undefined) &&
         (this.props.stats.max !== null && this.props.stats.max !== undefined)
          ? (
            <div>
              <i className='settingsTip'>To add a color stop to the scale, click the gradient</i>
              <div
                className='scaleTrack'
              >
                <div
                  className='gradient'
                  onClick={(event) => this.addColorStop(event)}
                  style={{
                    background: `linear-gradient(to right,${this.makeGradient()})`
                  }}
                />
                {this.props.scale.map((listItem, i) => {
                  if (listItem.value === null || listItem.value === undefined) {
                    return (
                      <Picker
                        id={listItem.type}
                        color={listItem.color}
                        left={pickerLocations[i]}
                        onChange={
                          (parameter, value) => this.scaleChange(i, parameter, value)
                        }
                        focus={() => this.setState({focusedPicker: i})}
                        value={
                          parseFloat(this.props.stats[listItem.type].toFixed(2))
                        }
                        max={this.props.stats.max}
                        size={listItem.size}
                        zIndex={
                          this.state.focusedPicker === i
                          ? '2'
                          : '0'
                        }
                      />
                    )
                  } else {
                    return (
                      <Picker
                        value={parseFloat(listItem.value.toFixed(2))}
                        onChange={
                          (parameter, value) => this.scaleChange(i, parameter, value)
                        }
                        focus={() => this.setState({focusedPicker: i})}
                        remove={() => this.removeColorStop(i)}
                        max={
                          this.props.stats.max + (this.props.abs
                            ? 0
                            : Math.abs(this.props.stats.min))
                          }
                        min={this.props.abs ? 0 : Math.abs(this.props.stats.min)}
                        color={listItem.color}
                        size={listItem.size}
                        left={pickerLocations[i]}
                        zIndex={
                          this.state.focusedPicker === i
                          ? '2'
                          : '0'
                        }
                      />
                    )
                  }
                })}
              </div>
            </div>
          ) : (
            <div>
              <div
                className='scaleTrack'
                style={{
                  background: '#f1ecfa',
                  color: '#b19ec0',
                  padding: '4px 0',
                  justifyContent: 'center'
                }}
              >
                {this.props.type} data not loaded
                <Picker id='min' focus={() => null} value={0.00} color='' disabled />
                <Picker id='max' focus={() => null} value={1.00} color='' disabled />
              </div>
            </div>
          )}
        <div className='scaleLabels'>
          <label>
            Value:
          </label>
          <label>
            Color:
          </label>
          <label>
            Size:
          </label>
        </div>
        <div className='noDataStyle'>
          <label className='styleHeader'>
            Styles for reactions with no data
          </label>
          <br />
          <label>
            Color:
          </label>
          <input type='text' className='colorInput' value={this.props.noDataColor} />
          <input type='color' className='colorWheel' value={this.props.noDataColor} />
          <label>
            Size:
          </label>
          <input type='text' className='sizeInput' value={this.props.noDataSize} />
        </div>
      </div>
    )
  }
}

export default ScaleSlider
