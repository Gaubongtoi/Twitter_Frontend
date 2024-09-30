import { create } from 'zustand';

const useLoginNoti = create((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
export const login = useLoginNoti.getState().onOpen;
export const logout = useLoginNoti.getState().onClose;
export default useLoginNoti;
