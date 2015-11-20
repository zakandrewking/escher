var require_helper = require('./helpers/require_helper');

var Settings = require_helper('Settings');

var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('chai').assert;


describe('Settings', function() {
    it('initializes', function() {
        // new settings object
        var options = {
            selection: null,
            menu: 'all',
            scroll_behavior: 'pan',
            enable_editing: true,
            reaction_styles: ['color', 'size', 'text'],
            reaction_scale: [ { type: 'min', color: '#c8c8c8', size: 4 },
                              { type: 'value', value: 0, color: '#9696ff', size: 8 },
                              { type: 'max', color: '#4b009f', size: 12 } ]
        },
            set_option = function(key, val) { options[key] = val; },
            get_option = function(key) { return options[key]; },
            settings = new Settings(set_option, get_option, Object.keys(options)),
            name = 'reaction_styles',
            val = ['new_style'],
            fired = null;
        // set up the callback
        settings.streams[name].onValue(function(val) { fired = val; });
        // push a new value
        settings.busses[name].push(val);
        // make sure the callback fired
        assert.deepEqual(fired, val);
        // make sure the new value was added to the styles array
        assert.deepEqual(options.reaction_styles, val);
    });
});
