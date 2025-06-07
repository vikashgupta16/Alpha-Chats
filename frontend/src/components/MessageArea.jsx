import React, { useState, useEffect, useCallback, useRef } from 'react'
import { IoArrowBack, IoSend } from "react-icons/io5";
import { FiMonitor, FiTerminal, FiCode } from "react-icons/fi";
import dp from '../assets/pp.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, setMessages, addMessage, markMessagesAsRead } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../config/constants';
import useSocket from '../Hooks/useSocket';
import LoadingSpinner from './LoadingSpinner';
import { useTheme } from './ThemeContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MessageArea() {
  const { theme } = useTheme();
  let {selectedUser, userData, messages} = useSelector(state => state.user)
  let dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingMessages, setFetchingMessages] = useState(false)
  const [inputMode, setInputMode] = useState('text'); // 'text', 'code', 'terminal'
  const [codeLang, setCodeLang] = useState('javascript');
  
  // Debug inputMode changes
  useEffect(() => {
    console.log('🔄 Input mode changed to:', inputMode);
  }, [inputMode]);
  const messagesEndRef = useRef(null)
  const selectedUserRef = useRef(selectedUser)
  const startTypingRef = useRef()
  const stopTypingRef = useRef()
  const messagesRef = useRef(messages)
  
  // Keep refs updated
  useEffect(() => {
    selectedUserRef.current = selectedUser
  }, [selectedUser])
  
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])  // Handle real-time messages with stable callback
  const handleNewMessage = useCallback((newMessage) => {
    // Use ref to get current selectedUser to avoid dependency
    const currentSelectedUser = selectedUserRef.current
    const currentMessages = messagesRef.current
    
    if (currentSelectedUser?._id && (newMessage.senderId === currentSelectedUser._id || newMessage.recipientId === currentSelectedUser._id)) {
      // Check if message already exists to avoid duplicates
      const existingMessage = currentMessages?.find(msg => 
        msg._id === newMessage._id || 
        (msg.message === newMessage.message && 
         msg.sender === newMessage.senderId && 
         Math.abs(new Date(msg.createdAt) - new Date(newMessage.createdAt)) < 1000)
      );
      
      if (!existingMessage) {
        dispatch(addMessage(newMessage))
      }
    }
  }, [dispatch]) // Only depend on dispatch which is stable
    const { 
    sendMessage: sendSocketMessage, 
    startTyping, 
    stopTyping, 
    isConnected, 
    onlineUsers, 
    typingUsers,
    markAsRead 
  } = useSocket(handleNewMessage)
  
  // Keep typing function refs updated
  useEffect(() => {
    startTypingRef.current = startTyping
    stopTypingRef.current = stopTyping
  }, [startTyping, stopTyping])
    const fetchMessages = useCallback(async () => {
    if (!selectedUser?._id) return
    
    setFetchingMessages(true)
    try {      const result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
        withCredentials: true
      })
      dispatch(setMessages(result.data || []))
    } catch (error) {
      console.error("Error fetching messages:", error)
      dispatch(setMessages([]))
    } finally {
      setFetchingMessages(false)
    }  }, [selectedUser?._id, dispatch])
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages()
    }
  }, [selectedUser?._id, fetchMessages])

  // Mark messages as read when selectedUser changes (separate effect)
  useEffect(() => {
    if (selectedUser?._id && markAsRead) {
      markAsRead(selectedUser._id)
      // Also mark messages as read in local state
      dispatch(markMessagesAsRead({ senderId: selectedUser._id }))
    }
  }, [selectedUser?._id, dispatch]) // Don't include markAsRead in dependencies
  // Typing indicator timer
  useEffect(() => {
    let typingTimer
    const currentSelectedUser = selectedUserRef.current
    const startTypingFn = startTypingRef.current
    const stopTypingFn = stopTypingRef.current
    
    if (message.trim() && currentSelectedUser?._id && startTypingFn) {
      startTypingFn(currentSelectedUser._id)
      
      // Clear previous timer
      clearTimeout(typingTimer)
      
      // Set new timer to stop typing after 2 seconds of inactivity
      typingTimer = setTimeout(() => {
        if (stopTypingFn && currentSelectedUser?._id) {
          stopTypingFn(currentSelectedUser._id)
        }
      }, 2000)
    } else if (currentSelectedUser?._id && stopTypingFn) {
      stopTypingFn(currentSelectedUser._id)
    }

    return () => {
      clearTimeout(typingTimer)
      if (currentSelectedUser?._id && stopTypingFn) {
        stopTypingFn(currentSelectedUser._id)
      }
    }
  }, [message]) // Only depend on message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id) return;
    if (
      (inputMode === 'text' && !message.trim()) ||
      (inputMode === 'code' && !message.trim()) ||
      (inputMode === 'terminal' && !message.trim())
    ) return;

    console.log(`🚀 Sending ${inputMode} message:`, { message: message.trim(), inputMode, codeLang });
    setLoading(true);
      // Stop typing indicator
    if (stopTypingRef.current && selectedUser?._id) {
      stopTypingRef.current(selectedUser._id);
    }

    try {
      let payload = { message: message.trim() };
      let socketPayload = { 
        recipientId: selectedUser._id,
        message: message.trim(),
        type: inputMode 
      };

      if (inputMode === 'code') {
        payload = { ...payload, code: message.trim(), codeLang };
        socketPayload = { 
          ...socketPayload, 
          code: message.trim(), 
          codeLang,
          metadata: { language: codeLang }
        };
      } else if (inputMode === 'terminal') {
        payload = { ...payload, terminal: message.trim() };
        socketPayload = { 
          ...socketPayload, 
          terminal: message.trim(),
          metadata: { command: message.trim() }
        };
      }      const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, payload, { withCredentials: true });
      
      // Only add message to local state (socket will handle real-time updates for others)
      // Don't add here to avoid duplicates since socket will handle it
      
      // Send via socket for real-time delivery to other clients
      const messageId = sendSocketMessage(socketPayload);
      
      // Add to local state after successful send
      dispatch(addMessage(result.data));
      
      setMessage("");
      console.log('✅ Message sent with ID:', messageId);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Early return if userData is not available
  if (!userData) {
    return (
      <div className='flex-1 flex flex-col h-full bg-gradient-to-br from-[#181c2f] via-[#2d1e60] to-[#23234a] items-center justify-center'>
        <LoadingSpinner size="lg" />
        <p className="text-[#b3b3ff] font-mono mt-4">Loading user data...</p>
      </div>
    )
  }

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'bash', label: 'Bash' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'rust', label: 'Rust' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'swift', label: 'Swift' },
  ];

  // Responsive: detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile && !selectedUser) {
    // On mobile, if no user selected, hide chat area (sidebar will be visible)
    return null;
  }

  return (
    <div className={`flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-[#181c2f] via-[#23234a] to-[#181c2f]`}>
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <div className="grid grid-cols-20 gap-1 h-full">
          {Array.from({ length: 400 }, (_, i) => (
            <div 
              key={i} 
              className="bg-gradient-to-br from-[#39ff14] via-[#ffe156] to-[#ff6f3c] rounded animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Ambient glow effects */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#39ff14]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#ff6f3c]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#ffe156]/10 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 flex-1 flex flex-col h-full w-full max-w-full">
        {selectedUser ? (
          <>
            {/* Terminal-style Header */}
            <div className='w-full bg-gradient-to-r from-[#23234a] via-[#2d1e60] to-[#23234a] border-b border-[#39ff14]/30 shadow-lg'>
              <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <button 
                    className='p-2 hover:bg-[#39ff14]/20 rounded-lg transition-all duration-200 group' 
                    onClick={() => dispatch(setSelectedUser(null))}
                  > 
                    <IoArrowBack className='w-6 h-6 text-[#39ff14] group-hover:text-white transition-colors' />
                  </button>
                  <div className='relative'>
                    <img 
                      src={selectedUser?.image || dp} 
                      alt="Profile" 
                      className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-[#39ff14] shadow-lg cursor-pointer hover:scale-105 transition-transform' 
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#39ff14] rounded-full border-2 border-[#23234a] animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className='text-white font-bold text-lg sm:text-xl font-mono truncate max-w-[120px] sm:max-w-none'>
                      {selectedUser?.name || selectedUser?.userName || "Anonymous"}
                    </h1>
                    <p className='text-[#39ff14] text-xs sm:text-sm font-mono truncate max-w-[120px] sm:max-w-none'>@{selectedUser?.github || selectedUser?.userName}</p>
                  </div>
                </div>
                {/* Terminal window controls */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-[#39ff14] rounded-full animate-pulse"></div>
                  </div>
                  <div className="ml-2 sm:ml-4 text-[#b3b3ff] font-mono text-xs sm:text-sm">
                    <FiTerminal className="w-5 h-5" />
                  </div>
                </div>
              </div>
              {/* Terminal prompt bar */}
              <div className="px-2 sm:px-4 pb-2 sm:pb-3">
                <div className="bg-[#181c2f] rounded-lg p-2 border border-[#39ff14]/20">
                  <span className="text-[#39ff14] font-mono text-xs sm:text-sm">
                    developer@alphachat:~$ chat --with {selectedUser?.userName || 'user'} --secure
                  </span>
                </div>
              </div>
            </div>
            {/* Live Status Bar */}
            <div className="w-full flex flex-wrap items-center justify-between px-2 sm:px-4 py-2 bg-[#23234a] border-b border-[#39ff14]/20 sticky top-0 z-20 gap-2 sm:gap-0 text-xs sm:text-sm">
              {/* Live/Offline status */}
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${onlineUsers.includes(selectedUser?._id) ? 'bg-[#39ff14] animate-pulse' : 'bg-gray-400'}`}></span>
                <span className={`font-mono ${onlineUsers.includes(selectedUser?._id) ? 'text-[#39ff14]' : 'text-gray-400'}`}> {onlineUsers.includes(selectedUser?._id) ? 'Live' : 'Offline'} </span>
              </div>
              {/* Connection status */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#39ff14]' : 'bg-red-500'}`}></span>
                <span className="font-mono text-[#b3b3ff]"> {isConnected ? 'Connected' : 'Reconnecting...'} </span>
              </div>
              {/* New messages count */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#b3b3ff]">New:</span>
                <span className="font-mono text-[#39ff14] font-bold"> {messages?.filter(m => !m.read && m.sender === selectedUser?._id).length || 0} </span>
              </div>
              {/* Last seen */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#b3b3ff]">Last seen:</span>
                <span className="font-mono text-[#39ff14]"> {onlineUsers.includes(selectedUser?._id) ? 'Now' : (selectedUser?.lastSeen ? new Date(selectedUser.lastSeen).toLocaleString() : 'Unknown')} </span>
              </div>
            </div>
            {/* Typing Indicator */}
            {typingUsers.includes(selectedUser?._id) && (
              <div className="px-2 sm:px-4 py-2 border-b border-[#39ff14]/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-[#b3b3ff] font-mono text-xs"> {selectedUser?.userName} is typing... </span>
                </div>
              </div>
            )}
            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-2 sm:p-6 space-y-4 ${isMobile ? 'pb-40' : ''}`} style={isMobile ? {paddingBottom: '180px', position: 'static'} : {paddingBottom: '180px'}}>
              {fetchingMessages ? (
                <div className='flex items-center justify-center h-full'>
                  <div className="bg-[#23234a] rounded-xl p-8 border border-[#39ff14]/30">
                    <LoadingSpinner size="lg" />
                    <p className="text-[#39ff14] font-mono mt-4 text-center">Loading chat history...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className='flex items-center justify-center h-full'>
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#23234a] rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-[#39ff14]/30">
                      <FiCode className="w-8 h-8 sm:w-10 sm:h-10 text-[#39ff14]" />
                    </div>
                    <h3 className='text-white font-bold text-lg sm:text-xl font-mono mb-2'>Start Coding Together</h3>
                    <p className='text-[#b3b3ff] font-mono text-sm sm:text-base'>Send your first message to begin collaboration</p>
                    <div className="mt-6 text-[#39ff14] font-mono text-xs sm:text-sm opacity-60"> // No messages in buffer </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={msg._id || index} className={`flex ${msg.sender === userData._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90vw] sm:max-w-[75%] ${msg.sender === userData._id ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 sm:p-4 rounded-2xl font-mono relative ${ msg.sender === userData._id ? 'bg-gradient-to-r from-[#39ff14] to-[#2dd60a] text-[#181c2f] shadow-lg shadow-[#39ff14]/20' : 'bg-[#23234a] text-white border border-[#39ff14]/20 shadow-lg'} ${msg.sender === userData._id ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                        {/* Message content */}
                        {msg.image && (
                          <img src={msg.image} alt="attachment" className='max-w-full rounded-lg mb-3 border border-[#39ff14]/30' />
                        )}
                        {/* Message type header */}
                        {(msg.messageType === 'code' || msg.messageType === 'terminal' || msg.type === 'code' || msg.type === 'terminal') && (
                          <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${ msg.sender === userData._id ? 'border-[#181c2f]/20' : 'border-[#39ff14]/20' }`}>
                            {(msg.messageType === 'code' || msg.type === 'code') ? (
                              <>
                                <FiCode className="w-4 h-4" />
                                <span className="font-mono text-xs opacity-70"> {msg.metadata?.language || 'code'} </span>
                              </>
                            ) : (
                              <>
                                <FiTerminal className="w-4 h-4" />
                                <span className="font-mono text-xs opacity-70">terminal</span>
                              </>
                            )}
                          </div>
                        )}
                        {/* Code syntax highlighting */}
                        {(msg.messageType === 'code' || msg.type === 'code') && msg.message ? (
                          <div className="rounded-lg overflow-x-auto border border-[#39ff14]/20">
                            <SyntaxHighlighter
                              language={msg.metadata?.language || 'javascript'}
                              style={theme === 'dark' ? atomDark : prism}
                              customStyle={{
                                margin: 0,
                                background: msg.sender === userData._id ? '#0f1419' : '#1a1a2e',
                                fontSize: '13px',
                                minWidth: '200px',
                                maxWidth: '80vw',
                                overflowX: 'auto',
                              }}
                            >
                              {msg.message}
                            </SyntaxHighlighter>
                          </div>
                        ) : (msg.messageType === 'terminal' || msg.type === 'terminal') && msg.message ? (
                          <div className="bg-black rounded-lg p-3 border border-[#39ff14]/20 overflow-x-auto">
                            <div className="text-[#39ff14] font-mono text-sm">
                              <span className="text-gray-400">$ </span>
                              {msg.message}
                            </div>
                          </div>
                        ) : msg.message && (
                          <p className='text-sm leading-relaxed whitespace-pre-wrap break-words'> {msg.message} </p>
                        )}
                        {/* Timestamp and status */}
                        <div className={`flex items-center justify-between mt-2 pt-2 border-t ${ msg.sender === userData._id ? 'border-[#181c2f]/20' : 'border-[#39ff14]/20' }`}>
                          <p className={`text-xs font-mono ${ msg.sender === userData._id ? 'text-[#181c2f]/70' : 'text-[#b3b3ff]' }`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                          {msg.sender === userData._id && (
                            <div className="flex items-center gap-1">
                              {msg.delivered && (<span className="text-xs opacity-60">✓</span>)}
                              {msg.read && (<span className="text-xs opacity-60">✓</span>)}
                              <span className="text-xs opacity-60"> {msg.read ? 'read' : msg.delivered ? 'delivered' : 'sent'} </span>
                            </div>
                          )}
                        </div>
                        {/* Message type indicator */}
                        <div className={`absolute -bottom-1 ${ msg.sender === userData._id ? '-right-1' : '-left-1' } w-3 h-3 transform rotate-45 ${ msg.sender === userData._id ? 'bg-[#39ff14]' : 'bg-[#23234a] border-r border-b border-[#39ff14]/20' }`}></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Terminal-style Message Input */}
            <div className={`${isMobile ? 'relative' : 'absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4'}`}>
              <div className="bg-[#181c2f] rounded-xl border border-[#39ff14]/30 shadow-2xl overflow-hidden">
                {/* Terminal header */}
                <div className="bg-[#23234a] px-2 sm:px-4 py-2 border-b border-[#39ff14]/20 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">                  <div className="flex items-center gap-2">
                    <FiTerminal className="w-4 h-4 text-[#39ff14]" />
                    <span className="text-[#b3b3ff] font-mono text-xs sm:text-sm">Message Terminal</span>
                    <span className="text-[#39ff14] font-mono text-xs"> [Mode: {inputMode.toUpperCase()}] </span>
                    {inputMode === 'code' && (
                      <span className="text-[#b3b3ff] font-mono text-xs"> [{codeLang}] </span>
                    )}
                  </div>                <div className="flex gap-2 relative z-10 mt-2 sm:mt-0">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 hover:scale-105 cursor-pointer select-none ${
                        inputMode === 'text' 
                          ? 'bg-[#39ff14] text-[#181c2f] shadow-lg shadow-[#39ff14]/30' 
                          : 'bg-[#23234a] text-[#b3b3ff] border border-[#39ff14]/30 hover:bg-[#39ff14]/10 hover:border-[#39ff14]/50'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Text button clicked - changing from', inputMode, 'to text');
                        setInputMode('text');
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      💬 Text
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 hover:scale-105 cursor-pointer select-none ${
                        inputMode === 'code' 
                          ? 'bg-[#39ff14] text-[#181c2f] shadow-lg shadow-[#39ff14]/30' 
                          : 'bg-[#23234a] text-[#b3b3ff] border border-[#39ff14]/30 hover:bg-[#39ff14]/10 hover:border-[#39ff14]/50'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Code button clicked - changing from', inputMode, 'to code');
                        setInputMode('code');
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      💻 Code
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 hover:scale-105 cursor-pointer select-none ${
                        inputMode === 'terminal' 
                          ? 'bg-[#39ff14] text-[#181c2f] shadow-lg shadow-[#39ff14]/30' 
                          : 'bg-[#23234a] text-[#b3b3ff] border border-[#39ff14]/30 hover:bg-[#39ff14]/10 hover:border-[#39ff14]/50'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Terminal button clicked - changing from', inputMode, 'to terminal');
                        setInputMode('terminal');
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      ⚡ Terminal
                    </button>
                    {inputMode === 'code' && (
                      <select
                        className="ml-2 px-3 py-1.5 rounded font-mono text-xs bg-[#23234a] text-[#39ff14] border border-[#39ff14]/30 hover:bg-[#39ff14]/10 transition-colors duration-200"
                        value={codeLang}
                        onChange={e => {
                          console.log('🔧 Language changed to:', e.target.value);
                          setCodeLang(e.target.value);
                        }}
                      >
                        {languageOptions.map(lang => (
                          <option key={lang.value} value={lang.value} className="bg-[#23234a] text-[#39ff14]">
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {/* Input form */}
                <form className='p-2 sm:p-4' onSubmit={handleSendMessage}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
                    <span className="text-[#39ff14] font-mono text-xs sm:text-sm flex-shrink-0"> {userData?.userName || 'user'}@alphachat:~$ </span>
                    {inputMode === 'code' ? (
                      <textarea
                        rows={3}
                        placeholder={`Write your ${codeLang} code here...\n// Example:\nfunction hello() {\n  console.log(\"Hello World!\");\n}`}
                        className="flex-1 bg-[#0d1117] text-[#39ff14] placeholder-[#b3b3ff]/50 outline-none font-mono text-xs sm:text-sm p-2 sm:p-3 border-2 border-[#39ff14]/30 rounded-lg resize-y min-h-[60px] max-h-[200px] focus:border-[#39ff14] focus:shadow-lg focus:shadow-[#39ff14]/20 transition-all duration-200"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={loading}
                      />
                    ) : inputMode === 'terminal' ? (
                      <input
                        type="text"
                        placeholder="$ npm install react-syntax-highlighter"
                        className="flex-1 bg-[#000000] text-[#39ff14] placeholder-[#666] outline-none font-mono text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-3 border-2 border-[#39ff14]/30 rounded-lg focus:border-[#39ff14] focus:shadow-lg focus:shadow-[#39ff14]/20 transition-all duration-200"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={loading}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-white placeholder-[#b3b3ff]/50 outline-none font-mono text-xs sm:text-sm py-2 sm:py-3 px-2 border-b-2 border-[#39ff14]/20 focus:border-[#39ff14] transition-all duration-200"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={loading}
                      />
                    )}
                    <button
                      type="submit"
                      disabled={!message.trim() || loading}
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#39ff14] to-[#2dd60a] text-[#181c2f] rounded-lg font-mono font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-[#39ff14]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#181c2f]/30 border-t-[#181c2f] rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <IoSend className="w-4 h-4" />
                          <span>Send</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className='w-full h-full flex flex-col items-center justify-center gap-6 sm:gap-8 p-4 sm:p-8'>
            <div className="text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#23234a] rounded-full flex items-center justify-center mb-6 sm:mb-8 mx-auto border-4 border-[#39ff14]/30 shadow-2xl">
                <FiMonitor className="w-12 h-12 sm:w-16 sm:h-16 text-[#39ff14]" />
              </div>
              <h1 className='text-white font-bold text-3xl sm:text-5xl font-mono mb-2 sm:mb-4'>
                Welcome to <span className="text-[#39ff14]">Alpha</span>Chat
              </h1>
              <p className='text-[#b3b3ff] font-mono text-lg sm:text-xl mb-4 sm:mb-6'> Elite Developer Communication Terminal </p>
              <div className="bg-[#181c2f] rounded-xl p-4 sm:p-6 border border-[#39ff14]/20 max-w-xs sm:max-w-md mx-auto">
                <div className="text-[#39ff14] font-mono text-xs sm:text-sm space-y-2">
                  <p>// System Status: <span className="text-white">Online</span></p>
                  <p>// Connected Developers: <span className="text-white">Ready</span></p>
                  <p>// Security: <span className="text-white">End-to-End Encrypted</span></p>
                </div>
              </div>
              <p className='text-[#b3b3ff] font-mono text-base sm:text-lg mt-6 sm:mt-8'> Select a developer from the sidebar to start coding together </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageArea
