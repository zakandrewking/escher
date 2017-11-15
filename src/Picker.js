/** @jsx h */

import {h, Component} from 'preact'
import './Picker.css'
import {select as d3Select, event} from 'd3-selection'
import {drag as d3Drag} from 'd3-drag'

class Picker extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    let xPos = null
    const drag = d3Drag()
      .on('drag', () => {
        if (this.props.id === 'max' || this.props.id === 'min') {
          console.warn('Min/Max not draggable')
        } else {
          if (this.props.id !== undefined && this.props.id !== 'value') {
            this.props.onChange('type', 'value')
          }
          if (this.props.value / this.props.max < 0.04) {
            xPos = 0.04 * this.props.max + event.dx * (this.props.max / 400)
          } else if (this.props.value / this.props.max > 0.95) {
            xPos = 0.95 * this.props.max + event.dx * (this.props.max / 400)
          } else {
            xPos = this.props.value + event.dx * (this.props.max / 400)
          }
          this.props.onChange('value', xPos)
        }
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
          ? {left: `${this.props.left}%`, zIndex: this.props.zIndex}
          : {zIndex: this.props.zIndex}
        }
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
          <i
            className='icon-trash-o'
            aria-hidden='true'
            onClick={() => this.props.remove()}
          />
        </div>
        <div
          className='pickerBox'
          id={this.props.id === 'max' || this.props.value / this.props.max > 0.8
            ? 'rightOptions'
            : null
          }
          onMouseDown={() => this.props.focus()}
        />
        <div className='pickerOptions'>
          <input
            type='text'
            className='option'
            value={this.props.id
              ? `${this.props.id} (${this.props.value})`
              : this.props.value
            }
            disabled={this.props.id}
            onInput={(event) => {
              this.props.onChange('value', parseFloat(event.target.value))
            }}
            onFocus={(event) => {
              event.target.select()
              this.props.focus()
            }}
          />
          <select
            className='typePicker'
            style={this.props.id === 'min' || this.props.id === 'max'
              ? {display: 'none'}
              : null
            }
            onChange={(event) => this.props.onChange('type', event.target.value)}
          >
            <option value='value'>Value</option>
            <option value='mean'>Mean</option>
            <option value='Q1'>Q1</option>
            <option value='median'>Median</option>
            <option value='Q3'>Q3</option>
          </select>
          <div className='colorOptions'>
            <input
              type='text'
              className='colorText'
              onInput={(event) => {
                this.props.onChange('color', event.target.value)
              }}
              onFocus={(event) => {
                event.target.select()
                this.props.focus()
              }}
              value={this.props.color}
              disabled={this.props.disabled}
            />
            <input
              type='color'
              className='colorWheel'
              onInput={(event) => {
                this.props.onChange('color', event.target.value)
              }}
              onFocus={(event) => {
                event.target.select()
                this.props.focus()
              }}
              value={this.props.color}
              disabled={this.props.disabled}
            />
          </div>
          <input
            type='text'
            className='option'
            onInput={(event) => {
              this.props.onChange('size', parseInt(event.target.value))
            }}
            onFocus={(event) => {
              event.target.select()
              this.props.focus()
            }}
            value={this.props.size}
            disabled={this.props.disabled}
          />
        </div>
      </div>
    )
  }
}

export default Picker
