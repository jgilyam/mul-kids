import { generateUUID } from '../utils/uuid.js'

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array
 * @returns {Array}
 */
function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const gameService = {
  /**
   * BR-06: Question Generation
   * Genera N preguntas sin repetir multiplicadores
   * @param {number | null} table - tabla específica o null para modo mixto
   * @param {number} count - número de preguntas a generar
   * @returns {import('../types/game.js').Question[]}
   */
  generateQuestions(table, count) {
    const questions = []

    if (table === null) {
      // Modo mixto: generar preguntas de múltiples tablas
      const allPairs = []
      for (let t = 1; t <= 10; t++) {
        for (let m = 1; m <= 10; m++) {
          allPairs.push({ table: t, multiplier: m })
        }
      }
      const shuffled = shuffle(allPairs)

      for (let i = 0; i < count; i++) {
        const { table: t, multiplier: m } = shuffled[i]
        questions.push({
          id: generateUUID(),
          table: t,
          multiplier: m,
          correctAnswer: t * m
        })
      }
    } else {
      // Modo tabla específica: multiplicadores 1-10 shuffled
      const multipliers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

      for (let i = 0; i < count; i++) {
        const multiplier = multipliers[i]
        questions.push({
          id: generateUUID(),
          table,
          multiplier,
          correctAnswer: table * multiplier
        })
      }
    }

    return questions
  },

  /**
   * @param {number} userAnswer
   * @param {number} correctAnswer
   * @returns {boolean}
   */
  validateAnswer(userAnswer, correctAnswer) {
    return userAnswer === correctAnswer
  },

  /**
   * @param {import('../types/game.js').Question} question
   * @param {number | null} userAnswer
   * @param {number} timeToAnswer
   * @param {number} score
   * @returns {import('../types/game.js').Round}
   */
  createRound(question, userAnswer, timeToAnswer, score) {
    return {
      questionId: question.id,
      table: question.table,
      multiplier: question.multiplier,
      correctAnswer: question.correctAnswer,
      userAnswer,
      timeToAnswer,
      isCorrect: this.validateAnswer(userAnswer, question.correctAnswer),
      score
    }
  }
}
