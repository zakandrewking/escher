define(["utils"], function(utils) {
    /** 
     */

    var Scale = utils.make_class();
    Scale.prototype = { init: init,
                        connect_to_settings: connect_to_settings };

    return Scale;

    // definitions
    function init() {
        this.x = d3.scale.linear();
        this.y = d3.scale.linear();
        this.x_size = d3.scale.linear();
        this.y_size = d3.scale.linear();
        this.size = d3.scale.linear();
        this.reaction_color = d3.scale.linear().clamp(true);
        this.reaction_size = d3.scale.linear().clamp(true);
        this.metabolite_color = d3.scale.linear().clamp(true);
        this.metabolite_size = d3.scale.linear().clamp(true);
        this.scale_path = function(path) {
            var x_fn = this.x, y_fn = this.y;
            // TODO: scale arrow width
            var str = d3.format(".2f"),
                path = path.replace(/(M|L)([0-9-.]+),?\s*([0-9-.]+)/g, function (match, p0, p1, p2) {
                    return p0 + [str(x_fn(parseFloat(p1))), str(y_fn(parseFloat(p2)))].join(', ');
                }),
                reg = /C([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)\s*([0-9-.]+),?\s*([0-9-.]+)/g;
            path = path.replace(reg, function (match, p1, p2, p3, p4, p5, p6) {
                return 'C'+str(x_fn(parseFloat(p1)))+','+
                    str(y_fn(parseFloat(p2)))+' '+
                    str(x_fn(parseFloat(p3)))+','+
                    str(y_fn(parseFloat(p4)))+' '+
                    [str(x_fn(parseFloat(p5)))+','+str(y_fn(parseFloat(p6)))];
            });
            return path;
        }.bind(this);
        this.scale_decimals = function(path, scale_fn, precision) {
            var str = d3.format("."+String(precision)+"f");
            path = path.replace(/([0-9.]+)/g, function (match, p1) {
                return str(scale_fn(parseFloat(p1)));
            });
            return path;
        };
    }

    function connect_to_settings(settings, map, get_data_statistics) {
        // domains
        var update_reaction = function(s) {
            var out = sort_scale(s, get_data_statistics()['reaction']);
            this.reaction_color.domain(out.domain);
            this.reaction_size.domain(out.domain);
            this.reaction_color.range(out.color_range);
            this.reaction_size.range(out.size_range);
        }.bind(this);
        var update_metabolite = function(s) {
            var out = sort_scale(s, get_data_statistics()['metabolite']);
            this.metabolite_color.domain(out.domain);
            this.metabolite_size.domain(out.domain);
            this.metabolite_color.range(out.color_range);
            this.metabolite_size.range(out.size_range);
        }.bind(this);

        // scale changes
        settings.streams['reaction_scale'].onValue(update_reaction);
        settings.streams['metabolite_scale'].onValue(update_metabolite);
        // stats changes
        map.callback_manager.set('calc_data_stats__reaction', function(changed) {
            if (changed) update_reaction(settings.get_option('reaction_scale'));
        });
        map.callback_manager.set('calc_data_stats__metabolite', function(changed) {
            if (changed) update_metabolite(settings.get_option('metabolite_scale'));
        });
        
        // definitions
        function sort_scale(scale, stats) {
            var sorted = scale.map(function(x) {
                var v;
                if (x.type in stats)
                    v = stats[x.type];
                else if (x.type == 'value')
                    v = x.value;
                else
                    throw new Error('Bad domain type ' + x.type);
                return { v: v,
                         color: x.color,
                         size: x.size };
            }).sort(function(a, b) {
                return a.v - b.v;
            });
            return { domain: sorted.map(function(x) { return x.v; }),
                     color_range: sorted.map(function(x) { return x.color; }),
                     size_range: sorted.map(function(x) { return x.size; }) };
        }
    }
});
