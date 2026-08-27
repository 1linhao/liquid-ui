const LiquidBreadcrumb = { name: "LiquidBreadcrumb", inheritAttrs: false, props: { items: { type: Array, required: true }, label: { type: String, default: "Breadcrumb" } }, render(h) {
  return h("nav", { class: "liquid-breadcrumb", attrs: { ...this.$attrs, "aria-label": this.label } }, [h("ol", this.items.map((item, index) => {
    var _a;
    return h("li", { key: (_a = item.key) != null ? _a : item.label }, [index ? h("span", { attrs: { "aria-hidden": "true" } }, "›") : null, index === this.items.length - 1 ? h("span", { attrs: { "aria-current": "page" } }, item.label) : h("button", { attrs: { type: "button" }, on: { click: (event) => this.$emit("navigate", item.key, item, event) } }, item.label)]);
  }))]);
} };
export {
  LiquidBreadcrumb
};
