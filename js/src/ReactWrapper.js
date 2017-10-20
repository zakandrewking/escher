/** @jsx h */
import { h, Component } from 'preact'
import _ from 'underscore'

class ReactWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount () {
    this.props.callbackManager.set('setState', this.setState.bind(this))
  }
  render () {
    if (!_.isEmpty(this.state)) {
      return <this.props.component
        {...this.state}
        ref={this.props.ref} />
    } else {
      return null
    }
  }
}

export default ReactWrapper
