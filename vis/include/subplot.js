// use revealing module pattern without immediate invocation
// http://weblogs.asp.net/dwahlin/archive/2011/09/05/creating-multiple-javascript-objects-when-using-the-revealing-module-pattern.aspx

var Subplot = function() {
    var frames = [],            // subplot.get_frame({row:, column:}) or subplot.frames[row, col]
    get_frame = function(o) {
        return frames[o.row, o.column];
    },
    d = {},
    setup = function(options) {
        // // some defaults
        var rows = options.rows || 2,
        columns = options.columns || 2,
        selection = options.selection || d3.select("body"),
	margin = 20;

        if (options.fillScreen==true) {
            // d3.select('html').style('height','100%');
            // d3.select('body').style('height','100%');
            selection.style('height', (window.innerHeight-margin)+'px');
            selection.style('width', (window.innerWidth-margin)+'px');
        }

        var height = parseFloat(selection.style('height')) - (margin),
        width = parseFloat(selection.style('width')) - (margin),
        row_h = height/rows,
        col_w = width/columns;

        for (var y=margin; y<height; y+=row_h) {
            // divide into rows
            for (var x=margin; x<width; x+=col_w) {
                // divide into rows
                frames.push({'x': Math.floor(x),
                             'y': Math.floor(y),
                             'width': Math.floor(col_w),
                             'height': Math.floor(row_h)});
            }
        }
        // d.x = x; d.y = y; d.height = height; d.width = width; d.selection = selection; d.row_h = row_h;
        // d.col_w = col_w; d.rows = rows; d.columns = columns;

        selection.selectAll('.grid')
            .data(frames)
            .enter()
            .append('div')
            .attr('class', 'grid')
            .style('position', 'absolute')
            .style('left', function(d) { return d.x+'px' })
            .style('top', function(d) { return d.y+'px' })
            .style('width', function(d) { return d.width+'px' })
            .style('height', function(d) { return d.height+'px' });

        return this;
    };

    return {
        d:d,
        setup: setup,
        frames: frames,
        get_frame: get_frame
    };
};
