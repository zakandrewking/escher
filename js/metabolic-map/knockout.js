define(["vis/scaffold", "lib/d3"], function (scaffold, d3) {
    return function(options) {
        // set defaults
        var o = scaffold.set_options(options, {});
        o.reactions = {};
        o.latest_flux = [];
        o.latest_objective_value = [];

        return {
            add_reaction: add_reaction,
            get_flux: get_flux
        };

	// definitions
        function add_reaction(reaction) {
            o.reactions[reaction] = true;
        }
        function get_flux(callback) {
            var url = "/knockout-map/";
            var i = -1, start="?",
                k = Object.keys(o.reactions);
            while (++i < k.length) {
                if (i>0) start = "&";
                url += start + "reactions[]=" + encodeURIComponent(k[i]);
                console.log(url);
            }
            d3.json(url, function(error, json) {
                if (error) return console.warn(error);
                var flux = json.x,
                    objective = json.f;
                o.latest_flux = flux;
                o.latest_objective_value = objective;
                callback([flux], objective > 1e-7, objective);
		return null;
            });
        }
    };
});
