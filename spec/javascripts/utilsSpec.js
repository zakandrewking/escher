describe('utils', function() {
    var utils = escher.utils;

    it("set_options", function () {
	var options = utils.set_options({ a: undefined,
					  b: null }, {});
	for (var x in options) {
	    expect(options[x]).toBe(null);
	}
    });
});
