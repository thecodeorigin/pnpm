# @thecodeorigin/pnpm-plugin-shared

Compatibility package generated from the ecosystem root capability catalogs. Ecosystem
projects no longer install independently; their only editable dependency policy
is the root `pnpm-workspace.yaml`.

## Maintain the catalogs

Add, update, and remove entries from the ecosystem root:

```sh
pnpm add -Dw <package>
pnpm update -w <package> --latest
pnpm remove -Dw <package>
```

Run `node scripts/workspace/sync-shared-catalog.mjs`, commit the root lockfile
and the generated compatibility package, and release it only from an exact
ecosystem commit.

## Use it in another project

Install the configuration package:

```sh
pnpm add --config @thecodeorigin/pnpm-plugin-shared
```

The `pnpm-plugin-*` name makes pnpm load the shared catalog hook automatically.
Existing catalog entries take precedence, so repositories can adopt each shared
capability category incrementally without an install changing their dependency graph.

Then consume shared versions normally:

```sh
pnpm add zod@catalog:util
```

The consumer's `package.json` records `"zod": "catalog:util"`. Its lockfile keeps
the exact config package version and integrity, so the project remains
reproducible and independently installable.

This package requires pnpm 11.8 or newer. Earlier pnpm 11 releases have a known
config-dependency path traversal vulnerability.
