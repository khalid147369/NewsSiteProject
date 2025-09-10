import axios from "axios";

const API_BASE = import.meta.env.VITE_ENV ==='production'?import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL;


export async function getUsers(     token :string) {
  // Assuming you have a context to manage user state
  // Assuming you have a context to manage posts
  const response = await axios.get(`${API_BASE}/api/admin/getUsers/`,{
headers:{Authorization:`Bearer ${token}`}
  }).then(data=>{
    return data.data;
  }).catch((error) => {
    console.log("Login error:", error);
    return 0;
});


  return response;
}