// import json
d3.json("map.json", function(error, json) {
    // console.log(error)
    if (error) return console.warn(error);
    data = json;
    // console.log(data.length);
    visualizeit(data);
});

function visualizeit(data) {

    var width = $(window).width()-80;
    var height = $(window).height()-20;
    s = Math.min(width,height);

    var scale = d3.scale.linear().domain([0, 7000]).range([0, s])


    var canvas = d3.select("body").append("canvas")
        .attr("width", width)
        .attr("height", height)
        .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
        .node().getContext("2d");

    draw(data.reaction_paths);

    function zoom() {
        canvas.save();
        canvas.clearRect(0, 0, width, height);
        canvas.translate(d3.event.translate[0], d3.event.translate[1]);
        canvas.scale(d3.event.scale, d3.event.scale);
        draw(data.reaction_paths);
        canvas.restore();
    }

    function draw(set) {
        var i = -1, n = set.length, d;
        canvas.beginPath();
        while (++i < n) {
            d = set[i];
            canvas.moveTo(d.d, d[1]);
            canvas.arc(d[0], d[1], 2.5, 0, 2 * Math.PI);
        }
        canvas.fill();
    }

}