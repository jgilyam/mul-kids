/**
 * @typedef {Object} TablePerformance
 * @property {number} attempts
 * @property {number} correct
 * @property {number} avgTime - milisegundos
 */

/**
 * @typedef {Object} HistoryEntry
 * @property {string} date - formato YYYY-MM-DD
 * @property {number} sessionsPlayed
 * @property {number} totalScore
 * @property {number} averageTime
 * @property {Object.<number, TablePerformance>} tablesPerformance
 */

/**
 * @typedef {Object} WeeklyProgress
 * @property {number} totalSessions
 * @property {number} avgScore
 * @property {number} activeDays
 * @property {number} totalDays - siempre 7
 */

export {}
