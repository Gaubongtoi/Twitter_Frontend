import { format } from 'date-fns';

import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useUser from '../../hooks/auth/useUser';
import { useCallback, useMemo, useState } from 'react';
import ButtonExpand from '../ButtonExpand';
import { BiCalendar } from 'react-icons/bi';
import useEditModal from '../../hooks/modal/useEditModal';
import toast from 'react-hot-toast';
import http from '../../utils/http';
import useUsersRecommendation from '../../hooks/auth/useUsersRecommendation';

function UserBio({ user_id }) {
    const { data: fetchedUser, mutate: mutatedUser } = useUser(user_id);
    const { data: currentUser, mutate: mutatedCurrentUser } = useCurrentUser();
    const { mutate: mutatedRecommend } = useUsersRecommendation();

    const [isLoading, setIsLoading] = useState(false);
    const created_at = useMemo(() => {
        if (!fetchedUser?.result?.create_at) {
            return null;
        }
        return format(new Date(fetchedUser?.result?.create_at), 'MMMM yyyy');
    }, [fetchedUser?.result?.create_at]);
    // console.log(fetchedUser);

    // console.log(fetchedUser?.result?.followingUsers);
    // console.log(currentUser?.result?._id);

    const isFollowed = useMemo(() => {
        return fetchedUser?.result?.followedUsers.every((follower) => {
            // console.log(follower._id);

            return follower._id !== currentUser?.result?._id;
        });
    }, [fetchedUser, currentUser]);
    const onFollow = useCallback(async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const loadingToast = toast.loading('Waiting...');
        try {
            setIsLoading(true);
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            const res = await http.post('/api/user/follow', {
                followed_user_id: fetchedUser?.result?._id,
            });
            toast.success(`${res.data.message}`, {
                id: loadingToast,
                style: {
                    border: '1px solid #1E82BF',
                    padding: '16px',
                    color: '#1E82BF',
                },
                iconTheme: {
                    primary: '#1E82BF',
                    secondary: '#FFFAEE',
                },
            });
            // setBody('');
            mutatedUser();
            mutatedCurrentUser();
            mutatedRecommend();
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    }, [fetchedUser?.result?._id, mutatedUser, mutatedCurrentUser, mutatedRecommend]);
    const onUnfollow = useCallback(async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const loadingToast = toast.loading('Waiting...');
        try {
            setIsLoading(true);
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            const res = await http.delete(`/api/user/follow/${fetchedUser?.result?._id}`);
            toast.success(`${res.data.message}`, {
                id: loadingToast,
                style: {
                    border: '1px solid #1E82BF',
                    padding: '16px',
                    color: '#1E82BF',
                },
                iconTheme: {
                    primary: '#1E82BF',
                    secondary: '#FFFAEE',
                },
            });
            // setBody('');
            mutatedUser();
            mutatedCurrentUser();
            mutatedRecommend();
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    }, [fetchedUser?.result?._id, mutatedUser, mutatedCurrentUser, mutatedRecommend]);
    return (
        <div className="border-b-[1px] border-neutral-800 pb-4">
            {isFollowed ? (
                <div className="flex justify-end p-2">
                    <ButtonExpand label="Follow" onClick={onFollow} disabled={isLoading} />
                </div>
            ) : (
                <div className="flex justify-end p-2">
                    <ButtonExpand label="Unfollow" secondary disabled={isLoading} onClick={onUnfollow} />
                </div>
            )}

            <div className="mt-8 px-4">
                <div className="flex flex-col">
                    <p className="text-2xl font-semibold">{fetchedUser?.result?.name}</p>
                    <p className="text-md text-neutral-500">
                        @{fetchedUser?.result?.username ? fetchedUser?.result?.username : fetchedUser?.result?.name}
                    </p>
                </div>
                <div className="flex flex-col mt-4">
                    <p>{fetchedUser?.result?.bio ? fetchedUser?.result?.bio : 'User has not updated their bio'}</p>
                    <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500">
                        <BiCalendar size={24} />
                        <p>Joined {created_at}</p>
                    </div>
                </div>
                <div className="flex flex-row items-center mt-4 gap-6">
                    <div className="flex flex-row items-center gap-1">
                        <p className="">{fetchedUser?.result?.followingUsers.length}</p>
                        <p className="text-neutral-500">Following</p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <p className="">{fetchedUser?.result?.followedUsers.length}</p>
                        <p className="text-neutral-500">Followers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserBio;
