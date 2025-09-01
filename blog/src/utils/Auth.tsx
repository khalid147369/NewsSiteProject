import React, { use } from 'react';
import { useEffect } from 'react'
import { useRefreshToken } from '../refreshToken/refreshtoken'
import {useUser} from '../context/UserContext'
import { Navigate, Outlet, useNavigate,useLocation } from 'react-router-dom';
const Auth = () => {

  const refreshToken = useRefreshToken();
  const {user} = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    // Refresca el token al cargar la app
const refreshtheToken = async () => {
    const refresh =  refreshToken();
    refresh.then(data => {
try {
  user.set({ accessToken: data?.accessToken ,message:data.message,user:{email: data?.user?.email, username: data?.user?.username ,role: data?.user?.role}});


  
} catch (err) {
  console.error("Error setting user data:", err);
  user.logout();
 
}finally{
  setLoading(false);
}

    });
}
refreshtheToken();

  }, []);
  useEffect(()=> {
if (!loading) {
 if ( !user?.data?.loading && location.pathname === '/profile' && !user?.isLoggedIn   ) {
  // return <Navigate to="/login" state={{ from: location }} replace />;
  navigate('/login', { state: { from: location }, replace: true });
}  
}
   
  },[user] )

if (loading) 
  return <div>Loading...</div>;

    return (
<Outlet />
    );
}

export default Auth;
