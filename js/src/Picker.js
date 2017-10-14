/** @jsx h */

import {h, Component} from 'preact'
import '../../css/src/Picker.css'

class Picker extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div
        className='picker'
        id={this.props.id}
        style={!(this.props.id === 'min' || this.props.id === 'max')
          ? {left: `${this.props.value < 4
            ? 4
            : this.props.value / this.props.max * 100
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
        <div
          className='pickerBox'
          onMouseDown={() => this.setState({focused: true})}
          onMouseUp={() => this.setState({focused: false})}
        />
        <div className='pickerOptions'>
          <input
            type='text'
            className='option'
            value={this.props.value}
            disabled={this.props.id}
            style={this.state.focused
              ? {zIndex: '1'}
              : {zIndex: '0'}
            }
            onInput={(event) => {
              this.props.onChange('value', parseInt(event.target.value))
            }}
            onFocus={(event) => {
              event.target.select()
              this.setState({focused: true})
            }}
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
              onInput={(event) => {
                this.props.onChange('color', event.target.value)
              }}
              onFocus={(event) => {
                event.target.select()
                this.setState({focused: true})
              }}
              onBlur={() => this.setState({focused: false})}
              value={this.props.color}
              disabled={this.props.disabled}
            />
            <input
              type='color'
              className='colorWheel'
              style={this.state.focused
                ? {zIndex: '1'}
                : {zIndex: '0'}
              }
              onInput={(event) => {
                this.props.onChange('color', event.target.value)
              }}
              onFocus={(event) => {
                event.target.select()
                this.setState({focused: true})
              }}
              onBlur={() => this.setState({focused: false})}
              value={this.props.color}
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
            onInput={(event) => {
              this.props.onChange('size', parseInt(event.target.value))
            }}
            onFocus={(event) => {
              event.target.select()
              this.setState({focused: true})
            }}
            onBlur={() => this.setState({focused: false})}
            value={this.props.size}
            disabled={this.props.disabled}
          />
        </div>
      </div>
    )
  }
}

export default Picker
