import os, subprocess
import tornado.ioloop
import tornado.web
import tornado.escape
from tornado.options import define, options, parse_command_line
import json

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
        if path.startswith('/js/'): 
            path = os.path.join(directory, path.split('/js/')[1].strip('/'))
            print path
        if os.path.commonprefix([os.path.abspath(path), directory]) != directory:
            print 'trying to reach illegal path'
            raise tornado.web.HTTPError(404)
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
        try:
            subprocess.check_output(["ls",path])
        except subprocess.CalledProcessError:
            raise tornado.web.HTTPError(404)
        # serve it
        self.render(path) 

class MainDataHandler(BaseHandler):
    @tornado.web.asynchronous
    def get(self, path, *args, **kwargs):
        path = self.path_redirection(directory, path)
        json_files = [f for f in os.listdir(path) if re.search(r'.json$', f)]
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
      
settings = {"debug": "False"}

application = tornado.web.Application([
    (r"(/data/.*)getdatafiles", MainDataHandler),
    (r"/(.*)", MainHandler),
], **settings)
 
if __name__ == "__main__":
    parse_command_line()
    application.listen(options.port)
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print "bye!"
