/** @jsx h */
import { h, Component } from 'preact'

class TooltipComponentContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    this.props.callbackManager.set('setState', this.setState.bind(this))
  }
  render () {
    return <this.props.TooltipComponent
      {...this.state}
      ref={this.props.tooltipRef} />
  }
}

export default TooltipComponentContainer
