define(['utils', 'Map'], function(utils, Map) {
    /** A container to position an html div to match the coordinates of a SVG element.

     */

    var PlacedDiv = utils.make_class();
    // instance methods
    PlacedDiv.prototype = { init: init,
			    show: show,
			    hide: hide,
			    is_visible: is_visible,
			    place: place };
    return PlacedDiv;

    // definitions
    function init(div, map) {
	// make the input box
	this.div = div;

	if (map instanceof Map) {
	    this.map = map;
	} else {
	    console.error('Cannot set the map. It is not an instance of builder/Map');
	}
    }

    function show() {
	this.div.style('display', null);
    }

    function hide() {
	this.div.style('display', 'none');
    }

    function is_visible() {
	return this.div.style('display') != 'none';
    }

    function place(coords) {
	/** Position the html div to match the given SVG coordinates.

	 */
	// move the new input
	var d = {x: 240, y: 0},
	    window_translate = this.map.zoom_container.window_translate,
	    window_scale = this.map.zoom_container.window_scale,
	    map_size = this.map.get_size(),
	    left = Math.max(20,
			    Math.min(map_size.width - 270,
				     (window_scale * coords.x + window_translate.x - d.x))),
	    top = Math.max(20,
			   Math.min(map_size.height - 40,
				    (window_scale * coords.y + window_translate.y - d.y)));
	this.div.style('position', 'absolute')
	    .style('display', 'block')
	    .style('left', left+'px')
	    .style('top', top+'px');
    }
});
