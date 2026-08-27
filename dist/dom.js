import { createLiquidRuntime } from "./core.js";
import { bindGlassSurface } from "./material/surface.js";
import { createAnchoredOverlay } from "./overlays/anchored.js";
import { createModalLayer } from "./overlays/modal.js";
const LAYERS = ["backdrop", "refract", "tint", "specular"];
function appendContent(contentElement, content) {
  if (content === void 0 || content === null) return;
  if (Array.isArray(content)) {
    content.forEach((item) => appendContent(contentElement, item));
    return;
  }
  if (typeof content === "string" || typeof content === "number") {
    contentElement.append(String(content));
    return;
  }
  if (typeof content.nodeType === "number") {
    contentElement.appendChild(content);
    return;
  }
  throw new TypeError("Liquid surface content must be text, a DOM Node, or an array of them");
}
function createLayer(document, name) {
  const layer = document.createElement("span");
  layer.className = `liqui-glass__${name}`;
  layer.setAttribute("data-liquid-layer", name);
  layer.setAttribute("aria-hidden", "true");
  return layer;
}
function createLiquidSurface(options = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const document = (_a = options.document) != null ? _a : globalThis.document;
  if (!(document == null ? void 0 : document.createElement)) throw new TypeError("createLiquidSurface requires a DOM document");
  const runtime = (_b = options.runtime) != null ? _b : createLiquidRuntime({ ...options, document });
  if (!((_c = runtime == null ? void 0 : runtime.material) == null ? void 0 : _c.resolveTier)) throw new TypeError("createLiquidSurface requires a Liquid runtime");
  const element = document.createElement((_d = options.tagName) != null ? _d : "div");
  element.className = ["liqui-glass", options.className].filter(Boolean).join(" ");
  const layers = LAYERS.map((name) => createLayer(document, name));
  const shine = document.createElement("span");
  shine.className = "liqui-glass__shine";
  shine.setAttribute("aria-hidden", "true");
  const contentElement = document.createElement("div");
  contentElement.className = "liqui-glass__content";
  layers.forEach((layer) => element.appendChild(layer));
  element.appendChild(shine);
  element.appendChild(contentElement);
  appendContent(contentElement, options.content);
  let descriptor = { ...(_e = options.descriptor) != null ? _e : {}, surface: (_h = (_g = options.surface) != null ? _g : (_f = options.descriptor) == null ? void 0 : _f.surface) != null ? _h : "panel" };
  let releaseBinding;
  let destroyed = false;
  const bind = () => {
    if (destroyed) return;
    releaseBinding == null ? void 0 : releaseBinding();
    element.classList.toggle("liqui-glass--elevated", Boolean(descriptor.elevated));
    releaseBinding = bindGlassSurface(element, descriptor, runtime.material);
  };
  const releaseQuality = runtime.material.subscribe(bind);
  bind();
  return Object.freeze({
    element,
    contentElement,
    runtime,
    update(nextDescriptor = {}) {
      if (destroyed) throw new Error("Cannot update a destroyed Liquid surface");
      descriptor = { ...descriptor, ...nextDescriptor };
      bind();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      releaseBinding == null ? void 0 : releaseBinding();
      releaseQuality();
      element.remove();
    }
  });
}
export {
  createAnchoredOverlay,
  createLiquidSurface,
  createModalLayer
};
