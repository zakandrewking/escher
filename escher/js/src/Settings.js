define(["utils"], function(utils) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
			    get_state: get_state,
			    set_state: set_state };

    return SearchBar;

    // instance methods
    function init(reaction_data_styles, auto_reaction_domain, 
		  metabolite_data_styles, auto_metabolite_domain) {
	this.reaction_data_styles = reaction_data_styles;
	this.auto_reaction_domain = auto_reaction_domain;
	this.reaction_domain = [-10, 0, 10];
	this.reaction_color_range = ['green', 'rgb(200,200,200)', 'red'];
	this.reaction_size_range = [12, 6, 12];
	this.metabolite_data_styles = metabolite_data_styles;
	this.auto_metabolite_domain = auto_metabolite_domain;
	this.metabolite_domain = [-10, 0, 10];
	this.metabolite_color_range = ['green', 'white', 'red'];
	this.metabolite_size_range = [15, 8, 15];
    }
    function get_state() {
	return { // reactions
	    reaction_data_styles: this.reaction_data_styles,
	    auto_reaction_domain: this.auto_reaction_domain,
	    reaction_domain: this.reaction_domain,
	    reaction_color_range: this.reaction_color_range,
	    reaction_size_range: this.reaction_size_range,
	    // metabolites
	    metabolite_data_styles: this.metabolite_data_styles,
	    auto_metabolite_domain: this.auto_metabolite_domain,
	    metabolite_domain: this.metabolite_domain,
	    metabolite_color_range: this.metabolite_color_range,
	    metabolite_size_range: this.metabolite_size_range 
	};
    }
    function set_state(state) {
	// reactions
	this.reaction_data_styles = state.reaction_data_styles,
	this.auto_reaction_domain = state.auto_reaction_domain,
	this.reaction_domain = state.reaction_domain;
	this.reaction_color_range = state.reaction_color_range;
	this.reaction_size_range = state.reaction_size_range;
	// metabolites
	this.metabolite_data_styles = state.metabolite_data_styles;
	this.auto_metabolite_domain = state.auto_metabolite_domain;
	this.metabolite_domain = state.metabolite_domain;
	this.metabolite_color_range = state.metabolite_color_range;
	this.metabolite_size_range = state.metabolite_size_range;
    }
});
