/** @jsx h */
import { h, Component } from 'preact'

class MenuButton extends Component {
  render () {
    return (
      <div className='menuButton' onClick={this.props.function}>
        {this.props.name}
      </div>
    )
  }
}

export default MenuButton
