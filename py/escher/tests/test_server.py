from __future__ import print_function, unicode_literals

import escher.server
import tornado.ioloop
from tornado.testing import AsyncHTTPTestCase, gen_test

from pytest import mark

class TestBuilder(AsyncHTTPTestCase):
    def get_app(self):
        return escher.server.application

    @mark.web
    def test_builder_request(self):
        # set the correct port
        escher.server.PORT = self.get_http_port()
        print(escher.server.PORT)
        
        response = self.fetch('/builder.html')
        assert response.code==200
        
    def test_dev_builder_request(self):
        # set the correct port
        escher.server.PORT = self.get_http_port()
        print(escher.server.PORT)

        response = self.fetch('/builder.html?js_source=dev')
        assert response.code==200
        
    def test_local_builder_request(self):
        # set the correct port
        escher.server.PORT = self.get_http_port()
        print(escher.server.PORT)

        response = self.fetch('/builder.html?js_source=local')
        assert response.code==200
        
def test_server():
    tornado.ioloop.IOLoop.instance().add_timeout(100, escher.server.stop)
    escher.server.run(port = 8123)
    print('stopped')
