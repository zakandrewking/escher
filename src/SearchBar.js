/** SearchBar */

/** @jsx h */
import {h, Component} from 'preact'
import './SearchBar.css'

import * as _ from 'underscore'

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
      current: 1,
      searchItem: null,
      counter: '',
      clearNext: this.props.map.key_manager.add_key_listener(
        ['enter', 'ctrl+g'], () => this.next(), false),
      clearPrevious: this.props.map.key_manager.add_key_listener(
        ['shift+enter', 'shift+ctrl+g'], () => this.previous(), false)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.props.map.key_manager.add_escape_listener(() => this.close(), true)
    this.setState({
      ...nextProps,
      current: 1,
      results: null,
      searchItem: null,
      counter: '',
      clearNext: this.props.map.key_manager.add_key_listener(
        ['enter', 'ctrl+g'], () => this.next(), false),
      clearPrevious: this.props.map.key_manager.add_key_listener(
        ['shift+enter', 'shift+ctrl+g'], () => this.previous(), false)
    })

    // can remove code:
    // if (!this.props.visible && nextProps.visible) {
    //   set flag here
    // }
  }

  componentDidUpdate () {
    // check flag here
    // componentDidAppear()
    this.inputRef.focus()
  }

  // componentDidAppear () {
  //   this.inputRef.focus()
  // }

  /**
   * Updates map focus and search bar counter when new search term is entered.
   * @param {string} value - Search term
   */
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
    if (this.state.results) {
      if (this.state.current === this.state.results.length) {
        this.update(1)
      } else {
        this.update(this.state.current + 1)
      }
    }
  }

  previous () {
    if (this.state.results) {
      if (this.state.current === 1) {
        this.update(this.state.results.length)
      } else {
        this.update(this.state.current - 1)
      }
    }
  }

  /**
   * Updates the map focus and search bar counter for when buttons are clicked.
   * @param {number} current - index of current search result
   */
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

  close () {
    this.props.map.highlight(null)
    this.setState({visible: false})
    this.state.clearNext()
    this.state.clearPrevious()
  }

  is_visible () {
    return this.state.visible
  }

  render () {
    return (
      <div
        className='searchContainer'
        style={this.state.visible ? {display: 'inline-flex'} : {display: 'none'}}>
        <div className='searchPanel'>
          <input
            className='searchField'
            value={this.state.searchItem}
            onInput={event => this.handleInput(event.target.value)}
            ref={input => { this.inputRef = input }}
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
          onClick={() => this.close()}
        >
          <i className='fa fa-close fa-lg' style={{marginTop: '-2px', verticalAlign: 'middle'}} />
        </button>
      </div>
    )
  }
}

export default SearchBar
