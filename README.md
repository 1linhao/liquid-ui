# LiquidUI

LiquidUI 是一套可跨网页项目复用的 Liquid Glass 资源库。主题状态、材质渲染、能力检测、滤镜缓存和浏览器降级集中在无框架 runtime 中；原生 DOM 与 Vue 2 通过独立 Adapter 使用同一套核心能力。

## 特性

- 亮色、暗色和跟随系统三种模式，支持海蓝、紫罗兰、翡翠、琥珀四色。
- `panel`、`overlay`、`control`、`navigation` 四种语义材质及渐进降级。
- 原生 DOM 不依赖 Vue；Vue 2 是可选 peer dependency。
- controlled Button、Input、NumberInput、Select、DatePicker、Switch、Tag 和 Form。
- Overlay 统一处理定位、外部点击、Escape、焦点恢复及监听清理。
- ESM、TypeScript 声明和可独立导入的 CSS 资源。

## 安装

```sh
pnpm add @liqui/liquid-ui
```

## 无框架核心与原生 DOM

```js
import { createLiquidRuntime } from '@liqui/liquid-ui/core'
import { createLiquidSurface } from '@liqui/liquid-ui/dom'
import '@liqui/liquid-ui/styles.css'

const runtime = createLiquidRuntime({
  paletteStorage: window.localStorage,
  initialMode: 'system',
  initialPalette: 'blue'
})
const surface = createLiquidSurface({ runtime, surface: 'panel', content: '你好，LiquidUI' })
document.body.append(surface.element)
```

## Vue 2

```js
import Vue from 'vue'
import { createLiquidUI } from '@liqui/liquid-ui/vue2'
import '@liqui/liquid-ui/styles.css'

Vue.use(createLiquidUI({ paletteStorage: window.localStorage }))
```

```vue
<liquid-form ref="form" :model="model" :rules="rules" @submit="save">
  <liquid-form-item field="region" label="区域" required>
    <liquid-select v-model="model.region" :options="regions" filterable />
  </liquid-form-item>
  <liquid-form-item field="startDate" label="开始日期" required>
    <liquid-date-picker v-model="model.startDate" min="2028-01-01" />
  </liquid-form-item>
  <liquid-button type="submit">保存</liquid-button>
</liquid-form>
```

## 包入口

| 入口 | 用途 |
| --- | --- |
| `@liqui/liquid-ui/core` | 无框架 runtime、主题、材质与表单校验 |
| `@liqui/liquid-ui/dom` | 原生 Surface 和 AnchoredOverlay |
| `@liqui/liquid-ui/vue2` | Vue 2 插件与公开控件 |
| `@liqui/liquid-ui/styles.css` | 完整样式 |
| `@liqui/liquid-ui/tokens.css` | 设计令牌 |
| `@liqui/liquid-ui/styles/base.css` | 基础样式 |
| `@liqui/liquid-ui/styles/components.css` | 控件样式 |
| `@liqui/liquid-ui/styles/utilities.css` | 布局工具 |

## 主题与材质

```js
runtime.theme.setMode('dark')
runtime.theme.setPalette('emerald')
runtime.material.setQuality('reduced')
await runtime.material.preload([{ surface: 'overlay', width: 480, height: 320 }])
```

业务代码只应选择语义材质和质量档位，不应直接创建 SVG filter 或拼接浏览器分支。

## 开发与验证

```sh
npm install
npm run check
npm pack --dry-run
```

组件契约见 [docs/components/primitives.md](docs/components/primitives.md)，视觉与功能基线见 [docs/baselines/README.md](docs/baselines/README.md)。

## 许可证

MIT。第三方参考和声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
