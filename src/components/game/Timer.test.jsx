import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { createRef } from 'react'
import Timer from './Timer'

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should display 0.0s initially when not running', () => {
    render(<Timer isRunning={false} />)
    expect(screen.getByText('0.0s')).toBeInTheDocument()
  })

  it('should start counting when isRunning is true', () => {
    const { rerender } = render(<Timer isRunning={false} />)

    act(() => {
      rerender(<Timer isRunning={true} />)
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('1.0s')).toBeInTheDocument()
  })

  it('should display time with 1 decimal', () => {
    render(<Timer isRunning={true} />)

    act(() => {
      vi.advanceTimersByTime(2345)
    })

    expect(screen.getByText('2.3s')).toBeInTheDocument()
  })

  it('should stop counting when isRunning becomes false', () => {
    const { rerender } = render(<Timer isRunning={true} />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByText('2.0s')).toBeInTheDocument()

    act(() => {
      rerender(<Timer isRunning={false} />)
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    // Should still show 2.0s, not 3.0s
    expect(screen.getByText('2.0s')).toBeInTheDocument()
  })

  it('should apply green color for 0-2s', () => {
    const { container } = render(<Timer isRunning={true} />)

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    const timer = container.querySelector('[class*="timer"]')
    expect(timer.className).toContain('green')
  })

  it('should apply yellow color for 2-5s', () => {
    const { container } = render(<Timer isRunning={true} />)

    act(() => {
      vi.advanceTimersByTime(3500)
    })

    const timer = container.querySelector('[class*="timer"]')
    expect(timer.className).toContain('yellow')
  })

  it('should apply red color for >5s', () => {
    const { container } = render(<Timer isRunning={true} />)

    act(() => {
      vi.advanceTimersByTime(6000)
    })

    const timer = container.querySelector('[class*="timer"]')
    expect(timer.className).toContain('red')
  })

  it('should expose getElapsed method via ref', () => {
    const ref = createRef()
    render(<Timer ref={ref} isRunning={true} />)

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    const elapsed = ref.current.getElapsed()
    expect(elapsed).toBeGreaterThanOrEqual(2400)
    expect(elapsed).toBeLessThanOrEqual(2600)
  })

  it('should expose reset method via ref', () => {
    const ref = createRef()
    const { rerender } = render(<Timer ref={ref} isRunning={true} />)

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByText('3.0s')).toBeInTheDocument()

    act(() => {
      ref.current.reset()
    })

    // Timer should be back at 0
    expect(screen.getByText('0.0s')).toBeInTheDocument()
  })

  it('should have aria-live="polite"', () => {
    const { container } = render(<Timer isRunning={true} />)
    const timer = container.querySelector('[aria-live="polite"]')
    expect(timer).toBeInTheDocument()
  })

  it('should have accessible label', () => {
    const { container } = render(<Timer isRunning={true} />)
    const timer = container.querySelector('[aria-label]')
    expect(timer).toBeInTheDocument()
    expect(timer.getAttribute('aria-label').toLowerCase()).toContain('tiempo')
  })

  it('should cleanup interval on unmount', () => {
    const { unmount } = render(<Timer isRunning={true} />)

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
