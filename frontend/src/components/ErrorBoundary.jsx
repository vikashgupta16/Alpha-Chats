import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='w-full h-screen flex items-center justify-center bg-slate-200'>
          <div className='bg-white p-8 rounded-lg shadow-lg max-w-md text-center'>
            <h1 className='text-2xl font-bold text-red-600 mb-4'>Oops! Something went wrong</h1>
            <p className='text-gray-600 mb-4'>
              We're sorry, but something unexpected happened. Please refresh the page or try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className='bg-[#20c7ff] text-white px-6 py-2 rounded-lg hover:bg-[#1aa6d9] transition'
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className='mt-4 text-left'>
                <summary className='cursor-pointer text-sm text-gray-500'>Error details (dev only)</summary>
                <pre className='text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto'>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
