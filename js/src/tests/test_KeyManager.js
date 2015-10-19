// These tests require d3 features that are currently not available in
// node/jsdom (e.g. d3.tranform). Hopefully these will eventually be available
// for running and testing all of Escher from the command line.


// var KeyManager = require('../KeyManager');

// var describe = require('mocha').describe;
// var it = require('mocha').it;
// var before = require('mocha').before;
// var assert = require('chai').assert;


// describe('KeyManager', function() {
//     it('initializes', function() {
//         var key_manager = KeyManager(null, {}, ['a', 'list']);
//         expect(key_manager.input_list).toEqual(['a', 'list']);
//     });
// });

// describe('KeySpy', function() {
//     var x, key, key_shift, key_manager,
//         k = 1, k2 = 2, shift = 16;

//     before(function() {
//         x = null;
//         key = { key: k,
//                 fn: function() { return 'return1'; }};
//         key_shift =  { key: k2,
//                        modifiers: { shift: true },
//                        target: 'hi',
//                        fn: function() { x = this; } };
//         key_manager = KeyManager(null, { k1: key, k2: key_shift });

//         spyOn(key, 'fn');
//         spyOn(key_shift, 'fn').and.callThrough();

//     });

//     it('Tests keys', function() {
//         __triggerKeyboardEvent(document.body, k);
//         expect(key.fn).toHaveBeenCalled();
//     });

//     it('Tests disable keys', function() {
//         key_manager.toggle(false);
//         __triggerKeyboardEvent(document.body, k);
//         expect(key.fn).not.toHaveBeenCalled();
//     });

//     it('Tests shift key', function() {
//         __triggerKeyboardEvent(document.body, shift);
//         __triggerKeyboardEvent(document.body, k2);
//         expect(key_shift.fn).toHaveBeenCalled();
//         expect(x).toEqual('hi');
//     });
// });
