import useSWR from 'swr';
import fetcher from '../../lib/fetcher';

const useCurrentUser = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/user/me', fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        refreshInterval: 30000,
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

export default useCurrentUser;
