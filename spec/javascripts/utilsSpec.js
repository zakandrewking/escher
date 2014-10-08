describe('utils', function() {
    var utils = escher.utils;

    it('set_options', function () {
	var options = utils.set_options({ a: undefined,
					  b: null }, {});
	for (var x in options) {
	    expect(options[x]).toBe(null);
	}
    });

    it('compare_arrays', function() {
	expect(utils.compare_arrays([1,2], [1,2])).toBe(true);
	expect(utils.compare_arrays([1,2], [3,2])).toBe(false);
    });

    it('array_to_object', function() {
	// single
	var a = [{a:1, b:2}],
	    out = utils.array_to_object(a)
	expect(out).toEqual({ a: [1],
			      b: [2] });
	// multiple
	var a = [{a:1, b:2}, {b:3, c:4}],
	    out = utils.array_to_object(a)
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
				      {target: {result: '{"GAPD":100}'}});
	
	escher.utils.load_json_or_csv(null,
				      escher.data_styles.csv_converter,
				      function(error, value) {
					  if (error) console.warn(error);
					  expect(value).toEqual([{'GAPD': 100}]);
				      },
				      {target: {result: 'GAPD,100\n'}});
    });
    
    it('check_for_parent_tag', function() {
	var sel = d3.select('body').append('div');
	expect(utils.check_for_parent_tag(sel, 'body')).toBe(true);
	expect(utils.check_for_parent_tag(sel, 'BODY')).toBe(true);
	expect(utils.check_for_parent_tag(sel, 'svg')).toBe(false);
    });

    it('test check_name', function() {
	// invalid characters
	check_char = function(char) {
	    utils.check_name('e_coli+iJO1366' + char);
	};
        expect(check_char.bind(null, '<')).toThrow();
        expect(check_char.bind(null, '/')).toThrow();
        expect(check_char.bind(null, ':')).toThrow();
        expect(check_char.bind(null, '*')).toThrow();
	check_char('');
    });
    
    it('test_name_to_url', function() {
	var url = utils.name_to_url('e_coli.iJO1366', 'https://zakandrewking.github.io/escher/');
	expect(url).toEqual('https://zakandrewking.github.io/escher/organisms/e_coli/models/iJO1366.json');

	var url = utils.name_to_url('e_coli.iJO1366.central_metabolism');
	expect(url).toEqual('organisms/e_coli/models/iJO1366/maps/central_metabolism.json');
    });

    it('parse_url_components', function() {
	// standard name
	var url = '?map_name=e_coli.iJO1366.central_metabolism&model_name=e_coli.iJO1366',
	    the_window = { location: { search: url } };

	var options = utils.parse_url_components(the_window);
	expect(options).toEqual({ map_name: 'e_coli.iJO1366.central_metabolism',
				  model_name: 'e_coli.iJO1366',
				  map_path: 'organisms/e_coli/models/iJO1366/maps/central_metabolism.json',
				  cobra_model_path: 'organisms/e_coli/models/iJO1366.json' });

	// with a host, and options
	options = { a: 'b',
		    model_name: 'old_model_name' };
	options = utils.parse_url_components(the_window, options, 'http://host/');
	expect(options).toEqual({ map_name: 'e_coli.iJO1366.central_metabolism',
				  model_name: 'e_coli.iJO1366',
				  map_path: 'http://host/organisms/e_coli/models/iJO1366/maps/central_metabolism.json',
				  cobra_model_path: 'http://host/organisms/e_coli/models/iJO1366.json',
				  a: 'b' });

	// non-standard name, and options
	url = '?map_name=local_map&model_name=local_model';
	the_window = { location: { search: url } };
	options = { a: 'b' };
	options = utils.parse_url_components(the_window, options);
	expect(options).toEqual({ map_name: 'local_map',
				  model_name: 'local_model',
				  a: 'b' });

	// array options
	url = '?quick_jump[]=e_coli.iJO1366.central_metabolism&quick_jump[]=e_coli.iJO1366.fatty_acid_metabolism';
	the_window = { location: { search: url } };
	options = { a: 'b' };
	options = utils.parse_url_components(the_window, options, 'http://host/');
	expect(options).toEqual({ a: 'b',
				  quick_jump: ['e_coli.iJO1366.central_metabolism', 'e_coli.iJO1366.fatty_acid_metabolism'] });
    });
});
