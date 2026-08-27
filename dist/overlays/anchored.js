function getEnvironment(options) {
  var _a, _b, _c, _d, _e;
  const document = (_c = (_b = options.document) != null ? _b : (_a = options.anchor) == null ? void 0 : _a.ownerDocument) != null ? _c : globalThis.document;
  const environment = (_e = (_d = options.environment) != null ? _d : document == null ? void 0 : document.defaultView) != null ? _e : globalThis.window;
  if (!(document == null ? void 0 : document.addEventListener) || !(environment == null ? void 0 : environment.addEventListener)) {
    throw new TypeError("createAnchoredOverlay requires a browser-like document and environment");
  }
  return { document, environment };
}
function place(anchor, panel, environment, options) {
  var _a, _b;
  const rect = anchor.getBoundingClientRect();
  const gutter = (_a = options.gutter) != null ? _a : 6;
  const viewportPadding = (_b = options.viewportPadding) != null ? _b : 12;
  const availableWidth = Math.max(0, environment.innerWidth - viewportPadding * 2);
  const width = options.matchWidth === false ? Math.min(panel.offsetWidth || rect.width, availableWidth) : Math.min(rect.width, availableWidth);
  const panelHeight = Math.min(panel.offsetHeight || options.estimatedHeight || 320, environment.innerHeight - viewportPadding * 2);
  const roomBelow = environment.innerHeight - rect.bottom - viewportPadding;
  const openAbove = roomBelow < panelHeight && rect.top - viewportPadding > roomBelow;
  const left = Math.min(Math.max(viewportPadding, rect.left), environment.innerWidth - width - viewportPadding);
  Object.assign(panel.style, {
    position: "fixed",
    left: `${left}px`,
    top: openAbove ? "auto" : `${rect.bottom + gutter}px`,
    bottom: openAbove ? `${environment.innerHeight - rect.top + gutter}px` : "auto",
    width: `${width}px`,
    maxHeight: `${Math.max(0, panelHeight)}px`
  });
  panel.dataset.placement = openAbove ? "top" : "bottom";
}
function createAnchoredOverlay(options = {}) {
  const { anchor, panel } = options;
  if (!(anchor == null ? void 0 : anchor.getBoundingClientRect) || !(panel == null ? void 0 : panel.style)) {
    throw new TypeError("createAnchoredOverlay requires anchor and panel elements");
  }
  const { document, environment } = getEnvironment(options);
  let open = false;
  let destroyed = false;
  const updatePosition = () => {
    if (!open || destroyed) return;
    place(anchor, panel, environment, options);
  };
  const finalizeClose = ({ restoreFocus = true, reason = "programmatic" } = {}) => {
    var _a, _b;
    if (!open || destroyed) return false;
    open = false;
    if (panel.hidePopover) {
      try {
        panel.hidePopover();
      } catch (e) {
      }
    }
    panel.hidden = true;
    (_a = options.onDismiss) == null ? void 0 : _a.call(options, reason);
    if (restoreFocus) (_b = anchor.focus) == null ? void 0 : _b.call(anchor, { preventScroll: true });
    return true;
  };
  let closeOverlay;
  const onPointerDown = (event) => {
    if (!anchor.contains(event.target) && !panel.contains(event.target)) closeOverlay({ restoreFocus: false, reason: "outside" });
  };
  const onKeyDown = (event) => {
    var _a;
    if (event.key !== "Escape") return;
    (_a = event.preventDefault) == null ? void 0 : _a.call(event);
    closeOverlay({ reason: "escape" });
  };
  const openOverlay = () => {
    if (destroyed) throw new Error("Cannot open a destroyed overlay");
    if (open) return false;
    open = true;
    panel.hidden = false;
    if (panel.showPopover) {
      try {
        panel.showPopover();
      } catch (e) {
      }
    }
    updatePosition();
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    environment.addEventListener("resize", updatePosition);
    environment.addEventListener("scroll", updatePosition, true);
    return true;
  };
  const releaseListeners = () => {
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("keydown", onKeyDown, true);
    environment.removeEventListener("resize", updatePosition);
    environment.removeEventListener("scroll", updatePosition, true);
  };
  closeOverlay = (config) => {
    const changed = finalizeClose(config);
    if (changed) releaseListeners();
    return changed;
  };
  return Object.freeze({
    open: openOverlay,
    close: closeOverlay,
    updatePosition,
    isOpen: () => open,
    destroy() {
      if (destroyed) return;
      closeOverlay({ restoreFocus: false, reason: "destroy" });
      releaseListeners();
      destroyed = true;
    }
  });
}
export {
  createAnchoredOverlay
};
