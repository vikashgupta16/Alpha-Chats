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
        },
        setMessages:(state,action)=>{
            state.messages=action.payload;
        },
        addMessage:(state,action)=>{
            state.messages.push(action.payload);
        }
    }
})

export const {setUserData,setOtherUsers,setSelectedUser,setMessages,addMessage}=userSlice.actions
export default userSlice.reducer