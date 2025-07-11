import { secureStorage } from "@/lib/secureStorage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


interface UserState {
  id: string | null;
  email: string | null;
  role: string | null;
  setUserData: (
    email: string,
    role: string,
    id: string,
  ) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      id: null,
      role: null,
      setUserData: (email: string, role: string, id: string) =>
        set({
          email,
          role,
          id,
        }),
      clearUserData: () =>
        set({
          email: null,
          role: null,
          id: null,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        email: state.email,
        id: state.id,
        role: state.role,
      }),
    }
  )
);
