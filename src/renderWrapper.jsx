/** @jsx h */
import { h, Component, render } from 'preact'

class Wrapper extends Component {
  constructor (props) {
    super(props)
    this.state = { newProps: {} }
  }

  componentDidMount () {
    // Use newProps within state instead of setting state directly so that the
    // new props are fresh every time
    this.props.connectSetStateFn(newProps => this.setState({ newProps }))
  }

  render () {
    // Pass the new props, and always pass the ref
    return (
      <this.props.component
        ref={this.props.refPassthrough}
        {...this.state.newProps}
      />
    )
  }
}

/**
 * Wrapper for better integration of Preact components with Escher.
 * @param {} component - A Preact component
 */
function renderWrapper (
  component,
  ref,
  connectSetStateFn,
  divNode,
  props
) {
  render(
    <Wrapper
      component={component}
      connectSetStateFn={connectSetStateFn}
      refPassthrough={ref}
    />,
    divNode,
    // If there is already a div, re-render it. Otherwise make a new one
    divNode.children.length > 0 ? divNode.firstChild : undefined
  )
}

export default renderWrapper
