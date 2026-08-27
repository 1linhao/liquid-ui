const LiquidMenu = { name: "LiquidMenu", props: { items: { type: Array, required: true }, activeKey: { type: [String, Number], default: "" }, label: { type: String, default: "Menu" } }, methods: { activate(item, event) {
  if (!item.disabled) {
    this.$emit("select", item.key, item, event);
    this.$emit("update:activeKey", item.key);
  }
} }, render(h) {
  return h("nav", { class: "liquid-menu", attrs: { "aria-label": this.label } }, this.items.map((item) => h("button", { key: item.key, class: { "is-active": item.key === this.activeKey }, attrs: { type: "button", disabled: item.disabled, "aria-current": item.key === this.activeKey ? "page" : void 0 }, on: { click: (event) => this.activate(item, event) } }, [this.$scopedSlots.item ? this.$scopedSlots.item({ item, active: item.key === this.activeKey }) : item.label])));
} };
export {
  LiquidMenu
};
