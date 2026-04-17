import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import QuestionCard from './QuestionCard'

describe('QuestionCard', () => {
  it('renders the multiplication question in large font', () => {
    render(
      <QuestionCard
        table={5}
        multiplier={3}
        questionNumber={1}
        totalQuestions={10}
      />
    )

    const question = screen.getByText('5 × 3 = ?')
    expect(question).toBeInTheDocument()
    expect(question.tagName).toBe('H1')
  })

  it('renders progress indicator', () => {
    render(
      <QuestionCard
        table={7}
        multiplier={8}
        questionNumber={4}
        totalQuestions={10}
      />
    )

    expect(screen.getByText('Pregunta 4/10')).toBeInTheDocument()
  })

  it('renders ProgressBar component', () => {
    render(
      <QuestionCard
        table={2}
        multiplier={4}
        questionNumber={3}
        totalQuestions={10}
      />
    )

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '3')
    expect(progressBar).toHaveAttribute('aria-valuemax', '10')
  })

  it('updates question when props change', () => {
    const { rerender } = render(
      <QuestionCard
        table={3}
        multiplier={6}
        questionNumber={1}
        totalQuestions={10}
      />
    )

    expect(screen.getByText('3 × 6 = ?')).toBeInTheDocument()

    rerender(
      <QuestionCard
        table={7}
        multiplier={9}
        questionNumber={2}
        totalQuestions={10}
      />
    )

    expect(screen.getByText('7 × 9 = ?')).toBeInTheDocument()
    expect(screen.getByText('Pregunta 2/10')).toBeInTheDocument()
  })

  it('works with different table and multiplier combinations', () => {
    render(
      <QuestionCard
        table={10}
        multiplier={1}
        questionNumber={10}
        totalQuestions={10}
      />
    )

    expect(screen.getByText('10 × 1 = ?')).toBeInTheDocument()
    expect(screen.getByText('Pregunta 10/10')).toBeInTheDocument()
  })
})
