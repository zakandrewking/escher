define(["utils", "CallbackManager", "lib/bacon"], function(utils, CallbackManager, bacon) {
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
			    scale_gui: scale_gui,
			    style_gui: style_gui,
			    view_gui: view_gui };

    return SearchBar;

    // instance methods
    function init(sel, settings, map) {
	this.sel = sel;
	this.settings = settings;
	this.draw = false;
        
        var unique_map_id = this.settings.get_option('unique_map_id');
        this.unique_string = (unique_map_id === null ? '' : '.' + unique_map_id);

	var background = sel.append('div')
		.attr('class', 'settings-box-background')
		.style('display', 'none'),
	    container = sel.append('div')
                .attr('class', 'settings-box-container')
		.style('display', 'none'),
            box = container.append('div')
		.attr('class', 'settings-box');

	// done button
	box.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.accept_changes();
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-ok");
	// quit button
	box.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.abandon_changes();
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-remove");

        // Tip
        box.append('div')
            .text('Tip: Hover over an option to see more details about it.')
            .style('font-style', 'italic');
        box.append('hr');
        
        // reactions
	box.append('div')
	    .text('Reactions').attr('class', 'settings-section-heading-large');
	this.scale_gui(box.append('div'), 'reaction');
	
	// reaction data
	box.append('div')
	    .text('Reaction or Gene data').attr('class', 'settings-section-heading');
	this.style_gui(box.append('div'), 'reaction');

	// metabolite data
        box.append('hr');
	box.append('div').text('Metabolites')
	    .attr('class', 'settings-section-heading-large');
	this.scale_gui(box.append('div'), 'metabolite');
	box.append('div').text('Metabolite data')
	    .attr('class', 'settings-section-heading');
	this.style_gui(box.append('div'), 'metabolite');
        
	// identifiers_on_map
        box.append('hr');
	box.append('div').text('View options')
	    .attr('class', 'settings-section-heading-large');
	this.view_gui(box.append('div'));
	
	this.callback_manager = new CallbackManager();

	this.map = map;
	this.selection = container;
        this.background = background;
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
	    this.background.style("display", "block");
	    this.selection.select('input').node().focus();
	    // escape key
	    this.escape = this.map.key_manager
		.add_escape_listener(function() {
		    this.abandon_changes();
		}.bind(this), 'settings');
	    // enter key
	    this.enter = this.map.key_manager
		.add_enter_listener(function() {
		    this.accept_changes();
		}.bind(this), 'settings');
	    // run the show callback
	    this.callback_manager.run('show');
	} else {
	    // draw on finish
	    if (this.draw) this.map.draw_everything();
	    // hide the menu
	    this.selection.style("display", "none");
	    this.background.style("display", "none");
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
    function scale_gui(sel, type) {
	/** A UI to edit color and size scales. */

	var t = sel.append('table').attr('class', 'settings-table');

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

	// no data
	var r = t.append('tr').append('td').attr('colspan', '5');
	[['color', 'No data color'], ['size', 'No data size']].forEach(function(range_type_ar) {
	    r.append('span').text(range_type_ar[1] + ':');
	    r.append('input').attr('class', 'no-data-input')
		.each(function() {
		    bacon.fromEventTarget(this, 'change')
			.onValue(function(event) {
			    settings.set_no_data_value(type, range_type_ar[0],
						       event.target.value);
			});

		    settings.no_data_stream[type][range_type_ar[0]].onValue(function(ar) {
		    	this.value = ar;
		    }.bind(this));
		});
	});

    }

    function style_gui(sel, type) {
	/** A UI to edit style.

         */

	var t = sel.append('table').attr('class', 'settings-table'),
	    settings = this.settings;

	// styles
	t.append('tr').call(function(r) {
	    r.append('td').text('Styles:').attr('class', 'options-label');
	    var cell = r.append('td');

	    var styles = [['Absolute value', 'abs'], ['Size', 'size'],
                          ['Color', 'color'], ['Text', 'text']],
		style_cells = cell.selectAll('.style-span')
		    .data(styles),
		s = style_cells.enter()
		    .append('span')
		    .attr('class', 'style-span');
	    s.append('span').text(function(d) { return d[0]; });

	    // make the checkbox
	    s.append('input').attr('type', 'checkbox')
		.each(function(d) {
		    // change the model when the box is changed
		    var change_stream = bacon
		    	    .fromEventTarget(this, 'change')
		    	    .onValue(function(event) {
		    		settings.change_data_style(type, d[1],
							   event.target.checked);
		    	    });
		    
		    // subscribe to changes in the model
		    settings.data_styles_stream[type].onValue(function(ar) {
			// check the box if the style is present
			this.checked = (ar.indexOf(d[1]) != -1);
		    }.bind(this));
		});
	});

        
	// compare_style
	t.append('tr').call(function(r) {
	    r.append('td')
                .text('Comparison:')
                .attr('class', 'options-label');
	    var cell = r.append('td');

	    var styles = [['Fold Change', 'fold'],
                          ['Log2(Fold Change)', 'log2_fold'],
                          ['Difference', 'diff']],
		style_cells = cell.selectAll('.style-span')
		    .data(styles),
		s = style_cells.enter()
		    .append('span')
		    .attr('class', 'style-span');
	    s.append('span')
                .text(function(d) { return d[0]; });

	    // make the checkbox
	    s.append('input').attr('type', 'radio')
                .attr('name', type + '_compare_style' + this.unique_string)
                .attr('value', function(d) { return d[1]; })
		.each(function(style) {
		    // change the model when the box is changed
		    var change_stream = bacon
		    	    .fromEventTarget(this, 'change')
		    	    .onValue(function(event) {
                                if (event.target.checked) {
                                    settings.set_compare_style(type, event.target.value);
                                }
		    	    });
		    
		    // subscribe to changes in the model
		    settings.compare_style_stream[type].onValue(function(value) {
		        // check the box for the new value
		        this.checked = (this.value == value);
		    }.bind(this));
		});
        }.bind(this));

        // gene-specific settings
        if (type=='reaction') {
	    var t = sel.append('table').attr('class', 'settings-table')
                    .attr('title', ('When evaluating a gene reaction rule, use ' +
                                    'this function to evaluate AND rules.'));
            
	    // and_method_in_gene_reaction_rule
	    t.append('tr').call(function(r) {
	        r.append('td')
                    .text('Method for evaluating AND:')
                    .attr('class', 'options-label-wide');
	        var cell = r.append('td');

	        var styles = [['Mean', 'mean'], ['Min', 'min']],
		    style_cells = cell.selectAll('.style-span')
		        .data(styles),
		    s = style_cells.enter()
		        .append('span')
		        .attr('class', 'style-span');
	        s.append('span')
                    .text(function(d) { return d[0]; });

	        // make the checkbox
	        s.append('input').attr('type', 'radio')
                    .attr('name', 'and_method_in_gene_reaction_rule' + this.unique_string)
                    .attr('value', function(d) { return d[1]; })
		    .each(function(style) {
		        // change the model when the box is changed
		        var change_stream = bacon
		    	        .fromEventTarget(this, 'change')
		    	        .onValue(function(event) {
                                    if (event.target.checked) {
                                        settings.set_and_method_in_gene_reaction_rule(event.target.value);
                                    }
		    	        });
		        
		        // subscribe to changes in the model
		        settings.and_method_in_gene_reaction_rule_stream.onValue(function(value) {
		            // check the box for the new value
		            this.checked = (this.value == value);
		        }.bind(this));
		    });
            }.bind(this));

        }
    }
        
    function view_gui(s, option_name, string, options) {

	var t = s.append('table').attr('class', 'settings-table');

	// columns
	var settings = this.settings;

	// styles
	t.append('tr').call(function(r) {
	    r.append('td').text('Identifiers:').attr('class', 'options-label');
	    var cell = r.append('td');

	    var options = [['ID\'s', 'bigg_id'], ['Names', 'name']],
		style_cells = cell.selectAll('.style-span')
		    .data(options),
		s = style_cells.enter()
		    .append('span')
		    .attr('class', 'style-span');
	    s.append('span').text(function(d) { return d[0]; });

	    // make the checkbox
	    s.append('input').attr('type', 'radio')
		.attr('name', 'identifiers_on_map' + this.unique_string)
		.attr('value', function(d) { return d[1]; })
		.each(function(style) {
		    // change the model when the box is changed
		    var change_stream = bacon
		    	.fromEventTarget(this, 'change')
		    	.onValue(function(event) {
			    settings.set_identifiers_on_map(event.target.value);
		    	});
		    
		    // subscribe to changes in the model
		    settings.identifiers_on_map_stream.onValue(function(value) {			
			// check the box if the style is present
			this.checked = (value == this.value);
		    }.bind(this));
		});

	}.bind(this));

    }
});
