/**
 * @param {*} value
 * @returns {boolean}
 */
export function isValidNumber(value) {
  return typeof value === 'number' && Number.isInteger(value)
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function isInRange(value, min, max) {
  return value >= min && value <= max
}
