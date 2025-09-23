import { create } from "zustand";
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  setAuth: (user, token) => {
    sessionStorage.setItem("auth_token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  clearAuth: () => {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  initializeAuth: () => {
    const token = sessionStorage.getItem("auth_token");
    const userStr = sessionStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        console.error("Error parsing user from sessionStorage:", error);
        get().clearAuth();
      }
    }
  },
}));
