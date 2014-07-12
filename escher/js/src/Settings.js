define(["utils", "lib/bacon"], function(utils, bacon) {
    /** 
     */

    var SearchBar = utils.make_class();
    // class methods
    SearchBar.check_type = check_type;
    // instance methods
    SearchBar.prototype = { init: init,
			    change_data_style: change_data_style,
			    set_auto_domain: set_auto_domain,
			    set_domain_value: set_domain_value,
			    set_domain: set_domain,
			    set_range_value: set_range_value,
			    hold_changes: hold_changes,
			    abandon_changes: abandon_changes,
			    accept_changes: accept_changes };

    return SearchBar;

    // class methods
    function check_type(type) {
	if (['reaction', 'metabolite'].indexOf(type)==-1)
	    throw new Error('Bad type');
    }

    // instance methods
    function init(reaction_data_styles, auto_reaction_domain, 
		  metabolite_data_styles, auto_metabolite_domain) {
	this.data_styles = {};
	this.data_styles_bus = {};
	this.data_styles_stream = {};
	this.auto_domain = {};
	this.auto_domain_bus = {};
	this.auto_domain_stream = {};
	this.domain = {};
	this.domain_bus = {};
	this.domain_stream = {};
	this.range = {};
	this.range_bus = {};
	this.range_stream = {};

	// manage accepting/abandoning changes
	this.status_bus = new bacon.Bus();

	// force an update of ui components
	this.force_update_bus = new bacon.Bus();

	// modify bacon.observable
	bacon.Observable.prototype.convert_to_conditional_stream = convert_to_conditional_stream;
	bacon.Observable.prototype.force_update_with_bus = force_update_with_bus;

	var default_domain = { reaction: [-10, 0, 10],
			       metabolite: [-10, 0, 10] },
	    default_range = { reaction: { color: ['green', 'rgb(200,200,200)', 'red'],
					  size: [4, 6, 12] },
			      metabolite: { color: ['green', 'white', 'red'],
					    size: [6, 8, 10] } };

	['metabolite', 'reaction'].forEach(function(type) {
	    // set up the styles settings
	    this.data_styles_bus[type] = new bacon.Bus();
	    // make the event stream
	    this.data_styles_stream[type] = this.data_styles_bus[type]
	    // conditionally accept changes
		.convert_to_conditional_stream(this.status_bus)
	    // combine into state array
		.scan([], function(current, event) {
		    if (event===null)
			return current;
		    // add or remove the property from the stream
		    if (event.on_off && current.indexOf(event.style) == -1) {
			// if it is checked, add the style
			return current.concat([event.style]);
		    } else if (!event.on_off && current.indexOf(event.style) != -1) {
			// if not, remove the style
			return current.filter(function(v) {
			    return v != event.style;
			});
		    }
		    // otherwise, return unchanged
		    return current;
		})
	    // force updates
		.force_update_with_bus(this.force_update_bus);

	    // get the latest
	    this.data_styles_stream[type].onValue(function(v) {
		this.data_styles[type] = v;
	    }.bind(this));

	    // push the defaults
	    var def = (type=='reaction' ? reaction_data_styles : metabolite_data_styles);
	    def.forEach(function(x) {
	    	this.data_styles_bus[type].push({ style: x, on_off: true });
	    }.bind(this));

	    // set up the auto_domain settings
	    this.auto_domain_bus[type] = new bacon.Bus();
	    this.auto_domain_stream[type] = this.auto_domain_bus[type]
	    // conditionally accept changes
		.convert_to_conditional_stream(this.status_bus)
	    // force updates
		.force_update_with_bus(this.force_update_bus);

	    // get the latest
	    this.auto_domain_stream[type].onValue(function(v) {
		this.auto_domain[type] = v;
	    }.bind(this));

	    // set the default
	    var def = (type=='reaction' ? auto_reaction_domain : auto_metabolite_domain);
	    this.auto_domain_bus[type].push(def);

	    // set up the domain
	    // make the bus
	    this.domain_bus[type] = new bacon.Bus();
	    // make a new constant for the input default
	    this.domain_stream[type] = this.domain_bus[type]
	    // conditionally accept changes
		.convert_to_conditional_stream(this.status_bus)
	    // combine into state array
		.scan([], function(current, event) {
		    current[event.index] = event.value;
		    return current;
		})
	    // force updates
		.force_update_with_bus(this.force_update_bus);

	    // get the latest
	    this.domain_stream[type].onValue(function(v) {
		this.domain[type] = v;
	    }.bind(this));

	    // push the defaults
	    var def = default_domain[type];
	    def.forEach(function(x, i) { 
		this.domain_bus[type].push({ index: i, value: x });
	    }.bind(this));

	    // set up the ranges
	    this.range_bus[type] = {};
	    this.range_stream[type] = {};
	    this.range[type] = {};
	    ['color', 'size'].forEach(function(range_type) {
		// make the bus
		this.range_bus[type][range_type] = new bacon.Bus();
		// make a new constant for the input default
		this.range_stream[type][range_type] = this.range_bus[type][range_type]
		// conditionally accept changes
		    .convert_to_conditional_stream(this.status_bus)
		// combine into state array
		    .scan([], function(current, event) {
			current[event.index] = event.value;
			return current;
		    })
		// force updates
		    .force_update_with_bus(this.force_update_bus);

		// get the latest
		this.range_stream[type][range_type].onValue(function(v) {
		    this.range[type][range_type] = v;
		}.bind(this));

		// push the default
		var def = default_range[type][range_type];
		def.forEach(function(x, i) { 
		    this.range_bus[type][range_type].push({ index: i, value: x });
		}.bind(this));

	    }.bind(this));
	}.bind(this));

	// definitions
	function convert_to_conditional_stream(status_stream) {
	    /** Hold on to event when hold_property is true, and only keep them
	      if accept_property is true (when hold_property becomes false).

	     */

	    // true if hold is pressed
	    var is_not_hold_event = status_stream
		    .map(function(x) { return x=='hold'; })
		    .not()
		    .toProperty(true),
		is_not_first_clear = status_stream
		    .scan(false, function(c, x) {
			// first clear only
			return (c==false && x=='clear');
		    }).not(),
		combined = bacon.combineAsArray(this, status_stream),
		held = combined
		    .scan([], function(c, x) {
			if (x[1]=='hold') {
			    c.push(x[0]);
			    return c;
			} else if (x[1]=='accept') {
			    return c;
			} else if (x[1]=='reject') {
			    return [];
			} else if (x[1]=='clear') {
			    return [x[0]];
			} else {
			    throw Error('bad status ' + x[1]);
			}
		    })
	    // don't pass in events until the end of a hold
		    .filter(is_not_hold_event)
	    // ignore the event when clear is passed
		    .filter(is_not_first_clear)
		    .flatMap(function(ar) {
			return bacon.fromArray(ar);
		    }),
		unheld = this.filter(is_not_hold_event);
	    return unheld.merge(held);
	}

	function force_update_with_bus(bus) {	     
	    return bacon
		.combineAsArray(this, bus.toProperty(false))
		.map(function(t) {
		    return t[0];
		});
	}
    }
    function set_auto_domain(type, on_off) {	
	/** Turn auto domain setting on or off.

	 type: 'reaction' or 'metabolite'

	 on_off: (Boolean) If True, then automatically set the domain. If False,
	 then manually set the domain.

	 */
	check_type(type);

	this.auto_domain_bus[type].push(on_off);
    }
    function change_data_style(type, style, on_off) {
	/** Change the data style.

	 type: 'reaction' or 'metabolite'

	 style: A data style.

	 on_off: (Boolean) If True, then add the style. If False, then remove
	 it.

	 */
	check_type(type);

	this.data_styles_bus[type].push({ style: style,
					  on_off: on_off });
    }
    function set_domain_value(type, index, value) {
	/** Change a domain value.

	 type: 'reaction' or 'metabolite'

	 index: The domain index to set.

	 value: The new value

	 */
	check_type(type);

	this.domain_bus[type].push({ index: index,
				     value: value });
    }
    function set_domain(type, domain) {
	/** Change a domain.

	 type: 'reaction' or 'metabolite'

	 domain: The new domain.

	 */
	check_type(type);

	domain.forEach(function(d, i) {
	    this.domain_bus[type].push({ index: i, value: d });
	}.bind(this));
    }
    function set_range_value(type, range_type, index, value) {
	/** Change a range value.

	 type: 'reaction' or 'metabolite'

	 range_type: 'color' or 'size'

	 index: The range index to set.

	 value: The new value

	 */
	check_type(type);

	this.range_bus[type][range_type].push({ index: index,
						   value: value });
    }
    function hold_changes() {
	this.status_bus.push('hold');
    }
    function abandon_changes() {
	this.status_bus.push('reject');
	this.status_bus.push('clear');
	this.force_update_bus.push(true);
    };
    function accept_changes() {
	this.status_bus.push('accept');
	this.status_bus.push('clear');
    };
});
