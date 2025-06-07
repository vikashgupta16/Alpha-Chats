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
                const result = await axios.get(`${serverUrl}/api/user/current`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                dispatch(setUserData(result.data))
                console.log("User authenticated successfully:", result.data)
            } catch (error) {
                console.error("Error fetching current user:", error)
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
