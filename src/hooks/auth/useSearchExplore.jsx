import useSWRInfinite from 'swr/infinite';
import fetcher from '../../lib/fetcher';
const PAGE_SIZE = 4;

const useSearchExplore = ({ query }) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && previousPageData.length > 0) {
            // Kiểm tra nếu mảng tweets từ trang trước đó rỗng
            const previousTweets = previousPageData[0].result.tweets; // Lấy tweets từ trang trước đó
            if (previousTweets.length === 0) return null; // Nếu không còn dữ liệu, trả về null
        }
        return `/api/search?content=${query}&page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
    };
    const { data, error, isValidating, size, setSize, mutate } = useSWRInfinite(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 100000,
    });
    // Flatten data từ nhiều page
    const tweets = data ? data.flatMap((page) => page.result?.tweets || []) : [];
    const sortedTweets = tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    // Lấy tổng số trang từ dữ liệu trả về
    const totalPage = data?.[0]?.total_page;

    // Kiểm tra còn dữ liệu để tải thêm hay không
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
        hasMore, // Đã sửa logic hasMore
    };
};

export default useSearchExplore;
