// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Header from "./pages/header/Header.jsx";
import Register from "./pages/register/Register.js";
import Login from "./pages/login/Login.js";
import { UserProvider } from "./context/UserContext.js";
import { PostProvider } from "./context/PostsContext.tsx";
import { PostsAdminProvider } from "./context/PanelContext.tsx";
import Auth from "./utils/Auth.tsx";
import AdminRoutes from "./utils/AdminRoute.tsx";
import PostDetails from "./pages/postDetails/PostDetails.tsx";
import World from "./pages/world/World.tsx";
import Sports from "./pages/sports/Sports.tsx";
import Politic from "./pages/politic/Politic.tsx";
import Panel from "./pages/panel/Panel.tsx";
import Profile from "./pages/profile/Profile.tsx";
import Technology from "./pages/technology/Technology.tsx";

function App() {
  return (
    <Router>
      <PostProvider>
        <UserProvider>
          <PostsAdminProvider>
            
            <Header />
            
            <Routes>
              
              <Route element={<Auth />}>
                <Route path="/" element={<Home />} />
                <Route path="/world" element={<World />} />
                <Route path="/sports" element={<Sports />} />
                <Route path="/politic" element={<Politic />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/post/:id" element={<PostDetails />} />
              
                <Route path="/profile" element={<Profile />} />
                
              </Route>
                <Route element={<AdminRoutes />}>
                  <Route path="/panel" element={<Panel />} />
                </Route>
              
              <Route
                path="*"
                element={
                  <h1 className="text-3xl text-center">404 Not Found</h1>
                }
              />
            </Routes>
          </PostsAdminProvider>
        </UserProvider>
      </PostProvider>
    </Router>
  );
}

export default App;
