describe('utils', function() {
    var utils = escher.utils;

    it("set_options", function () {
	var options = utils.set_options({ a: undefined,
					  b: null }, {});
	for (var x in options) {
	    expect(options[x]).toBe(null);
	}
    });

    it("compare arrays", function() {
	expect(utils.compare_arrays([1,2], [1,2])).toBe(true);
	expect(utils.compare_arrays([1,2], [3,2])).toBe(false);
    });

    it("array to object", function() {
	var a = [{a:1, b:2}, {b:3, c:4}];
	expect(utils.array_to_object(a)).toEqual({ a: [1, null],
						   b: [2, 3],
						   c: [null, 4] });
    });

    it("check_for_parent_tag", function() {
	var sel = d3.select('body').append('div');
	expect(utils.check_for_parent_tag(sel, 'body')).toBe(true);
	expect(utils.check_for_parent_tag(sel, 'BODY')).toBe(true);
	expect(utils.check_for_parent_tag(sel, 'svg')).toBe(false);
    });

    it('test_name_to_url', function() {
	var url = utils.name_to_url('e_coli:iJO1366', 'https://zakandrewking.github.io/escher/', 'model');
	expect(url).toEqual('https://zakandrewking.github.io/escher/organisms/e_coli/models/iJO1366.json');

	var url = utils.name_to_url('e_coli:iJO1366:central_metabolism', '', 'map');
	expect(url).toEqual('organisms/e_coli/models/iJO1366/maps/central_metabolism.json');
    });

    it('parse_url_components', function() {
	var url = '?map_name=e_coli:iJO1366:central_metabolism&model_name=e_coli:iJO1366',
	    the_window = { location: { search: url } };

	var options = utils.parse_url_components(the_window);
	expect(options).toEqual({ map_name: 'e_coli:iJO1366:central_metabolism',
				  model_name: 'e_coli:iJO1366',
				  map_path: 'organisms/e_coli/models/iJO1366/maps/central_metabolism.json',
				  cobra_model_path: 'organisms/e_coli/models/iJO1366.json' });

	options = { a: 'b',
		    model_name: 'old_model_name' };
	options = utils.parse_url_components(the_window, options);
	expect(options).toEqual({ map_name: 'e_coli:iJO1366:central_metabolism',
				  model_name: 'e_coli:iJO1366',
				  map_path: 'organisms/e_coli/models/iJO1366/maps/central_metabolism.json',
				  cobra_model_path: 'organisms/e_coli/models/iJO1366.json',
				  a: 'b' });

	options = { a: 'b',
		    model_name: 'old_model_name' };
	options = utils.parse_url_components(the_window, options, 'http://host/');
	expect(options).toEqual({ map_name: 'e_coli:iJO1366:central_metabolism',
				  model_name: 'e_coli:iJO1366',
				  map_path: 'http://host/organisms/e_coli/models/iJO1366/maps/central_metabolism.json',
				  cobra_model_path: 'http://host/organisms/e_coli/models/iJO1366.json',
				  a: 'b' });
    });
});
