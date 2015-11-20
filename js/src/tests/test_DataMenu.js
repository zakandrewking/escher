var require_helper = require('./helpers/require_helper');

var DataMenu = require_helper('DataMenu');

var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('chai').assert;

var d3_body = require('./helpers/d3_body');


describe('DataMenu', function() {
    it('initializes', function() {
        var sel = d3_body.append('div'),
            data_menu = new DataMenu({selection: sel});
        assert.ok(data_menu);
        assert.strictEqual(sel.selectAll('select')[0].length, 1);
    });
});
