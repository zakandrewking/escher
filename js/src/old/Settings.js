define(["utils", "lib/bacon"], function(utils, bacon) {
    /** A class to manage settings for a Map.

     Arguments
     ---------

     set_option: A function, fn(key), that returns the option value for the
     key.

     get_option: A function, fn(key, value), that sets the option for the key
     and value.

     conditional_options: The options to that are conditionally accepted when
     changed. Changes can be abandoned by calling abandon_changes(), or accepted
     by calling accept_changes().

     */

    var Settings = utils.make_class();
    // instance methods
    Settings.prototype = { init: init,
                           set_conditional: set_conditional,
                           hold_changes: hold_changes,
                           abandon_changes: abandon_changes,
                           accept_changes: accept_changes };

    return Settings;

    // instance methods
    function init(set_option, get_option, conditional_options) {
        this.set_option = set_option;
        this.get_option = get_option;
        
        // manage accepting/abandoning changes
        this.status_bus = new bacon.Bus();

        // force an update of ui components
        this.force_update_bus = new bacon.Bus();

        // modify bacon.observable
        bacon.Observable.prototype.convert_to_conditional_stream = _convert_to_conditional_stream;
        bacon.Observable.prototype.force_update_with_bus = _force_update_with_bus;

        // create the options
        this.busses = {};
        this.streams = {};
        for (var i = 0, l = conditional_options.length; i < l; i++) {
            var name = conditional_options[i],
                out = _create_conditional_setting(name, get_option(name), set_option,
                                                  this.status_bus, this.force_update_bus);
            this.busses[name] = out.bus;
            this.streams[name] = out.stream;
        }
    }
    
    function _convert_to_conditional_stream(status_stream) {
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
                    return (c==false && (x=='accepted' || x=='rejected'));
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
                    } else if (x[1]=='rejected' || x[1]=='accepted') {
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

    function _force_update_with_bus(bus) {        
        return bacon
            .combineAsArray(this, bus.toProperty(false))
            .map(function(t) {
                return t[0];
            });
    }
    
    function _create_conditional_setting(name, initial_value, set_option,
                                         status_bus, force_update_bus) {
        // set up the bus
        var bus = new bacon.Bus();
        // make the event stream
        var stream = bus
        // conditionally accept changes
                .convert_to_conditional_stream(status_bus)
        // force updates
                .force_update_with_bus(force_update_bus);
        
        // get the latest
        stream.onValue(function(v) {
            set_option(name, v);
        });
        
        // push the initial value
        bus.push(initial_value);

        return { bus: bus, stream: stream };
    }

    function set_conditional(name, value) {
        /** Set the value of a conditional setting, one that will only be
         accepted if this.accept_changes() is called.

         Arguments
         ---------

         name: The option name

         value: The new value

         */

        if (!(name in this.busses))
            throw new Error('Invalid setting name');
        this.busses[name].push(value);
    }

    function hold_changes() {
        this.status_bus.push('hold');
    }
    
    function abandon_changes() {
        this.status_bus.push('reject');
        this.status_bus.push('rejected');
        this.force_update_bus.push(true);
    }
    
    function accept_changes() {
        this.status_bus.push('accept');
        this.status_bus.push('accepted');
    }
});

