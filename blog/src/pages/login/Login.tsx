// import React from 'react';

import { useState } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
const Login = () => {

 const navigate = useNavigate();
  const [User, setUser] = useState({
     email: "",
     password: "",
   
  });
  const {user } = useUser();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
   const data = await user.login(User.email, User.password)
   if (data===0) {
      console.error("Login failed. Please check your credentials.");
      return;
    
   }
   
  navigate("/");
  }
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={User?.email || ''}
            onChange={(e) => setUser({ ...User, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={User?.password || ''}
            onChange={(e) => setUser({ ...User, password: e.target.value })}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded font-semibold">
            Login
          </button>
          <small className="text-center text-gray-600">
            Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default Login;