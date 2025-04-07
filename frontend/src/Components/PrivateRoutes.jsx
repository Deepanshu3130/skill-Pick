// src/components/PrivateRoutes.jsx

import { useUser  } from "@clerk/clerk-react";
import { RedirectToSignIn  } from "@clerk/clerk-react";

const PrivateRoutes = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

 
  if (!isLoaded) {
    return <div className="text-center mt-10 py-20 text-lg flex item-center justify-center"><span className="loading loading-spinner text-primary"></span></div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  
  return children;
};

export default PrivateRoutes;
