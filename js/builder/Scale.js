define(["vis/utils"], function(utils) {
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
