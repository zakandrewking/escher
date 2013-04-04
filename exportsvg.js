// To add a button:
// // add export svg button
// console.log('adding button');
// x = d3.select('body')
//     .append('div')
//     .attr("style", "margin:0px;position:absolute;top:15px;left:15px;background-color:white;border-radius:15px;")
//     .attr('id', 'button-container');
// x.append('button')
//     .attr('type', 'button')
//     .attr('onclick', 'exportSvg()')
//     .text('generate svg file');
// x.append('div')
//     .text('Google Chrome only')
//     .attr('style','font-family:sans-serif;color:grey;font-size:8pt;text-align:center;width:100%');

function exportSvg() {
    // generate and download a .svg file for the current map
    // based on: https://github.com/agordon/d3export_demo
    var svg = d3.select('svg').node();
    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);
    // Optional: prettify the XML with proper indentations
    svg_xml = vkbeautify.xml(svg_xml);

    // generate a file in Google Chrome
    // lots of help from: http://www.html5rocks.com/en/tutorials/file/filesystem/ and
    // http://stackoverflow.com/questions/7160720/create-a-file-using-javascript-in-chrome-on-client-side
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    function errorHandler(e) {
        var msg = '';

        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        };

        console.log('Error: ' + msg);
    }

    // delete file if it exists
    window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
        fs.root.getFile('my_map.svg', {create: false}, function(fileEntry) {

            fileEntry.remove(function() {
                console.log('File removed.');
            }, errorHandler);

        }, errorHandler);
    }, errorHandler);

    function onInitFs(fs) {
        fs.root.getFile('my_map.svg', {create: true}, function(fileEntry) {
            // error if file already exists

            // Create a FileWriter object for our FileEntry
            fileEntry.createWriter(function(fileWriter) {

                fileWriter.onwriteend = function(e) {
                    console.log('Write completed.');
                };

                fileWriter.onerror = function(e) {
                    console.log('Write failed: ' + e.toString());
                };

                // Create a new Blob and write it to log.txt.
                var blob = new Blob([svg_xml], {type: 'text/plain'});

                fileWriter.addEventListener("writeend", function() {
                    // navigate to file, will download
                    location.href = fileEntry.toURL();
                }, false);

                fileWriter.write(blob);

            }, errorHandler);
        }, errorHandler);
    }
    window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
}