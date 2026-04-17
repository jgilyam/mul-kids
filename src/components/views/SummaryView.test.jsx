import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SummaryView from './SummaryView'

describe('SummaryView', () => {
  const mockSession = {
    id: 'test-123',
    userId: 'user-1',
    table: 5,
    startedAt: Date.now() - 60000,
    completedAt: Date.now(),
    totalScore: 750,
    rounds: [
      { table: 5, multiplier: 1, correctAnswer: 5, userAnswer: 5, isCorrect: true, timeToAnswer: 2000, score: 100 },
      { table: 5, multiplier: 2, correctAnswer: 10, userAnswer: 10, isCorrect: true, timeToAnswer: 1800, score: 100 },
      { table: 5, multiplier: 3, correctAnswer: 15, userAnswer: 15, isCorrect: true, timeToAnswer: 2200, score: 80 },
      { table: 5, multiplier: 4, correctAnswer: 20, userAnswer: 20, isCorrect: true, timeToAnswer: 3000, score: 80 },
      { table: 5, multiplier: 5, correctAnswer: 25, userAnswer: 25, isCorrect: true, timeToAnswer: 4000, score: 80 },
      { table: 5, multiplier: 6, correctAnswer: 30, userAnswer: 20, isCorrect: false, timeToAnswer: 5000, score: 0 },
      { table: 5, multiplier: 7, correctAnswer: 35, userAnswer: 35, isCorrect: true, timeToAnswer: 4500, score: 80 },
      { table: 5, multiplier: 8, correctAnswer: 40, userAnswer: 40, isCorrect: true, timeToAnswer: 5500, score: 60 },
      { table: 5, multiplier: 9, correctAnswer: 45, userAnswer: 45, isCorrect: true, timeToAnswer: 6000, score: 60 },
      { table: 5, multiplier: 10, correctAnswer: 50, userAnswer: 50, isCorrect: true, timeToAnswer: 7000, score: 60 }
    ]
  }

  it('renders total score', () => {
    render(
      <SummaryView
        session={mockSession}
        onPlayAgain={() => {}}
        onViewProgress={() => {}}
      />
    )

    expect(screen.getByText(/750/)).toBeInTheDocument()
    expect(screen.getByText(/1000/)).toBeInTheDocument()
  })

  it('renders accuracy percentage', () => {
    render(
      <SummaryView
        session={mockSession}
        onPlayAgain={() => {}}
        onViewProgress={() => {}}
      />
    )

    // 9 out of 10 correct = 90%
    expect(screen.getByText(/90%/)).toBeInTheDocument()
  })

  it('renders average response time', () => {
    render(
      <SummaryView
        session={mockSession}
        onPlayAgain={() => {}}
        onViewProgress={() => {}}
      />
    )

    // Average is around 4.1 seconds
    expect(screen.getByText(/4\.1/)).toBeInTheDocument()
  })

  it('renders "Jugar de Nuevo" button', () => {
    render(
      <SummaryView
        session={mockSession}
        onPlayAgain={() => {}}
        onViewProgress={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /jugar de nuevo/i })).toBeInTheDocument()
  })

  it('renders "Ver Progreso" button', () => {
    render(
      <SummaryView
        session={mockSession}
        onPlayAgain={() => {}}
        onViewProgress={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /ver progreso/i })).toBeInTheDocument()
  })

  it('calls onPlayAgain when play again button is clicked', async () => {
    const user = userEvent.setup()
    const onPlayAgain = vi.fn()

    render(
      <SummaryView
        session={mockSession}
        onPlayAgain={onPlayAgain}
        onViewProgress={() => {}}
      />
    )

    const button = screen.getByRole('button', { name: /jugar de nuevo/i })
    await user.click(button)

    expect(onPlayAgain).toHaveBeenCalledTimes(1)
  })

  it('calls onViewProgress when view progress button is clicked', async () => {
    const user = userEvent.setup()
    const onViewProgress = vi.fn()

    render(
      <SummaryView
        session={mockSession}
        onPlayAgain={() => {}}
        onViewProgress={onViewProgress}
      />
    )

    const button = screen.getByRole('button', { name: /ver progreso/i })
    await user.click(button)

    expect(onViewProgress).toHaveBeenCalledTimes(1)
  })

  describe('celebrations', () => {
    it('shows celebration message when score >= 800', () => {
      const highScoreSession = {
        ...mockSession,
        totalScore: 850,
        rounds: mockSession.rounds.map(r => ({ ...r, score: 85 }))
      }

      render(
        <SummaryView
          session={highScoreSession}
          onPlayAgain={() => {}}
          onViewProgress={() => {}}
        />
      )

      expect(screen.getByText(/excelente/i)).toBeInTheDocument()
    })

    it('shows "Muy rapido!" badge when avgTime < 3000ms', () => {
      const fastSession = {
        ...mockSession,
        rounds: mockSession.rounds.map(r => ({ ...r, timeToAnswer: 2000 }))
      }

      render(
        <SummaryView
          session={fastSession}
          onPlayAgain={() => {}}
          onViewProgress={() => {}}
        />
      )

      expect(screen.getByText(/muy rápido/i)).toBeInTheDocument()
    })

    it('shows "Perfecto!" badge when 10/10 correct', () => {
      const perfectSession = {
        ...mockSession,
        rounds: mockSession.rounds.map(r => ({ ...r, isCorrect: true }))
      }

      render(
        <SummaryView
          session={perfectSession}
          onPlayAgain={() => {}}
          onViewProgress={() => {}}
        />
      )

      expect(screen.getByText(/perfecto/i)).toBeInTheDocument()
    })

    it('does not show celebration when score < 800', () => {
      const lowScoreSession = {
        ...mockSession,
        totalScore: 500
      }

      render(
        <SummaryView
          session={lowScoreSession}
          onPlayAgain={() => {}}
          onViewProgress={() => {}}
        />
      )

      expect(screen.queryByText(/excelente/i)).not.toBeInTheDocument()
    })
  })

  it('shows table name when session has a specific table', () => {
    render(
      <SummaryView
        session={mockSession}
        onPlayAgain={() => {}}
        onViewProgress={() => {}}
      />
    )

    expect(screen.getByText(/tabla del 5/i)).toBeInTheDocument()
  })

  it('shows "Modo Mixto" when session has null table', () => {
    const mixedSession = {
      ...mockSession,
      table: null
    }

    render(
      <SummaryView
        session={mixedSession}
        onPlayAgain={() => {}}
        onViewProgress={() => {}}
      />
    )

    expect(screen.getByText(/modo mixto/i)).toBeInTheDocument()
  })
})
