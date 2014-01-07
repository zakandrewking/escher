define(["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
	    selection: d3.select("body"),
	    selection_is_svg: false,
            margins: {top: 20, right: 20, bottom: 30, left: 50},
            fill_screen: false,
            categories: [],
            css_path: "css/category-legend.css",
            update_hook: false,
            squares: true,
	    labels_align: 'right',
	    colors: d3.scale.category20() });

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

        o.color_scale = o.colors.domain(o.categories);

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
            get_scale: function () { return o.color_scale; },
            update_hook: set_update_hook
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

	    var colors;
            if (o.squares) {
                colors = svg.selectAll('circle')
                    .data(o.categories)
                    .enter()
                    .append('rect')
                    .attr("class", "legend-circle")
                    .attr('width', radius*2)
                    .attr('height', radius*2)
                    .attr('fill', function (d) { return o.color_scale(d); });
            } else {
                colors = svg.selectAll('circle')
                    .data(o.categories)
                    .enter()
                    .append('circle')
                    .attr("class", "legend-circle")
                    .attr('r', radius)
                    .attr('fill', function (d) { return o.color_scale(d); });
            }
	  
            var text = svg.selectAll('text')
                .data(o.categories)
                .enter()
                .append('text')
                    .attr("class", "legend-text");

	    // align
	    if (o.labels_align=='left') {
                text.attr("text-anchor", "start")
                    .text(function (d) { return d; })
                    .attr('x', (4*radius))
                    .attr('y', function(d, i) {
			return (i*25)+30+radius/2;
                    });
		colors.attr("transform", function(d, i) {
                    return "translate("+(radius)+","+(i*25+20)+")";
                });
	    } else if (o.labels_align=='right') {
                text.attr("text-anchor", "end")
                    .text(function (d) { return d; })
                    .attr('x', legend_w/2 - (3*radius))
                    .attr('y', function(d, i) {
			return (i*25)+30+radius/2;
                    });
		colors.attr("transform", function(d, i) {
                    return "translate("+(legend_w/2 - radius)+","+(i*25+20)+")";
                });
	    }		
            if (o.update_hook) o.update_hook(svg);
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
        function set_update_hook(fn) {
            o.update_hook = fn;
            return this;
        };

    };
});
