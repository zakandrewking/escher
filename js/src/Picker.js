/** @jsx h */

import {h, Component} from 'preact'
import '../../css/src/Picker.css'

class Picker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.value < 4 ? 4 : this.props.value
    }
  }
  render () {
    return (
      <div
        className='picker'
        id={this.props.id}
        style={!this.props.id ? {left: `${this.state.value}%`} : null}
      >
        <div className='pickerBox' />
        <div className='pickerOptions'>
          <input type='text' className='option' />
          <div className='colorOptions'>
            <input type='text' className='colorText' />
            <input type='color' className='colorWheel' />
          </div>
          <input type='text' className='option' />
        </div>
      </div>
    )
  }
}

export default Picker
