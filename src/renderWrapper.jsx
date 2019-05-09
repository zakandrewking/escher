/** @jsx h */

import { h, Component, render } from 'preact'

class Wrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.connectSetStateFn(props => this.setState(props))
  }

  is_visible () { // eslint-disable-line camelcase
    return this.state.display
  }

  render () {
    if (!this.state.display) return null

    // Pass the new props, and always pass the ref
    return (
      <this.props.component
        setDisplay={display => this.setState({ display })}
        ref={this.props.refPassthrough}
        {...this.state}
      />
    )
  }
}

/**
 * Wrapper for better integration of Preact components with Escher. The
 * component can be updated using the connectSetStateFn to set up a callback for
 * updates from other components.
 * @param {} component - A Preact component
 *
 * @param {} ref - A preact ref for the wrapper so that the "display" state can
 *                 be tracked.
 */
export default function renderWrapper (
  component,
  ref,
  connectSetStateFn,
  divNode,
  refPassthrough = null
) {
  render(
    <Wrapper
      component={component}
      connectSetStateFn={connectSetStateFn}
      ref={ref}
      refPassthrough={refPassthrough}
    />,
    divNode,
    // If there is already a div, re-render it. Otherwise make a new one
    divNode.children.length > 0 ? divNode.firstChild : undefined
  )
}
