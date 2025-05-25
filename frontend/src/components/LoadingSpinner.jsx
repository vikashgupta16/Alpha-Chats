import React from 'react'

const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8", 
    large: "w-12 h-12"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-[#20c7ff] rounded-full animate-spin`}></div>
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  )
}

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-200">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <LoadingSpinner size="large" message={message} />
      </div>
    </div>
  )
}

export { LoadingSpinner, LoadingPage }
export default LoadingSpinner
