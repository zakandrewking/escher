define(["vis/scaffold", "lib/d3"], function(scaffold, d3) {
    /**
     */

    var Brush = scaffold.make_class();
    Brush.prototype = { init: init };

    return Brush;

    function init() {
    };

    function brush_is_enabled() {
	/** Returns a boolean for the on/off status of the brush

	 */
	return d3.select('.brush').empty();
    }
    function enable_brush(on) {
	/** Turn the brush on or off

	 */
	var brush_sel = o.sel.select('#brush-container');
	if (on) {
	    o.selection_brush = setup_selection_brush(brush_sel, 
						      d3.select('#nodes').selectAll('.node'),
						      o.width, o.height);
	} else {
	    brush_sel.selectAll('.brush').remove();
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
				var sx = o.scale.x(d.x), sy = o.scale.y(d.y);
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
