import React, { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, SignOutButton} from "@clerk/clerk-react";
import { LogOut, MessageSquare, Settings,  User } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
 
function Navbar() {
  const navigate = useNavigate();

  const handleSubmit =(e)=>{
    e.preventDefault();
    navigate(`/courses/${input}`)

  }
  const {theme} = useThemeStore()
  const [input , setInput] = useState("");
  return (
    <header  className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg  "
>
      <div className="w-[90%] mx-auto flex justify-between items-center p-2 px-4 overflow-y-hidden">
       <Link to={"/"}>
       <h1 className="text-lg font-bold"> SKILL-PICK</h1>
       </Link>
       <form onSubmit={handleSubmit}>
         <input
          type="text"
          placeholder="Enter the course name"
          value={input}
          onChange={(e)=> setInput(e.target.value)}
          className="border p-1 w-md rounded-lg"
          
          ></input>
       </form>
        <div className="flex gap-9">

       
       <Link to ={"/settings"}  className={`
              btn btn-sm gap-2 transition-colors
              
              `}>
          <Settings className="size-5" />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      

      <div data-theme={theme} className="flex gap-10">
 
        <SignedOut >
         <SignInButton>
          <button className="btn btn-sm gap-2 transition-colors">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
         </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <SignOutButton>
            <button className="btn  flex items-center gap-2 transition-colors">
              <LogOut className="size-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
         </SignOutButton>
         
        </SignedIn>
      </div>
        </div>
      </div>
    </header>
  );
}
// SOME FINISHING IS PENDING

export default Navbar;