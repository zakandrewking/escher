var DataMenu = function() {
    var s = {};
    s.data = null;
    s.setup = function(options) {
        if (typeof options === 'undefined') options = {};
        s.selection = options.selection || d3.select('body');
        s.getdatafiles = options.getdatafiles || false;
	s.datafile = options.datafile || null;

        // setup dropdown menu
	// Append menu if it doesn't exist
        var menu = s.selection.select('#menu')
		.data(['menu'])
		.enter()
		.append('div')
		.attr('id','menu');
        var form = menu.append('form')
            .append('select').attr('id','dropdown-menu');
	// TODO move this somewhere sensible
        // menu.append('div').style('width','100%').text("Press 's' to freeze tooltip");

        if (s.getdatafiles) {
	    if (s.datafile) {
		console.warn('DataMenu: getdatafiles option overrides datafile');
	    }
            d3.json('getdatafiles', function(error, d) {
		// returns json object:  { data: [file0, file1, ...] }
                if (error) {
		    return console.warn(error);
		} else {
                    s.load_with_files(d.data, form);
		}
                return null;
            });
        } else if (s.datafile) {
            s.load_with_files([s.datafile], form);
        } else {
            console.warn('DataMenu: No datafile given');
        }
	return this;
    };

    s.load_with_files = function(files, menu_sel) {

        //when it changes
        document.getElementById("dropdown-menu").addEventListener("change", function() {
            s.load_datafile(this.value);
        }, false);

        // var file,
        //     default_filename_index = 0;
        // if (default_filename_index < files.length) {
        //     file = files[default_filename_index];
        // } else {
        //     file = files[0];
        // }

	var file = files[0];

        s.update_dropdown(files, menu_sel);
        s.load_datafile(file);
    };

    s.load_datafile = function(this_file) {
        d3.json(this_file, function(error, d) {
            if (error) {
                return console.warn(error);
                s.selection.append('error loading');
                s.data = null;
            } else {
                s.data = d;
            }
            return null;
        });
    };

    s.update_dropdown = function(list, form_sel) {
        // update select element with d3 selection /form_sel/ to have options
        // given by /list/
        form_sel.empty();
	// TODO remove paths from file list
        form_sel.selectAll(".menu-option")
            .data(list)
            .enter()
            .append('option')
            .attr('value', function (d) { return d; } )
            .text(function (d) { return d; } );
        // TODO set value to default_filename_index
        form_sel.node().focus();
    };

    s.get_data = function() { 
	return s.data;
    };

    return {
        get_data: s.get_data,
        setup: s.setup
    };
};
