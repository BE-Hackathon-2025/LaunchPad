const Select = ({
  label,
  value,
  onChange,
  options = [],
  required = false,
  error,
  helperText,
  placeholder = 'Select an option',
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="font-medium text-gray-700">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`
          px-4 py-3 rounded-lg border-2
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200 bg-white
          ${error ? 'border-red-500' : 'border-gray-200'}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}

export default Select
