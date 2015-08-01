def get_full_version(main_version, post_version=None):
    """Generate a PEP440 compliant version with an optional post-release."""
    if post_version is None:
        return main_version
    else:
        return '%s.post%s' % (main_version, post_version)

# software version
__version__ = '1.2.0'
# post-release version (required by PyPI & PEP440)
__post_version__ = None
# full version with post-release
__full_version__ = get_full_version(__version__, __post_version__)

# Escher schema and map version. The schema version determines the version of
# the map specification, and the map version is an additional level so that maps
# can be released with the same spec but new layouts.
__schema_version__ = '1-0-0'
__map_model_version__ = '2'
