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
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef (node) {
    this.wrapperRef = node
  }

  handleClickOutside (event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
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
      <div className='dropdown' ref={this.setWrapperRef} onClick={() => this.onClick()}>
        {this.props.name + ' '}
        <b class='caret' />
        <div className='menu' style={this.state.visible ? {visibility: 'visible'} : {visibility: 'hidden'}}>
          <ul>
            {this.props.menu.map((listItem) => {
              return <li>{listItem}</li>
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default Dropdown
