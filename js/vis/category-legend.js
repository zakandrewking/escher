var CategoryLegend = function() {
    var s = {};

    s.height_width = function(fillScreen, sel, margins) {
        if (fillScreen==true) {
            sel.style('height', (window.innerHeight-margins.bottom)+'px');
            sel.style('width', (window.innerWidth-margins.right)+'px');
        }
        var width = parseFloat(sel.style('width')) - margins.left - margins.right,
            height = parseFloat(sel.style('height')) - margins.top - margins.bottom;
        return {'width': width, 'height': height};
    };

    s.update = function(categories) {
        // clear the container and add again
        s.sub_selection.select("#legend-container").remove();
        var container = s.sub_selection.append("g").attr("id","legend-container");
        container.append("style")
            .attr('type', "text/css")
            .text(s.css);
        var svg = container.append("g")
                .attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")");


        // draw legend
        var radius = 10,
            legend_w = s.width;

        if (s.squares) {
            svg.selectAll('circle')
                .data(s.categories)
                .enter()
                .append('rect')
                .attr("class", "legend-circle")
                .attr('width', radius*2)
                .attr('height', radius*2)
		.attr("transform", function(d, i) {
		    return "translate("+(legend_w/2 - radius)+","+(i*25+20)+")";
		})
                .attr('fill', function (d) { return s.color_scale(d); });
        } else {
            svg.selectAll('circle')
                .data(s.categories)
                .enter()
                .append('circle')
                .attr("class", "legend-circle")
                .attr('r', radius)
                .attr("cx", legend_w/2 - radius)
                .attr("cy", function(d, i) { return i * 25+30; })
                .attr('fill', function (d) { return s.color_scale(d); });
        }
        svg.selectAll('text')
            .data(s.categories)
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

    s.setup = function (options) {
        // set defaults
        s.margins = {top: 20, right: 20, bottom: 30, left: 50};
        s.fillScreen = false;
        s.categories = [];
        s.css_path = "css/category-legend.css";
	s.squares = true;

        // manage options
        if (typeof options !== undefined) {
            if (options.margins !== undefined)    s.margins = options.margins;
            if (options.fillScreen !== undefined) s.fillScreen = options.fillScreen;
            if (options.categories !== undefined) s.categories = options.categories;
            if (options.squares !== undefined)    s.squares = options.squares;
	    if (options.css_path !== undefined)   s.css_path = options.css_path;
        }

        // set selection
        // sub selection places the graph in an existing svg environment
        var add_svg = function(s, fillScreen, margins) {
            var o = s.height_width(fillScreen, s, margins);
            return s.append('svg')
                .attr("width", o.width + margins.left + margins.right)
                .attr("height", o.height + margins.top + margins.bottom)
                .attr('xmlns', "http://www.w3.org/2000/svg");
        };
        if (options.sub_selection) {
            s.sub_selection = options.sub_selection;
            s.width = parseInt(s.sub_selection.attr("width"), 10);
            s.height = parseInt(s.sub_selection.attr("height"), 10);
        } else if (options.selection) {
            s.sub_selection = add_svg(options.selection, s.fillScreen, s.margins);
        } else {
            s.sub_selection = add_svg(d3.select('body').append('div'), s.fillScreen,
                                      s.margins);
        }

        s.color_scale = d3.scale.category20().domain(s.categories);

        // load the css
        d3.text(s.css_path, function(error, text) {
            if (error) {
                console.warn(error);
                s.css = "";
            } else {
                s.css = text;
            }
            s.update(s.categories);
            return null;
        });

        return this;
    };

    return {
        setup: s.setup,
        update: s.update,
        get_scale: function () { return s.color_scale; }
    };
};
