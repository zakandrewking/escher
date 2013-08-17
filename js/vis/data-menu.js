var DataMenu = function() {
    var s = {};
    s.data = null;
    s.setup = function(options) {
        if (typeof options === 'undefined') options = {};
        var selection       = options.selection       || d3.select('body'),
            getdatafiles    = options.getdatafiles    || null,
	    datafiles       = options.datafiles       || null,
	    update_callback = options.update_callback || null;

        // setup dropdown menu
	// Append menu if it doesn't exist
        var menu = selection.select('.data-menu');
	if (menu.empty()) {
	    menu = selection.append('div')
		.attr('class','data-menu');
	}
        var select_sel = menu.append('form')
            .append('select').attr('class','dropdown-menu');
	// TODO move this somewhere sensible
        // menu.append('div').style('width','100%').text("Press 's' to freeze tooltip");

        if (getdatafiles) {
	    if (datafiles) {
		console.warn('DataMenu: getdatafiles option overrides datafiles');
	    }
            d3.json(getdatafiles, function(error, d) {
		// returns json object:  { data: [file0, file1, ...] }
                if (error) {
		    return console.warn(error);
		} else {
                    s.load_with_files(d.data, select_sel, update_callback, selection);
		}
                return null;
            });
        } else if (datafiles) {
            s.load_with_files(datafiles, select_sel, update_callback, selection);
        } else {
            console.warn('DataMenu: No datafiles given');
        }
	return this;
    };

    s.load_with_files = function(files, select_sel, update_callback, selection) {

        //when it changes
        select_sel.node().addEventListener("change", function() {
            s.load_datafile(this.value, selection, update_callback);
        }, false);

	var file = files[0];

        s.update_dropdown(files, select_sel);
        s.load_datafile(file, selection, update_callback);
    };

    s.load_datafile = function(this_file, selection, callback) {
        d3.json(this_file, function(error, d) {
            if (error) {
                return console.warn(error);
                selection.append('error loading');
                s.data = null;
            } else {
                s.data = d;
		if (callback) {
		    callback(d);
		}
            }
            return null;
        });
    };

    s.update_dropdown = function(list, select_sel) {
        // update select element with d3 selection /select_sel/ to have options
        // given by /list/
	// TODO remove paths from file list
        select_sel.selectAll(".menu-option")
            .data(list)
            .enter()
            .append('option')
            .attr('value', function (d) { return d; } )
            .text(function (d) { return d; } );
        // TODO set value to default_filename_index
        select_sel.node().focus();
    };

    s.get_data = function() { 
	return s.data;
    };

    return {
        get_data: s.get_data,
        setup: s.setup
    };
};
