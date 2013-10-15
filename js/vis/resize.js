define(function () {
    return { on_resize: on_resize };

    function on_resize(callback, interval) {
        if (typeof interval === 'undefined') interval = 1000;
        window.do_resize = false;
        window.onresize = function(event) {
            window.do_resize = true;
        };
        setInterval( function () {
            if (window.do_resize) {
                callback();
                window.do_resize = false;
            }
        }, interval);
    };
});
