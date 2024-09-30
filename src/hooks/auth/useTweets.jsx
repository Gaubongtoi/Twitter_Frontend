import useSWR from 'swr';
import fetcher from '../../lib/fetcher';

const useTweets = (userId) => {
    const url = userId ? `/api/tweets/user?user_id=${userId}&page=1&limit=5` : `/api/tweets?page=1&limit=5`;
    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        refreshInterval: 100000,
        onError: (err) => {
            console.error(`Error fetching data. Status: ${err?.status}, Info:`, err?.info);
        },
    });
    return {
        data: data, // Ensure `data` is always defined
        error: error, // Ensure `error` is always defined
        isLoading: !error && !data,
        mutate,
    };
};

export default useTweets;
