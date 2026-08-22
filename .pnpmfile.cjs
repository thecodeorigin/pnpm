'use strict'

const { beforePacking } = require('./pnpmfile.cjs').hooks

module.exports = {
  hooks: {
    beforePacking,
  },
}
