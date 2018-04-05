/** @jsx h */
import { h, Component } from 'preact'
import _ from 'underscore'

/**
 * Wrapper class for better integration of Preact components with Escher.
 * In order to use the ref pass an arrow function to whatever is going to call the ref function
 * i.e. functionThatWillUseRef( () => refProp )
 */

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
        ref={this.props.refProp}
        closeMenu={this.props.closeMenu}
      />
    } else {
      return null
    }
  }
}

export default ReactWrapper
