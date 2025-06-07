import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../config/constants';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { FaUserPlus, FaCode } from 'react-icons/fa';
import { useTheme } from '../components/ThemeContext';

function SignUp() {
      const { theme } = useTheme();
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
    <div className='w-full h-screen flex items-center justify-center relative overflow-auto bg-gradient-to-br from-gray-100 via-white to-blue-100 dark:from-[#0f2027] dark:via-[#2c5364] dark:to-[#ff512f]'>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="grid grid-cols-16 gap-2 h-full">
          {Array.from({ length: 320 }, (_, i) => (
            <div 
              key={i} 
              className="bg-purple-500 dark:bg-gradient-to-br dark:from-[#ff512f] dark:via-[#dd2476] dark:to-[#1e130c] animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.02}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      {/* Ambient glow effects */}
      <div className="fixed top-20 right-20 w-40 h-40 bg-purple-500/30 dark:bg-[#ff512f]/30 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed bottom-20 left-20 w-32 h-32 bg-yellow-500/20 dark:bg-[#ffe53b]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed top-1/2 left-1/2 w-24 h-24 bg-orange-500/20 dark:bg-[#1e130c]/30 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
      {/* Main signup container */}
      <div className='w-full max-w-md mx-4 relative z-10'>
        {/* Terminal window */}
        <div className="terminal-window backdrop-blur-md bg-white/90 dark:bg-gradient-to-br dark:from-[#232526]/90 dark:via-[#1e130c]/90 dark:to-[#ff512f]/80 border border-blue-300 dark:border-[#ffe53b]/30 rounded-2xl shadow-xl">
          {/* Terminal header */}
          <div className="terminal-header flex items-center gap-2 px-4 py-2 border-b border-blue-300 dark:border-[#ffe53b]/20">
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
            <div className="flex-1 text-center">
              <span className="text-gray-600 dark:text-[#ffe53b] font-mono text-sm">alpha-chat@terminal ~ register</span>
            </div>
          </div>
          {/* Content area */}
          <div className='p-8'>            {/* Header */}
            <div className='text-center mb-8'>
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaUserPlus className="text-purple-600 dark:text-[#ff512f] text-2xl animate-pulse" />
                <h1 className="text-2xl font-bold font-mono text-gray-900 dark:text-[#ffe53b]">
                  Join<span className="text-purple-600 dark:text-[#ff512f]">Alpha</span><span className="text-blue-600 dark:text-[#ffe53b]">Chat</span>
                </h1>
                <FaCode className="text-blue-600 dark:text-[#ffe53b] text-2xl animate-pulse" />
              </div>
              <p className="text-gray-600 dark:text-[#ff512f] font-mono text-sm">
                <span className="text-blue-600 dark:text-[#ffe53b]">$</span> sudo useradd --developer --group=alpha-coders
              </p>
            </div>
            <form className='w-full flex flex-col gap-[20px] px-8 mt-4' onSubmit={handleSignup}>
              <input type="text" placeholder='Username' className="p-3 rounded border bg-gray-100 dark:bg-[#232526] border-blue-300 dark:border-[#ff512f] text-gray-900 dark:text-[#ffe53b] placeholder-gray-500 dark:placeholder-[#ff512f]/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#ff512f] transition font-mono" onChange={(e)=>setUserName(e.target.value)} value={userName}/>
              <input type="text" placeholder='GitHub' className="p-3 rounded border bg-gray-100 dark:bg-[#232526] border-blue-300 dark:border-[#ff512f] text-gray-900 dark:text-[#ffe53b] placeholder-gray-500 dark:placeholder-[#ff512f]/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#ff512f] transition font-mono" onChange={(e)=>setGithub(e.target.value)} value={github}/>
              {error && <p className="text-red-500 text-sm font-mono animate-pulse">{error}</p>}
              <div className='relative flex items-center'>
                <input 
                  type={show ? "text" : "password"} 
                  placeholder='Password' 
                  className="w-full p-3 rounded border bg-gray-100 dark:bg-[#232526] border-blue-300 dark:border-[#ff512f] text-gray-900 dark:text-[#ffe53b] placeholder-gray-500 dark:placeholder-[#ff512f]/60 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#ff512f] transition pr-16 font-mono"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button 
                  type="button" 
                  className="absolute right-3 text-blue-600 dark:text-[#ff512f] font-semibold text-sm hover:text-blue-800 dark:hover:underline focus:outline-none font-mono" 
                  onClick={() => setShow(s => !s)}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="mt-2 bg-blue-600 dark:bg-[#ff512f] text-white dark:text-[#ffe53b] hover:bg-blue-700 dark:hover:bg-[#ffe53b] dark:hover:text-[#ff512f] font-bold py-3 rounded-lg shadow-md transition disabled:opacity-70 font-mono"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </form>
            <div className='w-full flex justify-center items-center pb-4'>
              <span className="text-gray-600 dark:text-[#ffe53b] font-mono">Already have an account?</span>
              <button onClick={() => navigate("/login")}
                className="ml-2 text-blue-600 dark:text-[#ff512f] font-semibold hover:text-blue-800 dark:hover:underline focus:outline-none bg-transparent border-none p-0 cursor-pointer font-mono">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default SignUp