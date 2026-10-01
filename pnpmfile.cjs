'use strict'

const manifest = require('./package.json')

function getCatalogs() {
  return manifest.catalogs ?? { util: manifest.catalog ?? manifest.dependencies ?? {} }
}

module.exports = {
  hooks: {
    updateConfig(config) {
      config.catalogs ??= {}
      for (const [name, catalog] of Object.entries(getCatalogs())) {
        config.catalogs[name] = {
          ...catalog,
          ...(config.catalogs[name] ?? {}),
        }
      }
      return config
    },

    beforePacking(pkg) {
      pkg.catalogs = getCatalogs()
      delete pkg.catalog
      delete pkg.dependencies
      delete pkg.devDependencies
      delete pkg.engines
      delete pkg.packageManager
      delete pkg.scripts
      return pkg
    },
  },
}
