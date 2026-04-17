/**
 * @returns {string} - Browser fingerprint string
 */
export function generateFingerprint() {
  return [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height
  ].join('|')
}
