import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge'
import styles from './Badge.module.css'

describe('Badge', () => {
  it('should render children', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    const { container, rerender } = render(<Badge variant="success">Success</Badge>)
    expect(container.firstChild).toHaveClass(styles.success)

    rerender(<Badge variant="warning">Warning</Badge>)
    expect(container.firstChild).toHaveClass(styles.warning)

    rerender(<Badge variant="info">Info</Badge>)
    expect(container.firstChild).toHaveClass(styles.info)

    rerender(<Badge variant="error">Error</Badge>)
    expect(container.firstChild).toHaveClass(styles.error)
  })

  it('should default to info variant', () => {
    const { container } = render(<Badge>Default</Badge>)
    expect(container.firstChild).toHaveClass(styles.info)
  })
})
