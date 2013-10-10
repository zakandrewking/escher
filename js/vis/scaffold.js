define(["lib/d3"], function(d3) {
    // private
    var height_width_style = function(selection, margins) {   
        var width = parseFloat(selection.style('width')) - margins.left - margins.right,
	    height = parseFloat(selection.style('height')) - margins.top - margins.bottom;
        return {'width': width, 'height': height};
    };
    var height_width_attr = function(selection, margins) {   
        var width = parseFloat(selection.attr('width')) - margins.left - margins.right,
	    height = parseFloat(selection.attr('height')) - margins.top - margins.bottom;
        return {'width': width, 'height': height};
    };

    // public
    var set_options = function(options, defaults) {
	var i = -1, 
	    out = defaults,
	    keys = window.Object.keys(options);
	while (++i < keys.length) out[keys[i]] = options[keys[i]];
	return out;
    };
    var setup_svg = function(selection, sub_selection, margins, fill_screen) {
        // sub selection places the graph in an existing svg environment
        var add_svg = function(f, s, m) {
            if (f) {
		s.style('height', (window.innerHeight-margins.bottom)+'px');
		s.style('width', (window.innerWidth-margins.right)+'px');
            }
            var out = height_width_style(f, s, margins);
	    out.svg = s.append('svg')
                .attr("width", out.width + m.left + m.right)
                .attr("height", out.height + m.top + m.bottom)
                .attr('xmlns', "http://www.w3.org/2000/svg");
	    return out;
        };

	// run
	var out;
        if (sub_selection) {
            out = height_width_attr(sub_selection, margins);
	    out.svg = sub_selection;
        } else if (selection) {
            out = add_svg(fill_screen, selection, margins);
        } else {
            out = add_svg(fill_screen, d3.select('body').append('div'), margins);
        }
	return out;
    };

    var resize_svg = function(selection, sub_selection, margins, fill_screen) {
	// returns null
      var resize = function(f, s, m) {
            if (f) {
		s.style('height', (window.innerHeight-margins.bottom)+'px');
		s.style('width', (window.innerWidth-margins.right)+'px');
            }
            var out = height_width_style(f, s, margins);
	    out.svg = s.select('svg')
                .attr("width", out.width + m.left + m.right)
                .attr("height", out.height + m.top + m.bottom)
                .attr('xmlns', "http://www.w3.org/2000/svg");
	    return out;
        };

	var out;
	if (sub_selection) {
            out = height_width_attr(sub_selection, margins);
	    out.svg = sub_selection;
        } else if (selection) {
            out = resize(fill_screen, selection, margins);
        } else {
            out = resize(fill_screen, d3.select('body').append('div'), margins);
        }
	return out;
    };

    var load_css = function(css_path, callback) {
	var css = "";
        if (css_path) {
            d3.text(css_path, function(error, text) {
                if (error) {
                    console.warn(error);
                } 
                css = text;
                callback(css);
            });
        }
        return false;
    };
    var update = function () {
	return 'omg yes';
    };
    return {
	set_options: set_options,
	setup_svg: setup_svg,
	load_css: load_css
    };
});
