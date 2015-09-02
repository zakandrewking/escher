// Should test for the broken function that use utils.draw_array/object

var test = require('tape');
var Builder = require('Builder');
var d3 = require('d3');

test("Small map, no model. Multiple instances.", function (t) {
    var sels = [];
    for (var i=0, l=3; i < l; i++) {
        var sel = d3.select('body').append('div'),
            b = Builder(get_map(), null, '', sel,
                               { never_ask_before_quit: true });
        t.equal(sel.select('svg').node(), b.map.svg.node());
        t.equal(sel.selectAll('#nodes')[0].length, 1);
        t.equal(sel.selectAll('.node')[0].length, 79);
        t.equal(sel.selectAll('#reactions')[0].length, 1);
        t.equal(sel.selectAll('.reaction')[0].length, 18);
        t.equal(sel.selectAll('#text-labels')[0].length, 1);
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
