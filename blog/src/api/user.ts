import axios from "axios";
const API_BASE = import.meta.env.VITE_ENV !=='production'?import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL_PRO;
// Removed unused destructuring from useUser()
export async function login(email: string, password: string) {
  const response = await axios.post(`${API_BASE}/api/users/login`, { email, password },{withCredentials:true}).then(data=>{
    return data.data;
  }).catch((error) => {
    console.log("Login error:", error);
    return 0;
});


  return response;
}

export async function logout() {
  const response = await axios.post(`${API_BASE}/api/users/logout`,{},{withCredentials:true}).then(data=>{
    return data;
  }).catch((error) => {
    console.log("Login error:", error);
    return 0;
});


  return response;
}

export async function register(username: string, email: string, password: string) {
  const response = await axios.post(`${API_BASE}/api/users/register`, { username, email, password }).then(data=>{
     
  return data;
  }).catch((error) => {
    console.log("Registration error:", error);
    return error;
  });
  return response;
}
export async function changePassword(previousPassword: string, newPassword: string,token:string) {
  const response = await axios.patch(`${API_BASE}/api/users/editProfilePassword`, { previousPassword, newPassword  },{headers:{Authorization:`Bearer ${token}`}}).then(data=>{
     
  return data;
  }).catch((error) => {
    console.log("change password error:", error);
    return error;
  });
  return response;
}
export async function changeProfileData(profile: {username?:string,email?:string},token:string) {
  const response = await axios.patch(`${API_BASE}/api/users/editProfile`, profile,{headers:{Authorization:`Bearer ${token}`}}).then(data=>{
     
  return data;
  }).catch((error) => {
    console.log("change profile error:", error);
    return error;
  });
  return response;
}