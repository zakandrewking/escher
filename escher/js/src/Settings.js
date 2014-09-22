define(["utils", "lib/bacon"], function(utils, bacon) {
    /** A class to manage settings for a Map.

	Arguments
	---------

	def_styles: 

	def_auto_domain: 

	def_domain:

	def_range:

	def_no_data:

	def_highlight_missing:

        highlight_missing_components: Boolean. If true, color components that
        are not the in cobra model.

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
			    set_no_data_value: set_no_data_value,
			    set_highlight_missing: set_highlight_missing,			    
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
    function init(def_styles, def_auto_domain, def_domain, def_range,
		  def_no_data, def_highlight_missing) {
	// defaults
	if (def_styles===undefined) 
	    def_styles = { reaction: ['color', 'size', 'abs', 'text'],
			   metabolite: ['color', 'size', 'text'] };
	if (def_auto_domain===undefined)
	    def_auto_domain = { reaction: true,
				metabolite: true };
	if (def_domain===undefined)
	    def_domain = { reaction: [-10, 0, 10],
			   metabolite: [-10, 0, 10] };
	if (def_range===undefined)
	    def_range = { reaction: { color: ['rgb(200,200,200)', 'rgb(150,150,255)', 'purple'],
				      size: [4, 8, 12] },
			  metabolite: { color: ['green', 'white', 'red'],
					size: [6, 8, 10] } };
	if (def_no_data===undefined)
	    def_no_data = { reaction: { color: 'rgb(220,220,220)',
					size: 4 },
			    metabolite: { color: 'white',
					  size: 6 } };
	if (def_highlight_missing===undefined)
	    def_highlight_missing = 'red';

	// event streams
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
	this.no_data = {};
	this.no_data_bus = {};
	this.no_data_stream = {};
	// this.highlight_missing;
	// this.highlight_missing_bus;
	// this.highlight_missing_stream;

	// manage accepting/abandoning changes
	this.status_bus = new bacon.Bus();

	// force an update of ui components
	this.force_update_bus = new bacon.Bus();

	// modify bacon.observable
	bacon.Observable.prototype.convert_to_conditional_stream = convert_to_conditional_stream;
	bacon.Observable.prototype.force_update_with_bus = force_update_with_bus;

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
	    var def = def_styles[type];
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
	    var def = def_auto_domain[type];
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
	    var def = def_domain[type];
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
		var def = def_range[type][range_type];
		def.forEach(function(x, i) { 
		    this.range_bus[type][range_type].push({ index: i, value: x });
		}.bind(this));

	    }.bind(this));

	    // set up the no data settings
	    this.no_data_bus[type] = {};
	    this.no_data_stream[type] = {};
	    this.no_data[type] = {};
	    ['color', 'size'].forEach(function(no_data_type) {
		// make the bus
		this.no_data_bus[type][no_data_type] = new bacon.Bus();
		// make a new constant for the input default
		this.no_data_stream[type][no_data_type] = this.no_data_bus[type][no_data_type]
		// conditionally accept changes
		    .convert_to_conditional_stream(this.status_bus)
		// combine into state array
		    .scan([], function(current, value) {
			return value;
		    })
		// force updates
		    .force_update_with_bus(this.force_update_bus);

		// get the latest
		this.no_data_stream[type][no_data_type].onValue(function(v) {
		    this.no_data[type][no_data_type] = v;
		}.bind(this));

		// push the default
		var def = def_no_data[type][no_data_type];
		this.no_data_bus[type][no_data_type].push(def);

	    }.bind(this));
	}.bind(this));

	
	// set up the highlight missing settings
	// make the bus
	this.highlight_missing_bus = new bacon.Bus();
	// make a new constant for the input default
	this.highlight_missing_stream = this.highlight_missing_bus
	// conditionally accept changes
	    .convert_to_conditional_stream(this.status_bus)
	// combine into state array
	    .scan([], function(current, value) {
		return value;
	    })
	// force updates
	    .force_update_with_bus(this.force_update_bus);

	// get the latest
	this.highlight_missing_stream.onValue(function(v) {
	    this.highlight_missing = v;
	}.bind(this));

	// push the default
	var def = def_highlight_missing;
	this.highlight_missing_bus.push(def);

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
		is_not_first_hold = status_stream
		    .scan(false, function(c, x) {
			// first clear only
			return (c==false && x=='hold');
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
	    // ignore the event when hold is passed
		    .filter(is_not_first_hold)
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

	    Arguments
	    ---------

	    type: 'reaction' or 'metabolite'

	    on_off: (Boolean) If True, then automatically set the domain. If False,
	    then manually set the domain.

	*/
	check_type(type);

	this.auto_domain_bus[type].push(on_off);
    }

    function change_data_style(type, style, on_off) {
	/** Change the data style.

	    Arguments
	    ---------

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

    function set_no_data_value(type, no_data_type, value) {
	/** Change a no_data value.

	 type: 'reaction' or 'metabolite'

	 no_data_type: 'color' or 'size'

	 value: The new value

	 */
	check_type(type);

	this.no_data_bus[type][no_data_type].push(value);
    }

    function set_highlight_missing(value) {
	/** Set the option for highlighting missing components from a cobra
	    model.

	    Arguments
	    ---------

	    value: The new boolean value.

	*/
	this.highlight_missing_bus.push(value);
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
