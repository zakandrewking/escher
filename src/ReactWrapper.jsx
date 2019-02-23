/** @jsx h */
import { h, Component } from 'preact'

/**
 * Wrapper class for better integration of Preact components with Escher.
 * In order to use the ref pass an arrow function to whatever is going to call the ref function
 * i.e. functionThatWillUseRef( () => ref )
 */
class ReactWrapper extends Component {
  componentDidMount () {
    this.props.callbackManager.set(this.props.callbackName, s => this.setState(s))
  }

  render () {
    return <this.props.component {...this.props} {...this.state} />
  }
}

export default ReactWrapper
