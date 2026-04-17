import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { useUserStore } from './store/userStore'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: null, isRegistered: false })
  })

  it('should render RegisterView when not registered', () => {
    render(<App />)
    expect(screen.getByText(/Bienvenido a Mat-Kids/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
  })

  it('should render Header when registered', () => {
    useUserStore.setState({
      user: { id: 'test-123', name: 'María', createdAt: Date.now() },
      isRegistered: true
    })
    render(<App />)
    expect(screen.getByText(/Mat-Kids/i)).toBeInTheDocument()
    expect(screen.getByText(/Hola, María/i)).toBeInTheDocument()
  })

  it('should render TabNavigation when registered', () => {
    useUserStore.setState({
      user: { id: 'test-123', name: 'María', createdAt: Date.now() },
      isRegistered: true
    })
    render(<App />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Jugar/i })).toBeInTheDocument()
  })

  it('should render GameView when play tab is active', () => {
    useUserStore.setState({
      user: { id: 'test-123', name: 'María', createdAt: Date.now() },
      isRegistered: true
    })
    render(<App />)
    // Default tab is "play" - GameView should render with TableSelector
    expect(screen.getByText(/Selecciona una Tabla/i)).toBeInTheDocument()
  })
})
