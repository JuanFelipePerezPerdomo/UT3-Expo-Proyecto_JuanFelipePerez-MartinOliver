import type { User } from '@/src/types';
import { create } from 'zustand';

interface UserState extends User{
    login: (name: string) => void;
    logout: () => void;
    updateName: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    name: "",
    isLoggedIn: false,

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
}));
