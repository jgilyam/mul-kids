/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {number} table - tabla (1-10)
 * @property {number} multiplier - multiplicador (1-10)
 * @property {number} correctAnswer - tabla × multiplier
 */

/**
 * @typedef {Object} Round
 * @property {string} questionId
 * @property {number} table
 * @property {number} multiplier
 * @property {number} correctAnswer
 * @property {number | null} userAnswer
 * @property {number} timeToAnswer - milisegundos
 * @property {boolean} isCorrect
 * @property {number} score - 0-100
 */

/**
 * @typedef {Object} GameSession
 * @property {string} id - UUID v4
 * @property {string} userId
 * @property {number | null} table - null = modo mixto
 * @property {number} startedAt
 * @property {number | null} completedAt
 * @property {Round[]} rounds - array de 10 rounds
 * @property {number} totalScore
 */

export {}
