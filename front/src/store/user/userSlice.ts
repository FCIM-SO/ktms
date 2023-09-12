import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "types/types";
import type { PayloadAction } from '@reduxjs/toolkit'

const InitialState:IUser = {
    username:"",
    person:{
        firstName:"firstName",
        lastName:"lastName"
    },
    role:{
        name:"",
        permission:0,
    },
    isAuth:false
    
    

}
export const userSlice = createSlice({
    name: 'user',
    initialState:InitialState,
    reducers: {
        login:(state,action:PayloadAction<IUser>)=>{
            state.username = action.payload.username;
            state.person = action.payload.person;
            state.role  = action.payload.role;
            state.isAuth = true;

        },
        logout:(state) =>{
            state.username = "";
            state.person = null;
            state.role  = null;
            state.isAuth = false;
        },
        checkAuth :(state,action:PayloadAction<IUser>) =>{
            state.username = action.payload.username;
            state.person = action.payload.person;
            state.role  = action.payload.role;
            state.isAuth = true;
        }
    }
})
export const { login,logout,checkAuth } = userSlice.actions
export default userSlice.reducer
