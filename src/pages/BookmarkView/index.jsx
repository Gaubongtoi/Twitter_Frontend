import Header from '../../components/Layouts/components/Header';
import useTweetDetail from '../../hooks/auth/useTweetDetail';
import { ClipLoader } from 'react-spinners';
import Form from '../../components/Form';
import TweetItem from '../../components/TweetItem';
import useTweets from '../../hooks/auth/useTweets';
import CommentFeed from '../../components/CommentFeed';
import useGetBookmarks from '../../hooks/auth/useGetBookmark';

function BookmarkView() {
    const { data: fetchedBookmark, isLoading } = useGetBookmarks();

    if (isLoading || !fetchedBookmark) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }
    return (
        <div>
            <Header label="Your Bookmark" showBackArrow />
            {fetchedBookmark?.result?.map((bookmark) => {
                return <TweetItem key={bookmark._id} data={bookmark} isReturn />;
            })}
        </div>
    );
}

export default BookmarkView;
