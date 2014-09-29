describe("SettingsSpy", function() {
    var settings, options, watch;

    beforeEach(function() {
	// new settings object
	options = { auto_reaction_domain: true,
		    reaction_data: null,
		    reaction_styles: ['color', 'size', 'abs', 'text'],
		    reaction_domain: [-10, 0, 10],
		    reaction_color_range: ['rgb(200,200,200)', 'rgb(150,150,255)', 'purple'],
		    reaction_size_range: [4, 8, 12],
		    reaction_no_data_color: 'rgb(220,220,220)',
		    reaction_no_data_size: 4,
		    // metabolite
		    metabolite_data: null,
		    metabolite_styles: ['color', 'size', 'text'],
		    auto_metabolite_domain: true,
		    metabolite_domain: [-10, 0, 10],
		    metabolite_color_range: ['green', 'white', 'red'],
		    metabolite_size_range: [6, 8, 10],
		    metabolite_no_data_color: 'white',
		    metabolite_no_data_size: 6,
		    // gene
		    gene_data: null,
		    gene_styles: ['text'],
		    // color reactions not in the model
		    highlight_missing_color: 'red' },
	set_option = function(key, val) { options[key] = val; },
	get_option = function(key) { return options[key]; };

	settings = new escher.Settings(set_option, get_option);
	// create a function to spy on
	watch = { fn: function() {} };
	spyOn(watch, 'fn').and.callThrough();
    });

    it("Test data_styles_stream", function() {	
	var p = { style: 'new_style', on_off: true },
	    t = 'reaction';
	// set up the callback
	settings.data_styles_stream[t].onValue(watch.fn);
	// push a new value
	settings.data_styles_bus[t].push(p);
	// make sure the callback fired
	expect(watch.fn).toHaveBeenCalled();
	// make sure the new value was added to the styles array
	expect(options.reaction_styles.indexOf(p.style)!=-1).toBe(true);
    });

    it("Test highlight_missing stream", function() {
	// set up the callback
	settings.highlight_missing_stream.onValue(watch.fn);
	// push a new value
	settings.set_highlight_missing(false);
	// make sure the callback fired
	expect(watch.fn).toHaveBeenCalled();
	// make sure the new value was added to the styles array
	expect(options.highlight_missing).toBe(false);
    });
});
