const SURFACE_PROFILES = Object.freeze({
  panel: Object.freeze({ radius: 28, frost: 0.52, blur: 4, refraction: 72, bezel: 24, specular: 0.48, saturation: 1.45, dispersion: 0 }),
  overlay: Object.freeze({ radius: 24, frost: 0.62, blur: 5, refraction: 96, bezel: 28, specular: 0.62, saturation: 1.55, dispersion: 0 }),
  control: Object.freeze({ radius: 999, frost: 0.34, blur: 2, refraction: 112, bezel: 12, specular: 0.72, saturation: 1.65, dispersion: 0 }),
  navigation: Object.freeze({ radius: 26, frost: 0.46, blur: 3, refraction: 82, bezel: 20, specular: 0.58, saturation: 1.5, dispersion: 0 })
});
const VALID_MATERIALS = /* @__PURE__ */ new Set(["auto", "frost", "clear"]);
function normalizeDescriptor(input = {}) {
  var _a, _b;
  const surface = (_a = input.surface) != null ? _a : "panel";
  const profile = SURFACE_PROFILES[surface];
  if (!profile) throw new TypeError(`Unknown LiquidUI surface intent: ${surface}`);
  const descriptor = { ...profile, ...input, surface, material: (_b = input.material) != null ? _b : "auto" };
  if (!VALID_MATERIALS.has(descriptor.material)) throw new TypeError(`Unknown glass material: ${descriptor.material}`);
  for (const key of ["radius", "frost", "blur", "refraction", "bezel", "specular", "saturation", "dispersion"]) {
    if (!Number.isFinite(descriptor[key]) || descriptor[key] < 0) {
      throw new TypeError(`Glass ${key} must be a non-negative finite number`);
    }
  }
  descriptor.frost = Math.min(descriptor.frost, 1);
  descriptor.specular = Math.min(descriptor.specular, 1);
  return Object.freeze(descriptor);
}
export {
  SURFACE_PROFILES,
  normalizeDescriptor
};
