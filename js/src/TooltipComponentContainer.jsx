/** @jsx h */
import { h, Component } from 'preact'

class TooltipComponentContainer extends Component {
  constructor (props) {
    super(props)
    this.state = null
  }
  componentDidMount () {
    this.props.callbackManager.set('setState', this.setState.bind(this))
    console.log(this.state)
  }
  render () {
    const TooltipComponent = this.props.TooltipComponent
    return (
      <TooltipComponent
        callbackManager={this.props.callbackManager}
        stateData={this.state}
      />
    )
  }
}

export default TooltipComponentContainer
