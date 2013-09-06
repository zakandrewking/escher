from ko_server import koHandler

import os, subprocess
import tornado.ioloop
import tornado.web
import tornado.escape
from tornado.options import define, options, parse_command_line
import json
import re

# set directory to server
directory = os.path.abspath(os.path.dirname(__file__).replace('server',''))
port = 7777

print 'serving directory %s on port %d' % (directory, port)

# define port
define("port", default=port, type=int)

class BaseHandler(tornado.web.RequestHandler):
    def path_redirection(self, directory, path):
        if any([a.startswith(".") for a in path.split("/")]):
            raise tornado.web.HTTPError(404)
        path = os.path.join(directory, path.strip('/'))
        for base_dir in ['js', 'css', 'data']:
            if '/%s/' % base_dir in path:
                path = os.path.join(directory, base_dir, path.split("/%s/" % base_dir)[1].strip('/'))
                continue
        if os.path.commonprefix([os.path.abspath(path), directory]) != directory:
            print 'trying to reach illegal path'
            raise tornado.web.HTTPError(404)
        print 'requesting %s' % path
        return path

    def set_content_type(self, path):
        if path.endswith('.html') or path.endswith('.htm'):
            return 'text/html'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.json'):
            return 'application/json'
        elif path.endswith('.js'):
            return 'application/javascript'
        return ''

    def check_and_render(self, path):
        if not os.path.isfile(path):
            raise tornado.web.HTTPError(404)
        # serve it
        with open(path, "rb") as file:
            data = file.read()
        self.write(data)

class MainDataHandler(BaseHandler):
    @tornado.web.asynchronous
    def get(self, path, *args, **kwargs):
        try:
            new_path = self.path_redirection(directory, path) 
            self.set_header("Content-Type", self.set_content_type(new_path))
            # get the file to serve
            print new_path
            self.check_and_render(new_path) 
            self.finish()
        except tornado.web.HTTPError:
            path = self.path_redirection(directory, path)
            rel_path = os.path.relpath(path, directory)
            json_files = [os.path.join(rel_path, f) for f in os.listdir(path) if re.search(r'.json$', f)]
            json_response = json.dumps({'data': json_files})
            self.write(json_response)
            self.set_header("Content-Type", "application/json")
            self.finish()
        
class MainHandler(BaseHandler):
    def get(self, path="index.html"):
        if path=="":
            path = "index.html"
        elif path.find(".") == -1:
            if path.endswith('/'):
                self.redirect('index.html')
            else:
                self.redirect(path.split('/')[-1] + '/index.html')
        path = self.path_redirection(directory, path) 
        self.set_header("Content-Type", self.set_content_type(path))
        # get the file to serve
        self.check_and_render(path)
        
settings = {"debug": "True"}

application = tornado.web.Application([
    (r".*(/data/.*)", MainDataHandler),
    (r".*/knockout-map/(.*)", koHandler),
    (r"/(.*)", MainHandler),
], **settings)
 
if __name__ == "__main__":
    parse_command_line()
    application.listen(options.port)
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print "bye!"
