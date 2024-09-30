import { useCallback, useMemo } from 'react';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import Avatar from '../Avatar';

function CommentItem({ data }) {
    // console.log('Data comment: ', data);

    const { data: currentUser } = useCurrentUser();
    const navigate = useNavigate();
    const goToUser = useCallback(
        (e) => {
            e.stopPropagation();
            if (data?.user_id === currentUser.result._id) {
                navigate(`/api/user/me`);
            } else {
                // console.log(`/api/user/profile?user_id=${data?.user?._id}`);
                navigate(`/api/user/profile?user_id=${data?.user_id}`);
            }
        },
        [currentUser?.result._id, navigate, data?.user_id],
    );
    const created_at = useMemo(() => {
        if (!data?.created_at) {
            return null;
        }
        return formatDistanceToNowStrict(new Date(data?.created_at));
    }, [data?.created_at]);
    return (
        <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-200 transition">
            <div className="flex flex-row items-start gap-3">
                <Avatar userId={data?.user?._id} />
                <div>
                    <div className="flex flex-row items-center gap-2">
                        <p onClick={goToUser} className="font-semibold cursor-pointer hover:underline">
                            {data?.user?.name}
                        </p>
                        <span className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
                            @{data?.user?.username}
                        </span>
                        <span className="text-neutral-500 text-sm">{created_at}</span>
                    </div>
                    <div className="mt-1">{data?.content}</div>
                </div>
            </div>
        </div>
    );
}

export default CommentItem;
