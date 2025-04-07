import { useEffect, useState } from 'react'

import './App.css'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'

import Settings from './pages/Settings'
import { useUser } from '@clerk/clerk-react'
import { io } from "socket.io-client";

import Home from "./pages/Home"
import Courses from './pages/Courses'
import CourseDescription from './pages/CourseDescription'
import ChatHome from './pages/ChatHome'
import AboutUs from './pages/AboutUs'
import PlatfromPage from './pages/PlatformPage'
import PrivateRoutes from './Components/PrivateRoutes'

let socket1 = null
function App() {
  const BASE_URL = import.meta.env.MODE=== "development" ? "http://localhost:3000" : "/"
  const { isSignedIn, user } = useUser();
 

  useEffect(() => {
    if (isSignedIn && user) {
      console.log("User ID before connecting socket:", user.id);
      if (!socket1) {
        socket1 = io(BASE_URL, {
          query: { userId: user.id }, // Clerk user ID
          reconnection: true, // Ensures auto-reconnect on server restart
          // reconnectionAttempts: 10, // Number of retries
          // reconnectionDelay: 3000, // Delay between retries (3 sec)
        });

        socket1.on("connect", () => {
          console.log("Socket connected:", socket1.id);
          
        });

        socket1.on("disconnect", () => {
          console.log("Socket disconnected");
        });

        socket1.on("getOnlineUsers", (userIds) => {
          console.log("Online Users:", userIds);
        });
      }
    } else {
      // If user logs out, disconnect socket
      if (socket1) {
        socket1.disconnect();
        socket1 = null;
      }
    }

    return () => {
      // Cleanup function to disconnect on component unmount
      if (socket1) {
        socket1.disconnect();
        socket1 = null;
      }
    };
  }, [isSignedIn, user]);
  const {theme} = useThemeStore()
  
  return (
    <div data-theme={theme}>
     <Navbar></Navbar>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element ={<Settings/>}/>
        <Route path="/courses/:query" element={<Courses/>}/>
        <Route path='/course/:id' element={<CourseDescription/>}></Route>
        <Route 
          path='/chatHome'
          element={
            <PrivateRoutes>
              <ChatHome/>
            </PrivateRoutes>
          }
        />

        <Route path='/aboutUs' element={<AboutUs></AboutUs>}/>
        <Route path='/Platform/:platform' element={<PlatfromPage/>}/>
     </Routes>
    </div>
  )
}
export const getSocket = () => socket1;

export default App
