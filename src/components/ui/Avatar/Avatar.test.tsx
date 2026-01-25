import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Avatar from './Avatar'

describe('Avatar', () => {
  afterEach(() => {
    cleanup()
  })

  describe('Initials Generation', () => {
    it('generates initials from two-name format (first + last)', () => {
      render(<Avatar name="Sarah Johnson" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('SJ')
    })

    it('generates initials from single name (first 2 characters)', () => {
      render(<Avatar name="Madonna" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('MA')
    })

    it('generates initials from multi-name format (first + last)', () => {
      render(<Avatar name="Jean-Paul Sartre" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('JS')
    })

    it('generates initials from three names (first + last)', () => {
      render(<Avatar name="José María García" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('JG')
    })

    it('handles names with apostrophes', () => {
      render(<Avatar name="O'Brien Smith" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('OS')
    })

    it('handles Michael Chen correctly', () => {
      render(<Avatar name="Michael Chen" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('MC')
    })

    it('handles Emily Rodriguez correctly', () => {
      render(<Avatar name="Emily Rodriguez" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('ER')
    })

    it('handles David Kim correctly', () => {
      render(<Avatar name="David Kim" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('DK')
    })
  })

  describe('Edge Cases', () => {
    it('returns "?" for empty string', () => {
      render(<Avatar name="" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('?')
    })

    it('returns "?" for whitespace-only string', () => {
      render(<Avatar name="   " />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('?')
    })

    it('handles extra whitespace around name', () => {
      render(<Avatar name="  David  Kim  " />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('DK')
    })

    it('handles single character names', () => {
      render(<Avatar name="X" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('X')
    })

    it('handles names with only special characters', () => {
      render(<Avatar name="@#$%" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveTextContent('?')
    })
  })

  describe('Size Variants', () => {
    it('renders xs size correctly', () => {
      render(<Avatar name="Test User" size="xs" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('w-6', 'h-6', 'text-xs')
    })

    it('renders sm size correctly', () => {
      render(<Avatar name="Test User" size="sm" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('w-8', 'h-8', 'text-xs')
    })

    it('renders md size correctly', () => {
      render(<Avatar name="Test User" size="md" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('w-12', 'h-12', 'text-sm')
    })

    it('renders lg size correctly', () => {
      render(<Avatar name="Test User" size="lg" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('w-16', 'h-16', 'text-base')
    })

    it('defaults to md size when not specified', () => {
      render(<Avatar name="Test User" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('w-12', 'h-12', 'text-sm')
    })
  })

  describe('Styling', () => {
    it('applies gradient background classes', () => {
      render(<Avatar name="Test User" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('bg-gradient-to-br', 'from-primary', 'to-accent')
    })

    it('applies base styling classes', () => {
      render(<Avatar name="Test User" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('rounded-full', 'flex', 'items-center', 'justify-center', 'flex-shrink-0', 'text-white', 'font-semibold')
    })

    it('applies custom className', () => {
      render(<Avatar name="Test User" className="custom-class" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('custom-class')
    })
  })

  describe('Accessibility', () => {
    it('has role="img"', () => {
      render(<Avatar name="Test User" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
    })

    it('has proper aria-label with full name', () => {
      render(<Avatar name="Sarah Johnson" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('aria-label', 'Avatar for Sarah Johnson')
    })

    it('aria-label works with single name', () => {
      render(<Avatar name="Madonna" />)
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('aria-label', 'Avatar for Madonna')
    })
  })
})
