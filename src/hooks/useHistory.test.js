import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useHistory } from './useHistory'
import { useHistoryStore } from '../store/historyStore'

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
  })

  it('should return empty sessions initially', () => {
    const { result } = renderHook(() => useHistory())
    expect(result.current.sessions).toEqual([])
    expect(result.current.totalSessions).toBe(0)
  })

  it('should return all sessions from store', () => {
    const mockSessions = [
      { id: 's1', userId: 'test-123', completedAt: Date.now(), totalScore: 800, rounds: [] },
      { id: 's2', userId: 'test-123', completedAt: Date.now(), totalScore: 900, rounds: [] }
    ]
    useHistoryStore.setState({ sessions: mockSessions })

    const { result } = renderHook(() => useHistory())
    expect(result.current.sessions).toEqual(mockSessions)
    expect(result.current.totalSessions).toBe(2)
  })

  it('should return today sessions filtered', () => {
    const now = Date.now()
    const yesterday = now - (24 * 60 * 60 * 1000)
    const mockSessions = [
      { id: 's1', completedAt: now, rounds: [] },
      { id: 's2', completedAt: yesterday, rounds: [] }
    ]
    useHistoryStore.setState({ sessions: mockSessions })

    const { result } = renderHook(() => useHistory())
    expect(result.current.todaySessions).toHaveLength(1)
    expect(result.current.todaySessions[0].id).toBe('s1')
  })

  it('should provide cleanup function', () => {
    const { result } = renderHook(() => useHistory())
    expect(typeof result.current.cleanup).toBe('function')
  })

  it('should not be loading by default', () => {
    const { result } = renderHook(() => useHistory())
    expect(result.current.isLoading).toBe(false)
  })
})
