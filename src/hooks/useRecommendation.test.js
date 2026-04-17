import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRecommendation } from './useRecommendation'
import { useHistoryStore } from '../store/historyStore'
import { useUserStore } from '../store/userStore'

describe('useRecommendation', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
    useUserStore.setState({ user: { id: 'test-123', name: 'Test', createdAt: Date.now() } })
  })

  it('should return random table when no sessions', () => {
    const { result } = renderHook(() => useRecommendation())
    expect(result.current.recommendedTable).toBeGreaterThanOrEqual(1)
    expect(result.current.recommendedTable).toBeLessThanOrEqual(10)
    expect(result.current.hasEnoughData).toBe(false)
  })

  it('should recommend unpracticed table first (score 0)', () => {
    const sessions = [
      {
        id: 's1',
        userId: 'test-123',
        completedAt: Date.now(),
        rounds: [
          { table: 5, isCorrect: true, timeToAnswer: 2000 },
          { table: 7, isCorrect: false, timeToAnswer: 8000 }
        ]
      }
    ]
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useRecommendation())
    // Should recommend unpracticed table (not 5 or 7)
    expect([5, 7]).not.toContain(result.current.recommendedTable)
    expect(result.current.recommendedTable).toBeGreaterThanOrEqual(1)
    expect(result.current.recommendedTable).toBeLessThanOrEqual(10)
    expect(result.current.hasEnoughData).toBe(true)
  })

  it('should recommend weakest practiced table when all tables practiced', () => {
    const sessions = Array.from({ length: 10 }, (_, i) => ({
      id: `s${i}`,
      userId: 'test-123',
      completedAt: Date.now(),
      rounds: [
        {
          table: i + 1,
          isCorrect: i === 4, // Table 5 is correct, others incorrect
          timeToAnswer: i === 4 ? 2000 : 8000
        }
      ]
    }))
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useRecommendation())
    // Table 5 should have highest score, so NOT recommended
    expect(result.current.recommendedTable).not.toBe(5)
  })

  it('should identify weakest and strongest tables', () => {
    const sessions = [
      {
        id: 's1',
        userId: 'test-123',
        completedAt: Date.now(),
        rounds: [
          { table: 3, isCorrect: true, timeToAnswer: 2000 },
          { table: 9, isCorrect: false, timeToAnswer: 8000 }
        ]
      }
    ]
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useRecommendation())
    expect(result.current.weakestTable).toBe(9)
    expect(result.current.strongestTable).toBe(3)
  })

  it('should provide performance scores for all tables', () => {
    const sessions = [
      {
        id: 's1',
        userId: 'test-123',
        completedAt: Date.now(),
        rounds: [
          { table: 5, isCorrect: true, timeToAnswer: 2000 }
        ]
      }
    ]
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useRecommendation())
    expect(result.current.performanceScores).toHaveProperty('5')
    expect(result.current.performanceScores[5]).toBeGreaterThan(0)
    expect(result.current.performanceScores).toHaveProperty('7')
    expect(result.current.performanceScores[7]).toBe(0) // Not practiced
  })

  it('should filter sessions by current user only', () => {
    const sessions = [
      {
        id: 's1',
        userId: 'test-123',
        completedAt: Date.now(),
        rounds: [{ table: 5, isCorrect: true, timeToAnswer: 2000 }]
      },
      {
        id: 's2',
        userId: 'other-user',
        completedAt: Date.now(),
        rounds: [{ table: 7, isCorrect: false, timeToAnswer: 8000 }]
      }
    ]
    useHistoryStore.setState({ sessions })

    const { result } = renderHook(() => useRecommendation())
    // Should only consider test-123's sessions
    expect(result.current.recommendedTable).not.toBe(7)
  })

  it('should handle no user gracefully', () => {
    useUserStore.setState({ user: null })

    const { result } = renderHook(() => useRecommendation())
    expect(result.current.hasEnoughData).toBe(false)
  })
})
