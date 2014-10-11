function convert_url(url) {
    var parts = url.split('/');
    if (parts.length==2)
	return parts[1];
    if (parts.length==4)
	return parts[1] + '.' + parts[3];
    if (parts.length==6)
	return parts[1] + '.' + parts[3] + '.' + parts[5];
    throw new Error('Bad url ' + id);
}
function get_organism(name) {
    /** Get organism from a map or model name.

     */
    var parts = name.replace('.json', '').split('.');
    if (parts.length==2 || parts.length==3)
	return parts[0];
    return null;
}
function get_organisms(l) {
    /** Get organisms from a list of maps and models.

     */
    var organisms = [];
    l.forEach(function(name) {
	var org = get_organism(name);
	if (org!==null)
	    organisms.push(org);
    });
    return organisms;
}
function get_quick_jump(this_map, maps) {
    /** Find maps with the same organism. Returns null if no quick jump options
     * could be found.

     */
    var org = get_organism(this_map);
    if (org === null)
	return null;
    
    var quick_jump = [],
	all_maps = [];
    if (maps.web !== null)
	all_maps = all_maps.concat(maps.web);
    if (maps.local !== null)
	all_maps = all_maps.concat(maps.local);
    all_maps.forEach(function(map) {
	if (get_organism(map)==org)
	    quick_jump.push(map);
    });
    return quick_jump.length == 0 ? null : quick_jump;
}
function submit(maps) {
    // get the selections
    var map_value = d3.select('#maps').node().value,
	model_value = d3.select('#models').node().value,
	options_value = d3.select('#tools').node().value,
	scroll_value = d3.select('#scroll').node().checked,
	never_ask_value = d3.select('#never_ask').node().checked,	    
	add = [],
	url;
    if (model_value!='none')
	add.push('model_name=' + model_value);
    if (map_value!='none')
	add.push('map_name=' + map_value);
    if (scroll_value)
	add.push('scroll_behavior=zoom');
    if (never_ask_value)
	add.push('never_ask_before_quit=true');

    // choose the file
    if (options_value=='local_viewer') {
	url = 'local/viewer.html';
    } else if (options_value=='local_builder') {
	url = 'local/builder.html';
    } else if (options_value=='viewer') {
	url = 'viewer.html';
    } else {
	url = 'builder.html';
    }

    // set the quick jump maps
    var quick_jump = get_quick_jump(map_value, maps);
    if (quick_jump !== null) {
	quick_jump.forEach(function(o) {
	    add.push('quick_jump[]=' + o);
	})
    }

    url += '?';
    for (var i=0, l=add.length; i < l; i++) {
	if (i > 0) url += '&';
	url += add[i];
    }
    window.open(url,'_blank');
}

function draw_models_select(models) {
    /** Draw the models selector.

     */

    var filter_models = function(model_id) {
	var org = d3.select('#organisms').node().value;
	if (org=='all')
	    return true;
	if (org==model_id.split('.')[0])
	    return true;
	return false;
    };
    
    var web_sel, local_sel,
	select_sel = d3.select('#models');
    if (models.local===null) {
	web_sel = select_sel;
    } else {
	select_sel.selectAll('optgroup')
	    .data([['local', 'Cached'], ['web', 'Web']])
	    .enter()
	    .append('optgroup')
	    .attr('label', function(d) { return d[1]; })
	    .attr('id', function(d) { return 'models-' + d[0]; });
	web_sel = select_sel.select('#models-web');
	local_sel = select_sel.select('#models-local');
    }
     
    // web
    if (models.web !== null) {
	var model_data = models.web.filter(filter_models),
	    models_sel = web_sel.selectAll('.model')
	    .data(model_data, function(d) { return d; });
	models_sel.enter()
	    .append('option')
	    .classed('model', true)
	    .attr('value', function(d) { return d; })
	    .text(function(d) {
		return d.split('.').slice(-1)[0];
	    });
	models_sel.exit().remove();
    }
    
    // cached
    if (models.local !== null) {
	var model_data = models.local.filter(filter_models),
	    models_sel = local_sel.selectAll('.model')
	    .data(model_data, function(d) { return d; });
	models_sel.enter()
	    .append('option')
	    .classed('model', true)
	    .attr('value', function(d) { return d; })
	    .text(function(d) {
		var parts = d.split('.');
		if (parts.length==2) {
		    return d.split('.').slice(-1)[0];
		} else {
		    return d;
		}
	    });
	models_sel.exit().remove();
    }
}
function draw_maps_select(maps) {
    /** Draw the models selector.

     */
    var filter_maps = function(map_id) {
	var org = d3.select('#organisms').node().value;
	if (org=='all')
	    return true;
	if (org==map_id.split('.')[0])
	    return true;
	return false;
    };

    var web_sel, local_sel,
	select_sel = d3.select('#maps');
    if (maps.local===null) {
	web_sel = d3.select('#maps');
    } else {
	select_sel.selectAll('optgroup')
	    .data([['local', 'Cached'], ['web', 'Web']])
	    .enter()
	    .append('optgroup')
	    .attr('label', function(d) { return d[1]; })
	    .attr('id', function(d) { return 'maps-' + d[0]; });
	web_sel = d3.select('#maps-web');
	local_sel = d3.select('#maps-local');
    }
    
    // web
    if (maps.web !== null) {
	var map_data = maps.web.filter(filter_maps),
	    maps_sel = web_sel.selectAll('.map')
	    .data(map_data, function(d) { return d; });
	maps_sel.enter()
	    .append('option')
	    .classed('map', true)
	    .attr('value', function(d) { return d; })
	    .text(function(d) {
		var map = d.split('.').slice(-1)[0],
		    model = d.split('.').slice(-2)[0];
		return map + ' (' + model + ')';
	    });
	maps_sel.exit().remove();
    }

    // cached
    if (maps.local!==null) {
	var map_data = maps.local.filter(filter_maps),
	    maps_sel = local_sel.selectAll('.map')
	    .data(map_data, function(d) { return d; });
	maps_sel.enter()
	    .append('option')
	    .classed('map', true)
	    .attr('value', function(d) { return d; })
	    .text(function(d) {
		var parts = d.split('.');
		if (parts.length==3) {
		    var map = d.split('.').slice(-1)[0],
			model = d.split('.').slice(-2)[0];
		    return map + ' (' + model + ')';
		} else {
		    return d;
		}
	    });
	maps_sel.exit().remove();
    }

    // select the first model
    var n = select_sel.node();
    if (map_data.length > 0 && n.selectedIndex==0)
	n.selectedIndex = 1;

    // show the map_name
    
}
function draw_organisms_select(organisms) {
    var org = d3.select('#organisms').selectAll('.organism')
	.data(organisms, function(d) { return d; });
    org.enter()
	.append('option')
	.classed('organism', true)
	.attr('value', function(d) { return d; })
	.text(function(d) {
	    var parts = d.split('_');
	    return parts[0].toUpperCase() + '. ' + parts[1];
	});
}

function setup(data, local_maps, local_models) {
    // GO
    var uniq = function(a) {
	var seen = {};
	return a.filter(function(item) {
	    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
	});
    };
    var not_cached = function(web, local) {
	if (local===null) return web;
	return web.filter(function(m) {
	    return local.indexOf(m)==-1;
	});
    };
    
    // organisms
    var organisms = [];
    if (data!==null)
	organisms = uniq(organisms.concat(data.organisms.map(convert_url)));
    if (local_models!==null)
	organisms = uniq(organisms.concat(get_organisms(local_models)));
    if (local_maps!==null)
	organisms = uniq(organisms.concat(get_organisms(local_maps)));
    
    // models
    var models = {};
    if (data===null)
	models.web = null;
    else
	models.web = not_cached(data.models.map(convert_url), local_models);
    models.local = local_models;
    
    // maps
    var maps = {};
    if (data===null)
	maps.web = null;
    else
	maps.web = not_cached(data.maps.map(convert_url), local_maps);
    maps.local = local_maps;
    
    draw_organisms_select(organisms);
    draw_models_select(models);
    draw_maps_select(maps);

    // select offline if it looks like we're offline
    if (data === null) {
	var n = d3.select('#tools').node();
	n.selectedIndex = 2;
    }
    
    // update filters
    d3.select('#organisms')
	.on('change', function() {
	    draw_models_select(models);
	    draw_maps_select(maps);
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
    d3.select('#submit').on('click', submit.bind(null, maps));

    // submit on enter
    var selection = d3.select(window),
	kc = 13;
    selection.on('keydown.'+kc, function() {
	if (d3.event.keyCode==kc) {
	    submit();
	}
    });
}
