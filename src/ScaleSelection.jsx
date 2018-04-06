/** @jsx h */
import {h, Component} from 'preact'

class ScaleSelection extends Component {
  constructor (props) {
    super(props)
    const colors = []
    if (props.scale) {
      for (let i = 0; i < props.scale.length; i++) {
        colors.push(props.scale[i].color)
      }
    }
    this.state = {
      colors
    }
  }
  render () {
    return (
      <div className='scaleSelection' onClick={() => this.props.onClick()}>
        <div className='scaleName'>
          {this.props.name}
        </div>
        <div className='scaleColors'>
          {this.state.colors.map(color => {
            return <i className='icon-blank' style={{color: color}} />
          })}
        </div>
      </div>
    )
  }
}

export default ScaleSelection
