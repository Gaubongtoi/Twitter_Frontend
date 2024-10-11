import { FaRegBell, FaRegBookmark, FaRegUser } from 'react-icons/fa';
import { PiHouseBold } from 'react-icons/pi';
import { MdMailOutline } from 'react-icons/md';
import SidebarLogo from '../SidebarLogo';
import SidebarItem from '../SidebarItem';
import Button from '../Button';
import useCurrentUser from '../../hooks/auth/useCurrentUser';

function Sidebar() {
    // const { data: currentUser } = useCurrentUser();
    // console.log(currentUser);
    const items = [
        { label: 'Home', href: '/', icon: <PiHouseBold size={26}></PiHouseBold>, auth: true },
        { label: 'Notification', href: '/notification', icon: <FaRegBell size={26}></FaRegBell>, auth: true },
        { label: 'Profile', href: '/api/user/me', icon: <FaRegUser size={26}></FaRegUser>, auth: true },
        {
            label: 'Bookmark',
            href: '/api/bookmarks',
            icon: <FaRegBookmark size={26}></FaRegBookmark>,
            auth: true,
        },
        {
            label: 'Messages',
            href: '/api/user/message',
            icon: <MdMailOutline size={26}></MdMailOutline>,
            auth: true,
        },
    ];
    return (
        <>
            <div className="col-span-1 h-full pr-4 md:pr-6">
                <div className="flex flex-col items-end">
                    <div className="space-y-2 lg:w-[230px]">
                        <SidebarLogo></SidebarLogo>
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
                        <div className="w-full h-auto mt-4">
                            <Button primary rounded>
                                Post
                            </Button>
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
