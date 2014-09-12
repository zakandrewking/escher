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
});
