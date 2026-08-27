const LiquidMeter = { name: "LiquidMeter", props: { value: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, label: { type: String, default: "Meter" }, tone: { type: String, default: "accent" } }, computed: { percent() {
  const range = this.max - this.min;
  return range > 0 ? Math.min(100, Math.max(0, (this.value - this.min) / range * 100)) : 0;
} }, render(h) {
  return h("div", { class: ["liquid-meter", `liquid-meter--${this.tone}`], attrs: { role: "meter", "aria-label": this.label, "aria-valuemin": String(this.min), "aria-valuemax": String(this.max), "aria-valuenow": String(this.value) } }, [h("span", { style: { width: `${this.percent}%` } })]);
} };
export {
  LiquidMeter
};
