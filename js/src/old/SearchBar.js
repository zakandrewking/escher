define(["utils", "CallbackManager"], function(utils, CallbackManager) {
    /** 
     */

    var SearchBar = utils.make_class();
    // instance methods
    SearchBar.prototype = { init: init,
                            is_visible: is_visible,
                            toggle: toggle,
                            update: update,
                            next: next,
                            previous: previous };

    return SearchBar;

    // instance methods
    function init(sel, search_index, map) {
        var container = sel.attr('class', 'search-container')
                .style('display', 'none');
        this.input = container.append('input')
            .attr('class', 'search-bar');
        var group = container.append('div').attr('class', 'btn-group btn-group-sm');
        group.append('button')
            .attr("class", "btn btn-default")
            .on('click', this.previous.bind(this))
            .append('span').attr('class', "glyphicon glyphicon-chevron-left");
        group.append('button')
            .attr("class", "btn btn-default")
            .on('click', this.next.bind(this))
            .append('span').attr('class', "glyphicon glyphicon-chevron-right");
        this.counter = container.append('div')
            .attr('class', 'search-counter');
        container.append('button')
            .attr("class", "btn btn-sm btn-default close-button")
            .on('click', function() {
                this.toggle(false);
            }.bind(this))
            .append("span").attr("class",  "glyphicon glyphicon-remove");
        
        this.callback_manager = new CallbackManager();

        this.selection = container;
        this.map = map;
        this.search_index = search_index;

        this.current = 1;
        this.results = null;

        var on_input_fn = function(input) {
            this.current = 1;
            this.results = this.search_index.find(input.value);
            this.update();
        }.bind(this, this.input.node());
        this.input.on('input', utils.debounce(on_input_fn, 200));
    }
    function is_visible() {
        return this.selection.style('display') != 'none';
    }
    function toggle(on_off) {
        if (on_off===undefined) this.is_active = !this.is_active;
        else this.is_active = on_off;

        if (this.is_active) {
            this.selection.style('display', null);
            this.counter.text("");
            this.input.node().value = "";
            this.input.node().focus();
            // escape key
            this.escape = this.map.key_manager
                .add_escape_listener(function() {
                    this.toggle(false);
                }.bind(this), 'settings');
            // enter key
            this.enter = this.map.key_manager
                .add_enter_listener(function() {
                    this.next();
                }.bind(this), 'settings');
            // run the show callback
            this.callback_manager.run('show');
        } else {
            this.map.highlight(null);
            this.selection.style("display", "none");
            this.results = null;
            if (this.escape) this.escape.clear();
            this.escape = null;
            if (this.enter) this.enter.clear();
            this.enter = null;
            // run the hide callback
            this.callback_manager.run('hide');
        }
    }
    function update() {
        if (this.results == null) {
            this.counter.text("");
            this.map.highlight(null);
        } else if (this.results.length == 0) {
            this.counter.text("0 / 0");
            this.map.highlight(null);
        } else {
            this.counter.text(this.current + " / " + this.results.length);
            var r = this.results[this.current - 1];
            if (r.type=='reaction') {           
                this.map.zoom_to_reaction(r.reaction_id);
                this.map.highlight_reaction(r.reaction_id);
            } else if (r.type=='metabolite') {
                this.map.zoom_to_node(r.node_id);
                this.map.highlight_node(r.node_id);
            } else if (r.type=='text_label') {
                this.map.zoom_to_text_label(r.text_label_id);
                this.map.highlight_text_label(r.text_label_id);
            } else {
                throw new Error('Bad search index data type: ' + r.type);
            }
        }
    }
    function next() {
        if (this.results == null) return;
        if (this.current==this.results.length)
            this.current = 1;
        else
            this.current += 1;
        this.update();
    }
    function previous() {
        if (this.results == null) return;
        if (this.current==1)
            this.current = this.results.length;
        else
            this.current -= 1;
        this.update();
    } 
});
