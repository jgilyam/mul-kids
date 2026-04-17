import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame } from './useGame'
import { useGameStore } from '../store/gameStore'
import { useHistoryStore } from '../store/historyStore'
import { useUserStore } from '../store/userStore'

describe('useGame', () => {
  beforeEach(() => {
    // Reset all stores
    useGameStore.setState({
      questions: [],
      currentQuestionIndex: 0,
      rounds: [],
      questionStartTime: null,
      sessionStartTime: null,
      selectedTable: null,
      userId: null,
      phase: 'idle',
      lastFeedback: null
    })
    useHistoryStore.setState({ sessions: [] })
    useUserStore.setState({
      user: { id: 'test-user-123', name: 'Test User', createdAt: Date.now() },
      isRegistered: true
    })
  })

  it('should expose phase from gameStore', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.phase).toBe('idle')
  })

  it('should expose current question', () => {
    useGameStore.setState({
      questions: [
        { id: 'q1', table: 5, multiplier: 3, correctAnswer: 15 }
      ],
      currentQuestionIndex: 0
    })
    const { result } = renderHook(() => useGame())
    expect(result.current.currentQuestion).toEqual({
      id: 'q1',
      table: 5,
      multiplier: 3,
      correctAnswer: 15
    })
  })

  it('should return null for currentQuestion when no questions', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.currentQuestion).toBeNull()
  })

  it('should expose currentIndex', () => {
    useGameStore.setState({ currentQuestionIndex: 3 })
    const { result } = renderHook(() => useGame())
    expect(result.current.currentIndex).toBe(3)
  })

  it('should expose totalQuestions', () => {
    useGameStore.setState({
      questions: new Array(10).fill(null).map((_, i) => ({
        id: `q${i}`,
        table: 5,
        multiplier: i + 1,
        correctAnswer: 5 * (i + 1)
      }))
    })
    const { result } = renderHook(() => useGame())
    expect(result.current.totalQuestions).toBe(10)
  })

  it('should expose rounds', () => {
    const rounds = [
      {
        questionId: 'q1',
        table: 5,
        multiplier: 3,
        correctAnswer: 15,
        userAnswer: 15,
        timeToAnswer: 2000,
        isCorrect: true,
        score: 100
      }
    ]
    useGameStore.setState({ rounds })
    const { result } = renderHook(() => useGame())
    expect(result.current.rounds).toEqual(rounds)
  })

  it('should expose selectedTable', () => {
    useGameStore.setState({ selectedTable: 7 })
    const { result } = renderHook(() => useGame())
    expect(result.current.selectedTable).toBe(7)
  })

  it('should expose lastFeedback', () => {
    const feedback = {
      isCorrect: true,
      correctAnswer: 56,
      userAnswer: 56,
      score: 100,
      tier: 'perfect'
    }
    useGameStore.setState({ lastFeedback: feedback })
    const { result } = renderHook(() => useGame())
    expect(result.current.lastFeedback).toEqual(feedback)
  })

  it('should start game with table', () => {
    const { result } = renderHook(() => useGame())
    act(() => {
      result.current.startGame(7)
    })
    const state = useGameStore.getState()
    expect(state.phase).toBe('playing')
    expect(state.selectedTable).toBe(7)
    expect(state.questions).toHaveLength(10)
    expect(state.userId).toBe('test-user-123')
  })

  it('should start game with mixed mode (null)', () => {
    const { result } = renderHook(() => useGame())
    act(() => {
      result.current.startGame(null)
    })
    const state = useGameStore.getState()
    expect(state.phase).toBe('playing')
    expect(state.selectedTable).toBeNull()
    expect(state.questions).toHaveLength(10)
  })

  it('should submit answer', () => {
    // Use multiple questions so we don't transition to summary
    useGameStore.setState({
      questions: [
        { id: 'q1', table: 5, multiplier: 3, correctAnswer: 15 },
        { id: 'q2', table: 5, multiplier: 4, correctAnswer: 20 }
      ],
      currentQuestionIndex: 0,
      questionStartTime: Date.now() - 2000,
      userId: 'test-user-123',
      phase: 'playing'
    })

    const { result } = renderHook(() => useGame())
    act(() => {
      result.current.submitAnswer(15)
    })

    const state = useGameStore.getState()
    expect(state.phase).toBe('feedback')
    expect(state.rounds).toHaveLength(1)
    expect(state.rounds[0].userAnswer).toBe(15)
    expect(state.rounds[0].isCorrect).toBe(true)
  })

  it('should advance to next question', () => {
    useGameStore.setState({
      currentQuestionIndex: 0,
      phase: 'feedback'
    })

    const { result } = renderHook(() => useGame())
    act(() => {
      result.current.nextQuestion()
    })

    const state = useGameStore.getState()
    expect(state.currentQuestionIndex).toBe(1)
    expect(state.phase).toBe('playing')
  })

  it('should get session results', () => {
    const rounds = [
      {
        questionId: 'q1',
        table: 5,
        multiplier: 3,
        correctAnswer: 15,
        userAnswer: 15,
        timeToAnswer: 2000,
        isCorrect: true,
        score: 100
      }
    ]
    useGameStore.setState({
      rounds,
      selectedTable: 5,
      userId: 'test-user-123',
      sessionStartTime: Date.now() - 60000
    })

    const { result } = renderHook(() => useGame())
    const session = result.current.getResults()

    expect(session).toHaveProperty('id')
    expect(session.userId).toBe('test-user-123')
    expect(session.table).toBe(5)
    expect(session.rounds).toEqual(rounds)
    expect(session.totalScore).toBe(100)
  })

  it('should save session to history when phase transitions to summary', () => {
    const rounds = new Array(9).fill(null).map((_, i) => ({
      questionId: `q${i}`,
      table: 5,
      multiplier: i + 1,
      correctAnswer: 5 * (i + 1),
      userAnswer: 5 * (i + 1),
      timeToAnswer: 2000,
      isCorrect: true,
      score: 100
    }))

    const questions = new Array(10).fill(null).map((_, i) => ({
      id: `q${i}`,
      table: 5,
      multiplier: i + 1,
      correctAnswer: 5 * (i + 1)
    }))

    useGameStore.setState({
      questions,
      currentQuestionIndex: 9,
      rounds,
      selectedTable: 5,
      userId: 'test-user-123',
      sessionStartTime: Date.now() - 120000,
      questionStartTime: Date.now() - 2000,
      phase: 'playing'
    })

    const { result } = renderHook(() => useGame())

    // Submit last answer - should transition to summary and save
    act(() => {
      result.current.submitAnswer(50)
    })

    const gameState = useGameStore.getState()
    expect(gameState.phase).toBe('summary')

    const historyState = useHistoryStore.getState()
    expect(historyState.sessions).toHaveLength(1)
    expect(historyState.sessions[0].rounds).toHaveLength(10)
  })

  it('should reset game', () => {
    useGameStore.setState({
      questions: [{ id: 'q1', table: 5, multiplier: 3, correctAnswer: 15 }],
      currentQuestionIndex: 5,
      rounds: [{ questionId: 'q1' }],
      phase: 'playing'
    })

    const { result } = renderHook(() => useGame())
    act(() => {
      result.current.reset()
    })

    const state = useGameStore.getState()
    expect(state.phase).toBe('idle')
    expect(state.questions).toHaveLength(0)
    expect(state.rounds).toHaveLength(0)
  })
})
