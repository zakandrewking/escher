describe('DataMenu', function() {
    it("Check class", function () {
        var sel = d3.select('body').append('div');
        new escher.DataMenu({selection: sel});
        expect(sel.selectAll('select')[0].length).toEqual(1);
        sel.remove();          
    });
});
