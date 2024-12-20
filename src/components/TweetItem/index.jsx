// Library
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import toast from 'react-hot-toast';
// Icon
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiOutlineBarChart } from 'react-icons/ai';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import { ImLoop } from 'react-icons/im';
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa6';
// Hook
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import useLike from '../../hooks/auth/useLike';
import useLoginNoti from '../../hooks/modal/useLoginNoti';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useTweets from '../../hooks/auth/useTweets';
import useTweetChildren from '../../hooks/auth/useTweetChildren';
import useTweetDetail from '../../hooks/auth/useTweetDetail';
import useQuote from '../../hooks/modal/useQuote';
import useRetweet from '../../hooks/auth/useRetweet';
// Tippy
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import Tippy from '@tippyjs/react';
import http from '../../utils/http';
// Component
import Avatar from '../Avatar';
import { Wrapper as PopperWrapper } from '../Popper';
import ImageGallary from '../ImageGallary';
import useBookmark from '../../hooks/auth/useBookmark';
import HighlightedText from '../HighlightedText';
import useSearchExplore from '../../hooks/auth/useSearchExplore';

function TweetItem({ user_id, data, isReturn, type, quote = false, query }) {
    const { data: currentUser } = useCurrentUser();
    // Auth
    const { hasLiked, toggleLike } = useLike({ tweetId: data?._id, userId: user_id, query });
    const { mutate: mutateExplore } = useSearchExplore({ query });
    const { hasBookmarked, toggleBookmark } = useBookmark({ tweetId: data?._id, userId: user_id });
    const { hasRetweet, toggleRetweet } = useRetweet({ tweetId: data?._id, userId: user_id });
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: mutateTweets } = useTweets();
    const { mutate: mutateTweetsOfMe } = useTweets(user_id);
    const { mutate: mutateTweetChildren } = useTweetChildren(data?._id);
    const { mutate: mutateTweetDetail } = useTweetDetail(data?._id);
    const { data: quoteFetched, mutate: mutateQuoteDetail } = useTweetDetail(data?.parent_id);
    // Modal
    const loginModal = useLoginNoti();
    const quoteModal = useQuote();
    // console.log(useQuote.getState().data);

    //
    const navigate = useNavigate();
    // Go to user Method
    const goToUser = useCallback(
        (e) => {
            e.stopPropagation();
            if (user_id === currentUser.result._id) {
                navigate(`/api/user/me`);
            } else {
                // console.log(`/api/user/profile?user_id=${data?.user?._id}`);
                navigate(`/api/user/profile?user_id=${data?.user?._id || user_id}`);
            }
            if (quote) {
                quoteModal.onClose();
            }
        },
        [currentUser?.result._id, navigate, user_id, data?.user?._id, quoteModal, quote],
    );
    const goToPost = useCallback(() => {
        if (type === 1) {
            navigate(`/api/tweets/${data.parent_id}`);
        } else navigate(`/api/tweets/${data._id}`);
        if (quote) {
            quoteModal.onClose();
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [navigate, data?._id, type, data?.parent_id, quote, quoteModal]);
    const onLike = useCallback(
        (e) => {
            e.stopPropagation();

            if (!currentUser) {
                return loginModal.onOpen();
            }
            if (quote) {
                quoteModal.onClose();
            }
            // console.log('Like ở đây!');

            toggleLike();
        },

        [loginModal, currentUser, toggleLike, quote, quoteModal],
    );
    const onBookmark = useCallback(
        (e) => {
            e.stopPropagation();
            if (!currentUser) {
                return loginModal.onOpen();
            }
            if (quote) {
                quoteModal.onClose();
            }
            toggleBookmark();
        },
        [loginModal, currentUser, toggleBookmark, quote, quoteModal],
    );
    const onDelete = useCallback(
        async (e) => {
            e.stopPropagation();
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const loadingToast = toast.loading('Waiting...');
            try {
                setIsLoading(true);
                await delay(import.meta.env.VITE_DELAY_REQUEST);
                const res = await http.delete(`/api/tweets/remove/${data._id}`);
                toast.success(`${res.data.message}`, {
                    id: loadingToast,
                });
                if (isReturn) {
                    navigate('/');
                }
                mutateTweets();
                mutateTweetChildren();
                mutateTweetDetail();
                mutateTweetsOfMe();
                mutateQuoteDetail();
                mutateExplore();
            } catch (error) {
                toast.error(error.response.data.message, {
                    id: loadingToast,
                });
            } finally {
                setIsLoading(false);
            }
        },
        [
            data?._id,
            mutateTweetChildren,
            mutateTweetDetail,
            mutateTweets,
            isReturn,
            navigate,
            mutateTweetsOfMe,
            mutateQuoteDetail,
            mutateExplore,
        ],
    );
    // console.log(data);

    const created_at = useMemo(() => {
        if (!data?.created_at) {
            return null;
        }
        return formatDistanceToNowStrict(new Date(data.created_at));
    }, [data]);
    const format_view = useMemo(() => {
        const formattedNumber = new Intl.NumberFormat('en', { notation: 'compact' }).format(
            data?.guest_views + data?.user_views,
        );
        return formattedNumber;
    }, [data?.guest_views, data?.user_views]);
    const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
    const BookmarkIcon = hasBookmarked ? FaBookmark : FaRegBookmark;

    return (
        <div
            onClick={goToPost}
            className={`${
                !quote ? 'border-b-[1px]' : ''
            } border-neutral-800 p-3 cursor-pointer hover:bg-neutral-200 transition relative`}
        >
            {data?.type === 1 &&
                (currentUser?.result?._id === data?.user?._id ? (
                    <div className="flex items-center gap-2">
                        <div className="w-1/12 flex justify-end">
                            <ImLoop size={12} color="#536471" />
                        </div>
                        <p className="w-11/12 text-xs text-[#536471] font-bold">You retweet</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="w-1/12 flex justify-end">
                            <ImLoop size={12} color="#536471" />
                        </div>
                        <p className="w-11/12 text-xs text-[#536471] font-bold">{data?.user?.name} retweet</p>
                    </div>
                ))}
            {type === 1 ? (
                <RetweetItem
                    tweet_id={data?.parent_id}
                    user_id={data?.user?._id}
                    created_at={created_at}
                    currentUser={currentUser}
                    quote={quote}
                    quoteModal={quoteModal}
                    loginModal={loginModal}
                    query={query}
                    // onLike={onLike}
                />
            ) : (
                <div className="flex flex-row items-start gap-3">
                    <div className="grow">
                        <Avatar userId={user_id || data?.user?._id} />
                    </div>
                    <div className="w-11/12">
                        <div className="flex flex-row items-center gap-2">
                            <p className="font-semibold cursor-pointer hover:underline" onClick={goToUser}>
                                {data?.user?.name}
                            </p>
                            <span
                                className="text-neutral-500 cursor-pointer hover:underline hidden md:block"
                                onClick={goToUser}
                            >
                                @{data?.user?.username === '' ? data?.user?.name : data?.user?.username}
                            </span>
                            <span className="text-neutral-500 text-sm">{created_at}</span>
                        </div>
                        <div className="mt-1">
                            {/* <p>{transformInput(data?.content)}</p>{' '} */}
                            <HighlightedText input={data?.content} mentions={data?.mentions} />
                            {/* {data?.hashtags.length > 0 &&
                                data?.hashtags.map((hashtag, key) => (
                                    <p
                                        className="inline-block text-[#1da1f2] font-semibold text-sm px-1 py-1 hover:underline cursor-pointer transition-colors duration-200"
                                        key={key}
                                    >
                                        #{hashtag.name}
                                    </p>
                                ))} */}
                        </div>
                        {type === 3 && <QuoteItem data={quoteFetched?.result} />}
                        <div>{data?.medias.length > 0 && !quote && <ImageGallary images={data?.medias} />}</div>

                        <div className="flex flex-row items-center justify-between mt-3 gap-10">
                            <div className="flex flex-row items-center gap-10">
                                <Tippy delay={[0, 50]} content="Comments" placement="bottom">
                                    <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer hover:text-primary hover:font-semibold">
                                        <AiOutlineMessage size={20} />
                                        <p>{data?.comments.length || 0}</p>
                                    </div>
                                </Tippy>
                                <div
                                    className={`flex flex-row items-center  gap-2 cursor-pointer ${
                                        hasRetweet ? 'text-green-700 font-semibold' : 'text-neutral-500'
                                    } hover:text-green-700 hover:font-semibold `}
                                >
                                    <HeadlessTippy
                                        // Cho phep duoc active thanh phan trong Tippy
                                        interactive
                                        //
                                        appendTo={() => document.body}
                                        // visible={true}
                                        placement="bottom"
                                        // Attribute cho phep render ra popup voi dieu kien la
                                        // visible
                                        render={(attrs) => {
                                            return (
                                                <div className="w-auto h-full" tabIndex="-1" {...attrs}>
                                                    <PopperWrapper>
                                                        <div>
                                                            {hasRetweet ? (
                                                                <div
                                                                    className="w-auto h-10 cursor-pointer flex items-center gap-3 rounded-t-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        return toggleRetweet();
                                                                    }}
                                                                >
                                                                    <ImLoop size={16} />
                                                                    <p className="">Undo retweet</p>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="w-auto h-10 cursor-pointer flex items-center gap-3 rounded-t-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();

                                                                        return toggleRetweet();
                                                                    }}
                                                                >
                                                                    <ImLoop size={16} />
                                                                    <p className="">Retweet</p>
                                                                </div>
                                                            )}
                                                            <div
                                                                className="w-auto h-10 cursor-pointer flex items-center gap-3 rounded-b-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    quoteModal.onOpen(data);
                                                                }}
                                                            >
                                                                <PiPencilSimpleLineFill size={16} />
                                                                <p className="">Quote</p>
                                                            </div>
                                                        </div>
                                                    </PopperWrapper>
                                                </div>
                                            );
                                        }}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <ImLoop size={20} />
                                            <p>{data?.quote_tweets.length + data?.retweets.length}</p>
                                        </div>
                                    </HeadlessTippy>
                                    {/* <p>{data?.guest_views + data?.user_views}</p> */}
                                </div>
                                <Tippy delay={[0, 50]} content="Likes" placement="bottom">
                                    <div
                                        onClick={onLike}
                                        className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer ${
                                            hasLiked
                                                ? 'text-red-500 font-semibold'
                                                : 'hover:text-red-500 hover:font-semibold'
                                        }  `}
                                    >
                                        <LikeIcon size={20} color={hasLiked ? 'red' : ''} />
                                        {<p>{data?.likes.length}</p>}
                                    </div>
                                </Tippy>
                                <div className="hidden sm:flex sm:flex-row sm:items-center text-neutral-500 gap-2 cursor-pointer hover:text-primary hover:font-semibold">
                                    <AiOutlineBarChart size={20} />
                                    <p>{format_view}</p>
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-10 text-pr">
                                <Tippy delay={[0, 50]} content="Bookmark" placement="bottom">
                                    <div
                                        onClick={onBookmark}
                                        className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer ${
                                            hasBookmarked
                                                ? 'text-red-500 font-semibold'
                                                : 'hover:text-primary hover:font-semibold'
                                        }  `}
                                    >
                                        <BookmarkIcon size={20} color={hasBookmarked ? '#1DA1F2' : ''} />
                                    </div>
                                </Tippy>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {currentUser?.result?._id === data?.user_id && !quote && (
                <div className="absolute top-4 right-7 ">
                    <HeadlessTippy
                        // Cho phep duoc active thanh phan trong Tippy
                        interactive
                        //
                        appendTo={() => document.body}
                        // visible={true}
                        placement="bottom"
                        // Attribute cho phep render ra popup voi dieu kien la
                        // visible
                        render={(attrs) => {
                            return (
                                <div className="w-auto h-full" tabIndex="-1" {...attrs}>
                                    <PopperWrapper>
                                        <div
                                            className="w-auto h-10 cursor-pointer flex items-center gap-3 rounded-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                            onClick={onDelete}
                                        >
                                            <MdDelete color="red" size={20} />
                                            <p className="text-red-500">Delete</p>
                                        </div>
                                    </PopperWrapper>
                                </div>
                            );
                        }}
                    >
                        <div className="flex flex-row items-center justify-between gap-2">
                            <HiDotsHorizontal size={20} />
                        </div>
                    </HeadlessTippy>
                </div>
            )}
        </div>
    );
}

export default memo(TweetItem);

function RetweetItem({ tweet_id, user_id, currentUser, quoteModal, quote, loginModal, query }) {
    const { hasLiked, toggleLike } = useLike({ tweetId: tweet_id, userId: user_id });
    const { hasRetweet, toggleRetweet } = useRetweet({ tweetId: tweet_id, userId: user_id, query });
    const { data: fetchedTweetDetail } = useTweetDetail(tweet_id);
    const navigate = useNavigate();
    const goToUser = useCallback(
        (e) => {
            e.stopPropagation();
            if (fetchedTweetDetail?.result?.user?._id === currentUser.result._id) {
                quoteModal.onClose();

                navigate(`/api/user/me`);
            } else {
                quoteModal.onClose();

                navigate(`/api/user/profile?user_id=${fetchedTweetDetail?.result?.user?._id}`);
            }
        },
        [currentUser?.result._id, navigate, fetchedTweetDetail?.result?.user?._id, quoteModal],
    );
    const onLike = useCallback(
        (e) => {
            e.stopPropagation();

            if (!currentUser) {
                return loginModal.onOpen();
            }
            if (quote) {
                quoteModal.onClose();
            }
            // console.log('Like ở đây!');

            toggleLike();
        },

        [loginModal, currentUser, toggleLike, quote, quoteModal],
    );
    const created_at = useMemo(() => {
        if (!fetchedTweetDetail?.result?.created_at) {
            return null;
        }
        return formatDistanceToNowStrict(new Date(fetchedTweetDetail?.result.created_at));
    }, [fetchedTweetDetail?.result]);
    const format_view = useMemo(() => {
        const formattedNumber = new Intl.NumberFormat('en', { notation: 'compact' }).format(
            fetchedTweetDetail?.result?.guest_views + fetchedTweetDetail?.result?.user_views,
        );
        return formattedNumber;
    }, [fetchedTweetDetail?.result?.guest_views, fetchedTweetDetail?.result?.user_views]);
    const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
    return (
        <div className="flex flex-row items-start gap-3">
            <div className="grow">
                <Avatar userId={fetchedTweetDetail?.result.user?._id} />
            </div>
            <div className="w-11/12">
                <div className="flex flex-row items-center gap-2">
                    <p className="font-semibold cursor-pointer hover:underline" onClick={goToUser}>
                        {fetchedTweetDetail?.result?.user?.name}
                    </p>
                    <span
                        className="text-neutral-500 cursor-pointer hover:underline hidden md:block"
                        onClick={goToUser}
                    >
                        @
                        {fetchedTweetDetail?.result?.user?.username === ''
                            ? fetchedTweetDetail?.result?.user?.name
                            : fetchedTweetDetail?.result?.user?.username}
                    </span>
                    <span className="text-neutral-500 text-sm">{created_at}</span>
                </div>
                <div className="mt-1">
                    <HighlightedText
                        expand={true}
                        input={fetchedTweetDetail?.result.content}
                        mentions={fetchedTweetDetail?.result?.mentions}
                        data={fetchedTweetDetail?.result}
                    />
                    {/* {fetchedTweetDetail?.result.hashtags.length > 0 &&
                        fetchedTweetDetail?.result.hashtags.map((hashtag, key) => (
                            <p
                                className="inline-block text-[#1da1f2] font-semibold text-sm px-1 py-1 hover:underline cursor-pointer transition-colors duration-200"
                                key={key}
                            >
                                #{hashtag.name}
                            </p>
                        ))} */}
                </div>
                <div>
                    {fetchedTweetDetail?.result?.medias.length > 0 && (
                        <ImageGallary images={fetchedTweetDetail?.result?.medias} />
                    )}
                </div>
                <div className="flex flex-row items-center mt-3 gap-10">
                    <Tippy delay={[0, 50]} content="Comments" placement="bottom">
                        <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer hover:text-primary hover:font-semibold">
                            <AiOutlineMessage size={20} />
                            <p>{fetchedTweetDetail?.result?.comments.length || 0}</p>
                        </div>
                    </Tippy>
                    <div
                        className={`flex flex-row items-center  gap-2 cursor-pointer ${
                            hasRetweet ? 'text-green-700 font-semibold' : 'text-neutral-500'
                        } hover:text-green-700 hover:font-semibold `}
                    >
                        <HeadlessTippy
                            // Cho phep duoc active thanh phan trong Tippy
                            interactive
                            //
                            appendTo={() => document.body}
                            // visible={true}
                            placement="bottom"
                            // Attribute cho phep render ra popup voi dieu kien la
                            // visible
                            render={(attrs) => {
                                return (
                                    <div className="w-auto h-full" tabIndex="-1" {...attrs}>
                                        <PopperWrapper>
                                            <div>
                                                {hasRetweet ? (
                                                    <div
                                                        className="w-auto h-10 cursor-pointer flex items-center gap-3 rounded-t-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            return toggleRetweet();
                                                        }}
                                                    >
                                                        <ImLoop size={16} />
                                                        <p className="">Undo retweet</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="w-auto h-10 cursor-pointer flex items-center gap-3 rounded-t-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            return toggleRetweet();
                                                        }}
                                                    >
                                                        <ImLoop size={16} />
                                                        <p className="">Retweet</p>
                                                    </div>
                                                )}
                                                <div
                                                    className="w-auto h-10 cursor-pointer flex items-center gap-3 rounded-b-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        quoteModal.onOpen(fetchedTweetDetail?.result);
                                                    }}
                                                >
                                                    <PiPencilSimpleLineFill size={16} />
                                                    <p className="">Quote</p>
                                                </div>
                                            </div>
                                        </PopperWrapper>
                                    </div>
                                );
                            }}
                        >
                            <div className="flex flex-row items-center justify-between gap-2">
                                <ImLoop size={20} />
                                <p>
                                    {fetchedTweetDetail?.result?.quote_tweets.length +
                                        fetchedTweetDetail?.result?.retweets.length}
                                </p>
                            </div>
                        </HeadlessTippy>
                        {/* <p>{data?.guest_views + data?.user_views}</p> */}
                    </div>
                    <Tippy delay={[0, 50]} content="Likes" placement="bottom">
                        <div
                            onClick={onLike}
                            className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer ${
                                hasLiked ? 'text-red-500 font-semibold' : 'hover:text-red-500 hover:font-semibold'
                            }  `}
                        >
                            <LikeIcon size={20} color={hasLiked ? 'red' : ''} />
                            {<p>{fetchedTweetDetail?.result.likes.length}</p>}
                        </div>
                    </Tippy>
                    <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer hover:text-primary hover:font-semibold">
                        <AiOutlineBarChart size={20} />
                        <p>{format_view}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuoteItem({ data }) {
    const [parentTweetUrl, setParentTweetUrl] = useState('');
    const navigate = useNavigate();
    const created_at = useMemo(() => {
        if (!data?.created_at) {
            return null;
        }
        return formatDistanceToNowStrict(new Date(data.created_at));
    }, [data]);
    const goToPost = useCallback(
        (e) => {
            e.stopPropagation();
            if (parentTweetUrl !== '') {
                // if (type === 1) {
                //     navigate(`/api/tweets/${data.parent_id}`);
                // } else navigate(`/api/tweets/${data._id}`);
                navigate(`/api/tweets/${data?._id}`);
                // if (quote) {
                //     quoteModal.onClose();
                // }
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        },
        [navigate, data?._id, parentTweetUrl],
    );
    const getInformationParentId = useCallback(async (tweet_id) => {
        const infor = await http.get(`/api/tweets/${tweet_id}`);
        return infor;
    }, []);
    useEffect(() => {
        getInformationParentId(data?._id).then((result) => {
            let data = result?.data?.result;
            let url = `x.com/${data?.user?.username}/status/${data?._id}`;
            setParentTweetUrl(url); // Cập nhật URL vào state
        });
    }, [data?._id, getInformationParentId]);

    return (
        <div className="p-3 sm:p-4 border rounded-3xl border-black hover:bg-dark_7 mt-3" onClick={goToPost}>
            {data ? (
                <div className="flex flex-row items-start gap-3">
                    <div className="grow">
                        <Avatar userId={data?.user?._id} />
                    </div>
                    <div className="w-11/12">
                        <div className="flex flex-row items-center gap-2">
                            <p
                                className="font-semibold cursor-pointer hover:underline"
                                // onClick={goToUser}
                            >
                                {data?.user?.name}
                            </p>
                            <span
                                className="text-neutral-500 cursor-pointer hover:underline hidden md:block"
                                // onClick={goToUser}
                            >
                                @{data?.user?.username === '' ? data?.user?.name : data?.user?.username}
                            </span>
                            <span className="text-neutral-500 text-sm">{created_at}</span>
                        </div>
                        <div className="mt-1 flex items-center max-w-[300px] overflow-hidden text-ellipsis">
                            {/* Phần tử <p> và <span> cùng nằm trên 1 hàng */}
                            <p className="truncate sm:w-[200px] w-12 sm:text-base text-sm">
                                {data?.content}{' '}
                                {/* {data?.parent_id !== null &&
                                `x.com/${}/status/1844344941553791257`} */}
                                {parentTweetUrl && data?.parent_id !== null && (
                                    <span className="text-primary">{parentTweetUrl}</span>
                                )}
                            </p>

                            {/* {data?.parent_id !== null && (
                            <span className="whitespace-nowrap text-ellipsis">
                                &nbsp;x.com/TanV921699/status/1844344941553791257
                            </span>
                        )} */}
                            {data?.hashtags.length > 0 &&
                                data?.hashtags.map((hashtag, key) => (
                                    <p
                                        className="inline-block text-[#1da1f2] font-semibold text-sm px-1 py-1 hover:underline cursor-pointer transition-colors duration-200"
                                        key={key}
                                    >
                                        #{hashtag.name}
                                    </p>
                                ))}
                        </div>
                        <div>
                            {data?.medias.length > 0 && data?.parent_id === null && (
                                <ImageGallary images={data?.medias} />
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>This post is unavailable.</p>
            )}
        </div>
    );
}
