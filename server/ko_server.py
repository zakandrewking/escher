import tornado.web
import cobra.io

# application/x-www-form-urlencoded

def fba_for_reactions(reactions):
    model = cobra.io
    model.optimize()
    for r in reactions:
        
    x = model.solution.x
    f = model.solution.f
    return x, f

class koHandler(BaseHandler):
    @tornado.web.asynchronous
    def get(self, path, *args, **kwargs):
        data = {}
        try:
            knockout_reactions = self.get_argument("reactions")
            print knockout_reactions
            fluxes, growth_rate = fba_for_reactions(knockout_reactions)
            data['x'] = fluxes
            data['f'] = growth_rate
        except tornado.web.MissingArgumentError:
            pass
        json_response = json.dumps(data)
        self.write(json_response)
        self.set_header("Content-Type", "application/json")
        self.finish()
