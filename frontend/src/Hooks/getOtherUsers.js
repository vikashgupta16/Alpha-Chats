import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../config/constants"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers } from "../redux/userSlice"

const getOtherUsers = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/others`, {
                    withCredentials: true
                })
                dispatch(setOtherUsers(result.data))
            } catch (error) {
                console.error("Error fetching other users:", error)
            }
        }
        if (userData) {
            fetchUsers()
        }
    }, [userData, dispatch])
    
    return null
}

export default getOtherUsers