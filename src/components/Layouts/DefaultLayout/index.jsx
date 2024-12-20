/* eslint-disable react/prop-types */

import InformationBar from '../../InformationBar';
import Sidebar from '../../Sidebar';
import SidebarMobile from '../../SidebarMobile';

function DefaultLayout({ children }) {
    return (
        <>
            {/* <div className="h-screen">
                <div className="container h-full mx-auto xl:px-30 max-w-6xl pt-2">
                    <div className="grid grid-cols-4 h-full">
                        <Sidebar />
                        <div className="col-span-3 lg:col-span-2 border-x-[1px] border-neutral-800">{children}</div>
                        <InformationBar />
                    </div>
                </div>
            </div> */}
            <div className="relative w-full sm:max-w-[1250px] mx-auto h-screen">
                <Sidebar />

                <div className="flex gap-6 mb-16 sm:mb-0">
                    <div className="sm:ml-[150px] xl:ml-[300px] w-full min-h-screen border-r border-gray-400 py-2">
                        {children}
                    </div>
                    <InformationBar />
                </div>
                <SidebarMobile />
            </div>
        </>
    );
}

export default DefaultLayout;
