import { useCallback } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

function Header({ label, showBackArrow }) {
    const navigate = useNavigate();
    const handleGoBack = useCallback(() => {
        navigate(-1); // Return before page
    }, [navigate]);
    return (
        <div className="border-b-[1px] border-neutral-800 p-3">
            <div className="flex flex-row items-center gap-2">
                {showBackArrow && (
                    <BiArrowBack
                        onClick={handleGoBack}
                        size={26}
                        className="cursor-pointer hover:opacity-70 transition"
                    />
                )}
                <h1 className="text-xl font-semibold">{label}</h1>
            </div>
        </div>
    );
}

export default Header;
