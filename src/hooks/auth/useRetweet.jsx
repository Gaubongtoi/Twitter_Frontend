import useSWR from 'swr';
import fetcher from '../../lib/fetcher';
import useCurrentUser from './useCurrentUser';
import useTweetDetail from './useTweetDetail';
import useTweets from './useTweets';
import { useCallback, useMemo } from 'react';
import useLoginNoti from '../modal/useLoginNoti';
import http from '../../utils/http';
import toast from 'react-hot-toast';

const useRetweet = ({ tweetId, userId }) => {
    const { data: currentUser } = useCurrentUser();
    const { data: fetchedTweet, mutate: mutateFetchedTweet } = useTweetDetail(tweetId);
    const { mutate: mutateFetchedTweets } = useTweets(userId);
    const { mutate: mutateFetchedFeed } = useTweets();
    const loginModal = useLoginNoti();
    const hasRetweet = useMemo(() => {
        const list = fetchedTweet?.result?.retweets?.map((retweet) => retweet.user_id) || [];
        return list.includes(currentUser?.result?._id);
    }, [currentUser?.result?._id, fetchedTweet?.result?.retweets]);
    const toggleRetweet = useCallback(async () => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const loadingToast = toast.loading('Waiting...');
        if (hasRetweet) {
            // request = () => http.delete(`api/tweets/${tweetId}`);
            try {
                await delay(import.meta.env.VITE_DELAY_REQUEST);
                let res = await http.delete(`/api/tweets/remove/retweet/${tweetId}`);
                mutateFetchedTweet();
                mutateFetchedTweets();
                mutateFetchedFeed();
                toast.success(`${res.data.message}`, {
                    id: loadingToast,
                });
            } catch (error) {
                console.log(error);
                toast.error('Error', {
                    id: loadingToast,
                });
            }
        } else {
            try {
                await delay(import.meta.env.VITE_DELAY_REQUEST);
                let res = await http.post('/api/tweets', {
                    type: 1,
                    audience: 0,
                    content: null,
                    parent_id: tweetId,
                    hashtags: [],
                    mentions: [],
                    medias: [],
                });
                toast.success(`${res.data.message}`, {
                    id: loadingToast,
                });
                mutateFetchedTweet();
                mutateFetchedTweets();
                mutateFetchedFeed();
            } catch (error) {
                console.log(error);
                toast.error('Error', {
                    id: loadingToast,
                });
            }
        }
    }, [currentUser, hasRetweet, loginModal, mutateFetchedTweet, mutateFetchedTweets, tweetId, mutateFetchedFeed]);
    return {
        hasRetweet,
        toggleRetweet,
    };
};

export default useRetweet;
