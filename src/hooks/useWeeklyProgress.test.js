import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useWeeklyProgress } from './useWeeklyProgress'
import { useHistoryStore } from '../store/historyStore'
import { useUserStore } from '../store/userStore'

describe('useWeeklyProgress', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
    useUserStore.setState({ user: { id: 'test-123', name: 'Test', createdAt: Date.now() } })
  })

  it('should return zero stats when no sessions', () => {
    const { result } = renderHook(() => useWeeklyProgress())
    expect(result.current.totalSessions).toBe(0)
    expect(result.current.avgScore).toBe(0)
    expect(result.current.activeDays).toBe(0)
    expect(result.current.totalDays).toBe(7)
  })

  it('should calculate total sessions for user', () => {
    const now = Date.now()
    const sessions = [
      { id: 's1', userId: 'test-123', completedAt: now, totalScore: 800, rounds: [] },
      { id: 's2', userId: 'test-123', completedAt: now, totalScore: 900, rounds: [] },
      { id: 's3', userId: 'other-user', completedAt: now, totalScore: 700, rounds: [] }
    ]
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useWeeklyProgress())
    expect(result.current.totalSessions).toBe(2) // Only user's sessions
    expect(result.current.avgScore).toBe(850)
  })

  it('should calculate active days correctly', () => {
    const now = Date.now()
    const yesterday = now - (24 * 60 * 60 * 1000)
    const sessions = [
      { id: 's1', userId: 'test-123', completedAt: now, totalScore: 800, rounds: [] },
      { id: 's2', userId: 'test-123', completedAt: now, totalScore: 900, rounds: [] },
      { id: 's3', userId: 'test-123', completedAt: yesterday, totalScore: 700, rounds: [] }
    ]
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useWeeklyProgress())
    expect(result.current.activeDays).toBe(2) // 2 unique days
  })

  it('should provide daily breakdown for last 7 days', () => {
    const now = Date.now()
    const sessions = [
      { id: 's1', userId: 'test-123', completedAt: now, totalScore: 800, rounds: [] }
    ]
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useWeeklyProgress())
    expect(result.current.dailyBreakdown).toHaveLength(7)
    expect(result.current.dailyBreakdown[0]).toHaveProperty('date')
    expect(result.current.dailyBreakdown[0]).toHaveProperty('sessions')
    expect(result.current.dailyBreakdown[0]).toHaveProperty('avgScore')
  })

  it('should provide table breakdown for all 10 tables', () => {
    const sessions = [
      {
        id: 's1',
        userId: 'test-123',
        completedAt: Date.now(),
        rounds: [
          { table: 5, isCorrect: true, timeToAnswer: 2000 },
          { table: 5, isCorrect: false, timeToAnswer: 3000 }
        ]
      }
    ]
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useWeeklyProgress())
    expect(result.current.tableBreakdown).toHaveLength(10)

    const table5 = result.current.tableBreakdown.find(t => t.table === 5)
    expect(table5.attempts).toBe(2)
    expect(table5.correct).toBe(1)
    expect(table5.accuracy).toBe(50)
    expect(table5.avgTime).toBe(2500)
  })

  it('should handle no user gracefully', () => {
    useUserStore.setState({ user: null })

    const { result } = renderHook(() => useWeeklyProgress())
    expect(result.current.totalSessions).toBe(0)
  })
})
