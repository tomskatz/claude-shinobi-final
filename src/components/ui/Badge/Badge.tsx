interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

function Badge({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200'

  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-white'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  const badgeClass = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClass} aria-disabled={disabled}>
      {children}
    </span>
  )
}

export default Badge
