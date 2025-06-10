import axios from "axios"
import { useEffect, useRef } from "react"
import { serverUrl } from "../config/constants"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers } from "../redux/userSlice"

const getOtherUsers = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const retryAttempts = useRef(0)
    const maxRetries = 3
    
    useEffect(() => {
        const fetchUsers = async () => {
            if (!userData) {
                console.log('🚫 [getOtherUsers] No userData, skipping fetch')
                return
            }
            
            try {
                console.log('👥 [getOtherUsers] Fetching other users... (attempt', retryAttempts.current + 1, ')')
                console.log('🔍 [getOtherUsers] User authenticated as:', userData._id)
                
                // 🔧 DEBUG: Check cookies before making request
                console.log('🍪 [getOtherUsers] Current cookies:', document.cookie)
                console.log('🌐 [getOtherUsers] Current domain:', window.location.hostname)
                console.log('🔗 [getOtherUsers] Server URL:', serverUrl)
                
                const result = await axios.get(`${serverUrl}/api/user/others`, {
                    withCredentials: true,
                    timeout: 10000, // 10 second timeout
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                })
                
                console.log('📡 [getOtherUsers] API Response:', {
                    status: result.status,
                    dataLength: result.data?.length,
                    data: result.data
                })
                
                if (result.data && Array.isArray(result.data)) {
                    console.log('✅ [getOtherUsers] Successfully fetched', result.data.length, 'users')
                    dispatch(setOtherUsers(result.data))
                    retryAttempts.current = 0 // Reset retry counter on success
                } else {
                    console.warn('⚠️ [getOtherUsers] Received invalid users data:', result.data)
                    dispatch(setOtherUsers([]))
                }
                
            } catch (error) {
                console.error("❌ [getOtherUsers] Error fetching other users:", error)
                console.error("❌ [getOtherUsers] Error details:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                })
                
                // 🔧 DEBUG: Additional debugging for auth errors
                if (error.response?.status === 401) {
                    console.log('🚨 [getOtherUsers] Authentication failed! Debugging...')
                    console.log('🍪 Cookies at error time:', document.cookie)
                    console.log('📊 Redux userData:', userData)
                    
                    // Try a test request with fetch to compare
                    try {
                        const testResponse = await fetch(`${serverUrl}/api/user/others`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        console.log('🧪 Test fetch response status:', testResponse.status)
                    } catch (testError) {
                        console.log('🧪 Test fetch also failed:', testError)
                    }
                }
                
                // Retry logic for network issues
                if (retryAttempts.current < maxRetries) {
                    retryAttempts.current++
                    const retryDelay = retryAttempts.current * 2000 // Exponential backoff
                    
                    console.log(`🔄 [getOtherUsers] Retrying in ${retryDelay}ms... (attempt ${retryAttempts.current}/${maxRetries})`)
                    
                    setTimeout(() => {
                        fetchUsers()
                    }, retryDelay)
                } else {
                    console.error('💥 [getOtherUsers] Max retry attempts reached. Setting empty users list.')
                    dispatch(setOtherUsers([]))
                    
                    // Show user-friendly error message
                    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
                        console.warn('🌐 Network connectivity issue detected. Please check your internet connection.')
                    } else if (error.response?.status === 401) {
                        console.warn('🔒 Authentication expired. Please refresh the page and login again.')
                    } else if (error.response?.status >= 500) {
                        console.warn('🔧 Server error. Please try refreshing the page.')
                    }
                }
            }
        }
        
        // Initial fetch
        console.log('🎯 [getOtherUsers] Effect triggered, userData:', !!userData)
        fetchUsers()
        
        // Set up periodic refresh every 30 seconds to ensure users list stays updated
        const intervalId = setInterval(() => {
            if (userData && retryAttempts.current === 0) { // Only refresh if not currently retrying
                console.log('🔄 [getOtherUsers] Periodic refresh triggered')
                fetchUsers()
            }
        }, 30000)
        
        return () => {
            clearInterval(intervalId)
        }
    }, [userData, dispatch])
    
    return null
}

export default getOtherUsers