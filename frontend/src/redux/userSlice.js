import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null
    }, //setuserdata("vikash")
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload;
        }
    }
})