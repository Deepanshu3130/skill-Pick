import React from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { X, LogIn, UserPlus } from "lucide-react";

const AuthModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="card bg-base-100 border border-base-300 shadow-2xl max-w-md w-full p-6 sm:p-8 relative rounded-2xl animate-scaleUp text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button 
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4 text-base-content/60 hover:text-base-content"
          aria-label="Close dialog"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
        
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            SP
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold tracking-tight text-base-content">
            Join the SkillPick community
          </h2>
          <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
            Sign in to participate in course discussion rooms, ask code doubts, submit resources, and connect directly with peers.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-base-300">
          <SignInButton mode="modal" afterSignInUrl={typeof window !== "undefined" ? window.location.href : "/"}>
            <button className="btn btn-primary btn-sm flex-1 font-semibold gap-1.5 rounded-xl">
              <LogIn className="size-4" strokeWidth={1.5} />
              <span>Log In</span>
            </button>
          </SignInButton>
          <SignUpButton mode="modal" afterSignUpUrl={typeof window !== "undefined" ? window.location.href : "/"}>
            <button className="btn btn-outline btn-sm flex-1 font-semibold gap-1.5 rounded-xl">
              <UserPlus className="size-4" strokeWidth={1.5} />
              <span>Create Account</span>
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
