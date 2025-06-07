import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        otherUsers:null,
        selectedUser:null,
        messages:[]
    }, 
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload;
        },
        setOtherUsers:(state,action)=>{
            state.otherUsers=action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
            state.messages=[]; // Clear messages when switching users
            // Do NOT move user to top here (WhatsApp logic: only on new message)
        },
        setMessages:(state,action)=>{
            state.messages=action.payload;
        },        addMessage:(state,action)=>{
            const newMessage = action.payload;
            console.log('📝 Redux: Adding message:', newMessage._id);
            
            // CRITICAL: Prevent duplicates on page refresh/reload
            // Check for duplicate by database ID first (most reliable)
            if (newMessage._id && state.messages.find(msg => msg._id === newMessage._id)) {
                console.log('🚫 Redux: Duplicate message by ID, skipping:', newMessage._id);
                return;
            }
            
            // Fallback: Check for duplicates by content + timestamp (for temp messages)
            const isDuplicate = state.messages.some(existingMsg => 
                existingMsg.message === newMessage.message &&
                existingMsg.sender === newMessage.sender &&
                existingMsg.reciver === newMessage.reciver &&
                Math.abs(new Date(existingMsg.createdAt) - new Date(newMessage.createdAt)) < 5000 // 5 second window
            );
            
            if (isDuplicate) {
                console.log('🚫 Redux: Duplicate message by content+time, skipping');
                return;
            }
            
            // Safe to add the message
            state.messages.push(newMessage);
            console.log('✅ Redux: Message added successfully');
            
            // Move sender to top for incoming messages
            if (newMessage.sender !== state.userData?._id && state.otherUsers) {
                const idx = state.otherUsers.findIndex(u => u._id === newMessage.sender);
                if (idx > 0) {
                    const [user] = state.otherUsers.splice(idx, 1);
                    state.otherUsers.unshift(user);
                }
            }
        },
        markMessagesAsRead:(state,action)=>{
            const { senderId } = action.payload;
            state.messages = state.messages.map(msg => 
                msg.sender === senderId && msg.reciver === state.userData?._id
                    ? { ...msg, read: true }
                    : msg
            );
        }
    }
})

export const {setUserData,setOtherUsers,setSelectedUser,setMessages,addMessage,markMessagesAsRead}=userSlice.actions
export default userSlice.reducer