define(["vis/utils", "lib/d3"], function(utils, d3) {
    /** Defines a canvas that accepts drag/zoom events and can be resized.

     Canvas(selection, x, y, width, height)

     Adapted from http://bl.ocks.org/mccannf/1629464.

     */

    var Canvas = utils.make_class();
    Canvas.prototype = { init: init };

    return Canvas;

    function init(selection, x, y, width, height) {
	var extent = {"x": width, "y": height},
	    dragbar_width = 20,
	    new_sel = selection.append('g')
		.classed('canvas-group', true)
		.data([{x: x, y: y}]);
	
	var rect = new_sel.append('rect')
		.attr('id', 'mouse-node')
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate("+[x,y]+")")
		.attr('class', 'canvas')
		.attr('pointer-events', 'all');

	var drag_right = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", stop_propagation)
		.on("drag", rdragresize),
	    drag_left = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", stop_propagation)
		.on("drag", ldragresize),
	    drag_top = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", stop_propagation)
		.on("drag", tdragresize),
	    drag_bottom = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", stop_propagation)
		.on("drag", bdragresize);

	var left = new_sel.append("rect")
		.attr("x", function(d) { return d.x - (dragbar_width/2); })
		.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("height", height - dragbar_width)
		.attr("id", "dragleft")
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_left);
	
	var right = new_sel.append("rect")
		.attr("x", function(d) { return d.x + width - (dragbar_width/2); })
		.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("id", "dragright")
		.attr("height", height - dragbar_width)
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_right);
	
	var top = new_sel.append("rect")
		.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("y", function(d) { return d.y - (dragbar_width/2); })
		.attr("height", dragbar_width)
		.attr("id", "dragleft")
		.attr("width", width - dragbar_width)
		.attr("cursor", "ns-resize")
		.classed('resize-rect', true)
		.call(drag_top);
	
	var bottom = new_sel.append("rect")
		.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("y", function(d) { return d.y + height - (dragbar_width/2); })
		.attr("id", "dragright")
		.attr("height", dragbar_width)
		.attr("width", width - dragbar_width)
		.attr("cursor", "ns-resize")
		.classed('resize-rect', true)
		.call(drag_bottom);
	
	// definitions
	function stop_propagation() {
	    d3.event.sourceEvent.stopPropagation();
	}
	function ldragresize(d) {
	    var oldx = d.x; 
	    //Max x on the right is x + width - dragbar_width
	    //Max x on the left is 0 - (dragbar_width/2)
	    d.x = Math.min(d.x + width - (dragbar_width / 2), d3.event.x);
	    width = width + (oldx - d.x);
	    left.attr("x", function(d) { return d.x - (dragbar_width / 2); });	    
	    rect.attr("x", function(d) { return d.x; }).attr("width", width);
	    top.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("width", width - dragbar_width);
	    bottom.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("width", width - dragbar_width);
	}

	function rdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    //Max x on the left is x - width 
	    //Max x on the right is width of screen + (dragbar_width/2)
	    var dragx = Math.max(d.x + (dragbar_width/2), d.x + width + d3.event.dx);
	    //recalculate width
	    width = dragx - d.x;
	    //move the right drag handle
	    right.attr("x", function(d) { return dragx - (dragbar_width/2); });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    rect.attr("width", width);
	    top.attr("width", width - dragbar_width);
	    bottom.attr("width", width - dragbar_width);
	}

	function tdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();	    
	    var oldy = d.y; 
	    //Max x on the right is x + width - dragbar_width
	    //Max x on the left is 0 - (dragbar_width/2)
	    d.y = Math.min(d.y + height - (dragbar_width / 2), d3.event.y);
	    height = height + (oldy - d.y);
	    top.attr("y", function(d) { return d.y - (dragbar_width / 2); });	    
	    rect.attr("y", function(d) { return d.y; })
		.attr("height", height);
	    left.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("height", height - dragbar_width);
	    right.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("height", height - dragbar_width);
	}

	function bdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    //Max x on the left is x - width 
	    //Max x on the right is width of screen + (dragbar_width/2)
	    var dragy = Math.max(d.y + (dragbar_width/2), d.y + height + d3.event.dy);
	    //recalculate width
	    height = dragy - d.y;
	    //move the right drag handle
	    bottom.attr("y", function(d) { return dragy - (dragbar_width/2); });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    rect.attr("height", height);
	    left.attr("height", height - dragbar_width);
	    right.attr("height", height - dragbar_width);
	}
    }
});
