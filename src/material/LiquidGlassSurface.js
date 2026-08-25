import { bindGlassSurface } from './surface.js'

export const LiquidGlassSurface = {
  name: 'LiquidGlassSurface',
  inheritAttrs: false,
  props: {
    surface: { type: String, default: 'panel' },
    material: { type: String, default: 'auto' },
    elevated: { type: Boolean, default: false },
    descriptor: { type: Object, default: () => ({}) }
  },
  mounted() {
    this.mountSurface()
    this.releaseQuality = this.$liquidUI.material.subscribe(() => this.mountSurface())
  },
  beforeDestroy() {
    this.releaseSurface?.()
    this.releaseQuality?.()
  },
  methods: {
    mountSurface() {
      const materialController = this.$liquidUI?.material
      if (!materialController) throw new Error('LiquidGlassSurface requires Vue.use(createLiquidUI())')
      this.releaseSurface?.()
      this.releaseSurface = bindGlassSurface(this.$refs.surface, {
        ...this.descriptor,
        surface: this.surface,
        material: this.material
      }, materialController)
    }
  },
  render(h) {
    return h('div', {
      ref: 'surface',
      class: ['liquid-glass', { 'liquid-glass--elevated': this.elevated }],
      attrs: this.$attrs,
      on: this.$listeners
    }, [
      h('span', { class: 'liquid-glass__backdrop', attrs: { 'data-liquid-layer': 'backdrop', 'aria-hidden': 'true' } }),
      h('span', { class: 'liquid-glass__refract', attrs: { 'data-liquid-layer': 'refract', 'aria-hidden': 'true' } }),
      h('span', { class: 'liquid-glass__tint', attrs: { 'data-liquid-layer': 'tint', 'aria-hidden': 'true' } }),
      h('span', { class: 'liquid-glass__specular', attrs: { 'data-liquid-layer': 'specular', 'aria-hidden': 'true' } }),
      h('span', { class: 'liquid-glass__shine', attrs: { 'aria-hidden': 'true' } }),
      h('div', { class: 'liquid-glass__content' }, this.$slots.default)
    ])
  }
}
