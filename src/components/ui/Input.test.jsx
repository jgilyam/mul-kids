import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'
import styles from './Input.module.css'

describe('Input', () => {
  it('should render label and input', () => {
    render(<Input label="Nombre" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
  })

  it('should call onChange when user types', async () => {
    const onChange = vi.fn()
    render(<Input label="Nombre" value="" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Nombre'), 'María')
    expect(onChange).toHaveBeenCalled()
  })

  it('should display error message', () => {
    render(<Input label="Nombre" value="" onChange={() => {}} error="Campo requerido" />)
    expect(screen.getByText('Campo requerido')).toBeInTheDocument()
  })

  it('should autofocus when autoFocus prop is true', () => {
    render(<Input label="Nombre" value="" onChange={() => {}} autoFocus />)
    expect(screen.getByLabelText('Nombre')).toHaveFocus()
  })

  it('should apply error styles when error present', () => {
    const { container } = render(<Input label="Name" value="" onChange={() => {}} error="Error" />)
    expect(container.querySelector('input')).toHaveClass(styles.error)
  })
})
