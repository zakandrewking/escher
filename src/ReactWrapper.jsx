/** @jsx h */
import { h, Component, render } from 'preact'

/**
 * Wrapper class for better integration of Preact components with Escher.
 * In order to use the ref pass an arrow function to whatever is going to call the ref function
 * i.e. functionThatWillUseRef( () => ref )
 */
class ReactWrapper extends Component {
  componentDidMount () {
    this.props.connectSetStateFn(this.setState.bind(this))
  }

  render () {
    return <this.props.component {...this.props} {...this.state} />
  }
}

/**
 * Render the preact component
 */
function renderWrapper (
  component,
  refFn,
  connectSetStateFn,
  divNode,
  props
) {
  render(
    <ReactWrapper
      component={component}
      refFn={refFn}
      connectSetStateFn={connectSetStateFn}
      {...props}
    />,
    divNode,
    // If there is already a div, re-render it. Otherwise make a new one
    divNode.children.length > 0 ? divNode.firstChild : undefined
  )
}

export default renderWrapper
