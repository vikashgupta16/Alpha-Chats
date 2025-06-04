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
            state.messages.push(action.payload);
            // Only move sender to top if it's a new incoming message (not from self)
            const msg = action.payload;
            if (msg.sender !== state.userData?._id && state.otherUsers) {
                const idx = state.otherUsers.findIndex(u => u._id === msg.sender);
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