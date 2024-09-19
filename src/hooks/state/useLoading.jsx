import toast from 'react-hot-toast';
import { create } from 'zustand';

const useLoading = create((set) => {
    return {
        isOpen: false,
        open: () => {
            return set({ isOpen: true });
        },
        close: () => {
            return set({ isOpen: false });
        },
    };
});

export default useLoading;
