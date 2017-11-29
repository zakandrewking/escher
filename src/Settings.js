/** Settings. A class to manage settings for a Map.

 Arguments
 ---------

 setOption: A function, fn(key), that returns the option value for the
 key.

 getOption: A function, fn(key, value), that sets the option for the key
 and value.

 conditionalOptions: The options to that are conditionally accepted when
 changed. Changes can be abandoned by calling abandon_changes(), or accepted
 by calling accept_changes().

 */

import utils from './utils'
import bacon from 'baconjs'

var Settings = utils.make_class()
// instance methods
Settings.prototype = {
  init,
  set_conditional,
  hold_changes,
  abandon_changes,
  accept_changes,
  createConditionalSetting,
  convertToConditionalStream
}
module.exports = Settings

function init (setOption, getOption, conditionalOptions) {
  this.set_option = setOption
  this.get_option = getOption

  // Manage accepting/abandoning changes
  this.status_bus = new bacon.Bus()

  // Create the options
  this.busses = {}
  this.streams = {}
  for (var i = 0, l = conditionalOptions.length; i < l; i++) {
    var name = conditionalOptions[i]
    var out = createConditionalSetting(name, getOption(name), setOption,
                                       this.status_bus)
    this.busses[name] = out.bus
    this.streams[name] = out.stream
  }
}

/**
 * Hold on to event when hold_property is true, and only keep them if
 * accept_property is true (when hold_property becomes false).
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

  return held
}

function createConditionalSetting (name, initialValue, setOption, statusBus) {
  // Set up the bus
  var bus = new bacon.Bus()

  // Make the event stream and conditionally accept changes
  var stream = convertToConditionalStream(bus, statusBus)

  // Get the latest
  stream.onValue(v => setOption(name, v))

  // Push the initial value
  bus.push(initialValue)

  return { bus, stream }
}

/** Set the value of a conditional setting, one that will only be
 accepted if this.accept_changes() is called.

 Arguments
 ---------

 name: The option name

 value: The new value

 */
function set_conditional (name, value) {
  if (!(name in this.busses)) {
    console.error(`Invalid setting name ${name}`)
  } else {
    this.busses[name].push(value)
  }
  // console.log(name, value)
}

function hold_changes () {
  this.status_bus.push('hold')
  // console.log('changes held')
}

function abandon_changes () {
  this.status_bus.push('abandon')
  // console.log('changes abandoned')
}

function accept_changes () {
  this.status_bus.push('accept')
  // console.log('changes accepted')
}
