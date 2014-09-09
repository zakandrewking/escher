# -*- coding: utf-8 -*-

from escher.plots import Builder
from escher import urls

import os, subprocess
from os.path import join, dirname, realpath
import tornado.ioloop
from tornado.web import RequestHandler, asynchronous, HTTPError, Application
from tornado.httpclient import AsyncHTTPClient
from tornado import gen
import tornado.escape
from tornado.options import define, options, parse_command_line
import json
import re
from jinja2 import Environment, PackageLoader
from mimetypes import guess_type

# set up jinja2 template location
env = Environment(loader=PackageLoader('escher', 'templates'))

# set directory to server
directory = dirname(realpath(__file__))
NO_CACHE = True
PORT = 7778
PUBLIC = False

def run(port=PORT, public=PUBLIC):
    global PORT
    global PUBLIC
    PORT = port
    PUBLIC = public
    print 'serving directory %s on port %d' % (directory, PORT)
    application.listen(port, None if public else "localhost")
    try:
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print "bye!"

def stop():
    tornado.ioloop.IOLoop.instance().stop()

class BaseHandler(RequestHandler):
    def serve_path(self, path):
        # make sure the path exists
        if not os.path.isfile(path):
            raise HTTPError(404)
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
        self.finish()

class IndexHandler(BaseHandler):
    @asynchronous
    @gen.engine
    def get(self):
        # get the organisms, maps, and models
        response = yield gen.Task(AsyncHTTPClient().fetch,
                                  join(urls.download, 'index.json'))
        json_data = response.body

        print json_data

        # render the template
        template = env.get_template('index.html')
        data = template.render(d3=urls.d3_local,
                               boot_css=urls.boot_css_local,
                               index_css=urls.index_css_local,
                               logo=urls.logo_local,
                               github=urls.github,
                               index_js=urls.index_js_local,
                               index_gh_pages_js=urls.index_gh_pages_js_local,
                               data=json_data,
                               web_version=False)
        
        self.set_header("Content-Type", "text/html")
        self.serve(data)
  
class BuilderHandler(BaseHandler):
    @asynchronous
    @gen.engine
    def get(self, dev_path, offline_path, kind, path):
        # builder vs. viewer & dev vs. not dev
        js_source = ('dev' if (dev_path is not None) else
                     ('local' if (offline_path is not None) else
                      'web'))
        enable_editing = (kind=='builder')
        
        # Builder options
        builder_kwargs = {}
        for a in ['starting_reaction', 'model_name', 'map_name', 'map_json']:
            args = self.get_arguments(a)
            if len(args)==1:
                builder_kwargs[a] = (True if args[0].lower()=='true' else
                                     (False if args[0].lower()=='false' else
                                      args[0]))

        # if the server is running locally, then the embedded css must be loaded
        # asynchronously using the same server thread.
        if js_source in ['dev', 'local']:  
            global PORT          
            response = yield gen.Task(AsyncHTTPClient().fetch,
                                      join('http://localhost:%d' % PORT, urls.builder_embed_css_local))
            builder_kwargs['embedded_css'] = response.body.replace('\n', ' ')

        # example data
        def load_data_file(rel_path):
            """Load a JSON file with relative path."""
            try:
                with open(join(directory, rel_path), 'r') as f:
                    return json.load(f)
            except:
                logging.warn('Could not load example_data file: %s' % rel_path)
        if len(self.get_arguments('example_data')) > 0:
            r_filepath = 'example_data/reaction_data_iJO1366.json'
            builder_kwargs['reaction_data'] = load_data_file(r_filepath)
            m_filepath = 'example_data/metabolite_data_iJO1366.json'
            builder_kwargs['metabolite_data'] = load_data_file(m_filepath)
            
        # make the builder        
        builder = Builder(safe=True, **builder_kwargs)
            
        # display options
        display_kwargs = {'minified_js': True,
                          'scroll_behavior': 'pan',
                          'menu': 'all'}
            
        # keyword
        for a in ['menu', 'scroll_behavior', 'minified_js',
                  'auto_set_data_domain', 'never_ask_before_quit']:
            args = self.get_arguments(a)
            if len(args)==1:
                display_kwargs[a] = (True if args[0].lower()=='true' else
                                     (False if args[0].lower()=='false' else
                                      args[0]))

        html = builder._get_html(js_source=js_source, enable_editing=enable_editing,
                                 enable_keys=True, html_wrapper=True, fill_screen=True,
                                 height='100%', **display_kwargs)
        
        self.set_header("Content-Type", "text/html")
        self.serve(html)
        
class LibHandler(BaseHandler):
    def get(self, path):
        full_path = join(directory, 'lib', path)
        if os.path.isfile(full_path):
            path = full_path
        else:
            raise HTTPError(404)
        self.serve_path(path)

class StaticHandler(BaseHandler):
    def get(self, path):
        path = join(directory, path)
        print 'getting path %s' % path
        self.serve_path(path)

settings = {"debug": "False"}

application = Application([
    (r".*/lib/(.*)", LibHandler),
    (r".*/(fonts/.*)", LibHandler),
    (r".*/(js/.*)", StaticHandler),
    (r".*/(css/.*)", StaticHandler),
    (r".*/(resources/.*)", StaticHandler),
    (r"/(dev/)?(local/)?(?:web/)?(builder|viewer)(.*)", BuilderHandler),
    (r".*/(map_spec.json)", StaticHandler),
    (r"/", IndexHandler),
], **settings)
 
if __name__ == "__main__":
    # define port
    define("port", default=PORT, type=int, help="Port to serve on.")
    define("public", default=PUBLIC, type=bool,
           help=("If False, listen only on localhost. If True, listen on "
                 "all available addresses."))
    parse_command_line()
    run(port=options.port, public=options.public)
