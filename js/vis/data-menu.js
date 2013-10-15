define(["./scaffold", "lib/d3"], function(scaffold, d3) {
    return function(options) {
        var o = scaffold.set_options(options, {
            selection: d3.select("body"),
            getdatafiles: null,
            datafiles: null,
            update_callback: null });

        // setup dropdown menu
        // Append menu if it doesn't exist
        var menu = o.selection.select('.data-menu');
        if (menu.empty()) {
            menu = o.selection.append('div')
                .attr('class','data-menu');
        }
        var select_sel = menu.append('form')
            .append('select').attr('class','dropdown-menu');
        // TODO move this somewhere sensible
        // menu.append('div').style('width','100%').text("Press 's' to freeze tooltip");

        if (o.getdatafiles) {
            if (o.datafiles) {
                console.warn('DataMenu: getdatafiles option overrides datafiles');
            }
            d3.json(o.getdatafiles, function(error, d) {
                // returns json object:  { data: [file0, file1, ...] }
                if (error) {
                    return console.warn(error);
                } else {
                    load_with_files(d.data, select_sel, o.update_callback, o.selection);
                }
                return null;
            });
        } else if (o.datafiles) {
            load_with_files(datafiles, select_sel, o.update_callback, o.selection);
        } else {
            console.warn('DataMenu: No datafiles given');
        }

        return { update: update };

        // definitions
        function load_with_files(files, select_sel, update_callback, selection) {

            //when it changes
            select_sel.node().addEventListener("change", function() {
                load_datafile(this.value, selection, update_callback);
            }, false);

            var file = files[0];

            update(files, select_sel);
            load_datafile(file, selection, update_callback);
        };
        function load_datafile(this_file, selection, callback) {
            scaffold.load_the_file(this_file, function(error, data) {
                if (error) {
                    return console.warn(error);
                    selection.append('error loading');
                    o.data = null;
                } else {
                    o.data = data;
                    if (callback) {
                        callback(data);
                    }
                }
            });
        };

        function update(list, select_sel) {
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

        function get_data() {
            return o.data;
        };
    };
});
