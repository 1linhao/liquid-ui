import { createMaterialController } from "./material/index.js";
import { createThemeController } from "./theme/index.js";
import { createFormController } from "./forms/controller.js";
import { createFeedbackController } from "./feedback/controller.js";
import { detectCapabilities, normalizeDescriptor } from "./material/index.js";
const LIQUID_MODES = Object.freeze(["light", "dark", "system"]);
const LIQUID_PALETTES = Object.freeze(["blue", "violet", "emerald", "amber"]);
const LIQUID_QUALITIES = Object.freeze(["auto", "reduced", "full"]);
const LIQUID_SURFACES = Object.freeze(["panel", "overlay", "control", "navigation"]);
function createLiquidRuntime(options = {}) {
  var _a;
  const materialOptions = { ...(_a = options.material) != null ? _a : {} };
  if (!Object.hasOwn(materialOptions, "environment") && Object.hasOwn(options, "environment")) {
    materialOptions.environment = options.environment;
  }
  if (!Object.hasOwn(materialOptions, "document") && Object.hasOwn(options, "document")) {
    materialOptions.document = options.document;
  }
  return Object.freeze({
    theme: createThemeController(options),
    material: createMaterialController(materialOptions)
  });
}
export {
  LIQUID_MODES,
  LIQUID_PALETTES,
  LIQUID_QUALITIES,
  LIQUID_SURFACES,
  createFeedbackController,
  createFormController,
  createLiquidRuntime,
  createMaterialController,
  createThemeController,
  detectCapabilities,
  normalizeDescriptor
};
