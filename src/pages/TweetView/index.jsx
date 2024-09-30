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
    // console.log('fetchedTweet: ', fetchedTweet);

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
            <TweetItem data={fetchedTweet?.result} />
            <Form postId={tweet_id} isComment placeholder={'Tweet your reply'} type={fetchedTweet?.result?.type} />
            <CommentFeed comments={fetchedTweetDetail?.result?.tweet} />
        </div>
    );
}

export default TweetView;
