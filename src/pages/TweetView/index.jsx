import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Layouts/components/Header';
import useTweetDetail from '../../hooks/auth/useTweetDetail';
import { ClipLoader } from 'react-spinners';
import Form from '../../components/Form';
import TweetItem from '../../components/TweetItem';
import useTweets from '../../hooks/auth/useTweets';
import CommentFeed from '../../components/CommentFeed';
import useTweetChildren from '../../hooks/auth/useTweetChildren';

function TweetView() {
    let { tweet_id } = useParams();
    const { data: fetchedTweetDetail, isLoading } = useTweetChildren(tweet_id);
    const { data: fetchedTweet } = useTweetDetail(tweet_id);

    // console.log('fetchedTweetDetail: ', fetchedTweetDetail);
    if (isLoading || !fetchedTweetDetail) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }
    return (
        <div>
            <Header label="Tweet" showBackArrow />
            {/* <TweetItem key={tweet._id} data={tweet} user_id={tweet.user_id} type={tweet.type} />; */}
            <TweetItem
                data={fetchedTweet?.result}
                type={fetchedTweet?.result?.type}
                user_id={fetchedTweet?.result?.user_id}
                isReturn
            />
            <Form
                postId={tweet_id}
                tweet_type={2}
                placeholder={'Tweet your reply'}
                type={fetchedTweet?.result?.type}
                user_id={fetchedTweet?.result?.user_id}
            />
            {fetchedTweetDetail?.result?.tweet &&
                fetchedTweetDetail?.result?.tweet.map((tweet, id) => {
                    return <CommentFeed key={id} tweet_id={tweet?._id} />;
                })}
        </div>
    );
}

export default TweetView;
