import useUser from '../../hooks/auth/useUser';
import Avatar from '../Avatar';

function UserHero({ user_id }) {
    const { data: fetchedUser } = useUser(user_id);
    // console.log(fetchedUser.result.cover_photo);

    return (
        <div className="bg-blue-300 h-44 relative">
            {fetchedUser.result.cover_photo && (
                <img className="object-cover w-full h-full" alt="Avatar" src={fetchedUser.result.cover_photo} />
            )}
            <div className="absolute -bottom-16 left-4">
                <Avatar userId={user_id} isLarge hasBorder />
            </div>
        </div>
    );
}

export default UserHero;
