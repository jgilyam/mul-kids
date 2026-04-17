import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('Card', () => {
  it('should render children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should render title when provided', () => {
    render(<Card title="Test Title">Content</Card>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should not render title element when title not provided', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector('h2')).toBeNull()
  })
})
