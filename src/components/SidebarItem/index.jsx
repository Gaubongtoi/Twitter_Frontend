import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginNoti from '../../hooks/modal/useLoginNoti';
import useLoginState from '../../hooks/state/useLoginState';

/* eslint-disable react/prop-types */
function SidebarItem({ href, label, icon: Icon, onClick, auth, active }) {
    const navigate = useNavigate();
    // console.log(active);

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
            <div
                className={`relative rounded-full h-26 w-26 flex items-center ${
                    active === label && 'bg-[#696a6b] bg-opacity-10'
                } hover:bg-[#696a6b] hover:bg-opacity-10 justify-center p-4 cursor-pointer lg:hidden font-bold`}
            >
                {active === label ? <Icon size={26} color="#1A8CCF" /> : <Icon size={26} />}
            </div>
            <div
                className={`relative hidden lg:flex items-center ${
                    active === label && 'bg-[#696a6b] bg-opacity-10'
                } gap-4 p-4 rounded-full hover:bg-[#696a6b] hover:bg-opacity-10 cursor-pointer `}
            >
                {active === label ? <Icon size={26} color="#1A8CCF" /> : <Icon size={26} />}

                <p
                    className={`hidden lg:block text-black text-xl ${
                        active === label ? 'font-bold text-primary_lighten' : 'font-semibold'
                    }`}
                >
                    {label}
                </p>
            </div>
        </div>
    );
}

export default SidebarItem;
