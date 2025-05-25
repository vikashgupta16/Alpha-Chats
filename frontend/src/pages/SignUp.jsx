import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';


function SignUp() {
      let navigate = useNavigate();
      let [show,setShow] = useState(false)
      let [userName,setUserName]= useState("")
      let [github,setGithub]= useState("")
      let [password,setPassword]= useState("")
      let [loading,setLoading]= useState(false)
      let [error,setError]= useState("")
      let dispatch = useDispatch()

      const validateForm = () => {
        if (!userName.trim()) {
          setError("Username is required")
          return false
        }
        if (userName.trim().length < 3) {
          setError("Username must be at least 3 characters")
          return false
        }
        if (!github.trim()) {
          setError("GitHub username is required")
          return false
        }
        if (!password.trim()) {
          setError("Password is required")
          return false
        }        if (password.length < 6) {
          setError("Password must be at least 6 characters")
          return false
        }
        return true
      }

      const handleSignup = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
          return
        }
        
        setLoading(true)
        try {
          let result = await axios.post(`${serverUrl}/api/auth/signup`, {
            userName: userName.trim(),
            github: github.trim(),
            password
          }, { withCredentials: true })
          dispatch(setUserData(result.data))
          navigate("/profile")
          setUserName("")
          setGithub("")
          setPassword("")
          setLoading(false)
          setError("")} catch (error) {
          console.error("Signup error:", error)
          setError(error.response?.data?.message || "Signup failed. Please try again.")
          setLoading(false)
        }
      }

  return (
  <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
    <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]'>
  <div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center justify-center'>
    <h1 className='text-gray-600 font-bold text-[30px]'>
      Welcome <span className='text-white'>Alpha Coders</span>
    </h1>
  </div>  <form className='w-full flex flex-col gap-[20px] px-8 mt-4' onSubmit={handleSignup}>
    <input type="text" placeholder='Username' className='p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c7ff] transition'onChange={(e)=>setUserName(e.target.value)} value={userName}/>
    <input type="text" placeholder='GitHub' className='p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c7ff] transition'onChange={(e)=>setGithub(e.target.value)} value={github}/>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    <div className='relative flex items-center'>
      <input 
        type={show ? "text" : "password"} 
        placeholder='Password' 
        className='w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c7ff] transition pr-16'
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button 
        type="button" 
        className='absolute right-3 text-[#20c7ff] font-semibold text-sm hover:underline focus:outline-none' 
        onClick={() => setShow(s => !s)}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>    <button 
      type="submit"
      disabled={loading}
      className='mt-2 bg-[#20c7ff] text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#1aa6d9] transition disabled:opacity-70'
    >
      {loading ? "Loading..." : "Sign Up"}
    </button>
  </form>
  <div className='w-full flex justify-center items-center pb-4'>
    <span className='text-gray-500'>Already have an account?</span>
    <button onClick={() => navigate("/login")}
      className='ml-2 text-[#20c7ff] font-semibold hover:underline focus:outline-none bg-transparent border-none p-0 cursor-pointer'>
      Login
    </button>
  </div>
</div>

  </div>
)

}

export default SignUp