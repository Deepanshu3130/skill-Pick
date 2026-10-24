import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { MessageSquare, Info, Sun, Moon, LogIn } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { Link, useLocation } from "react-router-dom";
import SearchAutocomplete from "./SearchAutocomplete";

function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? "bg-base-100/90 backdrop-blur-md border-base-300 shadow-xs"
          : "bg-base-100 border-transparent"
      }`}
    >
      <div className="w-11/12 max-w-7xl mx-auto navbar min-h-14 px-0 flex justify-between items-center">
        {/* Left: Wordmark */}
        <div className="navbar-start w-auto flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 group text-base font-semibold tracking-tight text-base-content hover:text-primary transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-content text-xs font-mono font-bold">
              SP
            </div>
            <span className="text-base font-bold tracking-tight">
              Skill<span className="text-primary">Pick</span>
            </span>
          </Link>
        </div>

        {/* Center: Search Box on Inner Pages */}
        {!isHomePage && (
          <div className="navbar-center hidden md:flex flex-1 max-w-md mx-6">
            <SearchAutocomplete
              placeholder="Search topics, courses, repos..."
              buttonText="Search"
              showButton={false}
              className="w-full"
              inputClassName="input-sm text-xs bg-base-200 border-base-300 focus:bg-base-100"
            />
          </div>
        )}

        {/* Right: Nav Actions */}
        <div className="navbar-end w-auto flex items-center gap-1 sm:gap-2">
          <SignedIn>
            <Link
              to="/ChatHome"
              className="btn btn-ghost btn-sm gap-1.5 text-xs font-medium text-base-content/80 hover:text-base-content"
              title="Community Rooms & DMs"
            >
              <MessageSquare className="size-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">Rooms</span>
            </Link>
          </SignedIn>

          <Link
            to="/aboutUs"
            className="btn btn-ghost btn-sm gap-1.5 text-xs font-medium text-base-content/80 hover:text-base-content"
          >
            <Info className="size-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">About</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm btn-square text-base-content/80 hover:text-base-content"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <Sun className="size-4" strokeWidth={1.5} />
            ) : (
              <Moon className="size-4" strokeWidth={1.5} />
            )}
          </button>

          {/* User Auth Section */}
          <div className="flex items-center ml-1">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-sm gap-1.5 text-xs font-semibold px-3.5">
                  <LogIn className="size-3.5" strokeWidth={1.5} />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center p-0.5">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
