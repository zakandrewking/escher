/** @jsx h */
import { h, Component } from 'preact'
import ScaleEditor from './ScaleEditor.js'

const d3_select = require('d3-selection').select

class ScaleEditorContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editor: null
    }
  }

  componentDidMount () {
    const editor = new ScaleEditor(
      d3_select(this.base),
      this.props.type,
      this.props.settings,
      () => this.props.map.get_data_statistics()
    )
    this.setState({editor})
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    console.log(this.props.map.get_data_statistics())
    return (
      <div className='scaleEditorContainer' />
    )
  }
}

export default ScaleEditorContainer
