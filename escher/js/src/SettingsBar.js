define(["utils", "CallbackManager", "lib/bacon"], function(utils, CallbackManager, bacon) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
			    is_visible: is_visible,
			    toggle: toggle,
			    record_state: record_state,
			    abandon_changes: abandon_changes,
			    scale_gui: scale_gui };

    return SearchBar;

    // instance methods
    function init(sel, settings, map) {
	this.settings = settings;
	this.changed = false;
	this.saved_settings = null;

	// TODO make sure updated scales stay updated after loading a new dataset/map

	var container = sel.append('div')
		.attr('class', 'settings-box')
		.style('display', 'none');

	// done button
	container.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.toggle(false);
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-ok");
	// quit button
	container.append('button')
	    .attr("class", "btn btn-sm btn-default close-button")
	    .on('click', function() {
		this.abandon_changes();
		this.toggle(false);
	    }.bind(this))
	    .append("span").attr("class",  "glyphicon glyphicon-remove");
	
	// reaction data
	(function() {	
	    container.append('div')
		.text('Reaction data').attr('class', 'settings-section-heading');
	    this.scale_gui(container.append('div'), 'reaction');
	}.bind(this))();

	// metabolite data
	(function() {
	    container.append('div').text('Metabolite data')
		.attr('class', 'settings-section-heading');
	    this.scale_gui(container.append('div'), 'metabolite');
	}.bind(this))();

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
	    this.changed = true;
	    this.selection.style("display", "block");
	    this.selection.select('input').node().focus();
	    // escape key
	    this.escape = this.map.key_manager
		.add_escape_listener(function() {
		    this.changed = false;
		    this.toggle(false); 
		}.bind(this));
	    // record the state
	    this.record_state();
	    // run the show callback
	    this.callback_manager.run('show');
	} else {
	    // draw on finish
	    if (this.changed) this.map.draw_everything();
	    this.changed = false;

	    this.selection.style("display", "none");	    
	    if (this.escape) this.escape.clear();
	    this.escape = null;
	    // run the hide callback
	    this.callback_manager.run('hide');
	}
    }
    function record_state() {
    }
    function abandon_changes() {
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
			    	settings.set_auto_domain(type, event.target.checked);
			    });
			
			// subscribe to changes in the model
			settings.auto_domain_stream[type].onValue(function(on_off) {
			    // check the box if auto domain on
			    this.checked = on_off;
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

	    var styles = ['Abs', 'Size', 'Color', 'Text'],
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
