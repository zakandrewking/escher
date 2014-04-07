# -*- coding: utf-8 -*-

from ko_server import koHandler
from plots import Builder

import os, subprocess
from os.path import join
import tornado.ioloop
import tornado.web
import tornado.escape
from tornado.options import define, options, parse_command_line
import json
import re
from jinja2 import Environment, PackageLoader
from mimetypes import guess_type
        
# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

# set directory to server
directory = os.path.abspath(os.path.dirname(__file__)).strip(os.pathsep)
directory = re.sub(r'escher$', '', directory)
NO_CACHE = True
default_port = 7778
default_public = False

def run(port=default_port, public=False):
    print 'serving directory %s on port %d' % (directory, port)
    application.listen(port, None if public else "localhost")
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print "bye!"

def stop():
    tornado.ioloop.IOLoop.instance().stop()

class BaseHandler(tornado.web.RequestHandler):
    def serve_path(self, path):
        # make sure the path exists
        if not os.path.isfile(path):
            raise tornado.web.HTTPError(404)
        # serve it
        with open(path, "rb") as file:
            data = file.read()
        # set the mimetype
        self.set_header("Content-Type", guess_type(path, strict=False)[0])
        self.serve(data)
        
    def serve(self, data):
        if (NO_CACHE):
            self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.write(data)

class IndexHandler(BaseHandler):
    def get(self):
        template = env.get_template('index.html')
        data = template.render()
        self.set_header("Content-Type", "text/html")
        self.serve(data)
        
class BuilderHandler(BaseHandler):
    def get(self, path):
        kwargs = {}
        for a in ['starting_reaction']:
            args = self.get_arguments(a)
            if len(args)==1:
                kwargs[a] = args[0]
        builder = Builder(**kwargs)
        self.set_header("Content-Type", "text/html")
        self.serve(builder.standalone_html())
  
class DevBuilderHandler(BaseHandler):
    def get(self, path):
        kwargs = {}
        for a in ['starting_reaction']:
            args = self.get_arguments(a)
            if len(args)==1:
                kwargs[a] = args[0]
        builder = Builder(**kwargs)
        self.set_header("Content-Type", "text/html")
        self.serve(builder.standalone_html(dev=True))

class LibHandler(BaseHandler):
    def get(self, path):
        # try ./, lib/ and escher/lib
        for d in ['.', 'lib', 'escher/lib']:
            full_path = join(directory, d, path)
            if os.path.isfile(full_path):
                path = full_path
                break
        else:
            raise tornado.web.HTTPError(404)
        self.serve_path(path)

class StaticHandler(BaseHandler):
    def get(self, path):
        path = join(directory, 'escher', path)
        self.serve_path(path)
        
settings = {"debug": "False"}

application = tornado.web.Application([
    (r".*/knockout-map/(.*)", koHandler),
    (r".*/lib/(.*)", LibHandler),
    (r".*/(js/.*)", StaticHandler),
    (r".*/(css/.*)", StaticHandler),
    (r"/builder(.*)", BuilderHandler),
    (r"/dev/builder(.*)", DevBuilderHandler),
    (r"/", IndexHandler),
], **settings)
 
if __name__ == "__main__":
    # define port
    define("port", default=default_port, type=int, help="Port to serve on.")
    define("public", default=default_public, type=bool,
           help=("If False, listen only on localhost. If True, listen on "
                 "all available addresses."))
    parse_command_line()
    run(port=options.port, public=options.public)
