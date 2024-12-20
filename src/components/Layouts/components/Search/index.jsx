import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { TiDelete } from 'react-icons/ti';
import { Wrapper as PopperWrapper } from '../../../Popper';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; // optional
import useDebounce from '../../../../hooks/custom/useDebounce';
import http from '../../../../utils/http';
import Avatar from '../../../Avatar';
function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [suggest, setSuggest] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const inputRef = useRef();
    const parentRef = useRef(null);
    const navigate = useNavigate();
    const handleGoBack = useCallback(() => {
        navigate(-1); // Return before page
    }, [navigate]);
    const debounce = useDebounce(searchValue, 800);
    const handleHideResult = () => {
        setShowResults(false);
    };
    const handleClear = () => {
        setSearchValue('');
        setSuggest([]);
        setShowResults(false);
        inputRef.current.blur();
    };
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn form reload
        if (!searchValue || searchValue === '') {
            navigate(`/api/explore`);
        } else navigate(`/api/explore?content=${searchValue}`);
        handleClear();
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await http.get(`/api/search/mentions?q=${debounce}&page=1&limit=6`);
                setSuggest(response.data.result.users);
            } catch (error) {
                setSuggest([]);
            }
        };
        fetchData();
    }, [debounce]);
    return (
        <div className="border-b-[1px] border-neutral-800 sticky top-0 z-[1] bg-white">
            <div className="flex items-center gap-3  p-3 relative w-full">
                <BiArrowBack onClick={handleGoBack} size={26} className="cursor-pointer hover:opacity-70 transition" />
                <HeadlessTippy
                    interactive
                    //
                    appendTo={() => parentRef.current}
                    //
                    visible={showResults}
                    // trigger="click"
                    placement="bottom-start"
                    // Attribute cho phep render ra popup voi dieu kien la
                    // visible
                    render={(attrs) => {
                        return (
                            <div
                                className="w-full min-w-full overflow-y-auto shadow-custom rounded-lg"
                                tabIndex="-1"
                                {...attrs}
                                style={{ width: `${parentRef.current.offsetWidth}px` }}
                            >
                                <div className=" max-h-96 bg-white">
                                    {suggest.length > 0 ? (
                                        suggest.map((result) => {
                                            // console.log(result);
                                            return (
                                                <Link
                                                    key={result._id}
                                                    to={`/api/user/profile?user_id=${result._id}`}
                                                    onClick={() => handleClear()}
                                                    className="p-3 flex items-center hover:no-underline hover:bg-gray-200 bg-white"
                                                >
                                                    <Avatar userId={result._id} />
                                                    <div className="ml-2 flex flex-col justify-center">
                                                        <p className="font-semibold text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap w-[200px] lg:w-full">
                                                            {result.name}
                                                        </p>
                                                        <p className="text-neutral-400 text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">
                                                            @{result.username}
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="p-3">
                                            <p className="font-semibold text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap ">
                                                Try searching for people, lists, or keywords
                                            </p>
                                        </div>
                                    )}
                                    {!!debounce && (
                                        <p
                                            className="p-3 cursor-pointer bg-white hover:text-sky-400 hover:font-semibold"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/api/explore?content=${debounce}`);
                                                handleClear();
                                            }}
                                        >
                                            Search for &#8220;{debounce}&#8221;
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    }}
                    onClickOutside={handleHideResult}
                >
                    <div
                        className={
                            'grow items-center gap-3 rounded-[2.625rem] py-[12px] px-3 bg-neutral3-70 bg-gray-200 flex'
                        }
                        ref={parentRef}
                    >
                        <BsSearch className="" />
                        <form onSubmit={handleSubmit} className="flex grow items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={'Search'}
                                className="focus:outline-none focus:placeholder:opacity-100 grow bg-transparent placeholder:text-tertiary text-sm font-inter font-normal"
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={() => setShowResults(true)}
                                value={searchValue}
                            />
                        </form>
                        {!!searchValue && (
                            <button onClick={handleClear} className="text-xs bg-sky-500font-semibold ">
                                <TiDelete color="#1DA1F2" size={20} className="" />
                            </button>
                        )}
                    </div>
                </HeadlessTippy>
            </div>
            <div className="flex justify-between overflow-x-auto ">
                {/* <div className="p-3 w-1/5 cursor-pointer hover:bg-gray-200 ">
                    <p className="text-center text-sm font-bold text-[rgb(83,100,113)]">For you</p>
                </div>
                <div className="p-3 w-1/5 cursor-pointer hover:bg-gray-200 ">
                    <p className="text-center text-sm font-semibold text-[rgb(83,100,113)]">Trending</p>
                </div>
                <div className="p-3 w-1/5 cursor-pointer hover:bg-gray-200 ">
                    <p className="text-center text-sm font-semibold text-[rgb(83,100,113)]">News</p>
                </div>
                <div className="p-3 w-1/5 cursor-pointer hover:bg-gray-200 ">
                    <p className="text-center text-sm font-semibold text-[rgb(83,100,113)]">Sports</p>
                </div>
                <div className="p-3 w-1/5 cursor-pointer hover:bg-gray-200 ">
                    <p className="text-center text-sm font-semibold text-[rgb(83,100,113)]">Entertainment</p>
                </div> */}
            </div>
        </div>
    );
}

export default Search;
