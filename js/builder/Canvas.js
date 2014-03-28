define(["vis/utils", "lib/d3"], function(utils, d3) {
    /** Defines a canvas that accepts drag/zoom events and can be resized.

     Canvas(selection, x, y, width, height)

     Adapted from http://bl.ocks.org/mccannf/1629464.

     */

    var Canvas = utils.make_class();
    Canvas.prototype = { init: init,
			 setup: setup,
			 size_and_location: size_and_location };

    return Canvas;

    function init(selection, size_and_location) {
	this.selection = selection;
	this.x = size_and_location.x;
	this.y = size_and_location.y;
	this.width = size_and_location.width;
	this.height = size_and_location.height;

	this.setup();
    }

    function setup() {	
	var self = this,
	    extent = {"x": this.width, "y": this.height},
	    dragbar_width = 20,
	    new_sel = this.selection.append('g')
		.classed('canvas-group', true)
		.data([{x: this.x, y: this.y}]);
	
	var rect = new_sel.append('rect')
		.attr('id', 'mouse-node')
		.attr("width", this.width)
		.attr("height", this.height)
		.attr("transform", "translate("+[self.x, self.y]+")")
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
		.attr("height", this.height - dragbar_width)
		.attr("id", "dragleft")
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_left);
	
	var right = new_sel.append("rect")
		.attr("x", function(d) { return d.x + self.width - (dragbar_width/2); })
		.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("id", "dragright")
		.attr("height", this.height - dragbar_width)
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_right);
	
	var top = new_sel.append("rect")
		.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("y", function(d) { return d.y - (dragbar_width/2); })
		.attr("height", dragbar_width)
		.attr("id", "dragleft")
		.attr("width", this.width - dragbar_width)
		.attr("cursor", "ns-resize")
		.classed('resize-rect', true)
		.call(drag_top);
	
	var bottom = new_sel.append("rect")
		.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("y", function(d) { return d.y + self.height - (dragbar_width/2); })
		.attr("id", "dragright")
		.attr("height", dragbar_width)
		.attr("width", this.width - dragbar_width)
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
	    d.x = Math.min(d.x + self.width - (dragbar_width / 2), d3.event.x);
	    self.x = d.x;
	    self.width = self.width + (oldx - d.x);
	    left.attr("x", function(d) { return d.x - (dragbar_width / 2); });	    
	    rect.attr("x", function(d) { return d.x; }).attr("width", self.width);
	    top.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("width", self.width - dragbar_width);
	    bottom.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("width", self.width - dragbar_width);
	}

	function rdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    //Max x on the left is x - width 
	    //Max x on the right is width of screen + (dragbar_width/2)
	    var dragx = Math.max(d.x + (dragbar_width/2), d.x + self.width + d3.event.dx);
	    //recalculate width
	    self.width = dragx - d.x;
	    //move the right drag handle
	    right.attr("x", function(d) { return dragx - (dragbar_width/2); });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    rect.attr("width", self.width);
	    top.attr("width", self.width - dragbar_width);
	    bottom.attr("width", self.width - dragbar_width);
	}

	function tdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();	    
	    var oldy = d.y; 
	    //Max x on the right is x + width - dragbar_width
	    //Max x on the left is 0 - (dragbar_width/2)
	    d.y = Math.min(d.y + self.height - (dragbar_width / 2), d3.event.y);
	    self.y = d.y;
	    self.height = self.height + (oldy - d.y);
	    top.attr("y", function(d) { return d.y - (dragbar_width / 2); });	    
	    rect.attr("y", function(d) { return d.y; })
		.attr("height", self.height);
	    left.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("height", self.height - dragbar_width);
	    right.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("height", self.height - dragbar_width);
	}

	function bdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    //Max x on the left is x - width 
	    //Max x on the right is width of screen + (dragbar_width/2)
	    var dragy = Math.max(d.y + (dragbar_width/2), d.y + self.height + d3.event.dy);
	    //recalculate width
	    self.height = dragy - d.y;
	    //move the right drag handle
	    bottom.attr("y", function(d) { return dragy - (dragbar_width/2); });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    rect.attr("height", self.height);
	    left.attr("height", self.height - dragbar_width);
	    right.attr("height", self.height - dragbar_width);
	}
    }

    function size_and_location() {
	return { x: this.x,
		 y: this.y,
		 width: this.width,
		 height: this.height };
    }
});
