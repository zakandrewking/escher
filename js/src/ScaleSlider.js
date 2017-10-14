/** @jsx h */

import {h, Component} from 'preact'
import Picker from './Picker'
import '../../css/src/ScaleSlider.css'

class ScaleSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scale: props.scale,
      noDataColor: props.noDataColor,
      noDataSize: props.noDataSize
    }
    console.log(props.scale)
  }

  // sortScale (inputScale) {
  //   TODO
  // }

  scaleChange (index, parameter, value) {
    let scale = this.state.scale
    scale[index][parameter] = value
    this.setState({scale})
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      scale: nextProps.scale
    })
  }

  makeGradient () {
    let gradientArray = []
    for (let i = 0; i < this.state.scale.length; i++) {
      if (this.state.scale[i].type === 'value') {
        gradientArray.push(` ${this.state.scale[i].color} ${this.state.scale[i].value / this.props.stats.max * 100}%`)
      } else {
        let type = this.state.scale[i].type
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
        gradientArray.push(` ${this.state.scale[i].color} ${value / this.props.stats.max * 100}%`)
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
                {this.state.scale.map((listItem, i) => {
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
                <Picker id='min' value={0} color='' disabled />
                <Picker id='max' value={1} color='' disabled />
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
          <input type='text' className='colorInput' value={this.state.noDataColor} />
          <input type='color' className='colorWheel' value={this.state.noDataColor} />
          <label>
            Size:
          </label>
          <input type='text' className='sizeInput' value={this.state.noDataSize} />
        </div>
      </div>
    )
  }
}

export default ScaleSlider
