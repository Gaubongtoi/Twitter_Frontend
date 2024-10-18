import { useEffect } from 'react';
import Form from '../../components/Form';
import Header from '../../components/Layouts/components/Header';
import TweetFeed from '../../components/TweetFeed';
// import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useTagBar from '../../hooks/state/useTagBar';

function Home() {
    const tagSelection = useTagBar();
    const tagState = useTagBar.getState();
    useEffect(() => {
        if (tagState.tag !== 'Home') {
            tagSelection.setTag('Home');
        }
    }, [tagSelection, tagState.tag]);
    return (
        <div className="h-full">
            <Header label="Home" />
            <Form placeholder="What's happening?" />
            <TweetFeed />
        </div>
    );
}

export default Home;
