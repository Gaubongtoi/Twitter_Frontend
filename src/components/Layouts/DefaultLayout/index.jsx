/* eslint-disable react/prop-types */

import InformationBar from '../../InformationBar';
import Sidebar from '../../Sidebar';

function DefaultLayout({ children }) {
    return (
        <>
            <div className="h-screen">
                <div className="container h-full mx-auto xl:px-30 max-w-6xl pt-2">
                    <div className="grid grid-cols-4 h-full">
                        <Sidebar />
                        <div className="col-span-3 lg:col-span-2 border-x-[1px] border-neutral-800">
                            {/* + Content: Chứa thông tin sản phẩm */}
                            {children}
                        </div>
                        <InformationBar />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DefaultLayout;
