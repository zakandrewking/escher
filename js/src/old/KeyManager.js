define(['utils'], function(utils) {
    /** 
     */

    var KeyManager = utils.make_class();
    // static methods
    KeyManager.reset_held_keys = reset_held_keys;
    // instance methods
    KeyManager.prototype = { init: init,
                             update: update,
                             toggle: toggle,
                             add_escape_listener: add_escape_listener,
                             add_enter_listener: add_enter_listener,
                             add_key_listener: add_key_listener };

    return KeyManager;

    // static methods
    function reset_held_keys(h) {
        h.command = false;
        h.control = false;
        h.option = false;
        h.shift = false;
    }
    // instance methods
    function init(unique_map_id, assigned_keys, input_list, ctrl_equals_cmd) {
        /** Assign keys for commands.

         */

        // identify this key manager
        if (unique_map_id===undefined) unique_map_id = null;
        this.unique_string = (unique_map_id === null ? '' : '.' + unique_map_id);        

        if (assigned_keys===undefined) this.assigned_keys = {};
        else this.assigned_keys = assigned_keys;
        if (input_list===undefined) this.input_list = [];
        else this.input_list = input_list;

        if (ctrl_equals_cmd===undefined) ctrl_equals_cmd = true;
        this.ctrl_equals_cmd = ctrl_equals_cmd;

        this.held_keys = {};
        reset_held_keys(this.held_keys);

        this.enabled = true;

        this.update();
    }

    function update() {
        var held_keys = this.held_keys,
            keys = this.assigned_keys,
            self = this;

        var modifier_keys = { command: 91,
                              command_right: 93,
                              control: 17,
                              option: 18,
                              shift: 16 };

        d3.select(window).on('keydown.key_manager' + this.unique_string, null);
        d3.select(window).on('keyup.key_manager' + this.unique_string, null);

        if (!(this.enabled)) return;

        d3.select(window).on('keydown.key_manager' + this.unique_string, function(ctrl_equals_cmd, input_list) {
            var kc = d3.event.keyCode,
                meaningless = true;
            // check the inputs
            var input_visible = false;
            input_list.forEach(function(input) {
                if (input.is_visible()) input_visible = true;
            });
            toggle_modifiers(modifier_keys, held_keys, kc, true);
            for (var key_id in keys) {
                var assigned_key = keys[key_id];
                if (check_key(assigned_key, kc, held_keys, ctrl_equals_cmd)) {
                    meaningless = false;
                    if (!(assigned_key.ignore_with_input && input_visible)) {
                        if (assigned_key.fn) {
                            assigned_key.fn.call(assigned_key.target);
                        } else {
                            console.warn('No function for key');
                        }
                        // prevent browser action
                        d3.event.preventDefault();
                    }
                }
            }
            // Sometimes modifiers get 'stuck', so reset them once in a while.
            // Only do this when a meaningless key is pressed
            for (var k in modifier_keys)
                if (modifier_keys[k] == kc) meaningless = false;
            if (meaningless) 
                reset_held_keys(held_keys);
        }.bind(null, this.ctrl_equals_cmd, this.input_list))
            .on('keyup.key_manager' + this.unique_string, function() {
                toggle_modifiers(modifier_keys, held_keys,
                                 d3.event.keyCode, false);
            });
        function toggle_modifiers(mod, held, kc, on_off) {
            for (var k in mod)
                if (mod[k] == kc)
                    held[k] = on_off;
        }
        function check_key(key, pressed, held, ctrl_equals_cmd) {
            if (key.key != pressed) return false;
            var mod = utils.clone(key.modifiers);
            if (mod === undefined)
                mod = { control: false,
                        command: false,
                        option: false,
                        shift: false };
            for (var k in held) {
                if (ctrl_equals_cmd &&
                    mod['control'] &&
                    (k=='command' || k=='command_right' || k=='control') &&
                    (held['command'] || held['command_right'] || held['control'])) {
                    continue;
                }
                if (mod[k] === undefined) mod[k] = false;
                if (mod[k] != held[k]) return false;
            }
            return true;
        }
    }
    function toggle(on_off) {
        /** Turn the brush on or off

         */
        if (on_off===undefined) on_off = !this.enabled;

        this.enabled = on_off;
        this.update();
    }   
    function add_enter_listener(callback, id) {
        /** Call the callback when the enter key is pressed, then
         unregisters the listener.

         */
        return this.add_key_listener(callback, 13, id);
    }
    function add_escape_listener(callback, id) {
        /** Call the callback when the escape key is pressed, then
         unregisters the listener.

         */
        return this.add_key_listener(callback, 27, id);
    }
    function add_key_listener(callback, kc, id) {
        /** Call the callback when the key is pressed, then unregisters the
         listener.

         */

        var event_name = 'keydown.' + kc;
        if (id !== undefined)
            event_name += ('.' + id);
        event_name += this.unique_string;
        
        var selection = d3.select(window);
        selection.on(event_name, function() {
            if (d3.event.keyCode==kc) {
                callback();
            }
        });
        return {
            clear: function() {
                selection.on(event_name, null);
            }
        };
    }
});
