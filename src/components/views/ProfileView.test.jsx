import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileView from './ProfileView'
import { useUserStore } from '../../store/userStore'
import { useHistoryStore } from '../../store/historyStore'

describe('ProfileView', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ sessions: [] })
    useUserStore.setState({ user: { id: 'test-123', name: 'María', createdAt: Date.now() } })
  })

  it('should display user name', () => {
    render(<ProfileView />)
    expect(screen.getByText(/maría/i)).toBeInTheDocument()
  })

  it('should display recommendation when data exists', () => {
    const sessions = [
      {
        id: 's1',
        userId: 'test-123',
        completedAt: Date.now(),
        rounds: [{ table: 5, isCorrect: false, timeToAnswer: 8000 }]
      }
    ]
    useHistoryStore.setState({ sessions })

    render(<ProfileView />)
    expect(screen.getByText(/tabla recomendada/i)).toBeInTheDocument()
  })

  it('should handle no user gracefully', () => {
    useUserStore.setState({ user: null })
    render(<ProfileView />)
    expect(screen.queryByText(/maría/i)).not.toBeInTheDocument()
  })

  it('should show change name button', () => {
    render(<ProfileView />)
    expect(screen.getByRole('button', { name: /cambiar nombre/i })).toBeInTheDocument()
  })

  it('should call clearUser when change name button clicked', async () => {
    const user = userEvent.setup()
    const clearUser = vi.fn()
    useUserStore.setState({ clearUser })

    render(<ProfileView />)
    await user.click(screen.getByRole('button', { name: /cambiar nombre/i }))

    expect(clearUser).toHaveBeenCalled()
  })
})
