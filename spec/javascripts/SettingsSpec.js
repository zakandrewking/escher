describe("SettingsSpy", function() {
    var settings, watch, t = 'reaction';

    beforeEach(function() {
	// new settings object
	settings = new escher.Settings();
	// create a function to spy on
	watch = { fn: function() {} };
	spyOn(watch, 'fn').and.callThrough();
    });

    it("Test data_styles_stream", function() {
	// set up the callback
	settings.data_styles_stream[t].onValue(watch.fn);
	// push a new value
	var p = { style: 'new_style', on_off: true };
	settings.data_styles_bus[t].push(p);
	// make sure the callback fired
	expect(watch.fn).toHaveBeenCalled();
	// make sure the new value was added to the styles array
	expect(settings.data_styles[t].indexOf(p.style)!=-1).toBe(true);
    });

    it("Test highlight_missing stream", function() {
	// set up the callback
	settings.highlight_missing_stream.onValue(watch.fn);
	// push a new value
	settings.set_highlight_missing(false);
	// make sure the callback fired
	expect(watch.fn).toHaveBeenCalled();
	// make sure the new value was added to the styles array
	expect(settings.highlight_missing).toBe(false);
    });
});
