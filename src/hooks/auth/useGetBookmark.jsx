import useSWR from 'swr';
import fetcher from '../../lib/fetcher';

const useGetBookmarks = () => {
    const { data, error, isLoading, mutate } = useSWR(`/api/bookmarks?page=1&limit=5`, fetcher, {
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

export default useGetBookmarks;
