from importlib.metadata import version, PackageNotFoundError

try:
    __version__ = version("escher")
except PackageNotFoundError:
    __version__ = "unknown"

# Map format constants — not tied to package version
__schema_version__ = "1-0-0"
__map_model_version__ = 6
