var Knockout = function() {

    var m = {};
    m.reactions = {};
    m.latest_flux = [];
    m.latest_objective_value = [];

    m.add_reaction = function(reaction) {
	m.reactions[reaction] = true;
    };

    m.get_flux = function(callback) {
	var url = "/knockout-map/";
	var i = -1, start="?",
	    k = Object.keys(m.reactions);
	while (++i < k.length) {
	    if (i>0) start = "&";
	    url += start + "reactions[]=" + encodeURIComponent(k[i]);
	    console.log(url);
	}
	d3.json(url, function(error, json) {
	    if (error) return console.warn(error);
	    var flux = json.x,
		objective = json.f;
	    m.latest_flux = flux;
	    m.latest_objective_value = objective;
	    callback([flux], objective > 1e-7, objective);
	});
    };

    return {
	add_reaction: m.add_reaction,
        get_flux: m.get_flux
    };
};
