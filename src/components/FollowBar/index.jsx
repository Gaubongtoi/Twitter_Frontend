import useUsersRecommendation from '../../hooks/auth/useUsersRecommendation';
import Avatar from '../Avatar';

function FollowBar() {
    const { data: users } = useUsersRecommendation();
    // console.log(users?.followersRecommendation);
    // console.log(users);

    if (users?.followersRecommendation.length === 0) {
        return null;
    }
    return (
        <div className="py-2 hidden lg:block">
            <div className="flex flex-col gap-6 mt-4">
                {users?.followersRecommendation.map((user) => {
                    return (
                        <div key={user.userId} className="flex flex-row gap-4">
                            <div className="w-1/4">
                                <Avatar userId={user.userId} data={user} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="font-semibold text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">
                                    {user.name}
                                </p>
                                <p className="text-neutral-400 text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">
                                    @{user.username ? user.username : user.name}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default FollowBar;
