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
            var domain = domain_for_scale(s, get_data_statistics()['reaction']);
	    this.reaction_color.domain(domain);
	    this.reaction_size.domain(domain);
	    this.reaction_color.range(range_for_scale(s, 'color'));
	    this.reaction_size.range(range_for_scale(s, 'size'));
	}.bind(this),
            update_metabolite = function(s) {
                var domain = domain_for_scale(s, get_data_statistics()['metabolite']);
	        this.metabolite_color.domain(domain);
	        this.metabolite_size.domain(domain);
	        this.metabolite_color.range(range_for_scale(s, 'color'));
	        this.metabolite_size.range(range_for_scale(s, 'size'));
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
        function domain_for_scale(scale, stats) {
            return scale.map(function(x) {
                if (x.type in stats)
                    return stats[x.type];
                else if (x.type == 'value')
                    return x.value;
                else
                    throw new Error('Bad domain type ' + x.type);
            });
        }
        
        function range_for_scale(scale, type) {
            return scale.map(function(x) {
                return x[type];
            });
        }
    }
});
