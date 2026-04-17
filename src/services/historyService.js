import { formatDate, isWithinLastNDays } from '../utils/dateHelpers.js'

export const historyService = {
  /**
   * BR-04: History Retention
   * Limpia sesiones mayores a 7 días y sesiones abandonadas
   * @param {import('../types/game.js').GameSession[]} sessions
   * @returns {import('../types/game.js').GameSession[]}
   */
  cleanupOldSessions(sessions) {
    return sessions.filter(session => {
      // Remover sesiones abandonadas (sin completedAt)
      if (session.completedAt === null) return false

      // Remover sesiones mayores a 7 días
      return isWithinLastNDays(session.completedAt, 7)
    })
  },

  /**
   * BR-05: Weekly Progress
   * Calcula métricas de progreso semanal
   * @param {import('../types/game.js').GameSession[]} sessions
   * @returns {import('../types/history.js').WeeklyProgress}
   */
  calculateWeeklyProgress(sessions) {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        avgScore: 0,
        activeDays: 0,
        totalDays: 7
      }
    }

    const totalSessions = sessions.length
    const totalScore = sessions.reduce((sum, s) => sum + s.totalScore, 0)
    const avgScore = Math.round(totalScore / totalSessions)

    // Calcular días únicos
    const uniqueDates = new Set(
      sessions.map(s => formatDate(s.completedAt))
    )
    const activeDays = uniqueDates.size

    return {
      totalSessions,
      avgScore,
      activeDays,
      totalDays: 7
    }
  },

  /**
   * @param {import('../types/game.js').GameSession[]} sessions
   * @returns {Map<string, import('../types/game.js').GameSession[]>}
   */
  groupSessionsByDate(sessions) {
    const grouped = new Map()

    sessions.forEach(session => {
      const date = formatDate(session.completedAt)
      if (!grouped.has(date)) {
        grouped.set(date, [])
      }
      grouped.get(date).push(session)
    })

    return grouped
  },

  /**
   * @param {import('../types/game.js').GameSession[]} sessions
   * @returns {Array<{ table: number, attempts: number, correct: number, accuracy: number, avgTime: number }>}
   */
  calculateTableBreakdown(sessions) {
    // Inicializar stats para tablas 1-10
    const stats = {}
    for (let table = 1; table <= 10; table++) {
      stats[table] = {
        attempts: 0,
        totalTime: 0,
        correct: 0
      }
    }

    // Agregar datos de rounds
    sessions.forEach(session => {
      session.rounds?.forEach(round => {
        const tableStat = stats[round.table]
        if (tableStat) {
          tableStat.attempts++
          tableStat.totalTime += round.timeToAnswer
          if (round.isCorrect) {
            tableStat.correct++
          }
        }
      })
    })

    // Convertir a array con accuracy y avgTime calculados
    return Object.entries(stats).map(([table, stat]) => ({
      table: parseInt(table),
      attempts: stat.attempts,
      correct: stat.correct,
      accuracy: stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : 0,
      avgTime: stat.attempts > 0 ? Math.round(stat.totalTime / stat.attempts) : 0
    }))
  }
}
