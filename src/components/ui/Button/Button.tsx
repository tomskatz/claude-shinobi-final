interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'black' | 'white'
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseClasses = 'px-8 py-4 rounded-[20px] font-medium cursor-pointer transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'

  const variantClasses = {
    primary: 'bg-gradient-to-b from-[#4a90e2] to-[#2563eb] text-white shadow-[0_8px_0_0_#1e40af,0_10px_20px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_0_#1e40af,0_8px_15px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#1e40af,0_3px_8px_0_rgba(0,0,0,0.3)] active:translate-y-[6px] border-t-2 border-t-[#6aa5eb]/50',
    secondary: 'bg-gradient-to-b from-[#f59e0b] to-[#d97706] text-white shadow-[0_8px_0_0_#b45309,0_10px_20px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_0_#b45309,0_8px_15px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#b45309,0_3px_8px_0_rgba(0,0,0,0.3)] active:translate-y-[6px] border-t-2 border-t-[#fbbf24]/50',
    success: 'bg-gradient-to-b from-[#34d399] to-[#10b981] text-white shadow-[0_8px_0_0_#059669,0_10px_20px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_0_#059669,0_8px_15px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#059669,0_3px_8px_0_rgba(0,0,0,0.3)] active:translate-y-[6px] border-t-2 border-t-[#6ee7b7]/50',
    warning: 'bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] text-white shadow-[0_8px_0_0_#d97706,0_10px_20px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_0_#d97706,0_8px_15px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#d97706,0_3px_8px_0_rgba(0,0,0,0.3)] active:translate-y-[6px] border-t-2 border-t-[#fde68a]/50',
    danger: 'bg-gradient-to-b from-[#f87171] to-[#dc2626] text-white shadow-[0_8px_0_0_#b91c1c,0_10px_20px_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_0_#b91c1c,0_8px_15px_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#b91c1c,0_3px_8px_0_rgba(0,0,0,0.3)] active:translate-y-[6px] border-t-2 border-t-[#fca5a5]/50',
    black: 'bg-gradient-to-b from-[#374151] to-[#111827] text-white shadow-[0_8px_0_0_#000000,0_10px_20px_0_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_0_#000000,0_8px_15px_0_rgba(0,0,0,0.4)] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#000000,0_3px_8px_0_rgba(0,0,0,0.4)] active:translate-y-[6px] border-t-2 border-t-[#6b7280]/50',
    white: 'bg-gradient-to-b from-white to-[#e5e7eb] text-gray-800 shadow-[0_8px_0_0_#9ca3af,0_10px_20px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_#9ca3af,0_8px_15px_0_rgba(0,0,0,0.2)] hover:translate-y-[2px] active:shadow-[0_2px_0_0_#9ca3af,0_3px_8px_0_rgba(0,0,0,0.2)] active:translate-y-[6px] border-t-2 border-t-white/90'
  }

  const buttonClass = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button