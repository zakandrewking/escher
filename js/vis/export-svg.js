define(["lib/d3", "lib/vkbeautify"], function (d3, vkbeautify) {
    return function() {
        var m = {};
        m.utf8_to_b64 = function(str) {
            return window.btoa(unescape(encodeURIComponent( str )));
        };
        m.download = function(name, selection, do_beautify) {
            var a = document.createElement('a'), xml, ev;
            a.download = name+'.svg'; // file name
            xml = (new XMLSerializer()).serializeToString(d3.select(selection).node()); // convert node to xml string
            if (do_beautify) xml = vkbeautify.xml(xml);
            xml = '<?xml version="1.0" encoding="utf-8"?>\n \
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n \
            "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + xml;
            a.setAttribute("href-lang", "image/svg+xml");
            a.href = 'data:image/svg+xml;base64,' + m.utf8_to_b64(xml); // create data uri
            // <a> constructed, simulate mouse click on it
            ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(ev);
        };
        return {'download': m.download};
    };
});
