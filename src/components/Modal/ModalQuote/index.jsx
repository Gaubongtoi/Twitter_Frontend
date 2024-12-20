import { useState } from 'react';
import Modal from '..';
import useQuote from '../../../hooks/modal/useQuote';
import Form from '../../Form';
import TweetItem from '../../TweetItem';

function ModalQuote() {
    const [isLoading, setIsLoading] = useState(false);
    const quoteModal = useQuote();
    const quoteState = useQuote.getState();
    // console.log(useQuote.getState().data?._id);
    console.log(useQuote.getState().data);

    const bodyContent = (
        <div className="flex flex-col gap-4 p-2">
            <Form
                tweet_type={3}
                isBBorder={false}
                placeholder="Your Quote Content"
                postId={useQuote.getState().data?._id}
                user_id={useQuote.getState().data?.user_id}
            />
            <div className="border-2 rounded-lg">
                <TweetItem data={quoteState.data} quote />
            </div>
        </div>
    );
    return (
        <>
            <Modal
                disabled={isLoading}
                isOpen={quoteModal.isOpen}
                // title="Quote This Tweet"
                // actionLabel="Save"
                onClose={quoteModal.onClose}
                body={bodyContent}
            />
        </>
    );
}

export default ModalQuote;
