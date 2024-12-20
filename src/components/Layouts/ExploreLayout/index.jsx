/* eslint-disable react/prop-types */

import InformationBar from '../../InformationBar';
import Sidebar from '../../Sidebar';
import SidebarMobile from '../../SidebarMobile';
import Search from '../components/Search';

function ExploreLayout({ children }) {
    return (
        <>
            <div className="relative w-full sm:max-w-[1250px] mx-auto h-screen">
                <Sidebar />
                <div className="flex gap-6">
                    <div className="sm:ml-[150px] xl:ml-[300px] w-full min-h-screen border-r border-gray-400 py-2 relative">
                        <Search />
                        {children}
                    </div>
                    <InformationBar hasSearch={true} />
                </div>
                <SidebarMobile />
            </div>
        </>
    );
}

export default ExploreLayout;
