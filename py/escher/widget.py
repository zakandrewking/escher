# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals

from escher.version import __version__

import ipywidgets as widgets
from traitlets import Unicode, validate


class EscherWidget(widgets.DOMWidget):
    _view_name = Unicode('EscherMapView').tag(sync=True)
    _model_name = Unicode('EscherMapModel').tag(sync=True)
    _view_module = Unicode('jupyter-escher').tag(sync=True)
    _model_module = Unicode('jupyter-escher').tag(sync=True)
    _view_module_version = Unicode(__version__).tag(sync=True)
    _model_module_version = Unicode(__version__).tag(sync=True)
