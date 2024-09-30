import { createAvatar } from '@dicebear/core';
import {
    adventurerNeutral,
    adventurer,
    avataaars,
    avataaarsNeutral,
    croodlesNeutral,
    openPeeps,
} from '@dicebear/collection';

export const generateAvatarUrl = (seed) => {
    const avatar = createAvatar(openPeeps, {
        seed,
        width: 128,
        height: 128,
    });

    return avatar.toDataUri(); // Sử dụng toDataUriSync để lấy URL của avatar
};
