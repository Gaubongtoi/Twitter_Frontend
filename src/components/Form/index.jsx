import { useCallback, useState } from 'react';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useTweets from '../../hooks/auth/useTweets';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import ButtonExpand from '../ButtonExpand';
import toast from 'react-hot-toast';
import http from '../../utils/http';
import useTweetDetail from '../../hooks/auth/useTweetDetail';
import useTweetChildren from '../../hooks/auth/useTweetChildren';

function Form({ placeholder, isComment, postId }) {
    const { data: currentUser } = useCurrentUser();
    const { mutate: mutateTweets } = useTweets();
    const { mutate: mutateTweetChildren } = useTweetChildren(postId);
    const { mutate: mutateTweetDetail } = useTweetDetail(postId);
    const [isLoading, setIsLoading] = useState(false);
    const [body, setBody] = useState('');
    const navigate = useNavigate();
    const onSubmit = useCallback(async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const loadingToast = toast.loading('Waiting...');
        try {
            setIsLoading(true);
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            let res;
            if (isComment) {
                res = await http.post('/api/tweets', {
                    type: 2,
                    audience: 0,
                    content: body,
                    parent_id: postId,
                    hashtags: [],
                    mentions: [],
                    medias: [],
                });
            } else {
                res = await http.post('/api/tweets', {
                    type: 0,
                    audience: 0,
                    content: body,
                    parent_id: null,
                    hashtags: [],
                    mentions: [],
                    medias: [],
                });
            }

            toast.success(`${res.data.message}`, {
                id: loadingToast,
                style: {
                    border: '1px solid #1E82BF',
                    padding: '16px',
                    color: '#1E82BF',
                },
                iconTheme: {
                    primary: '#1E82BF',
                    secondary: '#FFFAEE',
                },
            });
            setBody('');
            mutateTweets();
            mutateTweetChildren();
            mutateTweetDetail();
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    }, [body, mutateTweets]);
    return (
        <div className="border-b-[1px] border-neutral-800 px-3 py-2">
            {currentUser ? (
                <div className="flex flex-row gap-4">
                    <div>
                        <Avatar userId={currentUser?.result?._id} />
                    </div>
                    <div className="w-full">
                        <textarea
                            disabled={isLoading}
                            onChange={(e) => setBody(e.target.value)}
                            value={body}
                            className="disabled:opacity-80 peer resize-zone mt-2 w-full ring-0 outline-none text-[20px] placeholder-neutral-500"
                            placeholder={placeholder}
                        ></textarea>
                        <hr className="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />
                        <div className="mt-3 flex flex-row justify-end ">
                            <ButtonExpand label="Tweet" disabled={isLoading || !body} onClick={onSubmit} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-8">
                    <h1 className="text-2xl text-center mb-4 font-bold">Welcome to Twitter</h1>
                    <div className="flex flex-row items-center justify-center gap-4">
                        <Button
                            primary
                            rounded
                            onClick={() => {
                                navigate('/signin');
                            }}
                        >
                            Signin
                        </Button>
                        <Button
                            secondary
                            rounded
                            onClick={() => {
                                navigate('/signup');
                            }}
                        >
                            Signup
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Form;
