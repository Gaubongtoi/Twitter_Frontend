import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginNoti from '../../hooks/modal/useLoginNoti';
import useLoginState from '../../hooks/state/useLoginState';

/* eslint-disable react/prop-types */
function SidebarItem({ href, label, icon, onClick, auth }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useLoginState();
    const loginModal = useLoginNoti();
    const handleClick = useCallback(() => {
        if (onClick) {
            return onClick();
        }
        if (auth && !isLoggedIn) {
            loginModal.onOpen();
        } else if (href) {
            navigate(href);
        }
    }, [onClick, href, navigate, auth, loginModal, isLoggedIn]);
    return (
        <div className="flex flex-row items-center" onClick={handleClick}>
            <div className="relative rounded-full h-26 w-26 flex items-center hover:bg-[#696a6b] hover:bg-opacity-10 justify-center p-4 cursor-pointer lg:hidden">
                {icon}
            </div>
            <div className="relative hidden lg:flex items-center gap-4 p-4 rounded-full hover:bg-[#696a6b] hover:bg-opacity-10 cursor-pointer">
                {icon}
                <p className="hidden lg:block text-black text-xl font-semibold">{label}</p>
            </div>
        </div>
    );
}

export default SidebarItem;
