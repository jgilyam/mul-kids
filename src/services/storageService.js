const STORAGE_PREFIX = 'mat-kids'
const STORAGE_LIMIT = 5 * 1024 * 1024 // 5MB

export const storageService = {
  /**
   * @param {string} userId
   * @returns {Array}
   */
  getSessions(userId) {
    try {
      const key = `${STORAGE_PREFIX}-sessions-${userId}`
      const data = localStorage.getItem(key)
      if (!data) return []
      return JSON.parse(data)
    } catch (error) {
      console.error('Error reading sessions from localStorage:', error)
      return []
    }
  },

  /**
   * @param {string} userId
   * @param {Array} sessions
   */
  saveSessions(userId, sessions) {
    try {
      const key = `${STORAGE_PREFIX}-sessions-${userId}`
      localStorage.setItem(key, JSON.stringify(sessions))
    } catch (error) {
      console.error('Error saving sessions to localStorage:', error)
    }
  },

  /**
   * @returns {{ used: number, limit: number, percentage: number }}
   */
  getStorageUsage() {
    let used = 0
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key)
          if (value !== null) {
            used += value.length + key.length
          }
        }
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error)
    }
    return {
      used,
      limit: STORAGE_LIMIT,
      percentage: (used / STORAGE_LIMIT) * 100
    }
  },

  /**
   * @returns {boolean}
   */
  isAvailable() {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
}
