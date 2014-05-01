// Should test for the broken function that use utils.draw_array/object
describe('Builder', function() {
    it("Small map, no model. Multiple instances.", function () {
	var sels = [];
	for (var i=0, l=3; i < l; i++) {
	    var sel = d3.select('body').append('div'),
		b = escher.Builder({ selection: sel,
				     map: get_map() });
	    expect(sel.select('svg').node()).toBe(b.map.svg.node());
	    expect(sel.selectAll('#membranes')[0].length).toEqual(1);
	    expect(sel.selectAll('#nodes')[0].length).toEqual(1);
	    expect(sel.selectAll('.node')[0].length).toEqual(31);
	    expect(sel.selectAll('#reactions')[0].length).toEqual(1);
	    expect(sel.selectAll('.reaction')[0].length).toEqual(5);
	    expect(sel.selectAll('#text-labels')[0].length).toEqual(1);
	    sels.push(sel);
	}
	sels.forEach(function(sel) {
	    sel.remove();
	});
    });
});
