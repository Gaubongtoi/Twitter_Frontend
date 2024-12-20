import useSWR from 'swr';
import fetcher from '../../lib/fetcher';
import useCurrentUser from './useCurrentUser';
import useTweetDetail from './useTweetDetail';
import useTweets from './useTweets';
import { useCallback, useMemo } from 'react';
import useLoginNoti from '../modal/useLoginNoti';
import http from '../../utils/http';
import toast from 'react-hot-toast';
import useSearchExplore from './useSearchExplore';

const useLike = ({ tweetId, userId, query }) => {
    const { data: currentUser } = useCurrentUser();
    const { data: fetchedTweet, mutate: mutateFetchedTweet } = useTweetDetail(tweetId);
    const { mutate: mutateFetchedTweets } = useTweets(userId);
    const { mutate: mutateFetchedFeed } = useTweets();
    const { mutate: mutateFetchedExlore } = useSearchExplore({ query });
    const loginModal = useLoginNoti();
    const hasLiked = useMemo(() => {
        const list = fetchedTweet?.result?.likes?.map((like) => like.user_id) || [];
        return list.includes(currentUser?.result?._id);
    }, [currentUser?.result?._id, fetchedTweet?.result?.likes]);
    const toggleLike = useCallback(async () => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        try {
            let request;
            if (hasLiked) {
                request = () => http.delete(`api/likes/tweets/${tweetId}`);
            } else {
                request = async () => {
                    await http.post('/api/notifications', {
                        tweet_id: tweetId,
                        receiver_id: userId,
                        type: 1,
                    });
                    const likeResponse = await http.post('api/likes', {
                        tweet_id: tweetId,
                        user_id: userId,
                    });
                    return {
                        ...likeResponse,
                        data: {
                            ...likeResponse.data,
                        },
                    };
                };
            }
            const res = await request();
            mutateFetchedTweet();
            mutateFetchedTweets();
            mutateFetchedFeed();
            mutateFetchedExlore();
            toast.success(`${res.data.message}`);
        } catch (error) {
            console.log(error);

            toast.error('Like Error');
        }
    }, [
        currentUser,
        hasLiked,
        loginModal,
        mutateFetchedTweet,
        mutateFetchedTweets,
        tweetId,
        mutateFetchedFeed,
        mutateFetchedExlore,
        userId,
    ]);
    return {
        hasLiked,
        toggleLike,
    };
};

export default useLike;
