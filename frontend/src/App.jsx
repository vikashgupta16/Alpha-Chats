import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import getCurrentUser from './Hooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import getOtherUsers from './Hooks/getOtherUsers'

function App() {
  getCurrentUser()
  getOtherUsers()
  let {userData}=useSelector(state=>state.user)
  return (
    <Routes>
      <Route path='/login' element={!userData?<Login />:<Navigate to="/"/>} />
      <Route path='/signup' element={!userData?<SignUp />:<Navigate to="/profile"/>} />
      <Route path='/' element={userData?<Home />:<Navigate to="/login"/>} />
      <Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup" />} />
    </Routes>
  )
}


export default App