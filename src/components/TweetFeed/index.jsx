import { useEffect, useState } from 'react';
import useTweets from '../../hooks/auth/useTweets';
import TweetItem from '../TweetItem';
import { ClipLoader, MoonLoader } from 'react-spinners';
import InfiniteScroll from 'react-infinite-scroll-component';

function TweetFeed({ user_id }) {
    const { tweets, isLoading, size, setSize, totalPage, hasMore } = useTweets(user_id);
    const loadMoreTweets = () => {
        if (size < totalPage) {
            setTimeout(() => {
                setSize(size + 1);
            }, 3000);
        }
    };
    return (
        <div>
            <InfiniteScroll
                dataLength={tweets.length} // Số lượng tweet hiện tại
                next={loadMoreTweets} // Hàm tải thêm tweets
                hasMore={hasMore} // Kiểm tra còn dữ liệu hay không
                loader={
                    <div className="flex justify-center items-center h-full my-3">
                        <MoonLoader size={30} color="#1A8CCF" />
                    </div>
                } // Hiển thị khi đang tải thêm
                endMessage={
                    !user_id && (
                        <div className="flex justify-center items-center h-full my-11">
                            <p className="text-2xl">No more tweets to load</p>
                        </div>
                    )
                } // Hiển thị khi không còn dữ liệu
            >
                {tweets.map((tweet) => {
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
    );
}

export default TweetFeed;
