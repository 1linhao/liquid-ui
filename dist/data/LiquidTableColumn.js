const LiquidTableColumn = {
  name: "LiquidTableColumn",
  props: { keyName: { type: String, default: "" }, field: { type: String, default: "" }, prop: { type: String, default: "" }, label: { type: [String, Number], default: "" }, type: { type: String, default: "" }, width: { type: [Number, String], default: "" }, minWidth: { type: [Number, String], default: "" }, align: { type: String, default: "left" }, sortable: Boolean },
  render: () => null
};
export {
  LiquidTableColumn
};
