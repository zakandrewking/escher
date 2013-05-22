// tooltip.js
// Zachary King 2013

/** cursor_tootip(node)
    Add a tooltip for any objects near the cursor.

    node - Append the SVG objects to this node.
*/
function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

var text_height = 18;

var insert_linebreaks = function(t, text) {
    var words = text.split('\n');
    t.text('');

    for (var i = 0; i < words.length; i++) {
        var tspan = t.append('tspan').text(words[i]);
        if (i > 0)
            tspan.attr('x', 0)
            .attr('dy', text_height);
    }
    return words.length;
};

function cursor_tooltip(node, w, h, x_scale, y_scale) {
    var mouse_node = node.append('rect')
        .attr("width", w)
        .attr("height", h)
        .attr('style', 'visibility: hidden')
        .attr('pointer-events', 'all');

    xg = x_scale; yg = y_scale

    var r = 10;
    var g = node
        .append('g')
        .attr('class', 'cursor-tooltip')
        .attr('pointer-events', 'none');

    var circle = g.append('circle')
        .attr('class','cursor-tooltip-circle')
        .attr('r', r);
    var tooltip = g.append('g')
        .attr('transform', 'translate('+(r+2)+',0)')
	.append('text')
	.attr('class', 'cursor-tooltip-text');
    var play = false;
    window.setInterval(function(){play=true;}, 100);
    mouse_node.on('mousemove', function (d, i) {
        var loc = d3.mouse(this);
        if (play) {
            g.attr('transform', 'translate('+loc[0]+','+loc[1]+')');
            var texts = d3.selectAll('.point-circle')
                .filter(function (d, i) {
                    var distance = dist(loc[0], loc[1], x_scale(d.f1), y_scale(d.f2));
                    return (distance < r);
                });
            if (texts[0].length > 0) {
                var this_text = "";
                texts.each(function(d) {
                    this_text += d.name + '\n';
                });
                var l = insert_linebreaks(tooltip, this_text.trim());
                tooltip.attr('dy', -l*text_height/2);
            } else {
                tooltip.text("");
                tooltip.attr('dy', '0');
            }
            play = false;
        }
    });
}
