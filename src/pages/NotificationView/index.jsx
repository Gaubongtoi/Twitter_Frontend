import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../../components/Layouts/components/Header';
import useNotification from '../../hooks/auth/useNotification';
import { ClipLoader, MoonLoader } from 'react-spinners';
import Avatar from '../../components/Avatar';
import { FaHeart } from 'react-icons/fa6';
import { IoMdPersonAdd } from 'react-icons/io';
import { FaComments, FaBell, FaQuoteLeft } from 'react-icons/fa';
import { AiFillMessage } from 'react-icons/ai';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useTagBar from '../../hooks/state/useTagBar';
function NotificationView() {
    const { notifications: fetchedNotifications, isLoading, size, setSize, totalPage, hasMore } = useNotification();
    const tagSelection = useTagBar();
    const tagState = useTagBar.getState();
    useEffect(() => {
        if (tagState.tag !== 'Notification') {
            tagSelection.setTag('Notification');
        }
    }, [tagSelection, tagState.tag]);
    const { data: currentUser } = useCurrentUser();
    const navigate = useNavigate();
    if (isLoading || !fetchedNotifications) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }
    const loadMoreTweets = () => {
        if (size < totalPage) {
            setTimeout(() => {
                setSize(size + 1);
            }, 3000);
        }
    };
    return (
        <div className="h-full">
            <Header label="Notifications" showBackArrow />
            <div>
                <InfiniteScroll
                    dataLength={fetchedNotifications.length} // Số lượng tweet hiện tại
                    next={loadMoreTweets} // Hàm tải thêm tweets
                    hasMore={hasMore} // Kiểm tra còn dữ liệu hay không
                    loader={
                        <div className="flex justify-center items-center h-full my-3">
                            <MoonLoader size={30} color="#1A8CCF" />
                        </div>
                    } // Hiển thị khi đang tải thêm
                >
                    {fetchedNotifications.map((noti) => {
                        return (
                            <div
                                key={noti._id}
                                className="flex items-center gap-5 border-b-[1px] border-neutral-800 p-4"
                            >
                                {generateActionNotification(noti, navigate, currentUser?.result?._id)}
                            </div>
                        );
                    })}
                </InfiniteScroll>

                {/* Hiển thị trạng thái loading ban đầu */}
                {isLoading && (
                    <div className="flex justify-center items-center h-full my-3">
                        <MoonLoader size={30} color="#1A8CCF" />
                    </div>
                )}
            </div>
        </div>
    );
}

const generateActionNotification = (noti, navigate, currentUserId) => {
    const goToUser = (e) => {
        e.stopPropagation();
        if (noti.sender_id === currentUserId) {
            navigate(`/api/user/me`);
        } else {
            navigate(`/api/user/profile?user_id=${noti.sender_id}`);
        }
    };
    switch (noti.type) {
        // Following
        case 0:
            return (
                <>
                    <div className="relative" onClick={goToUser}>
                        <Avatar userId={noti.sender_id} />
                        {generateActionIcon(noti.type)}
                        {/* {generateActionIcon(3)} */}
                    </div>
                    {generateActionText(noti.type, noti)}
                </>
            );
        // Like
        case 1:
            return (
                <>
                    <div className="relative">
                        <Avatar userId={noti.sender_id} />
                        {generateActionIcon(noti.type)}
                        {/* {generateActionIcon(3)} */}
                    </div>
                    {generateActionText(noti.type, noti)}
                </>
            );
        // Comment
        case 2:
            return (
                <>
                    <div className="relative">
                        <Avatar userId={noti.sender_id} />
                        {generateActionIcon(noti.type)}
                        {/* {generateActionIcon(3)} */}
                    </div>
                    {generateActionText(noti.type, noti)}
                </>
            );
        // Quote
        case 3:
            return (
                <>
                    <div className="relative">
                        <Avatar userId={noti.sender_id} />
                        {generateActionIcon(noti.type)}
                        {/* {generateActionIcon(3)} */}
                    </div>
                    {generateActionText(noti.type, noti)}
                </>
            );
        // Message
        case 4:
            return (
                <>
                    <div className="relative">
                        <Avatar userId={noti.sender_id} />
                        {generateActionIcon(noti.type)}
                        {/* {generateActionIcon(3)} */}
                    </div>
                    {generateActionText(noti.type, noti)}
                </>
            );
        default:
            break;
    }
};
const generateActionIcon = (action) => {
    switch (action) {
        // Following
        case 0:
            return (
                <IoMdPersonAdd
                    size={22}
                    color="#1DA1F2" // Xanh dương nhạt (Twitter chính)
                    className="absolute -bottom-0 -right-1 rounded-full p-1 bg-white shadow-md"
                />
            );
        // Like
        case 1:
            return (
                <FaHeart
                    size={22}
                    color="#E0245E" // Hồng đỏ đậm (Like Twitter)
                    className="absolute -bottom-0 -right-1 rounded-full p-1 bg-white shadow-md"
                />
            );
        // Comment
        case 2:
            return (
                <FaComments
                    size={22}
                    color="#17BF63" // Xanh lá nhạt (Thân thiện, giao tiếp)
                    className="absolute -bottom-0 -right-1 rounded-full p-1 bg-white shadow-md"
                />
            );
        // Quote
        case 3:
            return (
                <FaQuoteLeft
                    size={22}
                    color="#794BC4" // Tím nhạt (Trích dẫn)
                    className="absolute -bottom-0 -right-1 rounded-full p-1 bg-white shadow-md"
                />
            );
        // Message
        case 4:
            return (
                <AiFillMessage
                    size={22}
                    color="#F5A623" // Vàng nhạt (Gửi tin nhắn)
                    className="absolute -bottom-0 -right-1 rounded-full p-1 bg-white shadow-md"
                />
            );
        default:
            return (
                <FaBell
                    size={22}
                    color="#FFAD1F" // Vàng nhạt (Thông báo)
                    className="absolute -bottom-0 -right-1 rounded-full p-1 bg-white shadow-md"
                />
            );
    }
};
const generateActionText = (action, data) => {
    // console.log(sender);

    switch (action) {
        // Following
        case 0:
            return (
                <p className="w-full">
                    <span className="font-semibold">{data.sender.name}</span> Following You!
                </p>
            );
        // Like
        case 1:
            return (
                <p className="w-full">
                    <span className="font-semibold">{data.sender.name}</span> Like Your Post!
                </p>
            );
        // Comment
        case 2:
            return (
                <p className="w-full">
                    <span className="font-semibold">{data.sender.name}</span> Reply Your Post! <br />
                    <span className="text-sm">{data.content}</span>
                </p>
            );
        // Quote
        case 3:
            return (
                <p className="w-full">
                    <span className="font-semibold">{data.sender.name}</span> Quote Your Post!
                </p>
            );
        // Message
        case 4:
            return (
                <p className="w-full">
                    <span className="font-semibold">{data.sender.name}</span> Send Message!
                    <br />
                    <span className="text-sm">{data.content}</span>
                </p>
            );
        default:
            return (
                <FaBell
                    size={22}
                    color="#FFAD1F" // Vàng nhạt (Thông báo)
                    className="absolute -bottom-0 -right-1 rounded-full p-1 bg-white shadow-md"
                />
            );
    }
};

export default NotificationView;
