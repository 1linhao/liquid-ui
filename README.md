# LiquidUI

LiquidUI is a cross-framework Liquid Glass resource library. Theme state,
optical rendering, capability detection, caching, and browser degradation live
in one framework-neutral runtime. DOM and Vue 2 are adapters at the same seam;
future React/Vue 3/Svelte adapters can reuse the runtime without copying it.

Framework-neutral core:

```js
import { createLiquidRuntime } from '@liqui/liquid-ui/core'

const runtime = createLiquidRuntime({
  paletteStorage: window.localStorage,
  initialMode: 'system'
})
```

Plain DOM:

```js
import { createLiquidSurface } from '@liqui/liquid-ui/dom'
import '@liqui/liquid-ui/styles.css'

const surface = createLiquidSurface({ runtime, surface: 'panel', content: 'Hello' })
document.body.append(surface.element)
```

Vue 2 adapter:

```js
import Vue from 'vue'
import { createLiquidUI } from '@liqui/liquid-ui/vue2'
import '@liqui/liquid-ui/styles.css'

const liquidUI = createLiquidUI({
  paletteStorage: window.localStorage,
  initialMode: 'system'
})

Vue.use(liquidUI)
```

The public controllers are intentionally small:

```js
liquidUI.theme.setMode('light')
liquidUI.theme.setPalette('emerald')
liquidUI.material.setQuality('reduced')
liquidUI.material.preload([{ surface: 'overlay', width: 480, height: 320 }])
```

Run `npm test` for contracts and `npm run build` to create the installable
`dist/` directory.

See [docs/baselines/README.md](docs/baselines/README.md) for the fixed visual
and functional baselines.

Component contracts are documented in
[docs/components/primitives.md](docs/components/primitives.md).
