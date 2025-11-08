const ProgressBar = ({ current, total, showLabel = true, className = '' }) => {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">
            Step {current} of {total}
          </span>
          <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {percentage}%
          </span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-500 ease-out rounded-full shadow-lg"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
