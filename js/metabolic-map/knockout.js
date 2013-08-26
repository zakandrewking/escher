var Knockout = function() {

    var m = {};
    m.reactions = [];
    m.latest_flux = [];
    m.latest_objective_value = [];

    m.add_reaction = function(reaction) {
	m.reactions.push(reaction);
    };

    m.get_flux = function(callback) {
	var url = "/knockout_map/";
	var i = -1, start="?";
	while (++i < m.reactions.length) {
	    if (i>0) start = "&";
	    url += start + "reactions[]=" + encodeURIComponent(m.reactions[i]);
	    console.log(url);
	}
	d3.json(url, function(error, json) {
	    if (error) return console.warn(error);
	    var flux = json.x,
		objective = json.f;
	    m.latest_flux = flux;
	    m.latest_objective_value = objective;
	    callback([flux]);
	});
    };

    return {
	add_reaction: m.add_reaction,
        get_flux: m.get_flux
    };
};
