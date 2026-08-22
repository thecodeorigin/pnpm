# @thecodeorigin/pnpm

Shared pnpm catalog policy for independently installable THECODEORIGIN projects.
The editable catalog is the standard `dependencies` object in `package.json`.

## Maintain the catalog

Add, update, and remove entries with ordinary pnpm commands:

```sh
pnpm add <package>
pnpm update <package> --latest
pnpm remove <package>
```

Commit `package.json` and `pnpm-lock.yaml`. A conventional commit pushed to
`main` is released automatically by semantic-release.

## Use it in another project

This short package name does not match pnpm's automatic `pnpm-plugin-*` naming
convention. Install the configuration package first:

```sh
pnpm add --config @thecodeorigin/pnpm
```

Then add this bridge at the consumer root as `.pnpmfile.cjs`:

```js
'use strict'

const { existsSync } = require('node:fs')
const { join } = require('node:path')

const plugin = join(
  __dirname,
  'node_modules/.pnpm-config/@thecodeorigin/pnpm/pnpmfile.cjs',
)

module.exports = existsSync(plugin) ? require(plugin) : {}
```

The existence check also makes first installs from a fresh clone safe while
pnpm bootstraps the config dependency.

Then consume shared versions normally:

```sh
pnpm add zod@catalog:
```

The consumer's `package.json` records `"zod": "catalog:"`. Its lockfile keeps
the exact config package version and integrity, so the project remains
reproducible and independently installable.

Config dependencies require pnpm 10.8 or newer for `updateConfig`. Use pnpm
10.34.4 or newer within pnpm 10 because older releases have a known
config-dependency path traversal vulnerability.
