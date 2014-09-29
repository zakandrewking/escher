define(["utils", "data_styles"], function(utils, data_styles) {
    return { individual_button: individual_button,
	     radio_button_group: radio_button_group,
	     button_group: button_group,
	     dropdown_menu: dropdown_menu,
	     set_button: set_button,
	     set_input_button: set_input_button };

    function individual_button(s, button) {
	var b = s.append('button'),
	    c = b.append('span');
	if ('id' in button) b.attr('id', button.id);
	if ('classes' in button) b.attr('class', button.classes);
	if ('text' in button) c.text(button.text);
	if ('icon' in button) c.classed(button.icon, true);
	if ('key' in button) set_button(b, button.key);
	// if ('tooltip' in button) 
	b.attr('title', button.tooltip);
    }
    function radio_button_group(s) {
	var s2 = s.append('li')
		.attr('class', 'btn-group-vertical')
		.attr('data-toggle', 'buttons');
	return { button: function(button) {
	    var b = s2.append("label")
		    .attr("class", "btn btn-default");
	    b.append('input').attr('type', 'radio');
	    var c = b.append("span");
	    if ('id' in button) b.attr('id', button.id);
	    if ('text' in button) c.text(button.text);
	    if ('icon' in button) c.classed(button.icon, true);
	    if ('key' in button) set_button(b, button.key);
	    if ('tooltip' in button) b.attr('title', button.tooltip);
	    return this;
	}};
    }
    function button_group(s) {
	var s2 = s.attr('class', 'btn-group-vertical');
	return { button: function(button) {
	    var b = s2.append("button")
		    .attr("class", "btn btn-default");
	    var c = b.append("span");
	    if ('id' in button) b.attr('id', button.id);
	    if ('text' in button) c.text(button.text);
	    if ('icon' in button) c.classed(button.icon, true);
	    if ('key' in button) set_button(b, button.key);
	    if ('tooltip' in button) b.attr('title', button.tooltip);
	    return this;
	}};
    }
    function dropdown_menu(s, name, pull_right) {
	if (pull_right === undefined) pull_right = false;
	var s2 = s.append('li')
		.attr('class', 'dropdown');
	s2.append('button').text(name+" ")
	    .attr('class', 'btn btn-link btn-sm dropdown-button')
	    .attr('data-toggle', 'dropdown')
	    .append('b').attr('class', 'caret');
	var ul = s2.append('ul')
		.attr('class', 'dropdown-menu')
		.classed('pull-right', pull_right)
		.attr('role', 'menu')
		.attr('aria-labelledby', 'dLabel');
	return {
	    button: function(button) {
		var li = ul.append("li")
			.attr('role', 'presentation'),
		    link = li.append("a")
			.attr('href', '#'),
		    icon = link.append('span')
			.attr('class', 'dropdown-button-icon'),
		    text = link.append('span')
			.attr('class', 'dropdown-button-text');
		if ('id' in button) li.attr('id', button.id);
		if ('text' in button) text.text(" "+button.text);
		if ('icon' in button) icon.classed(button.icon, true);
		
		if ('key' in button) {
		    set_button(link, button.key);
		} else if ('input' in button) {
		    var input = button.input,
			out = set_input_button(link, li, input.fn);
		    if ('assign' in input && 'key' in input)
			input.assign[input.key] = out;
		}
		return this;
	    },
	    divider: function() {
		ul.append("li")
		    .attr('role', 'presentation')
		    .attr('class', 'divider');
		return this;
	    }
	};
    }
    function set_button(b, key, name) {
	if (name !== undefined) b.text(name);
	b.on("click", function() {
	    key.fn.call(key.target);
	});
    }
    function set_input_button(b, s, fn) {
	var input = s.append("input")
		.attr("type", "file")
		.style("display", "none")
		.on("change", function() { 
		    utils.load_json_or_csv(this.files[0],
					   data_styles.csv_converter,
					   function(e, d) {
					       fn(e, d);
					       this.value = "";
					   }.bind(this));
		});
	b.on('click', function(e) {
	    input.node().click();
	});
	return function() { input.node().click(); };
    }
});

