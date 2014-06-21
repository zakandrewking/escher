define(["utils", "ui", "CallbackManager"], function(utils, ui, CallbackManager) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
			    is_visible: is_visible,
			    toggle: toggle };

    return SearchBar;

    // instance methods
    function init(sel, map) {
	this.changed = false;

	// TODO make sure updated scales stay updated after loading a new dataset/map

	var container = sel.append('div')
		.attr('class', 'settings-box')
		.style('display', 'none');

	container.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.toggle(false);
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-ok");
	
	var r_color = container.append('div').attr('class', 'settings-section')
	    .text('Reaction color');

	var current = map.get_scale('reaction', 'color').range();
	ui.scale_bar(container.append('div'), current.slice(-2),
		     function(new_range) {
			 this.changed = true;
			 // set the last two elements of the range
			 var range_to_set = map.get_scale('reaction', 'color').range();
			 console.log(range_to_set);
			 range_to_set = range_to_set.slice(0, range_to_set.length-2)
			     .concat(new_range);
			 map.set_scale('reaction', 'color', null, range_to_set);
			 console.log(range_to_set);
		     }.bind(this));

	container.append('div').attr('class', 'settings-section')
	    .text('Reaction size');
	container.append('div').attr('class', 'settings-section')
	    .text('Metabolite color');
	container.append('div').attr('class', 'settings-section')
	    .text('Metabolite size');

	this.callback_manager = new CallbackManager();

	this.map = map;
	this.selection = container;
    }
    function is_visible() {
	return this.selection.style('display') != 'none';
    }
    function toggle(on_off) {
	if (on_off===undefined) on_off = !this.is_visible();

	if (on_off) {
	    this.selection.style("display", "block");
	    this.selection.select('input').node().focus();
	    // escape key
	    this.escape = this.map.key_manager
		.add_escape_listener(function() { this.toggle(false); }.bind(this));
	    // run the show callback
	    this.callback_manager.run('show');
	} else {
	    // draw on finish
	    if (this.changed) this.map.draw_everything();
	    this.changed = false;

	    this.selection.style("display", "none");	    
	    if (this.escape) this.escape.clear();
	    this.escape = null;
	    // run the hide callback
	    this.callback_manager.run('hide');
	}
    }
});
