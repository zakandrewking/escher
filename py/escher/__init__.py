from escher.version import (
    __version__,
    __schema_version__,
    __map_model_version__,
)

from escher.plots import (
    Builder,
    get_cache_dir,
    clear_cache,
    list_cached_maps,
    list_cached_models,
    list_available_maps,
    list_available_models,
)


def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'jupyter-escher',
        'require': 'jupyter-escher/extension'
    }]
