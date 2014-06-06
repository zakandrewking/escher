from escher import urls
from urllib2 import urlopen

def test_urls():
    urlopen(urls.builder_embed_css)
    urlopen(urls.builder_css)
    urlopen(urls.escher)
    urlopen(urls.escher_min)
