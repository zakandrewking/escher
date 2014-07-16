""" The following code has been adapted from mpld3. Modifications (c) 2014,
Zachary King.

mpld3, http://mpld3.github.io/, A Simple server used to show mpld3 images.
Copyright (c) 2013, Jake Vanderplas
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the {organization} nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

"""
import sys
import threading
import webbrowser
import socket
import itertools
import random

IPYTHON_WARNING = """
Note: You must interrupt the kernel to end this command
"""

try:
    # Python 2.x
    import BaseHTTPServer as server
except ImportError:
    # Python 3.x
    from http import server

def generate_handler(html, files=None):
    if files is None:
        files = {}

    class MyHandler(server.BaseHTTPRequestHandler):
        def do_GET(self):
            """Respond to a GET request."""
            if self.path == '/':
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write('<!DOCTYPE html>'
                                 '<html lang="en"><head>'
                                 '<title>Escher map</title>'
                                 '</head><body>\n')
                self.wfile.write(html)
                self.wfile.write("</body></html>")
            elif self.path in files:
                content_type, content = files[self.path]
                self.send_response(200)
                self.send_header("Content-type", content_type)
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404)

    return MyHandler

def find_open_port(ip, port, n=50):
    """Find an open port near the specified port"""
    ports = itertools.chain((port + i for i in range(n)),
                            (port + random.randint(-2 * n, 2 * n)))

    for port in ports:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = s.connect_ex((ip, port))
        s.close()
        if result != 0:
            return port
    raise ValueError("no open ports found")

def serve_and_open(html, ip='127.0.0.1', port=8888, n_retries=50, files=None,
                   ipython_warning=True):
    """Start a server serving the given HTML, and open a browser

    Parameters
    ----------
    html : string
        HTML to serve
    ip : string (default = '127.0.0.1')
        ip address at which the HTML will be served.
    port : int (default = 8888)
        the port at which to serve the HTML
    n_retries : int (default = 50)
        the number of nearby ports to search if the specified port is in use.
    files : dictionary (optional)
        dictionary of extra content to serve
    ipython_warning : bool (optional)
        if True (default), then print a warning if this is used within IPython
    """
    port = find_open_port(ip, port, n_retries)
    Handler = generate_handler(html, files)
    srvr = server.HTTPServer((ip, port), Handler)

    if ipython_warning:
        try:
            __IPYTHON__
        except:
            pass
        else:
            print(IPYTHON_WARNING)

    # Start the server
    print(("Serving to http://{0}:{1}/\n".format(ip, port) + 
           "[Ctrl-C to exit from terminal, or Ctrl-M i i to interrupt notebook kernel]"))
    sys.stdout.flush()

    # Use a thread to open a web browser pointing to the server
    b = lambda: webbrowser.open('http://{0}:{1}'.format(ip, port))
    threading.Thread(target=b).start()

    try:
        srvr.serve_forever()
    except (KeyboardInterrupt, SystemExit):
        print("\nstopping Server...")

    srvr.server_close()
