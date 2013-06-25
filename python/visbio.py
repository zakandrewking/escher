from IPython.display import publish_display_data

class Scatter(object):
    def __init__(self, json_data):
        with open('index_ipy.html', 'r') as f:
            self.html = f.read()
        with open('scatter_ipy.js', 'r') as f:
            javascript = f.read()
        with open('d3.v3.js', 'r') as f:
            d3 = f.read()
        with open('tooltip.js', 'r') as f:
            tooltip = f.read()
        self.js = "\n".join(['var '+d3,
                             tooltip,
                             'var json='+json_data,
                             javascript])
        self.display()

    def display(self):
        publish_display_data('this', {'text/html': self.html})
        publish_display_data('this', {'application/javascript': self.js})
