from version import __version__
from os.path import join

# links
escher_home = "https://zakandrewking.github.io/escher"
github = "https://github.com/zakandrewking/escher"

web_root = "https://zakandrewking.github.io/escher"
web_escher = "https://zakandrewking.github.io/escher/escher"

def web(url):
    return join(web_escher, url)

# escher files
builder_embed_css = "css/builder-embed.css"
builder_css = "css/builder.css"
escher = "lib/escher.%s.js" % __version__
escher_min = "lib/escher.%s.min.js" % __version__
logo = "resources/escher-logo@2x.png"
index_js = "js/web/index.js"
index_gh_pages_js = "js/web/index_gh_pages.js"
index_css = "css/index.css"

# external dependencies
d3 = "//cdnjs.cloudflare.com/ajax/libs/d3/3.4.8/d3.min.js"
d3_local = "lib/d3.min.js"
boot_js = "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"
boot_js_local = "lib/bootstrap-3.1.1.min.js"
boot_css = "//netdna.bootstrapcdn.com/bootswatch/3.1.1/simplex/bootstrap.min.css"
boot_css_local = "lib/bootstrap-3.1.1.min.css"
jquery = "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js"
jquery_local = "lib/jquery-2.1.0.min.js"
require_js = "//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js"
require_js_local = "lib/require.min.js"
bacon = "//cdnjs.cloudflare.com/ajax/libs/bacon.js/0.7.12/bacon.min.js"
bacon_local = "lib/bacon-0.7.12.min.js"
