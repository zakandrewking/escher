define(["utils", "CallbackManager", "ScaleEditor"], function(utils, CallbackManager, ScaleEditor) {
    /** 
     */

    var SettingsMenu = utils.make_class();
    // instance methods
    SettingsMenu.prototype = { init: init,
                               is_visible: is_visible,
                               toggle: toggle,
                               hold_changes: hold_changes,
                               abandon_changes: abandon_changes,
                               accept_changes: accept_changes,
                               style_gui: style_gui,
                               view_gui: view_gui };

    return SettingsMenu;

    // instance methods
    function init(sel, settings, map, toggle_abs_and_apply_data) {
        this.sel = sel;
        this.settings = settings;
        this.draw = false;
        
        var unique_map_id = this.settings.get_option('unique_map_id');
        this.unique_string = (unique_map_id === null ? '' : '.' + unique_map_id);

        var background = sel.append('div')
                .attr('class', 'settings-box-background')
                .style('display', 'none'),
            container = background.append('div')
                .attr('class', 'settings-box-container')
                .style('display', 'none');

        // done button
        container.append('button')
            .attr("class", "btn btn-sm btn-default settings-button")
            .on('click', function() {
                this.accept_changes();
            }.bind(this))
            .append("span").attr("class",  "glyphicon glyphicon-ok");
        // quit button
        container.append('button')
            .attr("class", "btn btn-sm btn-default settings-button settings-button-close")
            .on('click', function() {
                this.abandon_changes();
            }.bind(this))
            .append("span").attr("class",  "glyphicon glyphicon-remove");

        var box = container.append('div')
                .attr('class', 'settings-box');
        
        // Tip
        box.append('div')
            .text('Tip: Hover over an option to see more details about it.')
            .classed('settings-tip', true);
        box.append('hr');
        
        // view and build
        box.append('div').text('View and build options')
            .attr('class', 'settings-section-heading-large');
        this.view_gui(box.append('div'));
        
        // reactions
        box.append('hr');
        box.append('div')
            .text('Reactions').attr('class', 'settings-section-heading-large');
        var rse = new ScaleEditor(box.append('div'), 'reaction', this.settings,
                                  map.get_data_statistics.bind(map));
        map.callback_manager.set('calc_data_stats__reaction', function(changed) {
            if (changed) {
                rse.update();
                rse.update_no_data();
            }
        });
        box.append('div')
            .text('Reaction or Gene data').attr('class', 'settings-section-heading');
        this.style_gui(box.append('div'), 'reaction', function(on_off) {
            if (toggle_abs_and_apply_data) {
                toggle_abs_and_apply_data('reaction', on_off);
                rse.update();
                rse.update_no_data();
            }
        });

        // metabolite data
        box.append('hr');
        box.append('div').text('Metabolites')
            .attr('class', 'settings-section-heading-large');
        var mse = new ScaleEditor(box.append('div'), 'metabolite', this.settings,
                                  map.get_data_statistics.bind(map));
        map.callback_manager.set('calc_data_stats__metabolite', function(changed) {
            if (changed) {
                mse.update();
                mse.update_no_data();
            }
        });
        box.append('div').text('Metabolite data')
            .attr('class', 'settings-section-heading');
        this.style_gui(box.append('div'), 'metabolite', function(on_off) {
            if (toggle_abs_and_apply_data) {
                toggle_abs_and_apply_data('metabolite', on_off);
                mse.update();
                mse.update_no_data();
            }
        });
        
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
            this.selection.style("display", "inline-block");
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
    
    function style_gui(sel, type, abs_callback) {
        /** A UI to edit style.

         */

        var t = sel.append('table').attr('class', 'settings-table'),
            settings = this.settings;

        // styles
        t.append('tr').call(function(r) {
            r.append('td').text('Options:')
                .attr('class', 'options-label')
                .attr('title', ('Options for ' + type + ' data.'));
            var cell = r.append('td');

            var styles = [['Absolute value', 'abs',
                           ('If checked, use the absolute value when ' +
                            'calculating colors and sizes of ' + type + 's on the map')],
                          ['Size', 'size',
                           ('If checked, then size the ' +
                            (type == 'metabolite' ? 'radius of metabolite circles ' : 'thickness of reaction lines ') +
                            'according to the value of the ' + type + ' data')],
                          ['Color', 'color',
                           ('If checked, then color the ' +
                            (type == 'metabolite' ? 'metabolite circles ' : 'reaction lines ') +
                            'according to the value of the ' + type + ' data')],
                          ['Text (Show data in label)', 'text',
                           ('If checked, then show data values in the ' + type + ' ' +
                            'labels')]],
                style_cells = cell.selectAll('.option-group')
                    .data(styles),
                s = style_cells.enter()
                    .append('label')
                    .attr('class', 'option-group');

            // make the checkbox
            var streams = [],
                get_styles = function() {
                    var styles = [];
                    cell.selectAll('input')
                        .each(function(d) { if (this.checked) styles.push(d[1]); });
                    return styles;
                };
            s.append('input').attr('type', 'checkbox')
                .on('change', function(d) {
                    settings.set_conditional(type + '_styles', get_styles());
                    if (d[1] == 'abs')
                        abs_callback(this.checked);
                }).each(function(d) {
                    // subscribe to changes in the model
                    settings.streams[type + '_styles'].onValue(function(ar) {
                        // check the box if the style is present
                        this.checked = (ar.indexOf(d[1]) != -1);
                    }.bind(this));
                });
            s.append('span')
                .text(function(d) { return d[0]; })
                .attr('title', function(d) { return d[2]; });
        });

        // compare_style
        t.append('tr').call(function(r) {
            r.append('td')
                .text('Comparison:')
                .attr('class', 'options-label')
                .attr('title', ('The function that will be used to compare ' +
                                'datasets, when paired data is loaded'));
            var cell = r.append('td')
                    .attr('title', ('The function that will be used to compare ' +
                                    'datasets, when paired data is loaded'));;

            var styles = [['Fold Change', 'fold'],
                          ['Log2(Fold Change)', 'log2_fold'],
                          ['Difference', 'diff']],
                style_cells = cell.selectAll('.option-group')
                    .data(styles),
                s = style_cells.enter()
                    .append('label')
                    .attr('class', 'option-group');
            
            // make the radio
            s.append('input').attr('type', 'radio')
                .attr('name', type + '_compare_style' + this.unique_string)
                .attr('value', function(d) { return d[1]; })
                .on('change', function() {
                    if (this.checked)
                        settings.set_conditional(type + '_compare_style', this.value);
                })
                .each(function() {
                    // subscribe to changes in the model
                    settings.streams[type + '_compare_style'].onValue(function(value) {
                        // check the box for the new value
                        this.checked = (this.value == value);
                    }.bind(this));
                });
            s.append('span')
                .text(function(d) { return d[0]; });

        }.bind(this));

        // gene-specific settings
        if (type=='reaction') {
            var t = sel.append('table').attr('class', 'settings-table')
                    .attr('title', ('The function that will be used to evaluate ' +
                                    'AND connections in gene reaction rules (AND ' +
                                    'connections generally connect components of ' +
                                    'an enzyme complex)'));
            
            // and_method_in_gene_reaction_rule
            t.append('tr').call(function(r) {
                r.append('td')
                    .text('Method for evaluating AND:')
                    .attr('class', 'options-label-wide');
                var cell = r.append('td');

                var styles = [['Mean', 'mean'], ['Min', 'min']],
                    style_cells = cell.selectAll('.option-group')
                        .data(styles),
                    s = style_cells.enter()
                        .append('label')
                        .attr('class', 'option-group');

                // make the radio
                var name = 'and_method_in_gene_reaction_rule';
                s.append('input').attr('type', 'radio')
                    .attr('name', name + this.unique_string)
                    .attr('value', function(d) { return d[1]; })
                    .on('change', function() {
                        if (this.checked)
                            settings.set_conditional(name, this.value);
                    })
                    .each(function() {
                        // subscribe to changes in the model
                        settings.streams[name].onValue(function(value) {
                            // check the box for the new value
                            this.checked = (this.value == value);
                        }.bind(this));
                    });
                s.append('span')
                    .text(function(d) { return d[0]; });
            }.bind(this));

        }
    }
    
    function view_gui(s, option_name, string, options) {

        // columns
        var settings = this.settings;

        var t = s.append('table').attr('class', 'settings-table');
        t.append('tr').call(function(r) {
            // identifiers
            r.attr('title', ('The identifiers that are show in the reaction, ' +
                             'gene, and metabolite labels on the map.'));
            r.append('td').text('Identifiers:')
                .attr('class', 'options-label');
            var cell = r.append('td');

            var options = [['ID\'s', 'bigg_id'], ['Descriptive names', 'name']],
                style_cells = cell.selectAll('.option-group')
                    .data(options),
                s = style_cells.enter()
                    .append('label')
                    .attr('class', 'option-group');

            // make the checkbox
            var name = 'identifiers_on_map';
            s.append('input').attr('type', 'radio')
                .attr('name', name + this.unique_string)
                .attr('value', function(d) { return d[1]; })
                .on('change', function() {
                    if (this.checked)
                        settings.set_conditional(name, this.value);
                })
                .each(function() {
                    // subscribe to changes in the model
                    settings.streams[name].onValue(function(value) {
                        // check the box for the new value
                        this.checked = (this.value == value);
                    }.bind(this));
                });
            s.append('span').text(function(d) { return d[0]; });

        }.bind(this));

        var boolean_options = [
            ['scroll_behavior', 'Scroll to zoom (instead of scroll to pan)',
             ('If checked, then the scroll wheel and trackpad will control zoom ' +
              'rather than pan.'), {'zoom': true, 'pan': false}],
            ['hide_secondary_metabolites', 'Hide secondary metabolites',
             ('If checked, then only the primary metabolites ' +
              'will be displayed.')],
            ['show_gene_reaction_rules', 'Show gene reaction rules',
             ('If checked, then gene reaction rules will be displayed ' +
              'below each reaction label. (Gene reaction rules are always ' +
              'shown when gene data is loaded.)')],
            ['hide_all_labels', 'Hide reaction, gene, and metabolite labels',
             ('If checked, hide all reaction, gene, and metabolite labels')],
            ['allow_building_duplicate_reactions', 'Allow duplicate reactions',
             ('If checked, then allow duplicate reactions during model building.')],
            ['highlight_missing', 'Highlight reactions not in model',
             ('If checked, then highlight in red all the ' +
              'reactions on the map that are not present in ' +
              'the loaded model.')],
        ];
        
        var opts = s.append('div').attr('class', 'settings-container')
                .selectAll('.option-group')
                .data(boolean_options);
        // enter
        var e = opts.enter()
                .append('label')
                .attr('class', 'option-group full-line');
        e.append('input').attr('type', 'checkbox');
        e.append('span');
        // update
        opts.attr('title', function(d) { return d[2]; });
        opts.select('input')
            .on('change', function(d) {
                if (d.length >= 4) { // not a boolean setting
                    for (var key in d[3]) {
                        if (d[3][key] == this.checked) {
                            settings.set_conditional(d[0], key);
                            break;
                        }
                    }
                } else { // boolean setting
                    settings.set_conditional(d[0], this.checked);
                }
            })
            .each(function(d) {
                settings.streams[d[0]].onValue(function(value) {
                    if (d.length >= 4) { // not a boolean setting
                        this.checked = d[3][value];
                    } else { // boolean setting
                        this.checked = value;
                    }
                }.bind(this));
            });
        opts.select('span')
            .text(function(d) { return d[1]; });
        // exit
        opts.exit().remove();
        
        // message about text performance
        s.append('div')
            .style('margin-top', '16px')
            .classed('settings-tip', true)
            .text('Tip: To increase map performance, turn off text boxes (i.e. labels and gene reaction rules).');
    }
});
