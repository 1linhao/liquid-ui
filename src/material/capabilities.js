export function detectCapabilities(environment = globalThis) {
  const css = environment.CSS
  const ua = environment.navigator?.userAgent ?? ''
  const backdropFilter = Boolean(css?.supports?.('backdrop-filter', 'blur(1px)'))
  const firefox = /firefox\//i.test(ua)
  const safari = /^((?!chrome|chromium|crios|edg|android).)*safari/i.test(ua)
  const reducedTransparency = Boolean(environment.matchMedia?.('(prefers-reduced-transparency: reduce)')?.matches)
  return Object.freeze({
    backdropFilter,
    refraction: backdropFilter && !firefox && !safari && !reducedTransparency,
    reducedTransparency
  })
}
