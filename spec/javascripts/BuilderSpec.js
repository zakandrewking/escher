// Should test for the broken function that use utils.draw_array/object
describe('Builder', function() {
    it("Small map, no model. Multiple instances.", function () {
	var sels = [];
	for (var i=0, l=3; i < l; i++) {
	    var sel = d3.select('body').append('div'),
		b = escher.Builder(get_map(), null,
				   { selection: sel,
				     never_ask_before_quit: true });
	    expect(sel.select('svg').node()).toBe(b.map.svg.node());
	    expect(sel.selectAll('#nodes')[0].length).toEqual(1);
	    expect(sel.selectAll('.node')[0].length).toEqual(30);
	    expect(sel.selectAll('#reactions')[0].length).toEqual(1);
	    expect(sel.selectAll('.reaction')[0].length).toEqual(6);
	    expect(sel.selectAll('#text-labels')[0].length).toEqual(1);
	    sels.push(sel);
	}
	sels.forEach(function(sel) {
	    sel.remove();
	});
    });

    it("SVG selection error", function () {
	var sel = d3.select('body').append('svg').append('g');
	expect(function () {
	    escher.Builder(null, null,
			   { selection: sel,
			     never_ask_before_quit: true  });
	}).toThrow(new Error("Builder cannot be placed within an svg node "+
			     "becuase UI elements are html-based."));
    });
});
