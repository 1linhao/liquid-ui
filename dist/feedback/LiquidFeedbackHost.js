import { LiquidButton } from "../primitives/LiquidButton.js";
import { LiquidDialog } from "../overlays/LiquidDialog.js";
import { LiquidGlassSurface } from "../material/LiquidGlassSurface.js";
const LiquidFeedbackHost = {
  name: "LiquidFeedbackHost",
  props: { controller: { type: Object, default: null } },
  data: () => ({ state: { messages: [], requests: [] }, draft: "" }),
  computed: {
    feedback() {
      var _a;
      return (_a = this.controller) != null ? _a : this.$liquidFeedback;
    },
    activeRequest() {
      var _a;
      return (_a = this.state.requests[0]) != null ? _a : null;
    }
  },
  watch: { activeRequest: { immediate: true, handler(request) {
    var _a;
    this.draft = (_a = request == null ? void 0 : request.defaultValue) != null ? _a : "";
  } } },
  created() {
    if (!this.feedback) throw new Error("LiquidFeedbackHost requires a feedback controller");
    this.unsubscribe = this.feedback.subscribe((state) => {
      var _a, _b, _c, _d;
      if (!this.state.requests.length && state.requests.length) {
        this.returnFocus = (_d = (_b = (_a = this.$el) == null ? void 0 : _a.ownerDocument) == null ? void 0 : _b.activeElement) != null ? _d : (_c = globalThis.document) == null ? void 0 : _c.activeElement;
      }
      this.state = state;
    });
  },
  beforeDestroy() {
    var _a;
    (_a = this.unsubscribe) == null ? void 0 : _a.call(this);
  },
  methods: {
    settle(accepted) {
      if (!this.activeRequest) return;
      const returnFocus = this.returnFocus;
      this.feedback.settleRequest(this.activeRequest.id, accepted, this.draft);
      this.$nextTick(() => {
        if (!this.activeRequest) {
          globalThis.setTimeout(() => {
            var _a;
            return (_a = returnFocus == null ? void 0 : returnFocus.focus) == null ? void 0 : _a.call(returnFocus, { preventScroll: true });
          }, 0);
          this.returnFocus = null;
        }
      });
    }
  },
  render(h) {
    const request = this.activeRequest;
    return h("div", { class: "liquid-feedback-host", attrs: { "aria-live": "polite" } }, [
      h("div", { class: "liquid-feedback-stack" }, this.state.messages.map(
        (item) => h(LiquidGlassSurface, { key: item.id, class: ["liquid-feedback", `liquid-feedback--${item.type}`, `liquid-feedback--${item.kind}`], props: { surface: "overlay", elevated: true } }, [
          h("div", { attrs: { role: item.type === "danger" ? "alert" : "status" } }, [
            item.title ? h("strong", item.title) : null,
            h("p", item.message)
          ]),
          h("button", { attrs: { type: "button", "aria-label": "Dismiss" }, on: { click: () => this.feedback.dismiss(item.id, "close-button") } }, "×")
        ])
      )),
      request ? h(LiquidDialog, {
        props: { value: true, title: request.title, closeLabel: request.cancelText },
        on: { input: (value) => {
          if (!value) this.settle(false);
        } }
      }, [
        h("p", { class: "liquid-feedback-request__message" }, request.message),
        request.kind === "prompt" ? h("input", { ref: "prompt", class: "liquid-feedback-request__input", attrs: { autofocus: "", placeholder: request.placeholder }, domProps: { value: this.draft }, on: { input: (event) => {
          this.draft = event.target.value;
        }, keydown: (event) => {
          if (event.key === "Enter") this.settle(true);
        } } }) : null,
        h(LiquidButton, { slot: "footer", props: { size: "small" }, on: { click: () => this.settle(false) } }, request.cancelText),
        h(LiquidButton, { slot: "footer", props: { size: "small", tone: "accent" }, on: { click: () => this.settle(true) } }, request.confirmText)
      ]) : null
    ]);
  }
};
export {
  LiquidFeedbackHost
};
