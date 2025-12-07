import type { Settings, SortBy, ThemeMode } from "@/src/types";
import { DEFAULT_SETTINGS } from "@/src/types";
import { create } from "zustand";

interface SettingsState extends Settings{
    setTheme: (theme: ThemeMode) => void;
    setSortBy: (sortBy: SortBy) => void;
    setWelcomeShown: (shown: boolean) => void;
    setShakeEnabled: (enabled: boolean) => void;
    reset: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    ...DEFAULT_SETTINGS,

    setTheme: (theme) => set({ theme }),

    setSortBy: (sortBy) => set({ sortBy }),

    setWelcomeShown: (shown) => set({ welcomeShown: shown }),

    setShakeEnabled: (enabled) => set({ shakeEnabled: enabled }),

    reset: () => set(DEFAULT_SETTINGS),
}));