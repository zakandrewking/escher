/* global define, d3 */

define(["utils", "CallbackManager", "lib/underscore"], function(utils, CallbackManager, _) {
    var ZoomContainer = utils.make_class();
    ZoomContainer.prototype = { init: init,
                                set_scroll_behavior: set_scroll_behavior,
                                _update_scroll: _update_scroll,
                                toggle_pan_drag: toggle_pan_drag,
                                go_to: go_to,
                                _go_to_3d: _go_to_3d,
                                _clear_3d: _clear_3d,
                                _go_to_svg: _go_to_svg,
                                zoom_by: zoom_by,
                                zoom_in: zoom_in,
                                zoom_out: zoom_out,
                                get_size: get_size,
                                translate_off_screen: translate_off_screen };
    return ZoomContainer;

    // definitions
    function init(selection, scroll_behavior, fill_screen) {
        /** Make a container that will manage panning and zooming. Creates a new
         SVG element, with a parent div for CSS3 3D transforms.

         Arguments
         ---------

         selection: A d3 selection of a HTML node to put the zoom container
         in. Should have a defined width and height.

         scroll_behavior: Either 'zoom' or 'pan'.

         fill_screen: If true, then apply styles to body and selection that fill
         the screen. The styled classes are "fill-screen-body" and
         "fill-screen-div".

         */

        // set the selection class
        selection.classed('escher-container', true);

        // fill screen classes
        if (fill_screen) {
            d3.select("body").classed('fill-screen-body', true);
            selection.classed('fill-screen-div', true);
        }

        // make the svg
        var css3_transform_container = selection.append('div')
                .attr('class', 'escher-3d-transform-container');

        var svg = css3_transform_container.append('svg')
            .attr("class", "escher-svg")
            .attr('xmlns', "http://www.w3.org/2000/svg");

        // set up the zoom container
        svg.select("#zoom-g").remove();
        var zoomed_sel = svg.append("g")
            .attr("id", "zoom-g");

        // attributes
        this.selection = selection;
        this.css3_transform_container = css3_transform_container;
        this.svg = svg;
        this.zoomed_sel = zoomed_sel;
        this.window_translate = {x: 0, y: 0};
        this.window_scale = 1.0;

        this._scroll_behavior = scroll_behavior;
        this._pan_drag_on = true;
        this._zoom_behavior = null;
        this._zoom_timeout = null;
        this._svg_scale = this.window_scale;
        this._svg_translate = this.window_translate;
        this._last_svg_ms = null;

        // set up the callbacks
        this.callback_manager = new CallbackManager();

        // update the scroll behavior
        this._update_scroll();
    }

    function set_scroll_behavior(scroll_behavior) {
        /** Set up pan or zoom on scroll.
         *
         * Arguments
         * ---------
         *
         * scroll_behavior: 'none', 'pan' or 'zoom'.
         *
         */

        this._scroll_behavior = scroll_behavior;
        this._update_scroll();
    }

    function toggle_pan_drag(on_off) {
        /** Toggle the zoom drag and the cursor UI for it. */

        if (_.isUndefined(on_off)) {
            this._pan_drag_on = !this._pan_drag_on;
        } else {
            this._pan_drag_on = on_off;
        }

        if (this._pan_drag_on) {
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
            // turn off the hand
            this.zoomed_sel.style('cursor', null)
                .classed('cursor-grab', false)
                .classed('cursor-grabbing', false);
            this.zoomed_sel.on('mousedown.cursor', null);
            this.zoomed_sel.on('mouseup.cursor', null);
        }

        // update the behaviors
        this._update_scroll();
    }

    function _update_scroll(on_off) {
        /** Update the pan and zoom behaviors. */

        if (['zoom', 'pan', 'none'].indexOf(this._scroll_behavior) === -1) {
            throw Error('Bad value for scroll_behavior: ' + this._scroll_behavior);
        }

        // clear all behaviors
        this.selection.on("mousewheel.zoom", null) // zoom scroll behaviors
            .on("DOMMouseScroll.zoom", null) // disables older versions of Firefox
            .on("wheel.zoom", null) // disables newer versions of Firefox
            .on('dblclick.zoom', null)
            .on('mousewheel.escher', null) // pan scroll behaviors
            .on('DOMMouseScroll.escher', null)
            .on('wheel.escher', null)
            .on("mousedown.zoom", null) // drag behaviors
            .on("touchstart.zoom", null)
            .on("touchmove.zoom", null)
            .on("touchend.zoom", null);

        // TODO what about touch? even when this is false, we probably want
        // pinch events to be recongnized.
        if (this._pan_drag_on || this._scroll_behavior === 'zoom') {
            // this handles dragging to pan (in any scroll mode) and scrolling
            // to zoom (only 'zoom' mode)
            this._zoom_behavior = d3.behavior.zoom()
                .on("zoom", function() {
                    this.go_to(d3.event.scale, {x: d3.event.translate[0], y: d3.event.translate[1]});
                }.bind(this));

            // set current location
            this._zoom_behavior.scale(this.window_scale);
            var translate_array = [this.window_translate.x, this.window_translate.y];
            this._zoom_behavior.translate(translate_array);

            // set it up
            this.selection.call(this._zoom_behavior);

            if (!this._pan_drag_on) {
                // if we are only using the zoom behavior for scrolling, then
                // turn off the panning
                this.selection.on("mousedown.zoom", null)
                    .on("touchstart.zoom", null)
                    .on("touchmove.zoom", null)
                    .on("touchend.zoom", null);
            }

            if (this._scroll_behavior !== 'zoom') {
                // If we are only using the zoom behavior for dragging, then
                // turn off scrolling to zoom
                this.selection.on("mousewheel.zoom", null) // zoom scroll behaviors
                    .on("DOMMouseScroll.zoom", null) // disables older versions of Firefox
                    .on("wheel.zoom", null) // disables newer versions of Firefox
                    .on('dblclick.zoom', null);
            }
        } else {
            this._zoom_behavior = null;
        }

        if (this._scroll_behavior === 'pan') {
            // Add the wheel listener
            var wheel_fn = function() {
                var ev = d3.event,
                    sensitivity = 0.5;
                // stop scroll in parent elements
                ev.stopPropagation();
                ev.preventDefault();
                ev.returnValue = false;
                // change the location
                var get_directional_disp = function(wheel_delta, delta) {
                    var the_delt = _.isUndefined(wheel_delta) ? delta : -wheel_delta / 1.5;
                    return the_delt * sensitivity;
                };
                var new_translate = {
                    x: this.window_translate.x - get_directional_disp(ev.wheelDeltaX, ev.deltaX),
                    y: this.window_translate.y - get_directional_disp(ev.wheelDeltaY, ev.deltaY)
                };
                this.go_to(this.window_scale, new_translate, false);
            }.bind(this);

            // apply it
            this.selection.on('mousewheel.escher', wheel_fn);
            this.selection.on('DOMMouseScroll.escher', wheel_fn);
            this.selection.on('wheel.escher', wheel_fn);
        }
    }

    // functions to scale and translate
    function go_to(scale, translate, show_transition, use_3d_transform) {
        /** Zoom the container to a specified location.
         *
         * Arguments
         * ---------
         *
         * scale: The scale, between 0 and 1.
         *
         * translate: The location, of the form {x: 2.0, y: 3.0}.
         *
         * show_transition (Boolean, default true): If true, than use a
         * transition to move to that location.
         *
         * use_3d_transform (Boolean, default true): If true, then use a CSS3 3D
         * transform for immediate zoom & pan. The SVG elements will update when
         * they are ready.
         *
         */

        utils.check_undefined(arguments, ['scale', 'translate']);
        if (_.isUndefined(show_transition)) show_transition = true;
        if (_.isUndefined(use_3d_transform)) use_3d_transform = true;

        // check inputs
        if (!scale) throw new Error('Bad scale value');
        if (!translate || !('x' in translate) || !('y' in translate) ||
            isNaN(translate.x) || isNaN(translate.y))
            return console.error('Bad translate value');

        // save inputs
        this.window_scale = scale;
        this.window_translate = translate;

        // save to zoom behavior
        if (!_.isNull(this._zoom_behavior)) {
            this._zoom_behavior.scale(scale);
            var translate_array = [translate.x, translate.y];
            this._zoom_behavior.translate(translate_array);
        }

        if (use_3d_transform) {
            // 3d tranform
            //
            // cancel all timeouts
            if (!_.isNull(this._zoom_timeout))
                window.clearTimeout(this._zoom_timeout);
            // set the 3d transform
            this._go_to_3d(scale, translate,
                           this._svg_scale, this._svg_translate);
            // if another go_to does not happen within the delay time, then
            // redraw the svg
            this._zoom_timeout = _.delay(function() {
                // redraw the svg
                this._go_to_svg(scale, translate);
            }.bind(this), 100); // between 100 and 600 seems to be usable
        } else {
            // no 3d transform
            this._go_to_svg(scale, translate);
        }

        this.callback_manager.run('go_to');
    }

    function _go_to_3d(scale, translate, svg_scale, svg_translate) {
        /** Zoom & pan the CSS 3D transform container */
        var n_scale = scale / svg_scale,
            n_translate = utils.c_minus_c(
                translate,
                utils.c_times_scalar(svg_translate, n_scale)
            ),
            tranform = ('translate(' + n_translate.x + 'px,' + n_translate.y + 'px) ' +
                        'scale(' + n_scale + ')');
        this.css3_transform_container.style('transform', tranform);
        this.css3_transform_container.style('transform-origin', '0 0');
    }

    function _clear_3d() {
        this.css3_transform_container.style('transform', null);
        this.css3_transform_container.style('transform-origin', null);
    }

    function _go_to_svg(scale, translate) {
        /** Zoom & pan the svg element.
         *
         * Also runs the svg_start and svg_finish callbacks, and saves the last
         * update time as this._last_svg_ms.
         *
         */

        this.callback_manager.run('svg_start');

        // defer to update callbacks
        _.defer(function() {

            // start time
            var start = new Date().getTime();

            // reset the 3d transform
            this._clear_3d();

            // redraw the svg
            this.zoomed_sel
                .attr('transform',
                      'translate(' + translate.x + ',' + translate.y + ') ' +
                      'scale(' + scale + ')');
            // save svg location
            this._svg_scale = this.window_scale;
            this._svg_translate = this.window_translate;

            _.defer(function() {
                // defer for callback after draw
                this.callback_manager.run('svg_finish');

                // wait a few ms to get a reliable end time
                _.delay(function() {
                    // end time
                    var t = new Date().getTime() - start;
                    console.log(t);
                    this._last_svg_ms = t;
                }.bind(this), 20);
            }.bind(this));
        }.bind(this));
    }

    function zoom_by(amount, show_transition, use_3d_transform) {
        /** Zoom by a specified multiplier.
         *
         * Arguments
         * ---------
         *
         * amount: A multiplier for the zoom. Greater than 1 zooms in and less
         * than 1 zooms out.
         *
         * show_transition (Boolean, default true): If true, than use a
         * transition to move to that location.
         *
         * use_3d_transform (Boolean, default true): If true, then use a CSS3 3D
         * transform for immediate zoom & pan. The SVG elements will update when
         * they are ready.
         *
         */
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
        /** Zoom in by the default amount with the default options. */
        this.zoom_by(1.5);
    }

    function zoom_out() {
        /** Zoom out by the default amount with the default options. */
        this.zoom_by(0.667);
    }

    function get_size() {
        /** Return the size of the zoom container as coordinates.
         *
         * e.g. {x: 2, y: 3}
         *
         */
        return { width: parseInt(this.selection.style('width'), 10),
                 height: parseInt(this.selection.style('height'), 10) };
    }

    function translate_off_screen(coords) {
        /** Shift window if new reaction will draw off the screen */

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
});
