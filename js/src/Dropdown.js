/** @jsx h */
import { h, Component } from 'preact'
import '../../css/src/dropdown.css'

class Dropdown extends Component {
  constructor (props) {
    super(props)
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

  setWrapperRef (node) {
    this.wrapperRef = node
  }

  handleClickOutside (event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({visible: false})
    }
  }

  handleKeyDown (event) {
    if (event.keyCode === 13 || event.keyCode === 40) {
      this.onClick()
    } else if (event.keyCode === 27) {
      this.setState({visible: false})
    }
  }

  onClick () {
    this.setState({
      visible: !this.state.visible
    })
  }

  render () {
    return (
      <li className='dropdown'>
        <div className='dropdownButton' tabindex='0' ref={this.setWrapperRef} onClick={() => this.onClick()} onKeyDown={event => this.handleKeyDown(event)}>
          {this.props.name + ' '}
          <b class='caret' />
        </div>
        <ul className='menu' style={this.state.visible ? {display: 'block'} : {display: 'none'}} id={this.props.rightMenu === 'true' ? 'rightMenu' : ''}>
          {this.props.children.map((listItem) => {
            if (listItem.attributes.name === 'divider') {
              return <li style={{height: '1px', backgroundColor: '#e5e5e5', padding: '0', margin: '8px 0'}} />
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
