import AuthService from "./AuthService";
import { v4 as uuid } from 'uuid';
import { checkAuth, login, logout } from "store/user/userSlice";
import { AuthResponse } from "types/types";
import axios from "axios";
import { API_URL } from "http/axios";


export default class UserService{
    static async loginUser(dispatch:any,username:string,password:string){
        
        try{
            let deviceID = uuid();
            const response = await AuthService.login(username,password,deviceID);
            console.log(response.data.refreshToken);
            localStorage.setItem('token',response.data.accessToken);
            console.log(response.data.user)
            dispatch(login(response.data.user))
            
        }
        catch(e:any){
            console.log(e.response?.data?.message)
        }
    }
    static async logoutUser(dispatch:any){
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            dispatch(logout())
        }
        catch (e: any) {
            console.log(e.response?.data?.message)
        }
        
    }
    static async checkAuthUser(dispatch:any){
        try{
            console.log("check")
                    const response = await axios.get<AuthResponse>(`${API_URL}/Token/refresh`,{withCredentials:true})
                    console.log(response)
                    localStorage.setItem('token', response.data.accessToken);
                    console.log("Refresh")
                    console.log(response.data)
                    dispatch(checkAuth(response.data.user));
                    console.log("Refresh",response.data.user)
        }
        catch(e:any){
            console.log(e.response?.data?.message)
        }
        finally{
        }
    }
}