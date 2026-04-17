import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import AnswerInput from './AnswerInput'

describe('AnswerInput', () => {
  it('renders a numeric input', () => {
    render(<AnswerInput onSubmit={() => {}} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'number')
  })

  it('autofocuses the input', () => {
    render(<AnswerInput onSubmit={() => {}} />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveFocus()
  })

  it('renders a submit button', () => {
    render(<AnswerInput onSubmit={() => {}} />)

    const button = screen.getByRole('button', { name: /responder/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onSubmit with number when button is clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<AnswerInput onSubmit={onSubmit} />)

    const input = screen.getByRole('spinbutton')
    const button = screen.getByRole('button', { name: /responder/i })

    await user.type(input, '15')
    await user.click(button)

    expect(onSubmit).toHaveBeenCalledWith(15)
  })

  it('calls onSubmit when Enter key is pressed', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<AnswerInput onSubmit={onSubmit} />)

    const input = screen.getByRole('spinbutton')

    await user.type(input, '42{Enter}')

    expect(onSubmit).toHaveBeenCalledWith(42)
  })

  it('clears input after submission', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<AnswerInput onSubmit={onSubmit} />)

    const input = screen.getByRole('spinbutton')
    const button = screen.getByRole('button', { name: /responder/i })

    await user.type(input, '25')
    await user.click(button)

    expect(input).toHaveValue(null)
  })

  it('does not submit when input is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<AnswerInput onSubmit={onSubmit} />)

    const button = screen.getByRole('button', { name: /responder/i })

    await user.click(button)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not submit when input is not a number', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<AnswerInput onSubmit={onSubmit} />)

    const input = screen.getByRole('spinbutton')
    const button = screen.getByRole('button', { name: /responder/i })

    // Try to clear and force empty state
    await user.clear(input)
    await user.click(button)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('disables input and button when disabled prop is true', () => {
    render(<AnswerInput onSubmit={() => {}} disabled />)

    const input = screen.getByRole('spinbutton')
    const button = screen.getByRole('button', { name: /responder/i })

    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it('does not submit when disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<AnswerInput onSubmit={onSubmit} disabled />)

    const input = screen.getByRole('spinbutton')

    // Try to type (should not work since disabled)
    await user.type(input, '10{Enter}')

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
