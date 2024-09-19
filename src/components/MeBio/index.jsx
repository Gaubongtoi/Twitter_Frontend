import { format } from 'date-fns';

import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useUser from '../../hooks/auth/useUser';
import { useMemo } from 'react';
import ButtonExpand from '../ButtonExpand';
import { BiCalendar } from 'react-icons/bi';
import useEditModal from '../../hooks/modal/useEditModal';

function MeBio({ user_id }) {
    const { data: currentUser } = useCurrentUser();

    const editModal = useEditModal();

    const created_at = useMemo(() => {
        if (!currentUser?.result?.create_at) {
            return null;
        }
        return format(new Date(currentUser?.result?.create_at), 'MMMM yyyy');
    }, [currentUser?.result?.create_at]);
    return (
        <div className="border-b-[1px] border-neutral-800 pb-4">
            <div className="flex justify-end p-2">
                <ButtonExpand label="Edit" secondary onClick={editModal.onOpen} />
            </div>
            <div className="mt-8 px-4">
                <div className="flex flex-col">
                    <p className="text-2xl font-semibold">{currentUser?.result?.name}</p>
                    <p className="text-md text-neutral-500">
                        @{currentUser?.result?.username ? currentUser?.result?.username : currentUser?.result?.name}
                    </p>
                </div>
                <div className="flex flex-col mt-4">
                    <p>{currentUser?.result?.bio ? currentUser?.result?.bio : 'User has not updated their bio'}</p>
                    <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500">
                        <BiCalendar size={24} />
                        <p>Joined {created_at}</p>
                    </div>
                </div>
                <div className="flex flex-row items-center mt-4 gap-6">
                    <div className="flex flex-row items-center gap-1">
                        <p className="">{currentUser?.result?.followingUsers.length}</p>
                        <p className="text-neutral-500">Following</p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <p className="">{currentUser?.result?.followedUsers.length}</p>
                        <p className="text-neutral-500">Followers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MeBio;
