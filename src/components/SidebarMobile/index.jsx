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
import React, { useCallback, useState } from 'react';
import useTweetModal from '../../hooks/modal/useTweetModal';
import toast from 'react-hot-toast';
import http from '../../utils/http';
import useLoginState from '../../hooks/state/useLoginState';
import { generateAvatarUrl } from '../../utils/avatarGenerator';
import useHasReadNoti from '../../hooks/auth/useHasReadNoti';
import { Menu, Transition, Dialog, MenuButton, MenuItems, MenuItem, DialogPanel, DialogTitle } from '@headlessui/react';
import { BsDot } from 'react-icons/bs';
function SidebarMobile() {
    const { data: currentUser } = useCurrentUser();
    const { data: fetchedCheckNotifications } = useHasReadNoti();

    const tagBarSelection = useTagBar();
    const tagBarState = useTagBar.getState();
    const navigate = useNavigate();

    const items = [
        { label: 'Home', href: '/', icon: PiHouseBold, auth: true },
        { label: 'Explore', href: '/api/explore', icon: IoMdSearch, auth: true },
        {
            label: 'Notification',
            href: '/api/notifications',
            icon: FaRegBell,
            auth: true,
            alert: fetchedCheckNotifications?.hasNotification,
        },
        { label: 'Profile', href: '/api/user/me', icon: FaRegUser, auth: true },
        { label: 'Bookmark', href: '/api/bookmarks', icon: FaRegBookmark, auth: true },
        { label: 'Messages', href: '/api/message', icon: MdMailOutline, auth: true },
    ];

    return (
        <div className="fixed sm:hidden bottom-0 z-10 w-full bg-white flex justify-between px-4 h-16 items-center border-t shadow-[rgba(100, 100, 111, 0.2) 0px 7px 29px 0px]">
            {items.map((item, i) => (
                <div
                    className="p-2 relative"
                    key={i}
                    onClick={() => {
                        tagBarSelection.setTag(item.label);
                        navigate(item.href);
                    }}
                >
                    {item.alert ? <BsDot className="text-sky-500 absolute -top-4 left-1" size={50} /> : null}
                    {tagBarState.tag === item.label ? <item.icon size={20} color="#1A8CCF" /> : <item.icon size={20} />}
                </div>
            ))}
            <LogoutModal currentUser={currentUser} />
        </div>
    );
}

export default SidebarMobile;
function LogoutModal({ currentUser }) {
    const [, setIsOpen] = useState(false);
    const { logout } = useLoginState();
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // const handleLogout = () => {
    //     console.log('Logged out');
    //     closeModal();
    // };
    const handleLogout = useCallback(async () => {
        closeModal();
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
    const avatarUrl = currentUser?.result?.avatar || generateAvatarUrl(currentUser?.result?._id);

    return (
        <div className="relative">
            {/* Avatar */}

            <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none ">
                    <div onClick={openModal} className="cursor-pointer">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full border-2 border-gray-500 object-cover"
                        />
                    </div>
                </MenuButton>

                <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 w-52 origin-top-right rounded-xl border bg-white border-white/5  p-1 text-sm/6  transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    style={{ transform: 'translateY(-4px)' }}
                >
                    <MenuItem>
                        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-[#696a6b] hover:bg-opacity-10 active:bg-[#4d4e4f] active:bg-opacity-20">
                            Add an existing account
                        </button>
                    </MenuItem>
                    <MenuItem>
                        <button
                            onClick={handleLogout}
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-[#696a6b] hover:bg-opacity-10 active:bg-[#4d4e4f] active:bg-opacity-20"
                        >
                            Log out @{currentUser?.result?.username || currentUser?.result?.name}
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
            {/* Logout Confirmation Modal */}
        </div>
    );
}
