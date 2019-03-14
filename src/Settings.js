import bacon from 'baconjs'
import _ from 'underscore'

/**
 * Hold on to event when holdProperty is true, and only keep them if
 * acceptProperty is true (when holdProperty becomes false).
 */
function convertToConditionalStream (valueStream, statusStream) {
  // Combine values with status to revert to last value when a reject is passed.
  const init = {
    savedValue: null,
    currentValue: null,
    lastStatus: null
  }

  const held = bacon.combineAsArray(valueStream, statusStream.toProperty(null))
        .scan(init, ({ savedValue, currentValue, lastStatus }, [ value, status ]) => {
          // See if the status was just set
          const newStatus = lastStatus !== status

          if (newStatus && status === 'hold') {
            // Record the currentValue as the savedValue
            return {
              savedValue: currentValue,
              currentValue,
              lastStatus: status
            }
          } else if (!newStatus && status === 'hold') {
            // Record the current value, and keep the savedValue unchanged
            return {
              savedValue,
              currentValue: value,
              lastStatus: status
            }
          } else if (newStatus && status === 'abandon') {
            // Keep the saved value
            return {
              savedValue: null,
              currentValue: savedValue,
              lastStatus: status
            }
          } else if (newStatus && status === 'accept') {
            // Keep the new value
            return {
              savedValue: null,
              currentValue,
              lastStatus: status
            }
          } else {
            // Not held, so keep the value
            return {
              savedValue: null,
              currentValue: value,
              lastStatus: status
            }
          }
        })
  // Skip the initial null value
        .skip(1)
  // Get the current value
        .map(({ currentValue }) => currentValue)
  // Skip duplicate values
        .skipDuplicates()
  // property -> event stream
        .toEventStream()

  return held
}

/**
 * Settings. A class to manage settings for a Map.
 *
 * Arguments
 * ---------
 *
 * setOption: A function, fn(key), that returns the option value for the key.
 *
 * getOption: A function, fn(key, value), that sets the option for the key and
 * value.
 *
 * conditionalOptions: The options to that are conditionally accepted when
 * changed. Changes can be abandoned by calling abandonChanges(), or accepted
 * by calling acceptChanges().
  * @param optionsWithDefaults - The current option values
  * @param conditionalOptions - The options to that are conditionally accepted
  *                             when changed. Changes can be abandoned by calling
  *                             abandon_changes(), or accepted by calling
  *                             accept_changes().
  */
export default class Settings {
  constructor (optionsWithDefaults, conditionalOptions) {
    this._options = optionsWithDefaults

    // Manage accepting/abandoning changes
    this.statusBus = new bacon.Bus()

    // Create the options
    ;[ this.busses, this.streams ] = _.chain(optionsWithDefaults)
      .mapObject((value, key) => {
        const isConditional = _.contains(conditionalOptions, key)
        const { bus, stream } = this.createSetting(key, value, isConditional)
        return [ bus, stream ]
      })             // { k: [ b, s ], ... }
      .pairs()       // [ [ k, [ b, s ] ], ... ]
      .map(([ name, [ bus, stream ] ]) => [[ name, bus ], [ name, stream ]])
                     // [ [ [ k, b ], [ k, s ] ], ... ]
      .unzip()       // [ [ [ k, b ], ... ], [ [ k, s ], ... ] ]
      .map(x => _.object(x)) // [ { k: b, ... }, { k: s, ... } ]
      .value()
  }

  /**
   * Set up a new bus and stream for a conditional setting (i.e. one that can be
   * canceledin the settings menu.
   */
  createSetting (name, initialValue, isConditional) {
    // Set up the bus
    const bus = new bacon.Bus()

    // Make the event stream and conditionally accept changes
    const stream = isConditional
          ? convertToConditionalStream(bus, this.statusBus)
          : bus.toEventStream()

    // Get the latest
    stream.onValue(v => { this._options[name] = v })

    // Push the initial value
    bus.push(initialValue)

    return { bus, stream }
  }

  /**
   * Deprecated. Use `set` instead.
   */
  set_conditional (name, value) { // eslint-disable-line camelcase
    console.warn('set_conditional is deprecated. Use Settings.set() instead')
    return this.set(name, value)
  }

  /**
   * Set the option. This should always be used instead of setting options
   * directly. To set options that respect the Settings menu Accept/Abandon, use
   * setConditional().
   * @param {String} name - The option name
   * @param {} value - The new value
   */
  set (name, value) {
    if (!(name in this.busses)) {
      throw new Error(`Invalid setting name ${name}`)
    }
    this.busses[name].push(value)
  }

  /**
   * Deprecated. Use `get` intead.
   */
  get_option (name) { // eslint-disable-line camelcase
    console.warn('get_option is deprecated. Use Settings.get() instead')
    return this.get(name)
  }

  /**
   * Get an option
   */
  get (name) {
    return this._options[name]
  }

  holdChanges () {
    this.statusBus.push('hold')
  }

  abandonChanges () {
    this.statusBus.push('abandon')
  }

  acceptChanges () {
    this.statusBus.push('accept')
  }
}
