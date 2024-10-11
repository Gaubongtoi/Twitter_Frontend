import { useForm } from 'react-hook-form';
import useCurrentUser from '../../../hooks/auth/useCurrentUser';
import useEditModal from '../../../hooks/modal/useEditModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import http from '../../../utils/http';
import toast from 'react-hot-toast';
import Modal from '..';
import { dateToISOString, getCurrentDate, ISOStringToDate } from '../../../utils/currentDate';
import Button from '../../Button';
import ImageUpload from '../../ImageUpload';
import useQuote from '../../../hooks/modal/useQuote';
import Form from '../../Form';
import TweetItem from '../../TweetItem';

function ModalQuote() {
    const [isLoading, setIsLoading] = useState(false);
    const quoteModal = useQuote();
    const quoteState = useQuote.getState();
    // console.log(useQuote.getState().data?._id);

    const bodyContent = (
        <div className="flex flex-col gap-4 p-2">
            <Form
                tweet_type={3}
                isBBorder={false}
                placeholder="Your Quote Content"
                postId={useQuote.getState().data?._id}
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
