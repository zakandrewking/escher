from IPython.display import publish_display_data

class Vis(object):
    def load_d3(self):
        with open('d3.v3.js', 'r') as f:
            d3 = f.read()
        return d3
    
    def display(self):
        publish_display_data('this', {'text/html': self.html})
        publish_display_data('this', {'application/javascript': self.js})

class Scatter(Vis):
    def __init__(self, json_data):
        with open('index_ipy.html', 'r') as f:
            self.html = f.read()
        with open('scatter_ipy.js', 'r') as f:
            javascript = f.read()
        with open('tooltip.js', 'r') as f:
            tooltip = f.read()
        self.js = "\n".join(['var ' + self.load_d3(),
                             tooltip,
                             'var json='+json_data,
                             javascript])
        self.display()

class Map(Vis):
    def __init__(self, flux=None):
        with open('map_ipy.html', 'r') as f:
            self.html = f.read()
        with open('map_ipy.js', 'r') as f:
            metabolic_map = f.read()
            
        with open('map.json', 'r') as f:
            map_json = f.read()
        flux_string = 'var flux1='+flux if flux else ''
        self.js = "\n".join(['var ' + self.load_d3(),
                             'var json='+map_json,
                             flux_string,
                             metabolic_map])
        self.display()
