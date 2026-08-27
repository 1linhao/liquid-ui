function detectCapabilities(environment = globalThis) {
  var _a, _b, _c, _d, _e;
  const css = environment.CSS;
  const ua = (_b = (_a = environment.navigator) == null ? void 0 : _a.userAgent) != null ? _b : "";
  const backdropFilter = Boolean((_c = css == null ? void 0 : css.supports) == null ? void 0 : _c.call(css, "backdrop-filter", "blur(1px)"));
  const firefox = /firefox\//i.test(ua);
  const safari = /^((?!chrome|chromium|crios|edg|android).)*safari/i.test(ua);
  const reducedTransparency = Boolean((_e = (_d = environment.matchMedia) == null ? void 0 : _d.call(environment, "(prefers-reduced-transparency: reduce)")) == null ? void 0 : _e.matches);
  return Object.freeze({
    backdropFilter,
    refraction: backdropFilter && !firefox && !safari && !reducedTransparency,
    reducedTransparency
  });
}
export {
  detectCapabilities
};
