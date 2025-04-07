import { useUser } from "@clerk/clerk-react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { X } from "lucide-react";

const AuthModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-base-100 p-6 rounded-lg max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 btn btn-ghost btn-sm"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Join the Community!</h2>
        <p className="mb-6">
          Login or sign up to participate in course discussions, ask questions, 
          and connect with other learners.
        </p>
        
        <div className="flex gap-4">
          <SignInButton mode="modal" afterSignInUrl={window.location.href}>
            <button className="btn btn-primary flex-1">Log In</button>
          </SignInButton>
          <SignUpButton mode="modal" afterSignUpUrl={window.location.href}>
            <button className="btn btn-outline flex-1">Sign Up</button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;