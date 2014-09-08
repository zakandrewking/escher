function get_value(id) {
    var a = document.getElementById(id);
    return a.options[a.selectedIndex].value;
}

function submit() {
    var map_value = get_value('map'),
	model_value = get_value('model'),
	options_value = get_value('options'),
	add = [],
	url;
    if (model_value!='none')
	add.push('model_name=' + model_value);	 
    if (map_value!='none')
	add.push('map_name=' + map_value);

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
    window.location.href = url; // TODO https here
}
