import { describe, it, expect, beforeEach } from 'vitest'
import { useHistoryStore } from './historyStore'

describe('historyStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
  })

  it('should initialize with empty sessions', () => {
    const state = useHistoryStore.getState()
    expect(state.sessions).toHaveLength(0)
  })

  it('should add session and persist', () => {
    const session = {
      id: 'session-1',
      userId: 'maria-123',
      table: 5,
      totalScore: 800,
      completedAt: Date.now(),
      startedAt: Date.now(),
      rounds: []
    }
    useHistoryStore.getState().addSession(session)
    const state = useHistoryStore.getState()
    expect(state.sessions).toHaveLength(1)

    // Verificar persistencia
    const stored = localStorage.getItem('mat-kids-history')
    expect(stored).toBeTruthy()
  })

  it('should cleanup old sessions on add', () => {
    const now = Date.now()
    const oldSession = {
      id: 'old',
      userId: 'user-123',
      completedAt: now - (10 * 24 * 60 * 60 * 1000), // 10 días
      startedAt: now - (10 * 24 * 60 * 60 * 1000),
      rounds: []
    }
    const newSession = {
      id: 'new',
      userId: 'user-123',
      completedAt: now,
      startedAt: now,
      rounds: []
    }

    useHistoryStore.setState({ sessions: [oldSession] })
    useHistoryStore.getState().addSession(newSession)
    const state = useHistoryStore.getState()
    expect(state.sessions).toHaveLength(1)
    expect(state.sessions[0].id).toBe('new')
  })

  it('should calculate weekly progress', () => {
    const now = Date.now()
    const sessions = [
      { userId: 'user-123', completedAt: now, totalScore: 800, rounds: [] },
      { userId: 'user-123', completedAt: now, totalScore: 900, rounds: [] }
    ]
    useHistoryStore.setState({ sessions })
    const progress = useHistoryStore.getState().getWeeklyProgress('user-123')
    expect(progress.totalSessions).toBe(2)
    expect(progress.avgScore).toBe(850)
  })

  it('should get table breakdown', () => {
    const sessions = [{
      userId: 'user-123',
      rounds: [
        { table: 5, isCorrect: true, timeToAnswer: 2000 },
        { table: 5, isCorrect: false, timeToAnswer: 4000 }
      ]
    }]
    useHistoryStore.setState({ sessions })
    const breakdown = useHistoryStore.getState().getTableBreakdown('user-123')
    expect(breakdown).toHaveLength(10)
    const table5 = breakdown.find(b => b.table === 5)
    expect(table5.attempts).toBe(2)
    expect(table5.correct).toBe(1)
  })
})
