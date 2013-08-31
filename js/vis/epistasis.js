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
            names = s.data.sorted_names.slice(0, -1).map(name_function),
	    y_names = s.data.sorted_names.slice(1).map(name_function),
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
                p_2 = c['p2'];
            if (index_1 < index_2) {
                n['index_x'] = index_1;
                n['index_y'] = index_2 - 1; // y index start at 2nd entry
                n['p_x'] = p_1;
                n['p_y'] = p_2;
            } else {
                n['index_x'] = index_2;
                n['index_y'] = index_1 - 1;
                n['p_x'] = p_2;
                n['p_y'] = p_1;
            }
            n['ep'] = c[ep_type];
            data.push(n);
        }
        console.log(data);

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
                .range(["#67A9CF", "#F7F7F7", "#EF8A62"]);

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
                .attr('fill', function (d) { return rect_color(d.ep); });
        };
        var make_circles = function(s) {
	    var rad = Math.floor(box_s/4);
	    s.append('line')
		.attr('x1', 0)
		.attr('x2', box_s)
		.attr('y1', 0)
		.attr('y2', box_s);
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
        sel.attr('transform', function(d) { return 'translate(' +
                                            (d.index_x*box_s) + ',' +
                                            (d.index_y*box_s) + ')'; });

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
                                                 (s.height - s.margins.bottom - 5) + ') '+
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
        return this;
    };

    s.setup = function(options) {
        if (typeof options === 'undefined') options = {};
        s.selection = options.selection || d3.select('body');
        s.margins = options.margins  || {top: 10, right: 10, bottom: 40, left: 70};
        s.width = options.width || 600;
        s.height = options.heigh || 600;
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
