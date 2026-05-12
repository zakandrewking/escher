// Shim: redirects mocha imports to Vitest equivalents.
// Allows all existing test files to remain unchanged.
export { describe, it, beforeEach, afterEach } from 'vitest'
export { beforeAll as before, afterAll as after } from 'vitest'
