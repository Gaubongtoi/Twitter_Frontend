import { useState } from 'react';
import useTweets from '../../hooks/auth/useTweets';
import TweetItem from '../TweetItem';
import { MoonLoader } from 'react-spinners';

function TweetFeed({ user_id, bookmark = false }) {
    const { data: tweets, isLoading } = useTweets(user_id);
    if (isLoading || !tweets) {
        return (
            <div className="flex justify-center items-center mt-4">
                <MoonLoader size={40} color="#1A8CCF" />
            </div>
        );
    }
    return (
        <>
            {tweets?.result?.tweets.map((tweet) => {
                return <TweetItem key={tweet._id} data={tweet} user_id={tweet.user_id} type={tweet.type} />;
            })}
        </>
    );
}

export default TweetFeed;
