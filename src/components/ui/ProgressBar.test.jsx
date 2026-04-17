import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressBar from './ProgressBar'

describe('ProgressBar', () => {
  it('should render with correct aria attributes', () => {
    render(<ProgressBar current={3} total={10} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '3')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '10')
  })

  it('should calculate percentage correctly', () => {
    const { container } = render(<ProgressBar current={7} total={10} />)
    const fill = container.querySelector('[style*="width"]')
    expect(fill).toHaveStyle({ width: '70%' })
  })

  it('should show label when showLabel is true', () => {
    render(<ProgressBar current={5} total={10} showLabel />)
    expect(screen.getByText('5/10')).toBeInTheDocument()
  })

  it('should not show label when showLabel is false', () => {
    render(<ProgressBar current={5} total={10} showLabel={false} />)
    expect(screen.queryByText('5/10')).not.toBeInTheDocument()
  })

  it('should handle 0 progress', () => {
    const { container } = render(<ProgressBar current={0} total={10} />)
    const fill = container.querySelector('[style*="width"]')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  it('should handle 100% progress', () => {
    const { container } = render(<ProgressBar current={10} total={10} />)
    const fill = container.querySelector('[style*="width"]')
    expect(fill).toHaveStyle({ width: '100%' })
  })
})
