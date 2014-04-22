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
});
