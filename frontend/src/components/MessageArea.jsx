import React, { useState, useEffect, useCallback, useRef } from 'react'
import { IoArrowBack, IoSend } from "react-icons/io5";
import { FiMonitor, FiTerminal, FiCode } from "react-icons/fi";
import dp from '../assets/pp.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, setMessages, addMessage, markMessagesAsRead } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../config/constants';
import LoadingSpinner from './LoadingSpinner';
import { useTheme } from './ThemeContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MessageArea({ socketData, messageHandlerRef }) {
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
  }, [messages])
  
  // Handle real-time messages - FIXED APPROACH
  const handleNewMessage = useCallback((newMessage) => {
    // Skip processing if we're currently fetching messages (page load)
    if (fetchingMessages) {
      console.log('⏸️ [SOCKET] Skipping message during fetch phase');
      return;
    }
    
    console.log('📩 [SOCKET] Received message:', {
      id: newMessage._id,
      from: newMessage.senderId,
      to: newMessage.recipientId,
      message: newMessage.message?.substring(0, 30)
    });
    
    // CRITICAL: Use ref to get current messages (avoids stale closure)
    const currentMessages = messagesRef.current;
    
    // Rule 1: Never add our own messages from Socket.IO (sender gets via HTTP)
    if (newMessage.senderId === userData?._id) {
      console.log('🚫 [SOCKET] Ignoring own message echo');
      return;
    }
      // Rule 2: Check if message already exists by ID (most reliable)
    if (newMessage._id && currentMessages?.find(msg => msg._id === newMessage._id)) {
      console.log('🚫 [SOCKET] Message already exists by ID:', newMessage._id);
      return;
    }
    
    // Rule 3: Check for content duplicates (fallback protection)
    const isDuplicate = currentMessages?.some(existingMsg => 
      existingMsg.message === newMessage.message &&
      existingMsg.sender === newMessage.senderId &&
      (existingMsg.recipientId === newMessage.recipientId || existingMsg.reciver === newMessage.recipientId) &&
      Math.abs(new Date(existingMsg.createdAt || existingMsg.timestamp) - new Date(newMessage.timestamp)) < 3000
    );
    
    if (isDuplicate) {
      console.log('🚫 [SOCKET] Duplicate message by content+time, skipping');
      return;
    }
      // Rule 3: Transform and add message with proper normalization
    const transformedMessage = {
      ...newMessage,
      sender: newMessage.senderId,
      reciver: newMessage.recipientId,
      messageType: newMessage.type,
      createdAt: newMessage.timestamp
    };
    
    dispatch(addMessage(transformedMessage));
    console.log('✅ [SOCKET] Added message to state');}, [dispatch, userData?._id, fetchingMessages])
  
  // Set the message handler ref so Home component can use it
  useEffect(() => {
    if (messageHandlerRef) {
      messageHandlerRef.current = handleNewMessage
    }
  }, [handleNewMessage, messageHandlerRef])
  
  // Extract socket functions from props
  const { 
    sendMessage: sendSocketMessage, 
    startTyping, 
    stopTyping, 
    isConnected, 
    onlineUsers, 
    typingUsers,
    markAsRead 
  } = socketData || {}
  
  // Keep typing function refs updated
  useEffect(() => {
    startTypingRef.current = startTyping
    stopTypingRef.current = stopTyping
  }, [startTyping, stopTyping])
  const fetchMessages = useCallback(async () => {
    if (!selectedUser?._id) return
    
    console.log('🔄 Fetching messages for:', selectedUser.name, selectedUser._id);
    setFetchingMessages(true)
    try {
      const result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
        withCredentials: true
      })
      
      const fetchedMessages = result.data || [];
      console.log('📥 Fetched', fetchedMessages.length, 'messages from database');
      
      // Clear existing messages and set new ones (prevents accumulation)
      dispatch(setMessages(fetchedMessages))
      
      console.log('✅ Messages loaded and set in Redux store');
    } catch (error) {
      console.error("Error fetching messages:", error)
      dispatch(setMessages([]))
    } finally {
      setFetchingMessages(false)
    }
  }, [selectedUser?._id, dispatch])
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      console.log('👤 Selected user changed, fetching messages for:', selectedUser.name);
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
      
      console.log('💾 HTTP response received:', result.data._id);
      
      // Simply add the HTTP response message (sender's copy)
      dispatch(addMessage(result.data));
      console.log('✅ Added HTTP message to state');
        // Send via socket for real-time delivery to other clients
      // CRITICAL: Pass database ID to socket for proper tracking
      const socketPayloadWithDbId = {
        ...socketPayload,
        dbId: result.data._id // Include database ID
      };
      const messageId = sendSocketMessage(socketPayloadWithDbId);
      
      setMessage("");
      console.log('✅ [SENT] Message via HTTP+Socket:', {
        httpId: result.data._id,
        socketId: messageId
      });
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
      <div className='flex-1 flex flex-col h-full bg-gradient-to-br from-pastel-cream via-pastel-lavender to-pastel-peach dark:from-[#181c2f] dark:via-[#2d1e60] dark:to-[#23234a] items-center justify-center'>
        <LoadingSpinner size="lg" />
        <p className="text-pastel-muted dark:text-[#b3b3ff] font-mono mt-4">Loading user data...</p>
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
    <div className={`flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-pastel-cream via-pastel-lavender to-pastel-peach dark:from-[#181c2f] dark:via-[#23234a] dark:to-[#181c2f]`}>
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <div className="grid grid-cols-20 gap-1 h-full">
          {Array.from({ length: 400 }, (_, i) => (
            <div 
              key={i} 
              className="bg-gradient-to-br from-pastel-rose via-pastel-mint to-pastel-sunny dark:from-[#39ff14] dark:via-[#ffe156] dark:to-[#ff6f3c] rounded animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>      {/* Ambient glow effects */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-pastel-rose/10 dark:bg-[#39ff14]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-pastel-coral/10 dark:bg-[#ff6f3c]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pastel-sunny/10 dark:bg-[#ffe156]/10 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 flex-1 flex flex-col h-full w-full max-w-full">
        {selectedUser ? (
          <>            {/* Terminal-style Header */}
            <div className='w-full bg-gradient-to-r from-pastel-cream via-pastel-lavender to-pastel-peach dark:from-[#23234a] dark:via-[#2d1e60] dark:to-[#23234a] border-b border-pastel-rose dark:border-[#39ff14]/30 shadow-lg'>
              <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <button 
                    className='p-2 hover:bg-pastel-peach dark:hover:bg-[#39ff14]/20 rounded-lg transition-all duration-200 group' 
                    onClick={() => dispatch(setSelectedUser(null))}
                  > 
                    <IoArrowBack className='w-6 h-6 text-pastel-rose dark:text-[#39ff14] group-hover:text-pastel-plum dark:group-hover:text-white transition-colors' />
                  </button>
                  <div className='relative'>
                    <img 
                      src={selectedUser?.image || dp} 
                      alt="Profile" 
                      className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-pastel-rose dark:border-[#39ff14] shadow-lg cursor-pointer hover:scale-105 transition-transform' 
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 dark:bg-[#39ff14] rounded-full border-2 border-white dark:border-[#23234a] animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className='text-pastel-plum dark:text-white font-bold text-lg sm:text-xl font-mono truncate max-w-[120px] sm:max-w-none'>
                      {selectedUser?.name || selectedUser?.userName || "Anonymous"}
                    </h1>
                    <p className='text-pastel-rose dark:text-[#39ff14] text-xs sm:text-sm font-mono truncate max-w-[120px] sm:max-w-none'>@{selectedUser?.github || selectedUser?.userName}</p>
                  </div>
                </div>
                {/* Terminal window controls */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-pastel-mint dark:bg-[#39ff14] rounded-full animate-pulse"></div>
                  </div>
                  <div className="ml-2 sm:ml-4 text-pastel-purple dark:text-[#b3b3ff] font-mono text-xs sm:text-sm">
                    <FiTerminal className="w-5 h-5" />
                  </div>
                </div>
              </div>
              {/* Terminal prompt bar */}
              <div className="px-2 sm:px-4 pb-2 sm:pb-3">
                <div className="bg-pastel-lavender dark:bg-[#181c2f] rounded-lg p-2 border border-pastel-rose dark:border-[#39ff14]/20">
                  <span className="text-pastel-rose dark:text-[#39ff14] font-mono text-xs sm:text-sm">
                    developer@alphachat:~$ chat --with {selectedUser?.userName || 'user'} --secure
                  </span>
                </div>
              </div>
            </div>            {/* Live Status Bar */}
            <div className="w-full flex flex-wrap items-center justify-between px-2 sm:px-4 py-2 bg-gradient-to-r from-pastel-lavender to-pastel-peach dark:from-[#23234a] dark:to-[#181c2f] border-b border-pastel-rose dark:border-[#39ff14]/20 sticky top-0 z-20 gap-2 sm:gap-0 text-xs sm:text-sm shadow-sm">
              {/* Live/Offline status */}
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${onlineUsers.includes(selectedUser?._id) ? 'bg-pastel-mint dark:bg-[#39ff14] animate-pulse' : 'bg-pastel-muted'}`}></span>
                <span className={`font-mono ${onlineUsers.includes(selectedUser?._id) ? 'text-pastel-sage dark:text-[#39ff14]' : 'text-pastel-muted dark:text-gray-400'}`}> {onlineUsers.includes(selectedUser?._id) ? 'Live' : 'Offline'} </span>
              </div>
              {/* Connection status */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 dark:bg-[#39ff14]' : 'bg-red-500'}`}></span>
                <span className="font-mono text-pastel-muted dark:text-[#b3b3ff]"> {isConnected ? 'Connected' : 'Reconnecting...'} </span>
              </div>              {/* Typing Indicator */}
              {typingUsers.includes(selectedUser?._id) && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-pastel-rose dark:bg-[#39ff14] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pastel-rose dark:bg-[#39ff14] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-pastel-rose dark:bg-[#39ff14] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-pastel-muted dark:text-[#b3b3ff] font-mono text-xs">
                    {selectedUser?.userName} is typing...
                  </span>
                </div>
              )}
              {/* Last seen */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-pastel-muted dark:text-[#b3b3ff]">Last seen:</span>
                <span className="font-mono text-pastel-sage dark:text-[#39ff14]"> {onlineUsers.includes(selectedUser?._id) ? 'Now' : (selectedUser?.lastSeen ? new Date(selectedUser.lastSeen).toLocaleString() : 'Unknown')} </span>
              </div>
            </div>            {/* Typing Indicator */}
            {typingUsers.includes(selectedUser?._id) && (
              <div className="px-2 sm:px-4 py-2 border-b border-pastel-border dark:border-[#39ff14]/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">                    <div className="w-2 h-2 bg-pastel-rose dark:bg-[#39ff14] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pastel-rose dark:bg-[#39ff14] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-pastel-rose dark:bg-[#39ff14] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-pastel-muted dark:text-[#b3b3ff] font-mono text-xs"> {selectedUser?.userName} is typing... </span>
                </div>
              </div>
            )}
            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-2 sm:p-6 space-y-4 ${isMobile ? 'pb-40' : ''}`} style={isMobile ? {paddingBottom: '180px', position: 'static'} : {paddingBottom: '180px'}}>              {fetchingMessages ? (
                <div className='flex items-center justify-center h-full'>
                  <div className="bg-pastel-cream dark:bg-[#23234a] rounded-xl p-8 border border-pastel-rose dark:border-[#39ff14]/30 shadow-lg">
                    <LoadingSpinner size="lg" />
                    <p className="text-pastel-muted dark:text-[#39ff14] font-mono mt-4 text-center">Loading chat history...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className='flex items-center justify-center h-full'>
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pastel-cream dark:bg-[#23234a] rounded-full flex items-center justify-center mb-6 mx-auto border-2 border-pastel-rose dark:border-[#39ff14]/30 shadow-lg">
                      <FiCode className="w-8 h-8 sm:w-10 sm:h-10 text-pastel-rose dark:text-[#39ff14]" />
                    </div>                    <h3 className='text-pastel-plum dark:text-white font-bold text-lg sm:text-xl font-mono mb-2'>Start Coding Together</h3>
                    <p className='text-pastel-muted dark:text-[#b3b3ff] font-mono text-sm sm:text-base'>Send your first message to begin collaboration</p>
                    <div className="mt-6 text-pastel-rose dark:text-[#39ff14] font-mono text-xs sm:text-sm opacity-60"> // No messages in buffer </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={msg._id || index} className={`flex ${msg.sender === userData._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90vw] sm:max-w-[75%] ${msg.sender === userData._id ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 sm:p-4 rounded-2xl font-mono relative ${ msg.sender === userData._id ? 'bg-gradient-to-r from-pastel-rose to-pastel-coral dark:from-[#39ff14] dark:to-[#2dd60a] text-white dark:text-[#181c2f] shadow-lg shadow-pastel-rose/30 dark:shadow-[#39ff14]/20' : 'bg-pastel-cream dark:bg-[#23234a] text-pastel-plum dark:text-white border border-pastel-border dark:border-[#39ff14]/20 shadow-lg'} ${msg.sender === userData._id ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                        {/* Message content */}
                        {msg.image && (
                          <img src={msg.image} alt="attachment" className='max-w-full rounded-lg mb-3 border border-[#39ff14]/30' />
                        )}
                        {/* Message type header */}
                        {(msg.messageType === 'code' || msg.messageType === 'terminal' || msg.type === 'code' || msg.type === 'terminal') && (                            <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${ msg.sender === userData._id ? 'border-white/20 dark:border-[#181c2f]/20' : 'border-pastel-border dark:border-[#39ff14]/20' }`}>
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
                        )}                        {/* Code syntax highlighting */}                        {(msg.messageType === 'code' || msg.type === 'code') && msg.message ? (
                          <div className="rounded-lg overflow-x-auto border border-pastel-border dark:border-[#39ff14]/20">
                            <SyntaxHighlighter
                              language={msg.metadata?.language || 'javascript'}
                              style={theme === 'dark' ? atomDark : prism}
                              customStyle={{
                                margin: 0,
                                background: msg.sender === userData._id ? (theme === 'dark' ? '#0f1419' : '#f8f9fa') : (theme === 'dark' ? '#1a1a2e' : '#ffffff'),
                                fontSize: '13px',
                                minWidth: '200px',
                                maxWidth: '80vw',
                                overflowX: 'auto',
                              }}
                            >
                              {msg.message}
                            </SyntaxHighlighter>
                          </div>                        ) : (msg.messageType === 'terminal' || msg.type === 'terminal') && msg.message ? (
                          <div className="bg-black rounded-lg p-3 border border-pastel-border dark:border-[#39ff14]/20 overflow-x-auto">
                            <div className="text-pastel-sage dark:text-[#39ff14] font-mono text-sm">
                              <span className="text-pastel-muted">$ </span>
                              {msg.message}
                            </div>
                          </div>
                        ) : msg.message && (
                          <p className='text-sm leading-relaxed whitespace-pre-wrap break-words'> {msg.message} </p>
                        )}                        {/* Timestamp and status */}                        <div className={`flex items-center justify-between mt-2 pt-2 border-t ${ msg.sender === userData._id ? 'border-white/20 dark:border-[#181c2f]/20' : 'border-pastel-border dark:border-[#39ff14]/20' }`}>
                          <p className={`text-xs font-mono ${ msg.sender === userData._id ? 'text-white/70 dark:text-[#181c2f]/70' : 'text-pastel-muted dark:text-[#b3b3ff]' }`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                          {msg.sender === userData._id && (
                            <div className="flex items-center gap-1">
                              {msg.delivered && (<span className="text-xs opacity-60">✓</span>)}
                              {msg.read && (<span className="text-xs opacity-60">✓</span>)}
                              <span className="text-xs opacity-60"> {msg.read ? 'read' : msg.delivered ? 'delivered' : 'sent'} </span>
                            </div>
                          )}
                        </div>                        {/* Message type indicator */}
                        <div className={`absolute -bottom-1 ${ msg.sender === userData._id ? '-right-1' : '-left-1' } w-3 h-3 transform rotate-45 ${ msg.sender === userData._id ? 'bg-pastel-coral dark:bg-[#39ff14]' : 'bg-pastel-cream dark:bg-[#23234a] border-r border-b border-pastel-border dark:border-[#39ff14]/20' }`}></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>            {/* Terminal-style Message Input */}
            <div className={`${isMobile ? 'relative' : 'absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4'}`}>
              <div className="bg-pastel-cream dark:bg-[#181c2f] rounded-xl border border-pastel-rose dark:border-[#39ff14]/30 shadow-2xl overflow-hidden">                {/* Terminal header */}
                <div className="bg-gradient-to-r from-pastel-lavender to-pastel-peach dark:from-[#23234a] dark:to-[#181c2f] px-2 sm:px-4 py-2 border-b border-pastel-rose dark:border-[#39ff14]/20 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0"><div className="flex items-center gap-2">                    <FiTerminal className="w-4 h-4 text-pastel-rose dark:text-[#39ff14]" />
                    <span className="text-pastel-purple dark:text-[#b3b3ff] font-mono text-xs sm:text-sm">Message Terminal</span>
                    <span className="text-pastel-rose dark:text-[#39ff14] font-mono text-xs"> [Mode: {inputMode.toUpperCase()}] </span>
                    {inputMode === 'code' && (
                      <span className="text-pastel-muted dark:text-[#b3b3ff] font-mono text-xs"> [{codeLang}] </span>
                    )}
                  </div><div className="flex gap-2 relative z-10 mt-2 sm:mt-0">
                    <button
                      type="button"                      className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 hover:scale-105 cursor-pointer select-none ${                        inputMode === 'text' 
                          ? 'bg-gradient-to-r from-pastel-rose to-pastel-coral dark:from-[#39ff14] dark:to-[#2dd60a] text-white dark:text-[#181c2f] shadow-lg shadow-pastel-rose/30 dark:shadow-[#39ff14]/30'
                          : 'bg-pastel-cream dark:bg-[#23234a] text-pastel-purple dark:text-[#b3b3ff] border border-pastel-rose dark:border-[#39ff14]/30 hover:bg-pastel-peach dark:hover:bg-[#39ff14]/10 hover:border-pastel-coral dark:hover:border-[#39ff14]/50'
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
                      type="button"                      className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 hover:scale-105 cursor-pointer select-none ${                        inputMode === 'code' 
                          ? 'bg-gradient-to-r from-pastel-mint to-pastel-sage dark:from-[#39ff14] dark:to-[#2dd60a] text-white dark:text-[#181c2f] shadow-lg shadow-pastel-mint/30 dark:shadow-[#39ff14]/30'
                          : 'bg-pastel-cream dark:bg-[#23234a] text-pastel-purple dark:text-[#b3b3ff] border border-pastel-mint dark:border-[#39ff14]/30 hover:bg-pastel-peach dark:hover:bg-[#39ff14]/10 hover:border-pastel-sage dark:hover:border-[#39ff14]/50'
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
                      type="button"                      className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 hover:scale-105 cursor-pointer select-none ${                        inputMode === 'terminal' 
                          ? 'bg-gradient-to-r from-pastel-sunny to-pastel-coral dark:from-[#39ff14] dark:to-[#2dd60a] text-white dark:text-[#181c2f] shadow-lg shadow-pastel-sunny/30 dark:shadow-[#39ff14]/30'
                          : 'bg-pastel-cream dark:bg-[#23234a] text-pastel-purple dark:text-[#b3b3ff] border border-pastel-sunny dark:border-[#39ff14]/30 hover:bg-pastel-peach dark:hover:bg-[#39ff14]/10 hover:border-pastel-coral dark:hover:border-[#39ff14]/50'
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
                        className="ml-2 px-3 py-1.5 rounded font-mono text-xs bg-pastel-lavender dark:bg-[#23234a] text-pastel-plum dark:text-[#39ff14] border border-pastel-rose dark:border-[#39ff14]/30 hover:bg-pastel-peach dark:hover:bg-[#39ff14]/10 transition-colors duration-200"
                        value={codeLang}
                        onChange={e => {
                          console.log('🔧 Language changed to:', e.target.value);
                          setCodeLang(e.target.value);
                        }}
                      >                        {languageOptions.map(lang => (
                          <option key={lang.value} value={lang.value} className="bg-pastel-lavender dark:bg-[#23234a] text-pastel-plum dark:text-[#39ff14]">
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {/* Input form */}
                <form className='p-2 sm:p-4' onSubmit={handleSendMessage}>                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
                    <span className="text-pastel-rose dark:text-[#39ff14] font-mono text-xs sm:text-sm flex-shrink-0"> {userData?.userName || 'user'}@alphachat:~$ </span>
                    {inputMode === 'code' ? (
                      <textarea
                        rows={3}
                        placeholder={`Write your ${codeLang} code here...\n// Example:\nfunction hello() {\n  console.log(\"Hello World!\");\n}`}
                        className="flex-1 bg-pastel-cream dark:bg-[#0d1117] text-pastel-plum dark:text-[#39ff14] placeholder-pastel-muted dark:placeholder-[#b3b3ff]/50 outline-none font-mono text-xs sm:text-sm p-2 sm:p-3 border-2 border-pastel-rose dark:border-[#39ff14]/30 rounded-lg resize-y min-h-[60px] max-h-[200px] focus:border-pastel-coral dark:focus:border-[#39ff14] focus:shadow-lg focus:shadow-pastel-rose/20 dark:focus:shadow-[#39ff14]/20 transition-all duration-200"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={loading}
                      />
                    ) : inputMode === 'terminal' ? (
                      <input
                        type="text"
                        placeholder="$ npm install react-syntax-highlighter"
                        className="flex-1 bg-pastel-muted dark:bg-[#000000] text-pastel-mint dark:text-[#39ff14] placeholder-pastel-muted dark:placeholder-[#666] outline-none font-mono text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-3 border-2 border-pastel-rose dark:border-[#39ff14]/30 rounded-lg focus:border-pastel-coral dark:focus:border-[#39ff14] focus:shadow-lg focus:shadow-pastel-rose/20 dark:focus:shadow-[#39ff14]/20 transition-all duration-200"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={loading}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-pastel-plum dark:text-white placeholder-pastel-muted dark:placeholder-[#b3b3ff]/50 outline-none font-mono text-xs sm:text-sm py-2 sm:py-3 px-2 border-b-2 border-pastel-rose dark:border-[#39ff14]/20 focus:border-pastel-coral dark:focus:border-[#39ff14] transition-all duration-200"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={loading}
                      />
                    )}
                    <button
                      type="submit"
                      disabled={!message.trim() || loading}
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r from-pastel-rose to-pastel-coral dark:from-[#39ff14] dark:to-[#2dd60a] text-white dark:text-[#181c2f] rounded-lg font-mono font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-pastel-rose/30 dark:hover:shadow-[#39ff14]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 dark:border-[#181c2f]/30 border-t-white dark:border-t-[#181c2f] rounded-full animate-spin"></div>
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
        ) : (          /* Welcome Screen */
          <div className='w-full h-full flex flex-col items-center justify-center gap-6 sm:gap-8 p-4 sm:p-8'>
            <div className="text-center">              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-pastel-cream dark:bg-[#23234a] rounded-full flex items-center justify-center mb-6 sm:mb-8 mx-auto border-4 border-pastel-rose dark:border-[#39ff14]/30 shadow-2xl">
                <FiMonitor className="w-12 h-12 sm:w-16 sm:h-16 text-pastel-rose dark:text-[#39ff14]" />
              </div>
              <h1 className='text-pastel-plum dark:text-white font-bold text-3xl sm:text-5xl font-mono mb-2 sm:mb-4'>
                Welcome to <span className="text-pastel-rose dark:text-[#39ff14]">Alpha</span>Chat
              </h1>              <p className='text-pastel-purple dark:text-[#b3b3ff] font-mono text-lg sm:text-xl mb-4 sm:mb-6'> Elite Developer Communication Terminal </p>
              <div className="bg-pastel-lavender dark:bg-[#181c2f] rounded-xl p-4 sm:p-6 border border-pastel-rose dark:border-[#39ff14]/20 max-w-xs sm:max-w-md mx-auto shadow-lg">
                <div className="text-pastel-rose dark:text-[#39ff14] font-mono text-xs sm:text-sm space-y-2">
                  <p>// System Status: <span className="text-pastel-plum dark:text-white">Online</span></p>
                  <p>// Connected Developers: <span className="text-pastel-plum dark:text-white">Ready</span></p>
                  <p>// Security: <span className="text-pastel-plum dark:text-white">End-to-End Encrypted</span></p>
                </div>
              </div>
              <p className='text-pastel-purple dark:text-[#b3b3ff] font-mono text-base sm:text-lg mt-6 sm:mt-8'> Select a developer from the sidebar to start coding together </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageArea
