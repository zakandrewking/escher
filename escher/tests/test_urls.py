from escher import urls
from escher.server import directory
from urllib2 import urlopen
from os.path import join, exists

def test_urls():
    def make_https(url):
        if url.startswith('//'):
            url = 'https:' + url
        return url

    # online
    for u in [urls.builder_embed_css, urls.builder_css,
              urls.escher, urls.escher_min]:
        assert exists(join(directory, u))

    # use the web function
    for u in [urls.builder_embed_css, urls.builder_css,
              urls.escher, urls.escher_min]:
        urlopen(make_https(urls.web(u)))    
        
    # local
    for u in [urls.d3_local]:
        assert exists(join(directory, u))
