import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import dp from '../assets/pp.webp'
import { MdOutlinePersonSearch } from "react-icons/md";
import { GiCrossMark } from "react-icons/gi";


function SideBar() {
    let {userData} = useSelector(state => state.user)
    let [search, setSearch] = useState(false)
  return (
    <div className='lg:w-[30%] w-full h-full bg-slate-200'>
      <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30px] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]'>
        <h1 className='text-white font-bold text-[25px]'>Alpha Chats</h1>
        <div className='w-full flex justify-between items-center'>
            <h1 className='text-gray-800 font-bold text-[25px]'>α , {userData.name}</h1>
            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center shadow-gary-500 shadow-lg'>
                <img src={userData.image || dp} alt="Profile" className='h-[100%] w-[100%] object-cover' />
            </div>
        </div>
        <div>
            {!search && <div className='w-[60px] h-[60px] rounded-full overflow-hidden bg-white flex items-center justify-center shadow-gary-500 shadow-lg mt-[10px]' onClick={()=>setSearch(true)}>
                <MdOutlinePersonSearch className='w-[25px] h-[25px] cursor-pointer'/>
            </div>}
        {search && 
            <form className='w-full h-[60px] bg-white flex items-center gap-[10px] shadow-gary-500 shadow-lg mt-[10px] rounded-full overflow-hidden px-[20px]' >
                <MdOutlinePersonSearch className='w-[25px] h-[25px]'/>
                <input type="text" placeholder='search coders...' className='w-full h-full text-[17px] outline-0 border-0'/>
                <GiCrossMark className='w-[25px] h-[25px] cursor-pointer' onClick={()=>setSearch(false)}/>
            </form>} 
        </div>
      </div>
    </div>
  )
}

export default SideBar
