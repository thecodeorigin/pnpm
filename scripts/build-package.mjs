import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'dist')
const source = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))

if (!source.dependencies || Object.keys(source.dependencies).length === 0) {
  throw new Error('package.json dependencies must contain at least one catalog entry')
}

for (const [name, version] of Object.entries(source.dependencies)) {
  if (version.startsWith('catalog:')) {
    throw new Error(`${name} must use a literal version in the source catalog`)
  }
}

const manifest = {
  name: source.name,
  version: source.version,
  description: source.description,
  license: source.license,
  type: source.type,
  files: source.files,
  repository: source.repository,
  publishConfig: source.publishConfig,
  catalog: source.dependencies,
}

await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
await writeFile(resolve(output, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`)
await copyFile(resolve(root, 'pnpmfile.cjs'), resolve(output, 'pnpmfile.cjs'))
await copyFile(resolve(root, 'README.md'), resolve(output, 'README.md'))
