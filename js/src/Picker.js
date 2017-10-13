/** @jsx h */

import {h, Component} from 'preact'
import '../../css/src/Picker.css'

class Picker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.id
        ? `${this.props.id} (${this.props.value})`
        : this.props.value.toFixed(2),
      color: this.props.color,
      size: this.props.size
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.id
        ? `${nextProps.id} (${nextProps.value})`
        : nextProps.value.toFixed(2),
      color: nextProps.color,
      size: nextProps.size
    })
  }

  render () {
    return (
      <div
        className='picker'
        id={this.props.id}
        style={!(this.props.id === 'min' || this.props.id === 'max')
          ? {left: `${this.state.value < 4
            ? 4
            : this.state.value / this.props.max * 100
            }%`}
          : null}
      >
        <div
          className='trashDiv'
          style={(this.props.id === 'min' || this.props.id === 'max')
            ? {display: 'none'}
            : {display: 'block'}
          }
          >
          <i className='fa fa-trash-o' aria-hidden='true' />
        </div>
        <div className='pickerBox' />
        <div className='pickerOptions'>
          <input
            type='text'
            className='option'
            value={this.state.value}
            disabled={this.props.id}
            style={this.state.focused
              ? {zIndex: '1'}
              : {zIndex: '0'}
            }
            onFocus={() => this.setState({focused: true})}
            onBlur={() => this.setState({focused: false})}
          />
          <div className='colorOptions'>
            <input
              type='text'
              className='colorText'
              style={this.state.focused
                ? {zIndex: '1'}
                : {zIndex: '0'}
              }
              onFocus={() => this.setState({focused: true})}
              onBlur={() => this.setState({focused: false})}
              value={this.state.color}
              disabled={this.props.disabled}
            />
            <input
              type='color'
              className='colorWheel'
              style={this.state.focused
                ? {zIndex: '1'}
                : {zIndex: '0'}
              }
              onFocus={() => this.setState({focused: true})}
              onBlur={() => this.setState({focused: false})}
              value={this.state.color}
              disabled={this.props.disabled}
            />
          </div>
          <input
            type='text'
            className='option'
            style={this.state.focused
              ? {zIndex: '1'}
              : {zIndex: '0'}
            }
            onFocus={() => this.setState({focused: true})}
            onBlur={() => this.setState({focused: false})}
            value={this.state.size}
            disabled={this.props.disabled}
          />
        </div>
      </div>
    )
  }
}

export default Picker
