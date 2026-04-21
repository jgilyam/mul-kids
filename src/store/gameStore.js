import { create } from 'zustand'
import { gameService } from '../services/gameService.js'
import { scoringService } from '../services/scoringService.js'
import { generateUUID } from '../utils/uuid.js'

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  rounds: [],
  questionStartTime: null,
  sessionStartTime: null,
  selectedTable: null,
  userId: null,
  phase: 'idle', // idle | playing | feedback | summary
  lastFeedback: null
}

export const useGameStore = create((set, get) => ({
  ...initialState,

  /**
   * @param {number | null} table
   * @param {string} userId
   */
  startSession: (table, userId) => {
    const questions = gameService.generateQuestions(table, 10)
    const now = Date.now()

    set({
      questions,
      selectedTable: table,
      userId,
      currentQuestionIndex: 0,
      rounds: [],
      sessionStartTime: now,
      questionStartTime: now,
      phase: 'playing',
      lastFeedback: null
    })
  },

  /**
   * @param {number | null} userAnswer
   */
  submitAnswer: (userAnswer) => {
    const state = get()

    // Guard: only accept answers during playing phase
    if (state.phase !== 'playing') return

    const question = state.questions[state.currentQuestionIndex]
    const timeToAnswer = Date.now() - state.questionStartTime
    const isCorrect = gameService.validateAnswer(userAnswer, question.correctAnswer)
    const score = scoringService.calculateScore(isCorrect, timeToAnswer)

    const round = gameService.createRound(question, userAnswer, timeToAnswer, score)

    const newRounds = [...state.rounds, round]
    const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1

    set({
      rounds: newRounds,
      phase: isLastQuestion ? 'summary' : 'feedback',
      lastFeedback: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        userAnswer,
        score,
        tier: scoringService.getScoreTier(timeToAnswer)
      }
    })
  },

  advanceQuestion: () => {
    const state = get()
    set({
      currentQuestionIndex: state.currentQuestionIndex + 1,
      questionStartTime: Date.now(),
      phase: 'playing',
      lastFeedback: null
    })
  },

  /**
   * @returns {import('../types/game.js').GameSession}
   */
  getSessionResult: () => {
    const state = get()
    const totalScore = scoringService.calculateTotalScore(state.rounds)

    return {
      id: generateUUID(),
      userId: state.userId,
      table: state.selectedTable,
      startedAt: state.sessionStartTime,
      completedAt: Date.now(),
      rounds: state.rounds,
      totalScore
    }
  },

  resetGame: () => {
    set(initialState)
  }
}))
