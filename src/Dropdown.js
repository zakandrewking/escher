/**
 * Dropdown. Handles the behavior of the menu bar and the dropdowns. Composed of
 * a menu button and a corresponding menu that displays when the button is
 * clicked.
 */

/** @jsx h */
import { h, Component } from 'preact'
import './Dropdown.css'

class Dropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: null
    }
    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentWillMount () {
    this.setState({
      visible: false
    })
  }

  componentDidMount () {
    document.addEventListener('mouseup', this.handleClickOutside)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({visible: nextProps.visible})
  }

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
      <li className='dropdown'>
        <div
          className='dropdownButton'
          tabindex='0'
          ref={this.setWrapperRef}
          onClick={() => this.setState({visible: !this.state.visible})}
        >
          {this.props.name}&nbsp;
          <i className='icon-down-dir' style={{fontSize: '14px'}} />
        </div>
        <ul
          className='menu'
          style={this.state.visible
            ? {display: 'block'}
            : {display: 'none'}}
          id={this.props.rightMenu === 'true' ? 'rightMenu' : ''}
        >
          {this.props.children.map((listItem) => {
            if (listItem.attributes.name === 'divider') {
              return (
                <li
                  style={{
                    height: '1px',
                    backgroundColor: '#e5e5e5',
                    padding: '0',
                    margin: '8px 0'
                  }}
                />
              )
            } else {
              return listItem
            }
          })}
        </ul>
      </li>
    )
  }
}

export default Dropdown
