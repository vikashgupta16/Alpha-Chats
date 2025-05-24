import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Login() {
  const [show, setShow] = useState(false);
  let navigate = useNavigate();
  //let [userName,setUserName]= useState("")
  let [github,setGithub]= useState("")
  let [password,setPassword]= useState("")
  let [error, setError] = useState("");
  let [loading,setLoading]= useState(false)
  let dispatch = useDispatch()

      const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          setError("");
          let result = await axios.post(`${serverUrl}/api/auth/login`, {
            github,
            password
          }, { withCredentials: true })
          dispatch(setUserData(result.data))
          navigate("/")
          console.log(result)
            setGithub("")
            setPassword("")
            setLoading(false)
        } catch (error) {
          console.log(error)
          setError(error.response?.data?.message || "Login failed. Please try again.");
        }
      }
  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
      <div className='w-full max-w-[500px] h-[500px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]'>
        <div className='w-full h-[150px] bg-[#20c7ff] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center justify-center'>
          <h1 className='text-gray-600 font-bold text-[30px]'>
            Welcome Back <span className='text-white'>Alpha Coders</span>
          </h1>
        </div>
        <form className='w-full flex flex-col gap-[20px] px-8 mt-4' onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder='Username or GitHub' 
            className='p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#20c7ff] transition' 
            onChange={(e)=>setGithub(e.target.value)}
            value={github}
          />
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
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className='mt-2 bg-[#20c7ff] text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#1aa6d9] transition disabled:opacity-70'
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className='w-full flex justify-center items-center pb-4'>
          <span className='text-gray-500'>Don't have an account?</span>
          <button onClick={() => navigate("/signup")}
            className='ml-2 text-[#20c7ff] font-semibold hover:underline focus:outline-none bg-transparent border-none p-0 cursor-pointer'>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login