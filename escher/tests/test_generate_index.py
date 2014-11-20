from __future__ import print_function, unicode_literals

from escher.generate_index import index
from os.path import join
from os import makedirs
from shutil import rmtree
import pytest

@pytest.fixture()
def index_dir(request, tmpdir):
    tmpdir.mkdir('maps').mkdir('Escherichia coli').join('iJO1366.central_metabolism.json').write('temp')
    tmpdir.mkdir('models').mkdir('Escherichia coli').join('iJO1366.json').write('temp')
    def fin():
        tmpdir.remove()
    request.addfinalizer(fin)
    return str(tmpdir)
    
def test_generate_index(index_dir):
    out = index(index_dir)
    assert out['models'] == [ { 'organism': 'Escherichia coli',
                                'model_name': 'iJO1366' } ]
    assert out['maps'] == [ { 'organism': 'Escherichia coli',
                              'map_name': 'iJO1366.central_metabolism' } ]
