import React, { useState } from 'react'
import dp from '../assets/pp.webp'
import { FaCamera } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../main'
import { setUserData } from '../redux/userSlice'

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const [editName, setEditName] = useState(userData?.name || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const res = await axios.put(`${serverUrl}/api/user/current`, { name: editName }, { withCredentials: true });
      setSuccess("Name updated successfully!");
      dispatch(setUserData({ ...userData, name: editName }));
    } catch (err) {
      setError("Failed to update name.");
    }
    setSaving(false);
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] flex flex-col items-center'>
      <div className='w-full flex items-start justify-start mt-8 mb-4 px-8'>
        <button
          className='flex items-center gap-2 text-[#20c7ff] hover:text-[#1ba6d6] text-lg font-semibold transition'
          onClick={() => navigate("/")}
        >
          <IoIosArrowBack className='text-2xl' />
          <span>Back</span>
        </button>
      </div>
      <div className='relative w-56 h-56 mb-8 shadow-xl rounded-full bg-white flex items-center justify-center border-8 border-[#20c7ff]'>
        <img src={dp} alt="Profile" className='w-full h-full rounded-full object-cover' />
        <button className='absolute bottom-4 right-4 bg-[#20c7ff] p-3 rounded-full shadow-lg hover:bg-[#1ba6d6] transition border-4 border-white'>
          <FaCamera className='text-white text-2xl' />
        </button>
      </div>
      {/* Editable Name Section */}
      <form onSubmit={handleNameChange} className='bg-white/90 p-10 rounded-2xl shadow-2xl flex flex-col gap-8 w-96 border border-[#b2ebf2] mb-6'>
        <div className='flex flex-col gap-2'>
          <label htmlFor="editName" className='text-gray-700 font-bold text-lg'>Edit Name</label>
          <input id="editName" type="text" placeholder="Enter your name" className='border-2 border-[#20c7ff] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1ba6d6] text-gray-800 text-base bg-[#f0fafd] font-medium' value={editName} onChange={e => setEditName(e.target.value)} />
        </div>
        <button type="submit" disabled={saving} className='bg-gradient-to-r from-[#20c7ff] to-[#1ba6d6] text-white font-bold py-3 rounded-xl shadow-lg hover:from-[#1ba6d6] hover:to-[#20c7ff] transition text-lg tracking-wide disabled:opacity-60'>
          {saving ? "Saving..." : "Save Name"}
        </button>
        {success && <p className='text-green-600 text-center'>{success}</p>}
        {error && <p className='text-red-600 text-center'>{error}</p>}
      </form>
      {/* Profile Info Display */}
      <div className='bg-white/90 p-10 rounded-2xl shadow-2xl flex flex-col gap-8 w-96 border border-[#b2ebf2]'>
        <div className='flex flex-col gap-2'>
          <label htmlFor="username" className='text-gray-700 font-bold text-lg'>Username</label>
          <input id="username" type="text" className='border-2 border-[#20c7ff] rounded-xl px-4 py-3 text-gray-800 text-base bg-[#f0fafd] font-medium' value={userData?.userName || ''} readOnly />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor="github" className='text-gray-700 font-bold text-lg'>GitHub Username</label>
          <input id="github" type="text" className='border-2 border-[#20c7ff] rounded-xl px-4 py-3 text-gray-800 text-base bg-[#f0fafd] font-medium' readOnly value={userData?.github || ''} />
        </div>
      </div>
    </div>
  )
}

export default Profile