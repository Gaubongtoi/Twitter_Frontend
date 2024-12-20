import { FaRegBell, FaRegBookmark, FaRegUser } from 'react-icons/fa';
import { PiHouseBold } from 'react-icons/pi';
import { MdMailOutline } from 'react-icons/md';
import SidebarLogo from '../SidebarLogo';
import SidebarItem from '../SidebarItem';
import Button from '../Button';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import images from '../../assets/images';
import useTagBar from '../../hooks/state/useTagBar';
import { useNavigate } from 'react-router-dom';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoMdSearch } from 'react-icons/io';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import Tippy from '@tippyjs/react';
import { Wrapper as PopperWrapper } from '../Popper';
import { useCallback } from 'react';
import useTweetModal from '../../hooks/modal/useTweetModal';
import toast from 'react-hot-toast';
import http from '../../utils/http';
import useLoginState from '../../hooks/state/useLoginState';
import { generateAvatarUrl } from '../../utils/avatarGenerator';
import useHasReadNoti from '../../hooks/auth/useHasReadNoti';
function Sidebar() {
    const { data: currentUser } = useCurrentUser();
    const { data: fetchedCheckNotifications } = useHasReadNoti();
    const { logout } = useLoginState();
    const avatarUrl = currentUser?.result?.avatar || generateAvatarUrl(currentUser?.result?._id);
    const tweetModal = useTweetModal();
    // console.log(currentUser);
    const tagBarSelection = useTagBar();
    const tagBarState = useTagBar.getState();
    const navigate = useNavigate();
    const items = [
        { label: 'Home', href: '/', icon: PiHouseBold, auth: true },
        {
            label: 'Explore',
            href: '/api/explore',
            icon: IoMdSearch,
            auth: true,
        },
        {
            label: 'Notification',
            href: '/api/notifications',
            icon: FaRegBell,
            auth: true,
            alert: fetchedCheckNotifications?.hasNotification,
        },
        { label: 'Profile', href: '/api/user/me', icon: FaRegUser, auth: true },
        {
            label: 'Bookmark',
            href: '/api/bookmarks',
            icon: FaRegBookmark,
            auth: true,
        },
        {
            label: 'Messages',
            href: '/api/message',
            icon: MdMailOutline,
            auth: true,
        },
    ];
    const openTweetModal = useCallback(() => {
        return tweetModal.onOpen();
    }, [tweetModal]);
    const handleLogout = useCallback(async () => {
        const loadingToast = toast.loading('Waiting...');
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        try {
            const refresh_token = localStorage.getItem('refreshToken');
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            let response = await http.post('/api/user/logout', {
                refresh_token,
            });
            localStorage.setItem('accessToken', '');
            localStorage.setItem('refreshToken', '');
            logout();
            window.location.href = '/signin';
            toast.success(`${response.data.message}!`, {
                id: loadingToast,
            });
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                id: loadingToast,
            });
            console.log(error);
        }
    }, [logout]);
    return (
        <>
            {/* <div className="col-span-1 h-full pr-4 md:pr-6">
                <div className="flex flex-col items-end">
                    <div className="space-y-2 lg:w-[230px]">
                        <SidebarLogo />
                        {items.map((item, i) => {
                            return (
                                <SidebarItem
                                    key={item.href}
                                    // href={item.href}
                                    label={item.label}
                                    icon={item.icon}
                                    auth={item.auth}
                                    active={tagBarState.tag}
                                    onClick={() => {
                                        tagBarSelection.setTag(item.label);
                                        navigate(item.href);
                                    }}
                                />
                            );
                        })}

                        <div className="w-full h-auto mt-2">
                            <div className="relative rounded-full w-full flex items-center hover:bg-opacity-10 justify-center cursor-pointer lg:hidden">
                                <div className="w-[80px] h-auto">
                                    <img
                                        src={images.tweet_post}
                                        alt=""
                                        className="object-cover w-full h-auto hover:scale-110"
                                    />
                                </div>
                            </div>
                            <div className="relative hidden lg:flex items-center gap-4 rounded-full hover:bg-[#696a6b] hover:bg-opacity-10 cursor-pointer">
                                <Button primary rounded>
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="hidden sm:flex flex-col items-center xl:items-start w-[150px] xl:w-[300px] p-2 fixed h-full border-r border-black pr-0 xl:pr-8">
                <div className="flex items-center justify-center w-14 h-14 p-0 xl:ml-20">
                    <SidebarLogo />
                </div>
                <div className="space-y-2 mt-4 mb-2.5 xl:ml-16">
                    {items.map((item, i) => {
                        return (
                            <SidebarItem
                                key={item.href}
                                // href={item.href}
                                label={item.label}
                                icon={item.icon}
                                auth={item.auth}
                                active={tagBarState.tag}
                                alert={item.alert}
                                onClick={() => {
                                    tagBarSelection.setTag(item.label);
                                    navigate(item.href);
                                }}
                            />
                        );
                    })}
                </div>
                <div className="w-[200px] h-auto p-0 xl:ml-16">
                    <Tippy delay={[0, 50]} content={`Post`} placement="bottom">
                        <div className="relative rounded-full w-full flex items-center hover:bg-opacity-10 justify-center cursor-pointer xl:hidden">
                            <div className="w-[80px] h-auto" onClick={openTweetModal}>
                                <img
                                    src={images.tweet_post}
                                    alt=""
                                    className="object-cover w-full h-auto hover:scale-110"
                                />
                            </div>
                        </div>
                    </Tippy>

                    <div
                        onClick={openTweetModal}
                        className="relative hidden xl:flex items-center gap-4 rounded-full hover:bg-[#696a6b] hover:bg-opacity-10 cursor-pointer"
                    >
                        <Button primary rounded>
                            Post
                        </Button>
                    </div>
                </div>
                <HeadlessTippy
                    interactive
                    appendTo={() => document.body}
                    placement="bottom"
                    delay={[500, 0]}
                    arrow={true}
                    render={(attrs) => {
                        return (
                            <div className="w-auto h-full min-w-60" tabIndex="-1" {...attrs}>
                                <PopperWrapper>
                                    <div className="py-3">
                                        {/* hellyeah */}
                                        <div className="px-4 py-3 text-sm font-bold hover:bg-[#696a6b] hover:bg-opacity-10 cursor-pointer">
                                            Add an existing account
                                        </div>
                                        <div
                                            className="px-4 py-3 text-sm font-bold hover:bg-[#696a6b] hover:bg-opacity-10 cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            Log out @{currentUser?.result?.username || currentUser?.result?.name}
                                        </div>
                                    </div>
                                </PopperWrapper>
                            </div>
                        );
                    }}
                >
                    <div className="flex gap-2 items-center justify-center mt-auto mb-3 xl:ml-auto  px-3 py-3 xl:hover:bg-[#696a6b] xl:hover:bg-opacity-10 cursor-pointer rounded-full">
                        <div className="w-14 h-14 xl:h-10 xl:w-10 border-2 rounded-full border-gray-500">
                            <img
                                className={`w-full h-full rounded-full xl:mr-2.5 object-cover ${
                                    currentUser?.result?.avatar === '' && 'bg-blue-400'
                                }`}
                                alt="Avatar"
                                src={avatarUrl}
                            />
                        </div>
                        <div className="hidden xl:flex xl:flex-col xl:justify-around leading-5 h-full">
                            <h4 className="font-bold">{currentUser?.result?.name}</h4>
                            <h4 className="text-neutral-500 text-xs">
                                @{currentUser?.result?.username || currentUser?.result?.name}
                            </h4>
                        </div>
                        <HiDotsHorizontal className="h-5 hidden xl:inline ml-10" />
                    </div>
                </HeadlessTippy>
            </div>
        </>
    );
}

export default Sidebar;
