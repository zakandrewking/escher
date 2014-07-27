(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define('escher', factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.
        root.escher = factory();
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

define("../build/almond", function(){});

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

define('utils',["lib/vkbeautify"], function(vkbeautify) {
    return { set_options: set_options,
             setup_svg: setup_svg,
	     remove_child_nodes: remove_child_nodes,
             load_css: load_css,
             load_files: load_files,
             load_the_file: load_the_file,
	     make_class: make_class,
	     setup_defs: setup_defs,
	     draw_an_array: draw_an_array,
	     draw_an_object: draw_an_object,
	     make_array: make_array,
	     compare_arrays: compare_arrays,
	     array_to_object: array_to_object,
	     clone: clone,
	     extend: extend,
	     unique_concat: unique_concat,
	     c_plus_c: c_plus_c,
	     c_minus_c: c_minus_c,
	     c_times_scalar: c_times_scalar,
	     download_json: download_json,
	     load_json: load_json,
	     export_svg: export_svg,
	     rotate_coords_recursive: rotate_coords_recursive,
	     rotate_coords: rotate_coords,
	     get_angle: get_angle,
	     to_degrees: to_degrees,
	     angle_for_event: angle_for_event,
	     distance: distance,
	     check_undefined: check_undefined,
	     compartmentalize: compartmentalize,
	     decompartmentalize: decompartmentalize,
	     check_r: check_r,
	     mean: mean,
	     check_for_parent_tag: check_for_parent_tag };

    // definitions
    function set_options(options, defaults) {
        if (options===undefined) return defaults;
        var i = -1,
            out = defaults;
	for (var key in options) {
	    var val = options[key];
	    if (val===undefined) {
		val = null;
	    }
	    out[key] = val;
	}
        return out;
    }

    function setup_svg(selection, selection_is_svg, fill_screen) {
        // sub selection places the graph in an existing svg environment
        var add_svg = function(f, s) {
            if (f) {
                d3.select("body").classed('fill-screen-body', true);
		s.classed('fill-screen-div', true);
            }
            var svg = s.append('svg')
		    .attr("class", "escher-svg")
                    .attr('xmlns', "http://www.w3.org/2000/svg");
	    return svg;
        };

        // run
        var out;
	// set the selection class
	selection.classed('escher-container', true);
	// make the svg
        if (selection_is_svg) {
            return selection;
        } else if (selection) {
            return add_svg(fill_screen, selection);
        } else {
            throw new Error('No selection');
        }
    }

    function remove_child_nodes(selection) {
	/** Removes all child nodes from a d3 selection

	 */
	var node =  selection.node();
	while (node.hasChildNodes()) {
	    node.removeChild(node.lastChild);
	}
    }

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
    function load_the_file(t, file, callback, value) {
        // if the value is specified, don't even need to do the ajax query
        if (value) {
            if (file) console.warn('File ' + file + ' overridden by value.');
            callback.call(t, null, value, file);
            return;
        }
        if (!file) {
            callback.call(t, "No filename", null, file);
            return;
        }
        if (ends_with(file, 'json'))
	    d3.json(file, function(e, d) { callback(e, d, file); });
        else if (ends_with(file, 'css'))
	    d3.text(file, function(e, d) { callback(e, d, file); });
        else
	    callback.call(t, "Unrecognized file type", null, file);
        return;

        // definitions
        function ends_with(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
    }
    function load_files(t, files_to_load, final_callback) {
        // load multiple files asynchronously
        // Takes a list of objects: { file: a_filename.json, callback: a_callback_fn }
        var i = -1, remaining = files_to_load.length, callbacks = {};
        while (++i < files_to_load.length) {
            var this_file = files_to_load[i].file;
            callbacks[this_file] = files_to_load[i].callback;
            load_the_file(t,
			  this_file,
                          function(e, d, file) {
                              callbacks[file].call(t, e, d);
                              if (!--remaining) final_callback.call(t);
                          },
                          files_to_load[i].value);
        }
    }
    // makeClass - By Hubert Kauker (MIT Licensed)
    // original by John Resig (MIT Licensed).
    // http://stackoverflow.com/questions/7892884/simple-class-instantiation
    function make_class(){
	var isInternal;
	var constructor = function(args){
            if ( this instanceof constructor ) {
		if ( typeof this.init == "function" ) {
                    this.init.apply( this, isInternal ? args : arguments );
		}
            } else {
		isInternal = true;
		var instance = new constructor( arguments );
		isInternal = false;
		return instance;
            }
	};
	return constructor;
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

    function draw_an_array(container_sel, parent_node_selector, children_selector,
			   array, create_function, update_function) {
	/** Run through the d3 data binding steps for an array.
	 */
	var sel = container_sel.select(parent_node_selector)
		.selectAll(children_selector)
		.data(array);
	// enter: generate and place reaction
	sel.enter().call(create_function);
	// update: update when necessary
	sel.call(update_function);
	// exit
	sel.exit().remove();
    }

    function draw_an_object(container_sel, parent_node_selector, children_selector,
			    object, id_key, create_function, update_function) {
	/** Run through the d3 data binding steps for an object.
	 */
	var sel = container_sel.select(parent_node_selector)
		.selectAll(children_selector)
		.data(make_array(object, id_key), function(d) { return d[id_key]; });
	// enter: generate and place reaction
	sel.enter().call(create_function);
	// update: update when necessary
	sel.call(update_function);
	// exit
	sel.exit().remove();
    }

    function make_array(obj, id_key) { // is this super slow?
        var array = [];
        for (var key in obj) {
            // copy object
            var it = clone(obj[key]);
            // add key as 'id'
            it[id_key] = key;
            // add object to array
            array.push(it);
        }
        return array;
    }

    function compare_arrays(a1, a2) {
	/** Compares two simple (not-nested) arrays.

	 */
	if (!a1 || !a2) return false;
	if (a1.length != a2.length) return false;
	for (var i = 0, l=a1.length; i < l; i++) {
            if (a1[i] != a2[i]) {
		// Warning - two different object instances will never be equal: {x:20} != {x:20}
		return false;
            }
	}
	return true;
    }

    function array_to_object(arr) {
	var obj = {};
	for (var i=0, l=arr.length; i<l; i++) { // 0
	    var a = arr[i];
	    for (var id in a) {
		if (id in obj) {
		    obj[id][i] = a[id];
		} else {
		    var n = [];
		    // fill leading spaces with null
		    for (var j=0; j<i; j++) {
			n[j] = null;
		    }
		    n[i] = a[id];
		    obj[id] = n;
		}
	    }
	    // fill trailing spaces with null
	    for (var id in obj) {
		for (var j=obj[id].length; j<=i; j++) {
		    obj[id][j] = null;
		}
	    }
	}
	return obj;
    }

    function clone(obj) {
	// Handles the array and object types, and null or undefined
	if (null == obj || "object" != typeof obj) return obj;
	// Handle Array
	if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
		copy[i] = clone(obj[i]);
            }
            return copy;
	}
	// Handle Object
	if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function extend(obj1, obj2) {
	/** Extends obj1 with keys/values from obj2.

	 Performs the extension cautiously, and does not override attributes.

	 */
	for (var attrname in obj2) { 
	    if (!(attrname in obj1))
		obj1[attrname] = obj2[attrname];
	    else
		console.error('Attribute ' + attrname + ' already in object.');
	}
    }

    function unique_concat(arrays) {
	var new_array = [];
	arrays.forEach(function (a) {
	    a.forEach(function(x) {
		if (new_array.indexOf(x) < 0)
		    new_array.push(x);
	    });
	});
	return new_array;
    }

    function c_plus_c(coords1, coords2) {
	if (coords1 === null || coords2 === null || 
	    coords1 === undefined || coords2 === undefined)
	    return null;
	return { "x": coords1.x + coords2.x,
		 "y": coords1.y + coords2.y };
    }
    function c_minus_c(coords1, coords2) {
	if (coords1 === null || coords2 === null || 
	    coords1 === undefined || coords2 === undefined)
	    return null;
	return { "x": coords1.x - coords2.x,
		 "y": coords1.y - coords2.y };
    }

    function c_times_scalar(coords, scalar) {
	return { "x": coords.x * scalar,
		 "y": coords.y * scalar };
    }

    function download_json(json, name) {
        var a = document.createElement('a');
        a.download = name + '.json'; // file name
	var j = JSON.stringify(json);
        a.setAttribute("href-lang", "application/json");
        a.href = 'data:application/json,' + j;
        // <a> constructed, simulate mouse click on it
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(ev);

        function utf8_to_b64(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        }
    }

    function load_json(f, callback) {
	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob))
	    callback("The File APIs are not fully supported in this browser.", null);

	// The following is not a safe assumption.
	// if (!f.type.match("application/json"))
	//     callback.call(target, "Not a json file.", null);

	var reader = new window.FileReader();
	// Closure to capture the file information.
	reader.onload = function(event) {
	    var json = JSON.parse(event.target.result);
	    callback(null, json);
        };
	// Read in the image file as a data URL.
	reader.readAsText(f);
    }

    function export_svg(name, svg_sel, do_beautify) {
        var a = document.createElement('a'), xml, ev;
        a.download = name + '.svg'; // file name
	// convert node to xml string
        xml = (new XMLSerializer()).serializeToString(svg_sel.node()); 
        if (do_beautify) xml = vkbeautify.xml(xml);
        xml = '<?xml version="1.0" encoding="utf-8"?>\n \
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n \
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + xml;
        a.setAttribute("href-lang", "image/svg+xml");
        a.href = 'data:image/svg+xml;base64,' + utf8_to_b64(xml); // create data uri
        // <a> constructed, simulate mouse click on it
        ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(ev);
        
	// definitions
        function utf8_to_b64(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        }
    };

    function rotate_coords_recursive(coords_array, angle, center) {
	var rot = function(c) { return rotate_coords(c, angle, center); };
        return coords_array.map(rot);
    }

    function rotate_coords(c, angle, center) {
	/** Calculates displacement { x: dx, y: dy } based on rotating point c around 
	 center with angle.

	 */
        var dx = Math.cos(-angle) * (c.x - center.x) +
                Math.sin(-angle) * (c.y - center.y)
		+ center.x - c.x,
            dy = - Math.sin(-angle) * (c.x - center.x) +
                Math.cos(-angle) * (c.y - center.y)
		+ center.y - c.y;
        return { x: dx, y: dy };
    }

    function get_angle(coords) {
	/* Takes an array of 2 coordinate objects {"x": 1, "y": 1}
	 *
	 * Returns angle between 0 and 2PI.
	 */
	var denominator = coords[1].x - coords[0].x,
	    numerator = coords[1].y - coords[0].y;
	if (denominator==0 && numerator >= 0) return Math.PI/2;
	else if (denominator==0 && numerator < 0) return 3*Math.PI/2;
	else if (denominator >= 0 && numerator >= 0) return Math.atan(numerator/denominator);
	else if (denominator >= 0) return (Math.atan(numerator/denominator) + 2*Math.PI);
	else return (Math.atan(numerator/denominator) + Math.PI);
    }

    function to_degrees(radians) { return radians*180/Math.PI; }

    function angle_for_event(displacement, point, center) {
	var gamma =  Math.atan2((point.x - center.x), (center.y - point.y)),
	    beta = Math.atan2((point.x - center.x + displacement.x), 
			      (center.y - point.y - displacement.y)),
	    angle = beta - gamma;
	return angle;
    }

    function distance(start, end) { return Math.sqrt(Math.pow(end.y-start.y, 2) + Math.pow(end.x-start.x, 2)); }

    function check_undefined(args, names) {
	/** Report an error if any of the arguments are undefined.

	 Call by passing in *arguments* from any function and an array of
	 argument names.

	 */
	names.map(function(name, i) {
	    if (args[i]===undefined) {
		console.error('Argument is undefined: '+String(names[i]));
	    }
	});
    }

    function compartmentalize(bigg_id, compartment_id) {
	return bigg_id + '_' + compartment_id;
    }


    // definitions
    function decompartmentalize(id) {
	/** Convert ids to bigg_id and compartment_id.
	 
	 */
	var out = no_compartment(id);
	if (out===null) out = [id, null];
	return out;

	// definitions
	function no_compartment(id) {
	    /** Returns an array of [bigg_id, compartment id].

	     Matches compartment ids with length 1 or 2.

	     Return null if no match is found.

	     */
	    var reg = /(.*)_([a-z0-9]{1,2})$/,
		result = reg.exec(id);
	    if (result===null) return null;
	    return result.slice(1,3);
	}
    }

    function check_r(o, spec, can_be_none) {
	if (typeof spec == "string") {
	    var the_type;
	    if (spec=='String') {
		the_type = function(x) { return typeof x == "string"; };
	    } else if (spec=="Float") {
		the_type = function(x) { return typeof x == "number"; };
	    } else if (spec=="Integer") {
		the_type = function(x) { return (typeof x == "number") &&
					 (parseFloat(x,10) == parseInt(x,10)); };
	    } else if (spec=="Boolean") {
		the_type = function(x) { return typeof x == "boolean"; };
	    } else if (spec!="*") {
		throw new Error("Bad spec string: " + spec);
	    }
	    if (!the_type(o)) {
		throw new Error('Bad type: '+String(o)+' should be '+spec);
	    }
	} else if (spec instanceof Array) {
	    o.forEach(function(x) {
		check_r(x, spec[0], can_be_none);
	    });
	} else { // dictionary/object
	    var key = Object.keys(spec)[0];
	    if (key == "*") {
		for (var k in o) {
		    if (o[k]===null && can_be_none.indexOf(k)!=-1) 
			continue;
		    check_r(o[k], spec[key], can_be_none);
		}
	    } else {
		for (var k in spec) {
		    if (!(k in o)) {
			throw new Error('Missing key: %s' % k);
		    };
		    if (o[k]===null && can_be_none.indexOf(k)!=-1) 
			continue;
		    check_r(o[k], spec[k], can_be_none);
		}
	    }
	}
    }

    function mean(array) {
	var sum = array.reduce(function(a, b) { return a + b; });
	var avg = sum / array.length;
	return avg;
    }

    function check_for_parent_tag(el, tag) {
	/** Check that the selection has the given parent tag.

	 el: A d3 selection or node.

	 tag: A tag name (case insensitive)

	 */
	// make sure it is a node
	if (el instanceof Array)
	    el = el.node();
	while (el.parentNode !== null) {
	    el = el.parentNode;
	    if (el.tagName === undefined) continue;
	    if (el.tagName.toLowerCase() === tag.toLowerCase())
		return true;
	}
	return false;
    }
});

/**
 * complete.ly 1.0.0
 * MIT Licensing
 * Copyright (c) 2013 Lorenzo Puccetti
 * 
 * This Software shall be used for doing good things, not bad things.
 * 
**/  
define('lib/complete.ly',[],function() {
return function(container, config) {
    config = config || {};
    config.fontSize =                       config.fontSize   || '16px';
    config.fontFamily =                     config.fontFamily || 'sans-serif';
    config.promptInnerHTML =                config.promptInnerHTML || ''; 
    config.color =                          config.color || '#333';
    config.hintColor =                      config.hintColor || '#aaa';
    config.backgroundColor =                config.backgroundColor || '#fff';
    config.dropDownBorderColor =            config.dropDownBorderColor || '#aaa';
    config.dropDownZIndex =                 config.dropDownZIndex || '100'; // to ensure we are in front of everybody
    config.dropDownOnHoverBackgroundColor = config.dropDownOnHoverBackgroundColor || '#ddd';
    
    var txtInput = document.createElement('input');
    txtInput.type ='text';
    txtInput.spellcheck = false; 
    txtInput.style.fontSize =        config.fontSize;
    txtInput.style.fontFamily =      config.fontFamily;
    txtInput.style.color =           config.color;
    txtInput.style.backgroundColor = config.backgroundColor;
    txtInput.style.width = '100%';
    txtInput.style.outline = '0';
    txtInput.style.border =  '0';
    txtInput.style.margin =  '0';
    txtInput.style.padding = '0';
    
    var txtHint = txtInput.cloneNode(); 
    txtHint.disabled='';        
    txtHint.style.position = 'absolute';
    txtHint.style.top =  '0';
    txtHint.style.left = '0';
    txtHint.style.borderColor = 'transparent';
    txtHint.style.boxShadow =   'none';
    txtHint.style.color = config.hintColor;
    
    txtInput.style.backgroundColor ='transparent';
    txtInput.style.verticalAlign = 'top';
    txtInput.style.position = 'relative';
    
    var wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.outline = '0';
    wrapper.style.border =  '0';
    wrapper.style.margin =  '0';
    wrapper.style.padding = '0';
    
    var prompt = document.createElement('div');
    prompt.style.position = 'absolute';
    prompt.style.outline = '0';
    prompt.style.margin =  '0';
    prompt.style.padding = '0';
    prompt.style.border =  '0';
    prompt.style.fontSize =   config.fontSize;
    prompt.style.fontFamily = config.fontFamily;
    prompt.style.color =           config.color;
    prompt.style.backgroundColor = config.backgroundColor;
    prompt.style.top = '0';
    prompt.style.left = '0';
    prompt.style.overflow = 'hidden';
    prompt.innerHTML = config.promptInnerHTML;
    prompt.style.background = 'transparent';
    if (document.body === undefined) {
        throw 'document.body is undefined. The library was wired up incorrectly.';
    }
    document.body.appendChild(prompt);            
    var w = prompt.getBoundingClientRect().right; // works out the width of the prompt.
    wrapper.appendChild(prompt);
    prompt.style.visibility = 'visible';
    prompt.style.left = '-'+w+'px';
    wrapper.style.marginLeft= w+'px';
    
    wrapper.appendChild(txtHint);
    wrapper.appendChild(txtInput);
    
    var dropDown = document.createElement('div');
    dropDown.style.position = 'absolute';
    dropDown.style.visibility = 'hidden';
    dropDown.style.outline = '0';
    dropDown.style.margin =  '0';
    dropDown.style.padding = '0';  
    dropDown.style.textAlign = 'left';
    dropDown.style.fontSize =   config.fontSize;      
    dropDown.style.fontFamily = config.fontFamily;
    dropDown.style.backgroundColor = config.backgroundColor;
    dropDown.style.zIndex = config.dropDownZIndex; 
    dropDown.style.cursor = 'default';
    dropDown.style.borderStyle = 'solid';
    dropDown.style.borderWidth = '1px';
    dropDown.style.borderColor = config.dropDownBorderColor;
    dropDown.style.overflowX= 'hidden';
    dropDown.style.whiteSpace = 'pre';
    dropDown.style.overflowY = 'scroll';  // note: this might be ugly when the scrollbar is not required. however in this way the width of the dropDown takes into account
    
    
    var createDropDownController = function(elem) {
        var rows = [];
        var ix = 0;
        var oldIndex = -1;
        
        var onMouseOver =  function() { this.style.outline = '1px solid #ddd'; }
        var onMouseOut =   function() { this.style.outline = '0'; }
        var onMouseDown =  function() { p.hide(); p.onmouseselection(this.__hint); }
        
        var p = {
            hide :  function() { elem.style.visibility = 'hidden'; }, 
            refresh : function(token, array) {
                elem.style.visibility = 'hidden';
                ix = 0;
                elem.innerHTML ='';
                var vph = (window.innerHeight || document.documentElement.clientHeight);
                var rect = elem.parentNode.getBoundingClientRect();
                var distanceToTop = rect.top - 6;                        // heuristic give 6px 
                var distanceToBottom = vph - rect.bottom -6;  // distance from the browser border.
                
                rows = [];
                for (var i=0;i<array.length;i++) {
                    if (array[i].indexOf(token)!==0) { continue; }
                    var divRow =document.createElement('div');
                    divRow.style.color = config.color;
                    divRow.onmouseover = onMouseOver; 
                    divRow.onmouseout =  onMouseOut;
                    divRow.onmousedown = onMouseDown; 
                    divRow.__hint =    array[i];
                    divRow.innerHTML = token+'<b>'+array[i].substring(token.length)+'</b>';
                    rows.push(divRow);
                    elem.appendChild(divRow);
                }
                if (rows.length===0) {
                    return; // nothing to show.
                }
                if (rows.length===1 && token === rows[0].__hint) {
                    return; // do not show the dropDown if it has only one element which matches what we have just displayed.
                }
                
                if (rows.length<2) return; 
                p.highlight(0);
                
                if (distanceToTop > distanceToBottom*3) {        // Heuristic (only when the distance to the to top is 4 times more than distance to the bottom
                    elem.style.maxHeight =  distanceToTop+'px';  // we display the dropDown on the top of the input text
                    elem.style.top ='';
                    elem.style.bottom ='100%';
                } else {
                    elem.style.top = '100%';  
                    elem.style.bottom = '';
                    elem.style.maxHeight =  distanceToBottom+'px';
                }
                elem.style.visibility = 'visible';
            },
            highlight : function(index) {
                if (oldIndex !=-1 && rows[oldIndex]) { 
                    rows[oldIndex].style.backgroundColor = config.backgroundColor;
                }
                rows[index].style.backgroundColor = config.dropDownOnHoverBackgroundColor; // <-- should be config
                oldIndex = index;
            },
            move : function(step) { // moves the selection either up or down (unless it's not possible) step is either +1 or -1.
                if (elem.style.visibility === 'hidden')             return ''; // nothing to move if there is no dropDown. (this happens if the user hits escape and then down or up)
                if (ix+step === -1 || ix+step === rows.length) return rows[ix].__hint; // NO CIRCULAR SCROLLING. 
                ix+=step; 
                p.highlight(ix);
                return rows[ix].__hint;//txtShadow.value = uRows[uIndex].__hint ;
            },
            onmouseselection : function() {} // it will be overwritten. 
        };
        return p;
    }
    
    var dropDownController = createDropDownController(dropDown);
    
    dropDownController.onmouseselection = function(text) {
        txtInput.value = txtHint.value = leftSide+text; 
        rs.onChange(txtInput.value); // <-- forcing it.
        registerOnTextChangeOldValue = txtInput.value; // <-- ensure that mouse down will not show the dropDown now.
        setTimeout(function() { txtInput.focus(); },0);  // <-- I need to do this for IE 
    }
    
    wrapper.appendChild(dropDown);
    container.appendChild(wrapper);
    
    var spacer; 
    var leftSide; // <-- it will contain the leftSide part of the textfield (the bit that was already autocompleted)
    
    
    function calculateWidthForText(text) {
        if (spacer === undefined) { // on first call only.
            spacer = document.createElement('span'); 
            spacer.style.visibility = 'hidden';
            spacer.style.position = 'fixed';
            spacer.style.outline = '0';
            spacer.style.margin =  '0';
            spacer.style.padding = '0';
            spacer.style.border =  '0';
            spacer.style.left = '0';
            spacer.style.whiteSpace = 'pre';
            spacer.style.fontSize =   config.fontSize;
            spacer.style.fontFamily = config.fontFamily;
            spacer.style.fontWeight = 'normal';
            document.body.appendChild(spacer);    
        }        
        
        // Used to encode an HTML string into a plain text.
        // taken from http://stackoverflow.com/questions/1219860/javascript-jquery-html-encoding
        spacer.innerHTML = String(text).replace(/&/g, '&amp;')
                                       .replace(/"/g, '&quot;')
                                       .replace(/'/g, '&#39;')
                                       .replace(/</g, '&lt;')
                                       .replace(/>/g, '&gt;');
        return spacer.getBoundingClientRect().right;
    }
    
    
    var rs = { 
        onArrowDown : function() {},               // defaults to no action.
        onArrowUp :   function() {},               // defaults to no action.
        onEnter :     function() {},               // defaults to no action.
        onTab :       function() {},               // defaults to no action.
        onChange:     function() { rs.repaint() }, // defaults to repainting.
        startFrom:    0,
        options:      [],
        wrapper : wrapper,      // Only to allow  easy access to the HTML elements to the final user (possibly for minor customizations)
        input :  txtInput,      // Only to allow  easy access to the HTML elements to the final user (possibly for minor customizations) 
        hint  :  txtHint,       // Only to allow  easy access to the HTML elements to the final user (possibly for minor customizations)
        dropDown :  dropDown,         // Only to allow  easy access to the HTML elements to the final user (possibly for minor customizations)
        prompt : prompt,
        setText : function(text) {
            txtHint.value = text;
            txtInput.value = text; 
        },
        getText : function() {
        	return txtInput.value; 
        },
        hideDropDown : function() {
        	dropDownController.hide();
        },
        repaint : function() {
            var text = txtInput.value;
            var startFrom =  rs.startFrom; 
            var options =    rs.options;
            var optionsLength = options.length; 
            
            // breaking text in leftSide and token.
            var token = text.substring(startFrom);
            leftSide =  text.substring(0,startFrom);
            
            // updating the hint. 
            txtHint.value ='';
            for (var i=0;i<optionsLength;i++) {
                var opt = options[i];
                if (opt.indexOf(token)===0) {         // <-- how about upperCase vs. lowercase
                    txtHint.value = leftSide +opt;
                    break;
                }
            }
            
            // moving the dropDown and refreshing it.
            dropDown.style.left = calculateWidthForText(leftSide)+'px';
            dropDownController.refresh(token, rs.options);
        }
    };
    
    var registerOnTextChangeOldValue;

    /**
     * Register a callback function to detect changes to the content of the input-type-text.
     * Those changes are typically followed by user's action: a key-stroke event but sometimes it might be a mouse click.
    **/
    var registerOnTextChange = function(txt, callback) {
        registerOnTextChangeOldValue = txt.value;
        var handler = function() {
            var value = txt.value;
            if (registerOnTextChangeOldValue !== value) {
                registerOnTextChangeOldValue = value;
                callback(value);
            }
        };

        //  
        // For user's actions, we listen to both input events and key up events
        // It appears that input events are not enough so we defensively listen to key up events too.
        // source: http://help.dottoro.com/ljhxklln.php
        //
        // The cost of listening to three sources should be negligible as the handler will invoke callback function
        // only if the text.value was effectively changed. 
        //  
        // 
        if (txt.addEventListener) {
            txt.addEventListener("input",  handler, false);
            txt.addEventListener('keyup',  handler, false);
            txt.addEventListener('change', handler, false);
        } else { // is this a fair assumption: that attachEvent will exist ?
            txt.attachEvent('oninput', handler); // IE<9
            txt.attachEvent('onkeyup', handler); // IE<9
            txt.attachEvent('onchange',handler); // IE<9
        }
    };
    
    
    registerOnTextChange(txtInput,function(text) { // note the function needs to be wrapped as API-users will define their onChange
        rs.onChange(text);
    });
    
    
    var keyDownHandler = function(e) {
        e = e || window.event;
        var keyCode = e.keyCode;
        
        if (keyCode == 33) { return; } // page up (do nothing)
        if (keyCode == 34) { return; } // page down (do nothing);
        
        // if (keyCode == 27) { //escape
        //     dropDownController.hide();
        //     txtHint.value = txtInput.value; // ensure that no hint is left.
        //     txtInput.focus(); 
        //     return; 
        // }
        
        if (keyCode == 39 || keyCode == 35 || keyCode == 9) { // right,  end, tab  (autocomplete triggered)
        	if (keyCode == 9) { // for tabs we need to ensure that we override the default behaviour: move to the next focusable HTML-element 
           	    e.preventDefault();
                e.stopPropagation();
                if (txtHint.value.length == 0) {
                	rs.onTab(); // tab was called with no action.
                	            // users might want to re-enable its default behaviour or handle the call somehow.
                }
            }
            if (txtHint.value.length > 0) { // if there is a hint
                dropDownController.hide();
                txtInput.value = txtHint.value;
                var hasTextChanged = registerOnTextChangeOldValue != txtInput.value
                registerOnTextChangeOldValue = txtInput.value; // <-- to avoid dropDown to appear again. 
                                                          // for example imagine the array contains the following words: bee, beef, beetroot
                                                          // user has hit enter to get 'bee' it would be prompted with the dropDown again (as beef and beetroot also match)
                if (hasTextChanged) {
                    rs.onChange(txtInput.value); // <-- forcing it.
                }
            }
            return; 
        }
        
        if (keyCode == 13) {       // enter  (autocomplete triggered)
            if (txtHint.value.length == 0) { // if there is a hint
                rs.onEnter();
            } else {
                var wasDropDownHidden = (dropDown.style.visibility == 'hidden');
                dropDownController.hide();
                
                if (wasDropDownHidden) {
                    txtHint.value = txtInput.value; // ensure that no hint is left.
                    txtInput.focus();
                    rs.onEnter();    
                    return; 
                }
                
                txtInput.value = txtHint.value;
                var hasTextChanged = registerOnTextChangeOldValue != txtInput.value
                registerOnTextChangeOldValue = txtInput.value; // <-- to avoid dropDown to appear again. 
                                                          // for example imagine the array contains the following words: bee, beef, beetroot
                                                          // user has hit enter to get 'bee' it would be prompted with the dropDown again (as beef and beetroot also match)
                if (hasTextChanged) {
                    rs.onChange(txtInput.value); // <-- forcing it.
                }
                
            }
            return; 
        }
        
        if (keyCode == 40) {     // down
            var m = dropDownController.move(+1);
            if (m == '') { rs.onArrowDown(); }
            txtHint.value = leftSide+m;
            return; 
        } 
            
        if (keyCode == 38 ) {    // up
            var m = dropDownController.move(-1);
            if (m == '') { rs.onArrowUp(); }
            txtHint.value = leftSide+m;
            e.preventDefault();
            e.stopPropagation();
            return; 
        }
            
        // it's important to reset the txtHint on key down.
        // think: user presses a letter (e.g. 'x') and never releases... you get (xxxxxxxxxxxxxxxxx)
        // and you would see still the hint
        txtHint.value =''; // resets the txtHint. (it might be updated onKeyUp)
        
    };
    
    if (txtInput.addEventListener) {
        txtInput.addEventListener("keydown",  keyDownHandler, false);
    } else { // is this a fair assumption: that attachEvent will exist ?
        txtInput.attachEvent('onkeydown', keyDownHandler); // IE<9
    }
    return rs;
}
});

define('data_styles',["utils"], function(utils) {
    return { import_and_check: import_and_check,
	     text_for_data: text_for_data,
	     float_for_data: float_for_data,
	     reverse_flux_for_data: reverse_flux_for_data
	   };

    function import_and_check(data, styles, name) {
	if (data===null) return null;
	// make array
	if (!(data instanceof Array)) {
	    data = [data];
	}
	// check data
	var check = function() {
	    if (data===null)
		return null;
	    if (data.length==1)
		return null;
	    if (data.length==2) // && styles.indexOf('Diff')!=-1
		return null;
	    return console.warn('Bad data style: '+name);
	};
	check();
	data = utils.array_to_object(data);
	return data;
    }

    function float_for_data(d, styles, ignore_abs) {
	if (ignore_abs===undefined) ignore_abs = false;
	if (d===null) return null;
	var f = null;
	if (d.length==1) f = d[0];
	if (d.length==2) { // && styles.indexOf('Diff')!=-1) {
	    if (d[0]===null || d[1]===null) return null;
	    else f = d[1] - d[0];
	}
	if (styles.indexOf('abs')!=-1 && !ignore_abs) {
	    f = Math.abs(f);
	}
	return f;
    }

    function reverse_flux_for_data(d, styles) {
	if (d===null) return null;
	if (d.length==1)
	    return (d[0] <= 0);
	if (d.length==2) // && styles.indexOf('Diff')!=-1)
	    return ((d[1] - d[0]) <= 0);
	return true;
    }

    function text_for_data(d, styles) {
	if (d===null)
	    return null_or_d(null);
	var f = float_for_data(d, styles, true);
	if (d.length==1) {
	    var format = d3.format('.4g');
	    return null_or_d(f, format);
	}
	if (d.length==2) { // && styles.indexOf('Diff')!=-1) {
	    var format = d3.format('.3g'),
		t = null_or_d(d[0], format);
	    t += ', ' + null_or_d(d[1], format);
	    t += ': ' + null_or_d(f, format);
	    return t;
	}
	return '';

	// definitions
	function null_or_d(d, format) {
	    return d===null ? '(nd)' : format(d);
	}
    }
});



define('draw',['utils', 'data_styles'], function(utils, data_styles) {
    return { create_reaction: create_reaction,
	     update_reaction: update_reaction,
	     create_node: create_node,
	     update_node: update_node,
	     create_text_label: create_text_label,
	     update_text_label: update_text_label,
	     create_membrane: create_membrane,
	     update_membrane: update_membrane
	   };

    // definitions
    function turn_off_drag(sel) {
	sel.on('mousedown.drag', null);
	sel.on('touchstart.drag', null);
    }
    
    function create_membrane(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);
	enter_selection.append('rect')
	    .attr('class', 'membrane');
    }

    function update_membrane(update_selection) {
	utils.check_undefined(arguments, ['enter_selection']);
        update_selection
            .attr('width', function(d){ return d.width; })
            .attr('height', function(d){ return d.height; })
            .attr('transform', function(d){return 'translate('+d.x+','+d.y+')';})
            .style('stroke-width', function(d) { return 10; })
            .attr('rx', function(d){ return 20; })
            .attr('ry', function(d){ return 20; });
    }

    function create_reaction(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);
        // attributes for new reaction group

        var t = enter_selection.append('g')
                .attr('id', function(d) { return 'r'+d.reaction_id; })
                .attr('class', 'reaction')
                .call(create_reaction_label);
        return;
    }

    function update_reaction(update_selection, scale, drawn_nodes, show_beziers,
			     defs, default_reaction_color, has_reaction_data,
			     reaction_data_styles, bezier_drag_behavior,
			     label_drag_behavior) {
	utils.check_undefined(arguments,
			      ['update_selection', 'scale', 'drawn_nodes', 'show_beziers',
			       'defs', 'default_reaction_color', 'has_reaction_data',
			       'reaction_data_styles', 'bezier_drag_behavior',
			       'label_drag_behavior']);

        // update reaction label
        update_selection.select('.reaction-label')
            .call(function(sel) { return update_reaction_label(sel, has_reaction_data, 
							       reaction_data_styles,
							       label_drag_behavior); });

        // select segments
        var sel = update_selection
                .selectAll('.segment-group')
                .data(function(d) {
                    return utils.make_array(d.segments, 'segment_id');
                }, function(d) { return d.segment_id; });

        // new segments
        sel.enter().call(create_segment);

        // update segments
        sel.call(function(sel) { 
	    return update_segment(sel, scale, drawn_nodes, show_beziers, defs,
				  default_reaction_color,
				  has_reaction_data, reaction_data_styles,
				  bezier_drag_behavior);
	});

        // old segments
        sel.exit().remove();


	// new connect lines
	// var lines = sel
	// 	.selectAll('.connect-line')
	// 	.data(function(d) {
	// 	    var reaction_label_line, node,
	// 		reaction_d = this.parentNode.parentNode.parentNode.__data__;
	// 	    // node = (d.bezier==1 ? 
	// 	    // 	    drawn_nodes[segment_d.from_node_id] : 
	// 	    // 	    drawn_nodes[segment_d.to_node_id]);
	// 	    reaction_label_line = { x: d.x,
	// 				    y: d.y,
	// 				    source_x: node.x,
	// 				    source_y: node.y};
	// 	    return [reaction_label_line];
	// 	});
	// lines.enter().call(function(sel) {
	//     return create_reaction_label_line(sel);
	// });
	// // update reaction_label lines
	// lines.call(function(sel) { return update_reaction_label_line(sel); });
	// // remove
	// lines.exit().remove();

	// // definitions
	// function create_reaction_label_line(enter_selection) {
	//     enter_selection.append('path')
	//     	.attr('class', function(d) { return 'connect-line'; })
	//     	.attr('visibility', 'hidden');
	// }
	// function update_reaction_label_line(update_selection) {
	//     update_selection
	//     	.attr('d', function(d) {
	//     	    if (d.x==null || d.y==null || d.source_x==null || d.source_y==null)
	//     		return '';
	//     	    return 'M0, 0 '+(d.source_x-d.x)+','+(d.source_y-d.y);
	//     	});
	// }

    }

    function create_reaction_label(sel) {
	utils.check_undefined(arguments, ['sel']);
        /** Draw reaction label for selection.

	 */
	
        sel.append('text')
            .attr('class', 'reaction-label label')
	    .style('cursor', 'default');
	    // .on('mouseover', function(d) {
	    // 	d3.select(this).style('stroke-width', String(3)+'px');
	    // 	d3.select(this.parentNode)
	    // 	    .selectAll('.connect-line')
	    // 	    .attr('visibility', 'visible');
	    // })
	    // .on('mouseout', function(d) {
	    // 	d3.select(this).style('stroke-width', String(1)+'px');
	    // 	d3.select(this.parentNode)
	    // 	    .selectAll('.connect-line')
	    // 	    .attr('visibility', 'hidden');
	    // });

    }

    function update_reaction_label(sel, has_reaction_data, reaction_data_styles,
				   label_drag_behavior, drawn_nodes) {
	utils.check_undefined(arguments, ['sel',
					  'has_reaction_data',
					  'reaction_data_styles',
					  'label_drag_behavior']);
	
	var decimal_format = d3.format('.4g');
	sel.text(function(d) { 
	    var t = d.bigg_id;
	    if (has_reaction_data && reaction_data_styles.indexOf('text') != -1)
		t += ' ' + d.data_string;
	    return t;
	}).attr('transform', function(d) {
	    return 'translate('+d.label_x+','+d.label_y+')';
	}).style('font-size', function(d) {
	    return String(30)+'px';
        })
	    .call(turn_off_drag)
	    .call(label_drag_behavior);
    }

    function create_segment(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);

        // create segments
        var g = enter_selection
                .append('g')
                .attr('class', 'segment-group')
                .attr('id', function(d) { return 's'+d.segment_id; });

        // create reaction arrow
        g.append('path')
            .attr('class', 'segment');

	g.append('g')
	    .attr('class', 'arrowheads');

	g.append('g')
	    .attr('class', 'beziers');
    }
    
    function update_segment(update_selection, scale, drawn_nodes, show_beziers, 
			    defs, default_reaction_color,
			    has_reaction_data, reaction_data_styles,
			    bezier_drag_behavior) {
	utils.check_undefined(arguments, ['update_selection', 'scale', 'drawn_nodes',
					  'show_beziers', 'defs',
					  'default_reaction_color',
					  'has_reaction_data',
					  'reaction_data_styles',
					  'bezier_drag_behavior']);

        // update segment attributes
	var get_disp = function(reversibility, coefficient) {
	    return (reversibility || coefficient > 0) ? 32 : 20;
	};
        // update arrows
        update_selection
            .selectAll('.segment')
            .datum(function() {
                return this.parentNode.__data__;
            })
            .attr('d', function(d) {
		if (d.from_node_id==null || d.to_node_id==null)
		    return null;
		var start = drawn_nodes[d.from_node_id],
		    end = drawn_nodes[d.to_node_id],
		    b1 = d.b1,
		    b2 = d.b2;
		// if metabolite, then displace the arrow
		if (start['node_type']=='metabolite' && b1!==null) {
		    var disp = get_disp(d.reversibility, d.from_node_coefficient);
		    var direction = (b1 === null) ? end : b1;
		    start = displaced_coords(disp, start, direction, 'start');
		}
		if (end['node_type']=='metabolite') {
		    var disp = get_disp(d.reversibility, d.to_node_coefficient);
		    var direction = (b2 === null) ? start : b2;
		    end = displaced_coords(disp, direction, end, 'end');
		}
		var curve = ('M'+start.x+','+start.y+' ');
		if (b1 !== null && b2 !== null) {
		    curve += ('C'+b1.x+','+b1.y+' '+
                              b2.x+','+b2.y+' ');
		}
		curve += (end.x+','+end.y);
		return curve;
            })
            .style('stroke', function(d) {
		if (has_reaction_data && reaction_data_styles.indexOf('color')!==-1) {
		    var f = d.data;
		    return scale.reaction_color(f===null ? 0 : f);
		} else {
		    return default_reaction_color;
		}
	    })
	    .style('stroke-width', function(d) {
		if (has_reaction_data && reaction_data_styles.indexOf('size')!==-1) {
		    var f = d.data;
		    return scale.reaction_size(f===null ? 0 : f);
		} else {
		    return scale.reaction_size(0);
		}
            });

	// new arrowheads
	var arrowheads = update_selection.select('.arrowheads')
	    .selectAll('.arrowhead')
	    .data(function (d) {
		var arrowheads = [],
		    reaction_id = this.parentNode.parentNode.parentNode.__data__.reaction_id,
		    segment_id = this.parentNode.parentNode.__data__.segment_id;		
		var start = drawn_nodes[d.from_node_id],
		    b1 = d.b1;
		if (start.node_type=='metabolite' && (d.reversibility || d.from_node_coefficient > 0)) {
		    var disp = get_disp(d.reversibility, d.from_node_coefficient),
			direction = (b1 === null) ? end : b1;
		    var rotation = utils.to_degrees(utils.get_angle([start, direction])) + 90;
		    start = displaced_coords(disp, start, direction, 'start');
		    arrowheads.push({ data: d.data,
				      x: start.x,
				      y: start.y,
				      rotation: rotation,
				      show_arrowhead_flux: (((d.from_node_coefficient < 0)==(d.reverse_flux))
							    || d.data==0)
				    });
		}
		var end = drawn_nodes[d.to_node_id],
		    b2 = d.b2;
		if (end.node_type=='metabolite' && (d.reversibility || d.to_node_coefficient > 0)) {
		    var disp = get_disp(d.reversibility, d.to_node_coefficient),
			direction = (b2 === null) ? start : b2,
			rotation = utils.to_degrees(utils.get_angle([end, direction])) + 90;
		    end = displaced_coords(disp, direction, end, 'end');
		    arrowheads.push({ data: d.data,
				      x: end.x,
				      y: end.y,
				      rotation: rotation,
				      show_arrowhead_flux: (((d.to_node_coefficient < 0)==(d.reverse_flux))
							    || d.data==0)
				    });
		}
		return arrowheads;
	    });
	arrowheads.enter().append('path')
	    .classed('arrowhead', true);
	// update arrowheads
	arrowheads.attr('d', function(d) {
	    var markerWidth = 20, markerHeight = 13;
	    if (has_reaction_data && reaction_data_styles.indexOf('size')!==-1) {
		var f = d.data;
		markerWidth += (scale.reaction_size(f) - scale.reaction_size(0));
	    }		    
	    return 'M'+[-markerWidth/2, 0]+' L'+[0, markerHeight]+' L'+[markerWidth/2, 0]+' Z';
	}).attr('transform', function(d) {
	    return 'translate('+d.x+','+d.y+')rotate('+d.rotation+')';
	}).attr('fill', function(d) {
	    if (has_reaction_data && reaction_data_styles.indexOf('color')!==-1) {
		if (d.show_arrowhead_flux) {
		    // show the flux
		    var f = d.data;
		    return scale.reaction_color(f===null ? 0 : f);
		} else {
		    // if the arrowhead is not filled because it is reversed
		    return '#FFFFFF';
		}
	    }
	    // default fill color
	    return default_reaction_color;
	}).attr('stroke', function(d) {
	    if (has_reaction_data && reaction_data_styles.indexOf('color')!==-1) {
		// show the flux color in the stroke whether or not the fill is present
		var f = d.data;
		return scale.reaction_color(f===null ? 0 : f);
	    }
	    // default stroke color
	    return default_reaction_color;
	});;
	// remove
	arrowheads.exit().remove();

	// new bezier points
	var bez = update_selection.select('.beziers')
		.selectAll('.bezier-group')
		.data(function(d) {
		    var beziers = [],
			reaction_id = this.parentNode.parentNode.parentNode.__data__.reaction_id,
			segment_id = this.parentNode.parentNode.__data__.segment_id;
		    //TODO fix; this is a bit of a hack
		    if (d.b1!=null && d.b1.x!=null && d.b1.y!=null)
			beziers.push({bezier: 1,
				      x: d.b1.x,
				      y: d.b1.y,
				      reaction_id: reaction_id,
				      segment_id: segment_id });
		    if (d.b2!=null && d.b2.x!=null && d.b2.y!=null)
			beziers.push({bezier: 2,
				      x: d.b2.x,
				      y: d.b2.y,
				      reaction_id: reaction_id,
				      segment_id: segment_id });
		    return beziers;
		}, function(d) { return d.bezier; });
	bez.enter().call(function(sel) {
	    return create_bezier(sel);
	});
	// update bezier points
	bez.call(function(sel) {
	    return update_bezier(sel, show_beziers, bezier_drag_behavior, drawn_nodes);
	});
	// remove
	bez.exit().remove();

	// definitions
	function create_bezier(enter_selection) {
	    utils.check_undefined(arguments, ['enter_selection']);

	    var g = enter_selection.append('g')
	    	.attr('class', function(d) { return 'bezier-group'; });
	    g.append('circle')
	    	.attr('class', function(d) { return 'bezier bezier'+d.bezier; })
	    	.style('stroke-width', String(1)+'px')	
    		.attr('r', String(7)+'px')
		.on('mouseover', function(d) {
		    d3.select(this).style('stroke-width', String(3)+'px');
		    d3.select(this.parentNode.parentNode)
			.selectAll('.connect-line')
			.attr('visibility', 'visible');
		})
		.on('mouseout', function(d) {
		    d3.select(this).style('stroke-width', String(1)+'px');
		    d3.select(this.parentNode.parentNode)
			.selectAll('.connect-line')
			.attr('visibility', 'hidden');
		});
	}
	function update_bezier(update_selection, show_beziers, drag_behavior,
			       drawn_nodes) {
	    utils.check_undefined(arguments, ['update_selection', 'show_beziers',
					      'drag_behavior', 'drawn_nodes']);
	    
	    update_selection
		.call(turn_off_drag)
		.call(drag_behavior);
	    if (!show_beziers) {
	    	update_selection.attr('visibility', 'hidden');
		return;
	    }		
	    
	    // draw bezier points
	    update_selection
		.attr('visibility', 'visible')
		.attr('transform', function(d) {
	    	    if (d.x==null || d.y==null) return ''; 
		    return 'translate('+d.x+','+d.y+')';
		});

	    // new bezier lines
	    var bez_lines = update_selection
		    .selectAll('.connect-line')
		    .data(function(d) {
			var bezier_line, node,
			    segment_d = this.parentNode.parentNode.parentNode.__data__;
			node = (d.bezier==1 ? 
				drawn_nodes[segment_d.from_node_id] : 
				drawn_nodes[segment_d.to_node_id]);
			bezier_line = { x: d.x,
					y: d.y,
					source_x: node.x,
					source_y: node.y};
			return [bezier_line];
		    });
	    bez_lines.enter().call(function(sel) {
		return create_bezier_line(sel);
	    });
	    // update bezier lines
	    bez_lines.call(function(sel) { return update_bezier_line(sel); });
	    // remove
	    bez_lines.exit().remove();

	    // definitions
	    function create_bezier_line(enter_selection) {
		enter_selection.append('path')
	    	    .attr('class', function(d) { return 'connect-line'; })
	    	    .attr('visibility', 'hidden');
	    }
	    function update_bezier_line(update_selection) {
		update_selection
	    	    .attr('d', function(d) {
	    		if (d.x==null || d.y==null || d.source_x==null || d.source_y==null)
	    		    return '';
	    		return 'M0, 0 '+(d.source_x-d.x)+','+(d.source_y-d.y);
	    	    });
	    }
	}
    }

    function create_node(enter_selection, drawn_nodes, drawn_reactions) {
	utils.check_undefined(arguments,
			      ['enter_selection', 'drawn_nodes',
			       'drawn_reactions']);

        // create nodes
        var g = enter_selection
                .append('g')
                .attr('class', 'node')
                .attr('id', function(d) { return 'n'+d.node_id; });

        // create metabolite circle and label
        g.append('circle')
	    .attr('class', function(d) {
		if (d.node_type=='metabolite') return 'node-circle metabolite-circle';
		else return 'node-circle';
	    });
            // .style('stroke-width', '2px');

        g.filter(function(d) { return d.node_type=='metabolite'; })
	    .append('text')
	    .attr('class', 'node-label label')
	    .style('cursor', 'default');
    }

    function update_node(update_selection, scale, has_metabolite_data, metabolite_data_styles,
			 click_fn, mouseover_fn, mouseout_fn, drag_behavior, label_drag_behavior) {
	utils.check_undefined(arguments,
			      ['update_selection', 'scale', 'has_metabolite_data',
			       'metabolite_data_styles', 'click_fn', 'mouseover_fn', 'mouseout_fn',
			       'drag_behavior', 'label_drag_behavior']);

        // update circle and label location
        var mg = update_selection
                .select('.node-circle')
                .attr('transform', function(d) {
                    return 'translate('+d.x+','+d.y+')';
                })
		.attr('r', function(d) {
		    if (d.node_type == 'metabolite') {
			if (has_metabolite_data && metabolite_data_styles.indexOf('size')!==-1) {
			    var f = d.data;
			    return scale.metabolite_size(f===null ? 0 : f);
			} else {
			    return d.node_is_primary ? 15 : 10; 
			}
		    } else {
			return 5;
		    }
		})
		.style('fill', function(d) {
		    if (d.node_type=='metabolite') {
			if (has_metabolite_data && metabolite_data_styles.indexOf('color')!==-1) {
			    var f = d.data;
			    return scale.metabolite_color(f===null ? 0 : f);
			} else {
			    return 'rgb(224, 134, 91)';
			}
		    }
		    return null;
		})
		.call(turn_off_drag)
		.call(drag_behavior)
		.on('click', click_fn)
		.on('mouseover', mouseover_fn)
		.on('mouseout', mouseout_fn);

        update_selection
            .select('.node-label')
            .attr('transform', function(d) {
                return 'translate('+d.label_x+','+d.label_y+')';
            })
            .style('font-size', function(d) {
		return String(20)+'px';
            })
            .text(function(d) {	
		var t = d.bigg_id;
		if (has_metabolite_data && metabolite_data_styles.indexOf('text') != -1)
		    t += ' ' + d.data_string;
		return t;
	    })
	    .call(turn_off_drag)
	    .call(label_drag_behavior);
    }

    function create_text_label(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);

	enter_selection.append('text')
	    .attr('class', 'text-label label')
	    .style('cursor', 'default')
	    .text(function(d) { return d.text; });
    }

    function update_text_label(update_selection, label_click, label_drag_behavior) {
	utils.check_undefined(arguments, ['update_selection', 'label_click', 'label_drag_behavior']);

        update_selection
            .attr('transform', function(d) { return 'translate('+d.x+','+d.y+')';})
	    .on('click', label_click)
	    .call(turn_off_drag)
	    .call(label_drag_behavior);
    }

    function displaced_coords(reaction_arrow_displacement, start, end, displace) {
	utils.check_undefined(arguments, ['reaction_arrow_displacement', 'start', 'end', 'displace']);

	var length = reaction_arrow_displacement,
	    hyp = utils.distance(start, end),
	    new_x, new_y;
	if (!length || !hyp) console.error('Bad value');
	if (displace=='start') {
	    new_x = start.x + length * (end.x - start.x) / hyp,
	    new_y = start.y + length * (end.y - start.y) / hyp;
	} else if (displace=='end') {
	    new_x = end.x - length * (end.x - start.x) / hyp,
	    new_y = end.y - length * (end.y - start.y) / hyp;
	} else { console.error('bad displace value: ' + displace); }
	return {x: new_x, y: new_y};
    }
});

define('build',["utils"], function(utils) {
    return { new_reaction: new_reaction,
	     rotate_nodes: rotate_nodes,
	     move_node_and_dependents: move_node_and_dependents };
    
    // definitions
    function new_reaction(bigg_id, cobra_reaction, cobra_metabolites,
			  selected_node_id, selected_node,
			  largest_ids, cofactors, angle) {
        /** New reaction.

	 angle: clockwise from 'right', in degrees

	 */
	
	// rotate the new reaction around the selected metabolite
	// convert to radians
	angle = Math.PI / 180 * angle;

	// generate a new integer id
	var new_reaction_id = String(++largest_ids.reactions);

        // calculate coordinates of reaction
	var selected_node_coords = { x: selected_node.x,
				     y: selected_node.y };
		
	// rotate main axis around angle with distance
	var reaction_length = 300,
            main_axis = [ selected_node_coords,
			  utils.c_plus_c(selected_node_coords,
					 {'x': reaction_length, 'y': 0}) ],
	    center = { 'x': (main_axis[0].x + main_axis[1].x)/2,  
                       'y': (main_axis[0].y + main_axis[1].y)/2 };
	    
	// relative label location
	var label_d;
	if (Math.abs(angle) < Math.PI/4 ||
	    Math.abs(angle - Math.PI) < Math.PI/4 ) {
	    label_d = { x: -50, y: -40 };
	} else {
	    label_d = { x: 30, y: 10 };
	}

	// relative anchor node distance
	var anchor_distance = 20;

	// new reaction structure
	var new_reaction = { bigg_id: bigg_id,
			     reversibility: cobra_reaction.reversibility,
			     metabolites: utils.clone(cobra_reaction.metabolites),
			     label_x: center.x + label_d.x,
			     label_y: center.y + label_d.y,
			     name: cobra_reaction.name,
			     segments: {} };

        // set primary metabolites and count reactants/products

	// look for the selected metabolite, and record the indices
	var reactant_ranks = [], product_ranks = [], 
            reactant_count = 0, product_count = 0,
	    reaction_is_reversed = false;
        for (var met_bigg_id in new_reaction.metabolites) {	
	    // make the metabolites into objects
            var metabolite = cobra_metabolites[met_bigg_id],
		coefficient = new_reaction.metabolites[met_bigg_id],
		formula = metabolite.formula,
		new_metabolite = { coefficient: coefficient,
				   bigg_id: met_bigg_id,
				   name: metabolite.name };
	    if (coefficient < 0) {
                new_metabolite.index = reactant_count;
		// score the metabolites. Infinity == selected, >= 1 == carbon containing
		var carbons = /C([0-9]+)/.exec(formula);
		if (selected_node.bigg_id==new_metabolite.bigg_id) {
		    reactant_ranks.push([new_metabolite.index, Infinity]);
		} else if (carbons && cofactors.indexOf(utils.decompartmentalize(new_metabolite.bigg_id)[0])==-1) {
		    reactant_ranks.push([new_metabolite.index, parseInt(carbons[1])]);
		}
                reactant_count++;
	    } else {
                new_metabolite.index = product_count;
		var carbons = /C([0-9]+)/.exec(formula);
		if (selected_node.bigg_id==new_metabolite.bigg_id) {
		    product_ranks.push([new_metabolite.index, Infinity]);
		    reaction_is_reversed = true;
		} else if (carbons && cofactors.indexOf(utils.decompartmentalize(new_metabolite.bigg_id)[0])==-1) {
		    product_ranks.push([new_metabolite.index, parseInt(carbons[1])]);
		}
                product_count++;
	    }
	    new_reaction.metabolites[met_bigg_id] = new_metabolite;
	}

	// get the rank with the highest score
	var max_rank = function(old, current) { return current[1] > old[1] ? current : old; },
            primary_reactant_index = reactant_ranks.reduce(max_rank, [0,0])[0],
            primary_product_index = product_ranks.reduce(max_rank, [0,0])[0];

	// set primary metabolites, and keep track of the total counts
        for (var met_bigg_id in new_reaction.metabolites) {
            var metabolite = new_reaction.metabolites[met_bigg_id];
            if (metabolite.coefficient < 0) {
                if (metabolite.index==primary_reactant_index) metabolite.is_primary = true;
		metabolite.count = reactant_count + 1;
            } else {
                if (metabolite.index==primary_product_index) metabolite.is_primary = true;
		metabolite.count = product_count + 1;
            }
        }

	// generate anchor nodes
	var new_anchors = {},
	    anchors = [ { node_type: 'anchor_reactants',
			  dis: { x: anchor_distance * (reaction_is_reversed ? 1 : -1), y: 0 } },
			{ node_type: 'center',
			  dis: { x: 0, y: 0 } },
			{ node_type: 'anchor_products',
			  dis: { x: anchor_distance * (reaction_is_reversed ? -1 : 1), y: 0 } } ],
	    anchor_ids = {};
	anchors.map(function(n) {
	    var new_id = String(++largest_ids.nodes),
		general_node_type = (n.node_type=='center' ? 'midmarker' : 'multimarker');
	    new_anchors[new_id] = { node_type: general_node_type,
				    x: center.x + n.dis.x,
				    y: center.y + n.dis.y,
				    connected_segments: [],
				    name: null,
				    bigg_id: null,
				    label_x: null,
				    label_y: null,
				    node_is_primary: null };
	    anchor_ids[n.node_type] = new_id;
	});

	// add the segments, outside to inside
	var new_anchor_groups = [ [ anchor_ids['anchor_reactants'], anchor_ids['center'] ],
				  [ anchor_ids['anchor_products'],  anchor_ids['center'] ] ];
	new_anchor_groups.map(function(l) {
	    var from_id = l[0], to_id = l[1],
		new_segment_id = String(++largest_ids.segments);
	    new_reaction.segments[new_segment_id] =  { b1: null,
						       b2: null,
						       from_node_id: from_id,
						       to_node_id: to_id,
						       from_node_coefficient: null,
						       to_node_coefficient: null,
						       reversibility: new_reaction.reversibility };
	    new_anchors[from_id].connected_segments.push({ segment_id: new_segment_id,
							   reaction_id: new_reaction_id });
	    new_anchors[to_id].connected_segments.push({ segment_id: new_segment_id,
							 reaction_id: new_reaction_id });
	});

        // Add the metabolites, keeping track of total reactants and products.
	var new_nodes = new_anchors;
        for (var met_bigg_id in new_reaction.metabolites) {
            var metabolite = new_reaction.metabolites[met_bigg_id],
		primary_index, from_node_id;
            if (metabolite.coefficient < 0) {
                // metabolite.count = reactant_count + 1;
                primary_index = primary_reactant_index;
		from_node_id = anchor_ids['anchor_reactants'];
            } else {
                // metabolite.count = product_count + 1;
                primary_index = primary_product_index;
		from_node_id = anchor_ids['anchor_products'];
            }
	    
            // calculate coordinates of metabolite components
            var met_loc = calculate_new_metabolite_coordinates(metabolite,
							       primary_index,
							       main_axis,
							       center,
							       reaction_length,
							       reaction_is_reversed);

	    // if this is the existing metabolite
	    if (selected_node.bigg_id==metabolite.bigg_id) {
		var new_segment_id = String(++largest_ids.segments);
		new_reaction.segments[new_segment_id] = { b1: met_loc.b1,
							  b2: met_loc.b2,
							  from_node_id: from_node_id,
							  to_node_id: selected_node_id,
							  from_node_coefficient: null,
							  to_node_coefficient: metabolite.coefficient,
							  reversibility: new_reaction.reversibility };
		// update the existing node
		selected_node.connected_segments.push({ segment_id: new_segment_id,
							reaction_id: new_reaction_id });
		new_nodes[from_node_id].connected_segments.push({ segment_id: new_segment_id,
								  reaction_id: new_reaction_id });
	    } else {
		// save new metabolite
		var new_segment_id = String(++largest_ids.segments),
		    new_node_id = String(++largest_ids.nodes);
		new_reaction.segments[new_segment_id] = { b1: met_loc.b1,
							  b2: met_loc.b2,
							  from_node_id: from_node_id,
							  to_node_id: new_node_id,
							  from_node_coefficient: null,
							  to_node_coefficient: metabolite.coefficient,
							  reversibility: new_reaction.reversibility };
		// save new node
		new_nodes[new_node_id] = { connected_segments: [{ segment_id: new_segment_id,
								  reaction_id: new_reaction_id }],
					   x: met_loc.circle.x,
					   y: met_loc.circle.y,
					   node_is_primary: Boolean(metabolite.is_primary),
					   label_x: met_loc.circle.x + label_d.x,
					   label_y: met_loc.circle.y + label_d.y,
					   name: metabolite.name,
					   bigg_id: metabolite.bigg_id,
					   node_type: 'metabolite' };
		new_nodes[from_node_id].connected_segments.push({ segment_id: new_segment_id,
								  reaction_id: new_reaction_id });
	    }
	}

	// now take out the extra reaction details
	for (var bigg_id in new_reaction.metabolites) {
	    new_reaction.metabolites[bigg_id] = {
		coefficient: new_reaction.metabolites[bigg_id].coefficient
	    };
	}

	// new_reactions object
	var new_reactions = {};
	new_reactions[new_reaction_id] = new_reaction;
	
	// add the selected node for rotation, and return it as a new (updated) node
	new_nodes[selected_node_id] = selected_node;
	var updated = rotate_nodes(new_nodes, new_reactions,
				   angle, selected_node_coords);

	return { new_reactions: new_reactions,
		 new_nodes: new_nodes };
    }

    function rotate_nodes(selected_nodes, reactions, angle, center) {
	/** Rotate the nodes around center.

	 selected_nodes: Nodes to rotate.
	 reactions: Only updates beziers for these reactions.
	 angle: Angle to rotate in radians.
	 center: Point to rotate around.

	 */
	
	// functions
	var rotate_around = function(coord) {
	    if (coord === null)
		return null;
	    return utils.rotate_coords(coord, angle, center);
	};

	// recalculate: node
	var updated_node_ids = [], updated_reaction_ids = [];
	for (var node_id in selected_nodes) {
	    var node = selected_nodes[node_id],
		// rotation distance
		displacement = rotate_around({ x: node.x, y: node.y }),
		// move the node
		updated = move_node_and_labels(node, reactions,
						   displacement);
	    // move the bezier points
	    node.connected_segments.map(function(segment_obj) {
		var reaction = reactions[segment_obj.reaction_id];
		// If the reaction was not passed in the reactions argument, then ignore
		if (reaction === undefined) return;

		// rotate the beziers
		var segment = reaction.segments[segment_obj.segment_id];
		if (segment.to_node_id==node_id && segment.b2) {
		    var displacement = rotate_around(segment.b2);
		    segment.b2 = utils.c_plus_c(segment.b2, displacement);
		} else if (segment.from_node_id==node_id && segment.b1) {
		    var displacement = rotate_around(segment.b1);
		    segment.b1 = utils.c_plus_c(segment.b1, displacement);
		}
	    });

	    updated_reaction_ids = utils.unique_concat([updated_reaction_ids,
							updated.reaction_ids]);
	    updated_node_ids.push(node_id);
	}

	return { node_ids: updated_node_ids,
		 reaction_ids: updated_reaction_ids };
    }
    
    function move_node_and_dependents(node, node_id, reactions, displacement) {
	/** Move the node and its labels and beziers.

	 */
	var updated = move_node_and_labels(node, reactions, displacement);

	// move beziers
	node.connected_segments.map(function(segment_obj) {
	    var reaction = reactions[segment_obj.reaction_id];
	    // If the reaction was not passed in the reactions argument, then ignore
	    if (reaction === undefined) return;

	    // update beziers
	    var segment = reaction.segments[segment_obj.segment_id];
	    if (segment.from_node_id==node_id && segment.b1) {
		segment.b1 = utils.c_plus_c(segment.b1, displacement);
	    }
	    if (segment.to_node_id==node_id && segment.b2) {
		segment.b2 = utils.c_plus_c(segment.b2, displacement);
	    }
	    // add to list of updated reaction ids if it isn't already there
	    if (updated.reaction_ids.indexOf(segment_obj.reaction_id) < 0) {
	        updated.reaction_ids.push(segment_obj.reaction_id);
	    }
	});
	return updated;
    }

    function move_node_and_labels(node, reactions, displacement) {
	node.x = node.x + displacement.x;
	node.y = node.y + displacement.y;
	    
	// recalculate: node label
	node.label_x = node.label_x + displacement.x;
	node.label_y = node.label_y + displacement.y;

	// recalculate: reaction label
	var updated_reaction_ids = [];
	node.connected_segments.map(function(segment_obj) {
	    var reaction = reactions[segment_obj.reaction_id];
	    // add to list of updated reaction ids if it isn't already there
	    if (updated_reaction_ids.indexOf(segment_obj.reaction_id) < 0) {
		updated_reaction_ids.push(segment_obj.reaction_id);

		// update reaction label (but only once per reaction
		if (node.node_type == 'midmarker') {
		    reaction.label_x = reaction.label_x + displacement.x;
		    reaction.label_y = reaction.label_y + displacement.y;
		}
	    }
	});
	return { reaction_ids: updated_reaction_ids };
    }

    function calculate_new_metabolite_coordinates(met, primary_index, main_axis, center, dis, is_reversed) {
	/** Calculate metabolite coordinates for a new reaction metabolite.

	 */
	// new local coordinate system
	var displacement = main_axis[0],
	    main_axis = [utils.c_minus_c(main_axis[0], displacement),
			 utils.c_minus_c(main_axis[1], displacement)],
	    center = utils.c_minus_c(center, displacement);
	
        // Curve parameters
        var w = 80,  // distance between reactants and between products
            b1_strength = 0.4,
            b2_strength = 0.25,
            w2 = w*0.7,
            secondary_dis = 40,
            num_slots = Math.min(2, met.count - 1);

        // size and spacing for primary and secondary metabolites
        var ds, draw_at_index, r;
        if (met.is_primary) { // primary
            ds = 20;
        } else { // secondary
            ds = 10;
            // don't use center slot
            if (met.index > primary_index) draw_at_index = met.index - 1;
            else draw_at_index = met.index;
        }

        var de = dis - ds, // distance between ends of line axis
            reaction_axis = [{'x': ds, 'y': 0},
                             {'x': de, 'y': 0}];

        // Define line parameters and axis.
        // Begin with unrotated coordinate system. +y = Down, +x = Right. 
        var end, circle, b1, b2;
        // reactants
        if (((met.coefficient < 0) != is_reversed) && met.is_primary) { // Ali == BADASS
            end = {'x': reaction_axis[0].x,
                   'y': reaction_axis[0].y};
            b1 = {'x': center.x*(1-b1_strength) + reaction_axis[0].x*b1_strength,
                  'y': center.y*(1-b1_strength) + reaction_axis[0].y*b1_strength};
            b2 = {'x': center.x*b2_strength + (end.x)*(1-b2_strength),
                  'y': center.y*b2_strength + (end.y)*(1-b2_strength)},
            circle = {'x': main_axis[0].x,
                      'y': main_axis[0].y};
        } else if ((met.coefficient < 0) != is_reversed) {
	    end = {'x': reaction_axis[0].x + secondary_dis,
                   'y': reaction_axis[0].y + (w2*draw_at_index - w2*(num_slots-1)/2)},
            b1 = {'x': center.x*(1-b1_strength) + reaction_axis[0].x*b1_strength,
                  'y': center.y*(1-b1_strength) + reaction_axis[0].y*b1_strength},
            b2 = {'x': center.x*b2_strength + end.x*(1-b2_strength),
                  'y': center.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[0].x + secondary_dis,
                      'y': main_axis[0].y + (w*draw_at_index - w*(num_slots-1)/2)};
        } else if (((met.coefficient > 0) != is_reversed) && met.is_primary) {        // products
            end = {'x': reaction_axis[1].x,
                   'y': reaction_axis[1].y};
            b1 = {'x': center.x*(1-b1_strength) + reaction_axis[1].x*b1_strength,
                  'y': center.y*(1-b1_strength) + reaction_axis[1].y*b1_strength};
            b2 = {'x': center.x*b2_strength + end.x*(1-b2_strength),
                  'y': center.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x,
                      'y': main_axis[1].y};
        } else if ((met.coefficient > 0) != is_reversed) {
            end = {'x': reaction_axis[1].x - secondary_dis,
                   'y': reaction_axis[1].y + (w2*draw_at_index - w2*(num_slots-1)/2)},
            b1 = {'x': center.x*(1-b1_strength) + reaction_axis[1].x*b1_strength,
                  'y': center.y*(1-b1_strength) + reaction_axis[1].y*b1_strength};
            b2 = {'x': center.x*b2_strength + end.x*(1-b2_strength),
                  'y': center.y*b2_strength + end.y*(1-b2_strength)},
            circle = {'x': main_axis[1].x - secondary_dis,
                      'y': main_axis[1].y + (w*draw_at_index - w*(num_slots-1)/2)};
        }
	var loc = {};
	loc.b1 = utils.c_plus_c(displacement, b1);
	loc.b2 = utils.c_plus_c(displacement, b2);
	loc.circle = utils.c_plus_c(displacement, circle);
        return loc;
    }
});

define('Behavior',["utils", "build"], function(utils, build) {
    /** Defines the set of click and drag behaviors for the map, and keeps track
     of which behaviors are activated.

     Has the following attributes:

     Behavior.rotation_drag:

     Behavior.selectable_click:

     Behavior.node_mouseover:

     Behavior.node_mouseout:

     Behavior.selectable_drag:

     Behavior.bezier_drag:

     Behavior.reaction_label_drag:

     Behavior.node_label_drag:

     */

    var Behavior = utils.make_class();
    Behavior.prototype = { init: init,
			   toggle_rotation_mode: toggle_rotation_mode,
			   turn_everything_on: turn_everything_on,
			   turn_everything_off: turn_everything_off,
			   toggle_selectable_click: toggle_selectable_click,
			   toggle_selectable_drag: toggle_selectable_drag,
			   toggle_label_drag: toggle_label_drag,
			   get_selectable_drag: get_selectable_drag,
			   get_bezier_drag: get_bezier_drag,
			   get_reaction_label_drag: get_reaction_label_drag,
			   get_node_label_drag: get_node_label_drag,
			   get_generic_drag: get_generic_drag,
			   get_generic_angular_drag: get_generic_angular_drag };

    return Behavior;

    // definitions
    function init(map, undo_stack) {
	this.map = map;
	this.undo_stack = undo_stack;

	// make an empty function that can be called as a behavior and does nothing
	this.empty_behavior = function() {};

	// rotation mode operates separately from the rest
	this.rotation_mode_enabled = false;
	this.rotation_drag = d3.behavior.drag();

	// init empty
	this.selectable_click = null;
	this.node_mouseover = null;
	this.node_mouseout = null;
	this.selectable_drag = this.empty_behavior;
	this.bezier_drag = this.empty_behavior;
	this.reaction_label_drag = this.empty_behavior;
	this.node_label_drag = this.empty_behavior;
	this.turn_everything_on();
    }
    function turn_everything_on() {
	/** Toggle everything except rotation mode.

	 */
	this.toggle_selectable_click(true);
	this.toggle_selectable_drag(true);
	this.toggle_label_drag(true);
    }
    function turn_everything_off() {
	/** Toggle everything except rotation mode.

	 */
	this.toggle_selectable_click(false);
	this.toggle_selectable_drag(false);
	this.toggle_label_drag(false);
    }

    function toggle_rotation_mode(on_off) {
	/** Listen for rotation, and rotate selected nodes.

	 */
	if (on_off===undefined) {
	    this.rotation_mode_enabled = !this.rotation_mode_enabled;
	} else {
	    this.rotation_mode_enabled = on_off;
	}

	var selection_node = this.map.sel.selectAll('.node-circle'),
	    selection_background = this.map.sel.selectAll('#canvas');

	if (this.rotation_mode_enabled) {
	    this.map.callback_manager.run('start_rotation');
	    
	    var selected_nodes = this.map.get_selected_nodes();
	    if (Object.keys(selected_nodes).length == 0) {
		console.log('No selected nodes');
		return;
	    }
	    
	    // show center
	    this.center = average_location(selected_nodes);
	    show_center.call(this);

	    // this.set_status('Drag to rotate.');
	    var map = this.map,
		selected_node_ids = Object.keys(selected_nodes),
		reactions = this.map.reactions,
		nodes = this.map.nodes;

	    var start_fn = function(d) {
		// silence other listeners
		d3.event.sourceEvent.stopPropagation();
	    },
		drag_fn = function(d, angle, total_angle, center) {
		    var updated = build.rotate_nodes(selected_nodes, reactions,
						     angle, center);
		    map.draw_these_nodes(updated.node_ids);
		    map.draw_these_reactions(updated.reaction_ids);
		},
		end_fn = function(d) {},
		undo_fn = function(d, total_angle, center) {
		    // undo
		    var these_nodes = {};
		    selected_node_ids.forEach(function(id) { 
			these_nodes[id] = nodes[id];
		    });
		    var updated = build.rotate_nodes(these_nodes, reactions,
						     -total_angle, center);
		    map.draw_these_nodes(updated.node_ids);
		    map.draw_these_reactions(updated.reaction_ids);
		},
		redo_fn = function(d, total_angle, center) {
		    // redo
		    var these_nodes = {};
		    selected_node_ids.forEach(function(id) {
			these_nodes[id] = nodes[id];
		    });
		    var updated = build.rotate_nodes(these_nodes, reactions,
						     total_angle, center);
		    map.draw_these_nodes(updated.node_ids);
		    map.draw_these_reactions(updated.reaction_ids);
		},
		center_fn = function() {
		    return this.center;
		}.bind(this);
	    this.rotation_drag = this.get_generic_angular_drag(start_fn, drag_fn, end_fn,
							       undo_fn, redo_fn, center_fn,
							       this.map.sel);
	    selection_background.call(this.rotation_drag);


	} else {
	    // turn off all listeners
	    hide_center.call(this);
	    selection_node.on('mousedown.center', null);
	    selection_background.on('mousedown.center', null);
	    selection_background.on('mousedown.drag', null);
	    selection_background.on('touchstart.drag', null);
	    this.rotation_drag = null;
	}

	// definitions
	function show_center() {
	    var s = this.map.sel.selectAll('#rotation-center')
		    .data([0]),
		enter = s.enter()
		    .append('g').attr('id', 'rotation-center');
	    
	    enter.append('path').attr('d', 'M-22 0 L22 0')
		.attr('class', 'rotation-center-line');
	    enter.append('path').attr('d', 'M0 -22 L0 22')
		.attr('class', 'rotation-center-line');

	    s.attr('transform', 'translate('+this.center.x+','+this.center.y+')')
		.attr('visibility', 'visible');

	    s.call(d3.behavior.drag()
		   .on('drag', function(sel) {
		       var cur = d3.transform(sel.attr('transform')),
			   new_loc = [d3.event.dx + cur.translate[0],
				      d3.event.dy + cur.translate[1]];
		       sel.attr('transform', 'translate('+new_loc+')');
		       this.center = { x: new_loc[0], y: new_loc[1] };
		   }.bind(this, s)));
	    s.on('mouseover', function() {
		var current = parseFloat(this.selectAll('path').style('stroke-width'));
		this.selectAll('path').style('stroke-width', current*2+'px');
	    }.bind(s));
	    s.on('mouseout', function() {
		this.selectAll('path').style('stroke-width', null);
	    }.bind(s));
	}
	function hide_center(sel) {
	    this.map.sel.select('#rotation-center')
		.attr('visibility', 'hidden');
	}
	function average_location(nodes) {
	    var xs = [], ys = [];
	    for (var node_id in nodes) {
		var node = nodes[node_id];
		if (node.x !== undefined)
		    xs.push(node.x);
		if (node.y !== undefined)
		    ys.push(node.y);
	    }
	    return { x: utils.mean(xs),
		     y: utils.mean(ys) };
	}	
    }

    function toggle_selectable_click(on_off) {
	/** With no argument, toggle the node click on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.selectable_click==null;
	if (on_off) {
	    var map = this.map;
	    this.selectable_click = function(d) {
		if (d3.event.defaultPrevented) return; // click suppressed
		map.select_selectable(this, d);
		d3.event.stopPropagation();
	    };
	    this.node_mouseover = function(d) {	   
		d3.select(this).style('stroke-width', null);
		var current = parseFloat(d3.select(this).style('stroke-width'));
		d3.select(this).style('stroke-width', current*2+'px');
	    };
	    this.node_mouseout = function(d) {
		d3.select(this).style('stroke-width', null);
	    };
	} else {
	    this.selectable_click = null;
	    this.node_mouseover = null;
	    this.node_mouseout = null;
	    this.map.sel.select('#nodes')
		.selectAll('.node-circle').style('stroke-width', null);
	}
    }

    function toggle_selectable_drag(on_off) {
	/** With no argument, toggle the node drag & bezier drag on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.selectable_drag===this.empty_behavior;
	if (on_off) {
	    this.selectable_drag = this.get_selectable_drag(this.map, this.undo_stack);
	    this.bezier_drag = this.get_bezier_drag(this.map, this.undo_stack);
	} else {
	    this.selectable_drag = this.empty_behavior;
	    this.bezier_drag = this.empty_behavior;
	}
    }
    function toggle_label_drag(on_off) {
	/** With no argument, toggle the label drag on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.label_drag===this.empty_behavior;
	if (on_off) {
	    this.reaction_label_drag = this.get_reaction_label_drag(this.map);
	    this.node_label_drag = this.get_node_label_drag(this.map);
	} else {
	    this.reaction_label_drag = this.empty_behavior;
	    this.node_label_drag = this.empty_behavior;
	}
    }

    function get_selectable_drag(map, undo_stack) {
	/** Drag the selected nodes and text labels.

	 */

	// define some variables
	var behavior = d3.behavior.drag(),
	    the_timeout = null,
	    total_displacement = null,
	    // for nodes
	    node_ids_to_drag = null,
	    reaction_ids = null,
	    // for text labels
	    text_label_ids_to_drag = null,
	    move_label = function(text_label_id, displacement) {
    		var text_label = map.text_labels[text_label_id];
    		text_label.x = text_label.x + displacement.x;
    		text_label.y = text_label.y + displacement.y;
    	    };

        behavior.on("dragstart", function () { 
	    // silence other listeners
	    d3.event.sourceEvent.stopPropagation(); console.log('dragstart');
	    // remember the total displacement for later
	    // total_displacement = {};
	    total_displacement = {x: 0, y: 0};

	    // If a text label is selected, the rest is not necessary
	    if (d3.select(this).attr('class').indexOf('text-label')==-1) {		
		// Note that dragstart is called even for a click event
		var data = this.parentNode.__data__,
		    bigg_id = data.bigg_id,
		    node_group = this.parentNode;
		// Move element to back (for the next step to work). Wait 200ms
		// before making the move, becuase otherwise the element will be
		// deleted before the click event gets called, and selection
		// will stop working.
		the_timeout = window.setTimeout(function() {
		    node_group.parentNode.insertBefore(node_group,node_group.parentNode.firstChild);
		}, 200);
		// prepare to combine metabolites
		map.sel.selectAll('.metabolite-circle')
		    .on('mouseover.combine', function(d) {
			if (d.bigg_id==bigg_id && d.node_id!=data.node_id) {
			    d3.select(this).style('stroke-width', String(12)+'px')
				.classed('node-to-combine', true);
			}
		    }).on('mouseout.combine', function(d) {
			if (d.bigg_id==bigg_id) {
			    map.sel.selectAll('.node-to-combine').style('stroke-width', String(2)+'px')
				.classed('node-to-combine', false);
			}
		    });
	    }
	});
        behavior.on("drag", function() {
	    // get the grabbed id
	    var grabbed = {};
	    if (d3.select(this).attr('class').indexOf('text-label')==-1) {
		// if it is a node
		grabbed['type'] = 'node';
		grabbed['id'] = this.parentNode.__data__.node_id;
	    } else {
		// if it is a text label
		grabbed['type'] = 'text-label';
		grabbed['id'] = this.__data__.text_label_id;
	    }

	    var selected_node_ids = map.get_selected_node_ids(),
		selected_text_label_ids = map.get_selected_text_label_ids();
	    node_ids_to_drag = []; text_label_ids_to_drag = [];
	    // choose the nodes and text labels to drag
	    if (grabbed['type']=='node' && 
		selected_node_ids.indexOf(grabbed['id'])==-1) { 
		node_ids_to_drag.push(grabbed['id']);
	    } else if (grabbed['type']=='text-label' && 
		       selected_text_label_ids.indexOf(grabbed['id'])==-1) {
		text_label_ids_to_drag.push(grabbed['id']);
	    } else {
		node_ids_to_drag = selected_node_ids;
		text_label_ids_to_drag = selected_text_label_ids;
	    }
	    reaction_ids = [];
	    var displacement = { x: d3.event.dx,
				 y: d3.event.dy };
	    total_displacement = utils.c_plus_c(total_displacement, displacement);
	    node_ids_to_drag.forEach(function(node_id) {
		// update data
		var node = map.nodes[node_id],
		    updated = build.move_node_and_dependents(node, node_id, map.reactions, displacement);
		reaction_ids = utils.unique_concat([reaction_ids, updated.reaction_ids]);
		// remember the displacements
		// if (!(node_id in total_displacement))  total_displacement[node_id] = { x: 0, y: 0 };
		// total_displacement[node_id] = utils.c_plus_c(total_displacement[node_id], displacement);
	    });
	    text_label_ids_to_drag.forEach(function(text_label_id) {
    		move_label(text_label_id, displacement);		
		// remember the displacements
		// if (!(node_id in total_displacement))  total_displacement[node_id] = { x: 0, y: 0 };
		// total_displacement[node_id] = utils.c_plus_c(total_displacement[node_id], displacement);
	    });
	    // draw
	    map.draw_these_nodes(node_ids_to_drag);
	    map.draw_these_reactions(reaction_ids);
    	    map.draw_these_text_labels(text_label_ids_to_drag);
	});
	behavior.on("dragend", function() {
	    if (node_ids_to_drag===null) {
		// Dragend can be called when drag has not been called. In this,
		// case, do nothing.
		total_displacement = null;
		node_ids_to_drag = null;
		text_label_ids_to_drag = null;
		reaction_ids = null;
		the_timeout = null;
		return;
	    }
	    // look for mets to combine
	    var node_to_combine_array = [];
	    map.sel.selectAll('.node-to-combine').each(function(d) {
		node_to_combine_array.push(d.node_id);
	    });
	    if (node_to_combine_array.length==1) {
		// If a node is ready for it, combine nodes
		var fixed_node_id = node_to_combine_array[0],
		    dragged_node_id = this.parentNode.__data__.node_id,
		    saved_dragged_node = utils.clone(map.nodes[dragged_node_id]),
		    segment_objs_moved_to_combine = combine_nodes_and_draw(fixed_node_id,
									   dragged_node_id);
		undo_stack.push(function() {
		    // undo
		    // put the old node back
		    map.nodes[dragged_node_id] = saved_dragged_node;
		    var fixed_node = map.nodes[fixed_node_id],
			updated_reactions = [];
		    segment_objs_moved_to_combine.forEach(function(segment_obj) {
			var segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id];
			if (segment.from_node_id==fixed_node_id) {
			    segment.from_node_id = dragged_node_id;
			} else if (segment.to_node_id==fixed_node_id) {
			    segment.to_node_id = dragged_node_id;
			} else {
			    console.error('Segment does not connect to fixed node');
			}
			// removed this segment_obj from the fixed node
			fixed_node.connected_segments = fixed_node.connected_segments.filter(function(x) {
			    return !(x.reaction_id==segment_obj.reaction_id && x.segment_id==segment_obj.segment_id);
			});
			if (updated_reactions.indexOf(segment_obj.reaction_id)==-1)
			    updated_reactions.push(segment_obj.reaction_id);
		    });
		    map.draw_these_nodes([dragged_node_id]);
		    map.draw_these_reactions(updated_reactions);
		}, function () {
		    // redo
		    combine_nodes_and_draw(fixed_node_id, dragged_node_id);
		});

	    } else {
		// otherwise, drag node
		
		// add to undo/redo stack
		// remember the displacement, dragged nodes, and reactions
		var saved_displacement = utils.clone(total_displacement), 
		    // BUG TODO this variable disappears!
		    // Happens sometimes when you drag a node, then delete it, then undo twice
		    saved_node_ids = utils.clone(node_ids_to_drag),
		    saved_text_label_ids = utils.clone(text_label_ids_to_drag),
		    saved_reaction_ids = utils.clone(reaction_ids);
		undo_stack.push(function() {
		    // undo
		    saved_node_ids.forEach(function(node_id) {
			var node = map.nodes[node_id];
			build.move_node_and_dependents(node, node_id, map.reactions,
						       utils.c_times_scalar(saved_displacement, -1));
		    });
		    saved_text_label_ids.forEach(function(text_label_id) {
			move_label(text_label_id, 
				   utils.c_times_scalar(saved_displacement, -1));
		    });
		    map.draw_these_nodes(saved_node_ids);
		    map.draw_these_reactions(saved_reaction_ids);
		    map.draw_these_text_labels(saved_text_label_ids);
		}, function () {
		    // redo
		    saved_node_ids.forEach(function(node_id) {
			var node = map.nodes[node_id];
			build.move_node_and_dependents(node, node_id, map.reactions,
						       saved_displacement);
		    });		    
		    saved_text_label_ids.forEach(function(text_label_id) {
			move_label(text_label_id, saved_displacement);
		    });
		    map.draw_these_nodes(saved_node_ids);
		    map.draw_these_reactions(saved_reaction_ids);
		    map.draw_these_text_labels(saved_text_label_ids);
		});
	    }

	    // stop combining metabolites
	    map.sel.selectAll('.metabolite-circle')
		.on('mouseover.combine', null)
		.on('mouseout.combine', null);

	    // clear the timeout
	    window.clearTimeout(the_timeout);

	    // clear the shared variables
	    total_displacement = null;
	    node_ids_to_drag = null;
	    text_label_ids_to_drag = null;
	    reaction_ids = null;
	    the_timeout = null;
	});
	return behavior;

	// definitions
	function combine_nodes_and_draw(fixed_node_id, dragged_node_id) {
	    var dragged_node = map.nodes[dragged_node_id],
		fixed_node = map.nodes[fixed_node_id],
		updated_segment_objs = [];
	    dragged_node.connected_segments.forEach(function(segment_obj) {
		// change the segments to reflect
		var segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id];
		if (segment.from_node_id==dragged_node_id) segment.from_node_id = fixed_node_id;
		else if (segment.to_node_id==dragged_node_id) segment.to_node_id = fixed_node_id;
		else return console.error('Segment does not connect to dragged node');
		// moved segment_obj to fixed_node
		fixed_node.connected_segments.push(segment_obj);
		updated_segment_objs.push(utils.clone(segment_obj));
		return null;
	    });
	    // delete the old node
	    map.delete_node_data([dragged_node_id]);
	    // turn off the class
	    map.sel.selectAll('.node-to-combine').classed('node-to-combine', false);
	    // draw
	    map.draw_everything();
	    // return for undo
	    return updated_segment_objs;
	}
    }
    function get_bezier_drag(map) {
	var move_bezier = function(reaction_id, segment_id, bezier, displacement) {
	    var segment = map.reactions[reaction_id].segments[segment_id];
	    segment['b'+bezier] = utils.c_plus_c(segment['b'+bezier], displacement);
	},
	    start_fn = function(d) {
	    },
	    drag_fn = function(d, displacement, total_displacement) {
		// draw
		move_bezier(d.reaction_id, d.segment_id, d.bezier, displacement);
		map.draw_these_reactions([d.reaction_id]);
	    },
	    end_fn = function(d) {
	    },
	    undo_fn = function(d, displacement) {
		move_bezier(d.reaction_id, d.segment_id, d.bezier,
			    utils.c_times_scalar(displacement, -1));
		map.draw_these_reactions([d.reaction_id]);
	    },
	    redo_fn = function(d, displacement) {
		move_bezier(d.reaction_id, d.segment_id, d.bezier, displacement);
		map.draw_these_reactions([d.reaction_id]);
	    };
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn,
				     redo_fn, this.map.sel);
    }
    function get_reaction_label_drag(map) {
	var move_label = function(reaction_id, displacement) {
	    var reaction = map.reactions[reaction_id];
	    reaction.label_x = reaction.label_x + displacement.x;
	    reaction.label_y = reaction.label_y + displacement.y;
	},
	    start_fn = function(d) {
	    },
	    drag_fn = function(d, displacement, total_displacement) {
		// draw
		move_label(d.reaction_id, displacement);
		map.draw_these_reactions([d.reaction_id]);
	    },
	    end_fn = function(d) {
	    },
	    undo_fn = function(d, displacement) {
		move_label(d.reaction_id, utils.c_times_scalar(displacement, -1));
		map.draw_these_reactions([d.reaction_id]);
	    },
	    redo_fn = function(d, displacement) {
		move_label(d.reaction_id, displacement);
		map.draw_these_reactions([d.reaction_id]);
	    };
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn,
				     redo_fn, this.map.sel);
    }
    function get_node_label_drag(map) {
	var move_label = function(node_id, displacement) {
	    var node = map.nodes[node_id];
	    node.label_x = node.label_x + displacement.x;
	    node.label_y = node.label_y + displacement.y;
	},
	    start_fn = function(d) {
	    },
	    drag_fn = function(d, displacement, total_displacement) {
		// draw
		move_label(d.node_id, displacement);
		map.draw_these_nodes([d.node_id]);
	    },
	    end_fn = function(d) {
	    },
	    undo_fn = function(d, displacement) {
		move_label(d.node_id, utils.c_times_scalar(displacement, -1));
		map.draw_these_nodes([d.node_id]);
	    },
	    redo_fn = function(d, displacement) {
		move_label(d.node_id, displacement);
		map.draw_these_nodes([d.node_id]);
	    };
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn,
				     redo_fn, this.map.sel);
    }

    function get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn, relative_to_selection) {
	/** Make a generic drag behavior, with undo/redo.

	 start_fn: function(d) Called at dragstart.

	 drag_fn: function(d, displacement, total_displacement) Called during
	 drag.

	 end_fn

	 undo_fn

	 redo_fn

	 relative_to_selection: a d3 selection that the locations are calculated against.

	 */
	
	// define some variables
	var behavior = d3.behavior.drag(),
	    total_displacement,
	    undo_stack = this.undo_stack,
	    rel = relative_to_selection.node();

        behavior.on("dragstart", function (d) {
	    // silence other listeners
	    d3.event.sourceEvent.stopPropagation();
	    total_displacement = { x: 0, y: 0 };
	    start_fn(d);
	});
        behavior.on("drag", function(d) {
	    // update data
	    var displacement = { x: d3.event.dx,
				 y: d3.event.dy },
		location = { x: d3.mouse(rel)[0],
			     y: d3.mouse(rel)[1] };

	    // remember the displacement
	    total_displacement = utils.c_plus_c(total_displacement, displacement);
	    drag_fn(d, displacement, total_displacement, location);
	});
	behavior.on("dragend", function(d) {			  
	    // add to undo/redo stack
	    // remember the displacement, dragged nodes, and reactions
	    var saved_d = utils.clone(d),
		saved_displacement = utils.clone(total_displacement), // BUG TODO this variable disappears!
		saved_location = { x: d3.mouse(rel)[0],
				   y: d3.mouse(rel)[1] };

	    undo_stack.push(function() {
		// undo
		undo_fn(saved_d, saved_displacement, saved_location);
	    }, function () {
		// redo
		redo_fn(saved_d, saved_displacement, saved_location);
	    });
	    end_fn(d);
	});
	return behavior;
    }

    function get_generic_angular_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn, 
				      get_center, relative_to_selection) {
	/** Make a generic drag behavior, with undo/redo. Supplies angles in
	  place of displacements.

	 start_fn: function(d) Called at dragstart.

	 drag_fn: function(d, displacement, total_displacement) Called during
	 drag.

	 end_fn:

	 undo_fn:

	 redo_fn:

	 get_center:

	 relative_to_selection: a d3 selection that the locations are calculated against.

	 */
	
	// define some variables
	var behavior = d3.behavior.drag(),
	    total_angle,
	    undo_stack = this.undo_stack,
	    rel = relative_to_selection.node();

        behavior.on("dragstart", function (d) {
	    // silence other listeners
	    d3.event.sourceEvent.stopPropagation();
	    total_angle = 0;
	    start_fn(d);
	});
        behavior.on("drag", function(d) {
	    // update data
	    var displacement = { x: d3.event.dx,
				 y: d3.event.dy },
		location = { x: d3.mouse(rel)[0],
			     y: d3.mouse(rel)[1] },
		center = get_center(),
		angle = utils.angle_for_event(displacement,
					      location,
					      center);
	    // remember the displacement
	    total_angle = total_angle + angle;
	    drag_fn(d, angle, total_angle, center);
	});
	behavior.on("dragend", function(d) {			  
	    // add to undo/redo stack
	    // remember the displacement, dragged nodes, and reactions
	    var saved_d = utils.clone(d),
		saved_angle = total_angle,
		saved_center = utils.clone(get_center());

	    undo_stack.push(function() {
		// undo
		undo_fn(saved_d, saved_angle, saved_center);
	    }, function () {
		// redo
		redo_fn(saved_d, saved_angle, saved_center);
	    });
	    end_fn(d);
	});
	return behavior;
    }
});

define('Scale',["utils"], function(utils) {
    /** 
     */

    var Scale = utils.make_class();
    Scale.prototype = { init: init,
			connect_to_settings: connect_to_settings };

    return Scale;

    // definitions
    function init() {
	this.x = d3.scale.linear();
	this.y = d3.scale.linear();
	this.x_size = d3.scale.linear();
	this.y_size = d3.scale.linear();
	this.size = d3.scale.linear();
	this.reaction_color = d3.scale.linear();
        this.reaction_size = d3.scale.linear();
	this.metabolite_size = d3.scale.linear();
	this.metabolite_color = d3.scale.linear();
        this.scale_path = function(path) {
            var x_fn = this.x, y_fn = this.y;
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
        }.bind(this);
        this.scale_decimals = function(path, scale_fn, precision) {
            var str = d3.format("."+String(precision)+"f");
            path = path.replace(/([0-9.]+)/g, function (match, p1) {
                return str(scale_fn(parseFloat(p1)));
            });
            return path;
        };
    }

    function connect_to_settings(settings) {
	// domains
	settings.domain_stream['reaction'].onValue(function(s) {
	    this.reaction_color.domain(s);
	    this.reaction_size.domain(s);
	}.bind(this));
	settings.domain_stream['metabolite'].onValue(function(s) {
	    this.metabolite_color.domain(s);
	    this.metabolite_size.domain(s);
	}.bind(this));
	// ranges
	settings.range_stream['reaction']['color'].onValue(function(s) {
	    this.reaction_color.range(s);
	}.bind(this));
	settings.range_stream['reaction']['size'].onValue(function(s) {
	    this.reaction_size.range(s);
	}.bind(this));
	settings.range_stream['metabolite']['color'].onValue(function(s) {
	    this.metabolite_color.range(s);
	}.bind(this));
	settings.range_stream['metabolite']['size'].onValue(function(s) {
	    this.metabolite_size.range(s);
	}.bind(this));
    }
});

define('UndoStack',["utils"], function(utils) {
    /** UndoStack returns a constructor that can be used to store undo info.
     */
    var UndoStack = utils.make_class();
    UndoStack.prototype = { init: init,
			    push: push,
			    undo: undo,
			    redo: redo };
    return UndoStack;

    // definitions
    function init() {
	var stack_size = 40;
	this.stack = Array(stack_size);
	this.current = -1;
	this.oldest = -1;
	this.newest = -1;
	this.end_of_stack = true;
	this.top_of_stack = true;
    }
    function push(undo_fn, redo_fn) {
	this.current = incr(this.current, this.stack.length);
	// var p2 = incr(p1, this.stack.length);
	// change the oldest
	if (this.end_of_stack)
	    this.oldest = this.current;
	else if (this.oldest == this.current)
	    this.oldest = incr(this.oldest, this.stack.length);
	this.stack[this.current] = { undo: undo_fn, redo: redo_fn };
	this.newest = this.current;

	// top of the stack
	this.top_of_stack = true;
	this.end_of_stack = false;
    }
    function undo() {
	// check that we haven't reached the end
	if (this.end_of_stack) return console.warn('End of stack.');
	// run the lastest stack function
	this.stack[this.current].undo();
	if (this.current == this.oldest) {
	    // if the next index is less than the oldest, then the stack is dead
	    this.end_of_stack = true;
	} else {
	    // reference the next fn
	    this.current = decr(this.current, this.stack.length);
	}

	// not at the top of the stack
	this.top_of_stack = false;
    }
    function redo() {
	// check that we haven't reached the end
	if (this.top_of_stack) return console.warn('Top of stack.');

	if (!this.end_of_stack)
	    this.current = incr(this.current, this.stack.length);
	this.stack[this.current].redo();

	// if at top of stack
	if (this.current == this.newest)
	    this.top_of_stack = true;

	// not at the end of the stack
	this.end_of_stack = false;
    }
    function incr(a, l) {
	return a + 1 > l - 1 ? 0 : a + 1;
    }
    function decr(a, l) {
	return a - 1 < 0 ? l - 1 : a -  1;
    }
});

define('CallbackManager',["utils"], function(utils) {
    /** CallbackManager()

     */

    var CallbackManager = utils.make_class();
    CallbackManager.prototype = { init: init,
				  set: set,
				  remove: remove,
				  run: run };

    return CallbackManager;

    function init() {

    }
    function set(name, fn) {
	/** As in d3 callbacks, you can namespace your callbacks after a period:
	 
	 select_metabolite.direction_arrow
	 select_metabolite.input

	 Both are called by select_metabolite
	 
	 */
	if (this.callbacks===undefined) this.callbacks = {};
	if (this.callbacks[name]===undefined) this.callbacks[name] = [];
	this.callbacks[name].push(fn);

	return this;
    }
    function remove(name) {
	/** Remove a callback by name
	 
	 */
	if (this.callbacks===undefined || Object.keys(this.callbacks).length==0) {
	    console.warn('No callbacks to remove');
	}
	delete this.callbacks[name];
	return this;
    }
    function run(name) {
	/** Run all callbacks that match the portion of name before the period ('.').

	 */
	if (this.callbacks===undefined) return this;
	// pass all but the first (name) argument to the callback
	var pass_args = Array.prototype.slice.call(arguments, 1);
	// look for matching callback names
	for (var a_name in this.callbacks) {
	    var split_name = a_name.split('.')[0];
	    if (split_name==name) {
		this.callbacks[a_name].forEach(function(fn) {
		    fn.apply(null, pass_args);
		});
	    }
	}
	return this;
    }
});

define('KeyManager',["utils"], function(utils) {
    /** 
     */

    var KeyManager = utils.make_class();
    // static methods
    KeyManager.reset_held_keys = reset_held_keys;
    // instance methods
    KeyManager.prototype = { init: init,
			     update: update,
			     toggle: toggle,
			     add_escape_listener: add_escape_listener,
			     add_enter_listener: add_enter_listener,
			     add_key_listener: add_key_listener };

    return KeyManager;

    // static methods
    function reset_held_keys(h) {
        h.command = false;
	h.control = false;
	h.option = false;
	h.shift = false;
    }
    // instance methods
    function init(assigned_keys, input_list, ctrl_equals_cmd) {
	/** Assign keys for commands.

	 */

	if (assigned_keys===undefined) this.assigned_keys = {};
	else this.assigned_keys = assigned_keys;
	if (input_list===undefined) this.input_list = [];
	else this.input_list = input_list;

	if (ctrl_equals_cmd===undefined) ctrl_equals_cmd = true;
	this.ctrl_equals_cmd = ctrl_equals_cmd;

	this.held_keys = {};
	reset_held_keys(this.held_keys);

	this.enabled = true;

	this.update();
    }

    function update() {
	var held_keys = this.held_keys,
	    keys = this.assigned_keys,
	    self = this;

        var modifier_keys = { command: 91,
			      command_right: 93,
                              control: 17,
                              option: 18,
                              shift: 16 };

        d3.select(window).on("keydown.key_manager", null);
        d3.select(window).on("keyup.key_manager", null);

	if (!(this.enabled)) return;

        d3.select(window).on("keydown.key_manager", function(ctrl_equals_cmd, input_list) {
            var kc = d3.event.keyCode,
		meaningless = true;
	    // check the inputs
	    var input_visible = false;
	    input_list.forEach(function(input) {
		if (input.is_visible()) input_visible = true;
	    });
            toggle_modifiers(modifier_keys, held_keys, kc, true);
	    for (var key_id in keys) {
		var assigned_key = keys[key_id];
		if (check_key(assigned_key, kc, held_keys, ctrl_equals_cmd)) {
		    meaningless = false;
		    if (!(assigned_key.ignore_with_input && input_visible)) {
			if (assigned_key.fn) {
			    assigned_key.fn.call(assigned_key.target);
			} else {
			    console.warn('No function for key');
			}
			// prevent browser action
			d3.event.preventDefault();
		    }
		}
	    }
	    // Sometimes modifiers get 'stuck', so reset them once in a while.
	    // Only do this when a meaningless key is pressed
	    for (var k in modifier_keys)
		if (modifier_keys[k] == kc) meaningless = false;
	    if (meaningless) 
		reset_held_keys(held_keys);
        }.bind(null, this.ctrl_equals_cmd, this.input_list))
	    .on("keyup.key_manager", function() {
            toggle_modifiers(modifier_keys, held_keys,
			     d3.event.keyCode, false);
        });
        function toggle_modifiers(mod, held, kc, on_off) {
            for (var k in mod)
                if (mod[k] == kc)
                    held[k] = on_off;
        }
        function check_key(key, pressed, held, ctrl_equals_cmd) {
            if (key.key != pressed) return false;
            var mod = utils.clone(key.modifiers);
            if (mod === undefined)
                mod = { control: false,
                        command: false,
                        option: false,
                        shift: false };
            for (var k in held) {
		if (ctrl_equals_cmd &&
		    mod['control'] &&
		    (k=='command' || k=='command_right' || k=='control') &&
		    (held['command'] || held['command_right'] || held['control'])) {
		    continue;
		}
                if (mod[k] === undefined) mod[k] = false;
                if (mod[k] != held[k]) return false;
            }
            return true;
        }
    }
    function toggle(on_off) {
	/** Turn the brush on or off

	 */
	if (on_off===undefined) on_off = !this.enabled;

	this.enabled = on_off;
	this.update();
    }	
    function add_enter_listener(callback) {
	/** Call the callback when the enter key is pressed, then
	 unregisters the listener.

	 */
	this.add_key_listener(callback, 13);
    }
    function add_escape_listener(callback) {
	/** Call the callback when the escape key is pressed, then
	 unregisters the listener.

	 */
	this.add_key_listener(callback, 27);
    }
    function add_key_listener(callback, kc) {
	/** Call the callback when the key is pressed, then unregisters the
	 listener.

	 */
	var selection = d3.select(window);
	selection.on('keydown.'+kc, function() {
	    if (d3.event.keyCode==kc) {
		callback();
	    }
	});
	return { clear: function() { selection.on('keydown.'+kc, null); } };
    }
});

define('Canvas',["utils", "CallbackManager"], function(utils, CallbackManager) {
    /** Defines a canvas that accepts drag/zoom events and can be resized.

     Canvas(selection, x, y, width, height)

     Adapted from http://bl.ocks.org/mccannf/1629464.

     */

    var Canvas = utils.make_class();
    Canvas.prototype = { init: init,
			 toggle_resize: toggle_resize,
			 setup: setup,
			 size_and_location: size_and_location };

    return Canvas;

    function init(selection, size_and_location) {
	this.selection = selection;
	this.x = size_and_location.x;
	this.y = size_and_location.y;
	this.width = size_and_location.width;
	this.height = size_and_location.height;

	// enable by default
	this.resize_enabled = true;

	// set up the callbacks
	this.callback_manager = new CallbackManager();

	this.setup();
    }

    function toggle_resize(on_off) {
	/** Turn the resize on or off

	 */
	if (on_off===undefined) on_off = !this.resize_enabled;

	if (on_off) {
	    this.selection.selectAll('.drag-rect')
		.style('pointer-events', 'auto');
	} else {
	    this.selection.selectAll('.drag-rect')
		.style('pointer-events', 'none');
	}
    }	

    function setup() {	
	var self = this,
	    extent = {"x": this.width, "y": this.height},
	    dragbar_width = 20,
	    mouse_node_mult = 10,
	    new_sel = this.selection.append('g')
		.classed('canvas-group', true)
		.data([{x: this.x, y: this.y}]);
	
	var mouse_node = new_sel.append('rect')
		.attr('id', 'mouse-node')
		.attr("width", this.width*mouse_node_mult)
		.attr("height", this.height*mouse_node_mult)
		.attr("transform", "translate("+[self.x - this.width*mouse_node_mult/2,
						 self.y - this.height*mouse_node_mult/2]+")")
		.attr('pointer-events', 'all');
	this.mouse_node = mouse_node;
	
	var rect = new_sel.append('rect')
		.attr('id', 'canvas')
		.attr("width", this.width)
		.attr("height", this.height)
		.attr("transform", "translate("+[self.x, self.y]+")");

	var drag_right = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", stop_propagation)
		.on("drag", rdragresize),
	    drag_left = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", stop_propagation)
		.on("drag", ldragresize),
	    drag_top = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", stop_propagation)
		.on("drag", tdragresize),
	    drag_bottom = d3.behavior.drag()
		.origin(Object)
		.on("dragstart", stop_propagation)
		.on("drag", bdragresize);

	var left = new_sel.append("rect")
		.classed('drag-rect', true)
		.attr('transform', function(d) {
		    return 'translate('+[ d.x - (dragbar_width/2),
					  d.y + (dragbar_width/2) ]+')';
		})
		.attr("height", this.height - dragbar_width)
		.attr("id", "dragleft")
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_left);
	
	var right = new_sel.append("rect")
		.classed('drag-rect', true)
		.attr('transform', function(d) {
		    return 'translate('+[ d.x + self.width - (dragbar_width/2),
					  d.y + (dragbar_width/2) ]+')';
		})
		.attr("id", "dragright")
		.attr("height", this.height - dragbar_width)
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_right);
	
	var top = new_sel.append("rect")
		.classed('drag-rect', true)
		.attr('transform', function(d) {
		    return 'translate('+[ d.x + (dragbar_width/2),
					  d.y - (dragbar_width/2) ]+')';
		})
		.attr("height", dragbar_width)
		.attr("id", "dragtop")
		.attr("width", this.width - dragbar_width)
		.attr("cursor", "ns-resize")
		.classed('resize-rect', true)
		.call(drag_top);
	
	var bottom = new_sel.append("rect")
		.classed('drag-rect', true)
		.attr('transform', function(d) {
		    return 'translate('+[ d.x + (dragbar_width/2),
					  d.y + self.height - (dragbar_width/2) ]+')';
		})
		.attr("id", "dragbottom")
		.attr("height", dragbar_width)
		.attr("width", this.width - dragbar_width)
		.attr("cursor", "ns-resize")
		.classed('resize-rect', true)
		.call(drag_bottom);
	
	// definitions
	function stop_propagation() {
	    d3.event.sourceEvent.stopPropagation();
	}
	function transform_string(x, y, current_transform) {
	    var tr = d3.transform(current_transform),
		translate = tr.translate;	    
	    if (x!==null) translate[0] = x;
	    if (y!==null) translate[1] = y;
	    return 'translate('+translate+')';
	}
	function ldragresize(d) {
	    var oldx = d.x; 
	    d.x = Math.min(d.x + self.width - (dragbar_width / 2), d3.event.x);
	    self.x = d.x;
	    self.width = self.width + (oldx - d.x);
	    left.attr("transform", function(d) {
		return transform_string(d.x - (dragbar_width / 2), null, left.attr('transform'));
	    });
	    mouse_node.attr("transform", function(d) {
		return transform_string(d.x, null, mouse_node.attr('transform'));
	    }).attr("width", self.width*mouse_node_mult);
	    rect.attr("transform", function(d) {
		return transform_string(d.x, null, rect.attr('transform'));
	    }).attr("width", self.width);
	    top.attr("transform", function(d) {
		return transform_string(d.x + (dragbar_width/2), null, top.attr('transform'));
	    }).attr("width", self.width - dragbar_width);
	    bottom.attr("transform", function(d) {
		return transform_string(d.x + (dragbar_width/2), null, bottom.attr('transform'));
	    }).attr("width", self.width - dragbar_width);

	    self.callback_manager.run('resize');
	}

	function rdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    var dragx = Math.max(d.x + (dragbar_width/2), d.x + self.width + d3.event.dx);
	    //recalculate width
	    self.width = dragx - d.x;
	    //move the right drag handle
	    right.attr("transform", function(d) {
		return transform_string(dragx - (dragbar_width/2), null, right.attr('transform'));
	    });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    mouse_node.attr("width", self.width*mouse_node_mult);
	    rect.attr("width", self.width);
	    top.attr("width", self.width - dragbar_width);
	    bottom.attr("width", self.width - dragbar_width);

	    self.callback_manager.run('resize');
	}

	function tdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();	    
	    var oldy = d.y; 
	    d.y = Math.min(d.y + self.height - (dragbar_width / 2), d3.event.y);
	    self.y = d.y;
	    self.height = self.height + (oldy - d.y);
	    top.attr("transform", function(d) {
		return transform_string(null, d.y - (dragbar_width / 2), top.attr('transform'));
	    });
	    mouse_node.attr("transform", function(d) {
		return transform_string(null, d.y, mouse_node.attr('transform'));
	    }).attr("width", self.height*mouse_node_mult);
	    rect.attr("transform", function(d) {
		return transform_string(null, d.y, rect.attr('transform'));
	    }).attr("height", self.height);
	    left.attr("transform", function(d) {
		return transform_string(null, d.y + (dragbar_width/2), left.attr('transform'));
	    }).attr("height", self.height - dragbar_width);
	    right.attr("transform", function(d) {
		return transform_string(null, d.y + (dragbar_width/2), right.attr('transform'));
	    }).attr("height", self.height - dragbar_width);

	    self.callback_manager.run('resize');
	}

	function bdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    var dragy = Math.max(d.y + (dragbar_width/2), d.y + self.height + d3.event.dy);
	    //recalculate width
	    self.height = dragy - d.y;
	    //move the right drag handle
	    bottom.attr("transform", function(d) {
		return transform_string(null, dragy - (dragbar_width/2), bottom.attr('transform'));
	    });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    mouse_node.attr("height", self.height*mouse_node_mult);
	    rect.attr("height", self.height);
	    left.attr("height", self.height - dragbar_width);
	    right.attr("height", self.height - dragbar_width);

	    self.callback_manager.run('resize');
	}
    }

    function size_and_location() {
	return { x: this.x,
		 y: this.y,
		 width: this.width,
		 height: this.height };
    }
});

define('SearchIndex',["utils"], function(utils) {
    /** Define an index for searching for reaction and metabolites in the map.

     The index is stored in SearchIndex.index, an object of id/record pairs.

     */

    var SearchIndex = utils.make_class();
    SearchIndex.prototype = { init: init,
			      insert: insert,
			      remove: remove,
			      find: find };

    return SearchIndex;

    // definitions
    function init() {
	this.index = {};
    }

    function insert(id, record, overwrite, check_record) {
	/** Insert a record into the index.

	 id: A unique string id.

	 record: Records have the form:

	 { 'name': '',
	   'data': {} }

	 Search is performed on substrings of the name.

	 overwrite: (Default false) For faster performance, make overwrite true,
	 and records will be inserted without checking for an existing record.

	 check_record: (Default false) For faster performance, make check_record
	 false. If true, records will be checked to make sure they have name and
	 data attributes.

	 Returns undefined.

	 */
	if (!overwrite && (id in this.index))
	    throw new Error("id is already in the index");
	if (check_record && !(('name' in record) && ('data' in record)))
	    throw new Error("malformed record");
	this.index[id] = record;
    }

    function remove(record_id) {
	/** Remove the matching record.

	 Returns true is a record is found, or false if no match is found.

	 */
	if (record_id in this.index) {
	    delete this.index[record_id];
	    return true;
	} else {
	    return false;
	}
    }

    function find(substring) {
	/** Find a record that matches the substring.

	 Returns an array of data from matching records.

	 */

	var re = RegExp(substring, "i"), // ignore case
	    matches = [];
	for (var id in this.index) {
	    var record = this.index[id];
	    if (re.exec(record.name))
		matches.push(record.data);
	}
	return matches;
	    
    }
});

(function() {
  var Bacon, BufferingSource, Bus, CompositeUnsubscribe, ConsumingSource, Desc, Dispatcher, End, Error, Event, EventStream, Initial, Next, None, Observable, Property, PropertyDispatcher, Some, Source, UpdateBarrier, addPropertyInitValueToStream, assert, assertArray, assertEventStream, assertFunction, assertNoArguments, assertString, cloneArray, compositeUnsubscribe, containsDuplicateDeps, convertArgsToFunction, describe, end, eventIdCounter, flatMap_, former, idCounter, initial, isArray, isFieldKey, isFunction, isObservable, latterF, liftCallback, makeFunction, makeFunctionArgs, makeFunction_, makeObservable, makeSpawner, next, nop, partiallyApplied, recursionDepth, registerObs, spys, toCombinator, toEvent, toFieldExtractor, toFieldKey, toOption, toSimpleExtractor, withDescription, withMethodCallSupport, _, _ref,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Bacon = {
    toString: function() {
      return "Bacon";
    }
  };

  Bacon.version = '0.7.12';

  Bacon.fromBinder = function(binder, eventTransformer) {
    if (eventTransformer == null) {
      eventTransformer = _.id;
    }
    return new EventStream(describe(Bacon, "fromBinder", binder, eventTransformer), function(sink) {
      var unbinder;
      return unbinder = binder(function() {
        var args, event, reply, value, _i, _len;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        value = eventTransformer.apply(null, args);
        if (!(isArray(value) && _.last(value) instanceof Event)) {
          value = [value];
        }
        reply = Bacon.more;
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          event = value[_i];
          reply = sink(event = toEvent(event));
          if (reply === Bacon.noMore || event.isEnd()) {
            if (unbinder != null) {
              unbinder();
            } else {
              Bacon.scheduler.setTimeout((function() {
                return unbinder();
              }), 0);
            }
            return reply;
          }
        }
        return reply;
      });
    });
  };

  Bacon.$ = {
    asEventStream: function(eventName, selector, eventTransformer) {
      var _ref;
      if (isFunction(selector)) {
        _ref = [selector, null], eventTransformer = _ref[0], selector = _ref[1];
      }
      return withDescription(this.selector || this, "asEventStream", eventName, Bacon.fromBinder((function(_this) {
        return function(handler) {
          _this.on(eventName, selector, handler);
          return function() {
            return _this.off(eventName, selector, handler);
          };
        };
      })(this), eventTransformer));
    }
  };

  if ((_ref = typeof jQuery !== "undefined" && jQuery !== null ? jQuery : typeof Zepto !== "undefined" && Zepto !== null ? Zepto : null) != null) {
    _ref.fn.asEventStream = Bacon.$.asEventStream;
  }

  Bacon.fromEventTarget = function(target, eventName, eventTransformer) {
    var sub, unsub, _ref1, _ref2, _ref3, _ref4;
    sub = (_ref1 = target.addEventListener) != null ? _ref1 : (_ref2 = target.addListener) != null ? _ref2 : target.bind;
    unsub = (_ref3 = target.removeEventListener) != null ? _ref3 : (_ref4 = target.removeListener) != null ? _ref4 : target.unbind;
    return withDescription(Bacon, "fromEventTarget", target, eventName, Bacon.fromBinder(function(handler) {
      sub.call(target, eventName, handler);
      return function() {
        return unsub.call(target, eventName, handler);
      };
    }, eventTransformer));
  };

  Bacon.fromPromise = function(promise, abort) {
    return withDescription(Bacon, "fromPromise", promise, Bacon.fromBinder(function(handler) {
      promise.then(handler, function(e) {
        return handler(new Error(e));
      });
      return function() {
        if (abort) {
          return typeof promise.abort === "function" ? promise.abort() : void 0;
        }
      };
    }, (function(value) {
      return [value, end()];
    })));
  };

  Bacon.noMore = ["<no-more>"];

  Bacon.more = ["<more>"];

  Bacon.later = function(delay, value) {
    return withDescription(Bacon, "later", delay, value, Bacon.sequentially(delay, [value]));
  };

  Bacon.sequentially = function(delay, values) {
    var index;
    index = 0;
    return withDescription(Bacon, "sequentially", delay, values, Bacon.fromPoll(delay, function() {
      var value;
      value = values[index++];
      if (index < values.length) {
        return value;
      } else if (index === values.length) {
        return [value, end()];
      } else {
        return end();
      }
    }));
  };

  Bacon.repeatedly = function(delay, values) {
    var index;
    index = 0;
    return withDescription(Bacon, "repeatedly", delay, values, Bacon.fromPoll(delay, function() {
      return values[index++ % values.length];
    }));
  };

  Bacon.spy = function(spy) {
    return spys.push(spy);
  };

  spys = [];

  registerObs = function(obs) {
    var spy, _i, _len, _results;
    if (spys.length) {
      if (!registerObs.running) {
        try {
          registerObs.running = true;
          _results = [];
          for (_i = 0, _len = spys.length; _i < _len; _i++) {
            spy = spys[_i];
            _results.push(spy(obs));
          }
          return _results;
        } finally {
          delete registerObs.running;
        }
      }
    }
  };

  withMethodCallSupport = function(wrapped) {
    return function() {
      var args, context, f, methodName;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof f === "object" && args.length) {
        context = f;
        methodName = args[0];
        f = function() {
          return context[methodName].apply(context, arguments);
        };
        args = args.slice(1);
      }
      return wrapped.apply(null, [f].concat(__slice.call(args)));
    };
  };

  liftCallback = function(desc, wrapped) {
    return withMethodCallSupport(function() {
      var args, f, stream;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      stream = partiallyApplied(wrapped, [
        function(values, callback) {
          return f.apply(null, __slice.call(values).concat([callback]));
        }
      ]);
      return withDescription.apply(null, [Bacon, desc, f].concat(__slice.call(args), [Bacon.combineAsArray(args).flatMap(stream)]));
    });
  };

  Bacon.fromCallback = liftCallback("fromCallback", function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return Bacon.fromBinder(function(handler) {
      makeFunction(f, args)(handler);
      return nop;
    }, (function(value) {
      return [value, end()];
    }));
  });

  Bacon.fromNodeCallback = liftCallback("fromNodeCallback", function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return Bacon.fromBinder(function(handler) {
      makeFunction(f, args)(handler);
      return nop;
    }, function(error, value) {
      if (error) {
        return [new Error(error), end()];
      }
      return [value, end()];
    });
  });

  Bacon.fromPoll = function(delay, poll) {
    return withDescription(Bacon, "fromPoll", delay, poll, Bacon.fromBinder((function(handler) {
      var id;
      id = Bacon.scheduler.setInterval(handler, delay);
      return function() {
        return Bacon.scheduler.clearInterval(id);
      };
    }), poll));
  };

  Bacon.interval = function(delay, value) {
    if (value == null) {
      value = {};
    }
    return withDescription(Bacon, "interval", delay, value, Bacon.fromPoll(delay, function() {
      return next(value);
    }));
  };

  Bacon.constant = function(value) {
    return new Property(describe(Bacon, "constant", value), function(sink) {
      sink(initial(value));
      sink(end());
      return nop;
    });
  };

  Bacon.never = function() {
    return withDescription(Bacon, "never", Bacon.fromArray([]));
  };

  Bacon.once = function(value) {
    return withDescription(Bacon, "once", value, Bacon.fromArray([value]));
  };

  Bacon.fromArray = function(values) {
    assertArray(values);
    values = cloneArray(values);
    return new EventStream(describe(Bacon, "fromArray", values), function(sink) {
      var send, unsubd;
      unsubd = false;
      send = function() {
        var reply, value;
        if (_.empty(values)) {
          return sink(end());
        } else {
          value = values.splice(0, 1)[0];
          reply = sink(toEvent(value));
          if ((reply !== Bacon.noMore) && !unsubd) {
            return send();
          }
        }
      };
      send();
      return function() {
        return unsubd = true;
      };
    });
  };

  Bacon.mergeAll = function() {
    var streams;
    streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (isArray(streams[0])) {
      streams = streams[0];
    }
    if (streams.length) {
      return new EventStream(describe.apply(null, [Bacon, "mergeAll"].concat(__slice.call(streams))), function(sink) {
        var ends, sinks, smartSink;
        ends = 0;
        smartSink = function(obs) {
          return function(unsubBoth) {
            return obs.subscribeInternal(function(event) {
              var reply;
              if (event.isEnd()) {
                ends++;
                if (ends === streams.length) {
                  return sink(end());
                } else {
                  return Bacon.more;
                }
              } else {
                reply = sink(event);
                if (reply === Bacon.noMore) {
                  unsubBoth();
                }
                return reply;
              }
            });
          };
        };
        sinks = _.map(smartSink, streams);
        return compositeUnsubscribe.apply(null, sinks);
      });
    } else {
      return Bacon.never();
    }
  };

  Bacon.zipAsArray = function() {
    var streams;
    streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (isArray(streams[0])) {
      streams = streams[0];
    }
    return withDescription.apply(null, [Bacon, "zipAsArray"].concat(__slice.call(streams), [Bacon.zipWith(streams, function() {
      var xs;
      xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return xs;
    })]));
  };

  Bacon.zipWith = function() {
    var f, streams, _ref1;
    f = arguments[0], streams = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!isFunction(f)) {
      _ref1 = [f, streams[0]], streams = _ref1[0], f = _ref1[1];
    }
    streams = _.map((function(s) {
      return s.toEventStream();
    }), streams);
    return withDescription.apply(null, [Bacon, "zipWith", f].concat(__slice.call(streams), [Bacon.when(streams, f)]));
  };

  Bacon.groupSimultaneous = function() {
    var s, sources, streams;
    streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (streams.length === 1 && isArray(streams[0])) {
      streams = streams[0];
    }
    sources = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = streams.length; _i < _len; _i++) {
        s = streams[_i];
        _results.push(new BufferingSource(s));
      }
      return _results;
    })();
    return withDescription.apply(null, [Bacon, "groupSimultaneous"].concat(__slice.call(streams), [Bacon.when(sources, (function() {
      var xs;
      xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return xs;
    }))]));
  };

  Bacon.combineAsArray = function() {
    var index, s, sources, stream, streams, _i, _len;
    streams = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (streams.length === 1 && isArray(streams[0])) {
      streams = streams[0];
    }
    for (index = _i = 0, _len = streams.length; _i < _len; index = ++_i) {
      stream = streams[index];
      if (!(isObservable(stream))) {
        streams[index] = Bacon.constant(stream);
      }
    }
    if (streams.length) {
      sources = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = streams.length; _j < _len1; _j++) {
          s = streams[_j];
          _results.push(new Source(s, true, s.subscribeInternal));
        }
        return _results;
      })();
      return withDescription.apply(null, [Bacon, "combineAsArray"].concat(__slice.call(streams), [Bacon.when(sources, (function() {
        var xs;
        xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return xs;
      })).toProperty()]));
    } else {
      return Bacon.constant([]);
    }
  };

  Bacon.onValues = function() {
    var f, streams, _i;
    streams = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), f = arguments[_i++];
    return Bacon.combineAsArray(streams).onValues(f);
  };

  Bacon.combineWith = function() {
    var f, streams;
    f = arguments[0], streams = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return withDescription.apply(null, [Bacon, "combineWith", f].concat(__slice.call(streams), [Bacon.combineAsArray(streams).map(function(values) {
      return f.apply(null, values);
    })]));
  };

  Bacon.combineTemplate = function(template) {
    var applyStreamValue, combinator, compile, compileTemplate, constantValue, current, funcs, mkContext, setValue, streams;
    funcs = [];
    streams = [];
    current = function(ctxStack) {
      return ctxStack[ctxStack.length - 1];
    };
    setValue = function(ctxStack, key, value) {
      return current(ctxStack)[key] = value;
    };
    applyStreamValue = function(key, index) {
      return function(ctxStack, values) {
        return setValue(ctxStack, key, values[index]);
      };
    };
    constantValue = function(key, value) {
      return function(ctxStack) {
        return setValue(ctxStack, key, value);
      };
    };
    mkContext = function(template) {
      if (isArray(template)) {
        return [];
      } else {
        return {};
      }
    };
    compile = function(key, value) {
      var popContext, pushContext;
      if (isObservable(value)) {
        streams.push(value);
        return funcs.push(applyStreamValue(key, streams.length - 1));
      } else if (value === Object(value) && typeof value !== "function" && !(value instanceof RegExp) && !(value instanceof Date)) {
        pushContext = function(key) {
          return function(ctxStack) {
            var newContext;
            newContext = mkContext(value);
            setValue(ctxStack, key, newContext);
            return ctxStack.push(newContext);
          };
        };
        popContext = function(ctxStack) {
          return ctxStack.pop();
        };
        funcs.push(pushContext(key));
        compileTemplate(value);
        return funcs.push(popContext);
      } else {
        return funcs.push(constantValue(key, value));
      }
    };
    compileTemplate = function(template) {
      return _.each(template, compile);
    };
    compileTemplate(template);
    combinator = function(values) {
      var ctxStack, f, rootContext, _i, _len;
      rootContext = mkContext(template);
      ctxStack = [rootContext];
      for (_i = 0, _len = funcs.length; _i < _len; _i++) {
        f = funcs[_i];
        f(ctxStack, values);
      }
      return rootContext;
    };
    return withDescription(Bacon, "combineTemplate", template, Bacon.combineAsArray(streams).map(combinator));
  };

  Bacon.retry = function(options) {
    var interval, isRetryable, maxRetries, retries, retry, source;
    if (!isFunction(options.source)) {
      throw "'source' option has to be a function";
    }
    source = options.source;
    retries = options.retries || 0;
    maxRetries = options.maxRetries || retries;
    interval = options.interval || function() {
      return 0;
    };
    isRetryable = options.isRetryable || function() {
      return true;
    };
    retry = function(context) {
      var nextAttemptOptions;
      nextAttemptOptions = {
        source: source,
        retries: retries - 1,
        maxRetries: maxRetries,
        interval: interval,
        isRetryable: isRetryable
      };
      return Bacon.later(interval(context)).filter(false).concat(Bacon.retry(nextAttemptOptions));
    };
    return withDescription(Bacon, "retry", options, source().flatMapError(function(e) {
      if (isRetryable(e) && retries > 0) {
        return retry({
          error: e,
          retriesDone: maxRetries - retries
        });
      } else {
        return Bacon.once(new Bacon.Error(e));
      }
    }));
  };

  eventIdCounter = 0;

  Event = (function() {
    function Event() {
      this.id = ++eventIdCounter;
    }

    Event.prototype.isEvent = function() {
      return true;
    };

    Event.prototype.isEnd = function() {
      return false;
    };

    Event.prototype.isInitial = function() {
      return false;
    };

    Event.prototype.isNext = function() {
      return false;
    };

    Event.prototype.isError = function() {
      return false;
    };

    Event.prototype.hasValue = function() {
      return false;
    };

    Event.prototype.filter = function() {
      return true;
    };

    Event.prototype.inspect = function() {
      return this.toString();
    };

    Event.prototype.log = function() {
      return this.toString();
    };

    return Event;

  })();

  Next = (function(_super) {
    __extends(Next, _super);

    function Next(valueF) {
      Next.__super__.constructor.call(this);
      if (isFunction(valueF)) {
        this.value = _.cached(valueF);
      } else {
        this.value = _.always(valueF);
      }
    }

    Next.prototype.isNext = function() {
      return true;
    };

    Next.prototype.hasValue = function() {
      return true;
    };

    Next.prototype.fmap = function(f) {
      var value;
      value = this.value;
      return this.apply(function() {
        return f(value());
      });
    };

    Next.prototype.apply = function(value) {
      return new Next(value);
    };

    Next.prototype.filter = function(f) {
      return f(this.value());
    };

    Next.prototype.toString = function() {
      return _.toString(this.value());
    };

    Next.prototype.log = function() {
      return this.value();
    };

    return Next;

  })(Event);

  Initial = (function(_super) {
    __extends(Initial, _super);

    function Initial() {
      return Initial.__super__.constructor.apply(this, arguments);
    }

    Initial.prototype.isInitial = function() {
      return true;
    };

    Initial.prototype.isNext = function() {
      return false;
    };

    Initial.prototype.apply = function(value) {
      return new Initial(value);
    };

    Initial.prototype.toNext = function() {
      return new Next(this.value);
    };

    return Initial;

  })(Next);

  End = (function(_super) {
    __extends(End, _super);

    function End() {
      return End.__super__.constructor.apply(this, arguments);
    }

    End.prototype.isEnd = function() {
      return true;
    };

    End.prototype.fmap = function() {
      return this;
    };

    End.prototype.apply = function() {
      return this;
    };

    End.prototype.toString = function() {
      return "<end>";
    };

    return End;

  })(Event);

  Error = (function(_super) {
    __extends(Error, _super);

    function Error(error) {
      this.error = error;
    }

    Error.prototype.isError = function() {
      return true;
    };

    Error.prototype.fmap = function() {
      return this;
    };

    Error.prototype.apply = function() {
      return this;
    };

    Error.prototype.toString = function() {
      return "<error> " + _.toString(this.error);
    };

    return Error;

  })(Event);

  idCounter = 0;

  Observable = (function() {
    function Observable(desc) {
      this.flatMapError = __bind(this.flatMapError, this);
      this.id = ++idCounter;
      withDescription(desc, this);
    }

    Observable.prototype.onValue = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return this.subscribe(function(event) {
        if (event.hasValue()) {
          return f(event.value());
        }
      });
    };

    Observable.prototype.onValues = function(f) {
      return this.onValue(function(args) {
        return f.apply(null, args);
      });
    };

    Observable.prototype.onError = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return this.subscribe(function(event) {
        if (event.isError()) {
          return f(event.error);
        }
      });
    };

    Observable.prototype.onEnd = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return this.subscribe(function(event) {
        if (event.isEnd()) {
          return f();
        }
      });
    };

    Observable.prototype.errors = function() {
      return withDescription(this, "errors", this.filter(function() {
        return false;
      }));
    };

    Observable.prototype.filter = function() {
      var args, f;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return convertArgsToFunction(this, f, args, function(f) {
        return withDescription(this, "filter", f, this.withHandler(function(event) {
          if (event.filter(f)) {
            return this.push(event);
          } else {
            return Bacon.more;
          }
        }));
      });
    };

    Observable.prototype.takeWhile = function() {
      var args, f;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return convertArgsToFunction(this, f, args, function(f) {
        return withDescription(this, "takeWhile", f, this.withHandler(function(event) {
          if (event.filter(f)) {
            return this.push(event);
          } else {
            this.push(end());
            return Bacon.noMore;
          }
        }));
      });
    };

    Observable.prototype.endOnError = function() {
      var args, f;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (f == null) {
        f = true;
      }
      return convertArgsToFunction(this, f, args, function(f) {
        return withDescription(this, "endOnError", this.withHandler(function(event) {
          if (event.isError() && f(event.error)) {
            this.push(event);
            return this.push(end());
          } else {
            return this.push(event);
          }
        }));
      });
    };

    Observable.prototype.take = function(count) {
      if (count <= 0) {
        return Bacon.never();
      }
      return withDescription(this, "take", count, this.withHandler(function(event) {
        if (!event.hasValue()) {
          return this.push(event);
        } else {
          count--;
          if (count > 0) {
            return this.push(event);
          } else {
            if (count === 0) {
              this.push(event);
            }
            this.push(end());
            return Bacon.noMore;
          }
        }
      }));
    };

    Observable.prototype.map = function() {
      var args, p;
      p = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (p instanceof Property) {
        return p.sampledBy(this, former);
      } else {
        return convertArgsToFunction(this, p, args, function(f) {
          return withDescription(this, "map", f, this.withHandler(function(event) {
            return this.push(event.fmap(f));
          }));
        });
      }
    };

    Observable.prototype.mapError = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return withDescription(this, "mapError", f, this.withHandler(function(event) {
        if (event.isError()) {
          return this.push(next(f(event.error)));
        } else {
          return this.push(event);
        }
      }));
    };

    Observable.prototype.mapEnd = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return withDescription(this, "mapEnd", f, this.withHandler(function(event) {
        if (event.isEnd()) {
          this.push(next(f(event)));
          this.push(end());
          return Bacon.noMore;
        } else {
          return this.push(event);
        }
      }));
    };

    Observable.prototype.doAction = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return withDescription(this, "doAction", f, this.withHandler(function(event) {
        if (event.hasValue()) {
          f(event.value());
        }
        return this.push(event);
      }));
    };

    Observable.prototype.skip = function(count) {
      return withDescription(this, "skip", count, this.withHandler(function(event) {
        if (!event.hasValue()) {
          return this.push(event);
        } else if (count > 0) {
          count--;
          return Bacon.more;
        } else {
          return this.push(event);
        }
      }));
    };

    Observable.prototype.skipDuplicates = function(isEqual) {
      if (isEqual == null) {
        isEqual = function(a, b) {
          return a === b;
        };
      }
      return withDescription(this, "skipDuplicates", this.withStateMachine(None, function(prev, event) {
        if (!event.hasValue()) {
          return [prev, [event]];
        } else if (event.isInitial() || prev === None || !isEqual(prev.get(), event.value())) {
          return [new Some(event.value()), [event]];
        } else {
          return [prev, []];
        }
      }));
    };

    Observable.prototype.skipErrors = function() {
      return withDescription(this, "skipErrors", this.withHandler(function(event) {
        if (event.isError()) {
          return Bacon.more;
        } else {
          return this.push(event);
        }
      }));
    };

    Observable.prototype.withStateMachine = function(initState, f) {
      var state;
      state = initState;
      return withDescription(this, "withStateMachine", initState, f, this.withHandler(function(event) {
        var fromF, newState, output, outputs, reply, _i, _len;
        fromF = f(state, event);
        newState = fromF[0], outputs = fromF[1];
        state = newState;
        reply = Bacon.more;
        for (_i = 0, _len = outputs.length; _i < _len; _i++) {
          output = outputs[_i];
          reply = this.push(output);
          if (reply === Bacon.noMore) {
            return reply;
          }
        }
        return reply;
      }));
    };

    Observable.prototype.scan = function(seed, f, lazyF) {
      var acc, f_, resultProperty, subscribe;
      f_ = toCombinator(f);
      f = lazyF ? f_ : function(x, y) {
        return f_(x(), y());
      };
      acc = toOption(seed).map(function(x) {
        return _.always(x);
      });
      subscribe = (function(_this) {
        return function(sink) {
          var initSent, reply, sendInit, unsub;
          initSent = false;
          unsub = nop;
          reply = Bacon.more;
          sendInit = function() {
            if (!initSent) {
              return acc.forEach(function(valueF) {
                initSent = true;
                reply = sink(new Initial(valueF));
                if (reply === Bacon.noMore) {
                  unsub();
                  return unsub = nop;
                }
              });
            }
          };
          unsub = _this.subscribeInternal(function(event) {
            var next, prev;
            if (event.hasValue()) {
              if (initSent && event.isInitial()) {
                return Bacon.more;
              } else {
                if (!event.isInitial()) {
                  sendInit();
                }
                initSent = true;
                prev = acc.getOrElse(function() {
                  return void 0;
                });
                next = _.cached(function() {
                  return f(prev, event.value);
                });
                acc = new Some(next);
                return sink(event.apply(next));
              }
            } else {
              if (event.isEnd()) {
                reply = sendInit();
              }
              if (reply !== Bacon.noMore) {
                return sink(event);
              }
            }
          });
          UpdateBarrier.whenDoneWith(resultProperty, sendInit);
          return unsub;
        };
      })(this);
      return resultProperty = new Property(describe(this, "scan", seed, f), subscribe);
    };

    Observable.prototype.fold = function(seed, f) {
      return withDescription(this, "fold", seed, f, this.scan(seed, f).sampledBy(this.filter(false).mapEnd().toProperty()));
    };

    Observable.prototype.zip = function(other, f) {
      if (f == null) {
        f = Array;
      }
      return withDescription(this, "zip", other, Bacon.zipWith([this, other], f));
    };

    Observable.prototype.diff = function(start, f) {
      f = toCombinator(f);
      return withDescription(this, "diff", start, f, this.scan([start], function(prevTuple, next) {
        return [next, f(prevTuple[0], next)];
      }).filter(function(tuple) {
        return tuple.length === 2;
      }).map(function(tuple) {
        return tuple[1];
      }));
    };

    Observable.prototype.flatMap = function() {
      return flatMap_(this, makeSpawner(arguments));
    };

    Observable.prototype.flatMapFirst = function() {
      return flatMap_(this, makeSpawner(arguments), true);
    };

    Observable.prototype.flatMapLatest = function() {
      var f, stream;
      f = makeSpawner(arguments);
      stream = this.toEventStream();
      return withDescription(this, "flatMapLatest", f, stream.flatMap(function(value) {
        return makeObservable(f(value)).takeUntil(stream);
      }));
    };

    Observable.prototype.flatMapError = function(fn) {
      return withDescription(this, "flatMapError", fn, this.mapError(function(err) {
        return new Bacon.Error(err);
      }).flatMap(function(x) {
        if (x instanceof Bacon.Error) {
          return fn(x.error);
        } else {
          return Bacon.once(x);
        }
      }));
    };

    Observable.prototype.not = function() {
      return withDescription(this, "not", this.map(function(x) {
        return !x;
      }));
    };

    Observable.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.subscribe(function(event) {
        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log.apply(console, __slice.call(args).concat([event.log()])) : void 0 : void 0;
      });
      return this;
    };

    Observable.prototype.slidingWindow = function(n, minValues) {
      if (minValues == null) {
        minValues = 0;
      }
      return withDescription(this, "slidingWindow", n, minValues, this.scan([], (function(window, value) {
        return window.concat([value]).slice(-n);
      })).filter((function(values) {
        return values.length >= minValues;
      })));
    };

    Observable.prototype.combine = function(other, f) {
      var combinator;
      combinator = toCombinator(f);
      return withDescription(this, "combine", other, f, Bacon.combineAsArray(this, other).map(function(values) {
        return combinator(values[0], values[1]);
      }));
    };

    Observable.prototype.decode = function(cases) {
      return withDescription(this, "decode", cases, this.combine(Bacon.combineTemplate(cases), function(key, values) {
        return values[key];
      }));
    };

    Observable.prototype.awaiting = function(other) {
      return withDescription(this, "awaiting", other, Bacon.groupSimultaneous(this, other).map(function(_arg) {
        var myValues, otherValues;
        myValues = _arg[0], otherValues = _arg[1];
        return otherValues.length === 0;
      }).toProperty(false).skipDuplicates());
    };

    Observable.prototype.name = function(name) {
      this.toString = function() {
        return name;
      };
      return this;
    };

    Observable.prototype.withDescription = function() {
      return describe.apply(null, arguments).apply(this);
    };

    return Observable;

  })();

  Observable.prototype.reduce = Observable.prototype.fold;

  Observable.prototype.assign = Observable.prototype.onValue;

  flatMap_ = function(root, f, firstOnly) {
    return new EventStream(describe(root, "flatMap" + (firstOnly ? "First" : ""), f), function(sink) {
      var checkEnd, composite;
      composite = new CompositeUnsubscribe();
      checkEnd = function(unsub) {
        unsub();
        if (composite.empty()) {
          return sink(end());
        }
      };
      composite.add(function(__, unsubRoot) {
        return root.subscribeInternal(function(event) {
          var child;
          if (event.isEnd()) {
            return checkEnd(unsubRoot);
          } else if (event.isError()) {
            return sink(event);
          } else if (firstOnly && composite.count() > 1) {
            return Bacon.more;
          } else {
            if (composite.unsubscribed) {
              return Bacon.noMore;
            }
            child = makeObservable(f(event.value()));
            return composite.add(function(unsubAll, unsubMe) {
              return child.subscribeInternal(function(event) {
                var reply;
                if (event.isEnd()) {
                  checkEnd(unsubMe);
                  return Bacon.noMore;
                } else {
                  if (event instanceof Initial) {
                    event = event.toNext();
                  }
                  reply = sink(event);
                  if (reply === Bacon.noMore) {
                    unsubAll();
                  }
                  return reply;
                }
              });
            });
          }
        });
      });
      return composite.unsubscribe;
    });
  };

  EventStream = (function(_super) {
    __extends(EventStream, _super);

    function EventStream(desc, subscribe) {
      var dispatcher;
      if (isFunction(desc)) {
        subscribe = desc;
        desc = [];
      }
      EventStream.__super__.constructor.call(this, desc);
      assertFunction(subscribe);
      dispatcher = new Dispatcher(subscribe);
      this.subscribeInternal = dispatcher.subscribe;
      this.subscribe = UpdateBarrier.wrappedSubscribe(this);
      this.hasSubscribers = dispatcher.hasSubscribers;
      registerObs(this);
    }

    EventStream.prototype.delay = function(delay) {
      return withDescription(this, "delay", delay, this.flatMap(function(value) {
        return Bacon.later(delay, value);
      }));
    };

    EventStream.prototype.debounce = function(delay) {
      return withDescription(this, "debounce", delay, this.flatMapLatest(function(value) {
        return Bacon.later(delay, value);
      }));
    };

    EventStream.prototype.debounceImmediate = function(delay) {
      return withDescription(this, "debounceImmediate", delay, this.flatMapFirst(function(value) {
        return Bacon.once(value).concat(Bacon.later(delay).filter(false));
      }));
    };

    EventStream.prototype.throttle = function(delay) {
      return withDescription(this, "throttle", delay, this.bufferWithTime(delay).map(function(values) {
        return values[values.length - 1];
      }));
    };

    EventStream.prototype.bufferWithTime = function(delay) {
      return withDescription(this, "bufferWithTime", delay, this.bufferWithTimeOrCount(delay, Number.MAX_VALUE));
    };

    EventStream.prototype.bufferWithCount = function(count) {
      return withDescription(this, "bufferWithCount", count, this.bufferWithTimeOrCount(void 0, count));
    };

    EventStream.prototype.bufferWithTimeOrCount = function(delay, count) {
      var flushOrSchedule;
      flushOrSchedule = function(buffer) {
        if (buffer.values.length === count) {
          return buffer.flush();
        } else if (delay !== void 0) {
          return buffer.schedule();
        }
      };
      return withDescription(this, "bufferWithTimeOrCount", delay, count, this.buffer(delay, flushOrSchedule, flushOrSchedule));
    };

    EventStream.prototype.buffer = function(delay, onInput, onFlush) {
      var buffer, delayMs, reply;
      if (onInput == null) {
        onInput = (function() {});
      }
      if (onFlush == null) {
        onFlush = (function() {});
      }
      buffer = {
        scheduled: false,
        end: null,
        values: [],
        flush: function() {
          var reply;
          this.scheduled = false;
          if (this.values.length > 0) {
            reply = this.push(next(this.values));
            this.values = [];
            if (this.end != null) {
              return this.push(this.end);
            } else if (reply !== Bacon.noMore) {
              return onFlush(this);
            }
          } else {
            if (this.end != null) {
              return this.push(this.end);
            }
          }
        },
        schedule: function() {
          if (!this.scheduled) {
            this.scheduled = true;
            return delay((function(_this) {
              return function() {
                return _this.flush();
              };
            })(this));
          }
        }
      };
      reply = Bacon.more;
      if (!isFunction(delay)) {
        delayMs = delay;
        delay = function(f) {
          return Bacon.scheduler.setTimeout(f, delayMs);
        };
      }
      return withDescription(this, "buffer", this.withHandler(function(event) {
        buffer.push = this.push;
        if (event.isError()) {
          reply = this.push(event);
        } else if (event.isEnd()) {
          buffer.end = event;
          if (!buffer.scheduled) {
            buffer.flush();
          }
        } else {
          buffer.values.push(event.value());
          onInput(buffer);
        }
        return reply;
      }));
    };

    EventStream.prototype.merge = function(right) {
      var left;
      assertEventStream(right);
      left = this;
      return withDescription(left, "merge", right, Bacon.mergeAll(this, right));
    };

    EventStream.prototype.toProperty = function(initValue) {
      if (arguments.length === 0) {
        initValue = None;
      }
      return withDescription(this, "toProperty", initValue, this.scan(initValue, latterF, true));
    };

    EventStream.prototype.toEventStream = function() {
      return this;
    };

    EventStream.prototype.sampledBy = function(sampler, combinator) {
      return withDescription(this, "sampledBy", sampler, combinator, this.toProperty().sampledBy(sampler, combinator));
    };

    EventStream.prototype.concat = function(right) {
      var left;
      left = this;
      return new EventStream(describe(left, "concat", right), function(sink) {
        var unsubLeft, unsubRight;
        unsubRight = nop;
        unsubLeft = left.subscribeInternal(function(e) {
          if (e.isEnd()) {
            return unsubRight = right.subscribeInternal(sink);
          } else {
            return sink(e);
          }
        });
        return function() {
          unsubLeft();
          return unsubRight();
        };
      });
    };

    EventStream.prototype.takeUntil = function(stopper) {
      var endMarker;
      endMarker = {};
      return withDescription(this, "takeUntil", stopper, Bacon.groupSimultaneous(this.mapEnd(endMarker), stopper.skipErrors()).withHandler(function(event) {
        var data, reply, value, _i, _len, _ref1;
        if (!event.hasValue()) {
          return this.push(event);
        } else {
          _ref1 = event.value(), data = _ref1[0], stopper = _ref1[1];
          if (stopper.length) {
            return this.push(end());
          } else {
            reply = Bacon.more;
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              value = data[_i];
              if (value === endMarker) {
                reply = this.push(end());
              } else {
                reply = this.push(next(value));
              }
            }
            return reply;
          }
        }
      }));
    };

    EventStream.prototype.skipUntil = function(starter) {
      var started;
      started = starter.take(1).map(true).toProperty(false);
      return withDescription(this, "skipUntil", starter, this.filter(started));
    };

    EventStream.prototype.skipWhile = function() {
      var args, f, ok;
      f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      ok = false;
      return convertArgsToFunction(this, f, args, function(f) {
        return withDescription(this, "skipWhile", f, this.withHandler(function(event) {
          if (ok || !event.hasValue() || !f(event.value())) {
            if (event.hasValue()) {
              ok = true;
            }
            return this.push(event);
          } else {
            return Bacon.more;
          }
        }));
      });
    };

    EventStream.prototype.startWith = function(seed) {
      return withDescription(this, "startWith", seed, Bacon.once(seed).concat(this));
    };

    EventStream.prototype.withHandler = function(handler) {
      var dispatcher;
      dispatcher = new Dispatcher(this.subscribeInternal, handler);
      return new EventStream(describe(this, "withHandler", handler), dispatcher.subscribe);
    };

    return EventStream;

  })(Observable);

  Property = (function(_super) {
    __extends(Property, _super);

    function Property(desc, subscribe, handler) {
      if (isFunction(desc)) {
        handler = subscribe;
        subscribe = desc;
        desc = [];
      }
      Property.__super__.constructor.call(this, desc);
      assertFunction(subscribe);
      if (handler === true) {
        this.subscribeInternal = subscribe;
      } else {
        this.subscribeInternal = new PropertyDispatcher(this, subscribe, handler).subscribe;
      }
      this.subscribe = UpdateBarrier.wrappedSubscribe(this);
      registerObs(this);
    }

    Property.prototype.sampledBy = function(sampler, combinator) {
      var lazy, result, samplerSource, stream, thisSource;
      if (combinator != null) {
        combinator = toCombinator(combinator);
      } else {
        lazy = true;
        combinator = function(f) {
          return f();
        };
      }
      thisSource = new Source(this, false, this.subscribeInternal, lazy);
      samplerSource = new Source(sampler, true, sampler.subscribeInternal, lazy);
      stream = Bacon.when([thisSource, samplerSource], combinator);
      result = sampler instanceof Property ? stream.toProperty() : stream;
      return withDescription(this, "sampledBy", sampler, combinator, result);
    };

    Property.prototype.sample = function(interval) {
      return withDescription(this, "sample", interval, this.sampledBy(Bacon.interval(interval, {})));
    };

    Property.prototype.changes = function() {
      return new EventStream(describe(this, "changes"), (function(_this) {
        return function(sink) {
          return _this.subscribeInternal(function(event) {
            if (!event.isInitial()) {
              return sink(event);
            }
          });
        };
      })(this));
    };

    Property.prototype.withHandler = function(handler) {
      return new Property(describe(this, "withHandler", handler), this.subscribeInternal, handler);
    };

    Property.prototype.toProperty = function() {
      assertNoArguments(arguments);
      return this;
    };

    Property.prototype.toEventStream = function() {
      return new EventStream(describe(this, "toEventStream"), (function(_this) {
        return function(sink) {
          return _this.subscribeInternal(function(event) {
            if (event.isInitial()) {
              event = event.toNext();
            }
            return sink(event);
          });
        };
      })(this));
    };

    Property.prototype.and = function(other) {
      return withDescription(this, "and", other, this.combine(other, function(x, y) {
        return x && y;
      }));
    };

    Property.prototype.or = function(other) {
      return withDescription(this, "or", other, this.combine(other, function(x, y) {
        return x || y;
      }));
    };

    Property.prototype.delay = function(delay) {
      return this.delayChanges("delay", delay, function(changes) {
        return changes.delay(delay);
      });
    };

    Property.prototype.debounce = function(delay) {
      return this.delayChanges("debounce", delay, function(changes) {
        return changes.debounce(delay);
      });
    };

    Property.prototype.throttle = function(delay) {
      return this.delayChanges("throttle", delay, function(changes) {
        return changes.throttle(delay);
      });
    };

    Property.prototype.delayChanges = function() {
      var desc, f, _i;
      desc = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), f = arguments[_i++];
      return withDescription.apply(null, [this].concat(__slice.call(desc), [addPropertyInitValueToStream(this, f(this.changes()))]));
    };

    Property.prototype.takeUntil = function(stopper) {
      var changes;
      changes = this.changes().takeUntil(stopper);
      return withDescription(this, "takeUntil", stopper, addPropertyInitValueToStream(this, changes));
    };

    Property.prototype.startWith = function(value) {
      return withDescription(this, "startWith", value, this.scan(value, function(prev, next) {
        return next;
      }));
    };

    return Property;

  })(Observable);

  convertArgsToFunction = function(obs, f, args, method) {
    var sampled;
    if (f instanceof Property) {
      sampled = f.sampledBy(obs, function(p, s) {
        return [p, s];
      });
      return method.apply(sampled, [
        function(_arg) {
          var p, s;
          p = _arg[0], s = _arg[1];
          return p;
        }
      ]).map(function(_arg) {
        var p, s;
        p = _arg[0], s = _arg[1];
        return s;
      });
    } else {
      f = makeFunction(f, args);
      return method.apply(obs, [f]);
    }
  };

  addPropertyInitValueToStream = function(property, stream) {
    var justInitValue;
    justInitValue = new EventStream(describe(property, "justInitValue"), function(sink) {
      var unsub, value;
      value = null;
      unsub = property.subscribeInternal(function(event) {
        if (event.hasValue()) {
          value = event;
        }
        return Bacon.noMore;
      });
      UpdateBarrier.whenDoneWith(justInitValue, function() {
        if (value != null) {
          sink(value);
        }
        return sink(end());
      });
      return unsub;
    });
    return justInitValue.concat(stream).toProperty();
  };

  Dispatcher = (function() {
    function Dispatcher(subscribe, handleEvent) {
      var done, ended, prevError, pushIt, pushing, queue, removeSub, subscriptions, unsubscribeFromSource, waiters;
      if (subscribe == null) {
        subscribe = function() {
          return nop;
        };
      }
      subscriptions = [];
      queue = [];
      pushing = false;
      ended = false;
      this.hasSubscribers = function() {
        return subscriptions.length > 0;
      };
      prevError = null;
      unsubscribeFromSource = nop;
      removeSub = function(subscription) {
        return subscriptions = _.without(subscription, subscriptions);
      };
      waiters = null;
      done = function() {
        var w, ws, _i, _len, _results;
        if (waiters != null) {
          ws = waiters;
          waiters = null;
          _results = [];
          for (_i = 0, _len = ws.length; _i < _len; _i++) {
            w = ws[_i];
            _results.push(w());
          }
          return _results;
        }
      };
      pushIt = function(event) {
        var reply, sub, success, tmp, _i, _len;
        if (!pushing) {
          if (event === prevError) {
            return;
          }
          if (event.isError()) {
            prevError = event;
          }
          success = false;
          try {
            pushing = true;
            tmp = subscriptions;
            for (_i = 0, _len = tmp.length; _i < _len; _i++) {
              sub = tmp[_i];
              reply = sub.sink(event);
              if (reply === Bacon.noMore || event.isEnd()) {
                removeSub(sub);
              }
            }
            success = true;
          } finally {
            pushing = false;
            if (!success) {
              queue = [];
            }
          }
          success = true;
          while (queue.length) {
            event = queue.shift();
            this.push(event);
          }
          done(event);
          if (this.hasSubscribers()) {
            return Bacon.more;
          } else {
            unsubscribeFromSource();
            return Bacon.noMore;
          }
        } else {
          queue.push(event);
          return Bacon.more;
        }
      };
      this.push = (function(_this) {
        return function(event) {
          return UpdateBarrier.inTransaction(event, _this, pushIt, [event]);
        };
      })(this);
      if (handleEvent == null) {
        handleEvent = function(event) {
          return this.push(event);
        };
      }
      this.handleEvent = (function(_this) {
        return function(event) {
          if (event.isEnd()) {
            ended = true;
          }
          return handleEvent.apply(_this, [event]);
        };
      })(this);
      this.subscribe = (function(_this) {
        return function(sink) {
          var subscription, unsubSrc;
          if (ended) {
            sink(end());
            return nop;
          } else {
            assertFunction(sink);
            subscription = {
              sink: sink
            };
            subscriptions.push(subscription);
            if (subscriptions.length === 1) {
              unsubSrc = subscribe(_this.handleEvent);
              unsubscribeFromSource = function() {
                unsubSrc();
                return unsubscribeFromSource = nop;
              };
            }
            assertFunction(unsubscribeFromSource);
            return function() {
              removeSub(subscription);
              if (!_this.hasSubscribers()) {
                return unsubscribeFromSource();
              }
            };
          }
        };
      })(this);
    }

    return Dispatcher;

  })();

  PropertyDispatcher = (function(_super) {
    __extends(PropertyDispatcher, _super);

    function PropertyDispatcher(p, subscribe, handleEvent) {
      var current, currentValueRootId, ended, push;
      PropertyDispatcher.__super__.constructor.call(this, subscribe, handleEvent);
      current = None;
      currentValueRootId = void 0;
      push = this.push;
      subscribe = this.subscribe;
      ended = false;
      this.push = (function(_this) {
        return function(event) {
          if (event.isEnd()) {
            ended = true;
          }
          if (event.hasValue()) {
            current = new Some(event);
            currentValueRootId = UpdateBarrier.currentEventId();
          }
          return push.apply(_this, [event]);
        };
      })(this);
      this.subscribe = (function(_this) {
        return function(sink) {
          var dispatchingId, initSent, maybeSubSource, reply, valId;
          initSent = false;
          reply = Bacon.more;
          maybeSubSource = function() {
            if (reply === Bacon.noMore) {
              return nop;
            } else if (ended) {
              sink(end());
              return nop;
            } else {
              return subscribe.apply(this, [sink]);
            }
          };
          if (current.isDefined && (_this.hasSubscribers() || ended)) {
            dispatchingId = UpdateBarrier.currentEventId();
            valId = currentValueRootId;
            if (!ended && valId && dispatchingId && dispatchingId !== valId) {
              UpdateBarrier.whenDoneWith(p, function() {
                if (currentValueRootId === valId) {
                  return sink(initial(current.get().value()));
                }
              });
              return maybeSubSource();
            } else {
              UpdateBarrier.inTransaction(void 0, _this, (function() {
                return reply = sink(initial(current.get().value()));
              }), []);
              return maybeSubSource();
            }
          } else {
            return maybeSubSource();
          }
        };
      })(this);
    }

    return PropertyDispatcher;

  })(Dispatcher);

  Bus = (function(_super) {
    __extends(Bus, _super);

    function Bus() {
      var ended, guardedSink, sink, subscribeAll, subscribeInput, subscriptions, unsubAll, unsubscribeInput;
      sink = void 0;
      subscriptions = [];
      ended = false;
      guardedSink = (function(_this) {
        return function(input) {
          return function(event) {
            if (event.isEnd()) {
              unsubscribeInput(input);
              return Bacon.noMore;
            } else {
              return sink(event);
            }
          };
        };
      })(this);
      unsubAll = function() {
        var sub, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = subscriptions.length; _i < _len; _i++) {
          sub = subscriptions[_i];
          _results.push(typeof sub.unsub === "function" ? sub.unsub() : void 0);
        }
        return _results;
      };
      subscribeInput = function(subscription) {
        return subscription.unsub = subscription.input.subscribeInternal(guardedSink(subscription.input));
      };
      unsubscribeInput = function(input) {
        var i, sub, _i, _len;
        for (i = _i = 0, _len = subscriptions.length; _i < _len; i = ++_i) {
          sub = subscriptions[i];
          if (sub.input === input) {
            if (typeof sub.unsub === "function") {
              sub.unsub();
            }
            subscriptions.splice(i, 1);
            return;
          }
        }
      };
      subscribeAll = (function(_this) {
        return function(newSink) {
          var subscription, _i, _len, _ref1;
          sink = newSink;
          _ref1 = cloneArray(subscriptions);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            subscription = _ref1[_i];
            subscribeInput(subscription);
          }
          return unsubAll;
        };
      })(this);
      Bus.__super__.constructor.call(this, describe(Bacon, "Bus"), subscribeAll);
      this.plug = (function(_this) {
        return function(input) {
          var sub;
          if (ended) {
            return;
          }
          sub = {
            input: input
          };
          subscriptions.push(sub);
          if ((sink != null)) {
            subscribeInput(sub);
          }
          return function() {
            return unsubscribeInput(input);
          };
        };
      })(this);
      this.push = (function(_this) {
        return function(value) {
          return typeof sink === "function" ? sink(next(value)) : void 0;
        };
      })(this);
      this.error = (function(_this) {
        return function(error) {
          return typeof sink === "function" ? sink(new Error(error)) : void 0;
        };
      })(this);
      this.end = (function(_this) {
        return function() {
          ended = true;
          unsubAll();
          return typeof sink === "function" ? sink(end()) : void 0;
        };
      })(this);
    }

    return Bus;

  })(EventStream);

  Source = (function() {
    function Source(obs, sync, subscribe, lazy) {
      this.obs = obs;
      this.sync = sync;
      this.subscribe = subscribe;
      this.lazy = lazy != null ? lazy : false;
      this.queue = [];
      if (this.subscribe == null) {
        this.subscribe = this.obs.subscribeInternal;
      }
      this.toString = this.obs.toString;
    }

    Source.prototype.markEnded = function() {
      return this.ended = true;
    };

    Source.prototype.consume = function() {
      if (this.lazy) {
        return _.always(this.queue[0]);
      } else {
        return this.queue[0];
      }
    };

    Source.prototype.push = function(x) {
      return this.queue = [x];
    };

    Source.prototype.mayHave = function() {
      return true;
    };

    Source.prototype.hasAtLeast = function() {
      return this.queue.length;
    };

    Source.prototype.flatten = true;

    return Source;

  })();

  ConsumingSource = (function(_super) {
    __extends(ConsumingSource, _super);

    function ConsumingSource() {
      return ConsumingSource.__super__.constructor.apply(this, arguments);
    }

    ConsumingSource.prototype.consume = function() {
      return this.queue.shift();
    };

    ConsumingSource.prototype.push = function(x) {
      return this.queue.push(x);
    };

    ConsumingSource.prototype.mayHave = function(c) {
      return !this.ended || this.queue.length >= c;
    };

    ConsumingSource.prototype.hasAtLeast = function(c) {
      return this.queue.length >= c;
    };

    ConsumingSource.prototype.flatten = false;

    return ConsumingSource;

  })(Source);

  BufferingSource = (function(_super) {
    __extends(BufferingSource, _super);

    function BufferingSource(obs) {
      this.obs = obs;
      BufferingSource.__super__.constructor.call(this, this.obs, true, this.obs.subscribeInternal);
    }

    BufferingSource.prototype.consume = function() {
      var values;
      values = this.queue;
      this.queue = [];
      return function() {
        return values;
      };
    };

    BufferingSource.prototype.push = function(x) {
      return this.queue.push(x());
    };

    BufferingSource.prototype.hasAtLeast = function() {
      return true;
    };

    return BufferingSource;

  })(Source);

  Source.isTrigger = function(s) {
    if (s instanceof Source) {
      return s.sync;
    } else {
      return s instanceof EventStream;
    }
  };

  Source.fromObservable = function(s) {
    if (s instanceof Source) {
      return s;
    } else if (s instanceof Property) {
      return new Source(s, false);
    } else {
      return new ConsumingSource(s, true);
    }
  };

  describe = function() {
    var args, context, method;
    context = arguments[0], method = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if ((context || method) instanceof Desc) {
      return context || method;
    } else {
      return new Desc(context, method, args);
    }
  };

  Desc = (function() {
    function Desc(context, method, args) {
      var collectDeps, dependsOn, findDeps, flatDeps;
      findDeps = function(x) {
        if (isArray(x)) {
          return _.flatMap(findDeps, x);
        } else if (isObservable(x)) {
          return [x];
        } else if (x instanceof Source) {
          return [x.obs];
        } else {
          return [];
        }
      };
      flatDeps = null;
      collectDeps = function(o) {
        var dep, deps, _i, _len, _results;
        deps = o.internalDeps();
        _results = [];
        for (_i = 0, _len = deps.length; _i < _len; _i++) {
          dep = deps[_i];
          flatDeps[dep.id] = true;
          _results.push(collectDeps(dep));
        }
        return _results;
      };
      dependsOn = function(b) {
        if (flatDeps == null) {
          flatDeps = {};
          collectDeps(this);
        }
        return flatDeps[b.id];
      };
      this.apply = function(obs) {
        var deps;
        deps = _.cached((function() {
          return findDeps([context].concat(args));
        }));
        obs.internalDeps = obs.internalDeps || deps;
        obs.dependsOn = dependsOn;
        obs.deps = deps;
        obs.toString = function() {
          return _.toString(context) + "." + _.toString(method) + "(" + _.map(_.toString, args) + ")";
        };
        obs.inspect = function() {
          return obs.toString();
        };
        obs.desc = function() {
          return {
            context: context,
            method: method,
            args: args
          };
        };
        return obs;
      };
    }

    return Desc;

  })();

  withDescription = function() {
    var desc, obs, _i;
    desc = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), obs = arguments[_i++];
    return describe.apply(null, desc).apply(obs);
  };

  Bacon.when = function() {
    var f, i, index, ix, len, needsBarrier, pat, patSources, pats, patterns, resultStream, s, sources, triggerFound, usage, _i, _j, _len, _len1, _ref1;
    patterns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (patterns.length === 0) {
      return Bacon.never();
    }
    len = patterns.length;
    usage = "when: expecting arguments in the form (Observable+,function)+";
    assert(usage, len % 2 === 0);
    sources = [];
    pats = [];
    i = 0;
    while (i < len) {
      patSources = _.toArray(patterns[i]);
      f = patterns[i + 1];
      pat = {
        f: (isFunction(f) ? f : (function() {
          return f;
        })),
        ixs: []
      };
      triggerFound = false;
      for (_i = 0, _len = patSources.length; _i < _len; _i++) {
        s = patSources[_i];
        index = _.indexOf(sources, s);
        if (!triggerFound) {
          triggerFound = Source.isTrigger(s);
        }
        if (index < 0) {
          sources.push(s);
          index = sources.length - 1;
        }
        _ref1 = pat.ixs;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          ix = _ref1[_j];
          if (ix.index === index) {
            ix.count++;
          }
        }
        pat.ixs.push({
          index: index,
          count: 1
        });
      }
      assert("At least one EventStream required", triggerFound ||  (!patSources.length));
      if (patSources.length > 0) {
        pats.push(pat);
      }
      i = i + 2;
    }
    if (!sources.length) {
      return Bacon.never();
    }
    sources = _.map(Source.fromObservable, sources);
    needsBarrier = (_.any(sources, function(s) {
      return s.flatten;
    })) && (containsDuplicateDeps(_.map((function(s) {
      return s.obs;
    }), sources)));
    return resultStream = new EventStream(describe.apply(null, [Bacon, "when"].concat(__slice.call(patterns))), function(sink) {
      var cannotMatch, cannotSync, ends, match, nonFlattened, part, triggers;
      triggers = [];
      ends = false;
      match = function(p) {
        var _k, _len2, _ref2;
        _ref2 = p.ixs;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          i = _ref2[_k];
          if (!sources[i.index].hasAtLeast(i.count)) {
            return false;
          }
        }
        return true;
      };
      cannotSync = function(source) {
        return !source.sync || source.ended;
      };
      cannotMatch = function(p) {
        var _k, _len2, _ref2;
        _ref2 = p.ixs;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          i = _ref2[_k];
          if (!sources[i.index].mayHave(i.count)) {
            return true;
          }
        }
      };
      nonFlattened = function(trigger) {
        return !trigger.source.flatten;
      };
      part = function(source) {
        return function(unsubAll) {
          var flush, flushLater, flushWhileTriggers;
          flushLater = function() {
            return UpdateBarrier.whenDoneWith(resultStream, flush);
          };
          flushWhileTriggers = function() {
            var functions, p, reply, trigger, _k, _len2;
            if (triggers.length > 0) {
              reply = Bacon.more;
              trigger = triggers.pop();
              for (_k = 0, _len2 = pats.length; _k < _len2; _k++) {
                p = pats[_k];
                if (match(p)) {
                  functions = (function() {
                    var _l, _len3, _ref2, _results;
                    _ref2 = p.ixs;
                    _results = [];
                    for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
                      i = _ref2[_l];
                      _results.push(sources[i.index].consume());
                    }
                    return _results;
                  })();
                  reply = sink(trigger.e.apply(function() {
                    var fun, values;
                    values = (function() {
                      var _l, _len3, _results;
                      _results = [];
                      for (_l = 0, _len3 = functions.length; _l < _len3; _l++) {
                        fun = functions[_l];
                        _results.push(fun());
                      }
                      return _results;
                    })();
                    return p.f.apply(p, values);
                  }));
                  if (triggers.length && needsBarrier) {
                    triggers = _.filter(nonFlattened, triggers);
                  }
                  if (reply === Bacon.noMore) {
                    return reply;
                  } else {
                    return flushWhileTriggers();
                  }
                }
              }
            } else {
              return Bacon.more;
            }
          };
          flush = function() {
            var reply;
            reply = flushWhileTriggers();
            if (ends) {
              ends = false;
              if (_.all(sources, cannotSync) || _.all(pats, cannotMatch)) {
                reply = Bacon.noMore;
                sink(end());
              }
            }
            if (reply === Bacon.noMore) {
              unsubAll();
            }
            return reply;
          };
          return source.subscribe(function(e) {
            var reply;
            if (e.isEnd()) {
              ends = true;
              source.markEnded();
              flushLater();
            } else if (e.isError()) {
              reply = sink(e);
            } else {
              source.push(e.value);
              if (source.sync) {
                triggers.push({
                  source: source,
                  e: e
                });
                if (needsBarrier) {
                  flushLater();
                } else {
                  flush();
                }
              }
            }
            if (reply === Bacon.noMore) {
              unsubAll();
            }
            return reply || Bacon.more;
          });
        };
      };
      return compositeUnsubscribe.apply(null, (function() {
        var _k, _len2, _results;
        _results = [];
        for (_k = 0, _len2 = sources.length; _k < _len2; _k++) {
          s = sources[_k];
          _results.push(part(s));
        }
        return _results;
      })());
    });
  };

  containsDuplicateDeps = function(observables, state) {
    var checkObservable;
    if (state == null) {
      state = [];
    }
    checkObservable = function(obs) {
      var deps;
      if (Bacon._.contains(state, obs)) {
        return true;
      } else {
        deps = obs.internalDeps();
        if (deps.length) {
          state.push(obs);
          return Bacon._.any(deps, checkObservable);
        } else {
          state.push(obs);
          return false;
        }
      }
    };
    return Bacon._.any(observables, checkObservable);
  };

  Bacon.update = function() {
    var i, initial, lateBindFirst, patterns;
    initial = arguments[0], patterns = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    lateBindFirst = function(f) {
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return function(i) {
          return f.apply(null, [i].concat(args));
        };
      };
    };
    i = patterns.length - 1;
    while (i > 0) {
      if (!(patterns[i] instanceof Function)) {
        patterns[i] = (function(x) {
          return function() {
            return x;
          };
        })(patterns[i]);
      }
      patterns[i] = lateBindFirst(patterns[i]);
      i = i - 2;
    }
    return withDescription.apply(null, [Bacon, "update", initial].concat(__slice.call(patterns), [Bacon.when.apply(Bacon, patterns).scan(initial, (function(x, f) {
      return f(x);
    }))]));
  };

  compositeUnsubscribe = function() {
    var ss;
    ss = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return new CompositeUnsubscribe(ss).unsubscribe;
  };

  CompositeUnsubscribe = (function() {
    function CompositeUnsubscribe(ss) {
      var s, _i, _len;
      if (ss == null) {
        ss = [];
      }
      this.unsubscribe = __bind(this.unsubscribe, this);
      this.unsubscribed = false;
      this.subscriptions = [];
      this.starting = [];
      for (_i = 0, _len = ss.length; _i < _len; _i++) {
        s = ss[_i];
        this.add(s);
      }
    }

    CompositeUnsubscribe.prototype.add = function(subscription) {
      var ended, unsub, unsubMe;
      if (this.unsubscribed) {
        return;
      }
      ended = false;
      unsub = nop;
      this.starting.push(subscription);
      unsubMe = (function(_this) {
        return function() {
          if (_this.unsubscribed) {
            return;
          }
          ended = true;
          _this.remove(unsub);
          return _.remove(subscription, _this.starting);
        };
      })(this);
      unsub = subscription(this.unsubscribe, unsubMe);
      if (!(this.unsubscribed || ended)) {
        this.subscriptions.push(unsub);
      }
      _.remove(subscription, this.starting);
      return unsub;
    };

    CompositeUnsubscribe.prototype.remove = function(unsub) {
      if (this.unsubscribed) {
        return;
      }
      if ((_.remove(unsub, this.subscriptions)) !== void 0) {
        return unsub();
      }
    };

    CompositeUnsubscribe.prototype.unsubscribe = function() {
      var s, _i, _len, _ref1;
      if (this.unsubscribed) {
        return;
      }
      this.unsubscribed = true;
      _ref1 = this.subscriptions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        s = _ref1[_i];
        s();
      }
      this.subscriptions = [];
      return this.starting = [];
    };

    CompositeUnsubscribe.prototype.count = function() {
      if (this.unsubscribed) {
        return 0;
      }
      return this.subscriptions.length + this.starting.length;
    };

    CompositeUnsubscribe.prototype.empty = function() {
      return this.count() === 0;
    };

    return CompositeUnsubscribe;

  })();

  Bacon.CompositeUnsubscribe = CompositeUnsubscribe;

  Some = (function() {
    function Some(value) {
      this.value = value;
    }

    Some.prototype.getOrElse = function() {
      return this.value;
    };

    Some.prototype.get = function() {
      return this.value;
    };

    Some.prototype.filter = function(f) {
      if (f(this.value)) {
        return new Some(this.value);
      } else {
        return None;
      }
    };

    Some.prototype.map = function(f) {
      return new Some(f(this.value));
    };

    Some.prototype.forEach = function(f) {
      return f(this.value);
    };

    Some.prototype.isDefined = true;

    Some.prototype.toArray = function() {
      return [this.value];
    };

    Some.prototype.inspect = function() {
      return "Some(" + this.value + ")";
    };

    Some.prototype.toString = function() {
      return this.inspect();
    };

    return Some;

  })();

  None = {
    getOrElse: function(value) {
      return value;
    },
    filter: function() {
      return None;
    },
    map: function() {
      return None;
    },
    forEach: function() {},
    isDefined: false,
    toArray: function() {
      return [];
    },
    inspect: function() {
      return "None";
    },
    toString: function() {
      return this.inspect();
    }
  };

  UpdateBarrier = (function() {
    var afterTransaction, afters, currentEventId, findIndependent, flush, inTransaction, independent, rootEvent, waiters, whenDoneWith, wrappedSubscribe;
    rootEvent = void 0;
    waiters = [];
    afters = [];
    afterTransaction = function(f) {
      if (rootEvent) {
        return afters.push(f);
      } else {
        return f();
      }
    };
    independent = function(waiter) {
      return !_.any(waiters, (function(other) {
        return waiter.obs.dependsOn(other.obs);
      }));
    };
    whenDoneWith = function(obs, f) {
      if (rootEvent) {
        return waiters.push({
          obs: obs,
          f: f
        });
      } else {
        return f();
      }
    };
    findIndependent = function() {
      while (!independent(waiters[0])) {
        waiters.push(waiters.splice(0, 1)[0]);
      }
      return waiters.splice(0, 1)[0];
    };
    flush = function() {
      var _results;
      _results = [];
      while (waiters.length) {
        _results.push(findIndependent().f());
      }
      return _results;
    };
    inTransaction = function(event, context, f, args) {
      var result;
      if (rootEvent) {
        return f.apply(context, args);
      } else {
        rootEvent = event;
        try {
          result = f.apply(context, args);
          flush();
        } finally {
          rootEvent = void 0;
          while (afters.length) {
            f = afters.splice(0, 1)[0];
            f();
          }
        }
        return result;
      }
    };
    currentEventId = function() {
      if (rootEvent) {
        return rootEvent.id;
      } else {
        return void 0;
      }
    };
    wrappedSubscribe = function(obs) {
      return function(sink) {
        var doUnsub, unsub, unsubd;
        unsubd = false;
        doUnsub = function() {};
        unsub = function() {
          unsubd = true;
          return doUnsub();
        };
        if (!unsubd) {
          doUnsub = obs.subscribeInternal(function(event) {
            return afterTransaction(function() {
              var reply;
              if (!unsubd) {
                reply = sink(event);
                if (reply === Bacon.noMore) {
                  return unsub();
                }
              }
            });
          });
        }
        return unsub;
      };
    };
    return {
      whenDoneWith: whenDoneWith,
      inTransaction: inTransaction,
      currentEventId: currentEventId,
      wrappedSubscribe: wrappedSubscribe
    };
  })();

  Bacon.EventStream = EventStream;

  Bacon.Property = Property;

  Bacon.Observable = Observable;

  Bacon.Bus = Bus;

  Bacon.Initial = Initial;

  Bacon.Next = Next;

  Bacon.End = End;

  Bacon.Error = Error;

  nop = function() {};

  latterF = function(_, x) {
    return x();
  };

  former = function(x, _) {
    return x;
  };

  initial = function(value) {
    return new Initial(_.always(value));
  };

  next = function(value) {
    return new Next(_.always(value));
  };

  end = function() {
    return new End();
  };

  toEvent = function(x) {
    if (x instanceof Event) {
      return x;
    } else {
      return next(x);
    }
  };

  cloneArray = function(xs) {
    return xs.slice(0);
  };

  assert = function(message, condition) {
    if (!condition) {
      throw message;
    }
  };

  assertEventStream = function(event) {
    if (!(event instanceof EventStream)) {
      throw "not an EventStream : " + event;
    }
  };

  assertFunction = function(f) {
    return assert("not a function : " + f, isFunction(f));
  };

  isFunction = function(f) {
    return typeof f === "function";
  };

  isArray = function(xs) {
    return xs instanceof Array;
  };

  isObservable = function(x) {
    return x instanceof Observable;
  };

  assertArray = function(xs) {
    if (!isArray(xs)) {
      throw "not an array : " + xs;
    }
  };

  assertNoArguments = function(args) {
    return assert("no arguments supported", args.length === 0);
  };

  assertString = function(x) {
    if (typeof x !== "string") {
      throw "not a string : " + x;
    }
  };

  partiallyApplied = function(f, applied) {
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return f.apply(null, applied.concat(args));
    };
  };

  makeSpawner = function(args) {
    if (args.length === 1 && isObservable(args[0])) {
      return _.always(args[0]);
    } else {
      return makeFunctionArgs(args);
    }
  };

  makeFunctionArgs = function(args) {
    args = Array.prototype.slice.call(args);
    return makeFunction_.apply(null, args);
  };

  makeFunction_ = withMethodCallSupport(function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (isFunction(f)) {
      if (args.length) {
        return partiallyApplied(f, args);
      } else {
        return f;
      }
    } else if (isFieldKey(f)) {
      return toFieldExtractor(f, args);
    } else {
      return _.always(f);
    }
  });

  makeFunction = function(f, args) {
    return makeFunction_.apply(null, [f].concat(__slice.call(args)));
  };

  makeObservable = function(x) {
    if (isObservable(x)) {
      return x;
    } else {
      return Bacon.once(x);
    }
  };

  isFieldKey = function(f) {
    return (typeof f === "string") && f.length > 1 && f.charAt(0) === ".";
  };

  Bacon.isFieldKey = isFieldKey;

  toFieldExtractor = function(f, args) {
    var partFuncs, parts;
    parts = f.slice(1).split(".");
    partFuncs = _.map(toSimpleExtractor(args), parts);
    return function(value) {
      var _i, _len;
      for (_i = 0, _len = partFuncs.length; _i < _len; _i++) {
        f = partFuncs[_i];
        value = f(value);
      }
      return value;
    };
  };

  toSimpleExtractor = function(args) {
    return function(key) {
      return function(value) {
        var fieldValue;
        if (value == null) {
          return void 0;
        } else {
          fieldValue = value[key];
          if (isFunction(fieldValue)) {
            return fieldValue.apply(value, args);
          } else {
            return fieldValue;
          }
        }
      };
    };
  };

  toFieldKey = function(f) {
    return f.slice(1);
  };

  toCombinator = function(f) {
    var key;
    if (isFunction(f)) {
      return f;
    } else if (isFieldKey(f)) {
      key = toFieldKey(f);
      return function(left, right) {
        return left[key](right);
      };
    } else {
      return assert("not a function or a field key: " + f, false);
    }
  };

  toOption = function(v) {
    if (v instanceof Some || v === None) {
      return v;
    } else {
      return new Some(v);
    }
  };

  _ = {
    indexOf: Array.prototype.indexOf ? function(xs, x) {
      return xs.indexOf(x);
    } : function(xs, x) {
      var i, y, _i, _len;
      for (i = _i = 0, _len = xs.length; _i < _len; i = ++_i) {
        y = xs[i];
        if (x === y) {
          return i;
        }
      }
      return -1;
    },
    indexWhere: function(xs, f) {
      var i, y, _i, _len;
      for (i = _i = 0, _len = xs.length; _i < _len; i = ++_i) {
        y = xs[i];
        if (f(y)) {
          return i;
        }
      }
      return -1;
    },
    head: function(xs) {
      return xs[0];
    },
    always: function(x) {
      return function() {
        return x;
      };
    },
    negate: function(f) {
      return function(x) {
        return !f(x);
      };
    },
    empty: function(xs) {
      return xs.length === 0;
    },
    tail: function(xs) {
      return xs.slice(1, xs.length);
    },
    filter: function(f, xs) {
      var filtered, x, _i, _len;
      filtered = [];
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        if (f(x)) {
          filtered.push(x);
        }
      }
      return filtered;
    },
    map: function(f, xs) {
      var x, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        _results.push(f(x));
      }
      return _results;
    },
    each: function(xs, f) {
      var key, value, _results;
      _results = [];
      for (key in xs) {
        value = xs[key];
        _results.push(f(key, value));
      }
      return _results;
    },
    toArray: function(xs) {
      if (isArray(xs)) {
        return xs;
      } else {
        return [xs];
      }
    },
    contains: function(xs, x) {
      return _.indexOf(xs, x) !== -1;
    },
    id: function(x) {
      return x;
    },
    last: function(xs) {
      return xs[xs.length - 1];
    },
    all: function(xs, f) {
      var x, _i, _len;
      if (f == null) {
        f = _.id;
      }
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        if (!f(x)) {
          return false;
        }
      }
      return true;
    },
    any: function(xs, f) {
      var x, _i, _len;
      if (f == null) {
        f = _.id;
      }
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        if (f(x)) {
          return true;
        }
      }
      return false;
    },
    without: function(x, xs) {
      return _.filter((function(y) {
        return y !== x;
      }), xs);
    },
    remove: function(x, xs) {
      var i;
      i = _.indexOf(xs, x);
      if (i >= 0) {
        return xs.splice(i, 1);
      }
    },
    fold: function(xs, seed, f) {
      var x, _i, _len;
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        seed = f(seed, x);
      }
      return seed;
    },
    flatMap: function(f, xs) {
      return _.fold(xs, [], (function(ys, x) {
        return ys.concat(f(x));
      }));
    },
    cached: function(f) {
      var value;
      value = None;
      return function() {
        if (value === None) {
          value = f();
          f = null;
        }
        return value;
      };
    },
    toString: function(obj) {
      var ex, internals, key, value;
      try {
        recursionDepth++;
        if (obj == null) {
          return "undefined";
        } else if (isFunction(obj)) {
          return "function";
        } else if (isArray(obj)) {
          if (recursionDepth > 5) {
            return "[..]";
          }
          return "[" + _.map(_.toString, obj).toString() + "]";
        } else if (((obj != null ? obj.toString : void 0) != null) && obj.toString !== Object.prototype.toString) {
          return obj.toString();
        } else if (typeof obj === "object") {
          if (recursionDepth > 5) {
            return "{..}";
          }
          internals = (function() {
            var _results;
            _results = [];
            for (key in obj) {
              if (!__hasProp.call(obj, key)) continue;
              value = (function() {
                try {
                  return obj[key];
                } catch (_error) {
                  ex = _error;
                  return ex;
                }
              })();
              _results.push(_.toString(key) + ":" + _.toString(value));
            }
            return _results;
          })();
          return "{" + internals + "}";
        } else {
          return obj;
        }
      } finally {
        recursionDepth--;
      }
    }
  };

  recursionDepth = 0;

  Bacon._ = _;

  Bacon.scheduler = {
    setTimeout: function(f, d) {
      return setTimeout(f, d);
    },
    setInterval: function(f, i) {
      return setInterval(f, i);
    },
    clearInterval: function(id) {
      return clearInterval(id);
    },
    now: function() {
      return new Date().getTime();
    }
  };

  if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
    define('lib/bacon',[], function() {
      return Bacon;
    });
    this.Bacon = Bacon;
  } else if (typeof module !== "undefined" && module !== null) {
    module.exports = Bacon;
    Bacon.Bacon = Bacon;
  } else {
    this.Bacon = Bacon;
  }

}).call(this);

define('Map',["utils", "draw", "Behavior", "Scale", "build", "UndoStack", "CallbackManager", "KeyManager", "Canvas", "data_styles", "SearchIndex", "lib/bacon"], function(utils, draw, Behavior, Scale, build, UndoStack, CallbackManager, KeyManager, Canvas, data_styles, SearchIndex, bacon) {
    /** Defines the metabolic map data, and manages drawing and building.

     Arguments
     ---------

     svg:

     css:

     selection: A d3 selection for a node to place the map inside.

     selection:

     zoom_container:

     settings:

     reaction_data:

     metabolite_data:

     cobra_model:

     canvas_size_and_loc:

     enable_search:

     */

    var Map = utils.make_class();
    // static methods
    Map.from_data = from_data;
    // instance methods
    Map.prototype = {
	// setup
	init: init,
	// more setup
	setup_containers: setup_containers,
	reset_containers: reset_containers,
	// scales
	get_scale: get_scale,
	set_scale: set_scale,
	// appearance
	set_status: set_status,
	set_model: set_model,
	set_reaction_data: set_reaction_data,
	set_metabolite_data: set_metabolite_data,
	clear_map: clear_map,
	// selection
	select_none: select_none,
	select_selectable: select_selectable,
	select_metabolite_with_id: select_metabolite_with_id,
	select_single_node: select_single_node,
	deselect_nodes: deselect_nodes,
	select_text_label: select_text_label,
	deselect_text_labels: deselect_text_labels,
	// build
	new_reaction_from_scratch: new_reaction_from_scratch,
	new_reaction_for_metabolite: new_reaction_for_metabolite,
	cycle_primary_node: cycle_primary_node,
	make_selected_node_primary: make_selected_node_primary,
	extend_nodes: extend_nodes,
	extend_reactions: extend_reactions,
	// delete
	delete_selected: delete_selected,
	delete_nodes: delete_nodes,
	delete_text_labels: delete_text_labels,
	delete_node_data: delete_node_data,
	delete_segment_data: delete_segment_data,
	delete_reaction_data: delete_reaction_data,
	delete_text_label_data: delete_text_label_data,
	// find
	get_selected_node_ids: get_selected_node_ids,
	get_selected_nodes: get_selected_nodes,
	get_selected_text_label_ids: get_selected_text_label_ids,
	get_selected_text_labels: get_selected_text_labels,
	segments_and_reactions_for_nodes: segments_and_reactions_for_nodes,
	// draw
	has_reaction_data: has_reaction_data,
	has_metabolite_data: has_metabolite_data,
	draw_everything: draw_everything,
	draw_all_reactions: draw_all_reactions,
	draw_these_reactions: draw_these_reactions,
	draw_all_nodes: draw_all_nodes,
	draw_these_nodes: draw_these_nodes,
	draw_these_text_labels: draw_these_text_labels,
	apply_reaction_data_to_map: apply_reaction_data_to_map,
	apply_reaction_data_to_reactions: apply_reaction_data_to_reactions,
	update_reaction_data_domain: update_reaction_data_domain,
	apply_metabolite_data_to_map: apply_metabolite_data_to_map,
	apply_metabolite_data_to_nodes: apply_metabolite_data_to_nodes,
	update_metabolite_data_domain: update_metabolite_data_domain,
	get_selected_node_ids: get_selected_node_ids,
	toggle_beziers: toggle_beziers,
	hide_beziers: hide_beziers,
	show_beziers: show_beziers,
	// zoom
	zoom_extent_nodes: zoom_extent_nodes,
	zoom_extent_canvas: zoom_extent_canvas,
	_zoom_extent: _zoom_extent,
	get_size: get_size,
	zoom_to_reaction: zoom_to_reaction,
	zoom_to_node: zoom_to_node,
	highlight_reaction: highlight_reaction,
	highlight_node: highlight_node,
	highlight: highlight,
	// io
	save: save,
	map_for_export: map_for_export,
	save_svg: save_svg
    };

    return Map;

    // -------------------------------------------------------------------------
    // setup

    function init(svg, css, selection, zoom_container, settings,
		  reaction_data, metabolite_data, cobra_model, 
		  canvas_size_and_loc, enable_search) {
	if (canvas_size_and_loc===null) {
	    var size = zoom_container.get_size();
	    canvas_size_and_loc = {x: -size.width, y: -size.height,
				   width: size.width*3, height: size.height*3};
	}

	// defaults
	this.default_reaction_color = '#334E75',

	// set up the defs
	this.svg = svg;
	this.defs = utils.setup_defs(svg, css);

	// make the canvas
	this.canvas = new Canvas(selection, canvas_size_and_loc);

	this.setup_containers(selection);
	this.sel = selection;
	this.zoom_container = zoom_container;

	this.settings = settings;
	this.settings.data_styles_stream['reaction']
	    .onValue(function(val) {
		this.apply_reaction_data_to_map();
	    }.bind(this));
	this.settings.data_styles_stream['metabolite']
	    .onValue(function(val) {
		this.apply_metabolite_data_to_map();
	    }.bind(this));

	// check and load data
	this.reaction_data_object = data_styles.import_and_check(reaction_data,
								 settings.data_styles['reaction'],
								 'reaction_data');
	this.metabolite_data_object = data_styles.import_and_check(metabolite_data,
								   settings.data_styles['metabolite'],
								   'metabolite_data');

	// set the model AFTER loading the datasets
	this.set_model(cobra_model);

	this.largest_ids = { reactions: -1,
			     nodes: -1,
			     segments: -1 };

	// make the scales
	this.scale = new Scale();
	this.scale.connect_to_settings(this.settings);

	// make the undo/redo stack
	this.undo_stack = new UndoStack();

	// make a behavior object
	this.behavior = new Behavior(this, this.undo_stack);

	// make a key manager
	this.key_manager = new KeyManager();

	// make the search index
	this.enable_search = enable_search;
	this.search_index = new SearchIndex();

	// deal with the window
	var window_translate = {'x': 0, 'y': 0},
	    window_scale = 1;

	// hide beziers
	this.beziers_enabled = false;

	// set up the callbacks
	this.callback_manager = new CallbackManager();
	
	this.nodes = {};
	this.reactions = {};
	this.membranes = [];
	this.text_labels = {};
	this.info = {};

	// rotation mode off
	this.rotation_on = false;

	// performs some extra checks
	this.debug = false;
    };

    // -------------------------------------------------------------------------
    // Import

    function from_data(map_data, svg, css, selection, zoom_container, settings,
		       reaction_data, metabolite_data, cobra_model, enable_search) {
	/** Load a json map and add necessary fields for rendering.
	 
	 */
	utils.check_undefined(arguments, ['map_data', 'svg', 'css', 'selection',
					  'zoom_container', 'settings',
					  'reaction_data', 'metabolite_data',
					  'cobra_model', 'enable_search']);

	if (this.debug) {
	    d3.json('map_spec.json', function(error, spec) {
		if (error) {
		    console.warn(error);
		    return;
		}
		utils.check_r(map_data, spec.spec, spec.can_be_none);
	    });
	}
	
	var canvas = map_data.canvas,
	    map = new Map(svg, css, selection, zoom_container, settings, 
			  reaction_data, metabolite_data, cobra_model, 
			  canvas, enable_search);

	map.reactions = map_data.reactions;
	map.nodes = map_data.nodes;
	map.membranes = map_data.membranes;
	map.text_labels = map_data.text_labels;
	map.info = map_data.info;

	// propogate coefficients and reversbility, and populate the search index
	for (var r_id in map.reactions) {
	    var reaction = map.reactions[r_id];
	    if (enable_search) {
		map.search_index.insert('r'+r_id, { 'name': reaction.bigg_id,
						    'data': { type: 'reaction',
							      reaction_id: r_id }});
	    }
	    for (var s_id in reaction.segments) {
		var segment = reaction.segments[s_id];
		segment.reversibility = reaction.reversibility;
		var from_node_bigg_id = map.nodes[segment.from_node_id].bigg_id;
		if (from_node_bigg_id in reaction.metabolites) {
		    segment.from_node_coefficient = reaction.metabolites[from_node_bigg_id].coefficient;
		}
		var to_node_bigg_id = map.nodes[segment.to_node_id].bigg_id;
		if (to_node_bigg_id in reaction.metabolites) {
		    segment.to_node_coefficient = reaction.metabolites[to_node_bigg_id].coefficient;
		}
		// if metabolite without beziers, then add them
		var start = map.nodes[segment.from_node_id],
		    end = map.nodes[segment.to_node_id];
		if (start['node_type']=='metabolite' || end['node_type']=='metabolite') {
		    var midpoint = utils.c_plus_c(start, utils.c_times_scalar(utils.c_minus_c(end, start), 0.5));
		    if (segment.b1 === null) segment.b1 = midpoint;
		    if (segment.b2 === null) segment.b2 = midpoint;
		}

	    }
	}
	if (enable_search) {
	    for (var node_id in map.nodes) {
		var node = map.nodes[node_id];
		if (node.node_type!='metabolite') continue;
		map.search_index.insert('n'+node_id, { 'name': node.bigg_id,
						       'data': { type: 'metabolite',
								 node_id: node_id }});
	    }
	}
	// get largest ids for adding new reactions, nodes, text labels, and
	// segments
	map.largest_ids.reactions = get_largest_id(map.reactions);
	map.largest_ids.nodes = get_largest_id(map.nodes);
	map.largest_ids.text_labels = get_largest_id(map.text_labels);

	var largest_segment_id = 0;
	for (var id in map.reactions) {
	    largest_segment_id = get_largest_id(map.reactions[id].segments,
						largest_segment_id);
	}
	map.largest_ids.segments = largest_segment_id;

	// reaction_data onto existing map reactions
	map.apply_reaction_data_to_map();
	map.apply_metabolite_data_to_map();

	return map;

	// definitions
	function get_largest_id(obj, current_largest) {
	    /** Return the largest integer key in obj, or current_largest, whichever is bigger. */
	    if (current_largest===undefined) current_largest = 0;
	    if (obj===undefined) return current_largest;
	    return Math.max.apply(null, Object.keys(obj).map(function(x) {
		return parseInt(x);
	    }).concat([current_largest]));
	}
    }

    // ---------------------------------------------------------------------
    // more setup

    function setup_containers(sel) {
        sel.append('g')
	    .attr('id', 'nodes');
        sel.append('g')
	    .attr('id', 'reactions');
        sel.append('g')
	    .attr('id', 'text-labels');
        sel.append('g')
	    .attr('id', 'membranes');
    }
    function reset_containers() {
	this.sel.select('#nodes')
	    .selectAll('.node')
	    .remove();
	this.sel.select('#reactions')
	    .selectAll('.reaction')
	    .remove();
	this.sel.select('#text-labels')
	    .selectAll('.text-label')
	    .remove();
	this.sel.select('#membranes')
	    .selectAll('.membrane')
	    .remove();
    }

    // -------------------------------------------------------------------------
    // Scales

    function get_scale(data, type) {
	/** Get a reaction or metabolite scale.

	 Arguments
	 ---------
	 
	 data: The type of data. Options are 'reaction' or 'metabolite'.

	 type: The type of scale to set. Options are 'size' and 'color'.

	 */

	if (data=='reaction' && type=='size') {
	    return this.scale.reaction_size;
	} else if (data=='reaction' && type=='color') {
	    return this.scale.reaction_color;
	} else if (data=='metabolite' && type=='size') {
	    return this.scale.metabolite_size;
	} else if (data=='metabolite' && type=='color') {
	    return this.scale.metabolite_color;
	} else {
	    throw Error('Bad value for data or type: ' + data + ', ' + type);
	}
    }

    function set_scale(data, type, domain, range) {
	/** Set a reaction or metabolite scale.

	 Arguments
	 ---------
	 
	 data: The type of data. Options are 'reaction' or 'metabolite'.

	 type: The type of scale to set. Options are 'size' and 'color'.

	 domain: The new scale domain. If domain is *null*, then the existing
	 domain is used. If any settings.auto_*_domain is true, then, this input
	 is ignored.

	 */

	if (domain===undefined) domain = null;
	if (range===undefined) range = null;

	if (domain !== null && (this.settings.auto_domain['reaction']==true ||
				this.settings.auto_domain['metabolite']==true)) {
	    console.warn('Cannot set domain manually if auto_*_domain is true');
	    domain = null;
	}

	if (data=='reaction' && type=='size') {
	    set_this_scale(this.scale.reaction_size, domain, range);
	} else if (data=='reaction' && type=='color') {
	    set_this_scale(this.scale.reaction_color, domain, range);
	} else if (data=='metabolite' && type=='size') {
	    set_this_scale(this.scale.metabolite_size, domain, range);
	} else if (data=='metabolite' && type=='color') {
	    set_this_scale(this.scale.metabolite_color, domain, range);
	} else {
	    throw Error('Bad value for data or type: ' + data + ', ' + type);
	}

	function set_this_scale(a_scale, a_domain, a_range) {
	    if (a_domain !== null) a_scale.domain(a_domain);
	    if (a_range !== null) a_scale.range(a_range);
	}
    }

    // -------------------------------------------------------------------------
    // Appearance

    function set_status(status) {
	this.status = status;
	this.callback_manager.run('set_status', status);
    }
    function set_model(model) {
	/** Change the cobra model for the map.

	 */
	this.cobra_model = model;
	if (this.cobra_model !== null) {
	    this.cobra_model.apply_reaction_data(this.reaction_data_object,
						 this.settings.data_styles['reaction']);
	    this.cobra_model.apply_metabolite_data(this.metabolite_data_object,
						   this.settings.data_styles['metabolite']);
	}
    }
    function set_reaction_data(reaction_data) {
	/** Set a new reaction data, and redraw the map.

	 Pass null to reset the map and draw without reaction data.

	 */
	this.reaction_data_object = data_styles.import_and_check(reaction_data,
								 this.settings.data_styles['reaction'],
								 'reaction_data');
	this.apply_reaction_data_to_map();
	if (this.cobra_model !== null) {
	    this.cobra_model.apply_reaction_data(this.reaction_data_object,
						 this.settings.data_styles['metabolite']);
	}
	this.draw_all_reactions();
    }
    function set_metabolite_data(metabolite_data) {
	/** Set a new metabolite data, and redraw the map.

	 Pass null to reset the map and draw without metabolite data.

	 */
	this.metabolite_data_object = data_styles.import_and_check(metabolite_data,
								   this.settings.data_styles['metabolite'],
								   'metabolite_data');
	this.apply_metabolite_data_to_map();
	if (this.cobra_model !== null) {
	    this.cobra_model.apply_metabolite_data(this.metabolite_data_object,
						   this.settings.data_styles['metabolite']);
	}
	this.draw_all_nodes();
    }
    function clear_map() {
	this.reactions = {};
	this.nodes = {};
	this.membranes = [];
	this.text_labels = {};
	// reaction_data onto existing map reactions
	this.apply_reaction_data_to_map();
	this.apply_metabolite_data_to_map();
	this.draw_everything();
    }
    function has_reaction_data() {
	return (this.reaction_data_object!==null);
    }
    function has_metabolite_data() {
	return (this.metabolite_data_object!==null);
    }
    function draw_everything() {
        /** Draw the reactions and membranes

         */
	var sel = this.sel,
	    membranes = this.membranes,
	    scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    text_labels = this.text_labels,
	    defs = this.defs,
	    default_reaction_color = this.default_reaction_color,
	    bezier_drag_behavior = this.behavior.bezier_drag,
	    node_click_fn = this.behavior.selectable_click,
	    node_mouseover_fn = this.behavior.node_mouseover,
	    node_mouseout_fn = this.behavior.node_mouseout,
	    node_drag_behavior = this.behavior.selectable_drag,
	    reaction_label_drag = this.behavior.reaction_label_drag,
	    node_label_drag = this.behavior.node_label_drag,
	    text_label_click = this.behavior.selectable_click,
	    text_label_drag = this.behavior.selectable_drag,
	    has_reaction_data = this.has_reaction_data(),
	    reaction_data_styles = this.settings.data_styles['reaction'],
	    has_metabolite_data = this.has_metabolite_data(),
	    metabolite_data_styles = this.settings.data_styles['metabolite'],
	    beziers_enabled = this.beziers_enabled;

	utils.draw_an_array(sel, '#membranes' ,'.membrane', membranes,
			    draw.create_membrane,
			    draw.update_membrane);

	utils.draw_an_object(sel, '#reactions', '.reaction', reactions,
			     'reaction_id',
			     draw.create_reaction, 
			     function(sel) { return draw.update_reaction(sel,
									 scale, 
									 nodes,
									 beziers_enabled, 
									 defs,
									 default_reaction_color,
									 has_reaction_data,
									 reaction_data_styles,
									 bezier_drag_behavior,
									 reaction_label_drag); });

	utils.draw_an_object(sel, '#nodes', '.node', nodes, 'node_id', 
			     function(sel) { return draw.create_node(sel, nodes, reactions); },
			     function(sel) { return draw.update_node(sel, scale,
								     has_metabolite_data,
								     metabolite_data_styles,
								     node_click_fn,
								     node_mouseover_fn,
								     node_mouseout_fn,
								     node_drag_behavior,
								     node_label_drag); });

	utils.draw_an_object(sel, '#text-labels', '.text-label', text_labels,
			     'text_label_id',
			     function(sel) { return draw.create_text_label(sel); }, 
			     function(sel) { return draw.update_text_label(sel,
									   text_label_click,
									   text_label_drag); });


    }
    function draw_all_reactions() {
	var reaction_ids = [];
	for (var reaction_id in this.reactions) {
	    reaction_ids.push(reaction_id);
	}
	this.draw_these_reactions(reaction_ids);
    }
    function draw_these_reactions(reaction_ids) {
	var scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    defs = this.defs,
	    default_reaction_color = this.default_reaction_color,
	    bezier_drag_behavior = this.behavior.bezier_drag,
	    reaction_label_drag = this.behavior.reaction_label_drag,
	    has_reaction_data = this.has_reaction_data(),
	    reaction_data_styles = this.settings.data_styles['reaction'],
	    beziers_enabled = this.beziers_enabled;

        // find reactions for reaction_ids
        var reaction_subset = {},
	    i = -1;
        while (++i<reaction_ids.length) {
	    reaction_subset[reaction_ids[i]] = utils.clone(reactions[reaction_ids[i]]);
        }
        if (reaction_ids.length != Object.keys(reaction_subset).length) {
	    console.warn('did not find correct reaction subset');
        }

        // generate reactions for o.drawn_reactions
        // assure constancy with cobra_id
        var sel = this.sel.select('#reactions')
                .selectAll('.reaction')
                .data(utils.make_array(reaction_subset, 'reaction_id'),
		      function(d) { return d.reaction_id; });

        // enter: generate and place reaction
        sel.enter().call(draw.create_reaction);

        // update: update when necessary
        sel.call(function(sel) { return draw.update_reaction(sel, scale, 
							     nodes,
							     beziers_enabled, 
							     defs,
							     default_reaction_color,
							     has_reaction_data,
							     reaction_data_styles,
							     bezier_drag_behavior,
							     reaction_label_drag); });

        // exit
        sel.exit();
    }
    function draw_all_nodes() {
	var node_ids = [];
	for (var node_id in this.nodes) {
	    node_ids.push(node_id);
	}
	this.draw_these_nodes(node_ids);
    }
    function draw_these_nodes(node_ids) {
	var scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    node_click_fn = this.behavior.selectable_click,
	    node_mouseover_fn = this.behavior.node_mouseover,
	    node_mouseout_fn = this.behavior.node_mouseout,
	    node_drag_behavior = this.behavior.selectable_drag,
	    node_label_drag = this.behavior.node_label_drag,
	    metabolite_data_styles = this.settings.data_styles['metabolite'],
	    has_metabolite_data = this.has_metabolite_data();

	// find nodes for node_ids
        var node_subset = {},
	    i = -1;
        while (++i<node_ids.length) {
	    node_subset[node_ids[i]] = utils.clone(nodes[node_ids[i]]);
        }
        if (node_ids.length != Object.keys(node_subset).length) {
	    console.warn('did not find correct node subset');
        }

        // generate nodes for o.drawn_nodes
        // assure constancy with cobra_id
        var sel = this.sel.select('#nodes')
                .selectAll('.node')
                .data(utils.make_array(node_subset, 'node_id'),
		      function(d) { return d.node_id; });

        // enter: generate and place node
        sel.enter().call(function(sel) { return draw.create_node(sel, nodes, reactions); });

        // update: update when necessary
        sel.call(function(sel) { return draw.update_node(sel, scale, has_metabolite_data, metabolite_data_styles, 
							 node_click_fn,
							 node_mouseover_fn,
							 node_mouseout_fn,
							 node_drag_behavior,
							 node_label_drag); });

        // exit
        sel.exit();
    }
    function draw_these_text_labels(text_label_ids) {
	var text_labels = this.text_labels,
	    text_label_click = this.behavior.selectable_click,
	    text_label_drag = this.behavior.selectable_drag;

	// find text labels for text_label_ids
        var text_label_subset = {},
	    i = -1;
        while (++i<text_label_ids.length) {
	    text_label_subset[text_label_ids[i]] = utils.clone(text_labels[text_label_ids[i]]);
        }
        if (text_label_ids.length != Object.keys(text_label_subset).length) {
	    console.warn('did not find correct text label subset');
        }

        // generate text for this.text_labels
        var sel = this.sel.select('#text-labels')
                .selectAll('.text-label')
                .data(utils.make_array(text_label_subset, 'text_label_id'),
		      function(d) { return d.text_label_id; });

        // enter: generate and place label
        sel.enter().call(function(sel) {
	    return draw.create_text_label(sel);
	});

        // update: update when necessary
        sel.call(function(sel) {
	    return draw.update_text_label(sel, text_label_click, text_label_drag);
	});

        // exit
        sel.exit();
    }
    function apply_reaction_data_to_map() {
	/**  Returns True if the scale has changed.

	 */
	return this.apply_reaction_data_to_reactions(this.reactions);
    }
    function apply_reaction_data_to_reactions(reactions) {
	/**  Returns True if the scale has changed.

	 */
	if (!this.has_reaction_data()) {
	    for (var reaction_id in reactions) {
	    var reaction = reactions[reaction_id];
		reaction.data = null;
		reaction.data_string = '';
		for (var segment_id in reaction.segments) {
		    var segment = reaction.segments[segment_id];
		    segment.data = null;
		}
	    }
	    return false;
	}
	// grab the data
	var data = this.reaction_data_object,
	    styles = this.settings.data_styles['reaction'];
	// apply the datasets to the reactions	
	for (var reaction_id in reactions) {
	    var reaction = reactions[reaction_id],
		d = (reaction.bigg_id in data ? data[reaction.bigg_id] : null),
		f = data_styles.float_for_data(d, styles),
		r = data_styles.reverse_flux_for_data(d, styles),
		s = data_styles.text_for_data(d, styles);
	    reaction.data = f;
	    reaction.data_string = s;
	    reaction.reverse_flux = r;
	    // apply to the segments
	    for (var segment_id in reaction.segments) {
		var segment = reaction.segments[segment_id];
		segment.data = reaction.data;
		segment.reverse_flux = reaction.reverse_flux;
	    }
	}
	return this.update_reaction_data_domain();
    }
    function update_reaction_data_domain() {
	/**  Returns True if the scale has changed.

	 */

	if (!this.settings.auto_domain['reaction']) return false;

	// default min and max
	var vals = [];
	for (var reaction_id in this.reactions) {
	    var reaction = this.reactions[reaction_id];
	    if (reaction.data!==null) {
		vals.push(reaction.data);
	    }
	}
	
	var old_domain = this.settings.domain['reaction']['color'],
	    new_domain, min, max;
	if (vals.length > 0) {
	    if (this.settings.data_styles['reaction'].indexOf('abs') != -1) {
		// if using absolute value reaction style
		vals = vals.map(function(x) { return Math.abs(x); });
	    }
	    min = Math.min.apply(null, vals),
	    max = Math.max.apply(null, vals);
	} else {
	    min = 0;
	    max = 0;
	}
	new_domain = [0, min, max].sort();
	this.settings.set_domain('reaction', new_domain);
	// compare arrays
	return !utils.compare_arrays(old_domain, new_domain);
    }
    function apply_metabolite_data_to_map() {
	/**  Returns True if the scale has changed.

	 */
	return this.apply_metabolite_data_to_nodes(this.nodes);
    }
    function apply_metabolite_data_to_nodes(nodes) {
	/**  Returns True if the scale has changed.

	 */
	if (!this.has_metabolite_data()) {
	    for (var node_id in nodes) {
		nodes[node_id].data = null;
		nodes[node_id].data_string = '';
	    }
	    return false;
	}
	// grab the data
	var data = this.metabolite_data_object,
	    styles = this.settings.data_styles['metabolite'];
	for (var node_id in nodes) {
	    var node = nodes[node_id],
		d = (node.bigg_id in data ? data[node.bigg_id] : null),
		f = data_styles.float_for_data(d, styles),
		s = data_styles.text_for_data(d, styles);
	    node.data = f;
	    node.data_string = s;
	}
	return this.update_metabolite_data_domain();
    }
    function update_metabolite_data_domain() {
	/**  Returns True if the scale has changed.

	 */

	if (!this.settings.auto_domain['metabolite']) return false;

	// default min and max
	var vals = [];
	for (var node_id in this.nodes) {
	    var node = this.nodes[node_id];
	    if (node.data!==null)
		vals.push(node.data);
	} 
	var old_domain = this.settings.domain['metabolite']['color'],
	    new_domain, min, max;
	if (vals.length > 0) {
	    if (this.settings.data_styles['metabolite'].indexOf('abs') != -1) {
		// if using absolute value reaction style
		vals = vals.map(function(x) { return Math.abs(x); });
	    }
	    min = Math.min.apply(null, vals),
	    max = Math.max.apply(null, vals);
	} else {
	    min = 0;
	    max = 0;
	}
	new_domain = [0, min, max].sort();
	this.settings.set_domain('metabolite', new_domain);
	// compare arrays
	return !utils.compare_arrays(old_domain, new_domain);
    }

    // ---------------------------------------------------------------------
    // Node interaction
    
    function get_coords_for_node(node_id) {
        var node = this.nodes[node_id],
	    coords = {'x': node.x, 'y': node.y};
        return coords;
    }
    function get_selected_node_ids() {
	var selected_node_ids = [];
	this.sel.select('#nodes')
	    .selectAll('.selected')
	    .each(function(d) { selected_node_ids.push(d.node_id); });
	return selected_node_ids;
    }
    function get_selected_nodes() {
	var selected_nodes = {},
	    self = this;
	this.sel.select('#nodes')
	    .selectAll('.selected')
	    .each(function(d) { selected_nodes[d.node_id] = self.nodes[d.node_id]; });
	return selected_nodes;
    }	
    function get_selected_text_label_ids() {
	var selected_text_label_ids = [];
	this.sel.select('#text-labels')
	    .selectAll('.selected')
	    .each(function(d) { selected_text_label_ids.push(d.text_label_id); });
	return selected_text_label_ids;
    }	
    function get_selected_text_labels() {
	var selected_text_labels = {},
	    self = this;
	this.sel.select('#text-labels')
	    .selectAll('.selected')
	    .each(function(d) { selected_text_labels[d.text_label_id] = self.text_labels[d.text_label_id]; });
	return selected_text_labels;
    }	

    function select_none() {
	this.sel.selectAll('.selected')
	    .classed('selected', false);
    }

    function select_metabolite_with_id(node_id) {
	/** Select a metabolite with the given id, and turn off the reaction
	 target.

	 */
	var node_selection = this.sel.select('#nodes').selectAll('.node'),
	    coords,
	    selected_node;
	node_selection.classed("selected", function(d) {
	    var selected = String(d.node_id) == String(node_id);
	    if (selected) {
		selected_node = d;
		coords = { x: d.x, y: d.y };
	    }
	    return selected;
	});
	this.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	this.callback_manager.run('select_metabolite_with_id', selected_node, coords);
    }
    function select_selectable(node, d) {
	/** Select a metabolite or text label, and manage the shift key.

	 */
	var classable_selection = this.sel.selectAll('#nodes,#text-labels')
		.selectAll('.node,.text-label'), 
	    shift_key_on = this.key_manager.held_keys.shift,
	    classable_node;
	if (d3.select(node).attr('class').indexOf('text-label') == -1) {
	    // node
	    classable_node = node.parentNode;
	} else {
	    // text-label
	    classable_node = node;
	}
	// toggle selection
	if (shift_key_on) {
	    d3.select(classable_node)
		.classed("selected", !d3.select(classable_node).classed("selected"));
	} else {
	    classable_selection.classed("selected", function(p) { return d === p; });
	}
	// run the select_metabolite callback
	var selected_nodes = this.sel.select('#nodes').selectAll('.selected'),
	    node_count = 0,
	    coords,
	    selected_node;
	selected_nodes.each(function(d) {
	    selected_node = d;
	    coords = { x: d.x, y: d.y };
	    node_count++;
	});
	this.callback_manager.run('select_selectable', node_count, selected_node, coords);
    }
    function select_single_node() {
	/** Unselect all but one selected node, and return the node.

	 If no nodes are selected, return null.

	 */
	var out = null,
	    self = this,
	    node_selection = this.sel.select('#nodes').selectAll('.selected');
	node_selection.classed("selected", function(d, i) {
	    if (i==0) {
		out = d;
		return true;
	    } else {
		return false;
	    }
	});
	return out;		   
    }
    function deselect_nodes() {
	var node_selection = this.sel.select('#nodes').selectAll('.node');
	node_selection.classed("selected", false);
    }
    function select_text_label(sel, d) {
	// deselect all nodes
	this.deselect_nodes();
	// find the new selection
	// Ignore shift key and only allow single selection for now
	var text_label_selection = this.sel.select('#text-labels').selectAll('.text-label');
	text_label_selection.classed("selected", function(p) { return d === p; });
	var selected_text_labels = this.sel.select('#text-labels').selectAll('.selected'),
	    coords;
	selected_text_labels.each(function(d) {
	    coords = { x: d.x, y: d.y };
	});
	this.callback_manager.run('select_text_label');
    }
    function deselect_text_labels() {
	var text_label_selection = this.sel.select('#text-labels').selectAll('.text-label');
	text_label_selection.classed("selected", false);
    }

    // ---------------------------------------------------------------------
    // Delete

    function delete_selected() {
	/** Delete the selected nodes and associated segments and reactions, and selected labels.

	 Undoable.

	 */
	var selected_nodes = this.get_selected_nodes();
	if (Object.keys(selected_nodes).length >= 1)
	    this.delete_nodes(selected_nodes);
	
	var selected_text_labels = this.get_selected_text_labels();
	if (Object.keys(selected_text_labels).length >= 1)
	    this.delete_text_labels(selected_text_labels);
    }
    function delete_nodes(selected_nodes) {
	/** Delete the nodes and associated segments and reactions.

	 Undoable.

	 */
	var out = this.segments_and_reactions_for_nodes(selected_nodes),
	    reactions = out.reactions,
	    segment_objs_w_segments = out.segment_objs_w_segments;

	// copy nodes to undelete
	var saved_nodes = utils.clone(selected_nodes),
	    saved_segment_objs_w_segments = utils.clone(segment_objs_w_segments),
	    saved_reactions = utils.clone(reactions),
	    delete_and_draw = function(nodes, reactions, segment_objs) {
		// delete nodes, segments, and reactions with no segments
  		this.delete_node_data(Object.keys(selected_nodes));
		this.delete_segment_data(segment_objs);
		this.delete_reaction_data(Object.keys(reactions));	   

		// apply the reaction and node data
		if (this.has_reaction_data()) 
		    this.update_reaction_data_domain();
		if (this.has_metabolite_data())
		    this.apply_metabolite_data_domain();

		// redraw
		// TODO just redraw these nodes and segments
		this.draw_everything();
	    }.bind(this);

	// delete
	delete_and_draw(selected_nodes, reactions, segment_objs_w_segments);

	// add to undo/redo stack
	this.undo_stack.push(function() {
	    // undo
	    // redraw the saved nodes, reactions, and segments

	    this.extend_nodes(saved_nodes);
	    this.extend_reactions(saved_reactions);
	    var reaction_ids_to_draw = Object.keys(saved_reactions);
	    saved_segment_objs_w_segments.forEach(function(segment_obj) {
		var segment = segment_obj.segment;
		this.reactions[segment_obj.reaction_id]
		    .segments[segment_obj.segment_id] = segment;

		// updated connected nodes
		[segment.from_node_id, segment.to_node_id].forEach(function(node_id) {
		    // not necessary for the deleted nodes
		    if (node_id in saved_nodes) return;
		    var node = this.nodes[node_id];
		    node.connected_segments.push({ reaction_id: segment_obj.reaction_id,
						   segment_id: segment_obj.segment_id });
		}.bind(this));

		if (reaction_ids_to_draw.indexOf(segment_obj.reaction_id)==-1)
		    reaction_ids_to_draw.push(segment_obj.reaction_id);
	    }.bind(this));

	    // apply the reaction and node data
	    // if the scale changes, redraw everything
	    if (this.has_reaction_data()) {
		var scale_changed = this.update_reaction_data_domain();
		if (scale_changed) this.draw_all_reactions();
		else this.draw_these_reactions(reaction_ids_to_draw);
	    } else {
		this.draw_these_reactions(reaction_ids_to_draw);
	    }		
	    if (this.has_metabolite_data()) {
		var scale_changed = this.update_metabolite_data_domain();
		if (scale_changed) this.draw_all_nodes();
		else this.draw_these_nodes(Object.keys(saved_nodes));
	    } else {
		this.draw_these_nodes(Object.keys(saved_nodes));
	    }

	    // copy nodes to re-delete
	    selected_nodes = utils.clone(saved_nodes);
	    segment_objs_w_segments = utils.clone(saved_segment_objs_w_segments);
	    reactions = utils.clone(saved_reactions);
	}.bind(this), function () {
	    // redo
	    // clone the nodes and reactions, to redo this action later
	    delete_and_draw(selected_nodes, reactions, segment_objs_w_segments);
	}.bind(this));
    }
    function delete_text_labels(selected_text_labels) {
	/** Delete the text_labels.

	 Undoable.

	 */
	// copy text_labels to undelete
	var saved_text_labels = utils.clone(selected_text_labels),
	    self = this,
	    delete_and_draw = function(text_labels) {
		// delete text_labels, segments, and reactions with no segments
  		self.delete_text_label_data(Object.keys(selected_text_labels));
		// redraw
		// TODO just redraw these text_labels
		self.draw_everything();
	    };

	// delete
	delete_and_draw(selected_text_labels);

	// add to undo/redo stack
	this.undo_stack.push(function() { // undo
	    // redraw the saved text_labels, reactions, and segments
	    utils.extend(self.text_labels, saved_text_labels);
	    self.draw_these_text_labels(Object.keys(saved_text_labels));
	    // copy text_labels to re-delete
	    selected_text_labels = utils.clone(saved_text_labels);
	}, function () { // redo
	    // clone the text_labels
	    delete_and_draw(selected_text_labels);
	});
    }
    function delete_node_data(node_ids) {
	/** Delete nodes, and remove from search index.
	 */
	node_ids.forEach(function(node_id) {
	    if (this.enable_search && this.nodes[node_id].node_type=='metabolite') {
		var found = this.search_index.remove('n'+node_id);
		if (!found)
		    console.warn('Could not find deleted metabolite in search index');
	    }
	    delete this.nodes[node_id];
	}.bind(this));
    }
    function delete_segment_data(segment_objs) {
	/** Delete segments, and update connected_segments in nodes. Also
	 deletes any reactions with 0 segments.
	 
	 segment_objs: Array of objects with { reaction_id: "123", segment_id: "456" }
	 
	 */
	segment_objs.forEach(function(segment_obj) {
	    var reaction = this.reactions[segment_obj.reaction_id];

	    // segment already deleted
	    if (!(segment_obj.segment_id in reaction.segments)) return;
	    
	    var segment = reaction.segments[segment_obj.segment_id];
	    // updated connected nodes
	    [segment.from_node_id, segment.to_node_id].forEach(function(node_id) {
		if (!(node_id in this.nodes)) return;
		var node = this.nodes[node_id];
		node.connected_segments = node.connected_segments.filter(function(so) {
		    return so.segment_id != segment_obj.segment_id;				
		});
	    }.bind(this));

	    delete reaction.segments[segment_obj.segment_id];
	}.bind(this));
    }
    function delete_reaction_data(reaction_ids) {
	/** Delete reactions and remove from search index.
	 
	 */
	reaction_ids.forEach(function(reaction_id) {
	    delete this.reactions[reaction_id];
	    var found = this.search_index.remove('r'+reaction_id);
	    if (!found)
		console.warn('Could not find deleted reaction in search index');
	}.bind(this));
    }
    function delete_text_label_data(text_label_ids) {
	/** delete text labels for an array of ids
	 */
	text_label_ids.forEach(function(text_label_id) {
	    delete this.text_labels[text_label_id];
	}.bind(this));
    }
    function show_beziers() {
	this.toggle_beziers(true);
    }
    function hide_beziers() {
	this.toggle_beziers(false);
    }
    function toggle_beziers(on_off) {
	if (on_off===undefined) this.beziers_enabled = !this.beziers_enabled;
	else this.beziers_enabled = on_off;
	this.draw_everything();
	this.callback_manager.run('toggle_beziers', this.beziers_enabled);
    }

    // ---------------------------------------------------------------------
    // Building

    function new_reaction_from_scratch(starting_reaction, coords, direction) {
	/** Draw a reaction on a blank canvas.

	 starting_reaction: bigg_id for a reaction to draw.
	 coords: coordinates to start drawing

	 */
	
        // If reaction id is not new, then return:
	for (var reaction_id in this.reactions) {
	    if (this.reactions[reaction_id].bigg_id == starting_reaction) {             
		console.warn('reaction is already drawn');
                return null;
	    }
        }

	// If there is no cobra model, error
	if (!this.cobra_model) return console.error('No CobraModel. Cannot build new reaction');

        // set reaction coordinates and angle
        // be sure to copy the reaction recursively
        var cobra_reaction = utils.clone(this.cobra_model.reactions[starting_reaction]);

	// create the first node
	for (var metabolite_id in cobra_reaction.metabolites) {
	    var coefficient = cobra_reaction.metabolites[metabolite_id],
		metabolite = this.cobra_model.metabolites[metabolite_id];
	    if (coefficient < 0) {
		var selected_node_id = String(++this.largest_ids.nodes),
		    label_d = { x: 30, y: 10 },
		    selected_node = { connected_segments: [],
				      x: coords.x,
				      y: coords.y,
				      node_is_primary: true,
				      label_x: coords.x + label_d.x,
				      label_y: coords.y + label_d.y,
				      name: metabolite.name,
				      bigg_id: metabolite_id,
				      node_type: 'metabolite' },
		    new_nodes = {};
		new_nodes[selected_node_id] = selected_node;
		break;
	    }
	}

	// draw
	extend_and_draw_metabolite.apply(this, [new_nodes, selected_node_id]);

	// clone the nodes and reactions, to redo this action later
	var saved_nodes = utils.clone(new_nodes),
	    map = this;

	// add to undo/redo stack
	this.undo_stack.push(function() {
	    // undo
	    // get the nodes to delete
	    map.delete_node_data(Object.keys(new_nodes));
	    // save the nodes and reactions again, for redo
	    new_nodes = utils.clone(saved_nodes);
	    // draw
	    map.draw_everything();
	}, function () {
	    // redo
	    // clone the nodes and reactions, to redo this action later
	    extend_and_draw_metabolite.apply(map, [new_nodes, selected_node_id]);
	});
	
	// draw the reaction
	this.new_reaction_for_metabolite(starting_reaction, selected_node_id, direction);
	
	return null;

        // definitions
	function extend_and_draw_metabolite(new_nodes, selected_node_id) {
	    this.extend_nodes(new_nodes);
	    if (this.has_metabolite_data()) {
		var scale_changed = this.apply_metabolite_data_to_nodes(new_nodes);
		if (scale_changed) this.draw_all_nodes();
		else this.draw_these_nodes([selected_node_id]);
	    } else {
		this.draw_these_nodes([selected_node_id]);
	    }
	}
    }
    
    function extend_nodes(new_nodes) {
	/** Add new nodes to data and search index.

	 */
	if (this.enable_search) {
	    for (var node_id in new_nodes) {
		var node = new_nodes[node_id];
		if (node.node_type!='metabolite') continue;
		this.search_index.insert('n'+node_id, { 'name': node.bigg_id,
							'data': { type: 'metabolite',
								  node_id: node_id }});
	    }
	}
	utils.extend(this.nodes, new_nodes);
    }
    function extend_reactions(new_reactions) {
	/** Add new reactions to data and search index.

	 */
	for (var r_id in new_reactions) {
	    var reaction = new_reactions[r_id];
	    if (this.enable_search) {
		this.search_index.insert('r'+r_id, { 'name': reaction.bigg_id,
						     'data': { type: 'reaction',
							       reaction_id: r_id }});
	    }
	}
	utils.extend(this.reactions, new_reactions);
    }

    function new_reaction_for_metabolite(reaction_bigg_id, selected_node_id, direction) {
	/** Build a new reaction starting with selected_met.

	 Undoable

	 */

        // If reaction id is not new, then return:
	for (var reaction_id in this.reactions) {
	    if (this.reactions[reaction_id].bigg_id == reaction_bigg_id) {
		console.warn('reaction is already drawn');
                return;
	    }
        }

	// get the metabolite node
	var selected_node = this.nodes[selected_node_id];

        // set reaction coordinates and angle
        // be sure to copy the reaction recursively
        var cobra_reaction = this.cobra_model.reactions[reaction_bigg_id];

	// build the new reaction
	var out = build.new_reaction(reaction_bigg_id, cobra_reaction,
				     this.cobra_model.metabolites,
				     selected_node_id,
				     utils.clone(selected_node),
				     this.largest_ids,
				     this.cobra_model.cofactors,
				     direction),
	    new_nodes = out.new_nodes,
	    new_reactions = out.new_reactions;

	// draw
	extend_and_draw_reaction.apply(this, [new_nodes, new_reactions, selected_node_id]);

	// clone the nodes and reactions, to redo this action later
	var saved_nodes = utils.clone(new_nodes),
	    saved_reactions = utils.clone(new_reactions),
	    map = this;

	// add to undo/redo stack
	this.undo_stack.push(function() {
	    // undo
	    // get the nodes to delete
	    delete new_nodes[selected_node_id];
	    map.delete_node_data(Object.keys(new_nodes));
	    map.delete_reaction_data(Object.keys(new_reactions));
	    select_metabolite_with_id.apply(map, [selected_node_id]);
	    // save the nodes and reactions again, for redo
	    new_nodes = utils.clone(saved_nodes);
	    new_reactions = utils.clone(saved_reactions);
	    // draw
	    map.draw_everything();
	}, function () {
	    // redo
	    // clone the nodes and reactions, to redo this action later
	    extend_and_draw_reaction.apply(map, [new_nodes, new_reactions, selected_node_id]);
	});

	// definitions
	function extend_and_draw_reaction(new_nodes, new_reactions, selected_node_id) {
	    this.extend_reactions(new_reactions);
	    // remove the selected node so it can be updated
	    this.delete_node_data([selected_node_id]); // TODO this is a hack. fix
	    this.extend_nodes(new_nodes);

	    // apply the reaction and node data
	    // if the scale changes, redraw everything
	    if (this.has_reaction_data()) {
		var scale_changed = this.apply_reaction_data_to_reactions(new_reactions);
		if (scale_changed) this.draw_all_reactions();
		else this.draw_these_reactions(Object.keys(new_reactions));
	    } else {
		this.draw_these_reactions(Object.keys(new_reactions));
	    }		
	    if (this.has_metabolite_data()) {
		var scale_changed = this.apply_metabolite_data_to_nodes(new_nodes);
		if (scale_changed) this.draw_all_nodes();
		else this.draw_these_nodes(Object.keys(new_nodes));
	    } else {
		this.draw_these_nodes(Object.keys(new_nodes));
	    }

	    // select new primary metabolite
	    for (var node_id in new_nodes) {
		var node = new_nodes[node_id];
		if (node.node_is_primary && node_id!=selected_node_id) {
		    this.select_metabolite_with_id(node_id);
		    var new_coords = { x: node.x, y: node.y };
		    if (this.zoom_container)
			this.zoom_container.translate_off_screen(new_coords);
		}
	    }
	}
	
    }
    function cycle_primary_node() {
	var selected_nodes = this.get_selected_nodes();
	// get the first node
	var node_id = Object.keys(selected_nodes)[0],
	    node = selected_nodes[node_id],
	    reactions = this.reactions,
	    nodes = this.nodes;
	// make the other reactants or products secondary
	// 1. Get the connected anchor nodes for the node
	var connected_anchor_ids = [],
	    reactions_to_draw;
	nodes[node_id].connected_segments.forEach(function(segment_info) {
	    reactions_to_draw = [segment_info.reaction_id];
	    var segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id];
	    connected_anchor_ids.push(segment.from_node_id==node_id ?
				      segment.to_node_id : segment.from_node_id);
	});
	// can only be connected to one anchor
	if (connected_anchor_ids.length != 1)
	    return console.error('Only connected nodes with a single reaction can be selected');
	var connected_anchor_id = connected_anchor_ids[0];
	// 2. find nodes connected to the anchor that are metabolites
	var related_node_ids = [node_id];
	var segments = [];
	nodes[connected_anchor_id].connected_segments.forEach(function(segment_info) { // deterministic order
	    var segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id],
		conn_met_id = segment.from_node_id == connected_anchor_id ? segment.to_node_id : segment.from_node_id,
		conn_node = nodes[conn_met_id];
	    if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
		related_node_ids.push(String(conn_met_id));
	    }
	});
	// 3. make sure they only have 1 reaction connection, and check if
	// they match the other selected nodes
	for (var i=0; i<related_node_ids.length; i++) {
	    if (nodes[related_node_ids[i]].connected_segments.length > 1)
		return console.error('Only connected nodes with a single reaction can be selected');
	}
	for (var a_selected_node_id in selected_nodes) {
	    if (a_selected_node_id!=node_id && related_node_ids.indexOf(a_selected_node_id) == -1)
		return console.warn('Selected nodes are not on the same reaction');
	}
	// 4. change the primary node, and change coords, label coords, and beziers
	var nodes_to_draw = [],
	    last_i = related_node_ids.length - 1,
	    last_node = nodes[related_node_ids[last_i]],
	    last_is_primary = last_node.node_is_primary,
	    last_coords = { x: last_node.x, y: last_node.y,
			    label_x: last_node.label_x, label_y: last_node.label_y },
	    last_segment_info = last_node.connected_segments[0], // guaranteed above to have only one
	    last_segment = reactions[last_segment_info.reaction_id].segments[last_segment_info.segment_id],
	    last_bezier = { b1: last_segment.b1, b2: last_segment.b2 },
	    primary_node_id;
	related_node_ids.forEach(function(related_node_id) {
	    var node = nodes[related_node_id],
		this_is_primary = node.node_is_primary,
		these_coords = { x: node.x, y: node.y,
				 label_x: node.label_x, label_y: node.label_y },
		this_segment_info = node.connected_segments[0],
		this_segment = reactions[this_segment_info.reaction_id].segments[this_segment_info.segment_id],
		this_bezier = { b1: this_segment.b1, b2: this_segment.b2 };
	    node.node_is_primary = last_is_primary;
	    node.x = last_coords.x; node.y = last_coords.y;
	    node.label_x = last_coords.label_x; node.label_y = last_coords.label_y;
	    this_segment.b1 = last_bezier.b1; this_segment.b2 = last_bezier.b2;
	    last_is_primary = this_is_primary;
	    last_coords = these_coords;
	    last_bezier = this_bezier;
	    if (node.node_is_primary) primary_node_id = related_node_id;
	    nodes_to_draw.push(related_node_id);
	});
	// 5. cycle the connected_segments array so the next time, it cycles differently
	var old_connected_segments = nodes[connected_anchor_id].connected_segments,
	    last_i = old_connected_segments.length - 1,
	    new_connected_segments = [old_connected_segments[last_i]];
	old_connected_segments.forEach(function(segment, i) {
	    if (last_i==i) return;
	    new_connected_segments.push(segment);
	});
	nodes[connected_anchor_id].connected_segments = new_connected_segments;	    
	// 6. draw the nodes
	this.draw_these_nodes(nodes_to_draw);
	this.draw_these_reactions(reactions_to_draw);
	// 7. select the primary node
	this.select_metabolite_with_id(primary_node_id);
    }
    function make_selected_node_primary() {
	var selected_nodes = this.get_selected_nodes(),
	    reactions = this.reactions,
	    nodes = this.nodes;	    
	// can only have one selected
	if (Object.keys(selected_nodes).length != 1)
	    return console.error('Only one node can be selected');
	// get the first node
	var node_id = Object.keys(selected_nodes)[0],
	    node = selected_nodes[node_id];
	// make it primary
	nodes[node_id].node_is_primary = true;
	var nodes_to_draw = [node_id];
	// make the other reactants or products secondary
	// 1. Get the connected anchor nodes for the node
	var connected_anchor_ids = [];
	nodes[node_id].connected_segments.forEach(function(segment_info) {
	    var segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id];
	    connected_anchor_ids.push(segment.from_node_id==node_id ?
				      segment.to_node_id : segment.from_node_id);
	});
	// 2. find nodes connected to the anchor that are metabolites
	connected_anchor_ids.forEach(function(anchor_id) {
	    var segments = [];
	    nodes[anchor_id].connected_segments.forEach(function(segment_info) {
		var segment = reactions[segment_info.reaction_id].segments[segment_info.segment_id],
		    conn_met_id = segment.from_node_id == anchor_id ? segment.to_node_id : segment.from_node_id,
		    conn_node = nodes[conn_met_id];
		if (conn_node.node_type == 'metabolite' && conn_met_id != node_id) {
		    conn_node.node_is_primary = false;
		    nodes_to_draw.push(conn_met_id);
		}
	    });
	});
	// draw the nodes
	this.draw_these_nodes(nodes_to_draw);
    }

    function segments_and_reactions_for_nodes(nodes) {
	/** Get segments and reactions that should be deleted with node deletions
	 */
	var segment_objs_w_segments = [],
	    these_reactions = {},
	    segment_ids_for_reactions = {},
	    reactions = this.reactions;
	// for each node
	for (var node_id in nodes) {
	    var node = nodes[node_id];
	    // find associated segments and reactions	    
	    node.connected_segments.forEach(function(segment_obj) {
		var reaction = reactions[segment_obj.reaction_id],
		    segment = reaction.segments[segment_obj.segment_id],
		    segment_obj_w_segment = utils.clone(segment_obj);
		segment_obj_w_segment['segment'] = utils.clone(segment);
		segment_objs_w_segments.push(segment_obj_w_segment);
		if (!(segment_obj.reaction_id in segment_ids_for_reactions))
		    segment_ids_for_reactions[segment_obj.reaction_id] = [];
		segment_ids_for_reactions[segment_obj.reaction_id].push(segment_obj.segment_id);
	    });
	}
	// find the reactions that should be deleted because they have no segments left
	for (var reaction_id in segment_ids_for_reactions) {
	    var reaction = reactions[reaction_id],
		these_ids = segment_ids_for_reactions[reaction_id],
		has = true;
	    for (var segment_id in reaction.segments) {
		if (these_ids.indexOf(segment_id)==-1) has = false;
	    }
	    if (has) these_reactions[reaction_id] = reaction;
	}
	return { segment_objs_w_segments: segment_objs_w_segments, reactions: these_reactions };
    }
    function set_status(status) {
        // TODO make this a class, and take out d3.select('body')
        var t = d3.select('body').select('#status');
        if (t.empty()) t = d3.select('body')
	    .append('text')
	    .attr('id', 'status');
        t.text(status);
        return this;
    }

    // -------------------------------------------------------------------------
    // Zoom

    function zoom_extent_nodes(margin) {
	/** Zoom to fit all the nodes.

	 margin: optional argument to set the margins as a fraction of height.

	 Returns error if one is raised.

	 */
	this._zoom_extent(margin, 'nodes');
    }
    function zoom_extent_canvas(margin) {
	/** Zoom to fit the canvas.

	 margin: optional argument to set the margins as a fraction of height.

	 Returns error if one is raised.

	 */
	this._zoom_extent(margin, 'canvas');
    }
    function _zoom_extent(margin, mode) {
	/** Zoom to fit all the nodes.

	 margin: optional argument to set the margins.
	 mode: Values are 'nodes', 'canvas'.

	 Returns error if one is raised.

	 */

	// optional args
	if (margin===undefined) margin = (mode=='nodes' ? 0.2 : 0);
	if (mode===undefined) mode = 'canvas';

	var new_zoom, new_pos,
	    size = this.get_size();
	// scale margin to window size
	margin = margin * size.height;

	if (mode=='nodes') {
	    // get the extent of the nodes
	    var min = { x: null, y: null }, // TODO make infinity?
		max = { x: null, y: null };
	    for (var node_id in this.nodes) {
		var node = this.nodes[node_id];
		if (min.x===null) min.x = node.x;
		if (min.y===null) min.y = node.y;
		if (max.x===null) max.x = node.x;
		if (max.y===null) max.y = node.y;

		min.x = Math.min(min.x, node.x);
		min.y = Math.min(min.y, node.y);
		max.x = Math.max(max.x, node.x);
		max.y = Math.max(max.y, node.y);
	    }
	    // set the zoom
	    new_zoom = Math.min((size.width - margin*2) / (max.x - min.x),
				(size.height - margin*2) / (max.y - min.y));
	    new_pos = { x: - (min.x * new_zoom) + margin + ((size.width - margin*2 - (max.x - min.x)*new_zoom) / 2),
			y: - (min.y * new_zoom) + margin + ((size.height - margin*2 - (max.y - min.y)*new_zoom) / 2) };
	} else if (mode=='canvas') {
	    // center the canvas
	    new_zoom =  Math.min((size.width - margin*2) / (this.canvas.width),
				 (size.height - margin*2) / (this.canvas.height));
	    new_pos = { x: - (this.canvas.x * new_zoom) + margin + ((size.width - margin*2 - this.canvas.width*new_zoom) / 2),
			y: - (this.canvas.y * new_zoom) + margin + ((size.height - margin*2 - this.canvas.height*new_zoom) / 2) };
	} else {
	    return console.error('Did not recognize mode');
	}
	this.zoom_container.go_to(new_zoom, new_pos);
	return null;
    }

    function get_size() {
	return this.zoom_container.get_size();
    }

    function zoom_to_reaction(reaction_id) {
	var reaction = this.reactions[reaction_id],
	    new_zoom = 0.6,
	    size = this.get_size(),
	    new_pos = { x: - reaction.label_x * new_zoom + size.width/2,
			y: - reaction.label_y * new_zoom + size.height/2 };
	this.zoom_container.go_to(new_zoom, new_pos);
    }

    function zoom_to_node(node_id) {
	var node = this.nodes[node_id],
	    new_zoom = 0.6,
	    size = this.get_size(),
	    new_pos = { x: - node.label_x * new_zoom + size.width/2,
			y: - node.label_y * new_zoom + size.height/2 };
	this.zoom_container.go_to(new_zoom, new_pos);
    }

    function highlight_reaction(reaction_id) {
	this.highlight(this.sel.selectAll('#r'+reaction_id).selectAll('text'));
    }
    function highlight_node(node_id) {
	this.highlight(this.sel.selectAll('#n'+node_id).selectAll('text'));
    }
    function highlight(sel) {
	this.sel.selectAll('.highlight')
	    .classed('highlight', false);
	if (sel!==null) {
	    sel.classed('highlight', true);
	}
    }

    // -------------------------------------------------------------------------
    // IO

    function save() {
        console.log("Saving");
        utils.download_json(this.map_for_export(), "saved_map");
    }
    function map_for_export() {
	var out = { reactions: utils.clone(this.reactions),
		    nodes: utils.clone(this.nodes),
		    membranes: utils.clone(this.membranes),
		    text_labels: utils.clone(this.text_labels),
		    canvas: this.canvas.size_and_location() };

	// remove extra data
	for (var r_id in out.reactions) {
	    var reaction = out.reactions[r_id];
	    delete reaction.data;
	    delete reaction.data_string;
	    for (var s_id in reaction.segments) {
		var segment = reaction.segments[s_id];
		delete segment.reversibility;
		delete segment.from_node_coefficient;
		delete segment.to_node_coefficient;
		delete segment.data;
	    }
	}
	for (var n_id in out.nodes) {
	    var node = out.nodes[n_id];
	    delete node.data;
	    delete node.data_string;
	}

	if (this.debug) {
	    d3.json('map_spec.json', function(error, spec) {
		if (error) {
		    console.warn(error);
		    return;
		}
		utils.check_r(out, spec.spec, spec.can_be_none);
	    });
	}

	return out;
    }
    function save_svg() {
        console.log("Exporting SVG");
	this.callback_manager.run('before_svg_export');
	// turn of zoom and translate so that illustrator likes the map
	var window_scale = this.zoom_container.window_scale,
	    window_translate = this.zoom_container.window_translate,
	    canvas_size_and_loc = this.canvas.size_and_location(),
	    mouse_node_size_and_trans = { w: this.canvas.mouse_node.attr('width'),
					  h: this.canvas.mouse_node.attr('height'),
				          transform:  this.canvas.mouse_node.attr('transform')};
	this.zoom_container.go_to(1.0, {x: -canvas_size_and_loc.x, y: -canvas_size_and_loc.y}, false);
	this.svg.attr('width', canvas_size_and_loc.width);
	this.svg.attr('height', canvas_size_and_loc.height);
	this.canvas.mouse_node.attr('width', '0px');
	this.canvas.mouse_node.attr('height', '0px');
	this.canvas.mouse_node.attr('transform', null);
        utils.export_svg("saved_map", this.svg, true);
	this.zoom_container.go_to(window_scale, window_translate, false);
	this.svg.attr('width', null);
	this.svg.attr('height', null);
	this.canvas.mouse_node.attr('width', mouse_node_size_and_trans.w);
	this.canvas.mouse_node.attr('height', mouse_node_size_and_trans.h);
	this.canvas.mouse_node.attr('transform', mouse_node_size_and_trans.transform);
	this.callback_manager.run('after_svg_export');
    }
});

define('ZoomContainer',["utils", "CallbackManager"], function(utils, CallbackManager) {
    /** ZoomContainer

     The zoom behavior is based on this SO question:
     http://stackoverflow.com/questions/18788188/how-to-temporarily-disable-the-zooming-in-d3-js
     */
    var ZoomContainer = utils.make_class();
    ZoomContainer.prototype = { init: init,
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
	    .on("zoom", function() {
		zoom(zoom_container, d3.event);
	    });
	container.call(this.zoom_behavior);	
	if (scroll_behavior=='none' || scroll_behavior=='pan') {
	    container.on("mousewheel.zoom", null)
		.on("DOMMouseScroll.zoom", null) // disables older versions of Firefox
		.on("wheel.zoom", null) // disables newer versions of Firefox
		.on('dblclick.zoom', null);
	}
	if (scroll_behavior=='pan') {
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
	    container.on('mousewheel.escher', wheel_fn);
	    container.on('DOMMouseScroll.escher', wheel_fn);
	    container.on('wheel.escher', wheel_fn);
	}

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

define('DirectionArrow',["utils"], function(utils) {
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

define('Input',["utils",  "lib/complete.ly", "Map", "ZoomContainer", "CallbackManager", "draw", "DirectionArrow"], function(utils, completely, Map, ZoomContainer, CallbackManager, draw, DirectionArrow) {
    /**
     */

    var Input = utils.make_class();
    // instance methods
    Input.prototype = { init: init,
			setup_map_callbacks: setup_map_callbacks,
			setup_zoom_callbacks: setup_zoom_callbacks,
			is_visible: is_visible,
			toggle: toggle,
			show_dropdown: show_dropdown,
			hide_dropdown: hide_dropdown,
			place_at_selected: place_at_selected,
			place: place,
			reload_at_selected: reload_at_selected,
			reload: reload,
			toggle_start_reaction_listener: toggle_start_reaction_listener,
			hide_target: hide_target,
			show_target: show_target };

    return Input;

    // definitions
    function init(selection, map, zoom_container) {
	// set up container
	var new_sel = selection.append("div").attr("id", "rxn-input");
	// set up complete.ly
	var c = completely(new_sel.node(), { backgroundColor: "#eee" });
	d3.select(c.input)
	// .attr('placeholder', 'Reaction ID -- Flux')
	    .on('input', function() {
		this.value = this.value
		    // .replace("/","")
		    .replace(" ","")
		    .replace("\\","")
		    .replace("<","");
	    });
	this.selection = new_sel;
	this.completely = c;
	// close button
	new_sel.append('button').attr('class', "button input-close-button")
	    .text("×").on('click', function() { this.hide_dropdown(); }.bind(this));

	if (map instanceof Map) {
	    this.map = map;

	    // set up the reaction direction arrow
	    var default_angle = 90; // degrees
	    this.direction_arrow = new DirectionArrow(map.sel);
	    this.direction_arrow.set_rotation(default_angle);

	    this.setup_map_callbacks(map);
	} else {
	    console.error('Cannot set the map. It is not an instance of builder/Map');
	}
	if (zoom_container instanceof ZoomContainer) {
	    this.zoom_container = zoom_container;
	    this.setup_zoom_callbacks();
	} else {
	    console.error('Cannot set the zoom_container. It is not an instance of ' +
			  'builder/ZoomContainer');
	}

	// set up reaction input callbacks
	this.callback_manager = new CallbackManager();

	// toggle off
	this.toggle(false);
	this.target_coords = null;
    }
    function setup_map_callbacks(map) {
	// input
	map.callback_manager.set('select_metabolite_with_id.input', function(selected_node, coords) {
	    if (this.is_active) this.reload(selected_node, coords, false);
	    this.hide_target();
	}.bind(this));
	map.callback_manager.set('select_selectable.input', function(count, selected_node, coords) {
	    this.hide_target();
	    if (count == 1 && this.is_active && coords) {
		this.reload(selected_node, coords, false);
	    } else {
		this.toggle(false);
	    }
	}.bind(this));

	// svg export
	map.callback_manager.set('before_svg_export', function() {
	    this.direction_arrow.hide();
	    this.hide_target();
	}.bind(this));
    }
    function setup_zoom_callbacks() {
	this.zoom_container.callback_manager.set('zoom.input', function() {
	    if (this.is_active) {
		this.place_at_selected();
	    }
	}.bind(this));
    }
    function is_visible() {
	return this.selection.style('display') != 'none';
    }
    function toggle(on_off) {
	if (on_off===undefined) this.is_active = !this.is_active;
	else this.is_active = on_off;
	if (this.is_active) {
	    this.toggle_start_reaction_listener(true);
	    if (this.target_coords!==null) this.show_dropdown(this.target_coords);
	    else this.reload_at_selected();
	    this.map.set_status('Click on the canvas or an existing metabolite');
	    this.direction_arrow.show();
	    // escape key
	    this.escape = this.map.key_manager
		.add_escape_listener(function() { this.hide_dropdown(); }.bind(this));
	} else {
	    this.toggle_start_reaction_listener(false);
	    this.selection.style("display", "none");
            this.completely.input.blur();
            this.completely.hideDropDown();
	    this.map.set_status(null);
	    this.direction_arrow.hide();
	    if (this.escape)
		this.escape.clear();
	    this.escape = null;
	}
    }
    function show_dropdown(coords) {
	this.selection.style("display", "block");
        this.completely.input.blur();
	this.completely.repaint();
	this.completely.setText("");
        this.completely.input.focus();
    }
    function hide_dropdown() {
	this.selection.style("display", "none");
        this.completely.hideDropDown();
    }
    function place_at_selected() {
        /** Place autocomplete box at the first selected node.
	 
         */

	// get the selected node
	this.map.deselect_text_labels();
	var selected_node = this.map.select_single_node();
	if (selected_node==null) return;
	var coords = { x: selected_node.x, y: selected_node.y };
	this.place(coords);
    }
    function place(coords) {
	var d = {x: 240, y: 0},
	    window_translate = this.map.zoom_container.window_translate,
	    window_scale = this.map.zoom_container.window_scale,
	    map_size = this.map.get_size();
        var left = Math.max(20,
			    Math.min(map_size.width - 270,
				     (window_scale * coords.x + window_translate.x - d.x)));
        var top = Math.max(20,
			   Math.min(map_size.height - 40,
				    (window_scale * coords.y + window_translate.y - d.y)));
        this.selection.style('position', 'absolute')
            .style('display', 'block')
            .style('left',left+'px')
            .style('top',top+'px');

	this.direction_arrow.set_location(coords);
	this.direction_arrow.show();
    }

    function reload_at_selected() {
        /** Reload data for autocomplete box and redraw box at the first
	 selected node.
	 
         */
	// get the selected node
	this.map.deselect_text_labels();
	var selected_node = this.map.select_single_node();
	if (selected_node==null) return false;
	var coords = { x: selected_node.x, y: selected_node.y };
	// reload the reaction input
	this.reload(selected_node, coords, false);
	return true;
    }
    function reload(selected_node, coords, starting_from_scratch) {
        /** Reload data for autocomplete box and redraw box at the new
         coordinates.
	 
         */

	if (selected_node===undefined && !starting_from_scratch)
	    console.error('No selected node, and not starting from scratch');

	this.place(coords);

        // blur
        this.completely.input.blur();
        this.completely.repaint(); //put in place()?

	if (this.map.cobra_model===null) {
	    this.completely.setText('Cannot add: No model.');
	    return;
	}

        // Find selected reaction
        var suggestions = [],
	    cobra_reactions = this.map.cobra_model.reactions,
	    cobra_metabolites = this.map.cobra_model.metabolites,
	    reactions = this.map.reactions,
	    has_reaction_data = this.map.has_reaction_data(),
	    reaction_data = this.map.reaction_data,
	    reaction_data_styles = this.map.reaction_data_styles;
        for (var reaction_id in cobra_reactions) {
            var reaction = cobra_reactions[reaction_id];

            // ignore drawn reactions
            if (already_drawn(reaction_id, reactions)) continue;

	    // check segments for match to selected metabolite
	    for (var metabolite_id in reaction.metabolites) {

		// if starting with a selected metabolite, check for that id
		if (starting_from_scratch || metabolite_id==selected_node.bigg_id) {
		    // don't add suggestions twice
		    if (reaction_id in suggestions) continue;
		    if (has_reaction_data) {
			suggestions[reaction_id] = { reaction_data: reaction.data,
						     string: (reaction_id + ': ' +
							      reaction.data_string) };
		    } else {
	    		suggestions[reaction_id] = { string: reaction_id };
		    }
		}
	    }
        }

        // Generate the array of reactions to suggest and sort it
	var strings_to_display = [],
	    suggestions_array = utils.make_array(suggestions, 'reaction_abbreviation');
	if (has_reaction_data) {
	    suggestions_array.sort(function(x, y) {
		return Math.abs(y.reaction_data) - Math.abs(x.reaction_data);
	    });
	} else {
	    suggestions_array.sort(function(x, y) {
		return (x.string.toLowerCase() < y.string.toLowerCase() ? -1 : 1);
	    });
	}
	suggestions_array.forEach(function(x) {
	    strings_to_display.push(x.string);
	});

        // set up the box with data, searching for first num results
        var num = 20,
            complete = this.completely;
        complete.options = strings_to_display;
        if (strings_to_display.length==1) complete.setText(strings_to_display[0]);
        else complete.setText("");
	complete.onChange = function(txt) {
	    if (txt.length==0) {
		complete.options = strings_to_display;
		complete.repaint();
		return;
	    }
	    var v = strings_to_display.map(function(x) {
		if (x.toLowerCase().indexOf(txt.toLowerCase())==0)
		    return txt+x.slice(txt.length);
		else return null;
	    }).filter(function(x) { return x!==null; });
	    complete.options = v;
	    complete.repaint();
	};
	var direction_arrow = this.direction_arrow,
	    map = this.map;
        complete.onEnter = function() {
	    var text = this.getText();
	    this.setText("");
	    suggestions_array.forEach(function(x) {
		if (x.string.toLowerCase()==text.toLowerCase()) {
		    if (starting_from_scratch) {
			map.new_reaction_from_scratch(x.reaction_abbreviation,
							   coords,
							   direction_arrow.get_rotation());
		    } else {
			map.new_reaction_for_metabolite(x.reaction_abbreviation,
							     selected_node.node_id,
							     direction_arrow.get_rotation());
		    }
		}
	    });
        };
        complete.repaint();
        this.completely.input.focus();

	//definitions
	function already_drawn(bigg_id, reactions) {
            for (var drawn_id in reactions) {
		if (reactions[drawn_id].bigg_id==bigg_id) 
		    return true;
	    }
            return false;
	};
    }
    function toggle_start_reaction_listener(on_off) {
	/** Toggle listening for a click to place a new reaction on the canvas.

	 */
        if (on_off===undefined)
            this.start_reaction_listener = !this.start_reaction_listener;
        else if (this.start_reaction_listener==on_off)
            return;
        else
            this.start_reaction_listener = on_off;
        
        if (this.start_reaction_listener) {;
            this.map.sel.on('click.start_reaction', function(node) {
		// TODO fix this hack
		if (this.direction_arrow.dragging) return;
                // reload the reaction input
                var coords = { x: d3.mouse(node)[0],
			       y: d3.mouse(node)[1] };
                // unselect metabolites
		this.map.deselect_nodes();
		this.map.deselect_text_labels();
		// reload the reaction input
                this.reload(null, coords, true);
		// generate the target symbol
		this.show_target(this.map, coords);
            }.bind(this, this.map.sel.node()));
            this.map.sel.classed('start-reaction-cursor', true);
        } else {
            this.map.sel.on('click.start_reaction', null);
            this.map.sel.classed('start-reaction-cursor', false);
	    this.hide_target();
        }
    }

    function hide_target() {
	if (this.target_coords)
	    this.map.sel.selectAll('.start-reaction-target').remove();
	this.target_coords = null;
    }
    function show_target(map, coords) {
        var s = map.sel.selectAll('.start-reaction-target').data([12, 5]);
        s.enter().append('circle')
            .classed('start-reaction-target', true)
            .attr('r', function(d) { return d; })
            .style('stroke-width', 4);
        s.style('visibility', 'visible')
            .attr('transform', 'translate('+coords.x+','+coords.y+')');
	this.target_coords = coords;
    }
});

define('CobraModel',["utils", "data_styles"], function(utils, data_styles) {
    /**
     */

    var CobraModel = utils.make_class();
    // instance methods
    CobraModel.prototype = { init: init,
			     apply_reaction_data: apply_reaction_data,
			     apply_metabolite_data: apply_metabolite_data };

    return CobraModel;

    // instance methods
    function init(model_data) {
	// reactions and metabolites
	if (!(model_data.reactions && model_data.metabolites)) {
	    throw new Error('Bad model data.');
	    return;
	}
	this.reactions = {};
	for (var i=0, l=model_data.reactions.length; i<l; i++) {
	    var r = model_data.reactions[i],
		the_id = r.id;
	    this.reactions[the_id] = utils.clone(r);
	    delete this.reactions[the_id].id;
	}
	this.metabolites = {};
	for (var i=0, l=model_data.metabolites.length; i<l; i++) {
	    var r = model_data.metabolites[i],
		the_id = r.id;
	    this.metabolites[the_id] = utils.clone(r);
	    delete this.metabolites[the_id].id;
	}

	// get cofactors if preset
	if ('cofactors' in model_data) {
	    if (model_data.cofactors instanceof Array) {
		this.cofactors = model_data.cofactors;
	    } else {
		console.warn('model_data.cofactors should be an array. Ignoring it');
		this.cofactors = [];
	    }
	} else {
	    this.cofactors = [];
	}
    }

    function apply_reaction_data(reaction_data, styles) {
	for (var reaction_id in this.reactions) {
	    var reaction = this.reactions[reaction_id];
	    if (reaction_data===null) {
		reaction.data = null;
		reaction.data_string = '';
	    } else {
		var d = (reaction_id in reaction_data ?
			 reaction_data[reaction_id] : null),
		    f = data_styles.float_for_data(d, styles),
		    s = data_styles.text_for_data(d, styles);
		reaction.data = f;
		reaction.data_string = s;
	    }
	}
    }

    function apply_metabolite_data(metabolite_data, styles) {
	for (var metabolite_id in this.metabolites) {
	    var metabolite = this.metabolites[metabolite_id];
	    if (metabolite_data===null) {
		metabolite.data = null;
		metabolite.data_string = '';
	    } else {
		var d = (metabolite_id in metabolite_data ?
			 metabolite_data[metabolite_id] : null),
		    f = data_styles.float_for_data(d, styles),
		    s = data_styles.text_for_data(d, styles);
		metabolite.data = f;
		metabolite.data_string = s;
	    }
	}
    }
});

define('Brush',["utils"], function(utils) {
    /** Define a brush to select elements in a map.

     Arguments
     ---------

     selection: A d3 selection to place the brush in.

     is_enabled: Whether to turn the brush on.

     map: An instance of escher.Map.

     insert_after: A d3 selector string to choose the svg element that the brush
     will be inserted after. Often a canvas element (e.g. '.canvas-group').

     */

    var Brush = utils.make_class();
    Brush.prototype = { init: init,
			toggle: toggle,
			setup_selection_brush: setup_selection_brush };

    return Brush;

    // definitions
    function init(selection, is_enabled, map, insert_after) {
	this.brush_sel = selection.append('g')
	    .attr('id', 'brush-container');
	var node = this.brush_sel.node(),
	    insert_before_node = selection.select(insert_after).node().nextSibling;
	if (!(node===insert_before_node))
	    node.parentNode.insertBefore(node, insert_before_node);
	this.enabled = is_enabled;
	this.map = map;
    };

    function brush_is_enabled() {
	/** Returns a boolean for the on/off status of the brush

	 */
	return this.map.sel.select('.brush').empty();
    }
    function toggle(on_off) {
	/** Turn the brush on or off

	 */
	if (on_off===undefined) on_off = !this.enabled;

	if (on_off) {
	    this.selection_brush = this.setup_selection_brush();
	} else {
	    this.brush_sel.selectAll('.brush').remove();
	}
    }	
    function setup_selection_brush() {
	var selection = this.brush_sel, 
	    selectable_selection = this.map.sel.selectAll('#nodes,#text-labels'),
	    size_and_location = this.map.canvas.size_and_location(),
	    width = size_and_location.width,
	    height = size_and_location.height,
	    x = size_and_location.x,
	    y = size_and_location.y;
	var brush_fn = d3.svg.brush()
		.x(d3.scale.identity().domain([x, x+width]))
		.y(d3.scale.identity().domain([y, y+height]))
		.on("brush", function(key_manager) {	    
		    var shift_key_on = key_manager.held_keys.shift,
			extent = d3.event.target.extent(),
			selection;
		    if (shift_key_on) {
			// when shift is pressed, ignore the currently selected nodes
			selection = selectable_selection
			    .selectAll('.node,.text-label:not(.selected)');
		    } else {
			// otherwise, brush all nodes
			selection = selectable_selection
			    .selectAll('.node,.text-label');
		    }
		    selection.classed("selected", function(d) { 
			var sx = d.x, sy = d.y;
			return extent[0][0] <= sx && sx < extent[1][0]
			    && extent[0][1] <= sy && sy < extent[1][1];
		    });
		}.bind(null, this.map.key_manager))
		.on("brushend", function() {
		    d3.event.target.clear();
		    d3.select(this).call(d3.event.target);
		}),
	    brush = selection.append("g")
		.attr("class", "brush")
		.call(brush_fn);

	// turn off the mouse crosshair
	selection.selectAll('.background')
	    .classed('cursor-grab', false)
	    .classed('cursor-grabbing', false)
	    .style('cursor', null);

	return brush;
    }
});

define('ui',["utils"], function(utils) {
    return { individual_button: individual_button,
	     radio_button_group: radio_button_group,
	     button_group: button_group,
	     dropdown_menu: dropdown_menu,
	     set_button: set_button,
	     set_input_button: set_input_button };

    function individual_button(s, button) {
	var b = s.append('button'),
	    c = b.append('span');
	if ('id' in button) b.attr('id', button.id);
	if ('classes' in button) b.attr('class', button.classes);
	if ('text' in button) c.text(button.text);
	if ('icon' in button) c.classed(button.icon, true);
	if ('key' in button) set_button(b, button.key);
	// if ('tooltip' in button) 
	b.attr('title', button.tooltip);
    }
    function radio_button_group(s) {
	var s2 = s.append('li')
		.attr('class', 'btn-group-vertical')
		.attr('data-toggle', 'buttons');
	return { button: function(button) {
	    var b = s2.append("label")
		    .attr("class", "btn btn-default");
	    b.append('input').attr('type', 'radio');
	    var c = b.append("span");
	    if ('id' in button) b.attr('id', button.id);
	    if ('text' in button) c.text(button.text);
	    if ('icon' in button) c.classed(button.icon, true);
	    if ('key' in button) set_button(b, button.key);
	    if ('tooltip' in button) b.attr('title', button.tooltip);
	    return this;
	}};
    }
    function button_group(s) {
	var s2 = s.attr('class', 'btn-group-vertical');
	return { button: function(button) {
	    var b = s2.append("button")
		    .attr("class", "btn btn-default");
	    var c = b.append("span");
	    if ('id' in button) b.attr('id', button.id);
	    if ('text' in button) c.text(button.text);
	    if ('icon' in button) c.classed(button.icon, true);
	    if ('key' in button) set_button(b, button.key);
	    if ('tooltip' in button) b.attr('title', button.tooltip);
	    return this;
	}};
    }
    function dropdown_menu(s, name, pull_right) {
	if (pull_right === undefined) pull_right = false;
	var s2 = s.append('li')
		.attr('class', 'dropdown');
	s2.append('button').text(name+" ")
	    .attr('class', 'btn btn-link btn-sm dropdown-button')
	    .attr('data-toggle', 'dropdown')
	    .append('b').attr('class', 'caret');
	var ul = s2.append('ul')
		.attr('class', 'dropdown-menu')
		.classed('pull-right', pull_right)
		.attr('role', 'menu')
		.attr('aria-labelledby', 'dLabel');
	return {
	    button: function(button) {
		var li = ul.append("li")
			.attr('role', 'presentation'),
		    link = li.append("a")
			.attr('href', '#'),
		    icon = link.append('span')
			.attr('class', 'dropdown-button-icon'),
		    text = link.append('span')
			.attr('class', 'dropdown-button-text');
		if ('id' in button) li.attr('id', button.id);
		if ('text' in button) text.text(" "+button.text);
		if ('icon' in button) icon.classed(button.icon, true);
		
		if ('key' in button) {
		    set_button(link, button.key);
		} else if ('input' in button) {
		    var input = button.input,
			out = set_input_button(link, li, input.fn);
		    if ('assign' in input && 'key' in input)
			input.assign[input.key] = out;
		}
		return this;
	    },
	    divider: function() {
		ul.append("li")
		    .attr('role', 'presentation')
		    .attr('class', 'divider');
		return this;
	    }
	};
    }
    function set_button(b, key, name) {
	if (name !== undefined) b.text(name);
	b.on("click", function() {
	    key.fn.call(key.target);
	});
    }
    function set_input_button(b, s, fn) {
	var input = s.append("input")
		.attr("type", "file")
		.style("display", "none")
		.on("change", function() { 
		    utils.load_json(this.files[0], function(e, d) {
			fn(e, d);
			this.value = "";
		    }.bind(this));
		});
	b.on('click', function(e) {
	    input.node().click();
	});
	return function() { input.node().click(); };
    }
});


define('SearchBar',["utils", "CallbackManager"], function(utils, CallbackManager) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
			    is_visible: is_visible,
			    toggle: toggle,
			    update: update,
			    next: next,
			    previous: previous };

    return SearchBar;

    // instance methods
    function init(sel, search_index, map) {
	var container = sel.attr('class', 'search-container')
		.style('display', 'none');
	this.input = container.append('input')
	    .attr('class', 'search-bar');
	var group = container.append('div').attr('class', 'btn-group btn-group-sm');
	group.append('button')
	    .attr("class", "btn btn-default")
	    .on('click', this.previous.bind(this))
	    .append('span').attr('class', "glyphicon glyphicon-chevron-left");
	group.append('button')
	    .attr("class", "btn btn-default")
	    .on('click', this.next.bind(this))
	    .append('span').attr('class', "glyphicon glyphicon-chevron-right");
	this.counter = container.append('div')
	    .attr('class', 'search-counter');
	container.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.toggle(false);
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-remove");
	
	this.callback_manager = new CallbackManager();

	this.selection = container;
	this.map = map;
	this.search_index = search_index;

	this.current = 1;
	this.results = null;

	this.input.on('input', function(input) {
	    this.current = 1;
	    this.results = this.search_index.find(input.value);
	    this.update();
	}.bind(this, this.input.node()));
    }
    function is_visible() {
	return this.selection.style('display') != 'none';
    }
    function toggle(on_off) {
	if (on_off===undefined) this.is_active = !this.is_active;
	else this.is_active = on_off;

	if (this.is_active) {
	    this.selection.style('display', null);
	    this.counter.text("");
	    this.input.node().value = "";
	    this.input.node().focus();
	    // escape key
	    this.escape = this.map.key_manager
		.add_escape_listener(function() { this.toggle(false); }.bind(this));
	    // enter key
	    this.escape = this.map.key_manager
		.add_enter_listener(function() { this.next(); }.bind(this));
	    // run the show callback
	    this.callback_manager.run('show');
	} else {
	    this.map.highlight(null);
	    this.selection.style("display", "none");
	    this.results = null;
	    if (this.escape) this.escape.clear();
	    this.escape = null;
	    if (this.enter) this.enter.clear();
	    this.enter = null;
	    // run the hide callback
	    this.callback_manager.run('hide');
	}
    }
    function update() {
	if (this.results == null) {
	    this.counter.text("");
	    this.map.zoom_extent_canvas();
	    this.map.highlight(null);
	} else if (this.results.length == 0) {
	    this.counter.text("0 / 0");
	    this.map.zoom_extent_canvas();
	    this.map.highlight(null);
	} else {
	    this.counter.text(this.current + " / " + this.results.length);
	    var r = this.results[this.current - 1];
	    if (r.type=='reaction') {		
		this.map.zoom_to_reaction(r.reaction_id);
		this.map.highlight_reaction(r.reaction_id);
	    } else if (r.type=='metabolite') {
		this.map.zoom_to_node(r.node_id);
		this.map.highlight_node(r.node_id);
	    } else {
		throw new Error('Bad search index data type: ' + r.type);
	    }
	}
    }
    function next() {
	if (this.results == null) return;
	if (this.current==this.results.length)
	    this.current = 1;
	else
	    this.current += 1;
	this.update();
    }
    function previous() {
	if (this.results == null) return;
	if (this.current==1)
	    this.current = this.results.length;
	else
	    this.current -= 1;
	this.update();
    } 
});

define('Settings',["utils", "lib/bacon"], function(utils, bacon) {
    /** 
     */

    var SearchBar = utils.make_class();
    // class methods
    SearchBar.check_type = check_type;
    // instance methods
    SearchBar.prototype = { init: init,
			    change_data_style: change_data_style,
			    set_auto_domain: set_auto_domain,
			    set_domain_value: set_domain_value,
			    set_domain: set_domain,
			    set_range_value: set_range_value,
			    hold_changes: hold_changes,
			    abandon_changes: abandon_changes,
			    accept_changes: accept_changes };

    return SearchBar;

    // class methods
    function check_type(type) {
	if (['reaction', 'metabolite'].indexOf(type)==-1)
	    throw new Error('Bad type');
    }

    // instance methods
    function init(def_styles, def_auto_domain, def_domain, def_range) {
	// defaults
	if (def_styles===undefined) 
	    def_styles = { reaction: ['color', 'size', 'abs', 'text'],
			   metabolite: ['color', 'size', 'text'] };
	if (def_auto_domain===undefined)
	    def_auto_domain = { reaction: true,
				metabolite: true };
	if (def_domain===undefined)
	    def_domain = { reaction: [-10, 0, 10],
			   metabolite: [-10, 0, 10] };
	if (def_range===undefined)
	    def_range = { reaction: { color: ['rgb(200,200,200)', 'rgb(150,150,255)', 'purple'],
				      size: [4, 8, 12] },
			  metabolite: { color: ['green', 'white', 'red'],
					size: [6, 8, 10] } };

	// event streams
	this.data_styles = {};
	this.data_styles_bus = {};
	this.data_styles_stream = {};
	this.auto_domain = {};
	this.auto_domain_bus = {};
	this.auto_domain_stream = {};
	this.domain = {};
	this.domain_bus = {};
	this.domain_stream = {};
	this.range = {};
	this.range_bus = {};
	this.range_stream = {};

	// manage accepting/abandoning changes
	this.status_bus = new bacon.Bus();

	// force an update of ui components
	this.force_update_bus = new bacon.Bus();

	// modify bacon.observable
	bacon.Observable.prototype.convert_to_conditional_stream = convert_to_conditional_stream;
	bacon.Observable.prototype.force_update_with_bus = force_update_with_bus;

	['metabolite', 'reaction'].forEach(function(type) {
	    // set up the styles settings
	    this.data_styles_bus[type] = new bacon.Bus();
	    // make the event stream
	    this.data_styles_stream[type] = this.data_styles_bus[type]
	    // conditionally accept changes
		.convert_to_conditional_stream(this.status_bus)
	    // combine into state array
		.scan([], function(current, event) {
		    if (event===null)
			return current;
		    // add or remove the property from the stream
		    if (event.on_off && current.indexOf(event.style) == -1) {
			// if it is checked, add the style
			return current.concat([event.style]);
		    } else if (!event.on_off && current.indexOf(event.style) != -1) {
			// if not, remove the style
			return current.filter(function(v) {
			    return v != event.style;
			});
		    }
		    // otherwise, return unchanged
		    return current;
		})
	    // force updates
		.force_update_with_bus(this.force_update_bus);

	    // get the latest
	    this.data_styles_stream[type].onValue(function(v) {
		this.data_styles[type] = v;
	    }.bind(this));

	    // push the defaults
	    var def = def_styles[type];
	    def.forEach(function(x) {
	    	this.data_styles_bus[type].push({ style: x, on_off: true });
	    }.bind(this));

	    // set up the auto_domain settings
	    this.auto_domain_bus[type] = new bacon.Bus();
	    this.auto_domain_stream[type] = this.auto_domain_bus[type]
	    // conditionally accept changes
		.convert_to_conditional_stream(this.status_bus)
	    // force updates
		.force_update_with_bus(this.force_update_bus);

	    // get the latest
	    this.auto_domain_stream[type].onValue(function(v) {
		this.auto_domain[type] = v;
	    }.bind(this));

	    // set the default
	    var def = def_auto_domain[type];
	    this.auto_domain_bus[type].push(def);

	    // set up the domain
	    // make the bus
	    this.domain_bus[type] = new bacon.Bus();
	    // make a new constant for the input default
	    this.domain_stream[type] = this.domain_bus[type]
	    // conditionally accept changes
		.convert_to_conditional_stream(this.status_bus)
	    // combine into state array
		.scan([], function(current, event) {
		    current[event.index] = event.value;
		    return current;
		})
	    // force updates
		.force_update_with_bus(this.force_update_bus);

	    // get the latest
	    this.domain_stream[type].onValue(function(v) {
		this.domain[type] = v;
	    }.bind(this));

	    // push the defaults
	    var def = def_domain[type];
	    def.forEach(function(x, i) { 
		this.domain_bus[type].push({ index: i, value: x });
	    }.bind(this));

	    // set up the ranges
	    this.range_bus[type] = {};
	    this.range_stream[type] = {};
	    this.range[type] = {};
	    ['color', 'size'].forEach(function(range_type) {
		// make the bus
		this.range_bus[type][range_type] = new bacon.Bus();
		// make a new constant for the input default
		this.range_stream[type][range_type] = this.range_bus[type][range_type]
		// conditionally accept changes
		    .convert_to_conditional_stream(this.status_bus)
		// combine into state array
		    .scan([], function(current, event) {
			current[event.index] = event.value;
			return current;
		    })
		// force updates
		    .force_update_with_bus(this.force_update_bus);

		// get the latest
		this.range_stream[type][range_type].onValue(function(v) {
		    this.range[type][range_type] = v;
		}.bind(this));

		// push the default
		var def = def_range[type][range_type];
		def.forEach(function(x, i) { 
		    this.range_bus[type][range_type].push({ index: i, value: x });
		}.bind(this));

	    }.bind(this));
	}.bind(this));

	// definitions
	function convert_to_conditional_stream(status_stream) {
	    /** Hold on to event when hold_property is true, and only keep them
	      if accept_property is true (when hold_property becomes false).

	     */

	    // true if hold is pressed
	    var is_not_hold_event = status_stream
		    .map(function(x) { return x=='hold'; })
		    .not()
		    .toProperty(true),
		is_not_first_clear = status_stream
		    .scan(false, function(c, x) {
			// first clear only
			return (c==false && x=='clear');
		    }).not(),
		is_not_first_hold = status_stream
		    .scan(false, function(c, x) {
			// first clear only
			return (c==false && x=='hold');
		    }).not(),
		combined = bacon.combineAsArray(this, status_stream),
		held = combined
		    .scan([], function(c, x) {
			if (x[1]=='hold') {
			    c.push(x[0]);
			    return c;
			} else if (x[1]=='accept') {
			    return c;
			} else if (x[1]=='reject') {
			    return [];
			} else if (x[1]=='clear') {
			    return [x[0]];
			} else {
			    throw Error('bad status ' + x[1]);
			}
		    })
	    // don't pass in events until the end of a hold
		    .filter(is_not_hold_event)
	    // ignore the event when clear is passed
		    .filter(is_not_first_clear)
	    // ignore the event when hold is passed
		    .filter(is_not_first_hold)
		    .flatMap(function(ar) {
			return bacon.fromArray(ar);
		    }),
		unheld = this.filter(is_not_hold_event);
	    return unheld.merge(held);
	}

	function force_update_with_bus(bus) {	     
	    return bacon
		.combineAsArray(this, bus.toProperty(false))
		.map(function(t) {
		    return t[0];
		});
	}
    }
    function set_auto_domain(type, on_off) {	
	/** Turn auto domain setting on or off.

	 type: 'reaction' or 'metabolite'

	 on_off: (Boolean) If True, then automatically set the domain. If False,
	 then manually set the domain.

	 */
	check_type(type);

	this.auto_domain_bus[type].push(on_off);
    }
    function change_data_style(type, style, on_off) {
	/** Change the data style.

	 type: 'reaction' or 'metabolite'

	 style: A data style.

	 on_off: (Boolean) If True, then add the style. If False, then remove
	 it.

	 */
	check_type(type);

	this.data_styles_bus[type].push({ style: style,
					  on_off: on_off });
    }
    function set_domain_value(type, index, value) {
	/** Change a domain value.

	 type: 'reaction' or 'metabolite'

	 index: The domain index to set.

	 value: The new value

	 */
	check_type(type);

	this.domain_bus[type].push({ index: index,
				     value: value });
    }
    function set_domain(type, domain) {
	/** Change a domain.

	 type: 'reaction' or 'metabolite'

	 domain: The new domain.

	 */
	check_type(type);

	domain.forEach(function(d, i) {
	    this.domain_bus[type].push({ index: i, value: d });
	}.bind(this));
    }
    function set_range_value(type, range_type, index, value) {
	/** Change a range value.

	 type: 'reaction' or 'metabolite'

	 range_type: 'color' or 'size'

	 index: The range index to set.

	 value: The new value

	 */
	check_type(type);

	this.range_bus[type][range_type].push({ index: index,
						   value: value });
    }
    function hold_changes() {
	this.status_bus.push('hold');
    }
    function abandon_changes() {
	this.status_bus.push('reject');
	this.status_bus.push('clear');
	this.force_update_bus.push(true);
    };
    function accept_changes() {
	this.status_bus.push('accept');
	this.status_bus.push('clear');
    };
});

define('SettingsBar',["utils", "CallbackManager", "lib/bacon"], function(utils, CallbackManager, bacon) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
			    is_visible: is_visible,
			    toggle: toggle,
			    hold_changes: hold_changes,
			    abandon_changes: abandon_changes,
			    accept_changes: accept_changes,
			    scale_gui: scale_gui };

    return SearchBar;

    // instance methods
    function init(sel, settings, map) {
	this.sel = sel;
	this.settings = settings;
	this.draw = false;

	var container = sel.append('div')
		.attr('class', 'settings-box')
		.style('display', 'none');

	// done button
	container.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.accept_changes();
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-ok");
	// quit button
	container.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.abandon_changes();
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-remove");
	
	// reaction data
	container.append('div')
	    .text('Reaction data').attr('class', 'settings-section-heading');
	this.scale_gui(container.append('div'), 'reaction');

	// metabolite data
	container.append('div').text('Metabolite data')
	    .attr('class', 'settings-section-heading');
	this.scale_gui(container.append('div'), 'metabolite');

	this.callback_manager = new CallbackManager();

	this.map = map;
	this.selection = container;
    }
    function is_visible() {
	return this.selection.style('display') != 'none';
    }
    function toggle(on_off) {
	if (on_off===undefined) on_off = !this.is_visible();

	if (on_off) {
	    // hold changes until accepting/abandoning
	    this.hold_changes();
	    // show the menu
	    this.selection.style("display", "block");
	    this.selection.select('input').node().focus();
	    // escape key
	    this.escape = this.map.key_manager
		.add_escape_listener(function() {
		    this.abandon_changes();
		}.bind(this));
	    // enter key
	    this.enter = this.map.key_manager
		.add_enter_listener(function() {
		    this.accept_changes();
		}.bind(this));
	    // run the show callback
	    this.callback_manager.run('show');
	} else {
	    // draw on finish
	    if (this.draw) this.map.draw_everything();
	    // hide the menu
	    this.selection.style("display", "none");
	    if (this.escape) this.escape.clear();
	    if (this.enter) this.enter.clear();
	    this.escape = null;
	    this.enter = null;
	    // run the hide callback
	    this.callback_manager.run('hide');
	}
    }
    function hold_changes() {
	this.settings.hold_changes();
    }
    function abandon_changes() {
	this.draw = false;
	this.settings.abandon_changes();
	this.toggle(false);
    }
    function accept_changes() {
	this.sel.selectAll('input').each(function (s) { 
	    this.blur();
	});
	this.draw = true;
	this.settings.accept_changes();
	this.toggle(false);
    }
    function scale_gui(s, type) {
	/** A UI to edit color and size scales. */

	var t = s.append('table').attr('class', 'settings-table');

	var size_domain = [], color_domain = [];

	// columns
	var columns = [0, 1, 2],
	    settings = this.settings;

	// numbers
	t.append('tr')
	    .selectAll('.settings-number')
	    .data([''].concat(columns))
	    .enter()
	    .append('td').attr('class', 'settings-number')
	    .text(function (d) {
		return d==='' ? d : ('— ' + d + ' —');
	    });

	// domain
	t.append('tr').call(function(r) {
	    r.append('td').text('Domain:');

	    var scale_bars = r.selectAll('.input-cell')
		    .data(columns);
	    scale_bars.enter()
		.append('td').attr('class', 'input-cell')
		.append('input').attr('class', 'scale-bar-input')
		.each(function(column) {
		    bacon.fromEventTarget(this, 'change')
			.onValue(function(event) {
			    settings.set_domain_value(type, column, event.target.value);
			});

		    settings.domain_stream[type].onValue(function(ar) {
			this.value = ar[column];
		    }.bind(this));
		});

	    // auto checkbox
	    r.append('td').call(function(z) {
		z.append('span').text('auto ');
		z.append('input').attr('type', 'checkbox')
		    .each(function() {
			bacon.fromEventTarget(this, 'change')
			    .onValue(function(event) {
				var on_off = event.target.checked;
			    	settings.set_auto_domain(type, on_off);
				// disable the domain boxes on ui check
				scale_bars.selectAll('input')
				    .attr('disabled', on_off ? 'true' : null);
			    });
			
			// subscribe to changes in the model
			settings.auto_domain_stream[type].onValue(function(on_off) {
			    // check the box if auto domain on
			    this.checked = on_off;
			    // also disable the domain boxes on programmatic change
			    scale_bars.selectAll('input')
				.attr('disabled', on_off ? 'true' : null);
			}.bind(this));

		    });
		});
	}.bind(this));
	
	// ranges
	[['size', 'Size'], ['color', 'Color']].forEach(function(range_type_ar) {
	    var r = t.append('tr');
	    r.append('td').text(range_type_ar[1] + ':');
	    var scale_bars = r.selectAll('.input-cell')
		    .data(columns);
	    scale_bars.enter()
		.append('td').attr('class', 'input-cell')
		.append('input').attr('class', 'scale-bar-input')
		.each(function(column) {
		    bacon.fromEventTarget(this, 'change')
			.onValue(function(event) {
			    settings.set_range_value(type, range_type_ar[0],
						     column, event.target.value);
			});

		    settings.range_stream[type][range_type_ar[0]].onValue(function(ar) {
		    	this.value = ar[column];
		    }.bind(this));
		});
	});

	// styles
	t.append('tr').call(function(r) {
	    r.append('td').text('Styles:');
	    var cell = r.append('td').attr('colspan', columns.length + 1);

	    var styles = ['abs', 'size', 'color', 'text'],
		style_cells = cell.selectAll('.style-span')
		    .data(styles),
		s = style_cells.enter()
		    .append('span')
		    .attr('class', 'style-span');
	    s.append('span').text(function(d) { return d; });

	    // make the checkbox
	    s.append('input').attr('type', 'checkbox')
		.each(function(style) {
		    // change the model when the box is changed
		    var change_stream = bacon
		    	    .fromEventTarget(this, 'change')
		    	    .onValue(function(event) {
		    		settings.change_data_style(type, style,
							   event.target.checked);
		    	    });
		    
		    // subscribe to changes in the model
		    settings.data_styles_stream[type].onValue(function(ar) {
			// check the box if the style is present
			this.checked = (ar.indexOf(style) != -1);
		    }.bind(this));
		});
	});
    }
});

define('Builder',["utils", "Input", "ZoomContainer", "Map", "CobraModel", "Brush", "CallbackManager", "ui", "SearchBar", "Settings", "SettingsBar"], function(utils, Input, ZoomContainer, Map, CobraModel, Brush, CallbackManager, ui, SearchBar, Settings, SettingsBar) {
    /** A Builder object contains all the ui and logic to generate a map builder or viewer.

     Builder(options)

     options: An object.

     */
    var Builder = utils.make_class();
    Builder.prototype = { init: init,
			  reload_builder: reload_builder,
			  set_mode: set_mode,
			  view_mode: view_mode,
			  build_mode: build_mode,
			  brush_mode: brush_mode,
			  zoom_mode: zoom_mode,
			  rotate_mode: rotate_mode,
			  _toggle_direction_buttons: _toggle_direction_buttons,
			  _setup_menu: _setup_menu,
			  _setup_simple_zoom_buttons: _setup_simple_zoom_buttons,
			  _setup_status: _setup_status,
			  _setup_modes: _setup_modes,
			  _get_keys: _get_keys };

    return Builder;

    // definitions
    function init(options) {
	// set defaults
	this.options = utils.set_options(options, {
	    // location
	    selection: d3.select("body").append("div"),
	    // view options
	    menu: 'all',
	    scroll_behavior: 'pan',
	    enable_editing: true,
	    enable_keys: true,
	    enable_search: true,
	    fillScreen: false,
	    // map, model, and styles
	    map_path: null,
	    map: null,
	    cobra_model_path: null,
	    cobra_model: null,
	    css_path: null,
	    css: null,
	    starting_reaction: null,
	    // applied data
	    auto_reaction_domain: true,
	    reaction_data_path: null,
	    reaction_data: null,
	    reaction_styles: ['color', 'size', 'abs', 'text'],
	    reaction_domain: [-10, 0, 10],
	    reaction_color_range: ['rgb(200,200,200)', 'rgb(150,150,255)', 'purple'],
	    reaction_size_range: [4, 8, 12],
	    metabolite_data: null,
	    metabolite_data_path: null,
	    metabolite_styles: ['color', 'size', 'text'],
	    auto_metabolite_domain: true,
	    metabolite_domain: [-10, 0, 10],
	    metabolite_color_range: ['green', 'white', 'red'],
	    metabolite_size_range: [6, 8, 10]
	});

	// initialize the settings
	this.settings = new Settings(
	    { reaction: this.options.reaction_styles,
	      metabolite: this.options.metabolite_styles },
	    { reaction: this.options.auto_reaction_domain,
	      metabolite: this.options.auto_metabolite_domain },
	    { reaction: this.options.reaction_domain,
	      metabolite: this.options.metabolite_domain },
	    { reaction: { color: this.options.reaction_color_range,
			  size: this.options.reaction_size_range },
	      metabolite: { color: this.options.metabolite_color_range,
			    size: this.options.metabolite_size_range } }
	);

	if (utils.check_for_parent_tag(this.options.selection, 'svg')) {
	    throw new Error("Builder cannot be placed within an svg node "+
			    "becuase UI elements are html-based.");
	}

	var files_to_load = [{ file: this.options.map_path, 
			       value: this.options.map,
			       callback: set_map_data },
			     { file: this.options.cobra_model_path, 
			       value: this.options.cobra_model,
			       callback: set_cobra_model },
			     { file: this.options.css_path, 
			       value: this.options.css,
			       callback: set_css },
			     { file: this.options.reaction_data_path, 
			       value: this.options.reaction_data,
			       callback: set_reaction_data },
			     { file: this.options.metabolite_data_path, 
			       value: this.options.metabolite_data,
			       callback: set_metabolite_data } ];
	utils.load_files(this, files_to_load, reload_builder);
	return;

	// definitions
	function set_map_data(error, map_data) {
	    if (error) console.warn(error);
	    this.options.map_data = map_data;
	}
	function set_cobra_model(error, cobra_model) {
	    if (error) console.warn(error);
	    this.options.cobra_model = cobra_model;
	}
	function set_css(error, css) {
	    if (error) console.warn(error);
	    this.options.css = css;
	}
	function set_reaction_data(error, data) {
	    if (error) console.warn(error);
	    this.options.reaction_data = data;
	}
	function set_metabolite_data(error, data) {
	    if (error) console.warn(error);
	    this.options.metabolite_data = data;
	}
    }

    // Definitions
    function reload_builder() {
	/** Load the svg container and draw a loaded map if provided.
	 
	 */

	// Begin with some definitions
	var selectable_click_enabled = true,
	    shift_key_on = false;

	// set up this callback manager
	this.callback_manager = CallbackManager();

	// Check the cobra model
	var cobra_model_obj = null;
	if (this.options.cobra_model!==null) {
	    cobra_model_obj = CobraModel(this.options.cobra_model);
	} else {
	    console.warn('No cobra model was loaded.');
	}

	// remove the old builder
	utils.remove_child_nodes(this.options.selection);

	// set up the svg
	var svg = utils.setup_svg(this.options.selection, this.options.selection_is_svg,
				  this.options.fill_screen);
	
	// se up the zoom container
	this.zoom_container = new ZoomContainer(svg, this.options.selection,
						this.options.scroll_behavior);
	var zoomed_sel = this.zoom_container.zoomed_sel;

	if (this.options.map_data!==null) {
	    // import map
	    this.map = Map.from_data(this.options.map_data,
				     svg, this.options.css,
				     zoomed_sel,
				     this.zoom_container,
				     this.settings,
				     this.options.reaction_data,
				     this.options.metabolite_data,
				     cobra_model_obj,
				     this.options.enable_search);
	    this.zoom_container.reset();
	} else {
	    // new map
	    this.map = new Map(svg, this.options.css, zoomed_sel,
			       this.zoom_container,
			       this.settings,
			       this.options.reaction_data,
			       this.options.metabolite_data,
			       cobra_model_obj,
			       null,
			       this.options.enable_search);
	}

	// set up the reaction input with complete.ly
	this.reaction_input = Input(this.options.selection, this.map,
				    this.zoom_container);

	// set up the Brush
	this.brush = new Brush(zoomed_sel, false, this.map, '.canvas-group');

	// set up the modes
	this._setup_modes(this.map, this.brush, this.zoom_container);

	var s = this.options.selection
		.append('div').attr('class', 'search-menu-container')
		.append('div').attr('class', 'search-menu-container-inline'),
	    menu_div = s.append('div'),
	    search_bar_div = s.append('div'),
	    settings_div = s.append('div'),
	    button_div = this.options.selection.append('div');

	// set up the search bar
	this.search_bar = SearchBar(search_bar_div, this.map.search_index, 
				    this.map);
	// set up the settings
	this.settings_page = SettingsBar(settings_div, this.settings, 
					 this.map);
	// set up the hide callbacks
	this.search_bar.callback_manager.set('show', function() {
	    this.settings_page.toggle(false);
	}.bind(this));
	this.settings_page.callback_manager.set('show', function() {
	    this.search_bar.toggle(false);
	}.bind(this));

	// set up key manager
	var keys = this._get_keys(this.map, this.zoom_container,
				  this.search_bar, this.settings_page,
				  this.options.enable_editing);
	this.map.key_manager.assigned_keys = keys;
	// tell the key manager about the reaction input and search bar
	this.map.key_manager.input_list = [this.reaction_input, this.search_bar,
					   this.settings_page];
	// make sure the key manager remembers all those changes
	this.map.key_manager.update();
	// turn it on/off
	this.map.key_manager.toggle(this.options.enable_keys);
	
	// set up menu and status bars
	if (this.options.menu=='all') {
	    this._setup_menu(menu_div, button_div, this.map, this.zoom_container, this.map.key_manager, keys,
			     this.options.enable_editing);
	} else if (this.options.menu=='zoom') {
	    this._setup_simple_zoom_buttons(button_div, keys);
	}
	var status = this._setup_status(this.options.selection, this.map);

	// setup selection box
	if (this.options.map_data!==null) {
	    this.map.zoom_extent_canvas();
	} else {
	    if (this.options.starting_reaction!==null && cobra_model_obj!==null) {
		// Draw default reaction if no map is provided
		var size = this.zoom_container.get_size();
		var start_coords = { x: size.width / 2,
				     y: size.height / 4 };
		this.map.new_reaction_from_scratch(this.options.starting_reaction, start_coords, 90);
		this.map.zoom_extent_nodes();
	    } else {
		this.map.zoom_extent_canvas();
	    }
	}

	// start in zoom mode for builder, view mode for viewer
	if (this.options.enable_editing)
	    this.zoom_mode();
	else
	    this.view_mode();

	// draw
	this.map.draw_everything();
    }

    function set_mode(mode) {
	this.search_bar.toggle(false);
	// input
	this.reaction_input.toggle(mode=='build');
	this.reaction_input.direction_arrow.toggle(mode=='build');
	if (this.options.menu=='all' && this.options.enable_editing)
	    this._toggle_direction_buttons(mode=='build');
	// brush
	this.brush.toggle(mode=='brush');
	// zoom
	this.zoom_container.toggle_zoom(mode=='zoom' || mode=='view');
	// resize canvas
	this.map.canvas.toggle_resize(mode=='zoom' || mode=='brush');
	// behavior
	this.map.behavior.toggle_rotation_mode(mode=='rotate');
	this.map.behavior.toggle_selectable_click(mode=='build' || mode=='brush' || mode=='rotate');
	this.map.behavior.toggle_selectable_drag(mode=='brush' || mode=='rotate');
	this.map.behavior.toggle_label_drag(mode=='brush');
	if (mode=='view')
	    this.map.select_none();
	if (mode=='rotate')
	    this.map.deselect_text_labels();
	this.map.draw_everything();
    }
    function view_mode() {
	this.callback_manager.run('view_mode');
	this.set_mode('view');
    }
    function build_mode() {
	this.callback_manager.run('build_mode');
	this.set_mode('build');
    }	
    function brush_mode() {
	this.callback_manager.run('brush_mode');
	this.set_mode('brush');
    }
    function zoom_mode() {
	this.callback_manager.run('zoom_mode');
	this.set_mode('zoom');
    }
    function rotate_mode() {
	this.callback_manager.run('rotate_mode');
	this.set_mode('rotate');
    }	
    function _setup_menu(menu_selection, button_selection, map, zoom_container,
			 key_manager, keys, enable_editing) {
	var menu = menu_selection.attr('id', 'menu')
		.append("ul")
		.attr("class", "nav nav-pills");
	// map dropdown
	ui.dropdown_menu(menu, 'Map')
	    .button({ key: keys.save,
		      text: "Save as JSON (Ctrl s)" })
	    .button({ text: "Load map JSON (Ctrl o)",
		      input: { assign: key_manager.assigned_keys.load,
			       key: 'fn',
			       fn: load_map_for_file.bind(this) }
		    })
	    .button({ key: keys.save_svg,
		      text: "Export as SVG (Ctrl Shift s)" })
	    .button({ key: keys.clear_map,
		      text: "Clear map" });
	// model dropdown
	ui.dropdown_menu(menu, 'Model')
	    .button({ text: 'Load COBRA model JSON (Ctrl m)',
		      input: { assign: key_manager.assigned_keys.load_model,
			       key: 'fn',
			       fn: load_model_for_file.bind(this) }
		    });

	// data dropdown
	var data_menu = ui.dropdown_menu(menu, 'Data')
		.button({ input: { assign: key_manager.assigned_keys.load_reaction_data,
				   key: 'fn',
				   fn: load_reaction_data_for_file.bind(this) },
			  text: "Load reaction data" })
		.button({ key: keys.clear_reaction_data,
			  text: "Clear reaction data" })
		.button({ input: { fn: load_metabolite_data_for_file.bind(this) },
			  text: "Load metabolite data" })
		.button({ key: keys.clear_metabolite_data,
			  text: "Clear metabolite data" })
		.button({ key: keys.show_settings,
			  text: "Settings (Ctrl ,)" });
	
	// edit dropdown 
	var edit_menu = ui.dropdown_menu(menu, 'Edit', true);
	if (enable_editing) {	   
	    edit_menu.button({ key: keys.build_mode,
			       id: 'build-mode-menu-button',
			       text: "Add reaction mode (n)" })
		.button({ key: keys.zoom_mode,
			  id: 'zoom-mode-menu-button',
			  text: "Pan mode (z)" })
		.button({ key: keys.brush_mode,
			  id: 'brush-mode-menu-button',
			  text: "Select mode (v)" })
		.button({ key: keys.rotate_mode,
			  id: 'rotate-mode-menu-button',
			  text: "Rotate mode (r)" })
		.divider()
		.button({ key: keys.delete,
			  // icon: "glyphicon glyphicon-trash",
			  text: "Delete (Ctrl Del)" })
		.button({ key: keys.undo, 
			  text: "Undo (Ctrl z)" })
		.button({ key: keys.redo,
			  text: "Redo (Ctrl Shift z)" }) 
		.button({ key: keys.make_primary,
			  text: "Make primary metabolite (p)" })
		.button({ key: keys.cycle_primary,
			  text: "Cycle primary metabolite (c)" })
		.button({ key: keys.select_none,
			  text: "Select none (Ctrl Shift a)" });
	} else {
	    edit_menu.button({ key: keys.view_mode,
			       id: 'view-mode-menu-button',
			       text: "View mode" });
	}

	// view dropdown
	var view_menu = ui.dropdown_menu(menu, 'View', true)
		.button({ key: keys.zoom_in,
			  text: "Zoom in (Ctrl +)" })
		.button({ key: keys.zoom_out,
			  text: "Zoom out (Ctrl -)" })
		.button({ key: keys.extent_nodes,
			  text: "Zoom to nodes (Ctrl 0)"
			})
		.button({ key: keys.extent_canvas,
			  text: "Zoom to canvas (Ctrl 1)" })
		.button({ key: keys.search,
			  text: "Find (Ctrl f)" });
	if (enable_editing) {
	    view_menu.button({ key: keys.toggle_beziers,
			       id: "bezier-button",
			       text: "Show control points (b)"});	    
	    map.callback_manager
		.set('toggle_beziers.button', function(on_off) {
		    menu.select('#bezier-button').select('.dropdown-button-text')
			.text((on_off ? 'Hide' : 'Show') + ' control points (b)');
		});
	}
	
	var button_panel = button_selection.append("ul")
		.attr("class", "nav nav-pills nav-stacked")
		.attr('id', 'button-panel');

	// buttons
	ui.individual_button(button_panel.append('li'),
			     { key: keys.zoom_in,
			       icon: "glyphicon glyphicon-plus-sign",
			       classes: 'btn btn-default',
			       tooltip: "Zoom in (Ctrl +)" });
	ui.individual_button(button_panel.append('li'),
			     { key: keys.zoom_out,
			       icon: "glyphicon glyphicon-minus-sign",
			       classes: 'btn btn-default',
			       tooltip: "Zoom out (Ctrl -)" });
	ui.individual_button(button_panel.append('li'),
			     { key: keys.extent_canvas,
			       icon: "glyphicon glyphicon-resize-full",
			       classes: 'btn btn-default',
			       tooltip: "Zoom to canvas (Ctrl 1)" });

	// mode buttons
	if (enable_editing) {
	    ui.radio_button_group(button_panel.append('li'))
		.button({ key: keys.build_mode,
			  id: 'build-mode-button',
			  icon: "glyphicon glyphicon-plus",
			  tooltip: "Add reaction mode (n)" })
		.button({ key: keys.zoom_mode,
			  id: 'zoom-mode-button',
			  icon: "glyphicon glyphicon-move",
			  tooltip: "Pan mode (z)" })
		.button({ key: keys.brush_mode,
			  id: 'brush-mode-button',
			  icon: "glyphicon glyphicon-hand-up",
			  tooltip: "Select mode (v)" })
		.button({ key: keys.rotate_mode,
			  id: 'rotate-mode-button',
			  icon: "glyphicon glyphicon-repeat",
			  tooltip: "Rotate mode (r)" });

	    // arrow buttons
	    this.direction_buttons = button_panel.append('li');
	    var o = ui.button_group(this.direction_buttons)
		    .button({ key: keys.direction_arrow_left,
			      icon: "glyphicon glyphicon-arrow-left",
			      tooltip: "Direction arrow (←)" })
		    .button({ key: keys.direction_arrow_right,
			      icon: "glyphicon glyphicon-arrow-right",
			      tooltip: "Direction arrow (→)" })
		    .button({ key: keys.direction_arrow_up,
			      icon: "glyphicon glyphicon-arrow-up",
			      tooltip: "Direction arrow (↑)" })
		    .button({ key: keys.direction_arrow_down,
			      icon: "glyphicon glyphicon-arrow-down",
			      tooltip: "Direction arrow (↓)" });
	}

	// set up mode callbacks
	var select_menu_button = function(id) {
	    var ids = ['#build-mode-menu-button',
		       '#zoom-mode-menu-button',
		       '#brush-mode-menu-button',
		       '#rotate-mode-menu-button',
		       '#view-mode-menu-button'];
	    for (var i=0, l=ids.length; i<l; i++) {
		var the_id = ids[i];
		d3.select(the_id)
		    .select('span')
		    .classed('glyphicon', the_id==id)
		    .classed('glyphicon-ok', the_id==id);
	    }
	};
	this.callback_manager.set('build_mode', function() {
	    $('#build-mode-button').button('toggle');
	    select_menu_button('#build-mode-menu-button');
	});
	this.callback_manager.set('zoom_mode', function() {
	    $('#zoom-mode-button').button('toggle');
	    select_menu_button('#zoom-mode-menu-button');
	});
	this.callback_manager.set('brush_mode', function() {
	    $('#brush-mode-button').button('toggle');
	    select_menu_button('#brush-mode-menu-button');
	});
	this.callback_manager.set('rotate_mode', function() {
	    $('#rotate-mode-button').button('toggle');
	    select_menu_button('#rotate-mode-menu-button');
	});
	this.callback_manager.set('view_mode', function() {
	    $('#view-mode-button').button('toggle');
	    select_menu_button('#view-mode-menu-button');
	});

	// definitions
	function load_map_for_file(error, map_data) {
	    if (error) console.warn(error);
	    this.options.map_data = map_data;
	    this.reload_builder();
	}
	function load_model_for_file(error, data) {
	    if (error) console.warn(error);
	    var cobra_model_obj = CobraModel(data);
	    this.map.set_model(cobra_model_obj);
	    this.reaction_input.toggle(false);
	}
	function load_reaction_data_for_file(error, data) {
	    if (error) console.warn(error);
	    this.map.set_reaction_data(data);
	}
	function load_metabolite_data_for_file(error, data) {
	    if (error) console.warn(error);
	    this.map.set_metabolite_data(data);
	}
    }

    function _setup_simple_zoom_buttons(button_selection, keys) {
	var button_panel = button_selection.append("div")
		.attr('id', 'simple-button-panel');

	// buttons
	ui.individual_button(button_panel.append('div'),
			     { key: keys.zoom_in,
			       text: "+",
			       classes: "simple-button",
			       tooltip: "Zoom in (Ctrl +)" });
	ui.individual_button(button_panel.append('div'),
			     { key: keys.zoom_out,
			       text: "–",
			       classes: "simple-button",
			       tooltip: "Zoom out (Ctrl -)" });
	ui.individual_button(button_panel.append('div'),
			     { key: keys.extent_canvas,
			       text: "↔",
			       classes: "simple-button",
			       tooltip: "Zoom to canvas (Ctrl 1)" });

    }

    function _toggle_direction_buttons(on_off) {
	if (on_off===undefined)
	    on_off = !this.direction_buttons.style('visibility')=='visible';
	this.direction_buttons.style('visibility', on_off ? 'visible' : 'hidden');
    }

    function _setup_status(selection, map) {
	var status_bar = selection.append("div").attr("id", "status");
	map.callback_manager.set('set_status', function(status) {
	    status_bar.text(status);
	});
	return status_bar;
    }

    function _setup_modes(map, brush, zoom_container) {
	// set up zoom+pan and brush modes
	var was_enabled = {};
	map.callback_manager.set('start_rotation', function() {
	    was_enabled.brush = brush.enabled;
	    brush.toggle(false);
	    was_enabled.zoom = zoom_container.zoom_on;
	    zoom_container.toggle_zoom(false);
	    was_enabled.selectable_click = map.behavior.selectable_click!=null;
	    map.behavior.toggle_selectable_click(false);
	});
	map.callback_manager.set('end_rotation', function() {
	    brush.toggle(was_enabled.brush);
	    zoom_container.toggle_zoom(was_enabled.zoom);
	    map.behavior.toggle_selectable_click(was_enabled.selectable_click);
	    was_enabled = {};
	});
    }

    function _get_keys(map, zoom_container, search_bar, settings_page, enable_editing) {
	var keys = {
            save: { key: 83, modifiers: { control: true }, // ctrl-s
		    target: map,
		    fn: map.save },
            save_svg: { key: 83, modifiers: { control: true, shift: true },
			target: map,
			fn: map.save_svg },
            load: { key: 79, modifiers: { control: true }, // ctrl-o
		    fn: null }, // defined by button
	    clear_map: { target: map,
			 fn: function() { this.clear_map(); }},
            load_model: { key: 77, modifiers: { control: true }, // ctrl-m
			  fn: null }, // defined by button
	    load_reaction_data: { fn: null }, // defined by button
	    clear_reaction_data: { target: map,
				   fn: function() { this.set_reaction_data(null); }},
	    load_metabolite_data: { fn: null }, // defined by button
	    clear_metabolite_data: { target: map,
				     fn: function() { this.set_metabolite_data(null); }},
	    zoom_in: { key: 187, modifiers: { control: true }, // ctrl +
		       target: zoom_container,
		       fn: zoom_container.zoom_in },
	    zoom_out: { key: 189, modifiers: { control: true }, // ctrl -
			target: zoom_container,
			fn: zoom_container.zoom_out },
	    extent_nodes: { key: 48, modifiers: { control: true }, // ctrl-0
			    target: map,
			    fn: map.zoom_extent_nodes },
	    extent_canvas: { key: 49, modifiers: { control: true }, // ctrl-1
			     target: map,
			     fn: map.zoom_extent_canvas },
	    search: { key: 70, modifiers: { control: true }, // ctrl-f
		      fn: search_bar.toggle.bind(search_bar, true) },
	    view_mode: { fn: this.view_mode.bind(this),
			 ignore_with_input: true }
	};
	if (enable_editing) {
	    utils.extend(keys, {
		build_mode: { key: 78, // n
			      target: this,
			      fn: this.build_mode,
			      ignore_with_input: true },
		zoom_mode: { key: 90, // z 
			     target: this,
			     fn: this.zoom_mode,
			     ignore_with_input: true },
		brush_mode: { key: 86, // v
			      target: this,
			      fn: this.brush_mode,
			      ignore_with_input: true },
		rotate_mode: { key: 82, // r
			       target: this,
			       fn: this.rotate_mode,
			       ignore_with_input: true },
		toggle_beziers: { key: 66,
				  target: map,
				  fn: map.toggle_beziers,
				  ignore_with_input: true  }, // b
		delete: { key: 8, modifiers: { control: true }, // ctrl-backspace
			  target: map,
			  fn: map.delete_selected,
			  ignore_with_input: true },
		delete_del: { key: 46, modifiers: { control: true }, // ctrl-del
			      target: map,
			      fn: map.delete_selected,
			      ignore_with_input: true },
		make_primary: { key: 80, // p
				target: map,
				fn: map.make_selected_node_primary,
				ignore_with_input: true },
		cycle_primary: { key: 67, // c
				 target: map,
				 fn: map.cycle_primary_node,
				 ignore_with_input: true },
		direction_arrow_right: { key: 39, // right
					 fn: this.reaction_input.direction_arrow.right
					 .bind(this.reaction_input.direction_arrow),
					 ignore_with_input: true },
		direction_arrow_down: { key: 40, // down
					fn: this.reaction_input.direction_arrow.down
					.bind(this.reaction_input.direction_arrow),
					ignore_with_input: true },
		direction_arrow_left: { key: 37, // left
					fn: this.reaction_input.direction_arrow.left
					.bind(this.reaction_input.direction_arrow),
					ignore_with_input: true },
		direction_arrow_up: { key: 38, // up
				      fn: this.reaction_input.direction_arrow.up
				      .bind(this.reaction_input.direction_arrow),
				      ignore_with_input: true },
		undo: { key: 90, modifiers: { control: true },
			target: map.undo_stack,
			fn: map.undo_stack.undo },
		redo: { key: 90, modifiers: { control: true, shift: true },
			target: map.undo_stack,
			fn: map.undo_stack.redo },
		select_none: { key: 65, modifiers: { control: true, shift: true }, // Ctrl Shift a
			       target: map,
			       fn: map.select_none },
		show_settings: { key: 188, modifiers: { control: true }, // Ctrl ,
				 fn: settings_page.toggle.bind(settings_page) }
	    });
	}
	return keys;
    }
});

define('DataMenu',["utils"], function(utils) {
    return function(options) {
        var o = utils.set_options(options, {
            selection: null,
            getdatafiles: null,
            datafiles: null,
            update_callback: null,
	    target: null});

	if (o.selection===null)
	    throw new Error('No selection provided for DataMenu');

        // setup dropdown menu
        // Append menu if it doesn't exist
        var menu = o.selection.select('.data-menu');
        if (menu.empty()) {
            menu = o.selection.append('div')
                .attr('class','data-menu');
        }
        var select_sel = menu.append('form')
            .append('select').attr('class','dropdown-menu');

        if (o.getdatafiles) {
            if (o.datafiles) {
                console.warn('DataMenu: getdatafiles option overrides datafiles');
            }
            d3.json(o.getdatafiles, function(error, d) {
                // returns json object:  { data: [file0, file1, ...] }
                if (error) {
                    return console.warn(error);
                } else {
                    load_with_files(o.target, d.data, select_sel, o.update_callback, o.selection);
                }
                return null;
            });
        } else if (o.datafiles) {
            load_with_files(o.target, o.datafiles, select_sel, o.update_callback, o.selection);
        } else {
            console.warn('DataMenu: No datafiles given');
        }

        return { update: update };

        // definitions
        function load_with_files(t, files, select_sel, update_callback, selection) {

            //when it changes
            select_sel.node().addEventListener("change", function() {
                load_datafile(t, this.value, selection, update_callback);
            }, false);

            var file = files[0];

            update(files, select_sel);
            load_datafile(t, file, selection, update_callback);
        };
        function load_datafile(t, this_file, selection, callback) {
            utils.load_the_file(t, this_file, function(error, data) {
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

define('main',["Builder", "Map", "Behavior", "KeyManager", "DataMenu", "UndoStack", "CobraModel", "utils", "SearchIndex", "Settings"],
       function(bu, mp, bh, km, dm, us, cm, ut, si, se) {
           return { Builder: bu,
		    Map: mp,
		    Behavior: bh,
		    KeyManager: km,
		    DataMenu: dm,
		    UndoStack: us,
		    CobraModel: cm,
		    utils: ut,
		    SearchIndex: si,
		    Settings: se };
       });

    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('main');
}));