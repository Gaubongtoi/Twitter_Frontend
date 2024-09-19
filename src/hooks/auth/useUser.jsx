import useSWR from 'swr';
import fetcher from '../../lib/fetcher';

const useUser = (userId) => {
    const { data, error, isLoading, mutate } = useSWR(`/api/user/profile?user_id=${userId}`, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        refreshInterval: 20000,
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

export default useUser;
