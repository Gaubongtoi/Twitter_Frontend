import Header from '../../components/Layouts/components/Header';
import useTweetDetail from '../../hooks/auth/useTweetDetail';
import { ClipLoader, MoonLoader } from 'react-spinners';
import Form from '../../components/Form';
import TweetItem from '../../components/TweetItem';
import useTweets from '../../hooks/auth/useTweets';
import CommentFeed from '../../components/CommentFeed';
import useGetBookmarks from '../../hooks/auth/useGetBookmark';
import InfiniteScroll from 'react-infinite-scroll-component';
import useTagBar from '../../hooks/state/useTagBar';
import { useEffect } from 'react';
import images from '../../assets/images';

function BookmarkView() {
    const { tweets: fetchedBookmark, isLoading, size, setSize, totalPage, hasMore } = useGetBookmarks();
    const tagSelection = useTagBar();
    const tagState = useTagBar.getState();
    useEffect(() => {
        if (tagState.tag !== 'Bookmark') {
            tagSelection.setTag('Bookmark');
        }
    }, [tagSelection, tagState.tag]);
    if (isLoading || !fetchedBookmark) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }
    const loadMoreTweets = () => {
        if (size < totalPage) {
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
                    {fetchedBookmark.length > 0 ? (
                        fetchedBookmark.map((tweet) => {
                            return <TweetItem key={tweet._id} data={tweet} user_id={tweet.user_id} type={tweet.type} />;
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full gap-5 mt-4">
                            <div className="text-red-500">
                                <img src={images.logo} alt="" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Save posts for later</h2>
                            <p className="text-gray-600 text-center">
                                Bookmark posts to easily find them again in the future.
                            </p>
                        </div>
                    )}
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
