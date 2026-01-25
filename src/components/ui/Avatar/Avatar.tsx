interface AvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

function Avatar({
  name,
  size = 'md',
  className = ''
}: AvatarProps) {
  const getInitials = (fullName: string): string => {
    // Handle empty or whitespace-only strings
    const trimmedName = fullName.trim()
    if (!trimmedName) {
      return '?'
    }

    // Remove special characters and split into words
    const words = trimmedName
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)

    // If we have multiple words, use first + last initial
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }

    // If we have a single word, use first 2 characters
    if (words.length === 1 && words[0].length >= 2) {
      return words[0].substring(0, 2).toUpperCase()
    }

    // Fallback for single character
    if (words.length === 1 && words[0].length === 1) {
      return words[0][0].toUpperCase()
    }

    // Final fallback
    return '?'
  }

  const baseClasses = 'bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold'

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  }

  const avatarClass = [
    baseClasses,
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ')

  const initials = getInitials(name)

  return (
    <div
      className={avatarClass}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  )
}

export default Avatar
