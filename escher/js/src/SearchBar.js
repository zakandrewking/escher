define(["utils"], function(utils) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
			    set_index: set_index };

    return SearchBar;

    // instance methods
    function init(selection, search_index) {
	var container = selection.append('div')
		.attr('class', 'search-container');
	this.input = container.append('input')
	    .attr('class', 'search-bar');
	container.append('button')
	    .attr('class', "button search-close-button")
	    .text('×');
	this.counter = container.append('div')
	    .attr('class', 'search-counter');

	if (search_index!==undefined)
	    this.set_index(search_index);
    }

    function set_index(search_index) {
	this.input.on('input', function(counter, index) {
	    var results = index.find(this.value);
	    if (this.value=="")
		counter.text("");
	    else
		counter.text(results.length + " results");
	}.bind(this.input.node(), this.counter, search_index));
    }
});
