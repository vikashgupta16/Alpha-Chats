import React, { useState, useEffect, useCallback, useRef } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import dp from '../assets/pp.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, setMessages, addMessage } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../main';
import useSocket from '../hooks/useSocket';
import LoadingSpinner from './LoadingSpinner';


function MessageArea() {
  let {selectedUser, userData, messages} = useSelector(state => state.user)
  let dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingMessages, setFetchingMessages] = useState(false)
  const messagesEndRef = useRef(null)
  // Handle real-time messages
  const handleNewMessage = useCallback((newMessage) => {
    if (selectedUser && (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id)) {
      dispatch(addMessage(newMessage))
    }
  }, [selectedUser, dispatch])
  const { sendMessage: sendSocketMessage } = useSocket(handleNewMessage)
  
  const fetchMessages = useCallback(async () => {
    setFetchingMessages(true)
    try {
      const result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
        withCredentials: true
      })
      dispatch(setMessages(result.data || []))
    } catch (error) {
      console.error("Error fetching messages:", error)
      dispatch(setMessages([]))    } finally {
      setFetchingMessages(false)
    }
  }, [selectedUser._id, dispatch])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages()
    }
  }, [selectedUser, fetchMessages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (message.trim() && selectedUser?._id) {
      setLoading(true)
      try {        const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, {
          message: message.trim()
        }, {withCredentials: true})
        
        dispatch(addMessage(result.data))
        
        // Send via socket for real-time delivery
        sendSocketMessage({
          ...result.data,
          receiver: selectedUser._id
        })
        
        setMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
        alert("Failed to send message. Please try again.")
      } finally {
        setLoading(false)
      }    }
  }

  return (
    <div className={`lg:w-[70%] w-full h-full bg-slate-200 border-l-2 relative border-gray-300 ${selectedUser ? "flex" : "hidden"} lg:flex flex-col`}>
      {selectedUser ? (
        <>
          {/* Header */}
          <div className='w-full h-[100px] bg-[#1b9fcb] rounded-b-[30px] shadow-gray-400 shadow-lg gap-[20px] flex items-center px-[20px]'>
            <div className='cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}> 
              <IoArrowBack className='w-[40px] h-[40px] text-white' />
            </div>
            <div className='w-[45px] h-[45px] rounded-full overflow-hidden flex items-center justify-center shadow-gray-500 shadow-lg'>
              <img src={selectedUser?.image || dp} alt="Profile" className='h-[100%] w-[100%] object-cover cursor-pointer' />
            </div>
            <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.name || selectedUser?.userName || "user"}</h1>
          </div>

          {/* Messages Area */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4' style={{paddingBottom: '120px'}}>
            {fetchingMessages ? (
              <div className='flex items-center justify-center h-full'>
                <LoadingSpinner size="lg" />
              </div>
            ) : messages.length === 0 ? (
              <div className='flex items-center justify-center h-full'>
                <p className='text-gray-500 text-lg'>No messages yet. Start a conversation!</p>
              </div>
            ) : (              messages.map((msg, index) => (
                <div key={msg._id || index} className={`flex ${msg.sender === userData._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === userData._id 
                      ? 'bg-[#1797c2] text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                  }`}>
                    {msg.image && (
                      <img src={msg.image} alt="attachment" className='max-w-full rounded mb-2' />
                    )}
                    {msg.message && <p className='text-sm'>{msg.message}</p>}
                    <p className={`text-xs mt-1 ${msg.sender === userData._id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <div className='absolute bottom-[20px] left-0 right-0 flex items-center justify-center px-4'>
            <form className='w-[95%] max-w-[600px] h-[60px] bg-[#1797c2] rounded-full shadow-gray-400 shadow-lg flex items-center px-4 gap-3' onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-white placeholder-blue-200 outline-none text-lg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <IoSend className="w-5 h-5 text-[#1797c2]" />
                )}
              </button>
            </form>
          </div>
        </>
      ) : (
        /* Welcome Screen */
        <div className='w-full h-full flex flex-col items-center justify-center gap-[20px]'>
          <h1 className='text-gray-700 font-bold text-[50px]'>Welcome Coders</h1>
          <span className='text-gray-700 font-semibold text-[30px]'>Elite Programmers!</span>
        </div>
      )}
    </div>
  )
}

export default MessageArea
