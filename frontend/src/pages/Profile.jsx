import React from 'react'
import dp from '../assets/pp.webp'
import { FaCamera } from "react-icons/fa";
function Profile() {
  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center'>
        <div className='w-[200px] h-[200px] bg-white rounded-full border-2 border-[#20c7ff] shadow-gray-400 shadow-lg'>
          <img src={dp} alt="Profile" className='w-full h-full rounded-full object-cover overflow-hidden'/>
          <div>
            <FaCamera className='absolute'/>
          </div>
        </div>
        <form ></form>
    </div>
  )
}

export default Profile