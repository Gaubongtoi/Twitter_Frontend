import { useCallback, useState } from 'react';
import useCurrentUser from '../../hooks/auth/useCurrentUser';
import useTweets from '../../hooks/auth/useTweets';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import ButtonExpand from '../ButtonExpand';
import toast from 'react-hot-toast';
import http from '../../utils/http';
import useTweetDetail from '../../hooks/auth/useTweetDetail';
import useTweetChildren from '../../hooks/auth/useTweetChildren';
import { BsImage, BsEmojiSmile } from 'react-icons/bs';
import { AiOutlineFileGif } from 'react-icons/ai';
import { RiBarChart2Line } from 'react-icons/ri';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { RiCalendarScheduleLine } from 'react-icons/ri';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import useQuote from '../../hooks/modal/useQuote';
function Form({ placeholder, postId, tweet_type, isBBorder = true, onClose, user_id }) {
    const { data: currentUser } = useCurrentUser();
    const { mutate: mutateTweets } = useTweets();
    const { mutate: mutateTweetsOfMe } = useTweets(user_id);
    const { mutate: mutateTweetChildren } = useTweetChildren(postId);
    const { mutate: mutateTweetDetail } = useTweetDetail(postId);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showEmoji, setShowEmoji] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(selectedFiles.length > 2 ? selectedFiles.length - 2 : 0);
    const quoteModal = useQuote();
    // Hàm để điều chỉnh nút điều hướng lùi
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Hàm để điều chỉnh nút điều hướng tiến
    const handleNext = () => {
        if (currentIndex < selectedFiles.length - 2) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const [body, setBody] = useState('');
    const navigate = useNavigate();
    const addImageToPost = useCallback((e) => {
        try {
            const file = e?.target?.files[0];
            file.preview = URL.createObjectURL(file);
            setSelectedFiles((pre) => [...pre, file]);
        } catch (error) {
            console.log('Error: ' + error);
        }
    }, []);
    const addEmoji = useCallback((e) => {
        let sym = e.unified.split('-');
        let codesArray = [];
        sym.forEach((el) => codesArray.push('0x' + el));
        let emoji = String.fromCodePoint(...codesArray);
        setBody((prev) => prev + emoji);
    }, []);
    const onSubmit = useCallback(async () => {
        const formdata_imgs = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formdata_imgs.append('image', selectedFiles[i]);
        }
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const loadingToast = toast.loading('Waiting...');
        try {
            setIsLoading(true);
            await delay(import.meta.env.VITE_DELAY_REQUEST);
            // console.log(resPost);
            let res;
            if (selectedFiles.length > 0) {
                const resPost = await http.post(`/api/medias/upload-image`, formdata_imgs, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                let mediaPost = resPost?.data?.result?.map((img) => img.cloudinary_url);
                if (tweet_type) {
                    res = await http.post('/api/tweets', {
                        type: tweet_type,
                        audience: 0,
                        content: body,
                        parent_id: postId,
                        hashtags: [],
                        mentions: [],
                        medias: mediaPost,
                    });
                } else {
                    // console.log(mediaPost);
                    res = await http.post('/api/tweets', {
                        type: 0,
                        audience: 0,
                        content: body,
                        parent_id: null,
                        hashtags: [],
                        mentions: [],
                        medias: mediaPost,
                    });
                }
            } else {
                if (tweet_type) {
                    res = await http.post('/api/tweets', {
                        type: tweet_type,
                        audience: 0,
                        content: body,
                        parent_id: postId,
                        hashtags: [],
                        mentions: [],
                        medias: [],
                    });
                } else {
                    // console.log(mediaPost);
                    res = await http.post('/api/tweets', {
                        type: 0,
                        audience: 0,
                        content: body,
                        parent_id: null,
                        hashtags: [],
                        mentions: [],
                        medias: [],
                    });
                }
            }
            onClose && onClose();
            toast.success(`${res.data.message}`, {
                id: loadingToast,
            });
            quoteModal.onClose();
            setBody('');
            setSelectedFiles([]);
            mutateTweets();
            mutateTweetChildren();
            mutateTweetsOfMe();
            mutateTweetDetail();
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    }, [
        body,
        mutateTweets,
        mutateTweetChildren,
        mutateTweetDetail,
        postId,
        tweet_type,
        onClose,
        mutateTweetsOfMe,
        selectedFiles,
    ]);
    return (
        <div className={isBBorder ? 'border-b-[1px] border-neutral-800 px-3 py-2 relative' : 'px-3 py-2 relative'}>
            {currentUser ? (
                <>
                    <div className="flex flex-row gap-4">
                        <div>
                            <Avatar userId={currentUser?.result?._id} />
                        </div>
                        <div className="w-full">
                            <textarea
                                disabled={isLoading}
                                onChange={(e) => setBody(e.target.value)}
                                value={body}
                                className="disabled:opacity-80 peer resize-zone mt-2 w-full ring-0 outline-none text-[20px] placeholder-neutral-500"
                                placeholder={placeholder}
                            ></textarea>

                            <hr className="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />
                            {/* <div className="flex gap-8">
                                {Boolean(selectedFiles.length) &&
                                    selectedFiles.map((item, index) => (
                                        <div
                                            className={`${
                                                selectedFiles.length === 1
                                                    ? 'w-full'
                                                    : `w-1/${selectedFiles.length} h-[200px]`
                                            } relative rounded-3xl`}
                                            key={index}
                                        >
                                            <button
                                                onClick={() => {
                                                    URL.revokeObjectURL(selectedFiles[index]);
                                                    setSelectedFiles((e) => {
                                                        let arr = [...e];
                                                        return arr.filter((item2, index2) => {
                                                            return index2 !== index;
                                                        });
                                                    });
                                                }}
                                                className="absolute right-[12px] px-[11px] py-[3px] bg-slate-600 rounded-full top-[12px] text-white"
                                            >
                                                X
                                            </button>
                                            <img
                                                src={item.preview}
                                                className="object-cover w-full h-full rounded-3xl"
                                            />
                                        </div>
                                    ))}
                            </div> */}
                            <div className="relative flex items-center">
                                {/* Nút điều hướng trái */}
                                {selectedFiles.length > 2 && (
                                    <button
                                        className="absolute left-0 bg-gray-800 text-white p-2 rounded-full z-10 cursor-pointer"
                                        onClick={handlePrev}
                                        disabled={currentIndex === 0} // Disable nếu đang ở đầu danh sách
                                    >
                                        <FaChevronLeft />
                                    </button>
                                )}

                                {/* Container carousel */}
                                <div className="overflow-hidden w-full pr-10">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{
                                            transform: `translateX(-${(currentIndex * 100) / 2}%)`, // Tính toán để di chuyển theo currentIndex và kích thước của mỗi ảnh (hiển thị 2 ảnh)
                                        }}
                                    >
                                        {/* Render từng ảnh trong carousel */}
                                        {selectedFiles.map((item, index) => (
                                            <div
                                                className={`${
                                                    selectedFiles.length === 1
                                                        ? 'w-full'
                                                        : `w-1/2 h-1/2  mx-2 rounded-3xl flex-shrink-0`
                                                } relative`} // Kích thước mỗi ảnh dựa trên số lượng
                                                key={index}
                                            >
                                                {/* Nút xóa cho từng ảnh */}
                                                <button
                                                    onClick={() => {
                                                        URL.revokeObjectURL(selectedFiles[index]);
                                                        setSelectedFiles((prev) => {
                                                            const updatedFiles = [...prev];
                                                            return updatedFiles.filter((_, idx) => idx !== index);
                                                        });
                                                        handlePrev();
                                                    }}
                                                    className="absolute right-[12px] px-[11px] py-[3px] bg-slate-600 rounded-full top-[12px] text-white z-20"
                                                >
                                                    X
                                                </button>
                                                {/* Ảnh */}
                                                <img
                                                    src={item.preview}
                                                    className="object-cover w-full h-full rounded-3xl"
                                                    alt={`Preview ${index}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Nút điều hướng phải */}
                                {selectedFiles.length > 2 && (
                                    <button
                                        className="absolute right-0 bg-gray-800 text-white p-2 rounded-full z-10 cursor-pointer"
                                        onClick={handleNext}
                                        disabled={currentIndex >= selectedFiles.length - 2} // Disable nếu đang ở cuối danh sách
                                    >
                                        <FaChevronRight />
                                    </button>
                                )}
                            </div>
                            <div className="mt-3 flex flex-row justify-end ">
                                <ButtonExpand
                                    label="Tweet"
                                    disabled={isLoading || (!body && selectedFiles.length <= 0)}
                                    onClick={onSubmit}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 flex gap-4">
                        <div className=" text-primary flex gap-4">
                            <Tippy delay={[0, 50]} content="Media" placement="bottom">
                                {selectedFiles.length >= 4 ? (
                                    <label>
                                        <BsImage className="cursor-pointer" size={20} color="#6FB3FF" />
                                    </label>
                                ) : (
                                    <label htmlFor="file">
                                        <BsImage className="cursor-pointer" size={20} />
                                    </label>
                                )}
                            </Tippy>
                            <input type="file" id="file" hidden onChange={addImageToPost} />
                            <Tippy delay={[0, 50]} content="GIF" placement="bottom">
                                <label>
                                    <AiOutlineFileGif className="cursor-pointer" size={20} />
                                </label>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Poll" placement="bottom">
                                <label>
                                    <RiBarChart2Line className="cursor-pointer" size={20} />
                                </label>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Emoji" placement="bottom">
                                <label>
                                    <BsEmojiSmile
                                        className="cursor-pointer"
                                        size={20}
                                        onClick={() => setShowEmoji((prev) => !prev)}
                                    />
                                </label>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Poll" placement="bottom">
                                <label className="lg:block hidden">
                                    <RiCalendarScheduleLine className="cursor-pointer" size={20} />
                                </label>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Location" placement="bottom">
                                <label className="lg:block hidden">
                                    <HiOutlineLocationMarker className="cursor-pointer" size={20} />
                                </label>
                            </Tippy>
                        </div>
                        {showEmoji && (
                            <div className="absolute mt-[10px] -ml-[40px] max-w-[320px] rounded-[20px] z-20 top-7">
                                <Picker data={data} theme="light" onEmojiSelect={addEmoji} />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="py-8">
                    <h1 className="text-2xl text-center mb-4 font-bold">Welcome to Twitter</h1>
                    <div className="flex flex-row items-center justify-center gap-4">
                        <Button
                            primary
                            rounded
                            onClick={() => {
                                navigate('/signin');
                            }}
                        >
                            Signin
                        </Button>
                        <Button
                            secondary
                            rounded
                            onClick={() => {
                                navigate('/signup');
                            }}
                        >
                            Signup
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Form;
