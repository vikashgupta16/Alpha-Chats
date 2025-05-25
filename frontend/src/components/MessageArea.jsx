import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import dp from '../assets/pp.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';


function MessageArea() {
  let {selectedUser} = useSelector(state => state.user)
  let dispatch = useDispatch()
  return (
   <div className={`lg:w-[70%] w-full h-full bg-slate-200 border-l-2 border-gray-300 ${selectedUser ? "flex" : "hidden"} lg:flex`}>
      {selectedUser && 
      <div className='w-full h-[100px] bg-[#1b9fcb] rounded-b-[30px] shadow-gray-400 shadow-lg gap-[20px] flex items-center px-[20px]'>
          <div className='cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}> 
                  <IoArrowBack className='w-[40px] h-[40px] text-white' />
          </div>
        <div className='w-[45px] h-[45px] rounded-full overflow-hidden flex items-center justify-center shadow-gray-500 shadow-lg'>
            <img src={ selectedUser?.image || dp} alt="Profile" className='h-[100%] w-[100%] object-cover cursor-pointer' />
        </div>
        <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.name || selectedUser?.userName || "user"}</h1>
      </div>}

      {!selectedUser && 
      <div className='w-full h-full flex flex-col items-center justify-center gap-[20px]'>
        <h1 className='text-gray-700 font-bold text-[50px]'>Welcome Coders</h1>
        <span className='text-gray-700 font-semibold text-[30px]' >Elite Programmers!</span>
      </div>}
      
    </div>
  )
}

export default MessageArea
