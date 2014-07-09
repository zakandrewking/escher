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
			    set_range_value: set_range_value };

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

	var default_domain = { reaction: [-10, 0, 10],
			       metabolite: [-10, 0, 10] },
	    default_range = { reaction: { color: ['green', 'rgb(200,200,200)', 'red'],
					  size: [4, 6, 12] },
			      metabolite: { color: ['green', 'white', 'red'],
					    size: [6, 8, 10] } };

	['metabolite', 'reaction'].forEach(function(type) {
	    // set up the styles settings
	    this.data_styles_bus[type] = new bacon.Bus();
	    this.data_styles_stream[type] = bacon
	    // make a new constant for the input array
		.constant(type=='reaction' ? reaction_data_styles : metabolite_data_styles)
	    // generate events for each element
		.flatMap(function(ar) {
		    return bacon.fromArray(ar.map(function(x) {
			return { style: x, on_off: true };
		    }));
		})
	    // merge with incoming events
		.merge(this.data_styles_bus[type])
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
		});
	    // get the latest
	    this.data_styles_stream[type].onValue(function(v) {
		this.data_styles[type] = v;
	    }.bind(this));

	    // set up the auto_domain settings
	    this.auto_domain_bus[type] = new bacon.Bus();
	    this.auto_domain_stream[type] = this.auto_domain_bus[type]
	    // set the default value
		.toProperty(type=='reaction' ? auto_reaction_domain : auto_metabolite_domain);
	    // get the latest
	    this.auto_domain_stream[type].onValue(function(v) {
		this.auto_domain[type] = v;
	    }.bind(this));

	    // set up the domain
	    // make the bus
	    this.domain_bus[type] = new bacon.Bus();
	    // make a new constant for the input default
	    this.domain_stream[type] = bacon
		.constant(default_domain[type])
	    // generate events for each element
		.flatMap(function(ar) {
		    return bacon.fromArray(ar.map(function(x, i) {
			return { index: i, value: x };
		    }));
		})
	    // merge with incoming events
		.merge(this.domain_bus[type])
	    // combine into state array
		.scan([], function(current, event) {
		    current[event.index] = event.value;
		    return current;
		});
	    // get the latest
	    this.domain_stream[type].onValue(function(v) {
		this.domain[type] = v;
	    }.bind(this));

	    // set up the ranges
	    this.range_bus[type] = {};
	    this.range_stream[type] = {};
	    this.range[type] = {};
	    ['color', 'size'].forEach(function(range_type) {
		// make the bus
		this.range_bus[type][range_type] = new bacon.Bus();
		// make a new constant for the input default
		this.range_stream[type][range_type] = bacon
		    .constant(default_range[type][range_type])
		// generate events for each element
		    .flatMap(function(ar) {
			return bacon.fromArray(ar.map(function(x, i) {
			    return { index: i, value: x };
			}));
		    })
		// merge with incoming events
		    .merge(this.range_bus[type][range_type])
		// combine into state array
		    .scan([], function(current, event) {
			current[event.index] = event.value;
			return current;
		    });
		// get the latest
		this.range_stream[type][range_type].onValue(function(v) {
		    this.range[type][range_type] = v;
		}.bind(this));

	    }.bind(this));
	}.bind(this));
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

});
