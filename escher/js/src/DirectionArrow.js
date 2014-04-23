define(["utils"], function(utils) {
    /** DirectionArrow returns a constructor for an arrow that can be rotated
     and dragged, and supplies its direction.
     */
    var DirectionArrow = utils.make_class();
    DirectionArrow.prototype = { init: init,
				 set_location: set_location,
				 set_rotation: set_rotation,
				 get_rotation: get_rotation,
				 show: show,
				 hide: hide,
				 right: right,
				 left: left,
				 up: up,
				 down: down };
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
	    .attr('transform', 'translate(20,0)scale(1.5)');

	// definitions
	function path_for_arrow() {
	    return "M0 -5 L0 5 L20 5 L20 10 L30 0 L20 -10 L20 -5 Z";
	}
    }
    function set_location(coords) {
	/** Move the arrow to coords.
	 */
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
    function get_rotation() {
	/** Returns the arrow rotation.
	 */
	return d3.transform(this.arrow_container.attr('transform')).rotate;
    }
    function show() {
	this.arrow.style('visibility', 'visible');
    }
    function hide() {
	this.arrow.style('visibility', 'hidden');
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
});
