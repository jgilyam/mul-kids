import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TablePerformanceChart from './TablePerformanceChart'

describe('TablePerformanceChart', () => {
  it('should render chart canvas', () => {
    const data = [
      { table: 1, accuracy: 80, avgTime: 3000, attempts: 10, correct: 8 },
      { table: 2, accuracy: 60, avgTime: 4000, attempts: 10, correct: 6 }
    ]
    render(<TablePerformanceChart data={data} />)
    const canvas = screen.getByRole('img')
    expect(canvas).toBeInTheDocument()
  })

  it('should render with empty data', () => {
    render(<TablePerformanceChart data={[]} />)
    const canvas = screen.getByRole('img')
    expect(canvas).toBeInTheDocument()
  })

  it('should provide accessible label', () => {
    const data = [{ table: 5, accuracy: 75, avgTime: 3500, attempts: 10, correct: 7 }]
    render(<TablePerformanceChart data={data} />)
    expect(screen.getByLabelText(/precisión por tabla/i)).toBeInTheDocument()
  })
})
