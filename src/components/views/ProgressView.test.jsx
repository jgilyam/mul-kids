import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressView from './ProgressView'
import { useHistoryStore } from '../../store/historyStore'
import { useUserStore } from '../../store/userStore'

describe('ProgressView', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
    useUserStore.setState({ user: { id: 'test-123', name: 'Test', createdAt: Date.now() } })
  })

  it('should render weekly stats summary', () => {
    render(<ProgressView />)
    expect(screen.getByText(/sesiones/i)).toBeInTheDocument()
    expect(screen.getByText(/promedio/i)).toBeInTheDocument()
  })

  it('should display charts when data exists', () => {
    const sessions = [
      {
        id: 's1',
        userId: 'test-123',
        completedAt: Date.now(),
        totalScore: 800,
        rounds: [{ table: 5, isCorrect: true, timeToAnswer: 2000 }]
      }
    ]
    useHistoryStore.setState({ sessions })

    render(<ProgressView />)
    // Charts are wrapped in role="img"
    const charts = screen.getAllByRole('img')
    expect(charts.length).toBeGreaterThan(0)
  })
})
