import useTweets from '../../hooks/auth/useTweets';
import TweetItem from '../TweetItem';

function TweetFeed({ user_id }) {
    const { data: tweets } = useTweets(user_id);
    console.log('Cai dit con me: ', tweets);

    return (
        <>
            {tweets?.result?.tweets.map((tweet) => {
                return <TweetItem key={tweet._id} data={tweet} user_id={tweet.user_id} />;
            })}
        </>
    );
}

export default TweetFeed;
