import { useCallback } from 'react';
import useUser from '../../hooks/auth/useUser';
import { useNavigate } from 'react-router-dom';
import { generateAvatarUrl } from '../../utils/avatarGenerator';

function Avatar({ userId, isLarge, hasBorder = false }) {
    const navigate = useNavigate();
    const { data: fetcherData } = useUser(userId);
    console.log(fetcherData);

    const onClick = useCallback(
        (e) => {
            e.stopPropagation();
            const url = `/api/user/profile?user_id=${userId}`;
            navigate(url);
        },
        [navigate, userId],
    );
    const avatarUrl = fetcherData?.result?.avatar || generateAvatarUrl(userId);
    return (
        <div
            className={`${hasBorder ? 'border-4 border-white' : 'border-2 border-black'} ${isLarge ? 'h-32' : 'h-12'} ${
                isLarge ? 'w-32' : 'w-12'
            } rounded-full hover:opacity-90 transition cursor-pointer relative`}
        >
            <img className="object-cover rounded-full w-full h-full" alt="Avatar" onClick={onClick} src={avatarUrl} />
        </div>
    );
}

export default Avatar;
