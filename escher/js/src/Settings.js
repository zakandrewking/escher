define(["utils", "ui", "CallbackManager"], function(utils, ui, CallbackManager) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
			    toggle: toggle };

    return SearchBar;

    // instance methods
    function init(sel, map) {
	this.is_visible = false;

	var container = sel.append('div')
		.attr('class', 'settings-box')
		.style('display', 'none');

	container.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.toggle(false);
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-remove");
	
	container.append('div').attr('class', 'settings-section')
	    .text('Reaction color');
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
    function toggle(on_off) {
	if (on_off===undefined) this.is_visible = !this.is_visible;
	else this.is_visible = on_off;

	if (this.is_visible) {
	    this.selection.style("display", "block");
	    // escape key
	    this.escape = this.map.key_manager
		.add_escape_listener(function() { this.toggle(false); }.bind(this));
	    // run the show callback
	    this.callback_manager.run('show');
	} else {
	    this.selection.style("display", "none");	    
	    if (this.escape) this.escape.clear();
	    this.escape = null;
	    // run the hide callback
	    this.callback_manager.run('hide');
	}
    }
});
