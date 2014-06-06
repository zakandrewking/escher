define(["utils", "ui"], function(utils, ui) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
			    toggle: toggle };

    return SearchBar;

    // instance methods
    function init(sel) {
	this.is_visible = false;

	var s = sel.append('div')
		.attr('class', 'settings-box')
		.style('display', 'none');

	s.append('button').attr('class', 'btn btn-default settings-close')
	    .on('click', function() {
		this.toggle(false);
	    }.bind(this))
	    .append('span').attr('class', 'glyphicon glyphicon-remove');

	s.append('input');

	this.selection = s;
    }
    function toggle(on_off) {
	if (on_off===undefined) this.is_visible = !this.is_visible;
	else this.is_visible = on_off;

	if (this.is_visible) {
	    this.selection.style("display", "block");
	} else {
	    this.selection.style("display", "none");
	}
    }
});
