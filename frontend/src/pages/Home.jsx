import React, { useCallback, useRef } from 'react'
import SideBar from '../components/SideBar'
import MessageArea from '../components/MessageArea'
import useSocket from '../Hooks/useSocket'

function Home() {
  // Create a ref to pass the message handler from MessageArea to the socket
  const messageHandlerRef = useRef(null)
  
  // Socket message handler that will be called by useSocket
  const handleNewMessage = useCallback((newMessage) => {
    // Forward the message to MessageArea's handler
    if (messageHandlerRef.current) {
      messageHandlerRef.current(newMessage)
    }
  }, []);

  // Single socket connection for the entire app
  const socketData = useSocket(handleNewMessage);
  return (
    <div className="w-full h-screen flex bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 dark:from-[#181c2f] dark:via-[#23234a] dark:to-[#181c2f] overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 48 }, (_, i) => (
            <div 
              key={i} 
              className="bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 dark:from-[#39ff14] dark:via-[#ffe156] dark:to-[#ff6f3c] rounded-lg animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      {/* Ambient glow effects */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-blue-500/20 dark:bg-[#39ff14]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed bottom-10 right-10 w-40 h-40 bg-orange-500/20 dark:bg-[#ff6f3c]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed top-1/2 left-1/2 w-24 h-24 bg-yellow-500/20 dark:bg-[#ffe156]/20 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2 z-20"></div>{/* Main Layout */}
      <div className="relative z-10 flex w-full h-full">
        <SideBar 
          onlineUsers={socketData.onlineUsers} 
          isConnected={socketData.isConnected} 
        />        <div className="flex-1 flex flex-col h-full">
          <MessageArea 
            socketData={socketData}
            messageHandlerRef={messageHandlerRef}
          />
        </div>
      </div>
    </div>
  )
}

export default Home