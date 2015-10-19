var utils = require('../utils');
var data_styles = require('../data_styles');

var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('chai').assert;

var d3_body = require('./helpers/d3_body');


describe('utils.set_options', function() {
    it('defaults to null', function() {
        var options = utils.set_options({ a: undefined,
                                          b: null }, {});
        for (var x in options) {
            assert.strictEqual(options[x], null);
        }
    });

    it('can require floats and does not overwrite', function() {
        var options = utils.set_options({ a: '5px', b: 'asdfwe' },
                                        { a: 6, b: 7 },
                                        { a: true, b: true });
        assert.strictEqual(options.a, 5);
        assert.strictEqual(options.b, 7);
    });
});


it('utils.compare_arrays', function() {
    assert.strictEqual(utils.compare_arrays([1,2], [1,2]), true);
    assert.strictEqual(utils.compare_arrays([1,2], [3,2]), false);
});


describe('utils.array_to_object', function() {
    it('converts array of objects to object of arrays', function() {
        // single
        var a = [{a: 1, b: 2}],
            out = utils.array_to_object(a);
        assert.deepEqual(out, { a: [1], b: [2] });
    });
    it('adds null for missing values', function() {
        // multiple
        var a = [{a:1, b:2}, {b:3, c:4}],
            out = utils.array_to_object(a);
        assert.deepEqual(out, { a: [1, null],
                                b: [2, 3],
                                c: [null, 4] });
    });
});


describe('utils.extend', function() {
    it('adds attributes of second object to first', function() {
        // extend
        var one = {a: 1, b: 2}, two = {c: 3};
        utils.extend(one, two);
        assert.deepEqual(one, {a: 1, b: 2, c: 3});
    });
    it('does not overwrite by default', function() {
        var one = {'a': 1, 'b': 2}, two = {'b': 3};
        assert.throws(utils.extend.bind(null, one, two));
    });
    it('overwrites with optional argument', function() {
        var one = {'a': 1, 'b': 2}, two = {'b': 3};
        utils.extend(one, two, true);
        assert.deepEqual(one, {'a': 1, 'b': 3});
    });
});


describe('utils.load_json_or_csv', function() {
    it('loads JSON', function() {
        utils.load_json_or_csv(null,
                               data_styles.csv_converter,
                               function(error, value) {
                                   if (error) console.warn(error);
                                   assert.deepEqual(value, {'GAPD': 100});
                               },
                               null,
                               null,
                               {target: {result: '{"GAPD":100}'}});
    });
    it('loads CSV', function() {
        utils.load_json_or_csv(null,
                               data_styles.csv_converter,
                               function(error, value) {
                                   if (error) console.warn(error);
                                   assert.deepEqual(value, [{'GAPD': '100'}]);
                               },
                               null,
                               null,
                               {target: {result: 'reaction,value\nGAPD,100\n'}});
    });
});


it('utils.mean', function() {
    assert.strictEqual(utils.mean([1, 2, 3]), 2);
});


it('utils.median', function() {
    assert.strictEqual(utils.median([1, 8, 3, 1, 10]), 3);
    assert.strictEqual(utils.median([1, 8, 3, 1, 10, 11]), 5.5);
    assert.strictEqual(utils.median([ 6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]), 40);
});


it('utils.quartiles', function() {
    assert.deepEqual(utils.quartiles([10]), [10, 10, 10]);
    assert.deepEqual(utils.quartiles([5, 10]), [5, 7.5, 10]);
    assert.deepEqual(utils.quartiles([1, 8, 3, 1, 10]), [1, 3, 9]);
    assert.deepEqual(utils.quartiles([ 6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]),
                     [15, 40, 43]);
});


it('utils.random_characters', function() {
    for (var i = 5; i < 10; i++) {
        assert.strictEqual(utils.random_characters(i).length, i);
    }
});


it('utils.check_for_parent_tag', function() {
    var sel = d3_body.append('div');
    assert.strictEqual(utils.check_for_parent_tag(sel, 'body'), true);
    assert.strictEqual(utils.check_for_parent_tag(sel, 'BODY'), true);
    assert.strictEqual(utils.check_for_parent_tag(sel, 'svg'), false);
});


describe('utils.test_name_to_url', function() {
    it('adds extension', function() {
        var url = utils.name_to_url('iJO1366.central_metabolism');
        assert.strictEqual(url, 'iJO1366.central_metabolism.json');
    });
    it('takes optional prefix', function() {
        var url = utils.name_to_url('iJO1366', 'https://github.io/1-0-0/models/Escherichia%20coli');
        assert.strictEqual(url, 'https://github.io/1-0-0/models/Escherichia%20coli/iJO1366.json');
    });
});


describe('utils.parse_url_components', function() {
    var url = '?map_name=iJO1366.Central%20metabolism&model_name=iJO1366%40%23%25',
        the_window = { location: { search: url } },
        options;

    it('extracts attributes from url', function() {
        // standard name
        options = utils.parse_url_components(the_window, {});
        assert.deepEqual(options, { map_name: 'iJO1366.Central metabolism',
                                    model_name: 'iJO1366@#%' });
    });
    it('adds to existing options', function() {
        // no host, and options
        options = utils.parse_url_components(the_window,
                                             { a: 'b', model_name: 'old_model_name' });
        assert.deepEqual(options, { map_name: 'iJO1366.Central metabolism',
                                    model_name: 'iJO1366@#%',
                                    a: 'b' });
    });
    it('recognizes array attributes', function() {
        the_window.location.search = '?quick_jump[]=iJO1366.Central%20metabolism&quick_jump[]=iJO1366.Fatty%20acid%20metabolism';
        options = utils.parse_url_components(the_window, { a: 'b' });
        assert.deepEqual(options, { a: 'b',
                                    quick_jump: ['iJO1366.Central metabolism',
                                                 'iJO1366.Fatty acid metabolism'] });
    });
});
