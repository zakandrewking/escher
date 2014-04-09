describe("KeyManager", function() {

    it("Makes a key manager", function() {
	var key_manager = escher.KeyManager({}, 'empty');
	expect(key_manager.reaction_input).toBe('empty');
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
	key_manager = escher.KeyManager({ k1: key, k2: key_shift });

	spyOn(key, 'fn');
	spyOn(key_shift, 'fn').and.callThrough();

	__triggerKeyboardEvent(document.body, k);
	__triggerKeyboardEvent(document.body, shift);
	__triggerKeyboardEvent(document.body, k2);
    });

    it("Tests keys", function() {
	expect(key.fn).toHaveBeenCalled();
    });

    it("Tests shift key", function() {
	expect(key_shift.fn).toHaveBeenCalled();
	expect(x).toEqual('hi');
    });
});
