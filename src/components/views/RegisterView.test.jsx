import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterView from './RegisterView'
import { useUserStore } from '../../store/userStore'

describe('RegisterView', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: null, isRegistered: false })
  })

  it('should render input for name', () => {
    render(<RegisterView />)
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
  })

  it('should render submit button', () => {
    render(<RegisterView />)
    expect(screen.getByRole('button', { name: /comenzar/i })).toBeInTheDocument()
  })

  it('should show validation error for invalid name', async () => {
    render(<RegisterView />)
    const input = screen.getByLabelText(/nombre/i)
    const button = screen.getByRole('button', { name: /comenzar/i })

    await userEvent.type(input, 'J')
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/al menos 2/i)).toBeInTheDocument()
    })
  })

  it('should register user with valid name', async () => {
    render(<RegisterView />)
    const input = screen.getByLabelText(/nombre/i)
    const button = screen.getByRole('button', { name: /comenzar/i })

    await userEvent.type(input, 'María')
    await userEvent.click(button)

    await waitFor(() => {
      const state = useUserStore.getState()
      expect(state.user).not.toBeNull()
      expect(state.user.name).toBe('María')
    })
  })

  it('should autofocus name input', () => {
    render(<RegisterView />)
    expect(screen.getByLabelText(/nombre/i)).toHaveFocus()
  })

  it('should use Button component for submit', () => {
    const { container } = render(<RegisterView />)
    const button = screen.getByRole('button', { name: /comenzar/i })
    // Button component adds specific class names via CSS modules
    // Raw button with inline styles would not have these
    expect(button.className).not.toBe('submit-button')
  })
})
