import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Card from './Card'

describe('Card', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with default props', () => {
    render(<Card>Card content</Card>)
    const card = screen.getByText('Card content')
    expect(card).toBeInTheDocument()
  })

  it('renders with title and subtitle', () => {
    render(
      <Card title="Card Title" subtitle="Card Subtitle">
        Card content
      </Card>
    )
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { container } = render(<Card variant="danger">Danger card</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bg-danger/10')
    expect(card).toHaveClass('border-danger/30')
  })

  it('renders with different sizes', () => {
    const { container: smallContainer } = render(<Card size="sm">Small card</Card>)
    const smallCard = smallContainer.firstChild as HTMLElement
    expect(smallCard).toHaveClass('p-3')
    expect(smallCard).toHaveClass('text-sm')

    cleanup()

    const { container: largeContainer } = render(<Card size="lg">Large card</Card>)
    const largeCard = largeContainer.firstChild as HTMLElement
    expect(largeCard).toHaveClass('p-6')
    expect(largeCard).toHaveClass('text-lg')
  })

  it('applies disabled styling when disabled', () => {
    const { container } = render(<Card disabled>Disabled card</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('opacity-50')
    expect(card).toHaveClass('cursor-not-allowed')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Custom card</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('custom-class')
  })
})
