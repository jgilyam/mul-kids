import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TabNavigation from './TabNavigation'

describe('TabNavigation', () => {
  const mockTabs = [
    { id: 'play', label: 'Jugar' },
    { id: 'history', label: 'Historial' },
    { id: 'progress', label: 'Progreso' }
  ]

  it('should render all tabs', () => {
    render(<TabNavigation tabs={mockTabs} activeTab="play" onTabChange={() => {}} />)
    expect(screen.getByText('Jugar')).toBeInTheDocument()
    expect(screen.getByText('Historial')).toBeInTheDocument()
    expect(screen.getByText('Progreso')).toBeInTheDocument()
  })

  it('should have accessible tablist role', () => {
    render(<TabNavigation tabs={mockTabs} activeTab="play" onTabChange={() => {}} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('should mark active tab with aria-selected', () => {
    render(<TabNavigation tabs={mockTabs} activeTab="history" onTabChange={() => {}} />)
    const historyTab = screen.getByRole('tab', { name: /Historial/i })
    expect(historyTab).toHaveAttribute('aria-selected', 'true')
  })

  it('should mark inactive tabs with aria-selected false', () => {
    render(<TabNavigation tabs={mockTabs} activeTab="play" onTabChange={() => {}} />)
    const historyTab = screen.getByRole('tab', { name: /Historial/i })
    expect(historyTab).toHaveAttribute('aria-selected', 'false')
  })

  it('should call onTabChange when tab is clicked', async () => {
    const onTabChange = vi.fn()
    render(<TabNavigation tabs={mockTabs} activeTab="play" onTabChange={onTabChange} />)
    await userEvent.click(screen.getByText('Historial'))
    expect(onTabChange).toHaveBeenCalledWith('history')
  })
})
