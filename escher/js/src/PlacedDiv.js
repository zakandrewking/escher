define(['utils'], function(utils) {
    /** A container to position an html div to match the coordinates of a SVG element.

     */

    var PlacedDiv = utils.make_class();
    // instance methods
    PlacedDiv.prototype = { init: init,
                            is_visible: is_visible,
                            place: place,
                            hide: hide };
    return PlacedDiv;

    // definitions
    function init(div, map, displacement) {
        // make the input box
        this.div = div;

        if (displacement===undefined)
            displacement = {x: 0, y: 0};
        this.displacement = displacement;

        this.map = map;
    }

    function is_visible() {
        return this.div.style('display') != 'none';
    }

    function place(coords) {
        /** Position the html div to match the given SVG coordinates.

         */
        // show the input
        this.div.style('display', null);

        // move the new input
        var window_translate = this.map.zoom_container.window_translate,
            window_scale = this.map.zoom_container.window_scale,
            map_size = this.map.get_size(),
            left = Math.max(20,
                            Math.min(map_size.width - 270,
                                     (window_scale * coords.x + window_translate.x - this.displacement.x))),
            top = Math.max(20,
                           Math.min(map_size.height - 40,
                                    (window_scale * coords.y + window_translate.y - this.displacement.y)));
        this.div.style('position', 'absolute')
            .style('display', 'block')
            .style('left', left+'px')
            .style('top', top+'px');
    }
    
    function hide() {
        this.div.style('display', 'none');
    }
});
