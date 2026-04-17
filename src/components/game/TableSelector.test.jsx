import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TableSelector from './TableSelector'

describe('TableSelector', () => {
  it('should render 10 table buttons', () => {
    render(<TableSelector onSelect={() => {}} />)
    const buttons = screen.getAllByRole('button')
    const tableButtons = buttons.filter(btn => btn.textContent.match(/^Tabla del \d+$/))
    expect(tableButtons).toHaveLength(10)
  })

  it('should render mixed mode button', () => {
    render(<TableSelector onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: /modo mixto/i })).toBeInTheDocument()
  })

  it('should call onSelect with table number when table button clicked', async () => {
    const onSelect = vi.fn()
    render(<TableSelector onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: /tabla del 7/i }))

    expect(onSelect).toHaveBeenCalledWith(7)
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('should call onSelect with null when mixed mode clicked', async () => {
    const onSelect = vi.fn()
    render(<TableSelector onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: /modo mixto/i }))

    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('should highlight recommended table when provided', () => {
    const { container } = render(<TableSelector onSelect={() => {}} recommendedTable={5} />)
    // The recommended button should be variant="primary" while others are "secondary"
    const buttons = screen.getAllByRole('button')
    const table5Button = buttons.find(btn => btn.textContent === 'Tabla del 5')
    const table7Button = buttons.find(btn => btn.textContent === 'Tabla del 7')

    // Check that table 5 has primary class
    expect(table5Button.className).toContain('primary')
    // Check that table 7 has secondary class
    expect(table7Button.className).toContain('secondary')
  })

  it('should not highlight any table when recommendedTable is null', () => {
    render(<TableSelector onSelect={() => {}} recommendedTable={null} />)
    const buttons = screen.getAllByRole('button')
    const tableButtons = buttons.filter(btn => btn.textContent.match(/^Tabla del \d+$/))
    // All table buttons should have secondary variant
    tableButtons.forEach(btn => {
      expect(btn.className).toContain('secondary')
    })
  })

  it('should show badge for recommended table', () => {
    render(<TableSelector onSelect={() => {}} recommendedTable={7} />)
    expect(screen.getByText(/recomendada/i)).toBeInTheDocument()
  })

  it('should not show badge when no recommendation', () => {
    render(<TableSelector onSelect={() => {}} />)
    expect(screen.queryByText(/recomendada/i)).not.toBeInTheDocument()
  })

  it('should have large touch-friendly buttons', () => {
    render(<TableSelector onSelect={() => {}} />)
    const buttons = screen.getAllByRole('button')
    // Check that all buttons are size="lg"
    buttons.forEach(button => {
      expect(button.className).toContain('_lg_')
    })
  })

  it('should render all buttons in grid layout', () => {
    const { container } = render(<TableSelector onSelect={() => {}} />)
    const grid = container.querySelector('[class*="tableGrid"]')
    expect(grid).toBeInTheDocument()
  })
})
