var SearchIndex = require('../SearchIndex');

var describe = require('mocha').describe;
var it = require('mocha').it;
var beforeEach = require('mocha').beforeEach;
var assert = require('chai').assert;

var d3_body = require('./helpers/d3_body');
var get_map = require('./helpers/get_map');


describe('SearchIndex', function() {
    var index;

    beforeEach(function() {
        index = SearchIndex();
    });

    it('insert', function () {
        it('accepts new records', function() {
            index.insert('123', {'name': 'a', 'data': 3}, true);
            assert.ok(index);
        });

        it('throws error for malformed records', function() {
            assert.throws(function() { index.insert('123', {}, false, true); },
                          'malformed record');
        });

        it('throws error for repeated index', function() {
            index.insert('123', {'name': 'a', 'data': 1});
            assert.throws(function() { index.insert('123', {}, false, false); },
                          'id is already in the index');
        });
    });

    it('find', function () {
        index.insert('123', {'name': 'abc', 'data': 3}, true);
        index.insert('124', {'name': 'asdfeabn', 'data': 5}, true);
        index.insert('125', {'name': 'a', 'data': 6}, true);

        var results = index.find('ab');
        assert.include(results, 3);
        assert.include(results, 5);
        assert.notInclude(results, 6);
    });

    it('remove', function () {
        index.insert('123', {'name': 'a', 'data': 3}, true);
        var out = index.remove('123'),
            out2 = index.remove('123');
        assert.isTrue(out);
        assert.isFalse(out2);
        assert.strictEqual(index.find('a').length, 0);
    });
});
