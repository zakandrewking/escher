// use revealing module pattern without immediate invocation
// http://weblogs.asp.net/dwahlin/archive/2011/09/05/creating-multiple-javascript-objects-when-using-the-revealing-module-pattern.aspx

var Subplot = function() {
    var s = {};

    s.frames = [];            // subplot.get_frame({row:, column:}) or subplot.frames[row, col]
    s.get_frames = function() {
	return s.frames;
    };
    s.get_frame = function(row, column) {
        return s.frames[row][column];
    };
    s.update = function() {
        if (s.fillScreen==true) {
            s.svg.style('height', (window.innerHeight-s.margin)+'px');
            s.svg.style('width', (window.innerWidth-s.margin)+'px');
        }

        var height = parseFloat(s.svg.style('height')) - (s.margin),
            width = parseFloat(s.svg.style('width')) - (s.margin),
            row_h = height/s.rows,
            col_w = width/s.columns;

	d3.selectAll('.grid') 
            .attr('transform',   function(d) { return 'translate(' + 
					       Math.floor(d.x_i*col_w+s.margin) + ',' +
					       Math.floor(d.y_i*row_h+s.margin) + ')';
					     })
            .attr('width',  function(d) { return Math.floor(col_w); })
            .attr('height', function(d) { return Math.floor(row_h); });
        return this;
    };
    s.setup = function(options) {
        // // some defaults
        if (typeof options === 'undefined') options = {};
        s.rows = options.rows || 2;
        s.columns = options.columns || 2;
        s.selection = options.selection || d3.select("body");
        s.fillScreen = options.fillScreen || false;
        s.margin = 20;

        s.selection.empty();
	s.svg = s.selection.append('svg')
	    .attr('xmlns', "http://www.w3.org/2000/svg");

        s.frames = [];
        for (var y=0; y<s.rows; y+=1) {
            // divide into rows
	    var a_row = [];
            for (var x=0; x<s.columns; x+=1) {
                // divide into columns
                var fr = s.svg.append('g')
                        .attr('class', 'grid') 
                        .datum({'x_i': x, 'y_i': y});
                a_row.push(fr);
            }
	    s.frames.push(a_row);
        }
        s.update();
        return this;
    };

    return {
        setup: s.setup,
        get_frames: s.get_frames,
        frame_by_row_col: s.get_frame,
        update: s.update
    };
};
