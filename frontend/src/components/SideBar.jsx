import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/pp.webp'
import { MdOutlinePersonSearch } from "react-icons/md";
import { GiCrossMark } from "react-icons/gi";
import { BiLogOut } from "react-icons/bi";
import { FiSettings, FiMessageCircle, FiHash, FiUsers } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../config/constants';
import { setSelectedUser, setOtherUsers, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';

function SideBar({ onlineUsers = [], isConnected = false }) {
    let {userData,otherUsers,selectedUser,messages} = useSelector(state => state.user)
    let [search, setSearch] = useState(false)
    let [searchTerm, setSearchTerm] = useState("")
    let [activeTab, setActiveTab] = useState('chats')
    let dispatch = useDispatch()
    let navigate = useNavigate()
    const { theme, toggleTheme } = useTheme();
    
    // Socket data is now passed as props
    console.log('📡 SideBar - Socket connected:', isConnected, 'Online users:', onlineUsers.length);
    
    // Calculate unread messages for each user
    const getUserUnreadCount = (userId) => {
        // Always show unread count if there are unread messages in Redux state
        return messages?.filter(msg => 
            msg.sender === userId && 
            msg.reciver === userData?._id && 
            !msg.read
        ).length || 0;
    };
    
    // Get total unread messages
    const totalUnread = otherUsers?.reduce((total, user) => {
        return total + getUserUnreadCount(user._id);
    }, 0) || 0;
    
    // Check if user is online
    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId);
    };
    
    // Count online users
    const onlineCount = otherUsers?.filter(user => isUserOnline(user._id)).length || 0;
    
    const filteredUsers = otherUsers?.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const handleSearch = (e) => {
        e.preventDefault()
        // Search functionality is handled by filteredUsers
    }
    
    // Theme toggle button
    const ThemeToggle = () => (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-1 text-[#b3b3ff] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#181c2f]"
            aria-label="Toggle theme"
        >
            <span className="text-xs">{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="text-xs hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
        </button>
    )
    
    const handelLogoout= async()=>{
      try {
        let result= await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        dispatch(setUserData(null))
        dispatch(setOtherUsers(null))
        navigate("/login")      } catch (error) {
        console.error("Error logging out:", error)
      }
    }

    // Responsive: detect mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // On mobile, if a user is selected, hide the sidebar (show only chat)
    if (isMobile && selectedUser) return null;

    return (
        <div className={`lg:w-[350px] w-full h-full border-r border-[#23234a] shadow-xl flex flex-col 
          bg-gradient-to-b from-[#23234a] via-[#181c2f] to-[#23234a]`}>
            {/* Header */}
            <div className="p-6 pb-3 rounded-b-3xl shadow-md bg-gradient-to-r from-[#23234a] via-[#181c2f] to-[#23234a] border-b border-[#39ff14]/30">
                <div className="flex items-center gap-4">
                    <img src={userData?.image || dp} alt="Profile" className="w-16 h-16 rounded-2xl border-4 border-[#39ff14] shadow-lg object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/profile')} />
                    <div>
                        <h1 className="text-white font-extrabold text-2xl font-mono tracking-tight">Alpha<span className="text-[#39ff14]">Chat</span></h1>
                        <p className="text-xs text-[#b3b3ff] font-mono">v2.0.0 // Coder Edition</p>
                        <p className="text-[#39ff14] font-mono text-sm mt-1">{userData?.name || userData?.userName || 'Developer'}</p>
                        <p className="text-[#b3b3ff] text-xs font-mono">@{userData?.github || 'coder'}</p>
                    </div>
                </div>
            </div>
            {/* Stats */}
            <div className="flex gap-4 text-center px-6 py-3 bg-[#23234a] rounded-xl mx-4 mt-2 z-10 relative shadow-md">
                <div className="flex-1">
                    <div className="text-white font-bold text-lg flex items-center justify-center gap-1">
                        {onlineCount}
                        {onlineCount > 0 && <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-pulse"></div>}
                    </div>
                    <div className="text-xs text-[#39ff14]">Online</div>
                </div>
                <div className="flex-1">
                    <div className="text-white font-bold text-lg flex items-center justify-center gap-1">
                        {totalUnread}
                        {totalUnread > 0 && <div className="w-2 h-2 bg-[#ff6f3c] rounded-full animate-pulse"></div>}
                    </div>
                    <div className="text-xs text-[#ffe156]">Unread</div>
                </div>
                <div className="flex-1">
                    <div className="text-white font-bold text-lg">{otherUsers?.length || 0}</div>
                    <div className="text-xs text-[#39ff14]">Devs</div>
                </div>
            </div>            {/* Navigation Tabs */}
            <div className="flex gap-1 mt-4 px-4">
                {[
                    { id: 'chats', icon: FiMessageCircle, label: 'Chats' },
                    { id: 'channels', icon: FiHash, label: 'Channels' },
                    { id: 'teams', icon: FiUsers, label: 'Teams' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                            activeTab === tab.id 
                                ? 'bg-[#39ff14] text-[#181c2f] font-bold shadow' 
                                : 'text-[#b3b3ff] hover:text-white hover:bg-[#23234a]'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            {/* Search Section */}
            <div className="p-4 pb-2">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search developers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setSearch(true)}
                        onBlur={() => setSearch(false)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#23234a] text-white font-mono border border-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]/30 transition-all"
                    />
                    <MdOutlinePersonSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#39ff14]" />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#39ff14] hover:text-white"
                        >
                            <GiCrossMark className='w-[25px] h-[25px]'/>
                        </button>
                    )}
                </div>
            </div>
            {/* User List */}
            <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-3">
                {(search ? filteredUsers : otherUsers)?.map((user) => {
                    const userIsOnline = isUserOnline(user._id);
                    const unreadCount = getUserUnreadCount(user._id);
                    
                    return (
                        <div 
                            key={user._id} 
                            className={`w-full p-3 flex items-center gap-3 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                                selectedUser?._id === user._id 
                                    ? 'bg-gradient-to-r from-[#39ff14]/20 to-[#7f53ac]/20 border-[#39ff14] shadow-lg shadow-[#39ff14]/20' 
                                    : 'bg-[#23234a]/50 border-gray-700 hover:bg-[#23234a] hover:border-[#39ff14]/50'
                            }`}
                            onClick={() => dispatch(setSelectedUser(user))}
                        >
                            <div className="relative">
                                <img 
                                    src={user.image || dp} 
                                    alt="Profile" 
                                    className="w-12 h-12 rounded-xl object-cover border-2 border-[#39ff14]/30"
                                />
                                {/* Online indicator */}
                                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#181c2f] ${
                                    userIsOnline ? 'bg-[#39ff14] animate-pulse' : 'bg-gray-400'
                                }`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-semibold font-mono truncate">
                                        {user.name || user.userName}
                                    </h3>
                                    {userIsOnline && (
                                        <span className="text-[#39ff14] text-xs font-mono">●</span>
                                    )}
                                </div>
                                <p className="text-[#b3b3ff] text-sm font-mono truncate">
                                    @{user.github || user.userName}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-gray-400 text-xs font-mono">
                                        {userIsOnline ? 'Online' : 'Offline'}
                                    </p>
                                    {unreadCount > 0 && (
                                        <span className="text-[#39ff14] text-xs font-mono">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {(!otherUsers || otherUsers.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 bg-[#23234a] rounded-full flex items-center justify-center mb-4">
                            <FiUsers className="w-8 h-8 text-[#39ff14]" />
                        </div>
                        <p className="text-[#b3b3ff] font-mono">No developers found</p>
                        <p className="text-gray-500 text-sm font-mono mt-1">Invite your team to get started</p>
                    </div>
                )}
            </div>
            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 left-0 w-full z-30 bg-[#23234a] border-t border-[#39ff14]/30 p-2 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                    <button className="flex items-center gap-1 text-[#b3b3ff] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#181c2f]" onClick={() => navigate('/profile')}>
                        <FiSettings className="w-4 h-4" />
                        <span className="text-xs hidden sm:inline">Settings</span>
                    </button>
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>
                    <button 
                        onClick={handelLogoout}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-900/20"
                    >
                        <BiLogOut className="w-4 h-4" />
                        <span className="text-xs">Logout</span>
                    </button>
                </div>
                {/* Mobile Theme Toggle */}
                <div className="sm:hidden flex justify-center">
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )
}

export default SideBar
