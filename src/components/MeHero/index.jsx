import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useUser from '../../hooks/auth/useUser';
import Avatar from '../Avatar';

function MeHero() {
    const { data: currentUser } = useCurrentUser();
    // console.log(fetchedUser.result.cover_photo);

    return (
        <div className="bg-dark_6 h-44 relative">
            {currentUser.result.cover_photo && <img className="object-cover rounded-full w-full h-full" alt="Avatar" />}
            <div className="absolute -bottom-16 left-4">
                <Avatar userId={currentUser.result._id} isLarge hasBorder />
            </div>
        </div>
    );
}

export default MeHero;
