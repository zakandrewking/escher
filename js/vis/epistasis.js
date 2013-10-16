define(["./scaffold", "lib/d3"], function (scaffold, d3) {
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
