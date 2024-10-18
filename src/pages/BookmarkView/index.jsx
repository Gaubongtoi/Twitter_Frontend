import Header from '../../components/Layouts/components/Header';
import useTweetDetail from '../../hooks/auth/useTweetDetail';
import { ClipLoader, MoonLoader } from 'react-spinners';
import Form from '../../components/Form';
import TweetItem from '../../components/TweetItem';
import useTweets from '../../hooks/auth/useTweets';
import CommentFeed from '../../components/CommentFeed';
import useGetBookmarks from '../../hooks/auth/useGetBookmark';
import InfiniteScroll from 'react-infinite-scroll-component';

function BookmarkView() {
    const { tweets: fetchedBookmark, isLoading, size, setSize, totalPage, hasMore } = useGetBookmarks();

    if (isLoading || !fetchedBookmark) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }
    const loadMoreTweets = () => {
        if (size < totalPage) {
            console.log('Loading more tweets...'); // In ra thông báo đang tải thêm tweet
            setTimeout(() => {
                setSize(size + 1);
            }, 3000);
        }
    };
    return (
        <div>
            <Header label="Your Bookmark" showBackArrow />

            <div>
                <InfiniteScroll
                    dataLength={fetchedBookmark.length} // Số lượng tweet hiện tại
                    next={loadMoreTweets} // Hàm tải thêm tweets
                    hasMore={hasMore} // Kiểm tra còn dữ liệu hay không
                    loader={
                        <div className="flex justify-center items-center h-full my-3">
                            <MoonLoader size={30} color="#1A8CCF" />
                        </div>
                    } // Hiển thị khi đang tải thêm
                >
                    {fetchedBookmark.map((tweet) => {
                        return <TweetItem key={tweet._id} data={tweet} user_id={tweet.user_id} type={tweet.type} />;
                    })}
                </InfiniteScroll>

                {/* Hiển thị trạng thái loading ban đầu */}
                {isLoading && (
                    <div className="flex justify-center items-center h-full my-3">
                        <MoonLoader size={30} color="#1A8CCF" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookmarkView;
