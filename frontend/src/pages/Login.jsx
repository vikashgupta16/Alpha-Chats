import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { FaTerminal, FaCode } from 'react-icons/fa';

function Login() {  const [show, setShow] = useState(false);
  let navigate = useNavigate();
  let [github,setGithub]= useState("")
  let [password,setPassword]= useState("")
  let [error, setError] = useState("");
  let [loading,setLoading]= useState(false)
  let dispatch = useDispatch()
  const validateForm = () => {
    if (!github.trim()) {
      setError("GitHub username is required")
      return false
    }
    if (!password.trim()) {
      setError("Password is required")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    return true
  }

  const handleLogin = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
          return
        }
        
        setLoading(true)
        try {
          setError("");          let result = await axios.post(`${serverUrl}/api/auth/login`, {
            github: github.trim(),
            password
          }, { withCredentials: true })
          dispatch(setUserData(result.data))
          navigate("/")
          setGithub("")
          setPassword("")
          setLoading(false)
        } catch (error) {
          console.error("Login error:", error)
          setError(error.response?.data?.message || "Login failed. Please try again.")
          setLoading(false)
        }
      }
  return (
    <div className='w-full h-screen flex items-center justify-center relative overflow-auto bg-gradient-to-br from-[#181c2f] via-[#2d1e60] to-[#39ff14]'>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="grid grid-cols-20 gap-1 h-full">
          {Array.from({ length: 400 }, (_, i) => (
            <div 
              key={i} 
              className="bg-[#39ff14] animate-pulse" 
              style={{ 
                animationDelay: `${i * 0.01}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      {/* Ambient glow effects */}
      <div className="fixed top-20 left-20 w-40 h-40 bg-[#39ff14]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed bottom-20 right-20 w-32 h-32 bg-[#7f53ac]/20 rounded-full blur-3xl animate-pulse z-20"></div>
      <div className="fixed top-1/2 left-1/2 w-24 h-24 bg-[#7f53ac]/20 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
      {/* Main login container */}
      <div className='w-full max-w-md mx-4 relative z-10'>
        {/* Terminal window */}
        <div className='terminal-window backdrop-blur-md bg-[#23234a]/90 border border-[#39ff14]/30 rounded-2xl shadow-xl'>
          {/* Terminal header */}
          <div className='terminal-header flex items-center gap-2 px-4 py-2 border-b border-[#39ff14]/20'>
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
            <div className="flex-1 text-center">
              <span className="text-[#b3b3ff] font-mono text-sm">alpha-chat@terminal ~ login</span>
            </div>
          </div>
          {/* Content area */}
          <div className='p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaTerminal className="text-[#39ff14] text-2xl animate-pulse" />
                <h1 className='text-2xl font-bold font-mono text-white'>
                  Alpha<span className='text-[#39ff14]'>Chat</span>
                </h1>
                <FaCode className="text-[#7f53ac] text-2xl animate-pulse" />
              </div>
              <p className="text-[#b3b3ff] font-mono text-sm">
                <span className="text-[#39ff14]">$</span> sudo login --developer-mode
              </p>
            </div>            <form className='w-full flex flex-col gap-[20px] px-8 mt-4' onSubmit={handleLogin}>
              <input 
                type="text" 
                placeholder='Username or GitHub' 
                className='p-3 rounded-lg bg-[#181c2f]/70 border border-[#39ff14]/30 text-white placeholder-[#b3b3ff] focus:outline-none focus:ring-2 focus:ring-[#39ff14] focus:border-[#39ff14] transition font-mono' 
                onChange={(e)=>setGithub(e.target.value)}
                value={github}
              />
              {error && <p className="text-[#ff6f3c] text-sm font-mono animate-pulse">{error}</p>}
              <div className='relative flex items-center'>
                <input 
                  type={show ? "text" : "password"} 
                  placeholder='Password' 
                  className='w-full p-3 rounded-lg bg-[#181c2f]/70 border border-[#39ff14]/30 text-white placeholder-[#b3b3ff] focus:outline-none focus:ring-2 focus:ring-[#39ff14] focus:border-[#39ff14] transition font-mono pr-16'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button 
                  type="button" 
                  className='absolute right-3 text-[#39ff14] font-semibold text-sm hover:text-[#ffe156] focus:outline-none transition font-mono' 
                  onClick={() => setShow(s => !s)}
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className='mt-2 bg-gradient-to-r from-[#39ff14] to-[#ffe156] text-[#181c2f] font-bold py-3 rounded-lg shadow-md hover:from-[#ffe156] hover:to-[#ff6f3c] transition disabled:opacity-70 font-mono transform hover:scale-105'
              >
                {loading ? "Initializing..." : "Access Granted"}
              </button>
            </form>
            <div className='w-full flex justify-center items-center pb-4'>
              <span className='text-[#b3b3ff] font-mono'>Need access credentials?</span>
              <button onClick={() => navigate("/signup")}
                className='ml-2 text-[#39ff14] font-semibold hover:text-[#ffe156] focus:outline-none bg-transparent border-none p-0 cursor-pointer font-mono transition'>
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login