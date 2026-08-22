# @thecodeorigin/pnpm-plugin-shared

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

Install the configuration package:

```sh
pnpm add --config @thecodeorigin/pnpm-plugin-shared
```

The `pnpm-plugin-*` name makes pnpm load the shared catalog hook automatically.
Existing project catalog entries take precedence, so repositories can adopt the
shared versions incrementally without an install changing their dependency graph.

Then consume shared versions normally:

```sh
pnpm add zod@catalog:
```

The consumer's `package.json` records `"zod": "catalog:"`. Its lockfile keeps
the exact config package version and integrity, so the project remains
reproducible and independently installable.

This package requires pnpm 11.8 or newer. Earlier pnpm 11 releases have a known
config-dependency path traversal vulnerability.
