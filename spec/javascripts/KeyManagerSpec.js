describe("KeyManager", function() {

    it("Makes a key manager", function() {
	var key_manager = escher.KeyManager({}, 'empty');
	expect(key_manager.reaction_input).toBe('empty');
    });
});

describe("KeySpy", function() {
    var key_manager, keys, k = 1, k2 = 2;

    beforeEach(function() {
	keys = { key1: { key: k,
			 fn: function() { return 'return1'; } },
		 key_shift_2: { key: k2,
			 fn: function() { return 'return2'; } } };
	key_manager = escher.KeyManager(keys);

	spyOn(keys.key1, 'fn');
	spyOn(keys.key2, 'fn');

	__triggerKeyboardEvent(document.body, 1);
	__triggerKeyboardEvent(document.body, 16);
	__triggerKeyboardEvent(document.body, 2);
    });

    it("Tests keys", function() {
	expect(keys.key1.fn).toHaveBeenCalled();
    });

    it("Tests shift key", function() {
	expect(keys.key2.fn).toHaveBeenCalled();
    });
});
