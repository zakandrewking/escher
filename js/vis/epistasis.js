var Epistasis = function() {
    var s = {};

    s.data = [];
    s.selection = [];
    s.update_size = function() {
        var width = s.width,
            height = s.height;

        var ns = s.selection.select("svg")
                .attr("width", width + s.margins.left + s.margins.right)
                .attr("height", height + s.margins.top + s.margins.bottom);
        ns.select('g').attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")");

        s.x.range([1, width]);
        s.y.range([height, 1]);

        s.xAxis.scale(s.x);
        s.yAxis.scale(s.y);

        s.selection.select('.x.axis')
            .attr("transform", "translate(0," + height + ")")
            .call(s.xAxis)
            .select('text')
            .attr("x", width);
        s.selection.select('.y.axis')
            .call(s.yAxis);

        s.selection.select(".points").selectAll('path')
            .attr("transform", function (d) {
                return "translate(" + s.x(d.f1) + "," + s.y(d.f2) + ")";
            });

        s.selection.select(".trendline").select('path')
            .attr("d", s.line([[s.x(s.dom.x[0]), s.y(s.dom.y[0])], [s.x(s.dom.x[1]), s.y(s.dom.y[1])]]));

        return this;
    };
    s.update = function() {
        // load data
        var rxn_list = s.data.sorted_rxns,
            name_function = function(x, i) { return {'name': x, 'index': i}; },
            names = s.data.sorted_names.map(name_function),
            y_names = names,
            size = s.data.sorted_names.length,
            cases = s.data.cases,
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

        // generate svg from scratch
        s.selection.select('svg').remove();

        var svg = s.selection.append("svg")
                .attr("width", s.width + s.margins.left + s.margins.right)
                .attr("height", s.height + s.margins.top + s.margins.bottom);
        var box_s = d3.min([Math.floor((s.width-s.margins.right)/size),
                            Math.floor((s.height-s.margins.bottom)/size)]),
            rect_color = d3.scale.linear()
                .domain([d3.min(data, function(x) {return x.ep;}),
                         0,
                         d3.max(data, function(x) {return x.ep;})])
                .range(["#EF8A62", "#F7F7F7", "#67A9CF"]),
            rect_stroke = d3.scale.linear()
                .domain([d3.min(data, function(x) {return x.min_max_diff;}),
                         d3.max(data, function(x) {return x.min_max_diff;})])
                .range([1,4]); 	// use .range([1,1]) for constant 1px borders

        // draw boxes
        var axis_disp = {'x': s.margins.left, 'y': s.margins.top};

        svg.append('clipPath')
            .attr('id', 'clip-top')
            .append('path')
            .attr('d', 'M 0 0 L 0 '+box_s+' L '+box_s+' 0 L 0 0');
        svg.append('clipPath')
            .attr('id', 'clip-bottom')
            .append('path')
            .attr('d', 'M 0 '+box_s+' L '+box_s+' 0 L '+box_s+' '+box_s+' L 0 '+box_s);

        var make_rect = function(s) {
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
        var make_rect_outline = function(s) {
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
                                                Math.floor(rect_stroke(d.min_max_diff))/2 - 0.5] + ')';
                })
                .style('stroke-width', function(d) {
                    if (d.empty==true) return 1;
                    else return Math.floor(rect_stroke(d.min_max_diff)); });
        };
        var update_rect = function(s) {
            // update
            s.attr('transform', function(d) { return 'translate(' +
                                              (d.index_x*box_s) + ',' +
                                              (d.index_y*box_s) + ')'; });
        };
        var make_circles = function(s) {
            var rad = Math.floor(box_s/4);
            s.append('g')
                .attr('height', box_s)
                .attr('width', box_s)
                .attr('clip-path', 'url(#clip-top)')
                .append('circle')
                .attr('class', 'circle y-circle')
                .attr('r', rad)
                .attr('transform', function(d) {
                    // d.p2/100 = rad^2/2*(Math.PI/180*angle - Math.sin(angle)) / (Math.PI*rad^2)
                    // cos(angle/2) = d1 / rad
                    // d1 = sqrt(m_x^2 + m_y^2)

                    // gross approximation
                    var dir = ((d.p_y-50.0)*rad/50.0) > 0,
                        m = Math.sqrt( Math.pow( ((d.p_y-50.0)*rad/50.0) , 2) / 2.0 );
                    if (dir) m = m * -1;
                    return 'translate('+(box_s/2+m)+','+(box_s/2+m)+')';
                });
            s.append('g')
                .attr('height', box_s)
                .attr('width', box_s)
                .attr('clip-path', 'url(#clip-bottom)')
                .append('circle')
                .attr('class', 'circle x-circle')
                .attr('r', rad)
                .attr('transform', function(d) {
                    // gross approximation
                    var dir = ((d.p_x-50.0)*rad/50.0) > 0,
                        m = Math.sqrt( Math.pow( ((d.p_x-50.0)*rad/50.0) , 2) / 2.0 );
                    if (dir) m = m * -1;
                    return 'translate('+(box_s/2-m)+','+(box_s/2-m)+')';
                });
        };

        // make empty rects
        for (var i=0, empty_data = []; i<size; i++) {
            empty_data.push({ empty: true,
                              index_x: i,
                              index_y: i });
        }
        var empty = svg.append("g")
                .attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")")
                .selectAll('.cell')
                .data(empty_data);
        empty.enter()
            .append('g')
            .attr('class', 'cell')
            .call(make_rect);
        // update
        empty.call(update_rect);

        // make filled rects
        var sel = svg.append("g")
                .attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")")
                .selectAll('.cell')
                .data(data);
        sel.enter()
            .append('g')
            .attr('class', 'cell')
            .call(make_rect)
            .call(make_circles);
        // update
        sel.call(update_rect);
 
        // make rect outlines
	var empty_outline = svg.append("g")
                .attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")")
                .selectAll('.cell-outline')
                .data(empty_data);
        empty_outline.enter()
            .append('g')
            .attr('class', 'cell-outline')
            .call(make_rect_outline);
        // update
        empty_outline.call(update_rect);
        var outline = svg.append("g")
                .attr("transform", "translate(" + s.margins.left + "," + s.margins.top + ")")
                .selectAll('.cell-outline')
                .data(data);
        outline.enter()
            .append('g')
            .attr('class', 'cell-outline')
            .call(make_rect_outline);
        // update
        outline.call(update_rect);


        // make x labels
        var x_labels = svg.append('g')
                .attr('class','labels')
                .selectAll('.x-label')
                .data(names);
        x_labels.enter()
            .append('text')
            .attr('class','x-label')
            .text(function (d) { return d.name; });
        x_labels.attr('transform', function(d) { return 'translate(' +
                                                 (d.index*box_s + box_s/3 + s.margins.left) + ',' +
                                                 (s.height - s.margins.bottom + 25) + ') '+
                                                 'rotate(' + 45 + ')'; });

        // make xylabels
        var y_labels = svg.append('g')
                .attr('class','labels')
                .selectAll('.y-label')
                .data(y_names);
        y_labels.enter()
            .append('text')
            .attr('class','y-label')
            .attr('text-anchor', 'end')
            .text(function (d) { return d.name; });
        y_labels.attr('transform', function(d) { return 'translate(' +
                                                 (s.margins.left - 3) + ',' +
                                                 (d.index*box_s + box_s/2 + s.margins.top) + ') '+
                                                 'rotate(' + 0 + ')'; });

        // make flux arrows
        var g = svg.append('g')
                .attr('class', 'flux-arrows')
                .attr('transform', 'translate('+(s.width/2+80)+','+(s.height/2-80)+')rotate(45)');
        g.append('text')
            .text('High flux')
            .attr('transform', 'translate('+(-s.width/2+50)+',0)');
        g.append('text')
            .text('Low flux')
            .attr('transform', 'translate('+(s.width/2-50)+',0)');

        // make legend
        var legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate('+(s.width-100)+','+(30)+')');
        var range = rect_color.range();
        var gradient = svg.append('defs')
                .append('linearGradient')
                .attr('id', 'gradient');
        gradient.append('stop')
            .attr('fill', range[0])
            .attr('offset', '0%');
        gradient.append('stop')
            .attr('fill', range[1])
            .attr('offset', '50%');
        gradient.append('stop')
            .attr('fill', range[2])
            .attr('offset', '100%');
        legend.append('rect')
            .attr('class', 'legend-gradient')
            .attr('width', 60)
            .attr('height', 150)
            .attr('fill', 'url(#gradient)');

        return this;
    };

    s.setup = function(options) {
        if (typeof options === 'undefined') options = {};
        s.selection = options.selection || d3.select('body');
        s.margins = options.margins  || {top: 10, right: 10, bottom: 40, left: 70};
        s.width = options.width || 700;
        s.height = options.heigh || 700;
        var default_filename_index = 0;
        return this;
    };

    s.collect_data = function(json) {
        s.data = json;
        s.update();
        return this;
    };

    return {
        setup: s.setup,
        update: s.update,
        update_size: s.update_size,
        collect_data: s.collect_data
    };
};
