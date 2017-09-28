/** @jsx h */
import { h, Component } from 'preact'
import ScaleEditor from './ScaleEditor.js'

class ScaleEditorContainer extends Component {
  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = () => false

  render () {
    return (
      <div className='scaleEditorContainer' />
    )
  }
}

export default ScaleEditorContainer
