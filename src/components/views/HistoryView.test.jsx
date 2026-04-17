import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HistoryView from './HistoryView'
import { useHistoryStore } from '../../store/historyStore'
import { useUserStore } from '../../store/userStore'

describe('HistoryView', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
    useUserStore.setState({ user: { id: 'test-123', name: 'Test', createdAt: Date.now() } })
  })

  it('should display message when no sessions', () => {
    render(<HistoryView />)
    expect(screen.getByText(/no hay sesiones/i)).toBeInTheDocument()
  })

  it('should display sessions grouped by date', () => {
    const now = Date.now()
    const sessions = [
      { id: 's1', userId: 'test-123', completedAt: now, totalScore: 800, table: 5, rounds: [] },
      { id: 's2', userId: 'test-123', completedAt: now, totalScore: 900, table: 7, rounds: [] }
    ]
    useHistoryStore.setState({ sessions })

    render(<HistoryView />)
    expect(screen.getByText('800')).toBeInTheDocument()
    expect(screen.getByText('900')).toBeInTheDocument()
  })
})
