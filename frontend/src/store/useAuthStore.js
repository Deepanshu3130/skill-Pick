import { create } from 'zustand';
import axios from 'axios';
import { BASE_URL } from '../operations/apiConnectors';

export const useAuthStore = create((set) => ({
  currentUser: null,
  
  syncUser: async (getToken, user) => {
    if (!user || !getToken) {
      set({ currentUser: null });
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/courseData/get-user`, {
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
