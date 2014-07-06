define(["utils", "CallbackManager"], function(utils, CallbackManager) {
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
    function init(sel, settings_manager, map) {
	this.settings_manager = settings_manager;
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
	    var current = map.get_scale('reaction', 'color').range(),
		range_fn = function(new_range) {
		    this.changed = true;
		    // set the last two elements of the range
		    var range_to_set = map.get_scale('reaction', 'color').range();
		    console.log(range_to_set);
		    range_to_set = range_to_set.slice(0, range_to_set.length-3)
			.concat(new_range);
		    map.set_scale('reaction', 'color', null, range_to_set);
		    console.log(range_to_set);
		}.bind(this);
	    this.scale_gui(container.append('div'), 3, current.slice(-3),
			   range_fn);
	}.bind(this))();

	// metabolite data
	(function() {
	    container.append('div').text('Metabolite data')
		.attr('class', 'settings-section-heading');
	    var current = map.get_scale('metabolite', 'color').range(),
		range_fn = function(new_range) {
		    this.changed = true;
		    // set the last two elements of the range
		    var range_to_set = map.get_scale('metabolite', 'color').range();
		    console.log(range_to_set);
		    range_to_set = range_to_set.slice(0, range_to_set.length-3)
			.concat(new_range);
		    map.set_scale('metabolite', 'color', null, range_to_set);
		    console.log(range_to_set);
		}.bind(this);
	    this.scale_gui(container.append('div'), 3, current.slice(-3), range_fn);
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
	    this.selection.style("display", "block");
	    this.selection.select('input').node().focus();
	    // escape key
	    this.escape = this.map.key_manager
		.add_escape_listener(function() { 
		    this.abandon_changes();
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
	this.saved_settings = this.settings_manager.get_state();
    }
    function abandon_changes() {
	if (this.changed && this.saved_settings!==null) {
	    this.settings_manager.set_state(this.saved_settings);
	}
	this.changed = false;
    }
    function scale_gui(s, count, range, callback) {
	/** A UI to edit color and size scales. */

	var t = s.append('table').attr('class', 'settings-section');

	var size_domain = [], color_domain = [];

	// columns
	var columns = [0, 1, 2];

	// numbers
	t.append('tr')
	    .selectAll('.settings-number')
	    .data([''].concat(columns))
	    .enter()
	    .append('td').attr('class', 'settings-number')
	    .text(function (d) { return d; });

	// domain
	(function() {
	    var r = t.append('tr');
	    r.append('td').text('domain');
	    var scale_bars = r.selectAll('.input-cell')
		    .data(columns);
	    scale_bars.enter()
		.append('td').attr('class', 'input-cell')
		.append('input').attr('class', 'scale-bar-input')
		.attr('value', function(d) { return range[d]; })
		.on('change', function(d) {
		    range[d] = this.value;
		    callback(range);
		});
	    
	    var z = r.append('td');
	    z.append('span').text('auto ');
	    z.append('input').attr('type', 'checkbox')
		.on('change', function() {
		    if (this.checked) {
			scale_bars.selectAll('input').attr('disabled', 'true');
		    } else {
			scale_bars.selectAll('input').attr('disabled', null);
		    }
		});
	})();
	
	// ranges
	(function() {
	    var r = t.append('tr');
	    r.append('td').text('size');
	    var scale_bars = r.selectAll('.input-cell')
		.data(columns);
	    scale_bars.enter()
		.append('td').attr('class', 'input-cell')
		.append('input').attr('class', 'scale-bar-input')
		.attr('value', function(d) { return size_domain[d]; })
		.on('change', function(d) {
		    size_domain[d] = this.value;
		    callback(size_domain);
		});
	})();

	(function() {
	    var r = t.append('tr');
	    r.append('td').text('color');
	    var scale_bars = r.selectAll('.input-cell')
		.data(columns);
	    scale_bars.enter()
		.append('td').attr('class', 'input-cell')
		.append('input').attr('class', 'scale-bar-input')
		.attr('value', function(d) { return color_domain[d]; })
		.on('change', function(d) {
		    color_domain[d] = this.value;
		    callback(color_domain);
		});
	})();
    }
});
