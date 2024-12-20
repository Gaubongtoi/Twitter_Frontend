import { useLocation } from 'react-router-dom';
import Conservation from '../../Conservation';
import InformationBar from '../../InformationBar';
import Sidebar from '../../Sidebar';
import { useEffect, useState } from 'react';
import SidebarMobile from '../../SidebarMobile';

function MessageLayout({ children }) {
    const location = useLocation();
    const [receiverId, setReceiverId] = useState(null);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('receiver_id');
        if (id) {
            setReceiverId(id);
        } else {
            setReceiverId(null);
        }
    }, [location.search]);
    return (
        <>
            <div className="relative w-full sm:max-w-[1250px] mx-auto h-screen">
                <Sidebar />
                <div className="flex">
                    <div
                        className={`${
                            receiverId ? 'hidden' : 'w-full'
                        } sm:ml-[150px] xl:ml-[300px] lg:w-1/2 lg:block min-h-screen border-r border-gray-400`}
                    >
                        {children}
                    </div>
                    {/* <InformationBar /> */}
                    <Conservation />
                </div>
                {typeof window !== 'undefined' && window.innerWidth <= 640 && !receiverId && <SidebarMobile />}
                {/* <SidebarMobile /> */}
            </div>
        </>
    );
}

export default MessageLayout;
