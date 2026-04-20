import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
   authUser: null,
   isSigningUp: false,
   isLoggingIn: false,
   isCheckingAuth: false,

   checkAuth: async () => {
      set({ isCheckingAuth: true });
      try {
         const res = await axiosInstance.post("/auth/check");
         console.log("User data--------", res.data);
         set({ authUser: res.data.user });
      } catch (e) {
         console.log("Error checking auth", e);
         set({ authUser: null });
      } finally {
         set({ isCheckingAuth: false });
      }
   },

   signup: async (data) => {
      set({ isSigningUp: true });
      try {
         const res = await axiosInstance.post("/auth/register", data);
         set({ authUser: res.data.user });
         toast.success("Sign up successful");
      } catch (e) {
         console.log("Error checking auth", e);
         set({ authUser: null });
         toast.error("Sign up failed");
      } finally {
         set({ isSigningUp: false });
      }
   },
   login: async (data) => {
      set({ isLoggingIn: true });
      console.log("Inside login", data)
      try {
         const res = await axiosInstance.post("/auth/login", data);
         console.log("Login res ------", res)
         set({ authUser: res.data.user });
         toast.success("Logged In");
      } catch (error) {
         console.log("Failed to login", error);
         set({ authUser: null });
         toast.error("Error LogingIn");
      } finally {
         set({ isLoggingIn: false });
      }
   },
   logout: async () => {
      try {
         const res = await axiosInstance.get("/auth/logout");
         set({ authUser: null });
         toast.success("Logged Out");
      } catch (error) {
         console.log("Error logging out", error);
         toast.error("Error logging out");
      }
   },
}));
