define(["utils", "lib/bacon"], function(utils, bacon) {
    /** An interactive UI to edit color and size scales.

     Attributes
     ----------

     sel: A d3 selection.

     type: A type, that should be unique on the page.

     settings: The Settings object.

     */

    var ScaleEditor = utils.make_class();
    // instance methods
    ScaleEditor.prototype = { init: init,
                              update: update };
    return ScaleEditor;

    // instance methods
    function init(sel, type, settings, get_data_statistics) {
        // sels
        var grad_id = 'grad' + type + this.unique_string;
        this.w = 400;
        this.h = 30;
        this.x = 20;
        this.input_width = 90;
        this.input_height = 24;
        var b = sel.append('div')
                .attr('class', 'live-scale-container');
        this.input_label_group = b.append('div');
        var c = b.append('div')
                .attr('class', 'live-scale-centered');
        this.add_group = c.append('div');
        this.trash_group = c.append('div')
            .attr('class', 'live-scale-trash-container');
        var svg = c.append('svg')
                .attr('class', 'live-scale');
        this.input_group = c.append('div')
            .attr('class', 'live-scale-input-container');
        this.gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', grad_id);
        svg.append('rect')
            .attr('class', 'live-scale-rect')
            .attr('fill', 'url(#' + grad_id + ')')
            .attr('width', this.w + 'px')
            .attr('height', this.h + 'px')
            .attr('x', this.x + 'px'),
        this.pickers_group = svg.append('g');

        // settings
        this.type = type;
        this.settings = settings;
        this.get_data_statistics = get_data_statistics;
        
        var unique_map_id = this.settings.get_option('unique_map_id');
        this.unique_string = (unique_map_id === null ? '' : '.' + unique_map_id);

        // collect data
        this.settings.streams[type + '_scale'].onValue(function(scale) {
            this.scale = scale;
            this.update();
        }.bind(this));
    }

    function update() {
        var scale = this.scale,
            stats = this.get_data_statistics()[this.type],
            sc = d3.scale.linear()
                .domain([0, this.w])
                .range([stats.min, stats.max]),
            sc_size = d3.scale.linear()
                .domain([0, this.w])
                .range([0, stats.max - stats.min]),
            bar_w = 14,
            bar_h = 35,
            x_disp = this.x;

        // must have max and min
        if (stats.max === null || stats.min === null)
            scale = [];

        // ---------------------------------------------------------------------
        // convenience functions
        var bring_to_front = function(d, i) {
            // bring an input set to the front 
            this.input_group.selectAll('.live-scale-input-set').each(function(d2) {
                d3.select(this).classed('selected-set', d === d2);
            });
        }.bind(this);
        
        var get_this_val = function(d) {
            return (d.type == 'value') ? d.value : stats[d.type];
        };
        
        var set_scale = function(scale) {
            this.settings.set_conditional(this.type + '_scale', scale);
            this.scale = scale;
            this.update();
        }.bind(this);

        // ---------------------------------------------------------------------
        // make the gradient
        var stops = this.gradient.selectAll('stop')
                .data(scale);
        stops.enter()
            .append('stop');
        stops.attr('offset', function(d) {
            return ((get_this_val(d) - stats.min) / (stats.max - stats.min)) * 100 + '%';
        }).style('stop-color', function (d) {
            return d.color;
        });
        stops.exit().remove();

        // ---------------------------------------------------------------------
        // make the pickers
        var pickers = this.pickers_group
                .selectAll('.picker')
                .data(scale);
        // drag 
        var drag = d3.behavior.drag();
        drag.on('drag', function(d, i) {
            if (i == 0 || i == scale.length - 1 || scale[i].type != 'value')
                return;
            // change the model on drag
            var new_d = scale[i].value + sc_size(d3.event.dx),
                buf = sc_size(bar_w + 2);
            if (new_d > stats.max - buf) new_d = stats.max - buf;
            if (new_d < stats.min + buf) new_d = stats.min + buf;
            // round to 2 decimals
            new_d = Math.floor(new_d * 100.0) / 100.0;
            scale[i].value = new_d;
            this.settings.set_conditional(this.type + '_scale', scale);
            this.scale = scale;
            this.update();
        }.bind(this));
        // enter
        pickers.enter()
            .append('g')
            .attr('class', 'picker')
            .style('cursor', 'pointer')
            .append('rect');
        // update
        pickers.select('rect')
            .attr('x', function(d, i) {
                return sc.invert(get_this_val(d)) - (bar_w / 2) + x_disp;
            })
            .attr('width', bar_w + 'px')
            .attr('height', bar_h + 'px')
            .call(drag)
            .on('mousedown', bring_to_front);
        // exit
        pickers.exit().remove();

        // ---------------------------------------------------------------------
        // make the delete buttons
        var trashes = this.trash_group.selectAll('span')
                .data(scale);
        // enter
        trashes.enter()
            .append('span');
        // update
        trashes.attr('class', function(d, i) {
            if (i == 0 || i == scale.length - 1)
                return null;
            return 'live-scale-trash glyphicon glyphicon-trash';
        }).style('left', function(d) {
            return sc.invert(get_this_val(d)) - (bar_w / 2) + x_disp + 'px';
        }).on('click', function (d, i) {
            if (i == 0 || i == scale.length - 1)
                return;
            scale = scale.slice(0, i).concat(scale.slice(i + 1));
            this.settings.set_conditional(this.type + '_scale', scale);
            this.scale = scale;
            this.update();
        }.bind(this));
        // exit
        trashes.exit().remove();

        // ---------------------------------------------------------------------
        // make the add button
        var add = this.add_group.selectAll('.add')
                .data(['add']);
        // enter
        add.enter()
            .append('span')
            .attr('class', 'add glyphicon glyphicon-plus');
        // update
        add.on('click', function (d) {
            var new_d = (stats.max + stats.min) / 2,
                buf = sc_size(bar_w + 2),
                last_ind = 0;
            // try to make the new point not overlap
            for (var j = 0, l = domain.length; j < l; j++) {
                if (Math.abs(domain[j] - new_d) < buf) {
                    new_d = new_d + buf;
                    if (new_d > stats.max - buf) new_d = stats.max - buf;
                    if (new_d < stats.min + buf) new_d = stats.min + buf;
                }
                if (new_d > domain[j])
                    last_ind = j;
            }
            // add
            domain = domain.slice(0, last_ind + 1)
                .concat([new_d])
                .concat(domain.slice(last_ind + 1));
            color_range = color_range.slice(0, last_ind + 1)
                .concat(color_range.slice(last_ind, last_ind + 1))
                .concat(color_range.slice(last_ind + 1));           
            size_range = size_range.slice(0, last_ind + 1)
                .concat(size_range.slice(last_ind, last_ind + 1))
                .concat(size_range.slice(last_ind + 1)); 
            this.settings.set_domain(this.type, domain);
            this.settings.set_range(this.type, 'color', color_range);
            this.settings.set_range(this.type, 'size', size_range);
            this.scale = scale;
            this.update(scale);
        }.bind(this));
        // exit
        add.exit().remove();
        
        // ---------------------------------------------------------------------
        // input labels
        var labels = this.input_label_group.selectAll('.live-scale-label')
                .data(['Value:', 'Color:', 'Size:']);
        // enter
        labels.enter().append('div').attr('class', 'live-scale-label');
        // update
        labels
            .style('top', function(d, i) {
                return 56 + (i * this.input_height) + 'px';
            }.bind(this))
            .text(function(d) { return d; });
        // exit
        labels.exit().remove();
        
        // ---------------------------------------------------------------------
        // inputs
        var inputs = this.input_group.selectAll('.live-scale-input-set')
                .data(scale);
        
        // enter
        var i = inputs.enter()
                .append('div')
                .attr('class', 'live-scale-input-set');
        i.append('input')
            .attr('class', 'live-scale-input domain-input')
            .style('width', this.input_width + 'px');
        var select = i.append('select')
                .attr('class', 'live-scale-input domain-type-picker');
        select.append('option').attr('value', 'median').text('Median');
        select.append('option').attr('value', 'value').text('Value');
        i.append('input')
            .attr('class', 'live-scale-input color-input')
            .style('width', this.input_width + 'px');
        i.append('input')
            .attr('type', 'color')
            .style('visibility', function() {
                // hide the input if the HTML5 color picker is not supported
                return (this.type == 'text') ? 'hidden' : null;
            })
            .attr('class', 'live-scale-input color-picker');
        i.append('input')
            .attr('class', 'live-scale-input size-input')
            .style('width', this.input_width + 'px');
        
        // update
        inputs.style('width', this.input_width + 'px')
            .style('left', function(d) {
                var l = sc.invert(get_this_val(d)) - (bar_w / 2) + x_disp;
                // don't go over the right edge of the bar
                if (l + this.input_width > this.w + this.x)
                    l = l - this.input_width + (bar_w / 2);
                return l + 'px';
            }.bind(this));
        
        inputs.select('.domain-input')
            .style('height', this.input_height + 'px')
            .each(function (d, i) {
                if (i == 0) { 
                   this.value = 'Min (' + get_this_val(d) + ')';
                    this.disabled = true;
                } else if (i == scale.length - 1) {
                    this.value = 'Max (' + get_this_val(d) + ')';
                    this.disabled = true;
                }  else {
                    this.value = get_this_val(d);
                    this.disabled = false;
                }
            }).on('change', function(d, i) {
                var buf = sc_size(bar_w + 2),
                    new_d = parseFloat(this.value);
                if (new_d < stats.min + buf) new_d = stats.min + buf;
                if (new_d > stats.max - buf) new_d = stats.max - buf;
                scale[i].value = new_d;
                set_scale(scale);
            });
        inputs.select('.domain-type-picker')
            .style('visibility', function(d, i) {
                return (i == 0 || i == scale.length - 1) ? 'hidden' : null;
            })
            .style('left', (this.input_width - 20) + 'px')
            .style('width', '20px')
            .each(function (d, i) {
                this.selectedIndex = 0;
            }).on('change', function(d, i) {
                // set_domain(domain);
            });
        inputs.select('.color-input')
            .style('height', this.input_height + 'px')
            .style('top', this.input_height + 'px')
            .each(function (d, i) {
                this.value = d.color;
            }).on('change', function(d, i) {
                scale[i].color = this.value;
                set_scale(scale);
            });
        inputs.select('.color-picker')
            .style('left', (this.input_width - this.input_height) + 'px')
            .style('top', this.input_height + 'px')
            .style('width', this.input_height + 'px')
            .style('height', this.input_height + 'px')
            .each(function (d, i) {
                this.value = d.color;
            }).on('change', function(d, i) {
                scale[i].color = this.value;
                set_scale(scale);
            });
        inputs.select('.size-input')
            .style('height', this.input_height + 'px')
            .style('top', this.input_height * 2 + 'px')
            .each(function (d, i) {
                this.value = d.size;
            }).on('change', function(d, i) {
                scale[i].size = parseFloat(this.value);
                set_scale(scale);
            });
        
        // exit
        inputs.exit().remove();
    }
});
