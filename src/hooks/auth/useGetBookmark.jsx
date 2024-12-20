import useSWRInfinite from 'swr/infinite';
import fetcher from '../../lib/fetcher';
const PAGE_SIZE = 5;

const useGetBookmarks = () => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length > 0) {
            const previousTweets = previousPageData[0].result.tweets;
            if (previousTweets.length === 0) return null;
        }
        return `/api/bookmarks?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
    };
    const { data, error, isValidating, size, setSize, mutate } = useSWRInfinite(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 100000,
    });
    const tweets = data ? data.flatMap((page) => page.result?.tweets || []) : [];
    const totalPage = data?.[0]?.total_page;
    const hasMore = size < totalPage;
    return {
        tweets,
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

export default useGetBookmarks;
