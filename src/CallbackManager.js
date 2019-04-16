/** CallbackManager */
export default class CallbackManager {
  /**
   * As in d3 callbacks, you can namespace your callbacks after a period:
   * select_metabolite.direction_arrow, select_metabolite.input. Both are called
   * by select_metabolite.
  */
  set (name, fn) {
    if (this.callbacks === undefined) this.callbacks = {}
    if (this.callbacks[name] === undefined) this.callbacks[name] = []
    this.callbacks[name].push(fn)
  }

  /** Remove a callback by name */
  remove (name) {
    if (this.callbacks === undefined || Object.keys(this.callbacks).length === 0) {
      console.warn('No callbacks to remove')
    } else {
      delete this.callbacks[name]
    }
  }

  /**
   * Run all callbacks that match the portion of name before the period ('.').
   * @param {String} name - The callback name, which can include a tag after a
   * '.' to specificy a particular callback.
   * @param {Any} thisArg = null - The object assigned to `this` in the
   * callback.
  */
  run (name, thisArg = null, ...passArgs) {
    if (this.callbacks === undefined) return
    // look for matching callback names
    for (let aName in this.callbacks) {
      const splitName = aName.split('.')[0]
      if (splitName === name) {
        this.callbacks[aName].forEach(fn => {
          fn.apply(thisArg, passArgs)
        })
      }
    }
  }
}
