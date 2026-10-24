import { useEffect } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import { Route, Routes } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore';

import Settings from './pages/Settings';
import { useUser, useAuth } from '@clerk/clerk-react';
import { io } from "socket.io-client";

import Home from "./pages/Home";
import Courses from './pages/Courses';
import CourseDescription from './pages/CourseDescription';
import ChatHome from './pages/ChatHome';
import AboutUs from './pages/AboutUs';
import PlatfromPage from './pages/PlatformPage';
import Explore from './pages/Explore';
import PrivateRoutes from './Components/PrivateRoutes';
import Footer from './Components/Footer';
import ScrollProgress from './Components/motion/ScrollProgress';
import PageFade from './Components/motion/PageFade';
import CustomCursor from './Components/motion/CustomCursor';

let socket1 = null;

function App() {
  const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { theme } = useThemeStore();

  // Sync DaisyUI data-theme attribute on root html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const initSocket = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          if (!isMounted) return;

          if (!socket1) {
            // Secure connection: Pass JWT token via auth payload
            socket1 = io(BASE_URL, {
              auth: { token },
              reconnection: true,
            });

            socket1.on("connect", () => {
              console.log("Socket connected securely with JWT:", socket1.id);
            });

            socket1.on("connect_error", (err) => {
              console.warn("Socket connection warning:", err.message);
            });

            socket1.on("disconnect", () => {
              console.log("Socket disconnected");
            });

            socket1.on("getOnlineUsers", (userIds) => {
              console.log("Online Users count:", userIds.length);
            });
          }
        } catch (err) {
          console.error("Error getting Clerk JWT for socket connection:", err);
        }
      } else {
        if (socket1) {
          socket1.disconnect();
          socket1 = null;
        }
      }
    };

    initSocket();

    return () => {
      isMounted = false;
      if (socket1) {
        socket1.disconnect();
        socket1 = null;
      }
    };
  }, [isSignedIn, user, getToken]);

  return (
    <div data-theme={theme} className="relative flex flex-col min-h-screen">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <PageFade className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/courses/:query" element={<Courses />} />
          <Route path='/course/:id' element={<CourseDescription />} />
          <Route 
            path='/chatHome'
            element={
              <PrivateRoutes>
                <ChatHome />
              </PrivateRoutes>
            }
          />
          <Route path='/aboutUs' element={<AboutUs />} />
          <Route path="/explore" element={<Explore />} />
          <Route path='/Platform/:platform' element={<PlatfromPage />} />
        </Routes>
      </PageFade>
      <Footer />
    </div>
  );
}

export const getSocket = () => socket1;

export default App;
