import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame()
  })

  it('should initialize in idle phase', () => {
    const state = useGameStore.getState()
    expect(state.phase).toBe('idle')
    expect(state.questions).toHaveLength(0)
  })

  it('should start session with generated questions', () => {
    useGameStore.getState().startSession(7, 'user-123')
    const state = useGameStore.getState()
    expect(state.phase).toBe('playing')
    expect(state.questions).toHaveLength(10)
    expect(state.selectedTable).toBe(7)
    expect(state.userId).toBe('user-123')
    expect(state.currentQuestionIndex).toBe(0)
    expect(state.questionStartTime).not.toBeNull()
  })

  it('should submit answer and create round', () => {
    useGameStore.getState().startSession(5, 'user-123')
    const question = useGameStore.getState().questions[0]
    useGameStore.getState().submitAnswer(question.correctAnswer)
    const state = useGameStore.getState()
    expect(state.phase).toBe('feedback')
    expect(state.rounds).toHaveLength(1)
    expect(state.lastFeedback).not.toBeNull()
    expect(state.lastFeedback.isCorrect).toBe(true)
  })

  it('should advance to next question after feedback', () => {
    useGameStore.getState().startSession(5, 'user-123')
    const question = useGameStore.getState().questions[0]
    useGameStore.getState().submitAnswer(question.correctAnswer)
    useGameStore.getState().advanceQuestion()
    const state = useGameStore.getState()
    expect(state.phase).toBe('playing')
    expect(state.currentQuestionIndex).toBe(1)
    expect(state.lastFeedback).toBeNull()
  })

  it('should transition to summary after 10 questions', () => {
    useGameStore.getState().startSession(5, 'user-123')
    // Responder 10 preguntas
    for (let i = 0; i < 10; i++) {
      const state = useGameStore.getState()
      const question = state.questions[i]
      useGameStore.getState().submitAnswer(question.correctAnswer)
      if (i < 9) {
        useGameStore.getState().advanceQuestion()
      }
    }
    const state = useGameStore.getState()
    expect(state.phase).toBe('summary')
    expect(state.rounds).toHaveLength(10)
  })

  it('should compile session result', () => {
    useGameStore.getState().startSession(7, 'user-123')
    // Responder todas correctamente
    for (let i = 0; i < 10; i++) {
      const state = useGameStore.getState()
      const question = state.questions[i]
      useGameStore.getState().submitAnswer(question.correctAnswer)
      if (i < 9) useGameStore.getState().advanceQuestion()
    }
    const session = useGameStore.getState().getSessionResult()
    expect(session.rounds).toHaveLength(10)
    expect(session.table).toBe(7)
    expect(session.userId).toBe('user-123')
    expect(session.totalScore).toBeGreaterThan(0)
    expect(session.completedAt).not.toBeNull()
  })

  it('should reset game to idle', () => {
    useGameStore.getState().startSession(5, 'user-123')
    useGameStore.getState().resetGame()
    const state = useGameStore.getState()
    expect(state.phase).toBe('idle')
    expect(state.questions).toHaveLength(0)
  })
})
