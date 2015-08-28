define(["utils"], function(utils) {
    /** Define a brush to select elements in a map.

     Arguments
     ---------

     selection: A d3 selection to place the brush in.

     is_enabled: Whether to turn the brush on.

     map: An instance of escher.Map.

     insert_after: A d3 selector string to choose the svg element that the brush
     will be inserted after. Often a canvas element (e.g. '.canvas-group').

     */

    var Brush = utils.make_class();
    Brush.prototype = { init: init,
                        toggle: toggle,
                        setup_selection_brush: setup_selection_brush };

    return Brush;

    // definitions
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
        return this.map.sel.select('.brush').empty();
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
    function setup_selection_brush() {
        var selection = this.brush_sel, 
            selectable_selection = this.map.sel.selectAll('#nodes,#text-labels'),
            size_and_location = this.map.canvas.size_and_location(),
            width = size_and_location.width,
            height = size_and_location.height,
            x = size_and_location.x,
            y = size_and_location.y;

        // clear existing brush
        selection.selectAll('g').remove();

        var brush_fn = d3.svg.brush()
                .x(d3.scale.identity().domain([x, x+width]))
                .y(d3.scale.identity().domain([y, y+height]))
                .on("brush", function(key_manager) {        
                    var shift_key_on = key_manager.held_keys.shift,
                        extent = d3.event.target.extent(),
                        selection;
                    if (shift_key_on) {
                        // when shift is pressed, ignore the currently selected nodes
                        selection = selectable_selection
                            .selectAll('.node:not(.selected),.text-label:not(.selected)');
                    } else {
                        // otherwise, brush all nodes
                        selection = selectable_selection
                            .selectAll('.node,.text-label');
                    }
                    selection.classed("selected", function(d) { 
                        var sx = d.x, sy = d.y;
                        return extent[0][0] <= sx && sx < extent[1][0]
                            && extent[0][1] <= sy && sy < extent[1][1];
                    });
                }.bind(null, this.map.key_manager))
                .on("brushend", function() {
                    d3.event.target.clear();
                    d3.select(this).call(d3.event.target);
                }),
            brush = selection.append("g")
                .attr("class", "brush")
                .call(brush_fn);

        // turn off the mouse crosshair
        selection.selectAll('.background')
            .classed('cursor-grab', false)
            .classed('cursor-grabbing', false)
            .style('cursor', null);

        return brush;
    }
});
