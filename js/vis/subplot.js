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
            // d3.select('html').style('height','100%');
            // d3.select('body').style('height','100%');
            s.selection.style('height', (window.innerHeight-s.margin)+'px');
            s.selection.style('width', (window.innerWidth-s.margin)+'px');
        }

        var height = parseFloat(s.selection.style('height')) - (s.margin),
            width = parseFloat(s.selection.style('width')) - (s.margin),
            row_h = height/s.rows,
            col_w = width/s.columns;

	d3.selectAll('.grid') 
            .style('left',   function(d) { return Math.floor(d.x_i*col_w+s.margin)+'px'; })
            .style('top',    function(d) { return Math.floor(d.y_i*row_h+s.margin)+'px'; })
            .style('width',  function(d) { return Math.floor(col_w)+'px'; })
            .style('height', function(d) { return Math.floor(row_h)+'px'; });
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
        s.frames = [];
        for (var y=0; y<s.rows; y+=1) {
            // divide into rows
	    var a_row = [];
            for (var x=0; x<s.columns; x+=1) {
                // divide into columns
                var fr = s.selection.append('div')
                        .attr('class', 'grid') 
			.style('position', 'absolute')
                        .datum({'x_i': x, 'y_i': y});
                a_row.push(fr);
            }
	    s.frames.push(a_row)
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
