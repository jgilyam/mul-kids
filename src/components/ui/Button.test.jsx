import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'
import styles from './Button.module.css'

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('should not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick} disabled>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="secondary">Test</Button>)
    expect(container.firstChild).toHaveClass(styles.secondary)
  })

  it('should apply size classes', () => {
    const { container } = render(<Button size="lg">Test</Button>)
    expect(container.firstChild).toHaveClass(styles.lg)
  })
})
