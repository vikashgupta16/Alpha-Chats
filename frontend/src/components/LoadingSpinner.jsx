import React from 'react'

const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8", 
    large: "w-12 h-12",
    lg: "w-12 h-12"
  }
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-4 border-pastel-border dark:border-pastel-muted border-t-pastel-rose dark:border-t-[#39ff14] rounded-full animate-spin`}></div>
      {message && <p className="text-pastel-muted dark:text-gray-300 text-sm font-mono">{message}</p>}
    </div>
  )
}

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-[#181c2f]">
      <div className="bg-pastel-cream dark:bg-[#23234a] p-8 rounded-lg shadow-lg border border-pastel-border dark:border-[#39ff14]/30">
        <LoadingSpinner size="large" message={message} />
      </div>
    </div>
  )
}

export { LoadingSpinner, LoadingPage }
export default LoadingSpinner
