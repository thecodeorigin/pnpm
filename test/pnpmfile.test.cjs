'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')
const localPlugin = require('../.pnpmfile.cjs')
const plugin = require('../pnpmfile.cjs')

test('local hook packs the package without applying its catalog to itself', () => {
  assert.equal(localPlugin.hooks.updateConfig, undefined)
  assert.equal(localPlugin.hooks.beforePacking, plugin.hooks.beforePacking)
})

test('adds the shared capability catalogs and preserves project entries', () => {
  const config = {
    catalogs: {
      util: {
        local: '1.0.0',
        zod: '0.0.1',
      },
    },
  }

  const result = plugin.hooks.updateConfig(config)

  assert.equal(result.catalogs.util.local, '1.0.0')
  assert.equal(result.catalogs.util.zod, '0.0.1')
  assert.equal(result.catalogs.nuxt.nuxt, '4.5.2')
})

test('packs the resolved compatibility catalogs without dependency fields', () => {
  const packed = plugin.hooks.beforePacking({
    dependencies: { zod: '^4.3.6' },
    devDependencies: { test: '1.0.0' },
    scripts: { test: 'node --test' },
  })

  assert.equal(packed.catalogs.util.zod, '^4.5.4')
  assert.equal(packed.catalogs.nuxt.nuxt, '4.5.2')
  assert.equal(packed.dependencies, undefined)
  assert.equal(packed.devDependencies, undefined)
  assert.equal(packed.scripts, undefined)
})
