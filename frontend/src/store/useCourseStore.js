import { create } from "zustand";

const useCourseStore = create((set) => ({
  courses: [],
  lastQuery: "",

  setCourses: (newCourses) => {
    set({ courses: newCourses });
   
  },

  setLastQuery: (query) => {
    set({ lastQuery: query });
    
  }
}));
// see ek baar set and localstoregae

export default useCourseStore;