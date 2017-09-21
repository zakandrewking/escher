/** @jsx h */
import { h, Component } from 'preact'
import '../../css/src/dropdown.css'

const _ = require('underscore')

class MenuButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: _.contains(props.disabledButtons, props.name)
    }
  }

  handleFileInput (file) {
    const reader = new window.FileReader()
    reader.onload = (event) => {
      this.props.onClick(JSON.parse(event.target.result))
    }
    if (file !== undefined) {
      reader.readAsText(file)
    }
  }

  render () {
    if (this.props.type === 'load') {
      return (
        <label className='menuButton' tabindex={this.state.disabled ? '-1' : '0'} id={this.state.disabled ? 'disabled' : ''}>
          <input type='file' onChange={event => this.handleFileInput(event.target.files[0])} disabled={this.state.disabled} />
          {this.props.name}
        </label>
      )
    } else if (this.props.modeName !== undefined && this.props.mode === this.props.modeName) {
      return (
        <li className='menuButton' tabindex={this.state.disabled ? '-1' : '0'} onClick={this.props.onClick} id={this.state.disabled ? 'disabled' : ''}>
          <i className='fa fa-check' aria-hidden='true'>&nbsp;</i>
          {this.props.name}
        </li>
      )
    } else {
      return (
        <li className='menuButton' tabindex={this.state.disabled ? '-1' : '0'} onClick={this.state.disabled ? null : this.props.onClick} id={this.state.disabled ? 'disabled' : ''}>
          {this.props.name}
        </li>
      )
    }
  }
}

export default MenuButton
