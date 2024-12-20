import InfiniteScroll from 'react-infinite-scroll-component';
import Avatar from '../Avatar';
import { ClipLoader, MoonLoader, PulseLoader } from 'react-spinners';
import useConversation from '../../hooks/auth/useConversation';
import { useCallback, useEffect, useMemo } from 'react';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import { format } from 'date-fns';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import socket from '../../chats/socket';
import { useNavigate } from 'react-router-dom';
import useConservationList from '../../hooks/auth/useConservationList';
function ConversationContent({ receiverId, fetchedUser }) {
    const navigate = useNavigate();
    const {
        conversations: fetchedConversations,
        isLoading,
        size,
        setSize,
        totalPage,
        hasMore,
        mutate,
    } = useConversation(receiverId);
    const { mutate: mutateConversationList } = useConservationList();
    const { data: currentUser } = useCurrentUser();
    const loadMoreTweets = useCallback(() => {
        if (size < totalPage) {
            setTimeout(() => {
                setSize(size + 1);
            }, 3000);
        }
    }, [setSize, size, totalPage]);
    const created_at = useMemo(() => {
        if (!fetchedUser?.result?.create_at) {
            return null;
        }
        return format(new Date(fetchedUser?.result?.create_at), 'MMMM yyyy');
    }, [fetchedUser?.result?.create_at]);
    const mes_reponse_time = useCallback((dateString) => {
        const date = new Date(dateString);

        // Lấy thứ trong tuần
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

        // Lấy thời gian định dạng 12 giờ với AM/PM
        const time = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        // Trả về định dạng mong muốn
        return `${dayOfWeek} ${time}`;
    }, []);
    const goToUser = useCallback(
        (e) => {
            e.stopPropagation();
            if (receiverId === currentUser.result._id) {
                navigate(`/api/user/me`);
            } else {
                // console.log(`/api/user/profile?user_id=${data?.user?._id}`);
                navigate(`/api/user/profile?user_id=${receiverId}`);
            }
        },
        [currentUser?.result._id, navigate, receiverId],
    );
    useEffect(() => {
        const handleReceiverMessage = () => {
            mutate();
            mutateConversationList();
        };
        socket.on('receiver_message', handleReceiverMessage);
        socket.on('connect_error', (err) => {
            console.log(err.data);
        });
        socket.on('disconnect', (reason) => {
            console.log(reason);
        });
        return () => {
            socket.off('receiver_message', handleReceiverMessage);
        };
    }, [mutate]);
    if (isLoading || !fetchedConversations) {
        return (
            <div className="w-full hidden xl:flex md:items-center md:justify-center h-[calc(100vh_-_158px)]">
                <ClipLoader />
            </div>
        );
    }
    return (
        <div id="scrollableDiv" className="relative max-h-[calc(100vh_-_158px)] overflow-y-auto flex flex-col-reverse">
            {/* <div className="flex flex-col" ref={messagesEndRef}> */}

            <InfiniteScroll
                dataLength={fetchedConversations.length}
                next={loadMoreTweets}
                className="flex flex-col-reverse"
                inverse={true} //
                endMessage={
                    <div
                        className="px-4 py-5 flex flex-col items-center justify-start cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 mb-2"
                        onClick={goToUser}
                    >
                        <Avatar userId={fetchedUser?.result?._id} />
                        <p className="font-bold text-base block">{fetchedUser?.result?.name}</p>
                        <p className="text-neutral-500 text-sm cursor-pointer block mb-3">
                            {fetchedUser?.result?.username}
                        </p>
                        <p className="text-neutral-500">
                            Joined {created_at} · {fetchedUser?.result?.followedUsers?.length} Followers
                        </p>
                        <p className="text-neutral-500">Not followed by anyone you&apos;re following</p>
                    </div>
                }
                hasMore={hasMore}
                loader={
                    <div className="flex justify-center">
                        <div className="rounded-full bg-blue-400 flex justify-center items-center p-2 my-3">
                            {/* <p className="text-base text-white">Loading...</p> */}
                            <PulseLoader size={10} color="white" />
                        </div>
                    </div>
                }
                scrollableTarget="scrollableDiv"
            >
                {fetchedConversations?.map((conversation) => {
                    return (
                        <div
                            className={`flex ${
                                conversation?.sender_id === currentUser?.result?._id
                                    ? 'flex-row-reverse'
                                    : ' flex-col-reverse'
                            }  mb-4 animation-duration-200 px-2`}
                            key={conversation?._id}
                        >
                            <Tippy
                                key={conversation?._id}
                                delay={[300, 50]}
                                content={mes_reponse_time(conversation.created_at)}
                                placement="bottom"
                            >
                                <div
                                    className={`${
                                        conversation?.sender_id === currentUser?.result?._id
                                            ? 'bg-[#1D9BF0] text-white rounded-tl-full rounded-tr-full rounded-bl-full'
                                            : 'bg-neutral-200 text-black rounded-br-full rounded-tr-full rounded-tl-full'
                                    } max-w-[70%] py-[12px] px-[16px]`}
                                >
                                    <p className="break-words">{conversation.content}</p>
                                </div>
                            </Tippy>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex justify-center items-center h-full my-3">
                        <MoonLoader size={30} color="#1A8CCF" />
                    </div>
                )}
            </InfiniteScroll>
        </div>
    );
}

export default ConversationContent;
