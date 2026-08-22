'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')
const localPlugin = require('../.pnpmfile.cjs')
const plugin = require('../pnpmfile.cjs')

test('local hook packs the package without applying its catalog to itself', () => {
  assert.equal(localPlugin.hooks.updateConfig, undefined)
  assert.equal(localPlugin.hooks.beforePacking, plugin.hooks.beforePacking)
})

test('adds the shared catalog and preserves project overrides', () => {
  const config = {
    catalogs: {
      default: {
        local: '1.0.0',
        zod: '0.0.1',
      },
    },
  }

  const result = plugin.hooks.updateConfig(config)

  assert.equal(result.catalogs.default.local, '1.0.0')
  assert.equal(result.catalogs.default.zod, '0.0.1')
  assert.equal(result.catalogs.default.nuxt, '^4.4.2')
})

test('turns source dependencies into a dependency-free packed catalog', () => {
  const packed = plugin.hooks.beforePacking({
    dependencies: { zod: '^4.3.6' },
    devDependencies: { test: '1.0.0' },
    scripts: { test: 'node --test' },
  })

  assert.deepEqual(packed.catalog, { zod: '^4.3.6' })
  assert.equal(packed.dependencies, undefined)
  assert.equal(packed.devDependencies, undefined)
  assert.equal(packed.scripts, undefined)
})
