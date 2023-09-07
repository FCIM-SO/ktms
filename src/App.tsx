import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import { useEffect } from "react";
import { RootState } from "store/store";
import { useDispatch, useSelector } from "react-redux";
import { login,checkAuth } from "store/user/userSlice";
import UserService from "services/UserService";
const App = () => {
  const {user} = useSelector((state:RootState)=>state);
  const dispatch = useDispatch();
  useEffect(()=>{
      UserService.checkAuthUser(dispatch);
  },[])
  return (
    <Routes>
      {/* <Route path="auth/*" element={<AuthLayout />} /> */}
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
