import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
//console.log(clerkFrontendApi)
createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
      <ClerkProvider publishableKey={clerkFrontendApi}>
        <App />
      </ClerkProvider>
      <Toaster></Toaster>
    </BrowserRouter>
  

)
