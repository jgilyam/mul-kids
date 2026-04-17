import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('should render app title', () => {
    render(<Header userName="María" />)
    expect(screen.getByText(/Mat-Kids/i)).toBeInTheDocument()
  })

  it('should render user name when provided', () => {
    render(<Header userName="María" />)
    expect(screen.getByText(/María/i)).toBeInTheDocument()
  })

  it('should render greeting with user name', () => {
    render(<Header userName="Juan" />)
    expect(screen.getByText(/Hola, Juan/i)).toBeInTheDocument()
  })
})
