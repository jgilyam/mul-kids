import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WeeklyProgressChart from './WeeklyProgressChart'

describe('WeeklyProgressChart', () => {
  it('should render chart canvas', () => {
    const data = [
      { date: '2026-04-07', sessions: 2, avgScore: 800 },
      { date: '2026-04-06', sessions: 1, avgScore: 900 }
    ]
    render(<WeeklyProgressChart data={data} />)
    const canvas = screen.getByRole('img')
    expect(canvas).toBeInTheDocument()
  })

  it('should render with empty data', () => {
    render(<WeeklyProgressChart data={[]} />)
    const canvas = screen.getByRole('img')
    expect(canvas).toBeInTheDocument()
  })

  it('should provide accessible label', () => {
    const data = [{ date: '2026-04-07', sessions: 2, avgScore: 800 }]
    render(<WeeklyProgressChart data={data} />)
    expect(screen.getByLabelText(/progreso semanal/i)).toBeInTheDocument()
  })
})
