import {create} from 'zustand';
export const useAuthStore = create((set)=>({
  currentUser: null,
  
  syncUser: async () => {
    const { user, getToken } = useAuth();
    
    if (!user) {
      set({ currentUser: null });
      return;
    }

   

    try {
      const token = await getToken();
      const response = await axios.get('http://localhost:3000/api/v1/courseData/get-user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        currentUser: response.data.user,
       
      });
    } catch (error) {
      
      console.error("User sync error:", error);
    }
  },

  // Clear user data on logout
  clearUser: () => set({ currentUser: null })
}));

