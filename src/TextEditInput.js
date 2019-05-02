import PlacedDiv from './PlacedDiv'

/**
 * TextEditInput
 */
export default class TextEditInput {
  constructor (selection, map, zoomContainer) {
    const div = selection.append('div')
          .attr('id', 'text-edit-input')
    this.placedDiv = PlacedDiv(div, map)
    this.placedDiv.hide()
    this.input = div.append('input')

    this.map = map
    this.setUpMapCallbacks(map)
    this.zoomContainer = zoomContainer
    this.setUpZoomCallbacks(zoomContainer)

    this.isNew = false
  }

  setUpMapCallbacks (map) {
    // Input
    map.callback_manager.set('edit_text_label.text_edit_input', (target, coords) => {
      this.show(target, coords)
    })

    // new text_label
    map.callback_manager.set('new_text_label.text_edit_input', coords => {
      if (this.activeTarget !== null) {
        this._acceptChanges(this.activeTarget.target)
      }
      this.hide()
      this._addAndEdit(coords)
    })

    map.callback_manager.set('hide_text_label_editor.text_edit_input', () => {
      this.hide()
    })
  }

  setUpZoomCallbacks (zoomContainer) {
    zoomContainer.callbackManager.set('zoom.text_edit_input', () => {
      if (this.activeTarget) {
        this._acceptChanges(this.activeTarget.target)
      }
      if (this.is_visible()) {
        this.hide()
      }
    })
    zoomContainer.callbackManager.set('go_to.text_edit_input', () => {
      if (this.activeTarget) {
        this._acceptChanges(this.activeTarget.target)
      }
      if (this.is_visible()) {
        this.hide()
      }
    })
  }

  is_visible () { // eslint-disable-line camelcase
    return this.placedDiv.is_visible()
  }

  show (target, coords) {
    // save any existing edit
    if (this.activeTarget) {
      this._acceptChanges(this.activeTarget.target)
    }

    // set the current target
    this.activeTarget = { target, coords }

    // set the new value
    target.each(d => {
      this.input.node().value = d.text
    })

    // place the input
    this.placedDiv.place(coords)
    this.input.node().focus()

    // escape key
    this.clearEscape = this.map.key_manager.addEscapeListener(() => {
      this._acceptChanges(target)
      this.hide()
    }, true)
    // enter key
    this.clearEnter = this.map.key_manager.addEnterListener(() => {
      this._acceptChanges(target)
      this.hide()
    }, true)
  }

  hide () {
    this.isNew = false

    // hide the input
    this.placedDiv.hide()

    // clear the value
    this.input.attr('value', '')
    this.activeTarget = null

    // clear escape
    if (this.clearEscape) this.clearEscape()
    this.clearEscape = null
    // clear enter
    if (this.clearEnter) this.clearEnter()
    this.clearEnter = null
    // turn off click listener
    // this.map.sel.on('click.', null)
  }

  _acceptChanges (target) {
    const value = this.input.node().value
    if (value === '') {
      // Delete the label
      target.each(d => {
        const selected = {}
        selected[d.text_label_id] = this.map.text_labels[d.text_label_id]
        this.map.delete_selectable({}, selected, true)
      })
    } else {
      // Set the text
      const textLabelIds = []
      target.each(d => {
        this.map.edit_text_label(d.text_label_id, value, true, this.isNew)
        textLabelIds.push(d.text_label_id)
      })
    }
  }

  _addAndEdit (coords) {
    this.isNew = true

    // Make an empty label
    const textLabelId = this.map.new_text_label(coords, '')
    // Apply the cursor to the new label
    const sel = this.map.sel.select('#text-labels').selectAll('.text-label')
          .filter(d => d.text_label_id === textLabelId)
    sel.select('text').classed('edit-text-cursor', true)
    this.show(sel, coords)
  }
}
