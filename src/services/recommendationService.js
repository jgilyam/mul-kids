export const recommendationService = {
  /**
   * BR-03: Recommendation Algorithm
   * Recomienda la tabla con peor desempeño (score = 60% accuracy + 40% speed)
   * @param {import('../types/game.js').GameSession[]} sessions
   * @returns {number} - tabla recomendada (1-10)
   */
  calculateRecommendedTable(sessions) {
    if (sessions.length === 0) {
      // Sin historial: retornar tabla aleatoria
      return Math.floor(Math.random() * 10) + 1
    }

    const scores = this.getAllPerformanceScores(sessions)

    // Encontrar tabla con menor score (peor performance)
    let minScore = Infinity
    let recommendedTable = 1

    for (let table = 1; table <= 10; table++) {
      const score = scores[table]
      // Tablas sin práctica (score 0) tienen prioridad máxima
      if (score === 0) {
        return table
      }
      if (score < minScore) {
        minScore = score
        recommendedTable = table
      }
    }

    return recommendedTable
  },

  /**
   * Calcula score de performance: 60% accuracy + 40% speed
   * @param {number} accuracy - decimal 0-1
   * @param {number} avgTimeMs - tiempo promedio en milisegundos
   * @returns {number} - score compuesto 0-1
   */
  calculatePerformanceScore(accuracy, avgTimeMs) {
    const accuracyWeight = 0.6
    const speedWeight = 0.4

    // Convertir MS a segundos
    const avgTimeSeconds = avgTimeMs / 1000

    // Speed score: 1/tiempo (más rápido = mejor)
    const speedScore = 1 / avgTimeSeconds

    return (accuracy * accuracyWeight) + (speedScore * speedWeight)
  },

  /**
   * @param {import('../types/game.js').GameSession[]} sessions
   * @param {number} table
   * @returns {{ attempts: number, correct: number, avgTime: number }}
   */
  getTableStats(sessions, table) {
    let attempts = 0
    let correct = 0
    let totalTime = 0

    sessions.forEach(session => {
      session.rounds?.forEach(round => {
        if (round.table === table) {
          attempts++
          totalTime += round.timeToAnswer
          if (round.isCorrect) {
            correct++
          }
        }
      })
    })

    return {
      attempts,
      correct,
      avgTime: attempts > 0 ? Math.round(totalTime / attempts) : 0
    }
  },

  /**
   * @param {import('../types/game.js').GameSession[]} sessions
   * @returns {Object.<number, number>} - map de table -> performance score
   */
  getAllPerformanceScores(sessions) {
    const scores = {}

    for (let table = 1; table <= 10; table++) {
      const stats = this.getTableStats(sessions, table)

      if (stats.attempts === 0) {
        scores[table] = 0 // Sin práctica = prioridad máxima
      } else {
        const accuracy = stats.correct / stats.attempts
        scores[table] = this.calculatePerformanceScore(accuracy, stats.avgTime)
      }
    }

    return scores
  }
}
