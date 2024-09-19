import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLoginState = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            login: () => {
                return set({
                    isLoggedIn: true,
                });
            },
            logout: () => {
                return set({ isLoggedIn: false });
            },
        }),
        {
            name: 'login-state', // Tên key trong localStorage
            getStorage: () => localStorage, // Sử dụng localStorage
        },
    ),
);

export const login = useLoginState.getState().login;
export const logout = useLoginState.getState().logout;

export default useLoginState;
