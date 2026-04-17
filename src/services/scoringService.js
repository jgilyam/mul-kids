export const scoringService = {
  /**
   * BR-02: Scoring Algorithm
   * Calcula puntaje basado en correctitud y tiempo de respuesta
   * @param {boolean} isCorrect
   * @param {number} timeMs - tiempo en milisegundos
   * @returns {number} - puntaje de 0 a 100
   */
  calculateScore(isCorrect, timeMs) {
    if (!isCorrect) return 0

    // Time bands:
    if (timeMs <= 2000) return 100
    if (timeMs <= 5000) return 80
    if (timeMs <= 10000) return 60
    if (timeMs <= 15000) return 40
    return 20
  },

  /**
   * @param {import('../types/game.js').Round[]} rounds
   * @returns {number}
   */
  calculateTotalScore(rounds) {
    if (rounds.length === 0) return 0
    return rounds.reduce((sum, round) => sum + round.score, 0)
  },

  /**
   * @param {import('../types/game.js').Round[]} rounds
   * @returns {number} - porcentaje de 0 a 100
   */
  calculateAccuracy(rounds) {
    if (rounds.length === 0) return 0
    const correct = rounds.filter(r => r.isCorrect).length
    return Math.round((correct / rounds.length) * 100)
  },

  /**
   * @param {import('../types/game.js').Round[]} rounds
   * @returns {number} - tiempo promedio en milisegundos
   */
  calculateAverageTime(rounds) {
    if (rounds.length === 0) return 0
    const total = rounds.reduce((sum, round) => sum + round.timeToAnswer, 0)
    return Math.round(total / rounds.length)
  },

  /**
   * @param {number} timeMs
   * @returns {'perfect' | 'great' | 'good' | 'ok' | 'slow'}
   */
  getScoreTier(timeMs) {
    if (timeMs <= 2000) return 'perfect'
    if (timeMs <= 5000) return 'great'
    if (timeMs <= 10000) return 'good'
    if (timeMs <= 15000) return 'ok'
    return 'slow'
  }
}
