import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Badge from './Badge'

describe('Badge', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with default props', () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText(/new/i)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-primary')
    expect(badge).toHaveClass('px-3') // md size
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="danger">Error</Badge>)
    expect(screen.getByText(/error/i)).toHaveClass('bg-danger')

    rerender(<Badge variant="success">Done</Badge>)
    expect(screen.getByText(/done/i)).toHaveClass('bg-success')

    rerender(<Badge variant="warning">Pending</Badge>)
    expect(screen.getByText(/pending/i)).toHaveClass('bg-warning')

    rerender(<Badge variant="secondary">Info</Badge>)
    expect(screen.getByText(/info/i)).toHaveClass('bg-secondary')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText(/small/i)).toHaveClass('px-2')
    expect(screen.getByText(/small/i)).toHaveClass('text-xs')

    rerender(<Badge size="md">Medium</Badge>)
    expect(screen.getByText(/medium/i)).toHaveClass('px-3')
    expect(screen.getByText(/medium/i)).toHaveClass('text-sm')

    rerender(<Badge size="lg">Large</Badge>)
    expect(screen.getByText(/large/i)).toHaveClass('px-4')
    expect(screen.getByText(/large/i)).toHaveClass('text-base')
  })

  it('applies disabled state', () => {
    render(<Badge disabled>Disabled</Badge>)
    const badge = screen.getByText(/disabled/i)
    expect(badge).toHaveClass('opacity-50')
    expect(badge).toHaveClass('cursor-not-allowed')
    expect(badge).toHaveAttribute('aria-disabled', 'true')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    const badge = screen.getByText(/custom/i)
    expect(badge).toHaveClass('custom-class')
  })
})
