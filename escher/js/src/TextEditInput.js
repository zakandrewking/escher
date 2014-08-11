define(['utils', 'PlacedDiv'], function(utils, PlacedDiv) {
    /**
     */

    var TextEditInput = utils.make_class();
    // instance methods
    TextEditInput.prototype = { init: init,
				is_visible: is_visible };

    return TextEditInput;

    // definitions
    function init(selection, map, zoom_container) {
	var div = selection.append('div')
		.attr('id', 'text-edit-input');
	this.placed_div = PlacedDiv(div);
	div.append('input').style('display', 'none');
    }

    function is_visible() {
	return this.placed_div.is_visible();
    }
});
