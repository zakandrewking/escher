define(["vis/utils", "lib/d3"], function(utils, d3) {
    /** ZoomContainer

     The zoom behavior is based on this SO question:
     http://stackoverflow.com/questions/18788188/how-to-temporarily-disable-the-zooming-in-d3-js
     */
    var ZoomContainer = utils.make_class();
    ZoomContainer.prototype = { init: init,
				toggle_zoom: toggle_zoom,
				translate: translate,
				scale: scale,
				translate_off_screen: translate_off_screen,
				reset: reset };
    return ZoomContainer;

    // definitions
    function init(sel, w, h, scale_extent, callback) {
	if (callback===undefined) callback = function() {};
	this.zoom_on = true;
	this.initial_zoom = 1.0;
	this.window_translate = {x: 0, y: 0};
	this.window_scale = 1.0;

        // set up the container
        sel.select("#container").remove();
        var container = sel.append("g")
                .attr("id", "container");
        this.zoomed_sel = container.append("g");

        var zoom = function() {
	    if (this.zoom_on) {
                this.zoomed_sel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		this.window_translate = {'x': d3.event.translate[0], 'y': d3.event.translate[1]};
		this.window_scale = d3.event.scale;
		callback.apply(this);
	    }
        };
	var zoom_behavior = d3.behavior.zoom().scaleExtent(scale_extent).on("zoom", zoom);
	container.call(zoom_behavior);

	this.saved_scale = null;
	this.saved_translate = null;	
    }

    function toggle_zoom(on_off) {
	/** Toggle the zoom state, and remember zoom when the behavior is off.

	 */
	if (on_off===undefined) {
	    this.zoom_on = !this.zoom_on;
	} else {
	    this.zoom_on = on_off;
	}
	if (this.zoom_on) {
	    if (this.saved_scale !== null){
		this.zoom_behavior.scale(this.saved_scale);
		this.saved_scale = null;
	    }
	    if (this.saved_translate !== null){
		this.zoom_behavior.translate(this.saved_translate);
		this.saved_translate = null;
	    }
	} else {
	    if (this.saved_scale === null){
		this.saved_scale = utils.clone(this.zoom_behavior.scale());
	    }
	    if (this.saved_translate === null){
		this.saved_translate = utils.clone(this.zoom_behavior.translate());
	    }      
	}
    }

    // functions to scale and translate
    function scale(scale) {
	this.zoom_behavior.scale(scale);
	if (this.saved_scale !== null) this.saved_scale = scale;
    }
    
    function translate(translate) {
	this.zoom_behavior.translate(translate);
	if (this.saved_translate !== null) this.saved_translate = translate;
    }			    

    function translate_off_screen(coords, x_scale, y_scale) {
        // shift window if new reaction will draw off the screen
        // TODO BUG not accounting for scale correctly
        var margin = 80, // pixels
	    current = {'x': {'min': - this.window_translate.x / this.window_scale + margin / this.window_scale,
			     'max': - this.window_translate.x / this.window_scale + (this.width-margin) / this.window_scale },
		       'y': {'min': - this.window_translate.y / this.window_scale + margin / this.window_scale,
			     'max': - this.window_translate.y / this.window_scale + (this.height-margin) / this.window_scale } };
        if (x_scale(coords.x) < current.x.min) {
            this.window_translate.x = this.window_translate.x - (x_scale(coords.x) - current.x.min) * this.window_scale;
            go();
        } else if (x_scale(coords.x) > current.x.max) {
            this.window_translate.x = this.window_translate.x - (x_scale(coords.x) - current.x.max) * this.window_scale;
            go();
        }
        if (y_scale(coords.y) < current.y.min) {
            this.window_translate.y = this.window_translate.y - (y_scale(coords.y) - current.y.min) * this.window_scale;
            go();
        } else if (y_scale(coords.y) > current.y.max) {
            this.window_translate.y = this.window_translate.y - (y_scale(coords.y) - current.y.max) * this.window_scale;
            go();
        }

	// definitions
        function go() {
            this.zoom_container.translate([this.window_translate.x, this.window_translate.y]);
            this.zoom_container.scale(this.window_scale);
            this.sel.transition()
                .attr('transform', 'translate('+this.window_translate.x+','+this.window_translate.y+')scale('+this.window_scale+')');
        }
    }

    function reset() {
	this.window_translate = {x: 0, y: 0};
	this.window_scale = 1.0;
	this.translate([this.window_translate.x, this.window_translate.y]);
	this.scale(this.window_scale);
	this.sel.attr('transform', 'translate('+this.window_translate.x+','+this.window_translate.y+')scale('+this.window_scale+')');
    }
});