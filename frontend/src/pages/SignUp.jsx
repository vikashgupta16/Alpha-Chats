import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { FaUserPlus, FaCode } from 'react-icons/fa';

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
    <div className={`w-full h-screen flex items-center justify-center relative overflow-auto 
      ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#ff512f]' : 'bg-gradient-to-br from-[#181c2f] via-[#2d1e60] to-[#39ff14]'}
    `}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="grid grid-cols-16 gap-2 h-full">
          {Array.from({ length: 320 }, (_, i) => (
            <div 
              key={i} 
              className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-gradient-to-br from-[#ff512f] via-[#dd2476] to-[#1e130c]' : 'bg-[#7f53ac]'} animate-pulse`} 
              style={{ 
                animationDelay: `${i * 0.02}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      {/* Ambient glow effects */}
      <div className={`fixed top-20 right-20 w-40 h-40 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-[#ff512f]/30' : 'bg-[#7f53ac]/20'} rounded-full blur-3xl animate-pulse z-20`}></div>
      <div className={`fixed bottom-20 left-20 w-32 h-32 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-[#ffe53b]/20' : 'bg-[#39ff14]/20'} rounded-full blur-3xl animate-pulse z-20`}></div>
      <div className={`fixed top-1/2 left-1/2 w-24 h-24 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-[#1e130c]/30' : 'bg-[#39ff14]/20'} rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2 z-20`}></div>
      {/* Main signup container */}
      <div className='w-full max-w-md mx-4 relative z-10'>
        {/* Terminal window */}
        <div className={`terminal-window backdrop-blur-md ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-gradient-to-br from-[#232526]/90 via-[#1e130c]/90 to-[#ff512f]/80 border-[#ffe53b]/30' : 'bg-[#23234a]/90 border-[#39ff14]/30'} border rounded-2xl shadow-xl`}>
          {/* Terminal header */}
          <div className={`terminal-header flex items-center gap-2 px-4 py-2 border-b ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'border-[#ffe53b]/20' : 'border-[#39ff14]/20'}`}>
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
            <div className="flex-1 text-center">
              <span className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ffe53b]' : 'text-[#b3b3ff]'} font-mono text-sm`}>alpha-chat@terminal ~ register</span>
            </div>
          </div>
          {/* Content area */}
          <div className='p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaUserPlus className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ff512f]' : 'text-[#7f53ac]'} text-2xl animate-pulse`} />
                <h1 className={`text-2xl font-bold font-mono ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ffe53b]' : 'text-white'}`}>
                  Join<span className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ff512f]' : 'text-[#7f53ac]'}`}>Alpha</span><span className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ffe53b]' : 'text-[#39ff14]'}`}>Chat</span>
                </h1>
                <FaCode className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ffe53b]' : 'text-[#39ff14]'} text-2xl animate-pulse`} />
              </div>
              <p className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ff512f]' : 'text-[#b3b3ff]'} font-mono text-sm`}>
                <span className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ffe53b]' : 'text-[#39ff14]'}`}>$</span> sudo useradd --developer --group=alpha-coders
              </p>
            </div>
            <form className='w-full flex flex-col gap-[20px] px-8 mt-4' onSubmit={handleSignup}>
              <input type="text" placeholder='Username' className={`p-3 rounded border ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-[#232526] border-[#ff512f] text-[#ffe53b] placeholder-[#ff512f]/60' : 'border-gray-300'} focus:outline-none focus:ring-2 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'focus:ring-[#ff512f]' : 'focus:ring-[#20c7ff]'} transition`} onChange={(e)=>setUserName(e.target.value)} value={userName}/>
              <input type="text" placeholder='GitHub' className={`p-3 rounded border ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-[#232526] border-[#ff512f] text-[#ffe53b] placeholder-[#ff512f]/60' : 'border-gray-300'} focus:outline-none focus:ring-2 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'focus:ring-[#ff512f]' : 'focus:ring-[#20c7ff]'} transition`} onChange={(e)=>setGithub(e.target.value)} value={github}/>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className='relative flex items-center'>
                <input 
                  type={show ? "text" : "password"} 
                  placeholder='Password' 
                  className={`w-full p-3 rounded border ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-[#232526] border-[#ff512f] text-[#ffe53b] placeholder-[#ff512f]/60' : 'border-gray-300'} focus:outline-none focus:ring-2 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'focus:ring-[#ff512f]' : 'focus:ring-[#20c7ff]'} transition pr-16`}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button 
                  type="button" 
                  className={`absolute right-3 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ff512f]' : 'text-[#20c7ff]'} font-semibold text-sm hover:underline focus:outline-none`} 
                  onClick={() => setShow(s => !s)}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>    <button 
                type="submit"
                disabled={loading}
                className={`mt-2 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-[#ff512f] text-[#ffe53b] hover:bg-[#ffe53b] hover:text-[#ff512f]' : 'bg-[#20c7ff] text-white hover:bg-[#1aa6d9]'} font-bold py-3 rounded-lg shadow-md transition disabled:opacity-70`}
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </form>
            <div className='w-full flex justify-center items-center pb-4'>
              <span className={`${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ffe53b]' : 'text-gray-500'}`}>Already have an account?</span>
              <button onClick={() => navigate("/login")}
                className={`ml-2 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-[#ff512f]' : 'text-[#20c7ff]'} font-semibold hover:underline focus:outline-none bg-transparent border-none p-0 cursor-pointer`}>
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