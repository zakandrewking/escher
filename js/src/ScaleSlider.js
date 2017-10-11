/** @jsx h */

import {h, Component} from 'preact'
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
    const stats = this.props.map.get_data_statistics()
    let gradientArray = []
    for (let i = 0; i < this.props.scale.length; i++) {
      if (this.props.scale[i].type === 'value') {
        gradientArray.push(`, ${this.props.scale[i].color} ${this.props.scale[i].value / stats.reaction.max * 100}`)
      } else {
        let type = this.props.scale[i].type
        let value = type === 'min'
          ? stats.reaction.min
          : type === 'median'
          ? stats.reaction.median
          : type === 'max'
          ? stats.reaction.max
          : type === 'Q1'
          ? stats.reaction.Q1
          : type === 'Q3'
          ? stats.reaction.Q3
          : 0
        gradientArray.push(` ${this.props.scale[i].color} ${value / stats.reaction.max * 100}%`)
      }
    }
    console.log(gradientArray.toString())
    return gradientArray.toString()
  }

  render () {
    return (
      <div className='scaleEditor'>
        <div
          className='scaleTrack'
          style={{
            background: `linear-gradient(to right,${this.makeGradient()})`
          }}
        />
        <div className='pickers' />
      </div>
    )
  }
}

export default ScaleSlider
