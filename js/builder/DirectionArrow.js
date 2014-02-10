define(["vis/scaffold"], function(scaffold) {
    var DirectionArrow = scaffold.make_class();
    DirectionArrow.prototype = { init: init,
				 show: show,
				 hide: hide };
    return DirectionArrow;

    // definitions
    function init() {
	console.log('init');
    }
    function show() {

    }
    function hide() {

    }
});
