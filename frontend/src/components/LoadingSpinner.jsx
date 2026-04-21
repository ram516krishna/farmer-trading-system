const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'loading loading-sm',
    md: 'loading loading-md',
    lg: 'loading loading-lg',
    xl: 'loading loading-xl'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className={`${sizeClasses[size]} text-success`}></div>
      {text && <p className="text-sm text-base-content/60">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
