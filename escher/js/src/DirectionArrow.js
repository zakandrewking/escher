define(["utils"], function(utils) {
    /** DirectionArrow returns a constructor for an arrow that can be rotated
     and dragged, and supplies its direction.
     */
    var DirectionArrow = utils.make_class();
    DirectionArrow.prototype = { init: init,
                                 set_location: set_location,
                                 set_rotation: set_rotation,
                                 displace_rotation: displace_rotation,
                                 get_rotation: get_rotation,
                                 toggle: toggle,
                                 show: show,
                                 hide: hide,
                                 right: right,
                                 left: left,
                                 up: up,
                                 down: down,
                                 _setup_drag: _setup_drag };
    return DirectionArrow;

    // definitions
    function init(sel) {
        this.arrow_container = sel.append('g')
            .attr('id', 'direction-arrow-container')
            .attr('transform', 'translate(0,0)rotate(0)');
        this.arrow = this.arrow_container.append('path')
            .classed('direction-arrow', true)
            .attr('d', path_for_arrow())
            .style('visibility', 'hidden')
            .attr('transform', 'translate(30,0)scale(2.5)');

        this.sel = sel;
        this.center = { x: 0, y: 0 };

        this._setup_drag();
        this.dragging = false;

        this.is_visible = false;
        this.show();

        // definitions
        function path_for_arrow() {
            return "M0 -5 L0 5 L20 5 L20 10 L30 0 L20 -10 L20 -5 Z";
        }
    }
    function set_location(coords) {
        /** Move the arrow to coords.
         */
        this.center = coords;
        var transform = d3.transform(this.arrow_container.attr('transform'));
        this.arrow_container.attr('transform',
                                  'translate('+coords.x+','+coords.y+')rotate('+transform.rotate+')');
    }
    function set_rotation(rotation) {
        /** Rotate the arrow to rotation.
         */
        var transform = d3.transform(this.arrow_container.attr('transform'));
        this.arrow_container.attr('transform',
                                  'translate('+transform.translate+')rotate('+rotation+')');
    }
    function displace_rotation(d_rotation) {
        /** Displace the arrow rotation by a set amount.
         */
        var transform = d3.transform(this.arrow_container.attr('transform'));
        this.arrow_container.attr('transform',
                                  'translate('+transform.translate+')'+
                                  'rotate('+(transform.rotate+d_rotation)+')');
    }
    function get_rotation() {
        /** Returns the arrow rotation.
         */
        return d3.transform(this.arrow_container.attr('transform')).rotate;
    }
    function toggle(on_off) {
        if (on_off===undefined) this.is_visible = !this.is_visible;
        else this.is_visible = on_off;
        this.arrow.style('visibility', this.is_visible ? 'visible' : 'hidden');
    }
    function show() {
        this.toggle(true);
    }
    function hide() {
        this.toggle(false);
    }
    function right() {
        this.set_rotation(0);
    }
    function down() {
        this.set_rotation(90);
    }
    function left() {
        this.set_rotation(180);
    }
    function up() {
        this.set_rotation(270);
    }
    
    function _setup_drag() {
        var b = d3.behavior.drag()
                .on("dragstart", function(d) {
                    // silence other listeners
                    d3.event.sourceEvent.stopPropagation();
                    this.dragging = true;
                }.bind(this))
                .on("drag.direction_arrow", function(d) {
                    var displacement = { x: d3.event.dx,
                                         y: d3.event.dy },
                        location = { x: d3.mouse(this.sel.node())[0],
                                     y: d3.mouse(this.sel.node())[1] },
                        d_angle = utils.angle_for_event(displacement,
                                                        location,
                                                        this.center);
                    this.displace_rotation(utils.to_degrees(d_angle));
                }.bind(this))
                .on("dragend", function(d) {
                    window.setTimeout(function() {
                        this.dragging = false;
                    }.bind(this), 200);
                }.bind(this));
        this.arrow_container.call(b);
    }
});
