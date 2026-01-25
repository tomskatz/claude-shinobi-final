interface CardProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  title?: string
  subtitle?: string
}

function Card({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  title,
  subtitle
}: CardProps) {
  const baseClasses = 'rounded-lg border transition-all duration-200'

  const variantClasses = {
    primary: 'bg-primary/10 border-primary/30 text-foreground',
    secondary: 'bg-secondary/10 border-secondary/30 text-foreground',
    success: 'bg-success/10 border-success/30 text-foreground',
    warning: 'bg-warning/10 border-warning/30 text-foreground',
    danger: 'bg-danger/10 border-danger/30 text-foreground'
  }

  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  const cardClass = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      {title && (
        <h3 className="font-heading font-semibold mb-1">{title}</h3>
      )}
      {subtitle && (
        <p className="text-muted text-sm mb-3">{subtitle}</p>
      )}
      <div>{children}</div>
    </div>
  )
}

export default Card
