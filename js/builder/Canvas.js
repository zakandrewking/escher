define(["vis/utils"], function(utils) {
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
		.attr('transform', function(d) {
		    return 'translate('+[ d.x - (dragbar_width/2),
					  d.y + (dragbar_width/2) ]+')';
		})
		.attr("height", this.height - dragbar_width)
		.attr("id", "dragleft")
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_left);
	
	var right = new_sel.append("rect")
		.attr('transform', function(d) {
		    return 'translate('+[ d.x + self.width - (dragbar_width/2),
					  d.y + (dragbar_width/2) ]+')';
		})
		.attr("id", "dragright")
		.attr("height", this.height - dragbar_width)
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_right);
	
	var top = new_sel.append("rect")
		.attr('transform', function(d) {
		    return 'translate('+[ d.x + (dragbar_width/2),
					  d.y - (dragbar_width/2) ]+')';
		})
		.attr("height", dragbar_width)
		.attr("id", "dragleft")
		.attr("width", this.width - dragbar_width)
		.attr("cursor", "ns-resize")
		.classed('resize-rect', true)
		.call(drag_top);
	
	var bottom = new_sel.append("rect")
		.attr('transform', function(d) {
		    return 'translate('+[ d.x + (dragbar_width/2),
					  d.y + self.height - (dragbar_width/2) ]+')';
		})
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
	function transform_string(x, y, current_transform) {
	    var tr = d3.transform(current_transform),
		translate = tr.translate;	    
	    if (x!==null) translate[0] = x;
	    if (y!==null) translate[1] = y;
	    return 'translate('+translate+')';
	}
	function ldragresize(d) {
	    var oldx = d.x; 
	    d.x = Math.min(d.x + self.width - (dragbar_width / 2), d3.event.x);
	    self.x = d.x;
	    self.width = self.width + (oldx - d.x);
	    left.attr("transform", function(d) {
		return transform_string(d.x - (dragbar_width / 2), null, left.attr('transform'));
	    });
	    rect.attr("transform", function(d) {
		return transform_string(d.x, null, rect.attr('transform'));
	    }).attr("width", self.width);
	    top.attr("transform", function(d) {
		return transform_string(d.x + (dragbar_width/2), null, top.attr('transform'));
	    }).attr("width", self.width - dragbar_width);
	    bottom.attr("transform", function(d) {
		return transform_string(d.x + (dragbar_width/2), null, bottom.attr('transform'));
	    }).attr("width", self.width - dragbar_width);
	}

	function rdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    var dragx = Math.max(d.x + (dragbar_width/2), d.x + self.width + d3.event.dx);
	    //recalculate width
	    self.width = dragx - d.x;
	    //move the right drag handle
	    right.attr("transform", function(d) {
		return transform_string(dragx - (dragbar_width/2), null, right.attr('transform'));
	    });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    rect.attr("width", self.width);
	    top.attr("width", self.width - dragbar_width);
	    bottom.attr("width", self.width - dragbar_width);
	}

	function tdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();	    
	    var oldy = d.y; 
	    d.y = Math.min(d.y + self.height - (dragbar_width / 2), d3.event.y);
	    self.y = d.y;
	    self.height = self.height + (oldy - d.y);
	    top.attr("transform", function(d) {
		return transform_string(null, d.y - (dragbar_width / 2), top.attr('transform'));
	    });
	    rect.attr("transform", function(d) {
		return transform_string(null, d.y, rect.attr('transform'));
	    }).attr("height", self.height);
	    left.attr("transform", function(d) {
		return transform_string(null, d.y + (dragbar_width/2), left.attr('transform'));
	    }).attr("height", self.height - dragbar_width);
	    right.attr("transform", function(d) {
		return transform_string(null, d.y + (dragbar_width/2), right.attr('transform'));
	    }).attr("height", self.height - dragbar_width);
	}

	function bdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    var dragy = Math.max(d.y + (dragbar_width/2), d.y + self.height + d3.event.dy);
	    //recalculate width
	    self.height = dragy - d.y;
	    //move the right drag handle
	    bottom.attr("transform", function(d) {
		return transform_string(null, dragy - (dragbar_width/2), bottom.attr('transform'));
	    });
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
