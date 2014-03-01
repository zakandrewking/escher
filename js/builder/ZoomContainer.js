define(["vis/scaffold", "lib/d3", "metabolic-map/utils"], function(scaffold, d3, utils) {
    /** ZoomContainer

     The zoom behavior is based on this SO question:
     http://stackoverflow.com/questions/18788188/how-to-temporarily-disable-the-zooming-in-d3-js
     */
    var ZoomContainer = scaffold.make_class();
    ZoomContainer.prototype = { init: init };
    return ZoomContainer;

    // definitions
    function init(sel, w, h, scale_extent, callback) {
	if (callback===undefined) callback = function() {};
        // set up the container
        sel.select("#container").remove();
	var saved_scale = null,
	    saved_translate = null,
	    zoom_on = true,
            container = sel.append("g")
                .attr("id", "container"),
            zoomed_sel = container.append("g"),
            zoom = function() {
		if (zoom_on) {
                    zoomed_sel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		    callback(d3.event);
		}
            },
	    zoom_behavior = d3.behavior.zoom().scaleExtent(scale_extent).on("zoom", zoom);
	this.toggle_zoom = function(on_off) {
	    if (on_off===undefined) {
		zoom_on = !zoom_on;
	    } else {
		zoom_on = on_off;
	    }
	    if (zoom_on) {
		if (saved_scale !== null){
		    zoom_behavior.scale(saved_scale);
		    saved_scale = null;
		}
		if (saved_translate !== null){
		    zoom_behavior.translate(saved_translate);
		    saved_translate = null;
		}
	    } else {
		if (saved_scale === null){
		    saved_scale = utils.clone(zoom_behavior.scale());
		}
		if (saved_translate === null){
		    saved_translate = utils.clone(zoom_behavior.translate());
		}      
	    }
	};
	this.zoom_enabled = function() {
	    return zoom_on;
	};
        container.call(zoom_behavior);

	this.zoom_behavior = zoom_behavior;
	this.zoomed_sel = zoomed_sel;
	this.initial_zoom = 1.0;
    }
});
