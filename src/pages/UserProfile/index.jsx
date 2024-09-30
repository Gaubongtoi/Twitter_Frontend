import { useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import useUser from '../../hooks/auth/useUser';

import Header from '../../components/Layouts/components/Header';
import UserHero from '../../components/UserHero';
import UserBio from '../../components/UserBio';
import TweetFeed from '../../components/TweetFeed';
function UserProfile() {
    const [searchParams] = useSearchParams();
    const user_id = searchParams.get('user_id');
    const { data: fetchedUser, isLoading } = useUser(user_id);

    if (isLoading || !fetchedUser) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }
    return (
        <>
            <Header label={fetchedUser?.result?.name} showBackArrow />
            <UserHero user_id={user_id} />
            <UserBio user_id={user_id} />
            <TweetFeed user_id={user_id} />
        </>
    );
}

export default UserProfile;
