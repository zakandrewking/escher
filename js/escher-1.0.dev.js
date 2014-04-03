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

define("almond", function(){});

define('lib/d3',[],function () {
    if (window.d3===undefined) console.error('d3 is not loaded.');
    return window.d3;
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

define('vis/utils',["lib/d3", "lib/vkbeautify"], function(d3, vkbeautify) {
    return { set_options: set_options,
             setup_svg: setup_svg,
	     resize_svg: resize_svg,
	     remove_child_nodes: remove_child_nodes,
             load_css: load_css,
             load_files: load_files,
             load_the_file: load_the_file,
	     scale_and_axes: scale_and_axes,
	     add_generic_axis: add_generic_axis,
	     make_class: make_class,
	     setup_defs: setup_defs,
	     draw_an_array: draw_an_array,
	     draw_an_object: draw_an_object,
	     make_array: make_array,
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
	     distance: distance,
	     check_undefined: check_undefined };

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
    };
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

    function draw_an_array(sel_parent_node, sel_children, array, 
			   create_function, update_function) {
	/** Run through the d3 data binding steps for an array.
	 */
	var sel = d3.select(sel_parent_node)
		.selectAll(sel_children)
		.data(array);
	// enter: generate and place reaction
	sel.enter().call(create_function);
	// update: update when necessary
	sel.call(update_function);
	// exit
	sel.exit().remove();
    }

    function draw_an_object(sel_parent_node, sel_children, object, 
			    id_key, create_function, update_function) {
	/** Run through the d3 data binding steps for an object.
	 */
	var sel = d3.select(sel_parent_node)
		.selectAll(sel_children)
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
        a.download = name+'.json'; // file name
        // xml = (new XMLSerializer()).serializeToString(d3.select(selection).node()); // convert node to xml string;
	var j = JSON.stringify(json);
        a.setAttribute("href-lang", "text/json");
        a.href = 'data:image/svg+xml;base64,' + utf8_to_b64(j); // create data uri
        // <a> constructed, simulate mouse click on it
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(ev);

        function utf8_to_b64(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        }
    }

    function load_json(f, callback, target) {
	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob))
	    callback.call(target, "The File APIs are not fully supported in this browser.", null);

	// The following is not a safe assumption.
	// if (!f.type.match("application/json"))
	//     callback.call(target, "Not a json file.", null);

	var reader = new window.FileReader();
	// Closure to capture the file information.
	reader.onload = function(event) {
	    var json = JSON.parse(event.target.result);
	    callback.call(target, null, json);
        };
	// Read in the image file as a data URL.
	reader.readAsText(f);
    }

    function export_svg(name, selection, do_beautify) {
        var a = document.createElement('a'), xml, ev;
        a.download = name+'.svg'; // file name
        xml = (new XMLSerializer()).serializeToString(d3.select(selection).node()); // convert node to xml string
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
        
        if (keyCode == 27) { //escape
            dropDownController.hide();
            txtHint.value = txtInput.value; // ensure that no hint is left.
            txtInput.focus(); 
            return; 
        }
        
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



define('builder/draw',["vis/utils", "lib/d3"], function(utils, d3) {
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

    function update_membrane(update_selection, scale) {
	utils.check_undefined(arguments, ['enter_selection', 'scale']);
        update_selection
            .attr("width", function(d){ return scale.x_size(d.width); })
            .attr("height", function(d){ return scale.y_size(d.height); })
            .attr("transform", function(d){return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";})
            .style("stroke-width", function(d) { return scale.size(10); })
            .attr('rx', function(d){ return scale.x_size(20); })
            .attr('ry', function(d){ return scale.x_size(20); });
    }

    function create_reaction(enter_selection) {
	utils.check_undefined(arguments, ['enter_selection']);
        // attributes for new reaction group

        var t = enter_selection.append('g')
                .attr('id', function(d) { return d.reaction_id; })
                .attr('class', 'reaction')
                .call(create_reaction_label);
        return;
    }

    function update_reaction(update_selection, scale, drawn_nodes, show_beziers,
			     arrow_displacement, defs, arrowheads,
			     default_reaction_color, has_flux, bezier_drag_behavior, label_drag_behavior) {
	utils.check_undefined(arguments,
			      ['update_selection', 'scale', 'drawn_nodes', 'show_beziers',
			       'arrow_displacement', 'defs', 'arrowheads',
			       'default_reaction_color', 'has_flux',
			       'bezier_drag_behavior', 'label_drag_behavior']);

        // update reaction label
        update_selection.select('.reaction-label')
            .call(function(sel) { return update_reaction_label(sel, scale, has_flux, label_drag_behavior); });

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
	    return update_segment(sel, scale, drawn_nodes, show_beziers, arrow_displacement, defs, arrowheads, 
				  default_reaction_color, has_flux, bezier_drag_behavior);

	});

        // old segments
        sel.exit().remove();
    }

    function create_reaction_label(sel) {
	utils.check_undefined(arguments, ['sel']);
        /* Draw reaction label for selection.
	 */
        sel.append('text')
            .attr('class', 'reaction-label label')
	    .style('cursor', 'default');
    }

    function update_reaction_label(sel, scale, has_flux, label_drag_behavior) {
	utils.check_undefined(arguments, ['sel', 'scale', 'has_flux', 'label_drag_behavior']);
	
	var decimal_format = d3.format('.4g');
	sel.text(function(d) { 
            var t = d.abbreviation;
            if (d.flux) t += " ("+decimal_format(d.flux)+")";
            else if (has_flux) t += " (0)";
            return t;
	}).attr('transform', function(d) {
            return 'translate('+scale.x(d.label_x)+','+scale.y(d.label_y)+')';
	}).style("font-size", function(d) {
	    return String(scale.size(30))+"px";
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
                .attr('id', function(d) { return d.segment_id; });

        // create reaction arrow
        g.append('path')
            .attr('class', 'segment');

	g.append('g')
	    .attr('class', 'beziers');
    }
    
    function update_segment(update_selection, scale, drawn_nodes, show_beziers, 
			    arrow_displacement, defs, arrowheads, default_reaction_color,
			    has_flux, bezier_drag_behavior) {
	utils.check_undefined(arguments, ['update_selection', 'scale', 'drawn_nodes',
					  'show_beziers', 'arrow_displacement', 'defs',
					  'arrowheads', 'default_reaction_color',
					  'has_flux', 'bezier_drag_behavior']);

        // update segment attributes
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
		if (start['node_type']=='metabolite') {
		    start = displaced_coords(arrow_displacement, start, b1, 'start');
		}
		if (end['node_type']=='metabolite') {
		    end = displaced_coords(arrow_displacement, b2, end, 'end');
		}
		if (d.b1==null || d.b2==null) {
		    return 'M'+scale.x(start.x)+','+scale.y(start.y)+' '+
			scale.x(end.x)+','+scale.y(end.y);
		} else {
		    return 'M'+scale.x(start.x)+','+scale.y(start.y)+
                        'C'+scale.x(b1.x)+','+scale.y(b1.y)+' '+
                        scale.x(b2.x)+','+scale.y(b2.y)+' '+
                        scale.x(end.x)+','+scale.y(end.y);
		}
            }) // TODO replace with d3.curve or equivalent
            .attr("marker-start", function (d) {
		var start = drawn_nodes[d.from_node_id];
		if (start['node_type']=='metabolite') {
		    var c = d.flux ? scale.flux_color(Math.abs(d.flux)) :
			    default_reaction_color;
		    // generate arrowhead for specific color
		    var arrow_id = generate_arrowhead_for_color(defs, arrowheads, c, false);
		    return "url(#" + arrow_id + ")";
		} else { return null; };
            })     
	    .attr("marker-end", function (d) {
		var end = drawn_nodes[d.to_node_id];
		if (end['node_type']=='metabolite') {
		    var c = d.flux ? scale.flux_color(Math.abs(d.flux)) :
			    default_reaction_color;
		    // generate arrowhead for specific color
		    var arrow_id = generate_arrowhead_for_color(defs, arrowheads, c, true);
		    return "url(#" + arrow_id + ")";
		} else { return null; };
            })
            .style('stroke', function(d) {
		if (has_flux) 
		    return d.flux ? scale.flux_color(Math.abs(d.flux)) : scale.flux_color(0);
		else
		    return default_reaction_color;
	    })
	    .style('stroke-width', function(d) {
		return d.flux ? scale.size(scale.flux(Math.abs(d.flux))) :
		    scale.size(scale.flux(1));
            });

	// new bezier points
	var bez = update_selection.select('.beziers')
		.selectAll('.bezier')
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
	bez.call(function(sel) { return update_bezier(sel, show_beziers, bezier_drag_behavior); });
	// remove
	bez.exit().remove();

	function create_bezier(enter_selection) {
	    utils.check_undefined(arguments, ['enter_selection']);

	    enter_selection.append('circle')
	    	.attr('class', function(d) { return 'bezier bezier'+d.bezier; })
	    	.style('stroke-width', String(scale.size(1))+'px')	
    		.attr('r', String(scale.size(5))+'px')
		.on("mouseover", function(d) {
		    d3.select(this).style('stroke-width', String(scale.size(3))+'px');
		})
		.on("mouseout", function(d) {
		    d3.select(this).style('stroke-width', String(scale.size(1))+'px');
		});
	}
	function update_bezier(update_selection, show_beziers, drag_behavior) {
	    utils.check_undefined(arguments, ['update_selection', 'show_beziers', 'drag_behavior']);
	    
	    update_selection
		.call(turn_off_drag)
		.call(drag_behavior);
	    if (show_beziers) {
	    	// draw bezier points
		update_selection
		    .attr('visibility', 'visible')
		    .attr('transform', function(d) {
	    		if (d.x==null || d.y==null) return ""; 
			return 'translate('+scale.x(d.x)+','+scale.y(d.y)+')';
		    });
	    } else {
	    	update_selection.attr('visibility', 'hidden');
	    }
	}
    }

    function create_node(enter_selection, scale, drawn_nodes, drawn_reactions) {
	utils.check_undefined(arguments,
			      ['enter_selection', 'scale', 'drawn_nodes',
			       'drawn_reactions']);

        // create nodes
        var g = enter_selection
                .append('g')
                .attr('class', 'node')
                .attr('id', function(d) { return d.node_id; });

        // create metabolite circle and label
        g.append('circle')
	    .attr('class', function(d) {
		if (d.node_type=='metabolite') return 'node-circle metabolite-circle';
		else return 'node-circle';
	    })		
            .style('stroke-width', String(scale.size(2))+'px')
	    .on("mouseover", function(d) {
		d3.select(this).style('stroke-width', String(scale.size(3))+'px');
	    })
	    .on("mouseout", function(d) {
		d3.select(this).style('stroke-width', String(scale.size(2))+'px');
	    });

        g.filter(function(d) { return d.node_type=='metabolite'; })
	    .append('text')
	    .attr('class', 'node-label label')
	    .style('cursor', 'default');
    }

    function update_node(update_selection, scale, has_node_data, node_data_style,
			 click_fn, drag_behavior, label_drag_behavior) {
	utils.check_undefined(arguments,
			      ['update_selection', 'scale', 'has_node_data',
			       'node_data_style', 'click_fn',
			       'drag_behavior', 'label_drag_behavior']);

        // update circle and label location
        var mg = update_selection
                .select('.node-circle')
                .attr('transform', function(d) {
                    return 'translate('+scale.x(d.x)+','+scale.y(d.y)+')';
                })
		.attr('r', function(d) {
		    if (d.node_type == 'metabolite') {
			if (has_node_data && node_data_style.indexOf('Size')!==1) {
			    return scale.size(scale.node_size(d.data));
			} else {
			    return scale.size(d.node_is_primary ? 15 : 10); 
			}
		    } else {
			return scale.size(5);
		    }
		})
		.style('fill', function(d) {
		    if (d.node_type=='metabolite') {
			if (has_node_data && node_data_style.indexOf('Color')!==1) {
			    return scale.node_color(d.data);
			} else {
			    return 'rgb(224, 134, 91)';
			}
		    }
		})
		.call(turn_off_drag)
		.call(drag_behavior)
		.on("click", click_fn);

        update_selection
            .select('.node-label')
            .attr('transform', function(d) {
                return 'translate('+scale.x(d.label_x)+','+scale.y(d.label_y)+')';
            })
            .style("font-size", function(d) {
		return String(scale.size(20))+"px";
            })
            .text(function(d) {	
		var decimal_format = d3.format('.4g');
		var t = d.bigg_id_compartmentalized;
		if (d.data) t += " ("+decimal_format(d.data)+")";
		else if (has_node_data) t += " (0)";
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

    function update_text_label(update_selection, scale, label_click, label_drag_behavior) {
	utils.check_undefined(arguments, ['update_selection', 'scale', 'label_click', 'label_drag_behavior']);

        update_selection
            .attr("transform", function(d) { return "translate("+scale.x(d.x)+","+scale.y(d.y)+")";})
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

    function generate_arrowhead_for_color(defs, arrowheads_generated, color, is_end) {
	utils.check_undefined(arguments, ['defs', 'arrowheads_generated', 'color', 'is_end']);

	var pref = is_end ? 'start-' : 'end-';

        var id = String(color).replace('#', pref);
        if (arrowheads_generated.indexOf(id) < 0) {
            arrowheads_generated.push(id);

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

});

define('builder/build',["vis/utils", "lib/d3"], function(utils, d3) {
    return { new_reaction: new_reaction,
	     rotate_nodes: rotate_nodes,
	     move_node_and_dependents: move_node_and_dependents };
    
    // definitions
    function new_reaction(reaction_abbreviation, cobra_reaction,
			  selected_node_id, selected_node,
			  largest_ids, cofactors, angle) {
        /** New reaction.

	 angle: clockwise from 'right', in degrees

	 */
	
	// rotate the new reaction around the selected metabolite
	// convert to radians
	angle = Math.PI / 180 * angle; // default angle

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
	var label_d = { x: 30, y: 10 };

	// relative anchor node distance
	var anchor_distance = 20;

	// new reaction structure
	var direction = cobra_reaction.reversibility ? 'Reversible' : 'Irreversible',
	    new_reaction = { abbreviation: reaction_abbreviation,
			     direction: direction,
			     label_x: center.x + label_d.x,
			     label_y: center.y + label_d.y,
			     name: cobra_reaction.name,
			     segments: {} };	

        // set primary metabolites and count reactants/products

	// look for the selected metabolite, and record the indices
	var reactant_ranks = [], product_ranks = [], 
            reactant_count = 0, product_count = 0,
	    reaction_is_reversed = false;
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
	    if (metabolite.coefficient < 0) {
                metabolite.index = reactant_count;
		// score the metabolites. Infinity == selected, >= 1 == carbon containing
		var carbons = /C([0-9]+)/.exec(metabolite.formula);
		if (selected_node.bigg_id_compartmentalized==metabolite.bigg_id_compartmentalized) {
		    reactant_ranks.push([metabolite.index, Infinity]);
		} else if (carbons && cofactors.indexOf(metabolite.bigg_id)==-1) {
		    reactant_ranks.push([metabolite.index, parseInt(carbons[1])]);
		}
                reactant_count++;
	    } else {
                metabolite.index = product_count;
		var carbons = /C([0-9]+)/.exec(metabolite.formula);
		if (selected_node.bigg_id_compartmentalized==metabolite.bigg_id_compartmentalized) {
		    product_ranks.push([metabolite.index, Infinity]);
		    reaction_is_reversed = true;
		} else if (carbons && cofactors.indexOf(metabolite.bigg_id)==-1) {
		    product_ranks.push([metabolite.index, parseInt(carbons[1])]);
		}
                product_count++;
	    }
	}

	// get the rank with the highest score
	var max_rank = function(old, current) { return current[1] > old[1] ? current : old; },
            primary_reactant_index = reactant_ranks.reduce(max_rank, [0,0])[0],
            primary_product_index = product_ranks.reduce(max_rank, [0,0])[0];

	// set primary metabolites, and keep track of the total counts
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            var metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
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
	    var new_id = String(++largest_ids.nodes);
	    new_anchors[new_id] = { node_type: n.node_type,
				    x: center.x + n.dis.x,
				    y: center.y + n.dis.y,
				    connected_segments: [] };
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
						       to_node_id: to_id };
	    new_anchors[from_id].connected_segments.push({ segment_id: new_segment_id,
							   reaction_id: new_reaction_id });
	    new_anchors[to_id].connected_segments.push({ segment_id: new_segment_id,
							 reaction_id: new_reaction_id });
	});

        // Add the metabolites, keeping track of total reactants and products.
	var new_nodes = new_anchors;
        for (var metabolite_abbreviation in cobra_reaction.metabolites) {
            metabolite = cobra_reaction.metabolites[metabolite_abbreviation];
            var primary_index, from_node_id;
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
	    if (metabolite.bigg_id_compartmentalized==
		selected_node.bigg_id_compartmentalized) {
		var new_segment_id = String(++largest_ids.segments);
		new_reaction.segments[new_segment_id] = { from_node_id: from_node_id,
							  to_node_id: selected_node_id,
							  b1: met_loc.b1,
							  b2: met_loc.b2 };
		// update the existing node
		selected_node.connected_segments.push({ segment_id: new_segment_id,
							reaction_id: new_reaction_id });
		new_nodes[from_node_id].connected_segments.push({ segment_id: new_segment_id,
								  reaction_id: new_reaction_id });
	    } else {
		// save new metabolite
		var new_segment_id = String(++largest_ids.segments),
		    new_node_id = String(++largest_ids.nodes);
		new_reaction.segments[new_segment_id] = { from_node_id: from_node_id,
							  to_node_id: new_node_id,
							  b1: met_loc.b1,
							  b2: met_loc.b2 };
		// save new node
		new_nodes[new_node_id] = { connected_segments: [{ segment_id: new_segment_id,
								  reaction_id: new_reaction_id }],
					   x: met_loc.circle.x,
					   y: met_loc.circle.y,
					   node_is_primary: metabolite.is_primary,
					   compartment_name: metabolite.compartment,
					   label_x: met_loc.circle.x + label_d.x,
					   label_y: met_loc.circle.y + label_d.y,
					   metabolite_name: metabolite.name,
					   bigg_id: metabolite.bigg_id,
					   bigg_id_compartmentalized: metabolite.bigg_id_compartmentalized,
					   node_type: 'metabolite' };
		new_nodes[from_node_id].connected_segments.push({ segment_id: new_segment_id,
								  reaction_id: new_reaction_id });
	    }
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
		if (node.node_type == 'center') {
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

define('builder/Behavior',["vis/utils", "lib/d3", "builder/build"], function(utils, d3, build) {
    /** Defines the set of click and drag behaviors for the map, and keeps track
     of which behaviors are activated.

     Has the following attributes:

     Behavior.node_click
     Behavior.node_drag
     Behavior.bezier_drag
     Behavior.label_drag
     */

    var Behavior = utils.make_class();
    Behavior.prototype = { init: init,
			   turn_everything_on: turn_everything_on,
			   turn_everything_off: turn_everything_off,
			   toggle_node_click: toggle_node_click,
			   toggle_node_drag: toggle_node_drag,
			   toggle_text_label_click: toggle_text_label_click,
			   toggle_label_drag: toggle_label_drag,
			   get_node_drag: get_node_drag,
			   get_bezier_drag: get_bezier_drag,
			   get_reaction_label_drag: get_reaction_label_drag,
			   get_node_label_drag: get_node_label_drag,
			   get_text_label_drag: get_text_label_drag,
			   get_generic_drag: get_generic_drag };

    return Behavior;

    // definitions
    function init(map, undo_stack) {
	this.map = map;
	this.undo_stack = undo_stack;

	// make an empty function that can be called as a behavior and does nothing
	this.empty_behavior = function() {};

	// init empty
	this.node_click = null;
	this.node_drag = this.empty_behavior;
	this.bezier_drag = this.empty_behavior;
	this.reaction_label_drag = this.empty_behavior;
	this.node_label_drag = this.empty_behavior;
	this.text_label_click = null;
	this.text_label_drag = this.empty_behavior;
	this.turn_everything_on();
    }
    function turn_everything_on() {
	this.toggle_node_click(true);
	this.toggle_node_drag(true);
	this.toggle_text_label_click(true);
	this.toggle_label_drag(true);
    }
    function turn_everything_off() {
	this.toggle_node_click(false);
	this.toggle_node_drag(false);
	this.toggle_text_label_click(false);
	this.toggle_label_drag(false);
    }
    function toggle_node_click(on_off) {
	/** With no argument, toggle the node click on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.node_click==null;
	if (on_off) {
	    var map = this.map;
	    this.node_click = function(d) {
		map.select_metabolite(this, d);
		d3.event.stopPropagation();
	    };
	} else {
	    this.node_click = null;
	}
    }
    function toggle_text_label_click(on_off) {
	/** With no argument, toggle the node click on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.text_label_click==null;
	if (on_off) {
	    var map = this.map;
	    this.text_label_click = function(d) {
		map.select_text_label(this, d);
		d3.event.stopPropagation();
	    };
	} else {
	    this.text_label_click = null;
	}
    }
    function toggle_node_drag(on_off) {
	/** With no argument, toggle the node drag & bezier drag on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.node_drag===this.empty_behavior;
	if (on_off) {
	    this.node_drag = this.get_node_drag(this.map, this.undo_stack);
	    this.bezier_drag = this.get_bezier_drag(this.map, this.undo_stack);
	} else {
	    this.node_drag = this.empty_behavior;
	}
    }
    function toggle_label_drag(on_off) {
	/** With no argument, toggle the label drag on or off.

	 Pass in a boolean argument to set the on/off state.

	 */
	if (on_off===undefined) on_off = this.label_drag===this.empty_behavior;
	if (on_off) {
	    this.reaction_label_drag = this.get_reaction_label_drag(this.map, this.scale);
	    this.node_label_drag = this.get_node_label_drag(this.map, this.scale);
	    this.text_label_drag = this.get_text_label_drag(this.map, this.scale);
	} else {
	    this.reaction_label_drag = this.empty_behavior;
	    this.node_label_drag = this.empty_behavior;
	    this.text_label_drag = this.empty_behavior;
	}
    }

    function get_node_drag(map, undo_stack) {
	// define some variables
	var behavior = d3.behavior.drag(),
	    total_displacement,
	    nodes_to_drag,
	    reaction_ids,
	    the_timeout;

        behavior.on("dragstart", function () { 
	    // Note that dragstart is called even for a click event
	    var data = this.parentNode.__data__,
		bigg_id_compartmentalized = data.bigg_id_compartmentalized,
		node_group = this.parentNode;
	    // silence other listeners
	    d3.event.sourceEvent.stopPropagation();
	    // remember the total displacement for later
	    total_displacement = {};
	    // Move element to back (for the next step to work). Wait 200ms
	    // before making the move, becuase otherwise the element will be
	    // deleted before the click event gets called, and selection
	    // will stop working.
	    the_timeout = window.setTimeout(function() {
		node_group.parentNode.insertBefore(node_group,node_group.parentNode.firstChild);
	    }, 200);
	    // prepare to combine metabolites
	    d3.selectAll('.metabolite-circle')
		.on('mouseover.combine', function(d) {
		    if (d.bigg_id_compartmentalized==bigg_id_compartmentalized &&
			d.node_id!=data.node_id) {
			d3.select(this).style('stroke-width', String(map.scale.size(12))+'px')
			    .classed('node-to-combine', true);
		    }
		}).on('mouseout.combine', function(d) {
		    if (d.bigg_id_compartmentalized==bigg_id_compartmentalized &&
			d.node_id!==data.node_id) {
			d3.select(this).style('stroke-width', String(map.scale.size(2))+'px')
			    .classed('node-to-combine', false);
		    }
		});
	});
        behavior.on("drag", function() {
	    var grabbed_id = this.parentNode.__data__.node_id, 
		selected_ids = map.get_selected_node_ids();
	    nodes_to_drag = [];
	    // choose the nodes to drag
	    if (selected_ids.indexOf(grabbed_id)==-1) { 
		nodes_to_drag.push(grabbed_id);
	    } else {
		nodes_to_drag = selected_ids;
	    }
	    reaction_ids = [];
	    nodes_to_drag.forEach(function(node_id) {
		// update data
		var node = map.nodes[node_id],
		    displacement = { x: map.scale.x_size.invert(d3.event.dx),
				     y: map.scale.y_size.invert(d3.event.dy) },
		    updated = build.move_node_and_dependents(node, node_id, map.reactions, displacement);
		reaction_ids = utils.unique_concat([reaction_ids, updated.reaction_ids]);
		// remember the displacements
		if (!(node_id in total_displacement))  total_displacement[node_id] = { x: 0, y: 0 };
		total_displacement[node_id] = utils.c_plus_c(total_displacement[node_id], displacement);
	    });
	    // draw
	    map.draw_these_nodes(nodes_to_drag);
	    map.draw_these_reactions(reaction_ids);
	});
	behavior.on("dragend", function() {	
	    // look for mets to combine
	    var node_to_combine_array = [];
	    d3.selectAll('.node-to-combine').each(function(d) {
		node_to_combine_array.push(d.node_id);
	    });
	    if (node_to_combine_array.length==1) {
		// If a node is ready for it, combine nodes
		var fixed_node_id = node_to_combine_array[0],
		    dragged_node_id = this.parentNode.__data__.node_id,
		    saved_dragged_node = utils.clone(map.nodes[dragged_node_id]),
		    segment_objs_moved_to_combine = combine_nodes_and_draw(fixed_node_id, dragged_node_id);
		undo_stack.push(function() {
		    // undo
		    // put the old node back
		    map.nodes[dragged_node_id] = saved_dragged_node;
		    var fixed_node = map.nodes[fixed_node_id],
			updated_reactions = [];
		    segment_objs_moved_to_combine.forEach(function(segment_obj) {
			var segment = map.reactions[segment_obj.reaction_id].segments[segment_obj.segment_id];
			if (segment.from_node_id==fixed_node_id) segment.from_node_id = dragged_node_id;
			else if (segment.to_node_id==fixed_node_id) segment.to_node_id = dragged_node_id;
			else console.error('Segment does not connect to fixed node');
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
		    saved_node_ids = utils.clone(nodes_to_drag),
		    saved_reaction_ids = utils.clone(reaction_ids);
		undo_stack.push(function() {
		    // undo
		    saved_node_ids.forEach(function(node_id) {
			var node = map.nodes[node_id];
			build.move_node_and_dependents(node, node_id, map.reactions,
						       utils.c_times_scalar(saved_displacement[node_id], -1));
		    });
		    map.draw_these_nodes(saved_node_ids);
		    map.draw_these_reactions(saved_reaction_ids);
		}, function () {
		    // redo
		    saved_node_ids.forEach(function(node_id) {
			var node = map.nodes[node_id];
			build.move_node_and_dependents(node, node_id, map.reactions, saved_displacement[node_id]);
		    });
		    map.draw_these_nodes(saved_node_ids);
		    map.draw_these_reactions(saved_reaction_ids);
		});
	    }

	    // stop combining metabolites
	    d3.selectAll('.metabolite-circle')
		.on('mouseover.combine', null)
		.on('mouseout.combine', null);

	    // clear the timeout
	    window.clearTimeout(the_timeout);
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
	    });
	    // delete the old node
	    var to_delete = {};
	    to_delete[dragged_node_id] = dragged_node;
	    map.delete_node_data(to_delete);
	    // turn off the class
	    d3.selectAll('.node-to-combine').classed('node-to-combine', false);
	    // draw
	    map.draw_everything();
	    // return for undo
	    return updated_segment_objs;
	}
    }
    function get_bezier_drag(map, undo_stack) {
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
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn);
    }
    function get_reaction_label_drag(map, undo_stack) {
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
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn);
    }
    function get_node_label_drag(map, undo_stack) {
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
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn);
    }
    function get_text_label_drag(map, undo_stack) {
	var move_label = function(text_label_id, displacement) {
	    var text_label = map.text_labels[text_label_id];
	    text_label.x = text_label.x + displacement.x;
	    text_label.y = text_label.y + displacement.y;
	},
	    start_fn = function(d) {
	    },
	    drag_fn = function(d, displacement, total_displacement) {
		// draw
		move_label(d.text_label_id, displacement);
		map.draw_these_text_labels([d.text_label_id]);
	    },
	    end_fn = function(d) {
	    },
	    undo_fn = function(d, displacement) {
		move_label(d.text_label_id, utils.c_times_scalar(displacement, -1));
		map.draw_these_text_labels([d.text_label_id]);
	    },
	    redo_fn = function(d, displacement) {
		move_label(d.text_label_id, displacement);
		map.draw_these_text_labels([d.text_label_id]);
	    };
	return this.get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn);
    }
    function get_generic_drag(start_fn, drag_fn, end_fn, undo_fn, redo_fn) {
	/** Make a generic drag behavior, with undo/redo.

	 start_fn: function(d) Called at dragstart.

	 drag_fn: function(d, displacement, total_displacement) Called during
	 drag.

	 end_fn

	 undo_fn

	 redo_fn

	 */
	 
	// define some variables
	var behavior = d3.behavior.drag(),
	    total_displacement,
	    scale = this.map.scale,
	    undo_stack = this.undo_stack;

        behavior.on("dragstart", function (d) {
	    // silence other listeners
	    d3.event.sourceEvent.stopPropagation();
	    total_displacement = { x: 0, y: 0 };
	    start_fn(d);
	});
        behavior.on("drag", function(d) {
	    // update data
	    var displacement = { x: scale.x_size.invert(d3.event.dx),
				 y: scale.y_size.invert(d3.event.dy) };
	    // remember the displacement
	    total_displacement = utils.c_plus_c(total_displacement, displacement);
	    drag_fn(d, displacement, total_displacement);
	});
	behavior.on("dragend", function(d) {			  
	    // add to undo/redo stack
	    // remember the displacement, dragged nodes, and reactions
	    var saved_d = utils.clone(d),
		saved_displacement = utils.clone(total_displacement); // BUG TODO this variable disappears!
	    undo_stack.push(function() {
		// undo
		undo_fn(saved_d, saved_displacement);
	    }, function () {
		// redo
		redo_fn(saved_d, saved_displacement);
	    });
	    end_fn(d);
	});
	return behavior;
    }
});

define('builder/Scale',["vis/utils", "lib/d3"], function(utils, d3) {
    /** 
     */

    var Scale = utils.make_class();
    Scale.prototype = { init: init };

    return Scale;

    // definitions
    function init(map_w, map_h, w, h, options) {
	var sc = utils.set_options(options, 
				      { flux_color: d3.scale.linear()
					.domain([0, 0.000001, 1, 8, 50])
					.range(["rgb(200,200,200)", "rgb(190,190,255)", 
						"rgb(100,100,255)", "blue", "red"])});

        var factor = Math.min(w/map_w, h/map_h);
        sc.x = d3.scale.linear()
            .domain([0, map_w])
            .range([(w - map_w*factor)/2, map_w*factor + (w - map_w*factor)/2]),
        sc.y = d3.scale.linear()
            .domain([0, map_h])
            .range([(h - map_h*factor)/2, map_h*factor + (h - map_h*factor)/2]),
        sc.x_size = d3.scale.linear()
            .domain([0, map_w])
            .range([0, map_w*factor]),
        sc.y_size = d3.scale.linear()
            .domain([0, map_h])
            .range([0, map_h*factor]),
        sc.size = d3.scale.linear()
            .domain([0, 1])
            .range([0, factor]),
        sc.flux = d3.scale.linear()
            .domain([0, 40])
            .range([6, 6]),
        sc.flux_fill = d3.scale.linear()
            .domain([0, 40, 200])
            .range([1, 1, 1]),
	sc.node_size = d3.scale.linear()
	    .range([5,25]),
	sc.node_color = d3.scale.linear()
	    .range(["white", "red"]),
        sc.metabolite_concentration = d3.scale.linear()
            .domain([0, 10])
            .range([15, 200]),
        sc.metabolite_color = d3.scale.linear()
            .domain([0, 1.2])
            .range(["#FEF0D9", "#B30000"]);
        sc.scale_path = function(path) {
            var x_fn = sc.x, y_fn = sc.y;
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
        sc.scale_decimals = function(path, scale_fn, precision) {
            var str = d3.format("."+String(precision)+"f");
            path = path.replace(/([0-9.]+)/g, function (match, p1) {
                return str(scale_fn(parseFloat(p1)));
            });
            return path;
        };

	// assign sc to this
	var keys = window.Object.keys(sc), i = -1;
        while (++i < keys.length) this[keys[i]] = sc[keys[i]];
    }
});

define('builder/DirectionArrow',["vis/utils", "lib/d3"], function(utils, d3) {
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
	    .attr('transform', 'translate(2,0)scale(0.15)');

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

define('builder/UndoStack',["vis/utils"], function(utils) {
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

define('vis/CallbackManager',["vis/utils"], function(utils) {
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

define('builder/KeyManager',["vis/utils", "lib/d3"], function(utils, d3) {
    /** 
     */

    var KeyManager = utils.make_class();
    // static methods
    KeyManager.reset_held_keys = reset_held_keys;
    // instance methods
    KeyManager.prototype = { init: init,
			     update: update,
			     add_escape_listener: add_escape_listener };

    return KeyManager;

    // static methods
    function reset_held_keys(h) {
        h.command = false;
	h.control = false;
	h.option = false;
	h.shift = false;
    }
    // instance methods
    function init(assigned_keys, reaction_input) {
	/** Assign keys for commands.

	 */

	if (assigned_keys===undefined) assigned_keys = {};
	if (reaction_input===undefined) reaction_input = null;

	this.assigned_keys = assigned_keys;
	this.held_keys = {};
	reset_held_keys(this.held_keys);

	this.update();
    }

    function update() {
	var held_keys = this.held_keys,
	    keys = this.assigned_keys;

        var modifier_keys = { command: 91,
                              control: 17,
                              option: 18,
                              shift: 16 };

        d3.select(window).on("keydown.key_manager", null);
        d3.select(window).on("keyup.key_manager", null);

        d3.select(window).on("keydown.key_manager", function() {
            var kc = d3.event.keyCode,
                reaction_input_visible = this.reaction_input ?
		    this.reaction_input.is_visible : false,
		meaningless = true;
            toggle_modifiers(modifier_keys, held_keys, kc, true);
	    for (var key_id in keys) {
		var assigned_key = keys[key_id];
		if (check_key(assigned_key, kc, held_keys)) {
		    meaningless = false;
		    if (!(assigned_key.ignore_with_input && reaction_input_visible)) {
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
        }).on("keyup.key_manager", function() {
            toggle_modifiers(modifier_keys, held_keys,
			     d3.event.keyCode, false);
        });
        function toggle_modifiers(mod, held, kc, on_off) {
            for (var k in mod)
                if (mod[k] == kc)
                    held[k] = on_off;
        }
        function check_key(key, pressed, held) {
            if (key.key != pressed) return false;
            var mod = key.modifiers;
            if (mod === undefined)
                mod = { control: false,
                        command: false,
                        option: false,
                        shift: false };
            for (var k in held) {
                if (mod[k] === undefined) mod[k] = false;
                if (mod[k] != held[k]) return false;
            }
            return true;
        }
    }
    function add_escape_listener(callback) {
	/** Call the callback when the escape key is pressed, then
	 unregisters the listener.

	 */
	var selection = d3.select(window);
	selection.on('keydown.esc', function() {
	    if (d3.event.keyCode==27) { // esc
		callback();
		selection.on('keydown.esc', null);
	    }
	});
	return { clear: function() { selection.on('keydown.esc', null); } };
    }
});

define('builder/Canvas',["vis/utils", "lib/d3"], function(utils, d3) {
    /** Defines a canvas that accepts drag/zoom events and can be resized.

     Canvas(selection, x, y, width, height)

     Adapted from http://bl.ocks.org/mccannf/1629464.

     */

    var Canvas = utils.make_class();
    Canvas.prototype = { init: init,
			 setup: setup,
			 size_and_location: size_and_location };

    return Canvas;

    function init(selection, size_and_location) {
	this.selection = selection;
	this.x = size_and_location.x;
	this.y = size_and_location.y;
	this.width = size_and_location.width;
	this.height = size_and_location.height;

	this.setup();
    }

    function setup() {	
	var self = this,
	    extent = {"x": this.width, "y": this.height},
	    dragbar_width = 20,
	    new_sel = this.selection.append('g')
		.classed('canvas-group', true)
		.data([{x: this.x, y: this.y}]);
	
	var rect = new_sel.append('rect')
		.attr('id', 'mouse-node')
		.attr("width", this.width)
		.attr("height", this.height)
		.attr("transform", "translate("+[self.x, self.y]+")")
		.attr('class', 'canvas')
		.attr('pointer-events', 'all');

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
		.attr("x", function(d) { return d.x - (dragbar_width/2); })
		.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("height", this.height - dragbar_width)
		.attr("id", "dragleft")
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_left);
	
	var right = new_sel.append("rect")
		.attr("x", function(d) { return d.x + self.width - (dragbar_width/2); })
		.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("id", "dragright")
		.attr("height", this.height - dragbar_width)
		.attr("width", dragbar_width)
		.attr("cursor", "ew-resize")
		.classed('resize-rect', true)
		.call(drag_right);
	
	var top = new_sel.append("rect")
		.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("y", function(d) { return d.y - (dragbar_width/2); })
		.attr("height", dragbar_width)
		.attr("id", "dragleft")
		.attr("width", this.width - dragbar_width)
		.attr("cursor", "ns-resize")
		.classed('resize-rect', true)
		.call(drag_top);
	
	var bottom = new_sel.append("rect")
		.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("y", function(d) { return d.y + self.height - (dragbar_width/2); })
		.attr("id", "dragright")
		.attr("height", dragbar_width)
		.attr("width", this.width - dragbar_width)
		.attr("cursor", "ns-resize")
		.classed('resize-rect', true)
		.call(drag_bottom);
	
	// definitions
	function stop_propagation() {
	    d3.event.sourceEvent.stopPropagation();
	}
	function ldragresize(d) {
	    var oldx = d.x; 
	    //Max x on the right is x + width - dragbar_width
	    //Max x on the left is 0 - (dragbar_width/2)
	    d.x = Math.min(d.x + self.width - (dragbar_width / 2), d3.event.x);
	    self.x = d.x;
	    self.width = self.width + (oldx - d.x);
	    left.attr("x", function(d) { return d.x - (dragbar_width / 2); });	    
	    rect.attr("x", function(d) { return d.x; }).attr("width", self.width);
	    top.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("width", self.width - dragbar_width);
	    bottom.attr("x", function(d) { return d.x + (dragbar_width/2); })
		.attr("width", self.width - dragbar_width);
	}

	function rdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    //Max x on the left is x - width 
	    //Max x on the right is width of screen + (dragbar_width/2)
	    var dragx = Math.max(d.x + (dragbar_width/2), d.x + self.width + d3.event.dx);
	    //recalculate width
	    self.width = dragx - d.x;
	    //move the right drag handle
	    right.attr("x", function(d) { return dragx - (dragbar_width/2); });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    rect.attr("width", self.width);
	    top.attr("width", self.width - dragbar_width);
	    bottom.attr("width", self.width - dragbar_width);
	}

	function tdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();	    
	    var oldy = d.y; 
	    //Max x on the right is x + width - dragbar_width
	    //Max x on the left is 0 - (dragbar_width/2)
	    d.y = Math.min(d.y + self.height - (dragbar_width / 2), d3.event.y);
	    self.y = d.y;
	    self.height = self.height + (oldy - d.y);
	    top.attr("y", function(d) { return d.y - (dragbar_width / 2); });	    
	    rect.attr("y", function(d) { return d.y; })
		.attr("height", self.height);
	    left.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("height", self.height - dragbar_width);
	    right.attr("y", function(d) { return d.y + (dragbar_width/2); })
		.attr("height", self.height - dragbar_width);
	}

	function bdragresize(d) {
	    d3.event.sourceEvent.stopPropagation();
	    //Max x on the left is x - width 
	    //Max x on the right is width of screen + (dragbar_width/2)
	    var dragy = Math.max(d.y + (dragbar_width/2), d.y + self.height + d3.event.dy);
	    //recalculate width
	    self.height = dragy - d.y;
	    //move the right drag handle
	    bottom.attr("y", function(d) { return dragy - (dragbar_width/2); });
	    //resize the drag rectangle
	    //as we are only resizing from the right, the x coordinate does not need to change
	    rect.attr("height", self.height);
	    left.attr("height", self.height - dragbar_width);
	    right.attr("height", self.height - dragbar_width);
	}
    }

    function size_and_location() {
	return { x: this.x,
		 y: this.y,
		 width: this.width,
		 height: this.height };
    }
});

define('builder/Map',["vis/utils", "lib/d3", "builder/draw", "builder/Behavior", "builder/Scale", "builder/DirectionArrow", "builder/build", "builder/UndoStack", "vis/CallbackManager", "builder/KeyManager", "builder/Canvas"], function(utils, d3, draw, Behavior, Scale, DirectionArrow, build, UndoStack, CallbackManager, KeyManager, Canvas) {
    /** Defines the metabolic map data, and manages drawing and building.

     Map(selection, defs, zoom_container, height, width, flux, node_data, cobra_model)

     selection: A d3 selection for a node to place the map inside. Should be an SVG element.

     behavior: A Behavior object which defines the interactivity of the map.

     */

    var Map = utils.make_class();
    // static methods
    Map.from_data = from_data;
    // instance methods
    Map.prototype = {
	// setup
	init: init,
	setup_containers: setup_containers,
	reset_containers: reset_containers,
	// appearance
	set_status: set_status,
	set_flux: set_flux,
	set_node_data: set_node_data,
	// selection
	select_metabolite: select_metabolite,
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
	rotate_selected_nodes: rotate_selected_nodes,
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
	has_flux: has_flux,
	has_node_data: has_node_data,
	draw_everything: draw_everything,
	draw_all_reactions: draw_all_reactions,
	draw_these_reactions: draw_these_reactions,
	draw_all_nodes: draw_all_nodes,
	draw_these_nodes: draw_these_nodes,
	draw_these_text_labels: draw_these_text_labels,
	apply_flux_to_map: apply_flux_to_map,
	apply_flux_to_reactions: apply_flux_to_reactions,
	apply_node_data_to_map: apply_node_data_to_map,
	apply_node_data_to_nodes: apply_node_data_to_nodes,
	get_selected_node_ids: get_selected_node_ids,
	toggle_beziers: toggle_beziers,
	hide_beziers: hide_beziers,
	show_beziers: show_beziers,
	zoom_extent: zoom_extent,
	// io
	save: save,
	map_for_export: map_for_export,
	save_svg: save_svg
    };

    return Map;

    function init(selection, defs, zoom_container, height, width, flux, node_data, node_data_style,
		  cobra_model, canvas_size_and_loc) {
	if (canvas_size_and_loc===undefined) canvas_size_and_loc = {x:0, y:0, width:width, height: height};
	utils.check_undefined(arguments, ['selection', 'defs', 'zoom_container', 'height', 'width', 'flux',
					  'node_data', 'node_data_style', 'cobra_model', 'canvas_size_and_loc']);
	// TODO make these inputs optional when possible

	// defaults
	var default_angle = 90; // degrees
	this.reaction_arrow_displacement = 35;
	this.default_reaction_color = '#505050',

	// make the canvas
	this.canvas = new Canvas(selection, canvas_size_and_loc);

	this.setup_containers(selection);
	this.sel = selection;
	this.defs = defs;
	this.zoom_container = zoom_container;
	this.height = height;
	this.width = width;

	this.flux = flux;
	this.node_data = node_data;
	this.node_data_style = node_data_style;
	this.cobra_model = cobra_model;

	this.map_info = { max_map_w: width * 10, max_map_h: height * 10 };
	this.map_info.largest_ids = { reactions: -1,
				      nodes: -1,
				      segments: -1 };

	// make the scale
	this.scale = new Scale(this.map_info.max_map_w, this.map_info.max_map_h,
			       width, height);

	// make the undo/redo stack
	this.undo_stack = new UndoStack();

	// make a behavior object
	this.behavior = new Behavior(this, this.undo_stack);

	// make a key manager
	this.key_manager = new KeyManager();

	// deal with the window
	var window_translate = {'x': 0, 'y': 0},
	    window_scale = 1;

	// hide beziers
	this.beziers_enabled = false;

	// set up the reaction direction arrow
	this.direction_arrow = new DirectionArrow(selection);
	this.direction_arrow.set_rotation(default_angle);

	// set up the callbacks
	this.callback_manager = new CallbackManager();

	// these will be filled
	this.arrowheads_generated = [];
	
	this.nodes = {};
	this.reactions = {};
	this.membranes = [];
	this.text_labels = {};
	this.info = {};

	// performs some extra checks
	this.debug = false;
    };

    // -------------------------------------------------------------------------
    // Import

    function from_data(map_data, selection, defs, zoom_container, height, width, flux,
		       node_data, node_data_style, cobra_model) {
	utils.check_undefined(arguments, ['map_data', 'selection', 'defs', 'zoom_container', 'height', 'width', 'flux',
					  'node_data', 'node_data_style', 'cobra_model']);
	map_data = check_map_data(map_data);

	var canvas;
	if (map_data.canvas) canvas = map_data.canvas;
	var map = new Map(selection, defs, zoom_container, height, width, flux, node_data, node_data_style, cobra_model, canvas);
	if (map_data.reactions) map.reactions = map_data.reactions;
	if (map_data.nodes) map.nodes = map_data.nodes;
	if (map_data.membranes) map.membranes = map_data.membranes;
	if (map_data.text_labels) map.text_labels = map_data.text_labels;
	if (map_data.info) map.info = map_data.info;

	// get largest ids for adding new reactions, nodes, text labels, and segments
	map.map_info.largest_ids.reactions = get_largest_id(map.reactions);
	map.map_info.largest_ids.nodes = get_largest_id(map.nodes);
	map.map_info.largest_ids.text_labels = get_largest_id(map.text_labels);

	var largest_segment_id = 0;
	for (var id in map.reactions) {
	    largest_segment_id = get_largest_id(map.reactions[id].segments, largest_segment_id);
	}
	map.map_info.largest_ids.segments = largest_segment_id;

	// flux onto existing map reactions
	if (flux) map.apply_flux_to_map();
	if (node_data) map.apply_node_data_to_map();

	return map;

	// definitions
	function get_largest_id(obj, current_largest) {
	    /** Return the largest integer key in obj, or current_largest, whichever is bigger. */
	    if (current_largest===undefined) current_largest = 0;
	    if (obj===undefined) return current_largest;
	    return Math.max.apply(null, Object.keys(obj).map(function(x) { return parseInt(x); }).concat([current_largest]));
	}
    }

    function check_map_data(map_data) {
	/*
	 * Load a json map and add necessary fields for rendering.
	 *
	 * The returned value will be this.reactions.
	 */
	if (this.debug) {
	    var required_node_props = ['node_type', 'x', 'y',
				       'connected_segments'],
		required_reaction_props = ["segments", 'name', 'direction', 'abbreviation'],
		required_segment_props = ['from_node_id', 'to_node_id'],
		required_text_label_props = ['text', 'x', 'y'];
	    for (var node_id in map_data.nodes) {
		var node = map_data.nodes[node_id];
		node.selected = false; node.previously_selected = false;
		required_node_props.map(function(req) {
		    if (!node.hasOwnProperty(req)) console.error("Missing property " + req);
		});
	    }
	    for (var reaction_id in map_data.reactions) {
		var reaction = map_data.reactions[reaction_id];
		required_reaction_props.map(function(req) {
		    if (!reaction.hasOwnProperty(req)) console.error("Missing property " + req);
		});
		for (var segment_id in reaction.segments) {
		    var metabolite = reaction.segments[segment_id];
		    required_segment_props.map(function(req) {
			if (!metabolite.hasOwnProperty(req)) console.error("Missing property " + req);
		    });
		}
	    }
	    for (var text_label_id in map_data.text_labels) {
		var text_label = map_data.text_labels[text_label_id];
		required_text_label_props.map(function(req) {
		    if (!text_label.hasOwnProperty(req)) console.error("Missing property " + req);
		});
	    }
	}
	return map_data;
    }

    // ---------------------------------------------------------------------
    // Drawing

    function setup_containers(sel) {
        sel.append('g')
            .attr('id', 'membranes');
        sel.append('g')
            .attr('id', 'reactions');
        sel.append('g')
            .attr('id', 'nodes');
        sel.append('g')
            .attr('id', 'text-labels');
    }
    function reset_containers() {
	d3.select('#membranes')
            .selectAll('.membrane')
            .remove();
	d3.select('#reactions')
            .selectAll('.reaction')
            .remove();
	d3.select('#nodes')
            .selectAll('.node')
            .remove();
	d3.select('#text-labels')
            .selectAll('.text-label')
            .remove();
    }

    // -------------------------------------------------------------------------
    // Appearance

    function set_status(status) {
	this.status = status;
	this.callback_manager.run('set_status', status);
    }
    function set_flux(flux) {
	this.flux = flux;
	this.apply_flux_to_map();
	this.draw_all_reactions();
    }
    function set_node_data(node_data) {
	this.node_data = node_data;
	this.apply_node_data_to_map();
	this.draw_all_nodes();
    }
    function has_flux() {
	return Boolean(this.flux);
    }
    function has_node_data() {
	return Boolean(this.node_data);
    }
    function draw_everything() {
        /** Draw the reactions and membranes

         */
	var membranes = this.membranes,
	    scale = this.scale,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    text_labels = this.text_labels,
	    arrow_displacement = this.reaction_arrow_displacement,
	    defs = this.defs,
	    arrowheads = this.arrowheads_generated,
	    default_reaction_color = this.default_reaction_color,
	    bezier_drag_behavior = this.behavior.bezier_drag,
	    node_click_fn = this.behavior.node_click,
	    node_drag_behavior = this.behavior.node_drag,
	    reaction_label_drag = this.behavior.reaction_label_drag,
	    node_label_drag = this.behavior.node_label_drag,
	    text_label_click = this.behavior.text_label_click,
	    text_label_drag = this.behavior.text_label_drag,
	    node_data_style = this.node_data_style,
	    has_flux = this.has_flux(),
	    has_node_data = this.has_node_data(),
	    beziers_enabled = this.beziers_enabled;

	utils.draw_an_array('#membranes' ,'.membrane', membranes, draw.create_membrane,
			    function(sel) { return draw.update_membrane(sel, scale); });

	utils.draw_an_object('#reactions', '.reaction', reactions,
			     'reaction_id',
			     function(sel) { return draw.create_reaction(sel); }, 
			     function(sel) { return draw.update_reaction(sel, scale, 
									 nodes,
									 beziers_enabled, 
									 arrow_displacement,
									 defs, arrowheads,
									 default_reaction_color,
									 has_flux,
									 bezier_drag_behavior,
									 reaction_label_drag); });

	utils.draw_an_object('#nodes', '.node', nodes, 'node_id', 
			     function(sel) { return draw.create_node(sel, scale, nodes, reactions); },
			     function(sel) { return draw.update_node(sel, scale, has_node_data, node_data_style,
								     node_click_fn, node_drag_behavior,
								     node_label_drag); });

	utils.draw_an_object('#text-labels', '.text-label', text_labels,
			     'text_label_id',
			     function(sel) { return draw.create_text_label(sel); }, 
			     function(sel) { return draw.update_text_label(sel, scale,
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
	    arrow_displacement = this.reaction_arrow_displacement,
	    defs = this.defs,
	    arrowheads = this.arrowheads_generated,
	    default_reaction_color = this.default_reaction_color,
	    bezier_drag_behavior = this.behavior.bezier_drag,
	    reaction_label_drag = this.behavior.reaction_label_drag,
	    has_flux = this.has_flux(),
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
        var sel = d3.select('#reactions')
                .selectAll('.reaction')
                .data(utils.make_array(reaction_subset, 'reaction_id'),
                      function(d) { return d.reaction_id; });

        // enter: generate and place reaction
        sel.enter().call(draw.create_reaction);

        // update: update when necessary
        sel.call(function(sel) { return draw.update_reaction(sel, scale, 
							     nodes,
							     beziers_enabled, 
							     arrow_displacement,
							     defs, arrowheads,
							     default_reaction_color,
							     has_flux,
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
	    node_click_fn = this.behavior.node_click,
	    node_drag_behavior = this.behavior.node_drag,
	    node_label_drag = this.behavior.node_label_drag,
	    node_data_style = this.node_data_style,
	    has_node_data = this.has_node_data();

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
        var sel = d3.select('#nodes')
                .selectAll('.node')
                .data(utils.make_array(node_subset, 'node_id'),
                      function(d) { return d.node_id; });

        // enter: generate and place node
        sel.enter().call(function(sel) { return draw.create_node(sel, scale, nodes, reactions); });

        // update: update when necessary
        sel.call(function(sel) { return draw.update_node(sel, scale, has_node_data, node_data_style, 
							 node_click_fn, node_drag_behavior,
							 node_label_drag); });

        // exit
        sel.exit();
    }
    function draw_these_text_labels(text_label_ids) {
	var scale = this.scale,
	    text_labels = this.text_labels,
	    text_label_click = this.behavior.text_label_click,
	    text_label_drag = this.behavior.text_label_drag;

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
        var sel = d3.select('#text-labels')
                .selectAll('.text-label')
                .data(utils.make_array(text_label_subset, 'text_label_id'),
                      function(d) { return d.text_label_id; });

        // enter: generate and place label
        sel.enter().call(function(sel) {
	    return draw.create_text_label(sel);
	});

        // update: update when necessary
        sel.call(function(sel) {
	    return draw.update_text_label(sel, scale, text_label_click, text_label_drag);
	});

        // exit
        sel.exit();
    }
    function apply_flux_to_map() {
	this.apply_flux_to_reactions(this.reactions);
    }
    function apply_flux_to_reactions(reactions) {
	for (var reaction_id in reactions) {
	    var reaction = reactions[reaction_id];
	    if (reaction.abbreviation in this.flux) {
		var flux = parseFloat(this.flux[reaction.abbreviation]);
		reaction.flux = flux;
		for (var segment_id in reaction.segments) {
		    var segment = reaction.segments[segment_id];
		    segment.flux = flux;
		}
	    } else {
		var flux = 0.0;
		reaction.flux = flux;
		for (var segment_id in reaction.segments) {
		    var segment = reaction.segments[segment_id];
		    segment.flux = flux;
		}
	    }
	}
    }
    function apply_node_data_to_map() {
	this.apply_node_data_to_nodes(this.nodes);
    }
    function apply_node_data_to_nodes(nodes) {
	var vals = [];
	for (var node_id in nodes) {
	    var node = nodes[node_id], data = 0.0;
	    if (node.bigg_id_compartmentalized in this.node_data) {
		data = parseFloat(this.node_data[node.bigg_id_compartmentalized]);
	    }
	    if (isNaN(data)) {
		node.data = 0;
	    } else {
		vals.push(data);
		node.data = data;
	    }
		
	}
	var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
	this.scale.node_size.domain([min, max]);
	this.scale.node_color.domain([min, max]);
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
	d3.select('#nodes')
	    .selectAll('.selected')
	    .each(function(d) { selected_node_ids.push(d.node_id); });
	return selected_node_ids;
    }
    function get_selected_nodes() {
	var selected_nodes = {},
	    self = this;
	d3.select('#nodes')
	    .selectAll('.selected')
	    .each(function(d) { selected_nodes[d.node_id] = self.nodes[d.node_id]; });
	return selected_nodes;
    }	
    function get_selected_text_label_ids() {
	var selected_text_label_ids = [];
	d3.select('#text-labels')
	    .selectAll('.selected')
	    .each(function(d) { selected_text_label_ids.push(d.text_label_id); });
	return selected_text_label_ids;
    }	
    function get_selected_text_labels() {
	var selected_text_labels = {},
	    self = this;
	d3.select('#text-labels')
	    .selectAll('.selected')
	    .each(function(d) { selected_text_labels[d.text_label_id] = self.text_labels[d.text_label_id]; });
	return selected_text_labels;
    }	
    function select_metabolite_with_id(node_id) {
	// deselect all text labels
	this.deselect_text_labels();

	var node_selection = this.sel.select('#nodes').selectAll('.node'),
	    scaled_coords,
	    scale = this.scale,
	    selected_node;
	node_selection.classed("selected", function(d) {
	    var selected = String(d.node_id) == String(node_id);
	    if (selected) {
		selected_node = d;
		scaled_coords = { x: scale.x(d.x), y: scale.y(d.y) };
	    }
	    return selected;
	});
	this.direction_arrow.set_location(scaled_coords);
	this.direction_arrow.show();
	this.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	this.callback_manager.run('select_metabolite_with_id', selected_node, scaled_coords);
    }
    function select_metabolite(sel, d) {
	// deselect all text labels
	this.deselect_text_labels();
	
	var node_selection = this.sel.select('#nodes').selectAll('.node'), 
	    shift_key_on = this.key_manager.held_keys.shift;
	if (shift_key_on) {
	    d3.select(sel.parentNode)
		.classed("selected", !d3.select(sel.parentNode).classed("selected"));
	}
        else node_selection.classed("selected", function(p) { return d === p; });
	var selected_nodes = d3.select('#nodes').selectAll('.selected'),
	    count = 0,
	    scaled_coords,
	    scale = this.scale,
	    selected_node;
	selected_nodes.each(function(d) {
	    selected_node = d;
	    scaled_coords = { x: scale.x(d.x), y: scale.y(d.y) };
	    count++;
	});
	if (count == 1) {
	    this.direction_arrow.set_location(scaled_coords);
	    this.direction_arrow.show();
	} else {
	    this.direction_arrow.hide();
	}
	this.callback_manager.run('select_metabolite', count, selected_node, scaled_coords);
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
	var selected_text_labels = d3.select('#text-labels').selectAll('.selected'),
	    coords,
	    scale = this.scale;
	selected_text_labels.each(function(d) {
	    coords = { x: scale.x(d.x), y: scale.y(d.y) };
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
	    self = this,
	    delete_and_draw = function(nodes, reactions, segment_objs) {
		// delete nodes, segments, and reactions with no segments
  		self.delete_node_data(selected_nodes);
		self.delete_segment_data(segment_objs);
		self.delete_reaction_data(reactions);
		// redraw
		// TODO just redraw these nodes and segments
		self.draw_everything();
	    };

	// delete
	delete_and_draw(selected_nodes, reactions, segment_objs_w_segments);

	// add to undo/redo stack
	this.undo_stack.push(function() {
	    // undo
	    // redraw the saved nodes, reactions, and segments
	    utils.extend(self.nodes, saved_nodes);
	    utils.extend(self.reactions, saved_reactions);
	    var reactions_to_draw = Object.keys(saved_reactions);
	    saved_segment_objs_w_segments.forEach(function(segment_obj) {
		self.reactions[segment_obj.reaction_id]
		    .segments[segment_obj.segment_id] = segment_obj.segment;
		reactions_to_draw.push(segment_obj.reaction_id);
	    });
	    self.draw_these_nodes(Object.keys(saved_nodes));
	    self.draw_these_reactions(reactions_to_draw);
	    // copy nodes to re-delete
	    selected_nodes = utils.clone(saved_nodes);
	    segment_objs_w_segments = utils.clone(saved_segment_objs_w_segments);
	    reactions = utils.clone(saved_reactions);
	}, function () {
	    // redo
	    // clone the nodes and reactions, to redo this action later
	    delete_and_draw(selected_nodes, reactions, segment_objs_w_segments);
	});
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
  		self.delete_text_label_data(selected_text_labels);
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
    function delete_node_data(nodes) {
	/** Simply delete nodes.
	 */
	for (var node_id in nodes) {
	    delete this.nodes[node_id];
	}
    }
    function delete_segment_data(segment_objs) {
	/** Delete segments, and update connected_segments in nodes. Also
	 deletes any reactions with 0 segments.
	 
	 segment_objs: Array of objects with { reaction_id: "123", segment_id: "456" }
	 
	 */
	var reactions = this.reactions,
	    nodes = this.nodes;
	segment_objs.forEach(function(segment_obj) {
	    var reaction = reactions[segment_obj.reaction_id];

	    // segment already deleted
	    if (!(segment_obj.segment_id in reaction.segments)) return;
	    
	    var segment = reaction.segments[segment_obj.segment_id];
	    // updated connected nodes
	    [segment.from_node_id, segment.to_node_id].forEach(function(node_id) {
		if (!(node_id in nodes)) return;
		var node = nodes[node_id];
		node.connected_segments = node.connected_segments.filter(function(so) {
		    return so.segment_id != segment_obj.segment_id;				
		});
	    });

	    delete reaction.segments[segment_obj.segment_id];
	});
    }
    function delete_reaction_data(reactions) {
	/** delete reactions
	 */
	for (var reaction_id in reactions) {
	    delete this.reactions[reaction_id];
	}
    }
    function delete_text_label_data(text_labels) {
	/** delete text labels for an array of ids
	 */
	for (var text_label_id in text_labels) {
	    delete this.text_labels[text_label_id];
	}
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

    function new_reaction_from_scratch(starting_reaction, coords) {
	/** Draw a reaction on a blank canvas.

	 starting_reaction: bigg_id for a reaction to draw.
	 coords: coordinates to start drawing

	 */
	
        // If reaction id is not new, then return:
	for (var reaction_id in this.reactions) {
	    if (this.reactions[reaction_id].abbreviation == starting_reaction) {             
		console.warn('reaction is already drawn');
                return;
	    }
        }

	// If there is no cobra model, error
	if (!this.cobra_model) console.error('No CobraModel. Cannot build new reaction');

        // set reaction coordinates and angle
        // be sure to copy the reaction recursively
        var cobra_reaction = utils.clone(this.cobra_model.reactions[starting_reaction]);

	// create the first node
	for (var metabolite_id in cobra_reaction.metabolites) {
	    var metabolite = cobra_reaction.metabolites[metabolite_id];
	    if (metabolite.coefficient < 0) {
		var selected_node_id = ++this.map_info.largest_ids.nodes,
		    label_d = { x: 30, y: 10 },
		    selected_node = { connected_segments: [],
				      x: coords.x,
				      y: coords.y,
				      node_is_primary: true,
				      compartment_name: metabolite.compartment,
				      label_x: coords.x + label_d.x,
				      label_y: coords.y + label_d.y,
				      metabolite_name: metabolite.name,
				      bigg_id: metabolite.bigg_id,
				      bigg_id_compartmentalized: metabolite.bigg_id_compartmentalized,
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
	    map.delete_node_data(new_nodes);
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
	this.new_reaction_for_metabolite(starting_reaction, selected_node_id);

        // definitions
	function extend_and_draw_metabolite(new_nodes, selected_node_id) {
	    utils.extend(this.nodes, new_nodes);
	    this.draw_these_nodes([selected_node_id]);
	}
    }
    
    function new_reaction_for_metabolite(reaction_abbreviation, selected_node_id) {
	/** Build a new reaction starting with selected_met.

	 Undoable

	 */

        // If reaction id is not new, then return:
	for (var reaction_id in this.reactions) {
	    if (this.reactions[reaction_id].abbreviation == reaction_abbreviation) {
		console.warn('reaction is already drawn');
                return;
	    }
        }

	// get the metabolite node
	var selected_node = this.nodes[selected_node_id];

        // set reaction coordinates and angle
        // be sure to copy the reaction recursively
        var cobra_reaction = utils.clone(this.cobra_model.reactions[reaction_abbreviation]);

	// build the new reaction
	var out = build.new_reaction(reaction_abbreviation, cobra_reaction,
				     selected_node_id, utils.clone(selected_node),
				     this.map_info.largest_ids, this.cobra_model.cofactors,
				     this.direction_arrow.get_rotation()),
	    new_nodes = out.new_nodes,
	    new_reactions = out.new_reactions;

	// add the flux
	if (this.flux) this.apply_flux_to_reactions(new_reactions);
	if (this.node_data) this.apply_node_data_to_nodes(new_nodes);

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
	    map.delete_node_data(new_nodes);
	    map.delete_reaction_data(new_reactions);
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
	    utils.extend(this.reactions, new_reactions);
	    // remove the selected node so it can be updated
	    delete this.nodes[selected_node_id];
	    utils.extend(this.nodes, new_nodes);

	    // draw new reaction and (TODO) select new metabolite
	    this.draw_these_nodes(Object.keys(new_nodes));
	    this.draw_these_reactions(Object.keys(new_reactions));

	    // select new primary metabolite
	    for (var node_id in new_nodes) {
		var node = new_nodes[node_id];
		if (node.node_is_primary && node_id!=selected_node_id) {
		    this.select_metabolite_with_id(node_id);
		    var new_coords = { x: node.x, y: node.y };
		    if (this.zoom_container)
			this.zoom_container.translate_off_screen(new_coords, this.scale.x, this.scale.y);
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

    function rotate_selected_nodes() {
	/** Request a center, then listen for rotation, and rotate nodes.

	 */
	this.callback_manager.run('start_rotation');
	
	var selected_nodes = this.get_selected_nodes();
	if (selected_nodes.length < 1) return console.warn('No nodes selected');
	
	var saved_center, total_angle = 0,
	    selected_node_ids = Object.keys(selected_nodes),
	    self = this,
	    reactions = this.reactions,
	    nodes = this.nodes,
	    end_function = function() {
		self.callback_manager.run('end_rotation');
	    };

	choose_center.call(this, function(center) {
	    saved_center = center;
	    listen_for_rotation.call(self, center, function(angle) {
		total_angle += angle;
		var updated = build.rotate_nodes(selected_nodes, reactions,
						 angle, center);
		self.draw_these_nodes(updated.node_ids);
		self.draw_these_reactions(updated.reaction_ids);
	    }, end_function, end_function);
	}, end_function);

	// add to undo/redo stack
	this.undo_stack.push(function() {
	    // undo
	    var these_nodes = {};
	    selected_node_ids.forEach(function(id) { these_nodes[id] = nodes[id]; });
	    var updated = build.rotate_selected_nodes(these_nodes, reactions,
						      -total_angle, saved_center);
	    self.draw_these_nodes(updated.node_ids);
	    self.draw_these_reactions(updated.reaction_ids);
	}, function () {
	    // redo
	    var these_nodes = {};
	    selected_node_ids.forEach(function(id) { these_nodes[id] = nodes[id]; });
	    var updated = build.rotate_selected_nodes(these_nodes, reactions,
						      total_angle, saved_center);
	    self.draw_these_nodes(updated.node_ids);
	    self.draw_these_reactions(updated.reaction_ids);
	});

	// definitions
	function choose_center(callback, callback_canceled) {
	    console.log('Choose center');
	    set_status('Choose a node or point to rotate around.');
	    var selection_node = d3.selectAll('.node-circle'),
		selection_background = d3.selectAll('#mouse-node'),
		scale = this.scale,
		escape_listener = this.key_manager.add_escape_listener(function() {
		    console.log('choose_center escape');
		    selection_node.on('mousedown.center', null);
		    selection_background.on('mousedown.center', null);
		    set_status('');
		    callback_canceled();
		});
	    // if the user clicks a metabolite node
	    selection_node.on('mousedown.center', function(d) {		    
		console.log('mousedown.center');
		// turn off the click listeners to prepare for drag
		selection_node.on('mousedown.center', null);
		selection_background.on('mousedown.center', null);
		set_status('');
		escape_listener.clear();
		// find the location of the clicked metabolite
		var center = { x: d.x, y: d.y };
		callback(center); 
	    });
	    // if the user clicks a point
	    selection_background.on('mousedown.center', function() {
		console.log('mousedown.center');
		// turn off the click listeners to prepare for drag
		selection_node.on('mousedown.center', null);
		selection_background.on('mousedown.center', null);
		set_status('');
		escape_listener.clear();
		// find the point on the background node where the user clicked
		var center = { x: scale.x_size.invert(d3.mouse(this)[0]), 
			       y: scale.y_size.invert(d3.mouse(this)[1]) };
		callback(center); 
	    });
	}
	function listen_for_rotation(center, callback, callback_finished, 
				     callback_canceled) {
	    this.set_status('Drag to rotate.');
	    this.zoom_container.toggle_zoom(false);
	    var angle = Math.PI/2,
		selection = d3.selectAll('#mouse-node'),
		drag = d3.behavior.drag(),
		scale = this.scale,
		escape_listener = this.key_manager.add_escape_listener(function() {
		    console.log('listen_for_rotation escape');
		    drag.on('drag.rotate', null);
		    drag.on('dragend.rotate', null);
		    set_status('');
		    callback_canceled();
		});
	    // drag.origin(function() { return point_of_grab; });
	    drag.on("drag.rotate", function() { 
		callback(angle_for_event({ dx: scale.x_size.invert(d3.event.dx), 
					   dy: scale.y_size.invert(d3.event.dy) },
					 { x: scale.x_size.invert(d3.mouse(this)[0]),
					   y: scale.y_size.invert(d3.mouse(this)[1]) },
					 center));
	    }).on("dragend.rotate", function() {
		console.log('dragend.rotate');
		drag.on('drag.rotate', null);
		drag.on('dragend.rotate', null);
		set_status('');
		escape_listener.clear();
		callback_finished();
	    });
	    selection.call(drag);

	    // definitions
	    function angle_for_event(displacement, point, center) {
		var gamma =  Math.atan2((point.x - center.x), (center.y - point.y)),
		    beta = Math.atan2((point.x - center.x + displacement.dx), 
				      (center.y - point.y - displacement.dy)),
		    angle = beta - gamma;
		return angle;
	    }
	}
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
        // TODO put this in js/metabolic-map/utils.js
        var t = d3.select('body').select('#status');
        if (t.empty()) t = d3.select('body')
            .append('text')
            .attr('id', 'status');
        t.text(status);
        return this;
    }

    function zoom_extent(margin, mode) {
	/** Zoom to fit all the nodes.

	 margin: optional argument to set the margins.
	 mode: Values are 'nodes', 'canvas'.

	 Returns error if one is raised.

	 */

	// optional args
	if (margin===undefined) margin = 100;
	if (mode===undefined) mode = 'canvas';

	var new_zoom, new_pos;
	if (mode=='nodes') {
	    // get the extent of the nodes
	    var min = { x: null, y: null }, // TODO make infinity?
		max = { x: null, y: null }; 
	    for (var node_id in this.nodes) {
		var node = this.nodes[node_id];
		if (min.x===null) min.x = this.scale.x(node.x);
		if (min.y===null) min.y = this.scale.y(node.y);
		if (max.x===null) max.x = this.scale.x(node.x);
		if (max.y===null) max.y = this.scale.y(node.y);

		min.x = Math.min(min.x, this.scale.x(node.x));
		min.y = Math.min(min.y, this.scale.y(node.y));
		max.x = Math.max(max.x, this.scale.x(node.x));
		max.y = Math.max(max.y, this.scale.y(node.y));
	    }
	    // set the zoom
            new_zoom = Math.min((this.width - margin*2) / (max.x - min.x),
				(this.height - margin*2) / (max.y - min.y));
	    new_pos = { x: - (min.x * new_zoom) + margin + ((this.width - margin*2 - (max.x - min.x)*new_zoom) / 2),
			y: - (min.y * new_zoom) + margin + ((this.height - margin*2 - (max.y - min.y)*new_zoom) / 2) };
	} else if (mode=='canvas') {
	    // center the canvas
	    new_zoom =  Math.min((this.width - margin*2) / (this.canvas.width),
				 (this.height - margin*2) / (this.canvas.height));
	    new_pos = { x: - (this.canvas.x * new_zoom) + margin + ((this.width - margin*2 - this.canvas.width*new_zoom) / 2),
			y: - (this.canvas.y * new_zoom) + margin + ((this.height - margin*2 - this.canvas.height*new_zoom) / 2) };
	} else {
	    return console.error('Did not recognize mode');
	}
	this.zoom_container.go_to(new_zoom, new_pos);
	return null;
    }

    // -------------------------------------------------------------------------
    // IO

    function save() {
        console.log("Saving");
        utils.download_json(this.map_for_export(), "saved_map");
    }
    function map_for_export() {
	return { reactions: this.reactions,
		 nodes: this.nodes,
		 membranes: this.membranes,
		 text_labels: this.text_labels,
		 canvas: this.canvas.size_and_location() };
    }
    function save_svg() {
        console.log("Exporting SVG");
	// o.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');	    
	// o.direction_arrow.hide();
	this.callback_manager.run('before_svg_export');
        utils.export_svg("saved_map", "svg");
	this.callback_manager.run('after_svg_export');
    }
});

define('builder/ZoomContainer',["vis/utils", "lib/d3", "vis/CallbackManager"], function(utils, d3, CallbackManager) {
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
	if (!translate || !('x' in translate) || !('y' in translate)) return console.error('Bad translate value');

	this.zoom_behavior.scale(scale);
	this.window_scale = scale;
	if (this.saved_scale !== null) this.saved_scale = scale;

	this.zoom_behavior.translate([translate.x, translate.y]);
        this.window_translate = translate;
	if (this.saved_translate !== null) this.saved_translate = translate;

        this.zoomed_sel
	    .transition()
            .attr('transform', 'translate('+this.window_translate.x+','+this.window_translate.y+')scale('+this.window_scale+')');
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

define('builder/Input',["lib/d3", "vis/utils",  "lib/complete.ly", "builder/Map", "builder/ZoomContainer", "vis/CallbackManager"], function(d3, utils, completely, Map, ZoomContainer, CallbackManager) {
    /**
     */

    var Input = utils.make_class();
    // instance methods
    Input.prototype = { init: init,
			setup_map_callbacks: setup_map_callbacks,
			setup_zoom_callbacks: setup_zoom_callbacks,
			show: show,
			hide: hide,
			toggle: toggle,
			place_at_selected: place_at_selected,
			place: place,
			reload_at_selected: reload_at_selected,
			reload: reload,
			toggle_start_reaction_listener: toggle_start_reaction_listener };

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
		this.value = this.value.replace("/","")
		    .replace(" ","")
		    .replace("\\","")
		    .replace("<","");
	    });
	this.selection = new_sel;
	this.completely = c;

	if (map instanceof Map) {
	    this.map = map;
	    this.setup_map_callbacks();
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
	this.hide();
    }
    function setup_map_callbacks() {
	var self = this;
	this.map.callback_manager.set('select_metabolite_with_id.input', function(selected_node, scaled_coords) {
	    if (self.is_visible) self.reload(selected_node, scaled_coords, false);
	    self.map.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	});
	this.map.callback_manager.set('select_metabolite.input', function(count, selected_node, scaled_coords) {
	    self.map.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
	    if (count == 1 && self.is_visible && scaled_coords) {
		self.reload(selected_node, scaled_coords, false);
	    } else {
		self.hide();
	    }
	});
    }
    function setup_zoom_callbacks() {
	var self = this;
	this.zoom_container.callback_manager.set('zoom.input', function() {
	    if (self.is_visible) {
		self.place_at_selected();
	    }
	});
    }
    function show() {
	this.toggle(true);
    }
    function hide() {
	this.toggle(false);
    }
    function toggle(on_off) {
	if (on_off===undefined) this.is_visible = !this.is_visible;
	else this.is_visible = on_off;
	if (this.is_visible) {
	    this.toggle_start_reaction_listener(true);
	    this.selection.style("display", "block");
	    this.reload_at_selected();
	    this.callback_manager.run('show_reaction_input');
	} else {
	    this.toggle_start_reaction_listener(false);
	    this.selection.style("display", "none");
            this.completely.input.blur();
            this.completely.hideDropDown();
	    this.callback_manager.run('hide_reaction_input');
	}
    }

    function place_at_selected() {
        /** Place autocomplete box at the first selected node.
	 
         */

	// get the selected node
	this.map.deselect_text_labels();
	var selected_node = this.map.select_single_node(),
	    scale = this.map.scale;
	if (selected_node==null) return;
	var coords = { x: scale.x(selected_node.x), y: scale.y(selected_node.y) };
	this.place(coords);
    }
    function place(coords) {
	var d = {x: 200, y: 0},
	    scale = this.map.scale,
	    window_translate = this.map.zoom_container.window_translate,
	    window_scale = this.map.zoom_container.window_scale;
        var left = Math.max(20,
			    Math.min(this.map.width - 270,
				     (window_scale * coords.x + window_translate.x - d.x)));
        var top = Math.max(20,
			   Math.min(this.map.height - 40,
				    (window_scale * coords.y + window_translate.y - d.y)));
        this.selection.style('position', 'absolute')
            .style('display', 'block')
            .style('left',left+'px')
            .style('top',top+'px');
    }

    function reload_at_selected() {
        /** Reload data for autocomplete box and redraw box at the first
	 selected node.
	 
         */
	// get the selected node
	this.map.deselect_text_labels();
	var selected_node = this.map.select_single_node(),
	    scale = this.map.scale;
	if (selected_node==null) return;
	var scaled_coords = { x: scale.x(selected_node.x), y: scale.y(selected_node.y) };
	// reload the reaction input
	this.reload(selected_node, scaled_coords, false);
    }
    function reload(selected_node, scaled_coords, starting_from_scratch) {
        /** Reload data for autocomplete box and redraw box at the new
         coordinates.
	 
         */

	if (selected_node===undefined && !starting_from_scratch)
	    console.error('No selected node, and not starting from scratch');

	var decimal_format = d3.format('.3g');

	this.place(scaled_coords);
        // blur
        this.completely.input.blur();
        this.completely.repaint(); //put in place()?

        // Find selected reaction
        var suggestions = [],
	    cobra_reactions = this.map.cobra_model.reactions,
	    reactions = this.map.reactions,
	    has_flux = this.map.has_flux(),
	    flux = this.map.flux;
        for (var reaction_abbreviation in cobra_reactions) {
            var reaction = cobra_reactions[reaction_abbreviation];

            // ignore drawn reactions
            if (already_drawn(reaction_abbreviation, reactions)) continue;

	    // check segments for match to selected metabolite
	    for (var metabolite_id in reaction.metabolites) {
		var metabolite = reaction.metabolites[metabolite_id]; 
		// if starting with a selected metabolite, check for that id
		if (!starting_from_scratch && selected_node.bigg_id_compartmentalized!=metabolite_id) continue;
		// don't add suggestions twice
		if (reaction_abbreviation in suggestions) continue;
		// reverse for production
		var this_flux, this_string;
		if (has_flux) {
		    if (reaction_abbreviation in flux) 
			this_flux = flux[reaction_abbreviation] * (metabolite.coefficient < 1 ? 1 : -1);
		    else
			this_flux = 0;
		    this_string = string_for_flux(reaction_abbreviation, this_flux, decimal_format);
	    	    suggestions[reaction_abbreviation] = { flux: this_flux,
							   string: this_string };
		} else {
	    	    suggestions[reaction_abbreviation] = { string: reaction_abbreviation };
		}
		
	    }
        }

        // Generate the array of reactions to suggest and sort it
	var strings_to_display = [],
	    suggestions_array = utils.make_array(suggestions, 'reaction_abbreviation');
	if (has_flux)
	    suggestions_array.sort(function(x, y) { return Math.abs(y.flux) - Math.abs(x.flux); });
	suggestions_array.forEach(function(x) {
	    strings_to_display.push(x.string);
	});

        // set up the box with data, searching for first num results
        var num = 20,
            complete = this.completely,
	    self = this,
	    scale = this.map.scale;
        complete.options = strings_to_display;
        if (strings_to_display.length==1) complete.setText(strings_to_display[0]);
        else complete.setText("");
        complete.onEnter = function() {
	    var text = this.getText();
	    this.setText("");
	    suggestions_array.map(function(x) {
		if (x.string==text) {
		    if (starting_from_scratch) {
			var coords = { x: scale.x.invert(scaled_coords.x),
				       y: scale.y.invert(scaled_coords.y) };
			self.map.new_reaction_from_scratch(x.reaction_abbreviation, coords);
		    } else {
			self.map.new_reaction_for_metabolite(x.reaction_abbreviation, selected_node.node_id);
		    }
		}
	    });
        };
        complete.repaint();
        this.completely.input.focus();

	//definitions
	function already_drawn(cobra_id, reactions) {
            for (var drawn_id in reactions) {
		if (reactions[drawn_id].abbreviation==cobra_id) 
		    return true;
	    }
            return false;
	};
	function string_for_flux(reaction_abbreviation, flux, decimal_format) {
	    return reaction_abbreviation + ": " + decimal_format(flux);
	}
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
        
        if (this.start_reaction_listener) {
	    var self = this,
		map = this.map,
		scale = map.scale;
            map.sel.on('click.start_reaction', function() {
                console.log('clicked for new reaction');
                // reload the reaction input
                var scaled_coords = { x: scale.x(scale.x_size.invert(d3.mouse(this)[0])),
				      y: scale.y(scale.y_size.invert(d3.mouse(this)[1])) };
                // unselect metabolites
		map.deselect_nodes();
		map.deselect_text_labels();
		// reload the reactin input
                self.reload(null, scaled_coords, true);
		// generate the target symbol
                var s = map.sel.selectAll('.start-reaction-target').data([12, 5]);
                s.enter().append('circle')
                    .classed('start-reaction-target', true)
                    .attr('r', function(d) { return scale.size(d); })
                    .style('stroke-width', scale.size(4));
                s.style('visibility', 'visible')
                    .attr('transform', 'translate('+scaled_coords.x+','+scaled_coords.y+')');
            });
            map.sel.classed('start-reaction-cursor', true);
        } else {
            this.map.sel.on('click.start_reaction', null);
            this.map.sel.classed('start-reaction-cursor', false);
            this.map.sel.selectAll('.start-reaction-target').style('visibility', 'hidden');
        }
    }

});

define('builder/CobraModel',["vis/utils"], function(utils) {
    /**
     */

    var CobraModel = utils.make_class();
    // instance methods
    CobraModel.prototype = { init: init };

    return CobraModel;

    function init(reactions, cofactors) {
	this.reactions = reactions;
	this.cofactors = cofactors;
    }
});

define('builder/Brush',["vis/utils", "lib/d3"], function(utils, d3) {
    /** Define a brush to select elements in a map.

     Brush(selection, is_enabled, map, insert_after)

     insert_after: A d3 selector string to choose the svg element that the brush
     will be inserted after. Often a canvas element (e.g. '.canvas-group').

     */

    var Brush = utils.make_class();
    Brush.prototype = { init: init,
			toggle: toggle,
			setup_selection_brush: setup_selection_brush };

    return Brush;

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
	return d3.select('.brush').empty();
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
    
    // definitions
    function setup_selection_brush() {
	var selection = this.brush_sel, 
	    node_selection = d3.select('#nodes').selectAll('.node'),
	    width = this.map.width,
	    height = this.map.height,
	    node_ids = [],
	    scale = this.map.scale;
	node_selection.each(function(d) { node_ids.push(d.node_id); });
	var brush_fn = d3.svg.brush()
		.x(d3.scale.identity().domain([0, width]))
		.y(d3.scale.identity().domain([0, height]))
		.on("brush", function() {
		    var extent = d3.event.target.extent();
		    node_selection
			.classed("selected", function(d) { 
			    var sx = scale.x(d.x), sy = scale.y(d.y);
			    return extent[0][0] <= sx && sx < extent[1][0]
				&& extent[0][1] <= sy && sy < extent[1][1];
			});
		})        
		.on("brushend", function() {
		    d3.event.target.clear();
		    d3.select(this).call(d3.event.target);
		}),
	    brush = selection.append("g")
		.attr("class", "brush")
		.call(brush_fn);
	return brush;
    }
});

define('builder/Builder',["vis/utils", "lib/d3", "builder/Input", "builder/ZoomContainer", "builder/Map", "builder/CobraModel", "builder/Brush", "vis/CallbackManager"], function(utils, d3, Input, ZoomContainer, Map, CobraModel, Brush, CallbackManager) {
    // NOTE
    // see this thread: https://groups.google.com/forum/#!topic/d3-js/Not1zyWJUlg
    // only necessary for selectAll()
    // .datum(function() {
    //     return this.parentNode.__data__;
    // })


    var Builder = utils.make_class();
    Builder.prototype = { init: init,
			  reload_builder: reload_builder,
			  brush_mode: brush_mode,
			  zoom_mode: zoom_mode,
			  _setup_menu: _setup_menu,
			  _setup_status: _setup_status,
			  _setup_modes: _setup_modes,
			  _get_keys: _get_keys };

    return Builder;

    // definitions
    function init(options) {
	// set defaults
	var o = utils.set_options(options, {
	    margins: {top: 0, right: 0, bottom: 0, left: 0},
	    selection: d3.select("body").append("div"),
	    selection_is_svg: false,
	    fillScreen: false,
	    enable_editing: true,
	    on_load: function() {},
	    map_path: null,
	    map: null,
	    cobra_model_path: null,
	    cobra_model: null,
	    css_path: null,
	    css: null,
	    flux_path: null,
	    flux: null,
	    flux2_path: null,
	    flux2: null,
	    node_data: null,
	    node_data_path: null,
	    node_data_style: 'ColorSize',
	    show_beziers: false,
	    debug: false,
	    starting_reaction: 'GLCtex',
	    reaction_arrow_displacement: 35 });

	if (o.selection_is_svg) {
	    // TODO fix this
	    console.error("Builder does not support placement within svg elements");
	    return null;
	}

	this.o = o;
	var files_to_load = [{ file: o.map_path, value: o.map,
			       callback: set_map_data },
			     { file: o.cobra_model_path, value: o.cobra_model,
			       callback: set_cobra_model },
			     { file: o.css_path, value: o.css,
			       callback: set_css },
			     { file: o.flux_path, value: o.flux,
			       callback: function(e, f) { set_flux.call(this, e, f, 0); } },
			     { file: o.flux2_path, value: o.flux2,
			       callback: function(e, f) { set_flux.call(this, e, f, 1); } },
			     { file: o.node_data_path, value: o.node_data,
			       callback: set_node_data } ];
	utils.load_files(this, files_to_load, reload_builder);

	// definitions
	function set_map_data(error, map_data) {
	    if (error) console.warn(error);
	    this.o.map_data = map_data;
	}
	function set_cobra_model(error, cobra_model) {
	    if (error) console.warn(error);
	    this.o.cobra_model = cobra_model;
	}
	function set_css(error, css) {
	    if (error) console.warn(error);
	    this.o.css = css;
	}
	function set_flux(error, flux, index) {
	    if (error) console.warn(error);
	    if (index==0) this.o.flux = flux;
	    else if (index==1) this.o.flux2 = flux;
	}
	function set_node_data(error, data) {
	    if (error) console.warn(error);
	    this.o.node_data = data;
	}
    }

    // Definitions
    function reload_builder() {
	/** Load the svg container and draw a loaded map if provided.
	 
	 */

	// Begin with some definitions
	var metabolite_click_enabled = true,
	    shift_key_on = false;

	// set up this callback manager
	this.callback_manager = CallbackManager();

	// Check the cobra model
	var cobra_model = null;
	if (this.o.cobra_model) {
	    // TODO better checks
	    cobra_model = CobraModel(this.o.cobra_model.reactions, this.o.cobra_model.cofactors);
	} else {
	    console.warn('No cobra model was loaded.');
	}

	// remove the old builder
	utils.remove_child_nodes(this.o.selection);

	// set up the svg
	var out = utils.setup_svg(this.o.selection, this.o.selection_is_svg,
				  this.o.margins, this.o.fill_screen),
	    svg = out.svg,
	    height = out.height,
	    width = out.width;

	// set up the defs
	var defs = utils.setup_defs(svg, this.o.css);

	// se up the zoom container
	this.zoom_container = new ZoomContainer(svg, width, height, [0.05, 15]);
	var zoomed_sel = this.zoom_container.zoomed_sel;

	var max_w = width, max_h = height, scale;
	if (this.o.map_data) {
	    // import map
	    this.map = Map.from_data(this.o.map_data, zoomed_sel, defs, this.zoom_container,
				height, width, this.o.flux, this.o.node_data, this.o.node_data_style,
				cobra_model);
	    this.zoom_container.reset();
	} else {
	    // new map
	    this.map = new Map(zoomed_sel, defs, this.zoom_container,
			  height, width, this.o.flux, this.o.node_data, this.o.node_data_style,
			  cobra_model);
	}

	// set up the reaction input with complete.ly
	var reaction_input = Input(this.o.selection, this.map, this.zoom_container);

	if (this.o.enable_editing) {
	    // setup the Brush
	    this.brush = new Brush(zoomed_sel, false, this.map, '.canvas-group');

	    // setup the modes
	    this._setup_modes(this.map, this.brush, this.zoom_container);
	
	    // make key manager
	    var keys = this._get_keys(this.map, reaction_input, this.brush);
	    this.map.key_manager.assigned_keys = keys;
	    // set up menu and status bars
	    var menu = this._setup_menu(this.o.selection, this.map, this.zoom_container, this.map.key_manager, keys),
		status = this._setup_status(this.o.selection, this.map);
	    // make sure the key manager remembers all those changes
	    this.map.key_manager.update();
	}
	
	// setup selection box
	if (this.o.map_data) {
	    this.map.draw_everything();
	    this.map.zoom_extent();
	} else {
	    if (this.o.starting_reaction) {
		// Draw default reaction if no map is provided
		var start_coords = { x: this.map.scale.x.invert(width/2),
				     y: this.map.scale.x.invert(height/4) };
		this.map.new_reaction_from_scratch(this.o.starting_reaction, start_coords);
		this.map.zoom_extent(300, 'nodes');
	    } else {
		this.map.zoom_extent();
	    }
	}

	if (this.o.enable_editing) {
	    // start in zoom mode
	    this.zoom_mode();
	} else {
	    // turn off the behaviors
	    this.map.behavior.turn_everything_off();
	    this.map.draw_everything();
	}

	// turn off loading message
	d3.select('#loading').style("display", "none");

	// run the load callback
	this.o.on_load();
    }
    function brush_mode() {
	this.brush.toggle(true);
	this.zoom_container.toggle_zoom(false);
	this.callback_manager.run('brush_mode');
    }
    function zoom_mode() {
	this.brush.toggle(false);
	this.zoom_container.toggle_zoom(true);
	this.callback_manager.run('zoom_mode');
    }
    function _setup_menu(selection, map, zoom_container, key_manager, keys) {
	var sel = selection.append("div").attr("id", "menu");
	new_button(sel, keys.toggle_input, "New reaction (/)");
	new_button(sel, keys.save, "Save (^s)");
	new_button(sel, keys.save_svg, "Export SVG (^Shift s)");
	key_manager.assigned_keys.load.fn = new_input(sel, load_map_for_file, this, "Load (^o)");
	key_manager.assigned_keys.load_flux.fn = new_input(sel, load_flux_for_file, this, "Load flux (^f)");
	new_input(sel, load_node_data_for_file, this, "Load node data");

	var b = new_button(sel, keys.toggle_beziers, "Hide control points (b)", 'bezier-button');
	map.callback_manager
	    .set('toggle_beziers.button', function(on_off) {
		b.text((on_off ? 'Hide' : 'Show') + ' control points (b)');
	    });

	var z = new_button(sel, keys.brush_mode, "Enable select (v)", 'zoom-button');
	this.callback_manager
	    .set('zoom_mode', function() {
		set_button(z, keys.brush_mode, "Enable select (v)");
	    }).set('brush_mode', function() {
		set_button(z, keys.zoom_mode, "Enable pan+zoom (z)");
	    });

	new_button(sel, keys.rotate, "Rotate (r)");
	new_button(sel, keys.delete, "Delete (^del)");
	new_button(sel, keys.extent, "Zoom extent (^0)");
	new_button(sel, keys.make_primary, "Make primary metabolite (p)");
	new_button(sel, keys.cycle_primary, "Cycle primary metabolite (c)");
	new_button(sel, keys.direction_arrow_left, "<");
	new_button(sel, keys.direction_arrow_up, "^");
	new_button(sel, keys.direction_arrow_down, "v");
	new_button(sel, keys.direction_arrow_right, ">");
	new_button(sel, keys.undo, "Undo (^z)");
	new_button(sel, keys.redo, "Redo (^Shift z)");
	return sel;

	// definitions
	function load_map_for_file(error, map_data) {
	    if (error) console.warn(error);
	    this.o.map_data = map_data;
	    this.reload_builder();
	}
	function load_flux_for_file(error, data) {
	    if (error) console.warn(error);
	    this.map.set_flux(data);
	}
	function load_node_data_for_file(error, data) {
	    if (error) console.warn(error);
	    this.map.set_node_data(data);
	}
	function new_button(s, key, name, id) {
	    var button = s.append("button").attr("class", "command-button");
	    if (id !== undefined) button.attr('id', id);
	    return set_button(button, key, name);
	}
	function set_button(button, key, name) {
	    button.text(name).on("click", function() {
		key.fn.call(key.target);
	    });
	    return button;
	}
	function new_input(s, fn, target, name) {
	    /* 
	     * Returns a function that can be called to programmatically
	     * load files.
	     */
	    var input = s.append("input")
		    .attr("type", "file")
		    .style("display", "none")
		    .on("change", function() { utils.load_json(this.files[0], fn, target); });
	    s.append("button")
		.attr("class", "command-button")
		.text(name)
		.on('click', function(e) {
	    	    input.node().click();
		});
	    return function() { input.node().click(); };
	}
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
	    was_enabled.node_click = map.behavior.node_click!=null;
	    map.behavior.toggle_node_click(false);
	});
	map.callback_manager.set('end_rotation', function() {
	    brush.toggle(was_enabled.brush);
	    zoom_container.toggle_zoom(was_enabled.zoom);
	    map.behavior.toggle_node_click(was_enabled.node_click);
	    was_enabled = {};
	});
    }

    function _get_keys(map, input, brush) {
	return {
            toggle_input: { key: 191, // forward slash '/'
			    target: input,
			    fn: input.toggle },
            save: { key: 83, modifiers: { control: true }, // ctrl-s
		    target: map,
		    fn: map.save },
            // save_cmd: { key: 83, modifiers: { command: true }, // command-s
	    // 		       fn: save },
            save_svg: { key: 83, modifiers: { control: true, shift: true }, // ctrl-Shift-s
			target: map,
			fn: map.save_svg },
            load: { key: 79, modifiers: { control: true }, // ctrl-o
		    fn: null }, // defined by button
	    load_flux: { key: 70, modifiers: { control: true }, // ctrl-f
			 fn: null }, // defined by button
	    toggle_beziers: { key: 66,
			      target: map,
			      fn: map.toggle_beziers,
			      ignore_with_input: true  }, // b
	    zoom_mode: { key: 90, // z 
			 target: this,
			 fn: this.zoom_mode,
			 ignore_with_input: true },
	    brush_mode: { key: 86, // v
			  target: this,
			  fn: this.brush_mode,
			  ignore_with_input: true },
	    rotate: { key: 82, // r
		      target: map,
		      fn: map.rotate_selected_nodes,
		      ignore_with_input: true },
	    delete: { key: 8, modifiers: { control: true }, // ctrl-del
		      target: map,
		      fn: map.delete_selected,
		      ignore_with_input: true },
	    extent: { key: 48, modifiers: { control: true }, // ctrl-0
		      target: map,
		      fn: map.zoom_extent },
	    make_primary: { key: 80, // p
			    target: map,
			    fn: map.make_selected_node_primary,
			    ignore_with_input: true },
	    cycle_primary: { key: 67, // c
			     target: map,
			     fn: map.cycle_primary_node,
			     ignore_with_input: true },
	    direction_arrow_right: { key: 39, // right
				     target: map.direction_arrow,
				     fn: map.direction_arrow.right,
				     ignore_with_input: true },
	    direction_arrow_down: { key: 40, // down
				    target: map.direction_arrow,
				    fn: map.direction_arrow.down,
				    ignore_with_input: true },
	    direction_arrow_left: { key: 37, // left
				    target: map.direction_arrow,
				    fn: map.direction_arrow.left,
				    ignore_with_input: true },
	    direction_arrow_up: { key: 38, // up
				  target: map.direction_arrow,
				  fn: map.direction_arrow.up,
				  ignore_with_input: true },
	    undo: { key: 90, modifiers: { control: true },
		    target: map.undo_stack,
		    fn: map.undo_stack.undo },
	    redo: { key: 90, modifiers: { control: true, shift: true },
		    target: map.undo_stack,
		    fn: map.undo_stack.redo }
	};
    }
});

define('vis/data-menu',["vis/utils", "lib/d3"], function(utils, d3) {
    return function(options) {
        var o = utils.set_options(options, {
            selection: d3.select("body"),
            getdatafiles: null,
            datafiles: null,
            update_callback: null,
	    target: null});

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

define('main',["builder/Builder", "builder/KeyManager", "vis/data-menu"],
       function(bu, km, dm) {
           return { Builder: bu,
		    KeyManager: km,
		    DataMenu: dm };
       });

    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('main');
}));