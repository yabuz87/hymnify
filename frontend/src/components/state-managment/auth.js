import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../../libs/utils.js";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      isSigningUp: false,
      isVeriying:false,
      verifyData:null,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isLoggingOut: false,
      isCheckingAuth: true,

      // Signup
      signup: async (data) => {
        try {
          set({ isSigningUp: true });
          const response = await axiosInstance.post("/signup", data);
          toast.success("Account created successfully! Please verify your email. 📧");
          set({ verifyData: response.data });
          return response;
        } catch (error) {
          console.error("Error in signup method:", error?.response || error);
          const errorMessage =
            error.response?.data?.message || "Signup failed. Please try again.";
          toast.error(errorMessage);
        } finally {
          set({ isSigningUp: false });
        }
      },
      verify: async(data)=>{
        try {
          set({isVeriying:true});
          const response=await axiosInstance.post("/verify", data);
          toast.success("verficiation successfully done ");
          return response.data;
        } catch (error) {
        console.log("Error in verify:", error?.response || error);
        const errorMessage =
            error.response?.data?.message || "Signup failed. Please try again.";
          toast.error(errorMessage);
          
        }finally{
          set({isVeriying:false})
        }
      },

      // Check auth
      checkAuth: async () => {
        try {
          const response = await axiosInstance.get("/check");
          set({ authUser: response.data });
        } catch (error) {
          console.error("Error in checkAuth method:", error?.response || error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      // Login
      login: async (data) => {
        try {
          set({ isLoggingIn: true });
          const response = await axiosInstance.post("/login", data);
          set({ authUser: response.data.owner || response.data });
          toast.success("You logged in successfully! 🎉", { id: "login-success" });
          return true;
        } catch (error) {
          console.error("Error in login method:", error?.response || error);
          const errorMessage =
            error.response?.data?.message || "Login failed. Please check your credentials.";
          toast.error(errorMessage, { id: "login-error" });
          return false;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      // Logout
      logout: async () => {
        try {
          set({ isLoggingOut: true });
          await axiosInstance.post("/logout");
          set({ authUser: null });
          toast.success("Logged out successfully! 🎉", { id: "logout-success" });
        } catch (error) {
          console.error("Logout error:", error?.response || error);
          const errorMessage =
            error.response?.data?.message || "Logout failed! Please try again.";
          toast.error(errorMessage, { id: "logout-error" });
        } finally {
          set({ isLoggingOut: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authUser: state.authUser,
      }),
    }
  )
);

