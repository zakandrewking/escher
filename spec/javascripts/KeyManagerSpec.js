describe("KeyManager", function() {

    it("Makes a key manager", function() {
	var key_manager = escher.KeyManager(null, {}, ['a', 'list']);
	expect(key_manager.input_list).toEqual(['a', 'list']);
    });
});

describe("KeySpy", function() {
    var x, key, key_shift, key_manager,
	k = 1, k2 = 2, shift = 16;

    beforeEach(function() {
	x = null;
	key = { key: k,
		fn: function() { return 'return1'; }};
	key_shift =  { key: k2,
		       modifiers: { shift: true },
		       target: 'hi',
		       fn: function() { x = this; } };
	key_manager = escher.KeyManager(null, { k1: key, k2: key_shift });

	spyOn(key, 'fn');
	spyOn(key_shift, 'fn').and.callThrough();

    });

    it("Tests keys", function() {
	__triggerKeyboardEvent(document.body, k);
	expect(key.fn).toHaveBeenCalled();
    });

    it("Tests disable keys", function() {
	key_manager.toggle(false);
	__triggerKeyboardEvent(document.body, k);
	expect(key.fn).not.toHaveBeenCalled();
    });

    it("Tests shift key", function() {
	__triggerKeyboardEvent(document.body, shift);
	__triggerKeyboardEvent(document.body, k2);
	expect(key_shift.fn).toHaveBeenCalled();
	expect(x).toEqual('hi');
    });
});
