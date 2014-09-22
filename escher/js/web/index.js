function convert_model_id(model_id) {
    var parts = model_id.split('/');
    return parts[1] + '.' + parts[3];
}
function convert_map_id(map_id) {
    var parts = map_id.split('/');
    return parts[1] + '.' + parts[3] + '.' + parts[5];
}
function submit() {
    var map_value = d3.select('#maps').node().value,
	model_value = d3.select('#models').node().value,
	options_value = d3.select('#tools').node().value,
	scroll_value = d3.select('#scroll').node().checked,
	never_ask_value = d3.select('#never_ask').node().checked,	    
	add = [],
	url;
    if (model_value!='none')
	add.push('model_name=' + convert_model_id(model_value));
    if (map_value!='none')
	add.push('map_name=' + convert_map_id(map_value));
    if (scroll_value)
	add.push('scroll_behavior=zoom');
    if (never_ask_value)
	add.push('never_ask_before_quit=true');

    if (options_value=='local_viewer') {
	url = 'local/viewer.html';
    } else if (options_value=='local_builder') {
	url = 'local/builder.html';
    } else if (options_value=='viewer') {
	url = 'viewer.html';
    } else {
	url = 'builder.html';
    }

    url += '?';
    for (var i=0, l=add.length; i < l; i++) {
	if (i > 0) url += '&';
	url += add[i];
    }
    window.location.href = url;
}

function draw_models_select(data) {
    /** Draw the models selector.

     */
    var filter_models = function(model_id) {
	var org = d3.select('#organisms').node().value;
	if (org=='all')
	    return true;
	if (org.split('/')[1]==model_id.split('/').slice(-3)[0])
	    return true;
	return false;
    };

    var model_data = data.models.filter(filter_models),
	models_select = d3.select('#models'),
	models = models_select.selectAll('.model')
	    .data(model_data);
    models.enter()
	.append('option')
	.classed('model', true)
	.attr('value', function(d) { return d; })
	.text(function(d) {
	    var model = d.split('/').slice(-1)[0];
	    return model;
	});
    models.exit().remove();
}
function draw_maps_select(data) {
    /** Draw the models selector.

     */
    var filter_maps = function(map_id) {
	var org = d3.select('#organisms').node().value;
	if (org=='all')
	    return true;
	if (org.split('/')[1]==map_id.split('/').slice(-5)[0])
	    return true;
	return false;
    };

    var map_data = data.maps.filter(filter_maps),
	maps_select = d3.select('#maps'),
	maps = maps_select.selectAll('.map')
	    .data(map_data);
    maps.enter()
	.append('option')
	.classed('map', true)
	.attr('value', function(d) { return d; })
	.text(function(d) {
	    var map = d.split('/').slice(-1)[0],
		model = d.split('/').slice(-3)[0];
	    return map + ' (' + model + ')';
	});
    maps.exit().remove();

    var n = maps_select.node();
    if (map_data.length > 0 && n.selectedIndex==0)
	n.selectedIndex = 1;
}
function draw_organisms_select(data) {
    var org = d3.select('#organisms').selectAll('.organism')
	    .data(data.organisms);
    org.enter()
	.append('option')
	.classed('organism', true)
	.attr('value', function(d) { return d; })
	.text(function(d) {
	    var parts = d.split('/').slice(-1)[0].split('_');
	    return parts[0].toUpperCase() + '. ' + parts[1];
	});
}

function setup() {
    // GO
    draw_organisms_select(data);
    draw_models_select(data);
    draw_maps_select(data);

    // update filters
    d3.select('#organisms')
	.on('change', function() {
	    draw_models_select(data);
	    draw_maps_select(data);
	});

    // make it a builder with a model, and vice-versa
    d3.select('#models')
	.on('change', function() {
	    var is_none = this.value == 'none';
	    d3.select('#tools').selectAll('.tool')
		.attr('disabled', function() {
		    if (is_none || this.value.indexOf('viewer')==-1)
			return null;
		    return true;
		});
	    // make sure a disabled option is not selected
	    var n = d3.select('#tools').node();
	    if (!is_none && n.value.indexOf('viewer')!=-1) {
		n.selectedIndex = n.selectedIndex + 1;
	    }
	});

    // submit button
    d3.select('#submit').on('click', submit);

    // submit on enter
    var selection = d3.select(window),
	kc = 13;
    selection.on('keydown.'+kc, function() {
	if (d3.event.keyCode==kc) {
	    submit();
	}
    });
}
