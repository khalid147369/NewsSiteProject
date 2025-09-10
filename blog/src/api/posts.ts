import axios from "axios";
const API_BASE = import.meta.env.VITE_ENV ==='production'?import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL;
export async function getPosts( page: number = 1,direction: number = -1) {
  // Assuming you have a context to manage user state
  // Assuming you have a context to manage posts
  const response = await axios.get(`${API_BASE}/api/posts/getAll/`,{
    params:{
      page: page,
      limit: 10, // Adjust the limit as necessary
      direction: direction
    }
  }).then(data=>{
    return data.data;
  }).catch((error) => {
    console.log("Login error:", error);
    return 0;
});


  return response;
}
export async function getAreaPosts(area: string , page: number = 1,direction: number = -1) {
  // Assuming you have a context to manage user state
  // Assuming you have a context to manage posts
  const response = await axios.get(`${API_BASE}/api/posts/getArea/`,{
    params:{
      page: page,
      limit: 10, // Adjust the limit as necessary
      category: area,
      direction: direction

    }
  }).then(data=>{
    return data.data;
  }).catch((error) => {
    console.log("Login error:", error);
    return 0;
});


  return response;
}
export async function getPostById(id: string) {
  const response = await axios.get(`${API_BASE}/api/posts/getById/${id}`).then(data=>{
    return data.data;
  }).catch((error) => {
    console.log("Error fetching post:", error);
    return null;
  });

  return response;
}
export async function removePostById(id: string,token:string) {
  const response = await axios.delete(`${API_BASE}/api/admin/deleteById/${id}`,{headers:{Authorization:`Bearer ${token}`}}).then(data=>{
    return {data:data.data,status:data.status};
  }).catch((error) => {
    console.log("Error fetching post:", error);
    return null;
  });

  return response;
}
export async function removePosts(token:string,[...ids]: string[]): Promise<{data: any, status: number} | null> {
   await axios.delete(`${API_BASE}/api/admin/deleteMany/`, {
    data: { ids: ids },
    headers:{Authorization:`Bearer ${token}`}
}).then(data => {
    return {data:data.data,status:data.status};
  }).catch((error) => {
    console.log("Error fetching post:", error);
    return null;
  });
  return {data: {message: "Posts deleted successfully"}, status: 200};
}
export async function findPost( text:string) {
  // Assuming you have a context to manage user state
 
  const response = await axios.get(`${API_BASE}/api/posts/search/`,{
    params:{
      text
    }
  }).then(data=>{
    return data.data;
  }).catch((error) => {
    console.log("Login error:", error);
    return 0;
});


  return response;
}

