/** @jsx h */
import { h, Component } from 'preact'

class ReactWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentDidMount () {
    this.props.callbackManager.set('setState', this.setState.bind(this))
  }
  render () {
    return <this.props.component
      {...this.state}
      ref={this.props.ref} />
  }
}

export default ReactWrapper
