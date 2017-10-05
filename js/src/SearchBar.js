/** SearchBar */

/** @jsx h */
import {h, Component} from 'preact'
import '../../css/src/SearchBar.css'

const _ = require('underscore')

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
      current: 1,
      searchItem: null,
      counter: ''
    }
  }

  componentDidMount () {
    this.props.map.key_manager.add_key_listener(
      ['enter', 'ctrl+g'], () => this.next(), false)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ...nextProps,
      current: 1,
      results: null,
      searchItem: null,
      counter: ''
    })
  }

  handleInput (value) {
    if (this.state.visible) {
      const results = this.dropDuplicates(this.props.map.search_index.find(value))
      let counter = ''
      if (results === null || value === '' || !value) {
        counter = ''
        this.props.map.highlight(null)
      } else if (results.length === 0) {
        counter = '0 / 0'
        this.props.map.highlight(null)
      } else {
        counter = (this.state.current + ' / ' + results.length)
        var r = results[this.state.current - 1]
        if (r.type === 'reaction') {
          this.props.map.zoom_to_reaction(r.reaction_id)
          this.props.map.highlight_reaction(r.reaction_id)
        } else if (r.type === 'metabolite') {
          this.props.map.zoom_to_node(r.node_id)
          this.props.map.highlight_node(r.node_id)
        } else if (r.type === 'text_label') {
          this.props.map.zoom_to_text_label(r.text_label_id)
          this.props.map.highlight_text_label(r.text_label_id)
        } else {
          throw new Error('Bad search index data type: ' + r.type)
        }
      }
      this.setState({
        searchItem: value,
        current: 1,
        counter,
        results
      })
    }
  }

  dropDuplicates (results) {
    const compKeys = {
      metabolite: ['m', 'node_id'],
      reaction: ['r', 'reaction_id'],
      text_label: ['t', 'text_label_id']
    }
    return _.uniq(results, item => {
      // make a string for fast comparison
      var t = compKeys[item.type]
      return t[0] + item[t[1]]
    })
  }

  next () {
    if (this.state.results !== null) {
      if (this.state.current === this.state.results.length) {
        this.update(1)
      } else {
        this.update(this.state.current + 1)
      }
    }
  }

  previous () {
    if (this.state.results !== null) {
      if (this.state.current === 1) {
        this.update(this.state.results.length)
      } else {
        this.update(this.state.current - 1)
      }
    }
  }

  update (current) {
    this.setState({
      current,
      counter: current + ' / ' + this.state.results.length
    })
    var r = this.state.results[current - 1]
    if (r.type === 'reaction') {
      this.props.map.zoom_to_reaction(r.reaction_id)
      this.props.map.highlight_reaction(r.reaction_id)
    } else if (r.type === 'metabolite') {
      this.props.map.zoom_to_node(r.node_id)
      this.props.map.highlight_node(r.node_id)
    } else if (r.type === 'text_label') {
      this.props.map.zoom_to_text_label(r.text_label_id)
      this.props.map.highlight_text_label(r.text_label_id)
    } else {
      throw new Error('Bad search index data type: ' + r.type)
    }
  }

  is_visible () {
    return this.state.visible
  }

  render () {
    return (
      <div
        className='searchContainer'
        style={this.state.visible ? {display: 'flex'} : {display: 'none'}}>
        <div className='searchPanel'>
          <input
            className='searchField'
            value={this.state.searchItem}
            onKeyUp={event => this.handleInput(event.target.value)}
            autofocus
          />
          <button className='searchBarButton left' onClick={() => this.previous()}>
            <i className='fa fa-chevron-left ' />
          </button>
          <button className='searchBarButton right' onClick={() => this.next()}>
            <i className='fa fa-chevron-right' />
          </button>
          <div className='searchCounter'>
            {this.state.counter}
          </div>
        </div>
        <button
          className='searchBarButton'
          onClick={() => {
            this.props.map.highlight(null)
            this.setState({visible: false})
          }}
        >
          <i className='fa fa-close fa-lg' />
        </button>
      </div>
    )
  }
}

export default SearchBar
