import escher.server
import tornado.ioloop
from tornado.httpclient import AsyncHTTPClient
from tornado.testing import AsyncHTTPTestCase, gen_test

class TestBuilder(AsyncHTTPTestCase):
    def get_app(self):
        return escher.server.application

    def test_builder_request(self):
        response = self.fetch('/builder.html')
        assert response.code==200
        
    def test_dev_builder_request(self):
        response = self.fetch('/dev/builder.html')
        assert response.code==200
        
def test_server():
    tornado.ioloop.IOLoop.instance().add_timeout(100, escher.server.stop())
    escher.server.run(port = 8123)
    print 'stopped'
