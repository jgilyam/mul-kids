import { useCallback, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { useHistoryStore } from '../store/historyStore'
import { useUserStore } from '../store/userStore'

/**
 * Bridge between components and gameStore
 * Orchestrates gameplay session lifecycle
 *
 * @returns {{
 *   phase: 'idle' | 'playing' | 'feedback' | 'summary',
 *   currentQuestion: import('../types/game').Question | null,
 *   currentIndex: number,
 *   totalQuestions: number,
 *   rounds: import('../types/game').Round[],
 *   selectedTable: number | null,
 *   lastFeedback: { isCorrect: boolean, correctAnswer: number, userAnswer: number, score: number, tier: string } | null,
 *   startGame: (table: number | null) => void,
 *   submitAnswer: (answer: number) => void,
 *   nextQuestion: () => void,
 *   getResults: () => import('../types/game').GameSession,
 *   reset: () => void
 * }}
 */
export function useGame() {
  // Use selectors for optimal re-renders
  const phase = useGameStore((state) => state.phase)
  const questions = useGameStore((state) => state.questions)
  const currentQuestionIndex = useGameStore((state) => state.currentQuestionIndex)
  const rounds = useGameStore((state) => state.rounds)
  const selectedTable = useGameStore((state) => state.selectedTable)
  const lastFeedback = useGameStore((state) => state.lastFeedback)

  const user = useUserStore((state) => state.user)
  const addSession = useHistoryStore((state) => state.addSession)

  // Store actions
  const startSession = useGameStore((state) => state.startSession)
  const submitAnswerAction = useGameStore((state) => state.submitAnswer)
  const advanceQuestion = useGameStore((state) => state.advanceQuestion)
  const getSessionResult = useGameStore((state) => state.getSessionResult)
  const resetGame = useGameStore((state) => state.resetGame)

  // Derived state
  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length
    ? questions[currentQuestionIndex]
    : null

  const totalQuestions = questions.length

  // Actions
  const startGame = useCallback((table) => {
    if (!user) {
      console.error('Cannot start game: no user')
      return
    }
    startSession(table, user.id)
  }, [startSession, user])

  const submitAnswer = useCallback((answer) => {
    submitAnswerAction(answer)
  }, [submitAnswerAction])

  const nextQuestion = useCallback(() => {
    advanceQuestion()
  }, [advanceQuestion])

  const getResults = useCallback(() => {
    return getSessionResult()
  }, [getSessionResult])

  const reset = useCallback(() => {
    resetGame()
  }, [resetGame])

  // Auto-save session when transitioning to summary phase
  useEffect(() => {
    if (phase === 'summary' && rounds.length > 0) {
      const session = getSessionResult()
      addSession(session)
    }
  }, [phase, rounds.length, getSessionResult, addSession])

  return {
    phase,
    currentQuestion,
    currentIndex: currentQuestionIndex,
    totalQuestions,
    rounds,
    selectedTable,
    lastFeedback,
    startGame,
    submitAnswer,
    nextQuestion,
    getResults,
    reset
  }
}
