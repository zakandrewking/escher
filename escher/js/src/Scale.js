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

    function connect_to_settings(settings) {
	// domains
	settings.domain_stream['reaction'].onValue(function(s) {
	    this.reaction_color.domain(s);
	    this.reaction_size.domain(s);
	}.bind(this));
	settings.domain_stream['metabolite'].onValue(function(s) {
	    this.metabolite_color.domain(s);
	    this.metabolite_size.domain(s);
	}.bind(this));
	// ranges
	settings.range_stream['reaction']['color'].onValue(function(s) {
	    this.reaction_color.range(s);
	}.bind(this));
	settings.range_stream['reaction']['size'].onValue(function(s) {
	    this.reaction_size.range(s);
	}.bind(this));
	settings.range_stream['metabolite']['color'].onValue(function(s) {
	    this.metabolite_color.range(s);
	}.bind(this));
	settings.range_stream['metabolite']['size'].onValue(function(s) {
	    this.metabolite_size.range(s);
	}.bind(this));
    }
});
