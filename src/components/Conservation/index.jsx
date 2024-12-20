import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../Button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import socket from '../../chats/socket';
import useConservationList from '../../hooks/auth/useConservationList';
import useUser from '../../hooks/auth/useUser';
import { GoPaperAirplane } from 'react-icons/go';
import Header from '../Layouts/components/Header';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import { IoIosInformationCircleOutline } from 'react-icons/io';
import ConversationContent from '../ConversationContent';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useConversation from '../../hooks/auth/useConversation';
import { BiArrowBack } from 'react-icons/bi';
import useAddMessage from '../../hooks/modal/useAddMessage';
function Conservation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [receiverId, setReceiverId] = useState(null);
    const [input, setInput] = useState('');
    const { sortedReceivers: fetchedConversationList, mutate: mutateConversationList } = useConservationList();
    const { data: fetchedUser } = useUser(receiverId);
    const { data: currentUser } = useCurrentUser();
    const { mutate } = useConversation(receiverId);
    const addMessageModal = useAddMessage();
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('receiver_id');
        if (id) {
            setReceiverId(id);
        } else {
            setReceiverId(null);
        }
    }, [location.search]);
    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('send_message', {
            payload: {
                content: input,
                receiver_id: receiverId,
                sender_id: currentUser?.result?._id,
            },
        });
        setInput('');
        mutate();
        mutateConversationList();
    };
    // const handleScroll = (event) => {
    //     const { scrollTop, scrollHeight, clientHeight } = event.target;
    //     console.log('scrollTop:', scrollTop);
    // };
    return (
        <div
            className={`lg:w-1/2  ${
                receiverId ? 'w-full sm:ml-[150px] lg:ml-0' : 'hidden'
            } lg:flex md:items-center md:justify-center border-r border-gray`}
        >
            {fetchedConversationList.length <= 0 || !receiverId ? (
                <div className="h-fit md:flex justify-center items-center">
                    <div className="w-full my-8 mx-auto max-w-96 px-8">
                        <div className="">
                            <h3 className="font-bold text-3xl mb-2">Select a message</h3>
                            <p className="text-sm text-neutral-500">
                                Choose from your existing conversations, start a new one, or just keep swimming.
                            </p>
                            <div className="mt-9 w-44">
                                <Button
                                    rounded
                                    primary
                                    onClick={() => {
                                        addMessageModal.onOpen();
                                    }}
                                >
                                    New message
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="block h-full w-full ">
                    <div className="max-w-full h-[calc(100vh_-_80px)]">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b px-4 pt-2 pb-4 border-gray-200">
                            <div className="flex items-center">
                                <BiArrowBack
                                    onClick={() => {
                                        navigate('/api/message');
                                    }}
                                    size={26}
                                    className="lg:hidden cursor-pointer hover:opacity-70 transition"
                                />
                                <Header label={fetchedUser?.result?.name} decoration />
                            </div>
                            <Tippy delay={[300, 50]} content="More" placement="bottom">
                                <div className="px-2 py-2 cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 rounded-full">
                                    <IoIosInformationCircleOutline size={20} />
                                </div>
                            </Tippy>
                        </div>
                        {/* Conversation */}
                        <ConversationContent receiverId={receiverId} fetchedUser={fetchedUser} />
                    </div>
                    <div className="sticky bottom-1 z-10 mt-3 bg-white">
                        <div className="border-t border-gray-200 flex justify-between items-center py-2 px-2">
                            <form onSubmit={handleSubmit} className="flex-grow mr-3 rounded-md bg-gray-200 ">
                                <input
                                    type="text"
                                    placeholder="Type a message here"
                                    // {...register('input')}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="py-2 px-2 w-full bg-gray-100 text-base rounded-md placeholder-black"
                                />
                            </form>
                            <button
                                className="w-9 h-9 bg-blue-300 hover:bg-blue-400 text-white rounded-md flex justify-center items-center"
                                onClick={handleSubmit}
                            >
                                {/* <img className="w-full h-full" src={images.iconsend} alt="" /> */}
                                <Tippy delay={[300, 50]} content="Send" placement="bottom">
                                    <div className="px-2 py-2 cursor-pointer hover:bg-[#696a6b] hover:bg-opacity-10 rounded-full">
                                        <GoPaperAirplane color="white" />
                                    </div>
                                </Tippy>
                            </button>
                        </div>
                    </div>{' '}
                </div>
            )}
        </div>
    );
}

export default Conservation;
