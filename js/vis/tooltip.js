define(["./scaffold", "lib/d3"], function (scaffold, d3) {
    /** tooltip.js

     (c) Zachary King 2013
     */

    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {
            text_height: 18 });

	return { cursor_tooltip: cursor_tooltip };

	// definitions
        function dist(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        }

        function insert_linebreaks(t, text) {
            var words = text.split('\n');
            t.text('');

            for (var i = 0; i < words.length; i++) {
                var tspan = t.append('tspan').text(words[i]);
                if (i > 0)
                    tspan.attr('x', 0)
                    .attr('dy', o.text_height);
            }
            return words.length;
        };

        function create_textspans(tooltip, loc) {
            var texts = d3.selectAll('.point-circle')
                    .filter(function (d, i) {
                        var distance = dist(loc[0], loc[1], window.x_scale(d.f1), window.y_scale(d.f2));
                        return (distance < window.radius);
                    });
            if (texts[0].length > 0) {
                var this_text = "";
                texts.each(function(d) {
                    this_text += d.name + '\n';
                });
                var l = insert_linebreaks(tooltip, this_text.trim());
                tooltip.attr('dy', -l*o.text_height/2);
            } else {
                tooltip.text("");
                tooltip.attr('dy', '0');
            }
        }


        function cursor_tooltip(node, w, h, x_scale, y_scale, save_key) {
            /** cursor_tootip(node)

             Add a tooltip for any objects near the cursor.

             node - Append the SVG objects to this node.
             */
            var mouse_node = node.append('rect')
                    .attr("width", w)
                    .attr("height", h)
                    .attr('style', 'visibility: hidden')
                    .attr('pointer-events', 'all');

            window.x_scale = x_scale;
            window.y_scale = y_scale;
            window.radius = 10;
            var g = node
                    .append('g')
                    .attr('class', 'cursor-tooltip')
                    .attr('pointer-events', 'none');

            var circle = g.append('circle')
                    .attr('class','cursor-tooltip-circle')
                    .attr('r', window.radius);
            var tooltip = g.append('g')
                    .attr('transform', 'translate('+(window.radius+2)+',0)')
                    .append('text')
                    .attr('class', 'cursor-tooltip-text');
            var play = false;
            window.setInterval(function(){play=true;}, 100);
            mouse_node.on('mousemove', function (d, i) {
                window.loc = d3.mouse(this);
                if (play) {
                    g.attr('transform', 'translate('+loc[0]+','+loc[1]+')');
                    create_textspans(tooltip, loc);
                    play = false;
                }
            });

            var saved_locs = [];
            var saved_node = node.append('g').attr('id', 'saved_tooltips');
            function update_circles(s) {
                saved_node.selectAll('.saved_tooltip')
                    .data(s)
                    .enter()
                    .append('g')
                    .attr('class', 'saved_tooltip')
                    .attr('transform', function (d) {
                        return 'translate('+d[0]+','+d[1]+')';
                    })
                    .call(add_tooltip);
            }
            if (save_key>=0) {
                d3.select(window).on("keydown", function() {
                    if (d3.event.keyCode==save_key) {
                        saved_locs = saved_locs.concat([window.loc]);
                        update_circles(saved_locs);
                    }
                });
            }
        }

        function add_tooltip() {
            this.append('circle')
                .attr('class','cursor-tooltip-circle')
                .attr('r', window.radius);
            var tt = this.append('g')
                    .attr('transform', 'translate('+(window.radius+2)+',0)')
                    .append('text')
                    .attr('class', 'cursor-tooltip-text');
            create_textspans(tt, this.datum());
        }

    };
});
