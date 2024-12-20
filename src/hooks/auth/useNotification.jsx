import useSWRInfinite from 'swr/infinite';
import fetcher from '../../lib/fetcher';
const PAGE_SIZE = 10;

const useNotification = () => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length > 0) {
            console.log(previousPageData[0]);

            const previousNotifications = previousPageData[0].result;
            if (previousNotifications.length === 0) return null;
        }
        return `/api/notifications?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
    };
    const { data, error, isValidating, size, setSize, mutate } = useSWRInfinite(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 100000,
    });
    const notifications = data ? data.flatMap((page) => page.result || []) : [];
    const totalPage = data?.[0]?.total_page;
    const hasMore = size < totalPage;
    return {
        notifications,
        error,
        isValidating,
        size,
        setSize,
        totalPage,
        mutate,
        isLoading: !error && !data,
        hasMore,
    };
};

export default useNotification;
