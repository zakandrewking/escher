define(function () {
    if (window.$===undefined) return console.warn('jquery is still not loaded.');
    if (window.$.ui===undefined) return console.warn('jquery-ui is not loaded.');
    return window.$.ui;
});
