(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define(factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.
        root.visbio = factory();
    }
}(this, function () {
    //almond, and your modules will be inlined here

/**
 * almond 0.2.6 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('lib/d3',[],function () {
    if (window.d3===undefined) console.error('d3 is not loaded.');
    return window.d3;
});

define('vis/scaffold',["lib/d3"], function(d3) {
    return {
        set_options: set_options,
        setup_svg: setup_svg,
	resize_svg: resize_svg,
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
        /** resize_svg(selection, selection_is_svg, margins, fill_screen)

	 Returns object with new 'height' and 'width' keys.

	 */
        var out;
        if (selection_is_svg) {
            out = height_width_attr(selection, margins);
        } else if (selection) {
            out = resize(fill_screen, selection, margins);
	} else console.warn('No selection');
        return out;

	// definitions
        function resize(f, s, m) {
            if (f) {
                s.style('height', (window.innerHeight-m.top)+'px');
                s.style('width', (window.innerWidth-m.left)+'px');
                s.style("margin-left", m.left+"px");
                s.style("margin-top", m.top+"px");
            }
            var out = height_width_style(s, margins);
	    s.select("svg")
		.attr("height", out.height)
		.attr("width", out.width);
            return out;
        };
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
    function load_the_file(file, callback, value) {
        // if the value is specified, don't even need to do the ajax query
        if (value) {
            if (file) {
                console.log('file ' + file + ' overridden by value')
            }
            callback('', value, file);
            return;
        }
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
                          },
                          files_to_load[i].value);
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

	if (y_domain) {
	    // y scale
	    if (o.y_is_log) out.y = d3.scale.log();
	    else out.y = d3.scale.linear();
	    out.y.range([(height - o.padding.bottom), 1+o.padding.top])
		.domain(y_domain);
	} else out.y = null;

	if (x_domain) {
	    // x axis
            out.x_axis = d3.svg.axis()
		.scale(out.x)
		.orient("bottom");
	    if (o.x_nice) out.x_axis.nice();
	    if (o.x_ticks) out.x_axis.ticks(o.x_ticks);
	    if (o.x_tick_format) out.x_axis.tickFormat(o.x_tick_format);
	} else out.x = null;

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

define('vis/bar',["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            plot_padding: {left: 30, bottom: 30, top: 10, right: 10},
            selection_is_svg: false,
            fillScreen: false,
            x_axis_label: "",
            y_axis_label: "",
            x_data_label: '1',
            y_data_label: '2',
            x_shift: 4,
            data_is_object: true,
            color_scale: false,
            y_range: false,
            title: false,
            is_stacked: false,
            update_hook: false,
            css_path: '' });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // load the css
        o.ready = scaffold.load_css(o.css_path, function(css) {
            o.css = css;
            o.ready = true;
        });
        o.layers = [];

        return {
            update: update,
            collect_data: collect_data,
            update_hook: set_update_hook
        };

        // definitions
        function update_size() {
            out = scaffold.resize_svg(o.selection, o.selection_is_svg, o.margins, o.fill_screen);
            o.height = out.height;
            o.width = out.width;

            // o.x.range([0, o.width]);
            // o.y.range([o.height, 0]);

            // o.xAxiscale(x);
            // o.yAxiscale(y);

            // o.svg.select('.x.hist-axis')
            //     .attr("transform", "translate(0," + o.height + ")")
            //     .call(o.xAxis)
            //     .select('text')
            //     .attr("x", o.width);
            // o.svg.select('.y.hist-axis')
            //     .call(o.yAxis);

            // var bar_w = o.x(1) - o.diff - 8;

            // for (var i=0; i<json.length; i++) {
            //     selection.selectAll(".bar.bar"+String(i))
            //         .attr("transform", function(d) {
            //             return "translate(" + (x(d.x) + x_shift*i) + "," + y(d.y) + ")";
            //         })
            //         .select('rect')
            //         .attr("width", bar_w)
            //         .attr("height", function(d) { return height - y(d.y); });
            // }

            return this;
        };

        function update() {
            // check data
            var i=-1;
            while(++i < o.layers.length) {
                if (o.layers[i]===undefined) {
                    console.log('waiting for all indices');
                    return this;
                }
            }

            // clear the container and add again
            o.svg.select("#bar-container").remove();
            var container = o.svg.append("g").attr("id","bar-container");
            container.append("style")
                .attr('type', "text/css")
                .text(o.css);
            var sel = container.append("g")
                .attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");

            // find x domain
            var x_dom = [0, d3.max(o.layers, function(a) { return a.data.length; })],
            y_dom;
            if (o.y_range) {
                y_dom = o.y_range;
            } else {
                if (o.is_stacked) {
                    // sum up each data point
                    var i=-1, max = 0;
                    while (++i<o.layers[0].data.length) {
                        var j=-1, t = 0;
                        while (++j<o.layers.length) t += o.layers[j].data[i].value;
                        if (t > max) max = t;
                    }
                    y_dom = [
                        d3.min(o.layers, function(a) {
                            return d3.min(a.data, function(d) { return d.value; });
                        }),
                        max
                    ];
                } else {
                    y_dom = [
                        d3.min(o.layers, function(a) {
                            return d3.min(a.data, function(d) { return d.value; });
                        }),
                        d3.max(o.layers, function(a) {
                            return d3.max(a.data, function(d) { return d.value; });
                        })
                    ];
                }
            }

            var dom = {'y': y_dom,
                       'x': x_dom},
            out = scaffold.scale_and_axes(dom.x, dom.y,
                                          o.width, o.height,
                                          { padding: o.plot_padding,
                                            x_ticks: 0,
                                            y_ticks: 5,
                                            y_tick_format: d3.format("f") }),
            x = out.x, y = out.y;
            scaffold.add_generic_axis('x', o.x_axis_label, sel, out.x_axis,
                                      o.width, o.height, o.plot_padding);
            scaffold.add_generic_axis('y', o.y_axis_label, sel, out.y_axis,
                                      o.width, o.height, o.plot_padding);

            var diff = 0,
            bar_w = x(2) - x(1) - diff;

            for (var j = 0; j < o.layers.length; j++) {
                var cl = 'bar'+String(j);
                var bars = sel.selectAll("."+cl)
                    .data(o.layers[j].data)
                    .enter().append("g")
                    .attr("class", "bar "+cl);
                if (o.is_stacked) {
                    if (j > 0) {
                        bars.attr("transform", function(d, i) {
                            return "translate(" + x(i) + "," +
				(y(o.layers[j-1].data[i].value) - (y(dom.y[0]) - y(d.value))) + ")";
                        });
                    } else {
                        bars.attr("transform", function(d, i) {
                            return "translate(" + x(i) + "," +
                                y(d.value) + ")";
                        });
                    }
                } else {
                    bars.attr("transform", function(d, i) {
                        return "translate(" + (x(i) + o.x_shift*j) + "," +
			    y(d.value) + ")";
                    });
                }
                var rects = bars.append("rect")
                    .attr("x", 1)
                    .attr("width", bar_w)
                    .attr("height", function(d) { return y(dom.y[0]) - y(d.value); })
                    .style("fill", function(d) { if (o.color_scale) return o.color_scale(d.category);
                                                 else return null; });
            }

            if (o.title) {
                sel.append('text')
                    .attr('class', 'title')
                    .text(o.title)
                    .attr("transform", "translate("+o.width/2+",10)")
                    .attr("text-anchor", "middle");
            }

            if (o.update_hook) o.update_hook(sel);
            return this;
        };

        function collect_data(json, layer) {
            if (!o.ready) console.warn('Hasn\'t loaded css yet');
            if (o.data_is_object) {
                var objects = [];
                for (var key in json) objects.push({name: key, value: json[key]});
                o.layers[layer] = {data: objects};
            } else {
                o.layers[layer] = {data: json};
            }
            update();
            return this;
        };

        function set_update_hook(fn) {
            o.update_hook = fn;
            return this;
        };

    };
});

define('vis/box-and-whiskers',["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {    
	// Data should have elements {min: 0.0, max: 5.0, Q1: 2.0, Q2: 3.0, Q3: 4.0}

        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
	    plot_padding: {left: 30, bottom: 30, top: 10, right: 10},
            selection_is_svg: false,
            fillScreen: false,
            x_axis_label: "",
            y_axis_label: "",
            data_is_object: false,  // defines the data format, according to pandas.DataFrame.to_json()
            y_range: false,
            title: false,
            update_hook: false,
            css: '' });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // load the css
        o.ready = scaffold.load_css(o.css_path, function(css) {
            o.css = css;
            o.ready = true;
        });
        o.layers = [];

        return {
            update: update,
            collect_data: collect_data,
            update_hook: set_update_hook
        };

	// definitions
        function update_size() {
            return this;
        };

        function update() {
            // add the styles
            o.svg.append("style")
                .attr('type', "text/css")
                .text(o.css);

            var f = o.data,
	    padding = o.plot_padding,
	    width = o.width,
	    height = o.height;

	    // scale and axes
	    var x_domain = [-0.5, f.length-0.5],
	    y_domain = [d3.min(f, function (d) { return d.min; }),
                        d3.max(f, function (d) { return d.max; }) ],
	    out = scaffold.scale_and_axes(x_domain, y_domain,
					  width, height,
					  {padding: padding,
					   x_is_log: false,
					   y_is_log: false,
					   x_ticks: 4,
					   y_ticks: 20}),
	    x = out.x, y = out.y;
	    scaffold.add_generic_axis('x', 'x axis', o.svg, out.x_axis, width, height, padding);
	    scaffold.add_generic_axis('y', 'y axis', o.svg, out.y_axis, width, height, padding);
	    
            var line = d3.svg.line()
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1] });

            var g = o.svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(200, 80)")
                .attr("width", "300px")
                .attr("height", "200px");

            // add_legend(g, '10x', 'blue', 0);
            // add_legend(g, '100x', 'red', 1);
            // function add_legend(a, t, color, i) {
            //     var g = a.append("g")
            //             .attr("transform", "translate(0,"+i*40+")");
            //     g.append("text")
            //         .text(t)
            //         .attr("transform", "translate(30, 7)");
            //     g.append("circle")
            //         .attr("r", 10)
            //         .attr("style", "fill:"+color);
            // }

            // var g2 = g.append("g")
            //         .attr("transform", "translate(0,80)");
            // g2.append("path")
            //     .attr("class", "min-max-2")
            //     .attr("d", function (d) {
            //         return line([[0,0], [200, 0]]);
            //     })
            //     .style("stroke-width", "2px");
            // g2.append("path")
            //     .attr("class", "Q1-Q3-2")
            //     .attr("d", function (d) {
            //         return line([[60,0], [140, 0]]);
            //     })
            //     .style("stroke-width", "2px");
            // g2.append("path")
            //     .attr("class", "median-2")
            //     .attr("d", function (d) {
            //         return line([[90,0], [95, 0]]);
            //     })
            //     .style("stroke-width", "2px");
            // g2.append("text")
            //     .text("min")
            //     .attr("transform", "translate(-10,20)");
            // g2.append("text")
            //     .text("Q1")
            //     .attr("transform", "translate(50,20)");
            // g2.append("text")
            //     .text("med")
            //     .attr("transform", "translate(83,20)");
            // g2.append("text")
            //     .text("Q3")
            //     .attr("transform", "translate(130,20)");
            // g2.append("text")
            //     .text("max")
            //     .attr("transform", "translate(190,20)");

            o.svg.append('g')
                .selectAll("path")
                .data(f)
                .enter()
                .append("path")
                .attr("class", "min-max")
                .attr("d", function(d) {
                    return line([[x(d.rank), y(d.min)], [x(d.rank), y(d.max)]]);
                });

            // Q1 to Q3
            o.svg.append('g')
                .selectAll("path")
                .data(f)
                .enter()
                .append("path")
                .attr("class", "Q1-Q3")
                .attr("d", function (d) {
                    return line([[x(d.rank), y(d.Q1)], [x(d.rank), y(d.Q3)]]);
                });

            var m_l = 0;
            o.svg.append('g')
                .selectAll("path")
                .data(f)
                .enter()
                .append("path")
                .attr("class", "median")
                .attr("d", function (d) {
                    return line([[x(d.rank), y(d.median)-m_l], [x(d.rank), y(d.median)+m_l]]);
                });

            if (o.title) {
                o.svg.append('text')
                    .attr('class', 'title')
                    .text(o.title)
                    .attr("transform", "translate("+o.width/2+",10)")
                    .attr("text-anchor", "middle");
            }

            if (o.update_hook) o.update_hook(o.svg);
            return this;
        };

        function collect_data(json) {
            if (!o.ready) console.warn('Hasn\'t loaded css yet');
            // add ranks
            if (o.data_is_object) {
                var objects = [], i = -1, keys = Object.keys(json);
                while (++i < keys.length) {
                    var th = json[keys[i]];
                    th['rank'] = i;
                    objects.push(th);
                }
                o.data = objects;
            } else {
                var i = -1, objects = [];
                while (++i < json.length) {
                    var th = json[i];
                    th['rank'] = i;
                    objects.push(th);
                }
                o.data = objects;
            }
            update();
            return this;
        };

        function set_update_hook(fn) {
            o.update_hook = fn;
            return this;
        };
    };
});

define('vis/category-legend',["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
	    selection: d3.select("body"),
	    selection_is_svg: false,
            margins: {top: 20, right: 20, bottom: 30, left: 50},
            fill_screen: false,
            categories: [],
            css_path: "css/category-legend.css",
            squares: true });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // load the css
        o.ready = scaffold.load_css(o.css_path, function(css) {
            o.css = css;
            o.ready = true;
        });
        o.layers = [];

        o.color_scale = d3.scale.category20().domain(o.categories);

        // load the css
        d3.text(o.css_path, function(error, text) {
            if (error) {
                console.warn(error);
                o.css = "";
            } else {
                o.css = text;
            }
            update();
            return null;
        });

        return {
            update: update,
            get_scale: function () { return o.color_scale; }
        };

        function update() {
	    var categories = o.categories;

            // clear the container and add again
            o.selection.select("#legend-container").remove();
            var container = o.selection.append("g").attr("id","legend-container");
            container.append("style")
                .attr('type', "text/css")
                .text(o.css);
            var svg = container.append("g")
                .attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");


            // draw legend
            var radius = 10,
            legend_w = o.width;

            if (o.squares) {
                svg.selectAll('circle')
                    .data(o.categories)
                    .enter()
                    .append('rect')
                    .attr("class", "legend-circle")
                    .attr('width', radius*2)
                    .attr('height', radius*2)
                    .attr("transform", function(d, i) {
                        return "translate("+(legend_w/2 - radius)+","+(i*25+20)+")";
                    })
                    .attr('fill', function (d) { return o.color_scale(d); });
            } else {
                svg.selectAll('circle')
                    .data(o.categories)
                    .enter()
                    .append('circle')
                    .attr("class", "legend-circle")
                    .attr('r', radius)
                    .attr("cx", legend_w/2 - radius)
                    .attr("cy", function(d, i) { return i * 25+30; })
                    .attr('fill', function (d) { return o.color_scale(d); });
            }
            svg.selectAll('text')
                .data(o.categories)
                .enter()
                .append('text')
                .attr("class", "legend-text")
                .attr("text-anchor", "end")
                .text(function (d) { return d; })
                .attr('x', legend_w/2 - (3*radius))
                .attr('y', function(d, i) {
                    return (i*25)+30+radius/2;
                });

            return this;
        };

        function height_width(fillScreen, sel, margins) {
            if (fillScreen==true) {
                sel.style('height', (window.innerHeight-margins.bottom)+'px');
                sel.style('width', (window.innerWidth-margins.right)+'px');
            }
            var width = parseFloat(sel.style('width')) - margins.left - margins.right,
            height = parseFloat(sel.style('height')) - margins.top - margins.bottom;
            return {'width': width, 'height': height};
        };
    };
});

define('vis/data-menu',["./scaffold", "lib/d3"], function(scaffold, d3) {
    return function(options) {
        var o = scaffold.set_options(options, {
            selection: d3.select("body"),
            getdatafiles: null,
            datafiles: null,
            update_callback: null });

        // setup dropdown menu
        // Append menu if it doesn't exist
        var menu = o.selection.select('.data-menu');
        if (menu.empty()) {
            menu = o.selection.append('div')
                .attr('class','data-menu');
        }
        var select_sel = menu.append('form')
            .append('select').attr('class','dropdown-menu');
        // TODO move this somewhere sensible
        // menu.append('div').style('width','100%').text("Press 's' to freeze tooltip");

        if (o.getdatafiles) {
            if (o.datafiles) {
                console.warn('DataMenu: getdatafiles option overrides datafiles');
            }
            d3.json(o.getdatafiles, function(error, d) {
                // returns json object:  { data: [file0, file1, ...] }
                if (error) {
                    return console.warn(error);
                } else {
                    load_with_files(d.data, select_sel, o.update_callback, o.selection);
                }
                return null;
            });
        } else if (o.datafiles) {
            load_with_files(o.datafiles, select_sel, o.update_callback, o.selection);
        } else {
            console.warn('DataMenu: No datafiles given');
        }

        return { update: update };

        // definitions
        function load_with_files(files, select_sel, update_callback, selection) {

            //when it changes
            select_sel.node().addEventListener("change", function() {
                load_datafile(this.value, selection, update_callback);
            }, false);

            var file = files[0];

            update(files, select_sel);
            load_datafile(file, selection, update_callback);
        };
        function load_datafile(this_file, selection, callback) {
            scaffold.load_the_file(this_file, function(error, data) {
                if (error) {
                    return console.warn(error);
                    selection.append('error loading');
                    o.data = null;
                } else {
                    o.data = data;
                    if (callback) {
                        callback(data);
                    }
                }
            });
        };

        function update(list, select_sel) {
            // update select element with d3 selection /select_sel/ to have options
            // given by /list/
            // TODO remove paths from file list
            select_sel.selectAll(".menu-option")
                .data(list)
                .enter()
                .append('option')
                .attr('value', function (d) { return d; } )
                .text(function (d) { return d; } );
            // TODO set value to default_filename_index
            select_sel.node().focus();
        };

        function get_data() {
            return o.data;
        };
    };
});

define('vis/epistasis',["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 0, right: 0, bottom: 0, left: 0},
            padding: {left: 70, bottom: 60, top: 10, right: 40},
            selection_is_svg: false,
            fillScreen: false,
            x_axis_label: "",
            y_axis_label: "",
            x_data_label: '1',
            y_data_label: '2',
            x_shift: 4,
            data_is_object: true,
            color_scale: false,
            y_range: false,
            title: false,
            is_stacked: false,
            update_hook: false,
            css_path: '' });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // load the css
        o.ready = scaffold.load_css(o.css_path, function(css) {
            o.css = css;
            o.ready = true;
        });
        o.layers = [];

        return {
            update: update,
            collect_data: collect_data,
            update_size: update_size
        };

        // definitions

        o.data = [];
        o.selection = [];
        function update_size() {
            // var width = o.width,
            //     height = o.height;

            // var ns = o.selection.select("svg")
            //         .attr("width", width + o.margins.left + o.margins.right)
            //         .attr("height", height + o.margins.top + o.margins.bottom);
            // ns.select('g').attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");

            // o.x.range([1, width]);
            // o.y.range([height, 1]);

            // o.xAxis.scale(o.x);
            // o.yAxis.scale(o.y);

            // o.selection.select('.x.axis')
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(o.xAxis)
            //     .select('text')
            //     .attr("x", width);
            // o.selection.select('.y.axis')
            //     .call(o.yAxis);

            // o.selection.select(".points").selectAll('path')
            //     .attr("transform", function (d) {
            //         return "translate(" + o.x(d.f1) + "," + o.y(d.f2) + ")";
            //     });

            // o.selection.select(".trendline").select('path')
            //     .attr("d", o.line([[o.x(o.dom.x[0]), o.y(o.dom.y[0])],
            //                        [o.x(o.dom.x[1]), o.y(o.dom.y[1])]]));
            return this;
        }
        function update() {
            // load data
            var rxn_list = o.data.sorted_rxns,
                // name_function = function(x, i) { return {'name': x, 'index': i}; },
                name_function = function(x, i) { return {'name': 'enzyme '+(i+1), 'index': i}; },
                names = o.data.sorted_names.map(name_function),
                y_names = names,
                size = o.data.sorted_names.length,
                cases = o.data.cases,
                ep_type = 'ep_add',
                data = [];
            // generate box data
            for (var i=0; i<cases.length; i++) {
                var c = cases[i],
                    n = {};
                var index_1 = rxn_list.indexOf(c['rxn1']),
                    index_2 = rxn_list.indexOf(c['rxn2']),
                    p_1 = c['p1'],
                    p_2 = c['p2'],
                    min_max_diff = c['min_max_diff'];
                if (index_1==-1) console.warn('no match for ' + c['rxn1']);
                if (index_2==-1) console.warn('no match for ' + c['rxn2']);
                if (index_1 < index_2) {
                    n['index_x'] = index_1;
                    n['index_y'] = index_2; // y index start at 2nd entry
                    n['p_x'] = p_1;
                    n['p_y'] = p_2;
                } else {
                    n['index_x'] = index_2;
                    n['index_y'] = index_1;
                    n['p_x'] = p_2;
                    n['p_y'] = p_1;
                }
                n['ep'] = c[ep_type];
                n['empty'] = false;
                n['min_max_diff'] = min_max_diff;
                data.push(n);
            }

            // clear the container and add again
            o.svg.select("#container").remove();
            var sel = o.svg.append("g").attr("id","container")
                .attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");

	    // size and scale
            var box_s = d3.min([Math.floor((o.width - o.padding.left -
					    o.padding.right)/size),
				Math.floor((o.height - o.padding.top -
					    o.padding.bottom)/size)]),
		rect_color = d3.scale.linear()
                    .domain([d3.min(data, function(x) {return x.ep;}),
                             0,
                             d3.max(data, function(x) {return x.ep;})])
                    .range(["#AF8DC3", "#F7F7F7", "#7FBF7B"]),
                rect_stroke = d3.scale.linear()
                    .domain([d3.min(data, function(x) {return x.min_max_diff;}),
                             d3.max(data, function(x) {return x.min_max_diff;})])
                    .range([1,4]);    // use .range([1,1]) for constant 1px borders

	    // add defs
	    o.svg.select("defs").remove();
            var defs = o.svg.append("defs");
	    defs.append("style")
                .attr('type', "text/css")
                .text(o.css);
            defs.append('clipPath')
                .attr('id', 'clip-top')
                .append('path')
                .attr('d', 'M 0 0 L 0 '+box_s+' L '+box_s+' 0 L 0 0');
            defs.append('clipPath')
                .attr('id', 'clip-bottom')
                .append('path')
                .attr('d', 'M 0 '+box_s+' L '+box_s+' 0 L '+box_s+' '+box_s+' L 0 '+box_s);

            // draw boxes
            var axis_disp = {'x': o.padding.left, 'y': o.padding.top};

            // make empty rects
            for (var i=0, empty_data = []; i<size; i++) {
                empty_data.push({ empty: true,
                                  index_x: i,
                                  index_y: i });
            }
            var empty = sel.append("g")
                    .attr("transform", "translate(" + o.padding.left + "," + o.padding.top + ")")
                    .selectAll('.cell')
                    .data(empty_data);
            empty.enter()
                .append('g')
                .attr('class', 'cell')
                .call(make_rect);
            // update
            empty.call(update_rect);

            // make filled rects
            var cells = sel.append("g")
                    .attr("transform", "translate(" + o.padding.left + "," + o.padding.top + ")")
                    .selectAll('.cell')
                    .data(data);
            cells.enter()
                .append('g')
                .attr('class', 'cell')
                .call(make_rect)
                .call(make_circles);
            // update
            cells.call(update_rect);

            // make rect outlines
            var empty_outline = sel.append("g")
                    .attr("transform", "translate(" + o.padding.left + "," + o.padding.top + ")")
                    .selectAll('.cell-outline')
                    .data(empty_data);
            empty_outline.enter()
                .append('g')
                .attr('class', 'cell-outline')
                .call(make_rect_outline);
            // update
            empty_outline.call(update_rect);
            var outline = sel.append("g")
                    .attr("transform", "translate(" + o.padding.left + "," + o.padding.top + ")")
                    .selectAll('.cell-outline')
                    .data(data);
            outline.enter()
                .append('g')
                .attr('class', 'cell-outline')
                .call(make_rect_outline);
            // update
            outline.call(update_rect);


            // make x labels
            var x_labels = sel.append('g')
                    .attr('class','labels')
                    .selectAll('.x-label')
                    .data(names);
            x_labels.enter()
                .append('text')
                .attr('class','x-label')
                .text(function (d) { return d.name; });
            x_labels.attr('transform', function(d) { return 'translate(' +
                                                     (d.index*box_s + box_s/3 + o.padding.left) + ',' +
                                                     (o.height - o.padding.bottom) + ') '+
                                                     'rotate(' + 45 + ')'; });

            // make xylabels
            var y_labels = sel.append('g')
                    .attr('class','labels')
                    .selectAll('.y-label')
                    .data(y_names);
            y_labels.enter()
                .append('text')
                .attr('class','y-label')
                .attr('text-anchor', 'end')
                .text(function (d) { return d.name; });
            y_labels.attr('transform', function(d) { return 'translate(' +
                                                     (o.padding.left - 3) + ',' +
                                                     (d.index*box_s + box_s/2 + o.padding.top) + ') '+
                                                     'rotate(' + 0 + ')'; });

            // make flux arrows
            var g = sel.append('g')
                    .attr('class', 'flux-arrows')
                    .attr('transform', 'translate('+(o.width/2+80)+','+(o.height/2-80)+')rotate(45)');
            g.append('text')
                .text('High flux')
                .attr('transform', 'translate('+(-(o.width-o.padding.left-o.padding.right)/2+50)+',0)');
            g.append('text')
                .text('Low flux')
                .attr('transform', 'translate('+((o.width-o.padding.left-o.padding.right)/2-50)+',0)');

            // make legend
            var legend = sel.append('g')
                    .attr('class', 'legend')
                    .attr('transform', 'translate('+(o.width-140)+','+(230)+')');
            var range = rect_color.range();
            var gradient = sel.append('defs')
                    .append('linearGradient')
                    .attr('id', 'gradient');
            gradient.append('stop')
                .attr('stop-color', range[0])
                .attr('offset', '0%');
            gradient.append('stop')
                .attr('stop-color', range[1])
                .attr('offset', '50%');
            gradient.append('stop')
                .attr('stop-color', range[2])
                .attr('offset', '100%');
            legend.append('rect')
                .attr('class', 'legend-gradient')
                .attr('width', 150)
                .attr('height', 30)
                .attr('fill', 'url(#gradient)')
                .attr('transform', 'rotate(-90)')
                .style('stroke', '#333')
                .style('stroke-width', '2px');
            legend.append('text').text('positive')
                .attr('transform', 'translate(40, -140)');
            legend.append('text').text('negative')
                .attr('transform', 'translate(40, 0)');

            return this;

            // update: definitions

            function make_rect(s) {
                s.append('rect')
                    .attr('class', 'square')
                    .attr('width', box_s)
                    .attr('height', box_s)
                    .attr('fill', function (d) {
                        if (d.empty==true) return '#fff';
                        else return rect_color(d.ep);
                    });
                s.append('line')
                    .attr('class', 'divider')
                // .attr('stroke-dasharray', '2')
                    .attr('x1', 0)
                    .attr('y1', box_s)
                    .attr('x2', box_s)
                    .attr('y2', 0);
            };
            function make_rect_outline(s) {
                s.append('rect')
                    .attr('class', 'square-outline')
                    .attr('width', function(d) {
                        if (d.empty==true) return box_s;
                        else return box_s - Math.floor(rect_stroke(d.min_max_diff)) + 1;
                    })
                    .attr('height', function(d) {
                        if (d.empty==true) return box_s;
                        else return box_s - Math.floor(rect_stroke(d.min_max_diff)) + 1;
                    })
                    .attr('transform', function(d) {
                        if (d.empty==true) return 'translate(0,0)';
                        else return 'translate(' + [Math.floor(rect_stroke(d.min_max_diff))/2 - 0.5,
                                                    Math.floor(rect_stroke(d.min_max_diff))/2 - 0.5] +
                            ')';
                    })
                    .style('stroke-width', function(d) {
                        if (d.empty==true) return 1;
                        else return Math.floor(rect_stroke(d.min_max_diff)); });
            };
            function update_rect(s) {
                // update
                s.attr('transform', function(d) { return 'translate(' +
                                                  (d.index_x*box_s) + ',' +
                                                  (d.index_y*box_s) + ')'; });
            }
            function make_circles(s) {
                var rad = Math.floor(box_s/4);
                s.append('g')
                    // .attr('height', box_s)
                    // .attr('width', box_s)
                    .attr('clip-path', 'url(#clip-top)')
                    .append('circle')
                    .attr('class', 'circle y-circle')
                    .attr('r', rad)
                    .attr('transform', function(d) {
                        // d.p2/100 = rad^2/2*(Math.PI/180*angle - Math.sin(angle)) / (Math.PI*rad^2)
                        // cos(angle/2) = d1 / rad
                        // d1 = sqrt(m_x^2 + m_y^2)

                        // groso.approximation
                        var dir = ((d.p_y-50.0)*rad/50.0) > 0,
                            m = Math.sqrt( Math.pow( ((d.p_y-50.0)*rad/50.0) , 2) / 2.0 );
                        if (dir) m = m * -1;
                        return 'translate('+(box_s/2+m)+','+(box_s/2+m)+')';
                    });
                s.append('g')
                    // .attr('height', box_s)
                    // .attr('width', box_s)
                    .attr('clip-path', 'url(#clip-bottom)')
                    .append('circle')
                    .attr('class', 'circle x-circle')
                    .attr('r', rad)
                    .attr('transform', function(d) {
                        // groso.approximation
                        var dir = ((d.p_x-50.0)*rad/50.0) > 0,
                            m = Math.sqrt( Math.pow( ((d.p_x-50.0)*rad/50.0) , 2) / 2.0 );
                        if (dir) m = m * -1;
                        return 'translate('+(box_s/2-m)+','+(box_s/2-m)+')';
                    });
            }
        }
        function collect_data(json) {
            if (!o.ready) console.warn('Hasn\'t loaded css yet');
            o.data = json;
            update();
            return this;
        }
    };
});

/**
 * vkBeautify - javascript plugin to pretty-print or minify text in XML, JSON, CSS and SQL formats.
 *
 * Version - 0.99.00.beta
 * Copyright (c) 2012 Vadim Kiryukhin
 * vkiryukhin @ gmail.com
 * http://www.eslinstructor.net/vkbeautify/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 *   Pretty print
 *
 *        vkbeautify.xml(text [,indent_pattern]);
 *        vkbeautify.json(text [,indent_pattern]);
 *        vkbeautify.css(text [,indent_pattern]);
 *        vkbeautify.sql(text [,indent_pattern]);
 *
 *        @text - String; text to beatufy;
 *        @indent_pattern - Integer | String;
 *                Integer:  number of white spaces;
 *                String:   character string to visualize indentation ( can also be a set of white spaces )
 *   Minify
 *
 *        vkbeautify.xmlmin(text [,preserve_comments]);
 *        vkbeautify.jsonmin(text);
 *        vkbeautify.cssmin(text [,preserve_comments]);
 *        vkbeautify.sqlmin(text);
 *
 *        @text - String; text to minify;
 *        @preserve_comments - Bool; [optional];
 *                Set this flag to true to prevent removing comments from @text ( minxml and mincss functions only. )
 *
 *   Examples:
 *        vkbeautify.xml(text); // pretty print XML
 *        vkbeautify.json(text, 4 ); // pretty print JSON
 *        vkbeautify.css(text, '. . . .'); // pretty print CSS
 *        vkbeautify.sql(text, '----'); // pretty print SQL
 *
 *        vkbeautify.xmlmin(text, true);// minify XML, preserve comments
 *        vkbeautify.jsonmin(text);// minify JSON
 *        vkbeautify.cssmin(text);// minify CSS, remove comments ( default )
 *        vkbeautify.sqlmin(text);// minify SQL
 *
 */

define('lib/vkbeautify',[],function() {

    function createShiftArr(step) {

        var space = '    ';

        if ( isNaN(parseInt(step)) ) {  // argument is string
            space = step;
        } else { // argument is integer
            switch(step) {
            case 1: space = ' '; break;
            case 2: space = '  '; break;
            case 3: space = '   '; break;
            case 4: space = '    '; break;
            case 5: space = '     '; break;
            case 6: space = '      '; break;
            case 7: space = '       '; break;
            case 8: space = '        '; break;
            case 9: space = '         '; break;
            case 10: space = '          '; break;
            case 11: space = '           '; break;
            case 12: space = '            '; break;
            }
        }

        var shift = ['\n']; // array of shifts
        for(ix=0;ix<100;ix++){
            shift.push(shift[ix]+space);
        }
        return shift;
    }

    function vkbeautify(){
        this.step = '    '; // 4 spaces
        this.shift = createShiftArr(this.step);
    };

    vkbeautify.prototype.xml = function(text,step) {

        var ar = text.replace(/>\s{0,}</g,"><")
                .replace(/</g,"~::~<")
                .replace(/\s*xmlns\:/g,"~::~xmlns:")
                .replace(/\s*xmlns\=/g,"~::~xmlns=")
                .split('~::~'),
            len = ar.length,
            inComment = false,
            deep = 0,
            str = '',
            ix = 0,
            shift = step ? createShiftArr(step) : this.shift;

        for(ix=0;ix<len;ix++) {
            // start comment or <![CDATA[...]]> or <!DOCTYPE //
            if(ar[ix].search(/<!/) > -1) {
                str += shift[deep]+ar[ix];
                inComment = true;
                // end comment  or <![CDATA[...]]> //
                if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) {
                    inComment = false;
                }
            } else
                // end comment  or <![CDATA[...]]> //
                if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
                    str += ar[ix];
                    inComment = false;
                } else
                    // <elm></elm> //
                    if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
                        /^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
                        str += ar[ix];
                        if(!inComment) deep--;
                    } else
                        // <elm> //
                        if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
                            str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
                        } else
                            // <elm>...</elm> //
                            if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
                                str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
                            } else
                                // </elm> //
                                if(ar[ix].search(/<\//) > -1) {
                                    str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
                                } else
                                    // <elm/> //
                                    if(ar[ix].search(/\/>/) > -1 ) {
                                        str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
                                    } else
                                        // <? xml ... ?> //
                                        if(ar[ix].search(/<\?/) > -1) {
                                            str += shift[deep]+ar[ix];
                                        } else
                                            // xmlns //
                                            if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) {
                                                str += shift[deep]+ar[ix];
                                            }

            else {
                str += ar[ix];
            }
        }

        return  (str[0] == '\n') ? str.slice(1) : str;
    }

    vkbeautify.prototype.json = function(text,step) {

        var step = step ? step : this.step;

        if (typeof JSON === 'undefined' ) return text;

        if ( typeof text === "string" ) return JSON.stringify(JSON.parse(text), null, step);
        if ( typeof text === "object" ) return JSON.stringify(text, null, step);

        return text; // text is not string nor object
    }

    vkbeautify.prototype.css = function(text, step) {

        var ar = text.replace(/\s{1,}/g,' ')
                .replace(/\{/g,"{~::~")
                .replace(/\}/g,"~::~}~::~")
                .replace(/\;/g,";~::~")
                .replace(/\/\*/g,"~::~/*")
                .replace(/\*\//g,"*/~::~")
                .replace(/~::~\s{0,}~::~/g,"~::~")
                .split('~::~'),
            len = ar.length,
            deep = 0,
            str = '',
            ix = 0,
            shift = step ? createShiftArr(step) : this.shift;

        for(ix=0;ix<len;ix++) {

            if( /\{/.exec(ar[ix]))  {
                str += shift[deep++]+ar[ix];
            } else
                if( /\}/.exec(ar[ix]))  {
                    str += shift[--deep]+ar[ix];
                } else
                    if( /\*\\/.exec(ar[ix]))  {
                        str += shift[deep]+ar[ix];
                    }
            else {
                str += shift[deep]+ar[ix];
            }
        }
        return str.replace(/^\n{1,}/,'');
    }

    //----------------------------------------------------------------------------

    function isSubquery(str, parenthesisLevel) {
        return  parenthesisLevel - (str.replace(/\(/g,'').length - str.replace(/\)/g,'').length )
    }

    function split_sql(str, tab) {

        return str.replace(/\s{1,}/g," ")

            .replace(/ AND /ig,"~::~"+tab+tab+"AND ")
            .replace(/ BETWEEN /ig,"~::~"+tab+"BETWEEN ")
            .replace(/ CASE /ig,"~::~"+tab+"CASE ")
            .replace(/ ELSE /ig,"~::~"+tab+"ELSE ")
            .replace(/ END /ig,"~::~"+tab+"END ")
            .replace(/ FROM /ig,"~::~FROM ")
            .replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ")
            .replace(/ HAVING /ig,"~::~HAVING ")
        //.replace(/ SET /ig," SET~::~")
            .replace(/ IN /ig," IN ")

            .replace(/ JOIN /ig,"~::~JOIN ")
            .replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ")
            .replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ")
            .replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ")
            .replace(/ RIGHT~::~{1,}JOIN /ig,"~::~RIGHT JOIN ")

            .replace(/ ON /ig,"~::~"+tab+"ON ")
            .replace(/ OR /ig,"~::~"+tab+tab+"OR ")
            .replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ")
            .replace(/ OVER /ig,"~::~"+tab+"OVER ")

            .replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ")
            .replace(/\)\s{0,}SELECT /ig,")~::~SELECT ")

            .replace(/ THEN /ig," THEN~::~"+tab+"")
            .replace(/ UNION /ig,"~::~UNION~::~")
            .replace(/ USING /ig,"~::~USING ")
            .replace(/ WHEN /ig,"~::~"+tab+"WHEN ")
            .replace(/ WHERE /ig,"~::~WHERE ")
            .replace(/ WITH /ig,"~::~WITH ")

        //.replace(/\,\s{0,}\(/ig,",~::~( ")
        //.replace(/\,/ig,",~::~"+tab+tab+"")

            .replace(/ ALL /ig," ALL ")
            .replace(/ AS /ig," AS ")
            .replace(/ ASC /ig," ASC ")
            .replace(/ DESC /ig," DESC ")
            .replace(/ DISTINCT /ig," DISTINCT ")
            .replace(/ EXISTS /ig," EXISTS ")
            .replace(/ NOT /ig," NOT ")
            .replace(/ NULL /ig," NULL ")
            .replace(/ LIKE /ig," LIKE ")
            .replace(/\s{0,}SELECT /ig,"SELECT ")
            .replace(/\s{0,}UPDATE /ig,"UPDATE ")
            .replace(/ SET /ig," SET ")

            .replace(/~::~{1,}/g,"~::~")
            .split('~::~');
    }

    vkbeautify.prototype.sql = function(text,step) {

        var ar_by_quote = text.replace(/\s{1,}/g," ")
                .replace(/\'/ig,"~::~\'")
                .split('~::~'),
            len = ar_by_quote.length,
            ar = [],
            deep = 0,
            tab = this.step,//+this.step,
            inComment = true,
            inQuote = false,
            parenthesisLevel = 0,
            str = '',
            ix = 0,
            shift = step ? createShiftArr(step) : this.shift;;

        for(ix=0;ix<len;ix++) {
            if(ix%2) {
                ar = ar.concat(ar_by_quote[ix]);
            } else {
                ar = ar.concat(split_sql(ar_by_quote[ix], tab) );
            }
        }

        len = ar.length;
        for(ix=0;ix<len;ix++) {

            parenthesisLevel = isSubquery(ar[ix], parenthesisLevel);

            if( /\s{0,}\s{0,}SELECT\s{0,}/.exec(ar[ix]))  {
                ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"")
            }

            if( /\s{0,}\s{0,}SET\s{0,}/.exec(ar[ix]))  {
                ar[ix] = ar[ix].replace(/\,/g,",\n"+tab+tab+"")
            }

            if( /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(ar[ix]))  {
                deep++;
                str += shift[deep]+ar[ix];
            } else
                if( /\'/.exec(ar[ix]) )  {
                    if(parenthesisLevel<1 && deep) {
                        deep--;
                    }
                    str += ar[ix];
                }
            else  {
                str += shift[deep]+ar[ix];
                if(parenthesisLevel<1 && deep) {
                    deep--;
                }
            }
            var junk = 0;
        }

        str = str.replace(/^\n{1,}/,'').replace(/\n{1,}/g,"\n");
        return str;
    }


    vkbeautify.prototype.xmlmin = function(text, preserveComments) {

        var str = preserveComments ? text
                : text.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"")
                .replace(/[ \r\n\t]{1,}xmlns/g, ' xmlns');
        return  str.replace(/>\s{0,}</g,"><");
    }

    vkbeautify.prototype.jsonmin = function(text) {

        if (typeof JSON === 'undefined' ) return text;

        return JSON.stringify(JSON.parse(text), null, 0);

    }

    vkbeautify.prototype.cssmin = function(text, preserveComments) {

        var str = preserveComments ? text
                : text.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"") ;

        return str.replace(/\s{1,}/g,' ')
            .replace(/\{\s{1,}/g,"{")
            .replace(/\}\s{1,}/g,"}")
            .replace(/\;\s{1,}/g,";")
            .replace(/\/\*\s{1,}/g,"/*")
            .replace(/\*\/\s{1,}/g,"*/");
    }

    vkbeautify.prototype.sqlmin = function(text) {
        return text.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");
    }

    return new vkbeautify();

});

define('vis/export-svg',["lib/d3", "lib/vkbeautify"], function (d3, vkbeautify) {
    return function() {
        var m = {};
        m.utf8_to_b64 = function(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        };
        m.download = function(name, selection, do_beautify) {
            var a = document.createElement('a'), xml, ev;
            a.download = name+'.svg'; // file name
            xml = (new XMLSerializer()).serializeToString(d3.select(selection).node()); // convert node to xml string
            if (do_beautify) xml = vkbeautify.xml(xml);
            xml = '<?xml version="1.0" encoding="utf-8"?>\n \
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n \
            "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + xml;
            a.setAttribute("href-lang", "image/svg+xml");
            a.href = 'data:image/svg+xml;base64,' + m.utf8_to_b64(xml); // create data uri
            // <a> constructed, simulate mouse click on it
            ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(ev);
        };
        return {'download': m.download};
    };
});

define('vis/histogram',["./scaffold", "lib/d3"], function (scaffold, d3) {
    /** histogram.js

     (c) Zachary King 2013

     TODO add update_size function.
     
     */
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            padding: {left: 30, bottom: 30, top: 10, right: 10},
            selection: d3.select('body').append('div'),
            selection_is_svg: false,
            fill_screen: false,
            title: false,
            update_hook: false,
            css_path: '',
            x_axis_label: "",
            y_axis_label: "",
            x_data_label: '1',
            y_data_label: '2',
            x_shift: 10 });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // load the css
        o.ready = scaffold.load_css(o.css_path, function(css) {
            o.css = css;
            o.ready = true;
        });
        o.layers = [];

        return {
            update: update,
            collect_data: collect_data
        };

        // definitions
        function update() {
            // reset defs
            o.svg.select("defs").remove();
            o.svg.append("defs").append("style")
                .attr('type', "text/css")
                .text(o.css);

            // clear the container and add again
            o.svg.select("#scatter-container").remove();
            var container = o.svg.append("g").attr("id","scatter-container");
            o.sel = container.attr("transform", "translate(" + o.margins.left + "," + 
				   o.margins.top + ")");

            var layers = o.layers,
                height = o.height, width = o.width;

            // check data
            var i=-1;
            while(++i < layers.length) {
                if (layers[i]===undefined) {
                    console.log('waiting for all indices');
                    return this;
                }
            }

            // find x domain
            var x_dom = [
                d3.min(layers, function(a) {
                    return d3.min(a, function(d) { return d.x; });
                }),
                d3.max(layers, function(a) {
                    return d3.max(a, function(d) { return d.x; });
                })
            ];
            o.dom = {'x': x_dom};

            // generate x scale
	    var x_is_log = false, y_is_log = false,
		out = scaffold.scale_and_axes(o.dom.x, null, width, height,
                                              { padding: o.padding,
                                                x_is_log: x_is_log,
                                                x_ticks: 15});
            o.x = out.x;

            // Generate a histogram using twenty uniformly-spaced bins.
            var layout = [],
                hist = d3.layout.histogram()
                    .value(function (d) { return d.x; })
                    .bins(o.x.ticks(15));
            layout = layers.map(function(j) { return hist(j); });

            var y_dom = [
                0,
                d3.max(layout, function (a) {
                    return d3.max(a, function(d) { return d.y; });
                })
            ];
            o.dom.y = y_dom;

            // add scale and axes
            out = scaffold.scale_and_axes(o.dom.x, o.dom.y, width, height,
                                          { padding: o.padding,
                                            x_is_log: x_is_log,
                                            y_is_log: y_is_log,
                                            x_ticks: 15});
            o.x = out.x, o.y = out.y;
            scaffold.add_generic_axis('x', o.x_axis_label, o.sel, out.x_axis, width, height, o.padding);
            scaffold.add_generic_axis('y', o.y_axis_label, o.sel, out.y_axis, width, height, o.padding);

	    console.log(o.dom.x, o.dom.y);

            o.x_size_scale = d3.scale.linear()
                .range([0, width])
                .domain([0, o.dom.x[1] - o.dom.x[0]]);

            o.xAxis = d3.svg.axis()
                .scale(o.x)
                .orient("bottom")
                .ticks(15);         //TODO make sure this matches x_ticks

            o.yAxis = d3.svg.axis()
                .scale(o.y)
                .orient("left")
                .ticks(20);


            var legend = o.sel.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (width-300) + ", 80)")
                    .attr("width", "300px")
                    .attr("height", "200px");

            o.diff = 8;
            o.hist_dx = layout[0][0].dx;
            var bar_w = o.x_size_scale(o.hist_dx) - o.diff - o.x_shift;
	    console.log(o.y);

            for (var j=0; j<layout.length; j++) {
                var cl = 'hist-bar'+String(j);
                var bars = o.sel.selectAll("."+cl)
                        .data(layout[j])
                        .enter().append("g")
                        .attr("class", "hist-bar "+cl)
                        .attr("transform", function(d) { return "translate(" + (o.x(d.x)+o.x_shift*j-bar_w/2) + "," + o.y(d.y) + ")"; });
                bars.append("rect")
                    .attr("x", 1)
                    .attr("width", bar_w)
                    .attr("height", function(d) { return o.y(o.dom.y[0]) - o.y(d.y); });
                // add_legend(legend, layers[j].options.name, j, 'legend '+cl);
            }

            return this;

	    // definitions
            function add_legend(a, t, i, cl) {
                var g = a.append("g")
                        .attr("transform", "translate(0,"+i*40+")");
                g.append("text")
                    .text(t)
                    .attr("transform", "translate(30, 14)");
                g.append("rect")
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("class", cl);
            }
        }
        function update_size() {
            // // TODO inherit this function
            // var o = o.height_width(o.fillScreen, o.selection, o.margins);
            // var height = o.height, width = o.width;

            // var ns = o.selection.select("svg")
            //         .attr("width", width + o.margins.left + o.margins.right)
            //         .attr("height", height + o.margins.top + o.margins.bottom);
            // ns.select('g').attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");

            // o.x.range([0, width]);
            // o.y.range([height, 0]);

            // o.x_size_scale.range([0, width]);

            // o.xAxis.scale(o.x);
            // o.yAxis.scale(o.y);

            // o.selection.select('.x.hist-axis')
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(o.xAxis)
            //     .select('text')
            //     .attr("x", width);
            // o.selection.select('.y.hist-axis')
            //     .call(o.yAxis);

            // var bar_w = o.x_size_scale(o.hist_dx) - o.diff - 8;

            // for (var i=0; i<s.json.length; i++) {
            //     o.selection.selectAll(".hist-bar.hist-bar"+String(i))
            //         .attr("transform", function(d) {
            //             return "translate(" + (o.x(d.x) + o.x_shift*i) + "," + o.y(d.y) + ")";
            //         })
            //         .select('rect')
            //         .attr("width", bar_w)
            //         .attr("height", function(d) { return height - o.y(d.y); });
            // }

            // d3.select(".legend")     //TODO options for legend location
            //     .attr("transform", "translate(" + (width-300) + ", 80)");

            // return this;
        };
        function collect_data(json, layer) {
            o.layers[layer] = json.data;
            update();
	    return this;
        };
    };
});

define('vis/resize',[],function () {
    return { on_resize: on_resize };

    function on_resize(callback, interval) {
        if (typeof interval === 'undefined') interval = 1000;
        window.do_resize = false;
        window.onresize = function(event) {
            window.do_resize = true;
        };
        window.setInterval( function () {
            if (window.do_resize) {
                callback();
                window.do_resize = false;
            }
        }, interval);
    };
});

define('vis/scatter',["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
	    padding: {left: 30, bottom: 30, top: 10, right: 10},
            selection_is_svg: false,
	    selection: d3.select('body'),
            fillScreen: false,
            // data_is_object: true,
            title: false,
            update_hook: false,
            css_path: '',
	    tooltip: false,
	    x_is_log: true,
	    y_is_log: true });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // load the css
        o.ready = scaffold.load_css(o.css_path, function(css) {
            o.css = css;
            o.ready = true;
        });
        o.layers = [];

        return {
            update: update,
	    update_size: update_size,
            collect_data: collect_data
        };

        // definitions
        function update_size() {
	    // update size
            var out = scaffold.resize_svg(o.selection, o.selection_is_svg,
					  o.margins, o.fill_screen);
            o.height = out.height;
            o.width = out.width;

	    // update scales and axes
	    out = scaffold.scale_and_axes(o.dom.x, o.dom.y, o.width, o.height,
					      { padding: o.padding,
						x_is_log: o.x_is_log,
						y_is_log: o.y_is_log });
	    o.x = out.x, o.y = out.y, o.x_axis = out.x_axis, o.y_axis = out.y_axis;

	    // redraw axes
            o.sel.select('.x.axis').remove();
            o.sel.select('.y.axis').remove();
	    scaffold.add_generic_axis('x', o.x_axis_label, o.sel, o.x_axis, o.width,
				      o.height, o.padding);
	    scaffold.add_generic_axis('y', o.y_axis_label, o.sel, o.y_axis, o.width,
				      o.height, o.padding);

	    // update points
            o.sel.select(".points").selectAll('path')
                .attr("transform", function (d) {
                    return "translate(" + o.x(d.f1) + "," + o.y(d.f2) + ")";
                });

	    // update trendline
            o.sel.select(".trendline").select('path')
                .attr("d", o.line([[o.x(o.dom.x[0]), o.y(o.dom.y[0])],
	    			   [o.x(o.dom.x[1]), o.y(o.dom.y[1])]]));
	    return this;
        }
        function update() {
	    // reset defs
	    o.svg.select("defs").remove();
            o.svg.append("defs").append("style")
                .attr('type', "text/css")
                .text(o.css);

            // clear the container and add again
            o.svg.select("#scatter-container").remove();
            var container = o.svg.append("g").attr("id","scatter-container");
            o.sel = container.attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");

	    var height = o.height, width = o.width,
	    padding = o.padding;

            // assuming only a single layer for now
            // TODO allow for multiple layers
            if (o.layers.length==0) return null;
            var layer_0 = o.layers[0];
            if (layer_0.x===undefined || layer_0.y===undefined) {
		console.log("data hasn't finished loading");
		return null;
	    }

            var name_x, name_y, f = [], pushed = [];
            for (var i=0; i<layer_0.x.length; i++) {
                name_x = layer_0.x[i].name;
                for (var j=0; j<layer_0.y.length; j++) {
                    name_y = layer_0.y[j].name;
                    if (name_x == name_y && pushed.indexOf(name_x)==-1) {
                        f.push({'name': name_x, 'f1': layer_0.x[i].x, 'f2': layer_0.y[j].x});
                        pushed.push(name_x);
                    }
                }
            }

            // set zero values to min
            var f1nz = f.map(function (d) { // f1 not zero
                if (d.f1>0) { return d.f1; }
                else { return null; }
            });
            var f2nz = f.map(function (d) { // f2 not zero
                if (d.f2>0) { return d.f2; }
                else { return null; }
            });

            var equal_axes = false;
            if (equal_axes) {
                var a_dom = [d3.min([d3.min(f1nz), d3.min(f2nz)]) / 2,
                             d3.max([d3.max(f1nz), d3.max(f2nz)])];
                o.dom = {'x': a_dom, 'y': a_dom};
            }
            else {
                o.dom = {'x': [d3.min(f1nz) / 2,
                               d3.max(f1nz)],
                         'y': [d3.min(f2nz) / 2,
                               d3.max(f2nz)]};
            }

            f = f.map(function (d) {
                if (d.f1 < o.dom.x[0]) { d.f1 = o.dom.x[0];  }
                if (d.f2 < o.dom.y[0]) { d.f2 = o.dom.y[0];  }
                return d;
            });

	    // add scale and axes
	    var out = scaffold.scale_and_axes(o.dom.x, o.dom.y, width, height,
					      { padding: padding,
						x_is_log: o.x_is_log,
						y_is_log: o.y_is_log });
	    o.x = out.x, o.y = out.y, o.x_axis = out.x_axis, o.y_axis = out.y_axis;
	    scaffold.add_generic_axis('x', o.x_axis_label, o.sel, out.x_axis, width, height, padding);
	    scaffold.add_generic_axis('y', o.y_axis_label, o.sel, out.y_axis, width, height, padding);
	   
            o.line = d3.svg.line()
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; });

            var g = o.sel.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(200, 80)")
                .attr("width", "300px")
                .attr("height", "200px");

            o.sel.append("g")
                .attr("class", "points")
                .selectAll("path")
                .data(f)
                .enter()
                .append("path")
                .attr("d", d3.svg.symbol().type('circle').size(28))
                .attr('class', 'point-circle')
                .style("fill", function(d) {
                    if (/.*/g.exec(d.name)) {
                        return 'red';
                    } else {
                        return 'none';
                    }
                })
                .attr("transform", function (d) {
                    return "translate(" + o.x(d.f1) + "," + o.y(d.f2) + ")";
                })
                .append("title")
                .text(function(d) { return d.name; });

            o.sel.append("g")
                .attr("class", "trendline")
                .append("path")
                .attr("d", o.line([[o.x(o.dom.x[0]), o.y(o.dom.y[0])], [o.x(o.dom.x[1]), o.y(o.dom.y[1])]]));


            // setup up cursor tooltip
            var save_key = 83;
            if (o.tooltip) o.tooltip.cursor_tooltip(o.sel, width+o.margins.left+o.margins.right,
						    height+o.margins.top+o.margins.bottom, o.x, o.y,
						    save_key);
            return this;
        }

        function collect_data(data, axis, layer) {
            if (axis!='x' && axis!='y') console.warn('bad axis: ' + axis);
            if (!o.layers[layer]) o.layers[layer] = {};
            o.layers[layer][axis] = data;
            update();
	    return this;
        }
    };
});

define('vis/subplot',["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        var o = scaffold.set_options(options, {
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
	    spacing: 0,
            rows: 2,
            columns: 2,
            fill_screen: false,
            selection: d3.select('body') });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // clear the container and add again
	// TODO add to scaffold.setup_svg
        o.svg.select("#subplot-container").remove();
        var container = o.svg.append("g").attr("id","subplot-container");
        o.sel = container.attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");
        o.frames = [];
        for (var y=0; y<o.rows; y+=1) {
            // divide into rows
            var a_row = [];
            for (var x=0; x<o.columns; x+=1) {
                // divide into columns
                var fr = o.sel.append('g')
                        .attr('class', 'grid')
                        .datum({'x_i': x, 'y_i': y});
                a_row.push(fr);
            }
            o.frames.push(a_row);
        }
        update();

        return { get_frames: get_frames,
                 frame_by_row_col: get_frame,
                 update: update };

        // definitions
        function get_frames() {
            return o.frames;
            return this;
        }
        function get_frame(row, column) {
            return o.frames[row][column];
            return this;
        }
        function update() {
            var row_h = o.height/o.rows,
                col_w = o.width/o.columns;

            d3.selectAll('.grid')
                .attr('transform',   function(d) { return 'translate(' +
                                                   Math.floor(d.x_i * col_w) + ',' +
                                                   Math.floor(d.y_i * row_h) + ')';
                                                 })
                .attr('width',  function(d) { return Math.floor(col_w - o.spacing); })
                .attr('height', function(d) { return Math.floor(row_h - o.spacing); });
            return this;
        }
    };
});

define('vis/tooltip',["./scaffold", "lib/d3"], function (scaffold, d3) {
    /** tooltip.js

     (c) Zachary King 2013

     TODO fix to update based on vis/resize.js
     */

    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            text_height: 18 });

	return { cursor_tooltip: cursor_tooltip };

	// definitions
        function dist(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        }

        function insert_linebreaks(t, text) {
            var words = text.split('\n');
            t.text('');

            for (var i = 0; i < words.length; i++) {
                var tspan = t.append('tspan').text(words[i]);
                if (i > 0)
                    tspan.attr('x', 0)
                    .attr('dy', o.text_height);
            }
            return words.length;
        };

        function create_textspans(tooltip, loc) {
            var texts = d3.selectAll('.point-circle')
                    .filter(function (d, i) {
                        var distance = dist(loc[0], loc[1], window.x_scale(d.f1), window.y_scale(d.f2));
                        return (distance < window.radius);
                    });
            if (texts[0].length > 0) {
                var this_text = "";
                texts.each(function(d) {
                    this_text += d.name + '\n';
                });
                var l = insert_linebreaks(tooltip, this_text.trim());
                tooltip.attr('dy', -l*o.text_height/2);
            } else {
                tooltip.text("");
                tooltip.attr('dy', '0');
            }
        }


        function cursor_tooltip(node, w, h, x_scale, y_scale, save_key) {
            /** cursor_tootip(node)

             Add a tooltip for any objects near the cursor.

             node - Append the SVG objects to this node.
             */
            var mouse_node = node.append('rect')
                    .attr("width", w)
                    .attr("height", h)
                    .attr('style', 'visibility: hidden')
                    .attr('pointer-events', 'all');

            window.x_scale = x_scale;
            window.y_scale = y_scale;
            window.radius = 10;
            var g = node
                    .append('g')
                    .attr('class', 'cursor-tooltip')
                    .attr('pointer-events', 'none');

            var circle = g.append('circle')
                    .attr('class','cursor-tooltip-circle')
                    .attr('r', window.radius);
            var tooltip = g.append('g')
                    .attr('transform', 'translate('+(window.radius+2)+',0)')
                    .append('text')
                    .attr('class', 'cursor-tooltip-text');
            var play = false;
            window.setInterval(function(){play=true;}, 100);
            mouse_node.on('mousemove', function (d, i) {
                window.loc = d3.mouse(this);
                if (play) {
                    g.attr('transform', 'translate('+loc[0]+','+loc[1]+')');
                    create_textspans(tooltip, loc);
                    play = false;
                }
            });

            var saved_locs = [];
            var saved_node = node.append('g').attr('id', 'saved_tooltips');
            function update_circles(s) {
                saved_node.selectAll('.saved_tooltip')
                    .data(s)
                    .enter()
                    .append('g')
                    .attr('class', 'saved_tooltip')
                    .attr('transform', function (d) {
                        return 'translate('+d[0]+','+d[1]+')';
                    })
                    .call(add_tooltip);
            }
            if (save_key>=0) {
                d3.select(window).on("keydown", function() {
                    if (d3.event.keyCode==save_key) {
                        saved_locs = saved_locs.concat([window.loc]);
                        update_circles(saved_locs);
                    }
                });
            }
        }

        function add_tooltip() {
            this.append('circle')
                .attr('class','cursor-tooltip-circle')
                .attr('r', window.radius);
            var tt = this.append('g')
                    .attr('transform', 'translate('+(window.radius+2)+',0)')
                    .append('text')
                    .attr('class', 'cursor-tooltip-text');
            create_textspans(tt, this.datum());
        }

    };
});

define('metabolic-map/utils',["lib/d3"], function (d3) {
    return { setup_zoom_container: setup_zoom_container,
             setup_defs: setup_defs };

    // definitions
    function setup_zoom_container(svg, w, h, scale_extent, callback) {
	if (callback===undefined) callback = function() {};
        // set up the container
        svg.select("#container").remove();
        var container = svg.append("g")
                .attr("id", "container"),
            sel = container.append("g"),
            zoom = function() {
                sel.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		callback(d3.event);
            },
	    zoom_behavior = d3.behavior.zoom().scaleExtent(scale_extent).on("zoom", zoom);
        container.call(zoom_behavior);
        return {sel: sel,
		zoom: zoom_behavior };
    }

    function setup_defs(svg, style) {
        // add stylesheet
        svg.select("defs").remove();
        var defs = svg.append("defs");
        defs.append("style")
            .attr("type", "text/css")
            .text(style);
        return defs;
    }
});

define('metabolic-map/main',["vis/scaffold", "metabolic-map/utils", "lib/d3"], function (scaffold, utils, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
            selection_is_svg: false,
            fillScreen: false,
            update_hook: false,
            css_path: "css/metabolic-map.css",
            map_path: null,
	    map_json: null,
            flux_path: null,
            flux: null,
            flux2_path: null,
            flux2: null,
	    flux_source: function() {},
            css: '' });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

	// listeners
	o.listeners = {};

        var files_to_load = [
            { file: o.map_path, callback: set_map, value: o.map_json },
            { file: o.css_path, callback: set_css, value: o.css },
            { file: o.flux_path,
	      callback: function(e, f) { set_flux(e, f, 0); }, 
	      value: o.flux },
            { file: o.flux2_path,
	      callback: function(e, f) { set_flux(e, f, 1); }, 
	      value: o.flux2 } ];

	if (!o.map_json && !o.map_path) {
            return console.warn("No map provided. Set either map_json or map_path");
        }
        scaffold.load_files(files_to_load, setup);

        return { set_flux_source: set_flux_source,
		 add_listener: add_listener,
		 remove_listener: remove_listener,
		 reload_flux: reload_flux,
		 set_status: set_status };

        // Definitions
        function set_css(error, css) {
            if (error) console.warn(error);
            o.css = css;
        };
        function set_map(error, map_data) {
            if (error) console.warn(error);
            o.map_data = map_data;
        };
        function set_flux(error, flux, index) {
            if (error) console.warn("Flux" + index + ": " + error);
            if (index==0) o.flux = flux;
            else if (index==1) o.flux2 = flux;
        };
        function set_flux_source(fn) {
            o.flux_source = fn;
            return this;
        };
        function reload_flux() {
            o.flux_source(function (fluxes, is_viable, objective) {
                if (!is_viable) {
                    set_status('cell is dead :\'(');
                    fluxes = [];
                } else if (objective) {
                    set_status('objective: ' + d3.format('.3f')(objective) + "    (HINT: Click a reaction)");
                }
                o.map_data = flux_to_data(o.map_data, fluxes, null, null);
		o.has_metabolites = false; o.has_metabolite_deviation = false;
                update();
            });
            return this;
        }
        function remove_listener(target, type) {
            /**
             * Remove a listener.
             */

            // delete the saved listener
            delete o.listeners[target][type];
            // removed from selection by applying null
            apply_a_listener(target, type, null);
            return this;
        }
        function apply_a_listener(target, type, callback, context) {
            /**
             Apply a single listener. To register multiple listeners for the same
             event type, the type may be followed by an optional namespace, such
             as "click.foo" and "click.bar".

             */

            // If callback is null, pass the null through to remove the listener.
            var new_callback = callback;
            if (callback!=null) new_callback = function(d) { callback.call(context, d.id); };
            d3.selectAll(target).on(type, new_callback);
        }
        function apply_listeners() {
            /**
             Update all saved listeners.

             */

            for (var target in o.listeners)
                for (var type in o.listeners[target])
                    apply_a_listener(target, type,
                                     o.listeners[target][type].callback,
                                     o.listeners[target][type].context);
        }
        function add_listener(target, type, callback) {
            /**
             Save a new listener, and apply it.

             */
            // save listener
            if (!o.listeners.hasOwnProperty(target))
                o.listeners[target] = {};
            o.listeners[target][type] = {'callback': callback, 'context': this};
            // apply the listener
            apply_a_listener(target, type, callback, this);
            return this;
        }
	function set_status(status) {
	    var t = d3.select('body').select('#status');
	    if (t.empty()) t = d3.select('body')
		.append('text')
		.attr('id', 'status');
	    t.text(status);
	    return this;
	}
	function setup() {
            o.decimal_format = d3.format('.1f');
            o.decimal_format_3 = d3.format('.3f');
            o.style_variables = get_style_variables(o.style);	   

            // set up svg and svg definitions
            o.scale = define_scales(o.map_data.max_map_w,
				    o.map_data.max_map_h,
				    o.width, o.height);
            var defs = utils.setup_defs(o.svg, o.css);
            generate_markers(defs);

            var out = utils.setup_zoom_container(o.svg, o.width, o.height, [1, 15]);
            o.sel = out.sel;

            // parse the data objects
	    o.has_flux = false; o.has_flux_comparison = false;
	    o.has_metabolites = false; o.has_metabolite_deviation = false;
            if (o.flux) {
                o.has_flux = true;
                o.map_data = parse_flux_1(o.map_data, o.flux);
                if (o.flux2) {
                    o.has_flux_comparison = true;
                    o.map_data = parse_flux_2(o.map_data, o.flux2);
                }
            }
            if (o.metabolites) {
                o.has_metabolites = true;
                o.map_data = parse_metabolites_1(o.map_data, o.metabolites);
                if (o.metabolites2) {
                    o.has_metabolite_deviation = true;
                    o.map_data = parse_metabolites_2(o.map_data, o.metabolites2);
                }
            }

	    reload_flux();
	    update();

	    // setup() definitions
            function get_style_variables(style) {
                return [];

                // var r = new RegExp("/\*(a-zA-Z)+\*/");
            }
            function define_scales(map_w, map_h, w, h) {
                var factor = Math.min(w/map_w, h/map_h),
                    scale = {};
                scale.x = d3.scale.linear()
                    .domain([0, map_w])
                    .range([(w - map_w*factor)/2, map_w*factor + (w - map_w*factor)/2]),
                scale.y = d3.scale.linear()
                    .domain([0, map_h])
                    .range([(h - map_h*factor)/2, map_h*factor + (h - map_h*factor)/2]),
                scale.x_size = d3.scale.linear()
                    .domain([0, map_w])
                    .range([0, map_w*factor]),
                scale.y_size = d3.scale.linear()
                    .domain([0, map_h])
                    .range([0, map_h*factor]),
                scale.size = d3.scale.linear()
                    .domain([0, 1])
                    .range([0, factor]),
                scale.flux = d3.scale.linear()
                    .domain([0, 40])
                    .range([6, 6]),
                scale.flux_fill = d3.scale.linear()
                    .domain([0, 40, 200])
                    .range([1, 1, 1]),
                scale.flux_color = d3.scale.linear()
                    .domain([0, 1, 20, 50])
                    .range(["rgb(200,200,200)", "rgb(150,150,255)", "blue", "red"]),
                scale.metabolite_concentration = d3.scale.linear()
                    .domain([0, 10])
                    .range([15, 200]),
                scale.metabolite_color = d3.scale.linear()
                    .domain([0, 1.2])
                    .range(["#FEF0D9", "#B30000"]);
                scale.scale_path = function(path) {
                    var x_fn = scale.x, y_fn = scale.y;
                    // TODO: scale arrow width
                    var str = d3.format(".2f"),
                        path = path.replace(/(M|L)([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p0, p1, p2) {
                            return p0 + [str(x_fn(parseFloat(p1))), str(y_fn(parseFloat(p2)))].join(', ');
                        }),
                        reg = /C([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)/g;
                    path = path.replace(reg, function (match, p1, p2, p3, p4, p5, p6) {
                        return 'C'+str(x_fn(parseFloat(p1)))+','+
                            str(y_fn(parseFloat(p2)))+' '+
                            str(x_fn(parseFloat(p3)))+','+
                            str(y_fn(parseFloat(p4)))+' '+
                            [str(x_fn(parseFloat(p5)))+','+str(y_fn(parseFloat(p6)))];
                    });
                    return path;
                };
                scale.scale_decimals = function(path, scale_fn, precision) {
                    var str = d3.format("."+String(precision)+"f");
                    path = path.replace(/([0-9.]+)/g, function (match, p1) {
                        return str(scale_fn(parseFloat(p1)));
                    });
                    return path;
                };
                return scale;
            }
            function generate_markers(defs) {
                var g = defs.append('g')
                        .attr('id', 'markers');

                g.append("marker")
                    .attr("id", "end-triangle-path-color")
                    .attr("markerHeight", 2.1)
                    .attr("markerUnits", "strokeWidth")
                    .attr("markerWidth", 2.1)
                    .attr("orient", "auto")
                    .attr("refX", 0)
                    .attr("refY", 6)
                    .attr("viewBox", "0 0 12 12")
                    .append("path")
                    .attr("d", "M 0 0 L 12 6 L 0 12 z")
                    .attr("class", "marker");

                g.append("marker")
                    .attr("id", "start-triangle-path-color")
                    .attr("markerHeight", 2.0)
                    .attr("markerUnits", "strokeWidth")
                    .attr("markerWidth", 2.0)
                    .attr("orient", "auto")
                    .attr("refX", 12)
                    .attr("refY", 6)
                    .attr("viewBox", "0 0 12 12")
                    .append("path")
                    .attr("d", "M 12 0 L 0 6 L 12 12 z")
                    .attr("class", "marker");
                return defs;
            }
	}
	function update(callback) {
	    if (callback===undefined) callback = function() {};
	    var sel = o.sel, data = o.map_data, style = o.css,
		style_variables = o.style_variables, scale = o.scale,
		width = o.width, height = o.height, decimal_format = o.decimal_format,
		has_metabolites = o.has_metabolites, has_metabolite_deviation = o.has_metabolite_deviation,
		has_flux = o.has_flux, has_flux_comparison = o.has_flux_comparison;

	    // remove everything from container
	    sel.selectAll("*").remove();

	    // add overlay
            sel.append("rect")
		.attr("class", "overlay")
		.attr("width", width)
		.attr("height", height)
		.attr("style", "stroke:black;fill:none;");

            // generate map
            draw_membranes(sel, data.membrane_rectangles, scale);
            if (data.hasOwnProperty("metabolite_circles")) {
		draw_metabolite_circles(sel, data.metabolite_circles, scale,
					has_metabolites, has_metabolite_deviation);
            } else if (data.hasOwnProperty("metabolite_paths")) {
		if (has_metabolites) { alert('metabolites do not render w simpheny maps'); }
		draw_metabolite_paths(sel, data.metabolite_paths, scale);
            }
            draw_reaction_labels(sel, data.reaction_labels, scale, has_flux,
                                 has_flux_comparison, style_variables);
            draw_labels(sel, "misc-labels", data.misc_labels, scale);
            draw_metabolite_labels(sel, data.metabolite_labels, scale,
                                   has_metabolites, has_metabolite_deviation,
                                   decimal_format);
            draw_reaction_paths(sel, data.reaction_paths, scale, has_flux);

	    apply_listeners();
	    
            // update() definitions
            function draw_membranes(selection, membrane_rectangles, scale) {
		selection.append("g")
                    .attr("id", "membranes")
                    .selectAll("rect")
                    .data(membrane_rectangles)
                    .enter().append("rect")
                    .attr("class", function(d){ return d.class; })
                    .attr("width", function(d){ return scale.x_size(d.width); })
                    .attr("height", function(d){ return scale.y_size(d.height); })
                    .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";})
                    .style("stroke-width", function(d) { return scale.size(10); })
                    .attr('rx', function(d){ return scale.x_size(20); })
                    .attr('ry', function(d){ return scale.x_size(20); });
            }

            function draw_metabolite_circles(selection, metabolite_circles, scale,
                                             has_metabolites, has_metabolite_deviation) {
		selection.append("g")
                    .attr("id", "metabolite-circles")
                    .selectAll("circle")
                    .data(data.metabolite_circles)
                    .enter().append("circle")
                    .attr("r", function (d) {
			var sc = scale.metabolite_concentration;
			if (d.metabolite_concentration) {
                            var s;
                            if (d.should_size) s = scale.size(sc(d.metabolite_concentration));
                            else s = scale.size(0);
                            return s;
			} else if (has_metabolites) {
                            return scale.size(10);
			} else {
                            return scale.size(d.r);
			}
                    })
                    .attr("style", function (d) {
			var sc = scale.metabolite_color;
			if (d.metabolite_concentration) {
                            var a;
                            if (d.should_color) a = "fill:"+sc(d.metabolite_concentration) + ";" +
				"stroke:black;stroke-width:0.5;";
                            else a = "fill:none;stroke:black;stroke-width:0.5;";
                            return a;
			}
			else if (has_metabolites) {
                            return "fill:grey;stroke:none;stroke-width:0.5;";
			}
			else { return ""; }
                    })
                    .attr("transform", function(d){
			return "translate("+scale.x(d.cx)+","+scale.y(d.cy)+")";
                    });
		if (has_metabolite_deviation) {
                    append_deviation_arcs(selection, metabolite_circles);
		}

		// definitions
		function append_deviation_arcs(selection, metabolite_circles) {
                    var arc_data = metabolite_circles.filter( function(o) {
			return (o.hasOwnProperty('metabolite_deviation') &&
				o.hasOwnProperty('metabolite_concentration'));
                    });
                    var arc = d3.svg.arc()
                            .startAngle(function(d) { return -d.metabolite_deviation/100/2*2*Math.PI; })
                            .endAngle(function(d) { return d.metabolite_deviation/100/2*2*Math.PI; })
                            .innerRadius(function(d) { return 0; })
                            .outerRadius(function(d) {
				var s;
				if (d.should_size) s = scale.size(scale.metabolite_concentration(d.metabolite_concentration));
				else s = scale.size(0);
				return s;
                            });
                    selection.append("g")
			.attr("id", "metabolite-deviation-arcs")
			.selectAll("path")
			.data(arc_data)
			.enter().append("path")
			.attr('d', arc)
			.attr('style', "fill:black;stroke:none;opacity:0.4;")
			.attr("transform", function(d) {
                            return "translate("+scale.x(d.cx)+","+scale.y(d.cy)+")";
			});
		}
            }

            function draw_metabolite_paths(selection, metabolite_paths, scale) {
		selection.append("g")
                    .attr("id", "metabolite-paths")
                    .selectAll("path")
                    .data(metabolite_paths)
                    .enter().append("path")
                    .attr("d", function(d) { return scale.scale_path(d.d); })
                    .style("fill", "rgb(224, 134, 91)")
                    .style("stroke", "rgb(162, 69, 16)")
                    .style("stroke-width", String(scale.size(2))+"px");
            }

            function draw_reaction_labels(selection, reaction_labels, scale, has_flux,
                                          has_flux_comparison, style_variables) {
		selection.append("g")
                    .attr("id", "reaction-labels")
                    .selectAll("text")
                    .data(reaction_labels)
                    .enter().append("text")
		    .attr("class", "reaction-label")
                    .text(function(d) {
			var t = d.text;
			if (has_flux_comparison)
                            t += " ("+decimal_format(d.flux1)+"/"+decimal_format(d.flux2)+": "+decimal_format(d.flux)+")";
			else if (d.flux) t += " ("+decimal_format(d.flux)+")";
			else if (has_flux) t += " (0)";
			return t;
                    })
                    .attr("text-anchor", "start")
                    .attr("font-size", function(d) {
			var s;
			if (style_variables.hasOwnProperty('reaction_label_size')) {
                            s = style_variables['reaction_label_size'];
			}
			else { s = 15; }
			return scale.size(s);
                    })
		// .attr("style", function(d){ if(!d.flux) return "visibility:hidden;"; else return ""; })
                    .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
            }

            function draw_labels(selection, id, labels, scale) {
		selection.append("g")
                    .attr("id", id)
                    .selectAll("text")
                    .data(labels)
                    .enter().append("text")
                    .text(function(d) { return d.text; })
                    .attr("font-size", scale.size(60))
                    .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
            }

            function draw_metabolite_labels(selection, metabolite_labels, scale,
                                            has_metabolites, has_metabolite_deviation,
                                            decimal_format) {
		selection.append("g")
                    .attr("id", "metabolite-labels")
                    .selectAll("text")
                    .data(metabolite_labels)
                    .enter().append("text")
                    .text(function(d) {
			var t = d.text;
			if (isNaN(d.metabolite_concentration)) {}
			else if (has_metabolite_deviation) {
                            var a = (isNaN(d.metabolite_concentration) ? "-" : decimal_format(d.metabolite_concentration));
                            var b = (isNaN(d.metabolite_deviation) ? "-" : decimal_format(d.metabolite_deviation));
                            t += " ("+a+" \xB1 "+b+"%)";
			}
			else if (d.metabolite_concentration) {
                            var a = (isNaN(d.metabolite_concentration) ? "-" : decimal_format(d.metabolite_concentration));
                            t += " ("+a+")";
			}
			else if (has_metabolites) t += " (0)";
			return t;
                    })
                    .attr("font-size", function(d) {
			if (d.metabolite_concentration) return scale.size(30);
			else if (has_metabolites) return scale.size(20);
			else return scale.size(20);
                    })
                    .style("visibility","visible")
                    .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";});
            }

            function draw_reaction_paths(selection, reaction_paths, scale, has_flux) {
		selection.append("g")
                    .attr("id", "reaction-paths")
                    .selectAll("path")
                    .data(reaction_paths)
                    .enter().append("path")
                    .attr("d", function(d) { return scale.scale_path(d.d); })
                    .attr("class", function(d) { return d["class"] + " reaction-path"; })
                    .attr("style", function(d) {
			var s = "", sc = scale.flux;
			// .fill-arrow is for simpheny maps where the path surrounds line and
			// arrowhead
			// .line-arrow is for bigg maps were the line is a path and the
			// arrowhead is a marker
			if (d["class"]=="fill-arrow") sc = scale.flux_fill;
			if (d.flux) {
                            s += "stroke-width:"+String(scale.size(sc(Math.abs(d.flux))))+";";
                            s += "stroke:"+scale.flux_color(Math.abs(d.flux))+";";
                            if (d["class"]=="fill-arrow") { s += "fill:"+scale.flux_color(Math.abs(d.flux))+";"; }
                            else if (d["class"]=="line-arrow") { make_arrowhead_for_fill(); }
                            else s += "fill:none";
			}
			else if (has_flux) {
                            s += "stroke-width:"+String(scale.size(sc(0)))+";";
                            s += "stroke:"+scale.flux_color(Math.abs(0))+";";
                            if (d["class"]=="fill-arrow") s += "fill:"+scale.flux_color(0)+";";
                            else s += "fill:none";
			}
			else {
                            s += "stroke-width:"+String(scale.size(1))+";";
			}
			return s;
                    })
                    .style('marker-end', function (d) {
			if (!/end/.test(d.class)) return '';
			if (d.flux) return make_arrowhead_for_fill(scale.flux_color(d.flux));
			else if (has_flux) return make_arrowhead_for_fill(scale.flux_color(0));
			else return "url(#end-triangle-path-color)";
                    })
                    .style('marker-start', function (d) {
			if (!/start/.test(d.class)) return '';
			if (d.flux) return make_arrowhead_for_fill(scale.flux_color(d.flux));
			else if (has_flux) return make_arrowhead_for_fill(scale.flux_color(0));
			else return "url(#start-triangle-path-color)";
                    });
            }

            function make_arrowhead_for_fill(fill) {
		d3.select('#markers').selectAll("marker"); //
		return ""
            }
	}
	function flux_to_data (data, fluxes, metabolites, metabolites2) {
	    o.has_flux = false;
	    o.has_flux_comparison = false;
	    o.has_metabolites = false;
	    o.has_metabolite_deviation = false;

	    var remove_fluxes_from_data = function(d) {
		d.reaction_paths.map(function(o) {
		    delete o.flux;
		    return o;
		});
		d.reaction_labels.map(function(o) {
		    delete o.flux;
		    return o;
		});
		return d;
	    };

	    // parse the data objects and attach values to map objects
	    if (fluxes.length > 0) {
		var flux = fluxes[0];
		o.has_flux = true;
		data = parse_flux_1(data, flux);
		if (fluxes.length > 1) {
		    var flux2 = fluxes[1];
		    o.has_flux_comparison = true;
		    data = parse_flux_2(data, flux2);
		}
	    } else {
		remove_fluxes_from_data(data);
	    }
	    if (metabolites) {
		o.has_metabolites = true;
		data = parse_metabolites_1(data, metabolites);
		if (metabolites2) {
		    o.has_metabolite_deviation = true;
		    data = parse_metabolites_2(data, metabolites2);
		}
	    }
	    return data;
	}

	function parse_flux_1(data, flux) {
            data.reaction_paths = data.reaction_paths.map( function(o) {
		if (o.id in flux) {
                    o.flux = parseFloat(flux[o.id]);
		}
		// else { console.log(o.id) }
		return o;
            });
            data.reaction_labels = data.reaction_labels.map( function(o) {
		if (o.text in flux) {
                    // TODO: make sure text==id
                    o.flux = parseFloat(flux[o.text]);
		}
		return o;
            });
            return data;
	}

	function parse_flux_2(data, flux2) {
            data.reaction_paths = data.reaction_paths.map( function(o) {
		if (o.id in flux2 && o.flux) {
                    o.flux = (parseFloat(flux2[o.id]) - o.flux);
		}
		return o;
            });
            data.reaction_labels = data.reaction_labels.map( function(o) {
		if (o.flux) o.flux1 = o.flux;
		else o.flux1 = 0;
		if (o.text in flux2) o.flux2 = parseFloat(flux2[o.text]);
		else o.flux2 = 0;
		o.flux = (o.flux2 - o.flux1);
		return o;
            });
            return data;
	}
	function parse_metabolites_1(data, metabolites) {
            var skip_these_metabolites = []; //
            var do_not_size_these_metabolites = ['nad','nadp','nadh','nadph','atp','adp','coa','accoa'];
            data.metabolite_circles = data.metabolite_circles.map( function(o) {
		if (o.id in metabolites && skip_these_metabolites.indexOf(o.id)==-1) {
                    o.metabolite_concentration = parseFloat(metabolites[o.id]);
                    if (do_not_size_these_metabolites.indexOf(o.id)>=0) {
			o.should_size = false;
			o.should_color = true;
                    } else {
			o.should_size = true;
			o.should_color = false;
                    }
		}
		return o;
            });
            data.metabolite_labels = data.metabolite_labels.map( function(o) {
		if (o.text in metabolites) {
                    o.metabolite_concentration = parseFloat(metabolites[o.text]);
		}
		return o;
            });
            return data;
	}

	function parse_metabolites_2(data, metabolites) {
            data.metabolite_circles = data.metabolite_circles.map( function(o) {
		if (o.id in metabolites) {
                    o.metabolite_deviation = parseFloat(metabolites[o.id]);
		}
		return o;
            });
            data.metabolite_labels = data.metabolite_labels.map( function(o) {
		if (o.text in metabolites) {
                    o.metabolite_deviation = parseFloat(metabolites[o.text]);
		}
		return o;
            });
            return data;
	}
    };
});

define('metabolic-map/knockout',["vis/scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {});
        o.reactions = {};
        o.latest_flux = [];
        o.latest_objective_value = [];

        return {
            add_reaction: add_reaction,
            get_flux: get_flux
        };

	// definitions
        function add_reaction(reaction) {
            o.reactions[reaction] = true;
        }
        function get_flux(callback) {
            var url = "/knockout-map/";
            var i = -1, start="?",
                k = Object.keys(o.reactions);
            while (++i < k.length) {
                if (i>0) start = "&";
                url += start + "reactions[]=" + encodeURIComponent(k[i]);
                console.log(url);
            }
            d3.json(url, function(error, json) {
                if (error) return console.warn(error);
                var flux = json.x,
                    objective = json.f;
                o.latest_flux = flux;
                o.latest_objective_value = objective;
                callback([flux], objective > 1e-7, objective);
		return null;
            });
        }
    };
});

define('lib/jquery',[],function () {
    if (window.$===undefined) console.warn('jquery is not loaded.');
    return window.$;
});

define('lib/builder/jquery-ui',[],function () {
    if (window.$===undefined) return console.warn('jquery is still not loaded.');
    if (window.$.ui===undefined) return console.warn('jquery-ui is not loaded.');
    return window.$.ui;
});

define('builder/main',["vis/scaffold", "metabolic-map/utils", "lib/d3", "lib/jquery", "lib/builder/jquery-ui"], function(scaffold, utils, d3) {
    // TODO
    // connected node object
    // only display each node once
    // why aren't some nodes appearing as selected?
    // BRANCHING!
    // make object oriented
    //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            margins: {top: 10, right: 10, bottom: 10, left: 20},
	    selection: d3.select("body").append("div"),
            selection_is_svg: false,
            fillScreen: false,
            update_hook: false,
            css_path: "css/metabolic-map.css",
            map_path: "data/maps/simpheny-maps/ijo-central.json",
            flux_path: false,
            flux2_path: false,
            css: '' });

	if (o.selection_is_svg) console.error("Builder does not support placement within svg elements");

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

	o.reaction_input = setup_reaction_input(o.selection);

        var files_to_load = [{file: o.css_path, callback: set_css },
                             {file: o.map_path, callback: set_map },
                             {file: o.flux_path,  callback: function(e, f) { set_flux(e, f, 0); } },
                             {file: o.flux2_path, callback: function(e, f) { set_flux(e, f, 1); } } ];
        scaffold.load_files(files_to_load, update);

        return { update: update };

        // Definitions
        function set_css(error, css) {
            if (error) console.warn(error);
            o.css = css;
        };
        function set_map(error, map_data) {
            if (error) console.warn(error);
            o.map_data = map_data;
        };
        function set_flux(error, flux, index) {
            if (error) console.warn(error);
            if (index==0) o.flux = flux;
            else if (index==1) o.flux2 = flux;
        };
	function setup_reaction_input(selection) {
	    return selection.append("input")
		.attr("id", "rxn-input")
		.style("display", "none");
	};
        function update() {
            o.version = 0.2;
            o.selected_node = {'reaction_id': '',
                               'metabolite_id': '',
                               'direction': '',
                               'is_selected': false};
            o.drawn_reactions = {};
            o.arrowheads_generated = [];
            o.cobra_reactions = {};
            o.list_strings = [];
            o.scale = {};
            o.scale.flux_color = d3.scale.linear()
                .domain([0, 20])
                .range(["blue", "red"]);
            o.default_reaction_color = '#eeeeee';
            o.decimal_format = d3.format('.1f');
            o.window_translate = {'x': 0, 'y': 0};
            o.window_scale = 1;
            o.map_data = {};
            o.mode = 'builder';

	    var svg = o.svg,
		style = o.css,
		width = o.width,
		height = o.height;

            // set up svg and svg definitions
            var defs = utils.setup_defs(svg, style),
		out = utils.setup_zoom_container(svg, width, height, [0.05, 15], function(ev) {
		    o.window_translate = {'x': ev.translate[0], 'y': ev.translate[1]};
		    o.window_scale = ev.scale;
		    place_reaction_input(coords_for_selected_metabolite());
		}),
		sel = out.sel,
		zoom = out.zoom;
	    o.zoom = zoom;
	    o.sel = sel;	// TODO remove these from o

	    // var mouse_node = o.sel.append('rect')
            //         .attr("width", o.width)
            //         .attr("height", o.height)
            //         .attr('style', 'visibility: hidden')
            //         .attr('pointer-events', 'all');

            o.sel.append('g')
                .attr('id', 'reactions');

            // setup selection box
            var start_coords = {'x': o.width/2, 'y': 40};
            load_model_and_list(start_coords, function() {
                // TEST case
                if (true) {
                    new_reaction('GLCtex', start_coords);
                }
                d3.select('#loading').style('display', 'none');
                // Focus on menu. TODO use a better callback rather than the
                // setTimeout.
                window.setTimeout(function() { $('#rxn-input').focus(); }, 50);
            });

            // set up keyboard listeners
            key_listeners();
        }

        function load_model_and_list(coords, callback_function) {
            //  model = {
            //      reactions: {
            //          cobra_id_1: {
            //            metabolites: { cobra_id_2: { coefficient: }, ... }
            //          }, ...
            //      }
            //  }

            // Object.keys(myArray).length for length of the object (no good in IE8)
            // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation

            d3.json("data/maps/cobra_model_0.2.json", function(error, model) {
                if (error) console.warn(error);
                o.cobra_reactions = model.reactions;

                // load list data
                d3.json("data/flux/flux-wt-pFBA.json", function(error, json) {
                    if (error) console.warn(error);

                    // sort by flux value
                    var sorted = [];
                    for (var flux_reaction_id in json) {
                        // fix reaction ids
                        sorted.push([flux_reaction_id.replace('(', '_').replace(')', ''),
                                     parseFloat(json[flux_reaction_id])]);
                    }
                    sorted.sort(function(a,b) { return Math.abs(b[1]) - Math.abs(a[1]); });
                    var i=-1;
                    while (++i < sorted.length) {
                        // update strings for reaction list
                        o.list_strings.push({ label: sorted[i][0]+" -- "+sorted[i][1],
                                              value: sorted[i][0] });

                        // update model with fluxes
                        for (var reaction_id in o.cobra_reactions) {
                            // set flux for reaction
                            if (reaction_id == sorted[i][0]) {
                                o.cobra_reactions[reaction_id].flux = sorted[i][1];
                                // also set flux for metabolites (for simpler drawing)
                                for (var metabolite_id in o.cobra_reactions[reaction_id].metabolites)
                                    o.cobra_reactions[reaction_id].metabolites[metabolite_id].flux = sorted[i][1];
                            }
                        }
                    }
                    reload_reaction_input(coords);
                    callback_function();
                });
            });

        }

        function place_reaction_input(coords) {
            var d = {'x': 280, 'y': 0},
                input = d3.select('#rxn-input');
            var left = Math.max(20, Math.min(o.width-270, (o.window_scale * coords.x + o.window_translate.x - d.x)));
            var top = Math.max(20, Math.min(o.height-40, (o.window_scale * coords.y + o.window_translate.y - d.y)));
            // blur
            input.node().blur();
            input.style('position', 'absolute')
                .attr('placeholder', 'Reaction ID -- Flux')
                .style('display', 'block')
                .style('left',left+'px')
                .style('top',top+'px')
            // ignore spaces
                .on('input', function() { this.value = this.value.replace(" ", ""); });
            // // focus
            // if (should_focus) input.node().focus();
        }

        function reload_reaction_input(coords) {
            // Reload data for autocomplete box and redraw box at the new
            // coordinates.
            place_reaction_input(coords);

            // Find selected reaction
            var reaction_ids_to_display = [],
                already_drawn = function(reaction_id) {
                    for (var drawn_id in o.drawn_reactions)
                        if (reaction_id==drawn_id) return true;
                    return false;
                };
            for (var reaction_id in o.cobra_reactions) {
                var reaction = o.cobra_reactions[reaction_id];
                // ignore drawn reactions
                if (already_drawn(reaction_id)) continue;
                if (o.selected_node.is_selected) {
                    // check metabolites for match to selected metabolite
                    for (var metabolite_id in reaction.metabolites) {
                        if (metabolite_id==o.selected_node.metabolite_id &&
                            reaction.metabolites[metabolite_id].coefficient < 0) {
                            reaction_ids_to_display.push(reaction_id);
                        }
                    }
                } else {
                    reaction_ids_to_display.push(reaction_id);
                }
            }

            // set up the box with data, searching for first num results
            var num = 20;
            $("#rxn-input").autocomplete(
                { autoFocus: true,
                  minLength: 0,
                  source: function(request, response) {
                      var escaped = $.ui.autocomplete.escapeRegex(request.term),
                          matcher = new RegExp("^" + escaped, "i"),
                          results = o.list_strings.filter(function(x) {
                              // check against drawn reactions
                              if (reaction_ids_to_display.indexOf(x.value) >= 0)
                                  return matcher.test(x.value);
                              return false;
                          });
                      response(results.slice(0,num));
                  },
                  change: function(event, ui) {
                      if (ui.item) {
                          new_reaction(ui.item.value, coords);
                          this.value = "";
                      }
                  }
                });
        }

        // -----------------------------------------------------------------------------------
        // DRAW

        function align_to_grid(loc) {
            return loc;
            // TODO debug with drag and drop
            // var r = function (a) { return Math.round(a/1.)*1.; };
            // return {'x': r(loc.x), 'y': r(loc.y)};
        }

        function rotate_coords_recursive(coords_array, angle, center) {
            var i=-1,
                rotated = [];
            while (++i<coords_array.length) {
                rotated.push(rotate_coords(coords_array[i]));
            }
            return rotated;
        }

        function rotate_coords(c, angle, center) {
            var dx = Math.cos(angle) * (c.x - center.x) +
                    Math.sin(angle) * (c.y - center.y) +
                    center.x,
                dy = - Math.sin(angle) * (c.x - center.x) +
                    Math.cos(angle) * (c.y - center.y) +
                    center.y;
            return {'x': dx, 'y': dy};
        }

        function calculate_reaction_coordinates(reaction) {
            var dis = 120;
            reaction.dis = dis;
            var main_axis = [{'x': 0, 'y': 0}, {'x': 0, 'y': dis}];
            reaction.main_axis = main_axis;
            reaction.center = {'x': (main_axis[0].x + main_axis[1].x)/2,   // for convenience
                               'y': (main_axis[0].y + main_axis[1].y)/2};
            return reaction;
        }

        function calculate_metabolite_coordinates(met, primary_index, angle, main_axis, center, dis) {
            // basic constants
            met.text_dis = {'x': 0, 'y': -18}; // displacement of metabolite label

            // Curve parameters
            var w = 60,  // distance between reactants and between products
                b1_strength = 0.5,
                b2_strength = 0.2,
                w2 = w*0.7,
                secondary_dis = 20,
                num_slots = Math.min(2, met.count - 1);

            // size and spacing for primary and secondary metabolites
            var ds, draw_at_index;
            if (met.is_primary) { // primary
                met.r = 10;
                ds = 20;
            } else { // secondary
                met.r = 5;
                ds = 10;
                // don't use center slot
                if (met.index > primary_index) draw_at_index = met.index - 1;
                else draw_at_index = met.index;
            }

            var de = dis - ds, // distance between ends of line axis
                reaction_axis = [{'x': 0, 'y': ds},
                                 {'x': 0, 'y': de}];

            // Define line parameters and axis.
            // Begin with unrotated coordinate system. +y = Down, +x = Right.
            var start = center,
                end, circle, b1, b2;
            // reactants
            if (met.coefficient < 0 && met.is_primary) {
                end = {'x': reaction_axis[0].x + met.dis.x,
                       'y': reaction_axis[0].y + met.dis.y};
                b1 = {'x': start.x*b1_strength + reaction_axis[0].x*(1-b1_strength),
                      'y': start.y*b1_strength + reaction_axis[0].y*(1-b1_strength)};
                b2 = {'x': start.x*b2_strength + (end.x)*(1-b2_strength),
                      'y': start.y*b2_strength + (end.y)*(1-b2_strength)},
                circle = {'x': main_axis[0].x + met.dis.x,
                          'y': main_axis[0].y + met.dis.y};
            } else if (met.coefficient < 0) {
                end = {'x': reaction_axis[0].x + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.x,
                       'y': reaction_axis[0].y + secondary_dis + met.dis.y},
                b1 = {'x': start.x*b1_strength + reaction_axis[0].x*(1-b1_strength),
                      'y': start.y*b1_strength + reaction_axis[0].y*(1-b1_strength)},
                b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                      'y': start.y*b2_strength + end.y*(1-b2_strength)},
                circle = {'x': main_axis[0].x + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.x,
                          'y': main_axis[0].y + secondary_dis + met.dis.y};
            } else if (met.coefficient > 0 && met.is_primary) {        // products
                end = {'x': reaction_axis[1].x + met.dis.x,
                       'y': reaction_axis[1].y + met.dis.y};
                b1 = {'x': start.x*b1_strength + reaction_axis[1].x*(1-b1_strength),
                      'y': start.y*b1_strength + reaction_axis[1].y*(1-b1_strength)};
                b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                      'y': start.y*b2_strength + end.y*(1-b2_strength)},
                circle = {'x': main_axis[1].x + met.dis.x,
                          'y': main_axis[1].y + met.dis.y};
            } else if (met.coefficient > 0) {
                end = {'x': reaction_axis[1].x + (w2*draw_at_index - w2*(num_slots-1)/2) + met.dis.x,
                       'y': reaction_axis[1].y - secondary_dis + met.dis.y},
                b1 = {'x': start.x*b1_strength + reaction_axis[1].x*(1-b1_strength),
                      'y': start.y*b1_strength + reaction_axis[1].y*(1-b1_strength)};
                b2 = {'x': start.x*b2_strength + end.x*(1-b2_strength),
                      'y': start.y*b2_strength + end.y*(1-b2_strength)},
                circle = {'x': main_axis[1].x + (w*draw_at_index - w*(num_slots-1)/2) + met.dis.x,
                          'y': main_axis[1].y - secondary_dis + met.dis.y};
            }
            // rotate coordinates around start point
            met.start  = rotate_coords(start,  angle, main_axis[0]),
            met.end    = rotate_coords(end,    angle, main_axis[0]),
            met.b1     = rotate_coords(b1,     angle, main_axis[0]),
            met.b2     = rotate_coords(b2,     angle, main_axis[0]),
            met.circle = rotate_coords(circle, angle, main_axis[0]);

            return met;
        }

        function new_reaction(reaction_id, coords) {
            // New object at x, y coordinates.

            // If reaction id is not new, then return:
            if (o.drawn_reactions.hasOwnProperty(reaction_id)) {
                console.warn('reaction is already drawn');
                return;
            }

            // set reaction coordinates and angle
            // be sure to copy the reaction using jquery extend, recursively
            var reaction = $.extend(true, {}, o.cobra_reactions[reaction_id]);
            reaction.coords = align_to_grid(coords);
            reaction.angle = 0 * (Math.PI / 180); // default angle

            // calculate coordinates of reaction
            reaction = calculate_reaction_coordinates(reaction);

            // set primary metabolites and count reactants/products
            var primary_reactant_index = 0,
                primary_product_index = 0,
                reactant_count = 0, product_count = 0,
                newest_primary_product_id = "";

            for (var metabolite_id in reaction.metabolites) {
                var metabolite = reaction.metabolites[metabolite_id];
                if (metabolite.coefficient < 0) {
                    metabolite.index = reactant_count;
                    if (reactant_count==primary_reactant_index) metabolite.is_primary = true;
                    reactant_count++;
                } else {
                    metabolite.index = product_count;
                    if (product_count==primary_product_index) {
                        metabolite.is_primary = true;
                        newest_primary_product_id = metabolite_id;
                    };
                    product_count++;
                }
            }

            // keep track of total reactants and products
            for (metabolite_id in reaction.metabolites) {
                metabolite = reaction.metabolites[metabolite_id];
                var primary_index;
                if (metabolite.coefficient < 0) {
                    metabolite.count = reactant_count + 1;
                    primary_index = primary_reactant_index;
                } else {
                    metabolite.count = product_count + 1;
                    primary_index = primary_product_index;
                }

                // record reaction_id with each metabolite
                metabolite.reaction_id = reaction_id;
                metabolite.dis = {'x': 0, 'y': 0};

                // calculate coordinates of metabolite components
                metabolite = calculate_metabolite_coordinates(metabolite,
                                                                primary_index,
                                                                reaction.angle,
                                                                reaction.main_axis,
                                                                reaction.center,
                                                                reaction.dis);
            }

            // append the new reaction
            o.drawn_reactions[reaction_id] = reaction;

            // draw, and set the new coords
            o.selected_node = {'reaction_id': reaction_id,
                               'direction': "product",
                               'metabolite_id': newest_primary_product_id,
                               'is_selected': true};

            draw();
            var new_coords = coords_for_selected_metabolite();
            translate_off_screen(new_coords);
            reload_reaction_input(new_coords);
            setTimeout(function() { $('#rxn-input').focus(); }, 50);
        }

        function translate_off_screen(coords) {
            // shift window if new reaction will draw off the screen
            // TODO BUG not accounting for scale correctly
            var margin = 200,
                new_pos,
                current = {'x': {'min': -o.window_translate.x,
                                 'max': (o.width-o.window_translate.x)/o.window_scale},
                           'y': {'min': -o.window_translate.y,
                                 'max': (o.height-o.window_translate.y)/o.window_scale} },
                go = function() {
                    o.zoom.translate([o.window_translate.x, o.window_translate.y]);
                    o.zoom.scale(o.window_scale);
                    o.sel.transition()
                        .attr('transform', 'translate('+o.window_translate.x+','+o.window_translate.y+')scale('+o.window_scale+')');
                };
            if (coords.x < current.x.min + margin) {
                new_pos = -(coords.x - current.x.min - margin) * o.window_scale + o.window_translate.x;
                o.window_translate.x = new_pos;
                go();
            } else if (coords.x > current.x.max - margin) {
                new_pos = -(coords.x - current.x.max + margin) * o.window_scale + o.window_translate.x;
                o.window_translate.x = new_pos;
                go();
            }
            if (coords.y < current.y.min + margin) {
                new_pos = -(coords.y - current.y.min - margin) * o.window_scale + o.window_translate.y;
                o.window_translate.y = new_pos;
                go();
            } else if (coords.y > current.y.max - margin) {
                new_pos = -(coords.y - current.y.max + margin) * o.window_scale + o.window_translate.y;
                o.window_translate.y = new_pos;
                go();
            }
        }

        function coords_for_selected_metabolite() {
            if (o.selected_node.is_selected)
                return get_coords_for_metabolite(o.selected_node.metabolite_id, o.selected_node.reaction_id);
            else
                console.log('no node selected');
            return {'x':0, 'y':0};
        }

        function get_coords_for_metabolite(metabolite_id, reaction_id) {
            var reaction = o.drawn_reactions[reaction_id],
                metabolite = reaction.metabolites[metabolite_id],
                coords = reaction.coords;
            return {'x': coords.x + metabolite.circle.x,
                    'y': coords.y + metabolite.circle.y};
        }

        function cycle_primary_key() {
            // cycle the primary metabolite among the products of the selected reaction

            if (!o.selected_node.is_selected) {
                console.log('no selected node');
                return;
            }

            // get last index
            var last_index, count;
            var reaction = o.drawn_reactions[o.selected_node.reaction_id];
            for (var metabolite_id in reaction.metabolites) {
                var metabolite = reaction.metabolites[metabolite_id];
                if ((metabolite.coefficient > 0 && o.selected_node.direction=="product") ||
                    (metabolite.coefficient < 0 && o.selected_node.direction=="reactant")) {
                    if (metabolite.is_primary) {
                        last_index = metabolite.index;
                        count = metabolite.count;
                    }
                }
            }
            // rotate to new index
            var index = last_index + 1 < count - 1 ? last_index + 1 : 0;
            rotate_primary_key(index);
        }

        function rotate_primary_key(index) {
            // switch the primary metabolite to the index of a particular product

            if (!o.selected_node.is_selected) {
                console.log('no selected node');
                return;
            }

            // update primary in o.drawn_reactions
            var new_primary_metabolite_id;
            var reaction = o.drawn_reactions[o.selected_node.reaction_id];

            // if primary is selected, then maintain that selection
            var sel_is_primary = reaction.metabolites[o.selected_node.metabolite_id].is_primary,
                should_select_primary = sel_is_primary ? true : false;

            for (var metabolite_id in reaction.metabolites) {
                var metabolite = reaction.metabolites[metabolite_id];
                if ((metabolite.coefficient > 0 && o.selected_node.direction=="product") ||
                    (metabolite.coefficient < 0 && o.selected_node.direction=="reactant")) {
                    if (metabolite.index == index) {
                        metabolite.is_primary = true;
                        new_primary_metabolite_id = metabolite_id;
                    } else {
                        metabolite.is_primary = false;
                    }
                    // calculate coordinates of metabolite components
                    metabolite = calculate_metabolite_coordinates(metabolite,
                                                                    index,
                                                                    reaction.angle,
                                                                    reaction.main_axis,
                                                                    reaction.center,
                                                                    reaction.dis);
                }
            }

            var coords;
            if (should_select_primary) {
                o.selected_node.metabolite_id = new_primary_metabolite_id;
                coords = get_coords_for_metabolite(o.selected_node.metabolite_id,
                                                     o.selected_node.reaction_id);
                reload_reaction_input(coords);
            } else {
                coords = get_coords_for_metabolite(o.selected_node.metabolite_id,
                                                     o.selected_node.reaction_id);
                place_reaction_input(coords);
            }

            draw_specific_reactions([o.selected_node.reaction_id]);
        }

        function select_metabolite(d) {
            o.selected_node.metabolite_id = d.metabolite_id;
            o.selected_node.direction = d.coefficient > 0 ? 'product' : 'reactant';
            o.selected_node.is_selected = true;
            o.selected_node.reaction_id = d.reaction_id;
            reload_reaction_input(coords_for_selected_metabolite());
            draw();
        }

        function create_metabolite(enter_selection) {
            // create metabolites
            var g = enter_selection
                    .append('g')
                    .attr('class', 'metabolite-group')
                    .attr('id', function(d) { return d.metabolite_id; }),
                move = function() {
                    // console.log(d3.event);

                    var sel = d3.select(this),
                        met = o.drawn_reactions[sel.datum().reaction_id]
                            .metabolites[sel.datum().metabolite_id],
                        d = align_to_grid({'x': d3.event.dx, 'y': d3.event.dy});
                    met.dis = align_to_grid({'x': met.dis.x + d3.event.dx,
                                               'y': met.dis.y + d3.event.dy});

                    var transform = d3.transform(sel.attr('transform'));
                    sel.attr('transform', 'translate(' +
                             (transform.translate[0]+d3.event.dx) + ',' +
                             (transform.translate[1]+d3.event.dy) + ')' +
                             'scale(' + transform.scale + ')');
                },
                silence = function() {
                    d3.event.sourceEvent.stopPropagation(); // silence other listeners
                },
                update = function() {
                    var sel = d3.select(this),
                        transform = d3.transform(sel.attr('transform'));
                    sel.attr('transform', null);
                    draw_specific_reactions_with_location([sel.datum().reaction_id]);
                };


            // create reaction arrow
            g.append('path')
                .attr('class', 'reaction-arrow');

            // create metabolite circle and label
            // TODO hide if the node is shared
            var mg = g.append('g')
                    .attr('class', 'circle-and-label');

            mg.append('circle')
                .attr('class', 'metabolite-circle')
                .on("click", select_metabolite)
                .call(d3.behavior.drag().on("dragstart", silence).on("drag", move).on("dragend", update));
            mg.append('text')
                .attr('class', 'metabolite-label')
                .text(function(d) { return d.metabolite_id; })
                .attr('pointer-events', 'none');
        }

        function update_metabolite(update_selection) {
            // update metabolite attributes

            // update arrows
            update_selection
                .selectAll('.reaction-arrow')
            // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
            // only necessary for selectAll()
                .datum(function() {
                    return this.parentNode.__data__;
                })
                .attr('d', function(d) {
                    return 'M'+d.start.x+','+d.start.y+
                        'C'+d.b1.x+','+d.b1.y+' '+
                        d.b2.x+','+d.b2.y+' '+
                        d.end.x+','+d.end.y;
                }) // TODO replace with d3.curve or equivalent
                .attr("marker-end", function (d) {
                    var c = d.flux ? o.scale.flux_color(Math.abs(d.flux)) :
                            o.default_reaction_color;
                    // generate arrowhead for specific color
                    var arrow_id = generate_arrowhead_for_color(c, true);
                    return "url(#" + arrow_id + ")";
                })
                .style('stroke', function(d) {
                    var c = d.flux ? o.scale.flux_color(Math.abs(d.flux)) :
                            o.default_reaction_color;
                    return c;
                });

            // update circle and label location
            var mg = update_selection
                    .selectAll('.circle-and-label')
            // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
            // only necessary for selectAll()
                    .datum(function() {
                        return this.parentNode.__data__;
                    })
                    .attr('transform', function(d) {
                        return 'translate('+d.circle.x+','+d.circle.y+')';
                    });

            var is_sel = function(d) {
                if (d.reaction_id==o.selected_node.reaction_id &&
                    d.metabolite_id==o.selected_node.metabolite_id &&
                    o.selected_node.is_selected)
                    return true;
                return false;
            };

            mg.select('.metabolite-circle')
                .attr('r', function(d) { return d.r; })
                .style('stroke', function(d) {
                    if (is_sel(d)) return '#222';
                    return null;
                })
                .style('stroke-width', function(d) {
                    if (is_sel(d)) return '3px';
                    return null;
                });
            mg.select('.metabolite-label')
                .attr('transform', function(d) {
                    return 'translate('+d.text_dis.x+','+d.text_dis.y+')';
                });
        }

        function create_reaction_label(sel) {
            // draw reaction label for selection
            sel.append('text')
                .attr('class', 'reaction-label')
                .attr('pointer-events', 'none');
        }
        function update_reaction_label(sel) {
            var near_angle_degrees = function(angle, near) {
                return (angle > (near-45)*Math.PI/180 && angle<(near+45)*Math.PI/180);
            };

            sel.text(function(d) {
                return d.reaction_id + " (" + o.decimal_format(d.flux) + ")";
            })
                .attr('transform', function(d) {
                    // displacement of reaction label
                    var dis;
                    if (near_angle_degrees(d.angle, 90))
                        dis = {'x': 30, 'y': -35};
                    else if (near_angle_degrees(d.angle, 180))
                        dis = {'x': -20, 'y': 0};
                    else if (near_angle_degrees(d.angle, 270))
                        dis = {'x': -30, 'y': 35};
                    else if (near_angle_degrees(d.angle, 0))
                        dis = {'x': 20, 'y': 0};
                    var loc = rotate_coords({'x': d.center.x + dis.x,
                                               'y': d.center.y + dis.y},
                                              d.angle, d.main_axis[0]);
                    return 'translate('+loc.x+','+loc.y+')';
                });
        }

        function create_reaction(enter_selection) {
            // attributes for new reaction group
            var t = enter_selection.append('g')
                    .attr('id', function(d) { return d.reaction_id; })
                    .attr('class', 'reaction')
                    .attr('transform', function(d) {
                        return 'translate(' + d.coords.x + ',' + d.coords.y + ')';
                    })
                    .call(create_reaction_label);

            return;
        }
        function update_reaction(update_selection) {
            // update reaction label
            update_selection.select('.reaction-label')
                .call(update_reaction_label);

            // select metabolites
            var sel = update_selection
                    .selectAll('.metabolite-group')
                    .data(function(d) {
                        return make_array(d.metabolites, 'metabolite_id');
                    }, function(d) { return d.metabolite_id; });

            // new metabolites
            sel.enter().call(create_metabolite);

            // update metabolites
            sel.call(update_metabolite);

            // old metabolites
            sel.exit().remove();

            return;
        }

        function make_array(obj, id_key) { // is this super slow?
            var array = [];
            for (var key in obj) {
                // copy object
                var o = $.extend(true, {}, obj[key]);
                // add key as 'id'
                o[id_key] = key;
                // add object to array
                array.push(o);
            }
            return array;
        }

        function draw() {
            // Draw the reactions

            // generate reactions for o.drawn_reactions
            // assure constancy with cobra_id
            var sel = d3.select('#reactions')
                    .selectAll('.reaction')
                    .data(make_array(o.drawn_reactions, 'reaction_id'),
                          function(d) { return d.reaction_id; }); // LEFTOFF generate array from o.drawn_reactions object

            // enter: generate and place reaction
            sel.enter().call(create_reaction);

            // update: update when necessary
            sel.call(update_reaction);

            // exit
            sel.exit().remove();
        }

        function draw_specific_reactions(reaction_ids) {
            // console.log('updating these ids:');
            // console.log(reaction_ids);

            // find reactions for reaction_ids
            var reaction_subset = {},
                i = -1;
            while (++i<reaction_ids.length) {
                reaction_subset[reaction_ids[i]] = $.extend(true, {}, o.drawn_reactions[reaction_ids[i]]);
            }
            if (reaction_ids.length != Object.keys(reaction_subset).length) {
                console.warn('did not find correct reaction subset');
            }

            // generate reactions for o.drawn_reactions
            // assure constancy with cobra_id
            var sel = d3.select('#reactions')
                    .selectAll('.reaction')
                    .data(make_array(reaction_subset, 'reaction_id'),
                          function(d) { return d.reaction_id; });

            // enter: generate and place reaction
            sel.enter().call(create_reaction);

            // update: update when necessary
            sel.call(update_reaction);

            // exit
            // sel.exit();
        }

        function draw_specific_reactions_with_location(reaction_id) {
            var reaction = o.drawn_reactions[reaction_id],
                primary_reactant_index, primary_product_index;
            reaction = calculate_reaction_coordinates(reaction);
            for (var metabolite_id in reaction.metabolites) {
                var metabolite = reaction.metabolites[metabolite_id];
                if (metabolite.coefficient < 0)
                    if (metabolite.is_primary) primary_reactant_index = metabolite.index;
                else
                    if (metabolite.is_primary) primary_product_index = metabolite.index;
            }
            for (metabolite_id in reaction.metabolites) {
                metabolite = reaction.metabolites[metabolite_id];
                var primary_index;
                if (metabolite.coefficient < 0) {
                    primary_index = primary_reactant_index;
                } else {
                    primary_index = primary_product_index;
                }
                metabolite = calculate_metabolite_coordinates(metabolite,
                                                                primary_index, //should this be saved as metabolite.primary_index?
                                                                reaction.angle,
                                                                reaction.main_axis,
                                                                reaction.center,
                                                                reaction.dis);
            }
            draw_specific_reactions([reaction_id]);
            place_reaction_input(coords_for_selected_metabolite());
        }

        function modify_reaction(cobra_id, key, value) {
            // modify reaction with cobra_id to have new (key, value) pair
            o.drawn_reactions[cobra_id][key] = value;
        }

        function generate_arrowhead_for_color(color, is_end) {
            var pref;
            if (is_end) pref = 'start-';
            else        pref = 'end-';

            var id = String(color).replace('#', pref);
            if (o.arrowheads_generated.indexOf(id) < 0) {
                o.arrowheads_generated.push(id);

                var markerWidth = 5,
                    markerHeight = 5,
                    // cRadius = 0, // play with the cRadius value
                    // refX = cRadius + (markerWidth * 2),
                    // refY = -Math.sqrt(cRadius),
                    // drSub = cRadius + refY;
                    refX,
                    refY = markerWidth/2,
                    d;

                if (is_end) refX = 0;
                else        refX = markerHeight;
                if (is_end) d = 'M0,0 V'+markerWidth+' L'+markerHeight/2+','+markerWidth/2+' Z';
                else        d = 'M'+markerHeight+',0 V'+markerWidth+' L'+(markerHeight/2)+','+markerWidth/2+' Z';

                // generate defs if it doesn't exist
                var defs = o.svg.select("defs");
                if (defs.empty()) defs = o.svg.append("svg:defs");

                // make the marker
                defs.append("svg:marker")
                    .attr("id", id)
                    .attr("class", "arrowhead")
                    .attr("refX", refX)
                    .attr("refY", refY)
                    .attr("markerWidth", markerWidth)
                    .attr("markerHeight", markerHeight)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", d)
                    .style("fill", color);
            }
            return id;
        }

        // -----------------------------------------------------------------------------------
        // KEYBOARD

        function key_listeners() {
            var primary_cycle_key = 80, // 'p'
                hide_show_input_key = 32, // SPACE
                rotate_keys = {'left':  37,
                               'right': 39,
                               'up':    38,
                               'down':  40};

            d3.select(window).on("keydown", function() {
                var kc = d3.event.keyCode,
                    reaction_input_focus =  $('#rxn-input').is(":focus");
                if (kc==primary_cycle_key && !reaction_input_focus) {
                    cycle_primary_key();
                } else if (kc==hide_show_input_key) {
                    if (reaction_input_focus) $('#rxn-input').blur();
                    else $('#rxn-input').focus();
                } else if (kc==rotate_keys.left && !reaction_input_focus) {
                    modify_reaction(o.selected_node.reaction_id, 'angle', 270*(Math.PI/180));
                    draw_specific_reactions_with_location(o.selected_node.reaction_id);
                } else if (kc==rotate_keys.right && !reaction_input_focus) {
                    modify_reaction(o.selected_node.reaction_id, 'angle', 90*(Math.PI/180));
                    draw_specific_reactions_with_location(o.selected_node.reaction_id);
                } else if (kc==rotate_keys.up && !reaction_input_focus) {
                    modify_reaction(o.selected_node.reaction_id, 'angle', 180*(Math.PI/180));
                    draw_specific_reactions_with_location(o.selected_node.reaction_id);
                } else if (kc==rotate_keys.down && !reaction_input_focus) {
                    modify_reaction(o.selected_node.reaction_id, 'angle', 0);
                    draw_specific_reactions_with_location(o.selected_node.reaction_id);
                }
            });
        }
    };
});

define('main',["vis/bar", "vis/box-and-whiskers", "vis/category-legend",
        "vis/data-menu", "vis/epistasis", "vis/export-svg",
        "vis/histogram", "vis/resize", "vis/scatter",
        "vis/subplot", "vis/tooltip", "metabolic-map/main",
	"metabolic-map/knockout", "builder/main"],
       function(bar, baw, cl, dm, ep, ev, hist, re, sc, sp, tt, mm, ko, bu) {
           return { bar: bar,
                    box_and_whiskers: baw,
                    category_legend: cl,
                    data_menu: dm,
                    epistasis: ep,
                    export_svg: ev,
                    histogram: hist,
                    resize: re,
                    scatter: sc,
                    subplot: sp,
                    tooltip: tt,
		    metabolic_map: mm,
		    builder: bu,
		    knockout: ko };
       });

    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('main');
}));