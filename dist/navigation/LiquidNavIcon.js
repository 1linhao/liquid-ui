import { LiquidIcon } from "../primitives/LiquidIcon.js";
const LiquidNavIcon = { name: "LiquidNavIcon", props: { name: { type: String, required: true }, label: { type: String, default: "" }, size: { type: [Number, String], default: 20 } }, render(h) {
  return h("span", { class: "liquid-nav-icon" }, [h(LiquidIcon, { props: { name: this.name, label: this.label, size: this.size } })]);
} };
export {
  LiquidNavIcon
};
