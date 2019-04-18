/* global global */

import _ from 'underscore'

export default function (key, held = [], selection = global.document) {
  const isHeld = key => held.indexOf(key) !== -1

  const exceptions = { enter: 13, escape: 27 }
  const code = key in exceptions ? exceptions[key] : key.toUpperCase().charCodeAt(0)
  const details = {
    bubbles: true,
    key: key,
    char: key,
    code: code,
    keyCode: code,
    which: code,
    ctrlKey: isHeld('ctrl'),
    metaKey: isHeld('meta'),
    altKey: isHeld('alt'),
    shiftKey: isHeld('shift')
  }
  const e1 = new global.window.KeyboardEvent('keydown', details)
  selection.dispatchEvent(e1)
  if (!_.contains(['escape', 'backspace'], key)) {
    // no keypress for escape and backspace
    const e2 = new global.window.KeyboardEvent('keypress', details)
    selection.dispatchEvent(e2)
  }
};
