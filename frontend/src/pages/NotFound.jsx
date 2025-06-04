import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5"
import { FaTerminal, FaCode, FaExclamationTriangle } from 'react-icons/fa'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className='w-full h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#181c2f] via-[#23234a] to-[#181c2f]'>
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="grid grid-cols-20 gap-1 h-full">
          {Array.from({ length: 400 }, (_, i) => (
            <div 
              key={i} 
              className="bg-[#39ff14] animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.02}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Ambient glow effects */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-[#ff6f3c]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-[#39ff14]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed top-1/3 right-1/4 w-24 h-24 bg-[#ffe156]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      
      {/* Main container */}
      <div className='max-w-2xl mx-4 relative z-10'>
        {/* Terminal window */}
        <div className='backdrop-blur-md bg-[#23234a]/90 border border-[#ff6f3c]/30 rounded-2xl shadow-2xl'>
          {/* Terminal header */}
          <div className='flex items-center gap-2 px-4 py-3 border-b border-[#ff6f3c]/20'>
            <div className="w-3 h-3 bg-[#ff6f3c] rounded-full"></div>
            <div className="w-3 h-3 bg-[#ffe156] rounded-full"></div>
            <div className="w-3 h-3 bg-[#39ff14] rounded-full"></div>
            <div className="flex-1 text-center">
              <span className="text-[#b3b3ff] font-mono text-sm">alpha-chat@error ~ 404</span>
            </div>
          </div>
          
          {/* Content area */}
          <div className='p-8 text-center'>
            {/* Error icon and code */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaExclamationTriangle className="text-[#ff6f3c] text-4xl animate-pulse" />
              <div className="text-center">
                <h1 className='text-6xl font-bold font-mono text-[#ff6f3c] mb-2 animate-pulse'>404</h1>
                <div className="text-[#39ff14] font-mono text-sm">
                  <span className="text-[#ff6f3c]">ERROR:</span> ROUTE_NOT_FOUND
                </div>
              </div>
              <FaCode className="text-[#ffe156] text-4xl animate-pulse" />
            </div>
            
            {/* Terminal-style error message */}
            <div className="bg-[#181c2f]/70 border border-[#39ff14]/20 rounded-lg p-4 mb-6 text-left">
              <div className="font-mono text-sm space-y-1">
                <div className="text-[#ff6f3c]">
                  <span className="text-[#39ff14]">$</span> navigate --to="{window.location.pathname}"
                </div>
                <div className="text-[#ffe156]">
                  bash: {window.location.pathname}: No such file or directory
                </div>
                <div className="text-[#b3b3ff]">
                  The requested route does not exist in the Alpha-Chat system.
                </div>
                <div className="text-[#39ff14]">
                  Suggestion: Check available routes or return to main directory.
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className='flex gap-4 justify-center'>
              <button 
                onClick={() => navigate(-1)}
                className='flex items-center gap-2 bg-[#181c2f]/70 border border-[#39ff14]/30 text-[#39ff14] px-6 py-3 rounded-lg hover:bg-[#39ff14]/10 hover:border-[#39ff14] transition font-mono transform hover:scale-105'
              >
                <IoArrowBack />
                Previous Route
              </button>
              <button 
                onClick={() => navigate('/')}
                className='flex items-center gap-2 bg-gradient-to-r from-[#39ff14] to-[#ffe156] text-[#181c2f] px-6 py-3 rounded-lg hover:from-[#ffe156] hover:to-[#ff6f3c] transition font-mono font-bold transform hover:scale-105'
              >
                <FaTerminal />
                Return Home
              </button>
            </div>
            
            {/* Footer terminal prompt */}
            <div className="mt-6 text-[#b3b3ff] font-mono text-sm">
              <span className="text-[#39ff14]">alpha-chat@system:</span> 
              <span className="text-[#ffe156]">~$</span> 
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
