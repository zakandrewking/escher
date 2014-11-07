describe("SettingsSpy", function() {
    var settings, options, watch;

    beforeEach(function() {
	// new settings object
	options = {
            // location
            selection: null,
            // view options
            menu: 'all',
            scroll_behavior: 'pan',
            enable_editing: true,
            enable_keys: true,
            enable_search: true,
            fill_screen: false,
            // map, model, and styles
            starting_reaction: null,
            never_ask_before_quit: false,
            unique_map_id: null,
	    primary_metabolite_radius: 15,
	    secondary_metabolite_radius: 10,
	    marker_radius: 5,
	    hide_secondary_nodes: false,
            show_gene_reaction_rules: false,
            // applied data
            // reaction
            reaction_data: null,
            reaction_styles: ['color', 'size', 'text'],
            reaction_compare_style: 'log2_fold',
            reaction_scale: [ { type: 'min', color: '#c8c8c8', size: 4 },
                              { type: 'value', value: 0, color: '#9696ff', size: 8 },
                              { type: 'max', color: '#4b009f', size: 12 } ],
            reaction_no_data_color: '#dcdcdc',
            reaction_no_data_size: 4,
            // gene
            gene_data: null,
            and_method_in_gene_reaction_rule: 'mean',
            // metabolite
            metabolite_data: null,
            metabolite_styles: ['color', 'size', 'text'],
            metabolite_compare_style: 'log2_fold',
            metabolite_scale: [ { type: 'min', color: '#00ff00', size: 6 },
                                { type: 'value', value: 0, color: '#ffffff', size: 8 },
                                { type: 'max', color: '#ff0000', size: 10 } ],
            metabolite_no_data_color: '#ffffff',
            metabolite_no_data_size: 6,
            // View and build options
            identifiers_on_map: 'bigg_id',
            highlight_missing: false,
            allow_building_duplicate_reactions: true,
            // Quick jump menu
            local_host: null,
            quick_jump: null,
            // Callbacks
            first_load_callback: null
        };
	var set_option = function(key, val) { options[key] = val; },
	    get_option = function(key) { return options[key]; };

	settings = new escher.Settings(set_option, get_option, Object.keys(options));
	// create a function to spy on
	watch = { fn: function() {} };
	spyOn(watch, 'fn').and.callThrough();
    });

    it("Test_stream", function() {	
	var name = 'reaction_styles',
            val = ['new_style'];
	// set up the callback
	settings.streams[name].onValue(watch.fn);
	// push a new value
	settings.busses[name].push(val);
	// make sure the callback fired
	expect(watch.fn).toHaveBeenCalled();
	// make sure the new value was added to the styles array
	expect(options.reaction_styles).toEqual(val);
    });
});
