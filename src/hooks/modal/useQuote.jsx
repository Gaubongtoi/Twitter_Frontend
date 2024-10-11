import { create } from 'zustand';

const useQuote = create((set) => ({
    isOpen: false,
    data: null,
    onOpen: (data) => set({ isOpen: true, data }),
    onClose: () => set({ isOpen: false, data: null }),
}));

export default useQuote;
