import type { User } from '@/src/types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState extends User{
    login: (name: string) => void;
    logout: () => void;
    updateName: (name: string) => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "",
      isLoggedIn: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      login: (name) =>
        set({
          name: name.trim(),
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          name: "",
          isLoggedIn: false,
        }),

      updateName: (name) =>
        set({
          name: name.trim(),
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        name: state.name,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);