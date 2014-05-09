describe('Behavior', function() {
    var map = { sel: d3.select('body') },
	behavior = escher.Behavior(map, null);

    it("Check class", function () {
	expect(behavior.map).toBe(map);
    });
});
