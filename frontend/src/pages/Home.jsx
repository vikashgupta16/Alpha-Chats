import React from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'

function Home() {
  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-[#181c2f] via-[#23234a] to-[#181c2f] overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 48 }, (_, i) => (
            <div 
              key={i} 
              className="bg-gradient-to-br from-[#39ff14] via-[#ffe156] to-[#ff6f3c] rounded-lg animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      {/* Ambient glow effects */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-[#39ff14]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-[#ff6f3c]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed top-1/2 left-1/2 w-24 h-24 bg-[#ffe156]/20 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
      {/* Main Layout */}
      <div className="relative z-10 flex w-full h-full">
        <SideBar />
        <div className="flex-1 flex flex-col h-full">
          <MessageArea />
        </div>
      </div>
    </div>
  )
}

export default Home