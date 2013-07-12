var update_on_resize = function(callback, interval) {
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
