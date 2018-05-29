/* global global */

// initalize jsdom
require('./d3Body');
var _ = require('underscore');

module.exports = function(key, held, selection) {
    held = _.isUndefined(held) ? [] : held;
    selection = _.isUndefined(selection) ? global.document : selection;

    var is_held = function(key) {
        return held.indexOf(key) !== -1;
    };

    var exceptions = { enter: 13, escape: 27 },
        code = key in exceptions ? exceptions[key] : key.toUpperCase().charCodeAt(0),
        details = {
            bubbles: true,
            key: key,
            char: key,
            code: code,
            keyCode: code,
            which: code,
            ctrlKey: is_held('ctrl'),
            metaKey: is_held('meta'),
            altKey: is_held('alt'),
            shiftKey: is_held('shift')
        },
        e1 = new global.window.KeyboardEvent('keydown', details);
    selection.dispatchEvent(e1);
    if (!_.contains(['escape', 'backspace'], key)) {
        // no keypress for escape and backspace
        var e2 = new global.window.KeyboardEvent('keypress', details);
        selection.dispatchEvent(e2);
    }
};
