import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const useSocket = (onMessageReceived) => {
  const socketRef = useRef(null)
  const { userData } = useSelector(state => state.user)
  const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000"

  useEffect(() => {
    if (userData?._id) {      // Initialize socket connection
      socketRef.current = io(socketUrl, {
        withCredentials: true
      })

      const socket = socketRef.current

      // Join user to their room
      socket.emit('user-login', userData._id)

      // Listen for new messages
      socket.on('new-message', (message) => {
        if (onMessageReceived) {
          onMessageReceived(message)
        }
      })

      // Listen for real-time message delivery
      socket.on('receive-message', (message) => {
        if (onMessageReceived) {
          onMessageReceived(message)
        }
      })

      return () => {
        socket.disconnect()
        socketRef.current = null
      }
    }
  }, [userData?._id, onMessageReceived])

  const sendMessage = (messageData) => {
    if (socketRef.current) {
      socketRef.current.emit('send-message', messageData)
    }
  }

  return { sendMessage }
}

export default useSocket
