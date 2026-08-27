# LiquidUI

[![CI](https://github.com/1linhao/liquid-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/1linhao/liquid-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

LiquidUI 是一套可跨网页项目复用的 Liquid Glass 资源库。主题状态、语义材质、能力检测、滤镜缓存和浏览器降级集中在无框架核心中；原生 DOM 与 Vue 2 适配器共享同一套能力，不绑定路由、状态仓库或业务接口。

项目总览与仓库选型见 [Liquid 公共入口](https://github.com/1linhao/liquid)。

## 效果预览

[![LiquidUI 控件、表单与浮层效果](https://raw.githubusercontent.com/1linhao/liquid-integration-lab/main/tests/visual/material-matrix.spec.js-snapshots/light-blue-controls-desktop-linux.png)](https://1linhao.github.io/liquid-integration-lab/?mode=light&palette=blue#components)

[打开在线组件演示](https://1linhao.github.io/liquid-integration-lab/?mode=light&palette=blue#components) · [查看暗色紫罗兰主题](https://1linhao.github.io/liquid-integration-lab/?mode=dark&palette=violet#components)

预览由真实 LiquidUI 组件生成，并与集成仓库的视觉回归基线共用同一份页面代码。演示中可以切换亮暗模式、四色色板和材质质量，并操作表单、表格、Dialog、Drawer、Select、DatePicker 与反馈组件。

## 适合什么项目

- 普通 HTML/JavaScript 网页：使用 `core` 与 `dom` 入口。
- Vue 2.6/2.7 应用：安装 `vue2` 插件并按需使用公开组件。
- 需要逐步替换旧控件库的项目：常用属性同时提供 `prop`、`data`、`visible.sync` 等兼容契约。
- 需要亮暗主题、四色色板、玻璃材质与低性能降级的后台、门户和工具类网页。

LiquidUI 只负责控件和材质。应用框架布局由独立的 [LiquidAppShell](https://github.com/1linhao/liquid-app-shell) 提供，两者可以分别采用。

## 安装

当前版本通过 GitHub 发布：

```sh
pnpm add @liqui/liquid-ui@github:1linhao/liquid-ui
```

安装后，应用代码仍使用稳定包名 `@liqui/liquid-ui`。如果需要参与开发，可以克隆源码并执行完整检查：

```sh
git clone https://github.com/1linhao/liquid-ui.git
cd liquid-ui
npm install
npm run check
```

## Vue 2 快速开始

```js
import Vue from 'vue'
import { createLiquidUI } from '@liqui/liquid-ui/vue2'
import '@liqui/liquid-ui/styles.css'

Vue.use(createLiquidUI({
  paletteStorage: window.localStorage,
  initialMode: 'system',
  initialPalette: 'blue'
}))
```

```vue
<liquid-form ref="form" :model="model" :rules="rules" @submit="save">
  <liquid-form-item prop="region" label="区域" required>
    <liquid-select v-model="model.region" filterable>
      <option value="cn">中国大陆</option>
      <option value="sg">新加坡</option>
    </liquid-select>
  </liquid-form-item>

  <liquid-form-item prop="startAt" label="开始时间" required>
    <liquid-date-picker v-model="model.startAt" type="datetime" />
  </liquid-form-item>

  <liquid-switch
    v-model="model.enabled"
    :active-value="1"
    :inactive-value="0"
    active-text="启用"
    inactive-text="停用"
  />

  <liquid-button type="submit" tone="accent">保存</liquid-button>
</liquid-form>
```

组件采用受控数据模型：通过 `value`/`v-model` 接收状态，通过 `input`、`change`、`submit` 等事件表达意图，不会直接读写业务状态。

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

const surface = createLiquidSurface({
  runtime,
  surface: 'panel',
  content: '你好，LiquidUI'
})
document.body.append(surface.element)
```

完整的零框架消费端见 [liquid-vanilla-lab](https://github.com/1linhao/liquid-vanilla-lab)。

## 公开能力

| 分类 | 公开组件或能力 |
| --- | --- |
| 基础输入 | Button、Input、Textarea、NumberInput、Select、DatePicker、Switch、Segmented |
| 状态展示 | Tag、Badge、Spinner、Progress、Meter、Icon、IconButton |
| 数据与容器 | Table、TableColumn、Card、Descriptions、ScrollArea |
| 表单 | Form、FormItem、同步/异步校验、回调式兼容校验 |
| 浮层 | Dialog、Drawer、Popover、Dropdown、Tooltip |
| 反馈 | Message、Notification、Confirm、Prompt、Loading 与 FeedbackHost |
| 布局与导航 | Row、Col、Breadcrumb、Menu、NavIcon |
| 主题与材质 | GlassSurface、ThemeToggle、PalettePicker、四类语义 Surface |

Select 可使用 `options` 数组或原生 `<option>`；DatePicker 支持 `date`、`month`、`datetime` 和时间戳值；Table 可使用 `rows/columns` 数据模型，也可使用 `data`、`prop` 和声明式 `LiquidTableColumn`。完整契约见 [组件文档](docs/components/primitives.md)。

## 包入口

| 入口 | 用途 |
| --- | --- |
| `@liqui/liquid-ui/core` | 无框架 runtime、主题、材质、表单校验与反馈控制器 |
| `@liqui/liquid-ui/dom` | 原生 Surface、AnchoredOverlay 和 ModalLayer |
| `@liqui/liquid-ui/vue2` | Vue 2 插件与全部公开组件 |
| `@liqui/liquid-ui/styles.css` | 完整样式 |
| `@liqui/liquid-ui/tokens.css` | 设计令牌 |
| `@liqui/liquid-ui/styles/base.css` | 基础样式 |
| `@liqui/liquid-ui/styles/components.css` | 控件样式 |
| `@liqui/liquid-ui/styles/utilities.css` | 布局工具 |

仓库根目录还保留 `core.js`、`dom.js`、`vue2.js` 和 `styles.css` 代理文件，供尚不能解析 package exports 的旧构建工具使用。

## 主题、材质与降级

```js
runtime.theme.setMode('dark')
runtime.theme.setPalette('emerald')
runtime.material.setQuality('reduced')
await runtime.material.preload([{ surface: 'overlay', width: 480, height: 320 }])
```

业务代码只选择 `panel`、`overlay`、`control`、`navigation` 语义材质和 `auto`、`reduced`、`full` 质量档位。运行时会根据浏览器能力与减少动态效果偏好自动降级，不要求业务代码创建 SVG filter 或编写浏览器分支。

所有内部材质类均使用 `liqui-` 命名空间，避免与宿主项目的通用 `.liquid-*` 或标签选择器冲突。

## 浏览器与运行环境

- 现代 Chromium、Firefox 和 Safari；不支持高级滤镜时自动使用 CSS 材质降级。
- Node.js 18 或更高版本用于构建与测试。
- Vue 2.6/2.7 仅为可选 peer dependency；无框架入口不会加载 Vue。

## 开发与发布验收

```sh
npm install
npm run check
npm pack --dry-run
```

`check` 会运行单元测试、构建 ESM/CSS/类型声明，并校验所有公开导出。跨主题、跨视口和键盘交互的 75 项视觉回归由 [liquid-integration-lab](https://github.com/1linhao/liquid-integration-lab) 执行。

## 维护与许可

版本变化见 [CHANGELOG.md](CHANGELOG.md)，参与开发见 [CONTRIBUTING.md](CONTRIBUTING.md)，安全问题见 [SECURITY.md](SECURITY.md)。项目采用 MIT 许可证；第三方参考和声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
