import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { transform } from 'esbuild'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await cp(path.join(root, 'src'), dist, { recursive: true })

async function transpile(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) await transpile(target)
    else if (entry.name.endsWith('.js')) {
      const source = await readFile(target, 'utf8')
      const result = await transform(source, { loader: 'js', format: 'esm', target: 'es2018', charset: 'utf8' })
      await writeFile(target, result.code)
    }
  }
}

await transpile(dist)
