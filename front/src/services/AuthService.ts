import { AuthResponse } from "types/types"
import {$api} from "../http/axios"
import { AxiosResponse } from "axios"
export default class AuthService{
    static async login(username:string,password:string,DeviceGuidId:string):Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/Auth/login',{username,password,DeviceGuidId})
    }
    static async register(username:string,password:string):Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/registration',{username,password})
    }
    static async logout():Promise<void>{
        return $api.post('/Token/logout')
    }
}