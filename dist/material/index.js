import { detectCapabilities } from "./capabilities.js";
import { normalizeDescriptor } from "./profiles.js";
import { ensureFilter } from "./registry.js";
const QUALITIES = /* @__PURE__ */ new Set(["auto", "reduced", "full"]);
function createMaterialController(options = {}) {
  var _a;
  const environment = (_a = options.environment) != null ? _a : globalThis;
  const capabilities = detectCapabilities(environment);
  let quality = QUALITIES.has(options.initialQuality) ? options.initialQuality : "auto";
  const listeners = /* @__PURE__ */ new Set();
  const resolveTier = (descriptorInput = {}) => {
    const descriptor = normalizeDescriptor(descriptorInput);
    if (descriptor.material === "clear") return "clear";
    if (descriptor.material === "frost" || quality === "reduced" || capabilities.reducedTransparency) return "frost";
    return capabilities.refraction ? "refract" : "frost";
  };
  return {
    getCapabilities: () => capabilities,
    getQuality: () => quality,
    setQuality(nextQuality) {
      if (!QUALITIES.has(nextQuality)) throw new TypeError(`Unknown material quality: ${nextQuality}`);
      if (nextQuality === quality) return quality;
      quality = nextQuality;
      listeners.forEach((listener) => listener(quality));
      return quality;
    },
    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("Material listener must be a function");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    resolveTier,
    async preload(inputs = []) {
      var _a2;
      if (!Array.isArray(inputs)) throw new TypeError("material.preload expects an array");
      const document = (_a2 = options.document) != null ? _a2 : environment.document;
      for (const input of inputs) {
        const descriptor = normalizeDescriptor(input);
        if (resolveTier(descriptor) !== "refract" || !document) continue;
        if (!(input.width > 0 && input.height > 0)) continue;
        ensureFilter(document, Math.round(input.width), Math.round(input.height), descriptor);
      }
    }
  };
}
import { bindGlassSurface } from "./surface.js";
import { getRegistryStats } from "./registry.js";
export {
  bindGlassSurface,
  createMaterialController,
  detectCapabilities,
  getRegistryStats,
  normalizeDescriptor
};
