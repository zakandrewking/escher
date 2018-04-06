/** @jsx h */

import { h, Component } from 'preact'

class ScaleSelector extends Component {
  constructor (props) {
    super(props)
    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.state = {
      visible: false
    }
  }

  componentDidMount () {
    document.addEventListener('mouseup', this.handleClickOutside)
  }

  // Reference for hiding the menu when a mouse event happens outside
  setWrapperRef (node) {
    this.wrapperRef = node
  }

  handleClickOutside (event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({visible: false})
    }
  }

  render () {
    return (
      <div className='selector'>
        <div
          className={
            [
              'selectorTitle',
              (this.props.disabled ? 'disabled' : '')
            ].join(' ')
          }
          ref={this.setWrapperRef}
          onClick={() => {
            if (!this.props.disabled) {
              this.setState({visible: !this.state.visible})
            }
          }}
        >
          Preset Scale Selections
          <i className='icon-sort-down' />
        </div>
        <div
          className='selectorMenu'
          style={
            this.state.visible
            ? {display: 'block'}
            : {display: 'none'}}
          >
          {this.props.children.map(listItem => {
            return listItem
          })}
        </div>
      </div>
    )
  }
}

export default ScaleSelector
