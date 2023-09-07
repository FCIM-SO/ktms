import axios, { AxiosRequestConfig } from "axios";
import { error } from "console";
import { AuthResponse } from "types/types";

// export const API_URL = `http://testapi.amap.galex.md/api`
export const API_URL = `https://api.amap.galex.md/auth/api`
export const $api = axios.create({
    withCredentials:true,
    baseURL:API_URL
});
$api.interceptors.request.use((config)=>{
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    console.log(`Bearer ${localStorage.getItem('token')}`)
    return config;
})
$api.interceptors.response.use((config)=>{
    return config;
}, async (error)=>{
    const originalRequest = error.config;
    if(error.response.status===401 && error.config && !error.config._isRetry){
        try{
    const response = await axios.get<AuthResponse>(`${API_URL}/Token/refresh`,{withCredentials:true});
        localStorage.setItem('token',response.data.accessToken);
        return $api.request(originalRequest)
        }
        catch(e){
            console.log("НЕ АВТОРИЗОВаН");
        }
}
})


