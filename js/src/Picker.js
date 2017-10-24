/** @jsx h */

import {h, Component} from 'preact'
import '../../css/src/Picker.css'
import {select as d3Select, event} from 'd3-selection'
import {drag as d3Drag} from 'd3-drag'

class Picker extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    // const cb = this.props.cb
    const drag = d3Drag()
      .on('drag', () => {
        const xPos = this.props.value + event.dx * (this.props.max / 400)
        this.props.onChange('value', xPos)
      })
      .container(() => this.base.parentNode.parentNode)
    d3Select(this.base).select('.pickerBox').call(drag)
  }

  componentWillUnmount () {
    console.log('component unmounted')
    d3Select(this.base).select('.pickerBox').on('mousedown.drag', null)
  }

  render () {
    return (
      <div
        className='picker'
        id={this.props.id}
        style={!(this.props.id === 'min' || this.props.id === 'max')
          ? {left: `${this.props.value < 4
            ? 4
            : this.props.value / this.props.max > 0.8
            ? this.props.value / this.props.max * 100 - 18
            : this.props.value / this.props.max * 100
            }%`}
          : null}
      >
        <div
          className='trashDiv'
          id={this.props.id === 'max' || this.props.value / this.props.max > 0.8
            ? 'rightOptions'
            : null
          }
          style={(this.props.id === 'min' || this.props.id === 'max')
            ? {display: 'none'}
            : {display: 'block'}
          }
          >
          <i className='fa fa-trash-o' aria-hidden='true' />
        </div>
        <div
          className='pickerBox'
          id={this.props.id === 'max' || this.props.value / this.props.max > 0.8
            ? 'rightOptions'
            : null
          }
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
              this.props.onChange('value', parseFloat(event.target.value))
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
