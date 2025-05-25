import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/pp.webp'
import { MdOutlinePersonSearch } from "react-icons/md";
import { GiCrossMark } from "react-icons/gi";
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';
import { serverUrl } from '../main';
import { setSelectedUser, setOtherUsers, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';


function SideBar() {
    let {userData,otherUsers,selectedUser} = useSelector(state => state.user)
    let [search, setSearch] = useState(false)
    let [searchTerm, setSearchTerm] = useState("")
    let dispatch = useDispatch()
    let navigate = useNavigate()
    
    const filteredUsers = otherUsers?.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const handleSearch = (e) => {
        e.preventDefault()
        // Search functionality is handled by filteredUsers
    }
    
    const handelLogoout= async()=>{
      try {
        let result= await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        dispatch(setUserData(null))
        dispatch(setOtherUsers(null))
        navigate("/login")      } catch (error) {
        console.error("Error logging out:", error)
      }
    }
  return (
    <div className={`lg:w-[30%] lg:block ${!selectedUser?"block":"hidden"} w-full h-full bg-slate-200`}>
      <div className='w-[60px] h-[60px] rounded-full overflow-hidden bg-[#20c7ff] flex items-center justify-center shadow-gray-500 shadow-lg mt-[10px] fixed bottom-[20px] left-[10px]' onClick={handelLogoout}>
                <BiLogOut className='w-[25px] h-[25px] cursor-pointer'/>
            </div>
      <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]'>
        <h1 className='text-white font-bold text-[25px]'>Alpha Chats</h1>
        <div className='w-full flex justify-between items-center'>
            <h1 className='text-gray-800 font-bold text-[25px]'>α , {userData.name || "user"}</h1>
            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center shadow-gray-500 shadow-lg'>
                <img src={userData.image || dp} alt="Profile" className='h-[100%] w-[100%] object-cover cursor-pointer' onClick={()=>navigate("/profile")}/>
            </div>
        </div>
        <div className='w-full flex items-center gap-[20px]'>
            {!search && <div className='w-[60px] h-[60px] rounded-full overflow-hidden bg-white flex items-center justify-center shadow-gray-500 shadow-lg mt-[10px]' onClick={()=>setSearch(true)}>
                <MdOutlinePersonSearch className='w-[25px] h-[25px] cursor-pointer'/>
            </div>}        {search && 
            <form className='w-full h-[60px] bg-white flex items-center gap-[10px] shadow-gray-500 shadow-lg mt-[10px] rounded-full overflow-hidden px-[20px]' onSubmit={handleSearch}>
                <MdOutlinePersonSearch className='w-[25px] h-[25px]'/>
                <input 
                    type="text" 
                    placeholder='search coders...' 
                    className='w-full h-full text-[17px] outline-0 border-0'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <GiCrossMark className='w-[25px] h-[25px] cursor-pointer' onClick={()=>{setSearch(false); setSearchTerm("")}}/>
            </form>}            {!search && 
          filteredUsers?.map((user, index)=>(
              <div key={`avatar-${user._id || index}`} className='w-[60px] mt-[10px] h-[60px] rounded-full overflow-hidden flex items-center justify-center shadow-gray-500 shadow-lg'>
                <img src={user.image || dp} alt="Profile" className='h-[100%] w-[100%] object-cover' />
            </div>
            ))}
            
        </div>
      </div>
      <div className='w-full h-[60vh] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]'>        {(search ? filteredUsers : otherUsers)?.map((user)=>(
          <div key={user._id} className='w-[95%] h-[60px] flex  items-center gap-[20px] bg-white shadow-gray-500 shadow-lg rounded-full hover:bg-[#d4d6ea] cursor-pointer' onClick={()=>dispatch(setSelectedUser(user))}>
              <div className='w-[60px]  h-[60px] rounded-full overflow-hidden flex items-center justify-center shadow-gray-500 shadow-lg'>
                <img src={user.image || dp} alt="Profile" className='h-[100%] w-[100%] object-cover' />
            </div>
            <h1 className='text-gray-800 font-semibold text-[20px]'>{user.name || user.userName}</h1>
            </div>
            ))}
      </div>
    </div>
  )
}

export default SideBar
