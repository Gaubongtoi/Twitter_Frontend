import { format } from 'date-fns';

import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useUser from '../../hooks/auth/useUser';
import { useMemo } from 'react';
import ButtonExpand from '../ButtonExpand';
import { BiCalendar } from 'react-icons/bi';
import { IoIosLink } from 'react-icons/io';
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
                <div className="flex flex-col justify-center sm:justify-start">
                    <p className="text-2xl font-semibold ">{currentUser?.result?.name}</p>
                    <p className="text-md text-neutral-500 ">
                        @{currentUser?.result?.username ? currentUser?.result?.username : currentUser?.result?.name}
                    </p>
                </div>
                <div className="flex flex-col mt-4">
                    <p className="whitespace-pre-wrap text-sm">
                        {currentUser?.result?.bio ? currentUser?.result?.bio : 'User has not updated their bio'}
                    </p>
                    <div className="flex gap-4 text-sm mt-4 items-center">
                        <div className="flex flex-row items-center gap-2 text-neutral-500">
                            <BiCalendar size={24} />
                            <p>Joined {created_at}</p>
                        </div>
                        {currentUser?.result?.website && (
                            <div className="flex flex-row items-center gap-2 text-neutral-500">
                                <IoIosLink size={24} />
                                <a
                                    className="text-[#1da1f2] truncate sm:w-[200px] w-12 font-semibold"
                                    href={`${currentUser?.result?.website}`}
                                >
                                    {currentUser?.result?.website}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-row items-center mt-4  gap-6">
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
