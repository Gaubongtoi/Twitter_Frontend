import { useCallback, useMemo } from 'react';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import Avatar from '../Avatar';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiOutlineBarChart } from 'react-icons/ai';
import { ImLoop } from 'react-icons/im';
import { PiPencilSimpleLineFill } from 'react-icons/pi';
import useLike from '../../hooks/auth/useLike';
import useLoginNoti from '../../hooks/modal/useLoginNoti';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '../Popper';

import 'tippy.js/dist/tippy.css'; // optional
import Button from '../Button';
import useRetweet from '../../hooks/modal/useRetweet';

function TweetItem({ user_id, data }) {
    const { data: currentUser } = useCurrentUser();
    // console.log(data?._id);
    // console.log(user_id);

    const { hasLiked, toggleLike } = useLike({ tweetId: data?._id, userId: user_id });
    const loginModal = useLoginNoti();
    const retweetModal = useRetweet();
    const navigate = useNavigate();
    const goToUser = useCallback(
        (e) => {
            e.stopPropagation();
            if (user_id === currentUser.result._id) {
                navigate(`/api/user/me`);
            } else {
                // console.log(`/api/user/profile?user_id=${data?.user?._id}`);

                navigate(`/api/user/profile?user_id=${data?.user?._id || user_id}`);
            }
        },
        [currentUser?.result._id, navigate, user_id, data?.user?._id],
    );
    const goToPost = useCallback(() => {
        navigate(`/api/tweets/${data._id}`);
    }, [navigate, data._id]);
    const onLike = useCallback(
        (e) => {
            e.stopPropagation();
            if (!currentUser) {
                return loginModal.onOpen();
            }
            toggleLike();
        },
        [loginModal, currentUser, toggleLike],
    );
    // console.log('helo');
    // const onRetweet = useCallback(() => {
    //     (e) => {
    //         console.log('aduma');

    //         e.stopPropagation();
    //         if (!currentUser) {
    //             return loginModal.onOpen();
    //         }
    //         retweetModal.onOpen();
    //     };
    // }, [currentUser, retweetModal, loginModal]);
    const created_at = useMemo(() => {
        if (!data?.created_at) {
            return null;
        }
        return formatDistanceToNowStrict(new Date(data.created_at));
    }, [data]);

    const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
    return (
        <div
            onClick={goToPost}
            className="border-b-[1px] border-neutral-800 p-3 cursor-pointer hover:bg-neutral-200 transition"
        >
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
                        <p>{data.content}</p>{' '}
                        {data.hashtags.length > 0 &&
                            data.hashtags.map((hashtag, key) => (
                                <p
                                    className="inline-block text-[#1da1f2] font-semibold text-sm px-1 py-1 hover:underline cursor-pointer transition-colors duration-200"
                                    key={key}
                                >
                                    #{hashtag.name}
                                </p>
                            ))}
                    </div>
                    <div className="flex flex-row items-center mt-3 gap-10">
                        <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer hover:text-primary hover:font-semibold">
                            <AiOutlineMessage size={20} />
                            <p>{data?.comments.length || 0}</p>
                        </div>
                        <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer hover:text-green-700 hover:font-semibold ">
                            <ImLoop size={20} />
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
                                                    <div
                                                        className="w-28 h-10 cursor-pointer flex items-center gap-3 rounded-t-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            retweetModal.onOpen();
                                                        }}
                                                    >
                                                        <ImLoop size={16} />
                                                        <p className="">Retweet</p>
                                                    </div>
                                                    <div
                                                        className="w-28 h-10 cursor-pointer flex items-center gap-3 rounded-b-lg p-2.5 hover:bg-[#e1dfda] font-bold"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            retweetModal.onOpen();
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
                                <div className="inline-block">
                                    <p>{data?.guest_views + data?.user_views}</p>
                                </div>
                            </HeadlessTippy>
                            {/* <p>{data?.guest_views + data?.user_views}</p> */}
                        </div>
                        <div
                            onClick={onLike}
                            className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer hover:text-red-500 hover:font-semibold"
                        >
                            <LikeIcon size={20} color={hasLiked ? 'red' : ''} />
                            {/* {data.likes && data.likes.map((like, key) => <p key={key}>{like}</p>)} */}
                            {<p>{data.likes.length}</p>}
                        </div>
                        <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer hover:text-primary hover:font-semibold">
                            <AiOutlineBarChart size={20} />
                            <p>{data?.guest_views + data?.user_views}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TweetItem;
