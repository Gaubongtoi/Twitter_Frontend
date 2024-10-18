import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTagBar = create(
    persist(
        (set) => ({
            tag: null,
            setTag: (tagName) => {
                return set({
                    tag: tagName,
                });
            },
        }),
        {
            name: 'tag_selection', // Tên key trong localStorage
            getStorage: () => localStorage, // Sử dụng localStorage
        },
    ),
);

export default useTagBar;
