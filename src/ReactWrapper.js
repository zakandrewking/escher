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
    console.log(this.state)
    if (!_.isEmpty(this.state)) {
      return <this.props.component
        {...this.state}
        ref={this.props.refProp} />
    } else {
      return null
    }
  }
}

export default ReactWrapper
