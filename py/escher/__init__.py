# global config
rc = {}


from escher.version import (
    __version__,
    __schema_version__,
    __map_model_version__,
)

from escher.plots import (
    Builder,
    list_available_maps,
    list_available_models,
)


def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'escher',
        'require': 'escher/extension'
    }]
