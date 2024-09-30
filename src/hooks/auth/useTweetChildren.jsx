import useSWR from 'swr';
import fetcher from '../../lib/fetcher';

const useTweetChildren = (tweetId, type = 2) => {
    // const url = type ? `/api/tweets/${tweetId}/children?limit=10&page=1&tweet_type=2` : `/api/tweets/${tweetId}`;
    // console.log(url);
    // console.log('tweetId useTweetChildren: ', tweetId);

    const { data, error, isLoading, mutate } = useSWR(
        `/api/tweets/${tweetId}/children?limit=10&page=1&tweet_type=${type}`,
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            shouldRetryOnError: false,
            refreshInterval: 100000,
            onError: (err) => {
                console.error(`Error fetching data. Status: ${err?.status}, Info:`, err?.info);
            },
        },
    );
    return {
        data: data, // Ensure `data` is always defined
        error: error, // Ensure `error` is always defined
        isLoading: !error && !data,
        mutate,
    };
};

export default useTweetChildren;
