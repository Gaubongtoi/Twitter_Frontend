import { createAvatar } from '@dicebear/core';
import { adventurerNeutral } from '@dicebear/collection';

export const generateAvatarUrl = (seed) => {
    const avatar = createAvatar(adventurerNeutral, {
        seed,
        width: 128,
        height: 128,
    });

    return avatar.toDataUri(); // Sử dụng toDataUriSync để lấy URL của avatar
};
