define(["vis/utils"], function(utils) {
    /**
     */

    var CobraModel = utils.make_class();
    // instance methods
    CobraModel.prototype = { init: init };

    return CobraModel;

    function init(reactions, cofactors) {
	this.reactions = reactions;
	this.cofactors = cofactors;
    }
});
