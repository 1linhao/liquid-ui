# LiquidUI

LiquidUI is a reusable Liquid Glass design-system foundation. It keeps theme
state, optical rendering, component behavior, and application business logic
behind separate interfaces. The first adapter targets Vue 2 so Trojan Panel
can migrate without a framework upgrade.

```js
import Vue from 'vue'
import { createLiquidUI } from '@liqui/liquid-ui'
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
