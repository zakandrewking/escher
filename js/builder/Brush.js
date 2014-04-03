define(["vis/utils", "lib/d3"], function(utils, d3) {
    /** Define a brush to select elements in a map.

     Brush(selection, is_enabled, map, insert_after)

     insert_after: A d3 selector string to choose the svg element that the brush
     will be inserted after. Often a canvas element (e.g. '.canvas-group').

     */

    var Brush = utils.make_class();
    Brush.prototype = { init: init,
			toggle: toggle,
			setup_selection_brush: setup_selection_brush };

    return Brush;

    function init(selection, is_enabled, map, insert_after) {
	this.brush_sel = selection.append('g')
	    .attr('id', 'brush-container');
	var node = this.brush_sel.node(),
	    insert_before_node = selection.select(insert_after).node().nextSibling;
	if (!(node===insert_before_node))
	    node.parentNode.insertBefore(node, insert_before_node);
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
	    this.selection_brush = this.setup_selection_brush();
	} else {
	    this.brush_sel.selectAll('.brush').remove();
	}
    }
    
    // definitions
    function setup_selection_brush() {
	var selection = this.brush_sel, 
	    node_selection = d3.select('#nodes').selectAll('.node'),
	    width = this.map.width,
	    height = this.map.height,
	    node_ids = [],
	    scale = this.map.scale;
	node_selection.each(function(d) { node_ids.push(d.node_id); });
	var brush_fn = d3.svg.brush()
		.x(d3.scale.identity().domain([0, width]))
		.y(d3.scale.identity().domain([0, height]))
		.on("brush", function() {
		    var extent = d3.event.target.extent();
		    node_selection
			.classed("selected", function(d) { 
			    var sx = scale.x(d.x), sy = scale.y(d.y);
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
});
