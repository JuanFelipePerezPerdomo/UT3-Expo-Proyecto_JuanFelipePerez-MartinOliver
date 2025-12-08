import type { Settings, SortBy, ThemeMode } from "@/src/types";
import { DEFAULT_SETTINGS } from "@/src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState extends Settings{
    setTheme: (theme: ThemeMode) => void;
    setSortBy: (sortBy: SortBy) => void;
    setWelcomeShown: (shown: boolean) => void;
    setShakeEnabled: (enabled: boolean) => void;
    reset: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setTheme: (theme) => set({ theme }),

      setSortBy: (sortBy) => set({ sortBy }),

      setWelcomeShown: (shown) => set({ welcomeShown: shown }),

      setShakeEnabled: (enabled) => set({ shakeEnabled: enabled }),

      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        sortBy: state.sortBy,
        welcomeShown: state.welcomeShown,
        shakeEnabled: state.shakeEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);