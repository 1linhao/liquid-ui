const scrollLocks = /* @__PURE__ */ new WeakMap();
function lockScroll(document) {
  var _a;
  const root = document.documentElement;
  const state = (_a = scrollLocks.get(document)) != null ? _a : { count: 0, overflow: root.style.overflow };
  if (state.count === 0) root.style.overflow = "hidden";
  state.count += 1;
  scrollLocks.set(document, state);
}
function unlockScroll(document) {
  const state = scrollLocks.get(document);
  if (!state) return;
  state.count -= 1;
  if (state.count <= 0) {
    document.documentElement.style.overflow = state.overflow;
    scrollLocks.delete(document);
  }
}
function focusableElements(root) {
  return [...root.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter((element) => {
    var _a;
    return !element.hidden && ((_a = element.getAttribute) == null ? void 0 : _a.call(element, "aria-hidden")) !== "true";
  });
}
function createModalLayer(options = {}) {
  var _a, _b;
  const dialog = options.dialog;
  const document = (_b = (_a = options.document) != null ? _a : dialog == null ? void 0 : dialog.ownerDocument) != null ? _b : globalThis.document;
  if (!dialog || !(document == null ? void 0 : document.addEventListener) || !(document == null ? void 0 : document.documentElement)) throw new TypeError("createModalLayer requires a dialog and DOM document");
  let open = false;
  let destroyed = false;
  let returnFocus;
  const release = () => {
    var _a2, _b2;
    document.removeEventListener("keydown", onKeyDown, true);
    (_a2 = dialog.removeEventListener) == null ? void 0 : _a2.call(dialog, "cancel", onCancel);
    (_b2 = dialog.removeEventListener) == null ? void 0 : _b2.call(dialog, "pointerdown", onPointerDown);
  };
  const close = ({ reason = "programmatic", restoreFocus = true } = {}) => {
    var _a2, _b2, _c;
    if (!open || destroyed) return false;
    open = false;
    release();
    if (dialog.open && dialog.close) dialog.close();
    dialog.hidden = true;
    (_a2 = dialog.removeAttribute) == null ? void 0 : _a2.call(dialog, "open");
    unlockScroll(document);
    (_b2 = options.onDismiss) == null ? void 0 : _b2.call(options, reason);
    if (restoreFocus) (_c = returnFocus == null ? void 0 : returnFocus.focus) == null ? void 0 : _c.call(returnFocus, { preventScroll: true });
    returnFocus = null;
    return true;
  };
  const onCancel = (event) => {
    var _a2;
    (_a2 = event.preventDefault) == null ? void 0 : _a2.call(event);
    if (options.closeOnEscape !== false) close({ reason: "escape" });
  };
  const onPointerDown = (event) => {
    if (options.closeOnBackdrop !== false && event.target === dialog) close({ reason: "backdrop" });
  };
  const onKeyDown = (event) => {
    var _a2, _b2, _c, _d, _e;
    if (event.key === "Escape") {
      if (options.closeOnEscape !== false) {
        (_a2 = event.preventDefault) == null ? void 0 : _a2.call(event);
        close({ reason: "escape" });
      }
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = focusableElements(dialog);
    if (!focusable.length) {
      (_b2 = event.preventDefault) == null ? void 0 : _b2.call(event);
      (_c = dialog.focus) == null ? void 0 : _c.call(dialog);
      return;
    }
    const current = document.activeElement;
    const index = focusable.indexOf(current);
    if (event.shiftKey && index <= 0) {
      (_d = event.preventDefault) == null ? void 0 : _d.call(event);
      focusable.at(-1).focus();
    } else if (!event.shiftKey && (index < 0 || index === focusable.length - 1)) {
      (_e = event.preventDefault) == null ? void 0 : _e.call(event);
      focusable[0].focus();
    }
  };
  return Object.freeze({
    open() {
      var _a2, _b2, _c, _d, _e, _f, _g, _h, _i;
      if (destroyed) throw new Error("Cannot open a destroyed modal layer");
      if (open) return false;
      open = true;
      returnFocus = (_a2 = options.returnFocus) != null ? _a2 : document.activeElement;
      dialog.hidden = false;
      lockScroll(document);
      if (dialog.showModal) {
        try {
          dialog.showModal();
        } catch (e) {
          (_b2 = dialog.setAttribute) == null ? void 0 : _b2.call(dialog, "open", "");
        }
      } else (_c = dialog.setAttribute) == null ? void 0 : _c.call(dialog, "open", "");
      document.addEventListener("keydown", onKeyDown, true);
      (_d = dialog.addEventListener) == null ? void 0 : _d.call(dialog, "cancel", onCancel);
      (_e = dialog.addEventListener) == null ? void 0 : _e.call(dialog, "pointerdown", onPointerDown);
      const initial = typeof options.initialFocus === "function" ? options.initialFocus() : options.initialFocus;
      const target = (_h = (_g = initial != null ? initial : (_f = dialog.querySelector) == null ? void 0 : _f.call(dialog, "[autofocus]")) != null ? _g : focusableElements(dialog)[0]) != null ? _h : dialog;
      (_i = target == null ? void 0 : target.focus) == null ? void 0 : _i.call(target, { preventScroll: true });
      return true;
    },
    close,
    isOpen: () => open,
    destroy() {
      if (destroyed) return;
      close({ reason: "destroy", restoreFocus: false });
      release();
      destroyed = true;
    }
  });
}
export {
  createModalLayer
};
