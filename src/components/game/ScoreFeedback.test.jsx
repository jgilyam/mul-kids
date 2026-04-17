import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ScoreFeedback from './ScoreFeedback'

describe('ScoreFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when answer is correct', () => {
    it('renders success message with checkmark', () => {
      render(
        <ScoreFeedback
          isCorrect={true}
          correctAnswer={15}
          userAnswer={15}
          score={100}
          onContinue={() => {}}
        />
      )

      expect(screen.getByText(/correcto/i)).toBeInTheDocument()
    })

    it('displays the score', () => {
      render(
        <ScoreFeedback
          isCorrect={true}
          correctAnswer={20}
          userAnswer={20}
          score={80}
          onContinue={() => {}}
        />
      )

      expect(screen.getByText(/\+80/)).toBeInTheDocument()
    })

    it('has green styling', () => {
      const { container } = render(
        <ScoreFeedback
          isCorrect={true}
          correctAnswer={12}
          userAnswer={12}
          score={100}
          onContinue={() => {}}
        />
      )

      const overlay = container.querySelector('[class*="overlay"]')
      expect(overlay).toBeInTheDocument()
    })
  })

  describe('when answer is incorrect', () => {
    it('renders error message with X mark', () => {
      render(
        <ScoreFeedback
          isCorrect={false}
          correctAnswer={24}
          userAnswer={20}
          score={0}
          onContinue={() => {}}
        />
      )

      expect(screen.getByText(/incorrecto/i)).toBeInTheDocument()
    })

    it('shows the correct answer', () => {
      render(
        <ScoreFeedback
          isCorrect={false}
          correctAnswer={35}
          userAnswer={30}
          score={0}
          onContinue={() => {}}
        />
      )

      expect(screen.getByText(/la respuesta correcta es: 35/i)).toBeInTheDocument()
    })

    it('displays zero score', () => {
      render(
        <ScoreFeedback
          isCorrect={false}
          correctAnswer={18}
          userAnswer={15}
          score={0}
          onContinue={() => {}}
        />
      )

      expect(screen.getByText(/\+0/)).toBeInTheDocument()
    })
  })

  describe('auto-advance', () => {
    it('calls onContinue after 1.5 seconds', () => {
      const onContinue = vi.fn()

      render(
        <ScoreFeedback
          isCorrect={true}
          correctAnswer={12}
          userAnswer={12}
          score={100}
          onContinue={onContinue}
        />
      )

      expect(onContinue).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1500)

      expect(onContinue).toHaveBeenCalledTimes(1)
    })

    it('cleans up timer on unmount', () => {
      const onContinue = vi.fn()

      const { unmount } = render(
        <ScoreFeedback
          isCorrect={true}
          correctAnswer={12}
          userAnswer={12}
          score={100}
          onContinue={onContinue}
        />
      )

      unmount()
      vi.advanceTimersByTime(1500)

      expect(onContinue).not.toHaveBeenCalled()
    })
  })

  describe('manual advance', () => {
    it('calls onContinue when overlay is clicked', () => {
      const onContinue = vi.fn()

      const { container } = render(
        <ScoreFeedback
          isCorrect={true}
          correctAnswer={12}
          userAnswer={12}
          score={100}
          onContinue={onContinue}
        />
      )

      const overlay = container.querySelector('[class*="overlay"]')
      overlay.click()

      expect(onContinue).toHaveBeenCalledTimes(1)
    })

    it('does not auto-advance after manual click', () => {
      const onContinue = vi.fn()

      const { container } = render(
        <ScoreFeedback
          isCorrect={true}
          correctAnswer={12}
          userAnswer={12}
          score={100}
          onContinue={onContinue}
        />
      )

      const overlay = container.querySelector('[class*="overlay"]')
      overlay.click()

      expect(onContinue).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1500)

      // Still only called once
      expect(onContinue).toHaveBeenCalledTimes(1)
    })
  })
})
