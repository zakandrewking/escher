from escher import urls
from escher.server import directory
from urllib2 import urlopen
from os.path import join, exists

def test_urls():
    def make_http(url):
        if url.startswith('//'):
            url = 'http:' + url
        return url

    # online
    for u in [urls.builder_embed_css, urls.builder_css, urls.d3,
              urls.escher, urls.escher_min]:
        urlopen(make_http(u))

    # local
    for u in [urls.d3_local, urls.escher_local, urls.escher_min_local]:
        assert exists(join(directory, '..', u))
