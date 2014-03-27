define(["vis/utils", "lib/d3"], function(utils, d3) {
    /**
     */

    var Brush = utils.make_class();
    Brush.prototype = { init: init,
			toggle: toggle };

    return Brush;

    function init(selection, is_enabled, map) {
	this.brush_sel = selection.append('g')
	    .attr('id', 'brush-container');
	this.enabled = is_enabled;
	this.map = map;
    };

    function brush_is_enabled() {
	/** Returns a boolean for the on/off status of the brush

	 */
	return d3.select('.brush').empty();
    }
    function toggle(on_off) {
	/** Turn the brush on or off

	 */
	if (on_off===undefined) on_off = !this.enabled;

	if (on_off) {
	    this.selection_brush = setup_selection_brush(this.brush_sel, 
							 d3.select('#nodes').selectAll('.node'),
							 this.map.width,
							 this.map.height);
	} else {
	    this.brush_sel.selectAll('.brush').remove();
	}

	// definitions
	function setup_selection_brush(selection, node_selection, width, height) {
	    var node_ids = [];
	    node_selection.each(function(d) { node_ids.push(d.node_id); });
	    var brush_fn = d3.svg.brush()
		    .x(d3.scale.identity().domain([0, width]))
		    .y(d3.scale.identity().domain([0, height]))
		    .on("brush", function() {
			var extent = d3.event.target.extent();
			node_selection
			    .classed("selected", function(d) { 
				var sx = this.map.scale.x(d.x), sy = this.map.scale.y(d.y);
				return extent[0][0] <= sx && sx < extent[1][0]
				    && extent[0][1] <= sy && sy < extent[1][1];
			    });
		    })        
		    .on("brushend", function() {
			d3.event.target.clear();
			d3.select(this).call(d3.event.target);
		    }),
		brush = selection.append("g")
		    .attr("class", "brush")
		    .call(brush_fn);
	    return brush;
	}
    }

});
