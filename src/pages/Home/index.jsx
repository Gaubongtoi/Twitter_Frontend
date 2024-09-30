import Form from '../../components/Form';
import Header from '../../components/Layouts/components/Header';
import TweetFeed from '../../components/TweetFeed';
import useCurrentUser from '../../hooks/auth/useCurrentUser';

function Home() {
    return (
        <div>
            <Header label="Home" />
            <Form placeholder="What's happening?" />
            <TweetFeed />
        </div>
    );
}

export default Home;
