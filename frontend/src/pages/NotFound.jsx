import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5"
import { FaTerminal, FaCode, FaExclamationTriangle } from 'react-icons/fa'
import { useTheme } from '../components/ThemeContext'

function NotFound() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  return (
    <div className='w-full h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-pastel-cream via-pastel-lavender to-pastel-peach dark:from-[#181c2f] dark:via-[#23234a] dark:to-[#181c2f]'>
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="grid grid-cols-20 gap-1 h-full">
          {Array.from({ length: 400 }, (_, i) => (
            <div 
              key={i} 
              className="bg-red-500 dark:bg-[#39ff14] animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.02}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Ambient glow effects */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-red-500/20 dark:bg-[#ff6f3c]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-green-500/20 dark:bg-[#39ff14]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed top-1/3 right-1/4 w-24 h-24 bg-yellow-500/20 dark:bg-[#ffe156]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      
      {/* Main container */}
      <div className='max-w-2xl mx-4 relative z-10'>
        {/* Terminal window */}
        <div className='backdrop-blur-md bg-pastel-cream/90 dark:bg-[#23234a]/90 border border-pastel-rose dark:border-[#ff6f3c]/30 rounded-2xl shadow-2xl'>
          {/* Terminal header */}
          <div className='flex items-center gap-2 px-4 py-3 border-b border-red-300 dark:border-[#ff6f3c]/20'>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 dark:bg-[#39ff14] rounded-full"></div>
            <div className="flex-1 text-center">
              <span className="text-pastel-muted dark:text-[#b3b3ff] font-mono text-sm">alpha-chat@error ~ 404</span>
            </div>
          </div>
          
          {/* Content area */}
          <div className='p-8 text-center'>
            {/* Error icon and code */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaExclamationTriangle className="text-red-500 dark:text-[#ff6f3c] text-4xl animate-pulse" />
              <div className="text-center">
                <h1 className='text-6xl font-bold font-mono text-red-500 dark:text-[#ff6f3c] mb-2 animate-pulse'>404</h1>
                <div className="text-pastel-sage dark:text-[#39ff14] font-mono text-sm">
                  <span className="text-red-500 dark:text-[#ff6f3c]">ERROR:</span> ROUTE_NOT_FOUND
                </div>
              </div>
              <FaCode className="text-pastel-sunny dark:text-[#ffe156] text-4xl animate-pulse" />
            </div>
            
            {/* Terminal-style error message */}
            <div className="bg-pastel-lavender dark:bg-[#181c2f]/70 border border-pastel-coral dark:border-[#39ff14]/20 rounded-lg p-4 mb-6 text-left shadow-sm">
              <div className="font-mono text-sm space-y-1">
                <div className="text-red-500 dark:text-[#ff6f3c]">
                  <span className="text-pastel-sage dark:text-[#39ff14]">$</span> navigate --to="{window.location.pathname}"
                </div>
                <div className="text-pastel-sunny dark:text-[#ffe156]">
                  bash: {window.location.pathname}: No such file or directory
                </div>
                <div className="text-pastel-muted dark:text-[#b3b3ff]">
                  The requested route does not exist in the Alpha-Chat system.
                </div>
                <div className="text-pastel-sage dark:text-[#39ff14]">
                  Suggestion: Check available routes or return to main directory.
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className='flex gap-4 justify-center'>
              <button 
                onClick={() => navigate(-1)}
                className='flex items-center gap-2 bg-pastel-cream dark:bg-[#181c2f]/70 border border-pastel-rose dark:border-[#39ff14]/30 text-pastel-rose dark:text-[#39ff14] px-6 py-3 rounded-lg hover:bg-pastel-peach dark:hover:bg-[#39ff14]/10 hover:border-pastel-coral dark:hover:border-[#39ff14] transition font-mono transform hover:scale-105 shadow-sm'
              >
                <IoArrowBack />
                Previous Route
              </button>
              <button 
                onClick={() => navigate('/')}
                className='flex items-center gap-2 bg-gradient-to-r from-pastel-rose to-pastel-coral dark:from-[#39ff14] dark:to-[#ffe156] text-white dark:text-[#181c2f] px-6 py-3 rounded-lg hover:from-pastel-coral hover:to-pastel-sunny dark:hover:from-[#ffe156] dark:hover:to-[#ff6f3c] transition font-mono font-bold transform hover:scale-105'
              >
                <FaTerminal />
                Return Home
              </button>
            </div>
              {/* Footer terminal prompt */}
            <div className="mt-6 text-pastel-purple dark:text-[#b3b3ff] font-mono text-sm">
              <span className="text-pastel-mint dark:text-[#39ff14]">alpha-chat@system:</span> 
              <span className="text-pastel-sunny dark:text-[#ffe156]">~$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
