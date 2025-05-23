import React from 'react'
import dp from '../assets/pp.webp'
import { IoCameraOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';

function Profile() {
  let {userData} =useSelector(state=>state.user)
  console.log('userData:', userData);

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[20px]'>
      <div className=' bg-white rounded-full  border-4 border-[#20c7ff] shadow-gray-400 shadow-lg  relative '>
        <div className='w-[200px] h-[200px] rounded-full overflow-hidden'>
          <img src={dp} alt="" className='h-[100%] '/>
        </div>
        <IoCameraOutline className='absolute bottom-4 right-5 w-[28px] h-[28px] text-gray-700'/>
      </div>
      <form className='w-[95%]  max-w-[500px] flex flex-col gap-[20px] items-center justify-center'>
        <input type="text" placeholder='Enter your name' className='w-[90%] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]'/>
        <input type="text" readOnly className='w-[90%] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]' value={userData?.user?.userName}/>
        <input type="text" readOnly className='w-[90%] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]' value={userData?.user?.github}/>
        <button>Save Profile</button>
      </form>
    </div>
  )
}

export default Profile;
