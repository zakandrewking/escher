define(["./scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        var o = scaffold.set_options(options, {
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
	    spacing: 0,
            rows: 2,
            columns: 2,
            fill_screen: false,
            selection: d3.select('body') });

        var out = scaffold.setup_svg(o.selection, o.selection_is_svg,
                                     o.margins, o.fill_screen);
        o.svg = out.svg;
        o.height = out.height;
        o.width = out.width;

        // clear the container and add again
	// TODO add to scaffold.setup_svg
        o.svg.select("#subplot-container").remove();
        var container = o.svg.append("g").attr("id","subplot-container");
        o.sel = container.attr("transform", "translate(" + o.margins.left + "," + o.margins.top + ")");
        o.frames = [];
        for (var y=0; y<o.rows; y+=1) {
            // divide into rows
            var a_row = [];
            for (var x=0; x<o.columns; x+=1) {
                // divide into columns
                var fr = o.sel.append('g')
                        .attr('class', 'grid')
                        .datum({'x_i': x, 'y_i': y});
                a_row.push(fr);
            }
            o.frames.push(a_row);
        }
        update();

        return { get_frames: get_frames,
                 frame_by_row_col: get_frame,
                 update: update };

        // definitions
        function get_frames() {
            return o.frames;
            return this;
        }
        function get_frame(row, column) {
            return o.frames[row][column];
            return this;
        }
        function update() {
            var row_h = o.height/o.rows,
                col_w = o.width/o.columns;

            d3.selectAll('.grid')
                .attr('transform',   function(d) { return 'translate(' +
                                                   Math.floor(d.x_i * col_w) + ',' +
                                                   Math.floor(d.y_i * row_h) + ')';
                                                 })
                .attr('width',  function(d) { return Math.floor(col_w - o.spacing); })
                .attr('height', function(d) { return Math.floor(row_h - o.spacing); });
            return this;
        }
    };
});
