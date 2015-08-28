define(["utils", "CallbackManager"], function(utils, CallbackManager) {
    /** Defines a canvas that accepts drag/zoom events and can be resized.

     Canvas(selection, x, y, width, height)

     Adapted from http://bl.ocks.org/mccannf/1629464.

     */

    var Canvas = utils.make_class();
    Canvas.prototype = { init: init,
                         toggle_resize: toggle_resize,
                         setup: setup,
                         size_and_location: size_and_location };

    return Canvas;

    function init(selection, size_and_location) {
        this.selection = selection;
        this.x = size_and_location.x;
        this.y = size_and_location.y;
        this.width = size_and_location.width;
        this.height = size_and_location.height;

        // enable by default
        this.resize_enabled = true;

        // set up the callbacks
        this.callback_manager = new CallbackManager();

        this.setup();
    }

    function toggle_resize(on_off) {
        /** Turn the resize on or off

         */
        if (on_off===undefined) on_off = !this.resize_enabled;

        if (on_off) {
            this.selection.selectAll('.drag-rect')
                .style('pointer-events', 'auto');
        } else {
            this.selection.selectAll('.drag-rect')
                .style('pointer-events', 'none');
        }
    }   

    function setup() {  
        var self = this,
            extent = {"x": this.width, "y": this.height},
            dragbar_width = 100,
            mouse_node_mult = 10,
            new_sel = this.selection.append('g')
                .classed('canvas-group', true)
                .data([{x: this.x, y: this.y}]);
        
        var mouse_node = new_sel.append('rect')
                .attr('id', 'mouse-node')
                .attr("width", this.width*mouse_node_mult)
                .attr("height", this.height*mouse_node_mult)
                .attr("transform", "translate("+[self.x - this.width*mouse_node_mult/2,
                                                 self.y - this.height*mouse_node_mult/2]+")")
                .attr('pointer-events', 'all');
        this.mouse_node = mouse_node;
        
        var rect = new_sel.append('rect')
                .attr('id', 'canvas')
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("transform", "translate("+[self.x, self.y]+")");

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
                .classed('drag-rect', true)
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
                .classed('drag-rect', true)
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
                .classed('drag-rect', true)
                .attr('transform', function(d) {
                    return 'translate('+[ d.x + (dragbar_width/2),
                                          d.y - (dragbar_width/2) ]+')';
                })
                .attr("height", dragbar_width)
                .attr("id", "dragtop")
                .attr("width", this.width - dragbar_width)
                .attr("cursor", "ns-resize")
                .classed('resize-rect', true)
                .call(drag_top);
        
        var bottom = new_sel.append("rect")
                .classed('drag-rect', true)
                .attr('transform', function(d) {
                    return 'translate('+[ d.x + (dragbar_width/2),
                                          d.y + self.height - (dragbar_width/2) ]+')';
                })
                .attr("id", "dragbottom")
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
            mouse_node.attr("transform", function(d) {
                return transform_string(d.x, null, mouse_node.attr('transform'));
            }).attr("width", self.width*mouse_node_mult);
            rect.attr("transform", function(d) {
                return transform_string(d.x, null, rect.attr('transform'));
            }).attr("width", self.width);
            top.attr("transform", function(d) {
                return transform_string(d.x + (dragbar_width/2), null, top.attr('transform'));
            }).attr("width", self.width - dragbar_width);
            bottom.attr("transform", function(d) {
                return transform_string(d.x + (dragbar_width/2), null, bottom.attr('transform'));
            }).attr("width", self.width - dragbar_width);

            self.callback_manager.run('resize');
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
            mouse_node.attr("width", self.width*mouse_node_mult);
            rect.attr("width", self.width);
            top.attr("width", self.width - dragbar_width);
            bottom.attr("width", self.width - dragbar_width);

            self.callback_manager.run('resize');
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
            mouse_node.attr("transform", function(d) {
                return transform_string(null, d.y, mouse_node.attr('transform'));
            }).attr("width", self.height*mouse_node_mult);
            rect.attr("transform", function(d) {
                return transform_string(null, d.y, rect.attr('transform'));
            }).attr("height", self.height);
            left.attr("transform", function(d) {
                return transform_string(null, d.y + (dragbar_width/2), left.attr('transform'));
            }).attr("height", self.height - dragbar_width);
            right.attr("transform", function(d) {
                return transform_string(null, d.y + (dragbar_width/2), right.attr('transform'));
            }).attr("height", self.height - dragbar_width);

            self.callback_manager.run('resize');
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
            mouse_node.attr("height", self.height*mouse_node_mult);
            rect.attr("height", self.height);
            left.attr("height", self.height - dragbar_width);
            right.attr("height", self.height - dragbar_width);

            self.callback_manager.run('resize');
        }
    }

    function size_and_location() {
        return { x: this.x,
                 y: this.y,
                 width: this.width,
                 height: this.height };
    }
});
