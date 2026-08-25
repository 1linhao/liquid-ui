# Primitive component contracts

All primitives are controlled Vue 2 components. They emit intent and never
read application state, Router, storage, or business services.

## LiquidInput

- `value: string | number`
- `type`, `disabled`, `readonly`, `invalid`, `clearable`
- emits `input(value)`, `change(value)`, `focus(event)`, `blur(event)`, and
  `clear(event)`
- forwards native attributes to the input; supports `prefix` and `suffix`
  slots

## LiquidNumberInput

- `value: number | string | null`
- `min`, `max`, `step`, `precision`, `disabled`, `readonly`, `invalid`
- keeps an editing draft internally and emits only normalized numbers or null
- commits on blur/Enter; ArrowUp/ArrowDown and step buttons share the same
  clamp/round logic
- emits `invalid(rawValue)` and restores the controlled value when parsing
  fails

## LiquidSwitch

- `value: boolean`, `disabled`, `label`
- native button keyboard behavior provides Enter and Space activation
- exposes `role="switch"` and `aria-checked`
- emits `input(nextValue)` and `change(nextValue, event)`

## LiquidSelect

- controlled `value` with explicit `{ value, label, disabled? }[]` options
- scalar single selection or array-based `multiple` selection
- `clearable`, `filterable`, `disabled`, `invalid`, placeholder, and empty text
- ArrowUp/ArrowDown skip disabled options; Enter/Space select; Escape closes
- the overlay owns viewport positioning, outside dismissal, and focus restoration
- emits `input(value)`, `change(value, event)`, `open`, `close(reason)`, `blur`, and `clear(event)`

## LiquidTag

- tones: `neutral`, `accent`, `success`, `warning`, `danger`, `info`
- `closable` adds a keyboard-accessible remove button
- emits `close(event)`; disabled tags emit no action

Every component consumes semantic LiquidUI tokens. Fixed color literals remain
confined to `tokens.css`; component CSS contains no business selector,
`#app`, `!important`, or fixed color value.

## LiquidForm / LiquidFormItem

- `LiquidForm` receives a controlled `model` and declarative `rules`
- rules support required, numeric/length min/max, pattern, and sync/async validators
- `validate()`, `validateField()`, and `clearValidate()` expose validation through one Interface
- async validation uses per-field versions so stale responses cannot overwrite current state
- submit emits `submit(result, event)` only when valid and `invalid(result, event)` otherwise
- reset clears validation and emits intent; it never mutates the host model
- `LiquidFormItem` owns label, help text, error presentation, and blur validation
