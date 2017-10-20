/** @jsx h */

import {h, Component} from 'preact'
import Picker from './Picker'
import update from 'immutability-helper'
import '../../css/src/ScaleSlider.css'

class ScaleSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  // sortScale (inputScale) {
  //   TODO
  // }

  scaleChange (index, parameter, value) {
    const newScale = update(this.props.scale, {
      [index]: {
        // type: {$set: 'value'}, // TODO where does this go on drag?
        [parameter]: {$set: value}
      }
    })
    this.props.onChange(newScale)
  }

  // ex () {
  //   const a = [ { c: [ 2 ] } ]
  //   const copy = a.map(x => (_.objectMap(y => [ ...y ])))
  // }

  makeGradient () {
    let gradientArray = []
    for (let i = 0; i < this.props.scale.length; i++) {
      if (this.props.scale[i].type === 'value') {
        gradientArray.push(` ${this.props.scale[i].color} ${this.props.scale[i].value / this.props.stats.max * 100}%`)
      } else {
        let type = this.props.scale[i].type
        let value = type === 'min'
          ? this.props.stats.min
          : type === 'median'
          ? this.props.stats.median
          : type === 'max'
          ? this.props.stats.max
          : type === 'Q1'
          ? this.props.stats.Q1
          : type === 'Q3'
          ? this.props.stats.Q3
          : 0
        gradientArray.push(` ${this.props.scale[i].color} ${value / this.props.stats.max * 100}%`)
      }
    }
    return gradientArray.toString()
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
                        value={listItem.type === 'min'
                          ? `min (${this.props.stats.min.toFixed(2)})`
                          : listItem.type === 'median'
                          ? `median (${this.props.stats.median.toFixed(2)})`
                          : listItem.type === 'max'
                          ? `max (${this.props.stats.max.toFixed(2)})`
                          : listItem.type === 'Q1'
                          ? `Q1 (${this.props.stats.Q1.toFixed(2)})`
                          : `Q3 (${this.props.stats.Q3.toFixed(2)})`
                        }
                        size={listItem.size}
                      />
                    )
                  } else {
                    return (
                      <Picker
                        value={listItem.value}
                        onChange={
                          (parameter, value) => this.scaleChange(i, parameter, value)
                        }
                        max={this.props.stats.max}
                        color={listItem.color}
                        size={listItem.size}
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
                <Picker id='min' value={`min (0.000)`} color='' disabled />
                <Picker id='max' value={`max (1.000)`} color='' disabled />
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
