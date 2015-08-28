define(['utils'], function(utils) {
    /** A QuickJump menu to move between maps.

     Arguments
     ---------

     sel: The d3 selection of an html node to place the menu inside.

     options: An array of map names to jump to.

     load_callback: A callback function that accepts two arguments: map_name,
     and another callback which returns true or false for success or failure
     (callback purgatory).

     */

    var QuickJump = utils.make_class();
    // instance methods
    QuickJump.prototype = { init: init,
                            reset_selection: reset_selection,
                            replace_state_for_map_name: replace_state_for_map_name };

    return QuickJump;

    // instance methods
    function init(sel, load_callback) {        
        // set up the menu
        var select_sel = sel.append('select')
                .attr('id', 'quick-jump-menu')
                .attr('class', 'form-control'); 
        this.selector = select_sel;

        // get the options to show
        var url_comp = utils.parse_url_components(window),
            current = ('map_name' in url_comp) ? url_comp.map_name : null,
            quick_jump_path = ('quick_jump_path' in url_comp) ? url_comp.quick_jump_path : null,
            options = ('quick_jump' in url_comp) ? url_comp.quick_jump : [],
            default_value = '— Jump to map —',
            view_options = [default_value].concat(options);
        if (current !== null) {
            view_options = view_options.filter(function(o) {
                return o != current;
            });
        }
        
        select_sel.selectAll('option')
            .data(view_options)
            .enter()
            .append('option')
            .text(function(d) {
                // works whether or not a '.' is present
                return d.split('.').slice(-1)[0];
            });
        
        // only show if there are options
        select_sel.style('display', view_options.length > 1 ? 'block' : 'none');

        // on selection
        var change_map = function(map_name) {
            load_callback(map_name, quick_jump_path, function(success) {
                if (success)
                    this.replace_state_for_map_name(map_name);
                else
                    this.reset_selection();
            }.bind(this));
        }.bind(this);
        
        select_sel.on('change', function() {
            // get the new map
            var map_name = this.options[this.selectedIndex].__data__;
            change_map(map_name);
        });
    }

    function reset_selection() {
        this.selector.node().selectedIndex = 0;
    }
    
    function replace_state_for_map_name(map_name) {
        /** Just changes the url to match the new map name. Does not actually
         manage the HTML5 history.

         */
        
        // update the url with the new map
        var url = window.location.href
                .replace(/(map_name=)([^&]+)(&|$)/, '$1' + map_name + '$3');
        window.history.replaceState('Not implemented', '', url);
    }
});
