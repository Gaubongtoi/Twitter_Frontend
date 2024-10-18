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

function Sidebar() {
    // const { data: currentUser } = useCurrentUser();
    // console.log(currentUser);
    const tagBarSelection = useTagBar();
    const tagBarState = useTagBar.getState();
    const navigate = useNavigate();
    const items = [
        { label: 'Home', href: '/', icon: PiHouseBold, auth: true },
        { label: 'Notification', href: '/notification', icon: FaRegBell, auth: true },
        { label: 'Profile', href: '/api/user/me', icon: FaRegUser, auth: true },
        {
            label: 'Bookmark',
            href: '/api/bookmarks',
            icon: FaRegBookmark,
            auth: true,
        },
        {
            label: 'Messages',
            href: '/api/user/message',
            icon: MdMailOutline,
            auth: true,
        },
    ];
    return (
        <>
            <div className="col-span-1 h-full pr-4 md:pr-6">
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
                                {/* <p className="hidden lg:block text-black text-xl font-semibold">{label}</p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="hidden xl:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full border-r border-gray-400 pr-0 xl:pr-8">
                <div className="flex items-center flex-col justify-center w-24 p-0 xl:ml-24">
                    <SidebarLogo />
                    {items.map((item, i) => {
                        return (
                            <SidebarItem
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                auth={item.auth}
                            ></SidebarItem>
                        );
                    })}
                </div>
            </div> */}
        </>
    );
}

export default Sidebar;
