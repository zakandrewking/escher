describe('utils', function() {
    var utils = escher.utils;

    it('set_options', function () {
        var options = utils.set_options({ a: undefined,
                                          b: null }, {});
        for (var x in options) {
            expect(options[x]).toBe(null);
        }
        // must be float
        var options = utils.set_options({ a: '5px',
                                          b: 'asdfwe' },
                                        { a: 6,
                                          b: 7 },
                                        { a: true,
                                          b: true });
        expect(options.a).toEqual(5);
        expect(options.b).toEqual(7);
    });

    it('compare_arrays', function() {
        expect(utils.compare_arrays([1,2], [1,2])).toBe(true);
        expect(utils.compare_arrays([1,2], [3,2])).toBe(false);
    });

    it('array_to_object', function() {
        // single
        var a = [{a:1, b:2}],
            out = utils.array_to_object(a);
        expect(out).toEqual({ a: [1],
                              b: [2] });
        // multiple
        var a = [{a:1, b:2}, {b:3, c:4}],
            out = utils.array_to_object(a);
        expect(out).toEqual({ a: [1, null],
                              b: [2, 3],
                              c: [null, 4] });
    });

    it('extend', function() {
        // extend
        var one = {'a': 1, 'b': 2}, two = {'c': 3};
        escher.utils.extend(one, two);
        expect(one).toEqual({'a': 1, 'b': 2, 'c': 3});
        // exception
        var one = {'a': 1, 'b': 2}, two = {'b': 3};
        expect(escher.utils.extend.bind(null, one, two))
            .toThrow();
        // overwrite
        var one = {'a': 1, 'b': 2}, two = {'b': 3};
        escher.utils.extend(one, two, true);
        expect(one).toEqual({'a': 1, 'b': 3});
    });
    
    it('load_json_or_csv', function() {
        escher.utils.load_json_or_csv(null,
                                      escher.data_styles.csv_converter,
                                      function(error, value) {
                                          if (error) console.warn(error);
                                          expect(value).toEqual({'GAPD': 100});
                                      },
                                      null,
                                      null,
                                      {target: {result: '{"GAPD":100}'}});
        
        escher.utils.load_json_or_csv(null,
                                      escher.data_styles.csv_converter,
                                      function(error, value) {
                                          if (error) console.warn(error);
                                          expect(value).toEqual([{'GAPD': '100'}]);
                                      },
                                      null,
                                      null,
                                      {target: {result: 'reaction,value\nGAPD,100\n'}});
    });

    it('mean', function() {
        expect(utils.mean([1, 2, 3])).toEqual(2);
    });

    it('median', function() {
        expect(utils.median([1, 8, 3, 1, 10])).toEqual(3);
        expect(utils.median([1, 8, 3, 1, 10, 11])).toEqual(5.5);
        expect(utils.median([ 6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]))
            .toEqual(40);
    });

    it('quartiles', function() {
        expect(utils.quartiles([10])).toEqual([10, 10, 10]);
        expect(utils.quartiles([5, 10])).toEqual([5, 7.5, 10]);
        expect(utils.quartiles([1, 8, 3, 1, 10])).toEqual([1, 3, 9]);
        expect(utils.quartiles([ 6, 7, 15, 36, 39, 40, 41, 42, 43, 47, 49]))
            .toEqual([15, 40, 43]);
    });

    it('random_characters', function() {
        for (var i = 5; i < 10; i++) {
            expect(utils.random_characters(i).length).toEqual(i);
        }
    });
    
    it('check_for_parent_tag', function() {
        var sel = d3.select('body').append('div');
        expect(utils.check_for_parent_tag(sel, 'body')).toBe(true);
        expect(utils.check_for_parent_tag(sel, 'BODY')).toBe(true);
        expect(utils.check_for_parent_tag(sel, 'svg')).toBe(false);
    });

    it('test_name_to_url', function() {
        var url = utils.name_to_url('iJO1366', 'https://escher.github.io/1-0-0/models/Escherichia%20coli');
        expect(url).toEqual('https://escher.github.io/1-0-0/models/Escherichia%20coli/iJO1366.json');

        var url = utils.name_to_url('iJO1366.central_metabolism');
        expect(url).toEqual('iJO1366.central_metabolism.json');
    });

    it('parse_url_components', function() {
        // standard name
        var url = '?map_name=iJO1366.Central%20metabolism&model_name=iJO1366%40%23%25',
            the_window = { location: { search: url } };

        var options = utils.parse_url_components(the_window, {});
        expect(options).toEqual({ map_name: 'iJO1366.Central metabolism',
                                  model_name: 'iJO1366@#%' });

        // no host, and options
        options = { a: 'b',
                    model_name: 'old_model_name' };
        options = utils.parse_url_components(the_window, options);
        expect(options).toEqual({ map_name: 'iJO1366.Central metabolism',
                                  model_name: 'iJO1366@#%',
                                  a: 'b' });

        // array options
        url = '?quick_jump[]=iJO1366.Central%20metabolism&quick_jump[]=iJO1366.Fatty%20acid%20metabolism';
        the_window = { location: { search: url } };
        options = { a: 'b' };
        options = utils.parse_url_components(the_window, options);
        expect(options).toEqual({ a: 'b',
                                  quick_jump: ['iJO1366.Central metabolism',
					       'iJO1366.Fatty acid metabolism'] });
    });
});
