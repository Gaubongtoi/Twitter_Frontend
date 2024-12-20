import { IoSettingsOutline } from 'react-icons/io5';
import { TbMessageCirclePlus } from 'react-icons/tb';
import Button from '../../components/Button';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '../../components/Popper';
import 'tippy.js/dist/tippy.css'; // optional
import Header from '../../components/Layouts/components/Header';
import { BsSearch } from 'react-icons/bs';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdOutlinePushPin, MdDelete } from 'react-icons/md';
import { BiBellOff } from 'react-icons/bi';
import { FaRegFlag } from 'react-icons/fa';
import Avatar from '../../components/Avatar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useConservation from '../../hooks/auth/useConservationList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader, MoonLoader } from 'react-spinners';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useConservationList from '../../hooks/auth/useConservationList';
import useTagBar from '../../hooks/state/useTagBar';
import useAddMessage from '../../hooks/modal/useAddMessage';
function Message() {
    const { isLoading, size, setSize, totalPage, hasMore, sortedReceivers: fetchReceivers } = useConservationList();
    const { data: currentUser } = useCurrentUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [receiverId, setReceiverId] = useState(null);
    const tagSelection = useTagBar();
    const addMessageModal = useAddMessage();
    const tagState = useTagBar.getState();

    useEffect(() => {
        if (tagState.tag !== 'Messages') {
            tagSelection.setTag('Messages');
        }
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('receiver_id');
        if (id) {
            setReceiverId(id);
        } else {
            setReceiverId(null);
        }
    }, [location.search, tagSelection, tagState]);
    const created_at = useCallback((data) => {
        if (!data?.created_at) {
            return null;
        }
        const now = new Date();
        const date = new Date(data?.created_at);
        const differenceInHours = (now - date) / (1000 * 60 * 60); // Tính chênh lệch giờ

        // Nếu chênh lệch lớn hơn 24 giờ, hiển thị ngày tháng
        if (differenceInHours > 24) {
            return format(date, 'MMM dd'); // Bạn có thể chỉnh định dạng ngày ở đây
        }

        // Nếu chênh lệch nhỏ hơn hoặc bằng 24 giờ, hiển thị khoảng cách thời gian
        return formatDistanceToNowStrict(date);
        // return formatDistanceToNowStrict(new Date(data?.created_at));
    }, []);
    const handleAddMessage = useCallback(
        (e) => {
            addMessageModal.setOpen();
        },
        [addMessageModal],
    );
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader />
            </div>
        );
    }
    const loadMoreTweets = () => {
        if (size < totalPage) {
            console.log('Loading more tweets...'); // In ra thông báo đang tải thêm tweet
            setTimeout(() => {
                setSize(size + 1);
            }, 3000);
        }
    };

    return (
        <div className="h-screen overflow-y-auto">
            <div className="px-4 pt-2 pb-4">
                {/* Header Message */}
                <div className="flex justify-between items-center">
                    <Header
                        label="Messages"
                        decoration
                        showBackArrow={typeof window !== 'undefined' && window.innerWidth >= 640}
                    />
                    {/* <div className="font-bold text-xl">Messages</div> */}
                    <div className="flex gap-1 h-full">
                        <Tippy delay={[300, 50]} content="Settings" placement="bottom">
                            <div className="px-2 py-2 cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 rounded-full">
                                <IoSettingsOutline />
                            </div>
                        </Tippy>
                        <Tippy delay={[300, 50]} content="New message" placement="bottom">
                            <div
                                onClick={(e) => {
                                    addMessageModal.onOpen();
                                }}
                                className="px-2 py-2 cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 rounded-full"
                            >
                                <TbMessageCirclePlus />
                            </div>
                        </Tippy>
                    </div>
                </div>
                {/* Conservation List */}
                {fetchReceivers.length <= 0 && (
                    <div className="w-full">
                        <div className="max-w-96 mx-auto my-8">
                            <h2 className="font-bold text-3xl mb-2">
                                Welcome to your
                                <hr className="border-none" />
                                inbox!
                            </h2>
                            <p className="text-sm text-neutral-500">
                                Drop a line, share posts and more with private conversations between you and others on
                                X.{' '}
                            </p>
                            <div className="mt-9 w-64">
                                <Button
                                    rounded
                                    primary
                                    onClick={() => {
                                        addMessageModal.onOpen();
                                    }}
                                >
                                    Write a message
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {fetchReceivers && fetchReceivers.length > 0 && (
                <div className="w-full">
                    <div className="w-full px-10 my-2 sticky top-4 z-10">
                        <div className="flex gap-2 rounded-full border-gray-500 bg-white border-2 py-2 px-4 items-center text-sm ">
                            <BsSearch />
                            <input
                                className="bg-transparent w-full outline-none"
                                type="text"
                                placeholder="Search Direct Messages"
                            />
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col">
                        <InfiniteScroll
                            dataLength={fetchReceivers.length} // Số lượng tweet hiện tại
                            next={loadMoreTweets} // Hàm tải thêm tweets
                            hasMore={hasMore} // Kiểm tra còn dữ liệu hay không
                            loader={
                                <div className="flex justify-center items-center h-full my-3">
                                    <MoonLoader size={30} color="#1A8CCF" />
                                </div>
                            }
                        >
                            {fetchReceivers.map((receiver) => {
                                return (
                                    <div
                                        key={receiver?._id}
                                        className={`group relative items-center px-10 py-3 flex flex-row gap-3 ${
                                            receiver?.sender_id?.toString() === receiverId ||
                                            receiver?.receiver_id?.toString() === receiverId
                                                ? 'bg-[#696a6b] bg-opacity-10 border-r border-primary_darken'
                                                : ''
                                        } hover:bg-[#696a6b] hover:bg-opacity-10 hover:border-r hover:border-primary_darken cursor-pointer`}
                                        onClick={() => {
                                            if (receiver?.sender_id === currentUser?.result?._id) {
                                                navigate(`/api/message?receiver_id=${receiver?.receiver_id}`);
                                            } else if (receiver?.receiver_id === currentUser?.result?._id) {
                                                navigate(`/api/message?receiver_id=${receiver?.sender_id}`);
                                            }
                                        }}
                                    >
                                        <div className="grow">
                                            <Avatar userId={receiver?.userInfo?._id} />
                                        </div>
                                        <div className="w-11/12">
                                            <div className="flex flex-row items-center gap-2">
                                                <p className="font-semibold cursor-pointer hover:underline">
                                                    {receiver?.userInfo?.name}
                                                </p>
                                                {/* <span className="text-neutral-500 cursor-pointer hover:underline block overflow-hidden text-ellipsis whitespace-nowrap w-[100px]">
                                                    @{receiver?.userInfo?.username}
                                                </span> */}
                                                <span className="text-neutral-500 text-sm hidden lg:block">
                                                    {created_at(receiver)}
                                                </span>
                                            </div>
                                            <div className="mt-1">
                                                <p className="text-neutral-400 text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">
                                                    {receiver?.content}
                                                </p>
                                            </div>
                                        </div>
                                        <HeadlessTippy
                                            interactive
                                            appendTo={() => document.body}
                                            placement="bottom"
                                            delay={[300, 0]}
                                            render={(attrs) => {
                                                return (
                                                    <div
                                                        className="w-auto h-auto min-w-48 max-w-80 "
                                                        tabIndex="-1"
                                                        {...attrs}
                                                    >
                                                        <PopperWrapper>
                                                            <div className="flex p-3 items-center gap-3 cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 rounded-t-lg">
                                                                <MdOutlinePushPin size={20} />
                                                                <p className="font-bold text-sm">Pin conversation</p>
                                                            </div>
                                                            <div className="flex p-3 items-center gap-3 cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 ">
                                                                <BiBellOff size={20} />
                                                                <p className="font-bold text-sm">Snooze conversation</p>
                                                            </div>
                                                            <div className="flex p-3 items-center gap-3 cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 ">
                                                                <FaRegFlag size={16} />
                                                                <p className="font-bold text-sm">Report conversation</p>
                                                            </div>
                                                            <div className="flex p-3 items-center gap-3 cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 rounded-b-lg">
                                                                <MdDelete size={20} color="red" />
                                                                <p className="font-bold text-sm text-red-500">
                                                                    Delete conversation
                                                                </p>
                                                            </div>
                                                        </PopperWrapper>
                                                    </div>
                                                );
                                            }}
                                        >
                                            <div className="absolute right-6 hidden group-hover:block p-1 rounded-full hover:bg-blue-100">
                                                <HiDotsHorizontal color="navy" size={18} />
                                            </div>
                                        </HeadlessTippy>
                                    </div>
                                );
                            })}
                        </InfiniteScroll>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Message;
