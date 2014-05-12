describe('SearchIndex', function() {
    var index;

    beforeEach(function() {
	index = escher.SearchIndex();
    });

    it("Insert", function () {
	expect(function() { index.insert('123', {}, false, true); })
	    .toThrow(new Error("malformed record"));

	index.insert('123', {'name': 'a', 'data': 1});

	expect(function() { index.insert('123', {}, false, false); })
	    .toThrow(new Error("id is already in the index"));

	index.insert('123', {'name': 'a', 'data': 3}, true);
    });

    it("Find", function () {
	index.insert('123', {'name': 'abc', 'data': 3}, true);
	index.insert('124', {'name': 'asdfeabn', 'data': 5}, true);
	index.insert('125', {'name': 'a', 'data': 6}, true);

	var results = index.find('ab');
	expect(results).toContain(3);
	expect(results).toContain(5);
	expect(results).not.toContain(6);
    });

    it("Remove", function () {
	index.insert('123', {'name': 'a', 'data': 3}, true);
	var out = index.remove('123'),
	    out2 = index.remove('123');
	expect(out).toBe(true);
	expect(out2).toBe(false);
	expect(index.find('a').length).toEqual(0);
    });
});
