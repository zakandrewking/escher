import Mousetrap from 'mousetrap'
import _ from 'underscore'

/**
 * If ctrlEqualsCmd is true and key has ctrl+ in it, return an array with ctrl+
 * and meta+ variations.
 */
function addCmd (key, ctrlEqualsCmd) {
  if (!ctrlEqualsCmd) return key
  const keyAr = _.isArray(key) ? key : [key]
  const newAr = keyAr.reduce((c, k) => {
    var n = k.replace('ctrl+', 'meta+')
    if (n !== k) c.push(n)
    return c
  }, keyAr.slice())
  return newAr.length === keyAr.length ? key : newAr
}

/**
 * KeyManager - Manage key listeners and events.
 * @param assignedKeys (default: {}): An object defining keys to bind.
 * @param inputList (default: []): A list of inputs that will override keyboard shortcuts when in focus.
 * @param selection (default: global): A node to bind the events to.
 * @param ctrlEqualsCmd (default: false): If true, then control and command have the same effect.
 */
export default class KeyManager {
  constructor (
    assignedKeys = {},
    inputList = [],
    selection = null,
    ctrlEqualsCmd = false,
    settings = null
  ) {
    // default Arguments
    this.assignedKeys = assignedKeys
    this.inputList = inputList
    this.mousetrap = selection ? new Mousetrap(selection) : new Mousetrap()
    this.ctrlEqualsCmd = ctrlEqualsCmd

    // Fix mousetrap behavior; by default, it ignore shortcuts when inputs are
    // in focus.
    // TODO NOT WORKING https://craig.is/killing/mice
    // consider swithching to https://github.com/PolicyStat/combokeys
    this.mousetrap.stopCallback = () => false

    this.escapeQueue = []
    this.removeEscapeListener = null

    // to check settings when running a key
    this.settings = settings

    this.enabled = true
    this.update()
  }

  /**
   * Updated key bindings if attributes have changed.
   */
  update () {
    this.mousetrap.reset()
    if (!this.enabled) return

    // loop through keys
    for (let keyId in this.assignedKeys) {
      const assignedKey = this.assignedKeys[keyId]

      // OK if this is missing
      if (!assignedKey.key) continue

      const keyToBind = addCmd(assignedKey.key, this.ctrlEqualsCmd)
      // remember the inputList
      assignedKey.inputList = this.inputList
      this.mousetrap.bind(keyToBind, e => {
        // check requires
        if (assignedKey.requires && !this.settings.get(assignedKey.requires)) {
          return
        }

        // check inputs
        let inputBlocking = false
        if (assignedKey.ignoreWithInput) {
          for (var i = 0, l = assignedKey.inputList.length; i < l; i++) {
            const thisInputVal = assignedKey.inputList[i]
            const thisInput = _.isFunction(thisInputVal)
                  ? thisInputVal()
                  : thisInputVal
            if (thisInput !== null && thisInput.is_visible()) {
              inputBlocking = true
              break
            }
          }
        }

        if (!inputBlocking) {
          if (assignedKey.fn) assignedKey.fn.call(assignedKey.target)
          else console.warn('No function for key: ' + assignedKey.key)
          e.preventDefault()
        }
      }, 'keydown')
    }
  }

  /**
   * Turn the key manager on or off.
   */
  toggle (onOff) {
    if (_.isUndefined(onOff)) onOff = !this.enabled
    this.enabled = onOff
    this.update()
  }

  /**
   * Call the callback when the enter key is pressed, then unregisters the
   * listener.
   */
  addEnterListener (callback, oneTime) {
    return this.addKeyListener('enter', callback, oneTime)
  }

  /**
   * If the list is empty, drop the listener. could get called after the
   * listener is already removed
   */
  _tryDropEscapeListener () {
    if (this.escapeQueue.length === 0 && this.removeEscapeListener) {
      this.removeEscapeListener()
      this.removeEscapeListener = null
    }
  }
  /**
   * Call the callback when the escape key is pressed, then unregisters the
   * listener.
   *
   * Unlike the other listeners, addEscapeListener keeps a queue of listeners
   * that are called in order then popped off the list.
   *
   * Escape listeners also only work one time.
   */
  addEscapeListener (callback) {
    // if the listener is not set, then add it
    if (this.removeEscapeListener === null) {
      this.removeEscapeListener = this.addKeyListener('escape', () => {
        // pop and run the top callback
        if (this.escapeQueue.length > 0) {
          const top = this.escapeQueue.pop()
          top()
        }
        this._tryDropEscapeListener()
      })
    }

    // push the new callback onto the queue
    this.escapeQueue.push(callback)

    // return a function to pop the callback out of the list
    return () => {
      // find it if it's in the queue
      const index = this.escapeQueue.indexOf(callback)
      // if it's the last one, then pop and activate next
      if (index > -1) {
        // remove it
        this.escapeQueue.splice(index, 1)
      }
      this._tryDropEscapeListener()
    }
  }

  /**
   * Call the callback when the key is pressed, then unregisters the listener.
   * Returns a function that will unbind the event.
   * @param callback: The callback function with no arguments.
   * @param key_name: A key name, or list of key names, as defined by the
   *                  mousetrap library: https://craig.is/killing/mice
   * @param one_time: If True, then cancel the listener after the first execution.
   */
  addKeyListener (keyName, callback, oneTime = false) {
    // unbind function ready to go
    const unbind = this.mousetrap.unbind.bind(this.mousetrap, keyName)

    this.mousetrap.bind(addCmd(keyName, this.ctrlEqualsCmd), e => {
      e.preventDefault()
      callback()
      if (oneTime) unbind()
    })

    return unbind
  }
}
