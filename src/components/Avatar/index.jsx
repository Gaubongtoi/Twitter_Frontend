import { useCallback } from 'react';
import useUser from '../../hooks/auth/useUser';
import { useNavigate } from 'react-router-dom';
import { generateAvatarUrl } from '../../utils/avatarGenerator';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import ImageGallary from '../ImageGallary';

function Avatar({ userId, isLarge, hasBorder = false }) {
    const navigate = useNavigate();
    const { data: fetcherData } = useUser(userId);
    const { data: currentUser } = useCurrentUser();
    const onClick = useCallback(
        (e) => {
            e.stopPropagation();
            let url;
            if (currentUser?.result?._id === userId) {
                url = `/api/user/me`;
            } else {
                url = `/api/user/profile?user_id=${userId}`;
            }
            navigate(url);
        },
        [navigate, userId, currentUser?.result?._id],
    );
    const avatarUrl = fetcherData?.result?.avatar || generateAvatarUrl(userId);
    return (
        <div
            className={`${hasBorder ? 'border-4 border-white' : 'border-2 border-gray-500'} ${
                isLarge ? 'h-32' : 'h-12'
            } ${isLarge ? 'w-32' : 'w-12'} rounded-full hover:opacity-90 transition cursor-pointer relative`}
        >
            {/* <ImageGallary images={[fetcherData?.result?.avatar]} /> */}
            <img
                className="object-cover rounded-full w-full h-full bg-blue-400"
                alt="Avatar"
                onClick={onClick}
                src={avatarUrl}
            />
        </div>
    );
}

export default Avatar;
