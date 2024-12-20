import useTweetDetail from '../../hooks/auth/useTweetDetail';
import TweetItem from '../TweetItem';

function CommentFeed({ tweet_id }) {
    const { data: fetchedTweet } = useTweetDetail(tweet_id);
    return (
        <>
            <TweetItem data={fetchedTweet?.result} user_id={fetchedTweet?.result?.user_id} />
        </>
    );
}

export default CommentFeed;
