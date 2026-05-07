// Shim: redirects require('mocha') to Vitest equivalents.
// Vitest is ESM-only so we can't require() it directly. Instead we proxy
// globalThis, which Vitest populates before each test file loads (globals: true).
//
// .skip and .only are forwarded so that e.g. it.skip(...) works.

function makeProxy (name) {
  function proxy (...args) { return globalThis[name](...args) }
  proxy.skip = function (...args) { return globalThis[name].skip(...args) }
  proxy.only = function (...args) { return globalThis[name].only(...args) }
  return proxy
}

module.exports = {
  describe: makeProxy('describe'),
  it: makeProxy('it'),
  beforeEach: (...args) => globalThis.beforeEach(...args),
  afterEach: (...args) => globalThis.afterEach(...args),
  before: (...args) => globalThis.beforeAll(...args),
  after: (...args) => globalThis.afterAll(...args),
}
