import images from '../../../assets/images';

/* eslint-disable react/prop-types */
function SinginSignup({ children }) {
    return (
        <div className="w-full min-h-screen relative flex flex-col lg:flex-row items-start bg-background lg:justify-end">
            {/* Left side */}
            <div className="w-full lg:w-1/2 h-full hidden lg:block bg-[#8BC4EF] fixed top-1/2 left-[25%] transform translate-x-[-50%] translate-y-[-50%] ">
                <div className="fixed top-1/2 left-[50%] transform translate-x-[-50%] translate-y-[-50%] w-full">
                    <img
                        src={images.twitter_wallpaper}
                        className="h-auto object-cover border-none outline-none"
                        alt="Twitter Wallpaper"
                    />
                </div>
            </div>
            {/* Right side */}
            <div className="w-full h-full lg:w-1/2 flex flex-col bg-background py-16">
                <div className="w-full flex justify-center mb-4">
                    <img src={images.logo} className="text-xl w-16 md:w-24" alt="Logo" />
                </div>
                <div className="h-3/4 flex justify-center mx-2">{children}</div>
            </div>
        </div>
    );
}

export default SinginSignup;
