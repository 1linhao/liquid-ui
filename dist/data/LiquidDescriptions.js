const LiquidDescriptions = { name: "LiquidDescriptions", props: { items: { type: Array, required: true }, columns: { type: Number, default: 2 }, title: { type: String, default: "" } }, render(h) {
  return h("section", { class: "liquid-descriptions", style: { "--liquid-description-columns": String(Math.max(1, this.columns)) } }, [this.title ? h("h3", this.title) : null, h("dl", this.items.map((item) => {
    var _a, _b;
    return h("div", { key: (_a = item.key) != null ? _a : item.label }, [h("dt", item.label), h("dd", this.$scopedSlots[item.key] ? this.$scopedSlots[item.key]({ item, value: item.value }) : String((_b = item.value) != null ? _b : "—"))]);
  }))]);
} };
export {
  LiquidDescriptions
};
