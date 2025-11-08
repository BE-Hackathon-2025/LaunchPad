const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick
}) => {
  const baseStyles = 'bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200'

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const hoverStyles = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:border-primary/20 cursor-pointer' : 'hover:shadow-md'

  return (
    <div
      className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
