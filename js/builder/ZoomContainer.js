define(["vis/utils", "vis/CallbackManager"], function(utils, CallbackManager) {
    /** ZoomContainer

     The zoom behavior is based on this SO question:
     http://stackoverflow.com/questions/18788188/how-to-temporarily-disable-the-zooming-in-d3-js
     */
    var ZoomContainer = utils.make_class();
    ZoomContainer.prototype = { init: init,
				toggle_zoom: toggle_zoom,
				go_to: go_to,
				translate_off_screen: translate_off_screen,
				reset: reset };
    return ZoomContainer;

    // definitions
    function init(selection, w, h, scale_extent) {
	this.zoom_on = true;
	this.initial_zoom = 1.0;
	this.window_translate = {x: 0, y: 0};
	this.window_scale = 1.0;
	this.width = w;
	this.height = h;

	// set up the callbacks
	this.callback_manager = new CallbackManager();

        // set up the container
        selection.select("#zoom-container").remove();
        var container = selection.append("g")
                .attr("id", "zoom-container");
        this.zoomed_sel = container.append("g");

	// the zoom function and behavior
        var zoom = function(zoom_container, event) {
	    if (zoom_container.zoom_on) {
                zoom_container.zoomed_sel.attr("transform", "translate(" + event.translate + ")" +
					       "scale(" + event.scale + ")");
		zoom_container.window_translate = {'x': event.translate[0],
						   'y': event.translate[1]};
		zoom_container.window_scale = event.scale;
		zoom_container.callback_manager.run('zoom');
	    }
        };
	var zoom_container = this;
	this.zoom_behavior = d3.behavior.zoom()
	    // .scaleExtent(scale_extent)
	    .on("zoom", function() {
		zoom(zoom_container, d3.event);
	    });
	container.call(this.zoom_behavior);

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
    function go_to(scale, translate) { 
	if (!scale) return console.error('Bad scale value');
	if (!translate || !('x' in translate) || !('y' in translate))
	    return console.error('Bad translate value');

	this.zoom_behavior.scale(scale);
	this.window_scale = scale;
	if (this.saved_scale !== null) this.saved_scale = scale;

	var translate_array = [translate.x, translate.y];
	this.zoom_behavior.translate(translate_array);
        this.window_translate = translate;
	if (this.saved_translate !== null) this.saved_translate = translate_array;

        this.zoomed_sel
	    .transition()
            .attr('transform',
		  'translate('+this.window_translate.x+','+this.window_translate.y+')'+
		  'scale('+this.window_scale+')');
	return null;
    }			    

    function translate_off_screen(coords, x_scale, y_scale) {
        // shift window if new reaction will draw off the screen
        // TODO BUG not accounting for scale correctly
        var margin = 80, // pixels
	    current = {'x': {'min': - this.window_translate.x / this.window_scale +
			     margin / this.window_scale,
			     'max': - this.window_translate.x / this.window_scale +
			     (this.width-margin) / this.window_scale },
		       'y': {'min': - this.window_translate.y / this.window_scale +
			     margin / this.window_scale,
			     'max': - this.window_translate.y / this.window_scale +
			     (this.height-margin) / this.window_scale } };
        if (x_scale(coords.x) < current.x.min) {
            this.window_translate.x = this.window_translate.x -
		(x_scale(coords.x) - current.x.min) * this.window_scale;
            this.go_to(this.window_scale, this.window_translate);
        } else if (x_scale(coords.x) > current.x.max) {
            this.window_translate.x = this.window_translate.x -
		(x_scale(coords.x) - current.x.max) * this.window_scale;
            this.go_to(this.window_scale, this.window_translate);
        }
        if (y_scale(coords.y) < current.y.min) {
            this.window_translate.y = this.window_translate.y -
		(y_scale(coords.y) - current.y.min) * this.window_scale;
            this.go_to(this.window_scale, this.window_translate);
        } else if (y_scale(coords.y) > current.y.max) {
            this.window_translate.y = this.window_translate.y -
		(y_scale(coords.y) - current.y.max) * this.window_scale;
            this.go_to(this.window_scale, this.window_translate);
        }
    }
    function reset() {
	this.go_to(1.0, {x: 0.0, y: 0.0});
    }
});
