import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5"

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md text-center'>
        <div className='text-6xl mb-4'>🤖</div>
        <h1 className='text-4xl font-bold text-gray-800 mb-2'>404</h1>
        <h2 className='text-xl font-semibold text-gray-600 mb-4'>Page Not Found</h2>
        <p className='text-gray-500 mb-6'>
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className='flex gap-4 justify-center'>
          <button 
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition'
          >
            <IoArrowBack />
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className='bg-[#20c7ff] text-white px-4 py-2 rounded-lg hover:bg-[#1aa6d9] transition'
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
