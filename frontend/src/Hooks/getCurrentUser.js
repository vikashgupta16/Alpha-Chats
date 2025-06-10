import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../config/constants"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"

const getCurrentUser = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log('🔍 [getCurrentUser] Fetching current user...')
                const result = await axios.get(`${serverUrl}/api/user/current`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log('✅ [getCurrentUser] User fetched successfully:', result.data)
                dispatch(setUserData(result.data))
            } catch (error) {
                console.error("❌ [getCurrentUser] Error fetching current user:", error)
                console.error("Response status:", error.response?.status)
                console.error("Response data:", error.response?.data)
                // Clear user data on authentication failure
                dispatch(setUserData(null))
            }
        }
        fetchUser()
    }, [dispatch])
    
    return userData
}

export default getCurrentUser
