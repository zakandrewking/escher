/** Data Slider */

var utils = require('./utils');
var CallbackManager = require('./CallbackManager');
var Slider = require("bootstrap-slider");

var DataSlider = utils.make_class();

// instance methods
DataSlider.prototype = {
    init: init,
    is_visible: is_visible,
    toggle: toggle,
    toggle_compare: toggle_compare,
    on_load: on_load
};
module.exports = DataSlider;

function init(sel) {
    var container = sel.attr('class', 'slider-container')
        .attr('align', 'center');

    // Data Stats
    this.columns = container.append('div')
        .attr('id', 'data-columns');

    this.rows = container.append('div')
        .attr('id', 'data-rows');

    // Data slider
    this.slider = container.append('input')
        .attr('id', 'data-slider');

    this.data_slider = new Slider('#data-slider', {
        id: 'data-slider-container',
        min: 0,
        value: 0,
        tooltip: 'hide'
    });

    // Checkbox
    this.checkbox = container.append('input')
        .attr('type', 'checkbox')
        .attr('id', 'compare_checkbox');

    this.checkbox_text = container.append('span')
        .text('Compare');

    // Compare Data Slider
    this.compare_slider = container.append('input')
        .attr('id', 'compare-data-slider');

    this.compare_data_slider = new Slider('#compare-data-slider', {
        id: 'compare-data-slider-container',
        min: 0,
        value: 0,
        tooltip: 'hide'
    });

    toggle_compare(false);

    this.callback_manager = new CallbackManager();

    this.selection = container;
    this.data = null;
    this.type = null;
    this.index = 0;
    this.compare_index = 0;
}

function is_visible() {
    return this.selection.style('display') !== 'none';
}

function toggle(on_off) {
    if (on_off===undefined) this.is_active = !this.is_active;
    else this.is_active = on_off;

    if (this.is_active) {
        this.selection.style('display', null);

        document.getElementById('compare_checkbox').checked = false;

        toggle_compare(false);

        // run the show callback
        this.callback_manager.run('show');
    } else {
        this.selection.style('display', 'none');
        // run the hide callback
        this.callback_manager.run('hide');
    }
}

function toggle_compare(on_off) {
    var compare_slider_container = document.getElementById('compare-data-slider-container');

    if (on_off) {
        compare_slider_container.style.display = null;

        this.compare_data_slider.setValue(0)
            .setAttribute('max', this.data.length-2);
    } else {
        compare_slider_container.style.display = 'none';
    }
}

function on_load(data, type) {
    this.data = data;
    this.type = type;

    if (data.length === undefined) {
        this.toggle(false);
    } else {
        this.toggle(true);
    }

    this.data_slider.setValue(0)
        .setAttribute('max', data.length-1);

    this.columns.text('Dataset: 1/' + data.length);
    this.rows.text('Data Points: ' + Object.keys(data[0]).length);
}