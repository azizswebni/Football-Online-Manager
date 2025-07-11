import { secureStorage } from "@/lib/secureStorage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


interface UserState {
  id: string | null;
  email: string | null;
  role: string | null;
  hasTeam: boolean;
  setUserData: (
    email: string,
    role: string,
    id: string,
    hasTeam: boolean
  ) => void;
  clearUserStore: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      id: null,
      role: null,
      hasTeam: false,
      setUserData: (email: string, role: string, id: string, hasTeam: boolean) =>
        set({
          email,
          role,
          id,
          hasTeam
        }),
      clearUserStore: () =>
        set({
          email: null,
          role: null,
          id: null,
          hasTeam: false,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        email: state.email,
        id: state.id,
        role: state.role,
        hasTeam: state.hasTeam,
      }),
    }
  )
);
