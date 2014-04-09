import tornado.web
from tornado.web import MissingArgumentError
import cobra.test
import json

# application/x-www-form-urlencoded

def fba_for_reactions(reactions):
    model = cobra.test.create_test_model(cobra.test.ecoli_pickle)
    for r in reactions:
        print 'knocking out %s' % model.reactions.get_by_id(r)
        model.reactions.get_by_id(r).lower_bound = 0
        model.reactions.get_by_id(r).upper_bound = 0
    model.optimize()
    x = model.solution.x_dict
    f = model.solution.f
    print f
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
