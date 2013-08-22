import tornado.web

class koHandler(tornado.web.RequestHandler):
    def get(self, path="index.html"):
        if path=="":
            path = "index.html"
        elif path.find(".") == -1:
            if path.endswith('/'):
                self.redirect('index.html')
            else:
                self.redirect(path.split('/')[-1] + '/index.html')
        path = self.path_redirection(directory, path) 
        self.set_header("Content-Type", self.set_content_type(path))
        # get the file to serve
        self.check_and_render(path)

