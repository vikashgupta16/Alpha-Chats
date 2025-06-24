import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../config/constants"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { AuthManager } from "../utils/auth"

const getCurrentUser = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
      useEffect(() => {
        const fetchUser = async () => {
            try {
                // Check if we have any authentication data before making the request
                if (!AuthManager.isAuthenticated()) {
                    console.log('� [getCurrentUser] No authentication data found, skipping fetch');
                    dispatch(setUserData(null));
                    return;
                }

                console.log('🔍 [getCurrentUser] Fetching current user...');
                const result = await AuthManager.validateSession();
                
                if (result) {
                    console.log('✅ [getCurrentUser] User session validated successfully:', result);
                    dispatch(setUserData(result));
                } else {
                    console.log('⚠️ [getCurrentUser] Session validation failed');
                    dispatch(setUserData(null));
                }
            } catch (error) {
                console.error("❌ [getCurrentUser] Error fetching current user:", error);
                console.error("Response status:", error.response?.status);
                console.error("Response data:", error.response?.data);
                // Clear user data on authentication failure
                dispatch(setUserData(null));
            }
        }
        fetchUser()
    }, [dispatch])
    
    return userData
}

export default getCurrentUser
