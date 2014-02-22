import escher.server
import tornado.ioloop

def test_server():
    tornado.ioloop.IOLoop.instance().add_timeout(100, escher.server.stop())
    escher.server.run(port = 8123)
    print 'stopped'
