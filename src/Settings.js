import bacon from 'baconjs'

function createSetting (name, initialValue, setOption) {
  // Set up the bus
  const bus = new bacon.Bus()

  // Make the event stream and conditionally accept changes
  const stream = bus.toEventStream()

  // Get the latest
  stream.onValue(v => setOption(name, v))

  // Push the initial value
  bus.push(initialValue)

  return { bus, stream }
}

function createConditionalSetting (name, initialValue, setOption, statusBus) {
  // Set up the bus
  const conditionalBus = new bacon.Bus()
  const bus = new bacon.Bus()

  // Make the event stream and conditionally accept changes
  const stream = convertToConditionalStream(conditionalBus, statusBus)
        .merge(bus)

  // Get the latest
  stream.onValue(v => setOption(name, v))

  // Push the initial value
  conditionalBus.push(initialValue)

  return { conditionalBus, bus, stream }
}

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
 *
 */
export default class Settings {
  constructor (setOption, getOption, options, conditionalOptions) {
    this.get_option = getOption

    // Manage accepting/abandoning changes
    this.statusBus = new bacon.Bus()

    // Create the options
    this.conditionalBusses = {}
    this.busses = {}
    this.streams = {}
    for (let i = 0; i < options.length; i++) {
      const name = options[i]
      if (conditionalOptions.indexOf(name) > -1) {
        const {
          conditionalBus,
          bus,
          stream
        } = createConditionalSetting(name, getOption(name), setOption,
                                     this.statusBus)
        this.conditionalBusses[name] = conditionalBus
        this.busses[name] = bus
        this.streams[name] = stream
      } else {
        const { bus, stream } = createSetting(name, getOption(name), setOption)
        this.busses[name] = bus
        this.streams[name] = stream
      }
    }
  }

  /**
   * Set the value of a conditional setting, one that will only be
   * accepted if this.acceptChanges() is called.
   *
   * @param {String} name - The option name
   * @param {} value - The new value
  */
  setConditional (name, value) {
    if (!(name in this.conditionalBusses)) {
      console.error(`Invalid setting name ${name}`)
    } else {
      this.conditionalBusses[name].push(value)
    }
  }

  /**
   * Set the option. This should always be used instead of setting options
   * directly. To set options that respect the Settings menu Accept/Abandon, use
   * setConditional().
   */
  set (name, value) {
    if (!(name in this.busses)) {
      console.error(`Invalid setting name ${name}`)
    } else {
      this.busses[name].push(value)
    }
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
