from escher.plots import Builder

from os.path import join, dirname, realpath

def generate_static_site():
    build_path = realpath(join(dirname(realpath(__file__)), '..'))
    print build_path
    
    for kind in ['viewer', 'builder']:
        js_source = 'web'
        enable_editing = (kind=='builder')
            
        # make the builder        
        builder = Builder(safe=True)

        html = builder.save_html(filepath=join(build_path, kind+'.html'),
                                 js_source=js_source, enable_editing=enable_editing,
                                 js_url_parse=True)
    
if __name__=='__main__':
    generate_static_site()
