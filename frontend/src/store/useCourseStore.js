import { create } from "zustand";

const useCourseStore = create((set) => ({
  courses: [],
  platformCourses:[],
  lastQuery: "",

  setCourses: (newCourses) => {
    set({ courses: newCourses });
   
  },
  setPlatformCourses: (newCourses) => {
    set({ platformCourses: newCourses });
    
  },

  setLastQuery: (query) => {
    set({ lastQuery: query });
    
  }
}));
// see ek baar set and localstoregae

export default useCourseStore;