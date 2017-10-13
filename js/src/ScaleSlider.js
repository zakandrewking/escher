/** @jsx h */

import {h, Component} from 'preact'
import Picker from './Picker'
import '../../css/src/ScaleSlider.css'

class ScaleSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gradient: []
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      gradient: []
    })
  }

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
    if (this.props.stats) {
      return (
        <div className='scaleEditor'>
          <i className='fa fa-plus' />
          <div
            className='scaleTrack'
            style={{
              background: `linear-gradient(to right,${this.makeGradient()})`
            }}
          >
            {this.props.scale.map((listItem) => {
              if (!listItem.value) {
                return (
                  <Picker
                    id={listItem.type}
                    color={listItem.color}
                    value={listItem.type === 'min'
                      ? this.props.stats.min.toFixed(2)
                      : listItem.type === 'median'
                      ? this.props.stats.median.toFixed(2)
                      : listItem.type === 'max'
                      ? this.props.stats.max.toFixed(2)
                      : listItem.type === 'Q1'
                      ? this.props.stats.Q1.toFixed(2)
                      : this.props.stats.Q3.toFixed(2)}
                    size={listItem.size} />
                )
              } else {
                console.log(listItem)
                return (
                  <Picker
                    value={listItem.value}
                    max={this.props.stats.max}
                    color={listItem.color}
                    size={listItem.size}
                  />
                )
              }
            })}
          </div>
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
            <input type='text' className='colorInput' />
            <input type='color' className='colorWheel' />
            <label>
              Size:
            </label>
            <input type='text' className='sizeInput' />
          </div>
        </div>
      )
    } else {
      return (
        <div className='scaleEditor'>
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
            <input type='text' className='colorInput' />
            <input type='color' className='colorWheel' />
            <label>
              Size:
            </label>
            <input type='text' className='sizeInput' />
          </div>
        </div>
      )
    }
  }
}

export default ScaleSlider
