'use strict'

const manifest = require('./package.json')

function getCatalog() {
  return manifest.catalog ?? manifest.dependencies ?? {}
}

module.exports = {
  hooks: {
    updateConfig(config) {
      config.catalogs ??= {}
      config.catalogs.default = {
        ...(config.catalogs.default ?? {}),
        ...getCatalog(),
      }
      return config
    },

    beforePacking(pkg) {
      pkg.catalog = pkg.dependencies ?? {}
      delete pkg.dependencies
      delete pkg.devDependencies
      delete pkg.engines
      delete pkg.packageManager
      delete pkg.scripts
      return pkg
    },
  },
}
