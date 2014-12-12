// Should test for the broken function that use utils.draw_array/object
describe('Builder', function() {
    it("Small map, no model. Multiple instances.", function () {
	var sels = [];
	for (var i=0, l=3; i < l; i++) {
	    var sel = d3.select('body').append('div'),
		b = escher.Builder(get_map(), null, '', sel,
				   { never_ask_before_quit: true });
	    expect(sel.select('svg').node()).toBe(b.map.svg.node());
	    expect(sel.selectAll('#nodes')[0].length).toEqual(1);
	    expect(sel.selectAll('.node')[0].length).toEqual(79);
	    expect(sel.selectAll('#reactions')[0].length).toEqual(1);
	    expect(sel.selectAll('.reaction')[0].length).toEqual(18);
	    expect(sel.selectAll('#text-labels')[0].length).toEqual(1);
	    sels.push(sel);
	}
	sels.forEach(function(sel) {
	    sel.remove();
	});
    });
    
    it('check for model+highlight_missing bug', function() {
	b = escher.Builder(get_map(), get_model(), '', d3.select('body').append('div'),
			   { never_ask_before_quit: true, highlight_missing: true });
    }); 

    it("SVG selection error", function () {
	var sel = d3.select('body').append('svg').append('g');
	expect(function () {
	    escher.Builder(null, null, '', sel,
			   { never_ask_before_quit: true  });
	}).toThrow(new Error("Builder cannot be placed within an svg node "+
			     "becuase UI elements are html-based."));
    });

    it('fix scales', function () {
	b = escher.Builder(null, null, '', null, { reaction_scale: [{ type: 'median', color: '#9696ff', size: 8 }],
						   never_ask_before_quit: true });
	expect(b.options.reaction_scale).toEqual([{ type: 'median', color: '#9696ff', size: 8 },
						  { type: 'min', color: '#ffffff', size: 10 },
						  { type: 'max', color: '#ffffff', size: 10 }]);

        // after callback
	b = escher.Builder(null, null, '', null, { metabolite_scale: [{ type: 'median', color: 'red', size: 0 },
					                              { type: 'min', color: 'red', size: 0 },
					                              { type: 'max', color: 'red', size: 0 } ],
						   never_ask_before_quit: true });
        b.settings.set_conditional('metabolite_scale', [{ type: 'median', color: '#9696ff', size: 8 }]);
	expect(b.options.metabolite_scale).toEqual([{ type: 'median', color: '#9696ff', size: 8 },
						    { type: 'min', color: '#ffffff', size: 10 },
						    { type: 'max', color: '#ffffff', size: 10 }]);
    });
});
