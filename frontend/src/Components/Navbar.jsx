import React, { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { MessageSquare, Settings, User, Info } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/courses/${input}`);
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="w-[90%] mx-auto flex justify-between items-center p-2 px-4">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary">SKILL-PICK</h1>
        </Link>

        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-4 hidden lg:flex ">
        <div className="join w-full">
          <input
            type="text"
            placeholder="Search for courses..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          className="input input-bordered join-item w-full focus:outline-none text-base-content placeholder:text-base-content/60"
          />
          <button className="btn btn-primary join-item">
          <FiSearch className="mr-2" /> Search
           </button>
          </div>
        </form>

        <div className="flex items-center gap-4">
          
        <SignedIn>
            <Link to="/ChatHome" className="btn btn-ghost btn-sm gap-2">
              <MessageSquare className="size-5" />
              <span className="hidden sm:inline">Chat</span>
            </Link>
          </SignedIn>
        
          <Link to="/aboutUs" className="btn btn-ghost btn-sm gap-2">
            <Info className="size-5" />
            <span className="hidden sm:inline">About Us</span>
          </Link>

         
          <Link to="/settings" className="btn btn-ghost btn-sm gap-2">
            <Settings className="size-5" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {/* User Auth Section */}
          <div data-theme={theme} className="flex items-center gap-2">
            <SignedOut>
              <SignInButton>
                <button className="btn btn-primary btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton  />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;