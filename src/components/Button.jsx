const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false
}) => {
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'

  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 focus:ring-primary/50 shadow-md',
    secondary: 'bg-gradient-to-r from-secondary to-primary text-white hover:shadow-lg hover:scale-105 focus:ring-secondary/50 shadow-md',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
