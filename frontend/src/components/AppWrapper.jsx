import React from 'react'
import { useSelector } from 'react-redux'
import getCurrentUser from '../Hooks/getCurrentUser'
import getOtherUsers from '../Hooks/getOtherUsers'
import App from '../App'

function AppWrapper() {
  // Use the hooks properly inside a component
  getCurrentUser()
  getOtherUsers()
  
  return <App />
}

export default AppWrapper
