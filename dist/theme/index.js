const MODES = /* @__PURE__ */ new Set(["light", "dark", "system"]);
const PALETTES = /* @__PURE__ */ new Set(["blue", "violet", "emerald", "amber"]);
const STORAGE_KEY = "liquid-ui.palette";
function safeRead(storage, key) {
  try {
    return storage == null ? void 0 : storage.getItem(key);
  } catch (e) {
    return null;
  }
}
function safeWrite(storage, key, value) {
  try {
    storage == null ? void 0 : storage.setItem(key, value);
  } catch (e) {
  }
}
function createThemeController(options = {}) {
  var _a, _b, _c, _d;
  const root = Object.hasOwn(options, "document") ? (_a = options.document) == null ? void 0 : _a.documentElement : (_b = globalThis.document) == null ? void 0 : _b.documentElement;
  const matchMedia = Object.hasOwn(options, "matchMedia") ? options.matchMedia : globalThis.matchMedia;
  const media = matchMedia == null ? void 0 : matchMedia("(prefers-color-scheme: dark)");
  const storedPalette = safeRead(options.paletteStorage, STORAGE_KEY);
  let mode = MODES.has(options.initialMode) ? options.initialMode : "system";
  let palette = PALETTES.has(storedPalette) ? storedPalette : PALETTES.has(options.initialPalette) ? options.initialPalette : "blue";
  const listeners = /* @__PURE__ */ new Set();
  const resolvedMode = () => mode === "system" ? (media == null ? void 0 : media.matches) ? "dark" : "light" : mode;
  const snapshot = () => Object.freeze({ mode, resolvedMode: resolvedMode(), palette });
  const apply = () => {
    var _a2;
    const state = snapshot();
    root == null ? void 0 : root.setAttribute("data-liquid-mode", state.resolvedMode);
    root == null ? void 0 : root.setAttribute("data-liquid-palette", state.palette);
    (_a2 = root == null ? void 0 : root.style) == null ? void 0 : _a2.setProperty("color-scheme", state.resolvedMode);
    listeners.forEach((listener) => listener(state));
    return state;
  };
  const onSystemChange = () => {
    if (mode === "system") apply();
  };
  (_c = media == null ? void 0 : media.addEventListener) == null ? void 0 : _c.call(media, "change", onSystemChange);
  (_d = media == null ? void 0 : media.addListener) == null ? void 0 : _d.call(media, onSystemChange);
  apply();
  return {
    getState: snapshot,
    setMode(nextMode) {
      if (!MODES.has(nextMode)) throw new TypeError(`Unknown LiquidUI mode: ${nextMode}`);
      mode = nextMode;
      return apply();
    },
    setPalette(nextPalette) {
      if (!PALETTES.has(nextPalette)) throw new TypeError(`Unknown LiquidUI palette: ${nextPalette}`);
      palette = nextPalette;
      safeWrite(options.paletteStorage, STORAGE_KEY, palette);
      return apply();
    },
    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("Theme listener must be a function");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy() {
      var _a2, _b2;
      (_a2 = media == null ? void 0 : media.removeEventListener) == null ? void 0 : _a2.call(media, "change", onSystemChange);
      (_b2 = media == null ? void 0 : media.removeListener) == null ? void 0 : _b2.call(media, onSystemChange);
      listeners.clear();
    }
  };
}
export {
  createThemeController
};
