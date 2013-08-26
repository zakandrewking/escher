import tornado.web
from tornado.web import MissingArgumentError
import cobra.io
import json

# application/x-www-form-urlencoded

def fba_for_reactions(reactions):
    model = cobra.io.load_matlab_model('/Users/zaking/models/iJO1366.mat')
    for r in reactions:
        model.reactions.get_by_id(r).upper_bound = 0
        model.reactions.get_by_id(r).upper_bound = 0
    model.optimize()
    x = model.solution.x_dict
    f = model.solution.f
    return x, f

class koHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self, path, *args, **kwargs):
        data = {}
        try:
            knockout_reactions = self.get_arguments("reactions[]")
            print knockout_reactions
            fluxes, growth_rate = fba_for_reactions(knockout_reactions)
            data['x'] = fluxes
            data['f'] = growth_rate
        except tornado.web.MissingArgumentError:
            print 'MissingArgumentError'
            pass
        json_response = json.dumps(data)
        self.write(json_response)
        self.set_header("Content-Type", "application/json")
        self.finish()
