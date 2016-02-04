/** From d3-request

 https://github.com/d3/d3-request

 Copyright 2010-2015 Mike Bostock
 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 * Neither the name of the author nor the names of contributors may be used to
 endorse or promote products derived from this software without specific prior
 written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 */

var fs = require("fs");

global.XMLHttpRequest = function XMLHttpRequest() {
    var that = this,
        info = that._info = {},
        headers = {},
        url;

    // TODO handle file system errors?

    that.readyState = 0;

    that.open = function(m, u, a) {
        info.method = m;
        info.url = u;
        info.async = a;
        that.readyState = 1;
        that.send = a ? read : readSync;
    };

    that.setRequestHeader = function(n, v) {
        if (/^Accept$/i.test(n)) info.mimeType = v.split(/,/g)[0];
    };

    function read() {
        that.readyState = 2;
        fs.readFile(info.url, "binary", function(e, d) {
            if (e) {
                that.status = 404; // assumed
            } else {
                that.status = 200;
                that.responseText = d;
                that.responseXML = {_xml: d};
                headers["Content-Length"] = d.length;
            }
            that.readyState = 4;
            XMLHttpRequest._last = that;
            if (that.onreadystatechange) that.onreadystatechange();
        });
    }

    function readSync() {
        that.readyState = 2;
        try {
            var d = fs.readFileSync(info.url, "binary");
            that.status = 200;
            that.responseText = d;
            that.responseXML = {_xml: d};
            headers["Content-Length"] = d.length;
        } catch (e) {
            that.status = 404; // assumed
        }
        that.readyState = 4;
        XMLHttpRequest._last = that;
        if (that.onreadystatechange) that.onreadystatechange();
    }

    that.getResponseHeader = function(n) {
        return headers[n];
    };
};
