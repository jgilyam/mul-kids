/**
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} - Date in YYYY-MM-DD format
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @param {number} days - Number of days to check
 * @returns {boolean}
 */
export function isWithinLastNDays(timestamp, days) {
  const now = Date.now()
  const diffMs = now - timestamp
  const diffDays = diffMs / (24 * 60 * 60 * 1000)
  return diffDays <= days
}

/**
 * @returns {string[]} - Array of 7 date strings in YYYY-MM-DD format
 */
export function getLast7Days() {
  const days = []
  for (let i = 0; i < 7; i++) {
    const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000)
    days.push(formatDate(timestamp))
  }
  return days
}
