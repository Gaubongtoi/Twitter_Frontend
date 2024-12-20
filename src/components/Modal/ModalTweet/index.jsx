import useCurrentUser from '../../../hooks/auth/useCurrentUser';
import { useState } from 'react';
import Modal from '..';
import useQuote from '../../../hooks/modal/useQuote';
import Form from '../../Form';
import TweetItem from '../../TweetItem';
import useTweetModal from '../../../hooks/modal/useTweetModal';

function ModalTweet() {
    const [isLoading, setIsLoading] = useState(false);
    const { data: currentUser } = useCurrentUser();
    const tweetModal = useTweetModal();
    // const tweetModalState = useTweetModal.getState();
    // console.log(useQuote.getState().data?._id);

    const bodyContent = (
        <div className="flex flex-col gap-4 p-2 w-96 sm:w-auto">
            <div className="">
                <Form isBBorder={false} placeholder="What's Happening?" user_id={currentUser?.result?._id} />
            </div>
        </div>
    );
    return (
        <>
            <Modal
                disabled={isLoading}
                isOpen={tweetModal.isOpen}
                // title="Quote This Tweet"
                // actionLabel="Save"
                onClose={tweetModal.onClose}
                body={bodyContent}
            />
        </>
    );
}

export default ModalTweet;
