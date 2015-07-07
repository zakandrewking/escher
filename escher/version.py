def get_full_version(main_version, post_version=None):
    """Generate a PEP440 compliant version with an optional post-release."""
    if post_version is None:
        return main_version
    else:
        return '%s.post%s' % (main_version, post_version)

# software version
__version__ = '1.1.2'
# post-release version (required by PyPI & PEP440)
__post_version__ = '2'
# full version with post-release
__full_version__ = get_full_version(__version__, __post_version__)

# Escher map schema version
__schema_version__ = '1-0-0'
