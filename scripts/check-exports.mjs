import { access } from 'node:fs/promises'

const entries = ['core', 'dom', 'vue2', 'index']
await Promise.all(entries.flatMap((entry) => [
  access(new URL(`../dist/${entry}.js`, import.meta.url)),
  access(new URL(`../dist/${entry}.d.ts`, import.meta.url))
]))

const core = await import('../dist/core.js')
const dom = await import('../dist/dom.js')
const vue2 = await import('../dist/vue2.js')
if (typeof core.createLiquidRuntime !== 'function') throw new Error('core export is incomplete')
if (typeof dom.createLiquidSurface !== 'function') throw new Error('dom export is incomplete')
if (typeof vue2.createLiquidUI !== 'function') throw new Error('vue2 export is incomplete')
