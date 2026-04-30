import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  role?: "patient" | "doctor" | "admin";
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user: AuthUser) => {
        const authData = { state: { user, isAuthenticated: !!user } };
        Cookies.set("vitalsync-auth", JSON.stringify(authData), { expires: 7 });
        set({ user, isAuthenticated: !!user, isLoading: false });
      },

      clearUser: () => {
        Cookies.remove("vitalsync-auth");
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "vitalsync-auth",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : noopStorage)),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);