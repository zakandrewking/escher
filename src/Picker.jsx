/** @jsx h */

import { h, Component } from 'preact'
import { select as d3Select, event } from 'd3-selection'
import { drag as d3Drag } from 'd3-drag'

import './Picker.css'

class Picker extends Component {
  componentDidMount () {
    if (this.props.onChange && !this.props.disabled) {
      const drag = d3Drag()
        .on('drag', () => {
          // If it was not a value slider before, make it one
          if (this.props.type !== 'value') {
            if (this.props.onChange) this.props.onChange('type', 'value')
          }

          // New location
          const newValue = (
            this.props.value + (
              (event.dx / this.props.trackWidth) *
              (this.props.max - this.props.min)
            )
          )

          // Don't go outside bar
          const newLimValue = Math.max(
            this.props.min,
            Math.min(
              this.props.max,
              newValue
            )
          )

          this.props.onChange('value', newLimValue)
        })
        .container(() => this.base.parentNode.parentNode)
      d3Select(this.base).select('.pickerBox').call(drag)
    }
  }

  componentWillUnmount () {
    d3Select(this.base).select('.pickerBox').on('mousedown.drag', null)
  }

  render () {
    return (
      <div
        className='picker'
        style={{
          left: `${this.props.location * this.props.trackWidth}px`,
          zIndex: this.props.zIndex
        }}
      >
        {this.props.showTrash &&
          <div className='trashDiv'>
            <i
              className='icon-trash-empty'
              aria-hidden='true'
              onClick={() => {
                if (this.props.remove) this.props.remove()
              }}
            />
          </div>
        }
        <div
          className='pickerBox'
          onMouseDown={() => {
            if (this.props.focus) this.props.focus()
          }}
        />
        <div
          className={
            [
              'pickerOptions',
              this.props.location > 0.8 ? 'rightOptions' : ''
            ].join(' ')
          }
        >
          <input
            type='text'
            className='option'
            value={
              this.props.disabled ? '' : (
                this.props.type === 'value'
                ? parseFloat(this.props.value.toFixed(2))
                : `${this.props.type} (${parseFloat(this.props.value.toFixed(2))})`
              )
            }
            disabled={this.props.disabled}
            onInput={(event) => {
              const newVal = parseFloat(event.target.value)
              if (!isNaN(newVal)) this.props.onChange('value', newVal)
            }}
            onFocus={(event) => {
              event.target.select()
              if (this.props.focus) this.props.focus()
            }}
          />
          <select
            className='typePicker'
            value={this.props.type}
            onChange={(event) => {
              if (this.props.onChange) this.props.onChange('type', event.target.value)
            }}
            disabled={this.props.disabled}
            onFocus={(event) => {
              if (this.props.focus) this.props.focus()
            }}
          >
            <option value='value'>Value</option>
            <option value='min'>Min</option>
            <option value='mean'>Mean</option>
            <option value='Q1'>Q1</option>
            <option value='median'>Median</option>
            <option value='Q3'>Q3</option>
            <option value='max'>Max</option>
          </select>
          <div className='colorOptions'>
            <input
              type='text'
              className='colorText'
              onInput={(event) => {
                if (this.props.onChange) this.props.onChange('color', event.target.value)
              }}
              onFocus={(event) => {
                event.target.select()
                if (this.props.focus) this.props.focus()
              }}
              value={this.props.color || ''}
              disabled={this.props.disabled}
            />
            <input
              type='color'
              className='colorWheel'
              onInput={(event) => {
                if (this.props.onChange) this.props.onChange('color', event.target.value)
              }}
              onFocus={(event) => {
                event.target.select()
                if (this.props.focus) this.props.focus()
              }}
              value={this.props.color || ''}
              disabled={this.props.disabled}
            />
          </div>
          <input
            type='text'
            className='option'
            onInput={(event) => {
              if (this.props.onChange) this.props.onChange('size', parseInt(event.target.value))
            }}
            onFocus={(event) => {
              event.target.select()
              if (this.props.focus) this.props.focus()
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
