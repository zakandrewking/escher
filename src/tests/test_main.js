var require_helper = require('./helpers/require_helper');

var escher = require_helper('main');

var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('chai').assert;


describe('main', function() {
    it('version', function () {
        assert.property(escher, 'version');
        assert.property(escher, 'Builder');
    });
});
