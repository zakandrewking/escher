from __future__ import print_function, unicode_literals

import escher.server
import tornado.ioloop
from tornado.testing import AsyncHTTPTestCase, gen_test

from pytest import mark

class TestBuilder(AsyncHTTPTestCase):
    def get_app(self):
        return escher.server.application

    def test_index(self):
        escher.server.PORT = self.get_http_port()
        response = self.fetch('/')
        assert response.code==200

    @mark.web
    def test_builder_request(self):
        escher.server.PORT = self.get_http_port()
        response = self.fetch('/builder/index.html')
        assert response.code==200

    def test_local_builder_request(self):
        escher.server.PORT = self.get_http_port()
        response = self.fetch('/builder/index.html?js_source=local')
        assert response.code==200

def test_server():
    tornado.ioloop.IOLoop.instance().add_timeout(100, escher.server.stop)
    escher.server.run(port = 8123)
    print('stopped')
