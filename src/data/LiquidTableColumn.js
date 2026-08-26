export const LiquidTableColumn = {
  name: 'LiquidTableColumn',
  props: { keyName: { type: String, default: '' }, field: { type: String, default: '' }, label: { type: String, required: true }, width: { type: [Number, String], default: '' }, minWidth: { type: [Number, String], default: '' }, align: { type: String, default: 'left' }, sortable: Boolean },
  render: () => null
}
