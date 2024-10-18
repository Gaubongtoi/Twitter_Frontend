import { useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import Header from '../../components/Layouts/components/Header';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import MeHero from '../../components/MeHero';
import MeBio from '../../components/MeBio';
import TweetFeed from '../../components/TweetFeed';
import Form from '../../components/Form';
import useTagBar from '../../hooks/state/useTagBar';
import { useEffect } from 'react';
function MeProfile() {
    const { data: fetchedUser, isLoading } = useCurrentUser();
    // console.log(fetchedUser?.result._id);
    const tagSelection = useTagBar();
    const tagState = useTagBar.getState();
    useEffect(() => {
        if (tagState.tag !== 'Profile') {
            tagSelection.setTag('Profile');
        }
    }, [tagSelection, tagState.tag]);
    if (isLoading || !fetchedUser) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }
    return (
        <>
            <Header label={fetchedUser?.result?.name + ' ' + '(Me)'} showBackArrow />
            <MeHero user_id={fetchedUser?.result?._id} />
            <MeBio user_id={fetchedUser?.result?._id} />
            <Form placeholder="What's happening?" user_id={fetchedUser?.result?._id} />
            <TweetFeed user_id={fetchedUser?.result?._id} />
        </>
    );
}

export default MeProfile;
