import useSWRInfinite from 'swr/infinite';
import fetcher from '../../lib/fetcher';
const PAGE_SIZE = 10;

const useConversation = (receiver_id) => {
    // console.log('receiver_id: ', receiver_id);

    const getKey = (pageIndex, previousPageData) => {
        // console.log('pageIndex: ', previousPageData[0]);
        // console.log(previousPageData);

        if (previousPageData && previousPageData.length > 0) {
            // Kiểm tra nếu mảng tweets từ trang trước đó rỗng
            const previousTweets = previousPageData[0].result.conversations; // Lấy tweets từ trang trước đó
            if (previousTweets.length === 0) return null; // Nếu không còn dữ liệu, trả về null
        }
        // ? `/api/tweets/user?user_id=${userId}&page=${pageIndex}&limit=${PAGE_SIZE}`
        return `/api/message?receiver_id=${receiver_id}&page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
    };
    const { data, error, isValidating, size, setSize, mutate } = useSWRInfinite(getKey, fetcher, {
        revalidateOnFocus: false, // Không tự động revalidate khi focus lại
        revalidateOnReconnect: false, // Không tự động revalidate khi reconnect lại mạng
        refreshInterval: 100000,
    });
    // console.log(data);

    // Flatten data từ nhiều page
    const conversations = data ? data.flatMap((page) => page.result?.conversations || []) : [];
    // const sortedReceivers = receivers.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    // Lấy tổng số trang từ dữ liệu trả về

    const totalPage = data?.[0]?.result?.total_page;

    // Kiểm tra còn dữ liệu để tải thêm hay không
    const hasMore = size < totalPage;
    return {
        conversations,
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

export default useConversation;
