define(['utils', 'CallbackManager'], function(utils, CallbackManager) {
    /** A QuickJump menu to move between maps.

	Arguments
	---------

	sel: The d3 selection of an html node to place the menu inside.

	options: An array of map names to jump to.
	
     */

    var QuickJump = utils.make_class();
    // instance methods
    QuickJump.prototype = { init: init };

    return QuickJump;

    // instance methods
    function init(sel, options) {
	// make the callback manager
	var callback_manager = CallbackManager();
	this.callback_manager = callback_manager
	
	// set up the menu
	var select_sel = sel.append('select')
	    .attr('id', 'quick-jump-menu')
	    .attr('class', 'form-control');
	
	this.default_value = '— Jump to map —';

	var url_comp = utils.parse_url_components(window),
	    current = ('map_name' in url_comp) ? url_comp.map_name : null;

	// get the options to show
	var view_options = [this.default_value].concat(options);
	if (current !== null) {
	    view_options = view_options.filter(function(o) {
		return o != current;
	    });
	}
	select_sel.selectAll('option')
	    .data(view_options)
	    .enter()
	    .append('option')
	    .text(function(d) {
		// works whether or not a '.' is present
		return d.split('.').slice(-1)[0];
	    });

	select_sel.on('change', function() {
	    // go to the new map
	    var map_name = this.options[this.selectedIndex].__data__;
	    callback_manager.run('switch_maps', null, map_name);
	});
	
    }
});
