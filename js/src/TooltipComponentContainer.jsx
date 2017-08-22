/** @jsx h */
import { h, Component } from 'preact'

class TooltipComponentContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    this.props.callbackManager.set('setState', s => {
      return this.setState.bind(this)(s)
    })
  }
  render () {
    return <this.props.TooltipComponent {...this.state} />
  }
}

export default TooltipComponentContainer
