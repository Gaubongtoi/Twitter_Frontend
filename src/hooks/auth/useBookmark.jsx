import useCurrentUser from './useCurrentUser';
import useTweetDetail from './useTweetDetail';
import useTweets from './useTweets';
import { useCallback, useMemo } from 'react';
import useLoginNoti from '../modal/useLoginNoti';
import http from '../../utils/http';
import toast from 'react-hot-toast';
import useGetBookmarks from './useGetBookmark';

const useBookmark = ({ tweetId, userId }) => {
    const { data: currentUser } = useCurrentUser();
    // console.log('Tweet_id: ', tweetId);

    const { data: fetchedTweet, mutate: mutateFetchedTweet } = useTweetDetail(tweetId);
    const { mutate: mutateFetchedTweets } = useTweets(userId);
    const { mutate: mutateFetchedFeed } = useTweets();
    const { mutate: mutateFetchedBookmark } = useGetBookmarks();

    const loginModal = useLoginNoti();
    const hasBookmarked = useMemo(() => {
        const list = fetchedTweet?.result?.bookmarks?.map((bookmark) => bookmark.user_id) || [];
        return list.includes(currentUser?.result?._id);
    }, [currentUser?.result?._id, fetchedTweet?.result?.bookmarks]);
    const toggleBookmark = useCallback(async () => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        try {
            let request;
            if (hasBookmarked) {
                request = () => http.delete(`/api/bookmarks/tweets/${tweetId}`);
            } else {
                request = () =>
                    http.post('api/bookmarks', {
                        tweet_id: tweetId,
                    });
            }
            const res = await request();
            mutateFetchedTweet();
            mutateFetchedTweets();
            mutateFetchedFeed();
            mutateFetchedBookmark();
            toast.success(`${res.data.message}`);
        } catch (error) {
            console.log(error);

            toast.error('Bookmark Error');
        }
    }, [currentUser, hasBookmarked, loginModal, mutateFetchedTweet, mutateFetchedTweets, tweetId, mutateFetchedFeed]);
    return {
        hasBookmarked,
        toggleBookmark,
    };
};

export default useBookmark;
