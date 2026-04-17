import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GameView from './GameView'
import { useGameStore } from '../../store/gameStore'
import { useUserStore } from '../../store/userStore'

describe('GameView', () => {
  beforeEach(() => {
    // Reset stores
    useGameStore.setState({
      phase: 'idle',
      questions: [],
      currentQuestionIndex: 0,
      rounds: [],
      selectedTable: null,
      lastFeedback: null,
      questionStartTime: null,
      sessionStartTime: null,
      userId: null
    })

    useUserStore.setState({
      user: {
        id: 'test-user-123',
        name: 'Test User',
        avatarUrl: null,
        createdAt: Date.now()
      }
    })
  })

  describe('idle phase', () => {
    it('renders TableSelector when phase is idle', () => {
      render(<GameView />)

      expect(screen.getByText('Selecciona una Tabla')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /modo mixto/i })).toBeInTheDocument()
    })

    it('starts game when table is selected', async () => {
      const user = userEvent.setup()
      render(<GameView />)

      const table5Button = screen.getByRole('button', { name: /tabla del 5/i })
      await user.click(table5Button)

      // Should transition to playing phase
      const state = useGameStore.getState()
      expect(state.phase).toBe('playing')
      expect(state.selectedTable).toBe(5)
    })
  })

  describe('playing phase', () => {
    beforeEach(() => {
      // Set up playing state
      useGameStore.setState({
        phase: 'playing',
        questions: [
          { table: 5, multiplier: 3, correctAnswer: 15 },
          { table: 5, multiplier: 7, correctAnswer: 35 }
        ],
        currentQuestionIndex: 0,
        rounds: [],
        selectedTable: 5,
        questionStartTime: Date.now(),
        sessionStartTime: Date.now(),
        userId: 'test-user-123'
      })
    })

    it('renders QuestionCard with current question', () => {
      render(<GameView />)

      expect(screen.getByText('5 × 3 = ?')).toBeInTheDocument()
      expect(screen.getByText('Pregunta 1/2')).toBeInTheDocument()
    })

    it('renders AnswerInput', () => {
      render(<GameView />)

      expect(screen.getByRole('spinbutton')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /responder/i })).toBeInTheDocument()
    })

    it('renders Timer', () => {
      render(<GameView />)

      // Timer component should be rendered (check for progressbar which is part of it)
      const progressBars = screen.getAllByRole('progressbar')
      expect(progressBars.length).toBeGreaterThan(0)
    })

    it('submits answer when user provides input', async () => {
      const user = userEvent.setup()
      render(<GameView />)

      const input = screen.getByRole('spinbutton')
      const button = screen.getByRole('button', { name: /responder/i })

      await user.type(input, '15')
      await user.click(button)

      // Should transition to feedback phase
      const state = useGameStore.getState()
      expect(state.phase).toBe('feedback')
      expect(state.rounds).toHaveLength(1)
    })
  })

  describe('feedback phase', () => {
    beforeEach(() => {
      // Set up feedback state (correct answer)
      useGameStore.setState({
        phase: 'feedback',
        questions: [
          { table: 5, multiplier: 3, correctAnswer: 15 },
          { table: 5, multiplier: 7, correctAnswer: 35 }
        ],
        currentQuestionIndex: 0,
        rounds: [
          {
            table: 5,
            multiplier: 3,
            correctAnswer: 15,
            userAnswer: 15,
            isCorrect: true,
            timeToAnswer: 2000,
            score: 100
          }
        ],
        selectedTable: 5,
        lastFeedback: {
          isCorrect: true,
          correctAnswer: 15,
          userAnswer: 15,
          score: 100,
          tier: 'perfect'
        },
        questionStartTime: Date.now(),
        sessionStartTime: Date.now(),
        userId: 'test-user-123'
      })
    })

    it('renders ScoreFeedback overlay', () => {
      render(<GameView />)

      expect(screen.getByText(/correcto/i)).toBeInTheDocument()
      expect(screen.getByText(/\+100/)).toBeInTheDocument()
    })

    it('advances to next question when continuing', () => {
      render(<GameView />)

      // Find and click the feedback overlay
      const overlay = document.querySelector('[class*="overlay"]')
      overlay.click()

      // Should advance to next question
      const state = useGameStore.getState()
      expect(state.phase).toBe('playing')
      expect(state.currentQuestionIndex).toBe(1)
    })
  })

  describe('summary phase', () => {
    beforeEach(() => {
      // Set up summary state (game completed)
      const rounds = Array.from({ length: 10 }, (_, i) => ({
        table: 5,
        multiplier: i + 1,
        correctAnswer: 5 * (i + 1),
        userAnswer: 5 * (i + 1),
        isCorrect: true,
        timeToAnswer: 2000 + i * 100,
        score: 100 - i * 5
      }))

      useGameStore.setState({
        phase: 'summary',
        questions: Array.from({ length: 10 }, (_, i) => ({
          table: 5,
          multiplier: i + 1,
          correctAnswer: 5 * (i + 1)
        })),
        currentQuestionIndex: 10,
        rounds,
        selectedTable: 5,
        lastFeedback: null,
        questionStartTime: Date.now(),
        sessionStartTime: Date.now() - 60000,
        userId: 'test-user-123'
      })
    })

    it('renders SummaryView', () => {
      render(<GameView />)

      expect(screen.getByText(/juego terminado/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /jugar de nuevo/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ver progreso/i })).toBeInTheDocument()
    })

    it('resets game when play again is clicked', async () => {
      const user = userEvent.setup()
      render(<GameView />)

      const button = screen.getByRole('button', { name: /jugar de nuevo/i })
      await user.click(button)

      // Should reset to idle phase
      const state = useGameStore.getState()
      expect(state.phase).toBe('idle')
      expect(state.rounds).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('handles no user gracefully', () => {
      useUserStore.setState({ user: null })

      render(<GameView />)

      // Should still render TableSelector
      expect(screen.getByText('Selecciona una Tabla')).toBeInTheDocument()
    })

    it('handles incorrect answer in feedback phase', () => {
      useGameStore.setState({
        phase: 'feedback',
        questions: [{ table: 5, multiplier: 3, correctAnswer: 15 }],
        currentQuestionIndex: 0,
        rounds: [
          {
            table: 5,
            multiplier: 3,
            correctAnswer: 15,
            userAnswer: 20,
            isCorrect: false,
            timeToAnswer: 5000,
            score: 0
          }
        ],
        selectedTable: 5,
        lastFeedback: {
          isCorrect: false,
          correctAnswer: 15,
          userAnswer: 20,
          score: 0,
          tier: 'slow'
        }
      })

      render(<GameView />)

      expect(screen.getByText(/incorrecto/i)).toBeInTheDocument()
      expect(screen.getByText(/la respuesta correcta es: 15/i)).toBeInTheDocument()
    })
  })
})
