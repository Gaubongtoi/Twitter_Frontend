import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useTagBar from '../../hooks/state/useTagBar';
import images from '../../assets/images';
import http from '../../utils/http';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import ButtonExpand from '../../components/ButtonExpand';
import toast from 'react-hot-toast';
import useUser from '../../hooks/auth/useUser';
import Avatar from '../../components/Avatar';
import TweetItem from '../../components/TweetItem';
import useSearchExplore from '../../hooks/auth/useSearchExplore';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MoonLoader } from 'react-spinners';

function ExploreView() {
    const location = useLocation();
    const tagSelection = useTagBar();
    const tagState = useTagBar.getState();
    const [query, setQuery] = useState(null);
    useEffect(() => {
        if (tagState.tag !== 'Explore') {
            tagSelection.setTag('Explore');
        }
        const queryParams = new URLSearchParams(location.search);
        const value = queryParams.get('content');
        if (value) {
            setQuery(value);
        } else {
            setQuery(null);
        }
    }, [location.search, tagSelection, tagState]);
    return (
        <div>
            {query ? (
                <>
                    <div>
                        <PeopleListExplore query={query} />
                        <TweetListExplore query={query} />
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center w-full gap-5 mt-4">
                    <div className="text-red-500">
                        <img src={images.logo} alt="" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Type something to start your search.
                    </h2>
                    <p className="text-gray-600 text-center">
                        Oops! It looks like you haven&#39;t entered a search term yet. <br /> Try typing something!
                    </p>
                </div>
            )}
        </div>
    );
}

export default ExploreView;

function PeopleListExplore({ query }) {
    const [list, setList] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await http.get(`/api/search/mentions?q=${query}&page=1&limit=6`);
                setList(response.data.result.users);
            } catch (error) {
                toast.error(`${error.response.data.message}`);
                setList([]);
            }
        };
        fetchData();
    }, [query]);
    return (
        <div className={`border-b-[#ccc] ${list.length > 0 && 'p-4 border'}`}>
            {list.length > 0 && <h2 className="break-words font-bold text-xl">People</h2>}
            {list.length > 0 &&
                list.map((people, index) => {
                    return <PeopleItem user_id={people._id} key={index} />;
                })}
        </div>
    );
}

function PeopleItem({ user_id }) {
    const [isLoading, setIsLoading] = useState(false);
    const { data: currentUser, mutate: mutatedCurrentUser } = useCurrentUser();
    const { data: fetchedUser, mutate: mutatedUser } = useUser(user_id);
    // const { mutate: mutatedRecommend } = useUsersRecommendation();

    const isFollowed = useMemo(() => {
        return fetchedUser?.result?.followedUsers.every((follower) => {
            return follower._id !== currentUser?.result?._id;
        });
    }, [fetchedUser, currentUser]);
    const isFollowing = useMemo(() => {
        return fetchedUser?.result?.followingUsers.every((follower) => {
            return follower._id === currentUser?.result?._id;
        });
    }, [fetchedUser, currentUser]);

    const onFollow = useCallback(async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const loadingToast = toast.loading('Waiting...');
        try {
            setIsLoading(true);
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            const res = await http.post('/api/user/follow', {
                followed_user_id: user_id,
            });
            // Follow
            await http.post('/api/notifications', {
                tweet_id: null,
                receiver_id: user_id,
                type: 0,
            });
            toast.success(`${res.data.message}`, {
                id: loadingToast,
            });
            // setBody('');
            mutatedUser();
            mutatedCurrentUser();
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                id: loadingToast,
            });
        } finally {
            setIsLoading(false);
        }
    }, [user_id, mutatedUser, mutatedCurrentUser]);
    const onUnfollow = useCallback(async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const loadingToast = toast.loading('Waiting...');
        try {
            setIsLoading(true);
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            const res = await http.delete(`/api/user/follow/${user_id}`);
            toast.success(`${res.data.message}`, {
                id: loadingToast,
            });
            // setBody('');
            mutatedUser();
            mutatedCurrentUser();
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                id: loadingToast,
            });
        } finally {
            setIsLoading(false);
        }
    }, [user_id, mutatedUser, mutatedCurrentUser]);
    return (
        <div className="flex gap-3 mt-4 min-w-0">
            <div>
                <Avatar userId={user_id} />
            </div>
            <div className="grow min-w-0">
                <div className="flex justify-between">
                    <div className="flex flex-col min-w-0">
                        <h2 className="w-full break-words font-bold hover:underline cursor-pointer">
                            {fetchedUser?.result?.name}
                        </h2>
                        <p className="w-full break-words text-sm">
                            @{fetchedUser?.result?.username}{' '}
                            {!isFollowing ? <span className="bg-gray-200 px-1 rounded text-xs">Follows you</span> : ''}
                        </p>
                    </div>
                    {isFollowed ? (
                        <div className="px-2">
                            <ButtonExpand label="Follow" onClick={onFollow} disabled={isLoading} />
                        </div>
                    ) : (
                        <div className="px-2">
                            <ButtonExpand label="Unfollow" secondary disabled={isLoading} onClick={onUnfollow} />
                        </div>
                    )}
                </div>
                <p className="w-full break-words text-sm">{fetchedUser?.result?.bio}</p>
            </div>
        </div>
    );
}

function TweetListExplore({ query }) {
    // const [list, setList] = useState([]);
    const { tweets: fetchedExplore, isLoading, size, setSize, totalPage, hasMore } = useSearchExplore({ query });
    const loadMoreTweets = () => {
        if (size < totalPage) {
            setTimeout(() => {
                setSize(size + 1);
            }, 3000);
        }
    };
    return (
        <div>
            {/* <h2 className="break-words font-bold text-xl">Posts</h2> */}

            <InfiniteScroll
                dataLength={fetchedExplore.length} // Số lượng tweet hiện tại
                next={loadMoreTweets} // Hàm tải thêm tweets
                hasMore={hasMore} // Kiểm tra còn dữ liệu hay không
                loader={
                    <div className="flex justify-center items-center h-full my-3">
                        <MoonLoader size={30} color="#1A8CCF" />
                    </div>
                }
            >
                {fetchedExplore.map((tweet) => {
                    return (
                        <TweetItem
                            key={tweet._id}
                            data={tweet}
                            user_id={tweet.user_id}
                            type={tweet.type}
                            query={query}
                        />
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
    );
}
