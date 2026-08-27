import { ensureFilter } from "./registry.js";
import { normalizeDescriptor } from "./profiles.js";
function setFilterStyle(layer, value) {
  if (!layer) return;
  layer.style.backdropFilter = value;
  layer.style.webkitBackdropFilter = value;
}
function bindGlassSurface(root, descriptorInput, materialController) {
  var _a, _b;
  const descriptor = normalizeDescriptor(descriptorInput);
  const backdrop = root.querySelector('[data-liquid-layer="backdrop"]');
  const refract = root.querySelector('[data-liquid-layer="refract"]');
  const tint = root.querySelector('[data-liquid-layer="tint"]');
  const specular = root.querySelector('[data-liquid-layer="specular"]');
  let observer;
  let disposed = false;
  const tier = materialController.resolveTier(descriptor);
  root.classList.remove("liqui-glass--clear", "liqui-glass--frost", "liqui-glass--refract");
  root.classList.add(`liqui-glass--${tier}`);
  root.style.setProperty("--liquid-radius", `${descriptor.radius}px`);
  tint.style.opacity = tier === "clear" ? "1" : String(0.25 + 0.75 * descriptor.frost);
  const effectiveBlur = descriptor.blur + descriptor.frost * 14;
  setFilterStyle(backdrop, tier === "clear" ? "" : `blur(${tier === "frost" ? Math.max(effectiveBlur * 2, 10) : effectiveBlur}px) saturate(${descriptor.saturation})`);
  const apply = (width, height) => {
    if (disposed || tier !== "refract" || width <= 0 || height <= 0) return;
    try {
      const entry = ensureFilter(root.ownerDocument, Math.round(width), Math.round(height), descriptor);
      setFilterStyle(refract, `url(#${entry.id})`);
      specular.style.backgroundImage = `url(${entry.images.specular})`;
      specular.style.opacity = String(descriptor.specular);
      if (entry.cold) {
        refract.classList.add("liqui-glass__refract--fade");
        specular.classList.add("liqui-glass__specular--fade");
        setTimeout(() => {
          refract.classList.remove("liqui-glass__refract--fade");
          specular.classList.remove("liqui-glass__specular--fade");
        }, 250);
      }
    } catch (e) {
      root.classList.replace("liqui-glass--refract", "liqui-glass--frost");
      setFilterStyle(backdrop, `blur(${Math.max(effectiveBlur * 2, 10)}px) saturate(${descriptor.saturation})`);
    }
  };
  if (tier === "refract") {
    apply(root.offsetWidth, root.offsetHeight);
    const ResizeObserverClass = (_b = (_a = root.ownerDocument.defaultView) == null ? void 0 : _a.ResizeObserver) != null ? _b : globalThis.ResizeObserver;
    if (ResizeObserverClass) {
      observer = new ResizeObserverClass((entries) => {
        var _a2;
        const rect = (_a2 = entries[0]) == null ? void 0 : _a2.contentRect;
        if (rect) apply(rect.width, rect.height);
      });
      observer.observe(root);
    }
  }
  return () => {
    disposed = true;
    observer == null ? void 0 : observer.disconnect();
  };
}
export {
  bindGlassSurface
};
