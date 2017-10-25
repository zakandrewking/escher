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
    let newScale = update(this.props.scale, {
      $apply: x => {
        return {x: {value: this.props.stats[this.props.scale.type]}}
      }
    })
    newScale = _.sortBy(this.props.scale, 'value')
    console.log(newScale, this.props.scale)
  }

  scaleChange (index, parameter, value) {
    // const sortedScale = this.sortScale()
    if (parameter === 'value' && (parseFloat(value) > this.props.stats.max || value < this.props.stats.min)) {
      console.warn('Invalid color scale')
    } else if (parameter !== 'value' ||
      (value < this.props.scale[index + 1].value &&
      value > this.props.stats[index - 1].value)) {
      const newScale = update(this.props.scale, {
        [index]: {
          // type: {$set: 'value'}, // TODO where does this go on drag?
          [parameter]: {$set: value}
        }
      })
      this.props.onChange(newScale)
    }
  }

  makeGradient () {
    this.sortScale()
    let gradientArray = []
    for (let i = 0; i < this.props.scale.length; i++) {
      if (this.props.scale[i].type === 'value') {
        gradientArray.push(` ${this.props.scale[i].color} ${this.props.scale[i].value / this.props.stats.max * 100}%`)
      } else {
        let value = this.props.stats[this.props.scale[i].type]
        gradientArray.push(` ${this.props.scale[i].color} ${value / this.props.stats.max * 100}%`)
      }
    }
    return gradientArray.toString()
  }

  removeColorStop (index) {
    const newScale = update(this.props.scale, {$splice: [[[index], 1]]})
    console.log(newScale)
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
              <i className='fa fa-plus' />
              <div
                className='scaleTrack'
                style={{
                  background: `linear-gradient(to right,${this.makeGradient()})`
                }}
              >
                {this.props.scale.map((listItem, i) => {
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
