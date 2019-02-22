/**
 * MenuButton. Handles the individual menu items within the Dropdown menus.
 * Takes in a name and a function and binds the function to a button. If the
 * type prop is defined as 'load' will instead render a label with an attached
 * hidden input[file] element. If the modeName prop is given and the mode prop
 * matches modeName (both strings) it will render a checkmark to the left of the
 * text to signify the current mode.
 */

/** @jsx h */
import { h, Component } from 'preact'
import _ from 'underscore'
import utils from './utils'
import dataStyles from './data_styles'

class MenuButton extends Component {
  handleFileInput (file) {
    const reader = new window.FileReader()
    reader.onload = () => {
      utils.load_json_or_csv(file, dataStyles.csv_converter, (e, d) => this.props.onClick(d))
    }
    if (file !== undefined) {
      reader.readAsText(file)
    }
  }

  render () {
    const disabled = _.contains(this.props.disabledButtons, this.props.name)
    if (this.props.type === 'load') {
      return (
        <label
          className='menuButton'
          tabindex={disabled ? '-1' : '0'}
          id={disabled ? 'disabled' : ''}
        >
          <input
            type='file'
            onChange={event => this.handleFileInput(event.target.files[0])}
            disabled={disabled}
          />
          {this.props.name}
        </label>
      )
    } else if (this.props.modeName !== undefined && this.props.mode === this.props.modeName) {
      return (
        <li
          className='menuButton'
          tabindex={disabled ? '-1' : '0'}
          onClick={this.props.onClick}
          id={disabled ? 'disabled' : ''}
        >
          <i className='icon-ok' aria-hidden='true'>&nbsp;</i>
          {this.props.name}
        </li>
      )
    } else {
      return (
        <li
          className='menuButton'
          tabindex={disabled ? '-1' : '0'}
          onClick={disabled ? null : this.props.onClick}
          id={disabled ? 'disabled' : ''}
        >
          {this.props.name}
        </li>
      )
    }
  }
}

export default MenuButton
