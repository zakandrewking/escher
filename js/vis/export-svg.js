function ExportSvg () {
    var m = {};
    m.download = function(name, selection, do_beautify) {
	console.log('selection');
        var a = document.createElement('a'), xml, ev;
        a.download = name+'.svg'; // file name
        xml = (new XMLSerializer()).serializeToString(d3.select(selection).node()); // convert node to xml string
	console.log(xml);
	if (do_beautify) xml = vkbeautify.xml(xml);
        a.setAttribute("href-lang", "image/svg+xml");
        a.href = 'data:image/svg+xml;base64,' + btoa(xml); // create data uri
        // <a> constructed, simulate mouse click on it
        ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(ev);
    };
    return {'download': m.download};
};
