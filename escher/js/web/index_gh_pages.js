// get the models
$.getJSON('models/v1/index.json', function(data) {
    var sel = $('#model');
    data.forEach(function(model_loc) {
	sel.append($('<option/>', {
	    value: model_loc,
	    html: model_loc
	}));
    });
});

// get the maps
$.getJSON('maps/v1/index.json', function(data) {
    var sel = $('#map');
    data.forEach(function(model_loc) {
	sel.append($('<option/>', {
	    value: model_loc,
	    html: model_loc
	}));
    });
});
