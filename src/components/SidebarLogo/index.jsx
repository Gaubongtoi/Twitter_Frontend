import { BsTwitter } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
function SidebarLogo() {
    const navigate = useNavigate();
    return (
        <>
            <div
                onClick={() => {}}
                className="rounded-full h-30 w-20 p-4 flex items-center justify-center hover:bg-[#696a6b] hover:bg-opacity-10 cursor-pointer transition"
            >
                <BsTwitter size={30} color="#1DA1F2" />
            </div>
        </>
    );
}

export default SidebarLogo;
