define(["lib/d3"], function(d3) {
    return {
        set_options: set_options,
        setup_svg: setup_svg,
        load_css: load_css,
        load_files: load_files,
        load_the_file: load_the_file,
	scale_and_axes: scale_and_axes,
	add_generic_axis: add_generic_axis
    };

    // definitions
    function height_width_style(selection, margins) {
        var width = parseFloat(selection.style('width')) - margins.left - margins.right,
        height = parseFloat(selection.style('height')) - margins.top - margins.bottom;
        return {'width': width, 'height': height};
    };
    function height_width_attr(selection, margins) {
        var width = parseFloat(selection.attr('width')) - margins.left - margins.right,
        height = parseFloat(selection.attr('height')) - margins.top - margins.bottom;
        return {'width': width, 'height': height};
    };
    function set_options(options, defaults) {
        if (options===undefined) return defaults;
        var i = -1,
        out = defaults,
        keys = window.Object.keys(options);
        while (++i < keys.length) out[keys[i]] = options[keys[i]];
        return out;
    };
    function setup_svg(selection, selection_is_svg, margins, fill_screen) {
        // sub selection places the graph in an existing svg environment
        var add_svg = function(f, s, m) {
            if (f) {
                d3.select("body")
                    .style("margin", "0")
                    .style("padding", "0");
                s.style('height', (window.innerHeight-m.top)+'px');
                s.style('width', (window.innerWidth-m.left)+'px');
                s.style("margin-left", m.left+"px");
                s.style("margin-top", m.top+"px");
            }
            var out = height_width_style(s, m);
            out.svg = s.append('svg')
                .attr("width", out.width)
                .attr("height", out.height)
                .attr('xmlns', "http://www.w3.org/2000/svg");
            return out;
        };

        // run
        var out;
        if (selection_is_svg) {
            out = height_width_attr(selection, margins);
            out.svg = selection;
        } else if (selection) {
            out = add_svg(fill_screen, selection, margins);
        } else {
            out = add_svg(fill_screen, d3.select('body').append('div'), margins);
        }
        if (out.height <= 0 || out.width <= 0) {
            console.warn("Container has invalid height or \
width. Try setting styles for height \
and width, or use the 'fill_screen' option.");
        }
        return out;
    };

    function resize_svg(selection, selection_is_svg, margins, fill_screen) {
        // returns null
        var resize = function(f, s, m) {
            if (f) {
                s.style('height', (window.innerHeight-margins.bottom)+'px');
                s.style('width', (window.innerWidth-margins.right)+'px');
            }
            var out = height_width_style(f, s, margins);
            out.svg = s.select('svg')
                .attr("width", out.width + m.left + m.right)
                .attr("height", out.height + m.top + m.bottom)
                .attr('xmlns', "http://www.w3.org/2000/svg");
            return out;
        };

        var out;
        if (selection_is_svg) {
            out = height_width_attr(selection, margins);
            out.svg = selection;
        } else if (selection) {
            out = resize(fill_screen, selection, margins);
        } else {
            out = resize(fill_screen, d3.select('body').append('div'), margins);
        }
        return out;
    };

    function load_css(css_path, callback) {
        var css = "";
        if (css_path) {
            d3.text(css_path, function(error, text) {
                if (error) {
                    console.warn(error);
                }
                css = text;
                callback(css);
            });
        }
        return false;
    };
    function update() {
        return 'omg yes';
    };
    function load_the_file(file, callback) {
        if (!file) {
            callback("No filename", null, file);
            return;
        }
        if (ends_with(file, 'json')) d3.json(file, function(e, d) { callback(e, d, file); });
        else if (ends_with(file, 'css')) d3.text(file, function(e, d) { callback(e, d, file); });
        else callback("Unrecognized file type", null, file);
        return;

        // definitions
        function ends_with(str, suffix) { return str.indexOf(suffix, str.length - suffix.length) !== -1; }
    };
    function load_files(files_to_load, final_callback) {
        // load multiple files asynchronously
        // Takes a list of objects: { file: a_filename.json, callback: a_callback_fn }
        var i = -1, remaining = files_to_load.length, callbacks = {};
        while (++i < files_to_load.length) {
            var this_file = files_to_load[i].file;
            callbacks[this_file] = files_to_load[i].callback;
            load_the_file(this_file,
                          function(e, d, file) {
                              callbacks[file](e, d);
                              if (!--remaining) final_callback();
                          });
        }
    };
    function scale_and_axes(x_domain, y_domain, width, height, options) {
	/* Generate generic x and y scales and axes for plots.

	   Returns object with keys x, y, x_axis, and y_axis.
	 */
	var o = set_options(options, {
	    padding: { left:0, right:0, top:0, bottom:0 },
	    x_is_log: false,
	    y_is_log: false,
	    y_ticks: null,
	    x_ticks: null,
	    x_nice: false,
	    y_nice: false,
	    x_tick_format: null,
	    y_tick_format: null }),
	out = {};
	
	// x scale
	if (o.x_is_log) out.x = d3.scale.log();
	else out.x = d3.scale.linear();
	out.x.range([o.padding.left, (width - o.padding.right)])
	    .domain(x_domain);

	// y scale
	if (o.y_is_log) out.y = d3.scale.log();
	else out.y = d3.scale.linear();
	out.y.range([(height - o.padding.bottom), 1+o.padding.top])
	    .domain(y_domain);

	// x axis
        out.x_axis = d3.svg.axis()
            .scale(out.x)
            .orient("bottom");
	if (o.x_nice) out.x_axis.nice();
	if (o.x_ticks) out.x_axis.ticks(o.x_ticks);
	if (o.x_tick_format) out.x_axis.tickFormat(x_tick_format);

	// y axis
        out.y_axis = d3.svg.axis()
            .scale(out.y)
            .orient("left");
	if (o.y_nice) out.y_axis.nice();
	if (o.y_ticks) out.y_axis.ticks(o.y_ticks);
	if (o.y_tick_format) out.y_axis.tickFormat(o.y_tick_format);

	return out;
    }
    function add_generic_axis(type, text, sel, axis, width, height, padding) {
	/* Append a generic axis to /sel/, a d3 selection of an svg element

	 */
	var cls, translate, label_x, label_y, dx, dy, label_rotate;
	if (type=='x') {
	    cls = "x axis";
	    translate = [0, height - padding.bottom];
	    label_x = width;
	    label_y = -6;
	    label_rotate = 0,
	    dx = 0,
	    dy = 0;
	} else if (type=='y') {
	    cls = "y axis";
	    translate = [padding.left, 0],
	    label_x = 0;
	    label_y = 6;
	    label_rotate = -90;
	    dx = 0;
	    dy = ".71em";
	} else console.warn('Bad axis type');
	
        return sel.append("g")
	    .attr("class", cls)
	    .attr("transform", "translate("+translate+")")
	    .call(axis)
	    .append("text")
	    .attr("class", "label")
	    .attr("transform", "rotate("+label_rotate+")")
	    .attr("x", label_x)
	    .attr("y", label_y)
	    .attr("dx", dx)
	    .attr("dy", dy)
	    .style("text-anchor", "end")
	    .text(text);
    }
});
