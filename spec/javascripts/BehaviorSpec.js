describe('Behavior', function() {
    var map = escher.Map(),
	behavior = escher.Behavior(map, null);

    it("Check class", function () {
	expect(behavior.map).toBe(map);
    });
});
