/** @jsx h */

import {h, Component} from 'preact'
import Picker from './Picker'
import update from 'immutability-helper'
import * as _ from 'underscore'
import '../../css/src/ScaleSlider.css'

class ScaleSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

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

  scaleChange (index, parameter, value) {
    const scale = this.sortScale()
    const lowerValue = scale[index - 1].type === 'value'
      ? scale[index - 1].value
      : this.props.stats[scale[index - 1].type]
    const upperValue = scale[index + 1].type === 'value'
      ? scale[index + 1].value
      : this.props.stats[scale[index + 1].type]
    if (parameter === 'value' && (parseFloat(value) > this.props.stats.max || value < this.props.stats.min)) {
      console.warn('Invalid color scale')
    } else if (parameter !== 'value' ||
      ((upperValue - value) / this.props.stats.max > 0.039 &&
      (value - lowerValue) / this.props.stats.max > 0.039)) {
      let newScale = null
      if (parameter === 'type' && value !== 'value') {
        newScale = update(this.props.scale, {
          [index]: {
            [parameter]: {$set: value}
          },
          $unset: ['value']
        })
      } else {
        newScale = update(this.props.scale, {
          [index]: {
            [parameter]: {$set: value}
          }
        })
      }
      this.props.onChange(newScale)
    }
  }

  addColorStop () {
    const newScale = update(this.props.scale, {
      $push: [{
        type: 'value',
        value: Math.random() * this.props.stats.max,
        color: '#9696ff',
        size: 20
      }]
    })
    this.props.onChange(newScale)
  }

  makeGradient () {
    const scale = this.sortScale()
    let gradientArray = []
    for (let i = 0; i < scale.length; i++) {
      if (scale[i].type === 'value') {
        gradientArray.push(` ${scale[i].color} ${scale[i].value / this.props.stats.max * 100}%`)
      } else {
        let value = this.props.stats[scale[i].type]
        gradientArray.push(` ${scale[i].color} ${value / this.props.stats.max * 100}%`)
      }
    }
    return gradientArray.toString()
  }

  removeColorStop (index) {
    const scale = this.sortScale()
    const newScale = update(scale, {$splice: [[[index], 1]]})
    this.props.onChange(newScale)
  }

  render () {
    return (
      <div className='scaleEditor'>
        {(this.props.stats !== null && this.props.stats !== undefined) &&
         (this.props.stats.min !== null && this.props.stats.min !== undefined) &&
         (this.props.stats.max !== null && this.props.stats.max !== undefined)
          ? (
            <div>
              <i className='fa fa-plus' onClick={() => this.addColorStop()} />
              <div
                className='scaleTrack'
                style={{
                  background: `linear-gradient(to right,${this.makeGradient()})`
                }}
              >
                {this.sortScale().map((listItem, i) => {
                  if (!listItem.value) {
                    return (
                      <Picker
                        id={listItem.type}
                        color={listItem.color}
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
                        max={this.props.stats.max}
                        color={listItem.color}
                        size={listItem.size}
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
              <i className='fa fa-plus' />
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
