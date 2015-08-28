define(["utils", "CallbackManager"], function(utils, CallbackManager) {
    /** ZoomContainer

     The zoom behavior is based on this SO question:
     http://stackoverflow.com/questions/18788188/how-to-temporarily-disable-the-zooming-in-d3-js
     */
    var ZoomContainer = utils.make_class();
    ZoomContainer.prototype = { init: init,
                                update_scroll_behavior: update_scroll_behavior,
                                toggle_zoom: toggle_zoom,
                                go_to: go_to,
                                zoom_by: zoom_by,
                                zoom_in: zoom_in,
                                zoom_out: zoom_out,
                                get_size: get_size,
                                translate_off_screen: translate_off_screen,
                                reset: reset };
    return ZoomContainer;

    // definitions
    function init(selection, size_container, scroll_behavior) {
        /** Make a container that will manage panning and zooming.

         selection: A d3 selection of an 'svg' or 'g' node to put the zoom
         container in.

         size_container: A d3 selection of a 'div' node that has defined width
         and height.

         */

        this.zoom_on = true;
        this.initial_zoom = 1.0;
        this.window_translate = {x: 0, y: 0};
        this.window_scale = 1.0;

        // set up the callbacks
        this.callback_manager = new CallbackManager();

        // save the size_container
        this.size_container = size_container;

        // set up the container
        selection.select("#zoom-container").remove();
        var container = selection.append("g")
                .attr("id", "zoom-container");
        this.container = container;
        this.zoomed_sel = container.append("g");
        
        // update the scroll behavior
        this.update_scroll_behavior(scroll_behavior);

        // initialize vars
        this.saved_scale = null;
        this.saved_translate = null;
    }
    
    function update_scroll_behavior(scroll_behavior) {
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
        // clear all behaviors
        this.container.on("mousewheel.zoom", null)
            .on("DOMMouseScroll.zoom", null) // disables older versions of Firefox
            .on("wheel.zoom", null) // disables newer versions of Firefox
            .on('dblclick.zoom', null)
            .on('mousewheel.escher', wheel_fn)
            .on('DOMMouseScroll.escher', wheel_fn)
            .on('wheel.escher', wheel_fn);
        
        // new zoom
        this.zoom_behavior = d3.behavior.zoom()
            .on("zoom", function() {
                zoom(this, d3.event);
            }.bind(this));
        this.container.call(this.zoom_behavior);    

        // options
        if (scroll_behavior=='none' || scroll_behavior=='pan') {
            this.container.on("mousewheel.zoom", null)
                .on("DOMMouseScroll.zoom", null) // disables older versions of Firefox
                .on("wheel.zoom", null) // disables newer versions of Firefox
                .on('dblclick.zoom', null);
        }
        if (scroll_behavior == 'pan') {
            // Add the wheel listener
            var wheel_fn = function() {
                var ev = d3.event,
                    sensitivity = 0.5;
                // stop scroll in parent elements
                ev.stopPropagation();
                ev.preventDefault();
                ev.returnValue = false;
                // change the location
                this.go_to(this.window_scale,
                           { x: this.window_translate.x -
                             (ev.wheelDeltaX!==undefined ? -ev.wheelDeltaX/1.5 : ev.deltaX) * sensitivity,
                             y: this.window_translate.y -
                             (ev.wheelDeltaY!==undefined ? -ev.wheelDeltaY/1.5 : ev.deltaY) * sensitivity },
                           false);
            }.bind(this);
            this.container.on('mousewheel.escher', wheel_fn);
            this.container.on('DOMMouseScroll.escher', wheel_fn);
            this.container.on('wheel.escher', wheel_fn);
        }
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

            // turn on the hand
            this.zoomed_sel
                .classed('cursor-grab', true).classed('cursor-grabbing', false);
            this.zoomed_sel
                .on('mousedown.cursor', function(sel) {
                    sel.classed('cursor-grab', false).classed('cursor-grabbing', true);
                }.bind(null, this.zoomed_sel))
                .on('mouseup.cursor', function(sel) {
                    sel.classed('cursor-grab', true).classed('cursor-grabbing', false);
                }.bind(null, this.zoomed_sel));
        } else {
            if (this.saved_scale === null){
                this.saved_scale = utils.clone(this.zoom_behavior.scale());
            }
            if (this.saved_translate === null){
                this.saved_translate = utils.clone(this.zoom_behavior.translate());
            }

            // turn off the hand
            this.zoomed_sel.style('cursor', null)
                .classed('cursor-grab', false)
                .classed('cursor-grabbing', false);
            this.zoomed_sel.on('mousedown.cursor', null);
            this.zoomed_sel.on('mouseup.cursor', null);
        }
    }

    // functions to scale and translate
    function go_to(scale, translate, show_transition) {
        utils.check_undefined(arguments, ['scale', 'translate']);
        if (show_transition===undefined) show_transition = true;

        if (!scale) throw new Error('Bad scale value');
        if (!translate || !('x' in translate) || !('y' in translate) ||
            isNaN(translate.x) || isNaN(translate.y))
            return console.error('Bad translate value');

        this.zoom_behavior.scale(scale);
        this.window_scale = scale;
        if (this.saved_scale !== null) this.saved_scale = scale;

        var translate_array = [translate.x, translate.y];
        this.zoom_behavior.translate(translate_array);
        this.window_translate = translate;
        if (this.saved_translate !== null) this.saved_translate = translate_array;

        var move_this = (show_transition ?
                         this.zoomed_sel.transition() :
                         this.zoomed_sel);
        move_this.attr('transform',
                       'translate('+this.window_translate.x+','+this.window_translate.y+')'+
                       'scale('+this.window_scale+')');

        this.callback_manager.run('go_to');
        return null;
    }

    function zoom_by(amount) {
        var size = this.get_size(),
            shift = { x: size.width/2 - ((size.width/2 - this.window_translate.x) * amount +
                                         this.window_translate.x),
                      y: size.height/2 - ((size.height/2 - this.window_translate.y) * amount +
                                          this.window_translate.y) };
        this.go_to(this.window_scale*amount,
                   utils.c_plus_c(this.window_translate, shift),
                   true);
    }
    function zoom_in() {
        this.zoom_by(1.5);
    }
    function zoom_out() {
        this.zoom_by(0.667);
    }

    function get_size() {
        return { width: parseInt(this.size_container.style('width'), 10),
                 height: parseInt(this.size_container.style('height'), 10) };
    }

    function translate_off_screen(coords) {
        // shift window if new reaction will draw off the screen
        // TODO BUG not accounting for scale correctly
        var margin = 120, // pixels
            size = this.get_size(),
            current = {'x': {'min': - this.window_translate.x / this.window_scale +
                             margin / this.window_scale,
                             'max': - this.window_translate.x / this.window_scale +
                             (size.width-margin) / this.window_scale },
                       'y': {'min': - this.window_translate.y / this.window_scale +
                             margin / this.window_scale,
                             'max': - this.window_translate.y / this.window_scale +
                             (size.height-margin) / this.window_scale } };
        if (coords.x < current.x.min) {
            this.window_translate.x = this.window_translate.x -
                (coords.x - current.x.min) * this.window_scale;
            this.go_to(this.window_scale, this.window_translate);
        } else if (coords.x > current.x.max) {
            this.window_translate.x = this.window_translate.x -
                (coords.x - current.x.max) * this.window_scale;
            this.go_to(this.window_scale, this.window_translate);
        }
        if (coords.y < current.y.min) {
            this.window_translate.y = this.window_translate.y -
                (coords.y - current.y.min) * this.window_scale;
            this.go_to(this.window_scale, this.window_translate);
        } else if (coords.y > current.y.max) {
            this.window_translate.y = this.window_translate.y -
                (coords.y - current.y.max) * this.window_scale;
            this.go_to(this.window_scale, this.window_translate);
        }
    }
    function reset() {
        this.go_to(1.0, {x: 0.0, y: 0.0});
    }
});
